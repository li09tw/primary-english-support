/**
 * @fileoverview 遊戲 API 模組 - 處理遊戲方法的 CRUD 操作
 * @modified 2024-01-XX XX:XX - 已完成並鎖定保護
 * @modified_by Assistant
 * @modification_type feature
 * @status locked
 * @last_commit 2024-01-XX XX:XX
 * @feature 遊戲方法 API 功能已完成
 * @protection 此檔案已完成開發，禁止修改。管理員介面可透過 /garden 路徑新增遊戲方法
 */

// 統一的遊戲 API
// 根據環境自動選擇正確的 Cloudflare 客戶端

import { createCloudflareClient } from "./cloudflare-client";
import { createLocalCloudflareClient } from "./cloudflare-client-local";
import { createCloudflareClientBrowser } from "./cloudflare-client-browser";
import type { GameMethod, AdminMessage } from "@/types";
import { transformGameMethodsFromDB } from "./data-transform";

// 延遲創建客戶端，避免在模組載入時就檢查環境變數
let client: any = null;

function getClient() {
  if (!client) {
    try {
      // 根據環境選擇客戶端
      if (typeof window !== "undefined") {
        // 在瀏覽器中，檢查是否有本地開發環境變數
        if (
          process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL ===
          "http://localhost:8787"
        ) {
          // 本地開發環境，使用本地客戶端
          client = createLocalCloudflareClient();
        } else {
          // 生產環境，使用瀏覽器端客戶端
          client = createCloudflareClientBrowser();
        }
      } else if (process.env.NODE_ENV === "development") {
        // 在伺服器端開發環境中，使用本地客戶端
        client = createLocalCloudflareClient();
      } else {
        // 在伺服器端生產環境中，使用直接客戶端
        client = createCloudflareClient();
      }
    } catch (error) {
      console.warn("Failed to create Cloudflare client:", error);
      // 返回一個模擬客戶端，避免錯誤
      client = {
        query: async () => ({ success: false, results: [] }),
        execute: async () => ({ success: false }),
      };
    }
  }
  return client;
}

// 遊戲方法相關 API
export const gameAPI = {
  // 獲取所有遊戲方法
  async getAllGames(): Promise<GameMethod[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM game_methods ORDER BY created_at DESC"
      );

      // 檢查回應格式
      if (!result.success) {
        console.error("Worker 回應失敗:", result.error);
        return [];
      }

      if (!result.results || !Array.isArray(result.results)) {
        console.error("Worker 回應格式錯誤:", result);
        return [];
      }

      const transformedGames = transformGameMethodsFromDB(result.results);

      return transformedGames;
    } catch (error) {
      console.error("Failed to fetch games:", error);
      return [];
    }
  },

  // 獲取所有已發布的遊戲方法
  async getPublishedGames(): Promise<GameMethod[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM game_methods WHERE is_published = 1 ORDER BY created_at DESC"
      );
      return transformGameMethodsFromDB(result.results || []);
    } catch (error) {
      console.error("Failed to fetch published games:", error);
      return [];
    }
  },

  // 根據年級獲取遊戲方法
  async getGamesByGrade(grade: string): Promise<GameMethod[]> {
    try {
      const gradeColumn = `grade${grade.replace("grade", "")}`;
      const result = await getClient().query(
        `SELECT * FROM game_methods WHERE ${gradeColumn} = 1 ORDER BY created_at DESC`
      );
      return transformGameMethodsFromDB(result.results || []);
    } catch (error) {
      console.error(`Failed to fetch games for grade ${grade}:`, error);
      return [];
    }
  },

  // 搜尋遊戲方法
  async searchGames(query: string): Promise<GameMethod[]> {
    try {
      const searchTerm = `%${query}%`;
      const result = await getClient().query(
        "SELECT * FROM game_methods WHERE title LIKE ? OR description LIKE ? ORDER BY created_at DESC",
        [searchTerm, searchTerm]
      );
      return transformGameMethodsFromDB(result.results || []);
    } catch (error) {
      console.error("Failed to search games:", error);
      return [];
    }
  },

  // 根據分類獲取遊戲方法
  async getGamesByCategory(category: string): Promise<GameMethod[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM game_methods WHERE category = ? ORDER BY created_at DESC",
        [category]
      );
      return transformGameMethodsFromDB(result.results || []);
    } catch (error) {
      console.error(`Failed to fetch games for category ${category}:`, error);
      return [];
    }
  },

  // 獲取單一遊戲方法
  async getGameById(id: string): Promise<GameMethod | null> {
    try {
      const result = await getClient().query(
        "SELECT * FROM game_methods WHERE id = ?",
        [id]
      );
      const games = transformGameMethodsFromDB(result.results || []);
      return games.length > 0 ? games[0] : null;
    } catch (error) {
      console.error(`Failed to fetch game ${id}:`, error);
      return null;
    }
  },

  // 新增遊戲方法
  async createGame(gameData: Partial<GameMethod>): Promise<boolean> {
    try {
      const result = await getClient().execute(
        `INSERT INTO game_methods (
          title, description, category, grade1, grade2, grade3, grade4, grade5, grade6,
          materials, steps, tips, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          gameData.title || "",
          gameData.description || "",
          gameData.category || "",
          gameData.grade1 || 0,
          gameData.grade2 || 0,
          gameData.grade3 || 0,
          gameData.grade4 || 0,
          gameData.grade5 || 0,
          gameData.grade6 || 0,
          gameData.materials || "",
          gameData.steps || "",
          gameData.tips || "",
          gameData.is_published || 1,
        ]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to create game:", error);
      return false;
    }
  },

  // 更新遊戲方法
  async updateGame(
    id: string,
    gameData: Partial<GameMethod>
  ): Promise<boolean> {
    try {
      const result = await getClient().execute(
        `UPDATE game_methods SET
          title = ?, description = ?, category = ?, grade1 = ?, grade2 = ?, grade3 = ?, 
          grade4 = ?, grade5 = ?, grade6 = ?, materials = ?, steps = ?, tips = ?, 
          is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          gameData.title || "",
          gameData.description || "",
          gameData.category || "",
          gameData.grade1 || 0,
          gameData.grade2 || 0,
          gameData.grade3 || 0,
          gameData.grade4 || 0,
          gameData.grade5 || 0,
          gameData.grade6 || 0,
          gameData.materials || "",
          gameData.steps || "",
          gameData.tips || "",
          gameData.is_published || 1,
          id,
        ]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to update game:", error);
      return false;
    }
  },

  // 刪除遊戲方法
  async deleteGame(id: string): Promise<boolean> {
    try {
      const result = await getClient().execute(
        "DELETE FROM game_methods WHERE id = ?",
        [id]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to delete game:", error);
      return false;
    }
  },

  // 切換遊戲方法的發布狀態
  async toggleGamePublishStatus(id: string): Promise<boolean> {
    try {
      const result = await getClient().execute(
        "UPDATE game_methods SET is_published = NOT is_published, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [id]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to toggle game publish status:", error);
      return false;
    }
  },
};

