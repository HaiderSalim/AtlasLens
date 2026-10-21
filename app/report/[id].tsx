import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Home,
  ShoppingBag,
  Zap,
  Bus,
  ShieldCheck,
  ExternalLink,
  MapPin,
  GitCompareArrows,
  Sun,
  Moon,
} from 'lucide-react-native';
import { useOfflineVaultStore } from '@/store/useOfflineVaultStore';
import { useTheme } from '@/store/useThemeStore';
import { INITIAL_PRESEEDED_REPORTS, generateRealityCheckReport } from '@/services/reportGenerator';
import { RealityCheckReport } from '@/types/report';

export default function ReportDashboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();

  const reports = useOfflineVaultStore((state) => state.reports);
  const isBookmarked = useOfflineVaultStore((state) => (id ? state.isBookmarked(id) : false));
  const toggleBookmark = useOfflineVaultStore((state) => state.toggleBookmark);

  const report: RealityCheckReport = useMemo(() => {
    if (id && reports[id]) {
      return reports[id];
    }
    const preseeded = INITIAL_PRESEEDED_REPORTS.find((r) => r.id === id);
    if (preseeded) {
      return preseeded;
    }
    return generateRealityCheckReport({
      destination: 'Lisbon',
      country: 'Portugal',
      monthlyBudget: 2500,
      currency: 'USD',
      lifestyleTags: ['Remote Worker / Coworking', 'Strict Walkability'],
      familyStatus: 'solo',
      commutePreference: 'transit',
      timeline: '3_months',
    });
  }, [id, reports]);

  const handleToggleBookmark = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await toggleBookmark(report);
  };

  const handleOpenMap = (lat: number, lng: number, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const scheme = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(name)}@${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${encodeURIComponent(name)})`,
      default: `https://maps.google.com/?q=${lat},${lng}`,
    });
    Linking.openURL(scheme).catch(() => {
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    });
  };

  const isComfortable = report.verdict === 'Comfortable';
  const isTight = report.verdict === 'Tight';
  const isUnrealistic = report.verdict === 'Unrealistic';

  const currencySymbol = report.budgetBreakdown.currencySymbol || '$';
  const totalCost = report.budgetBreakdown.totalEstimatedUSD;
  const userBudget = report.userBudgetUSD || totalCost;
  const delta = userBudget - totalCost;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {/* Top Header */}
      <View
        style={{
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        }}
        className="px-5 pt-3 pb-3 flex-row items-center justify-between border-b">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.replace('/(tabs)');
          }}
          accessibilityLabel="Back"
          testID="back-button"
          style={{
            backgroundColor: colors.cardAlt,
            borderColor: colors.border,
          }}
          className="w-9 h-9 rounded-xl border items-center justify-center">
          <ArrowLeft size={17} color={colors.text} />
        </TouchableOpacity>

        <View className="items-center">
          <Text
            style={{ color: colors.accent }}
            className="text-xs font-bold uppercase tracking-wider">
            Reality Check Dossier
          </Text>
          <Text
            style={{ color: colors.text }}
            className="text-base font-bold">
            {report.city}, {report.country}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleTheme}
            style={{
              backgroundColor: colors.cardAlt,
              borderColor: colors.border,
            }}
            className="w-9 h-9 rounded-xl border items-center justify-center">
            {isDark ? (
              <Sun size={15} color={colors.amber} />
            ) : (
              <Moon size={15} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggleBookmark}
            style={{
              backgroundColor: isBookmarked ? colors.accentSoft : colors.cardAlt,
              borderColor: isBookmarked ? colors.accent : colors.border,
            }}
            className="w-9 h-9 rounded-xl border items-center justify-center">
            {isBookmarked ? (
              <BookmarkCheck size={17} color={colors.accent} />
            ) : (
              <Bookmark size={17} color={colors.textSubtle} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* 1. VERDICT STATUS CARD */}
        <Animated.View entering={FadeInDown.duration(350).delay(60)} className="px-5 pt-5 mb-5">
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="border rounded-3xl p-5 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-xs font-bold uppercase tracking-widest">
                  Feasibility Assessment
                </Text>
                <Text
                  style={{ color: colors.text }}
                  className="text-3xl font-black mt-0.5">
                  {report.feasibilityScore}
                  <Text style={{ color: colors.textSubtle }} className="text-sm font-semibold">/100</Text>
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
                className="px-3.5 py-1.5 rounded-full flex-row items-center gap-1.5 border">
                {isComfortable ? (
                  <CheckCircle2 size={13} color={colors.emerald} />
                ) : isTight ? (
                  <AlertTriangle size={13} color={colors.amber} />
                ) : (
                  <XCircle size={13} color={colors.rose} />
                )}
                <Text
                  style={{
                    color: isComfortable
                      ? colors.emeraldText
                      : isTight
                      ? colors.amberText
                      : colors.roseText,
                  }}
                  className="text-xs font-bold">
                  {report.verdict}
                </Text>
              </View>
            </View>

            {/* Animated Score Progress Bar */}
            <AnimatedScoreGauge
              score={report.feasibilityScore}
              barColor={
                isComfortable
                  ? colors.emerald
                  : isTight
                  ? colors.amber
                  : colors.rose
              }
              bgColor={colors.cardAlt}
              borderColor={colors.borderSubtle}
            />

            {/* Delta Comparison Box */}
            <View
              style={{
                backgroundColor: colors.cardAlt,
                borderColor: colors.borderSubtle,
              }}
              className="p-4 rounded-2xl border flex-row items-center justify-between">
              <View>
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-[11px] font-semibold uppercase">
                  Your Budget
                </Text>
                <Text
                  style={{ color: colors.text }}
                  className="text-base font-bold mt-0.5">
                  {currencySymbol}{userBudget.toLocaleString()}
                </Text>
              </View>

              <View style={{ backgroundColor: colors.border }} className="h-8 w-px" />

              <View>
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-[11px] font-semibold uppercase">
                  Est. Total
                </Text>
                <Text
                  style={{ color: colors.accent }}
                  className="text-base font-bold mt-0.5">
                  {currencySymbol}{totalCost.toLocaleString()}
                </Text>
              </View>

              <View style={{ backgroundColor: colors.border }} className="h-8 w-px" />

              <View>
                <Text
                  style={{ color: colors.textSubtle }}
                  className="text-[11px] font-semibold uppercase">
                  Balance
                </Text>
                <Text
                  style={{
                    color: delta >= 0 ? colors.emerald : colors.rose,
                  }}
                  className="text-base font-bold mt-0.5">
                  {delta >= 0 ? `+${currencySymbol}${delta.toLocaleString()}` : `-${currencySymbol}${Math.abs(delta).toLocaleString()}`}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* 2. ITEMIZED BUDGET BREAKDOWN */}
        <Animated.View entering={FadeInDown.duration(350).delay(140)} className="px-5 mb-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider">
              Itemized Budget Bar Breakdown
            </Text>
            <Text
              style={{ color: colors.accent }}
              className="text-xs font-medium">
              Monthly
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="border rounded-3xl p-5 gap-4 shadow-sm">
            <BudgetBarItem
              colors={colors}
              currencySymbol={currencySymbol}
              icon={<Home size={15} color={colors.accent} />}
              label="Rent & Housing"
              amount={report.budgetBreakdown.housing}
              total={totalCost}
              barColor={colors.accent}
              subtext="1-bedroom center baseline"
              delay={100}
            />
            <BudgetBarItem
              colors={colors}
              currencySymbol={currencySymbol}
              icon={<ShoppingBag size={15} color={colors.emerald} />}
              label="Groceries & Dining"
              amount={report.budgetBreakdown.groceriesDining}
              total={totalCost}
              barColor={colors.emerald}
              subtext="Supermarkets + local eateries"
              delay={250}
            />
            <BudgetBarItem
              colors={colors}
              currencySymbol={currencySymbol}
              icon={<Zap size={15} color={colors.amber} />}
              label="Utilities, AC & High-Speed WiFi"
              amount={report.budgetBreakdown.utilitiesAndWifi}
              total={totalCost}
              barColor={colors.amber}
              subtext="Includes seasonal heat/cooling variance"
              delay={400}
            />
            <BudgetBarItem
              colors={colors}
              currencySymbol={currencySymbol}
              icon={<Bus size={15} color={colors.accent} />}
              label="Transit Pass & Mobility"
              amount={report.budgetBreakdown.transport}
              total={totalCost}
              barColor={colors.accent}
              subtext="Monthly metro & bus pass"
              delay={550}
            />
          </View>
        </Animated.View>

        {/* 3. SWIPEABLE NEIGHBORHOOD CARDS */}
        <Animated.View entering={FadeInDown.duration(350).delay(220)} className="mb-5">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <View>
              <Text
                style={{ color: colors.textSubtle }}
                className="text-xs font-bold uppercase tracking-wider">
                Top Neighborhood Recommendations
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs mt-0.5">
                Swipe horizontally to scout districts
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.cardAlt,
                borderColor: colors.border,
              }}
              className="px-2.5 py-1 rounded-full border">
              <Text
                style={{ color: colors.textSubtle }}
                className="text-xs font-semibold">
                {report.neighborhoods.length} Districts
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {report.neighborhoods.map((district, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                className="w-72 border rounded-3xl p-5 shadow-sm">
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-2">
                    <Text
                      style={{ color: colors.text }}
                      className="text-base font-bold">
                      {district.name}
                    </Text>
                    <Text
                      style={{ color: colors.textSubtle }}
                      className="text-xs">
                      {report.city}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: colors.emeraldSoft,
                      borderColor: isDark ? '#234E3D' : '#A7F3D0',
                    }}
                    className="border px-2.5 py-1 rounded-lg flex-row items-center gap-1">
                    <ShieldCheck size={12} color={colors.emerald} />
                    <Text
                      style={{ color: colors.emeraldText }}
                      className="text-xs font-semibold">
                      {district.safetyIndex}%
                    </Text>
                  </View>
                </View>

                <Text
                  style={{ color: colors.textMuted }}
                  className="text-xs mb-3.5 leading-relaxed">
                  {district.vibe}
                </Text>

                <View className="flex-row flex-wrap gap-1.5 mb-4">
                  {district.amenityHighlights.map((amenity, aIdx) => (
                    <View
                      key={aIdx}
                      style={{
                        backgroundColor: colors.cardAlt,
                        borderColor: colors.borderSubtle,
                      }}
                      className="border px-2 py-1 rounded-lg">
                      <Text
                        style={{ color: colors.textMuted }}
                        className="text-[10px] font-semibold">
                        {amenity}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    handleOpenMap(
                      district.mapCoords.lat,
                      district.mapCoords.lng,
                      `${district.name}, ${report.city}`
                    )
                  }
                  style={{
                    backgroundColor: colors.accentSoft,
                    borderColor: isDark ? '#1C403B' : '#CCFBF1',
                  }}
                  className="border py-2.5 px-3 rounded-xl flex-row items-center justify-center gap-2">
                  <MapPin size={13} color={colors.accent} />
                  <Text
                    style={{ color: colors.accentText }}
                    className="text-xs font-semibold">
                    Open in Maps
                  </Text>
                  <ExternalLink size={12} color={colors.accent} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* 4. BRUTALLY HONEST WARNINGS */}
        <Animated.View entering={FadeInDown.duration(350).delay(300)} className="px-5 mb-5">
          <View className="flex-row items-center gap-1.5 mb-3">
            <AlertTriangle size={15} color={colors.amber} />
            <Text
              style={{ color: colors.amber }}
              className="text-xs font-bold uppercase tracking-wider">
              Brutally Honest Warnings
            </Text>
          </View>

          <View className="gap-2.5">
            {report.brutallyHonestWarnings.map((warning, wIdx) => {
              const isWeather = warning.type === 'weather';
              const isCost = warning.type === 'cost';
              const isLogistics = warning.type === 'logistics';
              return (
                <View
                  key={wIdx}
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }}
                  className="border rounded-2xl p-4 shadow-sm">
                  <View className="flex-row items-center gap-2 mb-1.5">
                    <View
                      style={{
                        backgroundColor: isWeather
                          ? colors.accentSoft
                          : isCost
                          ? colors.roseSoft
                          : isLogistics
                          ? colors.amberSoft
                          : colors.cardAlt,
                        borderColor: isWeather
                          ? (isDark ? '#1C403B' : '#CCFBF1')
                          : isCost
                          ? (isDark ? '#4D222A' : '#FECDD3')
                          : isLogistics
                          ? (isDark ? '#4D381A' : '#FDE68A')
                          : colors.border,
                      }}
                      className="px-2 py-0.5 rounded-md border">
                      <Text
                        style={{
                          color: isWeather
                            ? colors.accentText
                            : isCost
                            ? colors.roseText
                            : isLogistics
                            ? colors.amberText
                            : colors.textMuted,
                        }}
                        className="text-[10px] font-bold uppercase">
                        {warning.type}
                      </Text>
                    </View>
                    <Text
                      style={{ color: colors.text }}
                      className="text-sm font-bold flex-1">
                      {warning.headline}
                    </Text>
                  </View>
                  <Text
                    style={{ color: colors.textMuted }}
                    className="text-xs leading-relaxed pl-1">
                    {warning.detail}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Actions */}
        <View className="px-5 gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleBookmark}
            style={{
              backgroundColor: isBookmarked ? colors.emeraldSoft : colors.card,
              borderColor: isBookmarked ? colors.emerald : colors.border,
            }}
            className="p-4 rounded-2xl border flex-row items-center justify-center gap-2 shadow-sm">
            {isBookmarked ? (
              <BookmarkCheck size={18} color={colors.emerald} />
            ) : (
              <Bookmark size={18} color={colors.textSubtle} />
            )}
            <Text
              style={{
                color: isBookmarked ? colors.emeraldText : colors.text,
              }}
              className="text-sm font-semibold">
              {isBookmarked ? 'Saved in Offline Vault' : 'Save Dossier Offline'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/compare')}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="p-4 rounded-2xl border flex-row items-center justify-center gap-2 shadow-sm">
            <GitCompareArrows size={18} color={colors.accent} />
            <Text
              style={{ color: colors.accentText }}
              className="text-sm font-semibold">
              Compare {report.city} with Another City
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AnimatedScoreGauge({
  score,
  barColor,
  bgColor,
  borderColor,
}: {
  score: number;
  barColor: string;
  bgColor: string;
  borderColor: string;
}) {
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    progressAnim.value = withTiming(Math.min(100, Math.max(0, score)), {
      duration: 900,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value}%`,
  }));

  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
      className="w-full h-2 rounded-full overflow-hidden border mb-4">
      <Animated.View
        style={[
          {
            backgroundColor: barColor,
            height: '100%',
            borderRadius: 9999,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

function BudgetBarItem({
  colors,
  currencySymbol = '$',
  icon,
  label,
  amount,
  total,
  barColor,
  subtext,
  delay = 0,
}: {
  colors: any;
  currencySymbol?: string;
  icon: React.ReactNode;
  label: string;
  amount: number;
  total: number;
  barColor: string;
  subtext: string;
  delay?: number;
}) {
  const percentage = Math.round((amount / (total || 1)) * 100);
  const barAnim = useSharedValue(0);

  useEffect(() => {
    barAnim.value = withDelay(
      delay,
      withTiming(Math.min(100, percentage), {
        duration: 800,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    );
  }, [percentage, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${barAnim.value}%`,
  }));

  return (
    <View>
      <View className="flex-row items-center justify-between mb-1.5">
        <View className="flex-row items-center gap-2">
          {icon}
          <Text
            style={{ color: colors.text }}
            className="text-xs font-semibold">
            {label}
          </Text>
        </View>
        <Text
          style={{ color: colors.text }}
          className="text-xs font-bold">
          {currencySymbol}{amount.toLocaleString()} ({percentage}%)
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.cardAlt,
          borderColor: colors.borderSubtle,
        }}
        className="w-full h-2 rounded-full overflow-hidden border mb-1">
        <Animated.View
          style={[
            {
              backgroundColor: barColor,
              height: '100%',
              borderRadius: 9999,
            },
            animatedStyle,
          ]}
        />
      </View>
      <Text style={{ color: colors.textSubtle }} className="text-[10px]">{subtext}</Text>
    </View>
  );
}
