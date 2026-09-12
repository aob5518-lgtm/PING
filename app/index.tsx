import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const [comingSoon, setComingSoon] = useState(false);
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.brand}><View style={styles.logo}><Ionicons name="chatbubble-ellipses" size={27} color="white" /></View><Text style={styles.wordmark}>Milo</Text></View>
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
        <Pressable style={styles.overlay} onPress={() => setComingSoon(false)}><View style={styles.dialog}><Ionicons name="sparkles-outline" size={28} color={colors.accent} /><Text style={styles.dialogTitle}>Coming soon</Text><Text style={styles.dialogText}>Identity import will arrive in the next sprint.</Text><PrimaryButton title="Got it" onPress={() => setComingSoon(false)} /></View></Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  logo: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  wordmark: { fontSize: 25, fontWeight: '800', color: colors.text, letterSpacing: -.8 },
  hero: { flex: 1, justifyContent: 'center', paddingBottom: 30 },
  eyebrow: { color: colors.accent, fontSize: 14, fontWeight: '700', letterSpacing: .3, marginBottom: 14 },
  title: { color: colors.text, fontSize: 54, lineHeight: 58, fontWeight: '800', letterSpacing: -2.4 },
  subtitle: { color: colors.secondary, fontSize: 18, lineHeight: 28, marginTop: 18, maxWidth: 500 },
  actions: { gap: 12 },
  privacy: { color: colors.secondary, fontSize: 13, textAlign: 'center', marginTop: 8 },
  overlay: { flex: 1, backgroundColor: '#00000045', alignItems: 'center', justifyContent: 'center', padding: 28 },
  dialog: { width: '100%', maxWidth: 360, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 24, gap: 14 },
  dialogTitle: { fontSize: 22, fontWeight: '700', color: colors.text }, dialogText: { color: colors.secondary, fontSize: 15, lineHeight: 22, marginBottom: 6 },
});
