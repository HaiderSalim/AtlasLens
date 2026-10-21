import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sun,
  Moon,
  Flame,
  ChevronRight,
  Layers,
  X,
} from 'lucide-react-native';
import { useOfflineVaultStore } from '@/store/useOfflineVaultStore';
import { useIntakeWizardStore } from '@/store/useIntakeWizardStore';
import { useTheme } from '@/store/useThemeStore';
import { CITY_BASELINES } from '@/services/reportGenerator';

const QUICK_PROMPTS = [
  { label: 'Nomad Capital', city: 'Lisbon', budget: 2500 },
  { label: 'Clean & Safe', city: 'Tokyo', budget: 2400 },
  { label: 'Mediterranean Sun', city: 'Valencia', budget: 2000 },
  { label: 'Creative Hub', city: 'Berlin', budget: 2200 },
  { label: 'Tax-Free Living', city: 'Dubai', budget: 4500 },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const reports = useOfflineVaultStore((state) => state.reports);
  const reportsList = Object.values(reports);

  const setDestination = useIntakeWizardStore((state) => state.setDestination);
  const setBudget = useIntakeWizardStore((state) => state.setBudget);
  const resetWizard = useIntakeWizardStore((state) => state.resetWizard);

  const handleStartWizard = (targetCity?: string, budget?: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetWizard();
    if (targetCity) setDestination(targetCity);
    if (budget) setBudget(budget);
    router.push('/wizard');
  };

  const handleOpenReport = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/report/${id}`);
  };

  const handleToggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const filteredCities = Object.keys(CITY_BASELINES).filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Top App Header */}
        <View className="px-5 pt-3 pb-4 flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-1.5">
              <Compass size={17} color={colors.accent} />
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase tracking-widest">
                AtlasLens Mobile
              </Text>
            </View>
            <Text
              style={{ color: colors.text }}
              className="text-2xl font-bold tracking-tight mt-0.5">
              Relocation Intelligence
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {/* Theme Toggle Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleToggleTheme}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="w-9 h-9 rounded-full border items-center justify-center">
              {isDark ? (
                <Sun size={17} color={colors.amber} />
              ) : (
                <Moon size={17} color={colors.textMuted} />
              )}
            </TouchableOpacity>

            {/* Offline Vault Pill */}
            <View
              style={{
                backgroundColor: colors.emeraldSoft,
                borderColor: isDark ? '#234E3D' : '#A7F3D0',
              }}
              className="border px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
              <View
                style={{ backgroundColor: colors.emerald }}
                className="w-2 h-2 rounded-full"
              />
              <Text
                style={{ color: colors.emeraldText }}
                className="text-xs font-semibold">
                Offline Ready
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-5 mb-5">
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="flex-row items-center border rounded-2xl px-4 py-3">
            <Search size={18} color={colors.textSubtle} />
            <TextInput
              testID="search-input"
              placeholder="Search destination (e.g. Lisbon, Tokyo)..."
              placeholderTextColor={colors.textSubtle}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ color: colors.text }}
              className="flex-1 ml-3 text-sm font-medium"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                testID="search-clear-button"
                accessibilityLabel="Clear Search"
                activeOpacity={0.7}
                onPress={() => setSearchQuery('')}
                className="p-1 -mr-1">
                <X size={16} color={colors.textSubtle} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero AI Reality Check Banner (Softer, comfortable styling) */}
        <Animated.View entering={FadeInDown.duration(350).delay(60)} className="px-5 mb-6">
          <TouchableOpacity
            testID="hero-start-reality-check"
            activeOpacity={0.88}
            onPress={() => handleStartWizard()}
            style={{
              backgroundColor: colors.card,
              borderColor: isDark ? colors.border : '#E2E8F0',
            }}
            className="border rounded-3xl p-5 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View
                style={{
                  backgroundColor: colors.accentSoft,
                  borderColor: isDark ? '#1C403B' : '#CCFBF1',
                }}
                className="px-3 py-1 rounded-full border flex-row items-center gap-1.5">
                <Sparkles size={13} color={colors.accent} />
                <Text
                  style={{ color: colors.accentText }}
                  className="text-xs font-bold uppercase tracking-wider">
                  AI Reality Check
                </Text>
              </View>
              <Text
                style={{ color: colors.textSubtle }}
                className="text-xs font-medium">
                4-Step Intake
              </Text>
            </View>

            <Text
              style={{ color: colors.text }}
              className="text-xl font-bold leading-snug mb-1.5">
              Can You Afford Your Next Move?
            </Text>
            <Text
              style={{ color: colors.textMuted }}
              className="text-xs mb-4 leading-relaxed">
              Unvarnished cost-of-living forecasts, neighborhood safety indexes, and practical warnings for nomads and expats.
            </Text>

            <View
              style={{ backgroundColor: colors.accent }}
              className="py-3 px-4 rounded-xl flex-row items-center justify-center gap-2">
              <Text className="text-white font-bold text-sm">
                Start Reality Check
              </Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Simulation Presets */}
        <Animated.View entering={FadeInDown.duration(350).delay(120)} className="mb-6">
          <Text
            style={{ color: colors.textSubtle }}
            className="px-5 text-xs font-bold uppercase tracking-wider mb-3">
            Quick Simulation Presets
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => handleStartWizard(prompt.city, prompt.budget)}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                className="border px-4 py-2.5 rounded-full flex-row items-center gap-2 shadow-sm">
                <Flame size={14} color={colors.amber} />
                <Text
                  style={{ color: colors.text }}
                  className="text-xs font-semibold">
                  {prompt.label}
                </Text>
                <Text
                  style={{ color: colors.accent }}
                  className="text-xs font-bold">
                  ${prompt.budget}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Scouted Destinations / Vetted Benchmark Hubs */}
        <Animated.View entering={FadeInDown.duration(350).delay(180)} className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider">
              Vetted Benchmark Hubs ({filteredCities.length})
            </Text>
            <Text
              style={{ color: colors.accent }}
              className="text-xs font-medium">
              Updated Weekly
            </Text>
          </View>

          <View className="gap-3">
            {filteredCities.map((cityName) => {
              const data = CITY_BASELINES[cityName];
              return (
                <TouchableOpacity
                  key={cityName}
                  activeOpacity={0.7}
                  onPress={() => handleStartWizard(cityName, Math.round(data.baseHousing * 1.8))}
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  className="border p-4 rounded-2xl shadow-sm">
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <View className="flex-row items-center gap-1.5">
                        <MapPin size={16} color={colors.accent} />
                        <Text
                          style={{ color: colors.text }}
                          className="text-lg font-bold">
                          {cityName}
                        </Text>
                        <Text
                          style={{ color: colors.textSubtle }}
                          className="text-xs font-medium">
                          ({data.country})
                        </Text>
                      </View>
                      <Text
                        style={{ color: colors.textMuted }}
                        className="text-xs mt-1">
                        1-Bed Central Rent: ~${data.baseHousing}/mo
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: colors.emeraldSoft,
                        borderColor: isDark ? '#234E3D' : '#A7F3D0',
                      }}
                      className="border px-2.5 py-1 rounded-lg flex-row items-center gap-1">
                      <ShieldCheck size={13} color={colors.emerald} />
                      <Text
                        style={{ color: colors.emeraldText }}
                        className="text-xs font-semibold">
                        {data.safetyScore}% Safety
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ borderTopColor: colors.borderSubtle }}
                    className="flex-row items-center justify-between pt-2.5 border-t mt-2">
                    <View className="flex-row items-center gap-1.5">
                      <Layers size={13} color={colors.textSubtle} />
                      <Text
                        style={{ color: colors.textMuted }}
                        className="text-xs">
                        {data.neighborhoods.length} Top Neighborhoods
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Text
                        style={{ color: colors.accent }}
                        className="text-xs font-semibold">
                        Run Dossier
                      </Text>
                      <ChevronRight size={14} color={colors.accent} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Recent Evaluations */}
        {reportsList.length > 0 && (
          <View className="px-5">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-1.5">
                <Clock size={15} color={colors.textSubtle} />
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-xs font-bold uppercase tracking-wider">
                  Recent Evaluations
                </Text>
              </View>
              <Text
                style={{ color: colors.textSubtle }}
                className="text-xs font-medium">
                {reportsList.length} total
              </Text>
            </View>

            <View className="gap-2.5">
              {reportsList.slice(0, 4).map((report) => {
                const isComfortable = report.verdict === 'Comfortable';
                const isTight = report.verdict === 'Tight';
                return (
                  <TouchableOpacity
                    key={report.id}
                    activeOpacity={0.7}
                    onPress={() => handleOpenReport(report.id)}
                    style={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    }}
                    className="border p-3.5 rounded-2xl flex-row items-center justify-between shadow-sm">
                    <View className="flex-1 mr-3">
                      <View className="flex-row items-center gap-2">
                        <Text
                          style={{ color: colors.text }}
                          className="text-base font-bold">
                          {report.city}
                        </Text>
                        <Text
                          style={{ color: colors.textSubtle }}
                          className="text-xs font-medium">
                          {report.country}
                        </Text>
                      </View>
                      <Text
                        style={{ color: colors.textMuted }}
                        className="text-xs mt-0.5">
                        Budget: ${report.userBudgetUSD}/mo • Score: {report.feasibilityScore}%
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: isComfortable
                          ? colors.emeraldSoft
                          : isTight
                          ? colors.amberSoft
                          : colors.roseSoft,
                        borderColor: isComfortable
                          ? (isDark ? '#234E3D' : '#A7F3D0')
                          : isTight
                          ? (isDark ? '#4D381A' : '#FDE68A')
                          : (isDark ? '#4D222A' : '#FECDD3'),
                      }}
                      className="px-2.5 py-1 rounded-full flex-row items-center gap-1 border">
                      {isComfortable ? (
                        <CheckCircle2 size={12} color={colors.emerald} />
                      ) : isTight ? (
                        <AlertTriangle size={12} color={colors.amber} />
                      ) : (
                        <XCircle size={12} color={colors.rose} />
                      )}
                      <Text
                        style={{
                          color: isComfortable
                            ? colors.emeraldText
                            : isTight
                            ? colors.amberText
                            : colors.roseText,
                        }}
                        className="text-xs font-semibold">
                        {report.verdict}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
