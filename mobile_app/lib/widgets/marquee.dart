import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import '../models/project.dart';
import '../theme/app_theme.dart';

/// Fades the left and right edges of a horizontal row.
class EdgeFade extends StatelessWidget {
  const EdgeFade({super.key, required this.child, this.fraction = 0.06});
  final Widget child;
  final double fraction;

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      blendMode: BlendMode.dstIn,
      shaderCallback: (rect) => LinearGradient(
        colors: const [Colors.transparent, Colors.black, Colors.black, Colors.transparent],
        stops: [0, fraction, 1 - fraction, 1],
      ).createShader(rect),
      child: child,
    );
  }
}

/// Endless row of project cards that drifts left → right on its own.
/// Touching it pauses the motion; it can be swiped freely and resumes after.
class ProjectMarquee extends StatefulWidget {
  const ProjectMarquee({super.key, required this.projects, required this.itemBuilder, this.cardWidth = 300, this.speed = 32});
  final List<Project> projects;
  final Widget Function(Project project, int index) itemBuilder;
  final double cardWidth;
  final double speed; // logical pixels per second

  @override
  State<ProjectMarquee> createState() => _ProjectMarqueeState();
}

class _ProjectMarqueeState extends State<ProjectMarquee> with SingleTickerProviderStateMixin {
  static const _gap = 16.0;
  static const _loops = 400;

  late final ScrollController _ctrl = ScrollController(initialScrollOffset: _middle);
  late final Ticker _ticker = createTicker(_tick);
  Duration _last = Duration.zero;
  bool _touching = false;
  bool _paused = false;
  Timer? _resume;

  double get _extent => widget.cardWidth + _gap;
  double get _middle => _extent * widget.projects.length * (_loops ~/ 2);

  @override
  void initState() {
    super.initState();
    _ticker.start();
  }

  @override
  void dispose() {
    _resume?.cancel();
    _ticker.dispose();
    _ctrl.dispose();
    super.dispose();
  }

  void _tick(Duration elapsed) {
    final dt = ((elapsed - _last).inMicroseconds / 1e6).clamp(0.0, 0.05);
    _last = elapsed;
    if (_touching || _paused || !_ctrl.hasClients || MediaQuery.of(context).disableAnimations) return;
    final pos = _ctrl.position;
    var next = pos.pixels - widget.speed * dt; // decreasing offset = content moves right
    if (next < _extent * widget.projects.length) next = _middle; // seamless loop
    _ctrl.jumpTo(next);
  }

  void _hold() {
    _resume?.cancel();
    _touching = true;
  }

  void _release() {
    _resume?.cancel();
    _resume = Timer(const Duration(milliseconds: 1800), () => _touching = false);
  }

  void _step(int direction) {
    if (!_ctrl.hasClients) return;
    _hold();
    _ctrl
        .animateTo(_ctrl.offset + direction * _extent, duration: const Duration(milliseconds: 700), curve: kEaseExpo)
        .whenComplete(_release);
  }

  @override
  Widget build(BuildContext context) {
    final n = widget.projects.length;
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: widget.cardWidth * 10 / 16 + 86,
          child: Listener(
            onPointerDown: (_) => _hold(),
            onPointerUp: (_) => _release(),
            onPointerCancel: (_) => _release(),
            child: NotificationListener<ScrollEndNotification>(
              onNotification: (_) {
                if (_touching) _release();
                return false;
              },
              child: EdgeFade(
                child: ListView.builder(
                  controller: _ctrl,
                  scrollDirection: Axis.horizontal,
                  itemExtent: _extent,
                  itemCount: n * _loops,
                  physics: const BouncingScrollPhysics(),
                  itemBuilder: (_, i) => Padding(
                    padding: const EdgeInsets.only(right: _gap),
                    child: widget.itemBuilder(widget.projects[i % n], i % n),
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 14),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            children: [
              _RoundControl(icon: Icons.arrow_back_rounded, label: 'Previous projects', onTap: () => _step(-1)),
              const SizedBox(width: 8),
              _RoundControl(
                icon: _paused ? Icons.play_arrow_rounded : Icons.pause_rounded,
                label: _paused ? 'Play the project scroller' : 'Pause the project scroller',
                onTap: () => setState(() => _paused = !_paused),
              ),
              const SizedBox(width: 8),
              _RoundControl(icon: Icons.arrow_forward_rounded, label: 'Next projects', onTap: () => _step(1)),
              const SizedBox(width: 14),
              Expanded(child: Text('SWIPE OR TAP A PROJECT', style: AppText.mono(9.5, color: p.dim))),
            ],
          ),
        ),
      ],
    );
  }
}

class _RoundControl extends StatelessWidget {
  const _RoundControl({required this.icon, required this.label, required this.onTap});
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      label: label,
      child: InkResponse(
        onTap: onTap,
        radius: 26,
        child: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: p.line)),
          child: Icon(icon, size: 18, color: p.ink),
        ),
      ),
    );
  }
}

/// Endless ticker of words (skills) that drifts right → left.
class TextMarquee extends StatefulWidget {
  const TextMarquee({super.key, required this.items, this.speed = 28});
  final List<String> items;
  final double speed;

  @override
  State<TextMarquee> createState() => _TextMarqueeState();
}

class _TextMarqueeState extends State<TextMarquee> with SingleTickerProviderStateMixin {
  final ScrollController _ctrl = ScrollController();
  late final Ticker _ticker = createTicker(_tick);
  Duration _last = Duration.zero;

  @override
  void initState() {
    super.initState();
    _ticker.start();
  }

  @override
  void dispose() {
    _ticker.dispose();
    _ctrl.dispose();
    super.dispose();
  }

  void _tick(Duration elapsed) {
    final dt = ((elapsed - _last).inMicroseconds / 1e6).clamp(0.0, 0.05);
    _last = elapsed;
    if (!_ctrl.hasClients || MediaQuery.of(context).disableAnimations) return;
    _ctrl.jumpTo(_ctrl.offset + widget.speed * dt);
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final n = widget.items.length;
    if (n == 0) return const SizedBox.shrink();
    return Semantics(
      label: widget.items.join(', '),
      excludeSemantics: true,
      child: SizedBox(
        height: 58,
        child: IgnorePointer(
          child: ListView.builder(
            controller: _ctrl,
            scrollDirection: Axis.horizontal,
            itemCount: n * 2000,
            itemBuilder: (_, i) => Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 14),
                  child: Text(
                    widget.items[i % n],
                    style: AppText.serif(42, color: p.ink, italic: i.isOdd, height: 1.25),
                  ),
                ),
                Text('✳', style: AppText.sans(22, color: p.brand)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
