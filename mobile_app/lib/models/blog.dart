class Blog {
  final int id;
  final String title;
  final String slug;
  final String excerpt;
  final String content;
  final String coverUrl;
  final List<String> tags;
  final bool published;
  final int readTime;
  final int views;
  final DateTime createdAt;
  final DateTime? publishedAt;

  Blog({
    required this.id,
    required this.title,
    required this.slug,
    required this.excerpt,
    required this.content,
    required this.coverUrl,
    required this.tags,
    required this.published,
    required this.readTime,
    required this.views,
    required this.createdAt,
    this.publishedAt,
  });

  factory Blog.fromJson(Map<String, dynamic> json) {
    List<String> parsedTags = [];
    if (json['tags'] != null) {
      if (json['tags'] is List) {
        parsedTags = List<String>.from(json['tags'].map((x) => x.toString()));
      }
    }

    return Blog(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      title: json['title'] ?? '',
      slug: json['slug'] ?? '',
      excerpt: json['excerpt'] ?? '',
      content: json['content'] ?? '',
      coverUrl: json['cover_url'] ?? '',
      tags: parsedTags,
      published: json['published'] == 1 || json['published'] == true,
      readTime: json['read_time'] is int ? json['read_time'] : int.parse(json['read_time']?.toString() ?? '5'),
      views: json['views'] is int ? json['views'] : int.parse(json['views']?.toString() ?? '0'),
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : DateTime.now(),
      publishedAt: json['published_at'] != null ? DateTime.parse(json['published_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'excerpt': excerpt,
      'content': content,
      'cover_url': coverUrl,
      'tags': tags,
      'published': published ? 1 : 0,
      'read_time': readTime,
      'views': views,
      'created_at': createdAt.toIso8601String(),
      'published_at': publishedAt?.toIso8601String(),
    };
  }
}
