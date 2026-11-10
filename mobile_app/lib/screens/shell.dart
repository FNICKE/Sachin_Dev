import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../services/links.dart';
import '../services/update_service.dart';
import '../theme/app_theme.dart';
import '../widgets/contact_sheet.dart';
import '../widgets/reveal.dart';
import '../widgets/ui.dart';
import 'about_screen.dart';
import 'assistant_screen.dart';
import 'contact_screen.dart';
import 'home_screen.dart';
import 'journal_screen.dart';
import 'work_screen.dart';

const kHome = 0;
const kWork = 1;
const kAbout = 2;
const kJournal = 3;
const kContact = 4;

/// Which tab is showing, plus one scroll controller per tab
/// (tapping the active tab again scrolls it back to the top).
class ShellController extends ChangeNotifier {
  int _index = kHome;
  int get index => _index;

  final List<ScrollController> scrolls = List.generate(5, (_) => ScrollController());

  /// Bumped each time a tab is opened; the tab's entrance animations replay (see TabEntry).
  final List<ValueNotifier<int>> entries = List.generate(5, (_) => ValueNotifier(0));

  void goTo(int i) {
    if (i == _index) {
      final c = scrolls[i];
      if (c.hasClients && c.offset > 0) {
        c.animateTo(0, duration: const Duration(milliseconds: 700), curve: kEaseExpo);
      }
      return;
    }
    _index = i;
    notifyListeners();
    entries[i].value++;
  }

  @override
  void dispose() {
    for (final c in scrolls) {
      c.dispose();
    }
    for (final e in entries) {
      e.dispose();
    }
    super.dispose();
  }
}

/// Switches to a tab from anywhere, closing pushed pages first.
void goToTab(BuildContext context, int index) {
  Navigator.of(context).popUntil((route) => route.isFirst);
  context.read<ShellController>().goTo(index);
}

/// Opens the "Let's talk" sheet (WhatsApp, call, email, form, AI).
void openLetsTalk(BuildContext context) {
  showContactSheet(
    context,
    onOpenForm: () => goToTab(context, kContact),
    onOpenAssistant: () => openAssistant(context),
  );
}

