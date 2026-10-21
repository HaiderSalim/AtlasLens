import '../global.css';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/store/useThemeStore';
import { useOfflineVaultStore } from '@/store/useOfflineVaultStore';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const hydrateVault = useOfflineVaultStore((state) => state.hydrate);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    hydrateVault();
  }, [hydrateVault]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isDark, colors } = useTheme();

  const customNavigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.bg,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.accent,
    },
  };

  return (
    <ThemeProvider value={customNavigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.bg,
          },
          animation: 'fade',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="wizard/index"
          options={{
            title: 'Reality Check Intake',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="wizard/[step]"
          options={{
            title: 'Reality Check Intake',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="report/[id]"
          options={{
            title: 'Reality Check Dossier',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'About AtlasLens',
            headerStyle: { backgroundColor: colors.card },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
