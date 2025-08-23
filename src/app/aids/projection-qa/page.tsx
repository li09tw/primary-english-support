"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function ProjectionQAPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始投影幕問答遊戲
  const startProjectionQAGame = () => {
    if (vocabulary.length < 8) {
      alert("需要至少8個單字才能開始投影幕問答遊戲！");
      return;
    }

    // 生成問答題目
    const gameQuestions: Question[] = [];
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);

    // 題目類型1：單字意思選擇
    for (let i = 0; i < Math.min(5, vocabulary.length); i++) {
      const word = shuffled[i];
      const otherWords = shuffled.filter((w) => w.id !== word.id).slice(0, 3);
      const options = [word.chinese, ...otherWords.map((w) => w.chinese)].sort(
        () => Math.random() - 0.5
      );

      gameQuestions.push({
        id: `q-${i}`,
        question: `「${word.english}」的中文意思是什麼？`,
        options,
        correctAnswer: word.chinese,
        explanation: `${word.english} = ${word.chinese}`,
      });
    }

    // 題目類型2：英文單字選擇
    for (let i = 5; i < Math.min(8, vocabulary.length); i++) {
      const word = shuffled[i];
      const otherWords = shuffled.filter((w) => w.id !== word.id).slice(0, 3);
      const options = [word.english, ...otherWords.map((w) => w.english)].sort(
        () => Math.random() - 0.5
      );

      gameQuestions.push({
        id: `q-${i}`,
        question: `「${word.chinese}」的英文單字是什麼？`,
        options,
        correctAnswer: word.english,
        explanation: `${word.chinese} = ${word.english}`,
      });
    }

    // 隨機排列題目
    const shuffledQuestions = gameQuestions.sort(() => Math.random() - 0.5);

    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(shuffledQuestions.length);
    setShowAnswer(false);
    setIsGameStarted(true);
  };

  // 選擇答案
  const selectAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  // 提交答案
  const submitAnswer = () => {
    if (!selectedAnswer || isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsAnswered(true);
    setShowAnswer(true);
  };

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setIsAnswered(false);
      setShowAnswer(false);
    } else {
      // 遊戲結束
      setIsGameStarted(false);
    }
  };

  // 重置遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(0);
    setShowAnswer(false);
  };

  // 獲取選項樣式
  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return selectedAnswer === option
        ? "bg-blue-100 border-blue-500 text-blue-800"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
    }

    if (option === questions[currentQuestionIndex]?.correctAnswer) {
      return "bg-green-100 border-green-500 text-green-800";
    }

    if (
      option === selectedAnswer &&
      option !== questions[currentQuestionIndex]?.correctAnswer
    ) {
      return "bg-red-100 border-red-500 text-red-800";
    }

    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">投影幕問答</h1>
          <p className="text-xl text-gray-600">大螢幕互動問答遊戲</p>
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
                {vocabulary.length >= 8 && (
                  <button
                    onClick={startProjectionQAGame}
                    className="w-full mt-4 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    開始投影幕問答遊戲
                  </button>
                )}

                {vocabulary.length < 8 && vocabulary.length > 0 && (
                  <div className="text-center text-red-600 text-sm mt-4">
                    需要至少8個單字才能開始投影幕問答遊戲，目前只有{" "}
                    {vocabulary.length} 個單字
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* 投影幕問答遊戲區域 */}
        {isGameStarted && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                投影幕問答遊戲進行中
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
                  題目: {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <span className="text-gray-600">
                  得分: {score} / {totalQuestions}
                </span>
              </div>
            </div>

            {/* 當前題目 */}
            <div className="mb-8 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-yellow-800 mb-6">
                  第 {currentQuestionIndex + 1} 題
                </h3>
                <p className="text-3xl font-medium text-gray-800 mb-8">
                  {questions[currentQuestionIndex]?.question}
                </p>

                {/* 選項區域 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {questions[currentQuestionIndex]?.options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => selectAnswer(option)}
                        disabled={isAnswered}
                        className={`
                        p-6 text-xl font-medium border-2 rounded-lg transition-all duration-200 cursor-pointer
                        ${getOptionStyle(option)}
                        ${!isAnswered ? "hover:shadow-lg" : ""}
                      `}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* 答案解釋 */}
            {showAnswer && (
              <div className="mb-6 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-lg font-medium text-blue-800">
                    {questions[currentQuestionIndex]?.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* 遊戲控制按鈕 */}
            <div className="text-center space-x-4">
              {!isAnswered ? (
                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                  className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p>選擇正確的答案，適合大螢幕投影和全班互動！</p>
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
  );
}
