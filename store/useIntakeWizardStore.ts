import { create } from 'zustand';
import { IntakeFormData } from '@/types/report';
import { convertBudget } from '@/constants/Currencies';

interface IntakeWizardState extends IntakeFormData {
  currentStep: number;
  totalSteps: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDestination: (city: string, country?: string) => void;
  setBudget: (amount: number) => void;
  setCurrency: (currency: string) => void;
  toggleLifestyleTag: (tag: string) => void;
  setFamilyStatus: (status: 'solo' | 'couple' | 'family') => void;
  setCommutePreference: (commute: 'transit' | 'walk' | 'bike' | 'car') => void;
  setTimeline: (timeline: 'immediate' | '3_months' | '6_months' | 'exploring') => void;
  resetWizard: () => void;
  getFormData: () => IntakeFormData;
}

const INITIAL_DATA: IntakeFormData = {
  destination: 'Lisbon',
  country: 'Portugal',
  monthlyBudget: 2500,
  currency: 'USD',
  lifestyleTags: ['Remote Worker / Coworking', 'Strict Walkability'],
  familyStatus: 'solo',
  commutePreference: 'transit',
  timeline: '3_months',
};

export const useIntakeWizardStore = create<IntakeWizardState>((set, get) => ({
  ...INITIAL_DATA,
  currentStep: 1,
  totalSteps: 4,

  setStep: (step: number) => set({ currentStep: Math.min(Math.max(1, step), 4) }),

  nextStep: () => {
    const next = get().currentStep + 1;
    if (next <= get().totalSteps) {
      set({ currentStep: next });
    }
  },

  prevStep: () => {
    const prev = get().currentStep - 1;
    if (prev >= 1) {
      set({ currentStep: prev });
    }
  },

  setDestination: (city: string, country = '') => {
    set({ destination: city, country });
  },

  setBudget: (monthlyBudget: number) => {
    set({ monthlyBudget });
  },

  setCurrency: (newCurrency: string) => {
    const oldCurrency = get().currency;
    const currentBudget = get().monthlyBudget;
    const updatedBudget = convertBudget(currentBudget, oldCurrency, newCurrency);
    set({ currency: newCurrency, monthlyBudget: updatedBudget });
  },

  toggleLifestyleTag: (tag: string) => {
    const current = get().lifestyleTags;
    if (current.includes(tag)) {
      set({ lifestyleTags: current.filter((t) => t !== tag) });
    } else {
      set({ lifestyleTags: [...current, tag] });
    }
  },

  setFamilyStatus: (familyStatus) => {
    set({ familyStatus });
  },

  setCommutePreference: (commutePreference) => {
    set({ commutePreference });
  },

  setTimeline: (timeline) => {
    set({ timeline });
  },

  resetWizard: () => {
    set({ ...INITIAL_DATA, currentStep: 1 });
  },

  getFormData: () => {
    const state = get();
    return {
      destination: state.destination,
      country: state.country,
      monthlyBudget: state.monthlyBudget,
      currency: state.currency,
      lifestyleTags: state.lifestyleTags,
      familyStatus: state.familyStatus,
      commutePreference: state.commutePreference,
      timeline: state.timeline,
    };
  },
}));

