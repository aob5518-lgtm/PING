import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { radius, spacing, ThemeColors } from '@/constants/theme';
import { useTheme } from '@/features/theme-context';

export function Avatar({ label, size = 48 }: { label: string; size?: number }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}><Text style={[styles.avatarText, { fontSize: size * .3 }]}>{label.slice(0, 2).toUpperCase()}</Text></View>;
}

export function PrimaryButton({ title, onPress, disabled, icon }: { title: string; onPress: () => void; disabled?: boolean; icon?: keyof typeof Ionicons.glyphMap }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primary, disabled && styles.disabled, pressed && !disabled && { opacity: .78 }]}>
    {icon && <Ionicons name={icon} size={18} color={colors.inverseText} />}<Text style={styles.primaryText}>{title}</Text>
  </Pressable>;
}

export function SecondaryButton({ title, onPress, icon }: { title: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={({ pressed }) => [styles.secondaryButton, pressed && { backgroundColor: colors.soft }]}>
    {icon && <Ionicons name={icon} size={18} color={colors.text} />}<Text style={styles.secondaryButtonText}>{title}</Text>
  </Pressable>;
}

export function SearchField(props: TextInputProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={styles.search}><Ionicons name="search" size={19} color={colors.secondary} /><TextInput accessibilityLabel={props.accessibilityLabel ?? props.placeholder} {...props} placeholderTextColor={colors.muted} style={styles.searchInput} /></View>;
}

export function Field({ label, hint, ...props }: TextInputProps & { label: string; hint?: string }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <View style={{ gap: 7 }}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={props.accessibilityLabel ?? label} {...props} placeholderTextColor={colors.muted} style={[styles.input, props.multiline && { height: 96, textAlignVertical: 'top' }]} />{hint && <Text style={styles.hint}>{hint}</Text>}</View>;
}

export function Chip({ text, selected, onPress }: { text: string; selected?: boolean; onPress?: () => void }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={onPress ? text : undefined} disabled={!onPress} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{text}</Text></Pressable>;
}

export function IconButton({ name, onPress, accessibilityLabel, style }: { name: keyof typeof Ionicons.glyphMap; onPress: () => void; accessibilityLabel: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.iconButton, style, pressed && { backgroundColor: colors.soft }]}><Ionicons name={name} size={22} color={colors.text} /></Pressable>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  avatar: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line },
  avatarText: { color: colors.text, fontWeight: '700', letterSpacing: -.4 },
  primary: { minHeight: 52, paddingHorizontal: 22, borderRadius: radius.md, backgroundColor: colors.text, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  disabled: { backgroundColor: colors.disabled }, primaryText: { color: colors.inverseText, fontSize: 16, fontWeight: '700' },
  secondaryButton: { minHeight: 50, paddingHorizontal: 18, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  search: { height: 48, borderRadius: radius.md, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.line },
  searchInput: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 0 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600' },
  input: { minHeight: 50, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: spacing.md, color: colors.text, fontSize: 16 },
  hint: { color: colors.secondary, fontSize: 12, lineHeight: 17 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line },
  chipSelected: { backgroundColor: colors.text }, chipText: { color: colors.text, fontSize: 13, fontWeight: '500' }, chipTextSelected: { color: colors.inverseText },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
