#!/usr/bin/env node

/**
 * 簡單修復腳本 - 專注於解決 Countries 主題的問題
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/app/api/learning-content/route.ts");
let content = fs.readFileSync(filePath, "utf8");

console.log("開始簡單修復 Countries 主題問題...");

// 1. 移除所有重複的 "wrong" 和 "favorite" 定義，只保留一個
console.log("移除重複的 wrong 和 favorite 定義...");

// 找到第一個 wrong 定義並保留
const wrongMatches = content.match(
  /{\s*id: \d+,\s*english_singular: "wrong",[\s\S]*?has_plural: false,\s*},/g
);
if (wrongMatches && wrongMatches.length > 1) {
  // 保留第一個，移除其他的
  for (let i = 1; i < wrongMatches.length; i++) {
    content = content.replace(wrongMatches[i], "");
  }
}

// 找到第一個 favorite 定義並保留
const favoriteMatches = content.match(
  /{\s*id: \d+,\s*english_singular: "favorite",[\s\S]*?has_plural: false,\s*},/g
);
if (favoriteMatches && favoriteMatches.length > 1) {
  // 保留第一個，移除其他的
  for (let i = 1; i < favoriteMatches.length; i++) {
    content = content.replace(favoriteMatches[i], "");
  }
}

// 2. 確保 China 和 USA 有正確的 ID 和主題關聯
console.log("修復 China 和 USA 的定義...");

// 移除所有重複的 China 定義，只保留一個
const chinaMatches = content.match(
  /{\s*id: \d+,\s*english_singular: "China",[\s\S]*?has_plural: true,\s*},/g
);
if (chinaMatches && chinaMatches.length > 1) {
  for (let i = 1; i < chinaMatches.length; i++) {
    content = content.replace(chinaMatches[i], "");
  }
}

// 移除所有重複的 USA 定義，只保留一個
const usaMatches = content.match(
  /{\s*id: \d+,\s*english_singular: "USA",[\s\S]*?has_plural: true,\s*},/g
);
if (usaMatches && usaMatches.length > 1) {
  for (let i = 1; i < usaMatches.length; i++) {
    content = content.replace(usaMatches[i], "");
  }
}

// 3. 確保 wordThemeMap 中只有正確的關聯
console.log("修復 wordThemeMap 關聯...");

// 移除所有錯誤的 Countries 主題關聯
content = content.replace(/\[100, \[12\]\],/g, "");
content = content.replace(/\[101, \[12\]\],/g, "");
content = content.replace(/\[116, \[12\]\],/g, "");
content = content.replace(/\[117, \[12\]\],/g, "");

// 找到 China 和 USA 的實際 ID
const chinaIdMatch = content.match(
  /{\s*id: (\d+),\s*english_singular: "China"/
);
const usaIdMatch = content.match(/{\s*id: (\d+),\s*english_singular: "USA"/);

if (chinaIdMatch && usaIdMatch) {
  const chinaId = chinaIdMatch[1];
  const usaId = usaIdMatch[1];

  console.log(`China ID: ${chinaId}, USA ID: ${usaId}`);

  // 在 wordThemeMap 中添加正確的關聯
  const countriesSection = content.match(
    /\/\/ Countries \(theme_id: 12\)[\s\S]*?(?=\/\/ [A-Z]|$)/
  );
  if (countriesSection) {
    const newCountriesSection = `// Countries (theme_id: 12) - words ${chinaId}-${usaId}
  [${chinaId}, [12]],
  [${usaId}, [12]],`;

    content = content.replace(countriesSection[0], newCountriesSection);
  }
}

// 4. 清理多餘的空行
content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

console.log("修復完成！");

// 寫入修復後的檔案
fs.writeFileSync(filePath, content, "utf8");

console.log("檔案已更新，Countries 主題問題已修復");
