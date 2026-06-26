import 'package:flutter/material.dart';
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
        title: 'Sachin Portfolio',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          brightness: Brightness.dark,
          primaryColor: const Color(0xFF6366F1), // Indigo
          scaffoldBackgroundColor: const Color(0xFF0F172A), // Slate-900
          
          // Color scheme settings
          colorScheme: const ColorScheme.dark(
            primary: Color(0xFF6366F1),
            secondary: Color(0xFF06B6D4), // Cyan
            surface: Color(0xFF1E293B), // Slate-800
            background: Color(0xFF0F172A),
            error: Color(0xFFEF4444),
          ),
          
          // AppBar customization
          appBarTheme: const AppBarTheme(
            backgroundColor: Color(0xFF1E293B),
            elevation: 0,
            centerTitle: false,
            titleTextStyle: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          
          // Bottom Navigation customization
          bottomNavigationBarTheme: const BottomNavigationBarThemeData(
            backgroundColor: Color(0xFF1E293B),
            selectedItemColor: Color(0xFF6366F1),
            unselectedItemColor: Color(0xFF94A3B8),
            type: BottomNavigationBarType.fixed,
            elevation: 8,
          ),
          
          // Chip theme
          chipTheme: ChipThemeData(
            backgroundColor: const Color(0xFF1E293B),
            selectedColor: const Color(0xFF6366F1),
            secondarySelectedColor: const Color(0xFF6366F1),
            labelStyle: const TextStyle(color: Colors.white),
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
