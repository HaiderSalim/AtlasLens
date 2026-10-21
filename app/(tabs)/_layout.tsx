import React from 'react';
import { Tabs } from 'expo-router';
import { Compass, GitCompareArrows, Bookmark } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useTheme } from '@/store/useThemeStore';

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Compare',
          headerTitle: 'City Comparator',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <GitCompareArrows color={color} size={size || 22} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          headerTitle: 'Offline Vault',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size || 22} />,
        }}
      />
    </Tabs>
  );
}
