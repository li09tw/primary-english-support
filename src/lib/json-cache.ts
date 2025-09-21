import { AdminMessage } from "@/types";

// 記憶體快取
let messageCache: AdminMessage[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘快取

// 檢查快取是否有效
function isCacheValid(): boolean {
  return messageCache !== null && Date.now() - cacheTimestamp < CACHE_DURATION;
}

// 獲取快取的消息
export function getCachedMessages(): AdminMessage[] | null {
  return isCacheValid() ? messageCache : null;
}

// 設置快取
export function setCachedMessages(messages: AdminMessage[]): void {
  messageCache = messages;
  cacheTimestamp = Date.now();
}

// 清除快取
export function clearCache(): void {
  messageCache = null;
  cacheTimestamp = 0;
}

// 更新快取中的單個消息
export function updateCachedMessage(updatedMessage: AdminMessage): void {
  if (messageCache) {
    const index = messageCache.findIndex((msg) => msg.id === updatedMessage.id);
    if (index !== -1) {
      messageCache[index] = updatedMessage;
    } else {
      messageCache.push(updatedMessage);
    }
  }
}

// 從快取中移除消息
export function removeCachedMessage(id: string): void {
  if (messageCache) {
    messageCache = messageCache.filter((msg) => msg.id !== id);
  }
}
