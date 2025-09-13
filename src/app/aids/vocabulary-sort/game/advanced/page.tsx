"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Vocabulary } from "@/types";
import { WordTheme } from "@/types/learning-content";

function VocabularySortAdvancedGameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<WordTheme[]>([]);

  // 從 URL 參數載入遊戲資料
  useEffect(() => {
    const vocabularyData = searchParams.get("vocabulary");
    const themesData = searchParams.get("themes");

    if (vocabularyData && themesData) {
      try {
        const parsedVocabulary = JSON.parse(vocabularyData);
        const parsedThemes = JSON.parse(themesData);

        setVocabulary(parsedVocabulary);
        setSelectedThemes(parsedThemes);
      } catch (error) {
        console.error("Error parsing game data:", error);
        // 如果解析失敗，回到選擇頁面
        router.push("/aids/vocabulary-sort");
      }
    } else {
      // 如果沒有資料，回到選擇頁面
      router.push("/aids/vocabulary-sort");
    }
  }, [searchParams, router]);

  // 回到選擇頁面
  const goBackToSelection = () => {
    router.push("/aids/vocabulary-sort");
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">
              詞彙分類遊戲 - 進階模式
            </h1>
            <p className="text-xl text-black">更具挑戰性的詞彙分類遊戲</p>
          </div>

          {/* 進階模式開發中提示 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-black mb-4">
                進階模式開發中
              </h2>
              <p className="text-lg text-black mb-6">
                進階模式正在開發中，敬請期待！
              </p>
              <p className="text-sm text-gray-600 mb-6">
                目前載入的資料：{vocabulary.length} 個單字，
                {selectedThemes.length} 個主題
              </p>
              <button
                onClick={goBackToSelection}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                回到選擇頁面
              </button>
            </div>
          </div>

          {/* 返回按鈕 */}
          <div className="text-center mt-8">
            <button
              onClick={goBackToSelection}
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

export default function VocabularySortAdvancedGamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-primary-blue flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-xl text-black">載入中...</p>
          </div>
        </div>
      }
    >
      <VocabularySortAdvancedGameContent />
    </Suspense>
  );
}
