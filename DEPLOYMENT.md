# 部署指南

## 部署到 Cloudflare Pages

### 1. 準備工作

#### 1.1 安裝 Cloudflare CLI
```bash
npm install -g wrangler
```

#### 1.2 登入 Cloudflare
```bash
wrangler login
```

### 2. 設定環境變數

#### 2.1 建立 .env.local 檔案
```bash
cp env.example .env.local
```

編輯 `.env.local` 檔案，填入您的 Email.js 配置：
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

#### 2.2 設定 GitHub Secrets
在 GitHub 專案設定中，設定以下 Secrets：

- `CLOUDFLARE_API_TOKEN`: 您的 Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: 您的 Cloudflare Account ID
- `EMAILJS_SERVICE_ID`: Email.js Service ID
- `EMAILJS_TEMPLATE_ID`: Email.js Template ID
- `EMAILJS_PUBLIC_KEY`: Email.js Public Key

### 3. 部署步驟

#### 3.1 本地建置測試
```bash
npm run build
```

#### 3.2 推送到 GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 3.3 自動部署
推送程式碼到 `main` 分支後，GitHub Actions 會自動建置並部署到 Cloudflare Pages。

### 4. 手動部署（可選）

#### 4.1 使用 Wrangler 部署
```bash
wrangler pages deploy .next --project-name=primary-english-support
```

#### 4.2 使用 Cloudflare Dashboard
1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 前往 Pages 頁面
3. 點擊 "Create a project"
4. 選擇 "Connect to Git"
5. 選擇您的 GitHub 專案
6. 設定建置配置：
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `/`

### 5. 自訂域名（可選）

#### 5.1 在 Cloudflare Dashboard 中
1. 前往您的 Pages 專案
2. 點擊 "Custom domains"
3. 新增您的域名
4. 設定 DNS 記錄

#### 5.2 使用 Wrangler
```bash
wrangler pages domain add primary-english-support yourdomain.com
```

### 6. 環境變數管理

#### 6.1 在 Cloudflare Dashboard 中
1. 前往您的 Pages 專案
2. 點擊 "Settings" > "Environment variables"
3. 新增環境變數

#### 6.2 使用 Wrangler
```bash
wrangler pages secret put EMAILJS_SERVICE_ID --project-name=primary-english-support
```

### 7. 故障排除

#### 7.1 建置失敗
- 檢查 Node.js 版本（建議使用 18.x）
- 確認所有依賴都已安裝
- 檢查環境變數設定

#### 7.2 部署失敗
- 確認 Cloudflare API Token 權限
- 檢查 Account ID 是否正確
- 確認專案名稱是否一致

#### 7.3 網站無法訪問
- 檢查自訂域名設定
- 確認 DNS 記錄是否正確
- 檢查 Cloudflare 快取設定

### 8. 監控和維護

#### 8.1 查看部署狀態
```bash
wrangler pages deployment list --project-name=primary-english-support
```

#### 8.2 查看日誌
```bash
wrangler pages deployment tail --project-name=primary-english-support
```

#### 8.3 回滾部署
```bash
wrangler pages deployment rollback --project-name=primary-english-support
```

### 9. 更新部署

每次推送程式碼到 `main` 分支時，GitHub Actions 會自動觸發新的部署。您也可以在 Cloudflare Dashboard 中手動觸發重新部署。

### 10. 支援

如果遇到問題，可以：
1. 檢查 [Cloudflare Pages 文檔](https://developers.cloudflare.com/pages/)
2. 查看 [Wrangler 文檔](https://developers.cloudflare.com/workers/wrangler/)
3. 在 [Cloudflare Community](https://community.cloudflare.com/) 尋求協助
