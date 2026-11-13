import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Talks to MainActivity.kt to install a downloaded update APK.
/// Only works in the Android app; everywhere else [isSupported] is false and
/// the update is opened in the browser instead.
class ApkInstaller {
  ApkInstaller._();

  static const _channel = MethodChannel('dev.sachin.app/updater');

  static bool get isSupported => !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  /// Folder inside the app's cache where updates are downloaded.
  static Future<String> updateDir() async => (await _channel.invokeMethod<String>('updateDir'))!;

  /// Whether Android lets this app open the installer ("Install unknown apps").
  static Future<bool> canInstall() async => await _channel.invokeMethod<bool>('canInstall') ?? false;

  /// Opens the system screen where "Allow from this source" is switched on.
  static Future<void> openInstallSettings() => _channel.invokeMethod('openInstallSettings');

  /// SHA-256 (lower-case hex) of the file, or null if it can't be read.
  static Future<String?> sha256(String path) => _channel.invokeMethod<String>('sha256', {'path': path});

  /// Opens Android's installer for the APK. Throws a [PlatformException] with
  /// code UNSUPPORTED on Android 6 and older.
  static Future<void> install(String path) => _channel.invokeMethod('install', {'path': path});
}
