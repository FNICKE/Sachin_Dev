import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../data/site.dart';
import '../providers/portfolio_provider.dart';
import '../services/links.dart';
import '../theme/app_theme.dart';
import '../widgets/reveal.dart';
import '../widgets/ui.dart';

final _emailRe = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
String _digits(String v) => v.replaceAll(RegExp(r'\D'), '');

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key, required this.controller});
  final ScrollController controller;

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _formKey = GlobalKey();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _subject = TextEditingController();
  final _message = TextEditingController();
  final _focus = {for (final k in ['name', 'email', 'phone', 'message']) k: FocusNode()};

  String _type = '';
  String _reply = 'Email';
  Map<String, String> _errors = {};
  String _status = 'idle'; // idle | sending | sent | error

  bool get _needsPhone => _reply != 'Email';

  @override
  void initState() {
    super.initState();
    for (final c in [_name, _email, _phone, _message]) {
      c.addListener(() => setState(() {}));
    }
  }

  @override
  void dispose() {
    for (final c in [_name, _email, _phone, _subject, _message]) {
      c.dispose();
    }
    for (final f in _focus.values) {
      f.dispose();
    }
    super.dispose();
  }

  Map<String, String> _validate() {
    final e = <String, String>{};
    if (_name.text.trim().isEmpty) e['name'] = 'Please tell me your name.';
    if (!_emailRe.hasMatch(_email.text.trim())) e['email'] = "That email doesn't look right.";
    if (_needsPhone && _digits(_phone.text).length < 10) {
      e['phone'] = 'Please add the number I should ${_reply == 'WhatsApp' ? 'message on WhatsApp' : 'call'}.';
    }
    if (_message.text.trim().length < 10) e['message'] = 'A few more words, please (10+ characters).';
    return e;
  }

  (int, int) get _progress {
    final checks = [
      _name.text.trim().isNotEmpty,
      _emailRe.hasMatch(_email.text.trim()),
      if (_needsPhone) _digits(_phone.text).length >= 10,
      _message.text.trim().length >= 10,
    ];
    return (checks.where((c) => c).length, checks.length);
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    final errors = _validate();
    setState(() => _errors = errors);
    if (errors.isNotEmpty) {
      HapticFeedback.heavyImpact();
      final first = ['name', 'email', 'phone', 'message'].firstWhere(errors.containsKey);
      _focus[first]?.requestFocus();
      return;
    }

    setState(() => _status = 'sending');
    final subject = _subject.text.trim().isEmpty ? 'Project enquiry' : _subject.text.trim();
    // Same format as the website: the project type goes in the subject, the reply preference on top of the message.
    final preferred = _needsPhone ? 'Preferred reply: $_reply — ${_phone.text.trim()}' : 'Preferred reply: Email';
    final ok = await context.read<PortfolioProvider>().sendContact(
          _name.text.trim(),
          _email.text.trim(),
          _type.isEmpty ? subject : '[$_type] $subject',
          '$preferred\n\n${_message.text.trim()}',
        );
    if (!mounted) return;
    HapticFeedback.mediumImpact();
    setState(() => _status = ok ? 'sent' : 'error');
  }

  void _sendOnWhatsApp() {
    if (_message.text.trim().length < 10) {
      setState(() => _errors = {..._errors, 'message': 'Write a short message first (10+ characters).'});
      _focus['message']?.requestFocus();
      return;
    }
    final intro = _name.text.trim().isEmpty ? 'Hi Sachin,' : "Hi Sachin, I'm ${_name.text.trim()}.";
    final about = _type.isEmpty ? '' : ' I need a ${_type.toLowerCase()}.';
    final subject = _subject.text.trim().isEmpty ? '' : '\n\n${_subject.text.trim()}';
    openLink(context, Site.whatsappUrl('$intro$about$subject\n\n${_message.text.trim()}'));
  }

  void _reset() {
    for (final c in [_name, _email, _phone, _subject, _message]) {
      c.clear();
    }
    setState(() {
      _type = '';
      _reply = 'Email';
      _errors = {};
      _status = 'idle';
    });
  }

  String get _replyNote => switch (_reply) {
        'WhatsApp' => "I'll message you on WhatsApp",
        'Phone call' => "I'll give you a call",
        _ => "I'll reply by email",
      };

  @override
  Widget build(BuildContext context) {
    final p = context.palette;

    final channels = [
      (WhatsAppGlyph(size: 20, color: p.brandInk), 'WhatsApp · Chat with me directly', Site.phone, () => openLink(context, Site.whatsappUrl()), true, false),
      (Icon(Icons.mail_outline_rounded, color: p.ink, size: 20), 'Email · For briefs and documents', Site.email, () => openLink(context, Site.emailUri), false, true),
      (Icon(Icons.call_outlined, color: p.ink, size: 20), 'Call · Prefer to talk it through', Site.phone, () => openLink(context, Site.phoneUri), false, false),
      (
        Icon(Icons.edit_outlined, color: p.ink, size: 20),
        'Form · Pick how I should reply',
        'Write a message',
        () {
          final ctx = _formKey.currentContext;
          if (ctx != null) Scrollable.ensureVisible(ctx, duration: const Duration(milliseconds: 800), curve: kEaseExpo);
        },
        false,
        false,
      ),
    ];

    return CustomScrollView(
      controller: widget.controller,
      physics: const BouncingScrollPhysics(),
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      slivers: [
        const SiteTopBar(title: 'Contact'),
        const SliverToBoxAdapter(
          child: PageTitle(
            label: 'Contact',
            meta: Site.availability,
            title: "Let's",
            italic: 'talk.',
            intro: 'Need a website, a web app or a mobile app? Reach me however suits you — WhatsApp, email, a call, or the form. I usually reply within a day.',
          ),
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.fromLTRB(20, 28, 20, MediaQuery.of(context).padding.bottom + 130),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SectionLabel('Choose what suits you'),
                const SizedBox(height: 10),
                const Hairline(),
                for (var i = 0; i < channels.length; i++)
                  Reveal(
                    delay: Duration(milliseconds: 70 * i),
                    offset: 18,
                    child: _ChannelRow(
                      icon: channels[i].$1,
                      label: channels[i].$2,
                      value: channels[i].$3,
                      onTap: channels[i].$4,
                      accent: channels[i].$5,
                      onCopy: channels[i].$6 ? () => copyText(context, Site.email, message: 'Email copied') : null,
                      isForm: i == channels.length - 1,
                    ),
                  ),
                const SizedBox(height: 22),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SectionLabel('Location'),
                          const SizedBox(height: 4),
                          Text(Site.location, style: AppText.sans(16, color: p.ink)),
                        ],
                      ),
                    ),
                    MumbaiClock(prefix: 'LOCAL ', style: AppText.mono(10, color: p.dim)),
                  ],
                ),
                const SizedBox(height: 40),
                KeyedSubtree(
                  key: _formKey,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 500),
                    switchInCurve: kEaseExpo,
                    transitionBuilder: (child, anim) => FadeTransition(
                      opacity: anim,
                      child: SlideTransition(
                        position: Tween(begin: const Offset(0, 0.04), end: Offset.zero).animate(anim),
                        child: child,
                      ),
                    ),
                    child: _status == 'sent' ? _sent(p) : _form(p),
                  ),
                ),
                const SizedBox(height: 36),
                const SectionLabel('Elsewhere'),
                const SizedBox(height: 8),
                const Hairline(),
                for (final (label, url) in [('GitHub', Site.github), ('LinkedIn', Site.linkedin)])
                  InkWell(
                    onTap: () => openLink(context, url),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(border: Border(bottom: BorderSide(color: p.line))),
                      child: Row(
                        children: [
                          Expanded(child: Text(label, style: AppText.sans(18, color: p.ink))),
                          Icon(Icons.north_east_rounded, size: 18, color: p.ink),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _sent(Palette p) {
    return Container(
      key: const ValueKey('sent'),
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(22)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: 1),
            duration: const Duration(milliseconds: 900),
            curve: Curves.elasticOut,
            builder: (_, v, child) => Transform.scale(scale: v, child: child),
            child: Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: p.brand, width: 1.5)),
              child: Icon(Icons.check_rounded, color: p.brand, size: 30),
            ),
          ),
          const SizedBox(height: 18),
          Text(
            'Thanks${_name.text.trim().isEmpty ? '' : ', ${_name.text.trim().split(' ').first}'}.',
            style: AppText.serif(44, color: p.ink),
          ),
          const SizedBox(height: 8),
          Text('Your message is in my inbox. $_replyNote, usually within a day.', style: AppText.sans(16, color: p.ink.withOpacity(0.75))),
          const SizedBox(height: 18),
          PillButton(label: 'Send another message', style: PillStyle.outline, dense: true, onTap: _reset),
        ],
      ),
    );
  }

  Widget _form(Palette p) {
    final (done, total) = _progress;
    final length = _message.text.trim().length;

    return Column(
      key: const ValueKey('form'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text.rich(
          TextSpan(
            style: AppText.serif(40, color: p.ink),
            children: [const TextSpan(text: 'Send a '), TextSpan(text: 'message', style: TextStyle(fontStyle: FontStyle.italic, color: p.brand))],
          ),
        ),
        const SizedBox(height: 22),
        _Choices(
          legend: 'What do you need?',
          options: projectTypes,
          value: _type,
          onChanged: (v) => setState(() => _type = _type == v ? '' : v),
        ),
        const SizedBox(height: 22),
        _Choices(
          legend: 'How should I get back to you?',
          options: replyMethods,
          value: _reply,
          onChanged: (v) => setState(() {
            _reply = v;
            _errors.remove('phone');
          }),
        ),
        const SizedBox(height: 10),
        _Field(label: 'Your name', controller: _name, focus: _focus['name'], error: _errors['name'], textInputAction: TextInputAction.next, autofill: const [AutofillHints.name]),
        _Field(
          label: 'Email',
          controller: _email,
          focus: _focus['email'],
          error: _errors['email'],
          keyboard: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          autofill: const [AutofillHints.email],
        ),
        AnimatedSize(
          duration: const Duration(milliseconds: 450),
          curve: kEaseExpo,
          child: _needsPhone
              ? _Field(
                  label: _reply == 'WhatsApp' ? 'Your WhatsApp number' : 'Your phone number',
                  controller: _phone,
                  focus: _focus['phone'],
                  error: _errors['phone'],
                  hint: 'Include your country code, e.g. +91 98765 43210',
                  keyboard: TextInputType.phone,
                  textInputAction: TextInputAction.next,
                  autofill: const [AutofillHints.telephoneNumber],
                )
              : const SizedBox(width: double.infinity),
        ),
        _Field(label: 'Subject (optional)', controller: _subject, textInputAction: TextInputAction.next),
        _Field(
          label: 'Tell me about your project',
          controller: _message,
          focus: _focus['message'],
          error: _errors['message'],
          maxLines: 5,
          hint: length == 0
              ? 'What are you building, who is it for, and when do you need it?'
              : length < 10
                  ? '${10 - length} more characters to go'
                  : '✓ $length characters — looks good',
        ),
        const SizedBox(height: 18),
        Row(
          children: [
            SectionLabel(done == total ? 'Ready to send' : 'Almost there'),
            const Spacer(),
            SectionLabel('$done of $total done'),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(2),
          child: TweenAnimationBuilder<double>(
            tween: Tween(end: done / total),
            duration: const Duration(milliseconds: 600),
            curve: kEaseExpo,
            builder: (_, v, __) => LinearProgressIndicator(value: v, minHeight: 2, color: p.brand, backgroundColor: p.line),
          ),
        ),
        const SizedBox(height: 18),
        if (_status == 'error')
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text("Couldn't send right now. Try WhatsApp below, or email ${Site.email}.", style: AppText.sans(14, color: p.brand)),
          )
        else
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text(
              _status == 'sending' ? 'Sending… the server may take a few seconds to wake up.' : '$_replyNote, usually within a day.',
              style: AppText.sans(14, color: p.dim),
            ),
          ),
        PillButton(
          label: _status == 'sending' ? 'Sending…' : 'Send message',
          style: PillStyle.ink,
          expand: true,
          trailing: Icons.arrow_forward_rounded,
          onTap: _status == 'sending' ? null : _submit,
        ),
        const SizedBox(height: 10),
        PillButton(
          label: 'Send this on WhatsApp instead',
          style: PillStyle.outline,
          expand: true,
          leading: const WhatsAppGlyph(),
          onTap: _sendOnWhatsApp,
        ),
      ],
    );
  }
}

