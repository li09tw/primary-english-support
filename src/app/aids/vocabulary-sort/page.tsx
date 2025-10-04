"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Vocabulary } from "@/types";
import { Word, WordTheme } from "@/types/learning-content";
import TextbookSelector from "@/components/TextbookSelector";

export default function VocabularySortPage() {
  const router = useRouter();
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<WordTheme[]>([]);
  const [useWhiteboardMode, setUseWhiteboardMode] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = useCallback(
    (words: Word[], themes: WordTheme[]) => {
      // 將 Word[] 轉換為 Vocabulary[] 格式
      const convertedVocabulary: Vocabulary[] = words.map((word) => ({
        id: word.id.toString(),
        english: word.english_singular,
        chinese: word.chinese_meaning,
        phonetic: "", // Word 類型沒有 phonetic 欄位，設為空字串
        example: "", // Word 類型沒有 example 欄位，設為空字串
        image: undefined,
      }));

      setVocabulary(convertedVocabulary);
      setSelectedThemes(themes);
    },
    []
  );

  // 開始詞彙分類遊戲
  const startVocabularySortGame = () => {
    if (vocabulary.length < 2) {
      alert("需要至少2個單字才能開始詞彙分類遊戲！");
      return;
    }

    if (selectedThemes.length !== 2) {
      alert("需要選擇2個主題才能開始遊戲！");
      return;
    }

    // 將資料編碼為 URL 參數並導航到遊戲頁面
    const vocabularyParam = encodeURIComponent(JSON.stringify(vocabulary));
    const themesParam = encodeURIComponent(JSON.stringify(selectedThemes));
    const whiteboardParam = useWhiteboardMode ? "true" : "false";

    router.push(
      `/aids/vocabulary-sort/game?vocabulary=${vocabularyParam}&themes=${themesParam}&whiteboard=${whiteboardParam}`
    );
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">詞彙分類</h1>
            <p className="text-xl text-black">將單字按類別分類整理</p>
          </div>

          {/* 句型與單字主題選擇 */}
          <TextbookSelector onVocabularySelected={handleVocabularySelected} />

          {/* 電子白板模式選擇 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-black mb-4">
              遊戲模式選擇
            </h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="whiteboard-mode"
                checked={useWhiteboardMode}
                onChange={(e) => setUseWhiteboardMode(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="whiteboard-mode"
                className="text-black font-medium"
              >
                使用電子白板模式
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {useWhiteboardMode
                ? "電子白板模式：點擊圓圈進行分類，適合觸控操作"
                : "一般模式：拖拽單字進行分類，適合滑鼠操作"}
            </p>
          </div>

          {/* 開始遊戲按鈕 */}
          {vocabulary.length >= 2 && selectedThemes.length === 2 && (
            <div className="text-center mb-8">
              <button
                onClick={startVocabularySortGame}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
              >
                開始詞彙分類遊戲
              </button>
            </div>
          )}

          {/* 單字數量不足的提示 */}
          {vocabulary.length > 0 &&
            vocabulary.length < 2 &&
            selectedThemes.length === 2 && (
              <div className="text-center text-red-600 text-sm mb-8">
                需要至少2個單字才能開始詞彙分類遊戲，目前只有{" "}
                {vocabulary.length} 個單字
              </div>
            )}

          {/* 正在載入單字的提示 */}
          {vocabulary.length === 0 && selectedThemes.length === 2 && (
            <div className="text-center text-orange-600 text-sm mb-8">
              正在載入單字中...
            </div>
          )}

          {/* 未選擇主題的提示 */}
          {selectedThemes.length < 2 && (
            <div className="text-center text-gray-600 text-sm mb-8">
              請選擇2個主題來開始遊戲
            </div>
          )}

          {/* 返回按鈕 */}
          <div className="text-center mt-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← 上一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
