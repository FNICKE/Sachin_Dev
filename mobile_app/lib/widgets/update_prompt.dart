import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../services/links.dart';
import '../services/update_service.dart';
import '../theme/app_theme.dart';
import 'ui.dart';

/// Shows a pop-up when a newer version of the app is published on GitHub.
///
/// - Checks when the app starts (UpdateService) and again whenever the app
///   comes back to the foreground (at most every 10 minutes).
/// - Pops up once per new version per app session; "Later" hides it until the
///   next version (the small banner at the top stays as a reminder).
class UpdatePrompt extends StatefulWidget {
  const UpdatePrompt({super.key, required this.child});
  final Widget child;

  @override
  State<UpdatePrompt> createState() => _UpdatePromptState();
}

class _UpdatePromptState extends State<UpdatePrompt>
    with WidgetsBindingObserver {
  UpdateService? _updater;
  int? _shownForBuild;
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
    if (state == AppLifecycleState.resumed) _updater?.checkIfStale();
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
    if (_showing || _shownForBuild == latest.buildNumber) return;
    _shownForBuild = latest.buildNumber;
    // Wait for the current frame (and the app's entrance animations) before popping up.
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) _show(latest, updater.currentVersion);
    });
  }

  Future<void> _show(AppUpdateInfo latest, String current) async {
    _showing = true;
    HapticFeedback.mediumImpact();
    await showGeneralDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Close update dialog',
      barrierColor: Colors.black.withOpacity(0.6),
      transitionDuration: const Duration(milliseconds: 450),
      pageBuilder: (dialogContext, _, __) =>
          _UpdateDialog(latest: latest, currentVersion: current),
      transitionBuilder: (_, animation, __, child) {
        final curved = CurvedAnimation(
            parent: animation, curve: kEaseExpo, reverseCurve: Curves.easeIn);
        return FadeTransition(
          opacity: curved,
          child: ScaleTransition(
              scale: Tween(begin: 0.9, end: 1.0).animate(curved), child: child),
        );
      },
    );
    _showing = false;
  }

  @override
  Widget build(BuildContext context) => widget.child;
}

class _UpdateDialog extends StatelessWidget {
  const _UpdateDialog({required this.latest, required this.currentVersion});
  final AppUpdateInfo latest;
  final String currentVersion;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // e.g. "sachin-dev-v1.0.23.apk" — naming the exact file avoids opening an older download.
    final fileName = Uri.tryParse(latest.apkUrl)?.pathSegments.lastOrNull ?? '';
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 22),
        child: Material(
          color: p.canvas,
          borderRadius: BorderRadius.circular(28),
          clipBehavior: Clip.antiAlias,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(24, 26, 24, 20),
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
                        builder: (_, v, child) =>
                            Transform.scale(scale: v, child: child),
                        child: Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                              color: p.brand, shape: BoxShape.circle),
                          child: Icon(Icons.system_update_rounded,
                              color: p.brandInk, size: 26),
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: p.line),
                        ),
                        child: Text('v${latest.version}',
                            style: AppText.mono(10.5, color: p.ink)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Text.rich(
                    TextSpan(
                      style: AppText.serif(36, color: p.ink, height: 1),
                      children: [
                        const TextSpan(text: 'New update '),
                        TextSpan(
                            text: 'available',
                            style: TextStyle(
                                fontStyle: FontStyle.italic, color: p.brand)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Version ${latest.version} of the ${Site.name} app is ready'
                    '${currentVersion == 'dev' ? '.' : ' — you have $currentVersion.'}',
                    style: AppText.sans(15.5, color: p.ink.withOpacity(0.8)),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                        color: p.surface,
                        borderRadius: BorderRadius.circular(16)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        for (final (i, step) in [
                          'Tap "Update now" — the new APK downloads.',
                          fileName.endsWith('.apk')
                              ? 'Open $fileName from your downloads and tap Install.'
                              : 'Open the download and tap Install.',
                          'Your data stays — it simply replaces this version.',
                        ].indexed)
                          Padding(
                            padding: EdgeInsets.only(top: i == 0 ? 0 : 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('0${i + 1}',
                                    style: AppText.mono(10.5, color: p.brand)),
                                const SizedBox(width: 10),
                                Expanded(
                                    child: Text(step,
                                        style: AppText.sans(14,
                                            color: p.ink.withOpacity(0.78),
                                            height: 1.35))),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  PillButton(
                    label: 'Update now',
                    expand: true,
                    leading: const Icon(Icons.download_rounded),
                    onTap: () {
                      Navigator.of(context).pop();
                      openLink(
                          context,
                          latest.apkUrl.isNotEmpty
                              ? latest.apkUrl
                              : Site.apkDownloadUrl);
                    },
                  ),
                  const SizedBox(height: 6),
                  Center(
                    child: TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child:
                          Text('LATER', style: AppText.mono(11, color: p.dim)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
