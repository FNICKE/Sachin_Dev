import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'providers/portfolio_provider.dart';
import 'screens/shell.dart';
import 'theme/app_theme.dart';
import 'theme/theme_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Load the bundled fonts before the first frame so text never flashes in a fallback font.
  AppText.preload();
  try {
    await GoogleFonts.pendingFonts().timeout(const Duration(seconds: 2));
  } catch (_) {
    // Start anyway — the fonts will swap in as soon as they're ready.
  }

  // The fonts ship with the app (assets/google_fonts); register their open-source licences.
  LicenseRegistry.addLicense(() async* {
    for (final (family, file) in [
      ('Instrument Serif', 'OFL-instrumentserif.txt'),
      ('Instrument Sans', 'OFL-instrumentsans.txt'),
      ('JetBrains Mono', 'OFL-jetbrainsmono.txt'),
    ]) {
      final text = await rootBundle.loadString('assets/google_fonts/$file');
      yield LicenseEntryWithLineBreaks([family], text);
    }
  });

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PortfolioProvider()..loadPortfolioData()),
        ChangeNotifierProvider(create: (_) => ThemeController()),
        ChangeNotifierProvider(create: (_) => ShellController()),
      ],
      child: Consumer<ThemeController>(
        builder: (context, theme, _) {
          final dark = theme.isDark;
          SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
            statusBarColor: Colors.transparent,
            statusBarIconBrightness: dark ? Brightness.light : Brightness.dark,
            statusBarBrightness: dark ? Brightness.dark : Brightness.light,
            systemNavigationBarColor: dark ? Palette.dark.canvas : Palette.light.canvas,
            systemNavigationBarIconBrightness: dark ? Brightness.light : Brightness.dark,
          ));
          return MaterialApp(
            title: 'Sachin Rathod',
            debugShowCheckedModeBanner: false,
            themeMode: theme.mode,
            theme: buildTheme(Palette.light, Brightness.light),
            darkTheme: buildTheme(Palette.dark, Brightness.dark),
            themeAnimationDuration: const Duration(milliseconds: 450),
            home: const Shell(),
          );
        },
      ),
    );
  }
}
