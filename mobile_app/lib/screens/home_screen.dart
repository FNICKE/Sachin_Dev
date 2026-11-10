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
import '../widgets/scroll_lit_text.dart';
import '../widgets/ui.dart';
import 'journal_screen.dart';
import 'project_screen.dart';
import 'shell.dart';
import 'site_footer.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.controller});
  final ScrollController controller;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _workKey = GlobalKey();

  void _scrollToWork() {
    final ctx = _workKey.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx, duration: const Duration(milliseconds: 900), curve: kEaseExpo);
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final data = context.watch<PortfolioProvider>();

    return RefreshIndicator(
      color: p.brand,
      backgroundColor: p.surface,
      onRefresh: data.refreshData,
      child: CustomScrollView(
        controller: widget.controller,
        physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
        slivers: [
          const SiteTopBar(),
          SliverToBoxAdapter(child: _Hero(onSeeWork: _scrollToWork)),
          SliverToBoxAdapter(child: _SelectedWork(key: _workKey)),
          const SliverToBoxAdapter(child: _Intro()),
          if (data.skills.isNotEmpty)
            SliverToBoxAdapter(
              child: Container(
                decoration: BoxDecoration(border: Border.symmetric(horizontal: BorderSide(color: p.line))),
                padding: const EdgeInsets.symmetric(vertical: 10),
                child: TextMarquee(items: [for (final s in data.skills) s.name]),
              ),
            ),
          SliverToBoxAdapter(child: _Services(groups: data.skillGroups)),
          if (data.projects.isNotEmpty) const SliverToBoxAdapter(child: _Numbers()),
          if (data.blogs.isNotEmpty) const SliverToBoxAdapter(child: _LatestPosts()),
          const SliverToBoxAdapter(child: SiteFooter()),
        ],
      ),
    );
  }
}

/* ── Hero ──────────────────────────────────────────────────────────── */

class _Hero extends StatelessWidget {
  const _Hero({required this.onSeeWork});
  final VoidCallback onSeeWork;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final data = context.watch<PortfolioProvider>();
    final nameStyle = AppText.serif(100, color: p.ink, height: 0.86, spacing: -0.035);

