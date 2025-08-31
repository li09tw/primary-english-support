/**
 * @fileoverview 句型拉霸機遊戲頁面 - 核心遊戲邏輯
 * @modified 2024-12-19 15:30 - 鎖定保護完成
 * @modified_by Assistant
 * @modification_type protection
 * @status locked
 * @last_commit 2024-12-19 15:30
 * @feature 句型拉霸機遊戲核心功能，包含填空題和是非題模式
 * @protection 此檔案已鎖定，禁止修改，如需類似功能請建立新組件
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GameData, Word } from "@/types/learning-content";
import { patternHandlers } from "@/lib/game-logic";

interface GameState {
  isStarted: boolean;
  currentRound: number;
  totalRounds: number;
  score: number;
  isGameComplete: boolean;
  gameMode: "fill_blank" | "yes_no_qa"; // 新增遊戲模式
}

interface SlotMachineGame {
  pattern: any;
  selectedWord?: Word;
  completedSentence: string;
  isCorrect: boolean;
  showAnswer: boolean;
  questionText?: string;
  gameMode: "fill_blank" | "yes_no_qa"; // 新增遊戲模式
}

function SentenceSlotGameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameState, setGameState] = useState<GameState>(initializeGameState());
  const [currentGame, setCurrentGame] = useState<SlotMachineGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  function initializeGameState(): GameState {
    return {
      isStarted: false,
      currentRound: 1,
      totalRounds: 10,
      score: 0,
      isGameComplete: false,
      gameMode: "fill_blank", // 預設為填空模式
    };
  }

  // 使用指定的遊戲資料開始新回合（避免依賴尚未更新的 state）
  const startNewRoundWithData = (data: GameData) => {
    if (!data) return;

    if (!data.patterns || data.patterns.length === 0) {
      setError("沒有可用的句型（patterns 為空）");
      return;
    }
    const randomPattern =
      data.patterns[Math.floor(Math.random() * data.patterns.length)];

    // 若有對應的處理器，使用處理器產生問句與答案；否則依賴詞庫
    const handler = patternHandlers[randomPattern.pattern_text as string];
    // API 已經過濾了主題和詞性，直接使用返回的單字
    const compatibleWords = data.words;
    const randomWord =
      compatibleWords[
        Math.floor(Math.random() * Math.max(1, compatibleWords.length))
      ];

    if (!handler && compatibleWords.length === 0) {
      setError("沒有找到適合的單字");
      return;
    }

    // 若有對應的處理器，使用處理器產生問句與答案；否則使用既有替換機制

    let questionText = randomPattern.pattern_text as string;
    let completedSentence = "";
    let selectedWord: Word | undefined = undefined;
    if (handler) {
      // 傳入 API 已經過濾好的單字（主題 + 詞性）
      const res = handler({
        patternText: randomPattern.pattern_text,
        words: compatibleWords as any, // ✅ API 已過濾主題和詞性
      });
      questionText = res.question;
      completedSentence = res.answer;
      if (res.selectedWord) selectedWord = res.selectedWord as any;
    } else {
      completedSentence = randomPattern.answer_pattern
        ? randomPattern.answer_pattern.pattern_text.replace(
            "_____",
            randomWord.english_singular
          )
        : randomPattern.pattern_text.replace(
            "_____",
            randomWord.english_singular
          );
      selectedWord = randomWord;
    }

    const newGame: SlotMachineGame = {
      pattern: randomPattern,
      selectedWord,
      completedSentence,
      isCorrect: selectedWord
        ? selectedWord.part_of_speech === "noun" ||
          selectedWord.part_of_speech === "adjective"
        : true,
      showAnswer: false,
      questionText,
      gameMode: "fill_blank", // 預設為填空模式
    };

    setCurrentGame(newGame);
    setGameState((prev) => ({
      ...prev,
      isStarted: true,
      currentRound: prev.currentRound,
    }));
  };

  // 從 URL 參數讀取遊戲設定並獲取遊戲資料
  useEffect(() => {
    const loadGameData = async () => {
      try {
        const grade = searchParams.get("grade");
        const patterns = searchParams.get("patterns");
        const themes = searchParams.get("themes");
        const nounSelection = searchParams.get("nounSelection");

        if (!grade || !patterns || !themes || !nounSelection) {
          setError("缺少必要的遊戲參數");
          setIsLoading(false);
          return;
        }

        // 構建請求資料
        const requestData = {
          grade_id: parseInt(grade),
          pattern_ids: patterns.split(",").map((id) => parseInt(id)),
          theme_ids: themes.split(",").map((themeParam) => {
            // 檢查是否已經是數字 ID
            const themeId = parseInt(themeParam);
            if (!isNaN(themeId)) {
              // 如果已經是數字 ID，直接使用
              return themeId;
            }

            // 如果是主題名稱，轉換為主題 ID
            const themeMap: { [key: string]: number } = {
              Emotions: 1,
              Colors: 2,
              Sports: 3,
              Stationery: 4,
              Fruits: 5,
              "Fast Food": 6,
              "Bakery & Snacks": 7,
              "Days of the Week": 8,
              Months: 9,
              "School Subjects": 10,
              Ailments: 11,
              Countries: 12,
              Furniture: 13,
              Toys: 14,
              Drinks: 15,
              "Main Dishes": 16,
              Identity: 18,
              Professions: 19,
              "Daily Actions": 20,
              Clothing: 21,
              "Buildings and Places": 22,
              Numbers: 23,
              "Time Expressions": 24, // 新增 Time Expressions 主題
            };
            return themeMap[themeParam] || 1; // 預設使用 Emotions 主題
          }),
          plural_form_option:
            nounSelection === "singular"
              ? "singular_only"
              : nounSelection === "plural"
              ? "plural_only"
              : "both_forms",
        };

        // 調試日誌
        console.log("URL 參數:", { grade, patterns, themes, nounSelection });
        console.log("請求資料:", requestData);

        // 優先使用 GET 以利快取
        const url = new URL(window.location.origin + "/api/game-data");
        url.searchParams.set("grade_id", String(requestData.grade_id));
        url.searchParams.set("pattern_ids", requestData.pattern_ids.join(","));
        url.searchParams.set("theme_ids", requestData.theme_ids.join(","));
        url.searchParams.set(
          "plural_form_option",
          requestData.plural_form_option
        );

        const response = await fetch(url.toString(), {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("獲取遊戲資料失敗");
        }

        const responseData = await response.json();
        console.log("🎯 API 響應資料:", responseData);

        if (responseData.success && responseData.data) {
          console.log("✅ 遊戲資料載入成功");
          console.log("📊 句型數量:", responseData.data.patterns?.length || 0);
          console.log("📊 單字數量:", responseData.data.words?.length || 0);
          console.log(
            "📊 單字詳情:",
            responseData.data.words?.slice(0, 5) || []
          );

          setGameData(responseData.data);
          // 立即使用取得的資料開始第一回合，避免 setState 延遲
          startNewRoundWithData(responseData.data);
        } else {
          console.log("❌ API 響應失敗:", responseData.error);
          throw new Error(responseData.error || "獲取遊戲資料失敗");
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "載入遊戲資料時發生錯誤");
        setIsLoading(false);
      }
    };

    loadGameData();
  }, [searchParams]);

  const startNewRound = () => {
    if (!gameData) return;

    // 隨機選擇一個句型
    if (!gameData.patterns || gameData.patterns.length === 0) {
      setError("沒有可用的句型（patterns 為空）");
      return;
    }
    const randomPattern =
      gameData.patterns[Math.floor(Math.random() * gameData.patterns.length)];

    // 若有對應的處理器，使用處理器產生問句與答案；否則依賴詞庫
    const handler = patternHandlers[randomPattern.pattern_text as string];
    const compatibleWords = gameData.words.filter(
      (word: Word) =>
        word.part_of_speech === "noun" || word.part_of_speech === "adjective"
    );
    const randomWord =
      compatibleWords[
        Math.floor(Math.random() * Math.max(1, compatibleWords.length))
      ];

    if (!handler && compatibleWords.length === 0) {
      setError("沒有找到適合的單字");
      return;
    }

    // 若有對應的處理器，使用處理器產生問句與答案；否則使用既有替換機制
    let questionText = randomPattern.pattern_text as string;
    let completedSentence = "";
    let selectedWord: Word | undefined = randomWord;
    if (handler) {
      const res = handler({
        patternText: randomPattern.pattern_text,
        words: gameData.words as any,
      });
      questionText = res.question;
      completedSentence = res.answer;
      if (res.selectedWord) selectedWord = res.selectedWord as any;
    } else {
      completedSentence = randomPattern.answer_pattern
        ? randomPattern.answer_pattern.pattern_text.replace(
            "_____",
            randomWord.english_singular
          )
        : randomPattern.pattern_text.replace(
            "_____",
            randomWord.english_singular
          );
    }

    const newGame: SlotMachineGame = {
      pattern: randomPattern,
      selectedWord,
      completedSentence,
      isCorrect:
        randomWord.part_of_speech === "noun" ||
        randomWord.part_of_speech === "adjective",
      showAnswer: false,
      questionText,
      gameMode: "fill_blank", // 預設為填空模式
    };

    setCurrentGame(newGame);
    setGameState((prev) => ({
      ...prev,
      isStarted: true,
      currentRound: prev.currentRound,
    }));
  };

  const handleSpin = () => {
    if (!gameData) return;

    // 每次拉霸都重新選擇句型和單字
    if (!gameData.patterns || gameData.patterns.length === 0) {
      setError("沒有可用的句型（patterns 為空）");
      return;
    }
    const randomPattern =
      gameData.patterns[Math.floor(Math.random() * gameData.patterns.length)];

    // 若有對應的處理器，使用處理器產生問句與答案；否則依賴詞庫
    const handler = patternHandlers[randomPattern.pattern_text as string];
    // API 已經過濾了主題和詞性，直接使用返回的單字
    const compatibleWords = gameData.words;
    const randomWord =
      compatibleWords[
        Math.floor(Math.random() * Math.max(1, compatibleWords.length))
      ];

    if (!handler && compatibleWords.length === 0) {
      setError("沒有找到適合的單字");
      return;
    }

    // 若有對應的處理器，使用處理器產生問句與答案；否則使用既有替換機制
    let questionText = randomPattern.pattern_text as string;
    let completedSentence = "";
    let selectedWord: Word | undefined = randomWord;
    if (handler) {
      // 傳入 API 已經過濾好的單字（主題 + 詞性）
      const res = handler({
        patternText: randomPattern.pattern_text,
        words: compatibleWords as any, // ✅ API 已過濾主題和詞性
      });
      questionText = res.question;
      completedSentence = res.answer;
      if (res.selectedWord) selectedWord = res.selectedWord as any;
    } else {
      completedSentence = randomPattern.answer_pattern
        ? randomPattern.answer_pattern.pattern_text.replace(
            "_____",
            randomWord.english_singular
          )
        : randomPattern.pattern_text.replace(
            "_____",
            randomWord.english_singular
          );
    }

    const newGame: SlotMachineGame = {
      pattern: randomPattern,
      selectedWord,
      completedSentence,
      isCorrect: selectedWord
        ? selectedWord.part_of_speech === "noun" ||
          selectedWord.part_of_speech === "adjective"
        : true,
      showAnswer: false,
      questionText,
      gameMode: "fill_blank", // 預設為填空模式
    };

    setCurrentGame(newGame);
    setShowAnswer(false);

    // 如果正確則加分
    if (newGame.isCorrect) {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 1,
      }));
    }
  };

  const handleRestartGame = () => {
    setGameState(initializeGameState());
    setCurrentGame(null);
    if (gameData) {
      startNewRoundWithData(gameData);
    }
  };

  const handleBackToSetup = () => {
    router.push("/aids/sentence-slot");
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-blue flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl text-white">載入遊戲中...</p>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen bg-primary-blue flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-4">
          <h2 className="text-2xl font-bold text-black mb-4">載入失敗</h2>
          <p className="text-lg text-black mb-6">{error}</p>
          <button
            onClick={handleBackToSetup}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回設定頁面
          </button>
        </div>
      </div>
    );
  }

  // 遊戲完成狀態
  if (gameState.isGameComplete) {
    return (
      <div className="min-h-screen bg-primary-blue">
        <div className="pt-8 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-black mb-4">遊戲完成！</h2>
              <p className="text-lg text-black mb-6">
                你的分數：{gameState.score} / {gameState.totalRounds}
              </p>
              <p className="text-lg text-black mb-6">
                正確率：
                {Math.round((gameState.score / gameState.totalRounds) * 100)}%
              </p>
              <div className="space-x-4">
                <button
                  onClick={handleRestartGame}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  重新開始
                </button>
                <button
                  onClick={handleBackToSetup}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  返回設定頁面
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 遊戲進行中狀態
  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">句型拉霸機</h1>
            <p className="text-xl text-black">練習句型，提升語言能力</p>
          </div>

          {/* 拉霸機顯示 */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <h2 className="text-2xl font-bold text-black mb-6">拉霸結果</h2>

            {/* 1. 選取的句子 */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <p className="text-lg text-black mb-2">選取的句型：</p>
              <p className="text-2xl font-bold text-blue-800">
                {currentGame?.questionText || currentGame?.pattern.pattern_text}
              </p>
            </div>

            {/* 2. 配對好的答案句子（可選擇顯示/隱藏） */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <p className="text-lg text-black mr-3">答案句子：</p>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="text-2xl hover:text-green-600 transition-colors"
                  title={showAnswer ? "隱藏答案" : "顯示答案"}
                >
                  {showAnswer ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {showAnswer && (
                <p className="text-2xl font-bold text-green-800">
                  {currentGame?.completedSentence}
                </p>
              )}
            </div>

            {/* 3. 選中的單字（若處理器未選字則不顯示） */}
            {currentGame?.selectedWord && (
              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <p className="text-lg text-black mb-2">選中的單字：</p>
                <p className="text-3xl font-bold text-black mb-2">
                  {currentGame?.selectedWord?.english_singular}
                </p>
                <p className="text-lg text-black">
                  {currentGame?.selectedWord?.chinese_meaning}
                </p>
              </div>
            )}

            {/* 拉霸按鈕 */}
            <div className="flex justify-center">
              <button
                onClick={handleSpin}
                className="bg-yellow-500 text-white px-12 py-4 rounded-lg hover:bg-yellow-600 transition-colors text-xl font-bold"
              >
                🎰 拉！
              </button>
            </div>
          </div>

          {/* 遊戲控制 */}
          <div className="text-center space-x-4">
            <button
              onClick={handleBackToSetup}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回設定頁面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SentenceSlotGamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SentenceSlotGameContent />
    </Suspense>
  );
}
