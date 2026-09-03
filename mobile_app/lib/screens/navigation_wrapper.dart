import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../providers/portfolio_provider.dart';
import 'home_screen.dart';
import 'about_screen.dart';
import 'projects_screen.dart';
import 'blogs_screen.dart';
import 'contact_screen.dart';
import 'chatbot_screen.dart';

// ── Design tokens ─────────────────────────────────────────────────
const Color kBg = Color(0xFF020817);
const Color kIndigo = Color(0xFF6366F1);
const Color kPurple = Color(0xFF8B5CF6);
const Color kCyan = Color(0xFF06B6D4);

class NavigationWrapper extends StatefulWidget {
  const NavigationWrapper({super.key});

  @override
  State<NavigationWrapper> createState() => _NavigationWrapperState();
}

class _NavigationWrapperState extends State<NavigationWrapper>
    with TickerProviderStateMixin {
  int _currentIndex = 0;
  late AnimationController _fabPulseCtrl;

  final List<Widget> _screens = const [
    HomeScreen(),
    AboutScreen(),
    ProjectsScreen(),
    BlogsScreen(),
    ContactScreen(),
  ];

  final List<String> _titles = const ['Home', 'About', 'Projects', 'Articles', 'Contact'];

  final List<IconData> _icons = const [
    Icons.home_outlined,
    Icons.person_outline_rounded,
    Icons.code_rounded,
    Icons.article_outlined,
    Icons.mail_outline_rounded,
  ];

  final List<IconData> _activeIcons = const [
    Icons.home_rounded,
    Icons.person_rounded,
    Icons.code_rounded,
    Icons.article_rounded,
    Icons.mail_rounded,
  ];

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
    ));
    _fabPulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<PortfolioProvider>(context, listen: false).loadPortfolioData();
    });
  }

  @override
  void dispose() {
    _fabPulseCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<PortfolioProvider>(context);

    return Scaffold(
      backgroundColor: kBg,
      extendBody: true,
      body: _buildBody(provider),
      floatingActionButton: _buildFab(),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      bottomNavigationBar: _buildNavBar(),
    );
  }

  Widget _buildFab() {
    return AnimatedBuilder(
      animation: _fabPulseCtrl,
      builder: (_, child) {
        final pulse = 0.8 + (_fabPulseCtrl.value * 0.2);
        return Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Outer glow ring
              Container(
                width: 70 * pulse,
                height: 70 * pulse,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      kIndigo.withOpacity(0.3 * (1 - _fabPulseCtrl.value)),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
              // FAB button
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [kIndigo, kPurple],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: kIndigo.withOpacity(0.5),
                      blurRadius: 20,
                      spreadRadius: 2,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    customBorder: const CircleBorder(),
                    onTap: () {
                      HapticFeedback.mediumImpact();
                      Navigator.push(
                        context,
                        PageRouteBuilder(
                          pageBuilder: (_, anim, __) => const ChatbotScreen(),
                          transitionsBuilder: (_, anim, __, child) {
                            return SlideTransition(
                              position: Tween<Offset>(
                                begin: const Offset(0, 1),
                                end: Offset.zero,
                              ).animate(CurvedAnimation(parent: anim, curve: Curves.easeOutCubic)),
                              child: child,
                            );
                          },
                        ),
                      );
                    },
                    child: const Icon(
                      Icons.auto_awesome_rounded,
                      color: Colors.white,
                      size: 22,
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNavBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(
              color: Colors.white.withOpacity(0.1),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.6),
                blurRadius: 40,
                offset: const Offset(0, 10),
              ),
              BoxShadow(
                color: kIndigo.withOpacity(0.1),
                blurRadius: 60,
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(5, (index) => _buildNavItem(index)),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index) {
    final isSelected = _currentIndex == index;

    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        setState(() => _currentIndex = index);
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutCubic,
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? 14 : 10,
          vertical: 8,
        ),
        decoration: BoxDecoration(
          gradient: isSelected
              ? const LinearGradient(
                  colors: [kIndigo, kPurple],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                )
              : null,
          borderRadius: BorderRadius.circular(22),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: kIndigo.withOpacity(0.4),
                    blurRadius: 14,
                    offset: const Offset(0, 4),
                  )
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isSelected ? _activeIcons[index] : _icons[index],
                key: ValueKey(isSelected),
                color: isSelected ? Colors.white : Colors.white.withOpacity(0.35),
                size: 20,
              ),
            ),
            if (isSelected) ...[
              const SizedBox(width: 6),
              Text(
                _titles[index],
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.2,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildBody(PortfolioProvider provider) {
    if (provider.isLoading) {
      return const _LoadingScreen();
    }

    if (provider.errorMessage.isNotEmpty &&
        provider.projects.isEmpty &&
        provider.skills.isEmpty) {
      return _ErrorScreen(onRetry: () => provider.loadPortfolioData());
    }

    return IndexedStack(
      index: _currentIndex,
      children: _screens,
    );
  }
}

// ── Animated Loading Screen ──────────────────────────────────────
class _LoadingScreen extends StatefulWidget {
  const _LoadingScreen();

  @override
  State<_LoadingScreen> createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<_LoadingScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _rotCtrl;

  @override
  void initState() {
    super.initState();
    _rotCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();
  }

  @override
  void dispose() {
    _rotCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Spinning gradient ring + logo
            Stack(
              alignment: Alignment.center,
              children: [
                AnimatedBuilder(
                  animation: _rotCtrl,
                  builder: (_, child) => Transform.rotate(
                    angle: _rotCtrl.value * 2 * pi,
                    child: child,
                  ),
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const SweepGradient(
                        colors: [kIndigo, kPurple, kCyan, Colors.transparent],
                        stops: [0.0, 0.4, 0.7, 1.0],
                      ),
                    ),
                  ),
                ),
                Container(
                  width: 86,
                  height: 86,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: kBg,
                  ),
                ),
                Container(
                  width: 72,
                  height: 72,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [kIndigo, kPurple],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      'SR',
                      style: GoogleFonts.inter(
                        color: Colors.white,
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                ),
              ],
            )
                .animate()
                .fadeIn(duration: 600.ms)
                .scale(begin: const Offset(0.7, 0.7), curve: Curves.easeOutBack),
            const SizedBox(height: 40),
            Text(
              'sachin.dev',
              style: GoogleFonts.inter(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w900,
                letterSpacing: -0.5,
              ),
            ).animate(delay: 300.ms).fadeIn(duration: 500.ms).slideY(begin: 0.3),
            const SizedBox(height: 8),
            Text(
              'Loading portfolio...',
              style: GoogleFonts.inter(
                color: Colors.white.withOpacity(0.35),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ).animate(delay: 500.ms).fadeIn(duration: 500.ms),
            const SizedBox(height: 40),
            // Dots loading indicator
            Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (i) {
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: 6,
                  height: 6,
                  decoration: const BoxDecoration(
                    color: kIndigo,
                    shape: BoxShape.circle,
                  ),
                )
                    .animate(onPlay: (c) => c.repeat(reverse: true))
                    .scaleXY(
                      begin: 0.5,
                      end: 1.2,
                      duration: 600.ms,
                      delay: Duration(milliseconds: i * 150),
                      curve: Curves.easeInOut,
                    )
                    .then()
                    .scaleXY(begin: 1.2, end: 0.5, duration: 600.ms, curve: Curves.easeInOut);
              }),
            ).animate(delay: 700.ms).fadeIn(duration: 400.ms),
          ],
        ),
      ),
    );
  }
}

