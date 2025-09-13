#!/usr/bin/env node

/**
 * 修復缺失的單字和關聯問題
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/app/api/learning-content/route.ts");
let content = fs.readFileSync(filePath, "utf8");

console.log("修復缺失的單字和關聯問題...");

// 1. 添加缺失的 Monday
const mondayWord = `  {
    id: 66,
    english_singular: "Monday",
    english_plural: "Mondays",
    chinese_meaning: "星期一",
    part_of_speech: "noun",
    has_plural: true,
  },
  {
    id: 67,`;

// 找到 Tuesday 的位置並插入 Monday
const tuesdayIndex = content.indexOf("id: 67,");
if (tuesdayIndex !== -1) {
  const beforeTuesday = content.substring(0, tuesdayIndex);
  const afterTuesday = content.substring(tuesdayIndex);
  content = beforeTuesday + mondayWord + afterTuesday;
  console.log("已添加 Monday (ID: 66)");
}

// 2. 修復 Colors 主題的關聯（移除不存在的 ID）
const colorsFix = `  // Colors (theme_id: 2) - words 9-19
  [9, [2]],
  [10, [2]],
  [11, [2]],
  [12, [2]],
  [13, [2]],
  [14, [2]],
  [15, [2]],
  [16, [2]],
  [17, [2]],
  [18, [2]],
  [19, [2]],`;

content = content.replace(
  /\/\/ Colors \(theme_id: 2\) - words 9-19[\s\S]*?(?=\n\s*\/\/ [A-Z]|\n\s*\]\))/,
  colorsFix
);

// 3. 修復 Furniture 主題的關聯
const furnitureFix = `  // Furniture (theme_id: 13) - words 504-506
  [504, [13]], // chair
  [505, [13]], // table
  [506, [13]], // bed
  [45, [13]],
  [46, [13]],
  [47, [13]],`;

content = content.replace(
  /\/\/ Furniture \(theme_id: 13\) - words 42, 504-506[\s\S]*?(?=\n\s*\/\/ [A-Z]|\n\s*\]\))/,
  furnitureFix
);

// 4. 移除錯誤的 hamburger 關聯到 Furniture
content = content.replace(
  /\[42, \[13\]\], \/\/ 保留原始的 hamburger \(Fast Food\)\n/,
  ""
);

console.log("修復完成！");

// 寫入修復後的檔案
fs.writeFileSync(filePath, content, "utf8");

console.log("檔案已更新");
