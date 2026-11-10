import 'dart:async';
import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

import '../data/site.dart';
import '../services/links.dart';
import '../theme/app_theme.dart';
import '../theme/theme_controller.dart';
import 'reveal.dart';

/// "(01) — SELECTED WORK" style label.
class SectionLabel extends StatelessWidget {
  const SectionLabel(this.text, {super.key, this.color});
  final String text;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Text(text.toUpperCase(), style: AppText.mono(10.5, color: color ?? context.palette.dim));
  }
}

class Hairline extends StatelessWidget {
  const Hairline({super.key, this.vertical = false});
  final bool vertical;

  @override
  Widget build(BuildContext context) {
    final c = context.palette.line;
    return vertical ? Container(width: 1, color: c) : Container(height: 1, color: c);
  }
}

/// Serif heading with an optional italic tail: "Things I've *built*".
class SerifHeading extends StatelessWidget {
  const SerifHeading(this.text, {super.key, this.italic, this.size = 46, this.italicColor, this.count});
  final String text;
  final String? italic;
  final double size;
  final Color? italicColor;
  final int? count;

  /// Words of [text] (upright) followed by words of [italic].
  List<(String, bool)> get _words => [
        for (final w in text.split(' ')) if (w.isNotEmpty) (w, false),
        for (final w in (italic ?? '').split(' ')) if (w.isNotEmpty) (w, true),
      ];

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final style = AppText.serif(size, color: p.ink, height: 0.95);
    // The words rise into place one by one when the heading scrolls into view.
    return WordReveal(
      words: _words,
      style: style,
      accentStyle: style.copyWith(fontStyle: FontStyle.italic, color: italicColor ?? p.ink),
      trailing: count == null
          ? null
          : Padding(
              padding: EdgeInsets.only(bottom: size * 0.55),
              child: Text('($count)', style: AppText.mono(11, color: p.dim)),
            ),
    );
  }
}

enum PillStyle { brand, ink, outline }

/// Rounded pill button with a press-down animation.
class PillButton extends StatefulWidget {
  const PillButton({
    super.key,
    required this.label,
    required this.onTap,
    this.style = PillStyle.brand,
    this.leading,
    this.trailing,
    this.expand = false,
    this.dense = false,
  });

  final String label;
  final VoidCallback? onTap;
  final PillStyle style;
  final Widget? leading;
  final IconData? trailing;
  final bool expand;
  final bool dense;

  @override
  State<PillButton> createState() => _PillButtonState();
}

class _PillButtonState extends State<PillButton> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final (bg, fg, border) = switch (widget.style) {
      PillStyle.brand => (p.brand, p.brandInk, p.brand),
      PillStyle.ink => (p.ink, p.canvas, p.ink),
      PillStyle.outline => (Colors.transparent, p.ink, p.line),
    };
    final disabled = widget.onTap == null;

    final content = Row(
      mainAxisSize: widget.expand ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (widget.leading != null) ...[
          IconTheme(data: IconThemeData(color: fg, size: 18), child: widget.leading!),
          SizedBox(width: widget.dense ? 8 : 10),
        ],
        Flexible(
          child: Text(
            widget.label,
            overflow: TextOverflow.ellipsis,
            style: AppText.sans(widget.dense ? 14 : 15.5, color: fg, weight: FontWeight.w500),
          ),
        ),
        if (widget.trailing != null) ...[
          SizedBox(width: widget.dense ? 8 : 10),
          Icon(widget.trailing, color: fg, size: 18),
        ],
      ],
    );

    return Semantics(
      button: true,
      enabled: !disabled,
      label: widget.label,
      excludeSemantics: true,
      child: GestureDetector(
        onTapDown: disabled ? null : (_) => setState(() => _down = true),
        onTapCancel: () => setState(() => _down = false),
        onTapUp: (_) => setState(() => _down = false),
        onTap: disabled
            ? null
            : () {
                HapticFeedback.lightImpact();
                widget.onTap!();
              },
        child: AnimatedScale(
          scale: _down ? 0.96 : 1,
          duration: const Duration(milliseconds: 160),
          child: AnimatedOpacity(
            duration: const Duration(milliseconds: 200),
            opacity: disabled ? 0.5 : 1,
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: widget.dense ? 14 : 24, vertical: widget.dense ? 13 : 15),
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: border),
              ),
              child: content,
            ),
          ),
        ),
      ),
    );
  }
}

/// Round outlined icon button (top bar, controls).
class CircleIconButton extends StatelessWidget {
  const CircleIconButton({super.key, required this.child, required this.onTap, required this.tooltip, this.size = 42, this.filled = false});
  final Widget child;
  final VoidCallback onTap;
  final String tooltip;
  final double size;
  final bool filled;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Tooltip(
      message: tooltip,
      child: Material(
        color: filled ? p.brand : Colors.transparent,
        shape: CircleBorder(side: BorderSide(color: filled ? p.brand : p.line)),
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: () {
            HapticFeedback.selectionClick();
            onTap();
          },
          child: SizedBox.square(
            dimension: size,
            child: Center(
              child: IconTheme(data: IconThemeData(color: filled ? p.brandInk : p.ink, size: 18), child: child),
            ),
          ),
        ),
      ),
    );
  }
}

