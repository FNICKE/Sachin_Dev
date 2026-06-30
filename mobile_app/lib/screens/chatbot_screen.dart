import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';


// Colors matching website theme
const Color _kBg = Color(0xFF020817);
const Color _kSurface = Color(0xFF0F172A);
const Color _kCard = Color(0xFF1E293B);
const Color _kIndigo = Color(0xFF6366F1);
const Color _kPurple = Color(0xFF8B5CF6);
const Color _kText = Color(0xFF94A3B8);

class ChatbotScreen extends StatefulWidget {
  const ChatbotScreen({super.key});

  @override
  State<ChatbotScreen> createState() => _ChatbotScreenState();
}

class _ChatMessageData {
  final String role;
  final String content;
  final DateTime timestamp;

  _ChatMessageData({
    required this.role,
    required this.content,
    required this.timestamp,
  });

  Map<String, String> toApiMap() {
    return {
      'role': role,
      'content': content,
    };
  }
}

class _ChatbotScreenState extends State<ChatbotScreen> {
  final ApiService _apiService = ApiService();
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final FocusNode _inputFocusNode = FocusNode();

  final List<_ChatMessageData> _messages = [
    _ChatMessageData(
      role: 'assistant',
      content: "Hi! 👋 I'm Sachin's AI assistant. I know everything about this portfolio — the frontend pages, backend controllers, database schema, and tech stack. What would you like to know?",
      timestamp: DateTime.now(),
    ),
  ];

  final List<String> _suggestions = const [
    "What tech stack is used?",
    "How does the rich text editor work?",
    "What API endpoints exist?",
    "How is auth implemented?",
  ];

  bool _isLoading = false;
  bool _showSuggestions = true;

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    _inputFocusNode.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage([String? presetText]) async {
    final text = (presetText ?? _inputController.text).trim();
    if (text.isEmpty || _isLoading) return;

    if (presetText == null) {
      _inputController.clear();
    }

    setState(() {
      _messages.add(_ChatMessageData(
        role: 'user',
        content: text,
        timestamp: DateTime.now(),
      ));
      _isLoading = true;
      _showSuggestions = false;
    });
    _scrollToBottom();

    try {
      // Get last 10 messages for context
      final history = _messages
          .sublist(0, _messages.length - 1)
          .skip(_messages.length > 11 ? _messages.length - 11 : 0)
          .map((m) => m.toApiMap())
          .toList();

      final reply = await _apiService.sendChatMessage(
        message: text,
        history: history,
      );

      if (mounted) {
        setState(() {
          _messages.add(_ChatMessageData(
            role: 'assistant',
            content: reply.isNotEmpty ? reply : "I couldn't generate a response. Please try again.",
            timestamp: DateTime.now(),
          ));
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(_ChatMessageData(
            role: 'assistant',
            content: "Sorry, I encountered an error connecting to the AI service. Please check your internet connection and try again.",
            timestamp: DateTime.now(),
          ));
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
      _scrollToBottom();
    }
  }

  void _clearChat() {
    HapticFeedback.heavyImpact();
    setState(() {
      _messages.clear();
      _messages.add(_ChatMessageData(
        role: 'assistant',
        content: "Chat cleared! I'm Sachin's AI assistant. Ask me anything about this portfolio.",
        timestamp: DateTime.now(),
      ));
      _showSuggestions = true;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _kBg,
      appBar: AppBar(
        backgroundColor: _kSurface,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: _kIndigo.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.psychology_rounded, color: Color(0xFF818CF8), size: 20),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'AI Portfolio Assistant',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  'Online',
                  style: TextStyle(fontSize: 10, color: Color(0xFF10B981), fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep_rounded, color: Color(0xFFEF4444)),
            tooltip: 'Clear Chat',
            onPressed: _clearChat,
          ),
        ],
        elevation: 0,
        shape: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.05))),
      ),

