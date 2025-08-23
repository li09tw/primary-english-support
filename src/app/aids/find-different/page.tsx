"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface Question {
  id: string;
  words: Vocabulary[];
  category: string;
  differentWord: Vocabulary;
  explanation: string;
}

export default function FindDifferentPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
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

    // 預定義分類和對應的單字
    const categoryGroups = [
      {
        category: "動物",
        words: [
          "cat",
          "dog",
          "bird",
          "fish",
          "lion",
          "tiger",
          "elephant",
          "monkey",
          "bear",
          "rabbit",
        ],
        different: "apple",
      },
      {
        category: "食物",
        words: [
          "apple",
          "banana",
          "bread",
          "rice",
          "meat",
          "fish",
          "egg",
          "milk",
          "cake",
          "orange",
        ],
        different: "cat",
      },
      {
        category: "顏色",
        words: [
          "red",
          "blue",
          "green",
          "yellow",
          "black",
          "white",
          "pink",
          "purple",
          "orange",
          "brown",
        ],
        different: "book",
      },
      {
        category: "數字",
        words: [
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
          "eight",
          "nine",
          "ten",
        ],
        different: "red",
      },
      {
        category: "家庭",
        words: [
          "father",
          "mother",
          "sister",
          "brother",
          "grandfather",
          "grandmother",
          "uncle",
          "aunt",
          "cousin",
          "niece",
        ],
        different: "book",
      },
      {
        category: "學校",
        words: [
          "book",
          "pen",
          "pencil",
          "teacher",
          "student",
          "classroom",
          "school",
          "library",
          "homework",
          "exam",
        ],
        different: "cat",
      },
    ];

    // 生成遊戲題目
    const gameQuestions: Question[] = [];
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    let wordIndex = 0;

    categoryGroups.forEach((group, index) => {
      if (wordIndex >= vocabulary.length - 10) return; // 確保有足夠的單字

      // 從詞彙中選擇符合分類的單字
      const categoryWords: Vocabulary[] = [];
      const differentWord = shuffled[wordIndex++];

      // 選擇4個符合分類的單字
      for (let i = 0; i < 4 && wordIndex < vocabulary.length; i++) {
        const word = shuffled[wordIndex++];
        if (word) {
          categoryWords.push(word);
        }
      }

      // 選擇1個不同類別的單字
      const different = shuffled[wordIndex++];
      if (different && categoryWords.length === 4) {
        // 將所有單字混合並隨機排列
        const allWords = [...categoryWords, different].sort(
          () => Math.random() - 0.5
        );

        gameQuestions.push({
          id: `q-${index}`,
          words: allWords,
          category: group.category,
          differentWord: different,
          explanation: `「${different.english}」不屬於「${group.category}」類別，其他單字都是${group.category}。`,
        });
      }
    });

    // 隨機排列題目
    const shuffledQuestions = gameQuestions.sort(() => Math.random() - 0.5);

    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedWord("");
    setIsAnswered(false);
    setScore(0);
    setTotalQuestions(shuffledQuestions.length);
    setShowHint(false);
    setIsGameStarted(true);
  };

  // 選擇單字
  const selectWord = (wordId: string) => {
    if (isAnswered) return;
    setSelectedWord(wordId);
  };

  // 提交答案
  const submitAnswer = () => {
    if (!selectedWord || isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = selectedWord === currentQuestion.differentWord.id;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsAnswered(true);
  };

  // 下一題
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedWord("");
      setIsAnswered(false);
      setShowHint(false);
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
    setSelectedWord("");
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
        ? "bg-blue-100 border-blue-500 text-blue-800"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return "";

    if (wordId === currentQuestion.differentWord.id) {
      return "bg-green-100 border-green-500 text-green-800";
    }

    if (
      wordId === selectedWord &&
      wordId !== currentQuestion.differentWord.id
    ) {
      return "bg-red-100 border-red-500 text-red-800";
    }

    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
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
  );
}
