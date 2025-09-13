/**
 * @fileoverview 遊戲庫頁面 - 顯示所有遊戲方法，支援篩選和分頁
 * @modified 2024-09-13 XX:XX - 修復載入問題
 * @modified_by Assistant
 * @modification_type bugfix
 * @status locked
 * @last_commit 2024-09-13 XX:XX
 * @feature 遊戲庫設定已完成並鎖定保護
 * @protection_reason 遊戲庫功能已完成，防止意外修改
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import GameMethodCard from "@/components/GameMethodCard";
import { GameMethod } from "@/types";

console.log("🎮 GamesPage 組件載入");

export default function GamesPage() {
  const [games, setGames] = useState<GameMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["all"]);
  const [filteredGames, setFilteredGames] = useState<GameMethod[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  console.log("🎮 GamesPage 渲染，loading:", loading, "games:", games.length);

  const ITEMS_PER_PAGE = 20;

  // 從 API 路由撈取 mock 資料
  const fetchGames = useCallback(
    async (page: number = 1, append: boolean = false) => {
      console.log("🚀 fetchGames 開始執行");
      setLoadingMore(true);

      try {
        // 使用 Next.js API 路由獲取遊戲方法
        const response = await fetch("/api/games");
        const data = await response.json();

        let newGames: GameMethod[] = [];

        if (data.success) {
          // 轉換 API 數據格式以符合 GameMethod 類型
          newGames = data.data.map((game: any) => ({
            id: game.id,
            title: game.title,
            description: game.description,
            category: game.category || "",
            categories: game.categories
              ? typeof game.categories === "string"
                ? JSON.parse(game.categories)
                : game.categories
              : [],
            grades: [], // 保持向後兼容
            grade1: game.grade1 === 1,
            grade2: game.grade2 === 1,
            grade3: game.grade3 === 1,
            grade4: game.grade4 === 1,
            grade5: game.grade5 === 1,
            grade6: game.grade6 === 1,
            materials: game.materials
              ? typeof game.materials === "string"
                ? JSON.parse(game.materials)
                : game.materials
              : [],
            instructions: game.instructions
              ? typeof game.instructions === "string"
                ? JSON.parse(game.instructions)
                : game.instructions
              : [],
            steps: game.steps || "",
            tips: game.tips || "",
            is_published: game.is_published || true,
            createdAt: new Date(game.created_at),
            updatedAt: new Date(game.updated_at),
          }));
          console.log("✅ 成功獲取遊戲資料:", newGames.length);
        } else {
          console.error("API 回應失敗:", data.error);
          throw new Error(data.error || "獲取遊戲資料失敗");
        }

        console.log("API response:", { count: newGames.length, page });

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

        // 簡化分頁邏輯，API 一次性返回所有資料
        setHasMore(false);
        setCurrentPage(page);

        // 調試日誌
        console.log(`Page ${page}: ${newGames.length} games loaded from API`);
      } catch (err) {
        console.error("❌ Failed to fetch games from API:", err);
        setError(err instanceof Error ? err.message : "未知錯誤");

        // 如果撈取失敗，設定空陣列避免網頁崩潰
        if (!append) {
          setGames([]);
        }
      } finally {
        console.log("🏁 fetchGames 完成，設定 loading 為 false");
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [] // 移除依賴，避免無限重新渲染
  );

  // 初始載入
  useEffect(() => {
    console.log("🎯 useEffect 執行，開始載入遊戲");
    console.log("🎯 fetchGames 函數:", typeof fetchGames);
    fetchGames(1, false);
  }, [fetchGames]); // 依賴 fetchGames 函數

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
          if (grade === "grade1") return game.grade1;
          if (grade === "grade2") return game.grade2;
          if (grade === "grade3") return game.grade3;
          if (grade === "grade4") return game.grade4;
          if (grade === "grade5") return game.grade5;
          if (grade === "grade6") return game.grade6;
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
