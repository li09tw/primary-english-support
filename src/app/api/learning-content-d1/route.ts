import { NextRequest, NextResponse } from "next/server";

// 強制動態渲染
export const dynamic = "force-dynamic";
import {
  LearningContentResponse,
  WordsByThemeResponse,
  SentencePatternsResponse,
  ThemesResponse,
  Grade,
} from "@/types/learning-content";

// D1 database interface (for Cloudflare Workers)
interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  exec: (query: string) => Promise<D1Result>;
}

interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement;
  first: (colName?: string) => Promise<any>;
  run: () => Promise<D1Result>;
  all: () => Promise<D1Result>;
}

interface D1Result {
  results: any[];
  success: boolean;
  meta: any;
}

// Mock D1 for local development
const mockD1: D1Database = {
  prepare: (query: string) => ({
    bind: (...values: any[]) => mockD1.prepare(query),
    first: async () => null,
    run: async () => ({ results: [], success: true, meta: {} }),
    all: async (...values: any[]) => {
      // 根據查詢類型返回對應的測試資料
      if (query.includes("word_themes")) {
        return {
          success: true,
          results: [
            { id: 1, name: "Emotions" },
            { id: 2, name: "Colors" },
            { id: 3, name: "Sports" },
            { id: 4, name: "Stationery" },
            { id: 5, name: "Fruits" },
            { id: 6, name: "Fast Food" },
            { id: 7, name: "Bakery Snacks" },
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
            { id: 22, name: "Buildings Places" },
            { id: 23, name: "Numbers" },
            { id: 24, name: "Time Expressions" },
          ],
          meta: {},
        };
      }

      if (
        query.includes("words") &&
        query.includes("word_theme_associations")
      ) {
        // 根據 theme_id 返回對應的單字
        const themeId = values[0];
        const partOfSpeech = values[1];

        const mockWords: Record<number, any[]> = {
          1: [
            // Emotions
            {
              id: 1,
              english_singular: "happy",
              english_plural: null,
              chinese_meaning: "快樂",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 2,
              english_singular: "sad",
              english_plural: null,
              chinese_meaning: "悲傷",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 3,
              english_singular: "angry",
              english_plural: null,
              chinese_meaning: "生氣",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 4,
              english_singular: "excited",
              english_plural: null,
              chinese_meaning: "興奮",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 5,
              english_singular: "tired",
              english_plural: null,
              chinese_meaning: "疲憊",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 6,
              english_singular: "scared",
              english_plural: null,
              chinese_meaning: "害怕",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 7,
              english_singular: "bored",
              english_plural: null,
              chinese_meaning: "無聊",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
          ],
          2: [
            // Colors
            {
              id: 8,
              english_singular: "red",
              english_plural: null,
              chinese_meaning: "紅色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 9,
              english_singular: "blue",
              english_plural: null,
              chinese_meaning: "藍色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 10,
              english_singular: "green",
              english_plural: null,
              chinese_meaning: "綠色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 11,
              english_singular: "yellow",
              english_plural: null,
              chinese_meaning: "黃色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 12,
              english_singular: "black",
              english_plural: null,
              chinese_meaning: "黑色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 13,
              english_singular: "white",
              english_plural: null,
              chinese_meaning: "白色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 14,
              english_singular: "pink",
              english_plural: null,
              chinese_meaning: "粉色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 15,
              english_singular: "purple",
              english_plural: null,
              chinese_meaning: "紫色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 16,
              english_singular: "orange",
              english_plural: null,
              chinese_meaning: "橘色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
            {
              id: 17,
              english_singular: "brown",
              english_plural: null,
              chinese_meaning: "棕色",
              part_of_speech: "adjective",
              image_url: null,
              audio_url: null,
            },
          ],
          3: [
            // Sports
            {
              id: 18,
              english_singular: "basketball",
              english_plural: "basketballs",
              chinese_meaning: "籃球",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 19,
              english_singular: "soccer",
              english_plural: null,
              chinese_meaning: "足球",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 20,
              english_singular: "baseball",
              english_plural: "baseballs",
              chinese_meaning: "棒球",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 21,
              english_singular: "tennis",
              english_plural: null,
              chinese_meaning: "網球",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 22,
              english_singular: "swimming",
              english_plural: null,
              chinese_meaning: "游泳",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 23,
              english_singular: "running",
              english_plural: null,
              chinese_meaning: "跑步",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          4: [
            // Stationery
            {
              id: 24,
              english_singular: "pen",
              english_plural: "pens",
              chinese_meaning: "筆",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 25,
              english_singular: "pencil",
              english_plural: "pencils",
              chinese_meaning: "鉛筆",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 26,
              english_singular: "eraser",
              english_plural: "erasers",
              chinese_meaning: "橡皮擦",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 27,
              english_singular: "ruler",
              english_plural: "rulers",
              chinese_meaning: "尺",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 28,
              english_singular: "marker",
              english_plural: "markers",
              chinese_meaning: "麥克筆",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 29,
              english_singular: "notebook",
              english_plural: "notebooks",
              chinese_meaning: "筆記本",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 30,
              english_singular: "book",
              english_plural: "books",
              chinese_meaning: "書",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          5: [
            // Fruits
            {
              id: 31,
              english_singular: "apple",
              english_plural: "apples",
              chinese_meaning: "蘋果",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 32,
              english_singular: "banana",
              english_plural: "bananas",
              chinese_meaning: "香蕉",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 33,
              english_singular: "orange",
              english_plural: "oranges",
              chinese_meaning: "橘子",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 34,
              english_singular: "grape",
              english_plural: "grapes",
              chinese_meaning: "葡萄",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 35,
              english_singular: "pear",
              english_plural: "pears",
              chinese_meaning: "梨子",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 36,
              english_singular: "peach",
              english_plural: "peaches",
              chinese_meaning: "桃子",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 37,
              english_singular: "mango",
              english_plural: "mangoes",
              chinese_meaning: "芒果",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 38,
              english_singular: "pineapple",
              english_plural: "pineapples",
              chinese_meaning: "鳳梨",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 39,
              english_singular: "strawberry",
              english_plural: "strawberries",
              chinese_meaning: "草莓",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 40,
              english_singular: "watermelon",
              english_plural: "watermelons",
              chinese_meaning: "西瓜",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          6: [
            // Fast Food
            {
              id: 41,
              english_singular: "hamburger",
              english_plural: "hamburgers",
              chinese_meaning: "漢堡",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 42,
              english_singular: "pizza",
              english_plural: "pizzas",
              chinese_meaning: "披薩",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 43,
              english_singular: "hotdog",
              english_plural: "hotdogs",
              chinese_meaning: "熱狗",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 44,
              english_singular: "fries",
              english_plural: null,
              chinese_meaning: "薯條",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 45,
              english_singular: "chicken",
              english_plural: null,
              chinese_meaning: "雞肉",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 46,
              english_singular: "sandwich",
              english_plural: "sandwiches",
              chinese_meaning: "三明治",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          10: [
            // School Subjects
            {
              id: 47,
              english_singular: "math",
              english_plural: null,
              chinese_meaning: "數學",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 48,
              english_singular: "science",
              english_plural: null,
              chinese_meaning: "科學",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 49,
              english_singular: "english",
              english_plural: null,
              chinese_meaning: "英文",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 50,
              english_singular: "history",
              english_plural: null,
              chinese_meaning: "歷史",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 51,
              english_singular: "art",
              english_plural: null,
              chinese_meaning: "美術",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 52,
              english_singular: "music",
              english_plural: null,
              chinese_meaning: "音樂",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          12: [
            // Countries
            {
              id: 53,
              english_singular: "taiwan",
              english_plural: null,
              chinese_meaning: "台灣",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 54,
              english_singular: "japan",
              english_plural: null,
              chinese_meaning: "日本",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 55,
              english_singular: "korea",
              english_plural: null,
              chinese_meaning: "韓國",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 56,
              english_singular: "usa",
              english_plural: null,
              chinese_meaning: "美國",
              part_of_speech: null,
              image_url: null,
              audio_url: null,
            },
            {
              id: 57,
              english_singular: "canada",
              english_plural: null,
              chinese_meaning: "加拿大",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          14: [
            // Toys
            {
              id: 58,
              english_singular: "doll",
              english_plural: "dolls",
              chinese_meaning: "娃娃",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 59,
              english_singular: "car",
              english_plural: "cars",
              chinese_meaning: "車子",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 60,
              english_singular: "ball",
              english_plural: "balls",
              chinese_meaning: "球",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 61,
              english_singular: "teddy",
              english_plural: "teddies",
              chinese_meaning: "泰迪熊",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 62,
              english_singular: "robot",
              english_plural: "robots",
              chinese_meaning: "機器人",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 63,
              english_singular: "puzzle",
              english_plural: "puzzles",
              chinese_meaning: "拼圖",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 64,
              english_singular: "blocks",
              english_plural: null,
              chinese_meaning: "積木",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          15: [
            // Drinks
            {
              id: 65,
              english_singular: "water",
              english_plural: null,
              chinese_meaning: "水",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 66,
              english_singular: "milk",
              english_plural: null,
              chinese_meaning: "牛奶",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 67,
              english_singular: "juice",
              english_plural: null,
              chinese_meaning: "果汁",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 68,
              english_singular: "tea",
              english_plural: null,
              chinese_meaning: "茶",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 69,
              english_singular: "coffee",
              english_plural: null,
              chinese_meaning: "咖啡",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 70,
              english_singular: "soda",
              english_plural: null,
              chinese_meaning: "汽水",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          19: [
            // Professions
            {
              id: 71,
              english_singular: "student",
              english_plural: "students",
              chinese_meaning: "學生",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 72,
              english_singular: "teacher",
              english_plural: "teachers",
              chinese_meaning: "老師",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 73,
              english_singular: "doctor",
              english_plural: "doctors",
              chinese_meaning: "醫生",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 74,
              english_singular: "nurse",
              english_plural: "nurses",
              chinese_meaning: "護士",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 75,
              english_singular: "engineer",
              english_plural: "engineers",
              chinese_meaning: "工程師",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 76,
              english_singular: "artist",
              english_plural: "artists",
              chinese_meaning: "藝術家",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 77,
              english_singular: "farmer",
              english_plural: "farmers",
              chinese_meaning: "農夫",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 78,
              english_singular: "worker",
              english_plural: "workers",
              chinese_meaning: "工人",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          20: [
            // Daily Actions
            {
              id: 79,
              english_singular: "get up",
              english_plural: null,
              chinese_meaning: "起床",
              part_of_speech: "verb",
              image_url: null,
              audio_url: null,
            },
            {
              id: 80,
              english_singular: "wake up",
              english_plural: null,
              chinese_meaning: "醒來",
              part_of_speech: "verb",
              image_url: null,
              audio_url: null,
            },
            {
              id: 81,
              english_singular: "eat breakfast",
              english_plural: null,
              chinese_meaning: "吃早餐",
              part_of_speech: "verb",
              image_url: null,
              audio_url: null,
            },
            {
              id: 82,
              english_singular: "go to school",
              english_plural: null,
              chinese_meaning: "去學校",
              part_of_speech: "verb",
              image_url: null,
              audio_url: null,
            },
            {
              id: 83,
              english_singular: "study",
              english_plural: null,
              chinese_meaning: "讀書",
              part_of_speech: "verb",
              image_url: null,
              audio_url: null,
            },
            {
              id: 84,
              english_singular: "read",
              english_plural: null,
              chinese_meaning: "閱讀",
              part_of_speech: "verb",
              image_url: null,
              audio_url: null,
            },
            {
              id: 85,
              english_singular: "sleep",
              english_plural: null,
              chinese_meaning: "睡覺",
              part_of_speech: "verb",
              image_url: null,
              audio_url: null,
            },
          ],
          22: [
            // Buildings Places
            {
              id: 86,
              english_singular: "school",
              english_plural: "schools",
              chinese_meaning: "學校",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 87,
              english_singular: "home",
              english_plural: null,
              chinese_meaning: "家",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 88,
              english_singular: "hospital",
              english_plural: "hospitals",
              chinese_meaning: "醫院",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 89,
              english_singular: "library",
              english_plural: "libraries",
              chinese_meaning: "圖書館",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 90,
              english_singular: "park",
              english_plural: "parks",
              chinese_meaning: "公園",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 91,
              english_singular: "restaurant",
              english_plural: "restaurants",
              chinese_meaning: "餐廳",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          23: [
            // Numbers
            {
              id: 92,
              english_singular: "one",
              english_plural: null,
              chinese_meaning: "1",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 93,
              english_singular: "two",
              english_plural: null,
              chinese_meaning: "2",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 94,
              english_singular: "three",
              english_plural: null,
              chinese_meaning: "3",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 95,
              english_singular: "four",
              english_plural: null,
              chinese_meaning: "4",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 96,
              english_singular: "five",
              english_plural: null,
              chinese_meaning: "5",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 97,
              english_singular: "six",
              english_plural: null,
              chinese_meaning: "6",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 98,
              english_singular: "seven",
              english_plural: null,
              chinese_meaning: "7",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 99,
              english_singular: "eight",
              english_plural: null,
              chinese_meaning: "8",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 100,
              english_singular: "nine",
              english_plural: null,
              chinese_meaning: "9",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 101,
              english_singular: "ten",
              english_plural: null,
              chinese_meaning: "10",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 102,
              english_singular: "eleven",
              english_plural: null,
              chinese_meaning: "11",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 103,
              english_singular: "twelve",
              english_plural: null,
              chinese_meaning: "12",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            // 繼續添加13-100的數字
            {
              id: 104,
              english_singular: "thirteen",
              english_plural: null,
              chinese_meaning: "13",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 105,
              english_singular: "fourteen",
              english_plural: null,
              chinese_meaning: "14",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 106,
              english_singular: "fifteen",
              english_plural: null,
              chinese_meaning: "15",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 107,
              english_singular: "sixteen",
              english_plural: null,
              chinese_meaning: "16",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 108,
              english_singular: "seventeen",
              english_plural: null,
              chinese_meaning: "17",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 109,
              english_singular: "eighteen",
              english_plural: null,
              chinese_meaning: "18",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 110,
              english_singular: "nineteen",
              english_plural: null,
              chinese_meaning: "19",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 111,
              english_singular: "twenty",
              english_plural: null,
              chinese_meaning: "20",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 112,
              english_singular: "twenty one",
              english_plural: null,
              chinese_meaning: "21",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 113,
              english_singular: "twenty two",
              english_plural: null,
              chinese_meaning: "22",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 114,
              english_singular: "twenty three",
              english_plural: null,
              chinese_meaning: "23",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 115,
              english_singular: "twenty four",
              english_plural: null,
              chinese_meaning: "24",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 116,
              english_singular: "twenty five",
              english_plural: null,
              chinese_meaning: "25",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 117,
              english_singular: "twenty six",
              english_plural: null,
              chinese_meaning: "26",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 118,
              english_singular: "twenty seven",
              english_plural: null,
              chinese_meaning: "27",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 119,
              english_singular: "twenty eight",
              english_plural: null,
              chinese_meaning: "28",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 120,
              english_singular: "twenty nine",
              english_plural: null,
              chinese_meaning: "29",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 121,
              english_singular: "thirty",
              english_plural: null,
              chinese_meaning: "30",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 122,
              english_singular: "thirty one",
              english_plural: null,
              chinese_meaning: "31",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 123,
              english_singular: "thirty two",
              english_plural: null,
              chinese_meaning: "32",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 124,
              english_singular: "thirty three",
              english_plural: null,
              chinese_meaning: "33",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 125,
              english_singular: "thirty four",
              english_plural: null,
              chinese_meaning: "34",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 126,
              english_singular: "thirty five",
              english_plural: null,
              chinese_meaning: "35",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 127,
              english_singular: "thirty six",
              english_plural: null,
              chinese_meaning: "36",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 128,
              english_singular: "thirty seven",
              english_plural: null,
              chinese_meaning: "37",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 129,
              english_singular: "thirty eight",
              english_plural: null,
              chinese_meaning: "38",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 130,
              english_singular: "thirty nine",
              english_plural: null,
              chinese_meaning: "39",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 131,
              english_singular: "forty",
              english_plural: null,
              chinese_meaning: "40",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 132,
              english_singular: "forty one",
              english_plural: null,
              chinese_meaning: "41",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 133,
              english_singular: "forty two",
              english_plural: null,
              chinese_meaning: "42",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 134,
              english_singular: "forty three",
              english_plural: null,
              chinese_meaning: "43",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 135,
              english_singular: "forty four",
              english_plural: null,
              chinese_meaning: "44",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 136,
              english_singular: "forty five",
              english_plural: null,
              chinese_meaning: "45",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 137,
              english_singular: "forty six",
              english_plural: null,
              chinese_meaning: "46",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 138,
              english_singular: "forty seven",
              english_plural: null,
              chinese_meaning: "47",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 139,
              english_singular: "forty eight",
              english_plural: null,
              chinese_meaning: "48",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 140,
              english_singular: "forty nine",
              english_plural: null,
              chinese_meaning: "49",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 141,
              english_singular: "fifty",
              english_plural: null,
              chinese_meaning: "50",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 142,
              english_singular: "fifty one",
              english_plural: null,
              chinese_meaning: "51",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 143,
              english_singular: "fifty two",
              english_plural: null,
              chinese_meaning: "52",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 144,
              english_singular: "fifty three",
              english_plural: null,
              chinese_meaning: "53",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 145,
              english_singular: "fifty four",
              english_plural: null,
              chinese_meaning: "54",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 146,
              english_singular: "fifty five",
              english_plural: null,
              chinese_meaning: "55",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 147,
              english_singular: "fifty six",
              english_plural: null,
              chinese_meaning: "56",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 148,
              english_singular: "fifty seven",
              english_plural: null,
              chinese_meaning: "57",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 149,
              english_singular: "fifty eight",
              english_plural: null,
              chinese_meaning: "58",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 150,
              english_singular: "fifty nine",
              english_plural: null,
              chinese_meaning: "59",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 151,
              english_singular: "sixty",
              english_plural: null,
              chinese_meaning: "60",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 152,
              english_singular: "sixty one",
              english_plural: null,
              chinese_meaning: "61",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 153,
              english_singular: "sixty two",
              english_plural: null,
              chinese_meaning: "62",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 154,
              english_singular: "sixty three",
              english_plural: null,
              chinese_meaning: "63",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 155,
              english_singular: "sixty four",
              english_plural: null,
              chinese_meaning: "64",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 156,
              english_singular: "sixty five",
              english_plural: null,
              chinese_meaning: "65",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 157,
              english_singular: "sixty six",
              english_plural: null,
              chinese_meaning: "66",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 158,
              english_singular: "sixty seven",
              english_plural: null,
              chinese_meaning: "67",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 159,
              english_singular: "sixty eight",
              english_plural: null,
              chinese_meaning: "68",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 160,
              english_singular: "sixty nine",
              english_plural: null,
              chinese_meaning: "69",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 161,
              english_singular: "seventy",
              english_plural: null,
              chinese_meaning: "70",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 162,
              english_singular: "seventy one",
              english_plural: null,
              chinese_meaning: "71",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 163,
              english_singular: "seventy two",
              english_plural: null,
              chinese_meaning: "72",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 164,
              english_singular: "seventy three",
              english_plural: null,
              chinese_meaning: "73",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 165,
              english_singular: "seventy four",
              english_plural: null,
              chinese_meaning: "74",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 166,
              english_singular: "seventy five",
              english_plural: null,
              chinese_meaning: "75",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 167,
              english_singular: "seventy six",
              english_plural: null,
              chinese_meaning: "76",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 168,
              english_singular: "seventy seven",
              english_plural: null,
              chinese_meaning: "77",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 169,
              english_singular: "seventy eight",
              english_plural: null,
              chinese_meaning: "78",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 170,
              english_singular: "seventy nine",
              english_plural: null,
              chinese_meaning: "79",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 171,
              english_singular: "eighty",
              english_plural: null,
              chinese_meaning: "80",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 172,
              english_singular: "eighty one",
              english_plural: null,
              chinese_meaning: "81",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 173,
              english_singular: "eighty two",
              english_plural: null,
              chinese_meaning: "82",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 174,
              english_singular: "eighty three",
              english_plural: null,
              chinese_meaning: "83",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 175,
              english_singular: "eighty four",
              english_plural: null,
              chinese_meaning: "84",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 176,
              english_singular: "eighty five",
              english_plural: null,
              chinese_meaning: "85",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 177,
              english_singular: "eighty six",
              english_plural: null,
              chinese_meaning: "86",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 178,
              english_singular: "eighty seven",
              english_plural: null,
              chinese_meaning: "87",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 179,
              english_singular: "eighty eight",
              english_plural: null,
              chinese_meaning: "88",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 180,
              english_singular: "eighty nine",
              english_plural: null,
              chinese_meaning: "89",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 181,
              english_singular: "ninety",
              english_plural: null,
              chinese_meaning: "90",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 182,
              english_singular: "ninety one",
              english_plural: null,
              chinese_meaning: "91",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 183,
              english_singular: "ninety two",
              english_plural: null,
              chinese_meaning: "92",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 184,
              english_singular: "ninety three",
              english_plural: null,
              chinese_meaning: "93",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 185,
              english_singular: "ninety four",
              english_plural: null,
              chinese_meaning: "94",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 186,
              english_singular: "ninety five",
              english_plural: null,
              chinese_meaning: "95",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 187,
              english_singular: "ninety six",
              english_plural: null,
              chinese_meaning: "96",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 188,
              english_singular: "ninety seven",
              english_plural: null,
              chinese_meaning: "97",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 189,
              english_singular: "ninety eight",
              english_plural: null,
              chinese_meaning: "98",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 190,
              english_singular: "ninety nine",
              english_plural: null,
              chinese_meaning: "99",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 191,
              english_singular: "one hundred",
              english_plural: null,
              chinese_meaning: "100",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
          24: [
            // Time Expressions (完整同步D1資料庫)
            // O'clock times
            {
              id: 192,
              english_singular: "one o'clock",
              english_plural: null,
              chinese_meaning: "一點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 193,
              english_singular: "two o'clock",
              english_plural: null,
              chinese_meaning: "兩點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 194,
              english_singular: "three o'clock",
              english_plural: null,
              chinese_meaning: "三點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 195,
              english_singular: "four o'clock",
              english_plural: null,
              chinese_meaning: "四點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 196,
              english_singular: "five o'clock",
              english_plural: null,
              chinese_meaning: "五點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 197,
              english_singular: "six o'clock",
              english_plural: null,
              chinese_meaning: "六點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 198,
              english_singular: "seven o'clock",
              english_plural: null,
              chinese_meaning: "七點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 199,
              english_singular: "eight o'clock",
              english_plural: null,
              chinese_meaning: "八點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 200,
              english_singular: "nine o'clock",
              english_plural: null,
              chinese_meaning: "九點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 201,
              english_singular: "ten o'clock",
              english_plural: null,
              chinese_meaning: "十點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 202,
              english_singular: "eleven o'clock",
              english_plural: null,
              chinese_meaning: "十一點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 203,
              english_singular: "twelve o'clock",
              english_plural: null,
              chinese_meaning: "十二點鐘",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            // Half past times
            {
              id: 204,
              english_singular: "half past one",
              english_plural: null,
              chinese_meaning: "一點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 205,
              english_singular: "half past two",
              english_plural: null,
              chinese_meaning: "兩點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 206,
              english_singular: "half past three",
              english_plural: null,
              chinese_meaning: "三點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 207,
              english_singular: "half past four",
              english_plural: null,
              chinese_meaning: "四點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 208,
              english_singular: "half past five",
              english_plural: null,
              chinese_meaning: "五點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 209,
              english_singular: "half past six",
              english_plural: null,
              chinese_meaning: "六點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 210,
              english_singular: "half past seven",
              english_plural: null,
              chinese_meaning: "七點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 211,
              english_singular: "half past eight",
              english_plural: null,
              chinese_meaning: "八點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 212,
              english_singular: "half past nine",
              english_plural: null,
              chinese_meaning: "九點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 213,
              english_singular: "half past ten",
              english_plural: null,
              chinese_meaning: "十點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 214,
              english_singular: "half past eleven",
              english_plural: null,
              chinese_meaning: "十一點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 215,
              english_singular: "half past twelve",
              english_plural: null,
              chinese_meaning: "十二點半",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            // Quarter past times
            {
              id: 216,
              english_singular: "quarter past one",
              english_plural: null,
              chinese_meaning: "一點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 217,
              english_singular: "quarter past two",
              english_plural: null,
              chinese_meaning: "兩點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 218,
              english_singular: "quarter past three",
              english_plural: null,
              chinese_meaning: "三點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 219,
              english_singular: "quarter past four",
              english_plural: null,
              chinese_meaning: "四點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 220,
              english_singular: "quarter past five",
              english_plural: null,
              chinese_meaning: "五點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 221,
              english_singular: "quarter past six",
              english_plural: null,
              chinese_meaning: "六點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 222,
              english_singular: "quarter past seven",
              english_plural: null,
              chinese_meaning: "七點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 223,
              english_singular: "quarter past eight",
              english_plural: null,
              chinese_meaning: "八點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 224,
              english_singular: "quarter past nine",
              english_plural: null,
              chinese_meaning: "九點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 225,
              english_singular: "quarter past ten",
              english_plural: null,
              chinese_meaning: "十點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 226,
              english_singular: "quarter past eleven",
              english_plural: null,
              chinese_meaning: "十一點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 227,
              english_singular: "quarter past twelve",
              english_plural: null,
              chinese_meaning: "十二點十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            // Quarter to times
            {
              id: 228,
              english_singular: "quarter to one",
              english_plural: null,
              chinese_meaning: "十二點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 229,
              english_singular: "quarter to two",
              english_plural: null,
              chinese_meaning: "一點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 230,
              english_singular: "quarter to three",
              english_plural: null,
              chinese_meaning: "兩點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 231,
              english_singular: "quarter to four",
              english_plural: null,
              chinese_meaning: "三點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 232,
              english_singular: "quarter to five",
              english_plural: null,
              chinese_meaning: "四點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 233,
              english_singular: "quarter to six",
              english_plural: null,
              chinese_meaning: "五點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 234,
              english_singular: "quarter to seven",
              english_plural: null,
              chinese_meaning: "六點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 235,
              english_singular: "quarter to eight",
              english_plural: null,
              chinese_meaning: "七點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 236,
              english_singular: "quarter to nine",
              english_plural: null,
              chinese_meaning: "八點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 237,
              english_singular: "quarter to ten",
              english_plural: null,
              chinese_meaning: "九點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 238,
              english_singular: "quarter to eleven",
              english_plural: null,
              chinese_meaning: "十點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 239,
              english_singular: "quarter to twelve",
              english_plural: null,
              chinese_meaning: "十一點四十五分",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            // Common time expressions
            {
              id: 240,
              english_singular: "morning",
              english_plural: null,
              chinese_meaning: "早上",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 241,
              english_singular: "afternoon",
              english_plural: null,
              chinese_meaning: "下午",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 242,
              english_singular: "evening",
              english_plural: null,
              chinese_meaning: "傍晚",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 243,
              english_singular: "night",
              english_plural: null,
              chinese_meaning: "晚上",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 244,
              english_singular: "midnight",
              english_plural: null,
              chinese_meaning: "午夜",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 245,
              english_singular: "noon",
              english_plural: null,
              chinese_meaning: "中午",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 246,
              english_singular: "dawn",
              english_plural: null,
              chinese_meaning: "黎明",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
            {
              id: 247,
              english_singular: "dusk",
              english_plural: null,
              chinese_meaning: "黃昏",
              part_of_speech: "noun",
              image_url: null,
              audio_url: null,
            },
          ],
        };

        let words = mockWords[themeId] || [];

        // 如果指定了詞性，過濾單字
        if (partOfSpeech) {
          words = words.filter((word) => word.part_of_speech === partOfSpeech);
        }

        return {
          success: true,
          results: words,
          meta: {},
        };
      }

      if (query.includes("sentence_patterns")) {
        return {
          success: true,
          results: [
            {
              id: 1,
              grade_id: 1,
              pattern_text: "How old _____?",
              pattern_type: "question",
              notes: "Age question pattern",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 2,
              grade_id: 1,
              pattern_text: "What's your/his/her favorite subject?",
              pattern_type: "question",
              notes: "Favorite subject question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 3,
              grade_id: 1,
              pattern_text: "Where are you from?",
              pattern_type: "question",
              notes: "Origin question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 4,
              grade_id: 1,
              pattern_text: "Do you like sports?",
              pattern_type: "question",
              notes: "Sports preference question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 5,
              grade_id: 1,
              pattern_text: "Are you a student?",
              pattern_type: "question",
              notes: "Identity question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 6,
              grade_id: 1,
              pattern_text: "What color is it?",
              pattern_type: "question",
              notes: "Color question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 7,
              grade_id: 1,
              pattern_text: "Where's _____?",
              pattern_type: "question",
              notes: "Location question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 8,
              grade_id: 1,
              pattern_text: "What day is today?",
              pattern_type: "question",
              notes: "Day question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 9,
              grade_id: 1,
              pattern_text: "Do you have a pen/an eraser?",
              pattern_type: "question",
              notes: "Possession question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 10,
              grade_id: 1,
              pattern_text: "What would you like to eat?",
              pattern_type: "question",
              notes: "Food preference question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 11,
              grade_id: 1,
              pattern_text: "What time do you _____?",
              pattern_type: "question",
              notes: "Time question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 12,
              grade_id: 1,
              pattern_text: "I have a _____.",
              pattern_type: "statement",
              notes: "Possession statement",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 13,
              grade_id: 1,
              pattern_text: "How many _____ do you need?",
              pattern_type: "question",
              notes: "Quantity question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 14,
              grade_id: 1,
              pattern_text: "Do you have lunch at _____?",
              pattern_type: "question",
              notes: "Lunch time/location question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 15,
              grade_id: 1,
              pattern_text: "Are you happy?",
              pattern_type: "question",
              notes: "Emotion question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 16,
              grade_id: 1,
              pattern_text: "Is he/she a teacher?",
              pattern_type: "question",
              notes: "Identity question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 17,
              grade_id: 1,
              pattern_text: "What's this/that?",
              pattern_type: "question",
              notes: "Object identification question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 18,
              grade_id: 1,
              pattern_text: "What are these/those?",
              pattern_type: "question",
              notes: "Object identification question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 19,
              grade_id: 1,
              pattern_text: "Who is he/she?",
              pattern_type: "question",
              notes: "Identity question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 20,
              grade_id: 1,
              pattern_text: "What does he/she like?",
              pattern_type: "question",
              notes: "Preference question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 21,
              grade_id: 1,
              pattern_text: "How much is it?",
              pattern_type: "question",
              notes: "Price question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 22,
              grade_id: 1,
              pattern_text: "Is he/she from _____?",
              pattern_type: "question",
              notes: "Origin question",
              grade: { id: 1, name: "Grade 1" },
            },
            {
              id: 23,
              grade_id: 1,
              pattern_text: "Would you like some _____?",
              pattern_type: "question",
              notes: "Offer question",
              grade: { id: 1, name: "Grade 1" },
            },
          ],
          meta: {},
        };
      }

      if (query.includes("grades")) {
        return {
          success: true,
          results: [
            { id: 1, name: "Grade 1" },
            { id: 2, name: "Grade 2" },
            { id: 3, name: "Grade 3" },
            { id: 4, name: "Grade 4" },
            { id: 5, name: "Grade 5" },
            { id: 6, name: "Grade 6" },
          ],
          meta: {},
        };
      }

      // 預設返回空結果
      return { results: [], success: true, meta: {} };
    },
  }),
  exec: async () => ({ results: [], success: true, meta: {} }),
};

// Get D1 database instance
function getD1Database(): D1Database {
  // In production, this would be injected by Cloudflare Workers
  // For now, return mock for local development
  if (
    typeof process !== "undefined" &&
    process.env.NODE_ENV === "development"
  ) {
    return mockD1;
  }

  // In production, this would be:
  // return env.DB as D1Database;
  return mockD1;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const themeId = searchParams.get("theme_id");
    const gradeId = searchParams.get("grade_id");
    const partOfSpeech = searchParams.get("part_of_speech");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const db = getD1Database();

    switch (action) {
      case "themes":
        return await getThemes(db);

      case "words_by_theme":
        if (!themeId) {
          return NextResponse.json(
            { success: false, data: [], error: "theme_id is required" },
            { status: 400 }
          );
        }
        return await getWordsByTheme(
          db,
          parseInt(themeId),
          partOfSpeech,
          limit,
          offset
        );

      case "sentence_patterns":
        return await getSentencePatterns(
          db,
          gradeId ? parseInt(gradeId) : undefined,
          limit,
          offset
        );

      case "grades":
        return await getGrades(db);

      case "words_by_part_of_speech":
        if (!partOfSpeech) {
          return NextResponse.json(
            { success: false, data: [], error: "part_of_speech is required" },
            { status: 400 }
          );
        }
        return await getWordsByPartOfSpeech(db, partOfSpeech, limit, offset);

      case "random_words":
        const count = parseInt(searchParams.get("count") || "10");
        return await getRandomWords(
          db,
          count,
          themeId ? parseInt(themeId) : undefined
        );

      default:
        return NextResponse.json(
          { success: false, data: [], error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Learning content D1 API error:", error);
    return NextResponse.json(
      { success: false, data: [], error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getThemes(
  db: D1Database
): Promise<NextResponse<ThemesResponse>> {
  try {
    const query = `
      SELECT id, name 
      FROM word_themes 
      ORDER BY name
    `;

    const result = await db.prepare(query).all();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.results,
      });
    } else {
      throw new Error("Database query failed");
    }
  } catch (error) {
    console.error("Error fetching themes:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: "Failed to fetch themes",
      },
      { status: 500 }
    );
  }
}

async function getWordsByTheme(
  db: D1Database,
  themeId: number,
  partOfSpeech?: string | null,
  limit?: string | null,
  offset?: string | null
): Promise<NextResponse<WordsByThemeResponse>> {
  try {
    let query = `
      SELECT w.id, w.english_singular, w.english_plural, w.chinese_meaning, 
             w.part_of_speech, w.image_url, w.audio_url
      FROM words w
      INNER JOIN word_theme_associations wta ON w.id = wta.word_id
      WHERE wta.theme_id = ?
    `;

    const params: any[] = [themeId];

    if (partOfSpeech) {
      query += " AND w.part_of_speech = ?";
      params.push(partOfSpeech);
    }

    query += " ORDER BY w.english_singular";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    if (offset) {
      query += " OFFSET ?";
      params.push(parseInt(offset));
    }

    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).all();

    if (result.success) {
      const res = NextResponse.json({
        success: true,
        data: result.results,
      });
      res.headers.set(
        "Cache-Control",
        "public, s-maxage=900, stale-while-revalidate=60"
      );
      return res;
    } else {
      throw new Error("Database query failed");
    }
  } catch (error) {
    console.error("Error fetching words by theme:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: "Failed to fetch words",
      },
      { status: 500 }
    );
  }
}

async function getSentencePatterns(
  db: D1Database,
  gradeId?: number,
  limit?: string | null,
  offset?: string | null
): Promise<NextResponse<SentencePatternsResponse>> {
  try {
    let query = `
      SELECT sp.id, sp.grade_id, sp.pattern_text, sp.pattern_type, sp.notes,
             g.id as grade_id, g.name as grade_name
      FROM sentence_patterns sp
      INNER JOIN grades g ON sp.grade_id = g.id
    `;

    const params: any[] = [];

    if (gradeId) {
      query += " WHERE sp.grade_id = ?";
      params.push(gradeId);
    }

    query += " ORDER BY sp.grade_id, sp.id";

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    if (offset) {
      query += " OFFSET ?";
      params.push(parseInt(offset));
    }

    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).all();

    if (result.success) {
      // Fetch slots for each pattern
      const patternsWithSlots = await Promise.all(
        result.results.map(async (pattern: any) => {
          const slotsQuery = `
            SELECT id, pattern_id, slot_index, required_part_of_speech
            FROM pattern_slots
            WHERE pattern_id = ?
            ORDER BY slot_index
          `;

          const slotsResult = await db
            .prepare(slotsQuery)
            .bind(pattern.id)
            .all();

          return {
            ...pattern,
            slots: slotsResult.success ? slotsResult.results : [],
            grade: {
              id: pattern.grade_id,
              name: pattern.grade_name,
            },
          };
        })
      );

      return NextResponse.json({
        success: true,
        data: patternsWithSlots,
      });
    } else {
      throw new Error("Database query failed");
    }
  } catch (error) {
    console.error("Error fetching sentence patterns:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: "Failed to fetch sentence patterns",
      },
      { status: 500 }
    );
  }
}

async function getGrades(
  db: D1Database
): Promise<NextResponse<LearningContentResponse<Grade[]>>> {
  try {
    const query = `
      SELECT id, name 
      FROM grades 
      ORDER BY id
    `;

    const result = await db.prepare(query).all();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.results,
      });
    } else {
      throw new Error("Database query failed");
    }
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: "Failed to fetch grades",
      },
      { status: 500 }
    );
  }
}

async function getWordsByPartOfSpeech(
  db: D1Database,
  partOfSpeech: string,
  limit?: string | null,
  offset?: string | null
): Promise<NextResponse<WordsByThemeResponse>> {
  try {
    let query = `
      SELECT id, english_singular, english_plural, chinese_meaning, 
             part_of_speech, image_url, audio_url
      FROM words
      WHERE part_of_speech = ?
      ORDER BY english_singular
    `;

    const params: any[] = [partOfSpeech];

    if (limit) {
      query += " LIMIT ?";
      params.push(parseInt(limit));
    }

    if (offset) {
      query += " OFFSET ?";
      params.push(parseInt(offset));
    }

    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).all();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.results,
      });
    } else {
      throw new Error("Database query failed");
    }
  } catch (error) {
    console.error("Error fetching words by part of speech:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: "Failed to fetch words",
      },
      { status: 500 }
    );
  }
}

async function getRandomWords(
  db: D1Database,
  count: number,
  themeId?: number
): Promise<NextResponse<WordsByThemeResponse>> {
  try {
    let query = `
      SELECT w.id, w.english_singular, w.english_plural, w.chinese_meaning, 
             w.part_of_speech, w.image_url, w.audio_url
      FROM words w
    `;

    const params: any[] = [];

    if (themeId) {
      query += `
        INNER JOIN word_theme_associations wta ON w.id = wta.word_id
        WHERE wta.theme_id = ?
      `;
      params.push(themeId);
    }

    query += " ORDER BY RANDOM() LIMIT ?";
    params.push(count);

    const stmt = db.prepare(query);
    const result = await stmt.bind(...params).all();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.results,
      });
    } else {
      throw new Error("Database query failed");
    }
  } catch (error) {
    console.error("Error fetching random words:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: "Failed to fetch random words",
      },
      { status: 500 }
    );
  }
}
