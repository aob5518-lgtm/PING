import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '@/features/theme-context';
import { useI18n } from '@/features/i18n-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const { t } = useI18n();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.text,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { borderTopColor: colors.line, backgroundColor: colors.surface, height: 82, paddingTop: 8 },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
    }}>
      <Tabs.Screen name="chats" options={{ title: t('tabs.chats'), tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="discover" options={{ title: t('tabs.discover'), tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="me" options={{ title: t('tabs.me'), tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
