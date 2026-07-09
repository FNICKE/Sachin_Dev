import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/project.dart';

// ── Color constants ───────────────────────────────────────────
const Color _kBg      = Color(0xFF020817);
const Color _kSurface = Color(0xFF0F172A);
const Color _kCard    = Color(0xFF1E293B);
const Color _kIndigo  = Color(0xFF6366F1);
const Color _kPurple  = Color(0xFF8B5CF6);
const Color _kPink    = Color(0xFFEC4899);
const Color _kCyan    = Color(0xFF06B6D4);
const Color _kGreen   = Color(0xFF10B981);
const Color _kText    = Color(0xFF94A3B8);

class ProjectDetailScreen extends StatelessWidget {
  final Project project;
  const ProjectDetailScreen({super.key, required this.project});

  // ── Strip Quill / HTML tags ───────────────────────────────
  String _stripHtml(String html) {
    if (html.isEmpty) return html;
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

  Future<void> _launch(String url, BuildContext context) async {
    if (url.isEmpty) return;
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Could not open: $url')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final desc = _stripHtml(
      project.description.isNotEmpty ? project.description : project.shortDesc,
    );

    return Scaffold(
      backgroundColor: _kBg,
      body: CustomScrollView(
        slivers: [
          // ── Collapsing image app bar ────────────────────────
          SliverAppBar(
            expandedHeight: project.thumbnailUrl.isNotEmpty ? 270 : 110,
            pinned: true,
            backgroundColor: _kSurface,
            foregroundColor: Colors.white,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              background: project.thumbnailUrl.isNotEmpty
                  ? Stack(
                      fit: StackFit.expand,
                      children: [
                        Image.network(
                          project.thumbnailUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => _thumbnailPlaceholder(),
                        ),
                        // gradient overlay
                        DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [
                                Colors.transparent,
                                _kBg.withOpacity(0.97),
                              ],
                              stops: const [0.25, 1.0],
                            ),
                          ),
                        ),
                      ],
                    )
                  : _thumbnailPlaceholder(),
            ),
            title: Text(
              project.title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
              overflow: TextOverflow.ellipsis,
            ),
          ),

