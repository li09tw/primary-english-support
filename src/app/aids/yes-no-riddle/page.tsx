"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface RiddleQuestion {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  category: string;
}

export default function YesNoRiddlePage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<RiddleQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始是否猜謎遊戲
  const startYesNoRiddleGame = () => {
    if (vocabulary.length < 6) {
      alert("需要至少6個單字才能開始是否猜謎遊戲！");
      return;
    }

    // 生成問題
    const generatedQuestions = generateQuestions(vocabulary);
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(generatedQuestions.length);
    setShowHint(false);
    setIsGameStarted(true);
  };

  // 生成問題
  const generateQuestions = (vocab: Vocabulary[]): RiddleQuestion[] => {
    const questions: RiddleQuestion[] = [];
    const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);

    // 簡單的謎語生成邏輯
    for (let i = 0; i < Math.min(5, Math.floor(vocab.length / 2)); i++) {
      const startIndex = i * 2;
      const questionWords = shuffledVocab.slice(startIndex, startIndex + 2);

      if (questionWords.length === 2) {
        const targetWord = questionWords[0];

        // 根據單字類型生成謎語
        let question: string;
        let answer: string;
        let explanation: string;
        let category: string;

        if (
          targetWord.english.toLowerCase().includes("cat") ||
          targetWord.english.toLowerCase().includes("dog") ||
          targetWord.english.toLowerCase().includes("bird")
        ) {
          question = `我是一種動物，有四條腿，會發出聲音，我是什麼？`;
          answer = targetWord.english;
          explanation = `這是一個關於動物的謎語。`;
          category = "動物";
        } else if (
          targetWord.english.toLowerCase().includes("apple") ||
          targetWord.english.toLowerCase().includes("banana") ||
          targetWord.english.toLowerCase().includes("bread")
        ) {
          question = `我是一種食物，可以吃，有營養，我是什麼？`;
          answer = targetWord.english;
          explanation = `這是一個關於食物的謎語。`;
          category = "食物";
        } else if (
          targetWord.english.toLowerCase().includes("red") ||
          targetWord.english.toLowerCase().includes("blue") ||
          targetWord.english.toLowerCase().includes("green")
        ) {
          question = `我是一種顏色，在彩虹中可以看到，我是什麼？`;
          answer = targetWord.english;
          explanation = `這是一個關於顏色的謎語。`;
          category = "顏色";
        } else {
          question = `我是一個單字，中文意思是「${targetWord.chinese}」，我是什麼？`;
          answer = targetWord.english;
          explanation = `這是一個關於單字意思的謎語。`;
          category = "單字";
        }

        questions.push({
          id: `riddle-${i}`,
          question,
          answer,
          explanation,
          category,
        });
      }
    }

    return questions;
  };

  // 提交答案
  const submitAnswer = () => {
    if (!userAnswer.trim() || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const userAnswerLower = userAnswer.trim().toLowerCase();
    const correctAnswerLower = currentQuestion.answer.toLowerCase();

    // 檢查答案（允許部分匹配）
    const isCorrect =
      userAnswerLower.includes(correctAnswerLower) ||
      correctAnswerLower.includes(userAnswerLower) ||
      userAnswerLower === correctAnswerLower;

    if (isCorrect) {
      setScore(score + 1);
    }

    setIsAnswered(true);
  };

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // 遊戲結束
      setIsGameStarted(false);
    }
  };

  // 重新開始遊戲
  const restartGame = () => {
    setIsGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(0);
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      {/* 添加頂部間距，避免與 Header 重疊 */}
      <div className="pt-16"></div>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">是否猜謎</h1>
            <p className="text-lg text-gray-600">
              透過問答猜出答案，提升思維能力
            </p>
          </div>

          {/* 返回連結 */}
          <div className="mb-6">
            <Link
              href="/aids"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              返回電子教具
            </Link>
          </div>

          {/* 教材選擇器 */}
          <div className="mb-8">
            <TextbookSelector onVocabularySelected={handleVocabularySelected} />
          </div>

          {!isGameStarted ? (
            <div className="text-center">
              <button
                onClick={startYesNoRiddleGame}
                disabled={vocabulary.length === 0}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
              >
                開始遊戲
              </button>
              {vocabulary.length === 0 && (
                <p className="mt-4 text-gray-600">請先選擇教材和單字</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* 遊戲進度 */}
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    題目 {currentQuestionIndex + 1} / {totalQuestions}
                  </span>
                  <span className="text-sm text-gray-600">
                    分數: {score} / {totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) / totalQuestions) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* 當前問題 */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                {/* 謎語類別 */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {questions[currentQuestionIndex]?.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  {questions[currentQuestionIndex]?.question}
                </h3>

                <p className="text-gray-600 mb-4 text-center">請猜出答案：</p>

                {/* 輸入框 */}
                <div className="mb-6">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="請輸入你的答案..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                    disabled={isAnswered}
                  />
                </div>

                {/* 提示按鈕 */}
                <div className="text-center mb-6">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                  >
                    {showHint ? "隱藏提示" : "顯示提示"}
                  </button>
                </div>

                {/* 提示內容 */}
                {showHint && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-center">
                      這個謎語的答案是一個英文單字，中文意思是「
                      {
                        vocabulary.find(
                          (v) =>
                            v.english ===
                            questions[currentQuestionIndex]?.answer
                        )?.chinese
                      }
                      」
                    </p>
                  </div>
                )}

                {/* 提交按鈕 */}
                {!isAnswered && (
                  <div className="text-center">
                    <button
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim()}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      提交答案
                    </button>
                  </div>
                )}

                {/* 答案反饋 */}
                {isAnswered && (
                  <div className="text-center">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        正確答案：
                      </h4>
                      <p className="text-green-600 font-medium text-lg">
                        {questions[currentQuestionIndex]?.answer}
                      </p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        說明：
                      </h4>
                      <p className="text-gray-700">
                        {questions[currentQuestionIndex]?.explanation}
                      </p>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      {currentQuestionIndex < questions.length - 1
                        ? "下一題"
                        : "完成遊戲"}
                    </button>
                  </div>
                )}
              </div>

              {/* 遊戲結束 */}
              {!isGameStarted && questions.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    遊戲結束！
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    你的最終分數：{score} / {totalQuestions}
                  </p>
                  <div className="space-x-4">
                    <button
                      onClick={restartGame}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      再玩一次
                    </button>
                    <Link
                      href="/aids"
                      className="inline-block px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      返回電子教具
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
