/**
 * @fileoverview Pattern Theme Mapping System - 自動推薦單字主題
 * @modified 2024-01-XX XX:XX - 已完成修改
 * @modified_by Assistant - 優化favorite句型主題映射
 * @modification_type feature
 * @status completed
 * @last_commit 2024-01-XX XX:XX
 * @feature 優化favorite句型的主題推薦規則，避免句型衝突
 */

// Pattern Theme Mapping System
// Automatically recommends word themes based on sentence pattern analysis

import { SentencePattern } from "@/types/learning-content";

export interface ThemeRecommendation {
  theme_id: number;
  theme_name: string;
  confidence: number; // 0-1, higher means more confident recommendation
  reason: string;
}

// Theme ID mapping for reference
export const THEME_IDS = {
  EMOTIONS: 1,
  COLORS: 2,
  SPORTS: 3,
  STATIONERY: 4,
  FRUITS: 5,
  FAST_FOOD: 6,
  BAKERY_SNACKS: 7,
  DAYS_OF_WEEK: 8,
  MONTHS: 9,
  SCHOOL_SUBJECTS: 10,
  AILMENTS: 11,
  COUNTRIES: 12,
  FURNITURE: 13,
  TOYS: 14,
  DRINKS: 15,
  MAIN_DISHES: 16,
  BUBBLE_TEA_TOPPINGS: 17,
  IDENTITY: 18, // 新增：身份主題
  PROFESSIONS: 19, // 新增：職業主題
  DAILY_ACTIONS: 20, // 新增：日常動作主題
  CLOTHING: 21, // 新增：衣物主題
  BUILDINGS_PLACES: 22, // 新增：建築物和地點主題
  NUMBERS: 23, // 新增：數字主題（與 API/前端一致）
  TIME_EXPRESSIONS: 24, // 新增：時間表達主題
} as const;

