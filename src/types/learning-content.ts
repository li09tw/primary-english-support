/**
 * @fileoverview 學習內容類型定義 - 包含遊戲設定、學習內容等類型
 * @modified 2024-01-XX XX:XX - 已完成並鎖定保護
 * @modified_by Assistant
 * @modification_type feature
 * @status locked
 * @last_commit 2024-01-XX XX:XX
 * @feature 學習內容類型定義已完成
 * @protection 此檔案已完成開發，禁止修改。管理員介面可透過 /garden 路徑新增遊戲方法
 */

// Learning Content Type Definitions
// Updated to support Question-Answer relationships

export interface Grade {
  id: number;
  name: string;
}

export interface SentencePattern {
  id: number;
  grade_id: number;
  pattern_text: string;
  pattern_type: "Question" | "Answer" | "Statement";
  notes?: string;
}

// 新增：支援答案句型的句型類型
export interface SentencePatternWithAnswer extends SentencePattern {
  answer_pattern?: SentencePattern | null;
}

export interface QuestionAnswerPair {
  id: number;
  question_pattern_id: number;
  answer_pattern_id: number;
}

export interface WordTheme {
  id: number;
  name: string;
}

export interface Word {
  id: number;
  english_singular: string;
  english_plural?: string;
  chinese_meaning: string;
  part_of_speech: "noun" | "verb" | "adjective" | "adverb" | "preposition";
  has_plural: boolean;
  image_url?: string;
  audio_url?: string;
}

export interface PatternSlot {
  id: number;
  pattern_id: number;
  slot_index: number;
  required_part_of_speech: string;
}

export interface WordThemeAssociation {
  word_id: number;
  theme_id: number;
}

// API Response Types
export interface LearningContentResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ThemesResponse extends LearningContentResponse<WordTheme[]> {}
export interface WordsByThemeResponse extends LearningContentResponse<Word[]> {}
export interface SentencePatternsResponse
  extends LearningContentResponse<SentencePattern[]> {}
export interface QuestionAnswerPairsResponse
  extends LearningContentResponse<QuestionAnswerPair[]> {}

// Game-related types
export type PluralFormOption = "singular_only" | "plural_only" | "both_forms";

export interface GameDataRequest {
  grade_id: number;
  pattern_ids: number[];
  theme_ids: number[];
  plural_form_option: PluralFormOption;
}

export interface GameData {
  sentence_patterns: any;
  grade_id: number;
  patterns: SentencePatternWithAnswer[]; // 改為支援答案句型的類型
  words: Word[];
  plural_form_option: PluralFormOption;
}

export interface GameDataResponse extends LearningContentResponse<GameData> {}

// Extended types for question-answer relationships
export interface SentencePatternWithAnswers extends SentencePattern {
  answers?: SentencePattern[];
}

export interface QuestionAnswerGroup {
  question: SentencePattern;
  answers: SentencePattern[];
}

export interface GradePatternsWithAnswers {
  grade: Grade;
  patterns: QuestionAnswerGroup[];
}

// 新增：遊戲設定資料類型
export interface GameSetupData {
  grade_id: number;
  pattern_ids: number[];
  theme_ids: number[]; // 改為數字陣列，符合 API 需求
  noun_selection: string;
}
