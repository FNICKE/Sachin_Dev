import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// A result from Android's PackageInstaller for an in-app update.
class InstallStatus {
  const InstallStatus(this.code, [this.message]);

  /// PackageInstaller.STATUS_* (see the constants on [ApkInstaller]).
  final int code;
  final String? message;
}

/// Talks to MainActivity.kt to install a downloaded update APK.
/// Only works in the Android app; everywhere else [isSupported] is false and
/// the update is opened in the browser instead.
class ApkInstaller {
  ApkInstaller._();

  static const _channel = MethodChannel('dev.sachin.app/updater');

  // PackageInstaller.STATUS_* values.
  static const statusPendingUserAction = -1;
  static const statusSuccess = 0;
  static const statusFailure = 1;
  static const statusBlocked = 2;
  static const statusAborted = 3; // the user cancelled Android's install screen
  static const statusInvalid = 4;
  static const statusConflict = 5;
  static const statusStorage = 6;
  static const statusIncompatible = 7;

  static bool get isSupported => !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  static final _statuses = StreamController<InstallStatus>.broadcast();
  static bool _listening = false;

  /// Install results reported by Android (after [install] returned "session").
  static Stream<InstallStatus> get statuses {
    if (!_listening) {
      _listening = true;
      _channel.setMethodCallHandler((call) async {
        if (call.method == 'installStatus') {
          final args = Map<Object?, Object?>.from(call.arguments as Map);
          _statuses.add(InstallStatus((args['status'] as num?)?.toInt() ?? statusFailure, args['message'] as String?));
        }
        return null;
      });
    }
    return _statuses.stream;
  }

  /// Folder inside the app's cache where updates are downloaded.
  static Future<String> updateDir() async => (await _channel.invokeMethod<String>('updateDir'))!;

  /// Whether Android lets this app install updates ("Install unknown apps").
  static Future<bool> canInstall() async => await _channel.invokeMethod<bool>('canInstall') ?? false;

  /// Whether the update can be installed without Android's "Install" screen (Android 12+).
  static Future<bool> canInstallSilently() async =>
      await _channel.invokeMethod<bool>('canInstallSilently') ?? false;

  /// Whether the phone is on Wi-Fi (or another connection without data limits).
  static Future<bool> isUnmetered() async => await _channel.invokeMethod<bool>('isUnmetered') ?? false;

  /// Opens the system screen where "Allow from this source" is switched on.
  static Future<void> openInstallSettings() => _channel.invokeMethod('openInstallSettings');

  /// SHA-256 (lower-case hex) of the file, or null if it can't be read.
  static Future<String?> sha256(String path) => _channel.invokeMethod<String>('sha256', {'path': path});

  /// Installs the APK. Returns "session" (the result arrives on [statuses]) or
  /// "viewer" (Android's install screen was opened). With [background] the
  /// install screen is never opened (not allowed while the app is hidden).
  static Future<String> install(String path, {bool background = false}) async =>
      await _channel.invokeMethod<String>('install', {'path': path, 'background': background}) ?? 'session';
}
