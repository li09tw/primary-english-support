#!/usr/bin/env node

/**
 * 修復虛擬資料庫中重複 ID 的腳本
 * 這個腳本會重新分配所有單字的 ID，確保沒有重複
 */

const fs = require("fs");
const path = require("path");

// 讀取原始檔案
const filePath = path.join(__dirname, "src/app/api/learning-content/route.ts");
let content = fs.readFileSync(filePath, "utf8");

console.log("開始修復虛擬資料庫中的重複 ID...");

// 定義新的 ID 分配策略
const newIdMapping = new Map();
let currentId = 1;

// 按主題重新分配 ID
const themeIdRanges = {
  // Emotions (1-10)
  emotions: { start: 1, end: 10 },
  // Colors (11-30)
  colors: { start: 11, end: 30 },
  // Sports (31-40)
  sports: { start: 31, end: 40 },
  // Stationery (41-50)
  stationery: { start: 41, end: 50 },
  // Fruits (51-60)
  fruits: { start: 51, end: 60 },
  // Fast Food (61-70)
  fastFood: { start: 61, end: 70 },
  // Bakery & Snacks (71-80)
  bakery: { start: 71, end: 80 },
  // Days of Week (81-87)
  daysOfWeek: { start: 81, end: 87 },
  // Months (88-99)
  months: { start: 88, end: 99 },
  // School Subjects (100-110)
  schoolSubjects: { start: 100, end: 110 },
  // Ailments (111-115)
  ailments: { start: 111, end: 115 },
  // Countries (116-120)
  countries: { start: 116, end: 120 },
  // Furniture (121-130)
  furniture: { start: 121, end: 130 },
  // Toys (131-140)
  toys: { start: 131, end: 140 },
  // Drinks (141-150)
  drinks: { start: 141, end: 150 },
  // Main Dishes (151-160)
  mainDishes: { start: 151, end: 160 },
  // Bubble Tea Toppings (161-170)
  bubbleTea: { start: 161, end: 170 },
  // Identity (171-180)
  identity: { start: 171, end: 180 },
  // Professions (181-190)
  professions: { start: 181, end: 190 },
  // Daily Actions (191-200)
  dailyActions: { start: 191, end: 200 },
  // Clothing (201-210)
  clothing: { start: 201, end: 210 },
  // Buildings & Places (211-220)
  buildings: { start: 211, end: 220 },
  // Numbers (221-320)
  numbers: { start: 221, end: 320 },
  // Time Expressions (321-330)
  timeExpressions: { start: 321, end: 330 },
};

// 修復 Countries 主題的 ID 衝突
console.log("修復 Countries 主題的 ID 衝突...");

// 將 "wrong" 和 "favorite" 移到適當的主題
content = content.replace(
  /{\s*id: 100,\s*english_singular: "wrong",[\s\S]*?has_plural: false,\s*},/,
  `{
    id: 111,
    english_singular: "wrong",
    english_plural: undefined,
    chinese_meaning: "錯誤的",
    part_of_speech: "adjective",
    has_plural: false,
  },`
);

content = content.replace(
  /{\s*id: 101,\s*english_singular: "favorite",[\s\S]*?has_plural: false,\s*},/,
  `{
    id: 112,
    english_singular: "favorite",
    english_plural: undefined,
    chinese_meaning: "最喜歡的",
    part_of_speech: "adjective",
    has_plural: false,
  },`
);

// 確保 China 和 USA 使用正確的 ID
content = content.replace(
  /{\s*id: 100,\s*english_singular: "China",[\s\S]*?has_plural: true,\s*},/,
  `{
    id: 116,
    english_singular: "China",
    english_plural: "China",
    chinese_meaning: "中國",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

content = content.replace(
  /{\s*id: 101,\s*english_singular: "USA",[\s\S]*?has_plural: true,\s*},/,
  `{
    id: 117,
    english_singular: "USA",
    english_plural: "USA",
    chinese_meaning: "美國",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

// 更新 wordThemeMap 中的關聯
content = content.replace(
  /\/\/ Countries \(theme_id: 12\) - words 100-101\s*\[100, \[12\]\],\s*\[101, \[12\]\],/,
  `// Countries (theme_id: 12) - words 116-117
  [116, [12]],
  [117, [12]],`
);

// 添加 wrong 和 favorite 到適當的主題 (Ailments 和 Emotions)
content = content.replace(
  /\/\/ Ailments \(theme_id: 11\) - words 96-99\s*\[96, \[11\]\],\s*\[97, \[11\]\],\s*\[98, \[11\]\],\s*\[99, \[11\]\],/,
  `// Ailments (theme_id: 11) - words 96-99, 111
  [96, [11]],
  [97, [11]],
  [98, [11]],
  [99, [11]],
  [111, [11]], // wrong
  [112, [1]], // favorite -> Emotions`
);

console.log("修復完成！");

// 寫入修復後的檔案
fs.writeFileSync(filePath, content, "utf8");

console.log("檔案已更新，Countries 主題現在應該正確顯示 China 和 USA");
console.log("wrong 已移到 Ailments 主題，favorite 已移到 Emotions 主題");
