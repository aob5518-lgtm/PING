import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Field, PrimaryButton, SearchField } from '@/components/ui';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useApp } from '@/features/app-context';
import { useTheme } from '@/features/theme-context';

export default function CreateGroupScreen() {
  const { people, createGroup } = useApp();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const filtered = useMemo(() => people.filter(person => `${person.displayName} ${person.username} ${person.interests.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [people, query]);
  const toggle = (id: string) => setSelected(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);
  const finish = () => {
    if (!name.trim() || selected.length === 0) return;
    const id = createGroup(name.trim(), selected);
    router.dismiss();
    setTimeout(() => router.push({ pathname: '/chat/[id]', params: { id } }), 50);
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.progress}><View style={styles.progressTrack}><View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} /></View><Text style={styles.progressText}>Step {step} of 2</Text></View>
      {step === 1 ? <>
        <View style={styles.heading}><Text style={styles.title}>Who’s in?</Text><Text style={styles.subtitle}>Choose at least one person. You’ll be the owner.</Text></View>
        <View style={styles.search}><SearchField placeholder="Search people" value={query} onChangeText={setQuery} /></View>
        {selected.length > 0 && <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selected}>{selected.map(id => { const user = people.find(person => person.id === id)!; return <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${user.displayName}`} key={id} style={styles.selectedPerson} onPress={() => toggle(id)}><Avatar label={user.avatar} size={44} /><View style={styles.remove}><Ionicons name="close" size={11} color={colors.inverseText} /></View><Text numberOfLines={1} style={styles.selectedName}>{user.displayName.split(' ')[0]}</Text></Pressable>; })}</ScrollView>}
        <ScrollView contentContainerStyle={styles.people}>{filtered.map(person => {
          const active = selected.includes(person.id);
          return <Pressable accessibilityRole="checkbox" accessibilityLabel={`Select ${person.displayName}`} accessibilityState={{ checked: active }} key={person.id} onPress={() => toggle(person.id)} style={styles.person}><Avatar label={person.avatar} size={50} /><View style={styles.personMain}><Text style={styles.personName}>{person.displayName}</Text><Text style={styles.personMeta}>@{person.username} · {person.interests[0]}</Text></View><View style={[styles.check, active && styles.checkActive]}>{active && <Ionicons name="checkmark" size={17} color={colors.inverseText} />}</View></Pressable>;
        })}</ScrollView>
        <View style={styles.footer}><PrimaryButton title={selected.length ? `Continue · ${selected.length} selected` : 'Select people'} onPress={() => setStep(2)} disabled={selected.length === 0} /></View>
      </> : <>
        <ScrollView contentContainerStyle={styles.details} keyboardShouldPersistTaps="handled">
          <Pressable accessibilityRole="button" accessibilityLabel="Change group members" style={styles.backStep} onPress={() => setStep(1)}><Ionicons name="arrow-back" size={18} color={colors.text} /><Text style={styles.backText}>Change members</Text></Pressable>
          <View><Text style={styles.title}>Name this group.</Text><Text style={styles.subtitle}>Keep it clear and easy to recognize.</Text></View>
          <View style={styles.groupAvatar}><View style={styles.groupCircle}><Text style={styles.groupInitials}>{name.trim().slice(0, 2).toUpperCase() || 'MG'}</Text></View><Text style={styles.photoHint}>Group avatar is optional</Text></View>
          <Field label="Group name" placeholder="Weekend builders" value={name} onChangeText={setName} maxLength={48} autoFocus />
          <View style={styles.membersCard}><View style={styles.membersHead}><Text style={styles.membersTitle}>Members</Text><Text style={styles.membersCount}>{selected.length + 1}</Text></View><View style={styles.ownerRow}><Avatar label="A" size={36} /><Text style={styles.ownerName}>You</Text><Text style={styles.role}>Owner</Text></View>{selected.map(id => { const user = people.find(person => person.id === id)!; return <View key={id} style={styles.ownerRow}><Avatar label={user.avatar} size={36} /><Text style={styles.ownerName}>{user.displayName}</Text><Text style={styles.role}>Member</Text></View>; })}</View>
        </ScrollView>
        <View style={styles.footer}><PrimaryButton title="Create Group" onPress={finish} disabled={!name.trim()} /></View>
      </>}
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, progress: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingTop: 10 }, progressTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line }, progressFill: { height: 4, borderRadius: 2, backgroundColor: colors.text }, progressText: { color: colors.secondary, fontSize: 11 },
  heading: { paddingHorizontal: spacing.lg, paddingTop: 24, paddingBottom: 18 }, title: { color: colors.text, fontSize: 29, fontWeight: '800', letterSpacing: -.8 }, subtitle: { color: colors.secondary, fontSize: 14, lineHeight: 20, marginTop: 7 },
  search: { paddingHorizontal: spacing.lg, paddingBottom: 7 }, selected: { paddingHorizontal: spacing.lg, paddingVertical: 11, gap: 14 }, selectedPerson: { alignItems: 'center', width: 52 }, selectedName: { color: colors.secondary, fontSize: 11, marginTop: 5, width: 58, textAlign: 'center' }, remove: { position: 'absolute', top: -2, right: 1, width: 17, height: 17, borderRadius: 9, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background },
  people: { paddingHorizontal: spacing.lg, paddingBottom: 110 }, person: { minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 13, borderBottomWidth: 1, borderBottomColor: colors.line }, personMain: { flex: 1, gap: 4 }, personName: { color: colors.text, fontSize: 15, fontWeight: '600' }, personMeta: { color: colors.secondary, fontSize: 12 },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center' }, checkActive: { backgroundColor: colors.text, borderColor: colors.text },
  footer: { padding: spacing.lg, paddingBottom: 20, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface }, details: { padding: spacing.lg, gap: 26, paddingBottom: 30 }, backStep: { flexDirection: 'row', alignItems: 'center', gap: 7 }, backText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  groupAvatar: { alignItems: 'center', gap: 9 }, groupCircle: { width: 88, height: 88, borderRadius: 28, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, groupInitials: { color: colors.text, fontSize: 26, fontWeight: '800' }, photoHint: { color: colors.secondary, fontSize: 12 },
  membersCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: 16 }, membersHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }, membersTitle: { color: colors.text, fontSize: 16, fontWeight: '700' }, membersCount: { color: colors.secondary, fontSize: 13 },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, borderTopWidth: 1, borderTopColor: colors.line }, ownerName: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '600' }, role: { color: colors.secondary, fontSize: 11, backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5 },
});
