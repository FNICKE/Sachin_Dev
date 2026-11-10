import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../services/api_service.dart';
import '../theme/app_theme.dart';
import '../widgets/ui.dart';

const _greeting =
    "Hi — I'm an AI assistant that knows Sachin's portfolio. Ask me about his projects, his stack, or how he can help with your website or app.";

const _suggestions = [
  'Tell me about his projects',
  "What's his tech stack?",
  'Can he build a mobile app?',
  'How do I start a project?',
];

void openAssistant(BuildContext context) {
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AssistantScreen()));
}

class _Msg {
  _Msg(this.role, this.text) : time = DateTime.now();
  final String role; // 'user' | 'assistant'
  final String text;
  final DateTime time;
}

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final _api = ApiService();
  final _input = TextEditingController();
  final _scroll = ScrollController();
  final List<_Msg> _messages = [_Msg('assistant', _greeting)];
  bool _loading = false;

  @override
  void dispose() {
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  void _toBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(_scroll.position.maxScrollExtent, duration: const Duration(milliseconds: 400), curve: kEaseExpo);
      }
    });
  }

  Future<void> _send([String? preset]) async {
    final text = (preset ?? _input.text).trim();
    if (text.isEmpty || _loading) return;
    final history = [
      for (final m in _messages.length > 10 ? _messages.sublist(_messages.length - 10) : _messages) {'role': m.role, 'content': m.text},
    ];
    setState(() {
      _messages.add(_Msg('user', text));
      _input.clear();
      _loading = true;
    });
    _toBottom();

    String reply;
    try {
      reply = await _api.sendChatMessage(message: text, history: history);
      if (reply.trim().isEmpty) reply = "I couldn't come up with an answer. Please try again.";
    } catch (_) {
      reply = "Sorry — I couldn't reach the AI service. The server may be waking up; please try again in a few seconds.";
    }
    if (!mounted) return;
    setState(() {
      _messages.add(_Msg('assistant', reply));
      _loading = false;
    });
    _toBottom();
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(tooltip: 'Close', icon: const Icon(Icons.close_rounded), onPressed: () => Navigator.of(context).maybePop()),
        titleSpacing: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text.rich(
              TextSpan(
                style: AppText.serif(24, color: p.ink),
                children: const [TextSpan(text: 'Ask about '), TextSpan(text: 'my work', style: TextStyle(fontStyle: FontStyle.italic))],
              ),
            ),
            Text('AI ASSISTANT · ANSWERS CAN BE WRONG', style: AppText.mono(8.5, color: p.dim)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => setState(() {
              _messages
                ..clear()
                ..add(_Msg('assistant', _greeting));
            }),
            child: Text('CLEAR', style: AppText.mono(10, color: p.dim)),
          ),
          const SizedBox(width: 8),
        ],
        bottom: const PreferredSize(preferredSize: Size.fromHeight(1), child: Hairline()),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              controller: _scroll,
              padding: const EdgeInsets.fromLTRB(16, 18, 16, 18),
              children: [
                for (final m in _messages) _Bubble(msg: m),
                if (_loading) const _Typing(),
                if (_messages.length == 1 && !_loading)
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (var i = 0; i < _suggestions.length; i++)
                        ActionChip(
                          label: Text(_suggestions[i], style: AppText.sans(13.5, color: p.ink)),
                          backgroundColor: Colors.transparent,
                          side: BorderSide(color: p.line),
                          shape: const StadiumBorder(),
                          onPressed: () => _send(_suggestions[i]),
                        ).animate().fadeIn(delay: (250 + 70 * i).ms).slideY(begin: 0.3, end: 0, curve: kEaseExpo),
                    ],
                  ),
              ],
            ),
          ),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
              decoration: BoxDecoration(border: Border(top: BorderSide(color: p.line))),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: TextField(
                      controller: _input,
                      minLines: 1,
                      maxLines: 4,
                      enabled: !_loading,
                      textInputAction: TextInputAction.send,
                      onSubmitted: (_) => _send(),
                      style: AppText.sans(16, color: p.ink),
                      decoration: InputDecoration(
                        hintText: 'Ask a question…',
                        hintStyle: AppText.sans(16, color: p.dim),
                        filled: true,
                        fillColor: p.surface,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(22), borderSide: BorderSide.none),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ValueListenableBuilder(
                    valueListenable: _input,
                    builder: (_, value, __) {
                      final ready = value.text.trim().isNotEmpty && !_loading;
                      return AnimatedOpacity(
                        opacity: ready ? 1 : 0.35,
                        duration: const Duration(milliseconds: 200),
                        child: CircleIconButton(
                          tooltip: 'Send',
                          size: 46,
                          filled: true,
                          onTap: ready ? () => _send() : () {},
                          child: const Icon(Icons.arrow_upward_rounded),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.msg});
  final _Msg msg;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final user = msg.role == 'user';
    final spans = <TextSpan>[];
    final parts = msg.text.split('**');
    for (var i = 0; i < parts.length; i++) {
      spans.add(TextSpan(text: parts[i], style: i.isOdd ? const TextStyle(fontWeight: FontWeight.w600) : null));
    }
    final time = '${msg.time.hour.toString().padLeft(2, '0')}:${msg.time.minute.toString().padLeft(2, '0')}';

    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: user ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          ConstrainedBox(
            constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: user ? p.ink : p.surface,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(20),
                  topRight: const Radius.circular(20),
                  bottomLeft: Radius.circular(user ? 20 : 6),
                  bottomRight: Radius.circular(user ? 6 : 20),
                ),
              ),
              child: SelectableText.rich(
                TextSpan(style: AppText.sans(15, color: user ? p.canvas : p.ink, height: 1.5), children: spans),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text('${user ? 'YOU' : 'ASSISTANT'} · $time', style: AppText.mono(8.5, color: p.dim)),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.15, end: 0, duration: 400.ms, curve: kEaseExpo);
  }
}

class _Typing extends StatelessWidget {
  const _Typing();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(20)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < 3; i++)
              Container(
                width: 7,
                height: 7,
                margin: const EdgeInsets.symmetric(horizontal: 3),
                decoration: BoxDecoration(color: p.dim, shape: BoxShape.circle),
              )
                  .animate(onPlay: (c) => c.repeat(reverse: true))
                  .fadeIn(begin: 0.25, delay: (180 * i).ms, duration: 500.ms),
          ],
        ),
      ),
    );
  }
}
