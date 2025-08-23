"use client";

import { useState, useEffect } from "react";
import { GameMethod, AdminMessage } from "@/types";
import {
  generateId,
  saveGameMethods,
  saveAdminMessages,
  saveContactMessages,
} from "@/lib/utils";

// 注意：由於這是 client component，metadata 需要在 layout 或 parent 中定義

export default function GardenPage() {
  const [activeTab, setActiveTab] = useState<"games" | "messages" | "contacts">(
    "games"
  );
  const [games, setGames] = useState<GameMethod[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [contacts, setContacts] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      type: string;
      title: string;
      content: string;
      status: "pending" | "replied" | "resolved";
      createdAt: string;
      updatedAt: string;
    }>
  >([]);

  // 調試信息
  console.log("GardenPage render:", { games, messages, contacts });

  // 數據驗證函數
  const validateGameData = (game: any): GameMethod => {
    return {
      id: game.id || generateId(),
      title: game.title || "",
      description: game.description || "",
      categories: Array.isArray(game.categories) ? game.categories : [],
      grades: Array.isArray(game.grades) ? game.grades : [],
      materials: Array.isArray(game.materials) ? game.materials : [],
      instructions: Array.isArray(game.instructions) ? game.instructions : [],
      createdAt: game.createdAt ? new Date(game.createdAt) : new Date(),
      updatedAt: game.updatedAt ? new Date(game.updatedAt) : new Date(),
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

  useEffect(() => {
    // 載入本地儲存的數據
    const savedGames = localStorage.getItem("gameMethods");
    const savedMessages = localStorage.getItem("adminMessages");
    const savedContacts = localStorage.getItem("contactMessages");

    // 數據遷移：將舊格式轉換為新格式
    if (savedGames) {
      try {
        const parsedGames = JSON.parse(savedGames);
        const migratedGames = parsedGames.map((game: any) => {
          // 檢查是否需要遷移
          if (game.category && !game.categories) {
            return {
              ...game,
              categories: [game.category],
              grades: game.grade ? [game.grade] : [],
            };
          }
          if (game.grade && !game.grades) {
            return {
              ...game,
              categories: game.categories || [],
              grades: [game.grade],
            };
          }
          return game;
        });
        // 使用驗證函數確保數據格式正確
        const validatedGames = migratedGames.map(validateGameData);
        setGames(validatedGames);
        // 保存遷移後的數據
        localStorage.setItem("gameMethods", JSON.stringify(validatedGames));
      } catch (error) {
        console.error("Error parsing games data:", error);
        setGames([]);
      }
    }

    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  // 遊戲方法管理
  const addGame = () => {
    if (
      !gameForm.title ||
      !gameForm.description ||
      gameForm.categories.length === 0 ||
      gameForm.grades.length === 0 ||
      gameForm.materials.length === 0 ||
      gameForm.instructions.length === 0
    ) {
      alert("請填寫所有必要欄位");
      return;
    }

    const validMaterials = gameForm.materials.filter((m) => m.trim());
    const validInstructions = gameForm.instructions.filter((i) => i.trim());

    if (validMaterials.length === 0 || validInstructions.length === 0) {
      alert("請至少填寫一個材料或說明");
      return;
    }

    const newGame: GameMethod = {
      id: generateId(),
      title: gameForm.title,
      description: gameForm.description,
      categories: gameForm.categories,
      grades: gameForm.grades,
      materials: validMaterials,
      instructions: validInstructions,
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
    if (confirm("確定要刪除這個遊戲嗎？")) {
      const updatedGames = games.filter((g) => g.id !== id);
      setGames(updatedGames);
      saveGameMethods(updatedGames);
    }
  };

  // 站長消息管理
  const addMessage = () => {
    if (!messageForm.title || !messageForm.content) {
      alert("請填寫必要欄位");
      return;
    }

    const newMessage: AdminMessage = {
      id: generateId(),
      ...messageForm,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    if (confirm("確定要刪除這個站長消息嗎？")) {
      const updatedMessages = messages.filter((m) => m.id !== id);
      setMessages(updatedMessages);
      saveAdminMessages(updatedMessages);
    }
  };

  // 聯絡表單管理
  const updateContactStatus = (
    id: string,
    status: "pending" | "replied" | "resolved"
  ) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === id
        ? { ...contact, status, updatedAt: new Date().toISOString() }
        : contact
    );
    setContacts(updatedContacts);
    saveContactMessages(updatedContacts);
  };

  const deleteContact = (id: string) => {
    if (confirm("確定要刪除這個聯絡記錄嗎？")) {
      const updatedContacts = contacts.filter((c) => c.id !== id);
      setContacts(updatedContacts);
      saveContactMessages(updatedContacts);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">花園</h1>
          <p className="text-xl text-black">
            管理遊戲庫與教學輔具、站長消息和聯絡表單
          </p>
        </div>

        {/* 調試信息 */}
        <div className="bg-white rounded-lg shadow-md mb-8 p-4">
          <h3 className="text-lg font-semibold text-black mb-2">調試信息</h3>
          <div className="text-sm text-black mb-4">
            <p>遊戲數量: {games.length}</p>
            <p>消息數量: {messages.length}</p>
            <p>聯絡數量: {contacts.length}</p>
            <p>當前標籤: {activeTab}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              清除所有數據並重新開始
            </button>
            <button
              onClick={() => {
                console.log("Games:", games);
                console.log("Messages:", messages);
                console.log("Contacts:", contacts);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-red-600"
            >
              在控制台顯示數據
            </button>
          </div>
        </div>

        {/* 標籤頁 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "games", name: "遊戲庫", count: games.length },
                { id: "messages", name: "站長消息", count: messages.length },
                { id: "contacts", name: "聯絡表單", count: contacts.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-secondary-pink text-secondary-pink"
                      : "border-transparent text-black hover:text-secondary-pink hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 bg-accent-green text-black py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* 遊戲方法管理 */}
            {activeTab === "games" && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  新增遊戲
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="遊戲標題"
                    value={gameForm.title}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, title: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  />
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      選擇分類
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "單字學習", label: "單字學習" },
                        { value: "句型練習", label: "句型練習" },
                        { value: "口語訓練", label: "口語訓練" },
                        { value: "教學輔具", label: "教學輔具" },
                      ].map((category) => (
                        <label
                          key={category.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={gameForm.categories.includes(
                              category.value
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGameForm({
                                  ...gameForm,
                                  categories: [
                                    ...gameForm.categories,
                                    category.value,
                                  ],
                                });
                              } else {
                                setGameForm({
                                  ...gameForm,
                                  categories: gameForm.categories.filter(
                                    (c) => c !== category.value
                                  ),
                                });
                              }
                            }}
                            className="w-4 h-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded"
                          />
                          <span className="text-sm text-black">
                            {category.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      選擇年級
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: "grade1", label: "1年級" },
                        { value: "grade2", label: "2年級" },
                        { value: "grade3", label: "3年級" },
                        { value: "grade4", label: "4年級" },
                        { value: "grade5", label: "5年級" },
                        { value: "grade6", label: "6年級" },
                      ].map((grade) => (
                        <label
                          key={grade.value}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={gameForm.grades.includes(grade.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGameForm({
                                  ...gameForm,
                                  grades: [...gameForm.grades, grade.value],
                                });
                              } else {
                                setGameForm({
                                  ...gameForm,
                                  grades: gameForm.grades.filter(
                                    (g) => g !== grade.value
                                  ),
                                });
                              }
                            }}
                            className="w-4 h-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded"
                          />
                          <span className="text-sm text-black">
                            {grade.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea
                  placeholder="遊戲描述"
                  value={gameForm.description}
                  onChange={(e) =>
                    setGameForm({ ...gameForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink mb-4"
                />

                {/* 材料項目 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    材料項目
                  </label>
                  {gameForm.materials.map((material, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={`材料 ${index + 1}`}
                        value={material}
                        onChange={(e) => {
                          const newMaterials = [...gameForm.materials];
                          newMaterials[index] = e.target.value;
                          setGameForm({ ...gameForm, materials: newMaterials });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                      />
                      <button
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
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setGameForm({
                        ...gameForm,
                        materials: [...gameForm.materials, ""],
                      })
                    }
                    className="px-4 py-2 bg-secondary-pink text-black rounded-md hover:bg-white hover:text-primary-blue-dark border-2 border-transparent hover:border-primary-blue-dark"
                  >
                    新增材料
                  </button>
                </div>

                {/* 說明項目 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    說明項目
                  </label>
                  {gameForm.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        placeholder={`說明 ${index + 1}`}
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                      />
                      <button
                        onClick={() => {
                          const newInstructions = gameForm.instructions.filter(
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
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setGameForm({
                        ...gameForm,
                        instructions: [...gameForm.instructions, ""],
                      })
                    }
                    className="px-4 py-2 bg-secondary-pink text-black rounded-md hover:bg-white hover:text-primary-blue-dark border-2 border-transparent hover:border-primary-blue-dark"
                  >
                    新增說明
                  </button>
                </div>

                <button
                  onClick={addGame}
                  className="w-full px-4 py-2 bg-secondary-pink text-black rounded-md hover:bg-white hover:text-primary-blue-dark border-2 border-transparent hover:border-primary-blue-dark"
                >
                  新增遊戲
                </button>

                {/* 遊戲方法列表 */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-black mb-4">
                    現有遊戲方法
                  </h4>
                  <div className="space-y-4">
                    {games.length > 0 ? (
                      games.map((game) => {
                        try {
                          // 驗證遊戲數據
                          const validatedGame = validateGameData(game);
                          return (
                            <div
                              key={validatedGame.id}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-black">
                                    {validatedGame.title}
                                  </h5>
                                  <p className="text-sm text-black">
                                    {validatedGame.description}
                                  </p>
                                  <p className="text-xs text-black mt-1">
                                    分類：{validatedGame.categories.join(", ")}{" "}
                                    | 年級：
                                    {validatedGame.grades
                                      .map(
                                        (g) => g.replace("grade", "") + "年級"
                                      )
                                      .join(", ")}
                                  </p>
                                </div>
                                <button
                                  onClick={() => deleteGame(validatedGame.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  刪除
                                </button>
                              </div>
                            </div>
                          );
                        } catch (error) {
                          console.error("Error rendering game:", game, error);
                          return (
                            <div
                              key={game.id || "error"}
                              className="border border-red-200 rounded-lg p-4 bg-red-50"
                            >
                              <p className="text-red-600">
                                遊戲數據格式錯誤，已自動修復
                              </p>
                            </div>
                          );
                        }
                      })
                    ) : (
                      <p className="text-black">目前沒有遊戲方法</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 站長消息管理 */}
            {activeTab === "messages" && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  新增站長消息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="消息標題"
                    value={messageForm.title}
                    onChange={(e) =>
                      setMessageForm({ ...messageForm, title: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  />
                </div>
                <textarea
                  placeholder="消息內容"
                  value={messageForm.content}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink mb-4"
                />

                <button
                  onClick={addMessage}
                  className="bg-secondary-pink text-black px-6 py-2 rounded-md hover:bg-white hover:text-primary-blue-dark hover:border-primary-blue-dark border-2 border-transparent transition-colors"
                >
                  新增站長消息
                </button>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-black mb-4">
                    現有站長消息
                  </h4>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-black">
                              {message.title}
                            </h5>
                            <p className="text-sm text-black mt-1">
                              {message.content}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="px-3 py-1 text-xs rounded bg-secondary-pink text-black hover:bg-white hover:text-primary-blue-dark hover:border-primary-blue-dark border-2 border-transparent transition-colors"
                            >
                              刪除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 聯絡表單管理 */}
            {activeTab === "contacts" && (
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  聯絡表單管理
                </h3>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-black mb-4">
                    聯絡記錄
                  </h4>
                  <div className="space-y-4">
                    {contacts.length === 0 ? (
                      <p className="text-black">目前沒有聯絡記錄</p>
                    ) : (
                      contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium text-black">
                                  {contact.title}
                                </h5>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    contact.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : contact.status === "replied"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {contact.status === "pending"
                                    ? "待回覆"
                                    : contact.status === "replied"
                                    ? "已回覆"
                                    : "已解決"}
                                </span>
                              </div>
                              <p className="text-sm text-black mb-2">
                                <strong>姓名：</strong>
                                {contact.name} |<strong>類型：</strong>
                                {contact.type} |<strong>Email：</strong>
                                {contact.email}
                              </p>
                              <p className="text-sm text-black whitespace-pre-wrap">
                                {contact.content}
                              </p>
                              <p className="text-xs text-black mt-2">
                                提交時間：
                                {new Date(contact.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <select
                                value={contact.status}
                                onChange={(e) =>
                                  updateContactStatus(
                                    contact.id,
                                    e.target.value as any
                                  )
                                }
                                className="px-2 py-1 border border-gray-300 rounded text-xs"
                              >
                                <option value="pending">待回覆</option>
                                <option value="replied">已回覆</option>
                                <option value="resolved">已解決</option>
                              </select>
                              <button
                                onClick={() => deleteContact(contact.id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                刪除
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
