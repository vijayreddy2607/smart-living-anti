// Mock intelligence data for the Smart Living Ecosystem
export type AreaRecommendation = {
  id: string;
  name: string;
  city: string;
  compatibility: number; // 0-100
  commuteMinutes: number;
  monthlyRent: number;
  monthlySpending: { rent: number; food: number; transport: number; lifestyle: number; utilities: number };
  savingsRemaining: number;
  lifestyleMatch: number;
  stressLevel: number; // 0-100
  sustainability: number;
  reviewSentiment: { positive: number; neutral: number; negative: number };
  vibe: string;
  highlights: string[];
  tradeoffs: { pro: string; con: string }[];
};

export type RoutineBlock = {
  label: string;
  start: string;
  end: string;
  type: "rest" | "commute" | "work" | "personal" | "social";
  stress: number;
};

export const recommendedAreas: AreaRecommendation[] = [
  {
    id: "kharadi",
    name: "Kharadi",
    city: "Pune",
    compatibility: 92,
    commuteMinutes: 18,
    monthlyRent: 24000,
    monthlySpending: { rent: 24000, food: 9000, transport: 3500, lifestyle: 6000, utilities: 2500 },
    savingsRemaining: 23000,
    lifestyleMatch: 88,
    stressLevel: 28,
    sustainability: 86,
    reviewSentiment: { positive: 74, neutral: 18, negative: 8 },
    vibe: "Tech corridor · cafés · walkable",
    highlights: ["EON IT Park 12 min", "Quiet residential pockets", "Strong food scene"],
    tradeoffs: [
      { pro: "Lowest commute stress in your shortlist", con: "Premium rent vs nearby suburbs" },
      { pro: "High lifestyle compatibility", con: "Weekend traffic spikes near malls" },
    ],
  },
  {
    id: "wagholi",
    name: "Wagholi",
    city: "Pune",
    compatibility: 78,
    commuteMinutes: 42,
    monthlyRent: 14500,
    monthlySpending: { rent: 14500, food: 8000, transport: 5500, lifestyle: 4500, utilities: 2200 },
    savingsRemaining: 33300,
    lifestyleMatch: 71,
    stressLevel: 58,
    sustainability: 72,
    reviewSentiment: { positive: 58, neutral: 26, negative: 16 },
    vibe: "Emerging suburb · spacious · calm",
    highlights: ["Newer apartments", "Lower cost of living", "Green spaces nearby"],
    tradeoffs: [
      { pro: "Adds ₹10k/mo to your savings", con: "Adds ~80 min/day commute" },
      { pro: "Larger living space for the same budget", con: "Limited late-night options" },
    ],
  },
  {
    id: "viman-nagar",
    name: "Viman Nagar",
    city: "Pune",
    compatibility: 84,
    commuteMinutes: 26,
    monthlyRent: 27000,
    monthlySpending: { rent: 27000, food: 10500, transport: 3000, lifestyle: 7500, utilities: 2500 },
    savingsRemaining: 17500,
    lifestyleMatch: 91,
    stressLevel: 36,
    sustainability: 80,
    reviewSentiment: { positive: 70, neutral: 20, negative: 10 },
    vibe: "Cosmopolitan · social · airport-close",
    highlights: ["Phoenix Mall 8 min", "Strong gym & wellness scene", "International cuisine"],
    tradeoffs: [
      { pro: "Best lifestyle match overall", con: "Highest monthly burn" },
      { pro: "Diverse community", con: "Tight savings buffer" },
    ],
  },
];

export const routineTimeline: RoutineBlock[] = [
  { label: "Wake up & morning ritual", start: "06:30", end: "07:30", type: "personal", stress: 10 },
  { label: "Commute to work", start: "08:15", end: "08:45", type: "commute", stress: 35 },
  { label: "Deep work block", start: "09:00", end: "13:00", type: "work", stress: 45 },
  { label: "Lunch & walk", start: "13:00", end: "14:00", type: "personal", stress: 15 },
  { label: "Meetings & shipping", start: "14:00", end: "18:30", type: "work", stress: 55 },
  { label: "Commute home", start: "18:45", end: "19:15", type: "commute", stress: 30 },
  { label: "Gym / movement", start: "19:30", end: "20:30", type: "personal", stress: 18 },
  { label: "Dinner & wind down", start: "20:45", end: "22:00", type: "social", stress: 12 },
  { label: "Sleep", start: "23:00", end: "06:30", type: "rest", stress: 5 },
];

export const reviewKeywords = [
  { word: "Quiet streets", weight: 92, sentiment: "positive" as const },
  { word: "Great cafés", weight: 88, sentiment: "positive" as const },
  { word: "Walkable", weight: 81, sentiment: "positive" as const },
  { word: "Safe at night", weight: 78, sentiment: "positive" as const },
  { word: "Weekend traffic", weight: 64, sentiment: "negative" as const },
  { word: "Water supply", weight: 41, sentiment: "negative" as const },
  { word: "Helpful neighbours", weight: 70, sentiment: "positive" as const },
  { word: "Parking tight", weight: 38, sentiment: "negative" as const },
];
