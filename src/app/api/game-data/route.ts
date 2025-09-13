// @ts-nocheck
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

// Mock grades - 使用新的年級編號
const mockGrades = [
  { id: "G3", name: "Grade 3" },
  { id: "G5", name: "Grade 5" },
  { id: "G6", name: "Grade 6" },
];

// Mock word themes
const mockThemes = [
  { id: 1, name: "Emotions" },
  { id: 2, name: "Colors" },
  { id: 3, name: "Sports" },
  { id: 4, name: "Stationery" },
  { id: 5, name: "Fruits" },
  { id: 6, name: "Fast Food" },
  { id: 7, name: "Bakery & Snacks" },
  { id: 8, name: "Days of Week" },
  { id: 9, name: "Months" },
  { id: 10, name: "School Subjects" },
  { id: 11, name: "Ailments" },
  { id: 12, name: "Countries" },
  { id: 13, name: "Furniture" },
  { id: 14, name: "Toys" },
  { id: 15, name: "Drinks" },
  { id: 16, name: "Main Dishes" },
  { id: 17, name: "Bubble Tea Toppings" },
  { id: 18, name: "Identity" },
  { id: 19, name: "Professions" },
  { id: 20, name: "Daily Actions" },
  { id: 21, name: "Clothing" },
  { id: 22, name: "Buildings & Places" },
  { id: 23, name: "Numbers" },
  { id: 24, name: "Time Expressions" },
];

const mockSentencePatterns = [
  // Grade 3 patterns (grade_id: 99001) - Only Questions and Statements
  {
    id: 99101,
    grade_id: "G3", // Grade 3
    pattern_text: "How old _____?",
    pattern_type: "Question" as const,
    notes: "Age question pattern",
  },
  {
    id: 99102,
    grade_id: "G3", // Grade 3
    pattern_text: "Are you a student?",
    pattern_type: "Question" as const,
    notes: "Yes/No question with be verb",
  },
  {
    id: 99103,
    grade_id: "G3", // Grade 3
    pattern_text: "Is he/she a teacher?",
    pattern_type: "Question" as const,
    notes: "Yes/No question with be verb for third person",
  },
  {
    id: 99104,
    grade_id: "G3", // Grade 3
    pattern_text: "Are you happy?",
    pattern_type: "Question" as const,
    notes: "Yes/No question with adjective",
  },
  {
    id: 99105,
    grade_id: "G3", // Grade 3
    pattern_text: "What's this/that?",
    pattern_type: "Question" as const,
    notes: "Identification question",
  },
  {
    id: 99106,
    grade_id: "G3", // Grade 3
    pattern_text: "What are these/those?",
    pattern_type: "Question" as const,
    notes: "Plural identification question",
  },
  {
    id: 99107,
    grade_id: "G3", // Grade 3
    pattern_text: "What color is it?",
    pattern_type: "Question" as const,
    notes: "Color question",
  },
  {
    id: 99108,
    grade_id: "G3", // Grade 3
    pattern_text: "Who is he/she?",
    pattern_type: "Question" as const,
    notes: "Person identification question",
  },
  {
    id: 99109,
    grade_id: "G3", // Grade 3
    pattern_text: "I have a _____.",
    pattern_type: "Statement" as const,
    notes: "Possession pattern",
  },
  {
    id: 99120,
    grade_id: "G3", // Grade 3
    pattern_text: "Do you have a pen/an eraser?",
    pattern_type: "Question" as const,
    notes: "Possession question",
  },
  {
    id: 99121,
    grade_id: "G3", // Grade 3
    pattern_text: "What does he/she like?",
    pattern_type: "Question" as const,
    notes: "Preference question for third person",
  },
  {
    id: 99122,
    grade_id: "G3", // Grade 3
    pattern_text: "Removed pattern",
    pattern_type: "Question" as const,
    notes: "Removed - no fill-in-blank slot",
  },
  {
    id: 99123,
    grade_id: "G3", // Grade 3
    pattern_text: "How much is it?",
    pattern_type: "Question" as const,
    notes: "Price question",
  },
  {
    id: 99124,
    grade_id: "G3", // Grade 3
    pattern_text: "Where's _____?",
    pattern_type: "Question" as const,
    notes: "Location question",
  },

  // Grade 5 patterns (grade_id: 99030) - Only Questions
  {
    id: 99125,
    grade_id: "G5", // Grade 5
    pattern_text: "Do you like sports?",
    pattern_type: "Question" as const,
    notes: "Sports preference question",
  },
  {
    id: 99126,
    grade_id: "G5", // Grade 5
    pattern_text: "Does he/she like tea?",
    pattern_type: "Question" as const,
    notes: "Third person preference question",
  },
  {
    id: 99127,
    grade_id: "G5", // Grade 5
    pattern_text: "How many _____ do you need?",
    pattern_type: "Question" as const,
    notes: "Quantity question for second person",
  },
  {
    id: 99128,
    grade_id: "G5", // Grade 5
    pattern_text: "What day is today?",
    pattern_type: "Question" as const,
    notes: "Day question",
  },
  {
    id: 99129,
    grade_id: "G5", // Grade 5
    pattern_text: "What's your/his/her favorite subject?",
    pattern_type: "Question" as const,
    notes: "Favorite subject question",
  },

  // Grade 6 patterns (grade_id: 99038) - Only Questions
  {
    id: 99130,
    grade_id: "G6", // Grade 6
    pattern_text: "Where are you from?",
    pattern_type: "Question" as const,
    notes: "Origin question for second person",
  },
  {
    id: 99131,
    grade_id: "G6", // Grade 6
    pattern_text: "Is he/she from _____?",
    pattern_type: "Question" as const,
    notes: "Origin question for third person",
  },
  {
    id: 99132,
    grade_id: "G6", // Grade 6
    pattern_text: "What would you like to eat?",
    pattern_type: "Question" as const,
    notes: "Food preference question",
  },
  {
    id: 99133,
    grade_id: "G6", // Grade 6
    pattern_text: "Would you like some _____?",
    pattern_type: "Question" as const,
    notes: "Food offer question",
  },
  {
    id: 99134,
    grade_id: "G6", // Grade 6
    pattern_text: "What time do you _____?",
    pattern_type: "Question" as const,
    notes: "Time question for routine",
  },
  {
    id: 99135,
    grade_id: "G6", // Grade 6
    pattern_text: "Do you have lunch at _____?",
    pattern_type: "Question" as const,
    notes: "Lunch time question",
  },

  {
    id: 99136,
    grade_id: "G6", // Grade 6
    pattern_text: "Does he/she have a fever?",
    pattern_type: "Question" as const,
    notes: "Health question for third person",
  },
];

