import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Colour tokens shared with the website (warm paper / warm ink + one signal colour).
@immutable
class Palette extends ThemeExtension<Palette> {
  const Palette({
    required this.canvas,
    required this.surface,
    required this.surface2,
    required this.ink,
    required this.dim,
    required this.faint,
    required this.line,
    required this.brand,
    required this.brandInk,
  });

  final Color canvas;
  final Color surface;
  final Color surface2;
  final Color ink;
  final Color dim;
  final Color faint;
  final Color line;
  final Color brand;
  final Color brandInk;

  static const dark = Palette(
    canvas: Color(0xFF0C0C0B),
    surface: Color(0xFF151513),
    surface2: Color(0xFF1E1E1B),
    ink: Color(0xFFECEBE4),
    dim: Color(0xFF8F8D85),
    faint: Color(0xFF56554F),
    line: Color(0x1FECEBE4),
    brand: Color(0xFFFF5C26),
    brandInk: Color(0xFF0C0C0B),
  );

  static const light = Palette(
    canvas: Color(0xFFF2F0EB),
    surface: Color(0xFFE8E5DE),
    surface2: Color(0xFFDCD8CF),
    ink: Color(0xFF161513),
    dim: Color(0xFF66645D),
    faint: Color(0xFF9C998F),
    line: Color(0x24161513),
    brand: Color(0xFFD4420C),
    brandInk: Color(0xFFFFFFFF),
  );

  @override
  Palette copyWith({
    Color? canvas,
    Color? surface,
    Color? surface2,
    Color? ink,
    Color? dim,
    Color? faint,
    Color? line,
    Color? brand,
    Color? brandInk,
  }) {
    return Palette(
      canvas: canvas ?? this.canvas,
      surface: surface ?? this.surface,
      surface2: surface2 ?? this.surface2,
      ink: ink ?? this.ink,
      dim: dim ?? this.dim,
      faint: faint ?? this.faint,
      line: line ?? this.line,
      brand: brand ?? this.brand,
      brandInk: brandInk ?? this.brandInk,
    );
  }

  @override
  Palette lerp(ThemeExtension<Palette>? other, double t) {
    if (other is! Palette) return this;
    return Palette(
      canvas: Color.lerp(canvas, other.canvas, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surface2: Color.lerp(surface2, other.surface2, t)!,
      ink: Color.lerp(ink, other.ink, t)!,
      dim: Color.lerp(dim, other.dim, t)!,
      faint: Color.lerp(faint, other.faint, t)!,
      line: Color.lerp(line, other.line, t)!,
      brand: Color.lerp(brand, other.brand, t)!,
      brandInk: Color.lerp(brandInk, other.brandInk, t)!,
    );
  }
}

extension PaletteX on BuildContext {
  Palette get palette => Theme.of(this).extension<Palette>() ?? Palette.dark;
}

/// The three type families used on the website.
class AppText {
  AppText._();

  /// Starts loading every font variant the app uses (see GoogleFonts.pendingFonts in main.dart).
  static void preload() {
    serif(10);
    serif(10, italic: true);
    for (final w in [FontWeight.w400, FontWeight.w500, FontWeight.w600, FontWeight.w700]) {
      sans(10, weight: w);
    }
    mono(10);
    mono(10, weight: FontWeight.w500);
  }

  /// Editorial display serif — headings and big numbers.
  static TextStyle serif(
    double size, {
    Color? color,
    bool italic = false,
    double height = 1.0,
    double spacing = -0.02,
  }) {
    return GoogleFonts.instrumentSerif(
      fontSize: size,
      color: color,
      fontStyle: italic ? FontStyle.italic : FontStyle.normal,
      height: height,
      letterSpacing: size * spacing,
    );
  }

  /// Body text.
  static TextStyle sans(
    double size, {
    Color? color,
    FontWeight weight = FontWeight.w400,
    double height = 1.45,
  }) {
    return GoogleFonts.instrumentSans(fontSize: size, color: color, fontWeight: weight, height: height);
  }

  /// Small uppercase labels and metadata.
  static TextStyle mono(double size, {Color? color, double spacing = 1.1, FontWeight weight = FontWeight.w400}) {
    return GoogleFonts.jetBrainsMono(fontSize: size, color: color, letterSpacing: spacing, fontWeight: weight, height: 1.4);
  }
}

/// Signature easing from the website (expo out).
const Curve kEaseExpo = Cubic(0.16, 1, 0.3, 1);

ThemeData buildTheme(Palette p, Brightness brightness) {
  final base = ThemeData(useMaterial3: true, brightness: brightness);
  final scheme = ColorScheme.fromSeed(seedColor: p.brand, brightness: brightness).copyWith(
    primary: p.brand,
    onPrimary: p.brandInk,
    secondary: p.brand,
    onSecondary: p.brandInk,
    surface: p.canvas,
    onSurface: p.ink,
    outline: p.line,
  );

  return base.copyWith(
    colorScheme: scheme,
    scaffoldBackgroundColor: p.canvas,
    canvasColor: p.canvas,
    dividerColor: p.line,
    splashFactory: InkRipple.splashFactory,
    highlightColor: Colors.transparent,
    textTheme: GoogleFonts.instrumentSansTextTheme(base.textTheme).apply(bodyColor: p.ink, displayColor: p.ink),
    iconTheme: IconThemeData(color: p.ink),
    textSelectionTheme: TextSelectionThemeData(
      cursorColor: p.brand,
      selectionColor: p.brand.withOpacity(0.35),
      selectionHandleColor: p.brand,
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: p.ink,
      contentTextStyle: AppText.sans(14, color: p.canvas),
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: p.canvas,
      surfaceTintColor: Colors.transparent,
      modalBarrierColor: Colors.black.withOpacity(0.55),
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: p.canvas,
      surfaceTintColor: Colors.transparent,
      foregroundColor: p.ink,
      elevation: 0,
      scrolledUnderElevation: 0,
    ),
    // Screens slide in with a shared-axis motion, as on the website's page fades.
    pageTransitionsTheme: PageTransitionsTheme(
      builders: {
        for (final platform in TargetPlatform.values)
          platform: SharedAxisPageTransitionsBuilder(
            transitionType: SharedAxisTransitionType.horizontal,
            fillColor: p.canvas,
          ),
      },
    ),
    extensions: [p],
  );
}
