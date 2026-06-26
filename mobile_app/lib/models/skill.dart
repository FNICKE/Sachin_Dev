class Skill {
  final int id;
  final String name;
  final String iconUrl;
  final String category;
  final int level;
  final int sortOrder;

  Skill({
    required this.id,
    required this.name,
    required this.iconUrl,
    required this.category,
    required this.level,
    required this.sortOrder,
  });

  factory Skill.fromJson(Map<String, dynamic> json) {
    return Skill(
      id: json['id'] is int ? json['id'] : int.parse(json['id'].toString()),
      name: json['name'] ?? '',
      iconUrl: json['icon_url'] ?? '',
      category: json['category'] ?? 'other',
      level: json['level'] is int ? json['level'] : int.parse(json['level']?.toString() ?? '0'),
      sortOrder: json['sort_order'] is int ? json['sort_order'] : int.parse(json['sort_order']?.toString() ?? '0'),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'icon_url': iconUrl,
      'category': category,
      'level': level,
      'sort_order': sortOrder,
    };
  }
}
