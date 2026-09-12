import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, PrimaryButton, SearchField } from '@/components/ui';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';
import { scorePeople } from '@/utils/matching';

export default function DiscoverScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { currentUser, people, blockedUserIds, ensureDirectConversation } = useApp();
  const styles = createStyles(colors);
  const [query, setQuery] = useState('');
  const matches = useMemo(() => scorePeople(currentUser, people.filter(user => !blockedUserIds.includes(user.id))), [currentUser, people, blockedUserIds]);
  const filtered = useMemo(() => { const normalized = query.replace('@', '').toLowerCase(); return matches.filter(item => [item.user.displayName, item.user.username, item.user.interests.join(' ')].join(' ').toLowerCase().includes(normalized)); }, [matches, query]);
  const sayHi = (userId: string) => { const id = ensureDirectConversation(userId); if (id) router.push({ pathname: '/chat/[id]', params: { id, draft: 'Hi 👋' } }); };
  const reason = (item: (typeof matches)[number]) => item.sharedInterests.length > 0 ? t(item.sharedInterests.length === 1 ? 'discover.shared' : 'discover.sharedPlural', { count: item.sharedInterests.length }) : item.profileFit ? t('discover.profileFit') : t('discover.generalFit');
  return <SafeAreaView style={styles.screen}><FlatList data={filtered} keyExtractor={item => item.user.id} contentContainerStyle={styles.content}
    ListHeaderComponent={<><View style={styles.heading}><Text style={styles.kicker}>{t('discover.kicker')}</Text><Text style={styles.title}>{t('tabs.discover')}</Text><Text style={styles.subtitle}>{t('discover.subtitle')}</Text></View><SearchField placeholder={t('discover.search')} value={query} onChangeText={setQuery} /><Text style={styles.sectionTitle}>{t('discover.section')}</Text></>}
    ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>{t('discover.emptyTitle')}</Text><Text style={styles.emptyText}>{t('discover.emptyText')}</Text></View>}
    renderItem={({ item }) => <View style={styles.card}><Pressable accessibilityRole="button" accessibilityLabel={t('discover.view', { name: item.user.displayName })} onPress={() => router.push({ pathname: '/user/[id]', params: { id: item.user.id } })}>
      <View style={styles.person}><Avatar label={item.user.avatar} size={56} /><View style={styles.personMain}><Text style={styles.name}>{item.user.displayName}</Text><Text style={styles.username}>@{item.user.username}</Text></View></View>
      <View style={styles.tags}>{item.user.interests.slice(0, 3).map(tag => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View><View style={styles.reason}><Text style={styles.reasonLabel}>{t('discover.reason')}</Text><Text style={styles.reasonText}>{reason(item)}</Text></View>
    </Pressable><PrimaryButton title={t('profile.sayHi')} icon="hand-left-outline" onPress={() => sayHi(item.user.id)} /></View>} />
  </SafeAreaView>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 40 }, heading: { marginTop: 6, marginBottom: 22 }, kicker: { color: colors.secondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 5 }, title: { fontSize: 34, color: colors.text, fontWeight: '800', letterSpacing: -1.2 }, subtitle: { color: colors.secondary, fontSize: 15, marginTop: 7 }, sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 26, marginBottom: 2 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 18, gap: 16, marginBottom: 4 }, person: { flexDirection: 'row', alignItems: 'center', gap: 13 }, personMain: { gap: 3 }, name: { color: colors.text, fontSize: 18, fontWeight: '700' }, username: { color: colors.secondary, fontSize: 14 }, tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 16 }, tag: { color: colors.text, backgroundColor: colors.soft, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, fontWeight: '600' }, reason: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 13, gap: 5, marginTop: 16 }, reasonLabel: { color: colors.muted, fontSize: 10, fontWeight: '700', letterSpacing: .8 }, reasonText: { color: colors.text, fontSize: 14, lineHeight: 20 }, empty: { paddingTop: 70, alignItems: 'center', gap: 8 }, emptyTitle: { color: colors.text, fontWeight: '700', fontSize: 17 }, emptyText: { color: colors.secondary },
});
