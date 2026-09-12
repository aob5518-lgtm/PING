import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';

export default function IdentityScreen() {
  const { currentUser } = useApp();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <View style={styles.notice}><Ionicons name="phone-portrait-outline" size={21} color={colors.text} /><Text style={styles.noticeText}>{t('identity.notice')}</Text></View>
    <View style={styles.card}>
      <Text style={styles.title}>{t('nav.identity')}</Text>
      <Detail label={t('identity.pingId')} value={`@${currentUser.username}`} />
      <Detail label={t('identity.localProfile')} value={t('identity.stored')} />
    </View>
  </ScrollView>;
}

function Detail({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={styles.detail}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: 18 },
  notice: { flexDirection: 'row', gap: 12, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, padding: 15 }, noticeText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 17, gap: 18 }, title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  detail: { gap: 4 }, label: { color: colors.secondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: .6, fontWeight: '700' }, value: { color: colors.text, fontSize: 15 },
});
