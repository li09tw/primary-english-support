# 管理系統完整指南

## 概述

本文件整合了 Primary English Support 專案的所有管理系統相關文檔，包括站長消息系統、安全驗證系統、資料庫遷移等內容。

## 📢 站長消息系統

### 功能特色

站長消息系統允許管理員發布和管理網站上的重要公告和消息。系統包含完整的 CRUD 操作，支持發布狀態管理，並提供 mock 資料庫檢視功能。

- ✅ 新增、編輯、刪除站長消息
- ✅ 發布/下架狀態管理
- ✅ 日期格式化顯示（YYYY/MM/DD）
- ✅ Mock 資料庫檢視頁面
- ✅ 完整的管理者介面
- ✅ 本地儲存支援

### 檔案結構

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

## 🔒 安全驗證系統

### 概述

Garden 頁面現在需要帳號驗證才能訪問，使用企業級安全驗證系統確保安全性。

### 功能特點

- **密碼雜湊**：使用 bcrypt 進行安全的密碼雜湊和加鹽
- **會話管理**：使用 Next.js 的 cookies() 和安全的 HTTP-only cookies
- **速率限制**：防止暴力破解和帳戶枚舉攻擊
- **帳戶鎖定**：5次失敗後鎖定30分鐘
- **驗證碼安全**：15分鐘時效，一次性使用，重新發送時舊碼失效
- **XSS 防護**：輸入清理和輸出編碼
- **SQL Injection 防護**：參數化查詢
- **CORS 防護**：適當的安全標頭設定

### 快速部署

#### 1. 安裝依賴
```bash
npm install
```

#### 2. 設定環境變數
複製 `env.example` 到 `.env.local` 並設定：

```bash
# Cloudflare 配置
CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
CLOUDFLARE_API_SECRET=your-secret-key

# EmailJS 配置
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key

# 安全設定
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### 3. 部署資料庫
```bash
# 設定環境變數
export CLOUDFLARE_ACCOUNT_ID=your-account-id
export CLOUDFLARE_API_TOKEN=your-api-token
export DATABASE_NAME=your-database-name

# 執行部署腳本
chmod +x scripts/deploy-secure-verification-system.sh
./scripts/deploy-secure-verification-system.sh
```

#### 4. 部署到 Vercel
```bash
npm run build
npm run deploy:vercel
```

### 系統架構

#### 資料庫結構
```sql
-- 管理員帳號表
admin_accounts (
  id, username, email, password_hash, salt,
  is_active, is_locked, lock_expires_at,
  failed_attempts, last_failed_attempt,
  created_at, updated_at
)

-- 驗證碼表
verification_codes (
  id, account_id, code_hash, expires_at,
  is_used, created_at
)

-- 會話管理表
admin_sessions (
  id, account_id, session_token, expires_at,
  ip_address, user_agent, created_at
)

