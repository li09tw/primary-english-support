import fs from "fs";
import path from "path";
import { AdminMessage } from "@/types";
import {
  getCachedMessages,
  setCachedMessages,
  clearCache,
  updateCachedMessage,
  removeCachedMessage,
} from "./json-cache";

const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "admin-messages.json");

// 確保 data 目錄存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 讀取站長消息 - 使用快取優化
export function readAdminMessages(): AdminMessage[] {
  try {
    // 先檢查快取
    const cachedMessages = getCachedMessages();
    if (cachedMessages) {
      return cachedMessages;
    }

    ensureDataDir();

    if (!fs.existsSync(MESSAGES_FILE)) {
      // 如果檔案不存在，創建空的 JSON 陣列
      writeAdminMessages([]);
      return [];
    }

    const data = fs.readFileSync(MESSAGES_FILE, "utf8");
    const messages = JSON.parse(data);

    // 轉換日期字串為 Date 物件
    const processedMessages = messages.map((msg: any) => ({
      ...msg,
      published_at: new Date(msg.published_at),
    }));

    // 設置快取
    setCachedMessages(processedMessages);

    return processedMessages;
  } catch (error) {
    console.error("讀取站長消息失敗:", error);
    return [];
  }
}

// 寫入站長消息 - 使用快取優化
export function writeAdminMessages(messages: AdminMessage[]): void {
  try {
    ensureDataDir();

    // 轉換 Date 物件為字串
    const data = messages.map((msg) => ({
      id: msg.id,
      title: msg.title,
      content: msg.content,
      is_published: msg.is_published,
      is_pinned: msg.is_pinned,
      published_at: msg.published_at.toISOString(),
    }));

    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2), "utf8");

    // 更新快取
    setCachedMessages(messages);
  } catch (error) {
    console.error("寫入站長消息失敗:", error);
    throw error;
  }
}

// 添加站長消息 - 使用快取優化
export function addAdminMessage(
  message: Omit<AdminMessage, "id" | "published_at">
): AdminMessage {
  const messages = readAdminMessages();
  const newMessage: AdminMessage = {
    ...message,
    id: Date.now().toString(),
    published_at: new Date(),
  };

  messages.push(newMessage);
  writeAdminMessages(messages);

  // 更新快取
  updateCachedMessage(newMessage);

  return newMessage;
}

// 更新站長消息 - 使用快取優化
export function updateAdminMessage(
  id: string,
  updates: Partial<AdminMessage>
): AdminMessage | null {
  const messages = readAdminMessages();
  const index = messages.findIndex((msg) => msg.id === id);

  if (index === -1) {
    return null;
  }

  const updatedMessage: AdminMessage = {
    ...messages[index],
    ...updates,
    published_at: updates.published_at || messages[index].published_at,
  };

  messages[index] = updatedMessage;
  writeAdminMessages(messages);

  // 更新快取
  updateCachedMessage(updatedMessage);

  return updatedMessage;
}

// 刪除站長消息 - 使用快取優化
export function deleteAdminMessage(id: string): boolean {
  const messages = readAdminMessages();
  const filteredMessages = messages.filter((msg) => msg.id !== id);

  if (filteredMessages.length === messages.length) {
    return false; // 沒有找到要刪除的消息
  }

  writeAdminMessages(filteredMessages);

  // 更新快取
  removeCachedMessage(id);

  return true;
}

// 切換發布狀態
export function togglePublishStatus(id: string): AdminMessage | null {
  const messages = readAdminMessages();
  const message = messages.find((msg) => msg.id === id);

  if (!message) {
    return null;
  }

  return updateAdminMessage(id, { is_published: !message.is_published });
}

// 切換釘選狀態
export function togglePinStatus(id: string): AdminMessage | null {
  const messages = readAdminMessages();
  const message = messages.find((msg) => msg.id === id);

  if (!message) {
    return null;
  }

  return updateAdminMessage(id, { is_pinned: !message.is_pinned });
}
