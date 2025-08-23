# 架構說明：Vercel + Cloudflare D1/R2

## 🎯 架構概述

專案採用 Vercel + Cloudflare 的混合架構，結合兩者的優勢。

## 🔄 架構變更

### 當前架構：Vercel + Cloudflare
```
用戶 → Vercel (Next.js) → Cloudflare Worker API Gateway → Cloudflare D1/R2
```

## 📁 新增文件

### 1. Cloudflare Worker API 閘道
- `functions/api-gateway.js` - API 閘道 Worker 主文件
- `wrangler-api-gateway.toml` - 生產環境 Worker 配置
- `wrangler-dev.toml` - 本地開發 Worker 配置

### 2. 客戶端整合
- `src/lib/cloudflare-client.ts` - Cloudflare 服務客戶端
- `env.example` - 環境變數範例

### 3. 部署和文檔
- `doc/VercelDeployment.md` - 詳細部署指南
- `scripts/deploy.sh` - 自動化部署腳本
- 更新的 `README.md` 和 `package.json`

## 🔧 主要修改

### 1. API 路由更新
- `src/app/api/games/route.ts` - 從直接 D1 綁定改為 API 客戶端調用
- 移除 `getD1Database()` 調用
- 新增 `createCloudflareClient()` 調用

### 2. 依賴管理
- 保持現有 Next.js 依賴
- 新增 Wrangler CLI 和 Vercel CLI 腳本

### 3. 配置更新
- 新增 Cloudflare Worker 配置
- 更新環境變數管理
- 新增本地開發配置

## 🚀 部署流程

### 步驟 1: 部署 Cloudflare Worker
```bash
npm run deploy:worker
```

### 步驟 2: 設定環境變數
在 Vercel 中設定：
- `CLOUDFLARE_WORKER_URL`
- `CLOUDFLARE_API_SECRET`

### 步驟 3: 部署到 Vercel
```bash
npm run deploy:vercel
```

## 💡 優勢和考量

### ✅ 優勢
1. **Vercel 的前端體驗**: 更好的 Next.js 整合、更快的建置
2. **Cloudflare 的後端優勢**: D1 和 R2 的成本效益
3. **靈活的架構**: 可以獨立擴展前端和後端
4. **開發體驗**: 本地開發更靈活

### ⚠️ 考量
1. **延遲增加**: 多了一層 API 調用
2. **複雜性**: 需要管理兩個平台
3. **成本**: 兩邊都需要付費
4. **維護**: 需要維護 Worker 和 Next.js 兩套代碼

## 🔍 測試驗證

### 1. 本地開發測試
```bash
# 終端 1: 啟動 Worker
npm run dev:worker

# 終端 2: 啟動 Next.js
npm run dev
```

### 2. 生產環境測試
- 測試 D1 查詢功能
- 測試 R2 檔案操作
- 驗證 API 響應時間
- 檢查錯誤處理

## 🛠️ 故障排除

### 常見問題
1. **CORS 錯誤**: 檢查 Worker 的 CORS 設定
2. **認證失敗**: 確認 API 密鑰設定一致
3. **D1 查詢失敗**: 檢查 Worker 的 D1 綁定
4. **環境變數缺失**: 確認 Vercel 環境變數設定

### 日誌檢查
- Vercel: `vercel logs`
- Cloudflare: Dashboard 中的即時日誌

## 📈 性能優化建議

### 1. 快取策略
- 在 Vercel 端實作適當的快取
- 考慮使用 Cloudflare 的邊緣快取

### 2. 批量操作
- 盡可能批量處理 D1 查詢
- 減少 Worker 調用次數

### 3. 連接優化
- Worker 會自動管理 D1 連接
- 避免在 Vercel 端建立持久連接

## 🔮 未來改進

### 1. 監控和警報
- 實作性能監控
- 設定錯誤警報

### 2. 自動化
- CI/CD 流程自動化
- 自動測試和部署

### 3. 擴展性
- 考慮多區域部署
- 負載均衡策略

## 📚 相關文檔

- [Vercel 部署指南](VercelDeployment.md)
- [Cloudflare 整合指南](../CloudflareIntegration.md)
- [遊戲頁面指南](../GamePagesGuide.md)

## 🎉 架構優勢

這個架構結合了 Vercel 和 Cloudflare 的優勢，為您的專案提供了更好的開發體驗和部署靈活性。

如有任何問題或需要進一步的協助，請參考相關文檔或提交 Issue。
