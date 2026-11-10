import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../providers/portfolio_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/reveal.dart';
import '../widgets/ui.dart';
import 'project_screen.dart';
import 'site_footer.dart';

/// All projects, with category filters.
class WorkScreen extends StatefulWidget {
  const WorkScreen({super.key, required this.controller});
  final ScrollController controller;

  @override
  State<WorkScreen> createState() => _WorkScreenState();
}

class _WorkScreenState extends State<WorkScreen> {
  String _filter = 'all';

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final data = context.watch<PortfolioProvider>();
    final all = data.orderedProjects;

    final counts = <String, int>{};
    for (final pr in all) {
      counts[pr.category] = (counts[pr.category] ?? 0) + 1;
    }
    final filters = [('all', all.length), ...counts.entries.map((e) => (e.key, e.value))];
    final list = _filter == 'all' ? all : all.where((x) => x.category == _filter).toList();

    return RefreshIndicator(
      color: p.brand,
      backgroundColor: p.surface,
      onRefresh: data.refreshData,
      child: CustomScrollView(
        controller: widget.controller,
        physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
        slivers: [
          const SiteTopBar(title: 'Work'),
          SliverToBoxAdapter(
            child: PageTitle(
              label: 'Index',
              meta: data.hasLoaded ? '${data.liveCount} live' : null,
              title: 'Selected',
              italic: 'work',
              count: data.hasLoaded ? all.length : null,
              intro: 'Client sites, products and experiments — most of them live. Tap a project for the details.',
            ),
          ),
          if (filters.length > 2)
            SliverToBoxAdapter(
              child: SizedBox(
                height: 64,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                  children: [
                    for (final (key, count) in filters)
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: _FilterChip(
                          label: key == 'all' ? 'All' : categoryLabel(key),
                          count: count,
                          selected: _filter == key,
                          onTap: () {
                            HapticFeedback.selectionClick();
                            setState(() => _filter = key);
                          },
                        ),
                      ),
                  ],
                ),
              ),
            ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
            sliver: !data.hasLoaded
                ? SliverList.separated(
                    itemCount: 3,
                    separatorBuilder: (_, __) => const SizedBox(height: 28),
                    itemBuilder: (_, __) => const AspectRatio(aspectRatio: 16 / 10, child: ShimmerBox(radius: 22)),
                  )
                : list.isEmpty
                    ? SliverToBoxAdapter(
                        child: StatusMessage(
                          title: 'Waking up…',
                          text: "Projects couldn't load — the server may still be waking up.",
                          onRetry: data.loadPortfolioData,
                        ),
                      )
                    : SliverList.separated(
                        itemCount: list.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 30),
                        itemBuilder: (_, i) => Reveal(
                          key: ValueKey('$_filter-${list[i].id}'),
                          delay: Duration(milliseconds: 40 * (i % 3)),
                          child: ProjectTile(project: list[i], index: all.indexOf(list[i]), large: true),
                        ),
                      ),
          ),
          const SliverToBoxAdapter(child: SiteFooter()),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({required this.label, required this.count, required this.selected, required this.onTap});
  final String label;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      selected: selected,
      button: true,
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 350),
          curve: kEaseExpo,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: selected ? p.ink : Colors.transparent,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: selected ? p.ink : p.line),
          ),
          child: Text(
            '${label.toUpperCase()}  ($count)',
            style: AppText.mono(10.5, color: selected ? p.canvas : p.dim),
          ),
        ),
      ),
    );
  }
}
