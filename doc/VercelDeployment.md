# Vercel 部署指南

本指南說明如何將專案部署到 Vercel，同時保持使用 Cloudflare D1 和 R2 服務。

## 架構概述

```
Vercel (Next.js) → Cloudflare Worker API Gateway → Cloudflare D1/R2
```

- **前端**: 部署在 Vercel 的 Next.js 應用
- **API 閘道**: Cloudflare Worker 處理 D1 和 R2 操作
- **資料存儲**: Cloudflare D1 (SQLite) 和 R2 (物件存儲)

## 部署步驟

### 1. 部署 Cloudflare Worker API 閘道

#### 1.1 安裝 Wrangler CLI
```bash
npm install -g wrangler
```

#### 1.2 登入 Cloudflare
```bash
wrangler login
```

#### 1.3 部署 API 閘道 Worker
```bash
# 使用專門的配置文件
wrangler deploy --config wrangler-api-gateway.toml
```

部署成功後，你會得到一個 Worker URL，例如：
`https://primary-english-api-gateway.your-account.workers.dev`

#### 1.4 設定 Worker 環境變數
在 Cloudflare Dashboard 中為你的 Worker 設定環境變數：
- `API_SECRET`: 設定一個安全的 API 密鑰

### 2. 部署到 Vercel

#### 2.1 安裝 Vercel CLI
```bash
npm install -g vercel
```

#### 2.2 登入 Vercel
```bash
vercel login
```

#### 2.3 設定環境變數
在 Vercel 專案設定中設定以下環境變數：

```bash
# Cloudflare Worker API Gateway URL
CLOUDFLARE_WORKER_URL=https://your-worker-url.workers.dev

# API 密鑰（與 Worker 中設定的相同）
CLOUDFLARE_API_SECRET=your-secret-api-key-here

# 環境
NODE_ENV=production
```

#### 2.4 部署專案
```bash
vercel --prod
```

## 環境變數配置

### Vercel 環境變數
- `CLOUDFLARE_WORKER_URL`: Cloudflare Worker 的 URL
- `CLOUDFLARE_API_SECRET`: 用於驗證的 API 密鑰
- `NODE_ENV`: 環境設定

### Cloudflare Worker 環境變數
- `API_SECRET`: 用於驗證來自 Vercel 的請求
- `PRIMARY_ENGLISH_DB`: D1 資料庫綁定
- `primary_english_storage`: R2 存儲綁定

## 本地開發

### 1. 啟動 Cloudflare Worker 本地開發
```bash
# 在一個終端中
wrangler dev --config wrangler-api-gateway.toml
```

### 2. 啟動 Next.js 開發伺服器
```bash
# 在另一個終端中
npm run dev
```

### 3. 設定本地環境變數
創建 `.env.local` 文件：
```bash
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development
```

## 測試部署

### 1. 測試 D1 查詢
```bash
curl -X POST https://your-worker-url.workers.dev/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key-here" \
  -d '{"query": "SELECT COUNT(*) as total FROM game_methods"}'
```

### 2. 測試 Next.js API
```bash
curl "https://your-vercel-app.vercel.app/api/games?page=1&limit=10"
```

## 故障排除

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

#### 4. R2 操作失敗
- 確認 Worker 的 R2 綁定正確
- 檢查物件鍵名和權限

### 日誌檢查

#### Vercel 日誌
```bash
vercel logs
```

#### Cloudflare Worker 日誌
在 Cloudflare Dashboard 中查看 Worker 的即時日誌。

## 性能優化

### 1. 快取策略
- 在 Vercel 端實作適當的快取
- 考慮使用 Cloudflare 的邊緣快取

### 2. 連接池
- Worker 會自動管理 D1 連接
- 避免在 Vercel 端建立持久連接

### 3. 批量操作
- 盡可能批量處理 D1 查詢
- 減少 Worker 調用次數

## 安全考量

### 1. API 密鑰管理
- 使用強密碼作為 API 密鑰
- 定期輪換密鑰
- 不要在客戶端暴露密鑰

### 2. 請求驗證
- 所有請求都必須包含有效的 API 密鑰
- 考慮實作額外的請求驗證

### 3. 速率限制
- 在 Worker 中實作速率限制
- 防止濫用 API

## 成本考量

### Vercel 成本
- Serverless Function 執行時間
- 請求次數
- 頻寬使用

### Cloudflare 成本
- Worker 執行次數
- D1 讀寫操作
- R2 存儲和操作

## 監控和維護

### 1. 性能監控
- 監控 API 響應時間
- 追蹤錯誤率
- 監控資源使用

### 2. 日誌分析
- 定期檢查錯誤日誌
- 分析使用模式
- 識別性能瓶頸

### 3. 備份策略
- 定期備份 D1 資料
- 設定 R2 物件版本控制
- 測試恢復程序
