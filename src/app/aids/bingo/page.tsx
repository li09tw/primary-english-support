"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

export default function BingoPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [bingoGrid, setBingoGrid] = useState<string[][]>([]);
  const [calledWords, setCalledWords] = useState<string[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始賓果遊戲
  const startBingoGame = () => {
    if (vocabulary.length < 25) {
      alert("需要至少25個單字才能開始賓果遊戲！");
      return;
    }

    // 隨機選擇25個單字
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 25);

    // 建立5x5賓果網格
    const grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(selectedWords.slice(i * 5, (i + 1) * 5).map((v) => v.english));
    }

    setBingoGrid(grid);
    setCalledWords([]);
    setIsGameStarted(true);
  };

  // 叫出單字
  const callWord = () => {
    if (vocabulary.length === 0) return;

    const remainingWords = vocabulary.filter(
      (v) => !calledWords.includes(v.english)
    );
    if (remainingWords.length === 0) return;

    const randomIndex = Math.floor(Math.random() * remainingWords.length);
    const word = remainingWords[randomIndex];

    setCalledWords((prev) => [...prev, word.english]);
  };

  // 檢查賓果
  const checkBingo = (grid: string[][]) => {
    // 檢查行
    for (let i = 0; i < 5; i++) {
      if (grid[i].every((word) => calledWords.includes(word))) {
        return true;
      }
    }

    // 檢查列
    for (let j = 0; j < 5; j++) {
      if (grid.every((row) => calledWords.includes(row[j]))) {
        return true;
      }
    }

    // 檢查對角線
    if (grid[0][0] && grid[1][1] && grid[2][2] && grid[3][3] && grid[4][4]) {
      if (
        calledWords.includes(grid[0][0]) &&
        calledWords.includes(grid[1][1]) &&
        calledWords.includes(grid[2][2]) &&
        calledWords.includes(grid[3][3]) &&
        calledWords.includes(grid[4][4])
      ) {
        return true;
      }
    }

    if (grid[0][4] && grid[1][3] && grid[2][2] && grid[3][1] && grid[4][0]) {
      if (
        calledWords.includes(grid[0][4]) &&
        calledWords.includes(grid[1][3]) &&
        calledWords.includes(grid[2][2]) &&
        calledWords.includes(grid[3][1]) &&
        calledWords.includes(grid[4][0])
      ) {
        return true;
      }
    }

    return false;
  };

  // 重置遊戲
  const resetGame = () => {
    setIsGameStarted(false);
    setBingoGrid([]);
    setCalledWords([]);
  };

  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
            <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">單字賓果</h1>
            <p className="text-xl text-gray-600">透過賓果遊戲學習英語單字</p>
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
                  {vocabulary.length >= 25 && (
                    <button
                      onClick={startBingoGame}
                      className="w-full mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    >
                      開始賓果遊戲
                    </button>
                  )}

                  {vocabulary.length < 25 && vocabulary.length > 0 && (
                    <div className="text-center text-red-600 text-sm mt-4">
                      需要至少25個單字才能開始賓果遊戲，目前只有{" "}
                      {vocabulary.length} 個單字
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 賓果遊戲區域 */}
          {isGameStarted && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  賓果遊戲進行中
                </h2>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  重新開始
                </button>
              </div>

              {/* 遊戲控制 */}
              <div className="mb-6 text-center">
                <button
                  onClick={callWord}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium mr-4"
                >
                  叫出單字
                </button>
                <span className="text-gray-600">
                  已叫出: {calledWords.length} 個單字
                </span>
              </div>

              {/* 賓果網格 */}
              <div className="mb-6">
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                  {bingoGrid.map((row, rowIndex) =>
                    row.map((word, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center text-center p-2 text-sm font-medium
                          ${
                            calledWords.includes(word)
                              ? "bg-green-100 border-green-500 text-green-800"
                              : "bg-white text-gray-700"
                          }
                        `}
                      >
                        {word}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 已叫出的單字列表 */}
              {calledWords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    已叫出的單字：
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {calledWords.map((word, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-700 bg-white px-2 py-1 rounded"
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 賓果提示 */}
              {checkBingo(bingoGrid) && (
                <div className="mt-6 text-center">
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
                    🎉 恭喜！賓果達成！ 🎉
                  </div>
                </div>
              )}
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
