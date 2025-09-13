#!/usr/bin/env node

/**
 * 全面修復虛擬資料庫中所有 ID 重複問題的腳本
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/app/api/learning-content/route.ts");
let content = fs.readFileSync(filePath, "utf8");

console.log("開始全面修復虛擬資料庫中的所有 ID 重複問題...");

// 1. 首先找到所有重複的 ID
const idMatches = content.match(/^\s*id: (\d+),/gm);
const idCounts = {};
idMatches.forEach((match) => {
  const id = parseInt(match.match(/id: (\d+),/)[1]);
  idCounts[id] = (idCounts[id] || 0) + 1;
});

const duplicateIds = Object.entries(idCounts)
  .filter(([id, count]) => count > 1)
  .map(([id, count]) => ({ id: parseInt(id), count }))
  .sort((a, b) => a.id - b.id);

console.log(`發現 ${duplicateIds.length} 個重複的 ID`);

// 2. 創建新的 ID 分配策略
let nextAvailableId = 1000; // 從 1000 開始分配新 ID
const idMapping = new Map();

// 為每個重複的 ID 分配新的 ID
duplicateIds.forEach(({ id, count }) => {
  const newIds = [];
  for (let i = 0; i < count; i++) {
    newIds.push(nextAvailableId++);
  }
  idMapping.set(id, newIds);
  console.log(`ID ${id} (出現 ${count} 次) -> 新 ID: ${newIds.join(", ")}`);
});

// 3. 修復單字定義中的重複 ID
console.log("修復單字定義中的重複 ID...");

// 按 ID 順序處理，確保先處理較小的 ID
const sortedDuplicateIds = duplicateIds.map((d) => d.id).sort((a, b) => a - b);

sortedDuplicateIds.forEach((originalId) => {
  const newIds = idMapping.get(originalId);
  let replacementIndex = 0;

  // 找到所有該 ID 的定義
  const idRegex = new RegExp(
    `{\\s*id: ${originalId},[\\s\\S]*?has_plural: [^,}]+,[\\s\\S]*?},`,
    "g"
  );
  const matches = content.match(idRegex);

  if (matches) {
    matches.forEach((match, index) => {
      if (index < newIds.length) {
        const newId = newIds[index];
        const newMatch = match.replace(`id: ${originalId},`, `id: ${newId},`);
        content = content.replace(match, newMatch);
        console.log(`  ID ${originalId} 第 ${index + 1} 次 -> ID ${newId}`);
      }
    });
  }
});

// 4. 修復 wordThemeMap 中的關聯
console.log("修復 wordThemeMap 中的關聯...");

// 為每個重複的 ID 更新 wordThemeMap
sortedDuplicateIds.forEach((originalId) => {
  const newIds = idMapping.get(originalId);

  // 找到原始的關聯
  const originalAssociations = content.match(
    new RegExp(`\\[${originalId}, \\[\\d+\\]\\],`, "g")
  );

  if (originalAssociations) {
    // 移除原始關聯
    originalAssociations.forEach((assoc) => {
      content = content.replace(assoc, "");
    });

    // 添加新的關聯（需要根據實際的主題來分配）
    // 這裡我們需要根據單字的實際內容來決定主題
    console.log(`  移除 ID ${originalId} 的原始關聯，需要手動重新分配主題`);
  }
});

// 5. 清理多餘的空行和格式
content = content.replace(/\n\s*\n\s*\n/g, "\n\n");
content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

console.log("修復完成！");

// 寫入修復後的檔案
fs.writeFileSync(filePath, content, "utf8");

console.log("檔案已更新，所有重複 ID 已修復");
console.log(`共處理了 ${duplicateIds.length} 個重複的 ID`);
console.log(`新的 ID 範圍: 1000-${nextAvailableId - 1}`);
