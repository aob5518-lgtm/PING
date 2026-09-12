import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { AiReplySheet } from '@/features/chat/AiReplySheet';
import { ChatHeader } from '@/features/chat/ChatHeader';
import { MessageActions, MessageAction } from '@/features/chat/MessageActions';
import { MessageBubble } from '@/features/chat/MessageBubble';
import { MessageComposer } from '@/features/chat/MessageComposer';
import { useTheme } from '@/features/theme-context';
import { Message } from '@/types';
import { formatMessageDay } from '@/utils/date';

const suggestions = ['That sounds interesting. What approach are you using?', 'I’ve been thinking about the same problem.', 'Tell me more.'];

export default function ChatScreen() {
  const params = useLocalSearchParams<{ id: string; draft?: string }>();
  const { conversations, messages, people, sendMessage } = useApp();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const conversation = conversations.find(item => item.id === params.id);
  const [draft, setDraft] = useState(params.draft ?? '');
  const [attachment, setAttachment] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);
  const [aiSheet, setAiSheet] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [toast, setToast] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const chatMessages = useMemo(() => messages.filter(item => item.conversationId === params.id).sort((a, b) => a.createdAt - b.createdAt), [messages, params.id]);

  if (!conversation) return <SafeAreaView style={styles.center}><Text style={styles.centerText}>Conversation not found.</Text></SafeAreaView>;

  const isGroup = conversation.type === 'group';
  const otherId = conversation.participantIds.find(item => item !== 'me');
  const other = people.find(item => item.id === otherId);
  const flash = (value: string) => { setToast(value); setTimeout(() => setToast(''), 1700); };
  const submit = () => {
    if (!draft.trim()) return;
    sendMessage(conversation.id, draft, 'text', replyTo?.id);
    setDraft('');
    setReplyTo(null);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };
  const attach = (type: 'image' | 'file') => {
    sendMessage(conversation.id, type === 'image' ? 'Photo placeholder' : 'File placeholder', type);
    setAttachment(false);
  };
  const contextAction = async (action: MessageAction) => {
    const message = selected;
    setSelected(null);
    if (!message) return;
    if (action === 'Reply') setReplyTo(message);
    if (action === 'Copy') { await Clipboard.setStringAsync(message.content); flash('Copied to clipboard'); }
    if (action === 'Translate') flash('Translation preview is coming soon');
    if (action === 'AI Reply') setAiSheet(true);
  };
  const openDetails = () => {
    if (isGroup) return flash('Group info is coming soon');
    if (!other) return flash('User is no longer available');
    router.push({ pathname: '/user/[id]', params: { id: other.id } });
  };

  return <SafeAreaView style={styles.screen}>
    <ChatHeader conversation={conversation} username={other?.username} onOpenProfile={openDetails} onCall={() => flash('Calls are coming soon')} onMore={() => flash('More options coming soon')} />
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={5}>
      <FlatList ref={listRef} data={chatMessages} keyExtractor={item => item.id} contentContainerStyle={styles.messages} onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListHeaderComponent={<View style={styles.day}><Text style={styles.dayText}>{formatMessageDay(chatMessages.at(-1)?.createdAt)}</Text></View>}
        renderItem={({ item }) => <MessageBubble message={item} replied={item.replyTo ? messages.find(message => message.id === item.replyTo) : undefined} sender={people.find(person => person.id === item.senderId)} isGroup={isGroup} onLongPress={() => setSelected(item)} />} />
      <MessageComposer draft={draft} replyTo={replyTo} onChange={setDraft} onAttach={() => setAttachment(true)} onSend={submit} onVoice={() => flash('Hold to record — coming soon')} onCancelReply={() => setReplyTo(null)} />
    </KeyboardAvoidingView>
    <AttachmentSheet visible={attachment} onClose={() => setAttachment(false)} onAttach={attach} />
    <MessageActions message={selected} onClose={() => setSelected(null)} onAction={contextAction} />
    <AiReplySheet visible={aiSheet} suggestions={suggestions} onClose={() => setAiSheet(false)} onSelect={value => { setDraft(value); setAiSheet(false); }} />
    {!!toast && <View accessibilityRole="alert" style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>}
  </SafeAreaView>;
}

function AttachmentSheet({ visible, onClose, onAttach }: { visible: boolean; onClose: () => void; onAttach: (type: 'image' | 'file') => void }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close attachment menu" style={styles.overlay} onPress={onClose}>
      <View style={styles.sheet}><View style={styles.handle} /><Text style={styles.sheetTitle}>Add to message</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Attach photo" style={styles.attachRow} onPress={() => onAttach('image')}><Ionicons name="image-outline" size={22} color={colors.text} /><Text style={styles.attachText}>Photo</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Attach file" style={styles.attachRow} onPress={() => onAttach('file')}><Ionicons name="document-outline" size={22} color={colors.text} /><Text style={styles.attachText}>File</Text></Pressable>
      </View>
    </Pressable>
  </Modal>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }, centerText: { color: colors.text }, keyboard: { flex: 1 },
  messages: { padding: spacing.md, gap: 13, flexGrow: 1, justifyContent: 'flex-end' }, day: { alignItems: 'center', marginVertical: 4 }, dayText: { color: colors.secondary, fontSize: 11, backgroundColor: colors.soft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay }, sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: colors.line, padding: 24, paddingBottom: 38 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 19 }, sheetTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: colors.line }, attachText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  toast: { position: 'absolute', bottom: 86, alignSelf: 'center', backgroundColor: colors.text, paddingHorizontal: 17, paddingVertical: 10, borderRadius: radius.pill }, toastText: { color: colors.inverseText, fontSize: 12, fontWeight: '600' },
});