// ── Error Screen ─────────────────────────────────────────────────
class _ErrorScreen extends StatelessWidget {
  final VoidCallback onRetry;
  const _ErrorScreen({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kBg,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFFEF4444).withOpacity(0.15),
                      Colors.transparent,
                    ],
                  ),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFFEF4444).withOpacity(0.3),
                    width: 1.5,
                  ),
                ),
                child: const Icon(
                  Icons.wifi_off_rounded,
                  color: Color(0xFFEF4444),
                  size: 38,
                ),
              ).animate().fadeIn(duration: 600.ms).scale(begin: const Offset(0.7, 0.7), curve: Curves.easeOutBack),
              const SizedBox(height: 28),
              Text(
                'Connection Failed',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                ),
              ).animate(delay: 200.ms).fadeIn().slideY(begin: 0.3),
              const SizedBox(height: 12),
              Text(
                'Could not reach the portfolio backend.\nShowing cached data where available.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  color: Colors.white.withOpacity(0.45),
                  fontSize: 14,
                  height: 1.65,
                ),
              ).animate(delay: 350.ms).fadeIn().slideY(begin: 0.3),
              const SizedBox(height: 36),
              GestureDetector(
                onTap: onRetry,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [kIndigo, kPurple],
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: kIndigo.withOpacity(0.45),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.refresh_rounded, color: Colors.white, size: 18),
                      const SizedBox(width: 10),
                      Text(
                        'Try Again',
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          fontSize: 15,
                        ),
                      ),
                    ],
                  ),
                ),
              ).animate(delay: 500.ms).fadeIn().slideY(begin: 0.4),
            ],
          ),
        ),
      ),
    );
  }
}
