const fs = require("fs");
const path = require("path");

// 需要修正的頁面列表
const pagesToFix = [
  "src/app/aids/vocabulary-storm/page.tsx",
  "src/app/aids/memory-match/page.tsx",
  "src/app/aids/yes-no-judgment/page.tsx",
  "src/app/aids/vocabulary-sort/page.tsx",
];

// 修正每個頁面
pagesToFix.forEach((pagePath) => {
  try {
    let content = fs.readFileSync(pagePath, "utf8");

    // 檢查是否已經有正確的 import
    if (
      !content.includes(
        "import { Word, WordTheme } from '@/types/learning-content'"
      )
    ) {
      // 添加 Word 和 WordTheme 的 import
      content = content.replace(
        /import { Vocabulary } from "@\/types";/g,
        'import { Vocabulary } from "@/types";\nimport { Word, WordTheme } from "@/types/learning-content";'
      );
    }

    // 修正 handleVocabularySelected 函數
    content = content.replace(
      /const handleVocabularySelected = \(selectedVocabulary: Vocabulary\[\]\) => \{\s+setVocabulary\(selectedVocabulary\);\s+\};/g,
      `const handleVocabularySelected = (words: Word[], theme: WordTheme) => {
    // 將 Word[] 轉換為 Vocabulary[] 格式
    const convertedVocabulary: Vocabulary[] = words.map(word => ({
      id: word.id.toString(),
      english: word.english_singular,
      chinese: word.chinese_meaning,
      phonetic: '', // Word 類型沒有 phonetic 欄位，設為空字串
      example: '', // Word 類型沒有 example 欄位，設為空字串
      image: word.image_url
    }));
    setVocabulary(convertedVocabulary);
  };`
    );

    // 寫回檔案
    fs.writeFileSync(pagePath, content, "utf8");
    console.log(`✅ 已修正: ${pagePath}`);
  } catch (error) {
    console.error(`❌ 修正失敗: ${pagePath}`, error.message);
  }
});

console.log("\n🎉 所有頁面修正完成！");
