import 'dart:async';

import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Tells the widgets inside a tab each time that tab is opened, so their
/// entrance animations replay (the tabs are built once and kept alive, so
/// without this an animation would finish while its tab is still hidden).
class TabEntry extends InheritedWidget {
  const TabEntry({super.key, required this.notifier, required super.child});
  final ValueNotifier<int> notifier;

  static ValueNotifier<int>? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<TabEntry>()?.notifier;

  @override
  bool updateShouldNotify(TabEntry oldWidget) => oldWidget.notifier != notifier;
}

/// Shared entrance logic: starts [entrance] once the widget scrolls into view
/// (after [entranceDelay]) and replays it whenever its tab is opened again.
/// Respects the system "remove animations" setting.
mixin EntranceAnimation<T extends StatefulWidget> on State<T>, TickerProvider {
  late final AnimationController entrance = AnimationController(vsync: this, duration: entranceDuration);

  Duration get entranceDuration;
  Duration get entranceDelay => Duration.zero;

  /// How far up the screen the widget's top must be before it starts (0–1).
  double get triggerAt => 0.92;

  ScrollPosition? _position;
  ValueNotifier<int>? _entry;
  Timer? _timer;
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.of(context).disableAnimations) {
      _started = true;
      entrance.value = 1;
      return;
    }
    final entry = TabEntry.maybeOf(context);
    if (entry != _entry) {
      _entry?.removeListener(_replay);
      _entry = entry?..addListener(_replay);
    }
    _watchScroll();
  }

  void _watchScroll() {
    _position?.removeListener(_check);
    _position = Scrollable.maybeOf(context)?.position;
    if (_started) return;
    _position?.addListener(_check);
    WidgetsBinding.instance.addPostFrameCallback((_) => _check());
  }

  void _check() {
    if (_started || !mounted) return;
    final box = context.findRenderObject();
    if (box is! RenderBox || !box.attached || !box.hasSize) return;
    final top = box.localToGlobal(Offset.zero).dy;
    if (top < MediaQuery.of(context).size.height * triggerAt) {
      _started = true;
      _position?.removeListener(_check);
      _timer?.cancel();
      _timer = Timer(entranceDelay, () {
        if (mounted) entrance.forward(from: 0);
      });
    }
  }

  void _replay() {
    if (!mounted || MediaQuery.of(context).disableAnimations) return;
    _timer?.cancel();
    entrance.value = 0;
    _started = false;
    _watchScroll();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _position?.removeListener(_check);
    _entry?.removeListener(_replay);
    entrance.dispose();
    super.dispose();
  }
}

/// Fades and lifts its child into place when it scrolls into view.
class Reveal extends StatefulWidget {
  const Reveal({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.offset = 28,
    this.duration = const Duration(milliseconds: 900),
  });

  final Widget child;
  final Duration delay;
  final double offset;
  final Duration duration;

  @override
  State<Reveal> createState() => _RevealState();
}

class _RevealState extends State<Reveal> with SingleTickerProviderStateMixin, EntranceAnimation {
  @override
  Duration get entranceDuration => widget.duration;
  @override
  Duration get entranceDelay => widget.delay;

  late final Animation<double> _t = CurvedAnimation(parent: entrance, curve: kEaseExpo);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _t,
      builder: (_, child) => Opacity(
        opacity: _t.value.clamp(0.0, 1.0),
        child: Transform.translate(offset: Offset(0, widget.offset * (1 - _t.value)), child: child),
      ),
      child: widget.child,
    );
  }
}

/// Clips only the bottom edge — the "mask" text rises out of. Sides stay open so
/// italic strokes aren't trimmed; [bottom] leaves room for descenders (g, y, p).
class BottomEdgeClipper extends CustomClipper<Rect> {
  const BottomEdgeClipper({this.bottom = 1.0});
  final double bottom;

  @override
  Rect getClip(Size size) => Rect.fromLTRB(-size.width, -size.height * 0.4, size.width * 2, size.height * bottom);

  @override
  bool shouldReclip(BottomEdgeClipper oldClipper) => oldClipper.bottom != bottom;
}

/// Text whose letters slide up from behind a mask, one after another (hero name).
class LetterReveal extends StatefulWidget {
  const LetterReveal(this.text, {super.key, required this.style, this.delay = Duration.zero});
  final String text;
  final TextStyle style;
  final Duration delay;

  @override
  State<LetterReveal> createState() => _LetterRevealState();
}

class _LetterRevealState extends State<LetterReveal> with SingleTickerProviderStateMixin, EntranceAnimation {
  @override
  Duration get entranceDuration => Duration(milliseconds: 1100 + widget.text.length * 55);
  @override
  Duration get entranceDelay => widget.delay;

