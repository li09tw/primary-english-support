# 部署檢查清單

## 部署前準備

### 1. 環境變數檢查
- [ ] `.env.local` 文件已設定
- [ ] `CLOUDFLARE_WORKER_URL` 已設定（本地開發時為 `http://localhost:8787`）
- [ ] `CLOUDFLARE_API_SECRET` 已設定
- [ ] `NODE_ENV` 已設定為 `production`

### 2. 工具檢查
- [ ] `wrangler` CLI 已安裝並登入
- [ ] `vercel` CLI 已安裝並登入
- [ ] 有 Cloudflare 帳戶權限
- [ ] 有 Vercel 專案權限

## 部署流程

### 步驟 1: 部署 Cloudflare Worker
```bash
npm run deploy:worker
```

**檢查項目：**
- [ ] Worker 部署成功
- [ ] 獲得生產環境 Worker URL
- [ ] 更新 `.env.local` 中的 `CLOUDFLARE_WORKER_URL`

### 步驟 2: 部署 Next.js 到 Vercel
```bash
npm run deploy:vercel
```

**檢查項目：**
- [ ] Vercel 部署成功
- [ ] 獲得生產環境網站 URL
- [ ] 環境變數已正確設定

### 步驟 3: 使用完整部署腳本
```bash
npm run deploy:full
```

## 部署後檢查

### 1. Cloudflare Worker 檢查
- [ ] 訪問 Worker URL 確認服務正常
- [ ] 測試 API 端點是否回應
- [ ] 檢查 Worker 日誌是否有錯誤

### 2. Vercel 應用檢查
- [ ] 訪問生產環境網站
- [ ] 確認遊戲頁面能正常載入
- [ ] 檢查瀏覽器 Console 是否有錯誤
- [ ] 測試與 Cloudflare Worker 的連接

### 3. 環境變數檢查
- [ ] Vercel 環境變數已設定
- [ ] `CLOUDFLARE_WORKER_URL` 指向生產環境
- [ ] `CLOUDFLARE_API_SECRET` 與 Worker 設定一致

## 常見問題

### 1. CORS 錯誤
- [ ] 確認 Worker 的 CORS 設定正確
- [ ] 檢查 `Access-Control-Allow-Origin` 標頭

### 2. API 連接失敗
- [ ] 確認 Worker URL 正確
- [ ] 檢查 API 密鑰是否一致
- [ ] 確認 Worker 正在運行

### 3. 資料載入失敗
- [ ] 檢查 D1 資料庫連接
- [ ] 確認資料庫權限設定
- [ ] 檢查 Worker 日誌

## 回滾步驟

如果部署失敗，可以：

1. **回滾 Worker**：使用 `wrangler rollback` 命令
2. **回滾 Vercel**：在 Vercel 儀表板中回滾到上一個版本
3. **檢查日誌**：查看 Worker 和 Vercel 的錯誤日誌

## 監控和維護

### 1. 定期檢查
- [ ] Worker 運行狀態
- [ ] API 回應時間
- [ ] 錯誤率統計

### 2. 更新流程
- [ ] 先在本地測試
- [ ] 部署到測試環境
- [ ] 確認無問題後部署到生產環境

## 聯絡資訊

如有部署問題，請檢查：
1. Cloudflare Workers 儀表板
2. Vercel 部署日誌
3. 瀏覽器 Console 錯誤訊息
