import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../data/site.dart';
import '../theme/app_theme.dart';
import 'reveal.dart';
import 'ui.dart';

/// Sachin's photo on a rounded card with an orange card offset behind it.
/// It wipes up into view, the photo settles from a slight zoom, then the
/// labels fade in — the same entrance as the website hero.
class PortraitCard extends StatefulWidget {
  const PortraitCard({
    super.key,
    this.showOverlay = true,
    this.delay = const Duration(milliseconds: 250),
    this.floating = false,
  });
  final bool showOverlay;
  final Duration delay;
  final bool floating;

  @override
  State<PortraitCard> createState() => _PortraitCardState();
}

class _PortraitCardState extends State<PortraitCard>
    with TickerProviderStateMixin, EntranceAnimation {
  late final AnimationController _float;

  @override
  void initState() {
    super.initState();
    _float = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 4200));
  }

  @override
  Duration get entranceDuration => const Duration(milliseconds: 1800);
  @override
  Duration get entranceDelay => widget.delay;

  AnimationController get _c => entrance;

  // Parallax: the photo drifts a little inside its frame as the page scrolls.
  final ValueNotifier<double> _drift = ValueNotifier(0);
  ScrollPosition? _scroll;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (widget.floating && !MediaQuery.of(context).disableAnimations) {
      if (!_float.isAnimating) _float.repeat(reverse: true);
    } else {
      _float.stop();
      _float.value = 0;
    }
    _scroll?.removeListener(_updateDrift);
    if (MediaQuery.of(context).disableAnimations) return;
    _scroll = Scrollable.maybeOf(context)?.position;
    _scroll?.addListener(_updateDrift);
  }

  void _updateDrift() {
    final box = context.findRenderObject();
    if (box is! RenderBox || !box.attached || !box.hasSize) return;
    final screen = MediaQuery.of(context).size.height;
    final center = box.localToGlobal(Offset(0, box.size.height / 2)).dy;
    _drift.value = ((center - screen / 2) / screen).clamp(-1.0, 1.0) *
        -16; // stays inside the 8% zoom margin
  }

  @override
  void dispose() {
    _float.dispose();
    _scroll?.removeListener(_updateDrift);
    _drift.dispose();
    super.dispose();
  }

  double _phase(double from, double to) =>
      kEaseExpo.transform(((_c.value - from) / (to - from)).clamp(0.0, 1.0));

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    const radius = 26.0;

    return Semantics(
      image: true,
      label: '${Site.name}, freelance fullstack developer',
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) {
          final wipe = _phase(0, 0.75);
          final zoom = _phase(0, 1);
          final plate = _phase(0.45, 1);
          final labels = _phase(0.6, 1);

          return Padding(
            padding: const EdgeInsets.only(right: 16, bottom: 16),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                // Offset orange card behind the photo
                Positioned.fill(
                  child: Opacity(
                    opacity: plate,
                    child: Transform.translate(
                      offset: Offset(16 * plate, 16 * plate),
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                            color: p.brand,
                            borderRadius: BorderRadius.circular(radius)),
                      ),
                    ),
                  ),
                ),
                ClipRect(
                  clipper: _WipeClipper(wipe),
                  child: AspectRatio(
                    aspectRatio: 4 / 5,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(radius),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          ColoredBox(color: p.surface),
                          AnimatedBuilder(
                            animation: _float,
                            builder: (_, child) => Transform.translate(
                              offset: Offset(
                                  0,
                                  widget.floating
                                      ? math.sin(_float.value * math.pi) * 4
                                      : 0),
                              child: child,
                            ),
                            child: ValueListenableBuilder<double>(
                              valueListenable: _drift,
                              builder: (_, drift, child) => Transform.translate(
                                offset: Offset(0, drift),
                                child: Transform.scale(
                                    scale: 1.3 - 0.22 * zoom, child: child),
                              ),
                              child: Image.asset(
                                'assets/images/profile.png',
                                fit: BoxFit.cover,
                                alignment: const Alignment(0, -0.65),
                              ),
                            ),
                          ),
                          if (widget.showOverlay) ...[
                            const DecoratedBox(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.bottomCenter,
                                  end: Alignment(0, 0.1),
                                  colors: [
                                    Color(0xCC000000),
                                    Colors.transparent
                                  ],
                                ),
                              ),
                            ),
                            Positioned(
                              left: 14,
                              top: 14,
                              child: Opacity(
                                opacity: labels,
                                child: Container(
                                  padding:
                                      const EdgeInsets.fromLTRB(6, 4, 12, 4),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withOpacity(0.5),
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      PulseDot(size: 6, color: p.brand),
                                      Text('REPLIES WITHIN 24 HOURS',
                                          style: AppText.mono(9.5,
                                              color: Colors.white)),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              left: 18,
                              right: 18,
                              bottom: 18,
                              child: Opacity(
                                opacity: labels,
                                child: Transform.translate(
                                  offset: Offset(0, 14 * (1 - labels)),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(Site.name,
                                          style: AppText.serif(30,
                                              color: Colors.white)),
                                      const SizedBox(height: 6),
                                      Text(
                                        'WEBSITES · WEB APPS · MOBILE APPS',
                                        style: AppText.mono(9.5,
                                            color:
                                                Colors.white.withOpacity(0.78)),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

/// Reveals its child from the bottom edge upwards.
class _WipeClipper extends CustomClipper<Rect> {
  _WipeClipper(this.t);
  final double t;

  @override
  Rect getClip(Size size) => Rect.fromLTRB(
      -40, size.height * (1 - t), size.width + 40, size.height + 40);

  @override
  bool shouldReclip(_WipeClipper old) => old.t != t;
}
