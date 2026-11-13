import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../services/links.dart';
import '../services/update_service.dart';
import '../theme/app_theme.dart';
import 'ui.dart';

/// Shows a pop-up when a newer version of the app is published on GitHub and
/// updates the app from inside it (Android):
///
/// - Checks when the app starts and whenever it comes back to the foreground
///   (at most every 10 minutes).
/// - On Wi-Fi the new version downloads by itself; on mobile data the pop-up
///   asks first.
/// - Once downloaded: "Update now" installs it (Android 12+ without Android's
///   screen — the app closes for a moment), or it installs by itself when the
///   user leaves the app.
/// - Pops up once per new version; "Later" hides it (the banner at the top stays
///   and reopens it). It comes back by itself when the update is ready or needs
///   the user (permission or an error).
class UpdatePrompt extends StatefulWidget {
  const UpdatePrompt({super.key, required this.child});
  final Widget child;

  /// Opens the update pop-up (used by the top banner and the footer).
  static void open(BuildContext context) {
    context.findAncestorStateOfType<_UpdatePromptState>()?._show();
  }

  @override
  State<UpdatePrompt> createState() => _UpdatePromptState();
}

class _UpdatePromptState extends State<UpdatePrompt> with WidgetsBindingObserver {
  UpdateService? _updater;
  int? _shownForBuild;
  UpdatePhase? _lastPhase;
  bool _showing = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final updater = context.read<UpdateService>();
    if (updater != _updater) {
      _updater?.removeListener(_onUpdateChanged);
      _updater = updater..addListener(_onUpdateChanged);
      _onUpdateChanged();
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _updater?.onAppResumed(); // continue the install after "Allow from this source"
      _updater?.checkIfStale();
    } else if (state == AppLifecycleState.paused) {
      _updater?.onAppPaused(); // a downloaded update installs while the app isn't in use
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _updater?.removeListener(_onUpdateChanged);
    super.dispose();
  }

  void _onUpdateChanged() {
    final updater = _updater;
    final latest = updater?.latest;
    if (updater == null || !updater.hasUpdate || latest == null) return;

    // The update is ready, or the user needs to act (permission / error) — bring
    // the pop-up back if it was hidden.
    final phase = updater.phase;
    if (phase != _lastPhase) {
      _lastPhase = phase;
      if (!_showing &&
          (phase == UpdatePhase.ready || phase == UpdatePhase.needsPermission || phase == UpdatePhase.failed)) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) _show();
        });
        return;
      }
    }

    if (_showing || _shownForBuild == latest.buildNumber) return;
    _shownForBuild = latest.buildNumber;
    // Wait for the app's entrance animations before popping up.
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) _show();
    });
  }

  Future<void> _show() async {
    final updater = _updater;
    if (_showing || updater == null || updater.latest == null) return;
    _showing = true;
    HapticFeedback.mediumImpact();
    await showGeneralDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Close update dialog',
      barrierColor: Colors.black.withOpacity(0.6),
      transitionDuration: const Duration(milliseconds: 450),
      pageBuilder: (_, __, ___) => const UpdateDialog(),
      transitionBuilder: (_, animation, __, child) {
        final curved = CurvedAnimation(parent: animation, curve: kEaseExpo, reverseCurve: Curves.easeIn);
        return FadeTransition(
          opacity: curved,
          child: ScaleTransition(scale: Tween(begin: 0.9, end: 1.0).animate(curved), child: child),
        );
      },
    );
    _showing = false;
  }

  @override
  Widget build(BuildContext context) => widget.child;
}

String _mb(int bytes) => (bytes / (1024 * 1024)).toStringAsFixed(1);

