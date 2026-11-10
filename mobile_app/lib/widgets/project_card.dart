import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../data/site.dart';
import '../models/project.dart';
import '../theme/app_theme.dart';
import 'ui.dart';

/// Project card: rounded screenshot with badges, then title, year and stack.
class ProjectCard extends StatefulWidget {
  const ProjectCard({super.key, required this.project, required this.index, this.onTap, this.large = false, this.heroTag});
  final Project project;
  final int index;
  final VoidCallback? onTap;
  final bool large;

  /// Shared-element tag for the image → detail transition. Leave null where the
  /// same project can appear twice on screen (the endless marquee).
  final String? heroTag;

  @override
  State<ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<ProjectCard> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final pr = widget.project;
    final radius = BorderRadius.circular(widget.large ? 22 : 20);

    return Semantics(
      button: true,
      label: 'Open project ${pr.title}',
      child: GestureDetector(
        onTapDown: (_) => setState(() => _down = true),
        onTapCancel: () => setState(() => _down = false),
        onTapUp: (_) => setState(() => _down = false),
        onTap: widget.onTap == null
            ? null
            : () {
                HapticFeedback.selectionClick();
                widget.onTap!();
              },
        child: AnimatedScale(
          scale: _down ? 0.97 : 1,
          duration: const Duration(milliseconds: 220),
          curve: Curves.easeOut,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AspectRatio(
                aspectRatio: 16 / 10,
                child: ClipRRect(
                  borderRadius: radius,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      if (widget.heroTag != null)
                        Hero(tag: widget.heroTag!, child: NetImage(pr.thumbnailUrl, title: pr.title))
                      else
                        NetImage(pr.thumbnailUrl, title: pr.title),
                      const DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.center,
                            colors: [Color(0x99000000), Colors.transparent],
                          ),
                        ),
                      ),
                      Positioned(
                        left: 12,
                        top: 12,
                        child: Tag('${pad2(widget.index + 1)} · ${categoryLabel(pr.category)}', onDark: true),
                      ),
                      if (pr.featured) const Positioned(right: 12, top: 12, child: Tag('Featured', filled: true)),
                      Positioned(
                        right: 12,
                        bottom: 12,
                        child: Container(
                          width: 38,
                          height: 38,
                          decoration: BoxDecoration(color: p.brand, shape: BoxShape.circle),
                          child: Icon(Icons.north_east_rounded, size: 18, color: p.brandInk),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: Text(
                      pr.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppText.serif(widget.large ? 34 : 28, color: p.ink),
                    ),
                  ),
                  const SizedBox(width: 10),
                  if (pr.liveUrl.isNotEmpty) ...[
                    Container(width: 6, height: 6, decoration: const BoxDecoration(color: Color(0xFF34D399), shape: BoxShape.circle)),
                    const SizedBox(width: 5),
                    Text('LIVE ', style: AppText.mono(9.5, color: p.ink.withOpacity(0.8))),
                  ],
                  if (pr.year != null) Text('${pr.year}', style: AppText.mono(9.5, color: p.dim)),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                (pr.techStack.isNotEmpty ? pr.techStack.take(4).join(' · ') : (pr.shortDesc.isNotEmpty ? pr.shortDesc : 'View case study'))
                    .toUpperCase(),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppText.mono(9.5, color: p.dim),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
