import { NextRequest, NextResponse } from "next/server";
import {
  analyzePatternsForThemes,
  THEME_IDS,
} from "@/lib/pattern-theme-mapping";
import {
  GameDataRequest,
  GameDataResponse,
  GameData,
} from "@/types/learning-content";

// Mock data for development (replace with actual D1 queries)
const mockSentencePatterns = [
  // Grade 3 patterns (grade_id: 1) - Only Questions and Statements
  {
    id: 1,
    grade_id: 1, // Grade 3
    pattern_text: "How old _____?",
    pattern_type: "Question" as const,
    notes: "Age question pattern",
  },
  {
    id: 3,
    grade_id: 1, // Grade 3
    pattern_text: "Are you a student?",
    pattern_type: "Question" as const,
    notes: "Yes/No question with be verb",
  },
  {
    id: 6,
    grade_id: 1, // Grade 3
    pattern_text: "Is he/she a teacher?",
    pattern_type: "Question" as const,
    notes: "Yes/No question with be verb for third person",
  },
  {
    id: 9,
    grade_id: 1, // Grade 3
    pattern_text: "Are you happy?",
    pattern_type: "Question" as const,
    notes: "Yes/No question with adjective",
  },
  {
    id: 12,
    grade_id: 1, // Grade 3
    pattern_text: "What's this/that?",
    pattern_type: "Question" as const,
    notes: "Identification question",
  },
  {
    id: 14,
    grade_id: 1, // Grade 3
    pattern_text: "What are these/those?",
    pattern_type: "Question" as const,
    notes: "Plural identification question",
  },
  {
    id: 16,
    grade_id: 1, // Grade 3
    pattern_text: "What color is it?",
    pattern_type: "Question" as const,
    notes: "Color question",
  },
  {
    id: 18,
    grade_id: 1, // Grade 3
    pattern_text: "Who is he/she?",
    pattern_type: "Question" as const,
    notes: "Person identification question",
  },
  {
    id: 20,
    grade_id: 1, // Grade 3
    pattern_text: "I have a _____.",
    pattern_type: "Statement" as const,
    notes: "Possession pattern",
  },
  {
    id: 21,
    grade_id: 1, // Grade 3
    pattern_text: "Do you have a pen/an eraser?",
    pattern_type: "Question" as const,
    notes: "Possession question",
  },
  {
    id: 24,
    grade_id: 1, // Grade 3
    pattern_text: "What does he/she like?",
    pattern_type: "Question" as const,
    notes: "Preference question for third person",
  },
  {
    id: 25,
    grade_id: 1, // Grade 3
    pattern_text: "Removed pattern",
    pattern_type: "Question" as const,
    notes: "Removed - no fill-in-blank slot",
  },
  {
    id: 28,
    grade_id: 1, // Grade 3
    pattern_text: "How much is it?",
    pattern_type: "Question" as const,
    notes: "Price question",
  },
  {
    id: 30,
    grade_id: 1, // Grade 3
    pattern_text: "Where's _____?",
    pattern_type: "Question" as const,
    notes: "Location question",
  },

  // Grade 5 patterns (grade_id: 2) - Only Questions
  {
    id: 32,
    grade_id: 2, // Grade 5
    pattern_text: "Do you like sports?",
    pattern_type: "Question" as const,
    notes: "Sports preference question",
  },
  {
    id: 34,
    grade_id: 2, // Grade 5
    pattern_text: "Does he/she like tea?",
    pattern_type: "Question" as const,
    notes: "Third person preference question",
  },
  {
    id: 37,
    grade_id: 2, // Grade 5
    pattern_text: "How many _____ do you need?",
    pattern_type: "Question" as const,
    notes: "Quantity question for second person",
  },
  {
    id: 41,
    grade_id: 2, // Grade 5
    pattern_text: "What day is today?",
    pattern_type: "Question" as const,
    notes: "Day question",
  },
  {
    id: 43,
    grade_id: 2, // Grade 5
    pattern_text: "What's your/his/her favorite subject?",
    pattern_type: "Question" as const,
    notes: "Favorite subject question",
  },

  // Grade 6 patterns (grade_id: 3) - Only Questions
  {
    id: 45,
    grade_id: 3, // Grade 6
    pattern_text: "Where are you from?",
    pattern_type: "Question" as const,
    notes: "Origin question for second person",
  },
  {
    id: 47,
    grade_id: 3, // Grade 6
    pattern_text: "Is he/she from _____?",
    pattern_type: "Question" as const,
    notes: "Origin question for third person",
  },
  {
    id: 51,
    grade_id: 3, // Grade 6
    pattern_text: "What would you like to eat?",
    pattern_type: "Question" as const,
    notes: "Food preference question",
  },
  {
    id: 53,
    grade_id: 3, // Grade 6
    pattern_text: "Would you like some _____?",
    pattern_type: "Question" as const,
    notes: "Food offer question",
  },
  {
    id: 56,
    grade_id: 3, // Grade 6
    pattern_text: "What time do you _____?",
    pattern_type: "Question" as const,
    notes: "Time question for routine",
  },
  {
    id: 58,
    grade_id: 3, // Grade 6
    pattern_text: "Do you have lunch at _____?",
    pattern_type: "Question" as const,
    notes: "Lunch time question",
  },

  {
    id: 63,
    grade_id: 3, // Grade 6
    pattern_text: "Does he/she have a fever?",
    pattern_type: "Question" as const,
    notes: "Health question for third person",
  },
];

