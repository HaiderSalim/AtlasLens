import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  GitCompareArrows,
  ShieldCheck,
  DollarSign,
  Sun,
  Home,
  Bus,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Moon,
} from 'lucide-react-native';
import { CITY_BASELINES } from '@/services/reportGenerator';
import { useIntakeWizardStore } from '@/store/useIntakeWizardStore';
import { useTheme } from '@/store/useThemeStore';
import { getCurrencyInfo } from '@/constants/Currencies';

const AVAILABLE_CITIES = Object.keys(CITY_BASELINES);

function AnimatedMetricBar({
  percentA,
  percentB,
  colorA,
  colorB,
  bgColor,
}: {
  percentA: number;
  percentB: number;
  colorA: string;
  colorB: string;
  bgColor: string;
}) {
  const widthA = useSharedValue(0);
  const widthB = useSharedValue(0);

  useEffect(() => {
    widthA.value = withTiming(Math.min(100, Math.max(4, percentA)), {
      duration: 400,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    widthB.value = withTiming(Math.min(100, Math.max(4, percentB)), {
      duration: 400,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [percentA, percentB]);

  const styleA = useAnimatedStyle(() => ({
    width: `${widthA.value}%`,
  }));

  const styleB = useAnimatedStyle(() => ({
    width: `${widthB.value}%`,
  }));

  return (
    <View className="gap-1 mt-1.5">
      <View style={{ backgroundColor: bgColor }} className="h-1.5 rounded-full overflow-hidden">
        <Animated.View
          style={[
            {
              backgroundColor: colorA,
              height: '100%',
              borderRadius: 9999,
            },
            styleA,
          ]}
        />
      </View>
      <View style={{ backgroundColor: bgColor }} className="h-1.5 rounded-full overflow-hidden">
        <Animated.View
          style={[
            {
              backgroundColor: colorB,
              height: '100%',
              borderRadius: 9999,
            },
            styleB,
          ]}
        />
      </View>
    </View>
  );
}

export default function CompareScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [cityA, setCityA] = useState<string>('Lisbon');
  const [cityB, setCityB] = useState<string>('Valencia');

  const currency = useIntakeWizardStore((state) => state.currency);
  const currInfo = getCurrencyInfo(currency);
  const setDestination = useIntakeWizardStore((state) => state.setDestination);
  const resetWizard = useIntakeWizardStore((state) => state.resetWizard);

  const dataA = CITY_BASELINES[cityA] || CITY_BASELINES['Lisbon'];
  const dataB = CITY_BASELINES[cityB] || CITY_BASELINES['Valencia'];

  const convert = (usdVal: number) => Math.round(usdVal * currInfo.rateFromUSD);

  const totalCostA = convert(dataA.baseHousing + dataA.baseGroceries + dataA.baseUtilities + dataA.baseTransport);
  const totalCostB = convert(dataB.baseHousing + dataB.baseGroceries + dataB.baseUtilities + dataB.baseTransport);

  const maxTotal = Math.max(totalCostA, totalCostB, 1);
  const percentTotalA = Math.round((totalCostA / maxTotal) * 100);
  const percentTotalB = Math.round((totalCostB / maxTotal) * 100);

  const costDiff = totalCostB - totalCostA;
  const costDiffPercent = Math.round((costDiff / totalCostA) * 100);
  const safetyDiff = dataB.safetyScore - dataA.safetyScore;

  const handleSelectCityA = (city: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCityA(city);
  };

  const handleSelectCityB = (city: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCityB(city);
  };

  const handleLaunchReport = (city: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetWizard();
    setDestination(city);
    router.push('/wizard');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Header */}
        <View className="px-5 pt-3 pb-4 flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center gap-1.5">
              <GitCompareArrows size={17} color={colors.accent} />
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase tracking-widest">
                City Comparator
              </Text>
            </View>
            <Text
              style={{ color: colors.text }}
              className="text-2xl font-bold tracking-tight mt-0.5">
              Synchronized Delta Check
            </Text>
            <Text
              style={{ color: colors.textMuted }}
              className="text-xs mt-1 leading-relaxed">
              Compare living costs, rental baselines, and safety metrics side-by-side.
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleTheme}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="w-9 h-9 rounded-full border items-center justify-center shadow-sm">
            {isDark ? (
              <Sun size={17} color={colors.amber} />
            ) : (
              <Moon size={17} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        </View>

        {/* City A Selector */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider">
              City A (Baseline)
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View style={{ backgroundColor: colors.accent }} className="w-2 h-2 rounded-full" />
              <Text style={{ color: colors.accent }} className="text-xs font-bold">{cityA}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {AVAILABLE_CITIES.map((c) => {
              const selected = c === cityA;
              return (
                <TouchableOpacity
                  key={c}
                  testID={`city-a-${c}`}
                  accessibilityLabel={`Select City A ${c}`}
                  activeOpacity={0.7}
                  onPress={() => handleSelectCityA(c)}
                  style={{
                    backgroundColor: selected ? colors.accentSoft : colors.card,
                    borderColor: selected ? colors.accent : colors.border,
                  }}
                  className="px-3.5 py-2 rounded-xl border shadow-sm">
                  <Text
                    style={{
                      color: selected ? colors.accentText : colors.text,
                    }}
                    className="text-xs font-bold">
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* City B Selector */}
        <View className="px-5 mb-5">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider">
              City B (Comparison)
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View style={{ backgroundColor: colors.emerald }} className="w-2 h-2 rounded-full" />
              <Text style={{ color: colors.emerald }} className="text-xs font-bold">{cityB}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {AVAILABLE_CITIES.map((c) => {
              const selected = c === cityB;
              return (
                <TouchableOpacity
                  key={c}
                  testID={`city-b-${c}`}
                  accessibilityLabel={`Select City B ${c}`}
                  activeOpacity={0.7}
                  onPress={() => handleSelectCityB(c)}
                  style={{
                    backgroundColor: selected ? colors.emeraldSoft : colors.card,
                    borderColor: selected ? colors.emerald : colors.border,
                  }}
                  className="px-3.5 py-2 rounded-xl border shadow-sm">
                  <Text
                    style={{
                      color: selected ? colors.emeraldText : colors.text,
                    }}
                    className="text-xs font-bold">
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Delta Comparison Card */}
        <Animated.View entering={FadeInDown.duration(350).delay(80)} className="px-5 mb-6">
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="border rounded-3xl p-5 shadow-sm">
            <View
              style={{ borderBottomColor: colors.borderSubtle }}
              className="flex-row items-center justify-between pb-4 border-b">
              <View className="flex-1 items-center">
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-bold">
                  {cityA}
                </Text>
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-xs">
                  {dataA.country}
                </Text>
                <Text
                  style={{ color: colors.accent }}
                  className="text-xl font-bold mt-2">
                  {currInfo.symbol}{totalCostA.toLocaleString()}
                  <Text style={{ color: colors.textSubtle }} className="text-xs font-normal">/mo</Text>
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: colors.cardAlt,
                  borderColor: colors.border,
                }}
                className="px-3 py-1 rounded-full border">
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-xs font-bold">
                  VS
                </Text>
              </View>

              <View className="flex-1 items-center">
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-bold">
                  {cityB}
                </Text>
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-xs">
                  {dataB.country}
                </Text>
                <Text
                  style={{ color: colors.emerald }}
                  className="text-xl font-bold mt-2">
                  {currInfo.symbol}{totalCostB.toLocaleString()}
                  <Text style={{ color: colors.textSubtle }} className="text-xs font-normal">/mo</Text>
                </Text>
              </View>
            </View>

            {/* Side-by-side Animated Delta Comparison Bar */}
            <View className="mt-4">
              <View className="flex-row justify-between mb-1">
                <Text style={{ color: colors.accent }} className="text-[11px] font-bold">
                  {cityA}: {percentTotalA}% of max
                </Text>
                <Text style={{ color: colors.emerald }} className="text-[11px] font-bold">
                  {cityB}: {percentTotalB}% of max
                </Text>
              </View>
              <AnimatedMetricBar
                percentA={percentTotalA}
                percentB={percentTotalB}
                colorA={colors.accent}
                colorB={colors.emerald}
                bgColor={colors.cardAlt}
              />
            </View>

            {/* Delta Banner */}
            <View
              style={{
                backgroundColor: colors.cardAlt,
                borderColor: colors.borderSubtle,
              }}
              className="mt-4 pt-1 flex-row items-center justify-between p-3.5 rounded-2xl border">
              <View className="flex-row items-center gap-2">
                {costDiff > 0 ? (
                  <TrendingUp size={18} color={colors.rose} />
                ) : (
                  <TrendingDown size={18} color={colors.emerald} />
                )}
                <View>
                  <Text
                    style={{ color: colors.text }}
                    className="text-xs font-bold">
                    Cost Delta: {costDiff > 0 ? `+${costDiffPercent}%` : `${costDiffPercent}%`}
                  </Text>
                  <Text
                    style={{ color: colors.textMuted }}
                    className="text-[11px]">
                    {cityB} is {costDiff > 0
                      ? `${currInfo.symbol}${costDiff.toLocaleString()} more expensive than ${cityA}`
                      : `${currInfo.symbol}${Math.abs(costDiff).toLocaleString()} cheaper than ${cityA}`}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text
                  style={{ color: colors.text }}
                  className="text-xs font-bold">
                  Safety: {safetyDiff >= 0 ? `+${safetyDiff} pts` : `${safetyDiff} pts`}
                </Text>
                <Text
                  style={{ color: colors.textMuted }}
                  className="text-[11px]">
                  {safetyDiff >= 0 ? `${cityB} ranks safer` : `${cityA} ranks safer`}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Itemized Comparison Table */}
        <Animated.View entering={FadeInDown.duration(350).delay(160)} className="px-5 mb-6">
          <Text
            style={{ color: colors.textSubtle }}
            className="text-xs font-bold uppercase tracking-wider mb-3">
            Itemized Expense & Metric Baselines
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="border rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-neutral-800 shadow-sm">
            <ComparisonRow
              colors={colors}
              icon={<Home size={15} color={colors.accent} />}
              label="1-Bed Rent (Center)"
              valA={`${currInfo.symbol}${convert(dataA.baseHousing).toLocaleString()}`}
              valB={`${currInfo.symbol}${convert(dataB.baseHousing).toLocaleString()}`}
              rawA={dataA.baseHousing}
              rawB={dataB.baseHousing}
              diff={convert(dataB.baseHousing) - convert(dataA.baseHousing)}
            />

            <ComparisonRow
              colors={colors}
              icon={<DollarSign size={15} color={colors.emerald} />}
              label="Groceries & Dining"
              valA={`${currInfo.symbol}${convert(dataA.baseGroceries).toLocaleString()}`}
              valB={`${currInfo.symbol}${convert(dataB.baseGroceries).toLocaleString()}`}
              rawA={dataA.baseGroceries}
              rawB={dataB.baseGroceries}
              diff={convert(dataB.baseGroceries) - convert(dataA.baseGroceries)}
            />

            <ComparisonRow
              colors={colors}
              icon={<Sun size={15} color={colors.amber} />}
              label="Utilities, AC & Fiber"
              valA={`${currInfo.symbol}${convert(dataA.baseUtilities).toLocaleString()}`}
              valB={`${currInfo.symbol}${convert(dataB.baseUtilities).toLocaleString()}`}
              rawA={dataA.baseUtilities}
              rawB={dataB.baseUtilities}
              diff={convert(dataB.baseUtilities) - convert(dataA.baseUtilities)}
            />

            <ComparisonRow
              colors={colors}
              icon={<Bus size={15} color={colors.accent} />}
              label="Monthly Transit"
              valA={`${currInfo.symbol}${convert(dataA.baseTransport).toLocaleString()}`}
              valB={`${currInfo.symbol}${convert(dataB.baseTransport).toLocaleString()}`}
              rawA={dataA.baseTransport}
              rawB={dataB.baseTransport}
              diff={convert(dataB.baseTransport) - convert(dataA.baseTransport)}
            />

            <ComparisonRow
              colors={colors}
              icon={<ShieldCheck size={15} color={colors.emerald} />}
              label="Safety Index"
              valA={`${dataA.safetyScore}%`}
              valB={`${dataB.safetyScore}%`}
              rawA={dataA.safetyScore}
              rawB={dataB.safetyScore}
              isScore
              diff={dataB.safetyScore - dataA.safetyScore}
            />
          </View>
        </Animated.View>

        {/* Actions to launch report */}
        <View className="px-5 gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleLaunchReport(cityA)}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="p-4 rounded-2xl border flex-row items-center justify-between shadow-sm">
            <View>
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase">
                Launch Intake
              </Text>
              <Text
                style={{ color: colors.text }}
                className="text-base font-bold">
                Full Reality Check for {cityA}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleLaunchReport(cityB)}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="p-4 rounded-2xl border flex-row items-center justify-between shadow-sm">
            <View>
              <Text
                style={{ color: colors.emerald }}
                className="text-xs font-bold uppercase">
                Launch Intake
              </Text>
              <Text
                style={{ color: colors.text }}
                className="text-base font-bold">
                Full Reality Check for {cityB}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.emerald} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ComparisonRow({
  colors,
  icon,
  label,
  valA,
  valB,
  rawA,
  rawB,
  diff,
  isScore = false,
}: {
  colors: any;
  icon: React.ReactNode;
  label: string;
  valA: string;
  valB: string;
  rawA: number;
  rawB: number;
  diff: number;
  isScore?: boolean;
}) {
  const isPositive = isScore ? diff > 0 : diff < 0;
  const maxVal = Math.max(rawA, rawB, 1);
  const pA = Math.round((rawA / maxVal) * 100);
  const pB = Math.round((rawB / maxVal) * 100);

  return (
    <View
      style={{ borderBottomColor: colors.borderSubtle }}
      className="p-4">
      <View className="flex-row items-center justify-between mb-1.5">
        <View className="flex-row items-center gap-2.5 flex-1">
          {icon}
          <Text
            style={{ color: colors.text }}
            className="text-xs font-semibold">
            {label}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Text
            style={{ color: colors.textMuted }}
            className="text-xs font-medium">
            {valA}
          </Text>
          <Text style={{ color: colors.textSubtle }} className="text-xs">→</Text>
          <Text
            style={{
              color: diff === 0
                ? colors.textMuted
                : isPositive
                ? colors.emerald
                : colors.rose,
            }}
            className="text-xs font-bold">
            {valB}
          </Text>
        </View>
      </View>

      {/* Mini dual comparison bar */}
      <AnimatedMetricBar
        percentA={pA}
        percentB={pB}
        colorA={colors.accent}
        colorB={colors.emerald}
        bgColor={colors.cardAlt}
      />
    </View>
  );
}
