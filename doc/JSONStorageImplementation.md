# 站長消息 JSON 檔案儲存實現

## 概述

將站長消息系統從 Cloudflare D1 遷移到 JSON 檔案儲存，實現真正的 CRUD 操作，讓開發環境中的 Garden 頁面可以真正更新消息。

## 實現架構

### 1. 數據儲存
- **位置**: `data/admin-messages.json`
- **格式**: JSON 陣列，包含完整的站長消息數據
- **持久化**: 檔案系統儲存，重啟後數據不丟失

### 2. 核心組件

#### `src/lib/json-storage.ts`
JSON 檔案管理工具，提供完整的 CRUD 操作：
- `readAdminMessages()` - 讀取所有消息
- `writeAdminMessages()` - 寫入所有消息
- `addAdminMessage()` - 添加新消息
- `updateAdminMessage()` - 更新消息
- `deleteAdminMessage()` - 刪除消息
- `togglePublishStatus()` - 切換發布狀態
- `togglePinStatus()` - 切換釘選狀態

#### `src/app/api/admin/route.ts`
RESTful API 端點：
- `GET /api/admin` - 獲取所有消息
- `POST /api/admin` - 創建新消息
- `PUT /api/admin` - 更新消息
- `DELETE /api/admin` - 刪除消息
- `PATCH /api/admin` - 切換狀態

#### `src/lib/game-api.ts`
前端 API 客戶端，使用 fetch 調用後端 API。

## 使用方式

### 1. 同步遠端數據到 JSON
```bash
# 同步遠端 D1 數據到 JSON 檔案
./scripts/sync-to-json.sh
```

### 2. 開發環境使用
```bash
# 啟動開發服務器
npm run dev

# 訪問 Garden 頁面進行消息管理
# http://localhost:3000/garden
```

### 3. API 使用範例

#### 獲取所有消息
```javascript
const response = await fetch('/api/admin');
const data = await response.json();
```

#### 創建新消息
```javascript
const response = await fetch('/api/admin', {
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

#### 更新消息
```javascript
const response = await fetch('/api/admin', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '123',
    title: '更新後的標題',
    content: '更新後的內容',
    is_published: true,
    is_pinned: false
  })
});
```

#### 切換發布狀態
```javascript
const response = await fetch('/api/admin', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '123',
    type: 'publish'
  })
});
```

## 優勢

### 1. 真正的 CRUD 操作
- 在開發環境中可以真正創建、更新、刪除消息
- 數據持久化，重啟後不會丟失
- 支援狀態切換（發布/未發布、釘選/未釘選）

### 2. 成本效益
- 完全避免 Cloudflare D1 的費用
- 不需要遠端資料庫連線
- 本地檔案系統操作，速度快

### 3. 開發體驗
- 可以在 Garden 頁面真正管理消息
- 數據變更立即生效
- 支援版本控制（JSON 檔案可以加入 Git）

## 檔案結構

```
data/
├── admin-messages.json          # 站長消息數據檔案

src/lib/
├── json-storage.ts              # JSON 檔案管理工具

scripts/
├── sync-to-json.sh              # 同步腳本

src/app/api/admin/
├── route.ts                     # API 路由
```

## 注意事項

### 1. 數據同步
- 需要定期使用 `sync-to-json.sh` 同步遠端數據
- 建議在每次開發前先同步最新數據

### 2. 版本控制
- `data/admin-messages.json` 可以加入 Git 版本控制
- 團隊成員可以共享消息數據

### 3. 生產環境
- 此實現主要適用於開發環境
- 生產環境需要考慮其他儲存方案

## 未來改進

1. **自動同步**: 實現自動同步機制
2. **數據驗證**: 添加 JSON 數據驗證
3. **備份機制**: 實現自動備份功能
4. **衝突解決**: 處理多用戶同時編輯的衝突

## 遷移步驟

1. 執行 `./scripts/sync-to-json.sh` 同步數據
2. 啟動開發服務器 `npm run dev`
3. 訪問 Garden 頁面測試 CRUD 操作
4. 確認數據持久化正常

現在您可以在開發環境中真正地管理站長消息了！🎉
