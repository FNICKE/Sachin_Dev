import 'package:flutter/material.dart';

/// A paragraph whose words light up one by one as it scrolls up the screen
/// (the website's intro effect). `true` segments use [accentStyle].
class ScrollLitText extends StatefulWidget {
  const ScrollLitText({super.key, required this.segments, required this.style, required this.accentStyle});
  final List<(String, bool)> segments;
  final TextStyle style;
  final TextStyle accentStyle;

  @override
  State<ScrollLitText> createState() => _ScrollLitTextState();
}

class _ScrollLitTextState extends State<ScrollLitText> {
  ScrollPosition? _position;
  double _progress = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.of(context).disableAnimations) {
      _progress = 1;
      return;
    }
    _position?.removeListener(_update);
    _position = Scrollable.maybeOf(context)?.position;
    _position?.addListener(_update);
    WidgetsBinding.instance.addPostFrameCallback((_) => _update());
  }

  void _update() {
    if (!mounted) return;
    final box = context.findRenderObject();
    if (box is! RenderBox || !box.attached || !box.hasSize) return;
    final screen = MediaQuery.of(context).size.height;
    final top = box.localToGlobal(Offset.zero).dy;
    final start = screen * 0.85;
    final end = screen * 0.35;
    final progress = ((start - top) / (box.size.height + start - end)).clamp(0.0, 1.0);
    if ((progress - _progress).abs() > 0.004) setState(() => _progress = progress);
  }

  @override
  void dispose() {
    _position?.removeListener(_update);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final words = <(String, bool)>[
      for (final segment in widget.segments)
        for (final word in segment.$1.split(' '))
          if (word.isNotEmpty) (word, segment.$2),
    ];
    final lit = _progress * (words.length + 3);
    final plain = widget.segments.map((s) => s.$1).join();

    return Semantics(
      label: plain,
      excludeSemantics: true,
      child: Text.rich(
        TextSpan(
          children: [
            for (var i = 0; i < words.length; i++)
              TextSpan(
                text: i < words.length - 1 ? '${words[i].$1} ' : words[i].$1,
                style: () {
                  final base = words[i].$2 ? widget.accentStyle : widget.style;
                  final opacity = 0.16 + 0.84 * (lit - i).clamp(0.0, 1.0);
                  return base.copyWith(color: base.color?.withOpacity(opacity));
                }(),
              ),
          ],
        ),
      ),
    );
  }
}
