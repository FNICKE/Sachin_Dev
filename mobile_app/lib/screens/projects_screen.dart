import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/portfolio_provider.dart';
import '../models/project.dart';
import 'project_detail_screen.dart';

class ProjectsScreen extends StatefulWidget {
  const ProjectsScreen({super.key});

  @override
  State<ProjectsScreen> createState() => _ProjectsScreenState();
}

class _ProjectsScreenState extends State<ProjectsScreen> {
  String _selectedTag = 'All';
  final _searchController = TextEditingController();
  String _searchQuery = '';

  final Map<String, Color> _techColors = const {
    'React': Color(0xFF61DAFB),
    'Next.js': Colors.white,
    'Node.js': Color(0xFF68A063),
    'MongoDB': Color(0xFF4DB33D),
    'MySQL': Color(0xFF00758F),
    'TypeScript': Color(0xFF3178C6),
    'JavaScript': Color(0xFFF7DF1E),
    'Python': Color(0xFF3776AB),
    'Express': Color(0xFFA5B4FC),
    'Tailwind': Color(0xFF38BDF8),
    'CSS': Color(0xFF1572B6),
    'HTML': Color(0xFFE34F26),
    'Redux': Color(0xFF764ABC),
    'GraphQL': Color(0xFFE10098),
  };

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Color _getTechColor(String tech) {
    return _techColors[tech] ?? const Color(0xFF6366F1);
  }

