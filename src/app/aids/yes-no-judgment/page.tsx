"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import { Word, WordTheme } from "@/types/learning-content";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Question {
  id: string;
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

export default function YesNoJudgmentPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (words: Word[], theme: WordTheme) => {
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
  };

  // 開始「是/否」判斷遊戲
  const startYesNoJudgmentGame = () => {
    if (vocabulary.length < 10) {
      alert("需要至少10個單字才能開始「是/否」判斷遊戲！");
      return;
    }

    // 生成問題
    const generatedQuestions = generateQuestions(vocabulary);
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(generatedQuestions.length);
    setIsGameStarted(true);
  };

  // 生成問題
  const generateQuestions = (vocab: Vocabulary[]): Question[] => {
    const questions: Question[] = [];
    const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);

    // 簡單的問題生成邏輯
    for (let i = 0; i < Math.min(8, Math.floor(vocab.length / 2)); i++) {
      const startIndex = i * 2;
      const questionWords = shuffledVocab.slice(startIndex, startIndex + 2);

      if (questionWords.length === 2) {
        // 隨機生成正確或錯誤的陳述
        const isCorrect = Math.random() > 0.5;
        let statement: string;
        let explanation: string;

        if (isCorrect) {
          statement = `「${questionWords[0].english}」的中文意思是「${questionWords[0].chinese}」。`;
          explanation = "正確！這個陳述是對的。";
        } else {
          statement = `「${questionWords[0].english}」的中文意思是「${questionWords[1].chinese}」。`;
          explanation = `錯誤！「${questionWords[0].english}」的中文意思是「${questionWords[0].chinese}」，不是「${questionWords[1].chinese}」。`;
        }

        questions.push({
          id: `question-${i}`,
          statement,
          isCorrect,
          explanation,
        });
      }
    }

    return questions;
  };

  // 選擇答案
  const selectAnswer = (answer: boolean) => {
    if (!isAnswered) {
      setUserAnswer(answer);
    }
  };

  // 提交答案
  const submitAnswer = () => {
    if (userAnswer === null || !questions[currentQuestionIndex]) return;

    const isCorrect = userAnswer === questions[currentQuestionIndex].isCorrect;
    if (isCorrect) {
      setScore(score + 1);
    }

    setIsAnswered(true);
  };

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(null);
      setIsAnswered(false);
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
    setUserAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(0);
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      {/* 添加頂部間距，避免與 Header 重疊 */}
      <div className="pt-16"></div>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              「是/否」判斷
            </h1>
            <p className="text-lg text-gray-600">
              判斷語句的正確性，提升理解能力
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
                onClick={startYesNoJudgmentGame}
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
                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  {questions[currentQuestionIndex]?.statement}
                </h3>

                {/* 答案選項 */}
                <div className="flex justify-center space-x-6 mb-6">
                  <button
                    onClick={() => selectAnswer(true)}
                    disabled={isAnswered}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                      userAnswer === true
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } disabled:opacity-50`}
                  >
                    是
                  </button>
                  <button
                    onClick={() => selectAnswer(false)}
                    disabled={isAnswered}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                      userAnswer === false
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } disabled:opacity-50`}
                  >
                    否
                  </button>
                </div>

                {/* 提交按鈕 */}
                {userAnswer !== null && !isAnswered && (
                  <div className="text-center">
                    <button
                      onClick={submitAnswer}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      確認答案
                    </button>
                  </div>
                )}

                {/* 答案反饋 */}
                {isAnswered && (
                  <div className="text-center">
                    <div
                      className={`inline-block px-4 py-2 rounded-lg mb-4 ${
                        userAnswer ===
                        questions[currentQuestionIndex]?.isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {userAnswer === questions[currentQuestionIndex]?.isCorrect
                        ? "答對了！"
                        : "答錯了！"}
                    </div>
                    <p className="text-gray-700 mb-4">
                      {questions[currentQuestionIndex]?.explanation}
                    </p>
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
