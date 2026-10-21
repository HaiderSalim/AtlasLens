export interface RealityCheckReport {
  id: string;
  city: string;
  country: string;
  createdAt: string;
  feasibilityScore: number; // 0 - 100
  verdict: 'Comfortable' | 'Tight' | 'Unrealistic';
  userBudgetUSD: number;
  currency: string;
  budgetBreakdown: {
    totalEstimatedUSD: number;
    housing: number;
    groceriesDining: number;
    utilitiesAndWifi: number;
    transport: number;
    currencySymbol: string;
  };
  neighborhoods: Array<{
    name: string;
    vibe: string;
    safetyIndex: number;
    amenityHighlights: string[];
    mapCoords: { lat: number; lng: number };
  }>;
  brutallyHonestWarnings: Array<{
    type: 'weather' | 'cost' | 'culture' | 'logistics';
    headline: string;
    detail: string;
  }>;
}

export interface IntakeFormData {
  destination: string;
  country: string;
  monthlyBudget: number;
  currency: string;
  lifestyleTags: string[];
  familyStatus: 'solo' | 'couple' | 'family';
  commutePreference: 'transit' | 'walk' | 'bike' | 'car';
  timeline: 'immediate' | '3_months' | '6_months' | 'exploring';
}

