"use client";

import { useState, useEffect } from "react";
import GameMethodCard from "@/components/GameMethodCard";
import { GameMethod } from "@/types";
import { generateId } from "@/lib/utils";

// 範例遊戲方法
const sampleGames: GameMethod[] = [
  {
    id: generateId(),
    title: "單字配對遊戲",
    description:
      "透過配對卡片的方式，讓學生學習英語單字，提升記憶力和理解能力。",
    category: "單字學習",
    grade: "grade1",
    materials: ["單字卡片", "計時器"],
    instructions: [
      "準備多組單字卡片，每組包含英文單字和對應的中文意思",
      "將卡片打亂，背面朝上排列",
      "學生輪流翻開兩張卡片，如果配對成功則保留，失敗則翻回",
      "遊戲結束時，配對成功最多的學生獲勝",
    ],
    createdAt: new Date("2024-01-15T09:00:00"),
    updatedAt: new Date("2024-01-15T09:00:00"),
  },
  {
    id: generateId(),
    title: "句型接龍",
    description: "學生輪流說出符合特定句型的句子，訓練口語表達和語法運用能力。",
    category: "句型練習",
    grade: "grade2",
    materials: ["句型提示卡", "計分板"],
    instructions: [
      "教師提供一個句型模板，例如：I like to...",
      "學生輪流完成句子，如：I like to read books",
      "每個學生說完後，下一個學生必須說出不同的內容",
      "無法完成或重複內容的學生扣分",
    ],
    createdAt: new Date("2024-01-12T14:30:00"),
    updatedAt: new Date("2024-01-12T14:30:00"),
  },
  {
    id: generateId(),
    title: "角色扮演對話",
    description: "學生扮演不同角色進行英語對話，練習日常用語和情境表達。",
    category: "口語訓練",
    grade: "grade3",
    materials: ["角色卡片", "情境設定"],
    instructions: [
      "教師設定對話情境，如：在餐廳點餐",
      "分配角色給學生，如：服務生、顧客",
      "學生根據角色進行英語對話",
      "鼓勵學生使用學過的單字和句型",
    ],
    createdAt: new Date("2024-01-10T11:15:00"),
    updatedAt: new Date("2024-01-10T11:15:00"),
  },
];

export default function GamesPage() {
  const [games, setGames] = useState<GameMethod[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameMethod[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  useEffect(() => {
    // 從本地儲存讀取遊戲方法，如果沒有則使用範例數據
    const savedGames = localStorage.getItem("gameMethods");
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    } else {
      setGames(sampleGames);
      localStorage.setItem("gameMethods", JSON.stringify(sampleGames));
    }
  }, []);

  useEffect(() => {
    // 篩選遊戲方法
    let filtered = games;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((game) => game.category === selectedCategory);
    }

    if (selectedGrade !== "all") {
      filtered = filtered.filter((game) => game.grade === selectedGrade);
    }

    setFilteredGames(filtered);
  }, [games, selectedCategory, selectedGrade]);

  const categories = [
    "all",
    ...Array.from(new Set(games.map((game) => game.category))),
  ];
  const grades = [
    "all",
    "grade1",
    "grade2",
    "grade3",
    "grade4",
    "grade5",
    "grade6",
  ];

  const categoryLabels = {
    all: "全部",
    單字學習: "單字學習",
    句型練習: "句型練習",
    口語訓練: "口語訓練",
  };

  const gradeLabels = {
    all: "全部",
    grade1: "1年級",
    grade2: "2年級",
    grade3: "3年級",
    grade4: "4年級",
    grade5: "5年級",
    grade6: "6年級",
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">遊戲方法</h1>
          <p className="text-xl text-gray-600">
            豐富的英語學習遊戲，讓課堂更加生動有趣
          </p>
        </div>

        {/* 篩選器 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 分類篩選 */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                分類
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </option>
                ))}
              </select>
            </div>

            {/* 年級篩選 */}
            <div>
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                年級
              </label>
              <select
                id="grade"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {gradeLabels[grade as keyof typeof gradeLabels]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 遊戲方法列表 */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => (
              <GameMethodCard key={game.id} game={game} />
            ))}
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
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              沒有找到符合條件的遊戲方法
            </h3>
            <p className="text-gray-500">請嘗試調整篩選條件</p>
          </div>
        )}

        {/* 統計資訊 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">統計資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {games.length}
              </div>
              <div className="text-sm text-gray-600">總遊戲數量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {games.filter((g) => g.grade === "grade1").length}
              </div>
              <div className="text-sm text-gray-600">1年級遊戲</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {games.filter((g) => g.grade === "grade2").length}
              </div>
              <div className="text-sm text-gray-600">2年級遊戲</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {games.filter((g) => g.grade === "grade3").length}
              </div>
              <div className="text-sm text-gray-600">3年級遊戲</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {games.filter((g) => g.grade === "grade4").length}
              </div>
              <div className="text-sm text-gray-600">4年級遊戲</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {games.filter((g) => g.grade === "grade5").length}
              </div>
              <div className="text-sm text-gray-600">5年級遊戲</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {games.filter((g) => g.grade === "grade6").length}
              </div>
              <div className="text-sm text-gray-600">6年級遊戲</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
