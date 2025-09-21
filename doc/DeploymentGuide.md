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

## 🌐 環境變數設定

### 本地開發環境 (.env.local)

在專案根目錄創建 `.env.local` 文件：

```bash
# 本地開發環境變數
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development

# EmailJS 配置
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

### 生產環境變數

#### 方法 1: Vercel Dashboard
1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇專案
3. 進入 Settings > Environment Variables
4. 新增以下變數：

```bash
# Cloudflare Worker API Gateway URL
CLOUDFLARE_WORKER_URL=https://primary-english-api-gateway.your-account.workers.dev

# API 密鑰（與 Worker 中設定的相同）
CLOUDFLARE_API_SECRET=your-secret-api-key-here

# 環境
NODE_ENV=production

# EmailJS 設定（Server-side 使用 REST API）
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_user_id
```

#### 方法 2: 命令行設定
```bash
# 使用 Vercel CLI 設定環境變數
vercel env add CLOUDFLARE_WORKER_URL
vercel env add CLOUDFLARE_API_SECRET
vercel env add EMAILJS_SERVICE_ID
vercel env add EMAILJS_TEMPLATE_ID
vercel env add EMAILJS_PUBLIC_KEY
```

### 重要提醒

1. **本地開發**: 使用 `http://localhost:8787`
2. **生產環境**: 使用實際的 Cloudflare Worker URL
3. **API 密鑰**: 必須與 Cloudflare Worker 中設定的相同
4. **安全性**: 不要將包含真實密鑰的 `.env` 文件提交到 Git

### 驗證設定

本地開發時，可以透過以下方式驗證：

```bash
# 檢查 Worker 是否運行
curl http://localhost:8787/query

# 檢查環境變數是否載入
npm run dev:full
```

## 🔍 SEO 優化

### 已實現的 SEO 優化功能

#### 1. Metadata API 優化
- **動態標題模板**: 使用 `template: "%s | Z的國小英語支援(ZPES)"` 自動生成頁面標題
- **關鍵字優化**: 為每個頁面設定相關的關鍵字
- **描述優化**: 每個頁面都有獨特且吸引人的描述
- **作者和發布者資訊**: 明確標示內容來源

#### 2. Open Graph 和 Twitter Card
- **社交媒體分享優化**: 確保在 Facebook、Twitter 等平台分享時有正確的預覽
- **圖片優化**: 設定適當的 OG 圖片尺寸和描述
- **多語言支援**: 設定 `locale: 'zh_TW'` 支援繁體中文

#### 3. 技術 SEO
- **robots.txt**: 指導搜尋引擎爬蟲的訪問規則
- **sitemap.xml**: 自動生成網站地圖，幫助搜尋引擎索引
- **canonical URLs**: 避免重複內容問題
- **結構化資料**: 使用 JSON-LD 標記教育組織和服務資訊

#### 4. 效能優化
- **圖片優化**: 支援 WebP 和 AVIF 格式
- **壓縮啟用**: 啟用 gzip 壓縮和 SWC 壓縮
- **安全標頭**: 設定適當的安全標頭防止 XSS 和點擊劫持

#### 5. PWA 支援
- **manifest.json**: 支援漸進式網頁應用
- **圖示優化**: 多尺寸圖示支援各種設備
- **主題色彩**: 統一的品牌色彩設定

### 基本頁面 SEO

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "頁面標題",
  description: "頁面描述",
  keywords: ["關鍵字1", "關鍵字2"],
  openGraph: {
    title: "Open Graph 標題",
    description: "Open Graph 描述",
    url: '/page-url',
  },
  alternates: {
    canonical: '/page-url',
  },
};
```

### 使用 SEOHead 組件

```typescript
import SEOHead from "@/components/SEOHead";

export default function Page() {
  return (
    <>
      <SEOHead
        title="頁面標題"
        description="頁面描述"
        keywords={["關鍵字1", "關鍵字2"]}
        type="article"
        publishedTime="2024-01-01T00:00:00Z"
      />
      {/* 頁面內容 */}
    </>
  );
}
```

### 需要手動配置的項目

#### 1. 網域設定
- 將 `https://zsprimaryenglishsupport.com` 替換為實際網域
- 在 `metadataBase` 中設定正確的網域

#### 2. Google Search Console
- 獲取 Google 驗證碼並替換 `your-google-verification-code`
- 提交 sitemap.xml 到 Google Search Console

#### 3. 圖片資源
- 添加 `/og-image.jpg` (1200x630 像素)
- 添加各種尺寸的圖示檔案
- 添加 `/logo.png` 作為網站標誌

#### 4. 分析工具
- 考慮添加 Google Analytics 4
- 考慮添加 Google Tag Manager
- 考慮添加 Facebook Pixel 等追蹤工具

### 進階 SEO 策略

#### 1. 內容優化
- **關鍵字密度**: 確保重要關鍵字在內容中適當出現
- **標題層級**: 使用 H1、H2、H3 等標題標籤建立內容結構
- **內部連結**: 在相關內容間建立內部連結
- **圖片 alt 文字**: 為所有圖片添加描述性的 alt 文字

#### 2. 技術優化
- **載入速度**: 使用 Next.js 的圖片優化和程式碼分割
- **行動裝置優化**: 確保網站在各種設備上都有良好體驗
- **無障礙性**: 遵循 WCAG 2.1 標準提升可訪問性

#### 3. 本地化 SEO
- **語言標籤**: 正確設定 `lang="zh-TW"`
- **地區關鍵字**: 使用台灣地區相關的關鍵字
- **本地業務資訊**: 在結構化資料中包含台灣地址資訊

### SEO 監控和維護

#### 1. 定期檢查
- 使用 Google Search Console 監控索引狀態
- 檢查 Core Web Vitals 分數
- 監控關鍵字排名變化

#### 2. 內容更新
- 定期更新 sitemap 的 `lastModified` 日期
- 根據搜尋趨勢調整關鍵字策略
- 持續優化頁面內容和結構

#### 3. 技術維護
- 定期更新 Next.js 版本
- 檢查和修復任何 SEO 相關的錯誤
- 優化載入速度和使用者體驗

## 📚 相關文檔

- [專案結構說明](ProjectStructure.md)
- [功能指南](FeaturesGuide.md)
- [EmailJS 設定](EmailjsSetup.md)
