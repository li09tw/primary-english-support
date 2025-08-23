"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface GrammarQuestion {
  id: string;
  sentence: string;
  correctSentence: string;
  errorType: string;
  explanation: string;
}

export default function GrammarCorrectionPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userCorrection, setUserCorrection] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始文法修正遊戲
  const startGrammarCorrectionGame = () => {
    if (vocabulary.length < 8) {
      alert("需要至少8個單字才能開始文法修正遊戲！");
      return;
    }

    // 生成問題
    const generatedQuestions = generateQuestions(vocabulary);
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setUserCorrection("");
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(generatedQuestions.length);
    setIsGameStarted(true);
  };

  // 生成問題
  const generateQuestions = (vocab: Vocabulary[]): GrammarQuestion[] => {
    const questions: GrammarQuestion[] = [];
    const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);

    // 簡單的文法問題生成邏輯
    for (let i = 0; i < Math.min(6, Math.floor(vocab.length / 2)); i++) {
      const startIndex = i * 2;
      const questionWords = shuffledVocab.slice(startIndex, startIndex + 2);

      if (questionWords.length === 2) {
        // 生成有文法錯誤的句子
        const errorTypes = [
          "單複數錯誤",
          "動詞時態錯誤",
          "冠詞錯誤",
          "詞序錯誤",
        ];
        const errorType =
          errorTypes[Math.floor(Math.random() * errorTypes.length)];

        let sentence: string;
        let correctSentence: string;
        let explanation: string;

        switch (errorType) {
          case "單複數錯誤":
            sentence = `I have ${questionWords[0].english} and ${questionWords[1].english}.`;
            correctSentence = `I have ${questionWords[0].english} and ${questionWords[1].english}.`;
            explanation = "這個句子在文法上是正確的。";
            break;
          case "動詞時態錯誤":
            sentence = `Yesterday I ${questionWords[0].english} to school.`;
            correctSentence = `Yesterday I went to school.`;
            explanation = "過去式應該使用 'went' 而不是原形動詞。";
            break;
          case "冠詞錯誤":
            sentence = `I see ${questionWords[0].english} in the park.`;
            correctSentence = `I see a ${questionWords[0].english} in the park.`;
            explanation = "可數名詞前需要冠詞 'a' 或 'an'。";
            break;
          case "詞序錯誤":
            sentence = `I like very much ${questionWords[0].english}.`;
            correctSentence = `I like ${questionWords[0].english} very much.`;
            explanation = "'very much' 應該放在句子的最後。";
            break;
          default:
            sentence = `I have ${questionWords[0].english}.`;
            correctSentence = `I have ${questionWords[0].english}.`;
            explanation = "這個句子在文法上是正確的。";
        }

        questions.push({
          id: `question-${i}`,
          sentence,
          correctSentence,
          errorType,
          explanation,
        });
      }
    }

    return questions;
  };

  // 提交答案
  const submitAnswer = () => {
    if (!userCorrection.trim() || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = userCorrection.trim().toLowerCase();
    const correctAnswer = currentQuestion.correctSentence.toLowerCase();

    // 簡單的答案檢查（檢查是否包含關鍵詞）
    const isCorrect =
      userAnswer.includes(correctAnswer.split(" ")[0]) ||
      correctAnswer.includes(userAnswer.split(" ")[0]);

    if (isCorrect) {
      setScore(score + 1);
    }

    setIsAnswered(true);
  };

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserCorrection("");
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
    setUserCorrection("");
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
            <h1 className="text-3xl font-bold text-gray-800 mb-4">文法修正</h1>
            <p className="text-lg text-gray-600">
              找出並修正文法錯誤，提升語言能力
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
                onClick={startGrammarCorrectionGame}
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
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {questions[currentQuestionIndex]?.errorType}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                  {questions[currentQuestionIndex]?.sentence}
                </h3>

                <p className="text-gray-600 mb-4 text-center">
                  請修正這個句子的文法錯誤：
                </p>

                {/* 輸入框 */}
                <div className="mb-6">
                  <textarea
                    value={userCorrection}
                    onChange={(e) => setUserCorrection(e.target.value)}
                    placeholder="請輸入修正後的句子..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    disabled={isAnswered}
                  />
                </div>

                {/* 提交按鈕 */}
                {!isAnswered && (
                  <div className="text-center">
                    <button
                      onClick={submitAnswer}
                      disabled={!userCorrection.trim()}
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
                      <p className="text-green-600 font-medium">
                        {questions[currentQuestionIndex]?.correctSentence}
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
