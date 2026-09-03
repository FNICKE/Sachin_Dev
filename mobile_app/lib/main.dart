import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'providers/portfolio_provider.dart';
import 'screens/navigation_wrapper.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PortfolioProvider()),
      ],
      child: MaterialApp(
        title: 'Sachin Dev',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          primaryColor: const Color(0xFF6366F1),
          scaffoldBackgroundColor: const Color(0xFF020817),

          // Premium Inter font
          textTheme: GoogleFonts.interTextTheme(
            ThemeData.dark().textTheme,
          ),

          colorScheme: const ColorScheme.dark(
            primary: Color(0xFF6366F1),
            secondary: Color(0xFF06B6D4),
            surface: Color(0xFF0D1117),
            background: Color(0xFF020817),
            error: Color(0xFFEF4444),
          ),

          appBarTheme: AppBarTheme(
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: false,
            titleTextStyle: GoogleFonts.inter(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),

          bottomNavigationBarTheme: const BottomNavigationBarThemeData(
            backgroundColor: Color(0xFF0D1117),
            selectedItemColor: Color(0xFF6366F1),
            unselectedItemColor: Color(0xFF475569),
            type: BottomNavigationBarType.fixed,
            elevation: 0,
          ),

          chipTheme: ChipThemeData(
            backgroundColor: const Color(0xFF0D1117),
            selectedColor: const Color(0xFF6366F1),
            labelStyle: GoogleFonts.inter(color: Colors.white, fontSize: 11),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
          ),
        ),
        home: const NavigationWrapper(),
      ),
    );
  }
}
