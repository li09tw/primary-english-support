# Email.js 設定指南

## 概述

Email.js 是一個允許您從 JavaScript 發送電子郵件的服務，無需後端伺服器。本專案使用 Email.js 來處理聯絡表單的郵件發送功能。

## 設定步驟

### 1. 註冊 Email.js 帳戶

1. 前往 [Email.js 官網](https://www.emailjs.com/)
2. 點擊 "Sign Up" 註冊新帳戶
3. 完成註冊並登入

### 2. 設定 Email Service

#### 2.1 選擇郵件服務提供商
Email.js 支援多種郵件服務提供商：

- **Gmail**: 使用您的 Gmail 帳戶
- **Outlook**: 使用您的 Outlook 帳戶
- **Yahoo**: 使用您的 Yahoo 帳戶
- **自訂 SMTP**: 使用您自己的 SMTP 伺服器

#### 2.2 設定 Gmail（推薦）
1. 在 Email.js Dashboard 中，點擊 "Email Services"
2. 點擊 "Add New Service"
3. 選擇 "Gmail"
4. 輸入您的 Gmail 帳戶資訊
5. 如果啟用了兩步驟驗證，需要生成應用程式密碼
6. 點擊 "Create Service"

### 3. 建立 Email Template

#### 3.1 建立聯絡表單模板
1. 在 Email.js Dashboard 中，點擊 "Email Templates"
2. 點擊 "Create New Template"
3. 選擇 "Blank Template"
4. 設定模板內容：

**模板變數：**
- `{{from_name}}`: 寄件者姓名
- `{{from_email}}`: 寄件者 Email
- `{{subject}}`: 主旨
- `{{message}}`: 訊息內容

**範例模板內容：**
```html
<!DOCTYPE html>
<html>
<head>
    <title>新的聯絡表單訊息</title>
</head>
<body>
    <h2>收到新的聯絡表單訊息</h2>
    
    <h3>寄件者資訊：</h3>
    <p><strong>姓名：</strong>{{from_name}}</p>
    <p><strong>Email：</strong>{{from_email}}</p>
    <p><strong>主旨：</strong>{{subject}}</p>
    
    <h3>訊息內容：</h3>
    <p>{{message}}</p>
    
    <hr>
    <p><small>此訊息由 Z的國小英語支援(ZPES) 網站自動發送</small></p>
</body>
</html>
```

5. 儲存模板並記下 Template ID

### 4. 取得必要的資訊

設定完成後，您需要以下資訊：

1. **Service ID**: 在 Email Services 頁面中查看
2. **Template ID**: 在 Email Templates 頁面中查看
3. **Public Key**: 在 Account > API Keys 頁面中查看

### 5. 設定環境變數

#### 5.1 本地開發
建立 `.env.local` 檔案：
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

#### 5.2 生產環境
在 Vercel 中設定環境變數：
1. 前往 Vercel Dashboard
2. 選擇您的專案
3. 點擊 "Settings" > "Environment Variables"
4. 新增以下變數：
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`

> 📖 **詳細部署說明請參考**: [部署指南](DeploymentGuide.md)

### 6. 測試設定

#### 6.1 本地測試
1. 啟動開發伺服器：`npm run dev`
2. 前往聯絡頁面
3. 填寫並提交聯絡表單
4. 檢查是否收到郵件

#### 6.2 生產環境測試
1. 部署到 Vercel
2. 在生產網站上測試聯絡表單
3. 確認郵件發送功能正常

## 進階設定

### 1. 自訂郵件樣式

您可以修改 Email Template 來改善郵件的外觀：

```html
<!DOCTYPE html>
<html>
<head>
    <title>新的聯絡表單訊息</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; }
        .value { color: #666; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Z的國小英語支援(ZPES)</h1>
            <p>收到新的聯絡表單訊息</p>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">姓名：</span>
                <span class="value">{{from_name}}</span>
            </div>
            
            <div class="field">
                <span class="label">Email：</span>
                <span class="value">{{from_email}}</span>
            </div>
            
            <div class="field">
                <span class="label">主旨：</span>
                <span class="value">{{subject}}</span>
            </div>
            
            <div class="field">
                <span class="label">訊息內容：</span>
                <div class="value" style="margin-top: 10px; padding: 15px; background: white; border-left: 4px solid #667eea;">
                    {{message}}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>此訊息由 Z的國小英語支援(ZPES) 網站自動發送</p>
            <p>© 2024 Z的國小英語支援(ZPES). 保留所有權利。</p>
        </div>
    </div>
</body>
</html>
```

### 2. 設定多個郵件模板

您可以建立不同的模板用於不同用途：

- **聯絡表單通知**: 當使用者提交聯絡表單時
- **系統通知**: 系統相關的重要通知
- **更新通知**: 當有新功能或更新時

### 3. 郵件發送限制

Email.js 的免費方案有以下限制：
- 每月 200 封郵件
- 每小時 50 封郵件

如果需要更多配額，可以升級到付費方案。

## 故障排除

### 1. 郵件無法發送

**可能原因：**
- Service ID、Template ID 或 Public Key 錯誤
- 郵件服務提供商設定問題
- 網路連線問題

**解決方法：**
1. 檢查環境變數設定
2. 確認 Email Service 設定正確
3. 檢查瀏覽器控制台錯誤訊息
4. 查看 Email.js Dashboard 的錯誤日誌

### 2. 郵件發送延遲

**可能原因：**
- 郵件服務提供商處理延遲
- 網路連線速度問題

**解決方法：**
1. 等待一段時間
2. 檢查郵件是否在垃圾郵件資料夾
3. 確認郵件服務提供商狀態

### 3. 郵件格式問題

**可能原因：**
- HTML 模板語法錯誤
- 變數名稱不匹配

**解決方法：**
1. 檢查 HTML 語法
2. 確認變數名稱與程式碼中的一致
3. 使用 Email.js 的模板預覽功能

## 支援資源

- [Email.js 官方文檔](https://www.emailjs.com/docs/)
- [Email.js GitHub](https://github.com/emailjs/emailjs-node)
- [Email.js 社群論壇](https://community.emailjs.com/)

## 🔄 後端遷移

### 概述

為了提升安全性和遵循最佳實踐，我們將 EmailJS 驗證碼發送功能從前端遷移到後端 API。這次更新確保了敏感操作在伺服器端執行，提升了整體安全性。

### 更新內容

#### 1. 套件更新

**新增套件**
```bash
npm install @emailjs/nodejs
```

**保留套件**
- `@emailjs/browser` - 仍用於聯絡表單等用戶主動發送的功能

#### 2. 檔案更新

**更新檔案**
- `src/lib/emailjs-server.ts` - 使用 @emailjs/nodejs 套件
- `src/app/garden/login/page.tsx` - 移除前端 EmailJS 直接調用
- `package.json` - 新增 @emailjs/nodejs 依賴

**保持不變**
- `src/lib/emailjs-client.ts` - 仍用於聯絡表單
- `src/components/ContactForm.tsx` - 保持客戶端實現

#### 3. API 流程更新

**舊流程（前端發送）**
```
1. 用戶輸入帳號
2. 前端調用 /api/auth/ 獲取驗證碼
3. 前端直接使用 EmailJS 發送郵件
4. 用戶輸入驗證碼
5. 前端調用 /api/auth/ 驗證
```

**新流程（後端發送）**
```
1. 用戶輸入帳號
2. 前端調用 /api/auth/ 建立會話
3. 前端調用 /api/auth/verification 發送驗證碼
4. 後端使用 @emailjs/nodejs 發送郵件
5. 用戶輸入驗證碼
6. 前端調用 /api/auth/verification 驗證
```

### 技術實現

#### 1. 後端 EmailJS 實現

```typescript
// src/lib/emailjs-server.ts
import emailjs from "@emailjs/nodejs";

export async function sendNotificationEmail(
  toEmail: string,
  subject: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const result = await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    {
      title: subject,
      name: "系統通知",
      type: "通知",
      email: toEmail,
      content: content,
    },
    {
      publicKey: EMAILJS_CONFIG.publicKey,
    }
  );
  
  return { success: true };
}
```

#### 2. 前端登入流程更新

```typescript
// 發送驗證碼
const loginResponse = await fetch("/api/auth/", {
  method: "POST",
  body: JSON.stringify({ username: loginState.username.trim() }),
});

