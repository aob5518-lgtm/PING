import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/ui';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/features/theme-context';

export default function WelcomeScreen() {
  const { hydrated, hasIdentity } = useApp();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [comingSoon, setComingSoon] = useState(false);
  useEffect(() => {
    if (hydrated && hasIdentity) router.replace('/(tabs)/chats');
  }, [hydrated, hasIdentity]);
  if (!hydrated) return <SafeAreaView style={styles.screen} />;
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brand}><View style={styles.logo}><Ionicons name="chatbubble-ellipses" size={27} color={colors.inverseText} /></View><Text style={styles.wordmark}>Ping</Text></View>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>A calmer way to connect</Text>
        <Text style={styles.title}>Talk freely.</Text>
        <Text style={styles.subtitle}>Meet thoughtful people and start real conversations — without a phone number or real-name verification.</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton title="Create Identity" onPress={() => router.push('/create-identity')} />
        <SecondaryButton title="Import Identity" onPress={() => setComingSoon(true)} />
        <Text style={styles.privacy}><Ionicons name="shield-checkmark-outline" size={14} />  Your identity belongs to you.</Text>
      </View>
      <Modal visible={comingSoon} transparent animationType="fade" onRequestClose={() => setComingSoon(false)}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close dialog" style={styles.overlay} onPress={() => setComingSoon(false)}><View style={styles.dialog}><Ionicons name="sparkles-outline" size={28} color={colors.text} /><Text style={styles.dialogTitle}>Coming soon</Text><Text style={styles.dialogText}>Identity import will arrive in the next sprint.</Text><PrimaryButton title="Got it" onPress={() => setComingSoon(false)} /></View></Pressable>
      </Modal>
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
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 28 },
  dialog: { width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 24, gap: 14 },
  dialogTitle: { fontSize: 22, fontWeight: '700', color: colors.text }, dialogText: { color: colors.secondary, fontSize: 15, lineHeight: 22, marginBottom: 6 },
});
