import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'package:mobile_app/services/update_service.dart';
import 'package:mobile_app/theme/app_theme.dart';
import 'package:mobile_app/widgets/update_prompt.dart';

/// An UpdateService frozen in one phase, without network or Android calls.
class _FakeUpdates extends UpdateService {
  _FakeUpdates(this._phase, {this.inApp = true, this.confirm = false}) : super(autoCheck: false);

  final UpdatePhase _phase;
  final bool inApp;
  final bool confirm;

  @override
  bool get waitingForConfirmation => confirm;
  @override
  bool get installsSilently => !confirm;
  @override
  bool get startedAutomatically => true;

  @override
  UpdatePhase get phase => _phase;
  @override
  bool get isBusy => _phase == UpdatePhase.downloading || _phase == UpdatePhase.verifying;
  @override
  bool get hasUpdate => true;
  @override
  bool get canUpdateInApp => inApp;
  @override
  String get currentVersion => '1.0.23';
  @override
  AppUpdateInfo? get latest => const AppUpdateInfo(
        version: '1.0.24',
        buildNumber: 24,
        apkUrl: 'https://example.com/sachin-dev-v1.0.24.apk',
        apkSize: 22894058,
      );
  @override
  int get receivedBytes => 12 * 1024 * 1024;
  @override
  int get totalBytes => 22894058;
  @override
  double? get progress => _phase == UpdatePhase.downloading ? 0.55 : null;
  @override
  String? get downloadError =>
      _phase == UpdatePhase.failed ? 'No connection to the download server. Check your internet and try again.' : null;
}

Future<void> _pumpDialog(WidgetTester tester, UpdateService updates, Palette palette, Brightness b) async {
  // A small phone (360 x 640 logical px) — the tightest layout we support.
  tester.view.physicalSize = const Size(1080, 1920);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);

  await tester.pumpWidget(
    ChangeNotifierProvider<UpdateService>.value(
      value: updates,
      child: MaterialApp(
        theme: buildTheme(palette, b),
        home: const Scaffold(body: UpdateDialog()),
      ),
    ),
  );
  await tester.pump(const Duration(seconds: 1)); // let the entrance animations settle
}

void main() {
  setUpAll(() {
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  const expectations = {
    UpdatePhase.idle: ('available', 'Download & install'),
    UpdatePhase.downloading: ('update', 'CANCEL'),
    UpdatePhase.verifying: ('download', 'HIDE'),
    UpdatePhase.ready: ('ready', 'Update now'),
    UpdatePhase.needsPermission: ('permission', 'Open settings'),
    UpdatePhase.installing: ('Installing', 'HIDE'), // Android 12+: installs by itself
    UpdatePhase.failed: ('paused', 'Try again'),
  };

  for (final entry in expectations.entries) {
    for (final (palette, brightness) in [(Palette.light, Brightness.light), (Palette.dark, Brightness.dark)]) {
      testWidgets('update pop-up: ${entry.key.name} (${brightness.name}) lays out without overflow', (tester) async {
        await _pumpDialog(tester, _FakeUpdates(entry.key), palette, brightness);
        expect(tester.takeException(), isNull);
        expect(find.textContaining(entry.value.$1, findRichText: true), findsWidgets);
        expect(find.text(entry.value.$2), findsOneWidget);
      });
    }
  }

  testWidgets('older Android: installing asks to tap Install', (tester) async {
    await _pumpDialog(tester, _FakeUpdates(UpdatePhase.installing, confirm: true), Palette.light, Brightness.light);
    expect(tester.takeException(), isNull);
    expect(find.text('Install'), findsOneWidget);
  });

  testWidgets('download shows megabytes and percent', (tester) async {
    await _pumpDialog(tester, _FakeUpdates(UpdatePhase.downloading), Palette.light, Brightness.light);
    expect(find.text('12.0 of 21.8 MB'), findsOneWidget);
    expect(find.text('55%'), findsOneWidget);
  });

  testWidgets('without in-app install (web, old Android) it falls back to "Update now"', (tester) async {
    await _pumpDialog(tester, _FakeUpdates(UpdatePhase.idle, inApp: false), Palette.light, Brightness.light);
    expect(find.text('Update now'), findsOneWidget);
    expect(find.text('Download & install'), findsNothing);
  });

  test('version.json checksum and size are read', () {
    final info = AppUpdateInfo.fromJson({
      'version': '1.0.24',
      'build_number': 24,
      'apk_url': 'https://example.com/a.apk',
      'sha256': 'ABCDEF',
      'apk_size': 123,
    });
    expect(info.sha256, 'abcdef');
    expect(info.apkSize, 123);
    expect(AppUpdateInfo.fromJson({'version': '1.0.1'}).sha256, isEmpty); // older releases have none
  });
}
