import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import '../models/project.dart';
import '../models/skill.dart';
import '../models/blog.dart';

class ApiService {
  // Correct deployed backend URL
  static const String _productionUrl = 'https://sachin-dev-59j2.onrender.com/api';

  // Determine backend base URL dynamically
  static String get baseUrl {
    if (kReleaseMode) {
      return _productionUrl;
    }

    // In development mode, check platform to route localhost correctly
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
  }

  // Fallback production URL if local server is down
  static const String fallbackUrl = _productionUrl;

  // ── Fix image URLs: upgrade http → https, replace localhost → production ──
  static String fixImageUrl(String url) {
    if (url.isEmpty) return url;
    // Replace localhost thumbnail URLs with production
    if (url.contains('localhost') || url.contains('10.0.2.2')) {
      // Extract filename from path
      final uri = Uri.tryParse(url);
      if (uri != null) {
        final path = uri.path; // e.g. /uploads/thumbnail-xxx.png
        return 'https://sachin-dev-59j2.onrender.com$path';
      }
      return url;
    }
    // Upgrade http:// → https://
    if (url.startsWith('http://')) {
      return url.replaceFirst('http://', 'https://');
    }
    return url;
  }

  // Helper method to make GET requests with fallback logic
  Future<http.Response> _getWithFallback(String path) async {
    final primaryUri = Uri.parse('$baseUrl$path');
    final backupUri = Uri.parse('$fallbackUrl$path');

    try {
      if (kDebugMode) {
        print('API GET request to: $primaryUri');
      }
      final response = await http.get(primaryUri).timeout(const Duration(seconds: 4));
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response;
      }
      throw Exception('Server returned status ${response.statusCode}');
    } catch (e) {
      if (kDebugMode) {
        print('Primary API request failed: $e. Falling back to: $backupUri');
      }
      return await http.get(backupUri).timeout(const Duration(seconds: 10));
    }
  }

  // Fetch all projects
  Future<List<Project>> fetchProjects() async {
    try {
      final response = await _getWithFallback('/projects');
      final jsonResponse = jsonDecode(response.body);
      
      if (jsonResponse['success'] == true && jsonResponse['data'] != null) {
        final List dataList = jsonResponse['data'];
        return dataList.map((json) => Project.fromJson(json)).toList();
      }
      throw Exception(jsonResponse['message'] ?? 'Failed to parse projects');
    } catch (e) {
      throw Exception('Failed to load projects: $e');
    }
  }

  // Fetch all skills
  Future<List<Skill>> fetchSkills() async {
    try {
      final response = await _getWithFallback('/skills');
      final jsonResponse = jsonDecode(response.body);
      
      if (jsonResponse['success'] == true && jsonResponse['data'] != null) {
        final List dataList = jsonResponse['data'];
        return dataList.map((json) => Skill.fromJson(json)).toList();
      }
      throw Exception(jsonResponse['message'] ?? 'Failed to parse skills');
    } catch (e) {
      throw Exception('Failed to load skills: $e');
    }
  }

  // Fetch all blogs
  Future<List<Blog>> fetchBlogs() async {
    try {
      final response = await _getWithFallback('/blogs?published=true');
      final jsonResponse = jsonDecode(response.body);
      
      if (jsonResponse['success'] == true && jsonResponse['data'] != null) {
        final List dataList = jsonResponse['data'];
        return dataList.map((json) => Blog.fromJson(json)).toList();
      }
      throw Exception(jsonResponse['message'] ?? 'Failed to parse blogs');
    } catch (e) {
      throw Exception('Failed to load blogs: $e');
    }
  }

  // Fetch resume URL
  Future<String> fetchResumeUrl() async {
    try {
      final response = await _getWithFallback('/settings/resume');
      final jsonResponse = jsonDecode(response.body);
      
      if (jsonResponse['success'] == true && jsonResponse['data'] != null) {
        return jsonResponse['data']['resume_url'] ?? '';
      }
      return '';
    } catch (e) {
      if (kDebugMode) {
        print('Error fetching resume URL: $e');
      }
      return '';
    }
  }

  // Submit contact message
  Future<bool> sendContactMessage({
    required String name,
    required String email,
    required String subject,
    required String message,
  }) async {
    final primaryUri = Uri.parse('$baseUrl/contacts');
    final backupUri = Uri.parse('$fallbackUrl/contacts');
    final Map<String, String> headers = {'Content-Type': 'application/json'};
    final String body = jsonEncode({
      'name': name,
      'email': email,
      'subject': subject,
      'message': message,
    });

    Future<bool> postToUri(Uri uri) async {
      final response = await http.post(uri, headers: headers, body: body).timeout(const Duration(seconds: 8));
      final jsonResponse = jsonDecode(response.body);
      return jsonResponse['success'] == true;
    }

    try {
      if (kDebugMode) {
        print('API POST request to: $primaryUri');
      }
      return await postToUri(primaryUri);
    } catch (e) {
      if (kDebugMode) {
        print('Primary POST failed: $e. Trying fallback: $backupUri');
      }
      try {
        return await postToUri(backupUri);
      } catch (fallbackError) {
        if (kDebugMode) {
          print('Fallback POST failed: $fallbackError');
        }
        return false;
      }
    }
  }

  // ── Send message to chatbot ──
  Future<String> sendChatMessage({
    required String message,
    required List<Map<String, String>> history,
  }) async {
    final primaryUri = Uri.parse('$baseUrl/chat');
    final backupUri = Uri.parse('$fallbackUrl/chat');
    final Map<String, String> headers = {'Content-Type': 'application/json'};
    final String body = jsonEncode({
      'message': message,
      'history': history,
    });

    Future<String> postToUri(Uri uri) async {
      final response = await http.post(uri, headers: headers, body: body).timeout(const Duration(seconds: 12));
      final jsonResponse = jsonDecode(response.body);
      if (jsonResponse['success'] == true && jsonResponse['data'] != null) {
        return jsonResponse['data']['reply'] ?? '';
      }
      throw Exception(jsonResponse['message'] ?? 'Failed to get bot reply');
    }

    try {
      if (kDebugMode) {
        print('API Chat request to: $primaryUri');
      }
      return await postToUri(primaryUri);
    } catch (e) {
      if (kDebugMode) {
        print('Primary chat failed: $e. Trying fallback: $backupUri');
      }
      try {
        return await postToUri(backupUri);
      } catch (fallbackError) {
        if (kDebugMode) {
          print('Fallback chat failed: $fallbackError');
        }
        rethrow;
      }
    }
  }
}

