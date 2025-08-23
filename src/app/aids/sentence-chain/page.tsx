"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Sentence {
  id: string;
  text: string;
  isCompleted: boolean;
}

export default function SentenceChainPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始短句接龍遊戲
  const startSentenceChainGame = () => {
    if (vocabulary.length < 10) {
      alert("需要至少10個單字才能開始短句接龍遊戲！");
      return;
    }

    // 生成短句模板（使用單字作為填空）
    const sentenceTemplates = [
      "I like to eat ___.",
      "The ___ is very beautiful.",
      "My favorite color is ___.",
      "I can see a ___ in the sky.",
      "The ___ is running fast.",
      "I want to buy a new ___.",
      "The ___ is sleeping.",
      "I love to read ___ books.",
      "The ___ is singing loudly.",
      "My friend has a pet ___.",
    ];

    // 隨機選擇單字填充句子
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const gameSentences: Sentence[] = sentenceTemplates
      .slice(0, Math.min(10, vocabulary.length))
      .map((template, index) => ({
        id: `sentence-${index}`,
        text: template.replace("___", shuffled[index]?.english || "word"),
        isCompleted: false,
      }));

    setSentences(gameSentences);
    setCurrentSentenceIndex(0);
    setUserInput("");
    setScore(0);
    setTotalSentences(gameSentences.length);
    setIsGameStarted(true);
  };

  // 提交答案
  const submitAnswer = () => {
    if (!userInput.trim()) return;

    const currentSentence = sentences[currentSentenceIndex];
    if (!currentSentence) return;

    // 檢查答案（簡單的關鍵字匹配）
    const isCorrect = vocabulary.some(
      (word) =>
        userInput.toLowerCase().includes(word.english.toLowerCase()) ||
        userInput.toLowerCase().includes(word.chinese.toLowerCase())
    );

    if (isCorrect) {
      setScore((prev) => prev + 1);
      // 標記句子為完成
      const updatedSentences = sentences.map((s, index) =>
        index === currentSentenceIndex ? { ...s, isCompleted: true } : s
      );
      setSentences(updatedSentences);
    }

    // 清空輸入
    setUserInput("");

    // 移到下一個句子
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
    } else {
      // 遊戲結束
      setIsGameStarted(false);
    }
  };

  // 跳過當前句子
  const skipSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
      setUserInput("");
    } else {
      setIsGameStarted(false);
    }
  };

  // 重置遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setSentences([]);
    setCurrentSentenceIndex(0);
    setUserInput("");
    setScore(0);
    setTotalSentences(0);
  };

  // 按Enter鍵提交
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submitAnswer();
    }
  };

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">短句接龍</h1>
          <p className="text-xl text-gray-600">輪流接龍，練習句型結構</p>
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
                    onClick={startSentenceChainGame}
                    className="w-full mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    開始短句接龍遊戲
                  </button>
                )}

                {vocabulary.length < 10 && vocabulary.length > 0 && (
                  <div className="text-center text-red-600 text-sm mt-4">
                    需要至少10個單字才能開始短句接龍遊戲，目前只有{" "}
                    {vocabulary.length} 個單字
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 短句接龍遊戲區域 */}
        {isGameStarted && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                短句接龍遊戲進行中
              </h2>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                重新開始
              </button>
            </div>

            {/* 遊戲進度 */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center space-x-6">
                <span className="text-gray-600">
                  進度: {currentSentenceIndex + 1} / {totalSentences}
                </span>
                <span className="text-gray-600">
                  得分: {score} / {totalSentences}
                </span>
              </div>
            </div>

            {/* 當前句子 */}
            <div className="mb-8 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  完成這個句子：
                </h3>
                <p className="text-2xl font-medium text-gray-800 mb-6">
                  {sentences[currentSentenceIndex]?.text}
                </p>

                {/* 輸入區域 */}
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="輸入你的接龍句子..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* 遊戲控制按鈕 */}
            <div className="text-center space-x-4">
              <button
                onClick={submitAnswer}
                disabled={!userInput.trim()}
                className="px-8 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交答案
              </button>
              <button
                onClick={skipSentence}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                跳過
              </button>
            </div>

            {/* 遊戲提示 */}
            <div className="mt-6 text-center text-gray-600 text-sm">
              <p>使用提供的單字來完成句子，發揮創意！</p>
            </div>

            {/* 已完成的句子 */}
            {sentences.filter((s) => s.isCompleted).length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  已完成的句子：
                </h3>
                <div className="space-y-2">
                  {sentences.map(
                    (sentence, index) =>
                      sentence.isCompleted && (
                        <div
                          key={sentence.id}
                          className="bg-green-50 border border-green-200 rounded-lg p-3"
                        >
                          <span className="text-sm text-green-600 font-medium">
                            ✓ 句子 {index + 1}:
                          </span>
                          <span className="ml-2 text-gray-700">
                            {sentence.text}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 遊戲完成提示 */}
        {!isGameStarted && sentences.length > 0 && (
          <div className="text-center mt-8">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
              🎉 遊戲完成！你的得分是 {score} / {totalSentences} 🎉
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
