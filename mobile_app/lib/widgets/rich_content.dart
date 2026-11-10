import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../theme/app_theme.dart';
import 'ui.dart';

enum _Kind { heading, paragraph, bullet, quote, code, image }

class _Block {
  const _Block(this.kind, this.text, {this.level = 2});
  final _Kind kind;
  final String text; // text, or image URL for images
  final int level;
}

const _entities = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
};

String _decode(String s) {
  var out = s.replaceAll(' ', ' ');
  _entities.forEach((k, v) => out = out.replaceAll(k, v));
  return out.replaceAllMapped(RegExp(r'&#(\d+);'), (m) => String.fromCharCode(int.parse(m[1]!)));
}

String _text(String html) => _decode(html.replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n').replaceAll(RegExp(r'<[^>]+>'), ''))
    .replaceAll(RegExp(r'[ \t]+'), ' ')
    .trim();

final _blockRe = RegExp(
  r'<(h[1-6]|p|li|blockquote|pre)\b[^>]*>([\s\S]*?)</\1>|<img\b[^>]*?src="([^"]+)"[^>]*>',
  caseSensitive: false,
);
final _imgRe = RegExp(r'<img\b[^>]*?src="([^"]+)"[^>]*>', caseSensitive: false);

/// Turns the rich-text HTML from the admin editor (Quill) into simple blocks.
List<_Block> _parse(String html) {
  final blocks = <_Block>[];
  final source = html.trim();
  if (source.isEmpty) return blocks;

  final matches = _blockRe.allMatches(source).toList();
  if (matches.isEmpty) {
    for (final para in _text(source).split(RegExp(r'\n\s*\n'))) {
      if (para.trim().isNotEmpty) blocks.add(_Block(_Kind.paragraph, para.trim()));
    }
    return blocks;
  }

  for (final m in matches) {
    if (m[3] != null) {
      blocks.add(_Block(_Kind.image, m[3]!));
      continue;
    }
    final tag = m[1]!.toLowerCase();
    final inner = m[2] ?? '';
    for (final img in _imgRe.allMatches(inner)) {
      blocks.add(_Block(_Kind.image, img[1]!));
    }
    final text = _text(inner);
    if (text.isEmpty) continue;
    if (tag.startsWith('h')) {
      blocks.add(_Block(_Kind.heading, text, level: int.tryParse(tag.substring(1)) ?? 2));
    } else if (tag == 'li') {
      blocks.add(_Block(_Kind.bullet, text));
    } else if (tag == 'blockquote') {
      blocks.add(_Block(_Kind.quote, text));
    } else if (tag == 'pre') {
      blocks.add(_Block(_Kind.code, text));
    } else {
      blocks.add(_Block(_Kind.paragraph, text));
    }
  }
  return blocks;
}

/// Renders project descriptions and journal posts in the site's editorial style.
class RichContent extends StatelessWidget {
  const RichContent(this.html, {super.key, this.emptyText});
  final String html;
  final String? emptyText;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final blocks = _parse(html);
    if (blocks.isEmpty) {
      return emptyText == null ? const SizedBox.shrink() : Text(emptyText!, style: AppText.sans(16, color: p.dim));
    }

    final items = <(_Kind, Widget)>[];
    for (final b in blocks) {
      switch (b.kind) {
        case _Kind.heading:
          items.add((b.kind, Padding(
            padding: const EdgeInsets.only(top: 18, bottom: 4),
            child: Text(b.text, style: AppText.serif(b.level <= 2 ? 34 : 28, color: p.ink, height: 1.05)),
          )));
        case _Kind.paragraph:
          items.add((b.kind, Text(b.text, style: AppText.sans(16.5, color: p.ink.withOpacity(0.84), height: 1.65))));
        case _Kind.bullet:
          items.add((b.kind, Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(top: 9, right: 12),
                child: Container(width: 6, height: 6, decoration: BoxDecoration(color: p.brand, shape: BoxShape.circle)),
              ),
              Expanded(child: Text(b.text, style: AppText.sans(16.5, color: p.ink.withOpacity(0.84), height: 1.6))),
            ],
          )));
        case _Kind.quote:
          items.add((b.kind, Container(
            padding: const EdgeInsets.only(left: 16),
            decoration: BoxDecoration(border: Border(left: BorderSide(color: p.brand, width: 2))),
            child: Text(b.text, style: AppText.serif(26, color: p.ink, italic: true, height: 1.2)),
          )));
        case _Kind.code:
          items.add((b.kind, Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: p.line)),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Text(b.text, style: AppText.mono(12.5, color: p.ink, spacing: 0)),
            ),
          )));
        case _Kind.image:
          final url = b.text.startsWith('data:') ? b.text : ApiService.fixImageUrl(b.text);
          if (url.isEmpty) break;
          items.add((b.kind, ClipRRect(
            borderRadius: BorderRadius.circular(14),
            child: NetImage(url, fit: BoxFit.fitWidth),
          )));
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < items.length; i++) ...[
          if (i > 0) SizedBox(height: items[i].$1 == _Kind.bullet && items[i - 1].$1 == _Kind.bullet ? 8 : 16),
          items[i].$2,
        ],
      ],
    );
  }
}
