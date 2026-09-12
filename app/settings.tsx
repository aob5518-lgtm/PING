import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, ThemeColors, ThemePreference } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { LanguagePreference, useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';

export default function SettingsScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const { currentUser, privacy, setPrivacy, blockedUserIds } = useApp();
  const { colors, preference: themePreference, setPreference: setThemePreference } = useTheme();
  const { t, preference: languagePreference, setPreference: setLanguagePreference } = useI18n();
  const styles = createStyles(colors);
  const privacyY = useRef(0);
  const scroll = useRef<ScrollView>(null);
  useEffect(() => { if (section === 'privacy') setTimeout(() => scroll.current?.scrollTo({ y: privacyY.current, animated: true }), 100); }, [section]);

  return <View style={styles.screen}><ScrollView ref={scroll} contentContainerStyle={styles.content}>
    <Section title={t('settings.account')}>
      <Row icon="person-outline" label={t('me.editProfile')} onPress={() => router.push('/edit-profile')} />
      <Row icon="at-outline" label={t('settings.username')} value={`@${currentUser.username}`} onPress={() => router.push('/edit-profile')} last />
    </Section>
    <View onLayout={event => { privacyY.current = event.nativeEvent.layout.y; }}><Section title={t('settings.privacy')}>
      <ToggleRow icon="mail-unread-outline" label={t('settings.messageRequests')} value={privacy.messageRequests} onValueChange={value => setPrivacy({ messageRequests: value })} />
      <Row icon="ban-outline" label={t('settings.blockedUsers')} value={String(blockedUserIds.length)} onPress={() => router.push('/blocked-users')} />
      <ToggleRow icon="checkmark-done-outline" label={t('settings.readReceipts')} value={privacy.readReceipts} onValueChange={value => setPrivacy({ readReceipts: value })} last />
    </Section></View>
    <Section title={t('settings.identity')}><Row icon="finger-print-outline" label={t('me.identity')} onPress={() => router.push('/identity-wallet')} last /></Section>
    <Section title={t('settings.appearance')}><ChoiceRow values={(['light', 'dark', 'system'] as ThemePreference[])} selected={themePreference} label={value => value === 'light' ? t('settings.light') : value === 'dark' ? t('settings.dark') : t('settings.system')} accessibilityLabel={value => t('settings.useAppearance', { name: value === 'light' ? t('settings.light') : value === 'dark' ? t('settings.dark') : t('settings.system') })} onSelect={setThemePreference} /></Section>
    <Section title={t('settings.app')}>
      <View style={styles.languageLabel}><Ionicons name="language-outline" size={20} color={colors.text} /><Text style={styles.label}>{t('settings.language')}</Text></View>
      <ChoiceRow values={(['system', 'en', 'zh-CN'] as LanguagePreference[])} selected={languagePreference} label={value => value === 'system' ? t('settings.system') : value === 'en' ? t('settings.english') : t('settings.chinese')} accessibilityLabel={value => t('settings.useLanguage', { name: value === 'system' ? t('settings.system') : value === 'en' ? t('settings.english') : t('settings.chinese') })} onSelect={setLanguagePreference} />
      <InfoRow icon="information-circle-outline" label={t('settings.about')} value="0.1" />
    </Section>
  </ScrollView></View>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { const { colors } = useTheme(); const styles = createStyles(colors); return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.card}>{children}</View></View>; }
function Row({ icon, label, value, onPress, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; onPress: () => void; last?: boolean }) { const { colors } = useTheme(); const styles = createStyles(colors); return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.row, last && styles.last]}><Ionicons name={icon} size={20} color={colors.text} /><Text style={styles.label}>{label}</Text>{value && <Text style={styles.value}>{value}</Text>}<Ionicons name="chevron-forward" size={17} color={colors.muted} /></Pressable>; }
function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) { const { colors } = useTheme(); const styles = createStyles(colors); return <View style={[styles.row, styles.last]}><Ionicons name={icon} size={20} color={colors.text} /><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>; }
function ToggleRow({ icon, label, value, onValueChange, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: boolean; onValueChange: (value: boolean) => void; last?: boolean }) { const { colors } = useTheme(); const styles = createStyles(colors); return <View style={[styles.row, last && styles.last]}><Ionicons name={icon} size={20} color={colors.text} /><Text style={styles.label}>{label}</Text><Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value }} onPress={() => onValueChange(!value)} style={[styles.toggle, value && styles.toggleOn]}><View style={[styles.toggleThumb, value && styles.toggleThumbOn]} /></Pressable></View>; }
function ChoiceRow<T extends string>({ values, selected, label, accessibilityLabel, onSelect }: { values: T[]; selected: T; label: (value: T) => string; accessibilityLabel: (value: T) => string; onSelect: (value: T) => void }) { const { colors } = useTheme(); const styles = createStyles(colors); return <View style={styles.options}>{values.map(value => <Pressable key={value} accessibilityRole="button" accessibilityLabel={accessibilityLabel(value)} accessibilityState={{ selected: selected === value }} onPress={() => onSelect(value)} style={[styles.option, selected === value && styles.optionSelected]}><Text style={[styles.optionText, selected === value && styles.optionTextSelected]}>{label(value)}</Text></Pressable>)}</View>; }

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: 26, paddingBottom: 50 }, section: { gap: 9 }, sectionTitle: { color: colors.secondary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: .8, marginLeft: 4 }, card: { borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, last: { borderBottomWidth: 0 }, label: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' }, value: { color: colors.secondary, fontSize: 13 }, languageLabel: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
  options: { flexDirection: 'row', gap: 8, paddingVertical: 12 }, option: { flex: 1, minHeight: 46, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }, optionSelected: { backgroundColor: colors.text, borderColor: colors.text }, optionText: { color: colors.text, fontSize: 12, fontWeight: '600', textAlign: 'center' }, optionTextSelected: { color: colors.inverseText },
  toggle: { width: 46, height: 26, borderRadius: 13, padding: 3, justifyContent: 'center', backgroundColor: colors.line }, toggleOn: { backgroundColor: colors.text }, toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.surface }, toggleThumbOn: { alignSelf: 'flex-end', backgroundColor: colors.inverseText },
});
