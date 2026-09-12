import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, IconButton } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { Message } from '@/types';

const suggestions = [
  'That sounds interesting. What approach are you using?',
  'I’ve been thinking about the same problem.',
  'Tell me more.',
];

export default function ChatScreen() {
  const params = useLocalSearchParams<{ id: string; draft?: string }>();
  const { conversations, messages, people, sendMessage } = useApp();
  const conversation = conversations.find(item => item.id === params.id);
  const [draft, setDraft] = useState(params.draft ?? '');
  const [attachment, setAttachment] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);
  const [aiSheet, setAiSheet] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [toast, setToast] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const chatMessages = useMemo(() => messages.filter(item => item.conversationId === params.id), [messages, params.id]);
  if (!conversation) return <SafeAreaView style={styles.center}><Text>Conversation not found.</Text></SafeAreaView>;
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
  const contextAction = async (action: string) => {
    const message = selected;
    setSelected(null);
    if (!message) return;
    if (action === 'Reply') setReplyTo(message);
    if (action === 'Copy') { await Clipboard.setStringAsync(message.content); flash('Copied to clipboard'); }
    if (action === 'Translate') flash('Translation preview is coming soon');
    if (action === 'AI Reply') setAiSheet(true);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <IconButton name="chevron-back" onPress={() => router.back()} />
        <Avatar label={conversation.avatar} size={40} />
        <Pressable style={styles.headerIdentity} onPress={() => isGroup ? flash('Group info is coming soon') : other && router.push({ pathname: '/user/[id]', params: { id: other.id } })}>
          <Text style={styles.headerName}>{conversation.title}</Text><Text style={styles.headerSub}>{isGroup ? `${conversation.participantIds.length} members` : `@${other?.username ?? 'milo'}`}</Text>
        </Pressable>
        <IconButton name="call-outline" onPress={() => flash('Calls are coming soon')} />
        <IconButton name="ellipsis-horizontal" onPress={() => flash('More options coming soon')} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={5}>
        <FlatList ref={listRef} data={chatMessages} keyExtractor={item => item.id} contentContainerStyle={styles.messages} onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={<View style={styles.day}><Text style={styles.dayText}>Today</Text></View>}
          renderItem={({ item }) => {
            const mine = item.senderId === 'me';
            const sender = people.find(person => person.id === item.senderId);
            const replied = item.replyTo ? messages.find(message => message.id === item.replyTo) : undefined;
            return <Pressable onLongPress={() => setSelected(item)} delayLongPress={320} style={[styles.messageRow, mine && { justifyContent: 'flex-end' }]}>
              {!mine && isGroup && <Avatar label={sender?.avatar ?? '?'} size={28} />}
              <View style={{ maxWidth: '78%' }}>
                {!mine && isGroup && <Text style={styles.sender}>{sender?.displayName}</Text>}
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
                  {replied && <View style={styles.replyPreview}><Text numberOfLines={1} style={styles.replyPreviewText}>{replied.content}</Text></View>}
                  {item.type === 'image' && <View style={styles.imagePlaceholder}><Ionicons name="image-outline" size={34} color={colors.accent} /><Text style={styles.imageText}>Image preview</Text></View>}
                  {item.type === 'file' && <View style={styles.file}><Ionicons name="document-outline" size={22} color={mine ? 'white' : colors.accent} /><Text style={[styles.messageText, mine && { color: 'white' }]}>{item.content}</Text></View>}
                  {item.type === 'text' && <Text style={[styles.messageText, mine && styles.messageTextMine]}>{item.content}</Text>}
                </View>
                <Text style={[styles.messageTime, mine && { textAlign: 'right' }]}>{item.createdAt}{mine ? '  ✓' : ''}</Text>
              </View>
            </Pressable>;
          }} />
        {replyTo && <View style={styles.replyBar}><View style={{ flex: 1 }}><Text style={styles.replyLabel}>Replying</Text><Text style={styles.replyText} numberOfLines={1}>{replyTo.content}</Text></View><IconButton name="close" onPress={() => setReplyTo(null)} /></View>}
        <View style={styles.composer}>
          <Pressable onPress={() => setAttachment(true)} style={styles.plus}><Ionicons name="add" size={24} color={colors.accent} /></Pressable>
          <TextInput value={draft} onChangeText={setDraft} placeholder="Message…" placeholderTextColor={colors.muted} multiline style={styles.composerInput} />
          <Pressable onPress={draft.trim() ? submit : () => flash('Hold to record — coming soon')} style={[styles.send, !!draft.trim() && styles.sendActive]}>
            <Ionicons name={draft.trim() ? 'arrow-up' : 'mic-outline'} size={20} color={draft.trim() ? 'white' : colors.accent} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      <Modal visible={attachment} transparent animationType="slide" onRequestClose={() => setAttachment(false)}>
        <Pressable style={styles.overlay} onPress={() => setAttachment(false)}><View style={styles.smallSheet}><View style={styles.handle} /><Text style={styles.sheetTitle}>Add to message</Text><Pressable style={styles.attachRow} onPress={() => attach('image')}><Ionicons name="image-outline" size={22} color={colors.accent} /><Text style={styles.attachText}>Photo</Text></Pressable><Pressable style={styles.attachRow} onPress={() => attach('file')}><Ionicons name="document-outline" size={22} color={colors.accent} /><Text style={styles.attachText}>File</Text></Pressable></View></Pressable>
      </Modal>
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.contextOverlay} onPress={() => setSelected(null)}><View style={styles.context}>{['Reply', 'Copy', 'Translate', 'AI Reply'].map((action, i) => <Pressable key={action} onPress={() => contextAction(action)} style={[styles.contextRow, i === 3 && { borderBottomWidth: 0 }]}><Ionicons name={(['return-up-back-outline', 'copy-outline', 'language-outline', 'sparkles-outline'] as const)[i]} size={19} color={colors.text} /><Text style={styles.contextText}>{action}</Text></Pressable>)}</View></Pressable>
      </Modal>
      <Modal visible={aiSheet} transparent animationType="slide" onRequestClose={() => setAiSheet(false)}>
        <Pressable style={styles.overlay} onPress={() => setAiSheet(false)}><Pressable style={styles.smallSheet}><View style={styles.handle} /><View style={styles.aiTitle}><Ionicons name="sparkles" size={19} color={colors.accent} /><Text style={styles.sheetTitle}>Suggested replies</Text></View><Text style={styles.aiNote}>Milo will add your choice to the composer, never send it for you.</Text>{suggestions.map(item => <Pressable key={item} style={styles.suggestion} onPress={() => { setDraft(item); setAiSheet(false); }}><Text style={styles.suggestionText}>{item}</Text><Ionicons name="add-circle-outline" size={20} color={colors.accent} /></Pressable>)}</Pressable></Pressable>
      </Modal>
      {!!toast && <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { minHeight: 62, paddingHorizontal: 6, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.surface },
  headerIdentity: { flex: 1, marginLeft: 10 }, headerName: { color: colors.text, fontSize: 15, fontWeight: '700' }, headerSub: { color: colors.secondary, fontSize: 11, marginTop: 2 },
  messages: { padding: spacing.md, gap: 13, flexGrow: 1, justifyContent: 'flex-end' }, day: { alignItems: 'center', marginVertical: 4 }, dayText: { color: colors.muted, fontSize: 11, backgroundColor: colors.warm, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 }, sender: { color: colors.secondary, fontSize: 11, marginLeft: 8, marginBottom: 3 },
  bubble: { borderRadius: 17, paddingHorizontal: 14, paddingVertical: 10 }, bubbleMine: { backgroundColor: colors.accent, borderBottomRightRadius: 5 }, bubbleOther: { backgroundColor: colors.surface, borderBottomLeftRadius: 5, borderWidth: 1, borderColor: colors.line },
  messageText: { color: colors.text, fontSize: 15, lineHeight: 21 }, messageTextMine: { color: 'white' }, messageTime: { color: colors.muted, fontSize: 10, marginTop: 4, marginHorizontal: 5 },
  imagePlaceholder: { width: 210, height: 130, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', gap: 7 }, imageText: { color: colors.accent, fontWeight: '600', fontSize: 12 }, file: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  replyPreview: { borderLeftWidth: 2, borderLeftColor: colors.muted, paddingLeft: 8, marginBottom: 7 }, replyPreviewText: { color: colors.secondary, fontSize: 11 },
  replyBar: { flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 8, paddingVertical: 7, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface }, replyLabel: { color: colors.accent, fontSize: 11, fontWeight: '700' }, replyText: { color: colors.secondary, fontSize: 12, marginTop: 2 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface },
  plus: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }, composerInput: { flex: 1, minHeight: 42, maxHeight: 104, borderRadius: 21, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, color: colors.text, fontSize: 15 },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }, sendActive: { backgroundColor: colors.accent },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000035' }, smallSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 38 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 19 }, sheetTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  attachRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 17, borderBottomWidth: 1, borderBottomColor: colors.line }, attachText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  contextOverlay: { flex: 1, backgroundColor: '#00000045', alignItems: 'center', justifyContent: 'center', padding: 40 }, context: { width: '100%', maxWidth: 310, backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: 16 },
  contextRow: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 51, borderBottomWidth: 1, borderBottomColor: colors.line }, contextText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  aiTitle: { flexDirection: 'row', gap: 8, alignItems: 'center' }, aiNote: { color: colors.secondary, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 10 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.line }, suggestionText: { flex: 1, color: colors.text, fontSize: 15, lineHeight: 21 },
  toast: { position: 'absolute', bottom: 86, alignSelf: 'center', backgroundColor: colors.text, paddingHorizontal: 17, paddingVertical: 10, borderRadius: radius.pill }, toastText: { color: 'white', fontSize: 12, fontWeight: '600' },
});
