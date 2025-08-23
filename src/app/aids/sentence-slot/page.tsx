"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface SentenceTemplate {
  id: string;
  template: string;
  blanks: number;
  parts: string[];
}

export default function SentenceSlotPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [sentenceTemplates, setSentenceTemplates] = useState<
    SentenceTemplate[]
  >([]);
  const [currentTemplate, setCurrentTemplate] =
    useState<SentenceTemplate | null>(null);
  const [slotResults, setSlotResults] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalTemplates, setTotalTemplates] = useState(0);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始句型拉霸機遊戲
  const startSentenceSlotGame = () => {
    if (vocabulary.length < 10) {
      alert("需要至少10個單字才能開始句型拉霸機遊戲！");
      return;
    }

    // 預定義句型模板
    const templates: SentenceTemplate[] = [
      {
        id: "template-1",
        template: "I like to eat ___ and drink ___.",
        blanks: 2,
        parts: ["I like to eat", "and drink", "."],
      },
      {
        id: "template-2",
        template: "My favorite color is ___ because it looks like ___.",
        blanks: 2,
        parts: ["My favorite color is", "because it looks like", "."],
      },
      {
        id: "template-3",
        template: "I have ___ pets: a ___ and a ___.",
        blanks: 3,
        parts: ["I have", "pets: a", "and a", "."],
      },
      {
        id: "template-4",
        template: "In the morning, I ___ and then I ___.",
        blanks: 2,
        parts: ["In the morning, I", "and then I", "."],
      },
      {
        id: "template-5",
        template: "The ___ is bigger than the ___.",
        blanks: 2,
        parts: ["The", "is bigger than the", "."],
      },
      {
        id: "template-6",
        template: "I want to go to ___ to see the ___.",
        blanks: 2,
        parts: ["I want to go to", "to see the", "."],
      },
    ];

    // 隨機選擇模板
    const shuffledTemplates = templates.sort(() => Math.random() - 0.5);
    const selectedTemplates = shuffledTemplates.slice(
      0,
      Math.min(5, templates.length)
    );

    setSentenceTemplates(selectedTemplates);
    setCurrentTemplate(selectedTemplates[0]);
    setCurrentTemplateIndex(0);
    setSlotResults([]);
    setIsSpinning(false);
    setScore(0);
    setTotalTemplates(selectedTemplates.length);
    setShowHint(false);
    setIsGameStarted(true);
  };

  // 拉霸機轉動
  const spinSlot = () => {
    if (!currentTemplate || isSpinning) return;

    setIsSpinning(true);

    // 模擬拉霸機轉動效果
    setTimeout(() => {
      const results: string[] = [];

      for (let i = 0; i < currentTemplate.blanks; i++) {
        // 隨機選擇單字
        const randomWord =
          vocabulary[Math.floor(Math.random() * vocabulary.length)];
        results.push(randomWord.english);
      }

      setSlotResults(results);
      setIsSpinning(false);

      // 檢查答案是否合理
      checkAnswer(results);
    }, 2000);
  };

  // 檢查答案
  const checkAnswer = (results: string[]) => {
    if (!currentTemplate) return;

    // 簡單的合理性檢查（這裡可以根據需要增加更複雜的邏輯）
    let templateScore = 0;

    // 檢查是否使用了不同的單字
    const uniqueWords = new Set(results);
    if (uniqueWords.size === results.length) {
      templateScore += 1;
    }

    // 檢查單字長度是否合理
    const reasonableLength = results.every(
      (word) => word.length >= 3 && word.length <= 12
    );
    if (reasonableLength) {
      templateScore += 1;
    }

    setScore((prev) => prev + templateScore);
  };

  // 下一題
  const nextTemplate = () => {
    if (currentTemplateIndex < sentenceTemplates.length - 1) {
      const nextIndex = currentTemplateIndex + 1;
      setCurrentTemplateIndex(nextIndex);
      setCurrentTemplate(sentenceTemplates[nextIndex]);
      setSlotResults([]);
      setShowHint(false);
    } else {
      // 遊戲結束
      setIsGameStarted(false);
    }
  };

  // 重置遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setSentenceTemplates([]);
    setCurrentTemplate(null);
    setSlotResults([]);
    setIsSpinning(false);
    setScore(0);
    setTotalTemplates(0);
    setCurrentTemplateIndex(0);
    setShowHint(false);
  };

  // 切換提示
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // 生成完整句子
  const generateCompleteSentence = () => {
    if (!currentTemplate || slotResults.length === 0) return "";

    let sentence = "";
    let resultIndex = 0;

    currentTemplate.parts.forEach((part, index) => {
      sentence += part;
      if (
        index < currentTemplate.parts.length - 1 &&
        resultIndex < slotResults.length
      ) {
        sentence += " " + slotResults[resultIndex];
        resultIndex++;
      }
    });

    return sentence;
  };

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">句型拉霸機</h1>
          <p className="text-xl text-gray-600">透過拉霸機形式練習句型結構</p>
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
                {vocabulary.length >= 10 && (
                  <button
                    onClick={startSentenceSlotGame}
                    className="w-full mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    開始句型拉霸機遊戲
                  </button>
                )}

                {vocabulary.length < 10 && vocabulary.length > 0 && (
                  <div className="text-center text-red-600 text-sm mt-4">
                    需要至少10個單字才能開始句型拉霸機遊戲，目前只有{" "}
                    {vocabulary.length} 個單字
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 句型拉霸機遊戲區域 */}
        {isGameStarted && currentTemplate && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                句型拉霸機遊戲進行中
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

            {/* 遊戲進度 */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center space-x-6">
                <span className="text-gray-600">
                  句型: {currentTemplateIndex + 1} / {totalTemplates}
                </span>
                <span className="text-gray-600">得分: {score}</span>
              </div>
            </div>

            {/* 當前句型模板 */}
            <div className="mb-8 text-center">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-purple-800 mb-6">
                  句型模板 {currentTemplateIndex + 1}
                </h3>

                {/* 句型模板顯示 */}
                <div className="mb-8">
                  <p className="text-xl text-gray-700 mb-4">句型模板：</p>
                  <div className="bg-white border-2 border-purple-300 rounded-lg p-6">
                    <p className="text-2xl font-bold text-purple-700">
                      {currentTemplate.template}
                    </p>
                  </div>
                </div>

                {/* 拉霸機區域 */}
                <div className="mb-8">
                  <p className="text-lg text-gray-700 mb-4">
                    點擊按鈕開始拉霸機：
                  </p>

                  <button
                    onClick={spinSlot}
                    disabled={isSpinning}
                    className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSpinning ? "轉動中..." : "🎰 開始拉霸機 🎰"}
                  </button>
                </div>

                {/* 拉霸機結果 */}
                {slotResults.length > 0 && (
                  <div className="mb-6">
                    <p className="text-lg text-gray-700 mb-4">拉霸機結果：</p>
                    <div className="flex justify-center space-x-4">
                      {slotResults.map((result, index) => (
                        <div
                          key={index}
                          className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-3"
                        >
                          <span className="text-xl font-bold text-yellow-800">
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 完整句子 */}
                {slotResults.length > 0 && (
                  <div className="mb-6">
                    <p className="text-lg text-gray-700 mb-4">完整句子：</p>
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                      <p className="text-xl font-medium text-green-800">
                        {generateCompleteSentence()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 提示區域 */}
            {showHint && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">
                  提示：
                </h4>
                <p className="text-blue-700">
                  觀察句型模板的結構，思考每個空格應該填入什麼類型的單字。
                  拉霸機會隨機選擇單字，看看能組成什麼有趣的句子！
                </p>
              </div>
            )}

            {/* 遊戲控制按鈕 */}
            <div className="text-center space-x-4">
              {slotResults.length > 0 && (
                <button
                  onClick={nextTemplate}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  {currentTemplateIndex < sentenceTemplates.length - 1
                    ? "下一個句型"
                    : "完成遊戲"}
                </button>
              )}
            </div>

            {/* 遊戲提示 */}
            <div className="mt-6 text-center text-gray-600 text-sm">
              <p>點擊拉霸機按鈕，看看會出現什麼單字，然後組成完整的句子！</p>
            </div>
          </div>
        )}

        {/* 遊戲完成提示 */}
        {!isGameStarted && sentenceTemplates.length > 0 && (
          <div className="text-center mt-8">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
              🎉 遊戲完成！你的總得分是 {score} 🎉
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
