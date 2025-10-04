/**
 * @fileoverview 遊戲 API 模組 - 簡化版本，移除 D1 依賴
 * @modified 2024-01-XX XX:XX - 移除 D1 和認證系統
 * @modified_by Assistant
 * @modification_type refactor
 * @status completed
 * @feature 簡化為純靜態網站 API
 */

import type { GameMethod, AdminMessage } from "@/types";

// 模擬遊戲方法資料
const mockGameMethods: GameMethod[] = [
  {
    id: "1",
    title: "單字記憶遊戲",
    description: "透過配對遊戲學習單字",
    category: "單字學習",
    categories: ["單字學習"],
    grades: ["1年級", "2年級", "3年級"],
    grade1: true,
    grade2: true,
    grade3: true,
    grade4: false,
    grade5: false,
    grade6: false,
    materials: ["單字卡片"],
    instructions: ["準備單字卡片", "讓學生配對", "檢查答案"],
    steps: "1. 準備單字卡片\n2. 讓學生配對\n3. 檢查答案",
    tips: "可以增加時間限制增加挑戰性",
    is_published: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "2",
    title: "句型練習",
    description: "透過角色扮演練習句型",
    category: "句型練習",
    categories: ["句型練習"],
    grades: ["2年級", "3年級", "4年級"],
    grade1: false,
    grade2: true,
    grade3: true,
    grade4: true,
    grade5: false,
    grade6: false,
    materials: ["情境卡片"],
    instructions: ["設定情境", "分配角色", "練習對話"],
    steps: "1. 設定情境\n2. 分配角色\n3. 練習對話",
    tips: "鼓勵學生發揮創意",
    is_published: true,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
];

// 模擬管理員消息資料
const mockAdminMessages: AdminMessage[] = [
  {
    id: "1",
    title: "歡迎使用 Primary English Support",
    content: "歡迎來到我們的英語學習平台！",
    is_published: true,
    is_pinned: false,
    published_at: new Date("2024-01-01T00:00:00Z"),
  },
];

// 遊戲方法相關 API
export const gameAPI = {
  // 獲取所有遊戲方法
  async getAllGames(): Promise<GameMethod[]> {
    return mockGameMethods;
  },

  // 獲取所有已發布的遊戲方法
  async getPublishedGames(): Promise<GameMethod[]> {
    return mockGameMethods.filter((game) => game.is_published);
  },

  // 根據年級獲取遊戲方法
  async getGamesByGrade(grade: string): Promise<GameMethod[]> {
    const gradeNum = parseInt(grade.replace("grade", ""));
    return mockGameMethods.filter((game) => {
      switch (gradeNum) {
        case 1:
          return game.grade1;
        case 2:
          return game.grade2;
        case 3:
          return game.grade3;
        case 4:
          return game.grade4;
        case 5:
          return game.grade5;
        case 6:
          return game.grade6;
        default:
          return false;
      }
    });
  },

  // 搜尋遊戲方法
  async searchGames(query: string): Promise<GameMethod[]> {
    const searchTerm = query.toLowerCase();
    return mockGameMethods.filter(
      (game) =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );
  },

  // 根據分類獲取遊戲方法
  async getGamesByCategory(category: string): Promise<GameMethod[]> {
    return mockGameMethods.filter((game) => game.category === category);
  },

  // 獲取單一遊戲方法
  async getGameById(id: string): Promise<GameMethod | null> {
    return mockGameMethods.find((game) => game.id === id) || null;
  },

  // 新增遊戲方法 (僅模擬，實際不保存)
  async createGame(gameData: Partial<GameMethod>): Promise<boolean> {
    console.log("模擬新增遊戲方法:", gameData);
    return true;
  },

  // 更新遊戲方法 (僅模擬，實際不保存)
  async updateGame(
    id: string,
    gameData: Partial<GameMethod>
  ): Promise<boolean> {
    console.log("模擬更新遊戲方法:", id, gameData);
    return true;
  },

  // 刪除遊戲方法 (僅模擬，實際不保存)
  async deleteGame(id: string): Promise<boolean> {
    console.log("模擬刪除遊戲方法:", id);
    return true;
  },

  // 切換遊戲方法的發布狀態 (僅模擬，實際不保存)
  async toggleGamePublishStatus(id: string): Promise<boolean> {
    console.log("模擬切換遊戲方法發布狀態:", id);
    return true;
  },
};

// 學習輔助相關 API (簡化版本)
export const teachingAidAPI = {
  async getAllTeachingAids(): Promise<any[]> {
    return [];
  },

  async getPublishedTeachingAids(): Promise<any[]> {
    return [];
  },

  async createTeachingAid(aidData: any): Promise<boolean> {
    console.log("模擬新增學習輔助:", aidData);
    return true;
  },

  async updateTeachingAid(id: string, aidData: any): Promise<boolean> {
    console.log("模擬更新學習輔助:", id, aidData);
    return true;
  },

  async deleteTeachingAid(id: string): Promise<boolean> {
    console.log("模擬刪除學習輔助:", id);
    return true;
  },
};

// 站長消息相關 API (簡化版本)
export const adminMessageAPI = {
  // 獲取所有站長消息
  async getAllMessages(): Promise<AdminMessage[]> {
    return mockAdminMessages;
  },

  // 獲取已發布的站長消息
  async getPublishedMessages(): Promise<AdminMessage[]> {
    return mockAdminMessages.filter((msg) => msg.is_published);
  },

  // 新增站長消息 (僅模擬，實際不保存)
  async createMessage(messageData: Partial<AdminMessage>): Promise<boolean> {
    console.log("模擬新增站長消息:", messageData);
    return true;
  },

  // 更新站長消息 (僅模擬，實際不保存)
  async updateMessage(
    id: string,
    messageData: Partial<AdminMessage>
  ): Promise<boolean> {
    console.log("模擬更新站長消息:", id, messageData);
    return true;
  },

  // 刪除站長消息 (僅模擬，實際不保存)
  async deleteMessage(id: string): Promise<boolean> {
    console.log("模擬刪除站長消息:", id);
    return true;
  },

  // 切換站長消息的發布狀態 (僅模擬，實際不保存)
  async toggleMessagePublishStatus(id: string): Promise<boolean> {
    console.log("模擬切換站長消息發布狀態:", id);
    return true;
  },

  // 切換站長消息的釘選狀態 (僅模擬，實際不保存)
  async toggleMessagePinStatus(id: string): Promise<boolean> {
    console.log("模擬切換站長消息釘選狀態:", id);
    return true;
  },
};

// 為了向後兼容，保留 localGameAPI 的別名
export const localGameAPI = gameAPI;