/// WhatsApp-style glyph: a speech bubble with a phone (Material has no WhatsApp icon).
class WhatsAppGlyph extends StatelessWidget {
  const WhatsAppGlyph({super.key, this.size = 18, this.color});
  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final c = color ?? IconTheme.of(context).color ?? context.palette.ink;
    return SizedBox.square(
      dimension: size,
      child: CustomPaint(
        painter: _BubblePainter(c),
        child: Center(child: Icon(Icons.call, size: size * 0.46, color: c)),
      ),
    );
  }
}

class _BubblePainter extends CustomPainter {
  _BubblePainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width;
    final stroke = s * 0.09;
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeJoin = StrokeJoin.round
      ..strokeCap = StrokeCap.round;
    final center = Offset(s * 0.53, s * 0.47);
    final r = s * 0.40;
    // Circle with a gap at the lower-left for the tail.
    final rect = Rect.fromCircle(center: center, radius: r);
    final path = Path()..addArc(rect, math.pi * 0.78, math.pi * 1.86);
    // Tail.
    final a = center + Offset(math.cos(math.pi * 0.64) * r, math.sin(math.pi * 0.64) * r);
    final b = center + Offset(math.cos(math.pi * 0.78) * r, math.sin(math.pi * 0.78) * r);
    path
      ..moveTo(a.dx, a.dy)
      ..lineTo(s * 0.10, s * 0.92)
      ..lineTo(b.dx, b.dy);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_BubblePainter old) => old.color != color;
}

/// Pulsing orange dot used next to "Available for freelance".
class PulseDot extends StatefulWidget {
  const PulseDot({super.key, this.size = 8, this.color});
  final double size;
  final Color? color;

  @override
  State<PulseDot> createState() => _PulseDotState();
}

class _PulseDotState extends State<PulseDot> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1600));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.of(context).disableAnimations) {
      _c.stop();
    } else if (!_c.isAnimating) {
      _c.repeat();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? context.palette.brand;
    return SizedBox.square(
      dimension: widget.size * 2.4,
      child: AnimatedBuilder(
        animation: _c,
        builder: (_, __) => Stack(
          alignment: Alignment.center,
          children: [
            Container(
              width: widget.size * (1 + _c.value * 1.4),
              height: widget.size * (1 + _c.value * 1.4),
              decoration: BoxDecoration(shape: BoxShape.circle, color: color.withOpacity(0.55 * (1 - _c.value))),
            ),
            Container(width: widget.size, height: widget.size, decoration: BoxDecoration(shape: BoxShape.circle, color: color)),
          ],
        ),
      ),
    );
  }
}

/// Typographic placeholder used when a project or post has no image.
class Poster extends StatelessWidget {
  const Poster({super.key, this.title});
  final String? title;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      color: p.surface,
      child: CustomPaint(
        painter: _StripePainter(p.line),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Align(
            alignment: Alignment.bottomLeft,
            child: title == null
                ? const SizedBox.shrink()
                : Text(
                    title!,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: AppText.serif(32, color: p.ink.withOpacity(0.7), italic: true, height: 0.95),
                  ),
          ),
        ),
      ),
    );
  }
}

class _StripePainter extends CustomPainter {
  _StripePainter(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 1;
    for (double x = -size.height; x < size.width; x += 14) {
      canvas.drawLine(Offset(x, size.height), Offset(x + size.height, 0), paint);
    }
  }

  @override
  bool shouldRepaint(_StripePainter old) => old.color != color;
}

/// Network (or data:) image that shimmers while loading and falls back to a [Poster].
class NetImage extends StatelessWidget {
  const NetImage(this.url, {super.key, this.title, this.fit = BoxFit.cover, this.alignment = Alignment.topCenter});
  final String url;
  final String? title;
  final BoxFit fit;
  final Alignment alignment;

  @override
  Widget build(BuildContext context) {
    if (url.isEmpty) return Poster(title: title);
    if (url.startsWith('data:image')) {
      try {
        final bytes = base64Decode(url.substring(url.indexOf(',') + 1));
        return Image.memory(bytes, fit: fit, alignment: alignment, errorBuilder: (_, __, ___) => Poster(title: title));
      } catch (_) {
        return Poster(title: title);
      }
    }
    return Image.network(
      url,
      fit: fit,
      alignment: alignment,
      gaplessPlayback: true,
      loadingBuilder: (context, child, progress) => progress == null ? child : const ShimmerBox(),
      frameBuilder: (context, child, frame, sync) => sync
          ? child
          : AnimatedOpacity(
              opacity: frame == null ? 0 : 1,
              duration: const Duration(milliseconds: 500),
              curve: Curves.easeOut,
              child: child,
            ),
      errorBuilder: (_, __, ___) => Poster(title: title),
    );
  }
}

