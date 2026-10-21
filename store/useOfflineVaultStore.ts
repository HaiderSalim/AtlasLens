import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RealityCheckReport } from '@/types/report';
import { INITIAL_PRESEEDED_REPORTS } from '@/services/reportGenerator';
import { supabase, isSupabaseConfigured } from '@/services/supabase';

const VAULT_STORAGE_KEY = '@atlaslens_offline_vault_v1';
const BOOKMARKS_STORAGE_KEY = '@atlaslens_bookmarks_v1';

interface OfflineVaultState {
  reports: Record<string, RealityCheckReport>;
  bookmarkedIds: string[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  saveReport: (report: RealityCheckReport) => Promise<void>;
  toggleBookmark: (report: RealityCheckReport) => Promise<boolean>;
  removeBookmark: (reportId: string) => Promise<void>;
  isBookmarked: (reportId: string) => boolean;
  getReportById: (id: string) => RealityCheckReport | undefined;
}

export const useOfflineVaultStore = create<OfflineVaultState>((set, get) => ({
  reports: {},
  bookmarkedIds: [],
  isHydrated: false,

  hydrate: async () => {
    try {
      const storedReportsJson = await AsyncStorage.getItem(VAULT_STORAGE_KEY);
      const storedBookmarksJson = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);

      let reportsMap: Record<string, RealityCheckReport> = {};
      let bookmarkList: string[] = [];

      if (storedReportsJson) {
        reportsMap = JSON.parse(storedReportsJson);
      } else {
        // Pre-populate with seed reports on first launch
        INITIAL_PRESEEDED_REPORTS.forEach((report) => {
          reportsMap[report.id] = report;
        });
        await AsyncStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(reportsMap));
      }

      if (storedBookmarksJson) {
        bookmarkList = JSON.parse(storedBookmarksJson);
      } else {
        // By default bookmark the first two reports for offline demonstration
        bookmarkList = [INITIAL_PRESEEDED_REPORTS[0].id, INITIAL_PRESEEDED_REPORTS[1].id];
        await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkList));
      }

      set({
        reports: reportsMap,
        bookmarkedIds: bookmarkList,
        isHydrated: true,
      });
    } catch (err) {
      console.warn('Failed to hydrate offline vault:', err);
      // Fallback in-memory
      const fallbackMap: Record<string, RealityCheckReport> = {};
      INITIAL_PRESEEDED_REPORTS.forEach((r) => {
        fallbackMap[r.id] = r;
      });
      set({
        reports: fallbackMap,
        bookmarkedIds: [INITIAL_PRESEEDED_REPORTS[0].id],
        isHydrated: true,
      });
    }
  },

  saveReport: async (report: RealityCheckReport) => {
    const updatedReports = { ...get().reports, [report.id]: report };
    set({ reports: updatedReports });

    try {
      await AsyncStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updatedReports));

      // Attempt cloud sync if Supabase is connected
      if (isSupabaseConfigured()) {
        try {
          await supabase.from('reality_check_reports').upsert({
            id: report.id,
            city: report.city,
            country: report.country,
            feasibility_score: report.feasibilityScore,
            verdict: report.verdict,
            report_data: report,
            updated_at: new Date().toISOString(),
          });
        } catch (supabaseErr) {
          console.log('Supabase sync skipped (offline or table not ready):', supabaseErr);
        }
      }
    } catch (e) {
      console.error('Error saving report to AsyncStorage:', e);
    }
  },

  toggleBookmark: async (report: RealityCheckReport) => {
    const { bookmarkedIds, reports, saveReport } = get();
    const isCurrentlyBookmarked = bookmarkedIds.includes(report.id);
    let updatedBookmarks: string[];

    if (isCurrentlyBookmarked) {
      updatedBookmarks = bookmarkedIds.filter((id) => id !== report.id);
    } else {
      updatedBookmarks = [...bookmarkedIds, report.id];
    }

    // Ensure report is also saved in reports cache
    if (!reports[report.id]) {
      await saveReport(report);
    }

    set({ bookmarkedIds: updatedBookmarks });

    try {
      await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
    } catch (e) {
      console.error('Error toggling bookmark:', e);
    }

    return !isCurrentlyBookmarked;
  },

  removeBookmark: async (reportId: string) => {
    const updatedBookmarks = get().bookmarkedIds.filter((id) => id !== reportId);
    set({ bookmarkedIds: updatedBookmarks });

    try {
      await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
    } catch (e) {
      console.error('Error removing bookmark:', e);
    }
  },

  isBookmarked: (reportId: string) => {
    return get().bookmarkedIds.includes(reportId);
  },

  getReportById: (id: string) => {
    return get().reports[id];
  },
}));

