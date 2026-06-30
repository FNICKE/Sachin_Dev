import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/portfolio_provider.dart';
import '../models/project.dart';
import 'project_detail_screen.dart';

// ── Color constants matching website palette ─────────────────
const Color kIndigo = Color(0xFF6366F1);
const Color kPurple = Color(0xFF8B5CF6);
const Color kPink = Color(0xFFEC4899);
const Color kCyan = Color(0xFF06B6D4);
const Color kBg = Color(0xFF020817);
const Color kSurface = Color(0xFF0F172A);
const Color kCard = Color(0xFF1E293B);
const Color kText = Color(0xFF94A3B8);
const Color kGreen = Color(0xFF22C55E);

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  // ── Typewriter ──────────────────────────────────────────────
  final List<String> _phrases = const [
    'Web Applications',
    'REST APIs & Backends',
    'Pixel-Perfect UIs',
    'Fullstack Solutions',
  ];
  int _phraseIdx = 0;
  int _charIdx = 0;
  bool _deleting = false;
  String _typeText = '';
  Timer? _typeTimer;

  // ── Code line carousel ──────────────────────────────────────
  final List<Map<String, dynamic>> _codeLines = const [
    {'text': "const dev = new Sachin();", 'color': Color(0xFFC792EA)},
    {'text': "dev.skills = ['React','Node','MySQL'];", 'color': Color(0xFF82AAFF)},
    {'text': "dev.passion = 'crafting UX';", 'color': Color(0xFFC3E88D)},
    {'text': "dev.deploy().then(wow => 🚀);", 'color': Color(0xFFF78C6C)},
  ];
  int _codeIdx = 0;
  Timer? _codeTimer;

  // ── Background blob phase ───────────────────────────────────
  final List<List<Color>> _bgPhases = const [
    [Color(0x386366F1), Color(0x26EC4899), Color(0x1A06B6D4)],
    [Color(0x388B5CF6), Color(0x1FF59B0B), Color(0x1A6366F1)],
    [Color(0x3306B6D4), Color(0x266366F1), Color(0x1AEC4899)],
    [Color(0x33EC4899), Color(0x2606B6D4), Color(0x1A8B5CF6)],
  ];
  int _bgPhase = 0;
  Timer? _bgTimer;

  // ── Particle dots ───────────────────────────────────────────
  final List<_Particle> _particles = [];
  final Random _rng = Random();

  // ── Pulse animation for green dot ──────────────────────────
  late AnimationController _pulseCtrl;
  late Animation<double> _pulseAnim;

  // ── Blob animation controllers ─────────────────────────────
  late AnimationController _blob1Ctrl;
  late AnimationController _blob2Ctrl;
  late AnimationController _blob3Ctrl;

  @override
  void initState() {
    super.initState();

    // Pulse
    _pulseCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))
      ..repeat(reverse: true);
    _pulseAnim = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _pulseCtrl, curve: Curves.easeInOut),
    );

    // Blob controllers
    _blob1Ctrl = AnimationController(vsync: this, duration: const Duration(seconds: 14))
      ..repeat(reverse: true);
    _blob2Ctrl = AnimationController(vsync: this, duration: const Duration(seconds: 18))
      ..repeat(reverse: true);
    _blob3Ctrl = AnimationController(vsync: this, duration: const Duration(seconds: 11))
      ..repeat(reverse: true);

    // Particles
    for (int i = 0; i < 35; i++) {
      _particles.add(_Particle(
        x: _rng.nextDouble(),
        y: _rng.nextDouble(),
        size: _rng.nextDouble() * 2.5 + 0.8,
        delay: _rng.nextDouble() * 5,
        duration: _rng.nextDouble() * 4 + 3,
        color: [kIndigo, kPink, kCyan, kPurple, const Color(0xFFA78BFA)][_rng.nextInt(5)],
      ));
    }

    // Timers
    _bgTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (mounted) setState(() => _bgPhase = (_bgPhase + 1) % _bgPhases.length);
    });

    _codeTimer = Timer.periodic(const Duration(milliseconds: 2200), (_) {
      if (mounted) setState(() => _codeIdx = (_codeIdx + 1) % _codeLines.length);
    });

    _startTypewriter();
  }

  void _startTypewriter() {
    _typeTimer = Timer.periodic(const Duration(milliseconds: 90), (_) {
      _tickTypewriter();
    });
  }

  void _tickTypewriter() {
    if (!mounted) return;
    final phrase = _phrases[_phraseIdx];
    setState(() {
      if (!_deleting) {
        if (_charIdx < phrase.length) {
          _charIdx++;
          _typeText = phrase.substring(0, _charIdx);
        } else {
          _deleting = true;
          _typeTimer?.cancel();
          Future.delayed(const Duration(milliseconds: 1800), () {
            if (mounted) {
              _typeTimer = Timer.periodic(const Duration(milliseconds: 55), (_) => _tickTypewriter());
            }
          });
        }
      } else {
        if (_charIdx > 0) {
          _charIdx--;
          _typeText = phrase.substring(0, _charIdx);
        } else {
          _deleting = false;
          _phraseIdx = (_phraseIdx + 1) % _phrases.length;
          _typeTimer?.cancel();
          Future.delayed(const Duration(milliseconds: 350), () {
            if (mounted) {
              _typeTimer = Timer.periodic(const Duration(milliseconds: 90), (_) => _tickTypewriter());
            }
          });
        }
      }
    });
  }

  @override
  void dispose() {
    _typeTimer?.cancel();
    _codeTimer?.cancel();
    _bgTimer?.cancel();
    _pulseCtrl.dispose();
    _blob1Ctrl.dispose();
    _blob2Ctrl.dispose();
    _blob3Ctrl.dispose();
    super.dispose();
  }

  Future<void> _launch(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open: $url')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<PortfolioProvider>(context);
    final phase = _bgPhases[_bgPhase];

    return Scaffold(
      backgroundColor: kBg,
      body: Stack(
        children: [
          // ── Animated morphing background blobs ──────────────
          _AnimatedBlob(
            controller: _blob1Ctrl,
            color: phase[0],
            alignment: const Alignment(-1.2, -1.2),
            size: 400,
          ),
          _AnimatedBlob(
            controller: _blob2Ctrl,
            color: phase[1],
            alignment: const Alignment(1.2, 0.8),
            size: 380,
          ),
          _AnimatedBlob(
            controller: _blob3Ctrl,
            color: phase[2],
            alignment: const Alignment(0.0, 0.2),
            size: 280,
          ),

          // ── Particle dots overlay ──────────────────────────
          Positioned.fill(
            child: IgnorePointer(
              child: CustomPaint(
                painter: _ParticlePainter(_particles),
              ),
            ),
          ),

          // ── Main scrollable content ────────────────────────
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // App bar
              SliverToBoxAdapter(child: _buildAppBar(provider)),

              // ── HERO SECTION ─────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Availability pill
                      Center(child: _buildAvailabilityPill()),
                      const SizedBox(height: 28),

                      // Headline
                      _buildHeadline(),
                      const SizedBox(height: 20),

                      // Sub-text
                      RichText(
                        text: TextSpan(
                          style: TextStyle(
                            fontSize: 15,
                            color: kText.withOpacity(0.85),
                            height: 1.65,
                          ),
                          children: const [
                            TextSpan(text: 'Fullstack developer specializing in '),
                            TextSpan(
                              text: 'React, Node.js & MySQL',
                              style: TextStyle(color: Color(0xFFA5B4FC), fontWeight: FontWeight.bold),
                            ),
                            TextSpan(text: '. I turn complex ideas into seamless, production-grade experiences.'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 28),

                      // CTA buttons
                      _buildCtaButtons(provider),
                      const SizedBox(height: 28),

                      // Social links
                      _buildSocialLinks(),
                      const SizedBox(height: 32),

                      // Hero image card (matches website's visual card)
                      _buildHeroVisualCard(),
                      const SizedBox(height: 32),

                      // Stats strip (matches website's stats section)
                      _buildStatsStrip(),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),

              // ── FEATURED PROJECTS ─────────────────────────────
              SliverToBoxAdapter(
                child: Container(
                  decoration: BoxDecoration(
                    border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 40, 20, 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionLabel(Icons.code_rounded, 'Selected Work'),
                        const SizedBox(height: 10),
                        _buildSectionTitle('Featured ', 'Projects'),
                        const SizedBox(height: 8),
                        Text(
                          'Hand-picked builds that showcase my range — from fullstack apps to pixel-perfect UIs.',
                          style: TextStyle(fontSize: 14, color: kText.withOpacity(0.7), height: 1.6),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
              ),

              // Projects list
              _buildFeaturedProjectsList(provider),

              // View All button
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
                  child: _buildViewAllButton(),
                ),
              ),

              // ── SKILLS SECTION ─────────────────────────────────
              SliverToBoxAdapter(
                child: Container(
                  decoration: BoxDecoration(
                    border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 40, 20, 24),
                    child: Column(
                      children: [
                        _buildSectionLabel(Icons.bolt_rounded, 'What I Know'),
                        const SizedBox(height: 10),
                        _buildSectionTitle('Technical ', 'Skills'),
                        const SizedBox(height: 8),
                        Text(
                          'A broad toolkit to build, ship, and scale production-grade software.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 14, color: kText.withOpacity(0.7), height: 1.6),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              _buildSkillsGrid(provider),

              // ── CTA BANNER (matches website's "Have a project in mind?") ──
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 40, 20, 100),
                  child: _buildCtaBanner(),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── WIDGETS ─────────────────────────────────────────────────

  Widget _buildAppBar(PortfolioProvider provider) {
    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 12, 16, 0),
        child: Row(
          children: [
            // Logo
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(colors: [kIndigo, kPurple]),
                boxShadow: [BoxShadow(color: kIndigo.withOpacity(0.4), blurRadius: 12, spreadRadius: 2)],
              ),
              child: const Center(
                child: Text('SR', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900)),
              ),
            ),
            const SizedBox(width: 10),
            Text('sachin.dev',
                style: TextStyle(color: kText.withOpacity(0.8), fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.5)),
            const Spacer(),
            GestureDetector(
              onTap: () => provider.refreshData(),
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: kSurface,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: kCard),
                ),
                child: Icon(Icons.refresh_rounded, color: kText.withOpacity(0.6), size: 18),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvailabilityPill() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: kGreen.withOpacity(0.06),
        border: Border.all(color: kGreen.withOpacity(0.28)),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          AnimatedBuilder(
            animation: _pulseAnim,
            builder: (_, __) => Opacity(
              opacity: _pulseAnim.value,
              child: Container(
                width: 7, height: 7,
                decoration: const BoxDecoration(color: kGreen, shape: BoxShape.circle),
              ),
            ),
          ),
          const SizedBox(width: 8),
          const Text(
            'AVAILABLE FOR FREELANCE & FULLTIME',
            style: TextStyle(color: Color(0xFF4ADE80), fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.0),
          ),
        ],
      ),
    );
  }

  Widget _buildHeadline() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: const TextSpan(
            style: TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.8, height: 1.1),
            children: [
              TextSpan(text: 'Hi, I build '),
              // Gradient "stunning" word
            ],
          ),
        ),
        // "stunning" with gradient shimmer
        ShaderMask(
          shaderCallback: (bounds) => const LinearGradient(
            colors: [Color(0xFF818CF8), Color(0xFFC084FC), Color(0xFFEC4899), Color(0xFF06B6D4)],
            stops: [0.0, 0.35, 0.65, 1.0],
          ).createShader(bounds),
          child: const Text(
            'stunning',
            style: TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.8, height: 1.1),
          ),
        ),
        const SizedBox(height: 6),
        // Typewriter line
        Row(
          children: [
            Flexible(
              child: Text(
                '$_typeText|',
                style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.5, height: 1.2),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCtaButtons(PortfolioProvider provider) {
    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => _launch('https://github.com/FNICKE'),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 15),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [kIndigo, kPurple, kPink]),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [BoxShadow(color: kIndigo.withOpacity(0.45), blurRadius: 20, offset: const Offset(0, 8))],
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.auto_awesome_rounded, color: Color(0xFFFBBF24), size: 17),
                  SizedBox(width: 8),
                  Text('View My Work', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  SizedBox(width: 6),
                  Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: GestureDetector(
            onTap: () {
              if (provider.resumeUrl.isNotEmpty) _launch(provider.resumeUrl);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 15),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.15)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.download_rounded, color: Colors.white, size: 17),
                  SizedBox(width: 8),
                  Text('Download Resume', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSocialLinks() {
    return Row(
      children: [
        GestureDetector(
          onTap: () => _launch('https://github.com/FNICKE'),
          child: _SocialChip(icon: Icons.code_rounded, label: 'GitHub', color: kText.withOpacity(0.7)),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          child: Container(width: 1, height: 16, color: Colors.white.withOpacity(0.1)),
        ),
        GestureDetector(
          onTap: () => _launch('https://www.linkedin.com/in/sachin-rathod-469168310'),
          child: _SocialChip(icon: Icons.work_outline_rounded, label: 'LinkedIn', color: kText.withOpacity(0.7)),
        ),
      ],
    );
  }

  Widget _buildHeroVisualCard() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: kIndigo.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.6), blurRadius: 40, offset: const Offset(0, 12)),
          BoxShadow(color: kIndigo.withOpacity(0.2), blurRadius: 60, spreadRadius: -8),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [const Color(0xFF0A0F1E), kSurface],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Stack(
            children: [
              // Subtle grid background
              Positioned.fill(
                child: CustomPaint(painter: _GridPainter()),
              ),
              // Ambient glow top-left
              Positioned(
                top: -40, left: -40,
                child: Container(
                  width: 200, height: 200,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [kIndigo.withOpacity(0.18), Colors.transparent],
                    ),
                  ),
                ),
              ),
              // Ambient glow bottom-right
              Positioned(
                bottom: -40, right: -40,
                child: Container(
                  width: 180, height: 180,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [kPink.withOpacity(0.12), Colors.transparent],
                    ),
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top floating badges row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _FloatingBadge(
                          icon: Icons.terminal_rounded,
                          label: 'sachin@dev ▌',
                          iconColor: const Color(0xFF818CF8),
                          textColor: const Color(0xFF818CF8),
                          bgColor: kIndigo.withOpacity(0.1),
                          borderColor: kIndigo.withOpacity(0.3),
                        ),
                        _FloatingBadge(
                          icon: Icons.layers_rounded,
                          label: 'Fullstack',
                          iconColor: const Color(0xFFF9A8D4),
                          textColor: const Color(0xFFF9A8D4),
                          bgColor: kPink.withOpacity(0.1),
                          borderColor: kPink.withOpacity(0.3),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // macOS Terminal window
                    Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.7),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.07)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Window title bar
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: kSurface.withOpacity(0.8),
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                              border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.06))),
                            ),
                            child: Row(
                              children: [
                                _WindowDot(const Color(0xFFFF5F57)),
                                const SizedBox(width: 6),
                                _WindowDot(const Color(0xFFFEBC2E)),
                                const SizedBox(width: 6),
                                _WindowDot(const Color(0xFF28C840)),
                                const SizedBox(width: 14),
                                Text('bash — sachin.dev', style: TextStyle(color: kText.withOpacity(0.5), fontSize: 11)),
                              ],
                            ),
                          ),
                          // Terminal body
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // cat sachin.json prompt
                                RichText(
                                  text: TextSpan(
                                    style: const TextStyle(fontFamily: 'monospace', fontSize: 12, height: 1.5),
                                    children: [
                                      TextSpan(text: '➜  ', style: TextStyle(color: const Color(0xFF4CD7F6))),
                                      TextSpan(text: '~  ', style: TextStyle(color: const Color(0xFFC0C1FF))),
                                      const TextSpan(text: 'cat sachin.json', style: TextStyle(color: Colors.white)),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                // JSON output
                                RichText(
                                  text: const TextSpan(
                                    style: TextStyle(fontFamily: 'monospace', fontSize: 12, height: 1.6, color: Color(0xFFC7C4D7)),
                                    children: [
                                      TextSpan(text: '{\n'),
                                      TextSpan(text: '  "name": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                      TextSpan(text: '"Sachin Rathod",\n', style: TextStyle(color: Color(0xFF4CD7F6))),
                                      TextSpan(text: '  "role": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                      TextSpan(text: '"Fullstack Engineer",\n', style: TextStyle(color: Color(0xFF4CD7F6))),
                                      TextSpan(text: '  "stack": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                      TextSpan(text: '["React", "Node.js", "MySQL"],\n', style: TextStyle(color: Color(0xFF4CD7F6))),
                                      TextSpan(text: '  "location": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                      TextSpan(text: '"Mumbai, India"\n', style: TextStyle(color: Color(0xFF4CD7F6))),
                                      TextSpan(text: '}'),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                // Blinking cursor
                                Row(
                                  children: [
                                    Text('➜  ~  ', style: TextStyle(fontFamily: 'monospace', fontSize: 12, color: const Color(0xFF4CD7F6))),
                                    Container(width: 8, height: 14, color: const Color(0xFFC0C1FF)),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Animated cycling code line
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: kIndigo.withOpacity(0.07),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: kIndigo.withOpacity(0.15)),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.code_rounded, color: kIndigo.withOpacity(0.7), size: 14),
                          const SizedBox(width: 10),
                          Expanded(
                            child: AnimatedSwitcher(
                              duration: const Duration(milliseconds: 350),
                              transitionBuilder: (child, anim) => FadeTransition(
                                opacity: anim,
                                child: SlideTransition(
                                  position: Tween<Offset>(begin: const Offset(0, 0.3), end: Offset.zero).animate(anim),
                                  child: child,
                                ),
                              ),
                              child: Text(
                                _codeLines[_codeIdx]['text'] as String,
                                key: ValueKey(_codeIdx),
                                style: TextStyle(
                                  fontFamily: 'monospace',
                                  color: _codeLines[_codeIdx]['color'] as Color,
                                  fontSize: 12,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatsStrip() {
    final stats = [
      {'value': '20+', 'label': 'Projects Built', 'icon': Icons.rocket_launch_outlined, 'color': const Color(0xFF7AA2F7)},
      {'value': '1+', 'label': 'Yrs Exp', 'icon': Icons.bolt_outlined, 'color': const Color(0xFFBB9AF7)},
      {'value': '15+', 'label': 'Happy Clients', 'icon': Icons.star_outline_rounded, 'color': const Color(0xFF9ECE6A)},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 4),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [kSurface, const Color(0xFF0A0F1E)],
          begin: Alignment.topLeft, end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.4), blurRadius: 20, offset: const Offset(0, 8))],
      ),
      child: Row(
        children: stats.asMap().entries.map((entry) {
          final stat = entry.value;
          final isLast = entry.key == stats.length - 1;
          return Expanded(
            child: Row(
              children: [
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 8),
                    child: Column(
                      children: [
                        Icon(stat['icon'] as IconData, color: stat['color'] as Color, size: 22),
                        const SizedBox(height: 8),
                        Text(
                          stat['value'] as String,
                          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: stat['color'] as Color),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          (stat['label'] as String).toUpperCase(),
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 8, fontWeight: FontWeight.w800, color: kText.withOpacity(0.45), letterSpacing: 0.8),
                        ),
                      ],
                    ),
                  ),
                ),
                if (!isLast)
                  Container(width: 1, height: 40, color: Colors.white.withOpacity(0.06)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSectionLabel(IconData icon, String text) {
    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: kIndigo.withOpacity(0.08),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: kIndigo.withOpacity(0.2)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 13, color: const Color(0xFF818CF8)),
            const SizedBox(width: 6),
            Text(text, style: const TextStyle(color: Color(0xFF818CF8), fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String normal, String gradient) {
    return Center(
      child: RichText(
        textAlign: TextAlign.center,
        text: TextSpan(
          style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, letterSpacing: -0.5),
          children: [
            TextSpan(text: normal, style: const TextStyle(color: Colors.white)),
            WidgetSpan(
              child: ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [Color(0xFF818CF8), Color(0xFFC084FC), Color(0xFFEC4899)],
                ).createShader(bounds),
                child: Text(gradient, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverList _buildFeaturedProjectsList(PortfolioProvider provider) {
    final featured = provider.projects.take(3).toList();

    if (featured.isEmpty) {
      return SliverList(
        delegate: SliverChildListDelegate([
          Center(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Text('No projects yet', style: TextStyle(color: kText.withOpacity(0.5))),
            ),
          ),
        ]),
      );
    }

    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, i) => Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
          child: _ProjectCard(project: featured[i], onTap: () {
            Navigator.push(context, MaterialPageRoute(
              builder: (_) => ProjectDetailScreen(project: featured[i]),
            ));
          }),
        ),
        childCount: featured.length,
      ),
    );
  }

  Widget _buildViewAllButton() {
    return GestureDetector(
      onTap: () => _launch('https://github.com/FNICKE'),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.04),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withOpacity(0.12)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('View All Projects', style: TextStyle(color: kText.withOpacity(0.8), fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(width: 8),
            Icon(Icons.arrow_forward_rounded, color: kText.withOpacity(0.6), size: 16),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildSkillsGrid(PortfolioProvider provider) {
    const hardcodedSkills = [
      {'name': 'React', 'color': Color(0xFF61DAFB)},
      {'name': 'Node.js', 'color': Color(0xFF68A063)},
      {'name': 'TypeScript', 'color': Color(0xFF3178C6)},
      {'name': 'MySQL', 'color': Color(0xFF00758F)},
      {'name': 'Next.js', 'color': Colors.white},
      {'name': 'MongoDB', 'color': Color(0xFF4DB33D)},
      {'name': 'Tailwind', 'color': Color(0xFF38BDF8)},
      {'name': 'Python', 'color': Color(0xFF3776AB)},
      {'name': 'Express.js', 'color': Color(0xFFA5B4FC)},
      {'name': 'Redux', 'color': Color(0xFF764ABC)},
      {'name': 'Flutter', 'color': Color(0xFF54C5F8)},
      {'name': 'Firebase', 'color': Color(0xFFFFCA28)},
    ];

    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          alignment: WrapAlignment.center,
          children: hardcodedSkills.map((s) {
            final color = s['color'] as Color;
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.06),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: color.withOpacity(0.25)),
              ),
              child: Text(s['name'] as String,
                style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.bold)),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildCtaBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [kSurface.withOpacity(0.95), const Color(0xFF0A0F1E).withOpacity(0.98)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: kIndigo.withOpacity(0.15)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 30, offset: const Offset(0, 10))],
      ),
      child: Stack(
        children: [
          // Decorative glows
          Positioned(top: -40, left: -40,
            child: Container(width: 160, height: 160,
              decoration: BoxDecoration(shape: BoxShape.circle,
                gradient: RadialGradient(colors: [kIndigo.withOpacity(0.2), Colors.transparent])),
            ),
          ),
          Positioned(bottom: -40, right: -40,
            child: Container(width: 160, height: 160,
              decoration: BoxDecoration(shape: BoxShape.circle,
                gradient: RadialGradient(colors: [kPink.withOpacity(0.16), Colors.transparent])),
            ),
          ),

          Column(
            children: [
              // Label
              _buildSectionLabel(Icons.rocket_launch_rounded, "Let's build together"),
              const SizedBox(height: 20),

              // Title
              RichText(
                textAlign: TextAlign.center,
                text: const TextSpan(
                  style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900, letterSpacing: -0.5, height: 1.1),
                  children: [
                    TextSpan(text: 'Have a project ', style: TextStyle(color: Colors.white)),
                    WidgetSpan(
                      child: ShaderMask(
                        shaderCallback: _gradientShader,
                        child: Text('in mind?', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.5)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Text(
                "I'm always excited to collaborate on meaningful projects. Let's discuss your idea and bring it to life.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: kText.withOpacity(0.7), height: 1.6),
              ),
              const SizedBox(height: 28),

              // Buttons
              GestureDetector(
                onTap: () => _launch('mailto:sachinrathod@example.com'),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [kIndigo, kPurple, kPink]),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [BoxShadow(color: kIndigo.withOpacity(0.4), blurRadius: 20, offset: const Offset(0, 8))],
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.auto_awesome_rounded, color: Color(0xFFFDE68A), size: 17),
                      SizedBox(width: 8),
                      Text('Start a Conversation', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              GestureDetector(
                onTap: () => _launch('https://github.com/FNICKE'),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                  ),
                  child: const Center(
                    child: Text('See My Work', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  static Shader _gradientShader(Rect bounds) => const LinearGradient(
    colors: [Color(0xFF818CF8), Color(0xFFC084FC), Color(0xFFEC4899)],
  ).createShader(bounds);
}

// ── Supporting Widgets ────────────────────────────────────────

class _AnimatedBlob extends StatelessWidget {
  final AnimationController controller;
  final Color color;
  final Alignment alignment;
  final double size;

  const _AnimatedBlob({required this.controller, required this.color, required this.alignment, required this.size});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: alignment,
      child: AnimatedBuilder(
        animation: controller,
        builder: (_, __) {
          final t = Curves.easeInOut.transform(controller.value);
          final tx = (t - 0.5) * 60;
          final ty = (t - 0.5) * -50;
          return Transform.translate(
            offset: Offset(tx, ty),
            child: Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [color, Colors.transparent]),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _Particle {
  final double x, y, size, delay, duration;
  final Color color;
  _Particle({required this.x, required this.y, required this.size, required this.delay, required this.duration, required this.color});
}

class _ParticlePainter extends CustomPainter {
  final List<_Particle> particles;
  _ParticlePainter(this.particles);

  @override
  void paint(Canvas canvas, Size size) {
    for (final p in particles) {
      final paint = Paint()..color = p.color.withOpacity(0.25);
      canvas.drawCircle(Offset(p.x * size.width, p.y * size.height), p.size, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _FloatingBadge extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color iconColor, textColor, bgColor, borderColor;

  const _FloatingBadge({required this.icon, required this.label, required this.iconColor, required this.textColor, required this.bgColor, required this.borderColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: iconColor),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(color: textColor, fontSize: 11, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class _WindowDot extends StatelessWidget {
  final Color color;
  const _WindowDot(this.color);

  @override
  Widget build(BuildContext context) =>
      Container(width: 10, height: 10, decoration: BoxDecoration(color: color, shape: BoxShape.circle));
}

class _SocialChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const _SocialChip({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: color, size: 16),
        const SizedBox(width: 6),
        Text(label, style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.w600)),
      ],
    );
  }
}

class _ProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback onTap;

  const _ProjectCard({required this.project, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [kSurface, const Color(0xFF0A0F1E)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: Colors.white.withOpacity(0.07)),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            if (project.thumbnailUrl.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                child: Image.network(
                  project.thumbnailUrl,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 180,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: [kIndigo.withOpacity(0.15), kPurple.withOpacity(0.1)]),
                    ),
                    child: const Center(child: Icon(Icons.code_rounded, color: kIndigo, size: 40)),
                  ),
                ),
              ),

            Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title + arrow
                  Row(
                    children: [
                      Expanded(
                        child: Text(project.title,
                          style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800, letterSpacing: -0.3)),
                      ),
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(color: kIndigo.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                        child: const Icon(Icons.arrow_forward_rounded, color: kIndigo, size: 16),
                      ),
                    ],
                  ),

                  if (project.shortDesc.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(project.shortDesc,
                      maxLines: 2, overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: kText.withOpacity(0.7), fontSize: 13, height: 1.55)),
                  ],

                  if (project.techStack.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 6, runSpacing: 6,
                      children: project.techStack.take(4).map((t) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: kIndigo.withOpacity(0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: kIndigo.withOpacity(0.2)),
                        ),
                        child: Text(t, style: const TextStyle(color: Color(0xFFA5B4FC), fontSize: 11, fontWeight: FontWeight.w600)),
                      )).toList(),
                    ),
                  ],

                  // Live / GitHub links
                  if (project.liveUrl.isNotEmpty || project.githubUrl.isNotEmpty) ...[
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        if (project.liveUrl.isNotEmpty)
                          _LinkButton(label: 'Live Demo', icon: Icons.open_in_new_rounded, url: project.liveUrl, color: kCyan),
                        if (project.liveUrl.isNotEmpty && project.githubUrl.isNotEmpty)
                          const SizedBox(width: 10),
                        if (project.githubUrl.isNotEmpty)
                          _LinkButton(label: 'GitHub', icon: Icons.code_rounded, url: project.githubUrl, color: kText),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LinkButton extends StatelessWidget {
  final String label, url;
  final IconData icon;
  final Color color;

  const _LinkButton({required this.label, required this.icon, required this.url, required this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        final uri = Uri.parse(url);
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 13),
          const SizedBox(width: 4),
          Text(label, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

// ── Subtle dot-grid background painter ───────────────────────
class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.03)
      ..strokeWidth = 1;
    const spacing = 28.0;
    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        canvas.drawCircle(Offset(x, y), 1.2, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
