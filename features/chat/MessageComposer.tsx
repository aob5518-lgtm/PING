import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconButton } from '@/components/ui';
import { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/features/theme-context';
import { useI18n } from '@/features/i18n-context';
import { Message } from '@/types';

type Props = { draft: string; replyTo: Message | null; onChange: (value: string) => void; onSend: () => void; onCancelReply: () => void };

export function MessageComposer({ draft, replyTo, onChange, onSend, onCancelReply }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  const canSend = !!draft.trim();
  return <>
    {replyTo && <View style={styles.replyBar}><View style={styles.replyCopy}><Text style={styles.replyLabel}>{t('chat.replying')}</Text><Text style={styles.replyText} numberOfLines={1}>{replyTo.content}</Text></View><IconButton accessibilityLabel={t('chat.cancelReply')} name="close" onPress={onCancelReply} /></View>}
    <View style={styles.composer}>
      <TextInput accessibilityLabel={t('chat.message')} value={draft} onChangeText={onChange} placeholder={`${t('chat.message')}…`} placeholderTextColor={colors.muted} multiline style={styles.input} />
      <Pressable accessibilityRole="button" accessibilityLabel={t('chat.send')} disabled={!canSend} onPress={onSend} style={[styles.send, canSend && styles.sendActive]}><Text style={[styles.sendText, canSend && styles.sendTextActive]}>↑</Text></Pressable>
    </View>
  </>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  replyBar: { flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 8, paddingVertical: 7, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface }, replyCopy: { flex: 1 }, replyLabel: { color: colors.text, fontSize: 11, fontWeight: '700' }, replyText: { color: colors.secondary, fontSize: 12, marginTop: 2 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 10, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.surface },
  input: { flex: 1, minHeight: 42, maxHeight: 104, borderRadius: 21, backgroundColor: colors.soft, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, color: colors.text, fontSize: 15 },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.soft, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, sendActive: { backgroundColor: colors.text, borderColor: colors.text },
  sendText: { color: colors.muted, fontSize: 22, fontWeight: '700' }, sendTextActive: { color: colors.inverseText },
});
