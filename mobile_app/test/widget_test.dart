import 'package:flutter_test/flutter_test.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:mobile_app/data/site.dart';

void main() {
  setUpAll(() {
    // Tests run offline — don't try to download fonts.
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  test('WhatsApp link opens a chat with the greeting typed in', () {
    final url = Site.whatsappUrl('Hi Sachin');
    expect(url, 'https://wa.me/919604669232?text=Hi%20Sachin');
  });

  test('Every service has a title, a description and examples', () {
    for (final s in services) {
      expect(s.title, isNotEmpty);
      expect(s.text, isNotEmpty);
      expect(s.examples, isNotEmpty);
    }
  });

  test('Years building is at least one', () {
    expect(Site.yearsBuilding, greaterThanOrEqualTo(1));
  });
}
