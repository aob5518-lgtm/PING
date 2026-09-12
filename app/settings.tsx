import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, ThemeColors, ThemePreference } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/features/theme-context';

export default function SettingsScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const { currentUser } = useApp();
  const { colors, preference, setPreference } = useTheme();
  const styles = createStyles(colors);
  const privacyY = useRef(0);
  const scroll = useRef<ScrollView>(null);
  const [requests, setRequests] = useState(true);
  const [receipts, setReceipts] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (section === 'privacy') setTimeout(() => scroll.current?.scrollTo({ y: privacyY.current, animated: true }), 100);
  }, [section]);
  const soon = (text: string) => { setNotice(text); setTimeout(() => setNotice(''), 1800); };

  return (
    <View style={styles.screen}>
      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        <Section title="Account">
          <Row icon="person-outline" label="Edit Profile" onPress={() => router.push('/edit-profile')} />
          <Row icon="at-outline" label="Username" value={`@${currentUser.username}`} onPress={() => router.push('/edit-profile')} last />
        </Section>
        <View onLayout={event => { privacyY.current = event.nativeEvent.layout.y; }}>
          <Section title="Privacy">
            <ToggleRow icon="mail-unread-outline" label="Message Requests" value={requests} onValueChange={setRequests} />
            <Row icon="ban-outline" label="Blocked Users" value="0" onPress={() => soon('No blocked users')} />
            <ToggleRow icon="checkmark-done-outline" label="Read Receipts" value={receipts} onValueChange={setReceipts} last />
          </Section>
        </View>
        <Section title="Identity">
          <Row icon="finger-print-outline" label="Identity" onPress={() => router.push('/identity-wallet')} />
          <Row icon="cloud-upload-outline" label="Backup Identity" onPress={() => soon('Backup is coming next sprint')} last />
        </Section>
        <Section title="Appearance">
          <View style={styles.themeOptions}>
            {(['light', 'dark', 'system'] as ThemePreference[]).map(option => (
              <Pressable key={option} accessibilityRole="button" accessibilityLabel={`Use ${option} appearance`} accessibilityState={{ selected: preference === option }} onPress={() => setPreference(option)} style={[styles.themeOption, preference === option && styles.themeOptionSelected]}>
                <Ionicons name={option === 'light' ? 'sunny-outline' : option === 'dark' ? 'moon-outline' : 'phone-portrait-outline'} size={18} color={preference === option ? colors.inverseText : colors.text} />
                <Text style={[styles.themeOptionText, preference === option && styles.themeOptionTextSelected]}>{option[0].toUpperCase() + option.slice(1)}</Text>
              </Pressable>
            ))}
          </View>
        </Section>
        <Section title="App">
          <Row icon="language-outline" label="Language" value="English" onPress={() => soon('More languages are coming soon')} />
          <Row icon="information-circle-outline" label="About Ping" value="0.1" onPress={() => soon('Make human connection simple.')} last />
        </Section>
      </ScrollView>
      {!!notice && <View style={styles.toast}><Text style={styles.toastText}>{notice}</Text></View>}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.card}>{children}</View></View>;
}

function Row({ icon, label, value, onPress, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; onPress: () => void; last?: boolean }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.row, last && { borderBottomWidth: 0 }]}><Ionicons name={icon} size={20} color={colors.text} /><Text style={styles.label}>{label}</Text>{value && <Text style={styles.value}>{value}</Text>}<Ionicons name="chevron-forward" size={17} color={colors.muted} /></Pressable>;
}

function ToggleRow({ icon, label, value, onValueChange, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: boolean; onValueChange: (value: boolean) => void; last?: boolean }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={[styles.row, last && { borderBottomWidth: 0 }]}><Ionicons name={icon} size={20} color={colors.text} /><Text style={styles.label}>{label}</Text><Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value }} onPress={() => onValueChange(!value)} style={[styles.toggle, value && styles.toggleOn]}><View style={[styles.toggleThumb, value && styles.toggleThumbOn]} /></Pressable></View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: 26, paddingBottom: 50 },
  section: { gap: 9 }, sectionTitle: { color: colors.secondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: .8, marginLeft: 4 },
  card: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, label: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' }, value: { color: colors.secondary, fontSize: 13 },
  themeOptions: { flexDirection: 'row', gap: 8, paddingVertical: 12 }, themeOption: { flex: 1, minHeight: 46, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', gap: 4 }, themeOptionSelected: { backgroundColor: colors.text, borderColor: colors.text },
  themeOptionText: { color: colors.text, fontSize: 12, fontWeight: '600' }, themeOptionTextSelected: { color: colors.inverseText },
  toggle: { width: 46, height: 26, borderRadius: 13, padding: 3, justifyContent: 'center', backgroundColor: colors.line }, toggleOn: { backgroundColor: colors.text }, toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface }, toggleThumbOn: { alignSelf: 'flex-end', backgroundColor: colors.inverseText },
  toast: { position: 'absolute', bottom: 30, alignSelf: 'center', borderRadius: radius.pill, backgroundColor: colors.text, paddingHorizontal: 18, paddingVertical: 11 }, toastText: { color: colors.inverseText, fontSize: 12, fontWeight: '600' },
});
