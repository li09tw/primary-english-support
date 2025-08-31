/**
 * @fileoverview Garden 管理介面 - 管理遊戲方法和管理員消息
 * @modified 2024-01-XX XX:XX - 修復遊戲方法數量顯示問題
 * @modified_by Assistant
 * @modification_type bugfix
 * @status completed
 * @feature 從 Cloudflare Worker API 獲取數據，修復數量顯示
 */

"use client";

import { useState, useEffect } from "react";
import { GameMethod, AdminMessage } from "@/types";
import { generateId, saveGameMethods, saveAdminMessages } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { gameAPI, adminMessageAPI } from "@/lib/game-api";

export default function GardenPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"games" | "messages">("games");
  const [games, setGames] = useState<GameMethod[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // 調試信息
  console.log("GardenPage render:", { games, messages });

  // 安全的日期格式化函數
  const safeFormatDate = (date: any): string => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString();
    }
    return new Date().toLocaleDateString();
  };

  // 數據驗證函數
  const validateGameData = (game: any): GameMethod => {
    return {
      id: game.id || generateId(),
      title: game.title || "",
      description: game.description || "",
      category: game.category || game.categories?.[0] || "",
      categories: Array.isArray(game.categories) ? game.categories : [],
      grades: Array.isArray(game.grades) ? game.grades : [],
      materials: Array.isArray(game.materials) ? game.materials : [],
      instructions: Array.isArray(game.instructions) ? game.instructions : [],
      steps: game.steps || game.instructions?.join("\n") || "",
      tips: game.tips || "",
      is_published: game.is_published !== undefined ? game.is_published : true,
      createdAt: game.createdAt ? new Date(game.createdAt) : new Date(),
      updatedAt: game.updatedAt ? new Date(game.updatedAt) : new Date(),
    };
  };

  // 管理員消息數據驗證函數
  const validateMessageData = (message: any): AdminMessage => {
    return {
      id: message.id || generateId(),
      title: message.title || "",
      content: message.content || "",
      is_published:
        message.is_published !== undefined ? message.is_published : true,
      createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
    };
  };

  // 表單狀態
  const [gameForm, setGameForm] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    grades: [] as string[],
    materials: [""],
    instructions: [""],
  });

  const [messageForm, setMessageForm] = useState({
    title: "",
    content: "",
  });

  // 載入遊戲方法數據
  const loadGames = async () => {
    try {
      setLoading(true);
      console.log("🔍 開始載入遊戲方法數據...");

      // 調試：檢查環境變數
      console.log("🔧 環境變數檢查:", {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: process.env
          .NEXT_PUBLIC_CLOUDFLARE_WORKER_URL
          ? "SET"
          : "NOT SET",
        CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL
          ? "SET"
          : "NOT SET",
      });

      let fetchedGames: GameMethod[] = [];

      // 方法1：嘗試直接從 Cloudflare Worker 獲取數據（如果環境變數設置了）
      if (process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL) {
        try {
          console.log("🚀 嘗試直接從 Cloudflare Worker 獲取數據...");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}/query`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-API-Key":
                  process.env.NEXT_PUBLIC_CLOUDFLARE_API_SECRET || "",
              },
              body: JSON.stringify({
                query: "SELECT * FROM game_methods ORDER BY created_at DESC",
                params: [],
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.results) {
              fetchedGames = data.results;
              console.log("✅ 直接從 Worker 獲取成功:", fetchedGames.length);
            }
          }
        } catch (directError) {
          console.log("⚠️ 直接調用失敗，使用 API 路由:", directError);
        }
      }

      // 方法2：如果直接調用失敗，使用 gameAPI
      if (fetchedGames.length === 0) {
        console.log("🔗 使用 gameAPI 獲取數據...");
        fetchedGames = await gameAPI.getAllGames();
        console.log("✅ 通過 gameAPI 獲取遊戲方法:", fetchedGames.length);
      }

      // 驗證和轉換數據
      const validatedGames = fetchedGames.map(validateGameData);
      setGames(validatedGames);

      // 同時保存到 localStorage 作為備份
      saveGameMethods(validatedGames);
    } catch (error) {
      console.error("❌ 載入遊戲方法失敗:", error);

      // 如果 API 失敗，嘗試從 localStorage 載入備份數據
      const savedGames = localStorage.getItem("gameMethods");
      if (savedGames) {
        try {
          const parsedGames = JSON.parse(savedGames);
          const validatedGames = parsedGames.map(validateGameData);
          setGames(validatedGames);
          console.log(
            "📦 從 localStorage 載入備份數據:",
            validatedGames.length
          );
        } catch (localError) {
          console.error("❌ localStorage 數據解析失敗:", localError);
          setGames([]);
        }
      } else {
        setGames([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 載入管理員消息數據
  const loadMessages = async () => {
    try {
      console.log("🔍 開始載入管理員消息數據...");

      // 使用 Cloudflare Worker API 獲取管理員消息
      const fetchedMessages = await adminMessageAPI.getAllMessages();
      console.log("✅ 成功獲取管理員消息:", fetchedMessages.length);

      // 驗證數據
      const validatedMessages = fetchedMessages.map(validateMessageData);
      setMessages(validatedMessages);

      // 同時保存到 localStorage 作為備份
      saveAdminMessages(validatedMessages);
    } catch (error) {
      console.error("❌ 載入管理員消息失敗:", error);

      // 如果 API 失敗，嘗試從 localStorage 載入備份數據
      const savedMessages = localStorage.getItem("adminMessages");
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          const validatedMessages = parsedMessages.map(validateMessageData);
          setMessages(validatedMessages);
          console.log(
            "📦 從 localStorage 載入備份數據:",
            validatedMessages.length
          );
        } catch (localError) {
          console.error("❌ localStorage 數據解析失敗:", localError);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    }
  };

  useEffect(() => {
    // 載入數據
    loadGames();
    loadMessages();
  }, []);

  // 遊戲方法相關函數
  const addGame = async () => {
    if (!gameForm.title.trim() || !gameForm.description.trim()) {
      alert("請填寫標題和描述");
      return;
    }

    try {
      const newGame: GameMethod = {
        id: generateId(),
        title: gameForm.title.trim(),
        description: gameForm.description.trim(),
        category: gameForm.categories.filter(Boolean)[0] || "",
        categories: gameForm.categories.filter(Boolean),
        grades: gameForm.grades.filter(Boolean),
        materials: gameForm.materials.filter(Boolean),
        instructions: gameForm.instructions.filter(Boolean),
        steps: gameForm.instructions.filter(Boolean).join("\n"),
        tips: "",
        is_published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // 調用 API 保存到遠端資料庫
      const success = await gameAPI.createGame(newGame);

      if (success) {
        // 成功推送到遠端後，添加到本地狀態
        setGames((prev) => [newGame, ...prev]);
        alert("遊戲方法新增成功！已推送到遠端資料庫");
      } else {
        alert("新增失敗，無法推送到遠端資料庫");
        return;
      }

      // 重置表單
      setGameForm({
        title: "",
        description: "",
        categories: [],
        grades: [],
        materials: [""],
        instructions: [""],
      });

      alert("遊戲方法新增成功！");
    } catch (error) {
      console.error("新增遊戲方法失敗:", error);
      alert("新增失敗，請重試");
    }
  };

  const deleteGame = async (id: string) => {
    if (confirm("確定要刪除這個遊戲方法嗎？")) {
      try {
        // 調用 API 從遠端資料庫刪除
        const success = await gameAPI.deleteGame(id);

        if (success) {
          // 成功從遠端刪除後，從本地狀態移除
          setGames((prev) => prev.filter((game) => game.id !== id));
          alert("刪除成功！已從遠端資料庫移除");
        } else {
          alert("刪除失敗，無法從遠端資料庫移除");
          return;
        }
      } catch (error) {
        console.error("刪除遊戲方法失敗:", error);
        alert("刪除失敗，請重試");
      }
    }
  };

  // 管理員消息相關函數
  const addMessage = async () => {
    if (!messageForm.title.trim() || !messageForm.content.trim()) {
      alert("請填寫標題和內容");
      return;
    }

    try {
      const newMessage: AdminMessage = {
        id: generateId(),
        title: messageForm.title.trim(),
        content: messageForm.content.trim(),
        is_published: true,
        createdAt: new Date(),
      };

      // 調用 API 保存到遠端資料庫
      console.log("🔍 開始調用 adminMessageAPI.createMessage...");
      const success = await adminMessageAPI.createMessage(newMessage);
      console.log("📊 createMessage 結果:", success);

      if (success) {
        // 成功推送到遠端後，添加到本地狀態
        setMessages((prev) => [newMessage, ...prev]);
        alert("管理員消息新增成功！已推送到遠端資料庫");
      } else {
        console.error("❌ 新增管理員消息失敗");
        alert("新增失敗，無法推送到遠端資料庫。請檢查瀏覽器控制台的錯誤信息。");
        return;
      }

      // 重置表單
      setMessageForm({
        title: "",
        content: "",
      });

      alert("管理員消息新增成功！");
    } catch (error) {
      console.error("新增管理員消息失敗:", error);
      alert("新增失敗，請重試");
    }
  };

  const deleteMessage = async (id: string) => {
    if (confirm("確定要刪除這個管理員消息嗎？")) {
      try {
        // 調用 API 從遠端資料庫刪除
        const success = await adminMessageAPI.deleteMessage(id);

        if (success) {
          // 成功從遠端刪除後，從本地狀態移除
          setMessages((prev) => prev.filter((message) => message.id !== id));
          alert("刪除成功！已從遠端資料庫移除");
        } else {
          alert("刪除失敗，無法從遠端資料庫移除");
          return;
        }
      } catch (error) {
        console.error("刪除管理員消息失敗:", error);
        alert("刪除失敗，請重試");
      }
    }
  };

  // 分類選項
  const categoryOptions = [
    "單字學習",
    "句型練習",
    "口語訓練",
    "聽力練習",
    "閱讀練習",
    "寫作練習",
    "發音練習",
    "拼寫練習",
    "教學輔具",
  ];

  const gradeOptions = [
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
    聽力練習: "聽力練習",
    閱讀練習: "閱讀練習",
    寫作練習: "寫作練習",
    發音練習: "發音練習",
    拼寫練習: "拼寫練習",
    教學輔具: "教學輔具",
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

  const handleCategoryChange = (category: string) => {
    // This function was removed, so this effect is no longer relevant
  };

  const handleGradeChange = (grade: string) => {
    // This function was removed, so this effect is no longer relevant
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
  if (/* error && games.length === 0 */ false) {
    // error state was removed, so this block is no longer relevant
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
            <p className="text-black mb-4">{/* error */}</p>
            <button
              onClick={() => {
                // setError(null); // error state was removed
                loadGames();
                loadMessages();
              }}
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
          <h1 className="text-4xl font-bold text-black mb-4">管理介面</h1>
          <p className="text-xl text-black">管理遊戲方法、教學輔具和站長消息</p>
        </div>

        {/* 統計資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-2">遊戲方法</h3>
            <p className="text-3xl font-bold text-secondary-pink">
              {games.length}
            </p>
            <p className="text-sm text-gray-500">總數量</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-2">
              管理員消息
            </h3>
            <p className="text-3xl font-bold text-secondary-pink">
              {messages.length}
            </p>
            <p className="text-sm text-gray-500">總數量</p>
          </div>
        </div>

        {/* 導航標籤 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4">
            {[
              { id: "games", name: "遊戲方法", count: games.length },
              { id: "messages", name: "管理員消息", count: messages.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "games" | "messages")}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-secondary-pink text-black"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* 內容區域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：表單 */}
          <div>
            {activeTab === "games" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-black mb-4">
                  新增遊戲方法
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      標題 *
                    </label>
                    <input
                      type="text"
                      value={gameForm.title}
                      onChange={(e) =>
                        setGameForm({ ...gameForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
                      placeholder="遊戲方法標題"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      描述 *
                    </label>
                    <textarea
                      value={gameForm.description}
                      onChange={(e) =>
                        setGameForm({
                          ...gameForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent resize-vertical"
                      placeholder="遊戲方法描述"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      分類
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryOptions.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={gameForm.categories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGameForm({
                                  ...gameForm,
                                  categories: [
                                    ...gameForm.categories,
                                    category,
                                  ],
                                });
                              } else {
                                setGameForm({
                                  ...gameForm,
                                  categories: gameForm.categories.filter(
                                    (c) => c !== category
                                  ),
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-black">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      適用年級
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {gradeOptions.map((grade) => (
                        <label key={grade} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={gameForm.grades.includes(grade)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGameForm({
                                  ...gameForm,
                                  grades: [...gameForm.grades, grade],
                                });
                              } else {
                                setGameForm({
                                  ...gameForm,
                                  grades: gameForm.grades.filter(
                                    (g) => g !== grade
                                  ),
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-black">
                            {gradeLabels[grade as keyof typeof gradeLabels]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      所需材料
                    </label>
                    {gameForm.materials.map((material, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={material}
                          onChange={(e) => {
                            const newMaterials = [...gameForm.materials];
                            newMaterials[index] = e.target.value;
                            setGameForm({
                              ...gameForm,
                              materials: newMaterials,
                            });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
                          placeholder="材料名稱"
                        />
                        {gameForm.materials.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newMaterials = gameForm.materials.filter(
                                (_, i) => i !== index
                              );
                              setGameForm({
                                ...gameForm,
                                materials: newMaterials,
                              });
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            刪除
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setGameForm({
                          ...gameForm,
                          materials: [...gameForm.materials, ""],
                        })
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      新增材料
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      遊戲說明
                    </label>
                    {gameForm.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <textarea
                          value={instruction}
                          onChange={(e) => {
                            const newInstructions = [...gameForm.instructions];
                            newInstructions[index] = e.target.value;
                            setGameForm({
                              ...gameForm,
                              instructions: newInstructions,
                            });
                          }}
                          rows={2}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent resize-vertical"
                          placeholder="遊戲步驟說明"
                        />
                        {gameForm.instructions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newInstructions =
                                gameForm.instructions.filter(
                                  (_, i) => i !== index
                                );
                              setGameForm({
                                ...gameForm,
                                instructions: newInstructions,
                              });
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            刪除
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setGameForm({
                          ...gameForm,
                          instructions: [...gameForm.instructions, ""],
                        })
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      新增說明
                    </button>
                  </div>

                  <button
                    onClick={addGame}
                    className="w-full bg-secondary-pink hover:bg-white hover:text-primary-blue-dark text-black font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:ring-offset-2 transition-colors duration-200 border-2 border-transparent hover:border-primary-blue-dark"
                  >
                    新增遊戲方法
                  </button>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-black mb-4">
                  新增管理員消息
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      標題 *
                    </label>
                    <input
                      type="text"
                      value={messageForm.title}
                      onChange={(e) =>
                        setMessageForm({
                          ...messageForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
                      placeholder="消息標題"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      內容 *
                    </label>
                    <textarea
                      value={messageForm.content}
                      onChange={(e) =>
                        setMessageForm({
                          ...messageForm,
                          content: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent resize-vertical"
                      placeholder="消息內容"
                    />
                  </div>

                  <button
                    onClick={addMessage}
                    className="w-full bg-secondary-pink hover:bg-white hover:text-primary-blue-dark text-black font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:ring-offset-2 transition-colors duration-200 border-2 border-transparent hover:border-primary-blue-dark"
                  >
                    新增消息
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 右側：列表和篩選器 */}
          <div>
            {activeTab === "games" && (
              <>
                {/* 篩選器 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 分類篩選 */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        分類
                      </label>
                      <div className="space-y-2">
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                /* selectedCategories.includes(key) */ false
                              } // selectedCategories state was removed
                              onChange={() => handleCategoryChange(key)}
                              className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded appearance-none checked:appearance-auto"
                            />
                            <span className="text-sm text-black">{label}</span>
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
                        {Object.entries(gradeLabels).map(([key, label]) => (
                          <label key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={/* selectedGrades.includes(key) */ false} // selectedGrades state was removed
                              onChange={() => handleGradeChange(key)}
                              className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded appearance-none checked:appearance-auto"
                            />
                            <span className="text-sm text-black">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 遊戲方法列表 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    遊戲方法列表
                  </h3>
                  <div className="space-y-4">
                    {games.length === 0 ? (
                      <p className="text-gray-500">暫無遊戲方法</p>
                    ) : (
                      games.map((game) => (
                        <div
                          key={game.id}
                          className="border border-gray-200 rounded-lg p-4 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-medium text-black">
                              {game.title}
                            </h4>
                            <button
                              onClick={() => deleteGame(game.id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                            >
                              刪除
                            </button>
                          </div>
                          <p className="text-gray-600">{game.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {game.categories.map((category) => (
                              <span
                                key={category}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {game.grades.map((grade) => (
                              <span
                                key={grade}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                              >
                                {gradeLabels[
                                  grade as keyof typeof gradeLabels
                                ] || grade}
                              </span>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            創建時間: {game.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 載入更多按鈕 */}
                  {/* hasMore && ( // hasMore state was removed
                    <div className="text-center mt-6">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="px-6 py-3 bg-white text-secondary-pink border border-secondary-pink rounded-lg hover:bg-secondary-pink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary-pink mr-2"></div>
                            載入中...
                          </span>
                        ) : (
                          "載入更多"
                        )}
                      </button>
                    </div>
                  ) */}
                </div>
              </>
            )}

            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-black mb-4">
                  管理員消息列表
                </h3>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-500">暫無管理員消息</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className="border border-gray-200 rounded-lg p-4 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-medium text-black">
                            {message.title}
                          </h4>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                          >
                            刪除
                          </button>
                        </div>
                        <p className="text-gray-600">{message.content}</p>
                        <div className="text-sm text-gray-500">
                          創建時間: {message.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
