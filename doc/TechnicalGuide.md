# 技術指南

## 概述

本文件整合了 Primary English Support 專案的所有技術相關文檔，包括架構設計、API 設計、資料庫結構、安全機制、開發流程等技術細節。

## 🏗️ 系統架構

### 整體架構

Primary English Support 採用 Vercel + Cloudflare 的混合架構：

```
用戶請求 → Vercel (Next.js) → Cloudflare Worker → Cloudflare D1/R2
```

### 技術棧

#### 前端技術
- **Next.js 14**: React 框架，使用 App Router
- **TypeScript**: 類型安全的 JavaScript
- **Tailwind CSS**: 現代化 CSS 框架
- **響應式設計**: 支援各種裝置尺寸

#### 後端技術
- **Vercel**: 前端部署平台
- **Cloudflare Worker**: API 閘道
- **Cloudflare D1**: SQLite 資料庫
- **Cloudflare R2**: 物件存儲

#### 開發工具
- **Wrangler**: Cloudflare 開發工具
- **Vercel CLI**: Vercel 部署工具
- **ESLint**: 程式碼檢查
- **Prettier**: 程式碼格式化

## 🔧 核心組件

### 1. Cloudflare Worker API 閘道

**位置**: `functions/api-gateway.js`

**功能**:
- 處理來自 Vercel 的 D1 和 R2 請求
- 提供統一的 API 介面
- 處理認證和授權
- 執行資料庫操作

**配置**:
- `wrangler-api-gateway.toml` (生產環境)
- `wrangler-dev.toml` (開發環境)

### 2. Cloudflare 服務客戶端

**位置**: `src/lib/cloudflare-client.ts`

**功能**:
- 從 Vercel 呼叫 Cloudflare 服務的客戶端
- 類型安全的 API 呼叫
- 錯誤處理和重試機制
- 認證管理

### 3. Next.js API 路由

**位置**: `src/app/api/`

**功能**:
- 處理前端請求
- 透過客戶端呼叫 Cloudflare 服務
- 強制動態路由
- 錯誤處理和資料轉換

## 📊 資料庫設計

### 資料庫架構

Primary English Support 使用 Cloudflare D1 (SQLite) 作為主要資料庫，採用關聯式資料庫設計，支援複雜的查詢和資料關聯。

### 資料庫特性

- **類型**: SQLite (透過 Cloudflare D1)
- **部署**: Cloudflare 邊緣網路
- **備份**: 自動備份和版本控制
- **擴展**: 支援水平擴展
- **性能**: 低延遲查詢

### 核心業務表

#### 1. 遊戲方法表 (game_methods)
```sql
CREATE TABLE game_methods (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  materials TEXT,
  instructions TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**欄位說明**:
- `id`: 唯一識別碼 (UUID)
- `title`: 遊戲方法標題
- `description`: 遊戲方法描述
- `category`: 遊戲分類 (單字學習、句型練習、口語訓練)
- `difficulty`: 難度等級 (簡單、中等、困難)
- `materials`: 所需材料
- `instructions`: 操作說明
- `is_published`: 發布狀態
- `created_at`: 創建時間
- `updated_at`: 更新時間

#### 2. 學習輔助表 (teaching_aids)
```sql
CREATE TABLE teaching_aids (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  materials TEXT,
  instructions TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**欄位說明**:
- `id`: 唯一識別碼 (UUID)
- `title`: 輔具標題
- `description`: 輔具描述
- `subject`: 科目 (英語、數學、自然等)
- `grade_level`: 年級 (1-6年級)
- `materials`: 所需材料
- `instructions`: 使用說明
- `is_published`: 發布狀態
- `created_at`: 創建時間
- `updated_at`: 更新時間

#### 3. 管理員消息表 (admin_messages)
```sql
CREATE TABLE admin_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TEXT NOT NULL
);
```

**欄位說明**:
- `id`: 唯一識別碼 (UUID)
- `title`: 消息標題
- `content`: 消息內容 (支援換行)
- `is_published`: 發布狀態
- `created_at`: 創建時間

### 學習內容系統表

#### 1. 年級表 (grades)
```sql
CREATE TABLE grades (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

**預設資料**:
```sql
INSERT INTO grades (id, name) VALUES
(1, 'Grade 1'),
(2, 'Grade 2'),
(3, 'Grade 3'),
(4, 'Grade 4'),
(5, 'Grade 5'),
(6, 'Grade 6');
```

#### 2. 單字主題表 (word_themes)
```sql
CREATE TABLE word_themes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

**預設主題**:
```sql
INSERT INTO word_themes (id, name) VALUES
(1, 'Emotions'),
(2, 'Colors'),
(3, 'Sports'),
(4, 'Stationery'),
(5, 'Fruits'),
(6, 'Fast Food'),
(7, 'Bakery & Snacks'),
(8, 'Days of the Week'),
(9, 'Months'),
(10, 'School Subjects'),
(11, 'Ailments'),
(12, 'Countries'),
(13, 'Furniture'),
(14, 'Toys'),
(15, 'Drinks'),
(16, 'Main Dishes'),
(17, 'Bubble Tea Toppings');
```

#### 3. 單字表 (words)
```sql
CREATE TABLE words (
  id INTEGER PRIMARY KEY,
  english_singular TEXT NOT NULL,
  english_plural TEXT,
  chinese_meaning TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT
);
```

**欄位說明**:
- `id`: 唯一識別碼
- `english_singular`: 英文單數形式
- `english_plural`: 英文複數形式 (可選)
- `chinese_meaning`: 中文翻譯
- `part_of_speech`: 詞性 (noun, verb, adjective, adverb, preposition)
- `image_url`: 圖片 URL (可選)
- `audio_url`: 音頻 URL (可選)

#### 4. 句型模式表 (sentence_patterns)
```sql
CREATE TABLE sentence_patterns (
  id INTEGER PRIMARY KEY,
  grade_id INTEGER NOT NULL,
  pattern_text TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (grade_id) REFERENCES grades(id)
);
```

**欄位說明**:
- `id`: 唯一識別碼
- `grade_id`: 年級 ID (外鍵)
- `pattern_text`: 句型模式文字 (包含空白)
- `pattern_type`: 句型類型 (Question, Statement, Response)
- `notes`: 備註

#### 5. 句型模式空格表 (pattern_slots)
```sql
CREATE TABLE pattern_slots (
  id INTEGER PRIMARY KEY,
  pattern_id INTEGER NOT NULL,
  slot_index INTEGER NOT NULL,
  required_part_of_speech TEXT NOT NULL,
  FOREIGN KEY (pattern_id) REFERENCES sentence_patterns(id)
);
```

**欄位說明**:
- `id`: 唯一識別碼
- `pattern_id`: 句型模式 ID (外鍵)
- `slot_index`: 空格位置索引
- `required_part_of_speech`: 所需詞性

### 關聯表

#### 單字主題關聯表 (word_theme_associations)
```sql
CREATE TABLE word_theme_associations (
  word_id INTEGER NOT NULL,
  theme_id INTEGER NOT NULL,
  PRIMARY KEY (word_id, theme_id),
  FOREIGN KEY (word_id) REFERENCES words(id),
  FOREIGN KEY (theme_id) REFERENCES word_themes(id)
);
```

**用途**: 建立單字與主題的多對多關聯

### 安全驗證系統表

#### 1. 管理員帳號表 (admin_accounts)
```sql
CREATE TABLE admin_accounts (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_locked BOOLEAN DEFAULT FALSE,
  lock_expires_at TEXT,
  failed_attempts INTEGER DEFAULT 0,
  last_failed_attempt TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

#### 2. 驗證碼表 (verification_codes)
```sql
CREATE TABLE verification_codes (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id)
);
```

#### 3. 會話管理表 (admin_sessions)
```sql
CREATE TABLE admin_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id)
);
```

#### 4. 登入嘗試記錄表 (login_attempts)
```sql
CREATE TABLE login_attempts (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  username TEXT,
  attempt_type TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  created_at TEXT NOT NULL
);
```

## 🔧 資料庫操作

### 基本查詢

#### 1. 獲取所有遊戲方法
```sql
SELECT * FROM game_methods 
WHERE is_published = TRUE 
ORDER BY created_at DESC;
```

#### 2. 依分類獲取遊戲方法
```sql
SELECT * FROM game_methods 
WHERE category = ? AND is_published = TRUE 
ORDER BY difficulty, title;
```

#### 3. 獲取單字主題
```sql
SELECT * FROM word_themes 
ORDER BY id;
```

#### 4. 依主題獲取單字
```sql
SELECT w.* FROM words w
JOIN word_theme_associations wta ON w.id = wta.word_id
WHERE wta.theme_id = ?
ORDER BY w.english_singular;
```

#### 5. 獲取句型模式
```sql
SELECT sp.*, ps.slot_index, ps.required_part_of_speech
FROM sentence_patterns sp
LEFT JOIN pattern_slots ps ON sp.id = ps.pattern_id
WHERE sp.grade_id = ?
ORDER BY sp.id, ps.slot_index;
```

### 進階查詢

#### 1. 搜尋遊戲方法
```sql
SELECT * FROM game_methods 
WHERE (title LIKE ? OR description LIKE ?) 
AND is_published = TRUE 
ORDER BY 
  CASE 
    WHEN title LIKE ? THEN 1
    WHEN description LIKE ? THEN 2
    ELSE 3
  END,
  created_at DESC;
