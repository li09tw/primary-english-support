# 技術指南

## 概述

本文件整合了 Primary English Support 專案的所有技術相關文檔，包括架構設計、API 設計、資料庫結構、安全機制等技術細節。

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

### 核心資料表

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

#### 4. 學習內容系統

**年級表 (grades)**:
```sql
CREATE TABLE grades (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

**單字主題表 (word_themes)**:
```sql
CREATE TABLE word_themes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

**單字表 (words)**:
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

**句型模式表 (sentence_patterns)**:
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

#### 句型模式空格表 (pattern_slots)
```sql
CREATE TABLE pattern_slots (
  id INTEGER PRIMARY KEY,
  pattern_id INTEGER NOT NULL,
  slot_index INTEGER NOT NULL,
  required_part_of_speech TEXT NOT NULL,
  FOREIGN KEY (pattern_id) REFERENCES sentence_patterns(id)
);
```

## 🔒 安全機制

### 1. 認證系統

#### 密碼安全
```typescript
// 使用 bcrypt 進行密碼雜湊
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password + salt, 12);

// 驗證密碼
const isValid = bcrypt.compareSync(password + salt, hash);
```

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

### 2. 速率限制

```typescript
const RATE_LIMIT = {
  LOGIN_ATTEMPTS: 5,           // 5次失敗後鎖定
  LOCK_DURATION_MINUTES: 30,   // 鎖定30分鐘
  CODE_REQUEST_LIMIT: 3,       // 15分鐘內最多3次
  CODE_REQUEST_WINDOW: 15,     // 15分鐘視窗
};
```

### 3. 輸入驗證

```typescript
// XSS 防護：清理危險字符
const cleanInput = input.trim().replace(/[<>\"'&]/g, "");

// SQL Injection 防護：參數化查詢
const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
const result = stmt.all([username]);
```

### 4. 安全標頭

```typescript
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};
```

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

## 📚 相關文檔

- [專案結構說明](ProjectStructure.md)
- [功能指南](FeaturesGuide.md)
- [部署指南](DeploymentGuide.md)
- [環境變數設定](EnvironmentVariables.md)
- [EmailJS 設定](EmailjsSetup.md)
- [SEO 優化](SeoOptimization.md)
- [安全驗證系統指南](SecureVerificationSystemGuide.md)
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

---

**⚠️ 重要提醒**: 本技術指南涵蓋了專案的核心技術架構，如需更詳細的特定技術文檔，請參考相關的專門文檔。
