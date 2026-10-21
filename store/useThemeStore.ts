import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const THEME_STORAGE_KEY = '@atlaslens_theme_mode_v1';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  bg: string;
  card: string;
  cardAlt: string;
  cardHover: string;
  border: string;
  borderSubtle: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  emerald: string;
  emeraldSoft: string;
  emeraldText: string;
  amber: string;
  amberSoft: string;
  amberText: string;
  rose: string;
  roseSoft: string;
  roseText: string;
}

const LIGHT_THEME: ThemeColors = {
  bg: '#F8F9FA', // Soft warm off-white / mist
  card: '#FFFFFF', // Crisp clean card
  cardAlt: '#F1F3F5', // Soft neutral pill background
  cardHover: '#E9ECEF',
  border: '#E2E8F0', // Very gentle subtle border
  borderSubtle: '#EDF2F7',
  text: '#1E293B', // Refined slate charcoal (not harsh pure black)
  textMuted: '#64748B', // Readable muted slate
  textSubtle: '#94A3B8',
  accent: '#0D9488', // Comfortable organic Sage / Teal
  accentSoft: '#F0FDFA', // Soft pastel tint
  accentText: '#0F766E',
  emerald: '#059669',
  emeraldSoft: '#ECFDF5',
  emeraldText: '#047857',
  amber: '#D97706',
  amberSoft: '#FFFBEB',
  amberText: '#B45309',
  rose: '#E11D48',
  roseSoft: '#FFF1F2',
  roseText: '#BE123C',
};

const DARK_THEME: ThemeColors = {
  bg: '#15171C', // Low-contrast warm graphite (NOT jet black #000)
  card: '#1E2026', // Gentle elevated surface
  cardAlt: '#272A32', // Low-contrast chip/button fill
  cardHover: '#30343E',
  border: '#2B2E37', // Soft low-contrast boundary
  borderSubtle: '#22252C',
  text: '#E2E4E9', // Soothing warm off-white (NOT harsh 100% white)
  textMuted: '#94A3B8', // Readable gentle slate
  textSubtle: '#64748B',
  accent: '#2DD4BF', // Gentle soothing Sage/Teal (NOT blinding neon cyan)
  accentSoft: '#162826', // Muted dark pastel
  accentText: '#5EEAD4',
  emerald: '#34D399',
  emeraldSoft: '#142B22',
  emeraldText: '#6EE7B7',
  amber: '#FBBF24',
  amberSoft: '#2D2312',
  amberText: '#FDE68A',
  rose: '#FB7185',
  roseSoft: '#2E161C',
  roseText: '#FECDD3',
};

interface ThemeState {
  mode: ThemeMode;
  isHydrated: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  getIsDark: () => boolean;
  getColors: () => ThemeColors;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light', // Default to light mode as requested
  isHydrated: false,

  setMode: async (mode: ThemeMode) => {
    set({ mode });
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme to storage:', e);
    }
  },

  toggleTheme: async () => {
    const currentIsDark = get().getIsDark();
    const nextMode: ThemeMode = currentIsDark ? 'light' : 'dark';
    await get().setMode(nextMode);
  },

  getIsDark: () => {
    const { mode } = get();
    if (mode === 'system') {
      return Appearance.getColorScheme() === 'dark';
    }
    return mode === 'dark';
  },

  getColors: () => {
    return get().getIsDark() ? DARK_THEME : LIGHT_THEME;
  },
}));

// Hydrate on launch
AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    useThemeStore.setState({ mode: stored, isHydrated: true });
  } else {
    // Default to 'light' per user preference
    useThemeStore.setState({ mode: 'light', isHydrated: true });
  }
}).catch(() => {
  useThemeStore.setState({ isHydrated: true });
});

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const isHydrated = useThemeStore((s) => s.isHydrated);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const setMode = useThemeStore((s) => s.setMode);
  const isDark = useThemeStore((s) => s.getIsDark());
  const colors = useThemeStore((s) => s.getColors());

  return {
    mode,
    isDark,
    isHydrated,
    toggleTheme,
    setMode,
    colors,
  };
}

