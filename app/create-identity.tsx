import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Field, PrimaryButton } from '@/components/ui';
import { spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';

export default function CreateIdentityScreen() {
  const { createIdentity } = useApp();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const cleanUsername = username.replace(/^@/, '').toLowerCase();
  const usernameValid = /^[a-z0-9_]{3,20}$/.test(cleanUsername);
  const valid = name.trim().length > 0 && usernameValid;
  const finish = () => {
    setSubmitted(true);
    if (!valid) return;
    createIdentity(name.trim(), cleanUsername);
    router.replace({ pathname: '/(tabs)/chats', params: { created: '1' } });
  };
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View><Text style={styles.step}>{t('identityCreate.eyebrow')}</Text><Text style={styles.title}>{t('identityCreate.title')}</Text><Text style={styles.subtitle}>{t('identityCreate.subtitle')}</Text></View>
        <View style={styles.avatarWrap}>
          <Avatar label={name || 'P'} size={92} />
        </View>
        <View style={styles.form}>
          <Field label={t('identityCreate.displayName')} placeholder={t('identityCreate.namePlaceholder')} value={name} onChangeText={setName} autoCapitalize="words" />
          <Field label={t('identityCreate.username')} placeholder={t('identityCreate.usernamePlaceholder')} value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} hint={t('identityCreate.usernameHint')} />
          {submitted && !valid && <Text style={styles.error}>{t('identityCreate.error')}</Text>}
        </View>
      </ScrollView>
      <View style={styles.footer}><PrimaryButton title={t('welcome.create')} onPress={finish} /></View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, paddingTop: 90, gap: 32 },
  step: { color: colors.secondary, fontWeight: '700', letterSpacing: 1.2, fontSize: 12, marginBottom: 12 },
  title: { fontSize: 36, lineHeight: 42, fontWeight: '800', letterSpacing: -1.2, color: colors.text },
  subtitle: { marginTop: 10, color: colors.secondary, fontSize: 16 },
  avatarWrap: { alignItems: 'center', gap: 10 }, form: { gap: 20 }, error: { color: colors.text, fontSize: 13, fontWeight: '600' },
  footer: { padding: spacing.lg, paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
});
