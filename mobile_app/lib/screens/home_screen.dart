import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/portfolio_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late Timer _codeTimer;
  late Timer _typewriterTimer;
  int _codeIdx = 0;
  int _typewriterIdx = 0;
  String _currentTypeText = '';
  int _charIndex = 0;
  bool _deleting = false;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  final List<Map<String, dynamic>> _codeLines = const [
    {'text': "const dev = new Sachin();", 'color': Color(0xFFC792EA)},
    {'text': "dev.skills = ['React','Node','MySQL'];", 'color': Color(0xFF82AAFF)},
    {'text': "dev.passion = 'crafting UX';", 'color': Color(0xFFC3E88D)},
    {'text': "dev.deploy().then(wow => 🚀);", 'color': Color(0xFFF78C6C)},
    {'text': "await dev.ship('scalable app');", 'color': Color(0xFF89DDFF)},
  ];

  final List<String> _typewriterPhrases = const [
    'Fullstack Developer',
    'Computer Engineer',
    'Problem Solver',
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _codeTimer = Timer.periodic(const Duration(milliseconds: 2500), (timer) {
      if (mounted) setState(() => _codeIdx = (_codeIdx + 1) % _codeLines.length);
    });

    _typewriterTimer = Timer.periodic(const Duration(milliseconds: 90), (timer) {
      _animateTypewriter();
    });
  }

  void _animateTypewriter() {
    if (!mounted) return;
    final currentPhrase = _typewriterPhrases[_typewriterIdx];
    setState(() {
      if (!_deleting) {
        if (_charIndex < currentPhrase.length) {
          _charIndex++;
          _currentTypeText = currentPhrase.substring(0, _charIndex);
        } else {
          _deleting = true;
          _typewriterTimer.cancel();
          Future.delayed(const Duration(milliseconds: 1800), () {
            if (mounted) {
              _typewriterTimer = Timer.periodic(const Duration(milliseconds: 55), (t) {
                _animateTypewriter();
              });
            }
          });
        }
      } else {
        if (_charIndex > 0) {
          _charIndex--;
          _currentTypeText = currentPhrase.substring(0, _charIndex);
        } else {
          _deleting = false;
          _typewriterIdx = (_typewriterIdx + 1) % _typewriterPhrases.length;
          _typewriterTimer.cancel();
          Future.delayed(const Duration(milliseconds: 400), () {
            if (mounted) {
              _typewriterTimer = Timer.periodic(const Duration(milliseconds: 90), (t) {
                _animateTypewriter();
              });
            }
          });
        }
      }
    });
  }

  @override
  void dispose() {
    _codeTimer.cancel();
    _typewriterTimer.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  Future<void> _launchUrl(String urlString, BuildContext context) async {
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open: $urlString')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<PortfolioProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF13131B),
      body: CustomScrollView(
        slivers: [
          // Transparent SliverAppBar
          SliverAppBar(
            expandedHeight: 0,
            floating: true,
            snap: true,
            backgroundColor: const Color(0xFF13131B).withOpacity(0.9),
            elevation: 0,
            title: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                    ),
                  ),
                  child: const Center(
                    child: Text(
                      'SR',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                const Text(
                  'sachin.dev',
                  style: TextStyle(
                    color: Color(0xFF94A3B8),
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.refresh_rounded, color: Color(0xFF475569), size: 20),
                onPressed: () => provider.refreshData(),
              ),
              const SizedBox(width: 4),
            ],
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 100),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── AVAILABILITY PILL ──
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF22C55E).withOpacity(0.06),
                        border: Border.all(
                          color: const Color(0xFF22C55E).withOpacity(0.25),
                        ),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          AnimatedBuilder(
                            animation: _pulseAnimation,
                            builder: (context, child) => Opacity(
                              opacity: _pulseAnimation.value,
                              child: Container(
                                width: 7,
                                height: 7,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF22C55E),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'AVAILABLE FOR FREELANCE & FULLTIME',
                            style: TextStyle(
                              color: Color(0xFF4ADE80),
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ── HEADLINE ──
                  const Text(
                    'Hi, I build stunning',
                    style: TextStyle(
                      fontSize: 34,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                      letterSpacing: -0.8,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 6),
                  // Typewriter gradient text
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [
                        Color(0xFF818CF8),
                        Color(0xFFC084FC),
                        Color(0xFFEC4899),
                      ],
                    ).createShader(bounds),
                    child: Text(
                      '$_currentTypeText|',
                      style: const TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: -0.8,
                        height: 1.1,
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Sub-description
                  Text(
                    'Fullstack developer specializing in React, Node.js & MySQL. I turn complex ideas into seamless, production-grade experiences.',
                    style: TextStyle(
                      fontSize: 15,
                      color: const Color(0xFF94A3B8).withOpacity(0.85),
                      height: 1.65,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  const SizedBox(height: 28),

                  // ── CTA BUTTONS ──
                  Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => _launchUrl('https://github.com/FNICKE', context),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 15),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                              ),
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF6366F1).withOpacity(0.35),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.bolt_rounded, color: Color(0xFFFBBF24), size: 18),
                                SizedBox(width: 8),
                                Text(
                                  'View My Work',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            if (provider.resumeUrl.isNotEmpty) {
                              _launchUrl(provider.resumeUrl, context);
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 15),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: const Color(0xFF334155)),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.download_rounded, color: Colors.white, size: 18),
                                SizedBox(width: 8),
                                Text(
                                  'Resume',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // ── macOS TERMINAL ──
                  Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFF1E293B)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.5),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Window bar
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                          decoration: const BoxDecoration(
                            color: Color(0xFF0F172A),
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(18),
                              topRight: Radius.circular(18),
                            ),
                            border: Border(
                              bottom: BorderSide(color: Color(0xFF1E293B)),
                            ),
                          ),
                          child: Row(
                            children: [
                              _windowDot(const Color(0xFFFF5F57)),
                              const SizedBox(width: 6),
                              _windowDot(const Color(0xFFFEBC2E)),
                              const SizedBox(width: 6),
                              _windowDot(const Color(0xFF28C840)),
                              const SizedBox(width: 14),
                              const Text(
                                'bash — 80×24',
                                style: TextStyle(
                                  fontFamily: 'Geist',
                                  fontSize: 11,
                                  color: Color(0xFF94A3B8),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Code content
                        Padding(
                          padding: const EdgeInsets.all(18.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Prompt line
                              RichText(
                                text: const TextSpan(
                                  style: TextStyle(fontFamily: 'Geist', fontSize: 13, height: 1.4),
                                  children: [
                                    TextSpan(text: '➜  ', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '~  ', style: TextStyle(color: Color(0xFFC0C1FF))),
                                    TextSpan(text: 'cat sachin.json', style: TextStyle(color: Colors.white)),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 8),
                              // JSON printing block
                              RichText(
                                text: const TextSpan(
                                  style: TextStyle(fontFamily: 'Geist', fontSize: 13, height: 1.45, color: Color(0xFFC7C4D7)),
                                  children: [
                                    TextSpan(text: '{\n'),
                                    TextSpan(text: '  "name": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '"Sachin Rathod",\n', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    
                                    TextSpan(text: '  "role": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '"Fullstack Engineer",\n', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    
                                    TextSpan(text: '  "passion": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '[\n    ', style: TextStyle(color: Color(0xFFC7C4D7))),
                                    TextSpan(text: '"Clean Code",\n    ', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '"System Design",\n    ', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '"UX Motion"\n  ', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '],\n', style: TextStyle(color: Color(0xFFC7C4D7))),
                                    
                                    TextSpan(text: '  "techStack": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '{\n    ', style: TextStyle(color: Color(0xFFC7C4D7))),
                                    TextSpan(text: '"frontend": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '"React/Next.js",\n    ', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '"backend": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '"Node/Go",\n    ', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '"database": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '"PostgreSQL"\n  ', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '},\n', style: TextStyle(color: Color(0xFFC7C4D7))),
                                    
                                    TextSpan(text: '  "location": ', style: TextStyle(color: Color(0xFFFFB0CD))),
                                    TextSpan(text: '"India"\n', style: TextStyle(color: Color(0xFF4CD7F6))),
                                    TextSpan(text: '}'),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 12),
                              // Blinking prompt pointer
                              Row(
                                children: [
                                  const Text(
                                    '➜  ~  ',
                                    style: TextStyle(
                                      fontFamily: 'Geist',
                                      fontSize: 13,
                                      color: Color(0xFF4CD7F6),
                                    ),
                                  ),
                                  Container(
                                    width: 8,
                                    height: 15,
                                    color: const Color(0xFFC0C1FF),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // ── STATS STRIP ──
                  Row(
                    children: [
                      Expanded(
                        child: _statCard('25+', 'Projects', Icons.rocket_launch_outlined, const Color(0xFF6366F1)),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _statCard('15+', 'Tech Stack', Icons.terminal_outlined, const Color(0xFFEC4899)),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _statCard('5K+', 'Profile Views', Icons.remove_red_eye_outlined, const Color(0xFF06B6D4)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // ── SELECTED SKILLS ──
                  Row(
                    children: [
                      Container(
                        width: 4,
                        height: 20,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Selected Toolkit',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: -0.3,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Wrap(
                      spacing: 8,
                      runSpacing: 10,
                      children: const [
                        _TechPill(name: 'React', color: Color(0xFF61DAFB)),
                        _TechPill(name: 'Node.js', color: Color(0xFF68A063)),
                        _TechPill(name: 'TypeScript', color: Color(0xFF3178C6)),
                        _TechPill(name: 'MySQL', color: Color(0xFF00758F)),
                        _TechPill(name: 'Next.js', color: Colors.white),
                        _TechPill(name: 'MongoDB', color: Color(0xFF4DB33D)),
                        _TechPill(name: 'Tailwind', color: Color(0xFF38BDF8)),
                        _TechPill(name: 'Python', color: Color(0xFF3776AB)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // ── ABOUT CARD ──
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFF0F172A),
                          const Color(0xFF020817),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: const Color(0xFF1E293B)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFF6366F1).withOpacity(0.12),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.person_outline_rounded,
                                  color: Color(0xFF818CF8), size: 18),
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              'About Me',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 17,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          "A passionate Computer Engineering student at Saraswati College of Engineering. I bridge academic theory and real-world full-stack innovation, specializing in the MERN stack.",
                          style: TextStyle(
                            color: const Color(0xFF94A3B8).withOpacity(0.8),
                            fontSize: 14,
                            height: 1.65,
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Location badge
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            _infoPill(Icons.location_on_outlined, 'Mumbai, India', const Color(0xFF818CF8)),
                            _infoPill(Icons.school_outlined, 'CS Engineering', const Color(0xFFF9A8D4)),
                            _infoPill(Icons.code_rounded, 'MERN Stack', const Color(0xFF6EE7B7)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // ── CONNECT BUTTONS ──
                  Row(
                    children: [
                      Expanded(
                        child: _socialButton(
                          icon: Icons.alternate_email_rounded,
                          label: 'GitHub',
                          color: const Color(0xFF818CF8),
                          onTap: () => _launchUrl('https://github.com/FNICKE', context),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _socialButton(
                          icon: Icons.work_outline_rounded,
                          label: 'LinkedIn',
                          color: const Color(0xFF0A66C2),
                          onTap: () => _launchUrl(
                              'https://www.linkedin.com/in/sachin-rathod-469168310',
                              context),
                        ),
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

  Widget _windowDot(Color color) {
    return Container(
      width: 11,
      height: 11,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );
  }

  Widget _statCard(String value, String label, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF1E293B)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 10),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label.toUpperCase(),
            style: const TextStyle(
              fontSize: 8,
              fontWeight: FontWeight.w800,
              color: Color(0xFF475569),
              letterSpacing: 0.8,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _infoPill(IconData icon, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 13),
          const SizedBox(width: 5),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _socialButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 13),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF1E293B)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TechPill extends StatelessWidget {
  final String name;
  final Color color;

  const _TechPill({required this.name, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.06),
        border: Border.all(color: color.withOpacity(0.22)),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        name,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
