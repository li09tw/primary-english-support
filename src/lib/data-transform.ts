/**
 * @fileoverview 資料轉換模組 - 處理資料庫與前端資料格式轉換
 * @modified 2024-01-XX XX:XX - 已完成並鎖定保護
 * @modified_by Assistant
 * @modification_type feature
 * @status locked
 * @last_commit 2024-01-XX XX:XX
 * @feature 資料轉換邏輯已完成
 * @protection 此檔案已完成開發，禁止修改。管理員介面可透過 /garden 路徑新增遊戲方法
 */

// 資料轉換工具函數
// 將資料庫中的原始資料轉換為符合 TypeScript 類型的格式

import type { GameMethod } from "@/types";

// 將資料庫中的遊戲方法資料轉換為 GameMethod 類型
export function transformGameMethodFromDB(dbGame: any): GameMethod {
  return {
    id: dbGame.id,
    title: dbGame.title,
    description: dbGame.description,
    category: dbGame.category || parseJSONArray(dbGame.categories)[0] || "",
    categories: parseJSONArray(dbGame.categories),
    grades: convertGradesToArray(dbGame),
    grade1: Boolean(dbGame.grade1),
    grade2: Boolean(dbGame.grade2),
    grade3: Boolean(dbGame.grade3),
    grade4: Boolean(dbGame.grade4),
    grade5: Boolean(dbGame.grade5),
    grade6: Boolean(dbGame.grade6),
    materials: parseJSONArray(dbGame.materials),
    instructions: parseJSONArray(dbGame.instructions),
    steps: dbGame.steps || parseJSONArray(dbGame.instructions).join("\n") || "",
    tips: dbGame.tips || "",
    is_published:
      dbGame.is_published !== undefined ? Boolean(dbGame.is_published) : true,
    createdAt: new Date(dbGame.created_at),
    updatedAt: new Date(dbGame.updated_at),
  };
}

// 將年級布林值轉換為年級陣列
function convertGradesToArray(dbGame: any): string[] {
  const grades: string[] = [];
  if (dbGame.grade1) grades.push("grade1");
  if (dbGame.grade2) grades.push("grade2");
  if (dbGame.grade3) grades.push("grade3");
  if (dbGame.grade4) grades.push("grade4");
  if (dbGame.grade5) grades.push("grade5");
  if (dbGame.grade6) grades.push("grade6");
  return grades;
}

// 安全地解析 JSON 陣列字串
function parseJSONArray(jsonString: string): string[] {
  try {
    if (typeof jsonString === "string") {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.warn("Failed to parse JSON array:", jsonString, error);
    return [];
  }
}

// 將多個遊戲方法資料轉換為陣列
export function transformGameMethodsFromDB(dbGames: any[]): GameMethod[] {
  return dbGames.map(transformGameMethodFromDB);
}
