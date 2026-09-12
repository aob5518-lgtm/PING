import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar, IconButton } from '@/components/ui';
import { ThemeColors } from '@/constants/theme';
import { useTheme } from '@/features/theme-context';
import { Conversation } from '@/types';

type Props = {
  conversation: Conversation;
  username?: string;
  onOpenProfile: () => void;
  onCall: () => void;
  onMore: () => void;
};

export function ChatHeader({ conversation, username, onOpenProfile, onCall, onMore }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isGroup = conversation.type === 'group';
  return <View style={styles.header}>
    <IconButton accessibilityLabel="Go back" name="chevron-back" onPress={() => router.back()} />
    <Avatar label={conversation.avatar} size={40} />
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${conversation.title} details`} style={styles.identity} onPress={onOpenProfile}>
      <Text style={styles.name}>{conversation.title}</Text>
      <Text style={styles.sub}>{isGroup ? `${conversation.participantIds.length} members` : username ? `@${username}` : 'User unavailable'}</Text>
    </Pressable>
    <IconButton accessibilityLabel="Start call" name="call-outline" onPress={onCall} />
    <IconButton accessibilityLabel="More conversation options" name="ellipsis-horizontal" onPress={onMore} />
  </View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  header: { minHeight: 62, paddingHorizontal: 6, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.surface },
  identity: { flex: 1, marginLeft: 10 },
  name: { color: colors.text, fontSize: 15, fontWeight: '700' },
  sub: { color: colors.secondary, fontSize: 11, marginTop: 2 },
});