// 新增：答案句型資料
const mockAnswerPatterns = [
  {
    id: 2,
    grade_id: 1,
    pattern_text: "I am _____ years old.",
    pattern_type: "Answer" as const,
    notes: "Age answer pattern",
  },
  {
    id: 4,
    grade_id: 1,
    pattern_text: "Yes, I am.",
    pattern_type: "Answer" as const,
    notes: "Positive answer with be verb",
  },
  {
    id: 5,
    grade_id: 1,
    pattern_text: "No, I'm not.",
    pattern_type: "Answer" as const,
    notes: "Negative answer with be verb",
  },
  {
    id: 7,
    grade_id: 1,
    pattern_text: "Yes, he/she is.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for third person",
  },
  {
    id: 8,
    grade_id: 1,
    pattern_text: "No, he/she isn't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for third person",
  },
  {
    id: 10,
    grade_id: 1,
    pattern_text: "Yes, I am.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for adjective",
  },
  {
    id: 11,
    grade_id: 1,
    pattern_text: "No, I'm not.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for adjective",
  },
  {
    id: 13,
    grade_id: 1,
    pattern_text: "This/It is _____.",
    pattern_type: "Answer" as const,
    notes: "Identification answer",
  },
  {
    id: 15,
    grade_id: 1,
    pattern_text: "They are _____.",
    pattern_type: "Answer" as const,
    notes: "Plural identification answer",
  },
  {
    id: 17,
    grade_id: 1,
    pattern_text: "It is _____.",
    pattern_type: "Answer" as const,
    notes: "Color answer pattern",
  },
  {
    id: 19,
    grade_id: 1,
    pattern_text: "He/She is my _____.",
    pattern_type: "Answer" as const,
    notes: "Person identification answer",
  },
  {
    id: 22,
    grade_id: 1,
    pattern_text: "Yes, I do.",
    pattern_type: "Answer" as const,
    notes: "Positive answer with do",
  },
  {
    id: 23,
    grade_id: 1,
    pattern_text: "No, I don't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer with do",
  },
  {
    id: 26,
    grade_id: 1,
    pattern_text: "Yes, I do.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for habit",
  },
  {
    id: 27,
    grade_id: 1,
    pattern_text: "No, I don't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for habit",
  },
  {
    id: 29,
    grade_id: 1,
    pattern_text: "It's _____ dollars.",
    pattern_type: "Answer" as const,
    notes: "Price answer pattern",
  },
  {
    id: 31,
    grade_id: 1,
    pattern_text: "It is _____.",
    pattern_type: "Answer" as const,
    notes: "Location answer pattern",
  },
  {
    id: 33,
    grade_id: 2,
    pattern_text: "I like _____.",
    pattern_type: "Answer" as const,
    notes: "Preference answer pattern",
  },
  {
    id: 35,
    grade_id: 2,
    pattern_text: "Yes, she/he does.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for third person preference",
  },
  {
    id: 36,
    grade_id: 2,
    pattern_text: "No, she/he doesn't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for third person preference",
  },
  {
    id: 38,
    grade_id: 2,
    pattern_text: "I need _____ _____.",
    pattern_type: "Answer" as const,
    notes: "Quantity answer pattern",
  },
  {
    id: 42,
    grade_id: 2,
    pattern_text: "It's _____.",
    pattern_type: "Answer" as const,
    notes: "Day answer pattern",
  },
  {
    id: 44,
    grade_id: 2,
    pattern_text: "My/His/Her favorite subject is _____.",
    pattern_type: "Answer" as const,
    notes: "Favorite subject answer pattern",
  },
  {
    id: 46,
    grade_id: 3,
    pattern_text: "I'm from _____.",
    pattern_type: "Answer" as const,
    notes: "Origin answer pattern",
  },
  {
    id: 48,
    grade_id: 3,
    pattern_text: "Yes, _____ is.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for origin",
  },
  {
    id: 49,
    grade_id: 3,
    pattern_text: "No, _____ isn't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for origin",
  },
  {
    id: 52,
    grade_id: 3,
    pattern_text: "I would like some _____, please.",
    pattern_type: "Answer" as const,
    notes: "Food preference answer pattern",
  },
  {
    id: 54,
    grade_id: 3,
    pattern_text: "Yes, please.",
    pattern_type: "Answer" as const,
    notes: "Positive food offer answer",
  },
  {
    id: 55,
    grade_id: 3,
    pattern_text: "No, thank you.",
    pattern_type: "Answer" as const,
    notes: "Negative food offer answer",
  },
  {
    id: 57,
    grade_id: 3,
    pattern_text: "I _____ at _____.",
    pattern_type: "Answer" as const,
    notes: "Time routine answer pattern",
  },
  {
    id: 59,
    grade_id: 3,
    pattern_text: "Yes, I do.",
    pattern_type: "Answer" as const,
    notes: "Positive lunch time answer",
  },
  {
    id: 60,
    grade_id: 3,
    pattern_text: "No, I don't.",
    pattern_type: "Answer" as const,
    notes: "Negative lunch time answer",
  },

  {
    id: 64,
    grade_id: 3,
    pattern_text: "Yes, he/she does.",
    pattern_type: "Answer" as const,
    notes: "Positive health answer for third person",
  },
  {
    id: 65,
    grade_id: 3,
    pattern_text: "No, he/she doesn't.",
    pattern_type: "Answer" as const,
    notes: "Negative health answer for third person",
  },
];

// 新增：問答配對資料
const mockQuestionAnswerPairs = [
  // Grade 3 pairs
  { id: 1, question_pattern_id: 1, answer_pattern_id: 2 }, // How old _____? -> I'm _____ years old.
  { id: 2, question_pattern_id: 3, answer_pattern_id: 4 }, // Are you a student? -> Yes, I am.
  { id: 3, question_pattern_id: 3, answer_pattern_id: 5 }, // Are you a student? -> No, I'm not.
  { id: 4, question_pattern_id: 6, answer_pattern_id: 7 }, // Is he/she a teacher? -> Yes, he/she is.
  { id: 5, question_pattern_id: 6, answer_pattern_id: 8 }, // Is he/she a teacher? -> No, he/she isn't.
  { id: 6, question_pattern_id: 9, answer_pattern_id: 10 }, // Are you happy? -> Yes, I am.
  { id: 7, question_pattern_id: 9, answer_pattern_id: 11 }, // Are you happy? -> No, I'm not.
  { id: 8, question_pattern_id: 12, answer_pattern_id: 13 }, // What's this/that? -> This/It is _____.
  { id: 9, question_pattern_id: 14, answer_pattern_id: 15 }, // What are these/those? -> They are _____.
  { id: 10, question_pattern_id: 16, answer_pattern_id: 17 }, // What color is it? -> It is ____.
  { id: 11, question_pattern_id: 18, answer_pattern_id: 19 }, // Who is he/she? -> He/She is my _____.
  { id: 12, question_pattern_id: 21, answer_pattern_id: 22 }, // Do you have a pen/an eraser? -> Yes, I do.
  { id: 13, question_pattern_id: 21, answer_pattern_id: 23 }, // Do you have a pen/an eraser? -> No, I don't.

  { id: 16, question_pattern_id: 28, answer_pattern_id: 29 }, // How much is it? -> It's _____ dollars.
  { id: 17, question_pattern_id: 30, answer_pattern_id: 31 }, // Where's _____? -> It is ____. (shared answer)

  // Grade 5 pairs
  { id: 18, question_pattern_id: 32, answer_pattern_id: 33 }, // Do you like sports? -> I like _____.
  { id: 19, question_pattern_id: 34, answer_pattern_id: 35 }, // Does he/she like tea? -> Yes, she/he does.
  { id: 20, question_pattern_id: 34, answer_pattern_id: 36 }, // Does he/she like tea? -> No, she/he doesn't
  { id: 21, question_pattern_id: 37, answer_pattern_id: 38 }, // How many _____ do you need? -> I need _____ _____.
  { id: 23, question_pattern_id: 41, answer_pattern_id: 42 }, // What day is today? -> It's _____.
  { id: 24, question_pattern_id: 43, answer_pattern_id: 44 }, // What's your/his/her favorite subject? -> My/she/he favorite subject is _____.

  // Grade 6 pairs
  { id: 25, question_pattern_id: 45, answer_pattern_id: 46 }, // Where are you from? -> I'm from _____.
  { id: 26, question_pattern_id: 47, answer_pattern_id: 48 }, // Is he/she from _____? -> Yes, _____ is.
  { id: 27, question_pattern_id: 47, answer_pattern_id: 49 }, // Is he/she from _____? -> No, _____ isn't.
  { id: 28, question_pattern_id: 51, answer_pattern_id: 52 }, // What would you like to eat? -> I would like some _____, please.
  { id: 29, question_pattern_id: 53, answer_pattern_id: 54 }, // Would you like some _____? -> Yes, please
  { id: 30, question_pattern_id: 53, answer_pattern_id: 55 }, // Would you like some _____? -> No, thank you.
  { id: 31, question_pattern_id: 56, answer_pattern_id: 57 }, // What time do you _____? -> I _____ at _____.
  { id: 32, question_pattern_id: 58, answer_pattern_id: 59 }, // Do you have lunch at _____? -> Yes, I do.
  { id: 33, question_pattern_id: 58, answer_pattern_id: 60 }, // Do you have lunch at _____? -> No, I don't.

  { id: 35, question_pattern_id: 63, answer_pattern_id: 64 }, // Does he/she have a fever? -> Yes, he/she does.
  { id: 36, question_pattern_id: 63, answer_pattern_id: 65 }, // Does he/she have a fever? -> No, he/she doesn't
];

