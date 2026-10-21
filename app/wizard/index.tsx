import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  DollarSign,
  Users,
  Check,
  Car,
  Footprints,
  Train,
  Bike,
  Heart,
  Laptop,
  Sun,
  Shield,
  Coffee,
  Waves,
  Coins,
  Moon,
} from 'lucide-react-native';
import { useIntakeWizardStore } from '@/store/useIntakeWizardStore';
import { useOfflineVaultStore } from '@/store/useOfflineVaultStore';
import { useTheme } from '@/store/useThemeStore';
import {
  CITY_BASELINES,
  generateRealityCheckReport,
} from '@/services/reportGenerator';
import { CURRENCIES, getCurrencyInfo } from '@/constants/Currencies';

const LIFESTYLE_OPTIONS = [
  { id: 'Remote Worker / Coworking', label: 'Coworking / Remote Hubs', icon: Laptop },
  { id: 'Has Dog / Pet Friendly', label: 'Pet Friendly Parks', icon: Heart },
  { id: 'Nightlife & Dining', label: 'Nightlife & Dining', icon: Coffee },
  { id: 'Quiet Suburban', label: 'Quiet & Residential', icon: Shield },
  { id: 'Strict Walkability', label: 'Strict 15-Min Walkability', icon: Footprints },
  { id: 'Hates Cold/Rain', label: 'High Sunshine / Mild Climate', icon: Sun },
  { id: 'Beach & Ocean Access', label: 'Coastal / Beach Proximity', icon: Waves },
  { id: 'Budget Conscious', label: 'Frugal / Strict Cost Ceiling', icon: DollarSign },
];

const POPULAR_DESTINATIONS = [
  { city: 'Lisbon', country: 'Portugal', tag: 'Nomad Capital' },
  { city: 'Tokyo', country: 'Japan', tag: 'Clean & Safe' },
  { city: 'Valencia', country: 'Spain', tag: 'Mediterranean' },
  { city: 'Berlin', country: 'Germany', tag: 'Creative Scene' },
  { city: 'Dubai', country: 'UAE', tag: 'Tax-Free' },
];

