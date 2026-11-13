import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:mobile_app/services/apk_installer.dart';
import 'package:mobile_app/services/update_service.dart';

/// Simulates the Android side (MainActivity.kt) and the GitHub release, so the
/// whole in-app update flow runs without a phone.
class _Phone {
  _Phone({this.wifi = true, this.canInstall = true, this.checksum = 'abc123'}) {
    dir = Directory.systemTemp.createTempSync('updates');
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(const MethodChannel('dev.sachin.app/updater'), (call) async {
      calls.add(call);
      return switch (call.method) {
        'updateDir' => dir.path,
        'isUnmetered' => wifi,
        'canInstall' => canInstall,
        'canInstallSilently' => canInstall,
        'sha256' => checksum,
        'install' => 'session',
        _ => null,
      };
    });
  }

  late final Directory dir;
  bool wifi;
  bool canInstall;
  String checksum;
  final calls = <MethodCall>[];
  final requests = <String>[];

  List<MethodCall> get installs => calls.where((c) => c.method == 'install').toList();

  static final apk = List<int>.generate(50000, (i) => i % 251);

  http.Client server({int latestBuild = 25}) => MockClient((req) async {
        requests.add(req.url.path);
        if (req.url.path.endsWith('version.json')) {
          return http.Response(
            jsonEncode({
              'version': '1.0.$latestBuild',
              'build_number': latestBuild,
              'apk_url': 'https://example.com/sachin-dev-v1.0.$latestBuild.apk',
              'sha256': 'abc123',
              'apk_size': apk.length,
            }),
            200,
          );
        }
        if (req.url.path.endsWith('.apk')) return http.Response.bytes(apk, 200);
        return http.Response('', 404);
      });
}

Future<void> _until(bool Function() condition) async {
  for (var i = 0; i < 500 && !condition(); i++) {
    await Future<void>.delayed(const Duration(milliseconds: 10));
  }
  expect(condition(), isTrue, reason: 'timed out waiting');
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() => debugDefaultTargetPlatformOverride = TargetPlatform.android);
  tearDown(() => debugDefaultTargetPlatformOverride = null);

  test('on Wi-Fi the update downloads by itself, waits while the app is used, and installs when the user leaves',
      () async {
    final phone = _Phone();
    final updates = UpdateService(httpClient: phone.server, currentBuildOverride: 24);

    await _until(() => updates.phase == UpdatePhase.ready);
    expect(updates.startedAutomatically, isTrue);
    expect(updates.installsSilently, isTrue);
    expect(File('${phone.dir.path}/sachin-dev-v1.0.25.apk').lengthSync(), _Phone.apk.length);
    expect(phone.installs, isEmpty, reason: 'never closes the app while it is being used');

    await updates.onAppPaused();
    expect(phone.installs.single.arguments, {
      'path': '${phone.dir.path}/sachin-dev-v1.0.25.apk',
      'background': true,
    });
    expect(updates.phase, UpdatePhase.installing);
    expect(updates.waitingForConfirmation, isFalse);

    // The user cancels Android's screen -> the download is kept for later.
    updates.handleInstallStatus(const InstallStatus(ApkInstaller.statusAborted));
    expect(updates.phase, UpdatePhase.ready);
    updates.dispose();
  });

  test('"Update now" installs the downloaded update straight away', () async {
    final phone = _Phone();
    final updates = UpdateService(httpClient: phone.server, currentBuildOverride: 24);
    await _until(() => updates.phase == UpdatePhase.ready);

    await updates.installNow();
    expect(phone.installs.single.arguments['background'], false);
    expect(updates.phase, UpdatePhase.installing);

    // Android decided to ask: its "Install" screen is shown.
    updates.handleInstallStatus(const InstallStatus(ApkInstaller.statusPendingUserAction));
    expect(updates.waitingForConfirmation, isTrue);
    updates.dispose();
  });

  test('on mobile data it waits for a tap, then downloads and installs', () async {
    final phone = _Phone(wifi: false);
    final updates = UpdateService(httpClient: phone.server, currentBuildOverride: 24);
    await _until(() => updates.hasUpdate && !updates.isChecking);
    await Future<void>.delayed(const Duration(milliseconds: 100));
    expect(updates.phase, UpdatePhase.idle);
    expect(phone.requests.where((p) => p.endsWith('.apk')), isEmpty, reason: 'no 22 MB on mobile data unasked');

    await updates.downloadAndInstall();
    expect(phone.installs.single.arguments['background'], false);
    expect(updates.phase, UpdatePhase.installing);
    updates.dispose();
  });

  test('a damaged download is never installed', () async {
    final phone = _Phone(checksum: 'something-else');
    final updates = UpdateService(httpClient: phone.server, currentBuildOverride: 24);
    await _until(() => updates.phase == UpdatePhase.failed);
    expect(updates.downloadError, contains('damaged'));
    expect(phone.installs, isEmpty);
    updates.dispose();
  });

  test('first time: asks for the install permission, then continues by itself', () async {
    final phone = _Phone(canInstall: false);
    final updates = UpdateService(httpClient: phone.server, currentBuildOverride: 24);
    await _until(() => updates.phase == UpdatePhase.ready);
    expect(updates.installsSilently, isFalse);

    await updates.onAppPaused(); // can't install silently yet -> waits
    expect(phone.installs, isEmpty);

    await updates.installNow();
    expect(updates.phase, UpdatePhase.needsPermission);

    phone.canInstall = true; // the user switched on "Allow from this source"
    await updates.onAppResumed();
    expect(phone.installs, hasLength(1));
    expect(updates.phase, UpdatePhase.installing);
    updates.dispose();
  });

  test('cancelling stops the download and it does not restart by itself', () async {
    final phone = _Phone();
    final updates = UpdateService(httpClient: phone.server, currentBuildOverride: 24);
    await _until(() => updates.phase != UpdatePhase.idle);
    updates.cancelDownload();
    await updates.checkForUpdate();
    expect(updates.phase, isNot(UpdatePhase.downloading));
    updates.dispose();
  });

  test('already up to date: nothing is downloaded', () async {
    final phone = _Phone();
    final updates = UpdateService(httpClient: () => phone.server(latestBuild: 24), currentBuildOverride: 24);
    await _until(() => updates.latest != null && !updates.isChecking);
    await Future<void>.delayed(const Duration(milliseconds: 100));
    expect(updates.hasUpdate, isFalse);
    expect(updates.phase, UpdatePhase.idle);
    expect(phone.requests.where((p) => p.endsWith('.apk')), isEmpty);
    updates.dispose();
  });
}
