export type ThemePreference = 'light' | 'dark' | 'system';

export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  inverseText: string;
  secondary: string;
  muted: string;
  line: string;
  soft: string;
  overlay: string;
  disabled: string;
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#0A0A0A',
  inverseText: '#FFFFFF',
  secondary: '#5F5F5F',
  muted: '#858585',
  line: '#D8D8D8',
  soft: '#F4F4F4',
  overlay: '#00000066',
  disabled: '#B8B8B8',
};

export const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#000000',
  text: '#F7F7F7',
  inverseText: '#000000',
  secondary: '#B0B0B0',
  muted: '#858585',
  line: '#343434',
  soft: '#171717',
  overlay: '#000000AA',
  disabled: '#555555',
};

export const spacing = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 10, md: 14, lg: 18, pill: 999 };