/// The tabbed home of the app. [ShellController] is provided in main.dart, above
/// the navigator, so pushed pages (project, post, assistant) can switch tabs too.
class Shell extends StatefulWidget {
  const Shell({super.key});

  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> with SingleTickerProviderStateMixin {
  late final AnimationController _fade = AnimationController(vsync: this, duration: const Duration(milliseconds: 420), value: 1);
  int _shown = kHome;

  static const _tabs = [
    (Icons.home_outlined, Icons.home_rounded, 'Home'),
    (Icons.grid_view_outlined, Icons.grid_view_rounded, 'Work'),
    (Icons.person_outline_rounded, Icons.person_rounded, 'About'),
    (Icons.article_outlined, Icons.article_rounded, 'Journal'),
    (Icons.chat_bubble_outline_rounded, Icons.chat_bubble_rounded, 'Contact'),
  ];

  @override
  void dispose() {
    _fade.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final shell = context.watch<ShellController>();
    if (shell.index != _shown) {
      _shown = shell.index;
      _fade.forward(from: 0);
    }
    final p = context.palette;
    final bottomInset = MediaQuery.of(context).padding.bottom;

    final pages = [
      HomeScreen(controller: shell.scrolls[kHome]),
      WorkScreen(controller: shell.scrolls[kWork]),
      AboutScreen(controller: shell.scrolls[kAbout]),
      JournalScreen(controller: shell.scrolls[kJournal]),
      ContactScreen(controller: shell.scrolls[kContact]),
    ];

    return PopScope(
      // Android back on another tab returns to Home instead of closing the app.
      canPop: shell.index == kHome,
      onPopInvoked: (didPop) {
        if (!didPop) shell.goTo(kHome);
      },
      child: Scaffold(
        extendBody: true,
        body: Stack(
          children: [
            FadeTransition(
              opacity: CurvedAnimation(parent: _fade, curve: Curves.easeOut),
              child: ScaleTransition(
                scale: Tween(begin: 0.985, end: 1.0).animate(CurvedAnimation(parent: _fade, curve: kEaseExpo)),
                child: IndexedStack(
                  index: shell.index,
                  children: [for (var i = 0; i < pages.length; i++) TabEntry(notifier: shell.entries[i], child: pages[i])],
                ),
              ),
            ),
            // Update available notification banner
            Consumer<UpdateService>(
              builder: (context, updater, _) {
                if (!updater.hasUpdate) return const SizedBox.shrink();
                final topInset = MediaQuery.of(context).padding.top;
                return Positioned(
                  top: topInset + 8,
                  left: 16,
                  right: 16,
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () => openLink(context, updater.latest?.apkUrl ?? Site.apkDownloadUrl),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: p.brand,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: p.brand.withOpacity(0.35),
                              blurRadius: 16,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.system_update_rounded, color: p.brandInk, size: 20),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                'Update v' + (updater.latest?.version ?? '') + ' available — Tap to install',
                                style: AppText.sans(13.5, color: p.brandInk, weight: FontWeight.w600),
                              ),
                            ),
                            Icon(Icons.arrow_forward_rounded, color: p.brandInk, size: 18),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
            // Floating "Let's talk": appears once you scroll past the top of a tab (the Home hero
            // has its own buttons) and never shows on Contact, which already lists every option.
            Positioned(
              right: 16,
              bottom: bottomInset + 92,
              child: ListenableBuilder(
                listenable: shell.scrolls[shell.index],
                builder: (context, child) {
                  final c = shell.scrolls[shell.index];
                  final offset = c.hasClients ? c.offset : 0.0;
                  final visible = shell.index != kContact && offset > (shell.index == kHome ? 900 : 260);
                  return IgnorePointer(
                    ignoring: !visible,
                    child: AnimatedSlide(
                      offset: visible ? Offset.zero : const Offset(0, 1.6),
                      duration: const Duration(milliseconds: 450),
                      curve: kEaseExpo,
                      child: AnimatedOpacity(
                        opacity: visible ? 1 : 0,
                        duration: const Duration(milliseconds: 300),
                        child: child,
                      ),
                    ),
                  );
                },
                child: _LetsTalkButton(onTap: () => openLetsTalk(context)),
              ),
            ),
          ],
        ),
        bottomNavigationBar: Padding(
          padding: EdgeInsets.fromLTRB(14, 0, 14, bottomInset + 12),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(28),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
              child: Container(
                height: 64,
                padding: const EdgeInsets.symmetric(horizontal: 6),
                decoration: BoxDecoration(
                  color: p.surface.withOpacity(0.86),
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: p.line),
                ),
                child: Row(
                  children: [
                    for (var i = 0; i < _tabs.length; i++)
                      _NavItem(
                        icon: _tabs[i].$1,
                        activeIcon: _tabs[i].$2,
                        label: _tabs[i].$3,
                        active: shell.index == i,
                        onTap: () {
                          HapticFeedback.selectionClick();
                          shell.goTo(i);
                        },
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({required this.icon, required this.activeIcon, required this.label, required this.active, required this.onTap});
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Expanded(
      flex: active ? 5 : 3,
      child: Semantics(
        selected: active,
        button: true,
        label: label,
        excludeSemantics: true,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onTap,
          child: Center(
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 420),
              curve: kEaseExpo,
              height: 46,
              padding: EdgeInsets.symmetric(horizontal: active ? 14 : 0),
              decoration: BoxDecoration(
                color: active ? p.brand : Colors.transparent,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(active ? activeIcon : icon, size: 21, color: active ? p.brandInk : p.dim),
                  AnimatedSize(
                    duration: const Duration(milliseconds: 420),
                    curve: kEaseExpo,
                    child: active
                        ? Padding(
                            padding: const EdgeInsets.only(left: 7),
                            child: Text(
                              label,
                              maxLines: 1,
                              style: AppText.sans(13.5, color: p.brandInk, weight: FontWeight.w600),
                            ),
                          )
                        : const SizedBox.shrink(),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LetsTalkButton extends StatelessWidget {
  const _LetsTalkButton({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      label: "Let's talk — contact options",
      excludeSemantics: true,
      child: Material(
        color: p.ink,
        shape: const StadiumBorder(),
        elevation: 10,
        shadowColor: Colors.black54,
        child: InkWell(
          customBorder: const StadiumBorder(),
          onTap: () {
            HapticFeedback.mediumImpact();
            onTap();
          },
          child: Padding(
            padding: const EdgeInsets.fromLTRB(6, 6, 18, 6),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(color: p.brand, shape: BoxShape.circle),
                  child: Center(child: WhatsAppGlyph(size: 17, color: p.brandInk)),
                ),
                const SizedBox(width: 10),
                Text("Let's talk", style: AppText.sans(14.5, color: p.canvas, weight: FontWeight.w500)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Bottom space every tab leaves so the floating nav never covers content.
double bottomSafeSpace(BuildContext context) => MediaQuery.of(context).padding.bottom + 150;
