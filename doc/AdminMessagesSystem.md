# 站長消息系統使用指南

## 概述

站長消息系統允許管理員發布和管理網站上的重要公告和消息。系統包含完整的 CRUD 操作，支持發布狀態管理，並提供 mock 資料庫檢視功能。

## 功能特色

- ✅ 新增、編輯、刪除站長消息
- ✅ 發布/下架狀態管理
- ✅ 日期格式化顯示（YYYY/MM/DD）
- ✅ Mock 資料庫檢視頁面
- ✅ 完整的管理者介面
- ✅ 本地儲存支援

## 檔案結構

```
src/
├── app/
│   ├── garden/page.tsx          # 管理者頁面（包含消息管理）
│   └── test-admin-messages/     # Mock 資料庫檢視頁面
├── types/index.ts               # 類型定義
└── lib/utils.ts                 # 工具函數

scripts/
├── create-admin-messages-mock.sql  # SQL 腳本
└── deploy-admin-messages.sh        # 部署腳本

doc/
└── AdminMessagesSystem.md          # 本文檔
```

## 資料庫結構

### admin_messages 表

```sql
CREATE TABLE IF NOT EXISTS admin_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL
);
```

**欄位說明：**
- `id`: 唯一識別碼
- `title`: 消息標題
- `content`: 消息內容（支援換行）
- `is_published`: 發布狀態（true=已發布，false=未發布）
- `created_at`: 創建時間（ISO 8601 格式）

## 使用方式

### 1. 檢視 Mock 資料庫

訪問 `/test-admin-messages` 頁面來檢視所有站長消息：

- 顯示所有消息的標題、內容和狀態
- 已發布消息顯示綠色邊框
- 未發布消息顯示紅色邊框
- 日期格式：YYYY/MM/DD

### 2. 管理站長消息

前往 `/garden` 頁面，切換到「站長消息」標籤：

#### 新增消息
1. 點擊「新增管理員消息」按鈕
2. 填寫標題和內容
3. 點擊「新增消息」按鈕

#### 編輯消息
1. 點擊消息卡片上的「編輯」按鈕
2. 修改標題或內容
3. 點擊「更新」按鈕

#### 刪除消息
1. 點擊消息卡片上的「刪除」按鈕
2. 確認刪除操作

#### 發布/下架
1. 點擊「發布」或「下架」按鈕
2. 狀態會即時更新

### 3. 部署到 D1 資料庫

使用提供的部署腳本：

```bash
# 執行部署腳本
./scripts/deploy-admin-messages.sh
```

腳本會：
- 檢查 wrangler 是否已安裝
- 執行 SQL 腳本建立表和插入資料
- 顯示部署結果和相關資訊

## 技術細節

### 類型定義

```typescript
export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  createdAt: Date;
}
```

### 本地儲存

- 使用 `localStorage` 儲存消息資料
- 鍵值：`adminMessages`
- 格式：JSON 字串

### 日期處理

- 輸入：ISO 8601 格式字串
- 顯示：台灣地區格式（YYYY/MM/DD）
- 使用 `toLocaleDateString('zh-TW')` 格式化

## 範例資料

部署腳本會自動插入 4 筆範例資料：

1. **歡迎使用國小英語支援！** - 已發布
2. **新增多個互動遊戲方法** - 已發布  
3. **系統維護通知** - 未發布
4. **新功能上線：句型拉霸機** - 已發布

## 注意事項

- 所有變更會即時儲存到本地儲存
- 刪除操作需要確認
- 編輯時會自動填入現有內容
- 發布狀態變更會即時反映在 UI 上
- 日期顯示統一使用台灣地區格式

## 未來擴展

- [ ] 支援圖片和附件
- [ ] 消息分類和標籤
- [ ] 發布排程功能
- [ ] 消息搜尋和篩選
- [ ] 用戶訂閱通知
- [ ] 消息統計分析

## 相關連結

- [管理者頁面](/garden)
- [Mock 檢視頁面](/test-admin-messages)
- [專案首頁](/)
