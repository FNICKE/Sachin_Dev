import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../data/site.dart';

class AppUpdateInfo {
  final String version;
  final int buildNumber;
  final String apkUrl;
  final String releaseNotes;
  final String publishedAt;

  const AppUpdateInfo({
    required this.version,
    required this.buildNumber,
    required this.apkUrl,
    this.releaseNotes = '',
    this.publishedAt = '',
  });

  factory AppUpdateInfo.fromJson(Map<String, dynamic> json) {
    return AppUpdateInfo(
      version: json['version']?.toString() ?? '1.0.0',
      buildNumber: (json['build_number'] as num?)?.toInt() ?? 0,
      apkUrl: json['apk_url']?.toString() ?? Site.apkDownloadUrl,
      releaseNotes: json['release_notes']?.toString() ?? '',
      publishedAt: json['published_at']?.toString() ?? '',
    );
  }
}

class UpdateService extends ChangeNotifier {
  UpdateService() {
    checkForUpdate();
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
}