  Future<void> _launchUrl(String url, BuildContext context) async {
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
    final provider = Provider.of<PortfolioProvider>(context);
    final allProjects = provider.projects;

    // Build tag list from top 3 techs of each project
    final Set<String> tagSet = {'All'};
    for (final p in allProjects) {
      for (final t in p.techStack.take(3)) {
        tagSet.add(t);
      }
    }
    final tags = tagSet.toList();

    // Filter
    final filtered = allProjects.where((p) {
      final matchTag = _selectedTag == 'All' || p.techStack.contains(_selectedTag);
      final matchSearch = _searchQuery.isEmpty ||
          p.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p.shortDesc.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchTag && matchSearch;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF13131B),
      body: CustomScrollView(
        slivers: [
          // Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 56, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Section label
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withOpacity(0.08),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: const Color(0xFF6366F1).withOpacity(0.2),
                      ),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.work_outline_rounded,
                            size: 12, color: Color(0xFF818CF8)),
                        SizedBox(width: 6),
                        Text(
                          'Selected Work',
                          style: TextStyle(
                            color: Color(0xFF818CF8),
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  RichText(
                    text: TextSpan(
                      children: [
                        const TextSpan(
                          text: 'Architected ',
                          style: TextStyle(
                            fontFamily: 'Outfit',
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.8,
                          ),
                        ),
                        TextSpan(
                          text: 'Solutions',
                          style: TextStyle(
                            fontFamily: 'Outfit',
                            foreground: Paint()
                              ..shader = const LinearGradient(
                                colors: [Color(0xFF818CF8), Color(0xFFEC4899)],
                              ).createShader(Rect.fromLTWH(0, 0, 200, 50)),
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'A curated collection of full-stack engineering projects, from high-performance microservices to fluid mobile experiences.',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      color: const Color(0xFF94A3B8).withOpacity(0.75),
                      fontSize: 14,
                      height: 1.55,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Search bar
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (v) => setState(() => _searchQuery = v),
                      style: const TextStyle(color: Colors.white, fontSize: 14),
                      decoration: const InputDecoration(
                        hintText: 'Search project repository...',
                        hintStyle: TextStyle(color: Color(0xFF475569), fontSize: 14),
                        prefixIcon: Icon(Icons.search_rounded,
                            color: Color(0xFF475569), size: 20),
                        border: InputBorder.none,
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Tag filters
                  SizedBox(
                    height: 38,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: tags.length > 9 ? 9 : tags.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final tag = tags[index];
                        final isSelected = _selectedTag == tag;
                        return GestureDetector(
                          onTap: () => setState(() => _selectedTag = tag),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              gradient: isSelected
                                  ? const LinearGradient(
                                      colors: [
                                        Color(0xFF6366F1),
                                        Color(0xFF8B5CF6)
                                      ],
                                    )
                                  : null,
                              color:
                                  isSelected ? null : const Color(0xFF0F172A),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isSelected
                                    ? Colors.transparent
                                    : const Color(0xFF1E293B),
                              ),
                              boxShadow: isSelected
                                  ? [
                                      BoxShadow(
                                        color: const Color(0xFF6366F1)
                                            .withOpacity(0.4),
                                        blurRadius: 12,
                                        offset: const Offset(0, 4),
                                      )
                                    ]
                                  : null,
                            ),
                            child: Text(
                              tag,
                              style: TextStyle(
                                color: isSelected
                                    ? Colors.white
                                    : const Color(0xFF64748B),
                                fontSize: 12,
                                fontWeight: isSelected
                                    ? FontWeight.bold
                                    : FontWeight.w500,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Count
                  Text(
                    'Showing ${filtered.length} project${filtered.length != 1 ? 's' : ''}',
                    style: const TextStyle(
                      color: Color(0xFF475569),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // Project list
          if (filtered.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.search_off_rounded,
                        color: Color(0xFF334155), size: 52),
                    const SizedBox(height: 16),
                    const Text(
                      'No projects found.',
                      style: TextStyle(
                        color: Color(0xFF475569),
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Try a different search or filter.',
                      style: TextStyle(
                        color: const Color(0xFF475569).withOpacity(0.6),
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) =>
                      _buildProjectCard(filtered[index], context),
                  childCount: filtered.length,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildProjectCard(Project project, BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFF1E293B)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => ProjectDetailScreen(project: project),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // macOS terminal header
            Container(
              height: 38,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              color: const Color(0xFF020817).withOpacity(0.8),
              child: Row(
                children: [
                  _dot(const Color(0xFFFF5F57)),
                  const SizedBox(width: 6),
                  _dot(const Color(0xFFFEBC2E)),
                  const SizedBox(width: 6),
                  _dot(const Color(0xFF28C840)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      '~/projects/${project.slug.isNotEmpty ? project.slug : project.id}',
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 10,
                        color: Color(0xFF6366F1),
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (project.featured)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEAB308).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                            color: const Color(0xFFEAB308).withOpacity(0.35)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.star_rounded,
                              size: 9, color: Color(0xFFEAB308)),
                          SizedBox(width: 3),
                          Text(
                            'FEATURED',
                            style: TextStyle(
                              fontSize: 8,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFFEAB308),
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
            const Divider(height: 1, color: Color(0xFF1E293B)),

            // Thumbnail
            AspectRatio(
              aspectRatio: 16 / 9,
              child: project.thumbnailUrl.isNotEmpty
                  ? Image.network(
                      project.thumbnailUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _imagePlaceholder(),
                    )
                  : _imagePlaceholder(),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          project.title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.3,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(
                        Icons.arrow_outward_rounded,
                        size: 18,
                        color: const Color(0xFF334155),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    project.shortDesc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Color(0xFF64748B),
                      fontSize: 13.5,
                      height: 1.55,
                    ),
                  ),

                  // Divider
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 14),
                    child: Divider(height: 1, color: Color(0xFF1E293B)),
                  ),

                  // Tech chips
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: project.techStack.take(6).map((tech) {
                      final color = _getTechColor(tech);
                      return Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 9, vertical: 4),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.07),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: color.withOpacity(0.22)),
                        ),
                        child: Text(
                          tech,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: color,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Action buttons
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          (project.category).toUpperCase(),
                          style: const TextStyle(
                            fontSize: 10,
                            color: Color(0xFF334155),
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                      if (project.liveUrl.isNotEmpty)
                        GestureDetector(
                          onTap: () => _launchUrl(project.liveUrl, context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 6),
                            margin: const EdgeInsets.only(left: 8),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.open_in_new_rounded,
                                    size: 12, color: Colors.white),
                                SizedBox(width: 4),
                                Text(
                                  'Live',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      if (project.githubUrl.isNotEmpty)
                        GestureDetector(
                          onTap: () => _launchUrl(project.githubUrl, context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 6),
                            margin: const EdgeInsets.only(left: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(8),
                              border:
                                  Border.all(color: const Color(0xFF334155)),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.code_rounded,
                                    size: 12, color: Color(0xFF94A3B8)),
                                SizedBox(width: 4),
                                Text(
                                  'Code',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFF94A3B8),
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _dot(Color color) {
    return Container(
      width: 10,
      height: 10,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );
  }

  Widget _imagePlaceholder() {
    return Container(
      color: const Color(0xFF020817),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.code_rounded,
              color: const Color(0xFF6366F1).withOpacity(0.2),
              size: 42,
            ),
          ],
        ),
      ),
    );
  }
}
