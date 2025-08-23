"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Question {
  id: string;
  words: Vocabulary[];
  correctAnswer: string;
  explanation: string;
}

export default function FindDifferentPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始「找出不同」單字遊戲
  const startFindDifferentGame = () => {
    if (vocabulary.length < 15) {
      alert("需要至少15個單字才能開始「找出不同」單字遊戲！");
      return;
    }

    // 生成問題
    const generatedQuestions = generateQuestions(vocabulary);
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedWord(null);
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(generatedQuestions.length);
    setShowHint(false);
    setIsGameStarted(true);
  };

  // 生成問題
  const generateQuestions = (vocab: Vocabulary[]): Question[] => {
    const questions: Question[] = [];
    const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);

    // 簡單的問題生成邏輯
    for (let i = 0; i < Math.min(5, Math.floor(vocab.length / 3)); i++) {
      const startIndex = i * 3;
      const questionWords = shuffledVocab.slice(startIndex, startIndex + 3);

      if (questionWords.length === 3) {
        // 隨機選擇一個作為「不同」的單字
        const differentIndex = Math.floor(Math.random() * 3);
        const differentWord = questionWords[differentIndex];

        questions.push({
          id: `question-${i}`,
          words: questionWords,
          correctAnswer: differentWord.id,
          explanation: `「${differentWord.english}」與其他單字不屬於同一類別。`,
        });
      }
    }

    return questions;
  };

  // 選擇單字
  const selectWord = (wordId: string) => {
    if (!isAnswered) {
      setSelectedWord(wordId);
    }
  };

  // 提交答案
  const submitAnswer = () => {
    if (!selectedWord || !questions[currentQuestionIndex]) return;

    const isCorrect =
      selectedWord === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setIsAnswered(true);
  };

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedWord(null);
      setIsAnswered(false);
    } else {
      setIsGameStarted(false);
    }
  };

  // 重新開始遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedWord(null);
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(0);
    setShowHint(false);
  };

  // 切換提示
  const toggleHint = () => {
    setShowHint(!showHint);
  };

  // 獲取單字樣式
  const getWordStyle = (wordId: string) => {
    if (!isAnswered) {
      return selectedWord === wordId
        ? "border-indigo-500 bg-indigo-50"
        : "border-gray-300 bg-white hover:border-indigo-300";
    }

    if (wordId === questions[currentQuestionIndex]?.correctAnswer) {
      return "border-green-500 bg-green-50";
    } else if (wordId === selectedWord) {
      return "border-red-500 bg-red-50";
    } else {
      return "border-gray-300 bg-gray-50";
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
            <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              「找出不同」單字
            </h1>
            <p className="text-xl text-gray-600">找出不屬於同一類別的單字</p>
          </div>

          {/* 句型與單字主題選擇 */}
          {!isGameStarted && (
            <>
              <TextbookSelector
                onVocabularySelected={handleVocabularySelected}
              />

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
                  {vocabulary.length >= 15 && (
                    <button
                      onClick={startFindDifferentGame}
                      className="w-full mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium"
                    >
                      開始「找出不同」單字遊戲
                    </button>
                  )}

                  {vocabulary.length < 15 && vocabulary.length > 0 && (
                    <div className="text-center text-red-600 text-sm mt-4">
                      需要至少15個單字才能開始「找出不同」單字遊戲，目前只有{" "}
                      {vocabulary.length} 個單字
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 「找出不同」單字遊戲區域 */}
          {isGameStarted && currentQuestion && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  「找出不同」單字遊戲進行中
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
                    題目: {currentQuestionIndex + 1} / {totalQuestions}
                  </span>
                  <span className="text-gray-600">
                    得分: {score} / {totalQuestions}
                  </span>
                </div>
              </div>

              {/* 當前題目 */}
              <div className="mb-8 text-center">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-indigo-800 mb-6">
                    第 {currentQuestionIndex + 1} 題
                  </h3>

                  {/* 題目說明 */}
                  <p className="text-xl text-gray-700 mb-6">
                    在以下單字中，找出<strong>不屬於同一類別</strong>的單字：
                  </p>

                  {/* 單字選擇區域 */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {currentQuestion.words.map((word) => (
                      <button
                        key={word.id}
                        onClick={() => selectWord(word.id)}
                        disabled={isAnswered}
                        className={`
                          p-6 text-lg font-medium border-2 rounded-lg transition-all duration-200 cursor-pointer
                          ${getWordStyle(word.id)}
                          ${!isAnswered ? "hover:shadow-lg" : ""}
                        `}
                      >
                        <div className="text-lg font-bold mb-2">
                          {word.english}
                        </div>
                        <div className="text-sm text-gray-600">
                          {word.chinese}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 提示區域 */}
              {showHint && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">
                    提示：
                  </h4>
                  <p className="text-blue-700">
                    仔細觀察每個單字的含義，思考它們是否屬於同一個主題或類別。
                  </p>
                </div>
              )}

              {/* 答案解釋 */}
              {isAnswered && (
                <div className="mb-6 text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-lg font-medium text-green-800">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              )}

              {/* 遊戲控制按鈕 */}
              <div className="text-center space-x-4">
                {!isAnswered ? (
                  <button
                    onClick={submitAnswer}
                    disabled={!selectedWord}
                    className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    提交答案
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? "下一題"
                      : "完成遊戲"}
                  </button>
                )}
              </div>

              {/* 遊戲提示 */}
              <div className="mt-6 text-center text-gray-600 text-sm">
                <p>仔細觀察每個單字的含義，找出不屬於同一類別的單字！</p>
              </div>
            </div>
          )}

          {/* 遊戲完成提示 */}
          {!isGameStarted && questions.length > 0 && (
            <div className="text-center mt-8">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                🎉 遊戲完成！你的得分是 {score} / {totalQuestions} 🎉
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
    </div>
  );
}
