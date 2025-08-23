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

#### 2.1 建立環境變數檔案
```bash
# 開發環境
cp env.example .env.local

# 生產環境
cp env.example .env.production
```

編輯 `.env.production` 檔案，填入您的 Email.js 配置：
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
ENABLE_LOCAL_D1=false
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
wrangler pages deploy .next --project-name=zs-primary-english-support
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
wrangler pages domain add zs-primary-english-support yourdomain.com
```

### 6. 環境變數管理

#### 6.1 在 Cloudflare Dashboard 中
1. 前往您的 Pages 專案
2. 點擊 "Settings" > "Environment variables"
3. 新增環境變數

#### 6.2 使用 Wrangler
```bash
wrangler pages secret put EMAILJS_SERVICE_ID --project-name=zs-primary-english-support
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

#### 7.4 GitHub 自動部署不工作
**症狀**：推送程式碼到 GitHub 後，網站沒有自動更新

**檢查步驟**：
1. 在 Cloudflare Dashboard 中檢查 Pages 專案
2. 確認 "Git Provider" 是否顯示 "GitHub"
3. 如果顯示 "No"，需要重新連接 GitHub

**解決方案**：
```bash
# 手動部署（臨時解決）
npm run build
wrangler pages deploy .next --project-name=zs-primary-english-support

# 長期解決：重新連接 GitHub
# 在 Cloudflare Dashboard 中：Pages > 專案 > Settings > Git > Connect to Git
```

**GitHub Secrets 檢查清單**：
- [ ] `CLOUDFLARE_API_TOKEN`
- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `EMAILJS_SERVICE_ID`
- [ ] `EMAILJS_TEMPLATE_ID`
- [ ] `EMAILJS_PUBLIC_KEY`

### 8. 監控和維護

#### 8.1 查看部署狀態
```bash
wrangler pages deployment list --project-name=zs-primary-english-support
```

#### 8.2 查看日誌
```bash
wrangler pages deployment tail --project-name=zs-primary-english-support
```

#### 8.3 回滾部署
```bash
wrangler pages deployment rollback --project-name=zs-primary-english-support
```

### 9. 更新部署

每次推送程式碼到 `main` 分支時，GitHub Actions 會自動觸發新的部署。您也可以在 Cloudflare Dashboard 中手動觸發重新部署。

## D1 資料庫部署和使用指引

### 1. 本地 D1 開發環境

#### 1.1 啟動本地 D1 資料庫
```bash
# 啟動開發服務器
npm run dev

# 啟用本地 D1（設置環境變數）
export ENABLE_LOCAL_D1=true
npm run dev

# 測試 API
curl http://localhost:3000/api/games/
```

#### 1.2 本地 D1 數據管理
```bash
# 查看本地 D1 表結構
wrangler d1 execute primary-english-db --command="PRAGMA table_info(game_methods);"

# 查詢本地 D1 數據
wrangler d1 execute primary-english-db --command="SELECT COUNT(*) FROM game_methods;"

# 查看前幾個遊戲記錄
wrangler d1 execute primary-english-db --command="SELECT id, title, categories FROM game_methods LIMIT 5;"
```

### 2. 遠端 D1 部署

#### 2.1 將本地數據推送到遠端 D1
```bash
# 執行所有批次文件，將 100 個遊戲推送到遠端 D1
wrangler d1 execute primary-english-db --remote --file=./scripts/batch1-games-1-10.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch2-games-11-20.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch3-games-21-30.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch4-games-31-40.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch5-games-41-50.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch6-games-51-60.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch7-games-61-70.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch8-games-71-80.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch9-games-81-90.sql
wrangler d1 execute primary-english-db --remote --file=./scripts/batch10-games-91-100.sql
```

#### 2.2 驗證遠端 D1 數據
```bash
# 檢查遠端 D1 數據總數
wrangler d1 execute primary-english-db --remote --command="SELECT COUNT(*) FROM game_methods;"

# 測試遠端 D1 查詢
wrangler d1 execute primary-english-db --remote --command="SELECT id, title, categories FROM game_methods LIMIT 3;"
```

### 3. 系統特點

#### 3.1 數據格式轉換
- **向後兼容**：支援舊的年級格式和新的布林值格式
- **智能回退**：如果 D1 不可用，自動使用模擬數據
- **年級顯示**：正確顯示年級標籤，支援多年級選擇
- **數據轉換**：自動將 D1 格式轉換為前端期望的格式

#### 3.2 開發環境配置
- **本地 D1**：開發時可使用本地 D1 資料庫
- **模擬數據**：D1 不可用時自動回退到模擬數據
- **環境變數**：通過 `ENABLE_LOCAL_D1=true` 控制本地 D1 使用

### 4. 故障排除

#### 4.1 本地 D1 問題
```bash
# 檢查 D1 資料庫狀態
wrangler d1 list

# 重新創建本地 D1 表
wrangler d1 execute primary-english-db --command="DROP TABLE IF EXISTS game_methods;"
wrangler d1 execute primary-english-db --file=./db/schema.sql

# 重新插入數據
# 執行上述的 10 個批次文件
```

#### 4.2 API 路由問題
- 檢查 `src/app/api/games/route.ts` 文件
- 確認 D1 綁定名稱正確（`PRIMARY_ENGLISH_DB`）
- 檢查環境變數設定

#### 4.3 前端顯示問題
- 確認 `GameMethodCard` 組件正確處理年級數據
- 檢查 `GameMethod` 類型定義
- 驗證 API 響應格式

### 5. 生產環境測試

#### 5.1 部署後驗證
```bash
# 測試生產環境 API
curl https://your-domain.pages.dev/api/games/

# 檢查響應數據
curl https://your-domain.pages.dev/api/games/ | jq '.success, .data | length'
```

#### 5.2 性能監控
- 監控 API 響應時間
- 檢查 D1 查詢性能
- 觀察前端渲染效果

### 10. 支援

如果遇到問題，可以：
1. 檢查 [Cloudflare Pages 文檔](https://developers.cloudflare.com/pages/)
2. 查看 [Wrangler 文檔](https://developers.cloudflare.com/workers/wrangler/)
3. 在 [Cloudflare Community](https://community.cloudflare.com/) 尋求協助
4. 參考 [Cloudflare D1 文檔](https://developers.cloudflare.com/d1/)
