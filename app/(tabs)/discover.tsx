import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, PrimaryButton, SearchField } from '@/components/ui';
import { recommendations } from '@/data/mock';
import { colors, radius, spacing } from '@/constants/theme';

export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const normalized = query.replace('@', '').toLowerCase();
    return recommendations.filter(item => [item.user.displayName, item.user.username, item.user.interests.join(' ')].join(' ').toLowerCase().includes(normalized));
  }, [query]);

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList data={filtered} keyExtractor={item => item.user.id} contentContainerStyle={styles.content}
        ListHeaderComponent={<>
          <View style={styles.heading}><Text style={styles.kicker}>COMPATIBILITY, NOT POPULARITY</Text><Text style={styles.title}>Discover</Text><Text style={styles.subtitle}>A few people who may be worth knowing.</Text></View>
          <SearchField placeholder="Search people, IDs or interests" value={query} onChangeText={setQuery} />
          <Text style={styles.sectionTitle}>People you may want to meet</Text>
        </>}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>No one found</Text><Text style={styles.emptyText}>Try an interest, name, or Milo ID.</Text></View>}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/user/[id]', params: { id: item.user.id } })} style={({ pressed }) => [styles.card, pressed && { opacity: .8 }]}>
            <View style={styles.person}><Avatar label={item.user.avatar} size={56} /><View style={styles.personMain}><Text style={styles.name}>{item.user.displayName}</Text><Text style={styles.username}>@{item.user.username}</Text></View></View>
            <View style={styles.tags}>{item.user.interests.slice(0, 3).map(tag => <Text key={tag} style={styles.tag}>{tag}</Text>)}</View>
            <View style={styles.reason}><Text style={styles.reasonLabel}>WHY THIS MATCH</Text><Text style={styles.reasonText}>{item.reason}</Text></View>
            <PrimaryButton title="Say Hi" icon="hand-left-outline" onPress={() => router.push({ pathname: '/user/[id]', params: { id: item.user.id } })} />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 40 },
  heading: { marginTop: 6, marginBottom: 22 }, kicker: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 5 },
  title: { fontSize: 34, color: colors.text, fontWeight: '800', letterSpacing: -1.2 }, subtitle: { color: colors.secondary, fontSize: 15, marginTop: 7 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 26, marginBottom: 2 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 18, gap: 16, marginBottom: 4 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 13 }, personMain: { gap: 3 }, name: { color: colors.text, fontSize: 18, fontWeight: '700' }, username: { color: colors.secondary, fontSize: 14 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, tag: { color: colors.accentDark, backgroundColor: colors.accentSoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, fontWeight: '600' },
  reason: { backgroundColor: colors.background, borderRadius: radius.md, padding: 13, gap: 5 }, reasonLabel: { color: colors.muted, fontSize: 10, fontWeight: '700', letterSpacing: .8 }, reasonText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  empty: { paddingTop: 70, alignItems: 'center', gap: 8 }, emptyTitle: { color: colors.text, fontWeight: '700', fontSize: 17 }, emptyText: { color: colors.secondary },
});
