"use client";

import { useState, useEffect } from "react";
import { GameMethod, TeachingAid, AdminMessage } from "@/types";
import {
  generateId,
  saveGameMethods,
  saveTeachingAids,
  saveAdminMessages,
  saveContactMessages,
} from "@/lib/utils";

// 注意：由於這是 client component，metadata 需要在 layout 或 parent 中定義

export default function GardenPage() {
  const [activeTab, setActiveTab] = useState<
    "games" | "aids" | "messages" | "contacts"
  >("games");
  const [games, setGames] = useState<GameMethod[]>([]);
  const [aids, setTeachingAids] = useState<TeachingAid[]>([]);
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

  // 表單狀態
  const [gameForm, setGameForm] = useState({
    title: "",
    description: "",
    category: "",
    grade: "grade1" as
      | "grade1"
      | "grade2"
      | "grade3"
      | "grade4"
      | "grade5"
      | "grade6",
    materials: [""],
    instructions: [""],
  });

  const [aidForm, setAidForm] = useState({
    name: "",
    description: "",
    subject: "",
    grade: "grade1" as
      | "grade1"
      | "grade2"
      | "grade3"
      | "grade4"
      | "grade5"
      | "grade6",
    textbookReference: "",
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
    const savedAids = localStorage.getItem("teachingAids");
    const savedMessages = localStorage.getItem("adminMessages");
    const savedContacts = localStorage.getItem("contactMessages");

    if (savedGames) setGames(JSON.parse(savedGames));
    if (savedAids) setTeachingAids(JSON.parse(savedAids));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  // 遊戲方法管理
  const addGame = () => {
    if (!gameForm.title || !gameForm.description || !gameForm.category) {
      alert("請填寫必要欄位");
      return;
    }

    const validMaterials = gameForm.materials.filter((m) => m.trim());
    const validInstructions = gameForm.instructions.filter((i) => i.trim());

    if (validMaterials.length === 0) {
      alert("請至少填寫一個材料項目");
      return;
    }

    if (validInstructions.length === 0) {
      alert("請至少填寫一個說明項目");
      return;
    }

    const newGame: GameMethod = {
      id: generateId(),
      ...gameForm,
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
      category: "",
      grade: "grade1" as
        | "grade1"
        | "grade2"
        | "grade3"
        | "grade4"
        | "grade5"
        | "grade6",
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

    const validMaterials = aidForm.materials.filter((m) => m.trim());
    const validInstructions = aidForm.instructions.filter((i) => i.trim());

    if (validMaterials.length === 0) {
      alert("請至少填寫一個材料項目");
      return;
    }

    if (validInstructions.length === 0) {
      alert("請至少填寫一個說明項目");
      return;
    }

    const newAid: TeachingAid = {
      id: generateId(),
      ...aidForm,
      materials: validMaterials,
      instructions: validInstructions,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedAids = [...aids, newAid];
    setTeachingAids(updatedAids);
    saveTeachingAids(updatedAids);

    // 重置表單
    setAidForm({
      name: "",
      description: "",
      subject: "",
      grade: "grade1" as
        | "grade1"
        | "grade2"
        | "grade3"
        | "grade4"
        | "grade5"
        | "grade6",
      textbookReference: "",
      materials: [""],
      instructions: [""],
    });
  };

  const deleteAid = (id: string) => {
    if (confirm("確定要刪除這個教學輔具嗎？")) {
      const updatedAids = aids.filter((a) => a.id !== id);
      setTeachingAids(updatedAids);
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
            管理遊戲方法、教學輔具、站長消息和聯絡表單
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
                { id: "contacts", name: "聯絡表單", count: contacts.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-secondary-pink text-secondary-pink"
                      : "border-transparent text-black hover:text-black hover:border-gray-300"
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
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  />
                  <select
                    value={gameForm.category}
                    onChange={(e) =>
                      setGameForm({ ...gameForm, category: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    value={gameForm.grade}
                    onChange={(e) =>
                      setGameForm({
                        ...gameForm,
                        grade: e.target.value as
                          | "grade1"
                          | "grade2"
                          | "grade3"
                          | "grade4"
                          | "grade5"
                          | "grade6",
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  >
                    <option value="grade1">1年級</option>
                    <option value="grade2">2年級</option>
                    <option value="grade3">3年級</option>
                    <option value="grade4">4年級</option>
                    <option value="grade5">5年級</option>
                    <option value="grade6">6年級</option>
                  </select>
                </div>

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
                          className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md"
                        >
                          刪除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setGameForm({
                        ...gameForm,
                        materials: [...gameForm.materials, ""],
                      });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-1"
                  >
                    + 新增材料
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
                          className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md"
                        >
                          刪除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setGameForm({
                        ...gameForm,
                        instructions: [...gameForm.instructions, ""],
                      });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-1"
                  >
                    + 新增說明
                  </button>
                </div>

                <button
                  onClick={addGame}
                  className="bg-secondary-pink text-black px-6 py-2 rounded-md hover:bg-accent-green transition-colors"
                >
                  新增遊戲方法
                </button>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-black mb-4">
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
                            <h5 className="font-medium text-black">
                              {game.title}
                            </h5>
                            <p className="text-sm text-black">
                              {game.description}
                            </p>
                            <p className="text-xs text-black mt-1">
                              分類：{game.category} | 年級：{game.grade}
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
                <h3 className="text-lg font-semibold text-black mb-4">
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
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  />
                  <select
                    value={aidForm.subject}
                    onChange={(e) =>
                      setAidForm({ ...aidForm, subject: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  >
                    <option value="">選擇科目</option>
                    <option value="英語">英語</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <select
                    value={aidForm.grade}
                    onChange={(e) =>
                      setAidForm({
                        ...aidForm,
                        grade: e.target.value as
                          | "grade1"
                          | "grade2"
                          | "grade3"
                          | "grade4"
                          | "grade5"
                          | "grade6",
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  >
                    <option value="">選擇年級</option>
                    <option value="grade1">1年級</option>
                    <option value="grade2">2年級</option>
                    <option value="grade3">3年級</option>
                    <option value="grade4">4年級</option>
                    <option value="grade5">5年級</option>
                    <option value="grade6">6年級</option>
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
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                  />
                </div>
                <textarea
                  placeholder="輔具描述"
                  value={aidForm.description}
                  onChange={(e) =>
                    setAidForm({ ...aidForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink mb-4"
                />

                {/* 材料項目 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    材料項目
                  </label>
                  {aidForm.materials.map((material, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={`材料 ${index + 1}`}
                        value={material}
                        onChange={(e) => {
                          const newMaterials = [...aidForm.materials];
                          newMaterials[index] = e.target.value;
                          setAidForm({ ...aidForm, materials: newMaterials });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                      />
                      {aidForm.materials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newMaterials = aidForm.materials.filter(
                              (_, i) => i !== index
                            );
                            setAidForm({ ...aidForm, materials: newMaterials });
                          }}
                          className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md"
                        >
                          刪除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setAidForm({
                        ...aidForm,
                        materials: [...aidForm.materials, ""],
                      });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-1"
                  >
                    + 新增材料
                  </button>
                </div>

                {/* 說明項目 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    說明項目
                  </label>
                  {aidForm.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        placeholder={`說明 ${index + 1}`}
                        value={instruction}
                        onChange={(e) => {
                          const newInstructions = [...aidForm.instructions];
                          newInstructions[index] = e.target.value;
                          setAidForm({
                            ...aidForm,
                            instructions: newInstructions,
                          });
                        }}
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink"
                      />
                      {aidForm.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newInstructions = aidForm.instructions.filter(
                              (_, i) => i !== index
                            );
                            setAidForm({
                              ...aidForm,
                              instructions: newInstructions,
                            });
                          }}
                          className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md"
                        >
                          刪除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setAidForm({
                        ...aidForm,
                        instructions: [...aidForm.instructions, ""],
                      });
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-1"
                  >
                    + 新增說明
                  </button>
                </div>

                <button
                  onClick={addAid}
                  className="bg-accent-green text-black px-6 py-2 rounded-md hover:bg-secondary-pink transition-colors"
                >
                  新增教學輔具
                </button>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-black mb-4">
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
                            <h5 className="font-medium text-black">
                              {aid.name}
                            </h5>
                            <p className="text-sm text-black">
                              {aid.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                {aid.subject}
                              </span>
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                {aid.grade === "grade1"
                                  ? "1年級"
                                  : aid.grade === "grade2"
                                  ? "2年級"
                                  : aid.grade === "grade3"
                                  ? "3年級"
                                  : aid.grade === "grade4"
                                  ? "4年級"
                                  : aid.grade === "grade5"
                                  ? "5年級"
                                  : aid.grade === "grade6"
                                  ? "6年級"
                                  : aid.grade}
                              </span>
                              {aid.textbookReference && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                  {aid.textbookReference}
                                </span>
                              )}
                            </div>
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
                  className="bg-secondary-pink text-black px-6 py-2 rounded-md hover:bg-accent-green transition-colors"
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
                              className="px-3 py-1 text-xs rounded bg-secondary-pink text-black hover:bg-secondary-pink"
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
                      <p className="text-gray-500">目前沒有聯絡記錄</p>
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
                              <p className="text-xs text-gray-500 mt-2">
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
