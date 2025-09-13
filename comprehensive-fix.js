#!/usr/bin/env node

/**
 * 全面修復虛擬資料庫中所有重複 ID 的腳本
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/app/api/learning-content/route.ts");
let content = fs.readFileSync(filePath, "utf8");

console.log("開始全面修復虛擬資料庫中的重複 ID...");

// 修復 Countries 主題 - 使用新的 ID 範圍
console.log("修復 Countries 主題...");

// 將 China 和 USA 移到新的 ID
content = content.replace(
  /{\s*id: 116,\s*english_singular: "China",[\s\S]*?has_plural: true,\s*},/,
  `{
    id: 500,
    english_singular: "China",
    english_plural: "China",
    chinese_meaning: "中國",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

content = content.replace(
  /{\s*id: 117,\s*english_singular: "USA",[\s\S]*?has_plural: true,\s*},/,
  `{
    id: 501,
    english_singular: "USA",
    english_plural: "USA",
    chinese_meaning: "美國",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

// 更新 wordThemeMap 中的關聯
content = content.replace(
  /\/\/ Countries \(theme_id: 12\) - words 116-117\s*\[116, \[12\]\],\s*\[117, \[12\]\],/,
  `// Countries (theme_id: 12) - words 500-501
  [500, [12]],
  [501, [12]],`
);

// 修復 wrong 和 favorite 的 ID 衝突
console.log("修復 wrong 和 favorite 的 ID...");

content = content.replace(
  /{\s*id: 111,\s*english_singular: "wrong",[\s\S]*?has_plural: false,\s*},/,
  `{
    id: 502,
    english_singular: "wrong",
    english_plural: undefined,
    chinese_meaning: "錯誤的",
    part_of_speech: "adjective",
    has_plural: false,
  },`
);

content = content.replace(
  /{\s*id: 112,\s*english_singular: "favorite",[\s\S]*?has_plural: false,\s*},/,
  `{
    id: 503,
    english_singular: "favorite",
    english_plural: undefined,
    chinese_meaning: "最喜歡的",
    part_of_speech: "adjective",
    has_plural: false,
  },`
);

// 更新主題關聯
content = content.replace(
  /\[111, \[11\]\], \/\/ wrong\s*\[112, \[1\]\], \/\/ favorite -> Emotions/,
  `[502, [11]], // wrong -> Ailments
  [503, [1]], // favorite -> Emotions`
);

// 修復其他重複的 ID - 將重複的單字移到新的 ID 範圍
console.log("修復其他重複的 ID...");

// 修復 ID 42 的衝突 (hamburger vs chair)
content = content.replace(
  /{\s*id: 42,\s*english_singular: "chair",[\s\S]*?has_plural: true,\s*},/g,
  `{
    id: 504,
    english_singular: "chair",
    english_plural: "chairs",
    chinese_meaning: "椅子",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

// 修復 ID 43 的衝突 (fries vs table)
content = content.replace(
  /{\s*id: 43,\s*english_singular: "table",[\s\S]*?has_plural: true,\s*},/g,
  `{
    id: 505,
    english_singular: "table",
    english_plural: "tables",
    chinese_meaning: "桌子",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

// 修復 ID 44 的衝突 (pizza vs bed)
content = content.replace(
  /{\s*id: 44,\s*english_singular: "bed",[\s\S]*?has_plural: true,\s*},/g,
  `{
    id: 506,
    english_singular: "bed",
    english_plural: "beds",
    chinese_meaning: "床",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

// 更新 Furniture 主題的關聯
content = content.replace(
  /\/\/ Furniture \(theme_id: 13\) - words 42-47\s*\[42, \[13\]\],\s*\[43, \[13\]\],\s*\[44, \[13\]\],/,
  `// Furniture (theme_id: 13) - words 42, 504-506
  [42, [13]], // 保留原始的 hamburger (Fast Food)
  [504, [13]], // chair
  [505, [13]], // table  
  [506, [13]], // bed`
);

// 修復 ID 200 的衝突
content = content.replace(
  /{\s*id: 200,\s*english_singular: "post office",[\s\S]*?has_plural: true,\s*},/g,
  `{
    id: 507,
    english_singular: "post office",
    english_plural: "post offices",
    chinese_meaning: "郵局",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

content = content.replace(
  /{\s*id: 200,\s*english_singular: "house",[\s\S]*?has_plural: true,\s*},/g,
  `{
    id: 508,
    english_singular: "house",
    english_plural: "houses",
    chinese_meaning: "房子",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

// 修復 ID 201 的衝突
content = content.replace(
  /{\s*id: 201,\s*english_singular: "police station",[\s\S]*?has_plural: true,\s*},/g,
  `{
    id: 509,
    english_singular: "police station",
    english_plural: "police stations",
    chinese_meaning: "警察局",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

content = content.replace(
  /{\s*id: 201,\s*english_singular: "apartment",[\s\S]*?has_plural: true,\s*},/g,
  `{
    id: 510,
    english_singular: "apartment",
    english_plural: "apartments",
    chinese_meaning: "公寓",
    part_of_speech: "noun",
    has_plural: true,
  },`
);

// 更新 Buildings & Places 主題的關聯
content = content.replace(
  /\/\/ Buildings & Places \(theme_id: 22\) - words 211-220\s*\[211, \[22\]\],/,
  `// Buildings & Places (theme_id: 22) - words 211-220, 507-510
  [211, [22]],
  [507, [22]], // post office
  [508, [22]], // house
  [509, [22]], // police station
  [510, [22]], // apartment`
);

console.log("修復完成！");

// 寫入修復後的檔案
fs.writeFileSync(filePath, content, "utf8");

console.log("檔案已更新，所有重複 ID 已修復");
console.log("Countries 主題現在包含: China (ID: 500), USA (ID: 501)");
console.log("其他衝突的單字已移到新的 ID 範圍 (500-510)");
