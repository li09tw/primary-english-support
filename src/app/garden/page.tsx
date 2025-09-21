/**
 * @fileoverview Garden 管理介面 - 管理遊戲方法和管理員消息
 * @modified 2024-01-XX XX:XX - 新增帳號驗證系統
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 新增帳號驗證和驗證碼驗證功能，保護管理介面安全
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { GameMethod, AdminMessage } from "@/types";
import { generateId, saveGameMethods, saveAdminMessages } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { gameAPI, adminMessageAPI } from "@/lib/game-api";
import AuthGuard from "@/components/AuthGuard";

function GardenPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"games" | "messages">("games");
  const [games, setGames] = useState<GameMethod[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

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
    // 安全地處理數組字段
    const safeCategories = Array.isArray(game.categories)
      ? game.categories
      : [];
    const safeGrades = Array.isArray(game.grades) ? game.grades : [];
    const safeMaterials = Array.isArray(game.materials) ? game.materials : [];
    const safeInstructions = Array.isArray(game.instructions)
      ? game.instructions
      : [];

    return {
      id: game.id || generateId(),
      title: game.title || "",
      description: game.description || "",
      category: game.category || safeCategories[0] || "",
      categories: safeCategories,
      grades: safeGrades,
      materials: safeMaterials,
      instructions: safeInstructions,
      steps:
        game.steps ||
        (safeInstructions.length > 0 ? safeInstructions.join("\n") : ""),
      tips: game.tips || "",
      is_published: game.is_published !== undefined ? game.is_published : true,
      createdAt: game.createdAt ? new Date(game.createdAt) : new Date(),
      updatedAt: game.updatedAt ? new Date(game.updatedAt) : new Date(),
    };
  };

  // 管理員消息數據驗證函數
  const validateMessageData = (message: any): AdminMessage => {
    const validatedMessage = {
      id: message.id?.toString() || generateId(), // 確保 id 是 string 類型
      title: message.title || "",
      content: message.content || "",
      is_published:
        message.is_published !== undefined
          ? Boolean(message.is_published)
          : true,
      is_pinned:
        message.is_pinned !== undefined ? Boolean(message.is_pinned) : false,
      published_at: message.published_at
        ? new Date(message.published_at)
        : new Date(),
    };

    return validatedMessage;
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

  // 編輯狀態
  const [editingMessage, setEditingMessage] = useState<AdminMessage | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
  });

  // 載入遊戲方法數據 - 使用 Mock 資料庫
  const loadGames = useCallback(async () => {
    try {
      setLoading(true);

      // 直接從 Mock API 獲取數據
      const response = await fetch("/api/games");
      if (response.ok) {
        const data = await response.json();
        const fetchedGames = data.data || [];

        // 驗證和轉換數據
        const validatedGames = fetchedGames.map(validateGameData);
        setGames(validatedGames);

        // 同時保存到 localStorage 作為備份
        saveGameMethods(validatedGames);
      } else {
        console.error("Mock API 調用失敗:", response.status);
        setGames([]);
      }
    } catch (error) {
      console.error("載入遊戲方法失敗:", error);

      // 如果 API 失敗，嘗試從 localStorage 載入備份數據
      const savedGames = localStorage.getItem("gameMethods");
      if (savedGames) {
        try {
          const parsedGames = JSON.parse(savedGames);
          const validatedGames = parsedGames.map(validateGameData);
          setGames(validatedGames);
        } catch (localError) {
          console.error("localStorage 數據解析失敗:", localError);
          setGames([]);
        }
      } else {
        setGames([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 載入管理員消息數據 - 從 JSON API 載入
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);

      // 從 JSON API 載入管理員消息
      const response = await fetch("/api/admin");
      if (response.ok) {
        const data = await response.json();
        const fetchedMessages = data.data || [];

        // 驗證和轉換數據
        const validatedMessages = fetchedMessages.map(validateMessageData);
        setMessages(validatedMessages);

        // 同時保存到 localStorage 作為備份
        saveAdminMessages(validatedMessages);
      } else {
        console.error("JSON API 調用失敗:", response.status);
        // 如果 API 失敗，嘗試從 localStorage 載入備份數據
        const savedMessages = localStorage.getItem("adminMessages");
        if (savedMessages) {
          try {
            const parsedMessages = JSON.parse(savedMessages);
            const validatedMessages = parsedMessages.map(validateMessageData);
            setMessages(validatedMessages);
          } catch (localError) {
            console.error("localStorage 數據解析失敗:", localError);
            setMessages([]);
          }
        } else {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("❌ 載入管理員消息失敗:", error);
      // 如果 API 失敗，嘗試從 localStorage 載入備份數據
      const savedMessages = localStorage.getItem("adminMessages");
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          const validatedMessages = parsedMessages.map(validateMessageData);
          setMessages(validatedMessages);
        } catch (localError) {
          console.error("localStorage 數據解析失敗:", localError);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 載入數據
    loadGames();
    loadMessages();
  }, [loadGames, loadMessages]);

  // 遊戲方法相關函數 - 使用 Mock API
  const addGame = async () => {
    if (!gameForm.title.trim() || !gameForm.description.trim()) {
      alert("請填寫標題和描述");
      return;
    }

    try {
      const newGameData = {
        title: gameForm.title.trim(),
        description: gameForm.description.trim(),
        categories: gameForm.categories.filter(Boolean),
        grade1: gameForm.grades.includes("grade1"),
        grade2: gameForm.grades.includes("grade2"),
        grade3: gameForm.grades.includes("grade3"),
        grade4: gameForm.grades.includes("grade4"),
        grade5: gameForm.grades.includes("grade5"),
        grade6: gameForm.grades.includes("grade6"),
        materials: gameForm.materials.filter(Boolean),
        instructions: gameForm.instructions.filter(Boolean),
      };

      // 調用 Mock API 創建遊戲
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGameData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 重新載入遊戲列表
          await loadGames();
          alert("遊戲方法新增成功！");
        } else {
          alert("新增失敗：" + result.error);
          return;
        }
      } else {
        alert("新增失敗，請重試");
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
    } catch (error) {
      console.error("新增遊戲方法失敗:", error);
      alert("新增失敗，請重試");
    }
  };

  const deleteGame = async (id: string) => {
    if (confirm("確定要刪除這個遊戲方法嗎？")) {
      try {
        // 調用 Mock API 刪除遊戲
        const response = await fetch(`/api/games?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // 重新載入遊戲列表
            await loadGames();
            alert("刪除成功！");
          } else {
            alert("刪除失敗：" + result.error);
            return;
          }
        } else {
          alert("刪除失敗，請重試");
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
      // 調用 JSON API 創建消息
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: messageForm.title.trim(),
          content: messageForm.content.trim(),
          is_published: true,
          is_pinned: false,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 重新載入消息列表
          await loadMessages();
          alert("管理員消息新增成功！");
        } else {
          alert("新增失敗：" + result.error);
          return;
        }
      } else {
        alert("新增失敗，請重試");
        return;
      }

      // 重置表單
      setMessageForm({
        title: "",
        content: "",
      });
    } catch (error) {
      console.error("新增管理員消息失敗:", error);
      alert("新增失敗，請重試");
    }
  };

  const deleteMessage = async (id: string) => {
    if (confirm("確定要刪除這個管理員消息嗎？")) {
      try {
        // 調用 JSON API 刪除消息
        const response = await fetch(`/api/admin?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // 重新載入消息列表
            await loadMessages();
            alert("刪除成功！");
          } else {
            alert("刪除失敗：" + result.error);
            return;
          }
        } else {
          alert("刪除失敗，請重試");
          return;
        }
      } catch (error) {
        console.error("刪除管理員消息失敗:", error);
        alert("刪除失敗，請重試");
      }
    }
  };

  // 切換消息釘選狀態 - 使用 JSON API
  const toggleMessagePin = async (id: string) => {
    try {
      // 調用 JSON API 切換釘選狀態
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          type: "pin",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 重新載入消息列表
          await loadMessages();
          alert("釘選狀態已更新！");
        } else {
          alert("操作失敗：" + result.error);
          return;
        }
      } else {
        alert("操作失敗，請重試");
        return;
      }
    } catch (error) {
      console.error("切換釘選狀態失敗:", error);
      alert("操作失敗，請重試");
    }
  };

  // 開始編輯消息
  const startEditMessage = (message: AdminMessage) => {
    setEditingMessage(message);
    setEditForm({
      title: message.title,
      content: message.content,
    });
  };

  // 取消編輯
  const cancelEdit = () => {
    setEditingMessage(null);
    setEditForm({
      title: "",
      content: "",
    });
  };

  // 保存編輯
  const saveEdit = async () => {
    if (!editingMessage || !editForm.title.trim() || !editForm.content.trim()) {
      alert("請填寫標題和內容");
      return;
    }

    try {
      // 調用 JSON API 更新消息
      const response = await fetch("/api/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingMessage.id,
          title: editForm.title.trim(),
          content: editForm.content.trim(),
          is_published: editingMessage.is_published,
          is_pinned: editingMessage.is_pinned,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // 重新載入消息列表
          await loadMessages();
          alert("消息更新成功！");
          cancelEdit();
        } else {
          alert("更新失敗：" + result.error);
          return;
        }
      } else {
        alert("更新失敗，請重試");
        return;
      }
    } catch (error) {
      console.error("更新消息失敗:", error);
      alert("更新失敗，請重試");
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
  ];

  const gradeOptions = [
    "grade1",
    "grade2",
    "grade3",
    "grade4",
    "grade5",
    "grade6",
  ];

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
          <p className="text-xl text-black">管理遊戲方法和站長消息</p>
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
                            {grade.replace("grade", "")}年級
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

          {/* 右側：管理員消息列表 */}
          <div>
            {activeTab === "games" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-black mb-4">
                  遊戲方法管理
                </h3>
                <p className="text-gray-600 mb-4">
                  使用左側表單新增遊戲方法。新增的遊戲方法會自動保存到遠端資料庫。
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">功能說明</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 填寫遊戲方法標題和描述</li>
                    <li>• 選擇適用分類和年級</li>
                    <li>• 添加所需材料和遊戲說明</li>
                    <li>• 點擊新增按鈕保存到資料庫</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-black mb-4">
                  管理員消息列表 ({messages.length})
                </h3>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-500">暫無管理員消息</p>
                  ) : (
                    messages.map((message) => {
                      // 如果是正在編輯的消息，顯示編輯表單
                      if (editingMessage && editingMessage.id === message.id) {
                        return (
                          <div
                            key={message.id}
                            className="border-2 border-blue-400 bg-blue-50 rounded-lg p-4 space-y-4"
                          >
                            <h4 className="text-lg font-semibold text-black">
                              編輯消息
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                  標題 *
                                </label>
                                <input
                                  type="text"
                                  value={editForm.title}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      title: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="消息標題"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                  內容 *
                                </label>
                                <textarea
                                  value={editForm.content}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      content: e.target.value,
                                    })
                                  }
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                                  placeholder="消息內容"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEdit}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                                >
                                  保存
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                                >
                                  取消
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // 正常顯示消息
                      return (
                        <div
                          key={message.id}
                          className={`border rounded-lg p-4 space-y-2 ${
                            message.is_pinned
                              ? "border-yellow-400 bg-yellow-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {message.is_pinned && (
                                <span className="text-yellow-600 text-sm font-medium">
                                  📌 釘選
                                </span>
                              )}
                              <h4 className="text-lg font-medium text-black">
                                {message.title}
                              </h4>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditMessage(message)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                              >
                                修改
                              </button>
                              <button
                                onClick={() => toggleMessagePin(message.id)}
                                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                  message.is_pinned
                                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                    : "bg-gray-500 text-white hover:bg-gray-600"
                                }`}
                              >
                                {message.is_pinned ? "取消釘選" : "釘選"}
                              </button>
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                              >
                                刪除
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600">{message.content}</p>
                          <div className="text-sm text-gray-500">
                            發布時間:{" "}
                            {message.published_at.toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })
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

export default function GardenPage() {
  return (
    <AuthGuard>
      <GardenPageContent />
    </AuthGuard>
  );
}
