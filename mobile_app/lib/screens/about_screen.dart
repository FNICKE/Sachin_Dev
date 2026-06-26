import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF13131B),
      body: Stack(
        children: [
          // ── Background Atmospheric Shaders ──
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF8083FF).withOpacity(0.12),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF8083FF).withOpacity(0.12),
                    blurRadius: 100,
                    spreadRadius: 50,
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: 100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF4CD7F6).withOpacity(0.1),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF4CD7F6).withOpacity(0.1),
                    blurRadius: 100,
                    spreadRadius: 50,
                  ),
                ],
              ),
            ),
          ),

          // ── Scrollable Content ──
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Top Space / AppBar Placeholder
              const SliverToBoxAdapter(
                child: SizedBox(height: 60),
              ),

              // Section 1: Profile Header
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFF8083FF).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: const Color(0xFF8083FF).withOpacity(0.2),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.badge_outlined,
                              size: 14,
                              color: Color(0xFFC0C1FF),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'BEHIND THE SCREEN',
                              style: TextStyle(
                                fontFamily: 'Geist',
                                color: const Color(0xFFC0C1FF),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Title
                      RichText(
                        text: const TextSpan(
                          children: [
                            TextSpan(
                              text: 'Sachin ',
                              style: TextStyle(
                                fontFamily: 'Outfit',
                                fontSize: 44,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: -0.5,
                              ),
                            ),
                            TextSpan(
                              text: 'M.',
                              style: TextStyle(
                                fontFamily: 'Outfit',
                                fontSize: 44,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFFC0C1FF),
                                letterSpacing: -0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Subtitle text
                      RichText(
                        text: const TextSpan(
                          style: TextStyle(
                            fontFamily: 'Inter',
                            fontSize: 16,
                            color: Color(0xFFC7C4D7),
                            height: 1.6,
                          ),
                          children: [
                            TextSpan(text: 'A Computer Engineering student based in '),
                            TextSpan(
                              text: 'Mumbai, India',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                decoration: TextDecoration.underline,
                                decorationColor: Color(0xFFC0C1FF),
                                decorationThickness: 2,
                              ),
                            ),
                            TextSpan(text: '. I bridge the gap between complex engineering logic and elegant user experiences.'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Image / Avatar Container
                      Center(
                        child: Container(
                          width: double.infinity,
                          height: 320,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(32),
                            border: Border.all(color: Colors.white.withOpacity(0.08)),
                            color: const Color(0xFF1F1F27).withOpacity(0.6),
                          ),
                          padding: const EdgeInsets.all(12),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(24),
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                Image.asset(
                                  'assets/images/profile.png',
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Container(
                                    color: const Color(0xFF13131B),
                                    child: const Center(
                                      child: Icon(Icons.person_rounded, size: 64, color: Color(0xFFC0C1FF)),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  bottom: 16,
                                  right: 16,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF1F1F27).withOpacity(0.8),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(color: Colors.white.withOpacity(0.12)),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.code_rounded, size: 16, color: Color(0xFFC0C1FF)),
                                        const SizedBox(width: 8),
                                        Text(
                                          'Crafting 0s & 1s',
                                          style: TextStyle(
                                            fontFamily: 'Geist',
                                            color: const Color(0xFFE4E1ED),
                                            fontSize: 12,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Quick Info Items
                      Row(
                        children: [
                          Expanded(
                            child: _buildInfoCard(
                              Icons.school_outlined,
                              'Major',
                              'Computer Engineering',
                              const Color(0xFF4CD7F6),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildInfoCard(
                              Icons.location_on_outlined,
                              'Location',
                              'Mumbai, India',
                              const Color(0xFFFFB0CD),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 48),
                    ],
                  ),
                ),
              ),

              // Section 2: Journey & Core Philosophy
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'The Journey',
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Timeline Items
                      _buildTimelineItem('2022', 'Joined Engineering',
                          'Embarked on the journey of Computer Engineering, diving deep into data structures and algorithmic thinking.',
                          const Color(0xFFC0C1FF), true),
                      _buildTimelineItem('2023', 'First Web Project',
                          'Discovered the magic of the browser. Built my first full-stack application using the MERN stack.',
                          const Color(0xFF4CD7F6), true),
                      _buildTimelineItem('2024', 'Started Freelancing',
                          'Began collaborating with global clients, turning complex business requirements into scalable digital solutions.',
                          const Color(0xFFFFB0CD), true),
                      _buildTimelineItem('2025', 'Scale & Open Source',
                          'Focusing on contributing to major open-source ecosystems and building high-performance systems.',
                          const Color(0xFF8083FF), false),

                      const SizedBox(height: 48),

                      const Text(
                        'Core Philosophy',
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Philosophy items
                      _buildPhilosophyCard(
                        Icons.cleaning_services_rounded,
                        'Clean Code Enthusiast',
                        'I believe code is for humans first, machines second. I prioritize readability, maintainability, and elegant architecture.',
                        const Color(0xFFC0C1FF),
                      ),
                      const SizedBox(height: 16),
                      _buildPhilosophyCard(
                        Icons.psychology_rounded,
                        'Problem Solver',
                        'The thrill of debugging a complex logic leak is what drives me. I treat every challenge as a puzzle waiting to be solved.',
                        const Color(0xFF4CD7F6),
                      ),
                      const SizedBox(height: 16),
                      _buildPhilosophyCard(
                        Icons.auto_stories_rounded,
                        'Lifelong Learner',
                        'The tech landscape evolves daily. I dedicate 10 hours a week to learning new frameworks, languages, and design patterns.',
                        const Color(0xFFFFB0CD),
                      ),

                      const SizedBox(height: 48),
                    ],
                  ),
                ),
              ),

              // Section 3: Beyond the IDE (Bento-style Grid)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Beyond the IDE',
                        style: TextStyle(
                          fontFamily: 'Outfit',
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'When I\'m not writing code, you\'ll find me exploring these domains or refueling with some good old-fashioned hobbies.',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 14,
                          color: Color(0xFFC7C4D7),
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Focus Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1F1F27).withOpacity(0.6),
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(color: const Color(0xFF8083FF).withOpacity(0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                color: Color(0xFFC0C1FF),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0xFFC0C1FF),
                                    blurRadius: 6,
                                    spreadRadius: 1,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'CURRENT FOCUS: RUST ENGINEERING',
                              style: TextStyle(
                                fontFamily: 'Geist',
                                color: Color(0xFFC0C1FF),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 0.8,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Bento grid (2 columns)
                      GridView.count(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        childAspectRatio: 1.15,
                        mainAxisSpacing: 12,
                        crossAxisSpacing: 12,
                        children: [
                          _buildBentoItem(Icons.hub_rounded, 'Open Source', const Color(0xFFC0C1FF)),
                          _buildBentoItem(Icons.palette_outlined, 'UI/UX Design', const Color(0xFF4CD7F6)),
                          _buildBentoItem(Icons.coffee_rounded, 'Coffee Culture', const Color(0xFFFFB0CD)),
                          _buildBentoItem(Icons.sports_esports_rounded, 'Gaming', const Color(0xFF8083FF)),
                          _buildBentoItem(Icons.show_chart_rounded, 'Stock Market', const Color(0xFF4CD7F6)),
                          _buildBentoItem(Icons.translate_rounded, 'Linguistics', const Color(0xFFC0C1FF)),
                          _buildBentoItem(Icons.camera_alt_rounded, 'Street Photo', const Color(0xFFFFB0CD)),
                          _buildBentoItem(Icons.add_rounded, 'Always Learning', const Color(0xFFC7C4D7), isDashed: true),
                        ],
                      ),

                      const SizedBox(height: 120), // Bottom navbar gap
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(IconData icon, String label, String value, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F27).withOpacity(0.6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          Icon(icon, color: iconColor, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 11,
                    color: Color(0xFFC7C4D7),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontFamily: 'Geist',
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(String year, String title, String desc, Color dotColor, bool showLine) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline indicator column
          Column(
            children: [
              Container(
                width: 14,
                height: 14,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF13131B),
                  border: Border.all(color: dotColor, width: 2.5),
                  boxShadow: [
                    BoxShadow(
                      color: dotColor.withOpacity(0.4),
                      blurRadius: 6,
                      spreadRadius: 1,
                    ),
                  ],
                ),
              ),
              if (showLine)
                Expanded(
                  child: Container(
                    width: 1.5,
                    color: const Color(0xFFC0C1FF).withOpacity(0.3),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 18),

          // Content card
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    year,
                    style: TextStyle(
                      fontFamily: 'Geist',
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                      color: dotColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    title,
                    style: const TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    desc,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      color: Color(0xFFC7C4D7),
                      height: 1.45,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPhilosophyCard(IconData icon, String title, String desc, Color iconColor) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1F1F27).withOpacity(0.6),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: iconColor.withOpacity(0.2)),
            ),
            child: Icon(icon, color: iconColor, size: 26),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  desc,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13.5,
                    color: Color(0xFFC7C4D7),
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBentoItem(IconData icon, String title, Color color, {bool isDashed = false}) {
    return Container(
      decoration: BoxDecoration(
        color: isDashed ? Colors.transparent : const Color(0xFF1F1F27).withOpacity(0.6),
        borderRadius: BorderRadius.circular(20),
        border: isDashed
            ? Border.all(color: Colors.white.withOpacity(0.2), style: BorderStyle.solid) // simple border line
            : Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isDashed ? Colors.white.withOpacity(0.05) : Colors.white.withOpacity(0.03),
            ),
            child: Center(
              child: Icon(
                icon,
                color: isDashed ? const Color(0xFFC7C4D7) : color,
                size: 22,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontFamily: 'Geist',
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isDashed ? const Color(0xFFC7C4D7) : Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