          // ── Content ─────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 80),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Status chips ─────────────────────────────
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      if (project.category.isNotEmpty)
                        _Chip(
                          label: project.category.toUpperCase(),
                          color: _kIndigo,
                          icon: Icons.category_outlined,
                        ),
                      if (project.status.isNotEmpty)
                        _Chip(
                          label: project.status.toUpperCase(),
                          color: _kGreen,
                          icon: Icons.circle,
                          iconSize: 8,
                        ),
                      if (project.featured)
                        _Chip(
                          label: 'FEATURED',
                          color: const Color(0xFFEAB308),
                          icon: Icons.star_rounded,
                        ),
                    ],
                  ),
                  const SizedBox(height: 18),

                  // ── Project title ─────────────────────────────
                  Text(
                    project.title,
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      height: 1.2,
                      letterSpacing: -0.5,
                    ),
                  ),

                  if (project.shortDesc.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Text(
                      project.shortDesc,
                      style: TextStyle(
                        fontSize: 15,
                        color: _kText.withOpacity(0.8),
                        height: 1.55,
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),

                  // ── CTA buttons ───────────────────────────────
                  Row(
                    children: [
                      if (project.liveUrl.isNotEmpty)
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _launch(project.liveUrl, context),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [_kIndigo, _kPurple],
                                ),
                                borderRadius: BorderRadius.circular(14),
                                boxShadow: [
                                  BoxShadow(
                                    color: _kIndigo.withOpacity(0.35),
                                    blurRadius: 16,
                                    offset: const Offset(0, 6),
                                  ),
                                ],
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.open_in_new_rounded, color: Colors.white, size: 16),
                                  SizedBox(width: 8),
                                  Text('Live Demo',
                                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      if (project.liveUrl.isNotEmpty && project.githubUrl.isNotEmpty)
                        const SizedBox(width: 12),
                      if (project.githubUrl.isNotEmpty)
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _launch(project.githubUrl, context),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: Colors.white.withOpacity(0.15)),
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.code_rounded, color: Colors.white, size: 16),
                                  SizedBox(width: 8),
                                  Text('Source Code',
                                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                                ],
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // ── Gradient divider ──────────────────────────
                  _gradientDivider(),
                  const SizedBox(height: 28),

                  // ── About section ─────────────────────────────
                  _sectionHeader(Icons.info_outline_rounded, 'About Project'),
                  const SizedBox(height: 16),
                  ..._buildContentWidgets(desc),
                  const SizedBox(height: 28),

                  // ── Tech stack ────────────────────────────────
                  if (project.techStack.isNotEmpty) ...[
                    _gradientDivider(),
                    const SizedBox(height: 28),
                    _sectionHeader(Icons.layers_rounded, 'Technologies Used'),
                    const SizedBox(height: 14),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: project.techStack.map((tech) => _TechPill(tech: tech)).toList(),
                    ),
                    const SizedBox(height: 28),
                  ],

                  // ── Related skills ────────────────────────────
                  if (project.skills.isNotEmpty) ...[
                    _gradientDivider(),
                    const SizedBox(height: 28),
                    _sectionHeader(Icons.psychology_rounded, 'Related Skills'),
                    const SizedBox(height: 14),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: project.skills.map((skill) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _kCyan.withOpacity(0.07),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: _kCyan.withOpacity(0.3)),
                          ),
                          child: Text(
                            skill.name,
                            style: const TextStyle(color: _kCyan, fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Helpers ──────────────────────────────────────────────────

  Widget _thumbnailPlaceholder() {
    return Container(
      color: _kSurface,
      child: Center(
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: _kIndigo.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.code_rounded, color: _kIndigo, size: 40),
        ),
      ),
    );
  }

  Widget _gradientDivider() {
    return Container(
      height: 1,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.transparent, Color(0xFF334155), Colors.transparent],
        ),
      ),
    );
  }

  Widget _sectionHeader(IconData icon, String title) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: _kIndigo.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: _kIndigo, size: 16),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Colors.white,
            letterSpacing: -0.2,
          ),
        ),
      ],
    );
  }

  // ── Content body builder (same logic as blog detail) ─────────
  List<Widget> _buildContentWidgets(String content) {
    if (content.isEmpty) {
      return [
        Text(
          'No description available.',
          style: TextStyle(color: _kText.withOpacity(0.5), fontSize: 15),
        ),
      ];
    }

    final paragraphs = content.split('\n\n');
    final widgets = <Widget>[];

    for (final para in paragraphs) {
      final trimmed = para.trim();
      if (trimmed.isEmpty) continue;

      if (trimmed.startsWith('# ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 20, bottom: 8),
          child: Text(trimmed.replaceFirst('# ', ''),
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.3)),
        ));
      } else if (trimmed.startsWith('## ')) {
        widgets.add(Padding(
          padding: const EdgeInsets.only(top: 16, bottom: 6),
          child: Text(trimmed.replaceFirst('## ', ''),
            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: Colors.white)),
        ));
      } else if (trimmed.startsWith('• ') || trimmed.contains('\n• ') || trimmed.startsWith('- ')) {
        // Bullet points
        final lines = trimmed.split('\n');
        for (final line in lines) {
          final txt = line.replaceFirst(RegExp(r'^[•\-]\s*'), '').trim();
          if (txt.isEmpty) continue;
          widgets.add(Padding(
            padding: const EdgeInsets.only(bottom: 8, left: 4),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 7),
                  child: Container(
                    width: 5, height: 5,
                    decoration: BoxDecoration(
                      color: _kIndigo.withOpacity(0.8),
                      shape: BoxShape.circle,
                    ),
                  ),
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
        widgets.add(Padding(
          padding: const EdgeInsets.only(bottom: 16),
          child: Text(
            trimmed,
            style: const TextStyle(fontSize: 15, color: Color(0xFFCBD5E1), height: 1.75, letterSpacing: 0.1),
          ),
        ));
      }
    }

    return widgets;
  }
}

// ── Reusable chip widget ─────────────────────────────────────
class _Chip extends StatelessWidget {
  final String label;
  final Color color;
  final IconData icon;
  final double iconSize;

  const _Chip({required this.label, required this.color, required this.icon, this.iconSize = 12});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: iconSize, color: color),
          const SizedBox(width: 5),
          Text(label, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
        ],
      ),
    );
  }
}

// ── Tech pill with brand colors ──────────────────────────────
class _TechPill extends StatelessWidget {
  final String tech;
  const _TechPill({required this.tech});

  static const Map<String, Color> _colors = {
    'React'      : Color(0xFF61DAFB),
    'Next.js'    : Colors.white,
    'Node.js'    : Color(0xFF68A063),
    'MySQL'      : Color(0xFF00758F),
    'MongoDB'    : Color(0xFF4DB33D),
    'TypeScript' : Color(0xFF3178C6),
    'JavaScript' : Color(0xFFF7DF1E),
    'Python'     : Color(0xFF3776AB),
    'Express'    : Color(0xFFA5B4FC),
    'Tailwind'   : Color(0xFF38BDF8),
    'CSS'        : Color(0xFF1572B6),
    'HTML'       : Color(0xFFE34F26),
    'Redux'      : Color(0xFF764ABC),
    'Flutter'    : Color(0xFF54C5F8),
    'Firebase'   : Color(0xFFFFCA28),
    'GraphQL'    : Color(0xFFE10098),
  };

  @override
  Widget build(BuildContext context) {
    final color = _colors[tech] ?? _kIndigo;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.28)),
      ),
      child: Text(tech, style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.w700)),
    );
  }
}
