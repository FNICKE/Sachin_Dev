import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../models/project.dart';
import '../providers/portfolio_provider.dart';
import '../services/links.dart';
import '../theme/app_theme.dart';
import '../widgets/project_card.dart';
import '../widgets/reveal.dart';
import '../widgets/rich_content.dart';
import '../widgets/ui.dart';
import 'shell.dart';

/// A project card that grows into the project page when tapped (container transform).
class ProjectTile extends StatelessWidget {
  const ProjectTile({super.key, required this.project, required this.index, this.large = false});
  final Project project;
  final int index;
  final bool large;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return OpenContainer(
      tappable: false,
      closedElevation: 0,
      openElevation: 0,
      closedColor: p.canvas,
      openColor: p.canvas,
      middleColor: p.canvas,
      closedShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      transitionType: ContainerTransitionType.fadeThrough,
      transitionDuration: const Duration(milliseconds: 550),
      openBuilder: (_, __) => ProjectScreen(project: project),
      closedBuilder: (_, open) => ProjectCard(project: project, index: index, large: large, onTap: open),
    );
  }
}

class ProjectScreen extends StatelessWidget {
  const ProjectScreen({super.key, required this.project});
  final Project project;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final pr = project;
    final all = context.watch<PortfolioProvider>().orderedProjects;
    final index = all.indexWhere((x) => x.id == pr.id);
    final next = all.length > 1 && index >= 0 ? all[(index + 1) % all.length] : null;
    final type = categoryLabel(pr.category);

    final facts = [
      ('Year', pr.year?.toString() ?? '—'),
      ('Type', type),
      ('Status', statusLabels[pr.status] ?? pr.status),
      ('Stack', pr.techStack.isEmpty ? '—' : pr.techStack.join(', ')),
    ];

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            stretch: true,
            expandedHeight: MediaQuery.of(context).size.width * 0.78,
            backgroundColor: p.canvas,
            leading: Padding(
              padding: const EdgeInsets.all(8),
              child: CircleIconButton(
                tooltip: 'Back',
                size: 40,
                filled: true,
                onTap: () => Navigator.of(context).maybePop(),
                child: const Icon(Icons.arrow_back_rounded),
              ),
            ),
            flexibleSpace: FlexibleSpaceBar(
              collapseMode: CollapseMode.parallax,
              stretchModes: const [StretchMode.zoomBackground],
              background: Stack(
                fit: StackFit.expand,
                children: [
                  NetImage(pr.thumbnailUrl, title: pr.title),
                  const DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.center,
                        colors: [Color(0x99000000), Colors.transparent],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 24, 20, MediaQuery.of(context).padding.bottom + 40),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Tag(type),
                      const SizedBox(width: 8),
                      if (pr.featured) const Tag('Featured', filled: true),
                      const Spacer(),
                      if (index >= 0) SectionLabel('Case ${pad2(index + 1)}/${pad2(all.length)}'),
                    ],
                  ),
                  const SizedBox(height: 18),
                  Reveal(child: Text(pr.title, style: AppText.serif(56, color: p.ink, height: 0.92))),
                  if (pr.shortDesc.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Reveal(
                      delay: const Duration(milliseconds: 80),
                      child: Text(pr.shortDesc, style: AppText.sans(18, color: p.ink.withOpacity(0.85), height: 1.4)),
                    ),
                  ],
                  const SizedBox(height: 22),
                  Reveal(
                    delay: const Duration(milliseconds: 140),
                    child: Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        if (pr.liveUrl.isNotEmpty)
                          PillButton(
                            label: 'Visit live site',
                            style: PillStyle.ink,
                            trailing: Icons.north_east_rounded,
                            onTap: () => openLink(context, pr.liveUrl),
                          ),
                        if (pr.githubUrl.isNotEmpty)
                          PillButton(
                            label: 'Source code',
                            style: PillStyle.outline,
                            trailing: Icons.north_east_rounded,
                            onTap: () => openLink(context, pr.githubUrl),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),
                  _FactsGrid(facts: facts),
                  const SizedBox(height: 36),
                  const SectionLabel('(Overview)'),
                  const SizedBox(height: 14),
                  RichContent(
                    pr.description,
                    emptyText: pr.shortDesc.isNotEmpty
                        ? null
                        : 'A ${type.toLowerCase()} project${pr.liveUrl.isNotEmpty ? ' — the best way to see it is live.' : '.'}',
                  ),
                  if (pr.techStack.isNotEmpty) ...[
                    const SizedBox(height: 36),
                    const SectionLabel('Built with'),
                    const SizedBox(height: 10),
                    const Hairline(),
                    for (var i = 0; i < pr.techStack.length; i++)
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: p.line))),
                        child: Row(
                          children: [
                            Expanded(child: Text(pr.techStack[i], style: AppText.sans(16, color: p.ink))),
                            Text(pad2(i + 1), style: AppText.mono(10, color: p.dim)),
                          ],
                        ),
                      ),
                  ],
                  if (pr.skills.isNotEmpty) ...[
                    const SizedBox(height: 28),
                    const SectionLabel('Skills used'),
                    const SizedBox(height: 10),
                    Wrap(spacing: 8, runSpacing: 8, children: [for (final s in pr.skills) Tag(s.name)]),
                  ],
                  const SizedBox(height: 36),
                  _SimilarProjectCta(project: pr),
                  if (next != null && next.id != pr.id) ...[
                    const SizedBox(height: 36),
                    const Hairline(),
                    const SizedBox(height: 22),
                    const SectionLabel('(Next project)'),
                    const SizedBox(height: 14),
                    ProjectTile(project: next, index: (index + 1) % all.length, large: true),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FactsGrid extends StatelessWidget {
  const _FactsGrid({required this.facts});
  final List<(String, String)> facts;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    Widget cell((String, String) f, {bool left = false}) => Expanded(
          child: Container(
            padding: EdgeInsets.fromLTRB(left ? 14 : 0, 14, 10, 14),
            decoration: left ? BoxDecoration(border: Border(left: BorderSide(color: p.line))) : null,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SectionLabel(f.$1),
                const SizedBox(height: 6),
                Text(f.$2, style: AppText.sans(16, color: p.ink, height: 1.3)),
              ],
            ),
          ),
        );

    return Container(
      decoration: BoxDecoration(border: Border.symmetric(horizontal: BorderSide(color: p.line))),
      child: Column(
        children: [
          IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [cell(facts[0]), cell(facts[1], left: true)])),
          const Hairline(),
          IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [cell(facts[2]), cell(facts[3], left: true)])),
        ],
      ),
    );
  }
}

/// "Want something like this?" — opens WhatsApp with the project name filled in.
class _SimilarProjectCta extends StatelessWidget {
  const _SimilarProjectCta({required this.project});
  final Project project;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Reveal(
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(22)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text.rich(
              TextSpan(
                style: AppText.serif(34, color: p.ink, height: 1),
                children: [
                  const TextSpan(text: 'Want something '),
                  TextSpan(text: 'like this?', style: TextStyle(fontStyle: FontStyle.italic, color: p.brand)),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Text(
              "Tell me about your idea — I'll reply with a plan and a timeline.",
              style: AppText.sans(15, color: p.dim),
            ),
            const SizedBox(height: 18),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: [
                PillButton(
                  label: 'WhatsApp me',
                  leading: const WhatsAppGlyph(),
                  onTap: () => openLink(
                    context,
                    Site.whatsappUrl("Hi Sachin, I saw ${project.title} in your app and I'd like something similar."),
                  ),
                ),
                PillButton(label: 'Start a project', style: PillStyle.outline, onTap: () => goToTab(context, kContact)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