const mockWords = [
  // Professions (新增：供 Are you a student? 使用)
  {
    id: 200,
    english_singular: "teacher",
    english_plural: "teachers",
    chinese_meaning: "老師",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 201,
    english_singular: "doctor",
    english_plural: "doctors",
    chinese_meaning: "醫生",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 202,
    english_singular: "nurse",
    english_plural: "nurses",
    chinese_meaning: "護理師",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 203,
    english_singular: "engineer",
    english_plural: "engineers",
    chinese_meaning: "工程師",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 204,
    english_singular: "artist",
    english_plural: "artists",
    chinese_meaning: "藝術家",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 205,
    english_singular: "farmer",
    english_plural: "farmers",
    chinese_meaning: "農夫",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 206,
    english_singular: "police officer",
    english_plural: "police officers",
    chinese_meaning: "警察",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 207,
    english_singular: "cook",
    english_plural: "cooks",
    chinese_meaning: "廚師",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 208,
    english_singular: "driver",
    english_plural: "drivers",
    chinese_meaning: "司機",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 209,
    english_singular: "student",
    english_plural: "students",
    chinese_meaning: "學生",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // Colors
  {
    id: 9,
    english_singular: "red",
    english_plural: undefined,
    chinese_meaning: "紅色",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 10,
    english_singular: "blue",
    english_plural: undefined,
    chinese_meaning: "藍色",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 11,
    english_singular: "yellow",
    english_plural: undefined,
    chinese_meaning: "黃色",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },

  // Stationery
  {
    id: 28,
    english_singular: "pen",
    english_plural: "pens",
    chinese_meaning: "筆",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 29,
    english_singular: "pencil",
    english_plural: "pencils",
    chinese_meaning: "鉛筆",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 30,
    english_singular: "eraser",
    english_plural: "erasers",
    chinese_meaning: "橡皮擦",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },

  // Sports
  {
    id: 20,
    english_singular: "basketball",
    english_plural: "basketballs",
    chinese_meaning: "籃球",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 21,
    english_singular: "soccer",
    english_plural: undefined,
    chinese_meaning: "足球",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 22,
    english_singular: "baseball",
    english_plural: "baseballs",
    chinese_meaning: "棒球",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },

  // School Subjects
  {
    id: 73,
    english_singular: "math",
    english_plural: undefined,
    chinese_meaning: "數學",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 74,
    english_singular: "science",
    english_plural: undefined,
    chinese_meaning: "科學",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 75,
    english_singular: "English",
    english_plural: undefined,
    chinese_meaning: "英文",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 76,
    english_singular: "history",
    english_plural: undefined,
    chinese_meaning: "歷史",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 77,
    english_singular: "geography",
    english_plural: undefined,
    chinese_meaning: "地理",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 78,
    english_singular: "art",
    english_plural: undefined,
    chinese_meaning: "美術",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 79,
    english_singular: "music",
    english_plural: undefined,
    chinese_meaning: "音樂",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 80,
    english_singular: "PE",
    english_plural: undefined,
    chinese_meaning: "體育",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },

  // Numbers
  {
    id: 90,
    english_singular: "one",
    english_plural: undefined,
    chinese_meaning: "一",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 91,
    english_singular: "two",
    english_plural: undefined,
    chinese_meaning: "二",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 92,
    english_singular: "three",
    english_plural: undefined,
    chinese_meaning: "三",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 93,
    english_singular: "four",
    english_plural: undefined,
    chinese_meaning: "四",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 94,
    english_singular: "five",
    english_plural: undefined,
    chinese_meaning: "五",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 95,
    english_singular: "six",
    english_plural: undefined,
    chinese_meaning: "六",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 96,
    english_singular: "seven",
    english_plural: undefined,
    chinese_meaning: "七",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 97,
    english_singular: "eight",
    english_plural: undefined,
    chinese_meaning: "八",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 98,
    english_singular: "nine",
    english_plural: undefined,
    chinese_meaning: "九",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 99,
    english_singular: "ten",
    english_plural: undefined,
    chinese_meaning: "十",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 100,
    english_singular: "eleven",
    english_plural: undefined,
    chinese_meaning: "十一",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 101,
    english_singular: "twelve",
    english_plural: undefined,
    chinese_meaning: "十二",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 102,
    english_singular: "thirteen",
    english_plural: undefined,
    chinese_meaning: "十三",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 103,
    english_singular: "fourteen",
    english_plural: undefined,
    chinese_meaning: "十四",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 104,
    english_singular: "fifteen",
    english_plural: undefined,
    chinese_meaning: "十五",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 105,
    english_singular: "sixteen",
    english_plural: undefined,
    chinese_meaning: "十六",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 106,
    english_singular: "seventeen",
    english_plural: undefined,
    chinese_meaning: "十七",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 107,
    english_singular: "eighteen",
    english_plural: undefined,
    chinese_meaning: "十八",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 108,
    english_singular: "nineteen",
    english_plural: undefined,
    chinese_meaning: "十九",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 109,
    english_singular: "twenty",
    english_plural: undefined,
    chinese_meaning: "二十",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 110,
    english_singular: "twenty-one",
    english_plural: undefined,
    chinese_meaning: "二十一",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 111,
    english_singular: "twenty-two",
    english_plural: undefined,
    chinese_meaning: "二十二",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 112,
    english_singular: "twenty-three",
    english_plural: undefined,
    chinese_meaning: "二十三",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 113,
    english_singular: "twenty-four",
    english_plural: undefined,
    chinese_meaning: "二十四",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 114,
    english_singular: "twenty-five",
    english_plural: undefined,
    chinese_meaning: "二十五",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 115,
    english_singular: "twenty-six",
    english_plural: undefined,
    chinese_meaning: "二十六",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 116,
    english_singular: "twenty-seven",
    english_plural: undefined,
    chinese_meaning: "二十七",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 117,
    english_singular: "twenty-eight",
    english_plural: undefined,
    chinese_meaning: "二十八",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 118,
    english_singular: "twenty-nine",
    english_plural: undefined,
    chinese_meaning: "二十九",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 119,
    english_singular: "thirty",
    english_plural: undefined,
    chinese_meaning: "三十",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },

  // Days of the Week
  {
    id: 54,
    english_singular: "Monday",
    english_plural: undefined,
    chinese_meaning: "星期一",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 55,
    english_singular: "Tuesday",
    english_plural: undefined,
    chinese_meaning: "星期二",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 56,
    english_singular: "Wednesday",
    english_plural: undefined,
    chinese_meaning: "星期三",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 1000,
    english_singular: "Thursday",
    english_plural: undefined,
    chinese_meaning: "星期四",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 1001,
    english_singular: "Friday",
    english_plural: undefined,
    chinese_meaning: "星期五",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 1002,
    english_singular: "Saturday",
    english_plural: undefined,
    chinese_meaning: "星期六",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 1003,
    english_singular: "Sunday",
    english_plural: undefined,
    chinese_meaning: "星期日",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },

  // Countries
  {
    id: 86,
    english_singular: "Taiwan",
    english_plural: undefined,
    chinese_meaning: "台灣",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 87,
    english_singular: "Japan",
    english_plural: undefined,
    chinese_meaning: "日本",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 88,
    english_singular: "Korea",
    english_plural: undefined,
    chinese_meaning: "韓國",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },

  // Food-related
  {
    id: 42,
    english_singular: "hamburger",
    english_plural: "hamburgers",
    chinese_meaning: "漢堡",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 48,
    english_singular: "bread",
    english_plural: undefined,
    chinese_meaning: "麵包",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 49,
    english_singular: "cake",
    english_plural: "cakes",
    chinese_meaning: "蛋糕",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 136,
    english_singular: "guava",
    english_plural: "guavas",
    chinese_meaning: "芭樂",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：情緒單字 (EMOTIONS - theme_id: 1)
  {
    id: 300,
    english_singular: "happy",
    english_plural: undefined,
    chinese_meaning: "快樂",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 301,
    english_singular: "sad",
    english_plural: undefined,
    chinese_meaning: "傷心",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 302,
    english_singular: "angry",
    english_plural: undefined,
    chinese_meaning: "生氣",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 303,
    english_singular: "excited",
    english_plural: undefined,
    chinese_meaning: "興奮",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 304,
    english_singular: "tired",
    english_plural: undefined,
    chinese_meaning: "疲倦",
    part_of_speech: "adjective" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：身份單字 (IDENTITY - theme_id: 18)
  {
    id: 310,
    english_singular: "friend",
    english_plural: "friends",
    chinese_meaning: "朋友",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 311,
    english_singular: "family",
    english_plural: "families",
    chinese_meaning: "家庭",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：症狀單字 (AILMENTS - theme_id: 11)
  {
    id: 400,
    english_singular: "headache",
    english_plural: "headaches",
    chinese_meaning: "頭痛",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 401,
    english_singular: "fever",
    english_plural: undefined,
    chinese_meaning: "發燒",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 402,
    english_singular: "toothache",
    english_plural: undefined,
    chinese_meaning: "牙痛",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 403,
    english_singular: "stomachache",
    english_plural: undefined,
    chinese_meaning: "胃痛",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 404,
    english_singular: "cold",
    english_plural: "colds",
    chinese_meaning: "感冒",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 405,
    english_singular: "cough",
    english_plural: "coughs",
    chinese_meaning: "咳嗽",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：飲料單字 (DRINKS - theme_id: 15)
  {
    id: 500,
    english_singular: "tea",
    english_plural: undefined,
    chinese_meaning: "茶",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 501,
    english_singular: "coffee",
    english_plural: undefined,
    chinese_meaning: "咖啡",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 502,
    english_singular: "juice",
    english_plural: "juices",
    chinese_meaning: "果汁",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 503,
    english_singular: "milk",
    english_plural: undefined,
    chinese_meaning: "牛奶",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 504,
    english_singular: "water",
    english_plural: undefined,
    chinese_meaning: "水",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 505,
    english_singular: "soda",
    english_plural: "sodas",
    chinese_meaning: "汽水",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：食物單字 (FAST FOOD - theme_id: 6)
  {
    id: 510,
    english_singular: "hamburger",
    english_plural: "hamburgers",
    chinese_meaning: "漢堡",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 511,
    english_singular: "pizza",
    english_plural: "pizzas",
    chinese_meaning: "披薩",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 512,
    english_singular: "sandwich",
    english_plural: "sandwiches",
    chinese_meaning: "三明治",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 513,
    english_singular: "noodles",
    english_plural: undefined,
    chinese_meaning: "麵條",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：更多文具單字 (STATIONERY - theme_id: 4)
  {
    id: 520,
    english_singular: "ruler",
    english_plural: "rulers",
    chinese_meaning: "尺",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 521,
    english_singular: "marker",
    english_plural: "markers",
    chinese_meaning: "麥克筆",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 522,
    english_singular: "notebook",
    english_plural: "notebooks",
    chinese_meaning: "筆記本",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 523,
    english_singular: "book",
    english_plural: "books",
    chinese_meaning: "書",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：日常動作單字 (DAILY ACTIONS - theme_id: 20)
  {
    id: 530,
    english_singular: "get up",
    english_plural: undefined,
    chinese_meaning: "起床",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 531,
    english_singular: "wake up",
    english_plural: undefined,
    chinese_meaning: "醒來",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 532,
    english_singular: "eat breakfast",
    english_plural: undefined,
    chinese_meaning: "吃早餐",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 533,
    english_singular: "go to school",
    english_plural: undefined,
    chinese_meaning: "去學校",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 534,
    english_singular: "study",
    english_plural: undefined,
    chinese_meaning: "讀書",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 535,
    english_singular: "read",
    english_plural: undefined,
    chinese_meaning: "閱讀",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 536,
    english_singular: "sleep",
    english_plural: undefined,
    chinese_meaning: "睡覺",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：時間表達單字 (TIME EXPRESSIONS - theme_id: 24)
  {
    id: 540,
    english_singular: "one o'clock",
    english_plural: undefined,
    chinese_meaning: "一點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 541,
    english_singular: "two o'clock",
    english_plural: undefined,
    chinese_meaning: "兩點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 542,
    english_singular: "three o'clock",
    english_plural: undefined,
    chinese_meaning: "三點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 543,
    english_singular: "four o'clock",
    english_plural: undefined,
    chinese_meaning: "四點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 544,
    english_singular: "five o'clock",
    english_plural: undefined,
    chinese_meaning: "五點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 545,
    english_singular: "six o'clock",
    english_plural: undefined,
    chinese_meaning: "六點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 546,
    english_singular: "seven o'clock",
    english_plural: undefined,
    chinese_meaning: "七點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 547,
    english_singular: "eight o'clock",
    english_plural: undefined,
    chinese_meaning: "八點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 548,
    english_singular: "nine o'clock",
    english_plural: undefined,
    chinese_meaning: "九點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 549,
    english_singular: "ten o'clock",
    english_plural: undefined,
    chinese_meaning: "十點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 550,
    english_singular: "eleven o'clock",
    english_plural: undefined,
    chinese_meaning: "十一點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 551,
    english_singular: "twelve o'clock",
    english_plural: undefined,
    chinese_meaning: "十二點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 552,
    english_singular: "half past one",
    english_plural: undefined,
    chinese_meaning: "一點半",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 553,
    english_singular: "half past two",
    english_plural: undefined,
    chinese_meaning: "兩點半",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 554,
    english_singular: "half past three",
    english_plural: undefined,
    chinese_meaning: "三點半",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 555,
    english_singular: "quarter past one",
    english_plural: undefined,
    chinese_meaning: "一點十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 556,
    english_singular: "quarter past two",
    english_plural: undefined,
    chinese_meaning: "兩點十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 557,
    english_singular: "quarter to one",
    english_plural: undefined,
    chinese_meaning: "十二點四十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 558,
    english_singular: "quarter to two",
    english_plural: undefined,
    chinese_meaning: "一點四十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：水果單字 (FRUITS - theme_id: 5)
  {
    id: 600,
    english_singular: "apple",
    english_plural: "apples",
    chinese_meaning: "蘋果",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 601,
    english_singular: "banana",
    english_plural: "bananas",
    chinese_meaning: "香蕉",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 602,
    english_singular: "orange",
    english_plural: "oranges",
    chinese_meaning: "橘子",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 603,
    english_singular: "grape",
    english_plural: "grapes",
    chinese_meaning: "葡萄",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 604,
    english_singular: "guava",
    english_plural: "guavas",
    chinese_meaning: "芭樂",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 605,
    english_singular: "lemon",
    english_plural: "lemons",
    chinese_meaning: "檸檬",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 606,
    english_singular: "strawberry",
    english_plural: "strawberries",
    chinese_meaning: "草莓",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：玩具單字 (TOYS - theme_id: 14)
  {
    id: 610,
    english_singular: "ball",
    english_plural: "balls",
    chinese_meaning: "球",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 611,
    english_singular: "car",
    english_plural: "cars",
    chinese_meaning: "車子",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 612,
    english_singular: "doll",
    english_plural: "dolls",
    chinese_meaning: "娃娃",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 613,
    english_singular: "kite",
    english_plural: "kites",
    chinese_meaning: "風箏",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 614,
    english_singular: "robot",
    english_plural: "robots",
    chinese_meaning: "機器人",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 615,
    english_singular: "block",
    english_plural: "blocks",
    chinese_meaning: "積木",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 616,
    english_singular: "puzzle",
    english_plural: "puzzles",
    chinese_meaning: "拼圖",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 617,
    english_singular: "yo-yo",
    english_plural: "yo-yos",
    chinese_meaning: "溜溜球",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 618,
    english_singular: "scooter",
    english_plural: "scooters",
    chinese_meaning: "滑板車",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 619,
    english_singular: "teddy bear",
    english_plural: "teddy bears",
    chinese_meaning: "泰迪熊",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：家具單字 (FURNITURE - theme_id: 13)
  {
    id: 620,
    english_singular: "table",
    english_plural: "tables",
    chinese_meaning: "桌子",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 621,
    english_singular: "chair",
    english_plural: "chairs",
    chinese_meaning: "椅子",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 622,
    english_singular: "desk",
    english_plural: "desks",
    chinese_meaning: "書桌",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 623,
    english_singular: "bed",
    english_plural: "beds",
    chinese_meaning: "床",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 624,
    english_singular: "sofa",
    english_plural: "sofas",
    chinese_meaning: "沙發",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 625,
    english_singular: "lamp",
    english_plural: "lamps",
    chinese_meaning: "檯燈",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 626,
    english_singular: "bookshelf",
    english_plural: "bookshelves",
    chinese_meaning: "書架",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 627,
    english_singular: "wardrobe",
    english_plural: "wardrobes",
    chinese_meaning: "衣櫃",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 628,
    english_singular: "mirror",
    english_plural: "mirrors",
    chinese_meaning: "鏡子",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 629,
    english_singular: "rug",
    english_plural: "rugs",
    chinese_meaning: "地毯",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：月份單字 (MONTHS - theme_id: 9)
  {
    id: 700,
    english_singular: "January",
    english_plural: undefined,
    chinese_meaning: "一月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 701,
    english_singular: "February",
    english_plural: undefined,
    chinese_meaning: "二月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 702,
    english_singular: "March",
    english_plural: undefined,
    chinese_meaning: "三月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 703,
    english_singular: "April",
    english_plural: undefined,
    chinese_meaning: "四月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 704,
    english_singular: "May",
    english_plural: undefined,
    chinese_meaning: "五月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 705,
    english_singular: "June",
    english_plural: undefined,
    chinese_meaning: "六月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 706,
    english_singular: "July",
    english_plural: undefined,
    chinese_meaning: "七月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 707,
    english_singular: "August",
    english_plural: undefined,
    chinese_meaning: "八月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 708,
    english_singular: "September",
    english_plural: undefined,
    chinese_meaning: "九月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 709,
    english_singular: "October",
    english_plural: undefined,
    chinese_meaning: "十月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 710,
    english_singular: "November",
    english_plural: undefined,
    chinese_meaning: "十一月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 711,
    english_singular: "December",
    english_plural: undefined,
    chinese_meaning: "十二月",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：更多國家單字 (COUNTRIES - theme_id: 12)
  {
    id: 720,
    english_singular: "USA",
    english_plural: undefined,
    chinese_meaning: "美國",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 721,
    english_singular: "Canada",
    english_plural: undefined,
    chinese_meaning: "加拿大",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 722,
    english_singular: "China",
    english_plural: undefined,
    chinese_meaning: "中國",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 723,
    english_singular: "Singapore",
    english_plural: undefined,
    chinese_meaning: "新加坡",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 724,
    english_singular: "Thailand",
    english_plural: undefined,
    chinese_meaning: "泰國",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 725,
    english_singular: "France",
    english_plural: undefined,
    chinese_meaning: "法國",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：烘焙點心單字 (BAKERY & SNACKS - theme_id: 7)
  {
    id: 730,
    english_singular: "bread",
    english_plural: undefined,
    chinese_meaning: "麵包",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 731,
    english_singular: "cake",
    english_plural: "cakes",
    chinese_meaning: "蛋糕",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 732,
    english_singular: "cookie",
    english_plural: "cookies",
    chinese_meaning: "餅乾",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 733,
    english_singular: "donut",
    english_plural: "donuts",
    chinese_meaning: "甜甜圈",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 734,
    english_singular: "pie",
    english_plural: "pies",
    chinese_meaning: "派",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 735,
    english_singular: "candy",
    english_plural: "candies",
    chinese_meaning: "糖果",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：主菜單字 (MAIN DISHES - theme_id: 16)
  {
    id: 740,
    english_singular: "rice",
    english_plural: undefined,
    chinese_meaning: "米飯",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 741,
    english_singular: "noodles",
    english_plural: undefined,
    chinese_meaning: "麵條",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 742,
    english_singular: "dumplings",
    english_plural: undefined,
    chinese_meaning: "餃子",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 743,
    english_singular: "bento",
    english_plural: "bentos",
    chinese_meaning: "便當",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 744,
    english_singular: "hot pot",
    english_plural: "hot pots",
    chinese_meaning: "火鍋",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 745,
    english_singular: "beef noodle soup",
    english_plural: undefined,
    chinese_meaning: "牛肉麵",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 746,
    english_singular: "fried rice",
    english_plural: undefined,
    chinese_meaning: "炒飯",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 747,
    english_singular: "pasta",
    english_plural: undefined,
    chinese_meaning: "義大利麵",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 748,
    english_singular: "steak",
    english_plural: "steaks",
    chinese_meaning: "牛排",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 749,
    english_singular: "sandwich",
    english_plural: "sandwiches",
    chinese_meaning: "三明治",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：珍珠奶茶配料單字 (BUBBLE TEA TOPPINGS - theme_id: 17)
  {
    id: 750,
    english_singular: "pearls",
    english_plural: undefined,
    chinese_meaning: "珍珠",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 751,
    english_singular: "boba",
    english_plural: undefined,
    chinese_meaning: "波霸",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 752,
    english_singular: "pudding",
    english_plural: "puddings",
    chinese_meaning: "布丁",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 753,
    english_singular: "grass jelly",
    english_plural: undefined,
    chinese_meaning: "仙草凍",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 754,
    english_singular: "aloe vera",
    english_plural: undefined,
    chinese_meaning: "蘆薈",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 755,
    english_singular: "red bean",
    english_plural: undefined,
    chinese_meaning: "紅豆",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 756,
    english_singular: "taro balls",
    english_plural: undefined,
    chinese_meaning: "芋圓",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 311,
    english_singular: "family",
    english_plural: "families",
    chinese_meaning: "家庭",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 312,
    english_singular: "brother",
    english_plural: "brothers",
    chinese_meaning: "兄弟",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 313,
    english_singular: "sister",
    english_plural: "sisters",
    chinese_meaning: "姐妹",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：日常動作單字 (DAILY_ACTIONS - theme_id: 20)
  {
    id: 320,
    english_singular: "wake up",
    english_plural: undefined,
    chinese_meaning: "起床",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 321,
    english_singular: "brush teeth",
    english_plural: undefined,
    chinese_meaning: "刷牙",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 322,
    english_singular: "eat breakfast",
    english_plural: undefined,
    chinese_meaning: "吃早餐",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 323,
    english_singular: "go to school",
    english_plural: undefined,
    chinese_meaning: "去學校",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 324,
    english_singular: "study",
    english_plural: undefined,
    chinese_meaning: "讀書",
    part_of_speech: "verb" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：衣物單字 (CLOTHING - theme_id: 21)
  {
    id: 330,
    english_singular: "shirt",
    english_plural: "shirts",
    chinese_meaning: "襯衫",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 331,
    english_singular: "pants",
    english_plural: "pants",
    chinese_meaning: "褲子",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 332,
    english_singular: "dress",
    english_plural: "dresses",
    chinese_meaning: "洋裝",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 333,
    english_singular: "shoes",
    english_plural: "shoes",
    chinese_meaning: "鞋子",
    part_of_speech: "noun" as const,
    has_plural: false,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 334,
    english_singular: "hat",
    english_plural: "hats",
    chinese_meaning: "帽子",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  // 新增：建築物和地點單字 (BUILDINGS_PLACES - theme_id: 22)
  {
    id: 340,
    english_singular: "school",
    english_plural: "schools",
    chinese_meaning: "學校",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 341,
    english_singular: "hospital",
    english_plural: "hospitals",
    chinese_meaning: "醫院",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 342,
    english_singular: "library",
    english_plural: "libraries",
    chinese_meaning: "圖書館",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 343,
    english_singular: "park",
    english_plural: "parks",
    chinese_meaning: "公園",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
  {
    id: 344,
    english_singular: "restaurant",
    english_plural: "restaurants",
    chinese_meaning: "餐廳",
    part_of_speech: "noun" as const,
    has_plural: true,
    image_url: undefined,
    audio_url: undefined,
  },
];

// Mock word theme associations
const wordThemeMap = new Map<number, number[]>([
  // Professions (新增)
  [200, [THEME_IDS.PROFESSIONS]],
  [201, [THEME_IDS.PROFESSIONS]],
  [202, [THEME_IDS.PROFESSIONS]],
  [203, [THEME_IDS.PROFESSIONS]],
  [204, [THEME_IDS.PROFESSIONS]],
  [205, [THEME_IDS.PROFESSIONS]],
  [206, [THEME_IDS.PROFESSIONS]],
  [207, [THEME_IDS.PROFESSIONS]],
  [208, [THEME_IDS.PROFESSIONS]],
  [209, [THEME_IDS.PROFESSIONS]],
  // Colors
  [9, [2]],
  [10, [2]],
  [11, [2]],
  // Stationery
  [28, [4]],
  [29, [4]],
  [30, [4]],
  // Sports
  [20, [3]],
  [21, [3]],
  [22, [3]],
  // Numbers
  [90, [23]],
  [91, [23]],
  [92, [23]],
  [93, [23]],
  [94, [23]],
  [95, [23]],
  [96, [23]],
  [97, [23]],
  [98, [23]],
  [99, [23]],
  [100, [23]],
  [101, [23]],
  [102, [23]],
  [103, [23]],
  [104, [23]],
  [105, [23]],
  [106, [23]],
  [107, [23]],
  [108, [23]],
  [109, [23]],
  [110, [23]],
  [111, [23]],
  [112, [23]],
  [113, [23]],
  [114, [23]],
  [115, [23]],
  [116, [23]],
  [117, [23]],
  [118, [23]],
  [119, [23]],
  // School Subjects
  [73, [10]],
  [74, [10]],
  [75, [10]],
  [76, [10]],
  [77, [10]],
  [78, [10]],
  [79, [10]],
  [80, [10]],
  // Days of the Week
  [54, [8]],
  [55, [8]],
  [56, [8]],
  [1000, [8]],
  [1001, [8]],
  [1002, [8]],
  [1003, [8]],
  // Countries
  [86, [12]],
  [87, [12]],
  [88, [12]],
  // Food-related
  [42, [6]],
  [48, [7]],
  [49, [7]],
  // Emotions
  [300, [1]],
  [301, [1]],
  [302, [1]],
  [303, [1]],
  [304, [1]],
  // Identity
  [310, [18]],
  [311, [18]],
  [312, [18]],
  [313, [18]],
  // Ailments
  [400, [11]],
  [401, [11]],
  [402, [11]],
  [403, [11]],
  [404, [11]],
  [405, [11]],
  // Drinks
  [500, [15]],
  [501, [15]],
  [502, [15]],
  [503, [15]],
  [504, [15]],
  [505, [15]],
  // Fast Food
  [510, [6]],
  [511, [6]],
  [512, [6]],
  [513, [6]],
  // Stationery (補充)
  [520, [4]],
  [521, [4]],
  [522, [4]],
  [523, [4]],
  // Daily Actions (補充)
  [530, [20]],
  [531, [20]],
  [532, [20]],
  [533, [20]],
  [534, [20]],
  [535, [20]],
  [536, [20]],
  // Time Expressions
  [540, [24]],
  [541, [24]],
  [542, [24]],
  [543, [24]],
  [544, [24]],
  [545, [24]],
  [546, [24]],
  [547, [24]],
  [548, [24]],
  [549, [24]],
  [550, [24]],
  [551, [24]],
  [552, [24]],
  [553, [24]],
  [554, [24]],
  [555, [24]],
  [556, [24]],
  [557, [24]],
  [558, [24]],
  // Daily Actions (原有)
  [320, [20]],
  [321, [20]],
  [322, [20]],
  [323, [20]],
  [324, [20]],
  // Fruits
  [600, [5]],
  [601, [5]],
  [602, [5]],
  [603, [5]],
  [604, [5]],
  [605, [5]],
  [606, [5]],
  // Toys
  [610, [14]],
  [611, [14]],
  [612, [14]],
  [613, [14]],
  [614, [14]],
  [615, [14]],
  [616, [14]],
  [617, [14]],
  [618, [14]],
  [619, [14]],
  // Furniture
  [620, [13]],
  [621, [13]],
  [622, [13]],
  [623, [13]],
  [624, [13]],
  [625, [13]],
  [626, [13]],
  [627, [13]],
  [628, [13]],
  [629, [13]],
  // Months
  [700, [9]],
  [701, [9]],
  [702, [9]],
  [703, [9]],
  [704, [9]],
  [705, [9]],
  [706, [9]],
  [707, [9]],
  [708, [9]],
  [709, [9]],
  [710, [9]],
  [711, [9]],
  // Countries (補充)
  [720, [12]],
  [721, [12]],
  [722, [12]],
  [723, [12]],
  [724, [12]],
  [725, [12]],
  // Bakery & Snacks
  [730, [7]],
  [731, [7]],
  [732, [7]],
  [733, [7]],
  [734, [7]],
  [735, [7]],
  // Main Dishes
  [740, [16]],
  [741, [16]],
  [742, [16]],
  [743, [16]],
  [744, [16]],
  [745, [16]],
  [746, [16]],
  [747, [16]],
  [748, [16]],
  [749, [16]],
  // Bubble Tea Toppings
  [750, [17]],
  [751, [17]],
  [752, [17]],
  [753, [17]],
  [754, [17]],
  [755, [17]],
  [756, [17]],
  // Clothing
  [330, [21]],
  [331, [21]],
  [332, [21]],
  [333, [21]],
  [334, [21]],
  // Buildings/Places
  [340, [22]],
  [341, [22]],
  [342, [22]],
  [343, [22]],
  [344, [22]],
]);

// Function to get game data based on selections
function getGameData(
  grade_id: number,
  pattern_ids: number[],
  theme_ids: number[],
  plural_form_option: string
): GameData {
  // Filter patterns by grade and selected IDs
  const patterns = mockSentencePatterns.filter(
    (pattern) =>
      pattern.grade_id === grade_id && pattern_ids.includes(pattern.id)
  );

  // Filter words by selected themes
  let words = mockWords.filter((word) => {
    const wordThemes = wordThemeMap.get(word.id);
    return (
      wordThemes && wordThemes.some((themeId) => theme_ids.includes(themeId))
    );
  });

  // 調試日誌：檢查數字主題的單字過濾結果
  if (theme_ids.includes(23)) {
    console.log("🔢 Numbers theme selected");
    console.log("📊 Total words before filtering:", mockWords.length);
    console.log("📊 Words after theme filtering:", words.length);
    console.log(
      "📊 Number words found:",
      words.filter((w) => w.id >= 90 && w.id <= 119).length
    );
    console.log(
      "📊 Number word IDs:",
      words.filter((w) => w.id >= 90 && w.id <= 119).map((w) => w.id)
    );

    // 詳細檢查每個數字單字
    const numberWords = words.filter((w) => w.id >= 90 && w.id <= 119);
    console.log(
      "📊 Number words details:",
      numberWords.map((w) => ({
        id: w.id,
        english: w.english_singular,
        chinese: w.chinese_meaning,
      }))
    );

    // 檢查 mockWords 中的數字單字
    const mockNumberWords = mockWords.filter((w) => w.id >= 90 && w.id <= 119);
    console.log("📊 Mock number words count:", mockNumberWords.length);
    console.log(
      "📊 Mock number word IDs:",
      mockNumberWords.map((w) => w.id)
    );
  }

  // 調試日誌：檢查 BUILDINGS_PLACES 主題的單字過濾結果
  if (theme_ids.includes(22)) {
    console.log("🏢 BUILDINGS_PLACES theme selected");
    console.log("📊 Total words before filtering:", mockWords.length);
    console.log("📊 Words after theme filtering:", words.length);
    console.log(
      "📊 Buildings/Places words found:",
      words.filter((w) => w.id >= 340 && w.id <= 344).length
    );
    console.log(
      "📊 Buildings/Places word IDs:",
      words.filter((w) => w.id >= 340 && w.id <= 344).map((w) => w.id)
    );

    // 詳細檢查每個建築物/地點單字
    const buildingsWords = words.filter((w) => w.id >= 340 && w.id <= 344);
    console.log(
      "📊 Buildings/Places words details:",
      buildingsWords.map((w) => ({
        id: w.id,
        english: w.english_singular,
        chinese: w.chinese_meaning,
      }))
    );

    // 檢查 mockWords 中的建築物/地點單字
    const mockBuildingsWords = mockWords.filter(
      (w) => w.id >= 340 && w.id <= 344
    );
    console.log(
      "📊 Mock buildings/places words count:",
      mockBuildingsWords.length
    );
    console.log(
      "📊 Mock buildings/places word IDs:",
      mockBuildingsWords.map((w) => w.id)
    );
  }

  // 數字主題 (id: 23) 的單字已經在 mockWords 中，並通過 wordThemeMap 正確關聯
  // 不需要動態生成數字單字

  // Apply plural form filtering
  let filteredWords = words;
  if (plural_form_option === "singular_only") {
    filteredWords = words.filter((word) => !word.has_plural);
  } else if (plural_form_option === "plural_only") {
    filteredWords = words.filter((word) => word.has_plural);
  }
  // "both_forms" includes all words

  // 新增：為每個問句句型找到對應的答案句型
  const patternsWithAnswers = patterns.map((questionPattern) => {
    const pair = mockQuestionAnswerPairs.find(
      (pair) => pair.question_pattern_id === questionPattern.id
    );
    const answerPattern = pair
      ? mockAnswerPatterns.find((ap) => ap.id === pair.answer_pattern_id)
      : null;

    return {
      ...questionPattern,
      answer_pattern: answerPattern,
    };
  });

  return {
    grade_id,
    patterns: patternsWithAnswers, // 現在包含答案句型
    words: filteredWords,
    plural_form_option: plural_form_option as any,
    sentence_patterns: patternsWithAnswers, // 新增這個欄位以符合 GameData 類型
  };
}

// 數字單字生成函數已移除，改為使用 mock 資料中的數字單字

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grade_id = parseInt(searchParams.get("grade_id") || "0");
    const pattern_ids = (searchParams.get("pattern_ids") || "")
      .split(",")
      .filter(Boolean)
      .map((v) => parseInt(v));
    let theme_ids = (searchParams.get("theme_ids") || "")
      .split(",")
      .filter(Boolean)
      .map((v) => parseInt(v));
    const plural_form_option =
      searchParams.get("plural_form_option") || "both_forms";

    if (!grade_id || pattern_ids.length === 0 || theme_ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required query params: grade_id, pattern_ids, theme_ids",
        },
        { status: 400 }
      );
    }

    // 移除自動合併推薦主題的邏輯，只使用用戶明確選擇的主題
    console.log("🔍 主題選擇調試 (GET):");
    console.log("📝 用戶選擇的主題:", searchParams.get("theme_ids"));
    console.log("📝 最終使用的主題:", theme_ids);

    const gameData = getGameData(
      grade_id,
      pattern_ids,
      theme_ids,
      plural_form_option
    );

    const res = NextResponse.json({ success: true, data: gameData });
    // Edge/browser cache 15 minutes with SWR
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=900, stale-while-revalidate=60"
    );
    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GameDataRequest = await request.json();
    const { grade_id, pattern_ids, plural_form_option } = body;
    let { theme_ids } = body;

    // Validate required fields
    if (!grade_id || !pattern_ids || !theme_ids || !plural_form_option) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: grade_id, pattern_ids, theme_ids, plural_form_option",
        },
        { status: 400 }
      );
    }

    // 移除自動合併推薦主題的邏輯，只使用用戶明確選擇的主題
    console.log("🔍 主題選擇調試 (POST):");
    console.log("📝 用戶選擇的主題:", theme_ids);
    console.log("📝 最終使用的主題:", theme_ids);

    // Get game data（使用用戶選擇的主題清單）
    const gameData = getGameData(
      grade_id,
      pattern_ids,
      theme_ids,
      plural_form_option
    );

    // Validate that we have data
    if (gameData.patterns.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No patterns found for the selected grade and pattern IDs",
        },
        { status: 400 }
      );
    }

    // Allow zero words to support handler-driven patterns that don't require a word pool

    const response: GameDataResponse = {
      success: true,
      data: gameData,
    };

    const res = NextResponse.json(response);
    // Edge/browser cache 15 minutes with SWR for identical POST bodies (some CDNs may skip POST cache, but keep header for intermediaries)
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=900, stale-while-revalidate=60"
    );
    return res;
  } catch (error) {
    console.error("Game data API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
