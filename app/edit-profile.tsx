import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Field, PrimaryButton } from '@/components/ui';
import { spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';

const splitList = (value: string) => value.split(/[,，]/).map(item => item.trim()).filter(Boolean);

export default function EditProfileScreen() {
  const { currentUser, people, updateProfile } = useApp();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  const [name, setName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio);
  const [interests, setInterests] = useState(currentUser.interests.join(', '));
  const [lookingFor, setLookingFor] = useState(currentUser.lookingFor.join(', '));
  const [error, setError] = useState('');
  const save = () => {
    const cleanUsername = username.replace(/^@/, '').trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) return setError(t('edit.invalidUsername'));
    if (people.some(user => user.username === cleanUsername)) return setError(t('edit.usernameTaken'));
    if (!name.trim()) return;
    updateProfile({ displayName: name.trim(), username: cleanUsername, bio: bio.trim(), avatar: name.trim().slice(0, 2), interests: splitList(interests), lookingFor: splitList(lookingFor) });
    router.back();
  };
  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.avatar}><Avatar label={name || 'P'} size={94} /></View>
      <Field label={t('identityCreate.displayName')} value={name} onChangeText={setName} maxLength={40} />
      <Field label={t('identityCreate.username')} value={username} onChangeText={value => { setUsername(value); setError(''); }} autoCapitalize="none" autoCorrect={false} hint={t('identityCreate.usernameHint')} />
      <Field label={t('edit.bio')} value={bio} onChangeText={setBio} multiline maxLength={140} hint={`${bio.length}/140`} />
      <Field label={t('edit.interests')} value={interests} onChangeText={setInterests} hint={t('edit.interestsHint')} />
      <Field label={t('edit.lookingFor')} value={lookingFor} onChangeText={setLookingFor} hint={t('edit.interestsHint')} />
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    </ScrollView>
    <View style={styles.footer}><PrimaryButton title={t('edit.save')} onPress={save} disabled={!name.trim()} /></View>
  </KeyboardAvoidingView>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: 23 }, avatar: { alignItems: 'center' },
  error: { color: colors.text, fontSize: 13, fontWeight: '600' }, footer: { padding: spacing.lg, paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
});
