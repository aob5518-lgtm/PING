import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/ui';
import { spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';

export default function WelcomeScreen() {
  const { hydrated, hasIdentity } = useApp();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  useEffect(() => {
    if (hydrated && hasIdentity) router.replace('/(tabs)/chats');
  }, [hydrated, hasIdentity]);
  if (!hydrated) return <SafeAreaView style={styles.screen} />;
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brand}><View style={styles.logo}><Ionicons name="chatbubble-ellipses" size={27} color={colors.inverseText} /></View><Text style={styles.wordmark}>Ping</Text></View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{t('welcome.eyebrow')}</Text>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton title={t('welcome.create')} onPress={() => router.push('/create-identity')} />
        <Text style={styles.privacy}><Ionicons name="shield-checkmark-outline" size={14} />  {t('welcome.privacy')}</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  logo: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontSize: 25, fontWeight: '800', color: colors.text, letterSpacing: -.8 },
  hero: { flex: 1, justifyContent: 'center', paddingBottom: 30 },
  eyebrow: { color: colors.secondary, fontSize: 14, fontWeight: '700', letterSpacing: .3, marginBottom: 14 },
  title: { color: colors.text, fontSize: 54, lineHeight: 58, fontWeight: '800', letterSpacing: -2.4 },
  subtitle: { color: colors.secondary, fontSize: 18, lineHeight: 28, marginTop: 18, maxWidth: 500 },
  actions: { gap: 12 },
  privacy: { color: colors.secondary, fontSize: 13, textAlign: 'center', marginTop: 8 },
});
