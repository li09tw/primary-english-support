# Garden 驗證系統設定指南

## 概述

Garden 頁面現在需要帳號驗證才能訪問，使用驗證碼系統確保安全性。

## 功能特點

- **帳號驗證**：使用者必須輸入有效的帳號
- **驗證碼發送**：透過 EmailJS 發送 6 位數驗證碼到指定信箱
- **時效控制**：驗證碼有效期為 12 小時
- **安全防護**：防止 XSS 攻擊和 CORS 問題
- **一次性使用**：每個驗證碼只能使用一次

## 部署步驟

### 1. 建立資料庫表

執行以下 SQL 腳本到 Cloudflare D1：

```bash
# 設定環境變數
export CLOUDFLARE_ACCOUNT_ID=your-account-id
export CLOUDFLARE_API_TOKEN=your-api-token
export DATABASE_NAME=your-database-name

# 執行部署腳本
chmod +x scripts/deploy-verification-system.sh
./scripts/deploy-verification-system.sh
```

### 2. 設定預設帳號

修改 `scripts/add-verification-system.sql` 中的預設信箱：

```sql
INSERT OR IGNORE INTO admin_accounts (id, username, email, created_at, updated_at) 
VALUES (
  'admin_001',
  'admin',
  'your-actual-email@example.com',  -- 修改為實際信箱
  datetime('now'),
  datetime('now')
);
```

### 3. 設定 EmailJS

在 Vercel 環境變數中設定：

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key
```

### 4. 重新部署

```bash
npm run build
npm run deploy:vercel
```

## 使用流程

1. 使用者訪問 `/garden` 頁面
2. 系統顯示驗證介面
3. 使用者輸入帳號
4. 系統發送驗證碼到對應信箱
5. 使用者輸入驗證碼
6. 驗證成功後進入管理介面

## 安全特性

### XSS 防護
- 所有使用者輸入都經過清理
- 移除危險的 HTML 標籤和腳本
- 使用安全的字串處理方法

### CORS 防護
- API 路由設定適當的 CORS 標頭
- 限制允許的來源和方法
- 驗證 API 密鑰

### 驗證碼安全
- 6 位數隨機驗證碼
- 12 小時有效期
- 一次性使用
- 資料庫儲存和追蹤

## 資料庫結構

### admin_accounts 表
- `id`: 唯一識別碼
- `username`: 使用者帳號
- `email`: 電子信箱
- `is_active`: 帳號啟用狀態
- `created_at`: 建立時間
- `updated_at`: 更新時間

### verification_codes 表
- `id`: 唯一識別碼
- `account_id`: 關聯的帳號 ID
- `code`: 6 位數驗證碼
- `expires_at`: 過期時間
- `is_used`: 是否已使用
- `created_at`: 建立時間

## 故障排除

### 驗證碼無法發送
1. 檢查 EmailJS 設定
2. 確認信箱地址正確
3. 檢查 Cloudflare Worker 連線

### 驗證失敗
1. 檢查驗證碼是否過期
2. 確認驗證碼已正確輸入
3. 檢查資料庫連線狀態

### 頁面無法載入
1. 檢查 AuthGuard 組件
2. 確認 API 路由正常運作
3. 檢查瀏覽器控制台錯誤

## 維護注意事項

- 定期清理過期的驗證碼
- 監控驗證失敗的次數
- 定期更新 EmailJS 設定
- 備份管理員帳號資料

## 聯絡支援

如有問題，請檢查：
1. 部署日誌
2. Cloudflare Worker 狀態
3. Vercel 部署狀態
4. 瀏覽器開發者工具
