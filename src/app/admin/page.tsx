"use client";

import { useState, useEffect } from "react";
import { GameMethod, TeachingAid, AdminMessage } from "@/types";
import {
  generateId,
  saveGameMethods,
  saveTeachingAids,
  saveAdminMessages,
} from "@/lib/utils";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"games" | "aids" | "messages">(
    "games"
  );
  const [games, setGames] = useState<GameMethod[]>([]);
  const [aids, setAids] = useState<TeachingAid[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);

  // 表單狀態
  const [gameForm, setGameForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "easy" as const,
    materials: [""],
    instructions: [""],
  });

  const [aidForm, setAidForm] = useState({
    name: "",
    description: "",
    subject: "",
    grade: "",
    textbookReference: "",
    materials: [""],
    instructions: [""],
  });

  const [messageForm, setMessageForm] = useState({
    title: "",
    content: "",
    priority: "low" as const,
    isPublished: false,
  });

  useEffect(() => {
    // 載入本地儲存的數據
    const savedGames = localStorage.getItem("gameMethods");
    const savedAids = localStorage.getItem("teachingAids");
    const savedMessages = localStorage.getItem("adminMessages");

    if (savedGames) setGames(JSON.parse(savedGames));
    if (savedAids) setAids(JSON.parse(savedAids));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // 遊戲方法管理
  const addGame = () => {
    if (!gameForm.title || !gameForm.description || !gameForm.category) {
      alert("請填寫必要欄位");
      return;
    }

    const newGame: GameMethod = {
      id: generateId(),
      ...gameForm,
      materials: gameForm.materials.filter((m) => m.trim()),
      instructions: gameForm.instructions.filter((i) => i.trim()),
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
      category: "",
      difficulty: "easy",
      materials: [""],
      instructions: [""],
    });
  };

  const deleteGame = (id: string) => {
    if (confirm("確定要刪除這個遊戲方法嗎？")) {
      const updatedGames = games.filter((g) => g.id !== id);
      setGames(updatedGames);
      saveGameMethods(updatedGames);
    }
  };

  // 教學輔具管理
  const addAid = () => {
    if (
      !aidForm.name ||
      !aidForm.description ||
      !aidForm.subject ||
      !aidForm.grade
    ) {
      alert("請填寫必要欄位");
      return;
    }

    const newAid: TeachingAid = {
      id: generateId(),
      ...aidForm,
      materials: aidForm.materials.filter((m) => m.trim()),
      instructions: aidForm.instructions.filter((i) => i.trim()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedAids = [...aids, newAid];
    setAids(updatedAids);
    saveTeachingAids(updatedAids);

    // 重置表單
    setAidForm({
      name: "",
      description: "",
      subject: "",
      grade: "",
      textbookReference: "",
      materials: [""],
      instructions: [""],
    });
  };

  const deleteAid = (id: string) => {
    if (confirm("確定要刪除這個教學輔具嗎？")) {
      const updatedAids = aids.filter((a) => a.id !== id);
      setAids(updatedAids);
      saveTeachingAids(updatedAids);
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
      priority: "low",
      isPublished: false,
    });
  };

  const deleteMessage = (id: string) => {
    if (confirm("確定要刪除這個站長消息嗎？")) {
      const updatedMessages = messages.filter((m) => m.id !== id);
      setMessages(updatedMessages);
      saveAdminMessages(updatedMessages);
    }
  };

  const toggleMessagePublish = (id: string) => {
    const updatedMessages = messages.map((m) =>
      m.id === id
        ? { ...m, isPublished: !m.isPublished, updatedAt: new Date() }
        : m
    );
    setMessages(updatedMessages);
    saveAdminMessages(updatedMessages);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">管理介面</h1>
          <p className="text-xl text-gray-600">
            管理遊戲方法、教學輔具和站長消息
          </p>
        </div>

        {/* 標籤頁 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "games", name: "遊戲方法", count: games.length },
                { id: "aids", name: "教學輔具", count: aids.length },
                { id: "messages", name: "站長消息", count: messages.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-pink-500 text-pink-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  新增遊戲方法
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="遊戲標題"
                    value={gameForm.title}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, title: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <select
                    value={gameForm.category}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, category: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">選擇分類</option>
                    <option value="單字學習">單字學習</option>
                    <option value="句型練習">句型練習</option>
                    <option value="口語訓練">口語訓練</option>
                  </select>
                </div>
                <textarea
                  placeholder="遊戲描述"
                  value={gameForm.description}
                  onChange={(e) =>
                    setGameForm({ ...gameForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    value={gameForm.difficulty}
                    onChange={(e) =>
                      setGameForm({
                        ...gameForm,
                        difficulty: e.target.value as any,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="easy">簡單</option>
                    <option value="medium">中等</option>
                    <option value="hard">困難</option>
                  </select>
                </div>
                <button
                  onClick={addGame}
                  className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition-colors"
                >
                  新增遊戲方法
                </button>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    現有遊戲方法
                  </h4>
                  <div className="space-y-4">
                    {games.map((game) => (
                      <div
                        key={game.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {game.title}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {game.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              分類：{game.category} | 難度：{game.difficulty}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteGame(game.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 教學輔具管理 */}
            {activeTab === "aids" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  新增教學輔具
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="輔具名稱"
                    value={aidForm.name}
                    onChange={(e) =>
                      setAidForm({ ...aidForm, name: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <select
                    value={aidForm.subject}
                    onChange={(e) =>
                      setAidForm({ ...aidForm, subject: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">選擇科目</option>
                    <option value="英語">英語</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    value={aidForm.grade}
                    onChange={(e) =>
                      setAidForm({ ...aidForm, grade: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">選擇年級</option>
                    <option value="小學一年級">小學一年級</option>
                    <option value="小學二年級">小學二年級</option>
                    <option value="小學三年級">小學三年級</option>
                    <option value="小學四年級">小學四年級</option>
                    <option value="小學五年級">小學五年級</option>
                    <option value="小學六年級">小學六年級</option>
                  </select>
                  <input
                    type="text"
                    placeholder="課本參考（選填）"
                    value={aidForm.textbookReference}
                    onChange={(e) =>
                      setAidForm({
                        ...aidForm,
                        textbookReference: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <textarea
                  placeholder="輔具描述"
                  value={aidForm.description}
                  onChange={(e) =>
                    setAidForm({ ...aidForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                />
                <button
                  onClick={addAid}
                  className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors"
                >
                  新增教學輔具
                </button>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    現有教學輔具
                  </h4>
                  <div className="space-y-4">
                    {aids.map((aid) => (
                      <div
                        key={aid.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {aid.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {aid.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {aid.subject} | {aid.grade}
                              {aid.textbookReference &&
                                ` | ${aid.textbookReference}`}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteAid(aid.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 站長消息管理 */}
            {activeTab === "messages" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <select
                    value={messageForm.priority}
                    onChange={(e) =>
                      setMessageForm({
                        ...messageForm,
                        priority: e.target.value as any,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="low">一般</option>
                    <option value="medium">重要</option>
                    <option value="high">緊急</option>
                  </select>
                </div>
                <textarea
                  placeholder="消息內容"
                  value={messageForm.content}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, content: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4"
                />
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={messageForm.isPublished}
                    onChange={(e) =>
                      setMessageForm({
                        ...messageForm,
                        isPublished: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-sm text-gray-700"
                  >
                    立即發布
                  </label>
                </div>
                <button
                  onClick={addMessage}
                  className="bg-rose-500 text-white px-6 py-2 rounded-md hover:bg-rose-600 transition-colors"
                >
                  新增站長消息
                </button>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
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
                            <h5 className="font-medium text-gray-800">
                              {message.title}
                            </h5>
                            <p className="text-sm text-gray-600 mt-1">
                              {message.content}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  message.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : message.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {message.priority === "high"
                                  ? "緊急"
                                  : message.priority === "medium"
                                  ? "重要"
                                  : "一般"}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  message.isPublished
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {message.isPublished ? "已發布" : "草稿"}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => toggleMessagePublish(message.id)}
                              className={`px-3 py-1 text-xs rounded ${
                                message.isPublished
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                            >
                              {message.isPublished ? "取消發布" : "發布"}
                            </button>
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="px-3 py-1 text-xs rounded bg-red-100 text-red-800 hover:bg-red-200"
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
          </div>
        </div>
      </div>
    </div>
  );
}
