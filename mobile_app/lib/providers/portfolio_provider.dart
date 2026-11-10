import 'package:flutter/material.dart';

import '../models/blog.dart';
import '../models/project.dart';
import '../models/skill.dart';
import '../services/api_service.dart';

/// Loads everything the app shows from the portfolio API.
///
/// Each list is fetched on its own, so if one request fails the others still
/// show — and the app only shows a full-screen error when nothing loaded at all.
class PortfolioProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Project> _projects = [];
  List<Skill> _skills = [];
  List<Blog> _blogs = [];
  String _resumeUrl = '';

  bool _isLoading = false;
  bool _hasLoaded = false;
  String _errorMessage = '';

  List<Project> get projects => _projects;
  List<Skill> get skills => _skills;
  List<Blog> get blogs => _blogs;
  String get resumeUrl => _resumeUrl;
  bool get isLoading => _isLoading;
  bool get hasLoaded => _hasLoaded;
  String get errorMessage => _errorMessage;

  bool get hasAnyData => _projects.isNotEmpty || _skills.isNotEmpty || _blogs.isNotEmpty;

  /// Featured projects first, then the rest (same order as the website).
  List<Project> get orderedProjects => [
        ..._projects.where((p) => p.featured),
        ..._projects.where((p) => !p.featured),
      ];

  int get liveCount => _projects.where((p) => p.liveUrl.isNotEmpty).length;

  /// Skills grouped by category, keeping the order the API returns them in.
  List<(String, List<Skill>)> get skillGroups {
    final map = <String, List<Skill>>{};
    for (final s in _skills) {
      map.putIfAbsent(s.category.toLowerCase(), () => []).add(s);
    }
    return [for (final e in map.entries) (e.key, e.value)];
  }

  Future<void> loadPortfolioData() async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();
    await _fetchAll();
    _isLoading = false;
    _hasLoaded = true;
    notifyListeners();
  }

  /// Pull-to-refresh: keeps the current content on screen while reloading.
  Future<void> refreshData() async {
    await _fetchAll();
    notifyListeners();
  }

  Future<void> _fetchAll() async {
    final errors = <String>[];

    Future<void> attempt(Future<void> Function() task, String what) async {
      try {
        await task();
      } catch (e) {
        errors.add(what);
      }
    }

    await Future.wait([
      attempt(() async => _projects = await _apiService.fetchProjects(), 'projects'),
      attempt(() async => _skills = await _apiService.fetchSkills(), 'skills'),
      attempt(() async => _blogs = await _apiService.fetchBlogs(), 'posts'),
      attempt(() async => _resumeUrl = await _apiService.fetchResumeUrl(), 'résumé'),
    ]);

    _errorMessage = errors.isEmpty ? '' : "Couldn't load ${errors.join(', ')}.";
  }

  Future<bool> sendContact(String name, String email, String subject, String message) {
    return _apiService.sendContactMessage(name: name, email: email, subject: subject, message: message);
  }
}
