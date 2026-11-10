import 'dart:math';

/// Static profile content — kept in sync with the website (frontend/lib/site.js).
class Site {
  Site._();

  static const name = 'Sachin Rathod';
  static const role = 'Freelance Fullstack Developer';
  static const availability = 'Available for freelance';
  static const location = 'Mumbai, India';
  static const email = 'rathodsachin0766@gmail.com';
  static const phone = '+91 96046 69232';
  static const phoneUri = 'tel:+919604669232';
  static const whatsapp = '919604669232';
  static const github = 'https://github.com/FNICKE';
  static const linkedin = 'https://www.linkedin.com/in/sachin-rathod-469168310';
  static const greeting =
      "Hi Sachin, I found your portfolio and I'd like to talk about a project.";
  static const startedBuilding = 2023;

  static String whatsappUrl([String text = greeting]) =>
      'https://wa.me/$whatsapp?text=${Uri.encodeComponent(text)}';

  static String get emailUri => 'mailto:$email';

  static int get yearsBuilding => max(1, DateTime.now().year - startedBuilding);

  static const stack = ['Next.js', 'React', 'Node.js', 'MySQL', 'Flutter'];

  static const appVersion = '1.0.18';
  static const buildNumber = 18;
  static const apkDownloadUrl =
      'https://github.com/FNICKE/Sachin_Dev/releases/download/mobile-latest/app-release.apk';
}

/// Intro paragraph split into segments; `true` segments are set in orange italic.
const introSegments = <(String, bool)>[
  (
    "I'm a freelance fullstack developer who takes ideas from first sketch to launch — ",
    false
  ),
  ('websites,', true),
  (' web apps and ', false),
  ('mobile apps', true),
  (
    ' — with clean interfaces, APIs that hold up under real use, and products people actually open.',
    false
  ),
];

class Service {
  const Service(
      this.title, this.text, this.examples, this.categories, this.tools);
  final String title;
  final String text;
  final String examples;
  final List<String> categories;
  final List<String> tools;
}

const services = [
  Service(
    'Websites',
    'Fast, responsive websites for businesses and brands — landing pages, company sites and online stores, with an admin panel you can update yourself.',
    'Business sites · E-commerce · Landing pages',
    ['frontend'],
    [],
  ),
  Service(
    'Web apps',
    'Dashboards, portals and internal tools with logins, roles, file uploads and reports — on an API built to keep running in production.',
    'Dashboards · Admin panels · Portals · APIs',
    ['backend', 'database'],
    [],
  ),
  Service(
    'Mobile apps',
    'Cross-platform apps in Flutter that share one backend with your website, so your content stays in sync on every screen.',
    'Android · Cross-platform · Companion apps',
    ['mobile'],
    ['Flutter', 'Dart', 'REST APIs', 'ReactNative', 'Firebase', 'SQLite'],
  ),
];

const processSteps = [
  (
    'Plan',
    'We talk through your goals, users and timeline. You get a clear scope before any code is written.'
  ),
  (
    'Build',
    'I design and develop in short rounds and share progress often, so you always know where things stand.'
  ),
  (
    'Launch',
    'I deploy it, walk you through the admin panel, and stay available for fixes and new features.'
  ),
];

const story = [
  "I'm Sachin Rathod, a software developer based in Mumbai. I turn ideas into reliable digital products — from polished interfaces to the APIs and data systems behind them.",
  'I build websites, web apps and mobile apps with Next.js, React, Node.js, MySQL and Flutter. My fullstack approach keeps the experience consistent from the first screen to production.',
  "I enjoy solving practical problems, learning new tools and shipping work that people can use every day. My current focus is TypeScript, cloud deployments and AI-integrated applications.",
];

const principles = [
  (
    'Readable code',
    'Small pieces, clear names, no clever tricks. Code the next person can change without fear — including me in six months.'
  ),
  (
    'Simple for the user',
    'I like taking a messy requirement and turning it into something that feels obvious to use.'
  ),
  (
    'Always learning',
    'The web moves fast. I keep shipping small experiments so new tools earn their place in real projects.'
  ),
];

const timeline = [
  (
    '2022',
    'Started engineering',
    'Joined Saraswati College of Engineering for Computer Engineering.'
  ),
  (
    '2023',
    'First web project',
    'Built my first fullstack app — a task manager on Node.js and MySQL. The bug-fixing never stopped.'
  ),
  (
    '2024',
    'Freelancing begins',
    'Took on freelance projects and shipped real client work while still in college.'
  ),
  (
    '2025',
    'Going deeper',
    'TypeScript, scalable architecture and production-grade projects.'
  ),
  (
    '2026',
    'Degree completed',
    "Graduated with a Bachelor's in Computer Engineering. Now building the next chapter full-time."
  ),
];

const interests = [
  'Open source',
  'Scalable apps',
  'UI & UX',
  'Coffee',
  'Gaming',
  'Reading'
];

const quote = 'Code is poetry written in logic.';

const projectTypes = ['Website', 'Web app', 'Mobile app', 'Something else'];
const replyMethods = ['Email', 'WhatsApp', 'Phone call'];

const categoryLabels = {
  'web': 'Web',
  'mobile': 'Mobile',
  'api': 'API',
  'fullstack': 'Fullstack',
  'other': 'Other',
};

const statusLabels = {
  'completed': 'Completed',
  'in_progress': 'In progress',
  'archived': 'Archived',
};

const skillGroups = {
  'frontend': (
    'Frontend',
    'Interfaces that load fast, read clearly and feel good to use.'
  ),
  'backend': (
    'Backend',
    'APIs, auth and business logic that stay calm in production.'
  ),
  'database': (
    'Data',
    'Schemas, queries and state — relational and document stores.'
  ),
  'devops': ('Workflow', 'Version control, reviews and getting code shipped.'),
  'cloud': (
    'Cloud',
    'Deployments, hosting and the infrastructure around the code.'
  ),
  'mobile': ('Mobile', 'Apps for the device in your pocket.'),
  'tools': ('Tools', 'The everyday kit behind the work.'),
  'other': ('Also', 'Everything else in the toolbox.'),
};

String categoryLabel(String key) => categoryLabels[key] ?? key;

String pad2(int n) => n.toString().padLeft(2, '0');
