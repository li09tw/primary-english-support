# 站長消息系統遷移到本地虛擬資料庫

## 概述

為了節省 Cloudflare D1 的費用，將站長消息系統從遠端 D1 資料庫遷移到本地虛擬資料庫。

## 修改內容

### 1. API 路由修改

#### `/api/admin/route.ts`
- 移除對 Cloudflare D1 的依賴
- 改為使用本地虛擬資料庫 (`createLocalCloudflareClient`)
- 更新類型定義為 `LocalAdminMessage`
- 添加完整的 CRUD 操作（GET, POST, PUT, DELETE）

#### 新增 `/api/admin-messages/route.ts`
- 提供 RESTful API 設計
- 支援查詢參數 `published=true` 來只獲取已發布的消息
- 完整的 GET 和 POST 操作

#### 新增 `/api/admin-messages/[id]/route.ts`
- 處理單個消息的操作
- 支援 GET, PUT, DELETE 操作

#### 新增 `/api/admin-messages/[id]/toggle/route.ts`
- 專門用於切換發布狀態和釘選狀態
- 支援 `publish` 和 `pin` 兩種切換類型

### 2. 前端修改

#### `src/app/page.tsx`
- 改為使用 API 獲取站長消息
- 只顯示已發布的消息
- 添加載入狀態處理
- 保留 localStorage 作為備份機制

#### `src/app/test-admin-messages/page.tsx`
- 改為使用 API 獲取所有消息
- 添加載入狀態處理

#### `src/components/AdminMessageCard.tsx`
- 支援新的欄位：`is_published` 和 `is_pinned`
- 根據狀態顯示不同的邊框顏色和標籤
- 支援顯示更新時間

### 3. 類型定義修改

#### `src/types/index.ts`
- 更新 `AdminMessage` 介面
- 添加 `updatedAt` 欄位（可選）

### 4. 資料庫 API 修改

#### `src/lib/game-api.ts`
- 更新 `adminMessageAPI` 註解，明確使用本地虛擬資料庫

#### `src/lib/local-api.ts`
- 更新 `localMessageAPI` 查詢語句
- 修正 `is_published` 欄位查詢

## 成本效益

### 節省的成本
- 不再使用 Cloudflare D1 的讀寫操作
- 避免遠端資料庫的網路請求費用
- 減少 Cloudflare Workers 的執行時間

### 功能保持
- 所有原有功能完全保留
- 支援發布/未發布狀態管理
- 支援釘選功能
- 完整的 CRUD 操作

## 使用方式

### 1. 同步遠端數據到本地
```bash
# 使用簡化版同步腳本
./scripts/sync-admin-messages-simple.sh
```

### 2. API 使用範例

#### 獲取所有消息
```javascript
const response = await fetch('/api/admin-messages');
const data = await response.json();
```

#### 獲取已發布的消息
```javascript
const response = await fetch('/api/admin-messages?published=true');
const data = await response.json();
```

#### 創建新消息
```javascript
const response = await fetch('/api/admin-messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '新消息標題',
    content: '消息內容',
    is_published: true,
    is_pinned: false
  })
});
```

#### 切換發布狀態
```javascript
const response = await fetch('/api/admin-messages/123/toggle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'publish' })
});
```

## 注意事項

1. **數據持久性**：本地虛擬資料庫數據在開發環境重啟時會重置
2. **同步機制**：需要定期使用同步腳本更新本地數據
3. **備份機制**：前端會自動將數據保存到 localStorage 作為備份
4. **生產環境**：此修改主要適用於開發環境，生產環境需要額外考慮

## 未來改進

1. 考慮使用其他免費的資料庫服務（如 SQLite 檔案）
2. 實現自動同步機制
3. 添加數據匯出/匯入功能
4. 考慮使用 IndexedDB 作為本地存儲
