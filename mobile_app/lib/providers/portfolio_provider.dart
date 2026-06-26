import 'package:flutter/material.dart';
import '../models/project.dart';
import '../models/skill.dart';
import '../models/blog.dart';
import '../services/api_service.dart';

class PortfolioProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Project> _projects = [];
  List<Skill> _skills = [];
  List<Blog> _blogs = [];
  String _resumeUrl = '';

  bool _isLoading = false;
  String _errorMessage = '';

  List<Project> get projects => _projects;
  List<Skill> get skills => _skills;
  List<Blog> get blogs => _blogs;
  String get resumeUrl => _resumeUrl;
  bool get isLoading => _isLoading;
  String get errorMessage => _errorMessage;

  // Retrieve all database content concurrently
  Future<void> loadPortfolioData() async {
    _isLoading = true;
    _errorMessage = '';
    notifyListeners();

    try {
      final results = await Future.wait([
        _apiService.fetchProjects(),
        _apiService.fetchSkills(),
        _apiService.fetchBlogs(),
        _apiService.fetchResumeUrl(),
      ]);

      _projects = results[0] as List<Project>;
      _skills = results[1] as List<Skill>;
      _blogs = results[2] as List<Blog>;
      _resumeUrl = results[3] as String;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Reload data
  Future<void> refreshData() async {
    try {
      final results = await Future.wait([
        _apiService.fetchProjects(),
        _apiService.fetchSkills(),
        _apiService.fetchBlogs(),
        _apiService.fetchResumeUrl(),
      ]);

      _projects = results[0] as List<Project>;
      _skills = results[1] as List<Skill>;
      _blogs = results[2] as List<Blog>;
      _resumeUrl = results[3] as String;
      _errorMessage = '';
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      notifyListeners();
    }
  }

  // Send message API
  Future<bool> sendContact(String name, String email, String subject, String message) async {
    return await _apiService.sendContactMessage(
      name: name,
      email: email,
      subject: subject,
      message: message,
    );
  }
}
