import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/portfolio_provider.dart';
import '../models/skill.dart';

class SkillsScreen extends StatefulWidget {
  const SkillsScreen({super.key});

  @override
  State<SkillsScreen> createState() => _SkillsScreenState();
}

class _SkillsScreenState extends State<SkillsScreen> {
  String _activeCategory = 'All';

  final Map<String, Color> _skillColors = const {
    'react': Color(0xFF61DAFB),
    'next.js': Colors.white,
    'nextjs': Colors.white,
    'html': Color(0xFFE34F26),
    'html5': Color(0xFFE34F26),
    'css': Color(0xFF1572B6),
    'css3': Color(0xFF1572B6),
    'javascript': Color(0xFFF7DF1E),
    'js': Color(0xFFF7DF1E),
    'typescript': Color(0xFF3178C6),
    'ts': Color(0xFF3178C6),
    'node.js': Color(0xFF339933),
    'nodejs': Color(0xFF339933),
    'express': Colors.white,
    'express.js': Colors.white,
    'mysql': Color(0xFF4479A1),
    'mongodb': Color(0xFF47A248),
    'git': Color(0xFFF05032),
    'github': Colors.white,
    'docker': Color(0xFF2496ED),
    'python': Color(0xFF3776AB),
    'tailwind': Color(0xFF06B6D4),
    'tailwindcss': Color(0xFF06B6D4),
    'flutter': Color(0xFF54C5F8),
    'dart': Color(0xFF0175C2),
    'graphql': Color(0xFFE10098),
    'redux': Color(0xFF764ABC),
  };

  Color _getColor(String name) {
    return _skillColors[name.toLowerCase().trim()] ?? const Color(0xFF6366F1);
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<PortfolioProvider>(context);
    final skills = provider.skills;

    if (skills.isEmpty && !provider.isLoading) {
      return Scaffold(
        backgroundColor: const Color(0xFF020817),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.bolt_outlined,
                  color: const Color(0xFF1E293B), size: 52),
              const SizedBox(height: 16),
              const Text(
                'No skills loaded yet.',
                style: TextStyle(color: Color(0xFF475569), fontSize: 16),
              ),
            ],
          ),
        ),
      );
    }

    // Extract categories
    final Set<String> categorySet = {'All'};
    for (final skill in skills) {
      if (skill.category.isNotEmpty) {
        categorySet.add(
            skill.category[0].toUpperCase() +
                skill.category.substring(1).toLowerCase());
      }
    }
    final categories = categorySet.toList();

    // Filter and sort
    final filtered = skills.where((skill) {
      if (_activeCategory == 'All') return true;
      return skill.category.toLowerCase() == _activeCategory.toLowerCase();
    }).toList()
      ..sort((a, b) => b.level.compareTo(a.level));

    // Group by category for "All" view
    final Map<String, List<Skill>> grouped = {};
    if (_activeCategory == 'All') {
      for (final skill in filtered) {
        final cat = skill.category.isEmpty
            ? 'Other'
            : (skill.category[0].toUpperCase() +
                skill.category.substring(1).toLowerCase());
        grouped.putIfAbsent(cat, () => []).add(skill);
      }
    }

    return Scaffold(
      backgroundColor: const Color(0xFF020817),
      body: CustomScrollView(
        slivers: [
          // Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 56, 20, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Label
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEC4899).withOpacity(0.08),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: const Color(0xFFEC4899).withOpacity(0.2),
                      ),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.bolt_rounded,
                            size: 12, color: Color(0xFFF9A8D4)),
                        SizedBox(width: 6),
                        Text(
                          'Tech Arsenal',
                          style: TextStyle(
                            color: Color(0xFFF9A8D4),
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
                          text: 'Skills & ',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -0.8,
                          ),
                        ),
                        TextSpan(
                          text: 'Toolkit',
                          style: TextStyle(
                            foreground: Paint()
                              ..shader = const LinearGradient(
                                colors: [Color(0xFFF9A8D4), Color(0xFF818CF8)],
                              ).createShader(
                                  Rect.fromLTWH(0, 0, 200, 50)),
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
                    'Technologies and tools I work with to build production-grade solutions.',
                    style: TextStyle(
                      color: const Color(0xFF94A3B8).withOpacity(0.75),
                      fontSize: 14,
                      height: 1.55,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Category filter chips
                  SizedBox(
                    height: 38,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: categories.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final cat = categories[index];
                        final isSelected = _activeCategory == cat;
                        return GestureDetector(
                          onTap: () => setState(() => _activeCategory = cat),
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
                              color: isSelected
                                  ? null
                                  : const Color(0xFF0F172A),
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
                                            .withOpacity(0.35),
                                        blurRadius: 12,
                                        offset: const Offset(0, 4),
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Text(
                              cat,
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
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),

          // Skills content
          if (_activeCategory == 'All')
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final catEntry = grouped.entries.elementAt(index);
                    return _buildCategorySection(
                        catEntry.key, catEntry.value);
                  },
                  childCount: grouped.length,
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
              sliver: SliverToBoxAdapter(
                child: _buildSkillsWrap(filtered),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCategorySection(String category, List<Skill> skills) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Category header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFF1E293B)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(7),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.folder_open_rounded,
                          color: Color(0xFF818CF8), size: 14),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      category,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.3,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      '${skills.length} skill${skills.length != 1 ? 's' : ''}',
                      style: const TextStyle(
                        color: Color(0xFF475569),
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildSkillsWrap(skills),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSkillsWrap(List<Skill> skills) {
    return Wrap(
      spacing: 8,
      runSpacing: 10,
      children: skills.map((skill) => _buildSkillPill(skill)).toList(),
    );
  }

  Widget _buildSkillPill(Skill skill) {
    final color = _getColor(skill.name);
    final levelLabel = skill.level >= 85
        ? 'Expert'
        : skill.level >= 65
            ? 'Advanced'
            : skill.level >= 40
                ? 'Intermediate'
                : 'Beginner';
    final levelColor = skill.level >= 85
        ? const Color(0xFF22C55E)
        : skill.level >= 65
            ? const Color(0xFF818CF8)
            : skill.level >= 40
                ? const Color(0xFFF59E0B)
                : const Color(0xFF64748B);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.04),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Dot indicator
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            skill.name,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
            decoration: BoxDecoration(
              color: levelColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              levelLabel,
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.w800,
                color: levelColor,
                letterSpacing: 0.3,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