// Pattern analysis rules
const PATTERN_RULES = [
  // Specific "Do you have lunch at" pattern - highest priority for this exact sentence
  {
    keywords: ["do you have lunch at"],
    themes: [
      {
        id: THEME_IDS.BUILDINGS_PLACES,
        confidence: 1.0,
        reason:
          "Exact match for lunch location question (e.g., at school, at home)",
      },
      {
        id: THEME_IDS.TIME_EXPRESSIONS,
        confidence: 0.9,
        reason: "Time expression after 'at' (e.g., at 12 o'clock)",
      },
    ],
  },

  // Age-related patterns
  {
    keywords: ["old", "years old", "age"],
    themes: [
      {
        id: 23, // NUMBERS theme
        confidence: 0.9,
        reason: "Age patterns need number words for age values",
      },
    ],
  },

  // Color-related patterns
  {
    keywords: [
      "color",
      "colour",
      "red",
      "blue",
      "green",
      "yellow",
      "black",
      "white",
    ],
    themes: [
      {
        id: THEME_IDS.COLORS,
        confidence: 1.0,
        reason: "Direct color question",
      },
    ],
  },

  // School-related patterns (excluding favorite patterns to avoid conflicts)
  {
    keywords: ["subject", "school"],
    themes: [
      {
        id: THEME_IDS.SCHOOL_SUBJECTS,
        confidence: 1.0,
        reason: "School-related question",
      },
    ],
  },

  // Favorite patterns - specific theme matching
  {
    keywords: [
      "favorite toy",
      "favorite subject",
      "favorite color",
      "favorite food",
      "favorite sport",
      "favorite drink",
      "favorite fruit",
    ],
    themes: [
      {
        id: THEME_IDS.TOYS,
        confidence: 0.9,
        reason: "Favorite toy question",
      },
      {
        id: THEME_IDS.SCHOOL_SUBJECTS,
        confidence: 0.9,
        reason: "Favorite subject question",
      },
      {
        id: THEME_IDS.COLORS,
        confidence: 0.9,
        reason: "Favorite color question",
      },
      {
        id: THEME_IDS.FAST_FOOD,
        confidence: 0.9,
        reason: "Favorite food question",
      },
      {
        id: THEME_IDS.SPORTS,
        confidence: 0.9,
        reason: "Favorite sport question",
      },
      {
        id: THEME_IDS.DRINKS,
        confidence: 0.9,
        reason: "Favorite drink question",
      },
      {
        id: THEME_IDS.FRUITS,
        confidence: 0.9,
        reason: "Favorite fruit question",
      },
    ],
  },

  // Generic favorite patterns for dynamic theme matching
  {
    keywords: ["favorite"],
    themes: [
      {
        id: THEME_IDS.TOYS,
        confidence: 0.7,
        reason: "Common favorite items include toys",
      },
      {
        id: THEME_IDS.SCHOOL_SUBJECTS,
        confidence: 0.7,
        reason: "Common favorite items include school subjects",
      },
      {
        id: THEME_IDS.COLORS,
        confidence: 0.7,
        reason: "Common favorite items include colors",
      },
      {
        id: THEME_IDS.FAST_FOOD,
        confidence: 0.7,
        reason: "Common favorite items include food",
      },
      {
        id: THEME_IDS.SPORTS,
        confidence: 0.7,
        reason: "Common favorite items include sports",
      },
      {
        id: THEME_IDS.DRINKS,
        confidence: 0.7,
        reason: "Common favorite items include drinks",
      },
      {
        id: THEME_IDS.FRUITS,
        confidence: 0.7,
        reason: "Common favorite items include fruits",
      },
    ],
  },

  // What's your/his/her favorite [主題詞] patterns
  {
    keywords: [
      "what's your favorite",
      "what is your favorite",
      "what's his favorite",
      "what is his favorite",
      "what's her favorite",
      "what is her favorite",
    ],
    themes: [
      {
        id: THEME_IDS.TOYS,
        confidence: 0.8,
        reason: "Common favorite question pattern for toys",
      },
      {
        id: THEME_IDS.SCHOOL_SUBJECTS,
        confidence: 0.8,
        reason: "Common favorite question pattern for school subjects",
      },
      {
        id: THEME_IDS.COLORS,
        confidence: 0.8,
        reason: "Common favorite question pattern for colors",
      },
      {
        id: THEME_IDS.FAST_FOOD,
        confidence: 0.8,
        reason: "Common favorite question pattern for food",
      },
      {
        id: THEME_IDS.SPORTS,
        confidence: 0.8,
        reason: "Common favorite question pattern for sports",
      },
      {
        id: THEME_IDS.DRINKS,
        confidence: 0.8,
        reason: "Common favorite question pattern for drinks",
      },
      {
        id: THEME_IDS.FRUITS,
        confidence: 0.8,
        reason: "Common favorite question pattern for fruits",
      },
    ],
  },

  // Identity and profession patterns
  {
    keywords: ["who", "identity", "person", "family member", "relative"],
    themes: [
      {
        id: THEME_IDS.IDENTITY,
        confidence: 0.9,
        reason: "Identity question",
      },
      {
        id: THEME_IDS.PROFESSIONS,
        confidence: 0.8,
        reason: "Identity question often involves professions",
      },
    ],
  },

  // Student identity patterns
  {
    keywords: ["student", "are you a student"],
    themes: [
      {
        id: THEME_IDS.PROFESSIONS,
        confidence: 0.9,
        reason: "Student identity question",
      },
    ],
  },

  {
    keywords: [
      "teacher",
      "doctor",
      "nurse",
      "engineer",
      "artist",
      "worker",
      "job",
      "profession",
    ],
    themes: [
      {
        id: THEME_IDS.PROFESSIONS,
        confidence: 0.9,
        reason: "Profession question",
      },
    ],
  },

  // Daily actions patterns
  {
    keywords: [
      "wake up",
      "get up",
      "brush teeth",
      "wash face",
      "take a shower",
      "eat breakfast",
      "go to school",
      "study",
      "read",
      "write",
      "listen",
      "speak",
      "cook",
      "clean",
      "sleep",
      "work",
      "play",
      "watch TV",
      "drive",
      "walk",
      // 新增休閒娛樂活動
      "watch a movie",
      "go to the movies",
      "play video games",
      "play board games",
      "go shopping",
      "go swimming",
      "go hiking",
      "go camping",
      "go fishing",
      "go dancing",
      "go singing",
      "go painting",
      "go drawing",
      "go gardening",
      "go cycling",
      "go running",
      "wash",
      "car",
      "weekend",
    ],
    themes: [
      {
        id: THEME_IDS.DAILY_ACTIONS,
        confidence: 0.9,
        reason: "Daily routine or leisure activity question",
      },
    ],
  },

  // Clothing patterns
  {
    keywords: [
      "shirt",
      "pants",
      "dress",
      "skirt",
      "jacket",
      "coat",
      "sweater",
      "hat",
      "cap",
      "shoes",
      "sneakers",
      "boots",
      "socks",
      "underwear",
      "belt",
      "scarf",
      "gloves",
      "bag",
      "backpack",
      "wallet",
      "wear",
      "put on",
      "take off",
    ],
    themes: [
      {
        id: THEME_IDS.CLOTHING,
        confidence: 0.9,
        reason: "Clothing question",
      },
    ],
  },

  // Buildings and places patterns
  {
    keywords: [
      "school",
      "hospital",
      "library",
      "bank",
      "post office",
      "police station",
      "fire station",
      "restaurant",
      "cafe",
      "supermarket",
      "store",
      "shop",
      "market",
      "pharmacy",
      "gas station",
      "bus stop",
      "train station",
      "airport",
      "park",
      "museum",
      "cinema",
      "theater",
      "hotel",
      "office",
      "house",
      "apartment",
      "building",
      "street",
      "road",
      "bridge",
      "tower",
      "go to",
      "visit",
      "at",
    ],
    themes: [
      {
        id: THEME_IDS.BUILDINGS_PLACES,
        confidence: 0.9,
        reason: "Location or place question",
      },
    ],
  },

  // Stationery-related patterns
  {
    keywords: [
      "pen",
      "pencil",
      "eraser",
      "ruler",
      "book",
      "notebook",
      "marker",
    ],
    themes: [
      {
        id: THEME_IDS.STATIONERY,
        confidence: 0.9,
        reason: "Stationery question",
      },
    ],
  },

  // Sports-related patterns
  {
    keywords: ["sports", "basketball", "soccer", "tennis", "swimming"],
    themes: [
      {
        id: THEME_IDS.SPORTS,
        confidence: 0.9,
        reason: "Sports preference question",
      },
    ],
  },

  // "Would you like some _____?" specific pattern - prioritize drinks
  {
    keywords: ["would you like some"],
    themes: [
      {
        id: THEME_IDS.DRINKS,
        confidence: 0.95,
        reason: "Direct offer pattern typically for drinks",
      },
      {
        id: THEME_IDS.FAST_FOOD,
        confidence: 0.7,
        reason: "Could also be food items",
      },
      {
        id: THEME_IDS.BAKERY_SNACKS,
        confidence: 0.6,
        reason: "Could also be snacks",
      },
    ],
  },

  // Food-related patterns (general)
  {
    keywords: ["eat", "food", "like to eat", "would you like"],
    themes: [
      {
        id: THEME_IDS.FAST_FOOD,
        confidence: 0.8,
        reason: "Food preference question",
      },
      {
        id: THEME_IDS.BAKERY_SNACKS,
        confidence: 0.7,
        reason: "Food-related pattern",
      },
      { id: THEME_IDS.MAIN_DISHES, confidence: 0.8, reason: "Main food items" },
    ],
  },

  // Drink-related patterns
  {
    keywords: ["tea", "coffee", "water", "milk", "juice", "soda"],
    themes: [
      {
        id: THEME_IDS.DRINKS,
        confidence: 0.9,
        reason: "Drink-related question",
      },
    ],
  },

  // Location/Place patterns
  {
    keywords: ["where", "location", "from", "country", "city"],
    themes: [
      {
        id: THEME_IDS.COUNTRIES,
        confidence: 0.9,
        reason: "Location/origin question",
      },
    ],
  },

  // Location question patterns (Where's...)
  {
    keywords: ["where's", "where is"],
    themes: [
      {
        id: THEME_IDS.BUILDINGS_PLACES,
        confidence: 0.9,
        reason: "Location question for places",
      },
    ],
  },

  // Time-related patterns
  {
    keywords: ["time", "day", "today", "weekend", "lunch time"],
    themes: [
      {
        id: THEME_IDS.DAYS_OF_WEEK,
        confidence: 0.9,
        reason: "Day-related question",
      },
      { id: THEME_IDS.MONTHS, confidence: 0.7, reason: "Time-related pattern" },
    ],
  },

  // Time routine patterns (What time do you...)
  {
    keywords: ["what time do you", "time do you"],
    themes: [
      {
        id: THEME_IDS.DAILY_ACTIONS,
        confidence: 0.9,
        reason: "Daily routine time question",
      },
      {
        id: 24, // TIME_EXPRESSIONS theme
        confidence: 0.8,
        reason: "Time expressions needed for time answers",
      },
    ],
  },

  // Specific time-at patterns for lunch (e.g., "Do you lunch at ___?")
  // 支援時間和地點兩種主題 - 優先於一般時間規則
  {
    keywords: ["lunch at"],
    themes: [
      {
        id: THEME_IDS.BUILDINGS_PLACES,
        confidence: 0.9,
        reason: "Lunch location question (e.g., at school, at home)",
      },
      {
        id: THEME_IDS.TIME_EXPRESSIONS,
        confidence: 0.8,
        reason: "Time expression after 'at' (e.g., at 12 o'clock)",
      },
    ],
  },

  // Health-related patterns
  {
    keywords: ["headache", "fever", "sick", "health"],
    themes: [
      {
        id: THEME_IDS.AILMENTS,
        confidence: 0.9,
        reason: "Health problem question",
      },
    ],
  },

  // Emotion-related patterns
  {
    keywords: ["happy", "sad", "angry", "tired", "excited", "bored", "scared"],
    themes: [
      { id: THEME_IDS.EMOTIONS, confidence: 0.9, reason: "Emotion question" },
    ],
  },

  // Possession patterns
  {
    keywords: ["have", "has", "possession", "own"],
    themes: [
      {
        id: THEME_IDS.TOYS,
        confidence: 0.7,
        reason: "Common possession items",
      },
      {
        id: THEME_IDS.FURNITURE,
        confidence: 0.6,
        reason: "Furniture possession",
      },
      {
        id: THEME_IDS.FRUITS,
        confidence: 0.7,
        reason: "Common possession items",
      },
    ],
  },

  // Identification patterns
  {
    keywords: ["what", "this", "that", "these", "those", "it is", "they are"],
    themes: [
      {
        id: THEME_IDS.FRUITS,
        confidence: 0.6,
        reason: "Common identification items",
      },
      {
        id: THEME_IDS.TOYS,
        confidence: 0.6,
        reason: "Common identification items",
      },
      {
        id: THEME_IDS.FURNITURE,
        confidence: 0.6,
        reason: "Common identification items",
      },
    ],
  },

  // Quantity patterns
  {
    keywords: ["how many", "need", "quantity", "number"],
    themes: [
      {
        id: THEME_IDS.STATIONERY,
        confidence: 0.7,
        reason: "Common quantity items",
      },
      { id: THEME_IDS.FRUITS, confidence: 0.6, reason: "Countable items" },
      { id: THEME_IDS.TOYS, confidence: 0.6, reason: "Countable items" },
    ],
  },

  // Preference patterns
  {
    keywords: ["like", "likes", "preference", "favorite"],
    themes: [
      {
        id: THEME_IDS.SPORTS,
        confidence: 0.4,
        reason: "Common preference items (lower priority)",
      },
      { id: THEME_IDS.FRUITS, confidence: 0.7, reason: "Food preferences" },
      { id: THEME_IDS.TOYS, confidence: 0.7, reason: "Toy preferences" },
    ],
  },

  // Price patterns
  {
    keywords: ["how much", "dollars", "price", "cost"],
    themes: [
      {
        id: THEME_IDS.FAST_FOOD,
        confidence: 0.7,
        reason: "Common priced items",
      },
      {
        id: THEME_IDS.BAKERY_SNACKS,
        confidence: 0.7,
        reason: "Common priced items",
      },
      {
        id: THEME_IDS.STATIONERY,
        confidence: 0.8,
        reason: "Common priced items",
      },
      {
        id: THEME_IDS.CLOTHING,
        confidence: 0.8,
        reason: "Common priced items",
      },
    ],
  },
];