// 新增：答案句型資料
const mockAnswerPatterns = [
  {
    id: 99001,
    grade_id: "G3",
    pattern_text: "I am _____ years old.",
    pattern_type: "Answer" as const,
    notes: "Age answer pattern",
  },
  {
    id: 99002,
    grade_id: "G3",
    pattern_text: "Yes, I am.",
    pattern_type: "Answer" as const,
    notes: "Positive answer with be verb",
  },
  {
    id: 99003,
    grade_id: "G3",
    pattern_text: "No, I'm not.",
    pattern_type: "Answer" as const,
    notes: "Negative answer with be verb",
  },
  {
    id: 990004,
    grade_id: "G3",
    pattern_text: "Yes, he/she is.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for third person",
  },
  {
    id: 99005,
    grade_id: "G3",
    pattern_text: "No, he/she isn't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for third person",
  },
  {
    id: 99006,
    grade_id: "G3",
    pattern_text: "Yes, I am.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for adjective",
  },
  {
    id: 99007,
    grade_id: "G3",
    pattern_text: "No, I'm not.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for adjective",
  },
  {
    id: 99008,
    grade_id: "G3",
    pattern_text: "This/It is _____.",
    pattern_type: "Answer" as const,
    notes: "Identification answer",
  },
  {
    id: 99009,
    grade_id: "G3",
    pattern_text: "They are _____.",
    pattern_type: "Answer" as const,
    notes: "Plural identification answer",
  },
  {
    id: 99010,
    grade_id: "G3",
    pattern_text: "It is _____.",
    pattern_type: "Answer" as const,
    notes: "Color answer pattern",
  },
  {
    id: 99011,
    grade_id: "G3",
    pattern_text: "He/She is my _____.",
    pattern_type: "Answer" as const,
    notes: "Person identification answer",
  },
  {
    id: 99012,
    grade_id: "G3",
    pattern_text: "Yes, I do.",
    pattern_type: "Answer" as const,
    notes: "Positive answer with do",
  },
  {
    id: 99013,
    grade_id: "G3",
    pattern_text: "No, I don't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer with do",
  },
  {
    id: 99014,
    grade_id: "G3",
    pattern_text: "Yes, I do.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for habit",
  },
  {
    id: 99015,
    grade_id: "G3",
    pattern_text: "No, I don't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for habit",
  },
  {
    id: 99016,
    grade_id: "G3",
    pattern_text: "It's _____ dollars.",
    pattern_type: "Answer" as const,
    notes: "Price answer pattern",
  },
  {
    id: 99017,
    grade_id: "G3",
    pattern_text: "It is _____.",
    pattern_type: "Answer" as const,
    notes: "Location answer pattern",
  },
  {
    id: 99018,
    grade_id: "G3",
    pattern_text: "I like _____.",
    pattern_type: "Answer" as const,
    notes: "Preference answer pattern",
  },
  {
    id: 99019,
    grade_id: "G3",
    pattern_text: "Yes, she/he does.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for third person preference",
  },
  {
    id: 99020,
    grade_id: "G3",
    pattern_text: "No, she/he doesn't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for third person preference",
  },
  {
    id: 99021,
    grade_id: "G3",
    pattern_text: "I need _____ _____.",
    pattern_type: "Answer" as const,
    notes: "Quantity answer pattern",
  },
  {
    id: 99022,
    grade_id: "G3",
    pattern_text: "It's _____.",
    pattern_type: "Answer" as const,
    notes: "Day answer pattern",
  },
  {
    id: 99023,
    grade_id: "G3",
    pattern_text: "My/His/Her favorite subject is _____.",
    pattern_type: "Answer" as const,
    notes: "Favorite subject answer pattern",
  },
  {
    id: 99024,
    grade_id: "G3",
    pattern_text: "I'm from _____.",
    pattern_type: "Answer" as const,
    notes: "Origin answer pattern",
  },
  {
    id: 99025,
    grade_id: "G3",
    pattern_text: "Yes, _____ is.",
    pattern_type: "Answer" as const,
    notes: "Positive answer for origin",
  },
  {
    id: 99026,
    grade_id: "G3",
    pattern_text: "No, _____ isn't.",
    pattern_type: "Answer" as const,
    notes: "Negative answer for origin",
  },
  {
    id: 99027,
    grade_id: "G3",
    pattern_text: "I would like some _____, please.",
    pattern_type: "Answer" as const,
    notes: "Food preference answer pattern",
  },
  {
    id: 99028,
    grade_id: "G3",
    pattern_text: "Yes, please.",
    pattern_type: "Answer" as const,
    notes: "Positive food offer answer",
  },
  {
    id: 99029,
    grade_id: "G3",
    pattern_text: "No, thank you.",
    pattern_type: "Answer" as const,
    notes: "Negative food offer answer",
  },
  {
    id: 99030,
    grade_id: "G3",
    pattern_text: "I _____ at _____.",
    pattern_type: "Answer" as const,
    notes: "Time routine answer pattern",
  },
  {
    id: 99031,
    grade_id: "G3",
    pattern_text: "Yes, I do.",
    pattern_type: "Answer" as const,
    notes: "Positive lunch time answer",
  },
  {
    id: 99032,
    grade_id: "G3",
    pattern_text: "No, I don't.",
    pattern_type: "Answer" as const,
    notes: "Negative lunch time answer",
  },

  {
    id: 99033,
    grade_id: "G3",
    pattern_text: "Yes, he/she does.",
    pattern_type: "Answer" as const,
    notes: "Positive health answer for third person",
  },
  {
    id: 99034,
    grade_id: "G3",
    pattern_text: "No, he/she doesn't.",
    pattern_type: "Answer" as const,
    notes: "Negative health answer for third person",
  },
];

// 新增：問答配對資料
const mockQuestionAnswerPairs = [
  // Grade 3 pairs
  { id: 99001, question_pattern_id: 99001, answer_pattern_id: 99001 }, // How old _____? -> I'm _____ years old.
  { id: 99002, question_pattern_id: 99002, answer_pattern_id: 99002 }, // Are you a student? -> Yes, I am.
  { id: 99003, question_pattern_id: 99002, answer_pattern_id: 99003 }, // Are you a student? -> No, I'm not.
  { id: 99004, question_pattern_id: 99003, answer_pattern_id: 99004 }, // Is he/she a teacher? -> Yes, he/she is.
  { id: 99005, question_pattern_id: 99003, answer_pattern_id: 99005 }, // Is he/she a teacher? -> No, he/she isn't.
  { id: 99006, question_pattern_id: 99004, answer_pattern_id: 99006 }, // Are you happy? -> Yes, I am.
  { id: 99007, question_pattern_id: 99004, answer_pattern_id: 99007 }, // Are you happy? -> No, I'm not.
  { id: 99008, question_pattern_id: 99005, answer_pattern_id: 99008 }, // What's this/that? -> This/It is _____.
  { id: 99009, question_pattern_id: 99006, answer_pattern_id: 99009 }, // What are these/those? -> They are _____.
  { id: 99010, question_pattern_id: 99007, answer_pattern_id: 99010 }, // What color is it? -> It is ____.
  { id: 99011, question_pattern_id: 99008, answer_pattern_id: 99011 }, // Who is he/she? -> He/She is my _____.
  { id: 99012, question_pattern_id: 99010, answer_pattern_id: 99012 }, // Do you have a pen/an eraser? -> Yes, I do.
  { id: 99013, question_pattern_id: 99010, answer_pattern_id: 99013 }, // Do you have a pen/an eraser? -> No, I don't.

  { id: 99014, question_pattern_id: 99013, answer_pattern_id: 99016 }, // How much is it? -> It's _____ dollars.
  { id: 99015, question_pattern_id: 99014, answer_pattern_id: 99017 }, // Where's _____? -> It is ____. (shared answer)

  // Grade 5 pairs
  { id: 99016, question_pattern_id: 99015, answer_pattern_id: 99018 }, // Do you like sports? -> I like _____.
  { id: 99017, question_pattern_id: 99016, answer_pattern_id: 99019 }, // Does he/she like tea? -> Yes, she/he does.
  { id: 99018, question_pattern_id: 99016, answer_pattern_id: 99020 }, // Does he/she like tea? -> No, she/he doesn't
  { id: 99019, question_pattern_id: 99017, answer_pattern_id: 99021 }, // How many _____ do you need? -> I need _____ _____.
  { id: 99020, question_pattern_id: 99018, answer_pattern_id: 99022 }, // What day is today? -> It's _____.
  { id: 99021, question_pattern_id: 99019, answer_pattern_id: 99023 }, // What's your/his/her favorite subject? -> My/she/he favorite subject is _____.

  // Grade 6 pairs
  { id: 99022, question_pattern_id: 99020, answer_pattern_id: 99024 }, // Where are you from? -> I'm from _____.
  { id: 99023, question_pattern_id: 99021, answer_pattern_id: 99025 }, // Is he/she from _____? -> Yes, _____ is.
  { id: 99024, question_pattern_id: 99021, answer_pattern_id: 99026 }, // Is he/she from _____? -> No, _____ isn't.
  { id: 99025, question_pattern_id: 99022, answer_pattern_id: 99027 }, // What would you like to eat? -> I would like some _____, please.
  { id: 99026, question_pattern_id: 99023, answer_pattern_id: 99028 }, // Would you like some _____? -> Yes, please
  { id: 99027, question_pattern_id: 99023, answer_pattern_id: 99029 }, // Would you like some _____? -> No, thank you.
  { id: 99028, question_pattern_id: 99024, answer_pattern_id: 99030 }, // What time do you _____? -> I _____ at _____.
  { id: 99029, question_pattern_id: 99025, answer_pattern_id: 99031 }, // Do you have lunch at _____? -> Yes, I do.
  { id: 99030, question_pattern_id: 99025, answer_pattern_id: 99032 }, // Do you have lunch at _____? -> No, I don't.

  { id: 99031, question_pattern_id: 99026, answer_pattern_id: 99033 }, // Does he/she have a fever? -> Yes, he/she does.
  { id: 99032, question_pattern_id: 99026, answer_pattern_id: 99034 }, // Does he/she have a fever? -> No, he/she doesn't
];

