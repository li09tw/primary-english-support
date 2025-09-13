import { NextRequest, NextResponse } from "next/server";
import {
  LearningContentResponse,
  WordsByThemeResponse,
  SentencePatternsResponse,
  ThemesResponse,
  QuestionAnswerPairsResponse,
  WordTheme,
  Word,
} from "@/types/learning-content";
import {
  mockGrades,
  mockThemes,
  mockWords,
  mockSentencePatterns,
  mockQuestionAnswerPairs,
  wordThemeMap,
} from "../game-data/route";

// 使用從 game-data 導入的共享資料

// 轉換函數：將 game-data 的單字格式轉換為 learning-content 格式
function convertGameDataWords(gameWords: any[]): Word[] {
  return gameWords.map((word, index) => ({
    id: index + 1, // 使用索引 + 1 作為數字 ID
    english_singular: word.english_singular,
    english_plural: word.english_plural,
    chinese_meaning: word.chinese_meaning,
    part_of_speech: word.part_of_speech,
    has_plural: word.has_plural,
  }));
}

// 轉換後的單字資料
const convertedWords: Word[] = convertGameDataWords(mockWords);

// 轉換函數：將 game-data 的句型格式轉換為 learning-content 格式
function convertGameDataPatterns(gamePatterns: any[]): any[] {
  return gamePatterns.map((pattern) => ({
    id: pattern.id,
    grade_id: pattern.grade_id, // 直接使用新的年級編號 (G3, G5, G6)
    pattern_text: pattern.pattern_text,
    pattern_type: pattern.pattern_type,
    notes: pattern.notes,
  }));
}

// 轉換後的句型資料
const convertedPatterns = convertGameDataPatterns(mockSentencePatterns);

// 轉換函數：將 game-data 的問答配對格式轉換為 learning-content 格式
function convertGameDataPairs(gamePairs: any[]): any[] {
  return gamePairs.map((pair) => ({
    id: pair.id,
    question_pattern_id: pair.question_pattern_id,
    answer_pattern_id: pair.answer_pattern_id,
  }));
}

// 轉換後的問答配對資料
const convertedPairs = convertGameDataPairs(mockQuestionAnswerPairs);

// 創建單字主題對應關係（從 game-data 的 wordThemeMap 轉換）
const wordThemeMapConverted = new Map<number, number[]>();
// 創建原始字串 ID 到數字 ID 的映射
const stringToNumericIdMap = new Map<string, number>();
mockWords.forEach((word, index) => {
  if (word && word.id) {
    stringToNumericIdMap.set(word.id, index + 1);
  }
});

// 使用映射來轉換 wordThemeMap
wordThemeMap.forEach((themeIds, wordId) => {
  const numericId = stringToNumericIdMap.get(wordId);
  if (numericId) {
    wordThemeMapConverted.set(numericId, themeIds);
  }
});

// 調試：檢查轉換結果（已修復，可移除）
// console.log("wordThemeMapConverted entries:", Array.from(wordThemeMapConverted.entries()).slice(0, 5));
// console.log("convertedWords sample IDs:", convertedWords.slice(0, 5).map(w => w.id));
// console.log("wordThemeMap original entries:", Array.from(wordThemeMap.entries()).slice(0, 5));

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const themeId = searchParams.get("theme_id");
    const gradeId = searchParams.get("grade_id");
    const partOfSpeech = searchParams.get("part_of_speech");

    switch (action) {
      case "themes":
        return getThemes();

      case "words_by_theme":
        if (!themeId) {
          return NextResponse.json(
            { success: false, error: "theme_id is required" },
            { status: 400 }
          );
        }
        return getWordsByTheme(parseInt(themeId), partOfSpeech);

      case "sentence_patterns":
        return getSentencePatterns(gradeId || undefined);

      case "question_answer_pairs":
        return getQuestionAnswerPairs(gradeId ? parseInt(gradeId) : undefined);

      case "grades":
        return getGrades();

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Learning content API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getThemes(): NextResponse<ThemesResponse> {
  return NextResponse.json({
    success: true,
    data: mockThemes,
  });
}

function getWordsByTheme(
  themeId: number,
  partOfSpeech?: string | null
): NextResponse<WordsByThemeResponse> {
  let filteredWords = convertedWords.filter((word) => {
    const wordThemes = wordThemeMapConverted.get(word.id);
    return wordThemes && wordThemes.includes(themeId);
  });

  if (partOfSpeech) {
    filteredWords = filteredWords.filter(
      (word) => word.part_of_speech === partOfSpeech
    );
  }

  return NextResponse.json({
    success: true,
    data: filteredWords,
  });
}

function getSentencePatterns(
  gradeId?: string | number
): NextResponse<SentencePatternsResponse> {
  let filteredPatterns = convertedPatterns;

  if (gradeId) {
    // 處理字串和數字格式的年級 ID
    const gradeString = typeof gradeId === "string" ? gradeId : `G${gradeId}`;
    console.log("Filtering patterns for grade:", gradeString);
    filteredPatterns = convertedPatterns.filter(
      (pattern) => pattern.grade_id === gradeString
    );
    console.log("Filtered patterns count:", filteredPatterns.length);
  }

  return NextResponse.json({
    success: true,
    data: filteredPatterns,
  });
}

function getQuestionAnswerPairs(
  gradeId?: number
): NextResponse<QuestionAnswerPairsResponse> {
  let filteredPairs = convertedPairs;

  if (gradeId) {
    // 根據年級過濾問答配對
    const gradeString = `G${gradeId}`;
    const gradePatterns = convertedPatterns.filter(
      (pattern) => pattern.grade_id === gradeString
    );
    const gradePatternIds = gradePatterns.map((pattern) => pattern.id);

    filteredPairs = convertedPairs.filter(
      (pair) =>
        gradePatternIds.includes(pair.question_pattern_id) ||
        gradePatternIds.includes(pair.answer_pattern_id)
    );
  }

  return NextResponse.json({
    success: true,
    data: filteredPairs,
  });
}

function getGrades(): NextResponse<{ success: boolean; data: any[] }> {
  return NextResponse.json({
    success: true,
    data: mockGrades,
  });
}
