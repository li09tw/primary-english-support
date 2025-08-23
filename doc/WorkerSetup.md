# Cloudflare Worker 環境變數設定指南

## 🎯 設定目標

為 Cloudflare Worker API 閘道設定 `API_SECRET` 環境變數，用於驗證來自 Vercel 的請求。

## 📍 Worker 信息

- **Worker 名稱**: `primary-english-api-gateway`
- **Worker URL**: `https://primary-english-api-gateway.h881520.workers.dev`
- **帳戶 ID**: `fb5f743ab46c64620ee0d67021a981b9`

## 🔧 設定步驟

### 方法 1: 使用 Wrangler CLI（推薦）

#### 1. 生成安全的 API 密鑰
```bash
# 生成 32 字符的隨機密鑰
openssl rand -base64 32
```

#### 2. 設定環境變數
```bash
# 替換 YOUR_SECRET_KEY 為上面生成的密鑰
wrangler secret put API_SECRET --config wrangler-api-gateway.toml
```

當提示輸入密鑰時，貼上生成的密鑰。

### 方法 2: 使用 Cloudflare Dashboard

#### 1. 登入 Cloudflare Dashboard
- 前往 [https://dash.cloudflare.com](https://dash.cloudflare.com)
- 登入您的帳戶

#### 2. 找到 Worker
- 點擊左側選單的 "Workers & Pages"
- 找到 `primary-english-api-gateway` Worker
- 點擊進入 Worker 詳情頁面

#### 3. 設定環境變數
- 點擊 "Settings" 標籤
- 在 "Environment Variables" 部分
- 點擊 "Add variable"
- 名稱: `API_SECRET`
- 值: 輸入您選擇的密鑰（建議 32+ 字符）
- 點擊 "Save and deploy"

## 🔑 API 密鑰建議

### 密鑰要求
- 長度: 至少 32 字符
- 複雜度: 包含大小寫字母、數字和特殊字符
- 唯一性: 不要在其他地方重複使用

### 生成範例
```bash
# 使用 OpenSSL 生成
openssl rand -base64 32

# 使用 Node.js 生成
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 使用 Python 生成
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## ✅ 驗證設定

### 1. 檢查環境變數
```bash
wrangler secret list --config wrangler-api-gateway.toml
```

應該看到 `API_SECRET` 在列表中。

### 2. 測試 API 閘道
```bash
# 測試 D1 查詢（應該返回認證錯誤）
curl -X POST https://primary-english-api-gateway.h881520.workers.dev/query \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) as total FROM game_methods"}'

# 預期結果: 401 Unauthorized
```

### 3. 測試認證
```bash
# 使用正確的 API 密鑰測試
curl -X POST https://primary-english-api-gateway.h881520.workers.dev/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_ACTUAL_SECRET_KEY" \
  -d '{"query": "SELECT COUNT(*) as total FROM game_methods"}'

# 預期結果: 200 OK 並返回資料
```

## 🚨 安全注意事項

### 1. 密鑰管理
- 不要在代碼中硬編碼密鑰
- 不要在 Git 倉庫中提交密鑰
- 定期輪換密鑰

### 2. 權限控制
- 只給必要的權限
- 監控 API 使用情況
- 設定速率限制（可選）

### 3. 日誌監控
- 監控認證失敗的請求
- 檢查異常的 API 調用
- 設定警報機制

## 🔄 更新 Vercel 環境變數

設定完 Worker 的 `API_SECRET` 後，需要在 Vercel 中設定相同的值：

```bash
# Vercel 環境變數
CLOUDFLARE_WORKER_URL=https://primary-english-api-gateway.h881520.workers.dev
CLOUDFLARE_API_SECRET=YOUR_ACTUAL_SECRET_KEY
NODE_ENV=production
```

## 📞 故障排除

### 常見問題

#### 1. 認證失敗
- 確認 `API_SECRET` 在兩邊設定一致
- 檢查密鑰沒有多餘的空格或換行
- 確認請求標頭正確

#### 2. 環境變數未生效
- 重新部署 Worker: `npm run deploy:worker`
- 檢查 Dashboard 中的設定
- 確認變數名稱拼寫正確

#### 3. 權限錯誤
- 確認 Worker 有權限訪問 D1 和 R2
- 檢查帳戶權限設定
- 確認資源綁定正確

## 🎉 設定完成

完成這些設定後，您的 Cloudflare Worker API 閘道就準備好了，可以接收來自 Vercel 的請求並安全地操作 D1 和 R2 服務。

下一步是設定 Vercel 環境變數並部署到 Vercel。
