import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Avatar, Chip, PrimaryButton } from '@/components/ui';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';

export default function MyProfileScreen() {
  const { currentUser } = useApp();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  const [qr, setQr] = useState(false);
  const profileLink = `ping://user/${encodeURIComponent(currentUser.username)}`;
  return <SafeAreaView style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.top}><Text style={styles.title}>{t('tabs.me')}</Text><Pressable accessibilityRole="button" accessibilityLabel={t('me.settings')} onPress={() => router.push('/settings')}><Ionicons name="settings-outline" size={24} color={colors.text} /></Pressable></View>
      <View style={styles.profile}>
        <Avatar label={currentUser.avatar} size={88} />
        <View style={styles.identity}><Text style={styles.name}>{currentUser.displayName}</Text><Text style={styles.username}>@{currentUser.username}</Text></View>
        <Text style={styles.bio}>{currentUser.bio}</Text>
        <View style={styles.chips}>{currentUser.interests.map(item => <Chip key={item} text={item} />)}</View>
      </View>
      <View style={styles.actions}>
        <Action icon="create-outline" label={t('me.editProfile')} onPress={() => router.push('/edit-profile')} />
        <Action icon="qr-code-outline" label={t('me.qr')} onPress={() => setQr(true)} />
        <Action icon="finger-print-outline" label={t('me.identity')} onPress={() => router.push('/identity-wallet')} />
        <Action icon="shield-checkmark-outline" label={t('me.privacy')} onPress={() => router.push({ pathname: '/settings', params: { section: 'privacy' } })} />
        <Action icon="settings-outline" label={t('me.settingsRow')} onPress={() => router.push('/settings')} last />
      </View>
      <Text style={styles.footer}>{t('me.footer')}</Text>
    </ScrollView>
    <Modal visible={qr} transparent animationType="fade" onRequestClose={() => setQr(false)}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('me.closeQr')} style={styles.overlay} onPress={() => setQr(false)}>
        <View style={styles.qrCard}><Text style={styles.qrTitle}>@{currentUser.username}</Text><View style={styles.qr}><QRCode value={profileLink} size={210} color="#000000" backgroundColor="#FFFFFF" /></View><Text style={styles.qrText}>{t('me.qrText')}</Text><PrimaryButton title={t('common.done')} onPress={() => setQr(false)} /></View>
      </Pressable>
    </Modal>
  </SafeAreaView>;
}

function Action({ icon, label, onPress, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; last?: boolean }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.action, last && { borderBottomWidth: 0 }]}><View style={styles.actionIcon}><Ionicons name={icon} size={20} color={colors.text} /></View><Text style={styles.actionLabel}>{label}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingBottom: 40 }, top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }, title: { fontSize: 34, fontWeight: '800', color: colors.text, letterSpacing: -1.2 },
  profile: { alignItems: 'center' }, identity: { alignItems: 'center', marginTop: 14, gap: 3 }, name: { fontSize: 24, fontWeight: '800', color: colors.text }, username: { color: colors.secondary, fontSize: 15 }, bio: { color: colors.text, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 14 }, chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 7, marginTop: 16 },
  actions: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, paddingHorizontal: 16, marginTop: 28 }, action: { minHeight: 61, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, actionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, actionLabel: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '600' }, footer: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 25 },
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 26 }, qrCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, width: '100%', maxWidth: 360, padding: 24, borderRadius: 20, alignItems: 'center', gap: 17 }, qrTitle: { fontSize: 20, fontWeight: '700', color: colors.text }, qrText: { color: colors.secondary, fontSize: 14, textAlign: 'center', lineHeight: 20 }, qr: { padding: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8D8D8' },
});