  @override
  Widget build(BuildContext context) {
    final letters = widget.text.characters.toList();
    final total = entranceDuration.inMilliseconds;
    return Semantics(
      label: widget.text,
      excludeSemantics: true,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          for (var i = 0; i < letters.length; i++)
            ClipRect(
              clipper: const BottomEdgeClipper(),
              child: AnimatedBuilder(
                animation: entrance,
                builder: (_, child) {
                  final start = (i * 55) / total;
                  final end = (start + 1100 / total).clamp(0.0, 1.0);
                  final t = kEaseExpo.transform(((entrance.value - start) / (end - start)).clamp(0.0, 1.0));
                  return FractionalTranslation(translation: Offset(0, 1.05 * (1 - t)), child: child);
                },
                child: Text(letters[i], style: widget.style),
              ),
            ),
        ],
      ),
    );
  }
}

/// Words that slide up one after another from behind a mask (headings, lead text).
/// Pass `(word, true)` pairs to set some words in a different style (e.g. italic).
class WordReveal extends StatefulWidget {
  const WordReveal({
    super.key,
    required this.words,
    required this.style,
    this.accentStyle,
    this.trailing,
    this.delay = Duration.zero,
    this.stagger = const Duration(milliseconds: 70),
    this.alignment = WrapAlignment.start,
  });

  /// Convenience for plain text.
  factory WordReveal.text(
    String text, {
    Key? key,
    required TextStyle style,
    Duration delay = Duration.zero,
    Duration stagger = const Duration(milliseconds: 70),
    WrapAlignment alignment = WrapAlignment.start,
  }) =>
      WordReveal(
        key: key,
        words: [for (final w in text.split(' ')) if (w.isNotEmpty) (w, false)],
        style: style,
        delay: delay,
        stagger: stagger,
        alignment: alignment,
      );

  final List<(String, bool)> words;
  final TextStyle style;
  final TextStyle? accentStyle;
  final Widget? trailing;
  final Duration delay;
  final Duration stagger;
  final WrapAlignment alignment;

  @override
  State<WordReveal> createState() => _WordRevealState();
}

class _WordRevealState extends State<WordReveal> with SingleTickerProviderStateMixin, EntranceAnimation {
  static const _wordMs = 950;

  @override
  Duration get entranceDuration =>
      Duration(milliseconds: _wordMs + widget.stagger.inMilliseconds * (widget.words.length - 1).clamp(0, 60));
  @override
  Duration get entranceDelay => widget.delay;

  @override
  Widget build(BuildContext context) {
    final total = entranceDuration.inMilliseconds;
    final size = widget.style.fontSize ?? 16;
    final label = widget.words.map((w) => w.$1).join(' ');

    return Semantics(
      label: label,
      excludeSemantics: true,
      child: Wrap(
        alignment: widget.alignment,
        spacing: size * 0.24,
        crossAxisAlignment: WrapCrossAlignment.end,
        children: [
          for (var i = 0; i < widget.words.length; i++)
            ClipRect(
              clipper: const BottomEdgeClipper(bottom: 1.32),
              child: AnimatedBuilder(
                animation: entrance,
                builder: (_, child) {
                  final start = (i * widget.stagger.inMilliseconds) / total;
                  final end = (start + _wordMs / total).clamp(0.0, 1.0);
                  final t = kEaseExpo.transform(((entrance.value - start) / (end - start)).clamp(0.0, 1.0));
                  return FractionalTranslation(translation: Offset(0, 1.4 * (1 - t)), child: child);
                },
                child: Text(
                  widget.words[i].$1,
                  style: widget.words[i].$2 ? (widget.accentStyle ?? widget.style) : widget.style,
                ),
              ),
            ),
          if (widget.trailing != null)
            FadeTransition(
              opacity: CurvedAnimation(parent: entrance, curve: const Interval(0.6, 1, curve: Curves.easeOut)),
              child: widget.trailing!,
            ),
        ],
      ),
    );
  }
}

/// Counts up from zero when it scrolls into view (and again when its tab reopens).
class CountUp extends StatefulWidget {
  const CountUp(this.value, {super.key, required this.style, this.suffix = ''});
  final int value;
  final TextStyle style;
  final String suffix;

  @override
  State<CountUp> createState() => _CountUpState();
}

class _CountUpState extends State<CountUp> with SingleTickerProviderStateMixin, EntranceAnimation {
  @override
  Duration get entranceDuration => const Duration(milliseconds: 1600);

  late final Animation<double> _t = CurvedAnimation(parent: entrance, curve: kEaseExpo);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _t,
      builder: (_, __) => Text('${(widget.value * _t.value).round()}${widget.suffix}', style: widget.style),
    );
  }
}
