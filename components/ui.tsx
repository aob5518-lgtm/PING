import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

export function Avatar({ label, size = 48 }: { label: string; size?: number }) {
  const palette = ['#DCE7E1', '#E7E0D4', '#DEE3EB', '#E9DDDD'];
  const color = palette[label.charCodeAt(0) % palette.length];
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}><Text style={[styles.avatarText, { fontSize: size * .3 }]}>{label.slice(0, 2).toUpperCase()}</Text></View>;
}

export function PrimaryButton({ title, onPress, disabled, icon }: { title: string; onPress: () => void; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primary, disabled && styles.disabled, pressed && !disabled && { opacity: .86 }]}>
    {icon && <Ionicons name={icon} size={18} color="white" />}<Text style={styles.primaryText}>{title}</Text>
  </Pressable>;
}

export function SecondaryButton({ title, onPress, icon }: { title: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.secondaryButton, pressed && { backgroundColor: colors.line }]}>
    {icon && <Ionicons name={icon} size={18} color={colors.text} />}<Text style={styles.secondaryButtonText}>{title}</Text>
  </Pressable>;
}

export function SearchField(props: TextInputProps) {
  return <View style={styles.search}><Ionicons name="search" size={19} color={colors.secondary} /><TextInput {...props} placeholderTextColor={colors.muted} style={styles.searchInput} /></View>;
}

export function Field({ label, hint, ...props }: TextInputProps & { label: string; hint?: string }) {
  return <View style={{ gap: 7 }}><Text style={styles.label}>{label}</Text><TextInput {...props} placeholderTextColor={colors.muted} style={[styles.input, props.multiline && { height: 96, textAlignVertical: 'top' }]} />{hint && <Text style={styles.hint}>{hint}</Text>}</View>;
}

export function Chip({ text, selected, onPress }: { text: string; selected?: boolean; onPress?: () => void }) {
  return <Pressable disabled={!onPress} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{text}</Text></Pressable>;
}

export function IconButton({ name, onPress, style }: { name: keyof typeof Ionicons.glyphMap; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.iconButton, style, pressed && { backgroundColor: colors.line }]}><Ionicons name={name} size={22} color={colors.text} /></Pressable>;
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.accentDark, fontWeight: '700', letterSpacing: -.4 },
  primary: { minHeight: 52, paddingHorizontal: 22, borderRadius: radius.md, backgroundColor: colors.accent, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: .36 }, primaryText: { color: 'white', fontSize: 16, fontWeight: '700' },
  secondaryButton: { minHeight: 50, paddingHorizontal: 18, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  search: { height: 48, borderRadius: radius.md, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.line },
  searchInput: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 0 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  input: { minHeight: 50, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md, color: colors.text, fontSize: 16 },
  hint: { color: colors.secondary, fontSize: 12, lineHeight: 17 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.warm },
  chipSelected: { backgroundColor: colors.accent }, chipText: { color: colors.text, fontSize: 13, fontWeight: '500' }, chipTextSelected: { color: 'white' },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
