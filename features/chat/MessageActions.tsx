import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, ThemeColors } from '@/constants/theme';
import { useTheme } from '@/features/theme-context';
import { Message } from '@/types';

export type MessageAction = 'Reply' | 'Copy' | 'Translate' | 'AI Reply';
const actions: { label: MessageAction; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Reply', icon: 'return-up-back-outline' }, { label: 'Copy', icon: 'copy-outline' },
  { label: 'Translate', icon: 'language-outline' }, { label: 'AI Reply', icon: 'sparkles-outline' },
];

export function MessageActions({ message, onClose, onAction }: { message: Message | null; onClose: () => void; onAction: (action: MessageAction) => void }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Modal visible={!!message} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close message actions" style={styles.overlay} onPress={onClose}>
      <View style={styles.menu}>{actions.map(({ label, icon }, index) => <Pressable accessibilityRole="button" accessibilityLabel={label} key={label} onPress={() => onAction(label)} style={[styles.row, index === actions.length - 1 && styles.last]}><Ionicons name={icon} size={19} color={colors.text} /><Text style={styles.text}>{label}</Text></Pressable>)}</View>
    </Pressable>
  </Modal>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 40 },
  menu: { width: '100%', maxWidth: 310, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 51, borderBottomWidth: 1, borderBottomColor: colors.line }, last: { borderBottomWidth: 0 }, text: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
