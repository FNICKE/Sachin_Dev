import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// Update alerts ("notifications A").
///
/// The alert itself is native (UpdateCheckWorker.kt): about twice a day, even
/// when the app is closed, Android checks GitHub for a newer version and shows
/// "Update available". Tapping it opens the app, whose update pop-up downloads
/// and installs it. This class only talks to that native side.
///
/// Not used in the Google Play build (Play updates the app itself), and a
/// no-op on platforms other than Android.
class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  static const _channel = MethodChannel('dev.sachin.app/updater');

  bool get _isAndroid => !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  /// Starts the background update checks and, on Android 13+, asks once for
  /// permission to show notifications (after the app has had a moment to open).
  Future<void> init() async {
    if (!_isAndroid) return;
    try {
      await _channel.invokeMethod('startUpdateAlerts');
    } catch (e) {
      debugPrint('Update alerts unavailable: $e');
    }
  }

  /// Removes the "Update available" notification (the update is being installed).
  Future<void> cancelUpdateAvailable() async {
    if (!_isAndroid) return;
    try {
      await _channel.invokeMethod('clearUpdateAlert');
    } catch (_) {}
  }
}