```

#### 2. 獲取隨機單字
```sql
SELECT w.* FROM words w
JOIN word_theme_associations wta ON w.id = wta.word_id
WHERE wta.theme_id = ?
ORDER BY RANDOM()
LIMIT ?;
```

#### 3. 統計資料
```sql
-- 遊戲方法統計
SELECT 
  category,
  difficulty,
  COUNT(*) as count
FROM game_methods 
WHERE is_published = TRUE 
GROUP BY category, difficulty;

-- 單字主題統計
SELECT 
  wt.name as theme_name,
  COUNT(wta.word_id) as word_count
FROM word_themes wt
LEFT JOIN word_theme_associations wta ON wt.id = wta.theme_id
GROUP BY wt.id, wt.name
ORDER BY word_count DESC;
```

## 🚀 資料庫遷移

### 遷移腳本

#### 1. 建立基本表結構
```bash
# 執行基本表結構遷移
./scripts/deploy-d1-schema.sh
```

#### 2. 新增功能遷移
```bash
# 新增驗證系統
./scripts/deploy-verification-system.sh

# 新增安全驗證系統
./scripts/deploy-secure-verification-system.sh

# 新增時間表達
./scripts/deploy-time-expressions.sh

# 新增單字主題
./scripts/deploy-word-themes.sh
```

#### 3. 管理員消息遷移
```bash
# 部署管理員消息系統
./scripts/deploy-admin-messages.sh
```

### 遷移最佳實踐

1. **備份資料**: 遷移前先備份現有資料
2. **測試環境**: 先在測試環境驗證遷移
3. **逐步遷移**: 分步驟執行複雜遷移
4. **回滾計劃**: 準備回滾方案
5. **監控結果**: 遷移後監控系統狀態

## 🔍 資料庫維護

### 定期清理

#### 1. 清理過期會話
```sql
DELETE FROM admin_sessions 
WHERE expires_at < datetime('now');
```

#### 2. 清理過期驗證碼
```sql
DELETE FROM verification_codes 
WHERE expires_at < datetime('now');
```

#### 3. 清理舊的登入記錄
```sql
DELETE FROM login_attempts 
WHERE created_at < datetime('now', '-30 days');
```

### 性能優化

#### 1. 建立索引
```sql
-- 遊戲方法索引
CREATE INDEX idx_game_methods_category ON game_methods(category);
CREATE INDEX idx_game_methods_difficulty ON game_methods(difficulty);
CREATE INDEX idx_game_methods_published ON game_methods(is_published);

-- 單字主題關聯索引
CREATE INDEX idx_word_theme_associations_theme ON word_theme_associations(theme_id);
CREATE INDEX idx_word_theme_associations_word ON word_theme_associations(word_id);

-- 句型模式索引
CREATE INDEX idx_sentence_patterns_grade ON sentence_patterns(grade_id);
CREATE INDEX idx_pattern_slots_pattern ON pattern_slots(pattern_id);
```

#### 2. 查詢優化
- 使用適當的 WHERE 條件
- 避免 SELECT *
- 使用 LIMIT 限制結果
- 利用索引加速查詢

### 監控和警報

#### 1. 性能監控
- 監控查詢執行時間
- 追蹤慢查詢
- 監控資料庫大小

#### 2. 錯誤監控
- 監控 SQL 錯誤
- 追蹤連接失敗
- 監控鎖定問題

## 🚨 資料庫故障排除

### 常見問題

#### 1. 連接問題
**症狀**: 無法連接到資料庫
**解決方法**:
- 檢查 Cloudflare 帳戶狀態
- 確認 D1 資料庫綁定
- 檢查 wrangler.toml 配置

#### 2. 查詢超時
**症狀**: 查詢執行時間過長
**解決方法**:
- 檢查查詢語法
- 優化查詢條件
- 建立適當索引

#### 3. 資料不一致
**症狀**: 資料不完整或錯誤
**解決方法**:
- 檢查外鍵約束
- 驗證資料完整性
- 執行資料修復

#### 4. 權限問題
**症狀**: 無法執行某些操作
**解決方法**:
- 檢查資料庫權限
- 確認 API 密鑰
- 檢查 Worker 配置

### 除錯工具

#### 1. 查詢分析
```sql
-- 分析查詢執行計劃
EXPLAIN QUERY PLAN SELECT * FROM game_methods WHERE category = '單字學習';