/// The update pop-up. Reads everything from [UpdateService], so it follows the
/// download live.
class UpdateDialog extends StatelessWidget {
  const UpdateDialog({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final updater = context.watch<UpdateService>();
    final latest = updater.latest;
    if (latest == null) return const SizedBox.shrink();
    final phase = updater.phase;

    void close() => Navigator.of(context).pop();
    void openInBrowser() {
      close();
      openLink(context, latest.apkUrl.isNotEmpty ? latest.apkUrl : Site.apkDownloadUrl);
    }

    void start() => updater.canUpdateInApp ? updater.downloadAndInstall() : openInBrowser();

    final silentInstall = phase == UpdatePhase.installing && !updater.waitingForConfirmation;
    final (IconData icon, String title, String accent) = switch (phase) {
      UpdatePhase.downloading => (Icons.downloading_rounded, 'Downloading ', 'update'),
      UpdatePhase.verifying => (Icons.verified_rounded, 'Checking ', 'download'),
      UpdatePhase.ready => (Icons.rocket_launch_rounded, 'Update ', 'ready'),
      UpdatePhase.needsPermission => (Icons.shield_outlined, 'One-time ', 'permission'),
      UpdatePhase.installing when silentInstall => (Icons.install_mobile_rounded, 'Installing ', 'update'),
      UpdatePhase.installing => (Icons.install_mobile_rounded, 'Ready to ', 'install'),
      UpdatePhase.failed => (Icons.error_outline_rounded, 'Update ', 'paused'),
      UpdatePhase.idle => (Icons.system_update_rounded, 'New update ', 'available'),
    };

    final body = switch (phase) {
      UpdatePhase.downloading => _Progress(
          key: const ValueKey('downloading'),
          value: updater.progress,
          left: updater.totalBytes > 0
              ? '${_mb(updater.receivedBytes)} of ${_mb(updater.totalBytes)} MB'
              : '${_mb(updater.receivedBytes)} MB',
          right: updater.progress == null ? '' : '${(updater.progress! * 100).floor()}%',
          note: updater.startedAutomatically
              ? 'Version ${latest.version} is downloading by itself — keep using the app.'
              : 'Keep using the app — the update installs as soon as the download finishes.',
        ),
      UpdatePhase.ready => _Message(
          key: const ValueKey('ready'),
          text: updater.installsSilently
              ? 'Version ${latest.version} is downloaded. Tap "Update now" — the app closes for a moment '
                  'and updates itself. Or carry on: it updates when you leave the app.'
              : 'Version ${latest.version} is downloaded. Tap "Update now", then Install on the Android screen.',
        ),
      UpdatePhase.verifying => const _Progress(
          key: ValueKey('verifying'),
          value: null,
          left: 'Making sure the file is complete…',
          right: '',
          note: '',
        ),
      UpdatePhase.needsPermission => const _Message(
          key: ValueKey('permission'),
          text: 'Android asks for this once. On the next screen, turn on '
              '"Allow from this source", then come back — the install continues by itself.',
        ),
      UpdatePhase.installing when silentInstall => _Progress(
          key: const ValueKey('installing-silent'),
          value: null,
          left: 'Installing version ${latest.version}…',
          right: '',
          note: 'The app closes for a moment and updates itself — open it again in a few seconds. Your data stays.',
        ),
      UpdatePhase.installing => _Message(
          key: const ValueKey('installing'),
          text: 'Tap Install on the Android screen. The app restarts with version '
              '${latest.version} — your data stays.',
        ),
      UpdatePhase.failed => _Message(
          key: const ValueKey('failed'),
          text: updater.downloadError ?? 'The update could not be downloaded.',
          highlight: true,
        ),
      UpdatePhase.idle => _Steps(
          key: const ValueKey('idle'),
          version: latest.version,
          currentVersion: updater.currentVersion,
          inApp: updater.canUpdateInApp,
        ),
    };

    final (String? primary, VoidCallback? onPrimary, IconData? primaryIcon) = switch (phase) {
      UpdatePhase.idle => (
          updater.canUpdateInApp ? 'Download & install' : 'Update now',
          start,
          Icons.download_rounded
        ),
      UpdatePhase.failed => ('Try again', start, Icons.refresh_rounded),
      UpdatePhase.ready => ('Update now', updater.installNow, Icons.system_update_rounded),
      UpdatePhase.needsPermission => ('Open settings', updater.openInstallPermission, Icons.settings_rounded),
      UpdatePhase.installing when silentInstall => (null, null, null),
      UpdatePhase.installing => ('Install', updater.installNow, Icons.install_mobile_rounded),
      UpdatePhase.downloading || UpdatePhase.verifying => (null, null, null),
    };

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 22),
        child: Material(
          color: p.canvas,
          borderRadius: BorderRadius.circular(28),
          clipBehavior: Clip.antiAlias,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: AnimatedSize(
              duration: const Duration(milliseconds: 350),
              curve: kEaseExpo,
              alignment: Alignment.topCenter,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 26, 24, 16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0, end: 1),
                          duration: const Duration(milliseconds: 900),
                          curve: Curves.elasticOut,
                          builder: (_, v, child) => Transform.scale(scale: v, child: child),
                          child: Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(color: p.brand, shape: BoxShape.circle),
                            child: AnimatedSwitcher(
                              duration: const Duration(milliseconds: 300),
                              transitionBuilder: (child, a) => ScaleTransition(scale: a, child: child),
                              child: Icon(icon, key: ValueKey(icon), color: p.brandInk, size: 26),
                            ),
                          ),
                        ),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(color: p.line),
                          ),
                          child: Text('v${latest.version}', style: AppText.mono(10.5, color: p.ink)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    Text.rich(
                      TextSpan(
                        style: AppText.serif(34, color: p.ink, height: 1),
                        children: [
                          TextSpan(text: title),
                          TextSpan(text: accent, style: TextStyle(fontStyle: FontStyle.italic, color: p.brand)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 14),
                    AnimatedSwitcher(
                      duration: const Duration(milliseconds: 300),
                      layoutBuilder: (current, previous) => Stack(
                        alignment: Alignment.topLeft,
                        children: [...previous, if (current != null) current],
                      ),
                      child: body,
                    ),
                    const SizedBox(height: 18),
                    if (primary != null)
                      PillButton(
                        label: primary,
                        expand: true,
                        leading: Icon(primaryIcon),
                        onTap: onPrimary,
                      ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (phase == UpdatePhase.downloading)
                          _TextAction('CANCEL', onTap: () {
                            updater.cancelDownload();
                          }),
                        if (phase == UpdatePhase.failed && updater.canUpdateInApp)
                          _TextAction('USE BROWSER', onTap: openInBrowser),
                        _TextAction(
                          updater.isBusy || phase == UpdatePhase.installing ? 'HIDE' : 'LATER',
                          onTap: close,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _TextAction extends StatelessWidget {
  const _TextAction(this.label, {required this.onTap});
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => TextButton(
        onPressed: onTap,
        child: Text(label, style: AppText.mono(11, color: context.palette.dim)),
      );
}

class _Steps extends StatelessWidget {
  const _Steps({super.key, required this.version, required this.currentVersion, required this.inApp});
  final String version;
  final String currentVersion;
  final bool inApp;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final steps = inApp
        ? const [
            'Tap "Download & install" — it downloads right here in the app.',
            'It installs by itself (older Android asks you to tap Install).',
            'Your data stays — it simply replaces this version.',
          ]
        : const [
            'Tap "Update now" — the new APK downloads.',
            'Open the download and tap Install.',
            'Your data stays — it simply replaces this version.',
          ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Version $version of the ${Site.name} app is ready'
          '${currentVersion == 'dev' ? '.' : ' — you have $currentVersion.'}',
          style: AppText.sans(15.5, color: p.ink.withOpacity(0.8)),
        ),
        const SizedBox(height: 14),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(16)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final (i, step) in steps.indexed)
                Padding(
                  padding: EdgeInsets.only(top: i == 0 ? 0 : 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('0${i + 1}', style: AppText.mono(10.5, color: p.brand)),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(step, style: AppText.sans(14, color: p.ink.withOpacity(0.78), height: 1.35)),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Progress extends StatelessWidget {
  const _Progress({super.key, required this.value, required this.left, required this.right, required this.note});

  /// 0–1, or null for an indeterminate bar.
  final double? value;
  final String left;
  final String right;
  final String note;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: value == null
              ? LinearProgressIndicator(minHeight: 10, color: p.brand, backgroundColor: p.line)
              : TweenAnimationBuilder<double>(
                  tween: Tween(end: value),
                  duration: const Duration(milliseconds: 250),
                  builder: (_, v, __) =>
                      LinearProgressIndicator(value: v, minHeight: 10, color: p.brand, backgroundColor: p.line),
                ),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(child: Text(left, style: AppText.mono(11, color: p.dim))),
            Text(right, style: AppText.mono(11, color: p.ink, weight: FontWeight.w600)),
          ],
        ),
        if (note.isNotEmpty) ...[
          const SizedBox(height: 12),
          Text(note, style: AppText.sans(14, color: p.ink.withOpacity(0.7), height: 1.35)),
        ],
      ],
    );
  }
}

class _Message extends StatelessWidget {
  const _Message({super.key, required this.text, this.highlight = false});
  final String text;
  final bool highlight;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: highlight ? p.brand.withOpacity(0.1) : p.surface,
        borderRadius: BorderRadius.circular(16),
        border: highlight ? Border.all(color: p.brand.withOpacity(0.5)) : null,
      ),
      child: Text(text, style: AppText.sans(14.5, color: p.ink.withOpacity(0.85), height: 1.4)),
    );
  }
}
