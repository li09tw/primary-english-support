import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
    return '';
  }
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

// 驗證 Email 格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 本地儲存遊戲方法
export function saveGameMethods(methods: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gameMethods', JSON.stringify(methods));
  }
}

// 本地儲存站長消息
export function saveAdminMessages(messages: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminMessages', JSON.stringify(messages));
  }
}

// 本地儲存輔具
export function saveTeachingAids(aids: any[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('teachingAids', JSON.stringify(aids));
  }
}