if (loginData.success) {
  const codeResponse = await fetch("/api/auth/verification", {
    method: "POST",
    credentials: "include",
  });
}

// 驗證驗證碼
const response = await fetch("/api/auth/verification", {
  method: "PUT",
  credentials: "include",
  body: JSON.stringify({ code: loginState.code.trim() }),
});
```

### 安全性提升

#### 1. 敏感操作後端化
- 驗證碼生成和發送在伺服器端執行
- 減少前端暴露的敏感資訊
- 提升整體安全性

#### 2. 會話管理
- 使用會話 token 進行身份驗證
- 防止未授權的驗證碼請求
- 更好的安全控制

#### 3. 錯誤處理
- 統一的錯誤處理機制
- 更好的日誌記錄
- 提升除錯能力

## 🔒 安全性增強

### 概述

為了提升驗證碼系統的安全性，我們實作了以下安全措施：

1. **驗證碼加密傳輸** - 在發送給 EmailJS 之前先加密驗證碼
2. **自動解密驗證** - 系統會自動處理加密和未加密的驗證碼
3. **降級處理** - 如果加密失敗，系統仍能正常運作

### 環境變數設定

#### 新增環境變數

在 Vercel 專案設定中新增以下環境變數：

```bash
# 驗證碼加密金鑰（建議使用強密碼）
EMAILJS_ENCRYPTION_KEY=your-strong-encryption-key-here
```

#### 現有環境變數（保持不變）

```bash
# EmailJS 配置（Vercel 要求使用 NEXT_PUBLIC_ 前綴）
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-template-id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-public-key
```

### 安全性提升

#### 1. 驗證碼安全監控

- **加密方式**: AES-256-CBC
- **金鑰生成**: 使用 scrypt 從環境變數生成
- **隨機 IV**: 每次加密使用不同的初始化向量
- **用途**: 僅用於安全日誌記錄，不影響用戶體驗

#### 2. 傳輸安全

- 驗證碼在系統內部進行加密記錄，用於安全監控
- 用戶收到的是明碼，確保良好的使用體驗
- 即使駭客攔截網路請求，也需要加密金鑰才能解密日誌中的驗證碼

#### 3. 用戶體驗優化

- 用戶直接看到明碼驗證碼，無需額外操作
- 保持原有的使用流程，不增加複雜度
- 系統內部仍進行安全監控和記錄

### 使用方式

#### 發送驗證碼

系統會自動：
1. 生成 6 位數驗證碼
2. 將明碼驗證碼發送到信箱（用戶直接可見）
3. 在系統日誌中記錄加密版本（用於安全監控）

#### 驗證驗證碼

系統會自動：
1. 接收用戶輸入的明碼驗證碼
2. 進行正常的驗證流程
3. 在日誌中記錄驗證活動（用於安全監控）

### 安全建議

1. **定期更換加密金鑰**
   - 建議每 3-6 個月更換一次 `EMAILJS_ENCRYPTION_KEY`
   - 使用強密碼（至少 32 字元）

2. **監控異常活動**
   - 檢查登入嘗試次數
   - 監控驗證碼請求頻率
   - 記錄失敗的驗證嘗試

3. **備份加密金鑰**
   - 安全儲存加密金鑰
   - 確保金鑰不會遺失

### 技術細節

#### 加密流程

```typescript
// 1. 生成隨機 IV
const iv = crypto.randomBytes(16);

// 2. 從環境變數生成金鑰
const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

// 3. 加密驗證碼
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encrypted = cipher.update(code, 'utf8', 'hex');
encrypted += cipher.final('hex');

// 4. 組合 IV 和加密內容
return iv.toString('hex') + ':' + encrypted;
```

#### 解密流程

```typescript
// 1. 分離 IV 和加密內容
const parts = encryptedCode.split(':');
const iv = Buffer.from(parts[0], 'hex');
const encrypted = parts[1];

// 2. 生成相同的金鑰
const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

// 3. 解密驗證碼
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
```

## 安全注意事項

1. **不要暴露 Private Key**: 只使用 Public Key
2. **限制郵件發送頻率**: 避免被濫用
3. **驗證輸入資料**: 在發送郵件前驗證表單資料
4. **監控使用量**: 定期檢查郵件發送統計
5. **定期更換加密金鑰**: 確保驗證碼系統安全
6. **監控異常活動**: 檢查登入嘗試和驗證碼請求
