import { IntakeFormData, RealityCheckReport } from '@/types/report';
import { getCurrencyInfo } from '@/constants/Currencies';

interface CityBaseline {
  country: string;
  currencySymbol: string;
  exchangeRateToUSD: number;
  baseHousing: number;
  baseGroceries: number;
  baseUtilities: number;
  baseTransport: number;
  safetyScore: number;
  neighborhoods: Array<{
    name: string;
    vibe: string;
    safetyIndex: number;
    amenityHighlights: string[];
    mapCoords: { lat: number; lng: number };
  }>;
  warnings: Array<{
    type: 'weather' | 'cost' | 'culture' | 'logistics';
    headline: string;
    detail: string;
  }>;
}

export const CITY_BASELINES: Record<string, CityBaseline> = {
  Lisbon: {
    country: 'Portugal',
    currencySymbol: '€',
    exchangeRateToUSD: 1.08,
    baseHousing: 1250,
    baseGroceries: 380,
    baseUtilities: 160,
    baseTransport: 50,
    safetyScore: 84,
    neighborhoods: [
      {
        name: 'Príncipe Real',
        vibe: 'Chic, botanical gardens, artisanal bakeries & expat coworking',
        safetyIndex: 91,
        amenityHighlights: ['Specialty Coffee', 'Coworking Spaces', 'Metro Baixa-Chiado', 'Bio Supermarket'],
        mapCoords: { lat: 38.718, lng: -9.149 },
      },
      {
        name: 'Arroios',
        vibe: 'Multicultural, vibrant street food, walkable & creative hub',
        safetyIndex: 82,
        amenityHighlights: ['Green Line Metro', 'Cheap Local Markets', 'Fitness Studios', 'Late Night Dining'],
        mapCoords: { lat: 38.732, lng: -9.133 },
      },
      {
        name: 'Parque das Nações',
        vibe: 'Modern waterfront, calm family living & ultra-fast fiber',
        safetyIndex: 94,
        amenityHighlights: ['Ocean Walkways', 'Orient Station', 'Modern Gyms', 'International Schools'],
        mapCoords: { lat: 38.768, lng: -9.098 },
      },
    ],
    warnings: [
      {
        type: 'weather',
        headline: 'Poor Home Insulation in Winter',
        detail: 'Portuguese flats lack central heating. Winter indoor temperatures can dip below 14°C without expensive electric radiators.',
      },
      {
        type: 'cost',
        headline: 'Rental Deposit Customs',
        detail: 'Landlords regularly demand 3 to 6 months of rent upfront + a Portuguese guarantor (fiador) from non-EU residents.',
      },
      {
        type: 'logistics',
        headline: 'AIMA Immigration Backlogs',
        detail: 'Residency card renewals and family reunification appointments currently face multi-month administrative delays.',
      },
      {
        type: 'culture',
        headline: 'Slower Bureaucracy Pace',
        detail: 'Opening a bank account and obtaining a NIF tax number requires patience and multiple in-person appointments.',
      },
    ],
  },
  Tokyo: {
    country: 'Japan',
    currencySymbol: '¥',
    exchangeRateToUSD: 0.0066,
    baseHousing: 1100,
    baseGroceries: 520,
    baseUtilities: 180,
    baseTransport: 110,
    safetyScore: 93,
    neighborhoods: [
      {
        name: 'Shimokitazawa',
        vibe: 'Vintage indie boutiques, vinyl bars & quiet pedestrian alleys',
        safetyIndex: 96,
        amenityHighlights: ['Odakyu Express Line', 'Cozy Cafes', '24h Convenience Stores', 'Live Music Hubs'],
        mapCoords: { lat: 35.661, lng: 139.667 },
      },
      {
        name: 'Kichijoji',
        vibe: 'Inokashira Park greenery, family-friendly & excellent transit',
        safetyIndex: 95,
        amenityHighlights: ['Chuo Line (Fast to Shinjuku)', 'Botanical Park', 'Depachika Food Halls', 'Organic Groceries'],
        mapCoords: { lat: 35.703, lng: 139.580 },
      },
    ],
    warnings: [
      {
        type: 'weather',
        headline: 'Brutal Summer Humidity & Typhoons',
        detail: 'July-August brings 38°C wet-bulb heatwaves; typhoon season in September causes occasional train halts.',
      },
      {
        type: 'cost',
        headline: 'Key Money (Reikin)',
        detail: 'Non-refundable gift money of 1-2 months rent to the landlord is still standard practice in Japanese leases.',
      },
      {
        type: 'culture',
        headline: 'Strict Garbage Sorting & Noise Rules',
        detail: 'Municipalities mandate specific colored trash bags and strict day schedules; thin apartment walls require low volume.',
      },
    ],
  },
  Berlin: {
    country: 'Germany',
    currencySymbol: '€',
    exchangeRateToUSD: 1.08,
    baseHousing: 1350,
    baseGroceries: 410,
    baseUtilities: 230,
    baseTransport: 65,
    safetyScore: 81,
    neighborhoods: [
      {
        name: 'Prenzlauer Berg',
        vibe: 'Leafy boulevards, flea markets, organic cafes & stroller-friendly',
        safetyIndex: 90,
        amenityHighlights: ['Mauerpark', 'U2 Subway Line', 'Specialty Bakeries', 'Coworking Cafes'],
        mapCoords: { lat: 52.538, lng: 13.418 },
      },
      {
        name: 'Neukölln (Reuterkiez)',
        vibe: 'High energy, canalside beers, international arts & nightlife',
        safetyIndex: 78,
        amenityHighlights: ['Maybachufer Market', 'U8 Transit', 'Independent Books', '24/7 Kiosks'],
        mapCoords: { lat: 52.486, lng: 13.435 },
      },
    ],
    warnings: [
      {
        type: 'weather',
        headline: 'Seasonal Affective Slump (Nov–Feb)',
        detail: 'Berlin experiences less than 2 hours of direct daily sunlight in winter. High-dose Vitamin D is essential.',
      },
      {
        type: 'logistics',
        headline: 'Anmeldung (City Registration) Bottle-Neck',
        detail: 'Securing an appointment at the Bürgeramt to register your address can take 6-10 weeks, blocking tax ID creation.',
      },
      {
        type: 'cost',
        headline: 'Competitive Flat Hunting (Mietendeckel Aftermath)',
        detail: 'Expect 80+ applicants per viewing for any 1-bedroom flat under €1,200. Bring complete Schufa credit dossiers.',
      },
    ],
  },
  Valencia: {
    country: 'Spain',
    currencySymbol: '€',
    exchangeRateToUSD: 1.08,
    baseHousing: 980,
    baseGroceries: 330,
    baseUtilities: 140,
    baseTransport: 40,
    safetyScore: 88,
    neighborhoods: [
      {
        name: 'Ruzafa',
        vibe: 'Trendy bohemian quarter, terrace tapas bars & bicycle lanes',
        safetyIndex: 89,
        amenityHighlights: ['Ruzafa Municipal Market', 'Turia Gardens Link', 'Coworking Lounges', 'Boutique Gyms'],
        mapCoords: { lat: 39.462, lng: -0.372 },
      },
      {
        name: 'El Carmen',
        vibe: 'Historic cobblestone streets, vibrant murals & quiet plazas',
        safetyIndex: 85,
        amenityHighlights: ['Old City Gates', 'Local Tapas', 'Art Galleries', 'Valenbisi Bike Stations'],
        mapCoords: { lat: 39.478, lng: -0.380 },
      },
    ],
    warnings: [
      {
        type: 'weather',
        headline: 'Intense August Heat Waves',
        detail: 'Humid Mediterranean summer temperatures reach 38°C; ensure your rental has inverter A/C in both salon and bedrooms.',
      },
      {
        type: 'culture',
        headline: 'Fallas Festival Firecrackers (March)',
        detail: 'The city transforms into an 18-day continuous pyrotechnic and music celebration. Pets may suffer anxiety.',
      },
      {
        type: 'logistics',
        headline: 'NIE Police Appointments',
        detail: 'Getting a foreigner tax number (NIE) requires monitoring the police portal daily at 9:00 AM for fresh slots.',
      },
    ],
  },
  Dubai: {
    country: 'United Arab Emirates',
    currencySymbol: 'AED',
    exchangeRateToUSD: 0.27,
    baseHousing: 2100,
    baseGroceries: 580,
    baseUtilities: 260,
    baseTransport: 160,
    safetyScore: 97,
    neighborhoods: [
      {
        name: 'Dubai Marina',
        vibe: 'High-rise waterfront promenade, luxury gyms & yacht views',
        safetyIndex: 98,
        amenityHighlights: ['Marina Walk', 'DMCC Metro Station', 'Beach Access (JBR)', '24/7 Carrefour Market'],
        mapCoords: { lat: 25.076, lng: 55.140 },
      },
      {
        name: 'Jumeirah Village Circle (JVC)',
        vibe: 'Affordable mid-rise community, quiet parks & pet friendly',
        safetyIndex: 96,
        amenityHighlights: ['Community Parks', 'Circle Mall', 'Private Gyms', 'International Veterinary Clinics'],
        mapCoords: { lat: 25.059, lng: 55.208 },
      },
    ],
    warnings: [
      {
        type: 'weather',
        headline: 'Extreme Summer Temperatures (48°C+)',
        detail: 'Outdoor activities are unviable from June through September; life shifts entirely to air-conditioned indoors.',
      },
      {
        type: 'cost',
        headline: 'Rent Paid in Cheques (1 to 4 instalments)',
        detail: 'Annual leases are traditionally secured via 1 to 4 post-dated cheques, requiring significant liquid capital upfront.',
      },
      {
        type: 'culture',
        headline: 'Zero-Tolerance Laws',
        detail: 'Strict regulations regarding public behavior, bounced cheques, and prescription medicine importations.',
      },
    ],
  },
};

