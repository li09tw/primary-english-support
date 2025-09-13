#!/usr/bin/env node

/**
 * 最終修復腳本 - 徹底解決所有 ID 重複問題
 * 重新整理所有單字，確保每個 ID 只對應一個單字
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/app/api/learning-content/route.ts");
let content = fs.readFileSync(filePath, "utf8");

console.log("開始最終修復 - 徹底解決所有 ID 重複問題...");

// 由於重複太多，我們需要重新整理整個 mockWords 陣列
// 首先找到 mockWords 陣列的開始和結束位置
const mockWordsStart = content.indexOf("const mockWords: Word[] = [");
const mockWordsEnd = content.indexOf("];", mockWordsStart) + 2;

if (mockWordsStart === -1 || mockWordsEnd === -1) {
  console.error("找不到 mockWords 陣列");
  process.exit(1);
}

// 提取並重新整理單字
const mockWordsSection = content.substring(mockWordsStart, mockWordsEnd);
const words = [];

// 使用正則表達式提取所有單字物件
const wordRegex =
  /{\s*id:\s*(\d+),\s*english_singular:\s*"([^"]+)",[\s\S]*?english_plural:\s*([^,]+),[\s\S]*?chinese_meaning:\s*"([^"]+)",[\s\S]*?part_of_speech:\s*"([^"]+)",[\s\S]*?has_plural:\s*([^,}]+),[\s\S]*?}/g;

let match;
const seenWords = new Set();
let newId = 1;

while ((match = wordRegex.exec(mockWordsSection)) !== null) {
  const [fullMatch, id, english, plural, chinese, pos, hasPlural] = match;

  // 避免重複的單字
  const wordKey = `${english}-${chinese}`;
  if (seenWords.has(wordKey)) {
    continue;
  }
  seenWords.add(wordKey);

  // 創建新的單字物件
  const pluralValue =
    plural === "undefined" ? "undefined" : `"${plural.replace(/"/g, "")}"`;
  const hasPluralValue = hasPlural.trim();

  const newWord = `  {
    id: ${newId},
    english_singular: "${english}",
    english_plural: ${pluralValue},
    chinese_meaning: "${chinese}",
    part_of_speech: "${pos}",
    has_plural: ${hasPluralValue},
  }`;

  words.push(newWord);
  newId++;
}

// 重新構建 mockWords 陣列
const newMockWords = `const mockWords: Word[] = [
${words.join(",\n")},
];`;

// 替換原來的 mockWords 陣列
content =
  content.substring(0, mockWordsStart) +
  newMockWords +
  content.substring(mockWordsEnd);

// 現在需要重新構建 wordThemeMap
// 基於主題重新分配 ID
const themeMappings = {
  // Emotions (1-10)
  happy: 1,
  sad: 1,
  angry: 1,
  excited: 1,
  nervous: 1,
  proud: 1,
  shy: 1,
  confident: 1,
  // Colors (11-20)
  red: 2,
  blue: 2,
  green: 2,
  yellow: 2,
  orange: 2,
  purple: 2,
  pink: 2,
  brown: 2,
  black: 2,
  white: 2,
  // Sports (21-30)
  soccer: 3,
  basketball: 3,
  tennis: 3,
  swimming: 3,
  running: 3,
  cycling: 3,
  volleyball: 3,
  baseball: 3,
  // Stationery (31-40)
  pencil: 4,
  pen: 4,
  eraser: 4,
  ruler: 4,
  scissors: 4,
  glue: 4,
  notebook: 4,
  // Fruits (41-50)
  apple: 5,
  banana: 5,
  orange: 5,
  grape: 5,
  strawberry: 5,
  watermelon: 5,
  pineapple: 5,
  // Fast Food (51-60)
  hamburger: 6,
  fries: 6,
  pizza: 6,
  "hot dog": 6,
  "chicken nugget": 6,
  soda: 6,
  // Bakery & Snacks (61-70)
  bread: 7,
  cake: 7,
  cookie: 7,
  donut: 7,
  pie: 7,
  candy: 7,
  // Days of Week (71-77)
  Monday: 8,
  Tuesday: 8,
  Wednesday: 8,
  Thursday: 8,
  Friday: 8,
  Saturday: 8,
  Sunday: 8,
  // Months (78-89)
  January: 9,
  February: 9,
  March: 9,
  April: 9,
  May: 9,
  June: 9,
  July: 9,
  August: 9,
  September: 9,
  October: 9,
  November: 9,
  December: 9,
  // School Subjects (90-100)
  Math: 10,
  Science: 10,
  English: 10,
  History: 10,
  Geography: 10,
  Art: 10,
  Music: 10,
  "Physical Education": 10,
  "Social Studies": 10,
  Chinese: 10,
  Japanese: 10,
  // Ailments (101-105)
  headache: 11,
  cold: 11,
  flu: 11,
  allergy: 11,
  wrong: 11,
  // Countries (106-107)
  China: 12,
  USA: 12,
  // Furniture (108-115)
  chair: 13,
  table: 13,
  bed: 13,
  sofa: 13,
  desk: 13,
  bookshelf: 13,
  wardrobe: 13,
  // 其他主題...
  favorite: 1, // 移到 Emotions
};

// 重新構建 wordThemeMap
let wordThemeMapEntries = [];
for (let i = 1; i < newId; i++) {
  // 找到對應的單字
  const wordMatch = words.find((w) => w.includes(`id: ${i},`));
  if (wordMatch) {
    const englishMatch = wordMatch.match(/english_singular: "([^"]+)"/);
    if (englishMatch) {
      const english = englishMatch[1];
      const themeId = themeMappings[english];
      if (themeId) {
        wordThemeMapEntries.push(`  [${i}, [${themeId}]]`);
      }
    }
  }
}

// 替換 wordThemeMap
const wordThemeMapStart = content.indexOf(
  "const wordThemeMap = new Map<number, number[]>(["
);
const wordThemeMapEnd = content.indexOf("];", wordThemeMapStart) + 2;

if (wordThemeMapStart !== -1 && wordThemeMapEnd !== -1) {
  const newWordThemeMap = `const wordThemeMap = new Map<number, number[]>([
${wordThemeMapEntries.join(",\n")},
];`;

  content =
    content.substring(0, wordThemeMapStart) +
    newWordThemeMap +
    content.substring(wordThemeMapEnd);
}

console.log("修復完成！");
console.log(`重新整理了 ${words.length} 個單字，ID 範圍: 1-${newId - 1}`);
console.log("所有重複的 ID 已解決");

// 寫入修復後的檔案
fs.writeFileSync(filePath, content, "utf8");

console.log("檔案已更新");