      body: Column(
        children: [
          // Message List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isLoading) {
                  return const _TypingIndicatorBubble();
                }
                return _MessageBubble(message: _messages[index]);
              },
            ),
          ),

          // Suggestion Chips (above input)
          if (_showSuggestions) _buildSuggestions(),

          // Input Bar
          _buildInputBar(),
        ],
      ),
    );
  }

  Widget _buildSuggestions() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.lightbulb_outline_rounded, size: 14, color: Color(0xFFFBBF24)),
              SizedBox(width: 6),
              Text(
                'SUGGESTIONS',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFFFBBF24), letterSpacing: 0.8),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _suggestions.map((suggestion) {
              return GestureDetector(
                onTap: () => _sendMessage(suggestion),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                  decoration: BoxDecoration(
                    color: _kIndigo.withOpacity(0.06),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: _kIndigo.withOpacity(0.25)),
                  ),
                  child: Text(
                    suggestion,
                    style: const TextStyle(color: Color(0xFFA5B4FC), fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: EdgeInsets.fromLTRB(16, 12, 16, MediaQuery.of(context).viewInsets.bottom + 16),
      decoration: BoxDecoration(
        color: _kSurface,
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.05))),
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              height: 48,
              decoration: BoxDecoration(
                color: _kBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.08)),
              ),
              child: TextField(
                controller: _inputController,
                focusNode: _inputFocusNode,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendMessage(),
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: const InputDecoration(
                  hintText: 'Ask a question...',
                  hintStyle: TextStyle(color: Color(0xFF475569), fontSize: 14),
                  contentPadding: EdgeInsets.symmetric(horizontal: 16),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: () => _sendMessage(),
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [_kIndigo, _kPurple]),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(color: _kIndigo.withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
            ),
          ),
        ],
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final _ChatMessageData message;

  const _MessageBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    final isUser = message.role == 'user';
    final timeStr = DateFormat('hh:mm a').format(message.timestamp);

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [_kIndigo, _kPurple]),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Center(
                child: Icon(Icons.psychology_rounded, color: Colors.white, size: 16),
              ),
            ),
            const SizedBox(width: 10),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: isUser ? _kIndigo : _kSurface,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 16),
                ),
                border: isUser ? null : Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _RichTextContent(content: message.content, isUser: isUser),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        timeStr,
                        style: TextStyle(
                          fontSize: 9,
                          color: isUser ? Colors.white.withOpacity(0.6) : _kText.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 10),
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: _kCard,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: const Center(
                child: Icon(Icons.person_rounded, color: _kText, size: 16),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _RichTextContent extends StatelessWidget {
  final String content;
  final bool isUser;

  const _RichTextContent({required this.content, required this.isUser});

  @override
  Widget build(BuildContext context) {
    final style = TextStyle(
      fontSize: 14,
      color: isUser ? Colors.white : const Color(0xFFE2E8F0),
      height: 1.5,
    );

    // Simple **bold** parsing
    final parts = content.split('**');
    if (parts.length <= 1) {
      return Text(content, style: style);
    }

    final spans = <TextSpan>[];
    for (int i = 0; i < parts.length; i++) {
      final isBold = i % 2 == 1;
      spans.add(TextSpan(
        text: parts[i],
        style: isBold
            ? TextStyle(
                fontWeight: FontWeight.bold,
                color: isUser ? Colors.white : Colors.white,
              )
            : style,
      ));
    }

    return RichText(
      text: TextSpan(children: spans),
    );
  }
}

class _TypingIndicatorBubble extends StatefulWidget {
  const _TypingIndicatorBubble();

  @override
  State<_TypingIndicatorBubble> createState() => _TypingIndicatorBubbleState();
}

class _TypingIndicatorBubbleState extends State<_TypingIndicatorBubble> with TickerProviderStateMixin {
  late List<AnimationController> _controllers;
  late List<Animation<double>> _animations;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(3, (i) {
      return AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 600),
      )..repeat(reverse: true);
    });

    _animations = List.generate(3, (i) {
      return Tween<double>(begin: 0.3, end: 1.0).animate(
        CurvedAnimation(
          parent: _controllers[i],
          curve: Curves.easeInOut,
        ),
      );
    });

    // Stagger execution
    for (int i = 0; i < 3; i++) {
      Future.delayed(Duration(milliseconds: i * 200), () {
        if (mounted) _controllers[i].forward();
      });
    }
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [_kIndigo, _kPurple]),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Center(
              child: Icon(Icons.psychology_rounded, color: Colors.white, size: 16),
            ),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: _kSurface,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
                bottomLeft: Radius.circular(4),
                bottomRight: Radius.circular(16),
              ),
              border: Border.all(color: Colors.white.withOpacity(0.05)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(3, (i) {
                return AnimatedBuilder(
                  animation: _animations[i],
                  builder: (context, child) {
                    return Opacity(
                      opacity: _animations[i].value,
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2.0),
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          color: _kIndigo,
                          shape: BoxShape.circle,
                        ),
                      ),
                    );
                  },
                );
              }),
            ),
          ),
        ],
      ),
    );
  }
}
