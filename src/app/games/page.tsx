"use client";

import { useState, useEffect } from "react";
import GameMethodCard from "@/components/GameMethodCard";
import { GameMethod } from "@/types";

export default function GamesPage() {
  const [games, setGames] = useState<GameMethod[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameMethod[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["all"]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // 直接從 D1 數據庫讀取遊戲方法數據
    const fetchGamesFromD1 = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // 使用 fetch 調用 games API 端點來獲取 D1 數據
        const response = await fetch("/api/games");
        const result = await response.json();

        if (result.success && result.data) {
          setGames(result.data);
        } else {
          console.warn("D1 數據庫返回空數據或錯誤:", result.message);
          setGames([]);
        }
      } catch (error) {
        console.error("Failed to fetch games from D1 database:", error);
        setHasError(true);
        setGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamesFromD1();
  }, []);

  useEffect(() => {
    // 篩選遊戲方法
    let filtered = games;

    if (!selectedCategories.includes("all")) {
      filtered = filtered.filter((game) =>
        game.categories.some((category) =>
          selectedCategories.includes(category)
        )
      );
    }

    if (!selectedGrades.includes("all")) {
      filtered = filtered.filter((game) => {
        // 檢查選中的年級是否適用於該遊戲
        return selectedGrades.some((grade) => {
          if (grade === "grade1") return game.grades.includes("grade1");
          if (grade === "grade2") return game.grades.includes("grade2");
          if (grade === "grade3") return game.grades.includes("grade3");
          if (grade === "grade4") return game.grades.includes("grade4");
          if (grade === "grade5") return game.grades.includes("grade5");
          if (grade === "grade6") return game.grades.includes("grade6");
          return false;
        });
      });
    }

    setFilteredGames(filtered);
  }, [games, selectedCategories, selectedGrades]);

  const categoryLabels = {
    all: "全部",
    vocabulary: "單字學習",
    sentence: "句型練習",
    oral: "口語訓練",
    teaching: "教學輔具",
    listening: "聽力練習",
    pronunciation: "發音練習",
    spelling: "拼寫練習",
  };

  const categories = [
    "all",
    ...Object.keys(categoryLabels).filter((key) => key !== "all"),
  ];

  const gradeLabels = {
    all: "全部",
    grade1: "1年級",
    grade2: "2年級",
    grade3: "3年級",
    grade4: "4年級",
    grade5: "5年級",
    grade6: "6年級",
  };

  const grades = [
    "all",
    ...Object.keys(gradeLabels).filter((key) => key !== "all"),
  ];

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSelectedCategories(["all"]);
    } else {
      setSelectedCategories((prev) => {
        if (prev.includes("all")) {
          return [category];
        } else if (prev.includes(category)) {
          const newCategories = prev.filter((c) => c !== category);
          return newCategories.length === 0 ? ["all"] : newCategories;
        } else {
          return [...prev, category];
        }
      });
    }
  };

  const handleGradeChange = (grade: string) => {
    if (grade === "all") {
      setSelectedGrades(["all"]);
    } else {
      setSelectedGrades((prev) => {
        if (prev.includes("all")) {
          return [grade];
        } else if (prev.includes(grade)) {
          const newGrades = prev.filter((g) => g !== grade);
          return newGrades.length === 0 ? ["all"] : newGrades;
        } else {
          return [...prev, grade];
        }
      });
    }
  };

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">遊戲庫</h1>
          <p className="text-xl text-black">
            探索各種英語學習遊戲方法，讓學習變得更有趣且有效！
          </p>
        </div>

        {/* 篩選器 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 分類篩選 */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                分類
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded"
                    />
                    <span className="text-sm text-black">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 年級篩選 */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                年級
              </label>
              <div className="space-y-2">
                {grades.map((grade) => (
                  <label key={grade} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGrades.includes(grade)}
                      onChange={() => handleGradeChange(grade)}
                      className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded"
                    />
                    <span className="text-sm text-black">
                      {gradeLabels[grade as keyof typeof gradeLabels]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 遊戲方法列表 */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">載入中...</h3>
            <p className="text-black">請稍候，正在加載遊戲方法。</p>
          </div>
        ) : hasError ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">載入失敗</h3>
            <p className="text-black">
              無法載入遊戲方法，請稍後再試或聯繫管理員。
            </p>
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => (
              <GameMethodCard key={game.id} game={game} />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">
              暫無遊戲方法
            </h3>
            <p className="text-black">
              目前資料庫中還沒有遊戲方法，請聯繫管理員添加內容。
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">
              沒有找到符合條件的遊戲方法
            </h3>
            <p className="text-black">請嘗試調整篩選條件</p>
          </div>
        )}

        {/* 統計資訊 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-black mb-4">統計資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-pink">
                {games.length}
              </div>
              <div className="text-sm text-black">總數量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {games.filter((g) => g.categories.includes("單字學習")).length}
              </div>
              <div className="text-sm text-black">單字學習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {games.filter((g) => g.categories.includes("句型練習")).length}
              </div>
              <div className="text-sm text-black">句型練習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {games.filter((g) => g.categories.includes("口語訓練")).length}
              </div>
              <div className="text-sm text-black">口語訓練</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {games.filter((g) => g.categories.includes("教學輔具")).length}
              </div>
              <div className="text-sm text-black">教學輔具</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {games.filter((g) => g.categories.includes("聽力練習")).length}
              </div>
              <div className="text-sm text-black">聽力練習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {games.filter((g) => g.categories.includes("發音練習")).length}
              </div>
              <div className="text-sm text-black">發音練習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {games.filter((g) => g.categories.includes("拼寫練習")).length}
              </div>
              <div className="text-sm text-black">拼寫練習</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