/// Shimmering block used while content loads.
class ShimmerBox extends StatelessWidget {
  const ShimmerBox({super.key, this.height, this.width, this.radius = 0});
  final double? height;
  final double? width;
  final double radius;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Shimmer.fromColors(
      baseColor: p.surface,
      highlightColor: p.surface2,
      child: Container(
        height: height,
        width: width,
        decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(radius)),
      ),
    );
  }
}

/// Small rounded label chip.
class Tag extends StatelessWidget {
  const Tag(this.text, {super.key, this.filled = false, this.onDark = false});
  final String text;
  final bool filled;
  final bool onDark;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final bg = filled ? p.brand : (onDark ? Colors.black.withOpacity(0.55) : Colors.transparent);
    final fg = filled ? p.brandInk : (onDark ? Colors.white : p.dim);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
        border: filled || onDark ? null : Border.all(color: p.line),
      ),
      child: Text(text.toUpperCase(), style: AppText.mono(9.5, color: fg)),
    );
  }
}

/// Current time in Mumbai, refreshed every 15 seconds.
class MumbaiClock extends StatefulWidget {
  const MumbaiClock({super.key, this.style, this.prefix = 'Mumbai '});
  final TextStyle? style;
  final String prefix;

  @override
  State<MumbaiClock> createState() => _MumbaiClockState();
}

class _MumbaiClockState extends State<MumbaiClock> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 15), (_) => setState(() {}));
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = DateTime.now().toUtc().add(const Duration(hours: 5, minutes: 30));
    return Text('${widget.prefix}${pad2(t.hour)}:${pad2(t.minute)} IST', style: widget.style);
  }
}

/// Collapsing top bar used on every tab: name on the left, WhatsApp + theme on the right.
class SiteTopBar extends StatelessWidget {
  const SiteTopBar({super.key, this.title});
  final String? title;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final theme = context.watch<ThemeController>();
    return SliverAppBar(
      floating: true,
      snap: true,
      toolbarHeight: 64,
      backgroundColor: p.canvas.withOpacity(0.92),
      titleSpacing: 20,
      title: Text.rich(
        TextSpan(
          style: AppText.serif(24, color: p.ink),
          children: const [
            TextSpan(text: 'Sachin '),
            TextSpan(text: 'Rathod', style: TextStyle(fontStyle: FontStyle.italic)),
          ],
        ),
      ),
      actions: [
        CircleIconButton(
          tooltip: 'Chat on WhatsApp',
          onTap: () => openLink(context, Site.whatsappUrl()),
          child: const WhatsAppGlyph(),
        ),
        const SizedBox(width: 8),
        CircleIconButton(
          tooltip: theme.isDark ? 'Switch to light theme' : 'Switch to dark theme',
          onTap: theme.toggle,
          child: AnimatedRotation(
            turns: theme.isDark ? 0 : 0.5,
            duration: const Duration(milliseconds: 600),
            curve: kEaseExpo,
            child: const Icon(Icons.contrast),
          ),
        ),
        const SizedBox(width: 16),
      ],
      bottom: PreferredSize(preferredSize: const Size.fromHeight(1), child: Hairline(key: ValueKey(title))),
    );
  }
}

/// Large editorial page title, like the website's inner pages.
class PageTitle extends StatelessWidget {
  const PageTitle({super.key, required this.label, required this.title, this.italic, this.count, this.meta, this.intro});
  final String label;
  final String title;
  final String? italic;
  final int? count;
  final String? meta;
  final String? intro;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Reveal(
            offset: 0,
            duration: const Duration(milliseconds: 700),
            child: Row(
              children: [
                SectionLabel('($label)'),
                const Spacer(),
                if (meta != null) SectionLabel(meta!),
              ],
            ),
          ),
          const SizedBox(height: 18),
          SerifHeading(title, italic: italic, count: count, size: 62),
          if (intro != null) ...[
            const SizedBox(height: 18),
            Reveal(
              delay: const Duration(milliseconds: 380),
              offset: 18,
              child: Text(intro!, style: AppText.sans(16.5, color: p.ink.withOpacity(0.78))),
            ),
          ],
        ],
      ),
    );
  }
}

/// Empty / error / waking-server message with an optional retry.
class StatusMessage extends StatelessWidget {
  const StatusMessage({super.key, required this.title, required this.text, this.onRetry});
  final String title;
  final String text;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(20)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppText.serif(28, color: p.ink)),
          const SizedBox(height: 8),
          Text(text, style: AppText.sans(14.5, color: p.dim)),
          if (onRetry != null) ...[
            const SizedBox(height: 16),
            PillButton(label: 'Try again', style: PillStyle.ink, dense: true, onTap: onRetry, trailing: Icons.refresh_rounded),
          ],
        ],
      ),
    );
  }
}
