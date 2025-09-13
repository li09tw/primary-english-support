# 安全指南

## 概述

本文件整合了 Primary English Support 專案的所有安全相關文檔，包括認證系統、安全機制、最佳實踐和故障排除等內容。

## 🔒 安全架構

### 整體安全設計

Primary English Support 採用多層次安全防護架構，確保系統和用戶資料的安全：

```
用戶層 → 應用層 → API層 → 資料庫層 → 基礎設施層
```

### 安全原則

1. **最小權限原則**: 只授予必要的權限
2. **深度防禦**: 多層次安全防護
3. **零信任架構**: 不信任任何請求
4. **安全預設**: 預設安全配置
5. **持續監控**: 實時安全監控

## 🔐 認證系統

### 安全驗證系統

#### 系統特性

- **密碼雜湊**: 使用 bcrypt 進行安全的密碼雜湊和加鹽
- **會話管理**: 使用 Next.js 的 cookies() 和安全的 HTTP-only cookies
- **速率限制**: 防止暴力破解和帳戶枚舉攻擊
- **帳戶鎖定**: 5次失敗後鎖定30分鐘
- **驗證碼安全**: 15分鐘時效，一次性使用，重新發送時舊碼失效
- **XSS 防護**: 輸入清理和輸出編碼
- **SQL Injection 防護**: 參數化查詢
- **CORS 防護**: 適當的安全標頭設定

#### 密碼安全

```typescript
// 使用 bcrypt 進行密碼雜湊
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password + salt, 12);

// 驗證密碼
const isValid = bcrypt.compareSync(password + salt, hash);
```

**安全特點**:
- 12輪鹽值生成（可調整）
- 密碼 + 鹽值進行雜湊
- 無法從雜湊值反推原始密碼

#### 會話管理

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

**安全特點**:
- HTTP-only：JavaScript 無法讀取
- Secure：僅在 HTTPS 下傳輸
- SameSite：防止跨站請求偽造
- 自動過期和清理

### 速率限制

```typescript
const RATE_LIMIT = {
  LOGIN_ATTEMPTS: 5,           // 5次失敗後鎖定
  LOCK_DURATION_MINUTES: 30,   // 鎖定30分鐘
  CODE_REQUEST_LIMIT: 3,       // 15分鐘內最多3次
  CODE_REQUEST_WINDOW: 15,     // 15分鐘視窗
};
```

**防護機制**:
- 帳戶鎖定：防止暴力破解
- 驗證碼限制：防止濫用
- IP 追蹤：識別攻擊來源

## 🛡️ 輸入驗證

### XSS 防護

```typescript
// XSS 防護：清理危險字符
const cleanInput = input.trim().replace(/[<>\"'&]/g, "");

// 輸出編碼
const encodeOutput = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
```

### SQL Injection 防護

```typescript
// SQL Injection 防護：參數化查詢
const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
const result = stmt.all([username]);

// 使用參數化查詢
const stmt = db.prepare(`
  INSERT INTO game_methods (id, title, description, category, difficulty)
  VALUES (?, ?, ?, ?, ?)
`);
stmt.run([id, title, description, category, difficulty]);
```

### 輸入驗證

```typescript
// 驗證輸入格式
const validateInput = (input: any, type: string) => {
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'username':
      return /^[a-zA-Z0-9_]{3,20}$/.test(input);
    case 'password':
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input);
    default:
      return false;
  }
};
```

## 🔒 安全標頭

### HTTP 安全標頭

```typescript
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
};
```

**防護機制**:
- 防止 MIME 類型嗅探
- 防止點擊劫持
- XSS 防護
- 控制 referrer 資訊
- 防止快取敏感資料
- 強制 HTTPS
- 內容安全政策

