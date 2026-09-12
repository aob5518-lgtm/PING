import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Field, PrimaryButton } from '@/components/ui';
import { spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/features/theme-context';

export default function EditProfileScreen() {
  const { currentUser, updateProfile } = useApp();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [name, setName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const save = () => { if (!name.trim()) return; updateProfile({ displayName: name.trim(), bio: bio.trim(), avatar: name.trim().slice(0, 2) }); router.back(); };
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.avatar}><Avatar label={name || 'P'} size={94} /><View style={styles.camera}><Ionicons name="camera-outline" size={17} color={colors.inverseText} /></View><Text style={styles.help}>Tap support will be added with real photo uploads.</Text></View>
        <Field label="Display name" value={name} onChangeText={setName} maxLength={40} />
        <Field label="Bio" value={bio} onChangeText={setBio} multiline maxLength={140} hint={`${bio.length}/140`} />
        <View style={styles.username}><Text style={styles.usernameLabel}>Ping ID</Text><Text style={styles.usernameValue}>@{currentUser.username}</Text><Text style={styles.help}>Your username is managed separately.</Text></View>
      </ScrollView>
      <View style={styles.footer}><PrimaryButton title="Save Changes" onPress={save} disabled={!name.trim()} /></View>
    </KeyboardAvoidingView>
  );
}
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: 23 }, avatar: { alignItems: 'center', gap: 9 },
  camera: { width: 31, height: 31, borderRadius: 16, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center', marginTop: -34, marginLeft: 67, borderWidth: 3, borderColor: colors.background },
  help: { color: colors.secondary, fontSize: 12, lineHeight: 17 }, username: { gap: 7 }, usernameLabel: { color: colors.text, fontWeight: '600', fontSize: 14 }, usernameValue: { color: colors.secondary, fontSize: 16 },
  footer: { padding: spacing.lg, paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
});
