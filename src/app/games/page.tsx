"use client";

import { useState, useEffect, useCallback } from "react";
import GameMethodCard from "@/components/GameMethodCard";
import { GameMethod } from "@/types";
import { gameAPI } from "@/lib/game-api";

export default function GamesPage() {
  const [games, setGames] = useState<GameMethod[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["all"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const ITEMS_PER_PAGE = 20;

  // 從本地 Cloudflare Worker 撈取資料
  const fetchGames = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setLoadingMore(true);

        // 使用本地 Cloudflare API 獲取遊戲方法
        let newGames: GameMethod[] = [];

        console.log("🔍 開始調用 gameAPI.getAllGames()...");

        if (
          selectedCategories.includes("all") &&
          selectedGrades.includes("all")
        ) {
          // 獲取所有遊戲方法
          console.log("📚 獲取所有遊戲方法...");
          newGames = await gameAPI.getAllGames();
          console.log("✅ 成功獲取遊戲資料:", newGames.length);
        } else {
          // 根據篩選條件獲取遊戲方法
          // 這裡可以根據需要實現更複雜的篩選邏輯
          console.log("🔍 根據篩選條件獲取遊戲方法...");
          newGames = await gameAPI.getAllGames();
          console.log("✅ 成功獲取篩選後的遊戲資料:", newGames.length);
        }

        console.log("Local API response:", { count: newGames.length, page });

        if (append) {
          // 追加模式：將新資料加到現有資料後面
          console.log("Appending mode:", {
            currentGamesCount: games.length,
            newGamesCount: newGames.length,
            page,
          });
          setGames((prev) => {
            const updated = [...prev, ...newGames];
            console.log("Updated games array:", {
              previousCount: prev.length,
              newCount: updated.length,
            });
            return updated;
          });
        } else {
          // 替換模式：完全替換現有資料
          console.log("Replace mode:", {
            newGamesCount: newGames.length,
            page,
          });
          setGames(newGames);
        }

        // 簡化分頁邏輯，本地 API 一次性返回所有資料
        setHasMore(false);
        setCurrentPage(page);

        // 調試日誌
        console.log(
          `Page ${page}: ${newGames.length} games loaded from local API`
        );
      } catch (err) {
        console.error("Failed to fetch games from local API:", err);
        setError(err instanceof Error ? err.message : "未知錯誤");

        // 如果撈取失敗，設定空陣列避免網頁崩潰
        if (!append) {
          setGames([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategories, selectedGrades, games.length]
  );

  // 初始載入
  useEffect(() => {
    fetchGames(1, false);
  }, []); // 只在組件掛載時執行一次

  // 篩選條件改變時重新載入
  useEffect(() => {
    if (games.length > 0) {
      setCurrentPage(1);
      fetchGames(1, false);
    }
  }, [selectedCategories, selectedGrades, fetchGames]); // 添加 fetchGames 依賴

  // 載入更多資料
  const loadMore = () => {
    console.log("loadMore called:", {
      loadingMore,
      hasMore,
      currentPage,
      currentGamesCount: games.length,
    });

    if (!loadingMore && hasMore) {
      console.log("Fetching next page:", currentPage + 1);
      fetchGames(currentPage + 1, true);
    } else {
      console.log("Cannot load more:", {
        loadingMore,
        hasMore,
        reason: loadingMore ? "Currently loading" : "No more data",
      });
    }
  };

  // 篩選遊戲方法（前端篩選，用於即時響應）
  useEffect(() => {
    console.log("Filtering effect triggered:", {
      gamesLength: games.length,
      selectedCategories,
      selectedGrades,
    });

    let filtered = games;

    if (!selectedCategories.includes("all")) {
      filtered = filtered.filter((game) =>
        game.categories.some((category) =>
          selectedCategories.some((selectedCategory) => {
            const categoryMapping: { [key: string]: string } = {
              vocabulary: "單字學習",
              sentence: "句型練習",
              oral: "口語訓練",
              teaching: "教學輔具",
              listening: "聽力練習",
              pronunciation: "發音練習",
              spelling: "拼寫練習",
            };
            return category === categoryMapping[selectedCategory];
          })
        )
      );
    }

    if (!selectedGrades.includes("all")) {
      filtered = filtered.filter((game) => {
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

    console.log("Filtering result:", {
      totalGames: games.length,
      filteredCount: filtered.length,
      selectedCategories,
      selectedGrades,
    });

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

  // 載入中狀態
  if (loading && games.length === 0) {
    return (
      <div className="min-h-screen py-8 bg-primary-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-pink mx-auto mb-4"></div>
            <p className="text-black">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error && games.length === 0) {
    return (
      <div className="min-h-screen py-8 bg-primary-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">載入失敗</h3>
            <p className="text-black mb-4">{error}</p>
            <button
              onClick={() => fetchGames(1, false)}
              className="px-4 py-2 bg-secondary-pink text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                      className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded appearance-none checked:appearance-auto"
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
                      className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded appearance-none checked:appearance-auto"
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
        {filteredGames.length === 0 ? (
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
            <p className="text-black">目前沒有符合篩選條件的遊戲方法。</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGames.map((game) => (
                <GameMethodCard key={game.id} game={game} />
              ))}
            </div>

            {/* 載入更多按鈕 */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-white text-secondary-pink border border-secondary-pink rounded-lg hover:bg-secondary-pink hover:text-secondary-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      載入中...
                    </span>
                  ) : (
                    "載入更多"
                  )}
                </button>

                {/* 調試資訊 */}
                <div className="mt-2 text-sm text-gray-500">
                  當前頁面: {currentPage} | 已載入: {games.length} 筆 |
                  還有更多: {hasMore ? "是" : "否"}
                </div>
              </div>
            )}

            {/* 如果沒有更多資料，顯示提示 */}
            {!hasMore && games.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                已載入所有資料 ({games.length} 筆)
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
