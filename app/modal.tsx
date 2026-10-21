import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Compass, Sparkles, ShieldCheck, Database, HardDrive, Smartphone } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';

export default function ModalScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center my-4">
          <View
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: isDark ? '#1C403B' : '#CCFBF1',
            }}
            className="w-16 h-16 rounded-3xl border items-center justify-center mb-3">
            <Compass size={30} color={colors.accent} />
          </View>
          <Text
            style={{ color: colors.text }}
            className="text-2xl font-bold">
            AtlasLens Mobile
          </Text>
          <Text
            style={{ color: colors.accent }}
            className="text-xs font-semibold uppercase tracking-widest mt-1">
            Relocation Intelligence Engine v2.0
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          className="border rounded-2xl p-4 mb-4 gap-3 shadow-sm">
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs leading-relaxed">
            AtlasLens delivers real-time on-the-go relocation intelligence, neighborhood safety evaluations, and unvarnished cost-of-living forecasts directly into the hands of expats, international job seekers, and digital nomads.
          </Text>
        </View>

        <Text
          style={{ color: colors.textSubtle }}
          className="text-xs font-bold uppercase tracking-wider mb-2">
          Architecture & Stack
        </Text>

        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          className="border rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-neutral-800 mb-6 shadow-sm">
          <FeatureItem
            colors={colors}
            icon={<Smartphone size={16} color={colors.accent} />}
            title="React Native & Expo Router"
            desc="File-based cross-platform native runtime with fluid 60-120fps gestures."
          />
          <FeatureItem
            colors={colors}
            icon={<Sparkles size={16} color={colors.emerald} />}
            title="Eye-Comfort Modern Palette"
            desc="Warm light theme and low-contrast dark mode designed for zero eye strain."
          />
          <FeatureItem
            colors={colors}
            icon={<HardDrive size={16} color={colors.amber} />}
            title="AsyncStorage Offline Vault"
            desc="Zero-roaming local persistence for airplane mode scouting."
          />
          <FeatureItem
            colors={colors}
            icon={<Database size={16} color={colors.accent} />}
            title="Supabase Cloud Sync"
            desc="PostgreSQL & Edge Functions for multi-device synchronization."
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={{ backgroundColor: colors.accent }}
          className="py-3.5 rounded-xl items-center mb-6 shadow-sm">
          <Text className="text-white font-bold text-sm">Close Info</Text>
        </TouchableOpacity>
      </ScrollView>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

function FeatureItem({ colors, icon, title, desc }: { colors: any; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <View
      style={{ borderBottomColor: colors.borderSubtle }}
      className="p-3.5 flex-row items-start gap-3">
      <View className="mt-0.5">{icon}</View>
      <View className="flex-1">
        <Text style={{ color: colors.text }} className="text-xs font-bold">{title}</Text>
        <Text style={{ color: colors.textMuted }} className="text-[11px] mt-0.5 leading-relaxed">{desc}</Text>
      </View>
    </View>
  );
}
