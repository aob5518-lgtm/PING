import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/features/app-context';
import { I18nProvider, useI18n } from '@/features/i18n-context';
import { ThemeProvider, useTheme } from '@/features/theme-context';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <I18nProvider><AppProvider><Navigator /></AppProvider></I18nProvider>
    </ThemeProvider>
  );
}

function Navigator() {
  const { colors, isDark } = useTheme();
  const { t } = useI18n();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
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
        <Stack.Screen name="create-group" options={{ title: t('nav.createGroup'), presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ title: t('nav.settings') }} />
        <Stack.Screen name="edit-profile" options={{ title: t('nav.editProfile'), presentation: 'modal' }} />
        <Stack.Screen name="identity-wallet" options={{ title: t('nav.identity') }} />
        <Stack.Screen name="blocked-users" options={{ title: t('nav.blockedUsers') }} />
      </Stack>
    </>
  );
}