function AnimatedBudgetProgressBar({
  progressPercent,
  barColor,
  bgColor,
  borderColor,
}: {
  progressPercent: number;
  barColor: string;
  bgColor: string;
  borderColor: string;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progressPercent}%`, { duration: 250 }),
  }));

  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
      className="h-2.5 rounded-full overflow-hidden border">
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

export default function WizardScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const {
    currentStep,
    totalSteps,
    setStep,
    nextStep,
    prevStep,
    destination,
    country,
    monthlyBudget,
    currency,
    lifestyleTags,
    familyStatus,
    commutePreference,
    timeline,
    setDestination,
    setBudget,
    setCurrency,
    toggleLifestyleTag,
    setFamilyStatus,
    setCommutePreference,
    setTimeline,
    getFormData,
  } = useIntakeWizardStore();

  const saveReport = useOfflineVaultStore((state) => state.saveReport);
  const [cityInput, setCityInput] = useState(destination);

  const currInfo = getCurrencyInfo(currency);
  const usdEquivalent = monthlyBudget / (currInfo.rateFromUSD || 1);
  const midBenchmark =
    currInfo.code === 'JPY'
      ? 600000
      : Math.round((currInfo.minBudget + currInfo.maxBudget) / 2 / 50) * 50;
  const progressPercent = Math.min(
    100,
    Math.max(
      8,
      ((monthlyBudget - currInfo.minBudget) /
        (currInfo.maxBudget - currInfo.minBudget || 1)) *
        100
    )
  );

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < totalSteps) {
      nextStep();
    } else {
      handleCompleteWizard();
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 1) {
      prevStep();
    } else {
      router.back();
    }
  };

  const handleCompleteWizard = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const formData = getFormData();
    const newReport = generateRealityCheckReport(formData);

    await saveReport(newReport);
    router.replace(`/report/${newReport.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
      {/* Top Header & Progress */}
      <View
        style={{
          borderBottomColor: colors.border,
          backgroundColor: colors.card,
        }}
        className="px-5 pt-2 pb-4 border-b">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Back"
            testID="wizard-back-button"
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
              className="text-xs font-bold uppercase tracking-widest">
              AtlasLens Intake
            </Text>
            <Text
              style={{ color: colors.text }}
              className="text-xs font-semibold">
              Step {currentStep} of {totalSteps}
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
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
        </View>

        {/* Segmented Progress Bar */}
        <View className="flex-row gap-2">
          {[1, 2, 3, 4].map((step) => {
            const isActive = step <= currentStep;
            return (
              <View
                key={step}
                style={{
                  backgroundColor: isActive ? colors.accent : colors.border,
                }}
                className="flex-1 h-1.5 rounded-full"
              />
            );
          })}
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 110 }}>
        
        {/* SCREEN 1: TARGET DESTINATION */}
        {currentStep === 1 && (
          <Animated.View entering={FadeInRight.duration(260)}>
            <View className="mb-5">
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase tracking-widest">
                Location Scouting
              </Text>
              <Text
                style={{ color: colors.text }}
                className="text-2xl font-bold mt-1">
                Where are you scouting?
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs mt-1.5 leading-relaxed">
                Choose a pre-scouted hub or type any prospective city to evaluate.
              </Text>
            </View>

            {/* City search input */}
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="border rounded-2xl px-4 py-3 flex-row items-center mb-5">
              <MapPin size={18} color={colors.accent} />
              <TextInput
                placeholder="Enter city name (e.g. Lisbon, Tokyo, Berlin)..."
                placeholderTextColor={colors.textSubtle}
                value={cityInput}
                onChangeText={(text) => {
                  setCityInput(text);
                  setDestination(text);
                }}
                style={{ color: colors.text }}
                className="flex-1 ml-3 text-sm font-semibold"
              />
            </View>

            {/* Popular Relocation Hubs */}
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider mb-3">
              Vetted Benchmark Hubs
            </Text>
            <View className="gap-2.5">
              {POPULAR_DESTINATIONS.map((item) => {
                const isSelected = destination.toLowerCase() === item.city.toLowerCase();
                return (
                  <TouchableOpacity
                    key={item.city}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCityInput(item.city);
                      setDestination(item.city, item.country);
                    }}
                    style={{
                      backgroundColor: isSelected ? colors.accentSoft : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    }}
                    className="p-4 rounded-2xl border flex-row items-center justify-between shadow-sm">
                    <View className="flex-row items-center gap-3">
                      <View
                        style={{
                          backgroundColor: isSelected ? colors.accent : colors.cardAlt,
                        }}
                        className="w-9 h-9 rounded-xl items-center justify-center">
                        <MapPin
                          size={16}
                          color={isSelected ? '#FFFFFF' : colors.textSubtle}
                        />
                      </View>
                      <View>
                        <View className="flex-row items-center gap-2">
                          <Text
                            style={{ color: colors.text }}
                            className="text-base font-bold">
                            {item.city}
                          </Text>
                          <Text
                            style={{ color: colors.textSubtle }}
                            className="text-xs">
                            {item.country}
                          </Text>
                        </View>
                        <Text
                          style={{ color: colors.accentText }}
                          className="text-xs font-medium mt-0.5">
                          {item.tag}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: isSelected ? colors.accent : 'transparent',
                        borderColor: isSelected ? colors.accent : colors.border,
                      }}
                      className="w-5 h-5 rounded-full items-center justify-center border">
                      {isSelected && <Check size={12} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* SCREEN 2: BUDGET & CURRENCY */}
        {currentStep === 2 && (
          <Animated.View entering={FadeInRight.duration(260)}>
            <View className="mb-5">
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase tracking-widest">
                Monthly Expenditure Ceiling
              </Text>
              <Text
                style={{ color: colors.text }}
                className="text-2xl font-bold mt-1">
                What is your monthly budget?
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs mt-1.5 leading-relaxed">
                Include rent, groceries, transport, utilities, health & leisure.
              </Text>
            </View>

            {/* Currency selector chips */}
            <View className="mb-5">
              <Text
                style={{ color: colors.textSubtle }}
                className="text-xs font-bold uppercase tracking-wider mb-2.5">
                Currency Base
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {CURRENCIES.map((curr) => {
                  const isSelected = currency === curr.code;
                  return (
                    <TouchableOpacity
                      key={curr.code}
                      activeOpacity={0.7}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setCurrency(curr.code);
                      }}
                      style={{
                        backgroundColor: isSelected ? colors.accentSoft : colors.card,
                        borderColor: isSelected ? colors.accent : colors.border,
                      }}
                      className="px-3.5 py-2 rounded-xl border flex-row items-center gap-1.5">
                      <Coins size={12} color={isSelected ? colors.accent : colors.textSubtle} />
                      <Text
                        style={{
                          color: isSelected ? colors.accentText : colors.text,
                        }}
                        className="text-xs font-semibold">
                        {curr.code} ({curr.symbol})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Budget Card */}
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="border rounded-3xl p-6 mb-5 shadow-sm">
              <Text
                style={{ color: colors.textSubtle }}
                className="text-xs font-bold uppercase tracking-widest text-center">
                Allocated Monthly Spend
              </Text>
              <Text
                style={{ color: colors.accent }}
                className="text-4xl font-black text-center mt-2">
                {currInfo.symbol}{monthlyBudget.toLocaleString()}
              </Text>
              <View
                style={{
                  backgroundColor: colors.cardAlt,
                  borderColor: colors.border,
                }}
                className="mt-2 self-center px-3 py-1 rounded-full border">
                <Text
                  style={{ color: colors.textMuted }}
                  className="text-xs font-medium">
                  {usdEquivalent < 1600
                    ? 'Frugal / Backpacker Tier'
                    : usdEquivalent < 3200
                    ? 'Comfortable Digital Nomad'
                    : usdEquivalent < 5500
                    ? 'High-Income Expat Professional'
                    : 'Executive / Luxury Living'}
                </Text>
              </View>

              {/* Visual Animated Progress Bar */}
              <View className="w-full mt-6 mb-2">
                <AnimatedBudgetProgressBar
                  progressPercent={progressPercent}
                  barColor={colors.accent}
                  bgColor={colors.cardAlt}
                  borderColor={colors.border}
                />
                <View className="flex-row justify-between mt-1.5">
                  <Text style={{ color: colors.textSubtle }} className="text-[11px]">
                    {currInfo.symbol}{currInfo.minBudget.toLocaleString()}
                  </Text>
                  <Text style={{ color: colors.textSubtle }} className="text-[11px]">
                    {currInfo.symbol}{midBenchmark.toLocaleString()}
                  </Text>
                  <Text style={{ color: colors.textSubtle }} className="text-[11px]">
                    {currInfo.symbol}{currInfo.maxBudget.toLocaleString()}+
                  </Text>
                </View>
              </View>

              {/* Stepper Buttons */}
              <View className="flex-row justify-center gap-2 mt-4">
                {currInfo.steppers.map((delta) => {
                  const stepperLabel = delta > 0
                    ? `+${currInfo.code === 'JPY' ? `${delta / 1000}k` : delta}`
                    : `${currInfo.code === 'JPY' ? `${delta / 1000}k` : delta}`;
                  return (
                    <TouchableOpacity
                      key={delta}
                      activeOpacity={0.7}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setBudget(Math.max(Math.round(currInfo.minBudget * 0.5), monthlyBudget + delta));
                      }}
                      style={{
                        backgroundColor: colors.cardAlt,
                        borderColor: colors.border,
                      }}
                      className="border px-3.5 py-2 rounded-xl">
                      <Text
                        style={{ color: colors.text }}
                        className="text-xs font-bold">
                        {stepperLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Quick Presets */}
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider mb-2.5">
              Quick Budget Benchmarks
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {currInfo.benchmarks.map((amt) => {
                const isSelected = monthlyBudget === amt;
                return (
                  <TouchableOpacity
                    key={amt}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setBudget(amt);
                    }}
                    style={{
                      backgroundColor: isSelected ? colors.accentSoft : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    }}
                    className="px-3.5 py-2.5 rounded-xl border">
                    <Text
                      style={{
                        color: isSelected ? colors.accentText : colors.text,
                      }}
                      className="text-xs font-semibold">
                      {currInfo.symbol}{amt.toLocaleString()}/mo
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* SCREEN 3: LIFESTYLE & PRIORITIES */}
        {currentStep === 3 && (
          <Animated.View entering={FadeInRight.duration(260)}>
            <View className="mb-5">
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase tracking-widest">
                Lifestyle & Amenities
              </Text>
              <Text
                style={{ color: colors.text }}
                className="text-2xl font-bold mt-1">
                What matters most?
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs mt-1.5 leading-relaxed">
                We calibrate district suggestions and cost allocations according to your habits.
              </Text>
            </View>

            <View className="gap-2.5">
              {LIFESTYLE_OPTIONS.map((opt) => {
                const isSelected = lifestyleTags.includes(opt.id);
                const IconComponent = opt.icon;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      toggleLifestyleTag(opt.id);
                    }}
                    style={{
                      backgroundColor: isSelected ? colors.accentSoft : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    }}
                    className="p-4 rounded-2xl border flex-row items-center justify-between shadow-sm">
                    <View className="flex-row items-center gap-3">
                      <View
                        style={{
                          backgroundColor: isSelected ? colors.accent : colors.cardAlt,
                        }}
                        className="w-9 h-9 rounded-xl items-center justify-center">
                        <IconComponent
                          size={17}
                          color={isSelected ? '#FFFFFF' : colors.textSubtle}
                        />
                      </View>
                      <Text
                        style={{
                          color: isSelected ? colors.accentText : colors.text,
                        }}
                        className="text-sm font-semibold">
                        {opt.label}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: isSelected ? colors.accent : 'transparent',
                        borderColor: isSelected ? colors.accent : colors.border,
                      }}
                      className="w-5 h-5 rounded-full items-center justify-center border">
                      {isSelected && <Check size={12} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* SCREEN 4: HOUSEHOLD & MOBILITY */}
        {currentStep === 4 && (
          <Animated.View entering={FadeInRight.duration(260)}>
            <View className="mb-5">
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase tracking-widest">
                Household & Relocation Logistics
              </Text>
              <Text
                style={{ color: colors.text }}
                className="text-2xl font-bold mt-1">
                Who is relocating?
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs mt-1.5 leading-relaxed">
                Apartment sizes, grocery baskets, and transit costs are dynamically scaled.
              </Text>
            </View>

            {/* Household setup */}
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider mb-2.5">
              Household Setup
            </Text>
            <View className="flex-row gap-2.5 mb-5">
              {[
                { id: 'solo', label: 'Solo' },
                { id: 'couple', label: 'Couple' },
                { id: 'family', label: 'With Kids' },
              ].map((item) => {
                const isSelected = familyStatus === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setFamilyStatus(item.id as any);
                    }}
                    style={{
                      backgroundColor: isSelected ? colors.accentSoft : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    }}
                    className="flex-1 p-3.5 rounded-2xl border items-center shadow-sm">
                    <Users
                      size={18}
                      color={isSelected ? colors.accent : colors.textSubtle}
                    />
                    <Text
                      style={{
                        color: isSelected ? colors.accentText : colors.text,
                      }}
                      className="text-xs font-bold mt-1.5 text-center">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Commute preference */}
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider mb-2.5">
              Primary Mobility
            </Text>
            <View className="flex-row flex-wrap gap-2.5 mb-5">
              {[
                { id: 'transit', label: 'Public Transit', icon: Train },
                { id: 'walk', label: 'Walk & Bike Only', icon: Footprints },
                { id: 'bike', label: 'Scooter / Moped', icon: Bike },
                { id: 'car', label: 'Private Car / Ride', icon: Car },
              ].map((item) => {
                const isSelected = commutePreference === item.id;
                const IconComp = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setCommutePreference(item.id as any);
                    }}
                    style={{
                      width: '48%',
                      backgroundColor: isSelected ? colors.accentSoft : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    }}
                    className="p-3.5 rounded-2xl border flex-row items-center gap-2.5 shadow-sm">
                    <IconComp
                      size={17}
                      color={isSelected ? colors.accent : colors.textSubtle}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isSelected ? colors.accentText : colors.text,
                      }}
                      className="text-xs font-semibold flex-1">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Relocation Horizon */}
            <Text
              style={{ color: colors.textSubtle }}
              className="text-xs font-bold uppercase tracking-wider mb-2.5">
              Target Horizon
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {[
                { id: 'immediate', label: 'Immediate (< 1 mo)' },
                { id: '3_months', label: 'Within 3 Months' },
                { id: '6_months', label: '6+ Months' },
                { id: 'exploring', label: 'Just Exploring' },
              ].map((item) => {
                const isSelected = timeline === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setTimeline(item.id as any);
                    }}
                    style={{
                      backgroundColor: isSelected ? colors.accentSoft : colors.card,
                      borderColor: isSelected ? colors.accent : colors.border,
                    }}
                    className="px-3.5 py-2 rounded-xl border shadow-sm">
                    <Text
                      style={{
                        color: isSelected ? colors.accentText : colors.text,
                      }}
                      className="text-xs font-semibold">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View
        style={{
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        }}
        className="absolute bottom-0 left-0 right-0 border-t px-5 py-4 flex-row items-center gap-3">
        {currentStep > 1 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBack}
            style={{
              backgroundColor: colors.cardAlt,
              borderColor: colors.border,
            }}
            className="w-12 h-12 rounded-2xl border items-center justify-center shrink-0">
            <ArrowLeft size={18} color={colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNext}
          style={{ backgroundColor: colors.accent }}
          className="flex-1 py-3.5 px-5 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm">
          <Text className="text-white font-bold text-sm">
            {currentStep === totalSteps
              ? 'Generate Reality Check'
              : 'Continue to Next Step'}
          </Text>
          {currentStep === totalSteps ? (
            <Sparkles size={16} color="#FFFFFF" />
          ) : (
            <ArrowRight size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
