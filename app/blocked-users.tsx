import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Avatar, SecondaryButton } from '@/components/ui';
import { spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';

export default function BlockedUsersScreen() {
  const { people, blockedUserIds, unblockUser } = useApp();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  const blocked = people.filter(user => blockedUserIds.includes(user.id));
  return <SafeAreaView style={styles.screen}><FlatList data={blocked} keyExtractor={item => item.id} contentContainerStyle={styles.content}
    ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>{t('blocked.emptyTitle')}</Text><Text style={styles.emptyText}>{t('blocked.emptyText')}</Text></View>}
    renderItem={({ item }) => <View style={styles.row}><Avatar label={item.avatar} size={48} /><View style={styles.person}><Text style={styles.name}>{item.displayName}</Text><Text style={styles.username}>@{item.username}</Text></View><View style={styles.button}><SecondaryButton title={t('common.unblock')} onPress={() => unblockUser(item.id)} /></View></View>} />
  </SafeAreaView>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, flexGrow: 1 }, row: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, person: { flex: 1, gap: 3 }, name: { color: colors.text, fontWeight: '700', fontSize: 15 }, username: { color: colors.secondary, fontSize: 13 }, button: { width: 108 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }, emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' }, emptyText: { color: colors.secondary, textAlign: 'center' },
});