    final stats = [
      (data.projects.length, '', 'Projects\nshipped'),
      (data.liveCount, '', 'Live\nwebsites'),
      (Site.yearsBuilding, '+', 'Years\nbuilding'),
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 18, 20, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(child: SectionLabel(Site.role)),
              PulseDot(size: 7, color: p.brand),
              Text('AVAILABLE', style: AppText.mono(10.5, color: p.ink)),
            ],
          ),
          const SizedBox(height: 26),
          Text("HI, I'M", style: AppText.mono(10.5, color: p.brand)),
          const SizedBox(height: 8),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                LetterReveal('Sachin', style: nameStyle, delay: const Duration(milliseconds: 150)),
                Padding(
                  padding: const EdgeInsets.only(left: 38),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      LetterReveal(
                        'Rathod',
                        style: nameStyle.copyWith(fontStyle: FontStyle.italic),
                        delay: const Duration(milliseconds: 400),
                      ),
                      _PopIn(
                        delay: const Duration(milliseconds: 1200),
                        child: Text('.', style: nameStyle.copyWith(color: p.brand)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 26),
          const PortraitCard(),
          const SizedBox(height: 22),
          Reveal(
            delay: const Duration(milliseconds: 700),
            child: Text.rich(
              TextSpan(
                style: AppText.sans(18, color: p.ink.withOpacity(0.78), height: 1.42),
                children: [
                  const TextSpan(text: "I'm a freelance fullstack developer in Mumbai. I build "),
                  TextSpan(text: 'websites', style: TextStyle(color: p.ink, fontWeight: FontWeight.w600)),
                  const TextSpan(text: ', '),
                  TextSpan(text: 'web apps', style: TextStyle(color: p.ink, fontWeight: FontWeight.w600)),
                  const TextSpan(text: ' and '),
                  TextSpan(text: 'mobile apps', style: TextStyle(color: p.ink, fontWeight: FontWeight.w600)),
                  const TextSpan(text: ' — from the database to the last pixel.'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 22),
          Reveal(
            delay: const Duration(milliseconds: 820),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                PillButton(
                  label: 'Start a project',
                  expand: true,
                  trailing: Icons.arrow_forward_rounded,
                  onTap: () => goToTab(context, kContact),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: PillButton(
                        label: 'WhatsApp me',
                        style: PillStyle.outline,
                        expand: true,
                        dense: true,
                        leading: const WhatsAppGlyph(),
                        onTap: () => openLink(context, Site.whatsappUrl()),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: PillButton(
                        label: 'See my work',
                        style: PillStyle.outline,
                        expand: true,
                        dense: true,
                        trailing: Icons.arrow_downward_rounded,
                        onTap: onSeeWork,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 26),
          const Hairline(),
          const SizedBox(height: 18),
          Row(
            children: [
              for (final (value, suffix, label) in stats)
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      data.hasLoaded || suffix.isNotEmpty
                          ? CountUp(value, suffix: suffix, style: AppText.serif(44, color: p.ink))
                          : const ShimmerBox(height: 40, width: 46, radius: 8),
                      const SizedBox(height: 6),
                      Text(label.toUpperCase(), style: AppText.mono(9.5, color: p.dim)),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(Site.stack.join(' · ').toUpperCase(), style: AppText.mono(9.5, color: p.dim)),
        ],
      ),
    );
  }
}

class _PopIn extends StatelessWidget {
  const _PopIn({required this.child, required this.delay});
  final Widget child;
  final Duration delay;

  @override
  Widget build(BuildContext context) {
    final still = MediaQuery.of(context).disableAnimations;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: still ? 1 : 0, end: 1),
      duration: delay + const Duration(milliseconds: 600),
      builder: (_, v, child) {
        final total = delay.inMilliseconds + 600;
        final t = ((v * total - delay.inMilliseconds) / 600).clamp(0.0, 1.0);
        return Transform.scale(scale: Curves.easeOutBack.transform(t), child: Opacity(opacity: t, child: child));
      },
      child: child,
    );
  }
}

/* ── Selected work (auto-scrolling project row) ────────────────────── */

class _SelectedWork extends StatelessWidget {
  const _SelectedWork({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final data = context.watch<PortfolioProvider>();
    final projects = data.orderedProjects;

    Widget body;
    if (!data.hasLoaded) {
      body = SizedBox(
        height: 300 * 10 / 16 + 86,
        child: ListView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          physics: const NeverScrollableScrollPhysics(),
          children: const [
            ShimmerBox(width: 300, height: 188, radius: 20),
            SizedBox(width: 16),
            ShimmerBox(width: 300, height: 188, radius: 20),
          ],
        ),
      );
    } else if (projects.isEmpty) {
      body = Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: StatusMessage(
          title: 'Waking up…',
          text: "The projects couldn't load — the server may still be waking up.",
          onRetry: data.loadPortfolioData,
        ),
      );
    } else {
      body = ProjectMarquee(
        projects: projects,
        itemBuilder: (project, i) => ProjectTile(project: project, index: i),
      );
    }

    return Padding(
      padding: const EdgeInsets.only(top: 56, bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionLabel('(01) — Selected work'),
                const SizedBox(height: 12),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Expanded(child: Reveal(child: SerifHeading("Things I've", italic: 'built', size: 52))),
                    GestureDetector(
                      onTap: () => goToTab(context, kWork),
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Text(
                          'ALL (${projects.length}) →',
                          style: AppText.mono(10.5, color: p.ink, weight: FontWeight.w500),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),
          body,
        ],
      ),
    );
  }
}

/* ── Intro ─────────────────────────────────────────────────────────── */

class _Intro extends StatelessWidget {
  const _Intro();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final resume = context.select<PortfolioProvider, String>((d) => d.resumeUrl);
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 40, 20, 56),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionLabel('(02) — Intro'),
          const SizedBox(height: 16),
          ScrollLitText(
            segments: introSegments,
            style: AppText.serif(34, color: p.ink, height: 1.12),
            accentStyle: AppText.serif(34, color: p.brand, italic: true, height: 1.12),
          ),
          const SizedBox(height: 26),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              PillButton(
                label: 'More about me',
                style: PillStyle.ink,
                trailing: Icons.arrow_forward_rounded,
                onTap: () => goToTab(context, kAbout),
              ),
              if (resume.isNotEmpty)
                PillButton(
                  label: 'Résumé',
                  style: PillStyle.outline,
                  trailing: Icons.north_east_rounded,
                  onTap: () => openLink(context, resume),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

/* ── Freelance services ────────────────────────────────────────────── */

class _Services extends StatelessWidget {
  const _Services({required this.groups});
  final List<(String, List<Skill>)> groups;

  List<String> _toolsFor(Service s) {
    final fromApi = [
      for (final (category, skills) in groups)
        if (s.categories.contains(category)) ...skills.map((k) => k.name),
    ];
    return {...fromApi, ...s.tools}.take(8).toList();
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 56, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionLabel('(03) — Freelance services'),
          const SizedBox(height: 12),
          const Reveal(child: SerifHeading('Websites, web &', italic: 'mobile apps.', size: 50)),
          const SizedBox(height: 14),
          Text(
            'I work with businesses, startups and founders as a freelance developer — one person from the first call to launch day, across web and mobile.',
            style: AppText.sans(16, color: p.ink.withOpacity(0.75)),
          ),
          const SizedBox(height: 18),
          Row(
            children: [
              PulseDot(size: 7, color: p.brand),
              Text(Site.availability.toUpperCase(), style: AppText.mono(10, color: p.dim)),
            ],
          ),
          const SizedBox(height: 24),
          for (var i = 0; i < services.length; i++)
            Reveal(
              delay: Duration(milliseconds: 60 * i),
              child: Container(
                margin: const EdgeInsets.only(bottom: 14),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: p.surface,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: p.line),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(pad2(i + 1), style: AppText.mono(11, color: p.brand)),
                        const Spacer(),
                        Icon(
                          [Icons.language_rounded, Icons.dashboard_outlined, Icons.phone_iphone_rounded][i],
                          size: 22,
                          color: p.dim,
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(services[i].title, style: AppText.serif(38, color: p.ink)),
                    const SizedBox(height: 10),
                    Text(services[i].text, style: AppText.sans(15, color: p.ink.withOpacity(0.75))),
                    const SizedBox(height: 12),
                    Text(services[i].examples.toUpperCase(), style: AppText.mono(9.5, color: p.ink.withOpacity(0.6))),
                    if (_toolsFor(services[i]).isNotEmpty) ...[
                      const SizedBox(height: 14),
                      Wrap(spacing: 6, runSpacing: 6, children: [for (final t in _toolsFor(services[i])) Tag(t)]),
                    ],
                  ],
                ),
              ),
            ),
          const SizedBox(height: 30),
          const SectionLabel('How a project works'),
          const SizedBox(height: 6),
          for (var i = 0; i < processSteps.length; i++)
            Reveal(
              delay: Duration(milliseconds: 60 * i),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 18),
                decoration: BoxDecoration(border: Border(bottom: BorderSide(color: p.line))),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(
                      width: 74,
                      child: Text('STEP ${pad2(i + 1)}', style: AppText.mono(10, color: p.brand)),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(processSteps[i].$1, style: AppText.serif(30, color: p.ink)),
                          const SizedBox(height: 6),
                          Text(processSteps[i].$2, style: AppText.sans(15, color: p.ink.withOpacity(0.72))),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              PillButton(label: 'Start a project', trailing: Icons.arrow_forward_rounded, onTap: () => goToTab(context, kContact)),
              PillButton(
                label: 'WhatsApp',
                style: PillStyle.outline,
                leading: const WhatsAppGlyph(),
                onTap: () => openLink(context, Site.whatsappUrl()),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/* ── By the numbers ────────────────────────────────────────────────── */

class _Numbers extends StatelessWidget {
  const _Numbers();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final data = context.watch<PortfolioProvider>();
    final items = [
      (data.projects.length, '', 'Projects shipped'),
      (data.liveCount, '', 'Live in production'),
      (data.skills.length, '', 'Tools in the stack'),
      (Site.yearsBuilding, '+', 'Years building'),
    ];

    Widget cell(int i) => Expanded(
          child: Container(
            padding: EdgeInsets.fromLTRB(i.isOdd ? 16 : 0, 20, 8, 20),
            decoration: i.isOdd ? BoxDecoration(border: Border(left: BorderSide(color: p.line))) : null,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CountUp(
                  items[i].$1,
                  style: AppText.serif(64, color: p.ink),
                  suffix: items[i].$2,
                ),
                const SizedBox(height: 6),
                Text(items[i].$3.toUpperCase(), style: AppText.mono(9.5, color: p.dim)),
              ],
            ),
          ),
        );

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 48),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Hairline(),
          const SizedBox(height: 14),
          const SectionLabel('(04) — By the numbers'),
          Reveal(
            child: Column(
              children: [
                IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [cell(0), cell(1)])),
                const Hairline(),
                IntrinsicHeight(child: Row(crossAxisAlignment: CrossAxisAlignment.stretch, children: [cell(2), cell(3)])),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/* ── Journal ───────────────────────────────────────────────────────── */

class _LatestPosts extends StatelessWidget {
  const _LatestPosts();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final posts = context.watch<PortfolioProvider>().blogs.take(2).toList();
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 48),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionLabel('(05) — Journal'),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Expanded(child: Reveal(child: SerifHeading('Notes from the', italic: 'workbench', size: 44))),
              GestureDetector(
                onTap: () => goToTab(context, kJournal),
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Text('ALL →', style: AppText.mono(10.5, color: p.ink, weight: FontWeight.w500)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          const Hairline(),
          for (final post in posts) PostRow(post: post),
        ],
      ),
    );
  }
}
