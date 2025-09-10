# 部署指南

## 🎯 架構概述

專案採用 Vercel + Cloudflare 的混合架構：

```
用戶 → Vercel (Next.js) → Cloudflare Worker API Gateway → Cloudflare D1/R2
```

- **前端**: 部署在 Vercel 的 Next.js 應用
- **API 閘道**: Cloudflare Worker 處理 D1 和 R2 操作
- **資料存儲**: Cloudflare D1 (SQLite) 和 R2 (物件存儲)

## 🚀 部署步驟

### 步驟 1: 部署 Cloudflare Worker

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

### 步驟 2: 部署到 Vercel

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

# EmailJS 設定（Server-side 使用 REST API）
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_user_id
```

#### 2.4 部署專案
```bash
vercel --prod
```

## 🛠️ 本地開發

### 啟動完整開發環境
```bash
npm run dev:full
```

### 分別啟動服務
```bash
# 終端 1: 啟動 Worker
npm run dev:worker

# 終端 2: 啟動 Next.js
npm run dev
```

### 環境變數配置
創建 `.env.local` 文件：
```bash
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development
```

## ✅ 部署檢查清單

### 部署前準備
- [ ] `.env.local` 文件已設定
- [ ] `wrangler` CLI 已安裝並登入
- [ ] `vercel` CLI 已安裝並登入
- [ ] 有 Cloudflare 帳戶權限
- [ ] 有 Vercel 專案權限

### 部署流程
- [ ] Worker 部署成功
- [ ] 獲得生產環境 Worker URL
- [ ] Vercel 部署成功
- [ ] 環境變數已正確設定

### 部署後檢查
- [ ] 訪問 Worker URL 確認服務正常
- [ ] 訪問生產環境網站
- [ ] 確認遊戲頁面能正常載入
- [ ] 測試與 Cloudflare Worker 的連接
- [ ] 測試聯絡表單功能

## 🔧 故障排除

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

### 日誌檢查

#### Vercel 日誌
```bash
vercel logs
```

#### Cloudflare Worker 日誌
在 Cloudflare Dashboard 中查看 Worker 的即時日誌。

## 📊 性能優化

### 1. 快取策略
- 在 Vercel 端實作適當的快取
- 考慮使用 Cloudflare 的邊緣快取

### 2. 批量操作
- 盡可能批量處理 D1 查詢
- 減少 Worker 調用次數

### 3. 連接優化
- Worker 會自動管理 D1 連接
- 避免在 Vercel 端建立持久連接

## 🔒 安全考量

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

## 💰 成本考量

### Vercel 成本
- Serverless Function 執行時間
- 請求次數
- 頻寬使用

### Cloudflare 成本
- Worker 執行次數
- D1 讀寫操作
- R2 存儲和操作

## 📈 監控和維護

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

## 🔄 回滾步驟

如果部署失敗，可以：

1. **回滾 Worker**：使用 `wrangler rollback` 命令
2. **回滾 Vercel**：在 Vercel 儀表板中回滾到上一個版本
3. **檢查日誌**：查看 Worker 和 Vercel 的錯誤日誌

## 📚 相關文檔

- [環境變數設定](EnvironmentVariables.md)
- [專案結構說明](ProjectStructure.md)
- [功能指南](FeaturesGuide.md)
- [EmailJS 設定](EmailjsSetup.md)
- [SEO 優化](SeoOptimization.md)
