import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/features/theme-context';

export function AiReplySheet({ visible, suggestions, onClose, onSelect }: { visible: boolean; suggestions: string[]; onClose: () => void; onSelect: (value: string) => void }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <Pressable accessibilityRole="button" accessibilityLabel="Close suggested replies" style={styles.overlay} onPress={onClose}>
      <View style={styles.sheet}>
        <View style={styles.handle} /><View style={styles.titleRow}><Ionicons name="sparkles" size={19} color={colors.text} /><Text style={styles.title}>Suggested replies</Text></View>
        <Text style={styles.note}>Ping will add your choice to the composer, never send it for you.</Text>
        {suggestions.map(item => <Pressable accessibilityRole="button" accessibilityLabel={`Use reply: ${item}`} key={item} style={styles.suggestion} onPress={() => onSelect(item)}><Text style={styles.suggestionText}>{item}</Text><Ionicons name="add-circle-outline" size={20} color={colors.text} /></Pressable>)}
      </View>
    </Pressable>
  </Modal>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay }, sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: colors.line, padding: 24, paddingBottom: 38 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 19 }, titleRow: { flexDirection: 'row', gap: 8, alignItems: 'center' }, title: { fontSize: 20, fontWeight: '700', color: colors.text },
  note: { color: colors.secondary, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 10 }, suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.line }, suggestionText: { flex: 1, color: colors.text, fontSize: 15, lineHeight: 21 },
});