class _ChannelRow extends StatelessWidget {
  const _ChannelRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.onTap,
    required this.accent,
    required this.isForm,
    this.onCopy,
  });
  final Widget icon;
  final String label;
  final String value;
  final VoidCallback onTap;
  final bool accent;
  final bool isForm;
  final VoidCallback? onCopy;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(border: Border(bottom: BorderSide(color: p.line))),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: accent ? p.brand : Colors.transparent,
                border: Border.all(color: accent ? p.brand : p.line),
              ),
              child: Center(child: icon),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label.toUpperCase(), style: AppText.mono(9.5, color: accent ? p.brand : p.dim)),
                  const SizedBox(height: 4),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Text(value, style: AppText.serif(26, color: p.ink)),
                  ),
                ],
              ),
            ),
            if (onCopy != null)
              IconButton(tooltip: 'Copy', onPressed: onCopy, icon: Icon(Icons.content_copy_rounded, size: 18, color: p.dim)),
            Icon(isForm ? Icons.arrow_downward_rounded : Icons.north_east_rounded, size: 18, color: p.ink),
          ],
        ),
      ),
    );
  }
}

class _Choices extends StatelessWidget {
  const _Choices({required this.legend, required this.options, required this.value, required this.onChanged});
  final String legend;
  final List<String> options;
  final String value;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionLabel(legend),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final o in options)
              Semantics(
                selected: value == o,
                button: true,
                child: GestureDetector(
                  onTap: () {
                    HapticFeedback.selectionClick();
                    onChanged(o);
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    curve: kEaseExpo,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: value == o ? p.brand : Colors.transparent,
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(color: value == o ? p.brand : p.line),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (o == 'WhatsApp') ...[
                          WhatsAppGlyph(size: 15, color: value == o ? p.brandInk : p.ink),
                          const SizedBox(width: 6),
                        ],
                        Text(o, style: AppText.sans(14.5, color: value == o ? p.brandInk : p.ink.withOpacity(0.85))),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}

class _Field extends StatelessWidget {
  const _Field({
    required this.label,
    required this.controller,
    this.focus,
    this.error,
    this.hint,
    this.keyboard,
    this.maxLines = 1,
    this.textInputAction,
    this.autofill,
  });

  final String label;
  final TextEditingController controller;
  final FocusNode? focus;
  final String? error;
  final String? hint;
  final TextInputType? keyboard;
  final int maxLines;
  final TextInputAction? textInputAction;
  final List<String>? autofill;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final border = UnderlineInputBorder(borderSide: BorderSide(color: error != null ? p.brand : p.line));
    return Padding(
      padding: const EdgeInsets.only(top: 14),
      child: TextField(
        controller: controller,
        focusNode: focus,
        keyboardType: keyboard ?? (maxLines > 1 ? TextInputType.multiline : TextInputType.text),
        textInputAction: maxLines > 1 ? TextInputAction.newline : textInputAction,
        textCapitalization: keyboard == TextInputType.emailAddress ? TextCapitalization.none : TextCapitalization.sentences,
        autofillHints: autofill,
        minLines: maxLines > 1 ? 4 : 1,
        maxLines: maxLines,
        style: AppText.sans(19, color: p.ink),
        cursorColor: p.brand,
        decoration: InputDecoration(
          labelText: label.toUpperCase(),
          labelStyle: AppText.mono(10.5, color: p.dim),
          floatingLabelStyle: AppText.mono(10.5, color: error != null ? p.brand : p.ink),
          alignLabelWithHint: true,
          contentPadding: const EdgeInsets.only(top: 6, bottom: 10),
          enabledBorder: border,
          border: border,
          focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: error != null ? p.brand : p.ink, width: 1.4)),
          errorText: error,
          errorStyle: AppText.sans(13, color: p.brand),
          errorBorder: border,
          focusedErrorBorder: UnderlineInputBorder(borderSide: BorderSide(color: p.brand, width: 1.4)),
          helperText: error == null ? hint : null,
          helperStyle: AppText.sans(13, color: p.dim),
          helperMaxLines: 2,
        ),
      ),
    );
  }
}
