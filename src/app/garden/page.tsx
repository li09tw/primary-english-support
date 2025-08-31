"use client";

import { useState, useEffect } from "react";
import { GameMethod, AdminMessage } from "@/types";
import { generateId, saveGameMethods, saveAdminMessages } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { gameAPI, adminMessageAPI } from "@/lib/game-api";

// 注意：由於這是 client component，metadata 需要在 layout 或 parent 中定義

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

  // 數據清理函數：修復任何格式不正確的數據
  const cleanupData = () => {
    try {
      // 清理遊戲方法數據
      if (games.length > 0) {
        const cleanedGames = games.map(validateGameData);
        setGames(cleanedGames);
        saveGameMethods(cleanedGames);
      }

      // 清理管理員消息數據
      if (messages.length > 0) {
        const cleanedMessages = messages.map(validateMessageData);
        setMessages(cleanedMessages);
        saveAdminMessages(cleanedMessages);
      }
    } catch (error) {
      console.error("Error cleaning up data:", error);
    }
  };

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
  const addGame = () => {
    if (!gameForm.title.trim() || !gameForm.description.trim()) {
      alert("請填寫標題和描述");
      return;
    }

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

    const updatedGames = [...games, newGame];
    setGames(updatedGames);
    saveGameMethods(updatedGames);

    // 重置表單
    setGameForm({
      title: "",
      description: "",
      categories: [],
      grades: [],
      materials: [""],
      instructions: [""],
    });
  };

  const deleteGame = (id: string) => {
    if (confirm("確定要刪除這個遊戲方法嗎？")) {
      const updatedGames = games.filter((game) => game.id !== id);
      setGames(updatedGames);
      saveGameMethods(updatedGames);
    }
  };

  // 管理員消息相關函數
  const addMessage = () => {
    if (!messageForm.title.trim() || !messageForm.content.trim()) {
      alert("請填寫標題和內容");
      return;
    }

    const newMessage: AdminMessage = {
      id: generateId(),
      title: messageForm.title.trim(),
      content: messageForm.content.trim(),
      is_published: true,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveAdminMessages(updatedMessages);

    // 重置表單
    setMessageForm({
      title: "",
      content: "",
    });
  };

  const deleteMessage = (id: string) => {
    if (confirm("確定要刪除這個管理員消息嗎？")) {
      const updatedMessages = messages.filter((message) => message.id !== id);
      setMessages(updatedMessages);
      saveAdminMessages(updatedMessages);
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

  // 渲染函數
  const renderGameForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-black mb-4">新增遊戲方法</h3>
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
              setGameForm({ ...gameForm, description: e.target.value })
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
                        categories: [...gameForm.categories, category],
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
                        grades: gameForm.grades.filter((g) => g !== grade),
                      });
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-black">{grade}</span>
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
                  setGameForm({ ...gameForm, materials: newMaterials });
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
                    setGameForm({ ...gameForm, materials: newMaterials });
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
                  setGameForm({ ...gameForm, instructions: newInstructions });
                }}
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent resize-vertical"
                placeholder="遊戲步驟說明"
              />
              {gameForm.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newInstructions = gameForm.instructions.filter(
                      (_, i) => i !== index
                    );
                    setGameForm({ ...gameForm, instructions: newInstructions });
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
  );

  const renderMessageForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-black mb-4">新增管理員消息</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            標題 *
          </label>
          <input
            type="text"
            value={messageForm.title}
            onChange={(e) =>
              setMessageForm({ ...messageForm, title: e.target.value })
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
              setMessageForm({ ...messageForm, content: e.target.value })
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
  );

  const renderGameList = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-black mb-4">遊戲方法列表</h3>
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">載入中...</p>
        ) : games.length === 0 ? (
          <p className="text-gray-500">暫無遊戲方法</p>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              className="border border-gray-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-medium text-black">{game.title}</h4>
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
                    {grade}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                創建時間: {safeFormatDate(game.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderMessageList = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-black mb-4">管理員消息列表</h3>
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500">載入中...</p>
        ) : messages.length === 0 ? (
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
                創建時間: {safeFormatDate(message.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">管理介面</h1>
          <p className="text-lg text-gray-600">
            管理遊戲方法、教學輔具和站長消息
          </p>
        </div>

        {/* 統計資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-2">遊戲方法</h3>
            <p className="text-3xl font-bold text-secondary-pink">
              {loading ? "載入中..." : games.length}
            </p>
            <p className="text-sm text-gray-500">總數量</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-black mb-2">
              管理員消息
            </h3>
            <p className="text-3xl font-bold text-secondary-pink">
              {loading ? "載入中..." : messages.length}
            </p>
            <p className="text-sm text-gray-500">總數量</p>
          </div>
        </div>

        {/* 導航標籤 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex space-x-4">
            {[
              {
                id: "games",
                name: "遊戲方法",
                count: loading ? "載入中..." : games.length,
              },
              {
                id: "messages",
                name: "管理員消息",
                count: loading ? "載入中..." : messages.length,
              },
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
            {activeTab === "games" && renderGameForm()}
            {activeTab === "messages" && renderMessageForm()}
          </div>

          {/* 右側：列表 */}
          <div>
            {activeTab === "games" && renderGameList()}
            {activeTab === "messages" && renderMessageList()}
          </div>
        </div>
      </div>
    </div>
  );
}
