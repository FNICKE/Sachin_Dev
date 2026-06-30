import 'skill.dart';
import '../services/api_service.dart';

class Project {
  final int id;
  final String title;
  final String slug;
  final String shortDesc;
  final String description;
  final String thumbnailUrl;
  final String liveUrl;
  final String githubUrl;
  final List<String> techStack;
  final String category;
  final String status;
  final bool featured;
  final int sortOrder;
  final List<Skill> skills;

  Project({
    required this.id,
    required this.title,
    required this.slug,
    required this.shortDesc,
    required this.description,
    required this.thumbnailUrl,
    required this.liveUrl,
    required this.githubUrl,
    required this.techStack,
    required this.category,
    required this.status,
    required this.featured,
    required this.sortOrder,
    required this.skills,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    // Parse tech stack
    List<String> parsedTechStack = [];
    if (json['tech_stack'] != null) {
      if (json['tech_stack'] is List) {
        parsedTechStack = List<String>.from(json['tech_stack'].map((x) => x.toString()));
      } else if (json['tech_stack'] is String) {
        // Handle case where it could be a JSON string
        parsedTechStack = [];
      }
    }

    // Parse related skills
    List<Skill> parsedSkills = [];
    if (json['skills'] != null && json['skills'] is List) {
      parsedSkills = List<Skill>.from(json['skills'].map((x) => Skill.fromJson(x)));
    }

    return Project(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      shortDesc: json['short_desc'] ?? '',
      description: json['description'] ?? '',
      thumbnailUrl: ApiService.fixImageUrl(json['thumbnail_url'] ?? ''),
      liveUrl: json['live_url'] ?? '',
      githubUrl: json['github_url'] ?? '',
      techStack: parsedTechStack,
      category: json['category'] ?? 'fullstack',
      status: json['status'] ?? 'completed',
      featured: json['featured'] == 1 || json['featured'] == true,
      sortOrder: json['sort_order'] is int ? json['sort_order'] : int.parse(json['sort_order']?.toString() ?? '0'),
      skills: parsedSkills,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'short_desc': shortDesc,
      'description': description,
      'thumbnail_url': thumbnailUrl,
      'live_url': liveUrl,
      'github_url': githubUrl,
      'tech_stack': techStack,
      'category': category,
      'status': status,
      'featured': featured ? 1 : 0,
      'sort_order': sortOrder,
      'skills': skills.map((x) => x.toJson()).toList(),
    };
  }
}
