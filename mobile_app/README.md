# Flutter Mobile Portfolio Application

This is a premium, modern developer portfolio mobile application built using **Flutter** and **Provider** for state management. It connects to the Node.js/Express/MySQL backend database.

## Features

- **Dynamic Connection**: Automatically routes requests to `http://10.0.2.2:5000` (for Android Emulator) or `http://localhost:5000` (for iOS/Web), falling back to production if local is unreachable.
- **Projects Catalog**: Grouped and filtered list of portfolio projects with tech chips, detailed descriptions, and launch buttons for source code and live demos.
- **Categorized Skills**: Displays database-configured developer skills (Frontend, Backend, Database) with modern progress bar gauges.
- **Blogs Reader**: Scrollable list of published blog posts with views tracking, reading times, and full article view support.
- **Contact Form**: Interactive email/subject feedback form mapping directly to the MySQL database.
- **Refresh Support**: Drag-to-refresh / button refresh updates stats, projects, and skills in real-time.

---

## Setup Instructions

### 1. Ensure Flutter is Installed

If you do not have Flutter installed on your system:
1. Download the Flutter SDK from the [official site](https://docs.flutter.dev/get-started/install/windows).
2. Extract it to a folder (e.g. `C:\src\flutter`).
3. Add the `C:\src\flutter\bin` folder to your system **Environment Variables (PATH)**.
4. Verify by running:
   ```cmd
   flutter doctor
   ```

### 2. Download Dependencies

From the `mobile_app` directory, run:
```bash
flutter pub get
```

### 3. Run the Backend Server

Make sure the Node.js backend is running (typically from the `backend` folder):
```bash
npm run dev
```

### 4. Run the Mobile App

To run on Chrome (web debug):
```bash
flutter run -d chrome
```

To run on an active Android Emulator or connected physical device:
```bash
flutter run
```

---

## Folder Structure

```text
mobile_app/
├── lib/
│   ├── main.dart                 # Application entry point & theme
│   ├── models/
│   │   ├── blog.dart             # Blog data schema
│   │   ├── project.dart          # Project & nested skills schema
│   │   └── skill.dart            # Skill data schema
│   ├── providers/
│   │   └── portfolio_provider.dart # ChangeNotifier state container
│   ├── screens/
│   │   ├── blog_detail_screen.dart
│   │   ├── blogs_screen.dart
│   │   ├── contact_screen.dart
│   │   ├── home_screen.dart
│   │   ├── navigation_wrapper.dart # Bottom nav manager
│   │   ├── project_detail_screen.dart
│   │   ├── projects_screen.dart
│   │   └── skills_screen.dart
│   └── services/
│       └── api_service.dart      # HTTP client service layer
└── pubspec.yaml                  # Dependencies configuration
```
