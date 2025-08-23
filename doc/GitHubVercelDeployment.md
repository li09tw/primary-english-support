# GitHub + Vercel 自動部署指南

## 🎯 部署方式

本專案採用 GitHub + Vercel 的自動部署方式，當您推送代碼到 GitHub 時，Vercel 會自動建置並部署您的應用。

## 🚀 設定步驟

### 步驟 1: 在 Vercel 上創建專案

#### 1.1 登入 Vercel
- 前往 [https://vercel.com/dashboard](https://vercel.com/dashboard)
- 使用 GitHub 帳戶登入

#### 1.2 創建新專案
- 點擊 "New Project"
- 選擇 "Import Git Repository"
- 選擇您的 GitHub 倉庫: `primary-english-support`
- 點擊 "Import"

#### 1.3 專案配置
- **Project Name**: `primary-english-support` (或您喜歡的名稱)
- **Framework Preset**: Next.js (Vercel 會自動檢測)
- **Root Directory**: `./` (保持預設)
- **Build Command**: `npm run build` (保持預設)
- **Output Directory**: `.next` (保持預設)
- **Install Command**: `npm install` (保持預設)

### 步驟 2: 設定環境變數

#### 2.1 進入專案設定
- 在專案頁面點擊 "Settings" 標籤
- 點擊左側選單的 "Environment Variables"

#### 2.2 添加環境變數
點擊 "Add New" 並添加以下變數：

```bash
# 必須設定的環境變數
CLOUDFLARE_WORKER_URL=https://primary-english-api-gateway.h881520.workers.dev
CLOUDFLARE_API_SECRET=B/L8CTVEkPmGbr/z0AIsa4Md2HSU7b7VnKr33nqtcdU=
NODE_ENV=production
```

#### 2.3 環境變數設定
- **Environment**: 選擇 "Production" 和 "Preview"
- **Production**: 生產環境
- **Preview**: 預覽環境（Pull Request 時使用）

### 步驟 3: 部署設定

#### 3.1 建置設定
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 3.2 域名設定（可選）
- 點擊 "Domains" 標籤
- 添加自定義域名（如果您有）

## 🔄 自動部署流程

### 推送觸發部署
```bash
# 1. 提交您的更改
git add .
git commit -m "feat: 更新功能"

# 2. 推送到 GitHub
git push origin main

# 3. Vercel 自動部署
# - 監控到推送
# - 自動建置專案
# - 部署到生產環境
```

### Pull Request 預覽部署
```bash
# 1. 創建功能分支
git checkout -b feature/new-feature

# 2. 提交更改
git add .
git commit -m "feat: 新功能"

# 3. 推送到 GitHub
git push origin feature/new-feature

# 4. 創建 Pull Request
# - Vercel 會自動創建預覽部署
# - 您可以在 PR 中看到部署狀態
```

## 📊 部署狀態檢查

### 1. Vercel Dashboard
- 在專案頁面查看部署狀態
- 查看建置日誌和錯誤信息
- 監控部署性能

### 2. GitHub 集成
- 在 GitHub 倉庫中查看 Vercel 部署狀態
- 在 Pull Request 中查看預覽部署鏈接
- 部署失敗時會顯示錯誤信息

### 3. 部署通知
- Vercel 會發送部署狀態通知
- 可以設定 Slack、Discord 等通知

## 🧪 測試部署

### 1. 測試生產環境
部署完成後，訪問您的 Vercel 域名測試功能：
- 首頁是否正常載入
- API 路由是否正常工作
- 資料庫連接是否正常

### 2. 測試 API 功能
```bash
# 測試遊戲 API
curl "https://your-app.vercel.app/api/games?page=1&limit=10"

# 預期結果: 返回遊戲資料，沒有資料庫連接錯誤
```

### 3. 檢查日誌
如果遇到問題，檢查 Vercel 的建置和運行日誌：
- 建置日誌中的錯誤信息
- 運行時日誌中的錯誤信息

## 🚨 常見問題和解決方案

### 1. 建置失敗

#### 問題: TypeScript 編譯錯誤
```bash
# 解決方案: 本地修復錯誤
npm run build
npm run lint
```

#### 問題: 依賴安裝失敗
```bash
# 解決方案: 檢查 package.json 和 package-lock.json
rm -rf node_modules package-lock.json
npm install
```

### 2. 運行時錯誤

#### 問題: 環境變數未設定
- 檢查 Vercel 環境變數設定
- 確認變數名稱拼寫正確
- 確認環境變數已部署

#### 問題: Cloudflare 服務不可用
- 檢查 Worker 是否正常運行
- 確認 API 密鑰設定正確
- 檢查 D1 和 R2 權限

### 3. 部署延遲

#### 問題: 建置時間過長
- 檢查依賴大小
- 優化建置配置
- 考慮使用 Vercel 的建置快取

## 🔧 優化建議

### 1. 建置優化
- 使用 `.vercelignore` 排除不必要的文件
- 優化圖片和靜態資源
- 使用 Next.js 的建置優化

### 2. 部署優化
- 設定自動回滾策略
- 使用 Vercel 的邊緣函數
- 實作建置快取

### 3. 監控優化
- 設定性能監控
- 實作錯誤追蹤
- 設定部署通知

## 📚 相關文檔

- [Vercel 部署指南](VercelDeployment.md)
- [Cloudflare Worker 設定指南](WorkerSetup.md)
- [部署檢查清單](DeploymentChecklist.md)
- [專案結構說明](ProjectStructure.md)

## 🎉 部署完成

完成這些設定後，您的專案就會實現：
- ✅ 自動化部署
- ✅ 預覽部署
- ✅ 即時建置
- ✅ 自動回滾
- ✅ 性能監控

每次推送代碼到 GitHub，Vercel 都會自動部署您的更新！
