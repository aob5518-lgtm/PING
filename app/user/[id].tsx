import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Chip, PrimaryButton } from '@/components/ui';
import { recommendations } from '@/data/mock';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/features/theme-context';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { people, ensureDirectConversation } = useApp();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const user = people.find(item => item.id === id);
  if (!user) return <View style={styles.notFound}><Text style={styles.notFoundText}>Profile not found.</Text></View>;
  const recommendation = recommendations.find(item => item.user.id === user.id);
  const sayHi = () => {
    const conversationId = ensureDirectConversation(user.id);
    if (!conversationId) return;
    router.push({ pathname: '/chat/[id]', params: { id: conversationId, draft: 'Hi 👋' } });
  };
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Avatar label={user.avatar} size={92} />
        <Text style={styles.name}>{user.displayName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
      <Section title="Interested in"><View style={styles.chips}>{user.interests.map(item => <Chip key={item} text={item} />)}</View></Section>
      <Section title="Looking to meet"><View style={styles.chips}>{user.lookingFor.map(item => <Chip key={item} text={item} />)}</View></Section>
      <View style={styles.insight}>
        <View style={styles.insightTitle}><Ionicons name="sparkles" size={17} color={colors.text} /><Text style={styles.insightEyebrow}>WHY YOU MAY GET ALONG</Text></View>
        <Text style={styles.insightText}>{recommendation?.reason ?? 'You have a few interests in common.'}</Text>
        <View style={styles.topic}><Text style={styles.topicLabel}>A CONVERSATION TO START</Text><Text style={styles.topicText}>{recommendation?.suggestedTopic ?? 'What are you building lately?'}</Text></View>
      </View>
      <PrimaryButton title="Say Hi" icon="hand-left-outline" onPress={sayHi} />
      <Text style={styles.note}>You’ll review the first message before it’s sent.</Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  notFound: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }, notFoundText: { color: colors.text },
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: 44, gap: 24 },
  hero: { alignItems: 'center', paddingTop: 6 }, name: { color: colors.text, fontSize: 27, fontWeight: '800', marginTop: 15, letterSpacing: -.5 }, username: { color: colors.secondary, fontSize: 15, marginTop: 4 },
  bio: { color: colors.text, fontSize: 15, lineHeight: 23, textAlign: 'center', maxWidth: 330, marginTop: 16 }, section: { gap: 11 }, sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700' }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  insight: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 18, gap: 12 }, insightTitle: { flexDirection: 'row', alignItems: 'center', gap: 7 }, insightEyebrow: { color: colors.text, fontSize: 11, fontWeight: '800', letterSpacing: .8 },
  insightText: { color: colors.text, fontSize: 15, lineHeight: 22 }, topic: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12, gap: 5 }, topicLabel: { color: colors.secondary, fontSize: 10, fontWeight: '700', letterSpacing: .7 }, topicText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  note: { textAlign: 'center', color: colors.secondary, fontSize: 12, marginTop: -13 },
});
