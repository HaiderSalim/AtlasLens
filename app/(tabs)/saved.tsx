import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Bookmark,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HardDriveDownload,
  Sparkles,
  MapPin,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react-native';
import { useOfflineVaultStore } from '@/store/useOfflineVaultStore';
import { useTheme } from '@/store/useThemeStore';

export default function SavedScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [filter, setFilter] = useState<'All' | 'Comfortable' | 'Tight' | 'Unrealistic'>('All');

  const { reports, bookmarkedIds, removeBookmark } = useOfflineVaultStore();

  const bookmarkedReports = bookmarkedIds
    .map((id) => reports[id])
    .filter(Boolean);

  const filteredReports = bookmarkedReports.filter((report) => {
    if (filter === 'All') return true;
    return report.verdict === filter;
  });

  const handleOpenReport = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/report/${id}`);
  };

  const handleDeleteBookmark = (id: string, cityName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Remove Dossier',
      `Remove ${cityName} from your offline saved vault?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            removeBookmark(id);
          },
        },
      ]
    );
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
              <HardDriveDownload size={17} color={colors.accent} />
              <Text
                style={{ color: colors.accent }}
                className="text-xs font-bold uppercase tracking-widest">
                Offline Vault
              </Text>
            </View>
            <Text
              style={{ color: colors.text }}
              className="text-2xl font-bold tracking-tight mt-0.5">
              Saved Dossiers
            </Text>
            <Text
              style={{ color: colors.textMuted }}
              className="text-xs mt-1">
              {bookmarkedReports.length} dossiers persisted for zero-roaming / airplane mode access.
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

        {/* Filter Pills */}
        <View className="px-5 mb-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {(['All', 'Comfortable', 'Tight', 'Unrealistic'] as const).map((tab) => {
              const selected = filter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.7}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setFilter(tab);
                  }}
                  style={{
                    backgroundColor: selected ? colors.accentSoft : colors.card,
                    borderColor: selected ? colors.accent : colors.border,
                  }}
                  className="px-3.5 py-1.5 rounded-full border shadow-sm">
                  <Text
                    style={{
                      color: selected ? colors.accentText : colors.textMuted,
                    }}
                    className="text-xs font-semibold">
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Reports List */}
        <View className="px-5">
          {filteredReports.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="border rounded-3xl p-8 items-center justify-center my-6 shadow-sm">
              <Bookmark size={36} color={colors.textSubtle} />
              <Text
                style={{ color: colors.text }}
                className="text-base font-bold mt-4 text-center">
                No Dossiers in this Filter
              </Text>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs text-center mt-1.5 max-w-xs leading-relaxed">
                Save reports from the Reality Check dashboard to evaluate offline.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/wizard')}
                style={{ backgroundColor: colors.accent }}
                className="mt-5 py-3 px-5 rounded-xl flex-row items-center gap-2 shadow-sm">
                <Sparkles size={15} color="#FFFFFF" />
                <Text className="text-white font-bold text-xs">
                  Run New Reality Check
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-3.5">
              {filteredReports.map((report, idx) => {
                const isComfortable = report.verdict === 'Comfortable';
                const isTight = report.verdict === 'Tight';
                const symbol = report.budgetBreakdown.currencySymbol || '$';
                return (
                  <Animated.View
                    key={report.id}
                    entering={FadeInDown.duration(300).delay(idx * 60)}
                    style={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    }}
                    className="border rounded-2xl p-4 shadow-sm">
                    {/* Top row */}
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-row items-center gap-2 flex-1">
                        <MapPin size={17} color={colors.accent} />
                        <View>
                          <Text
                            style={{ color: colors.text }}
                            className="text-lg font-bold">
                            {report.city}
                          </Text>
                          <Text
                            style={{ color: colors.textSubtle }}
                            className="text-xs">
                            {report.country}
                          </Text>
                        </View>
                      </View>

                      {/* Verdict Badge */}
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
                        className="px-3 py-1 rounded-full flex-row items-center gap-1.5 border">
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
                          {report.verdict} ({report.feasibilityScore}%)
                        </Text>
                      </View>
                    </View>

                    {/* Cost summary breakdown */}
                    <View
                      style={{
                        backgroundColor: colors.cardAlt,
                        borderColor: colors.borderSubtle,
                      }}
                      className="p-3 rounded-xl border flex-row justify-between mb-3">
                      <View>
                        <Text
                          style={{ color: colors.textSubtle }}
                          className="text-[11px] uppercase font-semibold">
                          Your Budget
                        </Text>
                        <Text
                          style={{ color: colors.text }}
                          className="text-sm font-bold mt-0.5">
                          {symbol}{report.userBudgetUSD.toLocaleString()}/mo
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={{ color: colors.textSubtle }}
                          className="text-[11px] uppercase font-semibold">
                          Est. Total
                        </Text>
                        <Text
                          style={{ color: colors.accent }}
                          className="text-sm font-bold mt-0.5">
                          {symbol}{report.budgetBreakdown.totalEstimatedUSD.toLocaleString()}/mo
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={{ color: colors.textSubtle }}
                          className="text-[11px] uppercase font-semibold">
                          Rent
                        </Text>
                        <Text
                          style={{ color: colors.textMuted }}
                          className="text-sm font-bold mt-0.5">
                          {symbol}{report.budgetBreakdown.housing.toLocaleString()}/mo
                        </Text>
                      </View>
                    </View>

                    {/* Action row */}
                    <View
                      style={{ borderTopColor: colors.borderSubtle }}
                      className="flex-row items-center justify-between pt-2 border-t">
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleDeleteBookmark(report.id, report.city)}
                        style={{
                          backgroundColor: colors.roseSoft,
                          borderColor: isDark ? '#4D222A' : '#FECDD3',
                        }}
                        className="px-3 py-1.5 rounded-lg border flex-row items-center gap-1.5">
                        <Trash2 size={13} color={colors.rose} />
                        <Text
                          style={{ color: colors.roseText }}
                          className="text-xs font-semibold">
                          Remove
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleOpenReport(report.id)}
                        style={{
                          backgroundColor: colors.accentSoft,
                          borderColor: isDark ? '#1C403B' : '#CCFBF1',
                        }}
                        className="border px-3.5 py-1.5 rounded-xl flex-row items-center gap-1.5">
                        <Text
                          style={{ color: colors.accentText }}
                          className="text-xs font-bold">
                          View Dossier
                        </Text>
                        <ChevronRight size={14} color={colors.accent} />
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