// Analyze a sentence pattern and return recommended themes
export function analyzePatternForThemes(
  pattern: SentencePattern
): ThemeRecommendation[] {
  const recommendations: ThemeRecommendation[] = [];
  const patternText = pattern.pattern_text.toLowerCase();

  function escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function includesWholeWord(haystack: string, needle: string): boolean {
    const escaped = escapeRegExp(needle.toLowerCase());
    // For multi-word keywords, use simple substring matching
    // For single words, use word boundaries to avoid substring matches (e.g., 'tea' in 'teacher')
    if (needle.includes(" ")) {
      return haystack.includes(escaped);
    } else {
      const regex = new RegExp(`\\b${escaped}\\b`);
      return regex.test(haystack);
    }
  }

  // Check each rule
  PATTERN_RULES.forEach((rule) => {
    const matches = rule.keywords.some((keyword) =>
      includesWholeWord(patternText, keyword)
    );

    if (matches) {
      rule.themes.forEach((theme) => {
        // Check if theme already recommended
        const existingIndex = recommendations.findIndex(
          (r) => r.theme_id === theme.id
        );
        if (existingIndex === -1) {
          recommendations.push({
            theme_id: theme.id,
            theme_name: getThemeName(theme.id),
            confidence: theme.confidence,
            reason: theme.reason,
          });
        } else {
          // Update confidence if higher
          if (theme.confidence > recommendations[existingIndex].confidence) {
            recommendations[existingIndex].confidence = theme.confidence;
            recommendations[existingIndex].reason = theme.reason;
          }
        }
      });
    }
  });

  // Sort by confidence (highest first)
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

// Analyze multiple patterns and return consolidated theme recommendations
export function analyzePatternsForThemes(
  patterns: SentencePattern[]
): ThemeRecommendation[] {
  const allRecommendations: Map<number, ThemeRecommendation> = new Map();

  patterns.forEach((pattern) => {
    const patternRecommendations = analyzePatternForThemes(pattern);

    patternRecommendations.forEach((rec) => {
      if (allRecommendations.has(rec.theme_id)) {
        // Update existing recommendation with higher confidence
        const existing = allRecommendations.get(rec.theme_id)!;
        if (rec.confidence > existing.confidence) {
          existing.confidence = rec.confidence;
          existing.reason = rec.reason;
        }
      } else {
        allRecommendations.set(rec.theme_id, rec);
      }
    });
  });

  // Return sorted recommendations
  return Array.from(allRecommendations.values()).sort(
    (a, b) => b.confidence - a.confidence
  );
}

// Get theme name by ID
function getThemeName(themeId: number): string {
  const themeNames: Record<number, string> = {
    [THEME_IDS.EMOTIONS]: "Emotions",
    [THEME_IDS.COLORS]: "Colors",
    [THEME_IDS.SPORTS]: "Sports",
    [THEME_IDS.STATIONERY]: "Stationery",
    [THEME_IDS.FRUITS]: "Fruits",
    [THEME_IDS.FAST_FOOD]: "Fast Food",
    [THEME_IDS.BAKERY_SNACKS]: "Bakery & Snacks",
    [THEME_IDS.DAYS_OF_WEEK]: "Days of the Week",
    [THEME_IDS.MONTHS]: "Months",
    [THEME_IDS.SCHOOL_SUBJECTS]: "School Subjects",
    [THEME_IDS.AILMENTS]: "Ailments",
    [THEME_IDS.COUNTRIES]: "Countries",
    [THEME_IDS.FURNITURE]: "Furniture",
    [THEME_IDS.TOYS]: "Toys",
    [THEME_IDS.DRINKS]: "Drinks",
    [THEME_IDS.MAIN_DISHES]: "Main Dishes",
    [THEME_IDS.BUBBLE_TEA_TOPPINGS]: "Bubble Tea Toppings",
    [THEME_IDS.IDENTITY]: "Identity",
    [THEME_IDS.PROFESSIONS]: "Professions",
    [THEME_IDS.DAILY_ACTIONS]: "Daily Actions",
    [THEME_IDS.CLOTHING]: "Clothing",
    [THEME_IDS.BUILDINGS_PLACES]: "Buildings and Places",
    [THEME_IDS.NUMBERS]: "Numbers",
    [THEME_IDS.TIME_EXPRESSIONS]: "Time Expressions",
  };

  return themeNames[themeId] || "Unknown Theme";
}

// Get recommended themes for a specific grade
export function getRecommendedThemesForGrade(
  gradeId: number,
  patterns: SentencePattern[]
): ThemeRecommendation[] {
  const gradePatterns = patterns.filter(
    (pattern) => pattern.grade_id === gradeId
  );
  return analyzePatternsForThemes(gradePatterns);
}

// Browser console test function
export function testLunchPattern() {
  console.log("=== Testing Lunch Pattern ===");

  const testPattern = {
    pattern_text: "Do you have lunch at _____?",
    grade_id: 3,
    pattern_type: "Question",
    notes: "Lunch time question",
  } as SentencePattern;

  console.log("Test pattern:", testPattern);

  const recommendations = analyzePatternForThemes(testPattern);
  console.log("Theme recommendations:", recommendations);

  // Check if BUILDINGS_PLACES is in recommendations
  const buildingsPlacesRec = recommendations.find(
    (r) => r.theme_id === THEME_IDS.BUILDINGS_PLACES
  );
  if (buildingsPlacesRec) {
    console.log("✅ BUILDINGS_PLACES found:", buildingsPlacesRec);
  } else {
    console.log("❌ BUILDINGS_PLACES NOT found");
  }

  // Check if TIME_EXPRESSIONS is in recommendations
  const timeExpressionsRec = recommendations.find(
    (r) => r.theme_id === THEME_IDS.TIME_EXPRESSIONS
  );
  if (timeExpressionsRec) {
    console.log("✅ TIME_EXPRESSIONS found:", timeExpressionsRec);
  } else {
    console.log("❌ TIME_EXPRESSIONS NOT found");
  }

  return recommendations;
}
