/**
 * @fileoverview 本地 API 模組 - 本地開發環境的遊戲 API 實現
 * @modified 2024-01-XX XX:XX - 已完成並鎖定保護
 * @modified_by Assistant
 * @modification_type feature
 * @status locked
 * @last_commit 2024-01-XX XX:XX
 * @feature 本地 API 功能已完成
 * @protection 此檔案已完成開發，禁止修改。管理員介面可透過 /garden 路徑新增遊戲方法
 */

// 本地開發環境的 API 工具函數
// 使用本地 Cloudflare Worker 與 D1 資料庫互動

import { createLocalCloudflareClient } from "./cloudflare-client-local";
import type { GameMethod, AdminMessage } from "@/types";
import { transformGameMethodsFromDB } from "./data-transform";

// 延遲創建客戶端，避免在模組載入時就檢查環境變數
let client: any = null;

function getClient() {
  if (!client) {
    try {
      client = createLocalCloudflareClient();
    } catch (error) {
      console.warn("Failed to create local Cloudflare client:", error);
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
export const localGameAPI = {
  // 獲取所有遊戲方法
  async getAllGames(): Promise<GameMethod[]> {
    try {
      console.log("🔍 localGameAPI.getAllGames() 開始執行...");
      console.log("🔗 連接到 Cloudflare Worker...");

      const result = await getClient().query(
        "SELECT * FROM game_methods ORDER BY created_at DESC"
      );

      console.log("📊 從 Worker 獲取到原始資料:", result);
      console.log("📊 回應類型:", typeof result);
      console.log("📊 回應鍵值:", Object.keys(result || {}));

      // 檢查回應格式
      if (!result.success) {
        console.error("❌ Worker 回應失敗:", result.error);
        console.error("❌ 完整回應:", result);
        return [];
      }

      if (!result.results || !Array.isArray(result.results)) {
        console.error("❌ Worker 回應格式錯誤:", result);
        return [];
      }

      console.log("🔢 原始資料數量:", result.results.length);

      const transformedGames = transformGameMethodsFromDB(result.results);
      console.log("✨ 資料轉換完成，轉換後數量:", transformedGames.length);

      return transformedGames;
    } catch (error) {
      console.error("❌ Failed to fetch games:", error);
      return [];
    }
  },

  // 獲取所有已發布的遊戲方法（本地資料庫中所有遊戲都是已發布的）
  async getPublishedGames(): Promise<GameMethod[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM game_methods ORDER BY created_at DESC"
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
      console.error(`Failed to search games with query ${query}:`, error);
      return [];
    }
  },

  // 創建新遊戲方法
  async createGame(
    game: Omit<GameMethod, "id" | "createdAt" | "updatedAt">
  ): Promise<boolean> {
    try {
      const result = await getClient().execute(
        "INSERT INTO game_methods (title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          game.title,
          game.description,
          JSON.stringify(game.categories),
          game.grade1 || false,
          game.grade2 || false,
          game.grade3 || false,
          game.grade4 || false,
          game.grade5 || false,
          game.grade6 || false,
          JSON.stringify(game.materials),
          JSON.stringify(game.instructions),
        ]
      );
      return result.success;
    } catch (error) {
      console.error("Failed to create game:", error);
      return false;
    }
  },

  // 更新遊戲方法
  async updateGame(id: string, updates: Partial<GameMethod>): Promise<boolean> {
    try {
      const fields = Object.keys(updates).filter(
        (key) => key !== "id" && key !== "created_at"
      );
      const values = fields.map((field) => updates[field as keyof GameMethod]);

      if (fields.length === 0) return false;

      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const result = await getClient().execute(
        `UPDATE game_methods SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, id]
      );
      return result.success;
    } catch (error) {
      console.error(`Failed to update game ${id}:`, error);
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
      console.error(`Failed to delete game ${id}:`, error);
      return false;
    }
  },
};

// 站長消息相關 API
export const localMessageAPI = {
  // 獲取所有站長消息
  async getAllMessages(): Promise<AdminMessage[]> {
    try {
      const result = await getClient().query(
        "SELECT * FROM admin_messages ORDER BY created_at DESC"
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
        "SELECT * FROM admin_messages WHERE status = ? ORDER BY created_at DESC",
        ["published"]
      );
      return result.results || [];
    } catch (error) {
      console.error("Failed to fetch published messages:", error);
      return [];
    }
  },
};

// 統計資訊 API
export const localStatsAPI = {
  // 獲取遊戲方法統計
  async getGameStats(): Promise<{
    total: number;
    published: number;
    draft: number;
  }> {
    try {
      const result = await getClient().query(
        "SELECT status, COUNT(*) as count FROM game_methods GROUP BY status"
      );

      const stats = { total: 0, published: 0, draft: 0 };
      result.results?.forEach((row: any) => {
        if (row.status === "published") stats.published = row.count;
        if (row.status === "draft") stats.draft = row.count;
        stats.total += row.count;
      });

      return stats;
    } catch (error) {
      console.error("Failed to fetch game stats:", error);
      return { total: 0, published: 0, draft: 0 };
    }
  },
};
