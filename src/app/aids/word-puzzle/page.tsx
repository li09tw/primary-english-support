"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface PuzzleWord {
  id: string;
  word: string;
  chinese: string;
  scrambledLetters: string[];
  userLetters: string[];
  isCompleted: boolean;
}

export default function WordPuzzlePage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [puzzleWords, setPuzzleWords] = useState<PuzzleWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始單字拼圖遊戲
  const startWordPuzzleGame = () => {
    if (vocabulary.length < 5) {
      alert("需要至少5個單字才能開始單字拼圖遊戲！");
      return;
    }

    // 選擇單字數量（5-15個）
    const wordCount = Math.min(vocabulary.length, 15);
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, wordCount);

    // 建立拼圖單字
    const gamePuzzleWords: PuzzleWord[] = selectedWords.map((word, index) => {
      const letters = word.english.split("");
      const scrambledLetters = [...letters].sort(() => Math.random() - 0.5);

      return {
        id: `puzzle-${index}`,
        word: word.english,
        chinese: word.chinese,
        scrambledLetters,
        userLetters: [],
        isCompleted: false,
      };
    });

    setPuzzleWords(gamePuzzleWords);
    setCurrentWordIndex(0);
    setScore(0);
    setTotalWords(gamePuzzleWords.length);
    setShowHint(false);
    setIsGameStarted(true);
  };

  // 選擇字母
  const selectLetter = (letter: string, letterIndex: number) => {
    if (puzzleWords[currentWordIndex].isCompleted) return;

    const currentPuzzle = puzzleWords[currentWordIndex];
    const newUserLetters = [...currentPuzzle.userLetters, letter];

    // 檢查是否完成
    const isCompleted = newUserLetters.join("") === currentPuzzle.word;

    const updatedPuzzleWords = puzzleWords.map((puzzle, index) =>
      index === currentWordIndex
        ? { ...puzzle, userLetters: newUserLetters, isCompleted }
        : puzzle
    );

    setPuzzleWords(updatedPuzzleWords);

    if (isCompleted) {
      setScore((prev) => prev + 1);
      // 延遲一下再進入下一題
      setTimeout(() => {
        if (currentWordIndex < puzzleWords.length - 1) {
          nextWord();
        } else {
          // 遊戲結束
          setIsGameStarted(false);
        }
      }, 1000);
    }
  };

  // 移除最後一個字母
  const removeLastLetter = () => {
    if (puzzleWords[currentWordIndex].isCompleted) return;

    const currentPuzzle = puzzleWords[currentWordIndex];
    const newUserLetters = currentPuzzle.userLetters.slice(0, -1);

    const updatedPuzzleWords = puzzleWords.map((puzzle, index) =>
      index === currentWordIndex
        ? { ...puzzle, userLetters: newUserLetters, isCompleted: false }
        : puzzle
    );

    setPuzzleWords(updatedPuzzleWords);
  };

  // 重置當前單字
  const resetCurrentWord = () => {
    if (puzzleWords[currentWordIndex].isCompleted) return;

    const updatedPuzzleWords = puzzleWords.map((puzzle, index) =>
      index === currentWordIndex
        ? { ...puzzle, userLetters: [], isCompleted: false }
        : puzzle
    );

    setPuzzleWords(updatedPuzzleWords);
  };

  // 下一題
  const nextWord = () => {
    if (currentWordIndex < puzzleWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  // 重置遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setPuzzleWords([]);
    setCurrentWordIndex(0);
    setScore(0);
    setTotalWords(0);
    setShowHint(false);
  };

  // 獲取字母樣式
  const getLetterStyle = (letter: string, letterIndex: number) => {
    const currentPuzzle = puzzleWords[currentWordIndex];
    if (!currentPuzzle) return "bg-gray-100 text-gray-400";

    const isUsed = currentPuzzle.userLetters.includes(letter);
    const isCorrect = currentPuzzle.word.includes(letter);

    if (isUsed) {
      return "bg-green-100 border-green-300 text-green-700 hover:bg-green-200 cursor-pointer";
    } else if (isCorrect) {
      return "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 cursor-pointer";
    } else {
      return "bg-red-100 border-red-300 text-red-700 hover:bg-red-200 cursor-pointer";
    }
  };

  const currentPuzzle = puzzleWords[currentWordIndex];

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">單字拼圖</h1>
            <p className="text-xl text-black">拼湊字母，完成單字</p>
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
                  <h3 className="text-lg font-semibold text-black mb-4">
                    單字列表 ({vocabulary.length} 個)
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {vocabulary.map((word) => (
                        <div key={word.id} className="text-sm text-black">
                          {word.english} - {word.chinese}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 開始遊戲按鈕 */}
                  {vocabulary.length >= 5 && (
                    <button
                      onClick={startWordPuzzleGame}
                      className="w-full mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      開始單字拼圖遊戲
                    </button>
                  )}

                  {vocabulary.length < 5 && vocabulary.length > 0 && (
                    <div className="text-center text-red-600 text-sm mt-4">
                      需要至少5個單字才能開始單字拼圖遊戲，目前只有{" "}
                      {vocabulary.length} 個單字
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 單字拼圖遊戲區域 */}
          {isGameStarted && currentPuzzle && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">
                  單字拼圖遊戲進行中
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
                  <span className="text-black">
                    單字: {currentWordIndex + 1} / {totalWords}
                  </span>
                  <span className="text-black">
                    得分: {score} / {totalWords}
                  </span>
                </div>
              </div>

              {/* 當前拼圖 */}
              <div className="mb-8 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-red-800 mb-6">
                    第 {currentWordIndex + 1} 個單字
                  </h3>

                  {/* 中文提示 */}
                  <p className="text-xl text-black mb-6">
                    中文意思：{currentPuzzle.chinese}
                  </p>

                  {/* 用戶拼出的單字 */}
                  <div className="mb-8">
                    <div className="flex justify-center space-x-2">
                      {currentPuzzle.word.split("").map((_, index) => (
                        <div
                          key={index}
                          className={`
                            w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center text-2xl font-bold
                            ${
                              currentPuzzle.userLetters[index]
                                ? "bg-green-100 border-green-500 text-green-800"
                                : "bg-gray-100 text-gray-400"
                            }
                          `}
                        >
                          {currentPuzzle.userLetters[index] || "_"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 字母選擇區域 */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-black mb-4">
                    選擇字母：
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                    {currentPuzzle.scrambledLetters.map((letter, index) => (
                      <button
                        key={`${letter}-${index}`}
                        onClick={() => selectLetter(letter, index)}
                        disabled={currentPuzzle.isCompleted}
                        className={`
                          w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all
                          ${getLetterStyle(letter, index)}
                        `}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 遊戲控制按鈕 */}
                <div className="space-x-4">
                  <button
                    onClick={removeLastLetter}
                    disabled={
                      currentPuzzle.userLetters.length === 0 ||
                      currentPuzzle.isCompleted
                    }
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    刪除
                  </button>
                  <button
                    onClick={resetCurrentWord}
                    disabled={currentPuzzle.isCompleted}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    重置
                  </button>
                </div>
              </div>

              {/* 完成提示 */}
              {currentPuzzle.isCompleted && (
                <div className="mb-6 text-center">
                  <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg">
                    🎉 正確！{currentPuzzle.word} = {currentPuzzle.chinese} 🎉
                  </div>
                </div>
              )}

              {/* 遊戲提示 */}
              <div className="text-center text-black text-sm">
                <p>將打亂的字母按正確順序排列，拼出完整的單字！</p>
              </div>
            </div>
          )}

          {/* 遊戲完成提示 */}
          {!isGameStarted && puzzleWords.length > 0 && (
            <div className="text-center mt-8">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg">
                🎉 遊戲完成！你的得分是 {score} / {totalWords} 🎉
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
