import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Chip, PrimaryButton, SecondaryButton } from '@/components/ui';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';
import { scorePeople } from '@/utils/matching';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentUser, people, ensureDirectConversation, isBlocked, blockUser, unblockUser } = useApp();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  const user = people.find(item => item.id === id || item.username === id);
  if (!user) return <View style={styles.notFound}><Text style={styles.notFoundText}>{t('profile.notFound')}</Text></View>;
  const blocked = isBlocked(user.id);
  const match = scorePeople(currentUser, [user])[0];
  const reason = match.sharedInterests.length > 0 ? t(match.sharedInterests.length === 1 ? 'discover.shared' : 'discover.sharedPlural', { count: match.sharedInterests.length }) : match.profileFit ? t('discover.profileFit') : t('discover.generalFit');
  const sayHi = () => { const conversationId = ensureDirectConversation(user.id); if (conversationId) router.push({ pathname: '/chat/[id]', params: { id: conversationId, draft: 'Hi 👋' } }); };
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.hero}><Avatar label={user.avatar} size={92} /><Text style={styles.name}>{user.displayName}</Text><Text style={styles.username}>@{user.username}</Text><Text style={styles.bio}>{user.bio}</Text></View>
    <Section title={t('profile.interests')}><View style={styles.chips}>{user.interests.map(item => <Chip key={item} text={item} />)}</View></Section>
    <Section title={t('profile.lookingFor')}><View style={styles.chips}>{user.lookingFor.map(item => <Chip key={item} text={item} />)}</View></Section>
    <View style={styles.insight}><View style={styles.insightTitle}><Ionicons name="sparkles" size={17} color={colors.text} /><Text style={styles.insightEyebrow}>{t('profile.why')}</Text></View><Text style={styles.insightText}>{reason}</Text><View style={styles.topic}><Text style={styles.topicLabel}>{t('profile.topicLabel')}</Text><Text style={styles.topicText}>{t('profile.topic')}</Text></View></View>
    {blocked ? <Text style={styles.blocked}>{t('profile.blocked')}</Text> : <><PrimaryButton title={t('profile.sayHi')} icon="hand-left-outline" onPress={sayHi} /><Text style={styles.note}>{t('profile.review')}</Text></>}
    <SecondaryButton title={blocked ? t('profile.unblockUser', { name: user.displayName }) : t('profile.blockUser', { name: user.displayName })} onPress={() => blocked ? unblockUser(user.id) : blockUser(user.id)} />
  </ScrollView>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { const { colors } = useTheme(); const styles = createStyles(colors); return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>; }
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  notFound: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }, notFoundText: { color: colors.text }, screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: 44, gap: 24 }, hero: { alignItems: 'center', paddingTop: 6 }, name: { color: colors.text, fontSize: 27, fontWeight: '800', marginTop: 15, letterSpacing: -.5 }, username: { color: colors.secondary, fontSize: 15, marginTop: 4 }, bio: { color: colors.text, fontSize: 15, lineHeight: 23, textAlign: 'center', maxWidth: 330, marginTop: 16 },
  section: { gap: 11 }, sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700' }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, insight: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 18, gap: 12 }, insightTitle: { flexDirection: 'row', alignItems: 'center', gap: 7 }, insightEyebrow: { color: colors.text, fontSize: 11, fontWeight: '800', letterSpacing: .8 }, insightText: { color: colors.text, fontSize: 15, lineHeight: 22 }, topic: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12, gap: 5 }, topicLabel: { color: colors.secondary, fontSize: 10, fontWeight: '700', letterSpacing: .7 }, topicText: { color: colors.text, fontSize: 14, fontWeight: '600' }, note: { textAlign: 'center', color: colors.secondary, fontSize: 12, marginTop: -13 }, blocked: { color: colors.secondary, textAlign: 'center', fontSize: 14 },
});
