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
在 Cloudflare Pages 中設定環境變數：
1. 前往 Cloudflare Dashboard
2. 選擇您的 Pages 專案
3. 點擊 "Settings" > "Environment variables"
4. 新增以下變數：
   - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### 6. 測試設定

#### 6.1 本地測試
1. 啟動開發伺服器：`npm run dev`
2. 前往聯絡頁面
3. 填寫並提交聯絡表單
4. 檢查是否收到郵件

#### 6.2 生產環境測試
1. 部署到 Cloudflare Pages
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

## 安全注意事項

1. **不要暴露 Private Key**: 只使用 Public Key
2. **限制郵件發送頻率**: 避免被濫用
3. **驗證輸入資料**: 在發送郵件前驗證表單資料
4. **監控使用量**: 定期檢查郵件發送統計