export function generateRealityCheckReport(input: IntakeFormData): RealityCheckReport {
  // Normalize destination name
  const cityKey = Object.keys(CITY_BASELINES).find(
    (k) => k.toLowerCase() === input.destination.trim().toLowerCase()
  ) || 'Lisbon';

  const baseline = CITY_BASELINES[cityKey];

  // Adjust baseline based on family & lifestyle
  let housingMultiplier = 1.0;
  if (input.familyStatus === 'couple') housingMultiplier = 1.35;
  if (input.familyStatus === 'family') housingMultiplier = 1.85;

  let groceriesMultiplier = 1.0;
  if (input.familyStatus === 'couple') groceriesMultiplier = 1.7;
  if (input.familyStatus === 'family') groceriesMultiplier = 2.4;

  let transportCost = baseline.baseTransport;
  if (input.commutePreference === 'car') transportCost *= 2.8;
  if (input.commutePreference === 'walk') transportCost *= 0.4;

  const currInfo = getCurrencyInfo(input.currency);
  const rate = currInfo.rateFromUSD || 1.0;
  const isJPY = currInfo.code === 'JPY';
  const roundCost = (amt: number) =>
    isJPY ? Math.round((amt * rate) / 100) * 100 : Math.round(amt * rate);

  const estimatedHousing = roundCost(baseline.baseHousing * housingMultiplier);
  const estimatedGroceries = roundCost(baseline.baseGroceries * groceriesMultiplier);
  const estimatedUtilities = roundCost(
    baseline.baseUtilities * (input.familyStatus === 'family' ? 1.5 : 1.1)
  );
  const estimatedTransport = roundCost(transportCost);

  const totalEstimated =
    estimatedHousing + estimatedGroceries + estimatedUtilities + estimatedTransport;
  const userBudget = input.monthlyBudget;

  // Feasibility Score calculation (0 - 100)
  const budgetRatio = userBudget / (totalEstimated || 1);
  let feasibilityScore = Math.min(100, Math.max(10, Math.round(budgetRatio * 75)));

  let verdict: 'Comfortable' | 'Tight' | 'Unrealistic' = 'Tight';
  if (budgetRatio >= 1.25) {
    verdict = 'Comfortable';
    feasibilityScore = Math.min(98, Math.max(80, feasibilityScore));
  } else if (budgetRatio < 0.88) {
    verdict = 'Unrealistic';
    feasibilityScore = Math.min(48, Math.max(15, feasibilityScore));
  } else {
    verdict = 'Tight';
    feasibilityScore = Math.min(78, Math.max(50, feasibilityScore));
  }

  const id = `${cityKey.toLowerCase()}-${Date.now().toString(36)}`;

  return {
    id,
    city: cityKey,
    country: baseline.country,
    createdAt: new Date().toISOString(),
    feasibilityScore,
    verdict,
    userBudgetUSD: userBudget,
    currency: currInfo.code,
    budgetBreakdown: {
      totalEstimatedUSD: totalEstimated,
      housing: estimatedHousing,
      groceriesDining: estimatedGroceries,
      utilitiesAndWifi: estimatedUtilities,
      transport: estimatedTransport,
      currencySymbol: currInfo.symbol,
    },
    neighborhoods: baseline.neighborhoods,
    brutallyHonestWarnings: baseline.warnings,
  };
}

