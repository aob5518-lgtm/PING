import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, ThemeColors } from '@/constants/theme';
import { useTheme } from '@/features/theme-context';
import { TranslationKey, useI18n } from '@/features/i18n-context';
import { Message } from '@/types';

export type MessageAction = 'reply' | 'copy' | 'suggest';
const actions: { action: MessageAction; label: TranslationKey; icon: keyof typeof Ionicons.glyphMap }[] = [
  { action: 'reply', label: 'chat.reply', icon: 'return-up-back-outline' }, { action: 'copy', label: 'chat.copy', icon: 'copy-outline' }, { action: 'suggest', label: 'chat.aiReply', icon: 'sparkles-outline' },
];

export function MessageActions({ message, onClose, onAction }: { message: Message | null; onClose: () => void; onAction: (action: MessageAction) => void }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  return <Modal visible={!!message} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable accessibilityRole="button" accessibilityLabel={t('chat.closeActions')} style={styles.overlay} onPress={onClose}>
      <View style={styles.menu}>{actions.map(({ action, label, icon }, index) => <Pressable accessibilityRole="button" accessibilityLabel={t(label)} key={action} onPress={() => onAction(action)} style={[styles.row, index === actions.length - 1 && styles.last]}><Ionicons name={icon} size={19} color={colors.text} /><Text style={styles.text}>{t(label)}</Text></Pressable>)}</View>
    </Pressable>
  </Modal>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 40 },
  menu: { width: '100%', maxWidth: 310, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 51, borderBottomWidth: 1, borderBottomColor: colors.line }, last: { borderBottomWidth: 0 }, text: { color: colors.text, fontSize: 15, fontWeight: '600' },
});
