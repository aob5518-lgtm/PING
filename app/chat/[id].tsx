import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SecondaryButton } from '@/components/ui';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { AiReplySheet } from '@/features/chat/AiReplySheet';
import { ChatHeader } from '@/features/chat/ChatHeader';
import { MessageActions, MessageAction } from '@/features/chat/MessageActions';
import { MessageBubble } from '@/features/chat/MessageBubble';
import { MessageComposer } from '@/features/chat/MessageComposer';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';
import { Message } from '@/types';
import { formatMessageDay } from '@/utils/date';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ id: string; draft?: string }>();
  const { conversations, messages, people, privacy, sendMessage, isBlocked, unblockUser } = useApp();
  const { colors } = useTheme();
  const { t, locale } = useI18n();
  const styles = createStyles(colors);
  const conversation = conversations.find(item => item.id === params.id);
  const [draft, setDraft] = useState(params.draft ?? '');
  const [selected, setSelected] = useState<Message | null>(null);
  const [suggestionSheet, setSuggestionSheet] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [toast, setToast] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const chatMessages = useMemo(() => messages.filter(item => item.conversationId === params.id).sort((a, b) => a.createdAt - b.createdAt), [messages, params.id]);
  const suggestions = [t('chat.suggestion1'), t('chat.suggestion2'), t('chat.suggestion3')];

  if (!conversation) return <SafeAreaView style={styles.center}><Text style={styles.centerText}>{t('chat.notFound')}</Text></SafeAreaView>;

  const isGroup = conversation.type === 'group';
  const otherId = conversation.participantIds.find(item => item !== 'me');
  const other = people.find(item => item.id === otherId);
  const blocked = !isGroup && !!other && isBlocked(other.id);
  const flash = (value: string) => { setToast(value); setTimeout(() => setToast(''), 1700); };
  const submit = () => {
    if (!draft.trim() || blocked) return;
    sendMessage(conversation.id, draft, 'text', replyTo?.id);
    setDraft('');
    setReplyTo(null);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };
  const contextAction = async (action: MessageAction) => {
    const message = selected;
    setSelected(null);
    if (!message) return;
    if (action === 'reply') setReplyTo(message);
    if (action === 'copy') { await Clipboard.setStringAsync(message.content); flash(t('chat.copied')); }
    if (action === 'suggest') setSuggestionSheet(true);
  };

  return <SafeAreaView style={styles.screen}>
    <ChatHeader conversation={conversation} username={other?.username} onOpenProfile={!isGroup && other ? () => router.push({ pathname: '/user/[id]', params: { id: other.id } }) : undefined} />
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={5}>
      <FlatList ref={listRef} data={chatMessages} keyExtractor={item => item.id} contentContainerStyle={styles.messages} onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListHeaderComponent={<View style={styles.day}><Text style={styles.dayText}>{formatMessageDay(chatMessages.at(-1)?.createdAt, Date.now(), locale, t('date.today'), t('date.yesterday'))}</Text></View>}
        renderItem={({ item }) => <MessageBubble message={item} replied={item.replyTo ? messages.find(message => message.id === item.replyTo) : undefined} sender={people.find(person => person.id === item.senderId)} isGroup={isGroup} showReadReceipts={privacy.readReceipts} onLongPress={() => setSelected(item)} />} />
      {blocked ? <View style={styles.blocked}><Text style={styles.blockedText}>{t('chat.blocked')}</Text><SecondaryButton title={t('common.unblock')} onPress={() => other && unblockUser(other.id)} /></View> : <MessageComposer draft={draft} replyTo={replyTo} onChange={setDraft} onSend={submit} onCancelReply={() => setReplyTo(null)} />}
    </KeyboardAvoidingView>
    <MessageActions message={selected} onClose={() => setSelected(null)} onAction={contextAction} />
    <AiReplySheet visible={suggestionSheet} suggestions={suggestions} onClose={() => setSuggestionSheet(false)} onSelect={value => { setDraft(value); setSuggestionSheet(false); }} />
    {!!toast && <View accessibilityRole="alert" style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>}
  </SafeAreaView>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }, centerText: { color: colors.text }, keyboard: { flex: 1 },
  messages: { padding: spacing.md, gap: 13, flexGrow: 1, justifyContent: 'flex-end' }, day: { alignItems: 'center', marginVertical: 4 }, dayText: { color: colors.secondary, fontSize: 11, backgroundColor: colors.soft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  blocked: { gap: 10, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface }, blockedText: { color: colors.secondary, textAlign: 'center', fontSize: 13, lineHeight: 18 },
  toast: { position: 'absolute', bottom: 86, alignSelf: 'center', backgroundColor: colors.text, paddingHorizontal: 17, paddingVertical: 10, borderRadius: radius.pill }, toastText: { color: colors.inverseText, fontSize: 12, fontWeight: '600' },
});