const mockWords = [
  // Professions (新增：供 Are you a student? 使用)
  {
    id: "Professions01",
    english_singular: "teacher",
    english_plural: "teachers",
    chinese_meaning: "老師",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions02",
    english_singular: "doctor",
    english_plural: "doctors",
    chinese_meaning: "醫生",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions03",
    english_singular: "nurse",
    english_plural: "nurses",
    chinese_meaning: "護理師",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions04",
    english_singular: "engineer",
    english_plural: "engineers",
    chinese_meaning: "工程師",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions05",
    english_singular: "artist",
    english_plural: "artists",
    chinese_meaning: "藝術家",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions06",
    english_singular: "farmer",
    english_plural: "farmers",
    chinese_meaning: "農夫",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions07",
    english_singular: "police officer",
    english_plural: "police officers",
    chinese_meaning: "警察",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions08",
    english_singular: "cook",
    english_plural: "cooks",
    chinese_meaning: "廚師",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions09",
    english_singular: "driver",
    english_plural: "drivers",
    chinese_meaning: "司機",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Professions10",
    english_singular: "student",
    english_plural: "students",
    chinese_meaning: "學生",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // Colors
  {
    id: "Colors01",
    english_singular: "red",
    english_plural: undefined,
    chinese_meaning: "紅色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors02",
    english_singular: "blue",
    english_plural: undefined,
    chinese_meaning: "藍色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors03",
    english_singular: "green",
    english_plural: undefined,
    chinese_meaning: "綠色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors04",
    english_singular: "yellow",
    english_plural: undefined,
    chinese_meaning: "黃色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors05",
    english_singular: "black",
    english_plural: undefined,
    chinese_meaning: "黑色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors06",
    english_singular: "white",
    english_plural: undefined,
    chinese_meaning: "白色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors07",
    english_singular: "pink",
    english_plural: undefined,
    chinese_meaning: "粉色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors08",
    english_singular: "purple",
    english_plural: undefined,
    chinese_meaning: "紫色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Colors10",
    english_singular: "brown",
    english_plural: undefined,
    chinese_meaning: "棕色",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },

  // Stationery
  {
    id: "Stationery01",
    english_singular: "pen",
    english_plural: "pens",
    chinese_meaning: "筆",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Stationery02",
    english_singular: "pencil",
    english_plural: "pencils",
    chinese_meaning: "鉛筆",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Stationery03",
    english_singular: "eraser",
    english_plural: "erasers",
    chinese_meaning: "橡皮擦",
    part_of_speech: "noun" as const,
    has_plural: true,
  },

  // Sports
  {
    id: "Sports01",
    english_singular: "basketball",
    english_plural: "basketballs",
    chinese_meaning: "籃球",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Sports02",
    english_singular: "soccer",
    english_plural: undefined,
    chinese_meaning: "足球",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Sports03",
    english_singular: "baseball",
    english_plural: "baseballs",
    chinese_meaning: "棒球",
    part_of_speech: "noun" as const,
    has_plural: true,
  },

  // School Subjects
  {
    id: "SchoolSubjects01",
    english_singular: "math",
    english_plural: undefined,
    chinese_meaning: "數學",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "SchoolSubjects02",
    english_singular: "science",
    english_plural: undefined,
    chinese_meaning: "科學",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "SchoolSubjects03",
    english_singular: "English",
    english_plural: undefined,
    chinese_meaning: "英文",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "SchoolSubjects04",
    english_singular: "history",
    english_plural: undefined,
    chinese_meaning: "歷史",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "SchoolSubjects05",
    english_singular: "geography",
    english_plural: undefined,
    chinese_meaning: "地理",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "SchoolSubjects06",
    english_singular: "art",
    english_plural: undefined,
    chinese_meaning: "美術",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "SchoolSubjects07",
    english_singular: "music",
    english_plural: undefined,
    chinese_meaning: "音樂",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "SchoolSubjects08",
    english_singular: "PE",
    english_plural: undefined,
    chinese_meaning: "體育",
    part_of_speech: "noun" as const,
    has_plural: false,
  },

  // Numbers
  {
    id: "Numbers01",
    english_singular: "one",
    english_plural: undefined,
    chinese_meaning: "一",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers02",
    english_singular: "two",
    english_plural: undefined,
    chinese_meaning: "二",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers03",
    english_singular: "three",
    english_plural: undefined,
    chinese_meaning: "三",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers04",
    english_singular: "four",
    english_plural: undefined,
    chinese_meaning: "四",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers05",
    english_singular: "five",
    english_plural: undefined,
    chinese_meaning: "五",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers06",
    english_singular: "six",
    english_plural: undefined,
    chinese_meaning: "六",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers07",
    english_singular: "seven",
    english_plural: undefined,
    chinese_meaning: "七",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers08",
    english_singular: "eight",
    english_plural: undefined,
    chinese_meaning: "八",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers09",
    english_singular: "nine",
    english_plural: undefined,
    chinese_meaning: "九",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers10",
    english_singular: "ten",
    english_plural: undefined,
    chinese_meaning: "十",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers11",
    english_singular: "eleven",
    english_plural: undefined,
    chinese_meaning: "十一",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers12",
    english_singular: "twelve",
    english_plural: undefined,
    chinese_meaning: "十二",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers13",
    english_singular: "thirteen",
    english_plural: undefined,
    chinese_meaning: "十三",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers14",
    english_singular: "fourteen",
    english_plural: undefined,
    chinese_meaning: "十四",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers15",
    english_singular: "fifteen",
    english_plural: undefined,
    chinese_meaning: "十五",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers16",
    english_singular: "sixteen",
    english_plural: undefined,
    chinese_meaning: "十六",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers17",
    english_singular: "seventeen",
    english_plural: undefined,
    chinese_meaning: "十七",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers18",
    english_singular: "eighteen",
    english_plural: undefined,
    chinese_meaning: "十八",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers19",
    english_singular: "nineteen",
    english_plural: undefined,
    chinese_meaning: "十九",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers20",
    english_singular: "twenty",
    english_plural: undefined,
    chinese_meaning: "二十",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers21",
    english_singular: "twenty-one",
    english_plural: undefined,
    chinese_meaning: "二十一",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers22",
    english_singular: "twenty-two",
    english_plural: undefined,
    chinese_meaning: "二十二",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers23",
    english_singular: "twenty-three",
    english_plural: undefined,
    chinese_meaning: "二十三",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers24",
    english_singular: "twenty-four",
    english_plural: undefined,
    chinese_meaning: "二十四",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers25",
    english_singular: "twenty-five",
    english_plural: undefined,
    chinese_meaning: "二十五",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers26",
    english_singular: "twenty-six",
    english_plural: undefined,
    chinese_meaning: "二十六",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers27",
    english_singular: "twenty-seven",
    english_plural: undefined,
    chinese_meaning: "二十七",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers28",
    english_singular: "twenty-eight",
    english_plural: undefined,
    chinese_meaning: "二十八",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers29",
    english_singular: "twenty-nine",
    english_plural: undefined,
    chinese_meaning: "二十九",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Numbers30",
    english_singular: "thirty",
    english_plural: undefined,
    chinese_meaning: "三十",
    part_of_speech: "noun" as const,
    has_plural: false,
  },

  // Days of the Week
  {
    id: "DaysOfWeek01",
    english_singular: "Monday",
    english_plural: undefined,
    chinese_meaning: "星期一",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "DaysOfWeek02",
    english_singular: "Tuesday",
    english_plural: undefined,
    chinese_meaning: "星期二",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "DaysOfWeek03",
    english_singular: "Wednesday",
    english_plural: undefined,
    chinese_meaning: "星期三",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "DaysOfWeek04",
    english_singular: "Thursday",
    english_plural: undefined,
    chinese_meaning: "星期四",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "DaysOfWeek05",
    english_singular: "Friday",
    english_plural: undefined,
    chinese_meaning: "星期五",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "DaysOfWeek06",
    english_singular: "Saturday",
    english_plural: undefined,
    chinese_meaning: "星期六",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "DaysOfWeek07",
    english_singular: "Sunday",
    english_plural: undefined,
    chinese_meaning: "星期日",
    part_of_speech: "noun" as const,
    has_plural: false,
  },

  // Countries
  {
    id: "Countries01",
    english_singular: "Taiwan",
    english_plural: undefined,
    chinese_meaning: "台灣",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Countries02",
    english_singular: "Japan",
    english_plural: undefined,
    chinese_meaning: "日本",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Countries03",
    english_singular: "Korea",
    english_plural: undefined,
    chinese_meaning: "韓國",
    part_of_speech: "noun" as const,
    has_plural: false,
  },

  // Food-related
  {
    id: "Food01",
    english_singular: "hamburger",
    english_plural: "hamburgers",
    chinese_meaning: "漢堡",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Food02",
    english_singular: "bread",
    english_plural: undefined,
    chinese_meaning: "麵包",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Food03",
    english_singular: "cake",
    english_plural: "cakes",
    chinese_meaning: "蛋糕",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Food04",
    english_singular: "guava",
    english_plural: "guavas",
    chinese_meaning: "芭樂",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：情緒單字 (EMOTIONS - theme_id: 99284)
  {
    id: "Emotions01",
    english_singular: "happy",
    english_plural: undefined,
    chinese_meaning: "快樂",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Emotions02",
    english_singular: "sad",
    english_plural: undefined,
    chinese_meaning: "傷心",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Emotions03",
    english_singular: "angry",
    english_plural: undefined,
    chinese_meaning: "生氣",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Emotions04",
    english_singular: "excited",
    english_plural: undefined,
    chinese_meaning: "興奮",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  {
    id: "Emotions05",
    english_singular: "tired",
    english_plural: undefined,
    chinese_meaning: "疲倦",
    part_of_speech: "adjective" as const,
    has_plural: false,
  },
  // 新增：身份單字 (IDENTITY - theme_id: 99290)
  {
    id: "Identity01",
    english_singular: "friend",
    english_plural: "friends",
    chinese_meaning: "朋友",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Identity02",
    english_singular: "family",
    english_plural: "families",
    chinese_meaning: "家庭",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：症狀單字 (AILMENTS - theme_id: 99293)
  {
    id: "Ailments01",
    english_singular: "headache",
    english_plural: "headaches",
    chinese_meaning: "頭痛",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Ailments02",
    english_singular: "fever",
    english_plural: undefined,
    chinese_meaning: "發燒",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Ailments03",
    english_singular: "toothache",
    english_plural: undefined,
    chinese_meaning: "牙痛",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Ailments04",
    english_singular: "stomachache",
    english_plural: undefined,
    chinese_meaning: "胃痛",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Ailments05",
    english_singular: "cold",
    english_plural: "colds",
    chinese_meaning: "感冒",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Ailments06",
    english_singular: "cough",
    english_plural: "coughs",
    chinese_meaning: "咳嗽",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：飲料單字 (DRINKS - theme_id: 99300)
  {
    id: "Drinks01",
    english_singular: "tea",
    english_plural: undefined,
    chinese_meaning: "茶",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Drinks02",
    english_singular: "coffee",
    english_plural: undefined,
    chinese_meaning: "咖啡",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Drinks03",
    english_singular: "juice",
    english_plural: "juices",
    chinese_meaning: "果汁",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Drinks04",
    english_singular: "milk",
    english_plural: undefined,
    chinese_meaning: "牛奶",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Drinks05",
    english_singular: "water",
    english_plural: undefined,
    chinese_meaning: "水",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Drinks06",
    english_singular: "soda",
    english_plural: "sodas",
    chinese_meaning: "汽水",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：食物單字 (FAST FOOD - theme_id: 99307)
  {
    id: "FastFood01",
    english_singular: "hamburger",
    english_plural: "hamburgers",
    chinese_meaning: "漢堡",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "FastFood02",
    english_singular: "pizza",
    english_plural: "pizzas",
    chinese_meaning: "披薩",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "FastFood03",
    english_singular: "sandwich",
    english_plural: "sandwiches",
    chinese_meaning: "三明治",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "FastFood04",
    english_singular: "noodles",
    english_plural: undefined,
    chinese_meaning: "麵條",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  // 新增：更多文具單字 (STATIONERY - theme_id: 99312)
  {
    id: "Stationery04",
    english_singular: "ruler",
    english_plural: "rulers",
    chinese_meaning: "尺",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Stationery05",
    english_singular: "marker",
    english_plural: "markers",
    chinese_meaning: "麥克筆",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Stationery06",
    english_singular: "notebook",
    english_plural: "notebooks",
    chinese_meaning: "筆記本",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Stationery07",
    english_singular: "book",
    english_plural: "books",
    chinese_meaning: "書",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：日常動作單字 (DAILY ACTIONS - theme_id: 99317)
  {
    id: "DailyActions01",
    english_singular: "get up",
    english_plural: undefined,
    chinese_meaning: "起床",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions02",
    english_singular: "wake up",
    english_plural: undefined,
    chinese_meaning: "醒來",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions03",
    english_singular: "eat breakfast",
    english_plural: undefined,
    chinese_meaning: "吃早餐",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions04",
    english_singular: "go to school",
    english_plural: undefined,
    chinese_meaning: "去學校",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions05",
    english_singular: "study",
    english_plural: undefined,
    chinese_meaning: "讀書",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions06",
    english_singular: "read",
    english_plural: undefined,
    chinese_meaning: "閱讀",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions07",
    english_singular: "sleep",
    english_plural: undefined,
    chinese_meaning: "睡覺",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  // 新增：時間表達單字 (TIME EXPRESSIONS - theme_id: 99325)
  {
    id: "TimeExpressions01",
    english_singular: "one o'clock",
    english_plural: undefined,
    chinese_meaning: "一點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions02",
    english_singular: "two o'clock",
    english_plural: undefined,
    chinese_meaning: "兩點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions03",
    english_singular: "three o'clock",
    english_plural: undefined,
    chinese_meaning: "三點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions04",
    english_singular: "four o'clock",
    english_plural: undefined,
    chinese_meaning: "四點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions05",
    english_singular: "five o'clock",
    english_plural: undefined,
    chinese_meaning: "五點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions06",
    english_singular: "six o'clock",
    english_plural: undefined,
    chinese_meaning: "六點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions07",
    english_singular: "seven o'clock",
    english_plural: undefined,
    chinese_meaning: "七點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions08",
    english_singular: "eight o'clock",
    english_plural: undefined,
    chinese_meaning: "八點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions09",
    english_singular: "nine o'clock",
    english_plural: undefined,
    chinese_meaning: "九點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions10",
    english_singular: "ten o'clock",
    english_plural: undefined,
    chinese_meaning: "十點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions11",
    english_singular: "eleven o'clock",
    english_plural: undefined,
    chinese_meaning: "十一點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions12",
    english_singular: "twelve o'clock",
    english_plural: undefined,
    chinese_meaning: "十二點鐘",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions13",
    english_singular: "half past one",
    english_plural: undefined,
    chinese_meaning: "一點半",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions14",
    english_singular: "half past two",
    english_plural: undefined,
    chinese_meaning: "兩點半",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions15",
    english_singular: "half past three",
    english_plural: undefined,
    chinese_meaning: "三點半",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions16",
    english_singular: "quarter past one",
    english_plural: undefined,
    chinese_meaning: "一點十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions17",
    english_singular: "quarter past two",
    english_plural: undefined,
    chinese_meaning: "兩點十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions18",
    english_singular: "quarter to one",
    english_plural: undefined,
    chinese_meaning: "十二點四十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "TimeExpressions19",
    english_singular: "quarter to two",
    english_plural: undefined,
    chinese_meaning: "一點四十五分",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  // 新增：水果單字 (FRUITS - theme_id: 99345)
  {
    id: "Fruits01",
    english_singular: "apple",
    english_plural: "apples",
    chinese_meaning: "蘋果",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Fruits02",
    english_singular: "banana",
    english_plural: "bananas",
    chinese_meaning: "香蕉",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Colors09",
    english_singular: "orange",
    english_plural: "oranges",
    chinese_meaning: "橘子",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Fruits04",
    english_singular: "grape",
    english_plural: "grapes",
    chinese_meaning: "葡萄",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Fruits05",
    english_singular: "guava",
    english_plural: "guavas",
    chinese_meaning: "芭樂",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Fruits06",
    english_singular: "lemon",
    english_plural: "lemons",
    chinese_meaning: "檸檬",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Fruits07",
    english_singular: "strawberry",
    english_plural: "strawberries",
    chinese_meaning: "草莓",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：玩具單字 (TOYS - theme_id: 99353)
  {
    id: "Toys01",
    english_singular: "ball",
    english_plural: "balls",
    chinese_meaning: "球",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys02",
    english_singular: "car",
    english_plural: "cars",
    chinese_meaning: "車子",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys03",
    english_singular: "doll",
    english_plural: "dolls",
    chinese_meaning: "娃娃",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys04",
    english_singular: "kite",
    english_plural: "kites",
    chinese_meaning: "風箏",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys05",
    english_singular: "robot",
    english_plural: "robots",
    chinese_meaning: "機器人",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys06",
    english_singular: "block",
    english_plural: "blocks",
    chinese_meaning: "積木",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys07",
    english_singular: "puzzle",
    english_plural: "puzzles",
    chinese_meaning: "拼圖",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys08",
    english_singular: "yo-yo",
    english_plural: "yo-yos",
    chinese_meaning: "溜溜球",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys09",
    english_singular: "scooter",
    english_plural: "scooters",
    chinese_meaning: "滑板車",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Toys10",
    english_singular: "teddy bear",
    english_plural: "teddy bears",
    chinese_meaning: "泰迪熊",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：家具單字 (FURNITURE - theme_id: 99364)
  {
    id: "Furniture01",
    english_singular: "table",
    english_plural: "tables",
    chinese_meaning: "桌子",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture02",
    english_singular: "chair",
    english_plural: "chairs",
    chinese_meaning: "椅子",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture03",
    english_singular: "desk",
    english_plural: "desks",
    chinese_meaning: "書桌",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture04",
    english_singular: "bed",
    english_plural: "beds",
    chinese_meaning: "床",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture05",
    english_singular: "sofa",
    english_plural: "sofas",
    chinese_meaning: "沙發",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture06",
    english_singular: "lamp",
    english_plural: "lamps",
    chinese_meaning: "檯燈",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture07",
    english_singular: "bookshelf",
    english_plural: "bookshelves",
    chinese_meaning: "書架",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture08",
    english_singular: "wardrobe",
    english_plural: "wardrobes",
    chinese_meaning: "衣櫃",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture09",
    english_singular: "mirror",
    english_plural: "mirrors",
    chinese_meaning: "鏡子",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Furniture10",
    english_singular: "rug",
    english_plural: "rugs",
    chinese_meaning: "地毯",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：月份單字 (MONTHS - theme_id: 99375)
  {
    id: "Months01",
    english_singular: "January",
    english_plural: undefined,
    chinese_meaning: "一月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months02",
    english_singular: "February",
    english_plural: undefined,
    chinese_meaning: "二月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months03",
    english_singular: "March",
    english_plural: undefined,
    chinese_meaning: "三月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months04",
    english_singular: "April",
    english_plural: undefined,
    chinese_meaning: "四月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months05",
    english_singular: "May",
    english_plural: undefined,
    chinese_meaning: "五月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months06",
    english_singular: "June",
    english_plural: undefined,
    chinese_meaning: "六月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months07",
    english_singular: "July",
    english_plural: undefined,
    chinese_meaning: "七月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months08",
    english_singular: "August",
    english_plural: undefined,
    chinese_meaning: "八月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months09",
    english_singular: "September",
    english_plural: undefined,
    chinese_meaning: "九月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months10",
    english_singular: "October",
    english_plural: undefined,
    chinese_meaning: "十月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months11",
    english_singular: "November",
    english_plural: undefined,
    chinese_meaning: "十一月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Months12",
    english_singular: "December",
    english_plural: undefined,
    chinese_meaning: "十二月",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  // 新增：更多國家單字 (COUNTRIES - theme_id: 99388)
  {
    id: "Countries04",
    english_singular: "USA",
    english_plural: undefined,
    chinese_meaning: "美國",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Countries05",
    english_singular: "Canada",
    english_plural: undefined,
    chinese_meaning: "加拿大",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Countries06",
    english_singular: "China",
    english_plural: undefined,
    chinese_meaning: "中國",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Countries07",
    english_singular: "Singapore",
    english_plural: undefined,
    chinese_meaning: "新加坡",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Countries08",
    english_singular: "Thailand",
    english_plural: undefined,
    chinese_meaning: "泰國",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Countries09",
    english_singular: "France",
    english_plural: undefined,
    chinese_meaning: "法國",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  // 新增：烘焙點心單字 (BAKERY & SNACKS - theme_id: 99395)
  {
    id: "BakerySnacks01",
    english_singular: "bread",
    english_plural: undefined,
    chinese_meaning: "麵包",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "BakerySnacks02",
    english_singular: "cake",
    english_plural: "cakes",
    chinese_meaning: "蛋糕",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BakerySnacks03",
    english_singular: "cookie",
    english_plural: "cookies",
    chinese_meaning: "餅乾",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BakerySnacks04",
    english_singular: "donut",
    english_plural: "donuts",
    chinese_meaning: "甜甜圈",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BakerySnacks05",
    english_singular: "pie",
    english_plural: "pies",
    chinese_meaning: "派",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BakerySnacks06",
    english_singular: "candy",
    english_plural: "candies",
    chinese_meaning: "糖果",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：主菜單字 (MAIN DISHES - theme_id: 99402)
  {
    id: "MainDishes01",
    english_singular: "rice",
    english_plural: undefined,
    chinese_meaning: "米飯",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "MainDishes02",
    english_singular: "noodles",
    english_plural: undefined,
    chinese_meaning: "麵條",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "MainDishes03",
    english_singular: "dumplings",
    english_plural: undefined,
    chinese_meaning: "餃子",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "MainDishes04",
    english_singular: "bento",
    english_plural: "bentos",
    chinese_meaning: "便當",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "MainDishes05",
    english_singular: "hot pot",
    english_plural: "hot pots",
    chinese_meaning: "火鍋",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "MainDishes06",
    english_singular: "beef noodle soup",
    english_plural: undefined,
    chinese_meaning: "牛肉麵",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "MainDishes07",
    english_singular: "fried rice",
    english_plural: undefined,
    chinese_meaning: "炒飯",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "MainDishes08",
    english_singular: "pasta",
    english_plural: undefined,
    chinese_meaning: "義大利麵",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "MainDishes09",
    english_singular: "steak",
    english_plural: "steaks",
    chinese_meaning: "牛排",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "MainDishes10",
    english_singular: "sandwich",
    english_plural: "sandwiches",
    chinese_meaning: "三明治",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：珍珠奶茶配料單字 (BUBBLE TEA TOPPINGS - theme_id: 99413)
  {
    id: "BubbleTeaToppings01",
    english_singular: "pearls",
    english_plural: undefined,
    chinese_meaning: "珍珠",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "BubbleTeaToppings02",
    english_singular: "boba",
    english_plural: undefined,
    chinese_meaning: "波霸",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "BubbleTeaToppings03",
    english_singular: "pudding",
    english_plural: "puddings",
    chinese_meaning: "布丁",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BubbleTeaToppings04",
    english_singular: "grass jelly",
    english_plural: undefined,
    chinese_meaning: "仙草凍",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "BubbleTeaToppings05",
    english_singular: "aloe vera",
    english_plural: undefined,
    chinese_meaning: "蘆薈",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "BubbleTeaToppings06",
    english_singular: "red bean",
    english_plural: undefined,
    chinese_meaning: "紅豆",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "BubbleTeaToppings07",
    english_singular: "taro balls",
    english_plural: undefined,
    chinese_meaning: "芋圓",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Identity03",
    english_singular: "family",
    english_plural: "families",
    chinese_meaning: "家庭",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Identity04",
    english_singular: "brother",
    english_plural: "brothers",
    chinese_meaning: "兄弟",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Identity05",
    english_singular: "sister",
    english_plural: "sisters",
    chinese_meaning: "姐妹",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：日常動作單字 (DAILY_ACTIONS - theme_id: 99424)
  {
    id: "DailyActions08",
    english_singular: "wake up",
    english_plural: undefined,
    chinese_meaning: "起床",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions09",
    english_singular: "brush teeth",
    english_plural: undefined,
    chinese_meaning: "刷牙",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions10",
    english_singular: "eat breakfast",
    english_plural: undefined,
    chinese_meaning: "吃早餐",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions11",
    english_singular: "go to school",
    english_plural: undefined,
    chinese_meaning: "去學校",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  {
    id: "DailyActions12",
    english_singular: "study",
    english_plural: undefined,
    chinese_meaning: "讀書",
    part_of_speech: "verb" as const,
    has_plural: false,
  },
  // 新增：衣物單字 (CLOTHING - theme_id: 99430)
  {
    id: "Clothing01",
    english_singular: "shirt",
    english_plural: "shirts",
    chinese_meaning: "襯衫",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Clothing02",
    english_singular: "pants",
    english_plural: "pants",
    chinese_meaning: "褲子",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Clothing03",
    english_singular: "dress",
    english_plural: "dresses",
    chinese_meaning: "洋裝",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "Clothing04",
    english_singular: "shoes",
    english_plural: "shoes",
    chinese_meaning: "鞋子",
    part_of_speech: "noun" as const,
    has_plural: false,
  },
  {
    id: "Clothing05",
    english_singular: "hat",
    english_plural: "hats",
    chinese_meaning: "帽子",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  // 新增：建築物和地點單字 (BUILDINGS_PLACES - theme_id: 99436)
  {
    id: "BuildingsPlaces01",
    english_singular: "school",
    english_plural: "schools",
    chinese_meaning: "學校",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BuildingsPlaces02",
    english_singular: "hospital",
    english_plural: "hospitals",
    chinese_meaning: "醫院",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BuildingsPlaces03",
    english_singular: "library",
    english_plural: "libraries",
    chinese_meaning: "圖書館",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BuildingsPlaces04",
    english_singular: "park",
    english_plural: "parks",
    chinese_meaning: "公園",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  {
    id: "BuildingsPlaces05",
    english_singular: "restaurant",
    english_plural: "restaurants",
    chinese_meaning: "餐廳",
    part_of_speech: "noun" as const,
    has_plural: true,
  },
  ,
  {
    id: "McDonaldItems01",
    english_singular: "cheeseburger",
    english_plural: "cheeseburgers",
    chinese_meaning: "起司漢堡",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "McDonaldItems02",
    english_singular: "milkshake",
    english_plural: "milkshakes",
    chinese_meaning: "奶昔",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "McDonaldItems03",
    english_singular: "nuggets",
    english_plural: null,
    chinese_meaning: "雞塊",
    part_of_speech: "noun",
    has_plural: false,
  },
  {
    id: "McDonaldItems04",
    english_singular: "wrap",
    english_plural: "wraps",
    chinese_meaning: "捲餅",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "McDonaldItems05",
    english_singular: "croissant",
    english_plural: "croissants",
    chinese_meaning: "可頌",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "McDonaldItems06",
    english_singular: "cupcake",
    english_plural: "cupcakes",
    chinese_meaning: "杯子蛋糕",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "McDonaldItems07",
    english_singular: "cracker",
    english_plural: "crackers",
    chinese_meaning: "餅乾",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "McDonaldItems08",
    english_singular: "popcorn",
    english_plural: null,
    chinese_meaning: "爆米花",
    part_of_speech: "noun",
    has_plural: false,
  },
  {
    id: "BubbleTeaItems01",
    english_singular: "boba",
    english_plural: null,
    chinese_meaning: "波霸",
    part_of_speech: "noun",
    has_plural: false,
  },
  {
    id: "BubbleTeaItems02",
    english_singular: "coconut jelly",
    english_plural: "coconut jellies",
    chinese_meaning: "椰果",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "BubbleTeaItems03",
    english_singular: "grass jelly",
    english_plural: "grass jellies",
    chinese_meaning: "仙草",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: "BubbleTeaItems04",
    english_singular: "milk foam",
    english_plural: null,
    chinese_meaning: "奶蓋",
    part_of_speech: "noun",
    has_plural: false,
  },
  {
    id: "BubbleTeaItems05",
    english_singular: "brown sugar",
    english_plural: null,
    chinese_meaning: "黑糖",
    part_of_speech: "noun",
    has_plural: false,
  },
];

// Mock word theme associations
const wordThemeMap = new Map<string, number[]>([
  // Professions (新增)
  ["Professions01", [THEME_IDS.PROFESSIONS]],
  ["Professions02", [THEME_IDS.PROFESSIONS]],
  ["Professions03", [THEME_IDS.PROFESSIONS]],
  ["Professions04", [THEME_IDS.PROFESSIONS]],
  ["Professions05", [THEME_IDS.PROFESSIONS]],
  ["Professions06", [THEME_IDS.PROFESSIONS]],
  ["Professions07", [THEME_IDS.PROFESSIONS]],
  ["Professions08", [THEME_IDS.PROFESSIONS]],
  ["Professions09", [THEME_IDS.PROFESSIONS]],
  ["Professions10", [THEME_IDS.PROFESSIONS]],
  // Colors
  ["Colors01", [2]],
  ["Colors02", [2]],
  ["Colors03", [2]],
  // Stationery
  ["Stationery01", [4]],
  ["Stationery02", [4]],
  ["Stationery03", [4]],
  // Sports
  ["Sports01", [3]],
  ["Sports02", [3]],
  ["Sports03", [3]],
  // Numbers
  ["Numbers01", [23]],
  ["Numbers02", [23]],
  ["Numbers03", [23]],
  ["Numbers04", [23]],
  ["Numbers05", [23]],
  ["Numbers06", [23]],
  ["Numbers07", [23]],
  ["Numbers08", [23]],
  ["Numbers09", [23]],
  ["Numbers10", [23]],
  ["Numbers11", [23]],
  ["Numbers12", [23]],
  ["Numbers13", [23]],
  ["Numbers14", [23]],
  ["Numbers15", [23]],
  ["Numbers16", [23]],
  ["Numbers17", [23]],
  ["Numbers18", [23]],
  ["Numbers19", [23]],
  ["Numbers20", [23]],
  ["Numbers21", [23]],
  ["Numbers22", [23]],
  ["Numbers23", [23]],
  ["Numbers24", [23]],
  ["Numbers25", [23]],
  ["Numbers26", [23]],
  ["Numbers27", [23]],
  ["Numbers28", [23]],
  ["Numbers29", [23]],
  ["Numbers30", [23]],
  // School Subjects
  ["SchoolSubjects01", [10]],
  ["SchoolSubjects02", [10]],
  ["SchoolSubjects03", [10]],
  ["SchoolSubjects04", [10]],
  ["SchoolSubjects05", [10]],
  ["SchoolSubjects06", [10]],
  ["SchoolSubjects07", [10]],
  ["SchoolSubjects08", [10]],
  // Days of the Week
  ["DaysOfWeek01", [8]],
  ["DaysOfWeek02", [8]],
  ["DaysOfWeek03", [8]],
  ["DaysOfWeek04", [8]],
  ["DaysOfWeek05", [8]],
  ["DaysOfWeek06", [8]],
  ["DaysOfWeek07", [8]],
  // Countries
  ["Countries01", [12]],
  ["Countries02", [12]],
  ["Countries03", [12]],
  // Food-related
  // Emotions
  ["Emotions01", [1]],
  ["Emotions02", [1]],
  ["Emotions03", [1]],
  ["Emotions04", [1]],
  ["Emotions05", [1]],
  // Identity
  ["Identity01", [18]],
  ["Identity02", [18]],
  ["Identity03", [18]],
  ["Identity04", [18]],
  // Ailments
  ["Ailments01", [11]],
  ["Ailments02", [11]],
  ["Ailments03", [11]],
  ["Ailments04", [11]],
  ["Ailments05", [11]],
  ["Ailments06", [11]],
  // Drinks
  ["Drinks01", [15]],
  ["Drinks02", [15]],
  ["Drinks03", [15]],
  ["Drinks04", [15]],
  ["Drinks05", [15]],
  ["Drinks06", [15]],
  // Fast Food
  // Stationery (補充)
  ["Stationery04", [4]],
  ["Stationery05", [4]],
  ["Stationery06", [4]],
  ["Stationery07", [4]],
  // Daily Actions (完整映射)
  ["DailyActions01", [20]],
  ["DailyActions02", [20]],
  ["DailyActions03", [20]],
  ["DailyActions04", [20]],
  ["DailyActions05", [20]],
  ["DailyActions06", [20]],
  ["DailyActions07", [20]],
  ["DailyActions08", [20]],
  ["DailyActions09", [20]],
  ["DailyActions10", [20]],
  ["DailyActions11", [20]],
  ["DailyActions12", [20]],
  // Time Expressions
  ["TimeExpressions01", [24]],
  ["TimeExpressions02", [24]],
  ["TimeExpressions03", [24]],
  ["TimeExpressions04", [24]],
  ["TimeExpressions05", [24]],
  ["TimeExpressions06", [24]],
  ["TimeExpressions07", [24]],
  ["TimeExpressions08", [24]],
  ["TimeExpressions09", [24]],
  ["TimeExpressions10", [24]],
  ["TimeExpressions11", [24]],
  ["TimeExpressions12", [24]],
  ["TimeExpressions13", [24]],
  ["TimeExpressions14", [24]],
  ["TimeExpressions15", [24]],
  ["TimeExpressions16", [24]],
  ["TimeExpressions17", [24]],
  ["TimeExpressions18", [24]],
  ["TimeExpressions19", [24]],
  // Fruits
  ["Fruits01", [5]],
  ["Fruits02", [5]],
  ["Fruits03", [5]],
  ["Fruits04", [5]],
  ["Fruits05", [5]],
  ["Fruits06", [5]],
  ["Fruits07", [5]],
  // Toys
  ["Toys01", [14]],
  ["Toys02", [14]],
  ["Toys03", [14]],
  ["Toys04", [14]],
  ["Toys05", [14]],
  ["Toys06", [14]],
  ["Toys07", [14]],
  ["Toys08", [14]],
  ["Toys09", [14]],
  ["Toys10", [14]],
  // Furniture
  ["Furniture01", [13]],
  ["Furniture02", [13]],
  ["Furniture03", [13]],
  ["Furniture04", [13]],
  ["Furniture05", [13]],
  ["Furniture06", [13]],
  ["Furniture07", [13]],
  ["Furniture08", [13]],
  ["Furniture09", [13]],
  ["Furniture10", [13]],
  // Months
  ["Months01", [9]],
  ["Months02", [9]],
  ["Months03", [9]],
  ["Months04", [9]],
  ["Months05", [9]],
  ["Months06", [9]],
  ["Months07", [9]],
  ["Months08", [9]],
  ["Months09", [9]],
  ["Months10", [9]],
  ["Months11", [9]],
  ["Months12", [9]],
  // Countries (補充)
  ["Countries04", [12]],
  ["Countries05", [12]],
  ["Countries06", [12]],
  ["Countries07", [12]],
  ["Countries08", [12]],
  ["Countries09", [12]],
  // Bakery & Snacks
  // Main Dishes
  ["MainDishes01", [16]],
  ["MainDishes02", [16]],
  ["MainDishes03", [16]],
  ["MainDishes04", [16]],
  ["MainDishes05", [16]],
  ["MainDishes06", [16]],
  ["MainDishes07", [16]],
  ["MainDishes08", [16]],
  ["MainDishes09", [16]],
  ["MainDishes10", [16]],
  // Bubble Tea Toppings
  // Clothing
  ["Clothing01", [21]],
  ["Clothing02", [21]],
  ["Clothing03", [21]],
  ["Clothing04", [21]],
  ["Clothing05", [21]],
  // Buildings/Places
  ["BuildingsPlaces01", [22]],
  ["BuildingsPlaces02", [22]],
  ["BuildingsPlaces03", [22]],
  ["BuildingsPlaces04", [22]],
  ["BuildingsPlaces05", [22]],

  ["Colors04", [2]],
  ["Colors05", [2]],
  ["Colors06", [2]],
  ["Colors07", [2]],
  ["Colors08", [2]],
  ["Colors09", [2]],
  ["Colors10", [2]],
  // Fast Food (theme_id: 6)
  ["FastFood01", [6]],
  ["FastFood02", [6]],
  ["FastFood03", [6]],
  ["FastFood04", [6]],
  ["FastFood05", [6]],
  ["FastFood06", [6]],
  // Bakery & Snacks (theme_id: 7)
  ["BakerySnacks01", [7]],
  ["BakerySnacks02", [7]],
  ["BakerySnacks03", [7]],
  ["BakerySnacks04", [7]],
  ["BakerySnacks05", [7]],
  ["BakerySnacks06", [7]],
  // Bubble Tea Toppings (theme_id: 17)
  ["BubbleTeaToppings01", [17]],
  ["BubbleTeaToppings02", [17]],
  ["BubbleTeaToppings03", [17]],
  ["BubbleTeaToppings04", [17]],
  ["BubbleTeaToppings05", [17]],
  ["BubbleTeaToppings06", [17]],
  ["BubbleTeaToppings07", [17]],
  // Identity (theme_id: 18) - 補充
  ["Identity05", [18]],
  // 其他遺漏的單字
  ["BubbleTeaItems01", [17]],
  ["BubbleTeaItems02", [17]],
  ["BubbleTeaItems03", [17]],
  ["BubbleTeaItems04", [17]],
  ["BubbleTeaItems05", [17]],
  ["Food01", [6]],
  ["Food02", [6]],
  ["Food03", [6]],
  ["Food04", [6]],
  ["McDonaldItems01", [6]],
  ["McDonaldItems02", [6]],
  ["McDonaldItems03", [6]],
  ["McDonaldItems04", [6]],
  ["McDonaldItems05", [6]],
  ["McDonaldItems06", [6]],
  ["McDonaldItems07", [6]],
  ["McDonaldItems08", [6]],
  // 補充更多遺漏的單字映射
  ["Numbers31", [23]],
  ["Numbers32", [23]],
  ["Numbers33", [23]],
  ["Numbers34", [23]],
  ["Numbers35", [23]],
  ["Numbers36", [23]],
  ["Numbers37", [23]],
  ["Numbers38", [23]],
  ["Numbers39", [23]],
  ["Numbers40", [23]],
  ["Numbers41", [23]],
  ["Numbers42", [23]],
  ["Numbers43", [23]],
  ["Numbers44", [23]],
  ["Numbers45", [23]],
  ["Numbers46", [23]],
  ["Numbers47", [23]],
  ["Numbers48", [23]],
  ["Numbers49", [23]],
  ["Numbers50", [23]],
  ["Numbers51", [23]],
  ["Numbers52", [23]],
  ["Numbers53", [23]],
  ["Numbers54", [23]],
  ["Numbers55", [23]],
  ["Numbers56", [23]],
  ["Numbers57", [23]],
  ["Numbers58", [23]],
  ["Numbers59", [23]],
  ["Numbers60", [23]],
  ["Numbers61", [23]],
  ["Numbers62", [23]],
  ["Numbers63", [23]],
  ["Numbers64", [23]],
  ["Numbers65", [23]],
  ["Numbers66", [23]],
  ["Numbers67", [23]],
  ["Numbers68", [23]],
  ["Numbers69", [23]],
  ["Numbers70", [23]],
  ["Numbers71", [23]],
  ["Numbers72", [23]],
  ["Numbers73", [23]],
  ["Numbers74", [23]],
  ["Numbers75", [23]],
  ["Numbers76", [23]],
  ["Numbers77", [23]],
  ["Numbers78", [23]],
  ["Numbers79", [23]],
  ["Numbers80", [23]],
  ["Numbers81", [23]],
  ["Numbers82", [23]],
  ["Numbers83", [23]],
  ["Numbers84", [23]],
  ["Numbers85", [23]],
  ["Numbers86", [23]],
  ["Numbers87", [23]],
  ["Numbers88", [23]],
  ["Numbers89", [23]],
  ["Numbers90", [23]],
  ["Numbers91", [23]],
  ["Numbers92", [23]],
  ["Numbers93", [23]],
  ["Numbers94", [23]],
  ["Numbers95", [23]],
  ["Numbers96", [23]],
  ["Numbers97", [23]],
  ["Numbers98", [23]],
  ["Numbers99", [23]],
  ["Numbers100", [23]],
]);

// Function to get game data based on selections
function getGameData(
  grade_id: string | number,
  pattern_ids: number[],
  theme_ids: number[],
  plural_form_option: string
): GameData {
  // 處理字串和數字格式的年級 ID
  const gradeString =
    typeof grade_id === "string" ? grade_id : grade_id.toString();

  // Filter patterns by grade and selected IDs
  const patterns = mockSentencePatterns.filter(
    (pattern) =>
      pattern.grade_id === gradeString && pattern_ids.includes(pattern.id)
  );

  // Filter words by selected themes
  let words = mockWords.filter((word) => {
    // 確保是有效的 Word 對象
    if (
      !word ||
      typeof word !== "object" ||
      !("id" in word) ||
      (typeof word.id !== "number" && typeof word.id !== "string")
    )
      return false;
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
      words.filter(
        (w) =>
          w &&
          typeof w === "object" &&
          "id" in w &&
          typeof w.id === "string" &&
          w.id.startsWith("Numbers")
      ).length
    );
    console.log(
      "📊 Number word IDs:",
      words
        .filter(
          (w) =>
            w &&
            typeof w === "object" &&
            "id" in w &&
            typeof w.id === "string" &&
            w.id.startsWith("Numbers")
        )
        .map((w) => (w as any).id)
    );

    // 詳細檢查每個數字單字
    const numberWords = words.filter(
      (w) =>
        w &&
        typeof w === "object" &&
        "id" in w &&
        typeof w.id === "string" &&
        w.id.startsWith("Numbers")
    );
    console.log(
      "📊 Number words details:",
      numberWords.map((w) => ({
        id: (w as any).id,
        english: (w as any).english_singular,
        chinese: (w as any).chinese_meaning,
      }))
    );

    // 檢查 mockWords 中的數字單字
    const mockNumberWords = mockWords.filter(
      (w) =>
        w &&
        typeof w === "object" &&
        "id" in w &&
        typeof w.id === "string" &&
        w.id.startsWith("Numbers")
    );
    console.log("📊 Mock number words count:", mockNumberWords.length);
    console.log(
      "📊 Mock number word IDs:",
      mockNumberWords.map((w) => (w as any).id)
    );
  }

  // 調試日誌：檢查 BUILDINGS_PLACES 主題的單字過濾結果
  if (theme_ids.includes(22)) {
    console.log("🏢 BUILDINGS_PLACES theme selected");
    console.log("📊 Total words before filtering:", mockWords.length);
    console.log("📊 Words after theme filtering:", words.length);
    console.log(
      "📊 Buildings/Places words found:",
      words.filter(
        (w) =>
          w &&
          typeof w === "object" &&
          "id" in w &&
          typeof w.id === "string" &&
          w.id.startsWith("BuildingsPlaces")
      ).length
    );
    console.log(
      "📊 Buildings/Places word IDs:",
      words
        .filter(
          (w) =>
            w &&
            typeof w === "object" &&
            "id" in w &&
            typeof w.id === "string" &&
            w.id.startsWith("BuildingsPlaces")
        )
        .map((w) => (w as any).id)
    );

    // 詳細檢查每個建築物/地點單字
    const buildingsWords = words.filter(
      (w) =>
        w &&
        typeof w === "object" &&
        "id" in w &&
        typeof w.id === "string" &&
        w.id.startsWith("BuildingsPlaces")
    );
    console.log(
      "📊 Buildings/Places words details:",
      buildingsWords.map((w) => ({
        id: (w as any).id,
        english: (w as any).english_singular,
        chinese: (w as any).chinese_meaning,
      }))
    );

    // 檢查 mockWords 中的建築物/地點單字
    const mockBuildingsWords = mockWords.filter(
      (w) =>
        w &&
        typeof w === "object" &&
        "id" in w &&
        typeof w.id === "string" &&
        w.id.startsWith("BuildingsPlaces")
    );
    console.log(
      "📊 Mock buildings/places words count:",
      mockBuildingsWords.length
    );
    console.log(
      "📊 Mock buildings/places word IDs:",
      mockBuildingsWords.map((w) => (w as any).id)
    );
  }

  // 數字主題 (id: 99455) 的單字已經在 mockWords 中，並通過 wordThemeMap 正確關聯
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
    const grade_id = searchParams.get("grade_id") || "G3";
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

// 導出 mock 資料供其他 API 路由使用
export {
  mockGrades,
  mockThemes,
  mockSentencePatterns,
  mockAnswerPatterns,
  mockQuestionAnswerPairs,
  mockWords,
  wordThemeMap,
};
