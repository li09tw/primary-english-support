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

-- 遊戲方法與教學輔具表
CREATE TABLE game_methods (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  categories TEXT NOT NULL, -- JSON 格式，包含分類如：單字學習、句型練習、口語訓練、教學輔具
  grades TEXT NOT NULL, -- JSON 格式，包含年級如：grade1, grade2, grade3, grade4, grade5, grade6
  materials TEXT NOT NULL, -- JSON 格式
  instructions TEXT NOT NULL, -- JSON 格式
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 聯絡記錄表
CREATE TABLE contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```