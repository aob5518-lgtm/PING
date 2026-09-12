import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, IconButton, SearchField } from '@/components/ui';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/features/theme-context';
import { formatConversationTime } from '@/utils/date';

export default function ChatsScreen() {
  const { conversations } = useApp();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { created } = useLocalSearchParams<{ created?: string }>();
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState(created === '1' ? 'Identity created' : '');
  const filtered = useMemo(() => conversations.filter(item => `${item.title}  ${item.lastMessage}`.toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 1800);
    return () => clearTimeout(timer);
  }, [toast]);
  const soon = (message: string) => { setMenu(false); setToast(message); };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}><View><Text style={styles.kicker}>YOUR PEOPLE</Text><Text style={styles.title}>Chats</Text></View><IconButton name="add" accessibilityLabel="Start a new chat or group" onPress={() => setMenu(true)} style={styles.add} /></View>
      <View style={styles.search}><SearchField placeholder="Search conversations" value={query} onChangeText={setQuery} /></View>
      <FlatList data={filtered} keyExtractor={item => item.id} contentContainerStyle={styles.list} ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="chatbubbles-outline" size={32} color={colors.muted} /><Text style={styles.emptyTitle}>No conversations found</Text><Text style={styles.emptyText}>Try another name or message.</Text></View>}
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" accessibilityLabel={`Open chat with ${item.title}`} style={({ pressed }) => [styles.row, pressed && { opacity: .65 }]} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}>
            <Avatar label={item.avatar} size={54} />
            <View style={styles.rowMain}><View style={styles.rowTop}><Text style={styles.name}>{item.title}</Text><Text style={styles.time}>{formatConversationTime(item.updatedAt)}</Text></View><View style={styles.rowBottom}><Text numberOfLines={1} style={styles.message}>{item.lastMessage}</Text>{item.unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View>}</View></View>
          </Pressable>
        )} />
      <Modal visible={menu} transparent animationType="slide" onRequestClose={() => setMenu(false)}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close menu" style={styles.overlay} onPress={() => setMenu(false)}><Pressable style={styles.sheet}>
          <View style={styles.handle} /><Text style={styles.sheetTitle}>Start something</Text>
          <SheetItem icon="person-add-outline" title="New Chat" caption="Find someone on Ping" onPress={() => { setMenu(false); router.push('/(tabs)/discover'); }} />
          <SheetItem icon="people-outline" title="Create Group" caption="Bring a few people together" onPress={() => { setMenu(false); router.push('/create-group'); }} />
          <SheetItem icon="qr-code-outline" title="Scan QR" caption="Connect in person" onPress={() => soon('QR scanning is coming soon')} />
        </Pressable></Pressable>
      </Modal>
      {!!toast && <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>}
    </SafeAreaView>
  );
}

function SheetItem({ icon, title, caption, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; caption: string; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={styles.sheetRow}><View style={styles.sheetIcon}><Ionicons name={icon} size={21} color={colors.text} /></View><View><Text style={styles.sheetItemTitle}>{title}</Text><Text style={styles.sheetCaption}>{caption}</Text></View></Pressable>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { color: colors.secondary, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 4 }, title: { fontSize: 34, fontWeight: '800', letterSpacing: -1.2, color: colors.text },
  add: { backgroundColor: colors.soft }, search: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md }, list: { paddingHorizontal: spacing.lg, paddingBottom: 30 },
  row: { flexDirection: 'row', gap: 14, paddingVertical: 15 }, rowMain: { flex: 1, justifyContent: 'center', gap: 7 }, rowTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, rowBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text }, time: { color: colors.muted, fontSize: 12 }, message: { color: colors.secondary, fontSize: 14, flex: 1 },
  badge: { minWidth: 21, height: 21, borderRadius: 11, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }, badgeText: { color: colors.inverseText, fontWeight: '700', fontSize: 11 }, separator: { height: 1, backgroundColor: colors.line, marginLeft: 68 },
  empty: { alignItems: 'center', gap: 8, paddingTop: 80 }, emptyTitle: { color: colors.text, fontWeight: '700', fontSize: 16 }, emptyText: { color: colors.secondary },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay }, sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 38, borderWidth: 1, borderColor: colors.line },
  handle: { width: 40, height: 4, backgroundColor: colors.line, borderRadius: 2, alignSelf: 'center', marginBottom: 20 }, sheetTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 14 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13 }, sheetIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  sheetItemTitle: { color: colors.text, fontWeight: '600', fontSize: 16 }, sheetCaption: { color: colors.secondary, fontSize: 13, marginTop: 3 },
  toast: { position: 'absolute', bottom: 28, alignSelf: 'center', backgroundColor: colors.text, paddingHorizontal: 18, paddingVertical: 11, borderRadius: radius.pill }, toastText: { color: colors.inverseText, fontSize: 13, fontWeight: '600' },
});