// 教學輔具相關 API
export const teachingAidAPI = {
  // 獲取所有教學輔具
  async getAllTeachingAids(): Promise<any[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM teaching_aids ORDER BY created_at DESC"
      );
      return result.results || [];
    } catch (error) {
      console.error("Failed to fetch teaching aids:", error);
      return [];
    }
  },

  // 獲取已發布的教學輔具
  async getPublishedTeachingAids(): Promise<any[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM teaching_aids WHERE is_published = 1 ORDER BY created_at DESC"
      );
      return result.results || [];
    } catch (error) {
      console.error("Failed to fetch published teaching aids:", error);
      return [];
    }
  },

  // 新增教學輔具
  async createTeachingAid(aidData: any): Promise<boolean> {
    try {
      const result = await getClient().execute(
        `INSERT INTO teaching_aids (
          title, description, category, file_url, is_published, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          aidData.title || "",
          aidData.description || "",
          aidData.category || "",
          aidData.file_url || "",
          aidData.is_published || 1,
        ]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to create teaching aid:", error);
      return false;
    }
  },

  // 更新教學輔具
  async updateTeachingAid(id: string, aidData: any): Promise<boolean> {
    try {
      const result = await getClient().execute(
        `UPDATE teaching_aids SET
          title = ?, description = ?, category = ?, file_url = ?, 
          is_published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          aidData.title || "",
          aidData.description || "",
          aidData.category || "",
          aidData.file_url || "",
          aidData.is_published || 1,
          id,
        ]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to update teaching aid:", error);
      return false;
    }
  },

  // 刪除教學輔具
  async deleteTeachingAid(id: string): Promise<boolean> {
    try {
      const result = await getClient().execute(
        "DELETE FROM teaching_aids WHERE id = ?",
        [id]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to delete teaching aid:", error);
      return false;
    }
  },
};

// 站長消息相關 API
export const adminMessageAPI = {
  // 獲取所有站長消息
  async getAllMessages(): Promise<AdminMessage[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM admin_messages ORDER BY is_pinned DESC, created_at DESC"
      );
      return result.results || [];
    } catch (error) {
      console.error("Failed to fetch admin messages:", error);
      return [];
    }
  },

  // 獲取已發布的站長消息
  async getPublishedMessages(): Promise<AdminMessage[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM admin_messages WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC"
      );
      return result.results || [];
    } catch (error) {
      console.error("Failed to fetch published admin messages:", error);
      return [];
    }
  },

  // 新增站長消息
  async createMessage(messageData: Partial<AdminMessage>): Promise<boolean> {
    try {
      const client = getClient();

      const result = await client.execute(
        `INSERT INTO admin_messages (
          title, content, is_published, is_pinned, created_at, updated_at
        ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [
          messageData.title || "",
          messageData.content || "",
          messageData.is_published || 1,
          messageData.is_pinned || 0,
        ]
      );

      return result.success;
    } catch (error) {
      console.error("Failed to create admin message:", error);
      return false;
    }
  },

  // 更新站長消息
  async updateMessage(
    id: string,
    messageData: Partial<AdminMessage>
  ): Promise<boolean> {
    try {
      const result = await getClient().execute(
        `UPDATE admin_messages SET
          title = ?, content = ?, is_published = ?, is_pinned = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          messageData.title || "",
          messageData.content || "",
          messageData.is_published || 1,
          messageData.is_pinned || 0,
          id,
        ]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to update admin message:", error);
      return false;
    }
  },

  // 刪除站長消息
  async deleteMessage(id: string): Promise<boolean> {
    try {
      const result = await getClient().execute(
        "DELETE FROM admin_messages WHERE id = ?",
        [id]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to delete admin message:", error);
      return false;
    }
  },

  // 切換站長消息的發布狀態
  async toggleMessagePublishStatus(id: string): Promise<boolean> {
    try {
      const result = await getClient().execute(
        "UPDATE admin_messages SET is_published = NOT is_published, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [id]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to toggle message publish status:", error);
      return false;
    }
  },

  // 切換站長消息的釘選狀態
  async toggleMessagePinStatus(id: string): Promise<boolean> {
    try {
      const result = await getClient().execute(
        "UPDATE admin_messages SET is_pinned = NOT is_pinned, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [id]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to toggle message pin status:", error);
      return false;
    }
  },
};

// 為了向後兼容，保留 localGameAPI 的別名
export const localGameAPI = gameAPI;