-- 檢查索引使用情況
EXPLAIN QUERY PLAN SELECT * FROM words w 
JOIN word_theme_associations wta ON w.id = wta.word_id 
WHERE wta.theme_id = 1;
```

#### 2. 資料庫狀態檢查
```sql
-- 檢查資料庫大小
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();

-- 檢查表統計
SELECT name, sql FROM sqlite_master WHERE type = 'table';

-- 檢查索引
SELECT name, sql FROM sqlite_master WHERE type = 'index';
```

## 📊 資料庫統計

### 當前資料量

- **遊戲方法**: 100+ 筆
- **學習輔助**: 50+ 筆
- **單字**: 500+ 筆
- **句型模式**: 50+ 筆
- **主題**: 17 個

### 性能指標

- **平均查詢時間**: < 100ms
- **並發連接**: 支援 100+ 連接
- **資料庫大小**: < 10MB
- **備份頻率**: 每日自動備份

## 🔮 資料庫未來規劃

### 短期目標
- 優化查詢性能
- 增加更多索引
- 實作查詢快取

### 長期目標
- 考慮分庫分表
- 實作讀寫分離
- 增加資料分析功能

## 🔒 安全機制

### 安全架構

Primary English Support 採用多層次安全防護架構，確保系統和用戶資料的安全：

```
用戶層 → 應用層 → API層 → 資料庫層 → 基礎設施層
```

### 安全原則

1. **最小權限原則**: 只授予必要的權限
2. **深度防禦**: 多層次安全防護
3. **零信任架構**: 不信任任何請求
4. **安全預設**: 預設安全配置
5. **持續監控**: 實時安全監控

### 認證系統

#### 安全驗證系統

**系統特性**:

- **密碼雜湊**: 使用 bcrypt 進行安全的密碼雜湊和加鹽
- **會話管理**: 使用 Next.js 的 cookies() 和安全的 HTTP-only cookies
- **速率限制**: 防止暴力破解和帳戶枚舉攻擊
- **帳戶鎖定**: 5次失敗後鎖定30分鐘
- **驗證碼安全**: 15分鐘時效，一次性使用，重新發送時舊碼失效
- **XSS 防護**: 輸入清理和輸出編碼
- **SQL Injection 防護**: 參數化查詢
- **CORS 防護**: 適當的安全標頭設定

#### 密碼安全

```typescript
// 使用 bcrypt 進行密碼雜湊
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password + salt, 12);

// 驗證密碼
const isValid = bcrypt.compareSync(password + salt, hash);
```

**安全特點**:
- 12輪鹽值生成（可調整）
- 密碼 + 鹽值進行雜湊
- 無法從雜湊值反推原始密碼

#### 會話管理

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

**安全特點**:
- HTTP-only：JavaScript 無法讀取
- Secure：僅在 HTTPS 下傳輸
- SameSite：防止跨站請求偽造
- 自動過期和清理

### 速率限制

```typescript
const RATE_LIMIT = {
  LOGIN_ATTEMPTS: 5,           // 5次失敗後鎖定
  LOCK_DURATION_MINUTES: 30,   // 鎖定30分鐘
  CODE_REQUEST_LIMIT: 3,       // 15分鐘內最多3次
  CODE_REQUEST_WINDOW: 15,     // 15分鐘視窗
};
```

**防護機制**:
- 帳戶鎖定：防止暴力破解
- 驗證碼限制：防止濫用
- IP 追蹤：識別攻擊來源

## 🛡️ 輸入驗證

### XSS 防護

```typescript
// XSS 防護：清理危險字符
const cleanInput = input.trim().replace(/[<>\"'&]/g, "");

// 輸出編碼
const encodeOutput = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
```

### SQL Injection 防護

```typescript
// SQL Injection 防護：參數化查詢
const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
const result = stmt.all([username]);

// 使用參數化查詢
const stmt = db.prepare(`
  INSERT INTO game_methods (id, title, description, category, difficulty)
  VALUES (?, ?, ?, ?, ?)
`);
stmt.run([id, title, description, category, difficulty]);
```

### 輸入驗證

```typescript
// 驗證輸入格式
const validateInput = (input: any, type: string) => {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'username':
      return /^[a-zA-Z0-9_]{3,20}$/.test(input);
    case 'password':
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input);
    default:
      return false;
  }
};
```

## 🔒 安全標頭

### HTTP 安全標頭

```typescript
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
};
```

**防護機制**:
- 防止 MIME 類型嗅探
- 防止點擊劫持
- XSS 防護
- 控制 referrer 資訊
- 防止快取敏感資料
- 強制 HTTPS
- 內容安全政策

### CORS 設定

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-domain.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};
```

## 🔍 安全監控

### 登入嘗試監控

```typescript
// 記錄登入嘗試
const logLoginAttempt = async (ip: string, username: string, success: boolean) => {
  await db.prepare(`
    INSERT INTO login_attempts (id, ip_address, username, attempt_type, success, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run([
    generateId(),
    ip,
    username,
    'login',
    success,
    new Date().toISOString()
  ]);
};
```

### 異常活動檢測

```typescript
// 檢測異常登入
const detectAnomalousActivity = async (ip: string) => {
  const recentAttempts = await db.prepare(`
    SELECT COUNT(*) as count
    FROM login_attempts
    WHERE ip_address = ? AND created_at > datetime('now', '-1 hour')
  `).get([ip]);
  
  return recentAttempts.count > 10; // 1小時內超過10次嘗試
};
```

### 會話監控

```typescript
// 監控會話活動
const monitorSession = async (sessionToken: string, ip: string) => {
  const session = await db.prepare(`
    SELECT * FROM admin_sessions
    WHERE session_token = ? AND expires_at > datetime('now')
  `).get([sessionToken]);
  
  if (!session) {
    return { valid: false, reason: 'Session expired' };
  }
  
  // 檢查 IP 變化
  if (session.ip_address !== ip) {
    // 記錄可疑活動
    await logSuspiciousActivity(sessionToken, ip, 'IP change');
  }
  
  return { valid: true, session };
};
```

## 🚨 安全事件處理

### 事件分類

#### 1. 高風險事件
- 多次登入失敗
- 異常 IP 訪問
- 會話劫持嘗試
- SQL 注入嘗試

#### 2. 中風險事件
- 異常查詢模式
- 大量請求
- 可疑的用戶行為

#### 3. 低風險事件
- 正常的登入失敗
- 正常的會話過期

### 事件回應

```typescript
const handleSecurityEvent = async (event: SecurityEvent) => {
  switch (event.severity) {
    case 'high':
      // 立即鎖定帳戶
      await lockAccount(event.accountId);
      // 發送警報
      await sendAlert(event);
      break;
    case 'medium':
      // 增加監控
      await increaseMonitoring(event.ip);
      // 記錄事件
      await logEvent(event);
      break;
    case 'low':
      // 記錄事件
      await logEvent(event);
      break;
  }
};
```

## 🔧 安全配置

### 環境變數安全

```bash
# 生產環境安全配置
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
CLOUDFLARE_API_SECRET=your-secure-api-secret
```

**安全要求**:
- 使用強密碼（至少32位）
- 定期輪換密鑰
- 不要在程式碼中硬編碼
- 使用環境變數管理

### 資料庫安全

```sql
-- 建立安全索引
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_time ON login_attempts(created_at);
CREATE INDEX idx_sessions_token ON admin_sessions(session_token);