-- 登入嘗試記錄表
login_attempts (
  id, ip_address, username, attempt_type,
  success, created_at
)
```

#### API 路由
- `POST /api/auth/login` - 密碼登入
- `POST /api/auth/verification` - 發送驗證碼
- `PUT /api/auth/verification` - 驗證驗證碼
- `GET /api/auth/session` - 檢查會話狀態
- `DELETE /api/auth/session` - 登出

#### 中間件保護
- `/garden/*` - 需要完整驗證
- `/api/*` - API 路由保護（除公開路由外）

### 安全特性詳解

#### 1. 密碼安全
```typescript
// 使用 bcrypt 進行密碼雜湊
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password + salt, 12);

// 驗證密碼
const isValid = bcrypt.compareSync(password + salt, hash);
```

**安全特點：**
- 12輪鹽值生成（可調整）
- 密碼 + 鹽值進行雜湊
- 無法從雜湊值反推原始密碼

#### 2. 會話管理
```typescript
// 設定安全的 HTTP-only Cookie
cookies().set("garden_session", sessionToken, {
  httpOnly: true,           // 防止 XSS 竊取
  secure: true,             // 僅 HTTPS 傳輸
  sameSite: "strict",       // 防止 CSRF 攻擊
  expires: expiresAt,       // 24小時過期
  path: "/",                // 限制路徑
});
```

**安全特點：**
- HTTP-only：JavaScript 無法讀取
- Secure：僅在 HTTPS 下傳輸
- SameSite：防止跨站請求偽造
- 自動過期和清理

#### 3. 速率限制
```typescript
// 登入失敗限制
const RATE_LIMIT = {
  LOGIN_ATTEMPTS: 5,           // 5次失敗後鎖定
  LOCK_DURATION_MINUTES: 30,   // 鎖定30分鐘
  CODE_REQUEST_LIMIT: 3,       // 15分鐘內最多3次
  CODE_REQUEST_WINDOW: 15,     // 15分鐘視窗
};
```

**防護機制：**
- 帳戶鎖定：防止暴力破解
- 驗證碼限制：防止濫用
- IP 追蹤：識別攻擊來源

#### 4. 輸入驗證
```typescript
// XSS 防護：清理危險字符
const cleanInput = input.trim().replace(/[<>\"'&]/g, "");

// SQL Injection 防護：參數化查詢
const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
const result = stmt.all([username]);
```

**安全特點：**
- 輸入清理：移除危險 HTML 標籤
- 參數化查詢：防止 SQL 注入
- 類型檢查：確保資料格式正確

#### 5. 安全標頭
```typescript
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};
```

**防護機制：**
- 防止 MIME 類型嗅探
- 防止點擊劫持
- XSS 防護
- 控制 referrer 資訊
- 防止快取敏感資料

### 使用者體驗流程

#### 1. 登入流程
```
使用者 → 輸入帳號密碼 → 密碼驗證 → 發送驗證碼 → 輸入驗證碼 → 進入系統
```

#### 2. 安全檢查點
- **帳號存在性**：無論帳號是否存在，都回傳相同錯誤訊息
- **密碼驗證**：使用安全的雜湊比對
- **帳戶狀態**：檢查是否被鎖定或停用
- **會話建立**：生成安全的會話令牌
- **驗證碼發送**：透過 EmailJS 發送

#### 3. 錯誤處理
```typescript
// 統一的錯誤訊息（防止帳號枚舉）
return NextResponse.json(
  { success: false, message: "帳號或密碼錯誤" },
  { status: 401 }
);
```

## 🔄 資料庫遷移

### 站長消息系統遷移到本地虛擬資料庫

#### 概述
為了節省 Cloudflare D1 的費用，將站長消息系統從遠端 D1 資料庫遷移到本地虛擬資料庫。

#### 修改內容

##### 1. API 路由修改
- **`/api/admin/route.ts`**: 移除對 Cloudflare D1 的依賴，改為使用本地虛擬資料庫
- **新增 `/api/admin-messages/route.ts`**: 提供 RESTful API 設計
- **新增 `/api/admin-messages/[id]/route.ts`**: 處理單個消息的操作
- **新增 `/api/admin-messages/[id]/toggle/route.ts`**: 專門用於切換發布狀態和釘選狀態

##### 2. 前端修改
- **`src/app/page.tsx`**: 改為使用 API 獲取站長消息
- **`src/app/test-admin-messages/page.tsx`**: 改為使用 API 獲取所有消息
- **`src/components/AdminMessageCard.tsx`**: 支援新的欄位和狀態顯示

##### 3. 類型定義修改
- **`src/types/index.ts`**: 更新 `AdminMessage` 介面，添加 `updatedAt` 欄位

#### 成本效益

##### 節省的成本
- 不再使用 Cloudflare D1 的讀寫操作
- 避免遠端資料庫的網路請求費用
- 減少 Cloudflare Workers 的執行時間

##### 功能保持
- 所有原有功能完全保留
- 支援發布/未發布狀態管理
- 支援釘選功能
- 完整的 CRUD 操作

#### 使用方式

##### 1. 同步遠端數據到本地
```bash
# 使用簡化版同步腳本
./scripts/sync-admin-messages-simple.sh
```

##### 2. API 使用範例

**獲取所有消息**
```javascript
const response = await fetch('/api/admin-messages');
const data = await response.json();
```

**獲取已發布的消息**
```javascript
const response = await fetch('/api/admin-messages?published=true');
const data = await response.json();
```

**創建新消息**
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

**切換發布狀態**
```javascript
const response = await fetch('/api/admin-messages/123/toggle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'publish' })
});
```

#### 注意事項

1. **數據持久性**：本地虛擬資料庫數據在開發環境重啟時會重置
2. **同步機制**：需要定期使用同步腳本更新本地數據
3. **備份機制**：前端會自動將數據保存到 localStorage 作為備份
4. **生產環境**：此修改主要適用於開發環境，生產環境需要額外考慮

## 🛠️ 維護和監控

### 1. 定期清理

```sql
-- 清理過期會話
DELETE FROM admin_sessions WHERE expires_at < datetime('now');

-- 清理過期驗證碼
DELETE FROM verification_codes WHERE expires_at < datetime('now');

-- 清理舊的登入記錄
DELETE FROM login_attempts WHERE created_at < datetime('now', '-30 days');
```

### 2. 安全監控

- 監控登入失敗次數
- 追蹤異常 IP 位址
- 檢查會話異常
- 監控驗證碼濫用

### 3. 密碼更新

```bash
# 生成新的密碼雜湊
node scripts/generate-admin-password.js "new-password"
```

## 🚨 故障排除

### 常見問題

1. **會話驗證失敗**
   - 檢查 Cookie 設定
   - 確認資料庫連線
   - 檢查中間件配置

2. **驗證碼無法發送**
   - 檢查 EmailJS 設定
   - 確認信箱地址正確
   - 檢查速率限制

3. **登入被鎖定**
   - 等待鎖定時間結束
   - 檢查失敗嘗試記錄
   - 手動重置鎖定狀態

### 除錯工具

```bash
# 檢查會話狀態
curl -H "Cookie: garden_session=your-token" /api/auth/session

# 檢查資料庫連線
npm run test:cloudflare

# 查看部署日誌
vercel logs
```

## 🔒 安全最佳實踐

### 1. 生產環境設定

- 使用強密碼（至少12位）
- 啟用 HTTPS
- 定期更新依賴套件
- 監控安全日誌

### 2. 密碼政策

- 最小長度：12位
- 包含：大小寫字母、數字、特殊字符
- 定期更換：90天
- 不重複使用

### 3. 會話安全

- 24小時自動過期
- 登出時立即清除
- 異常活動檢測
- 多裝置管理

## 相關連結

- [管理者頁面](/garden)
- [Mock 檢視頁面](/test-admin-messages)
- [專案首頁](/)