// Pre-seeded initial dossiers for instant exploration & offline caching
export const INITIAL_PRESEEDED_REPORTS: RealityCheckReport[] = [
  generateRealityCheckReport({
    destination: 'Lisbon',
    country: 'Portugal',
    monthlyBudget: 2600,
    currency: 'USD',
    lifestyleTags: ['Remote Worker / Coworking', 'Strict Walkability', 'Nightlife & Dining'],
    familyStatus: 'solo',
    commutePreference: 'transit',
    timeline: '3_months',
  }),
  generateRealityCheckReport({
    destination: 'Tokyo',
    country: 'Japan',
    monthlyBudget: 2200,
    currency: 'USD',
    lifestyleTags: ['Quiet Suburban', 'Strict Walkability', 'Hates Cold/Rain'],
    familyStatus: 'solo',
    commutePreference: 'transit',
    timeline: '6_months',
  }),
  generateRealityCheckReport({
    destination: 'Valencia',
    country: 'Spain',
    monthlyBudget: 2100,
    currency: 'USD',
    lifestyleTags: ['Has Dog', 'Beach / Ocean Access', 'Strict Walkability'],
    familyStatus: 'couple',
    commutePreference: 'walk',
    timeline: 'immediate',
  }),
  generateRealityCheckReport({
    destination: 'Berlin',
    country: 'Germany',
    monthlyBudget: 1500,
    currency: 'USD',
    lifestyleTags: ['Remote Worker / Coworking', 'Nightlife & Dining'],
    familyStatus: 'solo',
    commutePreference: 'transit',
    timeline: 'exploring',
  }),
];

