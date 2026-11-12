import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../models/blog.dart';
import '../providers/portfolio_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/reveal.dart';
import '../widgets/rich_content.dart';
import '../widgets/ui.dart';
import 'site_footer.dart';

String formatPostDate(Blog post) => DateFormat('dd MMM yyyy').format((post.publishedAt ?? post.createdAt).toLocal());

class JournalScreen extends StatelessWidget {
  const JournalScreen({super.key, required this.controller});
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
        physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
        slivers: [
          const SiteTopBar(title: 'Blog'),
          SliverToBoxAdapter(
            child: PageTitle(
              label: 'Blog',
              title: 'Notes &',
              italic: 'writing',
              count: data.hasLoaded ? data.blogs.length : null,
              intro: 'Write-ups from building things — projects, hackathons and what I learned along the way.',
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 48),
            sliver: SliverToBoxAdapter(
              child: !data.hasLoaded
                  ? Column(
                      children: [
                        for (var i = 0; i < 3; i++) ...[
                          const ShimmerBox(height: 96, radius: 14),
                          const SizedBox(height: 14),
                        ],
                      ],
                    )
                  : data.blogs.isEmpty
                      ? StatusMessage(
                          title: data.errorMessage.isEmpty ? 'Coming soon' : 'Waking up…',
                          text: data.errorMessage.isEmpty
                              ? 'The first post is on its way.'
                              : "Posts couldn't load — the server may still be waking up.",
                          onRetry: data.errorMessage.isEmpty ? null : data.loadPortfolioData,
                        )
                      : Column(
                          children: [
                            const Hairline(),
                            for (var i = 0; i < data.blogs.length; i++)
                              Reveal(delay: Duration(milliseconds: 50 * (i % 4)), child: PostRow(post: data.blogs[i])),
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

/// One journal entry in a list: date, title, excerpt, read time.
class PostRow extends StatelessWidget {
  const PostRow({super.key, required this.post});
  final Blog post;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return InkWell(
      onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => PostScreen(post: post))),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: p.line))),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: SectionLabel(formatPostDate(post))),
                if (post.readTime > 0) SectionLabel('${post.readTime} min'),
                const SizedBox(width: 10),
                Icon(Icons.north_east_rounded, size: 18, color: p.ink),
              ],
            ),
            const SizedBox(height: 10),
            Text(post.title, style: AppText.serif(32, color: p.ink, height: 1.02)),
            if (post.excerpt.isNotEmpty || post.tags.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                post.excerpt.isNotEmpty ? post.excerpt : post.tags.join(' · '),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: AppText.sans(15, color: p.dim),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class PostScreen extends StatelessWidget {
  const PostScreen({super.key, required this.post});
  final Blog post;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: p.canvas,
            leading: IconButton(
              tooltip: 'Back',
              icon: const Icon(Icons.arrow_back_rounded),
              onPressed: () => Navigator.of(context).maybePop(),
            ),
            title: Text('BLOG', style: AppText.mono(11, color: p.dim)),
            bottom: const PreferredSize(preferredSize: Size.fromHeight(1), child: Hairline()),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 24, 20, MediaQuery.of(context).padding.bottom + 48),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SectionLabel('${formatPostDate(post)}${post.readTime > 0 ? ' · ${post.readTime} min read' : ''}'),
                  const SizedBox(height: 16),
                  Reveal(child: Text(post.title, style: AppText.serif(46, color: p.ink, height: 0.98))),
                  if (post.excerpt.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Reveal(
                      delay: const Duration(milliseconds: 100),
                      child: Text(post.excerpt, style: AppText.sans(18, color: p.ink.withOpacity(0.8), height: 1.4)),
                    ),
                  ],
                  if (post.tags.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Wrap(spacing: 6, runSpacing: 6, children: [for (final t in post.tags) Tag(t)]),
                  ],
                  if (post.coverUrl.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(18),
                      child: AspectRatio(aspectRatio: 16 / 9, child: _Cover(url: post.coverUrl)),
                    ),
                  ],
                  const SizedBox(height: 28),
                  RichContent(post.content, emptyText: "This post doesn't have any content yet."),
                  const SizedBox(height: 40),
                  const Hairline(),
                  const SizedBox(height: 14),
                  const SectionLabel('Written by ${Site.name}'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Cover image that collapses away (instead of showing a placeholder) if it can't load.
class _Cover extends StatelessWidget {
  const _Cover({required this.url});
  final String url;

  @override
  Widget build(BuildContext context) {
    return Image.network(
      url,
      fit: BoxFit.cover,
      loadingBuilder: (_, child, progress) => progress == null ? child : const ShimmerBox(),
      errorBuilder: (_, __, ___) => const Poster(),
    );
  }
}
