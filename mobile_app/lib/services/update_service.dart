import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import '../data/site.dart';
import 'apk_installer.dart';
import 'notification_service.dart';

class AppUpdateInfo {
  final String version;
  final int buildNumber;
  final String apkUrl;
  final String releaseNotes;
  final String publishedAt;

  /// SHA-256 of the APK (added by GitHub Actions); empty for older releases.
  final String sha256;

  /// Size of the APK in bytes; 0 if unknown.
  final int apkSize;

  const AppUpdateInfo({
    required this.version,
    required this.buildNumber,
    required this.apkUrl,
    this.releaseNotes = '',
    this.publishedAt = '',
    this.sha256 = '',
    this.apkSize = 0,
  });

  factory AppUpdateInfo.fromJson(Map<String, dynamic> json) {
    return AppUpdateInfo(
      version: json['version']?.toString() ?? '1.0.0',
      buildNumber: (json['build_number'] as num?)?.toInt() ?? 0,
      apkUrl: json['apk_url']?.toString() ?? Site.apkDownloadUrl,
      releaseNotes: json['release_notes']?.toString() ?? '',
      publishedAt: json['published_at']?.toString() ?? '',
      sha256: json['sha256']?.toString().toLowerCase() ?? '',
      apkSize: (json['apk_size'] as num?)?.toInt() ?? 0,
    );
  }
}

/// Where an in-app update is.
enum UpdatePhase {
  /// Nothing started yet (on mobile data the user is asked first).
  idle,

  /// The APK is downloading inside the app.
  downloading,

  /// Checking the downloaded file before installing it.
  verifying,

  /// Downloaded and checked; installs when the user taps "Update now" or leaves the app.
  ready,

  /// Android needs "Install unknown apps" allowed for this app first.
  needsPermission,

  /// Installing: either by itself (Android 12+) or on Android's "Install" screen.
  installing,

  /// Something went wrong — see [UpdateService.downloadError].
  failed,
}

class UpdateService extends ChangeNotifier {
  UpdateService({
    bool autoCheck = true,
    http.Client Function()? httpClient,
    @visibleForTesting int? currentBuildOverride,
  })  : _newClient = httpClient ?? http.Client.new,
        _currentBuildOverride = currentBuildOverride {
    if (autoCheck) _start();
  }

  Future<void> _start() async {
    if (ApkInstaller.isSupported) {
      _statusSubscription = ApkInstaller.statuses.listen(handleInstallStatus);
      // Leftovers first, so this can never delete a download that has just started.
      await _removeOldDownloads();
    }
    await checkForUpdate();
  }

  final http.Client Function() _newClient;
  final int? _currentBuildOverride;
  StreamSubscription<InstallStatus>? _statusSubscription;

  bool _isChecking = false;
  bool get isChecking => _isChecking;

  bool _hasUpdate = false;
  bool get hasUpdate => _hasUpdate;

  AppUpdateInfo? _latest;
  AppUpdateInfo? get latest => _latest;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  String get currentVersion => Site.appVersion;
  int get currentBuild => _currentBuildOverride ?? Site.buildNumber;

  DateTime? _lastChecked;

  /// Build number we've already shown an "update available" notification for.
  /// Stops the notification from firing again on every re-check in the same session.
  int? _notifiedBuild;

  /// Re-checks if the last check is older than [maxAge] (used when the app comes back to the foreground).
  Future<void> checkIfStale({Duration maxAge = const Duration(minutes: 10)}) async {
    final last = _lastChecked;
    if (_isChecking || (last != null && DateTime.now().difference(last) < maxAge)) return;
    await checkForUpdate();
  }