-- 定期清理敏感資料
DELETE FROM login_attempts WHERE created_at < datetime('now', '-90 days');
DELETE FROM verification_codes WHERE expires_at < datetime('now');
```

### API 安全

```typescript
// API 密鑰驗證
const validateApiKey = (request: Request) => {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey === process.env.CLOUDFLARE_API_SECRET;
};

// 請求頻率限制
const rateLimit = new Map();
const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15分鐘
  const maxRequests = 100;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const limit = rateLimit.get(ip);
  if (now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (limit.count >= maxRequests) {
    return false;
  }
  
  limit.count++;
  return true;
};
```

## 🛠️ 安全工具

### 密碼生成

```bash
# 生成安全的 API 密鑰
node scripts/generate-password.js

# 生成管理員密碼
node scripts/generate-admin-password.js "new-password"
```

### 安全檢查

```bash
# 檢查安全配置
npm run security:check

# 掃描漏洞
npm run security:scan

# 檢查依賴
npm audit
```

### 日誌分析

```bash
# 分析登入日誌
npm run security:analyze-login

# 檢查異常活動
npm run security:check-anomalies
```

## 🚨 安全故障排除

### 常見安全問題

#### 1. 認證失敗
**症狀**: 用戶無法登入
**可能原因**:
- 密碼錯誤
- 帳戶被鎖定
- 會話過期
- API 密鑰錯誤

**解決方法**:
- 檢查密碼正確性
- 檢查帳戶鎖定狀態
- 重新生成會話
- 驗證 API 密鑰

#### 2. 會話問題
**症狀**: 會話無效或過期
**可能原因**:
- Cookie 設定錯誤
- 會話過期
- 會話被清除

**解決方法**:
- 檢查 Cookie 設定
- 重新登入
- 檢查會話表

#### 3. 速率限制
**症狀**: 請求被限制
**可能原因**:
- 超過速率限制
- 異常活動檢測
- 系統負載過高

**解決方法**:
- 等待限制解除
- 檢查活動模式
- 優化請求頻率

### 安全日誌

```typescript
// 安全日誌記錄
const logSecurityEvent = (event: string, details: any) => {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${event}:`, details);
  
  // 記錄到資料庫
  db.prepare(`
    INSERT INTO security_logs (id, event, details, created_at)
    VALUES (?, ?, ?, ?)
  `).run([
    generateId(),
    event,
    JSON.stringify(details),
    new Date().toISOString()
  ]);
};
```

## 📊 安全指標

### 關鍵指標

- **登入成功率**: > 95%
- **認證延遲**: < 500ms
- **會話有效性**: > 99%
- **安全事件**: < 1/天
- **密碼強度**: 100% 符合要求

### 監控儀表板

```typescript
// 安全監控儀表板
const getSecurityMetrics = async () => {
  const metrics = await db.prepare(`
    SELECT 
      COUNT(*) as total_logins,
      SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_logins,
      SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_logins,
      COUNT(DISTINCT ip_address) as unique_ips
    FROM login_attempts
    WHERE created_at > datetime('now', '-24 hours')
  `).get();
  
  return {
    loginSuccessRate: (metrics.successful_logins / metrics.total_logins) * 100,
    failedLogins: metrics.failed_logins,
    uniqueIPs: metrics.unique_ips
  };
};
```

## 🔮 安全規劃

### 短期目標
- 實作更細緻的速率限制
- 增加更多安全監控
- 優化認證流程

### 長期目標
- 實作多因素認證
- 增加生物識別支援
- 實作零信任架構

## 🌐 API 設計

### 基礎 URL
```
/api/learning-content
```

### 主要端點

#### 1. 獲取所有主題
```
GET /api/learning-content?action=themes
```

#### 2. 依主題獲取單字
```
GET /api/learning-content?action=words_by_theme&theme_id={theme_id}
```

**可選參數**:
- `part_of_speech`: 依詞性篩選
- `limit`: 限制結果數量
- `offset`: 分頁偏移

#### 3. 獲取句型模式
```
GET /api/learning-content?action=sentence_patterns&grade_id={grade_id}
```

#### 4. 獲取所有年級
```
GET /api/learning-content?action=grades
```

#### 5. 依詞性獲取單字
```
GET /api/learning-content?action=words_by_part_of_speech&part_of_speech={part_of_speech}
```

#### 6. 獲取隨機單字
```
GET /api/learning-content?action=random_words&count={count}&theme_id={theme_id}
```

### 回應格式

```typescript
interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

## 🎨 前端架構

### 組件結構

```
src/
├── components/           # 共用組件
│   ├── Header.tsx       # 頁首組件
│   ├── Footer.tsx       # 頁尾組件
│   ├── GameMethodCard.tsx # 遊戲方法卡片
│   ├── TextbookSelector.tsx # 教材選擇器
│   └── SEOHead.tsx      # SEO 標頭組件
├── app/                 # Next.js App Router
│   ├── api/            # API 路由
│   ├── games/          # 遊戲頁面
│   ├── aids/           # 學習輔助頁面
│   └── garden/         # 管理介面
├── lib/                # 工具函數
│   ├── cloudflare-client.ts # Cloudflare 客戶端
│   ├── game-logic.ts   # 遊戲邏輯
│   └── utils.ts        # 通用工具
└── types/              # TypeScript 類型定義
    ├── index.ts        # 主要類型
    └── learning-content.ts # 學習內容類型
```

### 狀態管理

使用 React Hooks 進行狀態管理：

```typescript
// 遊戲狀態管理
const [gameState, setGameState] = useState<GameState>({
  currentLevel: 1,
  score: 0,
  isGameOver: false
});

// 單字主題管理
const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
const [words, setWords] = useState<Word[]>([]);
```

### 路由設計

使用 Next.js App Router 進行路由管理：

```
/                    # 首頁
/games              # 遊戲方法列表
/games/[id]         # 遊戲方法詳情
/aids               # 學習輔助列表
/aids/memory-match  # 記憶配對遊戲
/aids/vocabulary-sort # 詞彙分類遊戲
/aids/sentence-slot # 句型拉霸機
/garden             # 管理介面
/garden/login       # 管理員登入
/contact            # 聯絡頁面
/privacy            # 隱私政策
/terms              # 使用條款
```

## 🔧 開發工具

### 本地開發

```bash
# 啟動完整開發環境
npm run dev:full

# 分別啟動服務
npm run dev:worker  # Cloudflare Worker
npm run dev         # Next.js 應用
```

### 測試工具

```bash
# 測試 Cloudflare 客戶端
npm run test:cloudflare

# 測試 API 端點
npm run test:api
```

### 部署工具

```bash
# 部署 Cloudflare Worker
npm run deploy:worker

# 部署到 Vercel
npm run deploy:vercel

# 完整部署
npm run deploy:full
```

## 📊 性能優化

### 1. 快取策略
- 在 Vercel 端實作適當的快取
- 考慮使用 Cloudflare 的邊緣快取
- 實作資料庫查詢快取

### 2. 批量操作
- 盡可能批量處理 D1 查詢
- 減少 Worker 調用次數
- 優化資料庫查詢

### 3. 連接優化
- Worker 會自動管理 D1 連接
- 避免在 Vercel 端建立持久連接
- 使用連接池管理

## 🚨 故障排除

### 常見問題

#### 1. CORS 錯誤
- 確保 Worker 的 CORS 設定正確
- 檢查請求來源是否被允許

#### 2. 認證失敗
- 確認 `CLOUDFLARE_API_SECRET` 在兩邊設定一致
- 檢查請求標頭中的 `X-API-Key`

#### 3. D1 查詢失敗
- 確認 Worker 的 D1 綁定正確
- 檢查 SQL 查詢語法

#### 4. 環境變數缺失
- 確認 Vercel 環境變數設定
- 檢查 `.env.local` 文件格式

### 除錯工具

```bash
# 檢查會話狀態
curl -H "Cookie: garden_session=your-token" /api/auth/session

# 檢查資料庫連線
npm run test:cloudflare

# 查看部署日誌
vercel logs
```

## 🛠️ 開發環境設定

### 環境要求

- **Node.js**: 18+ 版本
- **npm**: 9+ 版本
- **Git**: 2.30+ 版本
- **VS Code**: 推薦使用 VS Code 作為編輯器

### 專案結構

```
primary-english-support/
├── src/                          # 主要源碼
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API 路由
│   │   ├── games/                # 遊戲頁面
│   │   ├── aids/                 # 學習輔助頁面
│   │   └── garden/               # 管理介面
│   ├── components/               # 共用組件
│   ├── lib/                      # 工具函數和配置
│   └── types/                    # TypeScript 類型定義
├── functions/                     # Cloudflare Worker 函數
├── scripts/                       # 腳本和工具
├── doc/                          # 文檔
└── public/                       # 靜態資源
```

### 安裝依賴

```bash
# 安裝專案依賴
npm install

# 安裝全域工具
npm install -g wrangler vercel
```

### 環境變數設定

創建 `.env.local` 文件：

```bash
# Cloudflare 配置
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development

# EmailJS 配置
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

## 🚀 開發流程

### 啟動開發環境

#### 完整開發環境
```bash
# 啟動完整開發環境（推薦）
npm run dev:full
```

#### 分別啟動服務
```bash
# 終端 1: 啟動 Cloudflare Worker
npm run dev:worker

# 終端 2: 啟動 Next.js 應用
npm run dev
```

### 開發腳本

```bash
# 開發相關腳本
npm run dev          # 啟動 Next.js 開發伺服器
npm run dev:worker   # 啟動 Cloudflare Worker
npm run dev:full     # 啟動完整開發環境
npm run build        # 建置專案
npm run start        # 啟動生產環境
npm run lint         # 執行 ESLint 檢查
npm run type-check   # 執行 TypeScript 類型檢查
```

### 部署腳本

```bash
# 部署相關腳本
npm run deploy:worker    # 部署 Cloudflare Worker
npm run deploy:vercel    # 部署到 Vercel
npm run deploy:full      # 完整部署
```

## 📝 程式碼規範

### TypeScript 規範

#### 類型定義
```typescript
// 使用明確的類型定義
interface GameMethod {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: '簡單' | '中等' | '困難';
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// 使用泛型
interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

#### 函數定義
```typescript
// 使用明確的參數和回傳類型
const fetchGameMethods = async (): Promise<APIResponse<GameMethod[]>> => {
  try {
    const response = await fetch('/api/games');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
```

#### 組件定義
```typescript
// 使用 React.FC 或明確的組件類型
interface GameMethodCardProps {
  gameMethod: GameMethod;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const GameMethodCard: React.FC<GameMethodCardProps> = ({
  gameMethod,
  onEdit,
  onDelete
}) => {
  return (
    <div className="game-method-card">
      <h3>{gameMethod.title}</h3>
      <p>{gameMethod.description}</p>
      {/* 其他內容 */}
    </div>
  );
};
```

### React 規範

#### 組件結構
```typescript
// 組件檔案結構
import React, { useState, useEffect } from 'react';
import { GameMethod } from '@/types';

interface ComponentProps {
  // 屬性定義
}

const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // 狀態定義
  const [state, setState] = useState<StateType>(initialValue);
  
  // 副作用
  useEffect(() => {
    // 副作用邏輯
  }, [dependencies]);
  
  // 事件處理函數
  const handleEvent = (event: EventType) => {
    // 事件處理邏輯
  };
  
  // 渲染邏輯
  return (
    <div>
      {/* JSX 內容 */}
    </div>
  );
};

export default Component;
```

#### Hooks 使用
```typescript
// 自定義 Hook
const useGameMethods = () => {
  const [gameMethods, setGameMethods] = useState<GameMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchGameMethods = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setGameMethods(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGameMethods();
  }, []);
  
  return { gameMethods, loading, error, refetch: fetchGameMethods };
};
```

### CSS 規範

#### Tailwind CSS 使用
```typescript
// 使用 Tailwind CSS 類別
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
  <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">
      遊戲方法
    </h1>
    <p className="text-gray-600 mb-6">
      選擇適合的遊戲方法來學習英語
    </p>
  </div>
</div>
```

#### 響應式設計
```typescript
// 響應式設計
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 bg-white rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">標題</h3>
    <p className="text-gray-600">內容</p>
  </div>
</div>
```

### 檔案命名規範

#### 組件檔案
```
components/
├── GameMethodCard.tsx      # 大寫開頭，PascalCase
├── TextbookSelector.tsx    # 大寫開頭，PascalCase
└── SEOHead.tsx            # 大寫開頭，PascalCase
```

#### 工具檔案
```
lib/
├── game-logic.ts          # 小寫開頭，camelCase
├── cloudflare-client.ts   # 小寫開頭，camelCase
└── utils.ts              # 小寫開頭，camelCase
```

#### 頁面檔案
```
app/
├── page.tsx              # 小寫開頭，camelCase
├── games/
│   └── page.tsx         # 小寫開頭，camelCase
└── aids/
    └── memory-match/
        └── page.tsx     # 小寫開頭，camelCase
```

## 🧪 測試指南

### 測試環境設定

```bash
# 安裝測試依賴
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# 執行測試
npm run test
```

### 單元測試

```typescript
// 組件測試範例
import { render, screen, fireEvent } from '@testing-library/react';
import GameMethodCard from '@/components/GameMethodCard';

const mockGameMethod = {
  id: '1',
  title: '測試遊戲',
  description: '測試描述',
  category: '單字學習',
  difficulty: '簡單',
  is_published: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

describe('GameMethodCard', () => {
  it('renders game method information', () => {
    render(<GameMethodCard gameMethod={mockGameMethod} />);
    
    expect(screen.getByText('測試遊戲')).toBeInTheDocument();
    expect(screen.getByText('測試描述')).toBeInTheDocument();
    expect(screen.getByText('單字學習')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(
      <GameMethodCard 
        gameMethod={mockGameMethod} 
        onEdit={mockOnEdit} 
      />
    );
    
    fireEvent.click(screen.getByText('編輯'));
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });
});
```

### API 測試

```typescript
// API 測試範例
import { GET } from '@/app/api/games/route';

describe('/api/games', () => {
  it('returns game methods', async () => {
    const request = new Request('http://localhost:3000/api/games');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

### 整合測試

```typescript
// 整合測試範例
import { render, screen, waitFor } from '@testing-library/react';
import GamesPage from '@/app/games/page';

describe('Games Page', () => {
  it('loads and displays game methods', async () => {
    render(<GamesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('遊戲方法')).toBeInTheDocument();
    });
    
    // 檢查遊戲方法列表是否載入
    const gameCards = screen.getAllByTestId('game-method-card');
    expect(gameCards.length).toBeGreaterThan(0);
  });
});
```

## 🔧 開發工具

### VS Code 設定

#### 推薦擴展
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

#### 工作區設定
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### ESLint 設定

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier 設定

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 📦 套件管理

### 依賴管理

```bash
# 安裝生產依賴
npm install package-name

# 安裝開發依賴
npm install --save-dev package-name

# 更新依賴
npm update

# 檢查過期依賴
npm outdated

# 安全檢查
npm audit
```

### 版本控制

```bash
# 檢查套件版本
npm list

# 檢查特定套件
npm list package-name

# 檢查全域套件
npm list -g --depth=0
```

## 🚀 部署流程

### 本地測試

```bash
# 建置專案
npm run build

# 啟動生產環境
npm run start

# 檢查建置結果
npm run type-check
npm run lint
```

### 部署到 Vercel

```bash
# 部署到 Vercel
npm run deploy:vercel

# 檢查部署狀態
vercel ls

# 查看部署日誌
vercel logs
```

### 部署到 Cloudflare

```bash
# 部署 Cloudflare Worker
npm run deploy:worker

# 檢查 Worker 狀態
wrangler tail

# 查看 Worker 日誌
wrangler tail --format=pretty
```

## 🔍 除錯指南

### 常見問題

#### 1. 建置錯誤
```bash
# 清理快取
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### 2. 類型錯誤
```bash
# 檢查類型
npm run type-check

# 重新生成類型
npm run build
```

#### 3. 依賴問題
```bash
# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

### 除錯工具

#### 瀏覽器開發者工具
- 使用 Console 查看錯誤訊息
- 使用 Network 檢查 API 請求
- 使用 Sources 設定中斷點

#### Next.js 除錯
```bash
# 啟用詳細日誌
DEBUG=* npm run dev

# 檢查建置資訊
npm run build -- --debug
```

#### Cloudflare Worker 除錯
```bash
# 查看 Worker 日誌
wrangler tail

# 本地除錯
wrangler dev --local
```

## 📊 性能優化

### 程式碼分割

```typescript
// 動態導入
const LazyComponent = dynamic(() => import('./LazyComponent'), {
  loading: () => <p>Loading...</p>
});

// 路由層級分割
const GamesPage = dynamic(() => import('./GamesPage'));
```

### 圖片優化

```typescript
import Image from 'next/image';

// 使用 Next.js Image 組件
<Image
  src="/image.jpg"
  alt="描述"
  width={500}
  height={300}
  priority
/>
```

### 快取策略

```typescript
// API 快取
export const revalidate = 3600; // 1小時

// 靜態生成
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
  ];
}
```

## 🤝 貢獻指南

### 開發流程

1. **Fork 專案**
2. **創建功能分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **提交變更**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **推送分支**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **開啟 Pull Request**

### 程式碼審查

- 確保程式碼符合規範
- 添加適當的測試
- 更新相關文檔
- 檢查性能影響

## 📚 相關文檔

- [專案結構說明](ProjectStructure.md)
- [功能指南](FeaturesGuide.md)
- [部署指南](DeploymentGuide.md)
- [EmailJS 設定](EmailjsSetup.md)
- [學習內容系統](LearningContentSystem.md)

## 🔮 未來擴展

### 技術升級
- 升級到最新的 Next.js 版本
- 優化 Worker 性能
- 改進錯誤處理和日誌記錄

### 功能擴展
- 實作快取策略
- 添加監控和警報
- 多區域部署
- 負載均衡

### 性能優化
- 實作 CDN 加速
- 優化資料庫查詢
- 改進前端載入速度
- 實作離線支援

## D1 資料庫故障排除

### 問題描述

在開發過程中遇到 D1 資料庫搜不到資料的問題，具體表現為：
- 遠端 D1 資料庫返回空結果
- 本地開發環境無法直接訪問 D1
- 資料庫結構不一致
- 認證問題

### 問題分析

#### 1. 環境差異
- **本地開發環境**：無法直接訪問 Cloudflare D1 資料庫
- **遠端生產環境**：D1 資料庫可用但數據為空
- **資料庫結構**：本地與遠端結構不一致

#### 2. 具體問題
- 遠端 D1 資料庫：0 筆數據
- 本地開發資料庫：100 筆數據
- 遠端資料庫缺少必要欄位（如 `categories`, `grade1-6`, `instructions`）

### 解決方案

#### 階段一：本地開發環境配置

**1. 修改 API 代碼**
在 `src/app/api/games/route.ts` 中添加模擬數據，確保開發環境可以正常測試：

```typescript
// 開發環境下返回模擬數據，以便開發和測試
console.log(
  "D1 database not available in development environment, returning mock data"
);
return [
  {
    id: "1",
    title: "單字記憶遊戲 [本機開發數據]",
    description: "透過配對遊戲幫助學生記憶英文單字 - 本機開發環境數據，僅供測試使用",
    categories: '["單字學習", "記憶訓練"]',
    grade1: true,
    grade2: true,
    // ... 其他欄位
  },
  // ... 其他模擬遊戲
];
```

**2. 模擬數據特點**
- 數量：3 個遊戲（避免過多測試數據）
- 標註：每個遊戲標題和描述都標註 `[本機開發數據]`
- 覆蓋：涵蓋不同年級和分類
- 格式：與真實數據結構完全一致

#### 階段二：遠端資料庫修復

**1. 重新認證**
```bash
# 登出當前帳號
npx wrangler logout

# 重新登入
npx wrangler login
```

**2. 檢查資料庫狀態**
```bash
# 檢查遠端資料庫數據量
npx wrangler d1 execute primary-english-db --remote --command "SELECT COUNT(*) FROM game_methods"

# 檢查資料庫結構
npx wrangler d1 execute primary-english-db --remote --command "PRAGMA table_info(game_methods)"
```

**3. 重建資料庫結構**
```bash
# 刪除現有表格
npx wrangler d1 execute primary-english-db --remote --command "DROP TABLE IF EXISTS game_methods"

# 創建正確的表格結構
npx wrangler d1 execute primary-english-db --remote --command "CREATE TABLE game_methods (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, categories TEXT NOT NULL, grade1 BOOLEAN NOT NULL DEFAULT FALSE, grade2 BOOLEAN NOT NULL DEFAULT FALSE, grade3 BOOLEAN NOT NULL DEFAULT FALSE, grade4 BOOLEAN NOT NULL DEFAULT FALSE, grade5 BOOLEAN NOT NULL DEFAULT FALSE, grade6 BOOLEAN NOT NULL DEFAULT FALSE, materials TEXT NOT NULL, instructions TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"
```

**4. 同步數據**
```bash
# 執行 SQL 腳本插入數據
npx wrangler d1 execute primary-english-db --remote --file=scripts/batch1-games-1-10.sql
npx wrangler d1 execute primary-english-db --remote --file=scripts/batch2-games-11-20.sql
# ... 繼續執行其他批次

# 批量執行多個腳本
npx wrangler d1 execute primary-english-db --remote --file=scripts/batch6-games-51-60.sql && npx wrangler d1 execute primary-english-db --remote --file=scripts/batch7-games-61-70.sql
```

#### 階段三：驗證修復結果

**1. 檢查數據量**
```bash
npx wrangler d1 execute primary-english-db --remote --command "SELECT COUNT(*) FROM game_methods"
```

**2. 檢查數據內容**
```bash
npx wrangler d1 execute primary-english-db --remote --command "SELECT id, title, categories FROM game_methods LIMIT 5"
```

### 常見問題及解決方法

#### 1. 認證錯誤 (Authentication error [code: 10000])
**症狀**：無法執行遠端資料庫操作
**解決方法**：
```bash
npx wrangler logout
npx wrangler login
```

#### 2. 資料庫結構不匹配
**症狀**：執行 SQL 腳本時出現欄位不存在錯誤
**解決方法**：
1. 檢查遠端資料庫結構
2. 刪除現有表格
3. 重新創建正確的表格結構

#### 3. 本地開發環境無法訪問 D1
**症狀**：開發環境返回空數據
**解決方法**：
1. 在 API 代碼中添加模擬數據
2. 使用環境檢測區分開發和生產環境
3. 在部署後自動使用真實 D1 數據

### 最佳實踐

#### 1. 開發環境配置
- 始終提供模擬數據作為後備
- 明確標註模擬數據的來源
- 保持模擬數據與真實數據結構一致

#### 2. 資料庫同步
- 定期檢查本地和遠端資料庫的一致性
- 使用版本控制的 SQL 腳本
- 在部署前驗證資料庫結構

#### 3. 錯誤處理
- 在 API 中添加詳細的錯誤日誌
- 區分開發和生產環境的錯誤處理
- 提供用戶友好的錯誤訊息

### 監控和維護

#### 1. 定期檢查
```bash
# 檢查遠端資料庫狀態
npx wrangler d1 execute primary-english-db --remote --command "SELECT COUNT(*) FROM game_methods"

# 檢查資料庫大小
npx wrangler d1 execute primary-english-db --remote --command "PRAGMA page_count"
```

#### 2. 備份策略
- 定期導出資料庫結構和數據
- 保存 SQL 腳本作為備份
- 在重大更改前創建快照

### 總結

通過這次故障排除，我們成功解決了：
1. **本地開發環境**：配置了模擬數據，確保開發流程不中斷
2. **遠端資料庫**：修復了結構問題，同步了 100 筆遊戲數據
3. **認證問題**：重新建立了穩定的連接

這個解決方案為未來遇到類似問題提供了完整的參考流程，確保專案的穩定性和可維護性。

## 📊 Mock 數據優化

### 修改概述

為了減少 Cloudflare D1 資料庫的查詢成本，我們將遊戲方法 API 從動態 D1 查詢改為靜態 Mock 數據模式。

### 已刪除的檔案

- `games_data.json` - 靜態備份檔案（1611 行）

### 修改的檔案

#### `src/app/api/games/route.ts`

**主要變更：**

1. **移除 D1 依賴**
   - 刪除 `createCloudflareClient` 和 `createLocalCloudflareClient` 導入
   - 移除所有 D1 資料庫查詢邏輯

2. **新增 Mock 數據**
   - 新增 `mockGameMethods` 陣列，包含 10 個精心設計的遊戲方法
   - 涵蓋不同年級（Grade 1-6）和分類（單字學習、句型練習、口語訓練等）

3. **重構函數**
   - `getGamesFromD1()` → `getGamesFromMock()`
   - 改為同步函數，無需 async/await
   - 支援分類和年級篩選
   - 支援分頁功能

4. **更新 API 端點**
   - **GET /api/games**: 使用 Mock 數據返回遊戲列表
   - **POST /api/games**: 模擬創建遊戲（不實際持久化）

### Mock 數據內容

#### 遊戲方法列表（10 個）：

1. **單字配對遊戲** - Grade 1, 單字學習
2. **句型接龍** - Grade 2-6, 句型練習 + 口語訓練
3. **角色扮演對話** - Grade 3-6, 口語訓練 + 對話練習
4. **動物單字學習卡** - Grade 1-3, 單字學習 + 主題學習
5. **顏色句型練習板** - Grade 1-3, 單字學習 + 句型練習
6. **數字接龍遊戲** - Grade 1-4, 單字學習 + 數字學習
7. **家庭成員介紹** - Grade 2-6, 單字學習 + 口語訓練
8. **食物單字記憶** - Grade 1-6, 單字學習 + 記憶訓練
9. **時間表達練習** - Grade 3-6, 句型練習 + 時間學習
10. **天氣報告遊戲** - Grade 2-6, 口語訓練 + 描述練習

### 成本效益

#### 減少的成本：
- **D1 查詢費用**: 每次 API 調用不再產生 D1 查詢成本
- **資料傳輸費用**: 減少 Cloudflare 網路傳輸成本
- **Worker 執行時間**: 減少 Cloudflare Worker 執行時間

#### 預估節省：
- 每次遊戲列表請求：節省 1 次 D1 查詢
- 每次遊戲篩選請求：節省 1-2 次 D1 查詢
- 每月預估節省：數百次 D1 查詢費用

### 測試

#### 測試腳本：
```bash
node scripts/test-mock-games-api.js
```

#### 測試內容：
1. GET /api/games - 基本遊戲列表
2. GET /api/games?category=單字學習 - 分類篩選
3. GET /api/games?grade=grade1 - 年級篩選
4. POST /api/games - 創建遊戲（模擬）

### 技術細節

#### 篩選邏輯：
- **分類篩選**: 解析 JSON 格式的 categories 欄位
- **年級篩選**: 檢查 grade1-grade6 布林值欄位
- **分頁**: 支援 page 和 limit 參數

#### 數據格式：
- 保持與原 D1 資料庫相同的數據結構
- 支援所有原有的 API 參數和響應格式
- 向後兼容現有的前端代碼

### 注意事項

1. **數據持久化**: POST 請求不會實際保存數據到資料庫
2. **數據更新**: 需要修改 Mock 數據時，需直接編輯 `mockGameMethods` 陣列
3. **生產環境**: 此修改適用於所有環境，包括生產環境

### 部署

修改完成後，直接部署即可：
```bash
npm run build
npm run deploy
```

### 監控

建議監控以下指標：
- API 響應時間（應該更快）
- Cloudflare 使用量（應該減少）
- 用戶體驗（應該無變化）

## 📚 文檔整合總結

### 整合目標

本次文檔整合的主要目標是：
1. **統一文檔結構** - 建立一致的文檔格式和組織方式
2. **減少重複內容** - 整合相似內容，避免資訊分散
3. **提升可讀性** - 優化文檔結構，便於查找和使用
4. **建立導覽系統** - 提供清晰的文檔導覽和索引

### 整合成果

#### 新增整合文檔

1. **[README.md](README.md) - 專案總覽**
   - 整合了專案概述、主要功能、技術架構
   - 提供快速開始指南和文檔導覽
   - 取代了原本分散的專案介紹

2. **[TechnicalGuide.md](TechnicalGuide.md) - 技術指南**
   - 整合了系統架構、API 設計、資料庫結構
   - 包含安全機制、性能優化、故障排除
   - 統一了技術相關的所有文檔

3. **[FeaturesGuide.md](FeaturesGuide.md) - 功能指南**
   - 整合了學習輔助系統、學習內容系統
   - 包含遊戲頁面指南和功能說明
   - 統一了功能相關的所有文檔

4. **[DeploymentGuide.md](DeploymentGuide.md) - 部署指南**
   - 整合了環境變數設定、SEO 優化
   - 包含部署流程和維護指南
   - 統一了部署相關的所有文檔

5. **[AdminMessagesSystem.md](AdminMessagesSystem.md) - 站長消息系統**
   - 整合了安全驗證系統、資料庫遷移
   - 包含 JSON 儲存實現和系統管理
   - 統一了管理系統相關的所有文檔

6. **[WordExpansionSummary.md](WordExpansionSummary.md) - 單字主題擴充總結**
   - 整合了虛擬資料庫單字ID新規則、時間表達主題
   - 包含 JSON 儲存實現和資料庫一致性分析
   - 統一了學習內容相關的所有文檔

7. **[INDEX.md](INDEX.md) - 文檔索引**
   - 提供完整的文檔導覽和分類
   - 按角色和任務分類文檔
   - 建立文檔維護指南

### 整合策略

#### 1. 分層整合
- **主要文檔**: 整合核心概念和概述
- **技術文檔**: 整合技術細節和實作
- **專業文檔**: 保留特定領域的詳細文檔

#### 2. 交叉引用
- 在整合文檔中提供相關文檔的連結
- 建立文檔間的關聯關係
- 避免重複內容，提供導覽

#### 3. 統一格式
- 使用一致的 Markdown 格式
- 建立標準的標題結構
- 提供統一的程式碼範例格式

### 整合效果

#### 文檔數量優化
- **整合前**: 25+ 個分散文檔
- **整合後**: 7 個主要整合文檔
- **減少重複**: 約 30% 的內容重複被消除

#### 可讀性提升
- **統一結構**: 所有文檔使用一致的格式
- **清晰導覽**: 提供完整的文檔索引和分類
- **交叉引用**: 建立文檔間的關聯關係

#### 維護效率
- **集中管理**: 相關內容集中在單一文檔中
- **減少更新**: 避免多處更新相同內容
- **版本控制**: 更容易追蹤文檔變更

### 使用建議

#### 新用戶
1. 從 [README.md](README.md) 開始了解專案
2. 根據需求選擇相關的技術文檔
3. 使用 [INDEX.md](INDEX.md) 快速找到所需文檔

#### 開發者
1. 閱讀 [TechnicalGuide.md](TechnicalGuide.md) 了解技術架構
2. 參考 [FeaturesGuide.md](FeaturesGuide.md) 了解功能需求
3. 使用 [DeploymentGuide.md](DeploymentGuide.md) 了解部署流程

#### 系統管理員
1. 閱讀 [DeploymentGuide.md](DeploymentGuide.md) 了解部署流程
2. 參考 [AdminMessagesSystem.md](AdminMessagesSystem.md) 了解管理系統
3. 使用 [WordExpansionSummary.md](WordExpansionSummary.md) 了解學習內容系統

### 未來規劃

#### 短期目標
- 持續優化文檔結構
- 增加更多實用範例
- 建立文檔搜尋功能

#### 長期目標
- 實作互動式文檔
- 增加視覺化圖表
- 建立文檔版本管理系統

### 維護指南

#### 更新頻率
- **主要文檔**: 每月檢查和更新
- **技術文檔**: 每次重大更新後更新
- **功能文檔**: 功能變更時更新

#### 更新原則
1. 保持文檔的準確性和時效性
2. 確保文檔間的連結有效性
3. 定期檢查和修復格式問題
4. 收集用戶反饋並持續改進

---

**⚠️ 重要提醒**: 本技術指南涵蓋了專案的核心技術架構，如需更詳細的特定技術文檔，請參考相關的專門文檔。
