import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Chip, PrimaryButton } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/features/app-context';

export default function MyProfileScreen() {
  const { currentUser } = useApp();
  const [qr, setQr] = useState(false);
  const [soon, setSoon] = useState(false);
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}><Text style={styles.title}>Me</Text><Pressable onPress={() => router.push('/settings')}><Ionicons name="settings-outline" size={24} color={colors.text} /></Pressable></View>
        <View style={styles.profile}>
          <Avatar label={currentUser.avatar} size={88} />
          <View style={styles.identity}><Text style={styles.name}>{currentUser.displayName}</Text><Text style={styles.username}>@{currentUser.username}</Text></View>
          <Text style={styles.bio}>{currentUser.bio}</Text>
          <View style={styles.chips}>{currentUser.interests.map(item => <Chip key={item} text={item} />)}</View>
        </View>
        <View style={styles.actions}>
          <Action icon="create-outline" label="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <Action icon="qr-code-outline" label="My QR Code" onPress={() => setQr(true)} />
          <Action icon="finger-print-outline" label="Identity & Wallet" onPress={() => router.push('/identity-wallet')} />
          <Action icon="shield-checkmark-outline" label="Privacy" onPress={() => router.push({ pathname: '/settings', params: { section: 'privacy' } })} />
          <Action icon="cloud-upload-outline" label="Backup Identity" onPress={() => setSoon(true)} />
          <Action icon="settings-outline" label="Settings" onPress={() => router.push('/settings')} last />
        </View>
        <Text style={styles.footer}>Milo 0.1 · Your identity belongs to you.</Text>
      </ScrollView>
      <Modal visible={qr} transparent animationType="fade" onRequestClose={() => setQr(false)}>
        <Pressable style={styles.overlay} onPress={() => setQr(false)}><View style={styles.qrCard}><Text style={styles.qrTitle}>@{currentUser.username}</Text><MockQR /><Text style={styles.qrText}>Let someone scan this to find you on Milo.</Text><PrimaryButton title="Done" onPress={() => setQr(false)} /></View></Pressable>
      </Modal>
      <Modal visible={soon} transparent animationType="fade" onRequestClose={() => setSoon(false)}>
        <Pressable style={styles.overlay} onPress={() => setSoon(false)}><View style={styles.qrCard}><Ionicons name="cloud-outline" size={32} color={colors.accent} /><Text style={styles.qrTitle}>Coming next sprint</Text><Text style={styles.qrText}>Secure identity backup is not enabled in this prototype.</Text><PrimaryButton title="Got it" onPress={() => setSoon(false)} /></View></Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function Action({ icon, label, onPress, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; last?: boolean }) {
  return <Pressable onPress={onPress} style={[styles.action, last && { borderBottomWidth: 0 }]}><View style={styles.actionIcon}><Ionicons name={icon} size={20} color={colors.accent} /></View><Text style={styles.actionLabel}>{label}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>;
}

function MockQR() {
  const pattern = [1,1,1,0,1,0,1,1,1, 1,0,1,1,0,0,1,0,1, 1,1,1,0,1,0,1,1,1, 0,0,0,1,0,1,0,0,0, 1,1,0,0,1,1,0,1,1, 0,1,1,1,0,0,1,0,0, 1,1,1,0,1,1,1,0,1, 1,0,1,1,0,0,1,1,0, 1,1,1,0,1,1,0,1,1];
  return <View style={styles.qr}>{pattern.map((on, index) => <View key={index} style={[styles.pixel, on === 1 && styles.pixelOn]} />)}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: 40 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }, title: { fontSize: 34, fontWeight: '800', color: colors.text, letterSpacing: -1.2 },
  profile: { alignItems: 'center' }, identity: { alignItems: 'center', marginTop: 14, gap: 3 }, name: { fontSize: 24, fontWeight: '800', color: colors.text }, username: { color: colors.secondary, fontSize: 15 },
  bio: { color: colors.text, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 14 }, chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7, marginTop: 16 },
  actions: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, paddingHorizontal: 16, marginTop: 28 },
  action: { minHeight: 61, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, actionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '600' }, footer: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 25 },
  overlay: { flex: 1, backgroundColor: '#00000045', alignItems: 'center', justifyContent: 'center', padding: 26 }, qrCard: { backgroundColor: colors.surface, width: '100%', maxWidth: 360, padding: 24, borderRadius: 20, alignItems: 'center', gap: 17 },
  qrTitle: { fontSize: 20, fontWeight: '700', color: colors.text }, qrText: { color: colors.secondary, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  qr: { width: 216, height: 216, padding: 18, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white', borderWidth: 1, borderColor: colors.line }, pixel: { width: 20, height: 20 }, pixelOn: { backgroundColor: colors.text },
});
