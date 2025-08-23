const fs = require("fs");
const path = require("path");

// 需要修復的頁面列表
const pagesToFix = [
  "bingo",
  "sentence-chain",
  "sentence-slot",
  "projection-qa",
  "vocabulary-sort",
  "find-different",
  "word-puzzle",
];

// 修復每個頁面
pagesToFix.forEach((pageName) => {
  const filePath = path.join(
    __dirname,
    "..",
    "src",
    "app",
    "aids",
    pageName,
    "page.tsx"
  );

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    // 修復樣式：將 py-8 改為 pt-8 pb-8，並調整結構
    content = content.replace(
      /return \([\s\S]*?<div className="min-h-screen py-8 bg-primary-blue">[\s\S]*?<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">/,
      (match) => {
        return match.replace(
          /<div className="min-h-screen py-8 bg-primary-blue">[\s\S]*?<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">/,
          `<div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`
        );
      }
    );

    // 修復結尾結構
    content = content.replace(
      /<\/div>\s*<\/div>\s*<\/div>\s*\);/,
      `        </div>
      </div>
    </div>
  );`
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ 已修復 ${pageName}/page.tsx`);
  } else {
    console.log(`❌ 找不到 ${pageName}/page.tsx`);
  }
});

console.log("\n🎉 所有 aids 子頁面樣式修復完成！");
console.log("現在所有頁面都應該有正確的頂部間距，Header 可以正常點選了。");
