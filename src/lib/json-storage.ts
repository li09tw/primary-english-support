import fs from "fs";
import path from "path";
import { AdminMessage } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "admin-messages.json");

// 確保 data 目錄存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 讀取站長消息
export function readAdminMessages(): AdminMessage[] {
  try {
    ensureDataDir();

    if (!fs.existsSync(MESSAGES_FILE)) {
      // 如果檔案不存在，創建空的 JSON 陣列
      writeAdminMessages([]);
      return [];
    }

    const data = fs.readFileSync(MESSAGES_FILE, "utf8");
    const messages = JSON.parse(data);

    // 轉換日期字串為 Date 物件
    return messages.map((msg: any) => ({
      ...msg,
      createdAt: new Date(msg.created_at),
      updatedAt: msg.updated_at ? new Date(msg.updated_at) : undefined,
    }));
  } catch (error) {
    console.error("讀取站長消息失敗:", error);
    return [];
  }
}

// 寫入站長消息
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
      created_at: msg.createdAt.toISOString(),
      updated_at: msg.updatedAt?.toISOString() || msg.createdAt.toISOString(),
    }));

    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("寫入站長消息失敗:", error);
    throw error;
  }
}

// 添加站長消息
export function addAdminMessage(
  message: Omit<AdminMessage, "id" | "createdAt" | "updatedAt">
): AdminMessage {
  const messages = readAdminMessages();
  const newMessage: AdminMessage = {
    ...message,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  messages.push(newMessage);
  writeAdminMessages(messages);

  return newMessage;
}

// 更新站長消息
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
    updatedAt: new Date(),
  };

  messages[index] = updatedMessage;
  writeAdminMessages(messages);

  return updatedMessage;
}

// 刪除站長消息
export function deleteAdminMessage(id: string): boolean {
  const messages = readAdminMessages();
  const filteredMessages = messages.filter((msg) => msg.id !== id);

  if (filteredMessages.length === messages.length) {
    return false; // 沒有找到要刪除的消息
  }

  writeAdminMessages(filteredMessages);
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