### CORS 設定

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-domain.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};
```

## 🔍 安全監控

### 登入嘗試監控

```typescript
// 記錄登入嘗試
const logLoginAttempt = async (ip: string, username: string, success: boolean) => {
  await db.prepare(`
    INSERT INTO login_attempts (id, ip_address, username, attempt_type, success, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run([
    generateId(),
    ip,
    username,
    'login',
    success,
    new Date().toISOString()
  ]);
};
```

### 異常活動檢測

```typescript
// 檢測異常登入
const detectAnomalousActivity = async (ip: string) => {
  const recentAttempts = await db.prepare(`
    SELECT COUNT(*) as count
    FROM login_attempts
    WHERE ip_address = ? AND created_at > datetime('now', '-1 hour')
  `).get([ip]);
  
  return recentAttempts.count > 10; // 1小時內超過10次嘗試
};
```

### 會話監控

```typescript
// 監控會話活動
const monitorSession = async (sessionToken: string, ip: string) => {
  const session = await db.prepare(`
    SELECT * FROM admin_sessions
    WHERE session_token = ? AND expires_at > datetime('now')
  `).get([sessionToken]);
  
  if (!session) {
    return { valid: false, reason: 'Session expired' };
  }
  
  // 檢查 IP 變化
  if (session.ip_address !== ip) {
    // 記錄可疑活動
    await logSuspiciousActivity(sessionToken, ip, 'IP change');
  }
  
  return { valid: true, session };
};
```

## 🚨 安全事件處理

### 事件分類

#### 1. 高風險事件
- 多次登入失敗
- 異常 IP 訪問
- 會話劫持嘗試
- SQL 注入嘗試

#### 2. 中風險事件
- 異常查詢模式
- 大量請求
- 可疑的用戶行為

#### 3. 低風險事件
- 正常的登入失敗
- 正常的會話過期

### 事件回應

```typescript
const handleSecurityEvent = async (event: SecurityEvent) => {
  switch (event.severity) {
    case 'high':
      // 立即鎖定帳戶
      await lockAccount(event.accountId);
      // 發送警報
      await sendAlert(event);
      break;
    case 'medium':
      // 增加監控
      await increaseMonitoring(event.ip);
      // 記錄事件
      await logEvent(event);
      break;
    case 'low':
      // 記錄事件
      await logEvent(event);
      break;
  }
};
```

## 🔧 安全配置

### 環境變數安全

```bash
# 生產環境安全配置
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
CLOUDFLARE_API_SECRET=your-secure-api-secret
```

**安全要求**:
- 使用強密碼（至少32位）
- 定期輪換密鑰
- 不要在程式碼中硬編碼
- 使用環境變數管理

### 資料庫安全

```sql
-- 建立安全索引
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_time ON login_attempts(created_at);
CREATE INDEX idx_sessions_token ON admin_sessions(session_token);

-- 定期清理敏感資料
DELETE FROM login_attempts WHERE created_at < datetime('now', '-90 days');
DELETE FROM verification_codes WHERE expires_at < datetime('now');
```

### API 安全

```typescript
// API 密鑰驗證
const validateApiKey = (request: Request) => {
  const apiKey = request.headers.get('X-API-Key');
  return apiKey === process.env.CLOUDFLARE_API_SECRET;
};

// 請求頻率限制
const rateLimit = new Map();
const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15分鐘
  const maxRequests = 100;
  
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const limit = rateLimit.get(ip);
  if (now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (limit.count >= maxRequests) {
    return false;
  }
  
  limit.count++;
  return true;
};
```

## 🛠️ 安全工具

### 密碼生成

```bash
# 生成安全的 API 密鑰
node scripts/generate-password.js

# 生成管理員密碼
node scripts/generate-admin-password.js "new-password"
```

### 安全檢查

```bash
# 檢查安全配置
npm run security:check

# 掃描漏洞
npm run security:scan

# 檢查依賴
npm audit
```

### 日誌分析

```bash
# 分析登入日誌
npm run security:analyze-login

# 檢查異常活動
npm run security:check-anomalies
```

## 🚨 故障排除

### 常見安全問題

#### 1. 認證失敗
**症狀**: 用戶無法登入
**可能原因**:
- 密碼錯誤
- 帳戶被鎖定
- 會話過期
- API 密鑰錯誤

**解決方法**:
- 檢查密碼正確性
- 檢查帳戶鎖定狀態
- 重新生成會話
- 驗證 API 密鑰

#### 2. 會話問題
**症狀**: 會話無效或過期
**可能原因**:
- Cookie 設定錯誤
- 會話過期
- 會話被清除

**解決方法**:
- 檢查 Cookie 設定
- 重新登入
- 檢查會話表

#### 3. 速率限制
**症狀**: 請求被限制
**可能原因**:
- 超過速率限制
- 異常活動檢測
- 系統負載過高

**解決方法**:
- 等待限制解除
- 檢查活動模式
- 優化請求頻率

### 安全日誌

```typescript
// 安全日誌記錄
const logSecurityEvent = (event: string, details: any) => {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${event}:`, details);
  
  // 記錄到資料庫
  db.prepare(`
    INSERT INTO security_logs (id, event, details, created_at)
    VALUES (?, ?, ?, ?)
  `).run([
    generateId(),
    event,
    JSON.stringify(details),
    new Date().toISOString()
  ]);
};
```

## 📊 安全指標

### 關鍵指標

- **登入成功率**: > 95%
- **認證延遲**: < 500ms
- **會話有效性**: > 99%
- **安全事件**: < 1/天
- **密碼強度**: 100% 符合要求

### 監控儀表板

```typescript
// 安全監控儀表板
const getSecurityMetrics = async () => {
  const metrics = await db.prepare(`
    SELECT 
      COUNT(*) as total_logins,
      SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_logins,
      SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_logins,
      COUNT(DISTINCT ip_address) as unique_ips
    FROM login_attempts
    WHERE created_at > datetime('now', '-24 hours')
  `).get();
  
  return {
    loginSuccessRate: (metrics.successful_logins / metrics.total_logins) * 100,
    failedLogins: metrics.failed_logins,
    uniqueIPs: metrics.unique_ips
  };
};
```

## 🔮 安全規劃

### 短期目標
- 實作更細緻的速率限制
- 增加更多安全監控
- 優化認證流程

### 長期目標
- 實作多因素認證
- 增加生物識別支援
- 實作零信任架構

## 📚 相關文檔

- [技術指南](TechnicalGuide.md)
- [資料庫指南](DatabaseGuide.md)
- [安全驗證系統指南](SecureVerificationSystemGuide.md)
- [驗證系統設定](VerificationSystemSetup.md)
- [環境變數設定](EnvironmentVariables.md)

## 🆘 安全支援

### 緊急聯絡

- **安全事件**: 立即回報安全事件
- **漏洞回報**: 透過安全管道回報漏洞
- **技術支援**: 聯絡技術團隊

### 安全檢查清單

- [ ] 定期更新密碼
- [ ] 檢查安全日誌
- [ ] 驗證安全配置
- [ ] 測試安全機制
- [ ] 更新安全文檔

---

**⚠️ 重要提醒**: 本安全指南涵蓋了專案的核心安全機制，請定期更新安全配置，監控安全事件，並遵循安全最佳實踐。
