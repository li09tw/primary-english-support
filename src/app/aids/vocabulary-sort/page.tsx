"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  color: string;
  words: Vocabulary[];
}

export default function VocabularySortPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [unassignedWords, setUnassignedWords] = useState<Vocabulary[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始詞彙分類遊戲
  const startVocabularySortGame = () => {
    if (vocabulary.length < 12) {
      alert("需要至少12個單字才能開始詞彙分類遊戲！");
      return;
    }

    // 預定義分類
    const predefinedCategories: Category[] = [
      { id: "animals", name: "動物", color: "bg-blue-100", words: [] },
      { id: "food", name: "食物", color: "bg-green-100", words: [] },
      { id: "colors", name: "顏色", color: "bg-yellow-100", words: [] },
      { id: "numbers", name: "數字", color: "bg-purple-100", words: [] },
      { id: "family", name: "家庭", color: "bg-pink-100", words: [] },
      { id: "school", name: "學校", color: "bg-indigo-100", words: [] },
    ];

    // 隨機選擇單字
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, Math.min(24, vocabulary.length));

    // 將單字分配到分類中（基於簡單的關鍵字匹配）
    const categorizedWords: Vocabulary[] = [];
    const uncategorizedWords: Vocabulary[] = [];

    selectedWords.forEach((word) => {
      const wordLower = word.english.toLowerCase();
      let assigned = false;

      // 動物分類
      if (
        wordLower.includes("cat") ||
        wordLower.includes("dog") ||
        wordLower.includes("bird") ||
        wordLower.includes("fish") ||
        wordLower.includes("lion") ||
        wordLower.includes("tiger") ||
        wordLower.includes("elephant") ||
        wordLower.includes("monkey") ||
        wordLower.includes("bear")
      ) {
        predefinedCategories[0].words.push(word);
        assigned = true;
      }
      // 食物分類
      else if (
        wordLower.includes("apple") ||
        wordLower.includes("banana") ||
        wordLower.includes("bread") ||
        wordLower.includes("rice") ||
        wordLower.includes("meat") ||
        wordLower.includes("fish") ||
        wordLower.includes("egg") ||
        wordLower.includes("milk") ||
        wordLower.includes("cake")
      ) {
        predefinedCategories[1].words.push(word);
        assigned = true;
      }
      // 顏色分類
      else if (
        wordLower.includes("red") ||
        wordLower.includes("blue") ||
        wordLower.includes("green") ||
        wordLower.includes("yellow") ||
        wordLower.includes("black") ||
        wordLower.includes("white") ||
        wordLower.includes("pink") ||
        wordLower.includes("purple") ||
        wordLower.includes("orange")
      ) {
        predefinedCategories[2].words.push(word);
        assigned = true;
      }
      // 數字分類
      else if (
        wordLower.includes("one") ||
        wordLower.includes("two") ||
        wordLower.includes("three") ||
        wordLower.includes("four") ||
        wordLower.includes("five") ||
        wordLower.includes("six") ||
        wordLower.includes("seven") ||
        wordLower.includes("eight") ||
        wordLower.includes("nine") ||
        wordLower.includes("ten")
      ) {
        predefinedCategories[3].words.push(word);
        assigned = true;
      }
      // 家庭分類
      else if (
        wordLower.includes("father") ||
        wordLower.includes("mother") ||
        wordLower.includes("sister") ||
        wordLower.includes("brother") ||
        wordLower.includes("grandfather") ||
        wordLower.includes("grandmother") ||
        wordLower.includes("uncle") ||
        wordLower.includes("aunt")
      ) {
        predefinedCategories[4].words.push(word);
        assigned = true;
      }
      // 學校分類
      else if (
        wordLower.includes("book") ||
        wordLower.includes("pen") ||
        wordLower.includes("pencil") ||
        wordLower.includes("teacher") ||
        wordLower.includes("student") ||
        wordLower.includes("classroom") ||
        wordLower.includes("school") ||
        wordLower.includes("library")
      ) {
        predefinedCategories[5].words.push(word);
        assigned = true;
      }

      if (assigned) {
        categorizedWords.push(word);
      } else {
        uncategorizedWords.push(word);
      }
    });

    // 過濾掉沒有單字的分類
    const activeCategories = predefinedCategories.filter(
      (cat) => cat.words.length > 0
    );

    setCategories(activeCategories);
    setUnassignedWords(uncategorizedWords);
    setScore(0);
    setTotalWords(categorizedWords.length);
    setIsGameStarted(true);
  };

  // 拖拽單字到分類
  const dragWordToCategory = (word: Vocabulary, categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    // 檢查單字是否已經在該分類中
    const isAlreadyInCategory = category.words.some((w) => w.id === word.id);
    if (isAlreadyInCategory) return;

    // 從未分配單字中移除
    const newUnassignedWords = unassignedWords.filter((w) => w.id !== word.id);
    setUnassignedWords(newUnassignedWords);

    // 添加到分類中
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, words: [...cat.words, word] } : cat
    );
    setCategories(updatedCategories);

    // 更新分數
    setScore((prev) => prev + 1);
  };

  // 從分類中移除單字
  const removeWordFromCategory = (word: Vocabulary, categoryId: string) => {
    // 從分類中移除
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, words: cat.words.filter((w) => w.id !== word.id) }
        : cat
    );
    setCategories(updatedCategories);

    // 添加到未分配單字
    setUnassignedWords((prev) => [...prev, word]);

    // 更新分數
    setScore((prev) => Math.max(0, prev - 1));
  };

  // 檢查遊戲是否完成
  const isGameComplete =
    unassignedWords.length === 0 &&
    categories.every((cat) => cat.words.length > 0);

  // 重置遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setCategories([]);
    setUnassignedWords([]);
    setScore(0);
    setTotalWords(0);
    setShowHint(false);
  };

  // 切換提示
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">詞彙分類</h1>
          <p className="text-xl text-gray-600">將單字按類別分類整理</p>
        </div>

        {/* 句型與單字主題選擇 */}
        {!isGameStarted && (
          <>
            <TextbookSelector onVocabularySelected={handleVocabularySelected} />

            {/* 單字預覽 */}
            {vocabulary.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  單字列表 ({vocabulary.length} 個)
                </h3>
                <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {vocabulary.map((word) => (
                      <div key={word.id} className="text-sm text-gray-700">
                        {word.english} - {word.chinese}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 開始遊戲按鈕 */}
                {vocabulary.length >= 12 && (
                  <button
                    onClick={startVocabularySortGame}
                    className="w-full mt-4 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                  >
                    開始詞彙分類遊戲
                  </button>
                )}

                {vocabulary.length < 12 && vocabulary.length > 0 && (
                  <div className="text-center text-red-600 text-sm mt-4">
                    需要至少12個單字才能開始詞彙分類遊戲，目前只有{" "}
                    {vocabulary.length} 個單字
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 詞彙分類遊戲區域 */}
        {isGameStarted && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                詞彙分類遊戲進行中
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={toggleHint}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {showHint ? "隱藏提示" : "顯示提示"}
                </button>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  重新開始
                </button>
              </div>
            </div>

            {/* 遊戲統計 */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center space-x-6">
                <span className="text-gray-600">
                  已分類: {score} / {totalWords}
                </span>
                <span className="text-gray-600">
                  未分類: {unassignedWords.length}
                </span>
              </div>
            </div>

            {/* 分類區域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`${category.color} border-2 border-gray-300 rounded-lg p-4`}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {category.name}
                  </h3>
                  <div className="min-h-20">
                    {category.words.map((word) => (
                      <div
                        key={word.id}
                        className="inline-block bg-white border border-gray-300 rounded px-3 py-1 m-1 cursor-pointer hover:bg-gray-50"
                        onClick={() =>
                          removeWordFromCategory(word, category.id)
                        }
                        title="點擊移除單字"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {word.english}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({word.chinese})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 未分配單字區域 */}
            {unassignedWords.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  未分類單字：
                </h3>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {unassignedWords.map((word) => (
                      <div
                        key={word.id}
                        className="bg-white border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        onClick={() => {
                          // 顯示分類選擇選單
                          const categoryId = prompt(
                            `請選擇「${word.english}」的分類：\n` +
                              categories
                                .map(
                                  (cat, index) => `${index + 1}. ${cat.name}`
                                )
                                .join("\n") +
                              "\n請輸入數字 (1-" +
                              categories.length +
                              "):"
                          );

                          const categoryIndex = parseInt(categoryId || "0") - 1;
                          if (
                            categoryIndex >= 0 &&
                            categoryIndex < categories.length
                          ) {
                            dragWordToCategory(
                              word,
                              categories[categoryIndex].id
                            );
                          }
                        }}
                        title="點擊選擇分類"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {word.english}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({word.chinese})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 提示區域 */}
            {showHint && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">
                  分類提示：
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-blue-700">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <strong>{category.name}:</strong> {category.words.length}{" "}
                      個單字
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 遊戲完成提示 */}
            {isGameComplete && (
              <div className="mb-6 text-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                  🎉 恭喜！所有單字都已正確分類！ 🎉
                </div>
              </div>
            )}

            {/* 遊戲說明 */}
            <div className="text-center text-gray-600 text-sm">
              <p>點擊未分類單字選擇分類，點擊已分類單字可移除重新分類</p>
            </div>
          </div>
        )}

        {/* 返回按鈕 */}
        <div className="text-center mt-8">
          <Link
            href="/aids"
            className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← 返回電子教具
          </Link>
        </div>
      </div>
    </div>
  );
}
