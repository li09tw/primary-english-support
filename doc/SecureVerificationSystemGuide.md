# 🔒 Garden 安全驗證系統完整指南

## 📋 概述

這是一個企業級的安全驗證系統，完全符合您提出的安全要求，包含：

- **密碼雜湊**：使用 bcrypt 進行安全的密碼雜湊和加鹽
- **會話管理**：使用 Next.js 的 cookies() 和安全的 HTTP-only cookies
- **速率限制**：防止暴力破解和帳戶枚舉攻擊
- **帳戶鎖定**：5次失敗後鎖定30分鐘
- **驗證碼安全**：15分鐘時效，一次性使用，重新發送時舊碼失效
- **XSS 防護**：輸入清理和輸出編碼
- **SQL Injection 防護**：參數化查詢
- **CORS 防護**：適當的安全標頭設定

## 🚀 快速部署

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `env.example` 到 `.env.local` 並設定：

```bash
# Cloudflare 配置
CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
CLOUDFLARE_API_SECRET=your-secret-key

# EmailJS 配置
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key

# 安全設定
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 3. 部署資料庫

```bash
# 設定環境變數
export CLOUDFLARE_ACCOUNT_ID=your-account-id
export CLOUDFLARE_API_TOKEN=your-api-token
export DATABASE_NAME=your-database-name

# 執行部署腳本
chmod +x scripts/deploy-secure-verification-system.sh
./scripts/deploy-secure-verification-system.sh
```

### 4. 部署到 Vercel

```bash
npm run build
npm run deploy:vercel
```

## 🏗️ 系統架構

### 資料庫結構

```sql
-- 管理員帳號表
admin_accounts (
  id, username, email, password_hash, salt,
  is_active, is_locked, lock_expires_at,
  failed_attempts, last_failed_attempt,
  created_at, updated_at
)

-- 驗證碼表
verification_codes (
  id, account_id, code_hash, expires_at,
  is_used, created_at
)

-- 會話管理表
admin_sessions (
  id, account_id, session_token, expires_at,
  ip_address, user_agent, created_at
)

