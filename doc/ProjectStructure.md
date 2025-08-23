# 專案結構說明

## 🏗️ 架構概述

Primary English Support 採用 Vercel + Cloudflare 的混合架構，結合兩者的優勢：

- **前端**: Next.js 14 + TypeScript + Tailwind CSS，部署在 Vercel
- **API 閘道**: Cloudflare Worker 處理 D1 和 R2 操作
- **資料庫**: Cloudflare D1 (SQLite)
- **檔案存儲**: Cloudflare R2

## 📁 專案結構

```
primary-english-support/
├── 📁 src/                          # 主要源碼
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 api/                  # API 路由
│   │   │   ├── 📁 games/            # 遊戲 API
│   │   │   ├── 📁 admin/            # 管理 API
│   │   │   └── 📁 contact/          # 聯絡表單 API
│   │   ├── 📁 games/                # 遊戲頁面
│   │   ├── 📁 aids/                 # 教學輔具頁面
│   │   ├── 📁 garden/               # 管理介面
│   │   └── 📁 contact/              # 聯絡頁面
│   ├── 📁 components/               # 共用組件
│   ├── 📁 lib/                      # 工具函數和配置
│   │   └── cloudflare-client.ts     # Cloudflare 服務客戶端
│   └── 📁 types/                    # TypeScript 類型定義
├── 📁 functions/                     # Cloudflare Worker 函數
│   └── api-gateway.js               # API 閘道 Worker
├── 📁 scripts/                       # 腳本和工具
│   ├── deploy.sh                    # 部署腳本
│   └── dev.sh                       # 本地開發腳本
├── 📁 doc/                          # 文檔
│   ├── VercelDeployment.md          # Vercel 部署指南
│   ├── MigrationSummary.md          # 架構說明
│   ├── DeploymentChecklist.md       # 部署檢查清單
│   └── GamePagesGuide.md            # 遊戲頁面指南
├── wrangler-api-gateway.toml        # 生產環境 Worker 配置
├── wrangler-dev.toml                # 本地開發 Worker 配置
├── env.example                      # 環境變數範例
└── package.json                     # 專案配置和腳本
```

## 🔧 核心組件

### 1. Cloudflare Worker API 閘道
- **位置**: `functions/api-gateway.js`
- **功能**: 處理來自 Vercel 的 D1 和 R2 請求
- **配置**: `wrangler-api-gateway.toml` (生產) / `wrangler-dev.toml` (開發)

### 2. Cloudflare 服務客戶端
- **位置**: `src/lib/cloudflare-client.ts`
- **功能**: 從 Vercel 呼叫 Cloudflare 服務的客戶端
- **特點**: 類型安全、錯誤處理、認證管理

### 3. Next.js API 路由
- **位置**: `src/app/api/`
- **功能**: 處理前端請求，透過客戶端呼叫 Cloudflare 服務
- **特點**: 強制動態路由、錯誤處理、資料轉換

## 🚀 部署架構

```
用戶請求 → Vercel (Next.js) → Cloudflare Worker → Cloudflare D1/R2
```

### 部署流程
1. **部署 Cloudflare Worker**: `npm run deploy:worker`
2. **設定 Vercel 環境變數**: CLOUDFLARE_WORKER_URL, CLOUDFLARE_API_SECRET
3. **部署到 Vercel**: `npm run deploy:vercel`

## 🧪 本地開發

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

## 📊 資料流

### 讀取操作
1. 前端發送請求到 Next.js API
2. Next.js API 呼叫 Cloudflare 客戶端
3. 客戶端發送請求到 Worker API 閘道
4. Worker 執行 D1 查詢或 R2 操作
5. 結果返回給前端

### 寫入操作
1. 前端發送寫入請求到 Next.js API
2. Next.js API 透過客戶端呼叫 Worker
3. Worker 執行 D1 插入/更新或 R2 上傳
4. 結果返回給前端

## 🔒 安全機制

### API 認證
- 所有 Worker 請求都需要 `X-API-Key` 標頭
- API 密鑰在兩邊設定一致
- 密鑰不在客戶端暴露

### CORS 設定
- Worker 支援跨域請求
- 預檢請求 (OPTIONS) 正常處理
- 允許所有來源（可根據需求調整）

## 📈 性能考量

### 延遲
- 多了一層 API 調用，但通常可接受
- Worker 到 D1/R2 的延遲很低
- 可以透過快取策略優化

### 成本
- Vercel: Serverless Function 執行時間和請求次數
- Cloudflare: Worker 執行次數、D1 操作、R2 存儲

## 🛠️ 維護和監控

### 日誌檢查
- **Vercel**: `vercel logs`
- **Cloudflare**: Dashboard 中的即時日誌

### 常見問題
- 認證失敗: 檢查 API 密鑰設定
- CORS 錯誤: 檢查 Worker CORS 設定
- 資料庫錯誤: 檢查 D1 綁定和權限

### 備份策略
- D1 資料庫定期備份
- R2 物件版本控制
- 部署腳本和配置備份

## 🔮 未來擴展

### 可能的改進
- 實作快取策略
- 添加監控和警報
- 多區域部署
- 負載均衡

### 技術升級
- 升級到最新的 Next.js 版本
- 優化 Worker 性能
- 改進錯誤處理和日誌記錄
