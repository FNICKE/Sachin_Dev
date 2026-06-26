import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/blog.dart';

class BlogDetailScreen extends StatelessWidget {
  final Blog blog;

  const BlogDetailScreen({super.key, required this.blog});

  @override
  Widget build(BuildContext context) {
    final formattedDate = DateFormat.yMMMMd().format(blog.createdAt);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Read Article'),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover Image
            Image.network(
              blog.coverUrl,
              width: double.infinity,
              height: 240,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  height: 200,
                  color: const Color(0xFF1E293B),
                  child: const Center(
                    child: Icon(
                      Icons.article_outlined,
                      color: Color(0xFF475569),
                      size: 60,
                    ),
                  ),
                );
              },
            ),

            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Meta row
                  Row(
                    children: [
                      Text(
                        formattedDate,
                        style: const TextStyle(
                          fontSize: 13,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                      const Spacer(),
                      const Icon(Icons.timer_outlined, size: 14, color: Color(0xFF94A3B8)),
                      const SizedBox(width: 4),
                      Text(
                        '${blog.readTime} min read',
                        style: const TextStyle(
                          fontSize: 13,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Title
                  Text(
                    blog.title,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Tags Row
                  if (blog.tags.isNotEmpty)
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: blog.tags.map((tag) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF6366F1).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: const Color(0xFF6366F1).withOpacity(0.2)),
                          ),
                          child: Text(
                            '#$tag',
                            style: const TextStyle(
                              color: Color(0xFF6366F1),
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  
                  const Divider(color: Color(0xFF334155), height: 32),

                  // Content Body (Basic markdown-like formatting by splitting paragraphs)
                  ..._buildContentParagraphs(blog.content),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildContentParagraphs(String content) {
    // Split on double newlines to isolate paragraphs
    final paragraphs = content.split('\n\n');
    return paragraphs.map((para) {
      final trimmed = para.trim();
      if (trimmed.isEmpty) return const SizedBox.shrink();

      // Check if it looks like a header (e.g. starting with #)
      if (trimmed.startsWith('#')) {
        final level = trimmed.indexOf(RegExp(r'[^#]'));
        final text = trimmed.replaceAll('#', '').trim();
        return Padding(
          padding: const EdgeInsets.only(top: 16.0, bottom: 8.0),
          child: Text(
            text,
            style: TextStyle(
              fontSize: level == 1 ? 22 : level == 2 ? 19 : 17,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        );
      }

      // Standard text paragraph
      return Padding(
        padding: const EdgeInsets.only(bottom: 16.0),
        child: Text(
          trimmed,
          style: const TextStyle(
            fontSize: 15,
            color: Color(0xFFE2E8F0),
            height: 1.6,
          ),
        ),
      );
    }).toList();
  }
}
