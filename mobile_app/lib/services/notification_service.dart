import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// Shows Android notifications from the app.
/// On non-Android platforms every method is a no-op.
class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  final FlutterLocalNotificationsPlugin _plugin = FlutterLocalNotificationsPlugin();
  bool _initialized = false;

  static const String _updateChannelId = 'app_updates';
  static const String _updateChannelName = 'App updates';
  static const String _updateChannelDescription =
      'Tells you when a new version of the app is available.';
  static const int _updateNotificationId = 1001;

  bool get _isAndroid =>
      !kIsWeb && defaultTargetPlatform == TargetPlatform.android;

  Future<void> init() async {
    if (_initialized || !_isAndroid) return;

    const settings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
    );
    await _plugin.initialize(settings);

    final android = _plugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();
    await android?.createNotificationChannel(const AndroidNotificationChannel(
      _updateChannelId,
      _updateChannelName,
      description: _updateChannelDescription,
      importance: Importance.defaultImportance,
    ));
    // Android 13+ shows a system prompt the first time.
    await android?.requestNotificationsPermission();

    _initialized = true;
  }

  Future<void> showUpdateAvailable({
    required String version,
    String releaseNotes = '',
  }) async {
    if (!_isAndroid) return;
    if (!_initialized) await init();

    final body = releaseNotes.trim().isNotEmpty
        ? releaseNotes.trim()
        : 'Version $version is ready. Tap to open the app and install it.';

    await _plugin.show(
      _updateNotificationId,
      'Update available',
      body,
      NotificationDetails(
        android: AndroidNotificationDetails(
          _updateChannelId,
          _updateChannelName,
          channelDescription: _updateChannelDescription,
          importance: Importance.defaultImportance,
          priority: Priority.defaultPriority,
          category: AndroidNotificationCategory.recommendation,
          styleInformation: BigTextStyleInformation(body),
        ),
      ),
    );
  }

  Future<void> cancelUpdateAvailable() async {
    if (!_isAndroid || !_initialized) return;
    await _plugin.cancel(_updateNotificationId);
  }
}
