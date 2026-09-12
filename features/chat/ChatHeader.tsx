import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, IconButton } from '@/components/ui';
import { ThemeColors } from '@/constants/theme';
import { useI18n } from '@/features/i18n-context';
import { useTheme } from '@/features/theme-context';
import { Conversation } from '@/types';

type Props = {
  conversation: Conversation;
  username?: string;
  onOpenProfile?: () => void;
};

export function ChatHeader({ conversation, username, onOpenProfile }: Props) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createStyles(colors);
  const isGroup = conversation.type === 'group';
  return <View style={styles.header}>
    <IconButton accessibilityLabel={t('chat.back')} name="chevron-back" onPress={() => router.back()} />
    <Avatar label={conversation.avatar} size={40} />
    {onOpenProfile ? <Pressable accessibilityRole="button" accessibilityLabel={t('chat.openDetails', { name: conversation.title })} style={styles.identity} onPress={onOpenProfile}>
      <Text style={styles.name}>{conversation.title}</Text>
      <Text style={styles.sub}>{username ? `@${username}` : t('chat.userUnavailable')}</Text>
    </Pressable> : <View style={styles.identity}><Text style={styles.name}>{conversation.title}</Text><Text style={styles.sub}>{isGroup ? t('chat.members', { count: conversation.participantIds.length }) : t('chat.userUnavailable')}</Text></View>}
  </View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  header: { minHeight: 62, paddingHorizontal: 6, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.surface },
  identity: { flex: 1, marginLeft: 10 },
  name: { color: colors.text, fontSize: 15, fontWeight: '700' },
  sub: { color: colors.secondary, fontSize: 11, marginTop: 2 },
});
