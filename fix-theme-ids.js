#!/usr/bin/env node

/**
 * 修復主題 ID 被錯誤修改的問題
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/app/api/learning-content/route.ts");
let content = fs.readFileSync(filePath, "utf8");

console.log("修復主題 ID 被錯誤修改的問題...");

// 修復主題 ID
const themeIdFixes = [
  { wrong: 'id: 1006, name: "Months"', correct: 'id: 9, name: "Months"' },
  {
    wrong: 'id: 1008, name: "Countries"',
    correct: 'id: 12, name: "Countries"',
  },
  { wrong: 'id: 1010, name: "Toys"', correct: 'id: 14, name: "Toys"' },
  {
    wrong: 'id: 1012, name: "Main Dishes"',
    correct: 'id: 16, name: "Main Dishes"',
  },
  { wrong: 'id: 1014, name: "Identity"', correct: 'id: 18, name: "Identity"' },
  {
    wrong: 'id: 1016, name: "Daily Actions"',
    correct: 'id: 20, name: "Daily Actions"',
  },
  { wrong: 'id: 1018, name: "Clothing"', correct: 'id: 21, name: "Clothing"' },
  {
    wrong: 'id: 1020, name: "Time Expressions"',
    correct: 'id: 24, name: "Time Expressions"',
  },
];

themeIdFixes.forEach((fix) => {
  if (content.includes(fix.wrong)) {
    content = content.replace(fix.wrong, fix.correct);
    console.log(`修復主題 ID: ${fix.wrong} -> ${fix.correct}`);
  }
});

console.log("主題 ID 修復完成！");

// 寫入修復後的檔案
fs.writeFileSync(filePath, content, "utf8");

console.log("檔案已更新");