-- 登入嘗試記錄表
login_attempts (
  id, ip_address, username, attempt_type,
  success, created_at
)
```

### API 路由

- `POST /api/auth/login` - 密碼登入
- `POST /api/auth/verification` - 發送驗證碼
- `PUT /api/auth/verification` - 驗證驗證碼
- `GET /api/auth/session` - 檢查會話狀態
- `DELETE /api/auth/session` - 登出

### 中間件保護

- `/garden/*` - 需要完整驗證
- `/api/*` - API 路由保護（除公開路由外）

## 🔐 安全特性詳解

### 1. 密碼安全

```typescript
// 使用 bcrypt 進行密碼雜湊
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password + salt, 12);

// 驗證密碼
const isValid = bcrypt.compareSync(password + salt, hash);
```

**安全特點：**
- 12輪鹽值生成（可調整）
- 密碼 + 鹽值進行雜湊
- 無法從雜湊值反推原始密碼

### 2. 會話管理

```typescript
// 設定安全的 HTTP-only Cookie
cookies().set("garden_session", sessionToken, {
  httpOnly: true,           // 防止 XSS 竊取
  secure: true,             // 僅 HTTPS 傳輸
  sameSite: "strict",       // 防止 CSRF 攻擊
  expires: expiresAt,       // 24小時過期
  path: "/",                // 限制路徑
});
```

**安全特點：**
- HTTP-only：JavaScript 無法讀取
- Secure：僅在 HTTPS 下傳輸
- SameSite：防止跨站請求偽造
- 自動過期和清理

### 3. 速率限制

```typescript
// 登入失敗限制
const RATE_LIMIT = {
  LOGIN_ATTEMPTS: 5,           // 5次失敗後鎖定
  LOCK_DURATION_MINUTES: 30,   // 鎖定30分鐘
  CODE_REQUEST_LIMIT: 3,       // 15分鐘內最多3次
  CODE_REQUEST_WINDOW: 15,     // 15分鐘視窗
};
```

**防護機制：**
- 帳戶鎖定：防止暴力破解
- 驗證碼限制：防止濫用
- IP 追蹤：識別攻擊來源

### 4. 輸入驗證

```typescript
// XSS 防護：清理危險字符
const cleanInput = input.trim().replace(/[<>\"'&]/g, "");

// SQL Injection 防護：參數化查詢
const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
const result = stmt.all([username]);
```

**安全特點：**
- 輸入清理：移除危險 HTML 標籤
- 參數化查詢：防止 SQL 注入
- 類型檢查：確保資料格式正確

### 5. 安全標頭

```typescript
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};
```

**防護機制：**
- 防止 MIME 類型嗅探
- 防止點擊劫持
- XSS 防護
- 控制 referrer 資訊
- 防止快取敏感資料

## 📱 使用者體驗流程

### 1. 登入流程

```
使用者 → 輸入帳號密碼 → 密碼驗證 → 發送驗證碼 → 輸入驗證碼 → 進入系統
```

### 2. 安全檢查點

- **帳號存在性**：無論帳號是否存在，都回傳相同錯誤訊息
- **密碼驗證**：使用安全的雜湊比對
- **帳戶狀態**：檢查是否被鎖定或停用
- **會話建立**：生成安全的會話令牌
- **驗證碼發送**：透過 EmailJS 發送

### 3. 錯誤處理

```typescript
// 統一的錯誤訊息（防止帳號枚舉）
return NextResponse.json(
  { success: false, message: "帳號或密碼錯誤" },
  { status: 401 }
);
```

## 🛠️ 維護和監控

### 1. 定期清理

```sql
-- 清理過期會話
DELETE FROM admin_sessions WHERE expires_at < datetime('now');

-- 清理過期驗證碼
DELETE FROM verification_codes WHERE expires_at < datetime('now');

-- 清理舊的登入記錄
DELETE FROM login_attempts WHERE created_at < datetime('now', '-30 days');
```

### 2. 安全監控

- 監控登入失敗次數
- 追蹤異常 IP 位址
- 檢查會話異常
- 監控驗證碼濫用

### 3. 密碼更新

```bash
# 生成新的密碼雜湊
node scripts/generate-admin-password.js "new-password"
```

## 🚨 故障排除

### 常見問題

1. **會話驗證失敗**
   - 檢查 Cookie 設定
   - 確認資料庫連線
   - 檢查中間件配置

2. **驗證碼無法發送**
   - 檢查 EmailJS 設定
   - 確認信箱地址正確
   - 檢查速率限制

3. **登入被鎖定**
   - 等待鎖定時間結束
   - 檢查失敗嘗試記錄
   - 手動重置鎖定狀態

### 除錯工具

```bash
# 檢查會話狀態
curl -H "Cookie: garden_session=your-token" /api/auth/session

# 檢查資料庫連線
npm run test:cloudflare

# 查看部署日誌
vercel logs
```

## 🔒 安全最佳實踐

### 1. 生產環境設定

- 使用強密碼（至少12位）
- 啟用 HTTPS
- 定期更新依賴套件
- 監控安全日誌

### 2. 密碼政策

- 最小長度：12位
- 包含：大小寫字母、數字、特殊字符
- 定期更換：90天
- 不重複使用

### 3. 會話安全

- 24小時自動過期
- 登出時立即清除
- 異常活動檢測
- 多裝置管理

## 📚 相關文件

- [Next.js 安全最佳實踐](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP 安全指南](https://owasp.org/www-project-top-ten/)
- [bcrypt 安全說明](https://en.wikipedia.org/wiki/Bcrypt)
- [HTTP 安全標頭](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

## 🆘 支援

如有問題，請檢查：

1. 部署日誌和錯誤訊息
2. 環境變數設定
3. 資料庫連線狀態
4. 瀏覽器開發者工具
5. 網路請求狀態

---

**⚠️ 重要提醒：** 此系統提供企業級安全保護，請妥善保管管理員憑證，定期更新密碼，並監控系統活動。
