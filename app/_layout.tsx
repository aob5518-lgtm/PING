import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/features/app-context';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
        headerBackButtonDisplayMode: 'minimal',
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="create-identity" options={{ title: '', headerTransparent: true }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="user/[id]" options={{ title: '' }} />
        <Stack.Screen name="create-group" options={{ title: 'Create group', presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="edit-profile" options={{ title: 'Edit profile', presentation: 'modal' }} />
        <Stack.Screen name="identity-wallet" options={{ title: 'Identity & Wallet' }} />
      </Stack>
    </AppProvider>
  );
}
