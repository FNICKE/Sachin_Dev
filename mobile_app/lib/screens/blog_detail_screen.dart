import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/blog.dart';

class BlogDetailScreen extends StatelessWidget {
  final Blog blog;
  const BlogDetailScreen({super.key, required this.blog});

  // ── Strip HTML tags from content ──────────────────────────
  String _stripHtml(String html) {
    return html
        .replaceAll(RegExp(r'<br\s*/?>'), '\n')
        .replaceAll(RegExp(r'<p[^>]*>'), '')
        .replaceAll('</p>', '\n\n')
        .replaceAll(RegExp(r'<h[1-6][^>]*>'), '\n')
        .replaceAll(RegExp(r'</h[1-6]>'), '\n')
        .replaceAll(RegExp(r'<li[^>]*>'), '• ')
        .replaceAll('</li>', '\n')
        .replaceAll(RegExp(r'<ul[^>]*>|</ul>|<ol[^>]*>|</ol>'), '')
        .replaceAll(RegExp(r'<strong[^>]*>|</strong>|<b[^>]*>|</b>'), '')
        .replaceAll(RegExp(r'<em[^>]*>|</em>|<i[^>]*>|</i>'), '')
        .replaceAll(RegExp(r'<[^>]+>'), '')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&quot;', '"')
        .replaceAll(RegExp(r'\n{3,}'), '\n\n')
        .trim();
  }

  @override
  Widget build(BuildContext context) {
    final formattedDate = DateFormat.yMMMMd().format(blog.createdAt);
    final cleanContent = _stripHtml(blog.content);

    return Scaffold(
      backgroundColor: const Color(0xFF020817),
      body: CustomScrollView(
        slivers: [
          // ── Collapsing App Bar with Cover Image ────────────
          SliverAppBar(
            expandedHeight: blog.coverUrl.isNotEmpty ? 280 : 120,
            pinned: true,
            backgroundColor: const Color(0xFF0F172A),
            foregroundColor: Colors.white,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              background: blog.coverUrl.isNotEmpty
                  ? Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.network(
                          blog.coverUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => _coverPlaceholder(),
                        ),
                        // Dark gradient overlay
                        DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                const Color(0xFF020817).withOpacity(0.95),
                              ],
                              stops: const [0.3, 1.0],
                            ),
                          ),
                        ),
                      ],
                    )
                  : _coverPlaceholder(),
            ),
            title: const Text(
              'Read Article',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ),

          // ── Main Content ───────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 60),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Meta row ────────────────────────────────
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: const Color(0xFF06B6D4).withOpacity(0.08),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.25)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.calendar_today_rounded, size: 11, color: Color(0xFF67E8F9)),
                            const SizedBox(width: 5),
                            Text(
                              formattedDate,
                              style: const TextStyle(fontSize: 11, color: Color(0xFF67E8F9), fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6366F1).withOpacity(0.08),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.25)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.timer_outlined, size: 11, color: Color(0xFF818CF8)),
                            const SizedBox(width: 5),
                            Text(
                              '${blog.readTime} min read',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF818CF8), fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // ── Title ────────────────────────────────────
                  Text(
                    blog.title,
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      height: 1.25,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // ── TAGS ─────────────────────────────────────
                  if (blog.tags.isNotEmpty) ...[
                    _buildTagsSection(),
                    const SizedBox(height: 20),
                  ],

                  // ── Excerpt ──────────────────────────────────
                  if (blog.excerpt.isNotEmpty) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(14),
                        border: Border(
                          left: BorderSide(color: const Color(0xFF6366F1), width: 3),
                        ),
                      ),
                      child: Text(
                        blog.excerpt,
                        style: TextStyle(
                          fontSize: 15,
                          color: const Color(0xFF94A3B8).withOpacity(0.9),
                          fontStyle: FontStyle.italic,
                          height: 1.6,
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // ── Divider ──────────────────────────────────
                  Container(
                    height: 1,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Colors.transparent, Color(0xFF334155), Colors.transparent],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // ── Content Body ─────────────────────────────
                  ..._buildContentWidgets(cleanContent),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Tags section ────────────────────────────────────────────
  Widget _buildTagsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.label_outline_rounded, size: 14, color: Color(0xFF818CF8)),
            const SizedBox(width: 6),
            const Text(
              'TAGS',
              style: TextStyle(
                color: Color(0xFF818CF8),
                fontSize: 11,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: blog.tags.map((tag) {
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1).withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.35)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('#', style: TextStyle(color: Color(0xFF818CF8), fontSize: 12, fontWeight: FontWeight.w900)),
                  const SizedBox(width: 2),
                  Text(
                    tag,
                    style: const TextStyle(
                      color: Color(0xFFA5B4FC),
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  // ── Content paragraphs ───────────────────────────────────────
  List<Widget> _buildContentWidgets(String content) {
    if (content.isEmpty) {
      return [
        Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Text('No content available.',
              style: TextStyle(color: const Color(0xFF94A3B8).withOpacity(0.5), fontSize: 15)),
          ),
        ),
      ];
    }

    final paragraphs = content.split('\n\n');
    final widgets = <Widget>[];

    for (final para in paragraphs) {
      final trimmed = para.trim();
      if (trimmed.isEmpty) continue;

      // Heading detection
      if (trimmed.startsWith('# ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 28, bottom: 10),
          child: Text(
            trimmed.replaceFirst('# ', ''),
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.3),
          ),
        ));
      } else if (trimmed.startsWith('## ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 22, bottom: 8),
          child: Text(
            trimmed.replaceFirst('## ', ''),
            style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w800, color: Colors.white),
          ),
        ));
      } else if (trimmed.startsWith('### ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 18, bottom: 6),
          child: Text(
            trimmed.replaceFirst('### ', ''),
            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: Color(0xFFA5B4FC)),
          ),
        ));
      } else if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        // Bullet list item
        final lines = trimmed.split('\n');
        for (final line in lines) {
          final txt = line.replaceFirst(RegExp(r'^[•\-]\s*'), '').trim();
          if (txt.isEmpty) continue;
          widgets.add(Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(top: 6),
                  child: CircleAvatar(radius: 3, backgroundColor: Color(0xFF6366F1)),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(txt,
                    style: const TextStyle(fontSize: 15, color: Color(0xFFCBD5E1), height: 1.65)),
                ),
              ],
            ),
          ));
        }
      } else {
        // Normal paragraph
        widgets.add(Padding(
          padding: const EdgeInsets.only(bottom: 18),
          child: Text(
            trimmed,
            style: const TextStyle(
              fontSize: 15,
              color: Color(0xFFCBD5E1),
              height: 1.75,
              letterSpacing: 0.1,
            ),
          ),
        ));
      }
    }

    return widgets;
  }

  Widget _coverPlaceholder() {
    return Container(
      color: const Color(0xFF0F172A),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.article_rounded, color: Color(0xFF818CF8), size: 40),
            ),
          ],
        ),
      ),
    );
  }
}
