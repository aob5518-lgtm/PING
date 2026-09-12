import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/features/app-context';

export default function IdentityWalletScreen() {
  const { currentUser } = useApp();
  const [advanced, setAdvanced] = useState(false);
  const [notice, setNotice] = useState('');
  const flash = (text: string) => { setNotice(text); setTimeout(() => setNotice(''), 1800); };
  const copy = async () => { await Clipboard.setStringAsync('0x76fA4be903aa8d3B291'); flash('Address copied'); };
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.notice}><Ionicons name="eye-off-outline" size={21} color={colors.accent} /><Text style={styles.noticeText}>These details stay out of the way during everyday use. They are shown here only for advanced identity management.</Text></View>
        <Card title="Identity">
          <Detail label="Milo ID" value={`@${currentUser.username}`} />
          <Detail label="DID" value="did:milo:7bd82…" mono />
        </Card>
        <Card title="Wallet">
          <Detail label="Address" value="0x76f…291" mono />
          <Pressable style={styles.button} onPress={copy}><Ionicons name="copy-outline" size={18} color={colors.accent} /><Text style={styles.buttonText}>Copy Address</Text></Pressable>
        </Card>
        <View style={styles.actionCard}>
          <Action label="Export Identity" onPress={() => flash('Export is coming soon')} />
          <Action label="Import Wallet" onPress={() => flash('Wallet import is coming soon')} last />
        </View>
        <Pressable style={styles.advancedHeader} onPress={() => setAdvanced(value => !value)}><View><Text style={styles.advancedTitle}>Advanced</Text><Text style={styles.advancedSub}>Technical identity controls</Text></View><Ionicons name={advanced ? 'chevron-up' : 'chevron-down'} size={20} color={colors.secondary} /></Pressable>
        {advanced && <View style={styles.advanced}><AdvancedRow label="Private Key" onPress={() => flash('Coming soon')} /><AdvancedRow label="Recovery Phrase" onPress={() => flash('Coming soon')} /><AdvancedRow label="Signing" onPress={() => flash('Coming soon')} /></View>}
        <Text style={styles.warning}>Milo never asks you to share a private key or recovery phrase in a conversation.</Text>
      </ScrollView>
      {!!notice && <View style={styles.toast}><Text style={styles.toastText}>{notice}</Text></View>}
    </View>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text>{children}</View>; }
function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) { return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={[styles.detailValue, mono && { fontFamily: 'monospace' }]}>{value}</Text></View>; }
function Action({ label, onPress, last }: { label: string; onPress: () => void; last?: boolean }) { return <Pressable style={[styles.action, last && { borderBottomWidth: 0 }]} onPress={onPress}><Text style={styles.actionText}>{label}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>; }
function AdvancedRow({ label, onPress }: { label: string; onPress: () => void }) { return <Pressable style={styles.advancedRow} onPress={onPress}><Ionicons name="lock-closed-outline" size={17} color={colors.secondary} /><Text style={styles.advancedRowText}>{label}</Text><Text style={styles.coming}>Coming soon</Text></Pressable>; }
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: 18, paddingBottom: 50 },
  notice: { flexDirection: 'row', gap: 12, backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: 15 }, noticeText: { flex: 1, color: colors.accentDark, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 17, gap: 15 }, cardTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  detail: { gap: 4 }, detailLabel: { color: colors.secondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: .6, fontWeight: '700' }, detailValue: { color: colors.text, fontSize: 15 },
  button: { minHeight: 46, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, buttonText: { color: colors.accent, fontWeight: '700' },
  actionCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16 }, action: { height: 54, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line }, actionText: { flex: 1, color: colors.text, fontWeight: '600' },
  advancedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 3 }, advancedTitle: { color: colors.text, fontSize: 16, fontWeight: '700' }, advancedSub: { color: colors.secondary, fontSize: 12, marginTop: 3 },
  advanced: { backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 15 }, advancedRow: { flexDirection: 'row', alignItems: 'center', gap: 9, minHeight: 48, borderBottomWidth: 1, borderBottomColor: colors.line }, advancedRowText: { flex: 1, color: colors.text, fontSize: 14 }, coming: { color: colors.muted, fontSize: 11 },
  warning: { color: colors.secondary, textAlign: 'center', fontSize: 12, lineHeight: 18, paddingHorizontal: 14 }, toast: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: colors.text, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 10 }, toastText: { color: 'white', fontSize: 12, fontWeight: '600' },
});
