# JSON 存儲優化指南

## 概述
本文檔說明如何優化 JSON 檔案存儲系統的效能，特別針對管理員消息系統。

## 優化方法

### 1. 記憶體快取系統
- **位置**: `src/lib/json-cache.ts`
- **功能**: 在記憶體中快取數據，避免重複讀取 JSON 檔案
- **快取時間**: 5 分鐘
- **優點**: 大幅提升讀取速度，減少檔案 I/O 操作

### 2. 快取策略
```typescript
// 讀取時先檢查快取
const cachedMessages = getCachedMessages();
if (cachedMessages) {
  return cachedMessages; // 直接返回快取數據
}

// 寫入時更新快取
setCachedMessages(messages);
```

### 3. 增量更新
- 新增消息時只更新快取中的單個項目
- 刪除消息時從快取中移除對應項目
- 避免每次操作都重新讀取整個檔案

### 4. 錯誤處理與降級
- API 失敗時自動降級到 localStorage 備份
- 確保系統在各種情況下都能正常運作

## 效能提升

### 優化前
- 每次操作都要讀取 JSON 檔案
- 檔案 I/O 操作頻繁
- 載入時間較長

### 優化後
- 首次讀取後快取到記憶體
- 後續操作直接使用快取
- 載入時間大幅縮短

## 使用方式

### Garden 頁面
```typescript
// 載入消息 - 自動使用快取
const loadMessages = async () => {
  const response = await fetch("/api/admin");
  // API 內部會使用快取優化
};

// 新增消息 - 自動更新快取
const addMessage = async () => {
  await fetch("/api/admin", { method: "POST", ... });
  // 快取會自動更新
};
```

### API 路由
```typescript
// GET /api/admin - 使用快取讀取
export async function GET() {
  const messages = readAdminMessages(); // 內部使用快取
  return NextResponse.json({ data: messages });
}
```

## 監控與維護

### 快取狀態檢查
```typescript
import { getCachedMessages } from "@/lib/json-cache";

// 檢查快取是否有效
const cached = getCachedMessages();
console.log("快取狀態:", cached ? "有效" : "無效");
```

### 清除快取
```typescript
import { clearCache } from "@/lib/json-cache";

// 強制清除快取（用於測試或重置）
clearCache();
```

## 最佳實踐

1. **定期清除快取**: 在開發環境中定期清除快取以確保數據一致性
2. **監控記憶體使用**: 快取會佔用記憶體，需要監控使用情況
3. **錯誤處理**: 確保快取失敗時能降級到檔案讀取
4. **數據一致性**: 確保快取與檔案數據保持同步

## 未來優化方向

1. **Redis 快取**: 在生產環境中使用 Redis 替代記憶體快取
2. **分頁載入**: 對於大量數據實現分頁載入
3. **壓縮存儲**: 使用 gzip 壓縮 JSON 檔案
4. **異步寫入**: 實現異步寫入以提升響應速度

## 故障排除

### 快取不生效
- 檢查快取時間是否過期
- 確認快取函數是否正確調用
- 檢查記憶體使用情況

### 數據不一致
- 清除快取重新載入
- 檢查寫入操作是否正確更新快取
- 確認檔案與快取數據是否同步

### 效能問題
- 檢查快取命中率
- 監控檔案 I/O 操作頻率
- 考慮調整快取時間長度
