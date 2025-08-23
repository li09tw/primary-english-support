"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TextbookSelector from "@/components/TextbookSelector";
import { Vocabulary } from "@/types";

interface ShadowQuestion {
  id: string;
  word: Vocabulary;
  shadowImage: string;
  options: string[];
  correctAnswer: string;
}

export default function ShadowGuessPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [questions, setQuestions] = useState<ShadowQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // 處理選中的單字
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始遊戲
  const startShadowGuessGame = () => {
    if (vocabulary.length < 5) {
      alert("選擇的教材和單元至少需要5個單字");
      return;
    }

    const gameQuestions = generateQuestions(vocabulary);
    setQuestions(gameQuestions);
    setTotalQuestions(gameQuestions.length);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    setIsGameStarted(true);
  };

  // 生成問題
  const generateQuestions = (vocab: Vocabulary[]): ShadowQuestion[] => {
    const questions: ShadowQuestion[] = [];
    const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(10, Math.floor(vocab.length / 2)); i++) {
      const word = shuffledVocab[i];
      if (!word) continue;

      // 生成選項（包含正確答案和3個錯誤答案）
      const allWords = vocab.map((v) => v.english).filter((w) => w !== word.english);
      const wrongOptions = allWords.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...wrongOptions, word.english].sort(() => Math.random() - 0.5);

      questions.push({
        id: `question-${i}`,
        word: word,
        shadowImage: `/api/shadow-image?word=${encodeURIComponent(word.english)}`,
        options: options,
        correctAnswer: word.english,
      });
    }

    return questions;
  };

  // 選擇答案
  const selectAnswer = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  // 提交答案
  const submitAnswer = () => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;

    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setIsAnswered(true);
  };

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsGameStarted(false);
    }
  };

  // 重新開始遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(0);
    setShowHint(false);
  };

  // 切換提示
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // 獲取選項樣式
  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return selectedAnswer === option
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50";
    }

    if (option === questions[currentQuestionIndex]?.correctAnswer) {
      return "bg-green-500 text-white border-green-500";
    }

    if (option === selectedAnswer && option !== questions[currentQuestionIndex]?.correctAnswer) {
      return "bg-red-500 text-white border-red-500";
    }

    return "bg-gray-100 text-gray-600 border-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            黑影圖片猜謎
          </h1>
          <p className="text-xl text-gray-600">
            從黑影圖片猜出英文單字，訓練觀察力和單字記憶
          </p>
        </div>

        {!isGameStarted ? (
          <div>
            {/* 教材選擇 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <TextbookSelector
                onVocabularySelected={handleVocabularySelected}
              />
            </div>

            {/* 開始遊戲按鈕 */}
            <div className="text-center">
              <button
                onClick={startShadowGuessGame}
                className="px-8 py-4 bg-purple-600 text-white text-xl font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                開始遊戲
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* 遊戲進度 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="text-lg font-medium text-gray-700">
                  第 {currentQuestionIndex + 1} 題 / 共 {totalQuestions} 題
                </div>
                <div className="text-lg font-medium text-green-600">
                  得分: {score} / {totalQuestions}
                </div>
              </div>
            </div>

            {/* 當前問題 */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              {/* 黑影圖片 */}
              <div className="mb-6 text-center">
                <div className="bg-gray-200 rounded-lg p-8 mx-auto max-w-md">
                  <div className="text-6xl text-gray-400 mb-4">🌙</div>
                  <p className="text-gray-500 text-sm">黑影圖片區域</p>
                  <p className="text-gray-400 text-xs mt-2">
                    （實際實作時會顯示真實的黑影圖片）
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                請從以下選項中選擇正確的英文單字：
              </h3>

              {/* 選項 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(option)}
                    disabled={isAnswered}
                    className={`
                      p-4 text-lg font-medium border-2 rounded-lg transition-all duration-200 cursor-pointer
                      ${getOptionStyle(option)}
                      ${!isAnswered ? "hover:shadow-md" : ""}
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* 提示按鈕 */}
              <div className="text-center mb-6">
                <button
                  onClick={toggleHint}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                >
                  {showHint ? "隱藏提示" : "顯示提示"}
                </button>
              </div>

              {/* 提示內容 */}
              {showHint && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-center">
                    中文意思：{questions[currentQuestionIndex]?.word.chinese}
                  </p>
                </div>
              )}

              {/* 提交答案按鈕 */}
              {!isAnswered && selectedAnswer && (
                <div className="text-center mb-6">
                  <button
                    onClick={submitAnswer}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    提交答案
                  </button>
                </div>
              )}

              {/* 答案結果 */}
              {isAnswered && (
                <div className="text-center mb-6">
                  <div className={`inline-block p-4 rounded-lg ${
                    selectedAnswer === questions[currentQuestionIndex]?.correctAnswer
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    <p className="text-lg font-semibold">
                      {selectedAnswer === questions[currentQuestionIndex]?.correctAnswer
                        ? "答對了！"
                        : "答錯了！"
                      }
                    </p>
                    <p className="text-sm mt-1">
                      正確答案：{questions[currentQuestionIndex]?.correctAnswer}
                    </p>
                  </div>
                </div>
              )}

              {/* 遊戲控制按鈕 */}
              {isAnswered && (
                <div className="text-center space-x-4">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      下一題
                    </button>
                  ) : (
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      遊戲結束
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 遊戲說明 */}
            <div className="text-center text-gray-600 text-sm">
              <p>觀察黑影圖片，選擇對應的英文單字</p>
            </div>
          </div>
        )}

        {/* 返回按鈕 */}
        <div className="text-center mt-8">
          <Link
            href="/aids"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回電子教具
          </Link>
        </div>
      </div>
    </div>
  );
}
