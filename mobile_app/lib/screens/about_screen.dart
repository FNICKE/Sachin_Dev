import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../models/skill.dart';
import '../providers/portfolio_provider.dart';
import '../services/links.dart';
import '../theme/app_theme.dart';
import '../widgets/marquee.dart';
import '../widgets/portrait_card.dart';
import '../widgets/reveal.dart';
import '../widgets/ui.dart';
import 'shell.dart';
import 'site_footer.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key, required this.controller});
  final ScrollController controller;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final data = context.watch<PortfolioProvider>();

    return RefreshIndicator(
      color: p.brand,
      backgroundColor: p.surface,
      onRefresh: data.refreshData,
      child: CustomScrollView(
        controller: controller,
        physics: const AlwaysScrollableScrollPhysics(
            parent: BouncingScrollPhysics()),
        slivers: [
          const SiteTopBar(title: 'About'),
          const SliverToBoxAdapter(
            child: PageTitle(
                label: 'About',
                meta: Site.location,
                title: 'Software developer,',
                italic: 'builder by habit.'),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const PortraitCard(
                      showOverlay: false,
                      delay: Duration(milliseconds: 150),
                      floating: true),
                  const SizedBox(height: 10),
                  const Row(
                    children: [
                      Expanded(child: SectionLabel(Site.role)),
                      SectionLabel('B.E. Computer Eng.'),
                    ],
                  ),
                  const SizedBox(height: 30),
                  WordReveal.text(
                    story[0],
                    style: AppText.serif(29,
                        color: p.ink, height: 1.14, spacing: -0.01),
                    stagger: const Duration(milliseconds: 22),
                  ),
                  for (var i = 1; i < story.length; i++)
                    Reveal(
                      delay: Duration(milliseconds: 60 * i),
                      child: Padding(
                        padding: const EdgeInsets.only(top: 18),
                        child: Text(story[i],
                            style: AppText.sans(16.5,
                                color: p.ink.withOpacity(0.8), height: 1.6)),
                      ),
                    ),
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      if (data.resumeUrl.isNotEmpty)
                        PillButton(
                          label: 'View résumé',
                          style: PillStyle.ink,
                          trailing: Icons.north_east_rounded,
                          onTap: () => openLink(context, data.resumeUrl),
                        ),
                      PillButton(
                        label: 'Get in touch',
                        style: PillStyle.outline,
                        trailing: Icons.arrow_forward_rounded,
                        onTap: () => goToTab(context, kContact),
                      ),
                    ],
                  ),
                  const SizedBox(height: 56),
                  const _Principles(),
                  const SizedBox(height: 48),
                  const SectionLabel('(02) — The path so far'),
                  const SizedBox(height: 12),
                  const Reveal(
                      child: SerifHeading('Four years,',
                          italic: 'one direction.', size: 46)),
                  const SizedBox(height: 18),
                  const _Timeline(),
                ],
              ),
            ),
          ),
          if (data.skills.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 56, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SectionLabel('(03) — Toolbox'),
                    const SizedBox(height: 12),
                    Reveal(
                        child: SerifHeading('Tools I',
                            italic: 'reach for',
                            size: 46,
                            count: data.skills.length)),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Container(
                decoration: BoxDecoration(
                    border: Border.symmetric(
                        horizontal: BorderSide(color: p.line))),
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: TextMarquee(
                    items: [for (final s in data.skills) s.name], speed: 22),
              ),
            ),
            SliverToBoxAdapter(child: _SkillGroups(groups: data.skillGroups)),
          ],
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 40, 20, 56),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SectionLabel('(04) — Off the clock'),
                  const SizedBox(height: 14),
                  Reveal(
                    child: Text.rich(
                      TextSpan(
                        style: AppText.serif(32, color: p.ink, height: 1.15),
                        children: [
                          for (var i = 0; i < interests.length; i++) ...[
                            TextSpan(text: interests[i]),
                            if (i < interests.length - 1)
                              TextSpan(
                                  text: ' / ',
                                  style: TextStyle(color: p.brand)),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 56),
                  Center(
                    child: Column(
                      children: [
                        WordReveal.text(
                          '“$quote”',
                          alignment: WrapAlignment.center,
                          style: AppText.serif(44,
                              color: p.ink, italic: true, height: 1),
                        ),
                        const SizedBox(height: 14),
                        const Reveal(
                            delay: Duration(milliseconds: 500),
                            child: SectionLabel('— ${Site.name}')),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SiteFooter()),
        ],
      ),
    );
  }
}

class _Principles extends StatelessWidget {
  const _Principles();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Hairline(),
        const SizedBox(height: 14),
        const SectionLabel('(01) — How I work'),
        for (var i = 0; i < principles.length; i++)
          Reveal(
            delay: Duration(milliseconds: 60 * i),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 22),
              decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: p.line))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(pad2(i + 1), style: AppText.mono(10.5, color: p.brand)),
                  const SizedBox(height: 10),
                  Text(principles[i].$1,
                      style: AppText.serif(34, color: p.ink)),
                  const SizedBox(height: 8),
                  Text(principles[i].$2,
                      style:
                          AppText.sans(15.5, color: p.ink.withOpacity(0.75))),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// Year-by-year timeline with an orange rail and dots.
class _Timeline extends StatelessWidget {
  const _Timeline();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      children: [
        for (var i = 0; i < timeline.length; i++)
          Reveal(
            delay: Duration(milliseconds: 40 * i),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  SizedBox(
                    width: 22,
                    child: Column(
                      children: [
                        Container(
                            width: 1,
                            height: 26,
                            color: i == 0
                                ? Colors.transparent
                                : p.brand.withOpacity(0.6)),
                        Container(
                          width: 11,
                          height: 11,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color:
                                i == timeline.length - 1 ? p.brand : p.canvas,
                            border: Border.all(color: p.brand, width: 2),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            width: 1,
                            color: i == timeline.length - 1
                                ? Colors.transparent
                                : p.brand.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 8, bottom: 26),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(timeline[i].$1,
                              style: AppText.serif(44, color: p.ink)),
                          const SizedBox(height: 4),
                          Text(timeline[i].$2,
                              style: AppText.sans(17,
                                  color: p.ink, weight: FontWeight.w600)),
                          const SizedBox(height: 4),
                          Text(timeline[i].$3,
                              style: AppText.sans(15, color: p.dim)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _SkillGroups extends StatelessWidget {
  const _SkillGroups({required this.groups});
  final List<(String, List<Skill>)> groups;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
      child: Column(
        children: [
          for (final (category, skills) in groups)
            Reveal(
              child: Container(
                width: double.infinity,
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                    color: p.surface, borderRadius: BorderRadius.circular(20)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Expanded(
                          child: Text(
                            (skillGroups[category]?.$1) ?? category,
                            style: AppText.serif(32, color: p.ink),
                          ),
                        ),
                        SectionLabel(
                            '${skills.length} ${skills.length == 1 ? 'tool' : 'tools'}'),
                      ],
                    ),
                    if (skillGroups[category] != null) ...[
                      const SizedBox(height: 4),
                      Text(skillGroups[category]!.$2,
                          style: AppText.sans(14, color: p.dim)),
                    ],
                    const SizedBox(height: 14),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        for (final s in skills)
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: p.canvas,
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(color: p.line),
                            ),
                            child: Text(s.name,
                                style: AppText.sans(14.5, color: p.ink)),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
