import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../services/links.dart';
import '../services/update_service.dart';
import '../theme/app_theme.dart';
import '../widgets/reveal.dart';
import '../widgets/ui.dart';
import '../widgets/update_prompt.dart';
import 'shell.dart';

/// "Got an idea? Let's build it." call to action + footer, shown at the end of each tab.
class SiteFooter extends StatelessWidget {
  const SiteFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final links = [
      ('WhatsApp', () => openLink(context, Site.whatsappUrl())),
      ('Email', () => openLink(context, Site.emailUri)),
      ('Call', () => openLink(context, Site.phoneUri)),
      ('GitHub', () => openLink(context, Site.github)),
      ('LinkedIn', () => openLink(context, Site.linkedin)),
    ];

    return Padding(
      padding: EdgeInsets.fromLTRB(20, 0, 20, bottomSafeSpace(context)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Hairline(),
          const SizedBox(height: 44),
          const SectionLabel('(Freelance — taking new projects)'),
          const SizedBox(height: 16),
          Reveal(child: Text('Got an idea?', style: AppText.serif(58, color: p.ink, height: 0.92))),
          Reveal(
            delay: const Duration(milliseconds: 120),
            child: Text("Let's build it.", style: AppText.serif(58, color: p.brand, italic: true, height: 0.98)),
          ),
          const SizedBox(height: 22),
          Text('Website, web app or mobile app — write to me', style: AppText.sans(14.5, color: p.dim)),
          const SizedBox(height: 6),
          GestureDetector(
            onTap: () => openLink(context, Site.emailUri),
            onLongPress: () => copyText(context, Site.email, message: 'Email copied'),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerLeft,
              child: Text(Site.email, style: AppText.serif(30, color: p.ink)),
            ),
          ),
          const SizedBox(height: 20),
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
          const SizedBox(height: 40),
          const Hairline(),
          const SizedBox(height: 20),
          Wrap(
            spacing: 20,
            runSpacing: 10,
            children: [
              for (final (label, onTap) in links)
                GestureDetector(
                  onTap: onTap,
                  child: Text('$label ↗', style: AppText.sans(15, color: p.ink)),
                ),
            ],
          ),
          const SizedBox(height: 22),
          Row(
            children: [
              Expanded(child: Text('© ${DateTime.now().year} ${Site.name}', style: AppText.mono(9.5, color: p.dim))),
              MumbaiClock(style: AppText.mono(9.5, color: p.dim)),
            ],
          ),
          const SizedBox(height: 12),
          Consumer<UpdateService>(
            builder: (context, updater, _) {
              final hasUpdate = updater.hasUpdate;
              final latest = updater.latest;
              return GestureDetector(
                onTap: () {
                  if (hasUpdate) {
                    UpdatePrompt.open(context);
                  } else {
                    updater.checkForUpdate();
                    ScaffoldMessenger.of(context)
                      ..hideCurrentSnackBar()
                      ..showSnackBar(SnackBar(
                        content: Text('Sachin Dev v${updater.currentVersion} • App is up to date'),
                        duration: const Duration(seconds: 2),
                      ));
                  }
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: hasUpdate ? p.brand.withOpacity(0.12) : p.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: hasUpdate ? p.brand : p.line),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: hasUpdate ? p.brand : const Color(0xFF22C55E),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        hasUpdate
                            ? 'v${updater.currentVersion} • Update v${latest?.version} available ↗'
                            : 'v${updater.currentVersion} • Up to date',
                        style: AppText.mono(10.5, color: hasUpdate ? p.brand : p.dim),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 18),
          ExcludeSemantics(
            child: FittedBox(
              fit: BoxFit.fitWidth,
              child: Text.rich(
                TextSpan(
                  style: AppText.serif(120, color: p.ink.withOpacity(0.07), height: 0.9),
                  children: const [
                    TextSpan(text: 'Sachin '),
                    TextSpan(text: 'Rathod', style: TextStyle(fontStyle: FontStyle.italic)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
