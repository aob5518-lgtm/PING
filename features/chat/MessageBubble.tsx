import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/ui';
import { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/features/theme-context';
import { Message, User } from '@/types';
import { formatMessageTime } from '@/utils/date';

type Props = { message: Message; replied?: Message; sender?: User; isGroup: boolean; onLongPress: () => void };

export function MessageBubble({ message, replied, sender, isGroup, onLongPress }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const mine = message.senderId === 'me';
  return <Pressable accessibilityRole="button" accessibilityLabel={`${mine ? 'Your' : sender?.displayName ?? 'Received'} message, ${message.content}`} accessibilityHint="Long press for message actions" onLongPress={onLongPress} delayLongPress={320} style={[styles.row, mine && styles.mineRow]}>
    {!mine && isGroup && <Avatar label={sender?.avatar ?? '?'} size={28} />}
    <View style={styles.messageColumn}>
      {!mine && isGroup && <Text style={styles.sender}>{sender?.displayName ?? 'Unknown user'}</Text>}
      <View style={[styles.bubble, mine ? styles.mine : styles.other]}>
        {replied && <View style={styles.reply}><Text numberOfLines={1} style={[styles.replyText, mine && styles.mineSecondary]}>{replied.content}</Text></View>}
        {message.type === 'image' && <View style={styles.image}><Ionicons name="image-outline" size={34} color={mine ? colors.inverseText : colors.text} /><Text style={[styles.imageText, mine && styles.mineText]}>Image preview</Text></View>}
        {message.type === 'file' && <View style={styles.file}><Ionicons name="document-outline" size={22} color={mine ? colors.inverseText : colors.text} /><Text style={[styles.text, mine && styles.mineText]}>{message.content}</Text></View>}
        {message.type === 'text' && <Text style={[styles.text, mine && styles.mineText]}>{message.content}</Text>}
      </View>
      <Text style={[styles.time, mine && styles.mineTime]}>{formatMessageTime(message.createdAt)}{mine ? '  ✓' : ''}</Text>
    </View>
  </Pressable>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 }, mineRow: { justifyContent: 'flex-end' }, messageColumn: { maxWidth: '78%' },
  sender: { color: colors.secondary, fontSize: 11, marginLeft: 8, marginBottom: 3 }, bubble: { borderRadius: 17, paddingHorizontal: 14, paddingVertical: 10 },
  mine: { backgroundColor: colors.text, borderBottomRightRadius: 5 }, other: { backgroundColor: colors.surface, borderBottomLeftRadius: 5, borderWidth: 1, borderColor: colors.line },
  text: { color: colors.text, fontSize: 15, lineHeight: 21 }, mineText: { color: colors.inverseText }, time: { color: colors.muted, fontSize: 10, marginTop: 4, marginHorizontal: 5 }, mineTime: { textAlign: 'right' },
  image: { width: 210, height: 130, borderRadius: 10, backgroundColor: colors.soft, alignItems: 'center', justifyContent: 'center', gap: 7 }, imageText: { color: colors.text, fontWeight: '600', fontSize: 12 },
  file: { flexDirection: 'row', alignItems: 'center', gap: 8 }, reply: { borderLeftWidth: 2, borderLeftColor: colors.muted, paddingLeft: 8, marginBottom: 7 }, replyText: { color: colors.secondary, fontSize: 11 }, mineSecondary: { color: colors.inverseText, opacity: .75 },
});
