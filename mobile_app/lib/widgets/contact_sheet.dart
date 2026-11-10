import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../data/site.dart';
import '../services/links.dart';
import '../theme/app_theme.dart';
import 'ui.dart';

/// Bottom sheet with every way to reach Sachin — same options as the website's "Let's talk" dock.
Future<void> showContactSheet(
  BuildContext context, {
  required VoidCallback onOpenForm,
  required VoidCallback onOpenAssistant,
}) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    showDragHandle: true,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(26))),
    builder: (sheetContext) {
      final p = sheetContext.palette;
      void close() => Navigator.of(sheetContext).pop();

      final items = <_SheetItem>[
        _SheetItem(
          icon: WhatsAppGlyph(size: 20, color: p.brandInk),
          title: 'WhatsApp',
          subtitle: 'Chat with me now',
          accent: true,
          onTap: () {
            close();
            openLink(context, Site.whatsappUrl());
          },
        ),
        _SheetItem(
          icon: Icon(Icons.call_outlined, size: 20, color: p.ink),
          title: 'Call',
          subtitle: Site.phone,
          onTap: () {
            close();
            openLink(context, Site.phoneUri);
          },
        ),
        _SheetItem(
          icon: Icon(Icons.mail_outline_rounded, size: 20, color: p.ink),
          title: 'Email',
          subtitle: Site.email,
          trailing: IconButton(
            tooltip: 'Copy email',
            icon: Icon(Icons.content_copy_rounded, size: 18, color: p.dim),
            onPressed: () => copyText(sheetContext, Site.email, message: 'Email copied'),
          ),
          onTap: () {
            close();
            openLink(context, Site.emailUri);
          },
        ),
        _SheetItem(
          icon: Icon(Icons.edit_outlined, size: 20, color: p.ink),
          title: 'Contact form',
          subtitle: 'Tell me about your project',
          onTap: () {
            close();
            onOpenForm();
          },
        ),
        _SheetItem(
          icon: Icon(Icons.auto_awesome_outlined, size: 20, color: p.ink),
          title: 'Ask AI',
          subtitle: 'Quick questions about my work',
          onTap: () {
            close();
            onOpenAssistant();
          },
        ),
      ];

      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 18),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text.rich(
                      TextSpan(
                        style: AppText.serif(36, color: p.ink),
                        children: const [
                          TextSpan(text: "Let's "),
                          TextSpan(text: 'talk', style: TextStyle(fontStyle: FontStyle.italic)),
                        ],
                      ),
                    ),
                  ),
                  const PulseDot(size: 7),
                  const SizedBox(width: 2),
                  Text('AVAILABLE', style: AppText.mono(9.5, color: p.dim)),
                ],
              ),
              const SizedBox(height: 4),
              Text('Pick whatever is easiest for you', style: AppText.sans(14, color: p.dim)),
              const SizedBox(height: 14),
              for (var i = 0; i < items.length; i++)
                items[i]
                    .animate()
                    .fadeIn(delay: (60 * i).ms, duration: 380.ms)
                    .slideX(begin: 0.12, end: 0, delay: (60 * i).ms, duration: 480.ms, curve: kEaseExpo),
            ],
          ),
        ),
      );
    },
  );
}

class _SheetItem extends StatelessWidget {
  const _SheetItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.accent = false,
    this.trailing,
  });

  final Widget icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final bool accent;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 9),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: accent ? p.brand : Colors.transparent,
                border: Border.all(color: accent ? p.brand : p.line),
              ),
              child: Center(child: icon),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppText.sans(16, color: p.ink, weight: FontWeight.w600)),
                  const SizedBox(height: 2),
                  Text(subtitle, maxLines: 1, overflow: TextOverflow.ellipsis, style: AppText.sans(13.5, color: p.dim)),
                ],
              ),
            ),
            trailing ?? Icon(Icons.north_east_rounded, size: 18, color: p.dim),
          ],
        ),
      ),
    );
  }
}
