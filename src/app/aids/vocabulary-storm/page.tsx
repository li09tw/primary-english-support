"use client";

import { useState, useEffect } from "react";
import { Vocabulary } from "@/types";
import TextbookSelector from "@/components/TextbookSelector";
import Link from "next/link";

interface StormRound {
  id: string;
  category: string;
  targetWords: Vocabulary[];
  userWords: string[];
  timeLeft: number;
  isActive: boolean;
}

export default function VocabularyStormPage() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [stormRounds, setStormRounds] = useState<StormRound[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [score, setScore] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);

  // 處理單字選擇
  const handleVocabularySelected = (selectedVocabulary: Vocabulary[]) => {
    setVocabulary(selectedVocabulary);
  };

  // 開始字彙風暴遊戲
  const startVocabularyStormGame = () => {
    if (vocabulary.length < 10) {
      alert("需要至少10個單字才能開始字彙風暴遊戲！");
      return;
    }

    // 生成遊戲回合
    const generatedRounds = generateStormRounds(vocabulary);
    setStormRounds(generatedRounds);
    setCurrentRoundIndex(0);
    setCurrentInput("");
    setScore(0);
    setTotalRounds(generatedRounds.length);
    setIsGameStarted(true);

    // 開始第一回合
    startRound(0);
  };

  // 生成遊戲回合
  const generateStormRounds = (vocab: Vocabulary[]): StormRound[] => {
    const rounds: StormRound[] = [];
    const shuffledVocab = [...vocab].sort(() => Math.random() - 0.5);

    // 定義分類
    const categories = [
      {
        name: "動物",
        keywords: [
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
      },
      {
        name: "食物",
        keywords: [
          "apple",
          "banana",
          "bread",
          "rice",
          "meat",
          "fish",
          "egg",
          "milk",
          "cake",
          "pizza",
        ],
      },
      {
        name: "顏色",
        keywords: [
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
      },
      {
        name: "數字",
        keywords: [
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
      },
      {
        name: "家庭",
        keywords: [
          "father",
          "mother",
          "sister",
          "brother",
          "grandfather",
          "grandmother",
          "uncle",
          "aunt",
          "cousin",
          "baby",
        ],
      },
    ];

    // 為每個分類生成回合
    categories.forEach((category, index) => {
      if (index < Math.floor(vocab.length / 5)) {
        const targetWords = shuffledVocab.slice(index * 5, (index + 1) * 5);

        rounds.push({
          id: `round-${index}`,
          category: category.name,
          targetWords,
          userWords: [],
          timeLeft: 60, // 60秒
          isActive: false,
        });
      }
    });

    return rounds.slice(0, 5); // 最多5個回合
  };

  // 開始回合
  const startRound = (roundIndex: number) => {
    if (roundIndex >= stormRounds.length) {
      // 遊戲結束
      setIsGameStarted(false);
      return;
    }

    setCurrentRoundIndex(roundIndex);
    setCurrentInput("");

    // 更新回合狀態
    const updatedRounds = stormRounds.map((round, index) => ({
      ...round,
      isActive: index === roundIndex,
      timeLeft: 60,
    }));
    setStormRounds(updatedRounds);

    // 開始計時器
    const timer = setInterval(() => {
      setStormRounds((prevRounds) => {
        const newRounds = prevRounds.map((round, index) => {
          if (index === roundIndex && round.isActive) {
            if (round.timeLeft > 1) {
              return { ...round, timeLeft: round.timeLeft - 1 };
            } else {
              // 時間到，結束回合
              clearInterval(timer);
              setTimeout(() => startRound(roundIndex + 1), 2000);
              return { ...round, timeLeft: 0, isActive: false };
            }
          }
          return round;
        });
        return newRounds;
      });
    }, 1000);

    setGameTimer(timer);
  };

  // 添加單字
  const addWord = () => {
    if (!currentInput.trim() || !stormRounds[currentRoundIndex]) return;

    const newWord = currentInput.trim().toLowerCase();
    const currentRound = stormRounds[currentRoundIndex];

    // 檢查是否已經添加過
    if (currentRound.userWords.includes(newWord)) {
      alert("這個單字已經添加過了！");
      return;
    }

    // 檢查是否在目標單字中
    const isTargetWord = currentRound.targetWords.some(
      (word) => word.english.toLowerCase() === newWord
    );

    if (isTargetWord) {
      setScore(score + 1);
    }

    // 更新回合
    const updatedRounds = stormRounds.map((round, index) => {
      if (index === currentRoundIndex) {
        return {
          ...round,
          userWords: [...round.userWords, newWord],
        };
      }
      return round;
    });
    setStormRounds(updatedRounds);

    setCurrentInput("");
  };

  // 處理按鍵事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addWord();
    }
  };

  // 跳過回合
  const skipRound = () => {
    if (gameTimer) {
      clearInterval(gameTimer);
    }
    startRound(currentRoundIndex + 1);
  };

  // 重新開始遊戲
  const restartGame = () => {
    if (gameTimer) {
      clearInterval(gameTimer);
    }
    setIsGameStarted(false);
    setStormRounds([]);
    setCurrentRoundIndex(0);
    setCurrentInput("");
    setScore(0);
    setTotalRounds(0);
    setGameTimer(null);
  };

  // 清理計時器
  useEffect(() => {
    return () => {
      if (gameTimer) {
        clearInterval(gameTimer);
      }
    };
  }, [gameTimer]);

  return (
    <div className="min-h-screen bg-primary-blue">
      {/* 添加頂部間距，避免與 Header 重疊 */}
      <div className="pt-16"></div>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">字彙風暴</h1>
            <p className="text-lg text-gray-600">
              快速聯想相關單字，提升詞彙量
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
                onClick={startVocabularyStormGame}
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
                    回合 {currentRoundIndex + 1} / {totalRounds}
                  </span>
                  <span className="text-sm text-gray-600">分數: {score}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((currentRoundIndex + 1) / totalRounds) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* 當前回合 */}
              {stormRounds[currentRoundIndex] && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  {/* 回合資訊 */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {stormRounds[currentRoundIndex].category}
                    </h3>
                    <div className="text-4xl font-bold text-red-500">
                      {stormRounds[currentRoundIndex].timeLeft}s
                    </div>
                    <p className="text-gray-600 mt-2">
                      請快速聯想與「{stormRounds[currentRoundIndex].category}
                      」相關的英文單字
                    </p>
                  </div>

                  {/* 輸入區域 */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="輸入單字..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!stormRounds[currentRoundIndex].isActive}
                      />
                      <button
                        onClick={addWord}
                        disabled={
                          !currentInput.trim() ||
                          !stormRounds[currentRoundIndex].isActive
                        }
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        添加
                      </button>
                    </div>
                  </div>

                  {/* 已添加的單字 */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      已添加的單字：
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stormRounds[currentRoundIndex].userWords.map(
                        (word, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {word}
                          </span>
                        )
                      )}
                      {stormRounds[currentRoundIndex].userWords.length ===
                        0 && (
                        <span className="text-gray-400">
                          還沒有添加任何單字
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 跳過按鈕 */}
                  <div className="text-center">
                    <button
                      onClick={skipRound}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      跳過回合
                    </button>
                  </div>
                </div>
              )}

              {/* 遊戲結束 */}
              {!isGameStarted && stormRounds.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    遊戲結束！
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    你的最終分數：{score}
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
