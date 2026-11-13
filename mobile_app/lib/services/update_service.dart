import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import '../data/site.dart';
import 'apk_installer.dart';

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
  /// Nothing started yet (or cancelled).
  idle,

  /// The APK is downloading inside the app.
  downloading,

  /// Checking the downloaded file before installing it.
  verifying,

  /// Android needs "Install unknown apps" allowed for this app first.
  needsPermission,

  /// Android's installer was opened; the user taps Install there.
  installing,

  /// Something went wrong — see [UpdateService.downloadError].
  failed,
}

class UpdateService extends ChangeNotifier {
  UpdateService({bool autoCheck = true}) {
    if (autoCheck) {
      _removeOldDownloads();
      checkForUpdate();
    }
  }

  bool _isChecking = false;
  bool get isChecking => _isChecking;

  bool _hasUpdate = false;
  bool get hasUpdate => _hasUpdate;

  AppUpdateInfo? _latest;
  AppUpdateInfo? get latest => _latest;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  String get currentVersion => Site.appVersion;
  int get currentBuild => Site.buildNumber;

  DateTime? _lastChecked;

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
          final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 10));
          if (res.statusCode == 200) {
            data = jsonDecode(res.body) as Map<String, dynamic>;
            break;
          }
        } catch (_) {}
      }

      if (data == null) {
        try {
          final res = await http.get(
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
      }
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isChecking = false;
      notifyListeners();
    }
  }

  // ---------------------------------------------------------------------------
  // In-app download & install (Android)
  // ---------------------------------------------------------------------------

  /// Whether the update can be downloaded and installed inside the app.
  /// When false, the update is opened in the browser instead.
  bool get canUpdateInApp => ApkInstaller.isSupported && !_inAppUnsupported;
  bool _inAppUnsupported = false;

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

  /// True while something is happening that the UI should show (download/check/install).
  bool get isBusy => _phase == UpdatePhase.downloading || _phase == UpdatePhase.verifying;

  String? _apkPath; // downloaded and checked APK, ready for the installer
  int? _apkBuild; // which build that APK is
  http.Client? _client;
  bool _cancelled = false;

  void _setPhase(UpdatePhase phase, {String? error}) {
    _phase = phase;
    _downloadError = error;
    notifyListeners();
  }

  /// Downloads the latest APK inside the app, checks it, and opens Android's
  /// installer. Safe to call again: resumes at the right step (e.g. opens the
  /// installer straight away if the APK is already downloaded).
  Future<void> downloadAndInstall() async {
    final info = _latest;
    if (info == null || !canUpdateInApp || isBusy) return;

    final ready = _apkPath;
    if (ready != null && _apkBuild == info.buildNumber && File(ready).existsSync()) {
      await _openInstaller();
      return;
    }

    _cancelled = false;
    _received = 0;
    _total = info.apkSize;
    _setPhase(UpdatePhase.downloading);

    final client = _client = http.Client();
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

      await _openInstaller();
    } catch (error) {
      if (_cancelled) return; // cancel() already reset the state
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

  /// Stops a download in progress.
  void cancelDownload() {
    if (_phase != UpdatePhase.downloading) return;
    _cancelled = true;
    _client?.close();
    _received = 0;
    _setPhase(UpdatePhase.idle);
  }

  /// Opens the system screen to allow installs from this app.
  Future<void> openInstallPermission() async {
    try {
      await ApkInstaller.openInstallSettings();
    } catch (_) {}
  }

  /// Called when the app comes back to the foreground: continues the install
  /// once the user has allowed it in Settings.
  Future<void> onAppResumed() async {
    if (_phase == UpdatePhase.needsPermission && await ApkInstaller.canInstall()) {
      await _openInstaller();
    }
  }

  Future<void> _openInstaller() async {
    final path = _apkPath;
    if (path == null) return;
    try {
      if (!await ApkInstaller.canInstall()) {
        _setPhase(UpdatePhase.needsPermission);
        return;
      }
      await ApkInstaller.install(path);
      // Android's installer is now on screen. If it's dismissed, "Install" opens it again.
      _setPhase(UpdatePhase.installing);
    } on PlatformException catch (e) {
      if (e.code == 'UNSUPPORTED') {
        _inAppUnsupported = true; // Android 6 or older: use the browser instead
        _setPhase(UpdatePhase.idle);
      } else {
        _setPhase(UpdatePhase.failed, error: 'Android could not open the installer. Please try again.');
      }
    }
  }

  /// Deletes update APKs left over from earlier downloads (after updating, they're useless).
  Future<void> _removeOldDownloads() async {
    if (!ApkInstaller.isSupported) return;
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

  @override
  void dispose() {
    _client?.close();
    super.dispose();
  }
}

class _UpdateFailure implements Exception {
  _UpdateFailure(this.message);
  final String message;
  @override
  String toString() => message;
}