  Future<void> checkForUpdate() async {
    _isChecking = true;
    _errorMessage = null;
    _lastChecked = DateTime.now();
    notifyListeners();

    final client = _newClient();
    try {
      // The release's version.json is rewritten by GitHub Actions on every build, so it is
      // always current. (mobile_app/version.json in the repo is NOT updated by CI — it only
      // exists so apps built before this fix can still discover new versions.)
      final cacheBust = DateTime.now().millisecondsSinceEpoch;
      final endpoints = [
        'https://github.com/FNICKE/Sachin_Dev/releases/download/mobile-latest/version.json?t=$cacheBust',
      ];

      Map<String, dynamic>? data;
      for (final url in endpoints) {
        try {
          final res = await client.get(Uri.parse(url)).timeout(const Duration(seconds: 10));
          if (res.statusCode == 200) {
            data = jsonDecode(res.body) as Map<String, dynamic>;
            break;
          }
        } catch (_) {}
      }

      if (data == null) {
        try {
          final res = await client.get(
            Uri.parse('https://api.github.com/repos/FNICKE/Sachin_Dev/releases/tags/mobile-latest'),
            headers: {'Accept': 'application/vnd.github.v3+json'},
          ).timeout(const Duration(seconds: 10));
          if (res.statusCode == 200) {
            final gh = jsonDecode(res.body) as Map<String, dynamic>;
            final name = gh['name']?.toString() ?? '';
            final match = RegExp(r'v?(\d+\.\d+\.?\d*)').firstMatch(name);
            final ver = match?.group(1) ?? '1.0.0';
            final build = int.tryParse(ver.split('.').last) ?? 0;
            data = {
              'version': ver,
              'build_number': build,
              'apk_url': Site.apkDownloadUrl,
              'release_notes': gh['body']?.toString() ?? '',
              'published_at': gh['published_at']?.toString() ?? '',
            };
          }
        } catch (_) {}
      }

      if (data != null) {
        final info = AppUpdateInfo.fromJson(data);
        _latest = info;
        // Local development builds (build 0) never show the update prompt.
        _hasUpdate = currentBuild > 0 && info.buildNumber > currentBuild;
        if (_hasUpdate && _notifiedBuild != info.buildNumber) {
          _notifiedBuild = info.buildNumber;
          unawaited(NotificationService.instance.showUpdateAvailable(
            version: info.version,
            releaseNotes: info.releaseNotes,
          ));
        }
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      client.close();
      _isChecking = false;
      notifyListeners();
    }

    await _maybeDownloadAutomatically();
  }

  // ---------------------------------------------------------------------------
  // In-app download & install (Android)
  // ---------------------------------------------------------------------------

  /// Whether the update can be downloaded and installed inside the app.
  /// When false, the update is opened in the browser instead.
  bool get canUpdateInApp => ApkInstaller.isSupported;

  UpdatePhase _phase = UpdatePhase.idle;
  UpdatePhase get phase => _phase;

  int _received = 0;
  int _total = 0;

  /// Bytes downloaded so far / total bytes (0 if the server didn't say).
  int get receivedBytes => _received;
  int get totalBytes => _total;

  /// 0–1 while downloading, or null if the total size is unknown.
  double? get progress => _total > 0 ? (_received / _total).clamp(0.0, 1.0) : null;

  String? _downloadError;
  String? get downloadError => _downloadError;

  /// True while downloading or checking the file.
  bool get isBusy => _phase == UpdatePhase.downloading || _phase == UpdatePhase.verifying;

  /// Whether the download started by itself (Wi-Fi) rather than from a tap.
  bool get startedAutomatically => _automatic;

  /// Android 12+ with installs allowed: the update installs without Android's screen
  /// (the app closes for a moment). Known once the update is downloaded.
  bool get installsSilently => _installsSilently;
  bool _installsSilently = false;

  /// While installing: Android's "Install" screen is (or was) shown to the user.
  bool get waitingForConfirmation => _waitingForConfirmation;
  bool _waitingForConfirmation = false;

  String? _apkPath; // downloaded and checked APK, ready for the installer
  int? _apkBuild; // which build that APK is
  http.Client? _client;
  bool _cancelled = false;
  bool _automatic = false;
  bool _autoDeclined = false; // the user cancelled — don't start again by itself this session

  void _setPhase(UpdatePhase phase, {String? error}) {
    _phase = phase;
    _downloadError = error;
    notifyListeners();
  }

  /// Starts the download by itself on Wi-Fi (or always, if Site.autoDownloadOnMobileData).
  Future<void> _maybeDownloadAutomatically() async {
    if (!_hasUpdate || !canUpdateInApp || _autoDeclined || _phase != UpdatePhase.idle) return;
    try {
      if (!Site.autoDownloadOnMobileData && !await ApkInstaller.isUnmetered()) return;
    } catch (_) {
      return;
    }
    await downloadAndInstall(automatic: true);
  }

  /// Downloads the latest APK inside the app and checks it.
  /// - From a tap ([automatic] false): installs straight away.
  /// - By itself ([automatic] true): waits in [UpdatePhase.ready] until the user taps
  ///   "Update now" or leaves the app, so the app never closes while it's being used.
  /// Safe to call again: continues at the right step.
  Future<void> downloadAndInstall({bool automatic = false}) async {
    final info = _latest;
    if (info == null || !canUpdateInApp || isBusy) return;

    final ready = _apkPath;
    if (ready != null && _apkBuild == info.buildNumber && File(ready).existsSync()) {
      if (!automatic) await installNow();
      return;
    }

    _automatic = automatic;
    _cancelled = false;
    _received = 0;
    _total = info.apkSize;
    _setPhase(UpdatePhase.downloading);

    final client = _client = _newClient();
    try {
      final dir = await ApkInstaller.updateDir();
      await _clearFolder(dir);
      final apk = File('$dir/sachin-dev-v${info.version}.apk');
      final part = File('${apk.path}.part');

      final response = await client
          .send(http.Request('GET', Uri.parse(info.apkUrl.isNotEmpty ? info.apkUrl : Site.apkDownloadUrl)))
          .timeout(const Duration(seconds: 30));
      if (response.statusCode != 200) {
        throw _UpdateFailure('The download server answered ${response.statusCode}. Please try again in a minute.');
      }
      if ((response.contentLength ?? 0) > 0) _total = response.contentLength!;

      final sink = part.openWrite();
      var lastUpdate = DateTime.now();
      try {
        // A stalled connection (no data for 30s) fails instead of hanging forever.
        await for (final chunk in response.stream.timeout(const Duration(seconds: 30))) {
          if (_cancelled) break;
          sink.add(chunk);
          _received += chunk.length;
          final now = DateTime.now();
          if (now.difference(lastUpdate).inMilliseconds >= 120) {
            lastUpdate = now;
            notifyListeners();
          }
        }
        await sink.flush();
      } finally {
        await sink.close();
      }
      if (_cancelled) return;
      if (_total > 0 && _received != _total) {
        throw _UpdateFailure('The download was interrupted. Please try again.');
      }

      _setPhase(UpdatePhase.verifying);
      if (info.sha256.isNotEmpty) {
        final hash = await ApkInstaller.sha256(part.path);
        if (hash != info.sha256) {
          await part.delete().catchError((_) => part);
          throw _UpdateFailure('The downloaded file was damaged. Please try again.');
        }
      }
      await part.rename(apk.path);
      _apkPath = apk.path;
      _apkBuild = info.buildNumber;
      _installsSilently = await _canInstallSilently();

      if (automatic) {
        _setPhase(UpdatePhase.ready);
      } else {
        await installNow();
      }
    } catch (error) {
      if (_cancelled) return; // cancelDownload() already reset the state
      debugPrint('In-app update failed: $error');
      _setPhase(
        UpdatePhase.failed,
        error: error is _UpdateFailure
            ? error.message
            : error is TimeoutException || error is SocketException || error is http.ClientException
                ? 'No connection to the download server. Check your internet and try again.'
                : 'The update could not be downloaded. Please try again.',
      );
    } finally {
      client.close();
      if (identical(_client, client)) _client = null;
    }
  }

  /// Stops a download in progress (and doesn't restart it by itself this session).
  void cancelDownload() {
    if (_phase != UpdatePhase.downloading) return;
    _cancelled = true;
    _autoDeclined = true;
    _client?.close();
    _received = 0;
    _setPhase(UpdatePhase.idle);
  }

  /// Installs the downloaded update now. On Android 12+ the app closes for a
  /// moment and updates itself; otherwise Android's "Install" screen opens.
  Future<void> installNow() => _install(background: false);

  /// Opens the system screen to allow installs from this app.
  Future<void> openInstallPermission() async {
    try {
      await ApkInstaller.openInstallSettings();
    } catch (_) {}
  }

  /// The app came back to the foreground: continue once installs are allowed.
  Future<void> onAppResumed() async {
    if (_phase == UpdatePhase.needsPermission && await ApkInstaller.canInstall()) {
      await installNow();
    }
  }

  /// The user left the app: a downloaded update installs quietly now (Android 12+),
  /// like the Play Store does — the next time the app opens, it's the new version.
  Future<void> onAppPaused() async {
    if (_phase != UpdatePhase.ready) return;
    if (await _canInstallSilently()) await _install(background: true);
  }

  Future<bool> _canInstallSilently() async {
    try {
      return await ApkInstaller.canInstallSilently();
    } catch (_) {
      return false;
    }
  }

  Future<void> _install({required bool background}) async {
    final path = _apkPath;
    // While a silent install runs, don't start another; Android's own screen may be reopened.
    if (path == null || (_phase == UpdatePhase.installing && !_waitingForConfirmation)) return;
    try {
      if (!await ApkInstaller.canInstall()) {
        if (!background) _setPhase(UpdatePhase.needsPermission);
        return;
      }
      _installsSilently = await _canInstallSilently();
      _waitingForConfirmation = false;
      _setPhase(UpdatePhase.installing);
      unawaited(NotificationService.instance.cancelUpdateAvailable());
      final how = await ApkInstaller.install(path, background: background);
      if (how == 'viewer') {
        _waitingForConfirmation = true;
        notifyListeners();
      }
    } on PlatformException catch (e) {
      debugPrint('Install failed: ${e.message}');
      if (background) {
        _setPhase(UpdatePhase.ready); // try again from the pop-up
      } else {
        _setPhase(UpdatePhase.failed, error: 'Android could not install the update. Please try again.');
      }
    }
  }

  /// Handles PackageInstaller's result for the install started by [_install].
  @visibleForTesting
  void handleInstallStatus(InstallStatus status) {
    switch (status.code) {
      case ApkInstaller.statusPendingUserAction:
        // Android shows its "Install" screen (older Android, or it decided to ask).
        _waitingForConfirmation = true;
        _setPhase(UpdatePhase.installing);
      case ApkInstaller.statusSuccess:
        // The app is replaced and closes by itself; nothing to do.
        break;
      case ApkInstaller.statusAborted:
        // The user cancelled Android's screen — keep the download for later.
        _setPhase(UpdatePhase.ready);
      default:
        debugPrint('Install status ${status.code}: ${status.message}');
        _setPhase(UpdatePhase.failed, error: switch (status.code) {
          ApkInstaller.statusStorage => 'Not enough free space on the phone to install the update.',
          ApkInstaller.statusConflict || ApkInstaller.statusInvalid || ApkInstaller.statusIncompatible =>
            "Android couldn't install this update over the app on your phone. Try \"Use browser\".",
          ApkInstaller.statusBlocked => 'Android blocked the install. Check "Install unknown apps" for this app.',
          _ => "Android couldn't install the update. Please try again.",
        });
    }
  }

  /// Deletes update APKs left over from earlier downloads (after updating, they're useless).
  Future<void> _removeOldDownloads() async {
    try {
      await _clearFolder(await ApkInstaller.updateDir());
    } catch (_) {}
  }

  static Future<void> _clearFolder(String path) async {
    final dir = Directory(path);
    if (!await dir.exists()) return;
    await for (final entity in dir.list()) {
      try {
        await entity.delete(recursive: true);
      } catch (_) {}
    }
  }

  bool _disposed = false;

  // A download or check that is still finishing must not touch a disposed service.
  @override
  void notifyListeners() {
    if (!_disposed) super.notifyListeners();
  }

  @override
  void dispose() {
    _disposed = true;
    _cancelled = true;
    _client?.close();
    _statusSubscription?.cancel();
    super.dispose();
  }
}

class _UpdateFailure implements Exception {
  _UpdateFailure(this.message);
  final String message;
  @override
  String toString() => message;
}
