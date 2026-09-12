import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors, ThemePreference } from '@/constants/theme';
import { warnStorage } from '@/utils/storage-warning';

const THEME_KEY = '@ping/theme-preference';

type ThemeContextValue = {
  colors: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>(undefined as unknown as ThemeContextValue);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(value => {
      if (value === 'light' || value === 'dark' || value === 'system') setPreferenceState(value);
    }).catch(error => warnStorage('Could not load theme preference.', error)).finally(() => setHydrated(true));
  }, []);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(THEME_KEY, next).catch(error => warnStorage('Could not save theme preference.', error));
  };
  const isDark = preference === 'dark' || (preference === 'system' && systemScheme === 'dark');
  const value = useMemo(() => ({
    colors: isDark ? darkColors : lightColors,
    isDark,
    preference,
    setPreference,
  }), [isDark, preference]);

  if (!hydrated) return null;
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
