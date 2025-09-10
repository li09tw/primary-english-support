# 環境變數設定指南

## 本地開發環境 (.env.local)

在專案根目錄創建 `.env.local` 文件：

```bash
# 本地開發環境變數
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development
```

## 生產環境變數

### 方法 1: Vercel Dashboard
1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇專案
3. 進入 Settings > Environment Variables
4. 新增以下變數：

```bash
CLOUDFLARE_WORKER_URL=https://primary-english-api-gateway.your-account.workers.dev
CLOUDFLARE_API_SECRET=your-secret-api-key-here
NODE_ENV=production
```

### EmailJS 設定（Server-side 使用 REST API）
請在 Vercel 專案的 Environment Variables 新增以下變數（不需 `NEXT_PUBLIC_` 前綴即可在伺服器端使用；若你需要前端也讀取純公開的 ID，可加 `NEXT_PUBLIC_` 版本）：

```
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_user_id
```

注意：若發信在伺服器端執行，建議不要將任何敏感金鑰暴露到前端。此專案已改為使用 EmailJS REST API 於伺服器端寄信。

## 重要提醒

1. **本地開發**: 使用 `http://localhost:8787`
2. **生產環境**: 使用實際的 Cloudflare Worker URL
3. **API 密鑰**: 必須與 Cloudflare Worker 中設定的相同
4. **安全性**: 不要將包含真實密鑰的 `.env` 文件提交到 Git

## 驗證設定

本地開發時，可以透過以下方式驗證：

```bash
# 檢查 Worker 是否運行
curl http://localhost:8787/query

# 檢查環境變數是否載入
npm run dev:full
```

## 故障排除

如果遇到環境變數問題：

1. 確認 `.env.local` 文件存在且格式正確
2. 重新啟動開發伺服器
3. 檢查 Vercel Dashboard 中的環境變數設定
4. 確認 Cloudflare Worker 的環境變數設定
