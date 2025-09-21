/**
 * @fileoverview 工具函數模組 - 提供通用的工具函數和輔助方法
 * @modified 2024-01-XX XX:XX - 已完成並鎖定保護
 * @modified_by Assistant
 * @modification_type feature
 * @status locked
 * @last_commit 2024-01-XX XX:XX
 * @feature 工具函數已完成
 * @protection 此檔案已完成開發，禁止修改。管理員介面可透過 /garden 路徑新增遊戲方法
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 合併 Tailwind CSS 類別
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 生成唯一 ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// 格式化日期（容錯：支援 Date、字串、數字，避免 Invalid time value）
export function formatDate(date: Date | string | number): string {
  const parsed = date instanceof Date ? date : new Date(date);
  if (isNaN(parsed.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

// 驗證 Email 格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 保存遊戲方法到本地儲存
export function saveGameMethods(games: any[]): void {
  try {
    localStorage.setItem("gameMethods", JSON.stringify(games));
  } catch (error) {
    console.error("Error saving game methods:", error);
  }
}

// 保存站長消息到本地儲存
export function saveAdminMessages(messages: any[]): void {
  try {
    localStorage.setItem("adminMessages", JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving admin messages:", error);
  }
}

// 保存教材資料到本地儲存
export function saveTextbooks(textbooks: any[]): void {
  try {
    localStorage.setItem("textbooks", JSON.stringify(textbooks));
  } catch (error) {
    console.error("Error saving textbooks:", error);
  }
}

// 從本地儲存讀取教材資料
export function loadTextbooks(): any[] {
  try {
    const saved = localStorage.getItem("textbooks");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading textbooks:", error);
    return [];
  }
}
