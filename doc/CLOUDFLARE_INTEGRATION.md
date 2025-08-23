# Cloudflare 整合部署指南

## 概述

這個專案已經整合了 Cloudflare 的各種服務，包括：
- **Cloudflare Pages**: 靜態網站託管
- **Cloudflare Workers**: 無伺服器函數
- **Cloudflare KV**: 鍵值存儲
- **Cloudflare D1**: SQLite 資料庫
- **Cloudflare R2**: 對象存儲

## 部署步驟

### 1. 安裝 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登入 Cloudflare

```bash
wrangler login
```

### 3. 創建 Cloudflare 服務

#### 創建 KV 命名空間
```bash
wrangler kv:namespace create "PRIMARY_ENGLISH_KV"
wrangler kv:namespace create "PRIMARY_ENGLISH_KV" --preview
```

#### 創建 D1 資料庫
```bash
wrangler d1 create primary-english-db
```

#### 創建 R2 存儲桶
```bash
wrangler r2 bucket create primary-english-storage
```

### 4. 更新配置文件

將創建的服務 ID 更新到 `wrangler.toml` 文件中：

```toml
[[kv_namespaces]]
binding = "PRIMARY_ENGLISH_KV"
id = "實際的 KV 命名空間 ID"
preview_id = "實際的預覽 KV 命名空間 ID"

[[d1_databases]]
binding = "PRIMARY_ENGLISH_DB"
database_name = "primary-english-db"
database_id = "實際的 D1 資料庫 ID"
```

### 5. 部署到 Cloudflare

```bash
# 部署到生產環境
wrangler pages deploy .next --project-name zs-primary-english-support

# 部署到測試環境
wrangler pages deploy .next --project-name zs-primary-english-support-staging
```

## 環境變數

在 Cloudflare Pages 中設置以下環境變數：

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`: EmailJS 服務 ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`: EmailJS 模板 ID
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`: EmailJS 公鑰
- `JWT_SECRET`: JWT 簽名密鑰

## 資料庫初始化

### D1 資料庫結構

```sql
-- 管理員消息表
CREATE TABLE admin_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 遊戲方法表
CREATE TABLE game_methods (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  materials TEXT NOT NULL, -- JSON 格式
  steps TEXT NOT NULL, -- JSON 格式
  grade TEXT NOT NULL,
  age_group TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 教學輔具表
CREATE TABLE teaching_aids (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  tags TEXT NOT NULL, -- JSON 格式
  file_url TEXT,
  preview_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 聯絡記錄表
CREATE TABLE contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 初始化資料庫

```bash
# 創建資料庫結構
wrangler d1 execute primary-english-db --file=./db/schema.sql

# 插入初始資料
wrangler d1 execute primary-english-db --file=./db/seed.sql
```

## 開發 vs 生產

### 開發環境
- 使用 Next.js API Routes
- 資料存儲在記憶體中
- 本地開發伺服器

### 生產環境
- 使用 Cloudflare Workers
- 資料存儲在 Cloudflare 服務中
- 全球 CDN 分發

## 監控和日誌

### 查看 Workers 日誌
```bash
wrangler tail
```

### 查看 KV 資料
```bash
wrangler kv:key list --binding=PRIMARY_ENGLISH_KV
```

### 查看 D1 資料
```bash
wrangler d1 execute primary-english-db --command="SELECT * FROM admin_messages;"
```

## 故障排除

### 常見問題

1. **CORS 錯誤**: 確保在 Cloudflare Workers 中設置正確的 CORS 標頭
2. **環境變數未定義**: 檢查 `wrangler.toml` 和 Cloudflare Pages 設置
3. **資料庫連接失敗**: 確認 D1 資料庫 ID 和權限設置

### 調試技巧

- 使用 `wrangler dev` 進行本地測試
- 檢查 Cloudflare 儀表板中的錯誤日誌
- 使用 `console.log` 在 Workers 中輸出調試信息

## 下一步

- 實現用戶認證和授權
- 添加文件上傳功能到 R2
- 實現實時通知功能
- 添加資料備份和恢復機制
