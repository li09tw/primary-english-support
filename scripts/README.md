# Scripts 目錄說明

## 🔒 安全政策

本目錄包含的腳本已進行安全改進，移除了所有硬編碼的密碼和敏感資訊。

## 📁 檔案說明

### 安全腳本（推薦使用）

- **`generate-password.js`** - 安全密碼生成工具
  - 使用環境變數或互動式輸入
  - 不包含硬編碼密碼
  - 支援自定義帳號、密碼和信箱

- **`deploy-admin-account.sh`** - 管理員帳號部署腳本
  - 使用環境變數設定
  - 自動化部署流程
  - 包含完整的驗證步驟

- **`setup-env.sh`** - 環境變數設定腳本
  - 互動式設定環境變數
  - 自動寫入 .env.local
  - 包含所有必要的設定項目

### 已棄用的腳本（已加入 .gitignore）

以下腳本包含硬編碼密碼，已從版本控制中移除：
- `deploy-zoralitw09-account.sh`
- `setup-zoralitw09-account.sql`
- `generate-zoralitw09-password.js`
- `generate-admin-password.js`
- `deploy-secure-verification-system.sh`

## 🚀 使用方式

### 1. 設定環境變數

```bash
# 執行環境變數設定腳本
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

### 2. 載入環境變數

```bash
# 載入環境變數
source .env.local
```

### 3. 部署管理員帳號

```bash
# 執行部署腳本
chmod +x scripts/deploy-admin-account.sh
./scripts/deploy-admin-account.sh
```

## 🔐 環境變數說明

### 必要變數

- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 帳號 ID
- `CLOUDFLARE_API_TOKEN` - Cloudflare API Token
- `DATABASE_NAME` - D1 資料庫名稱
- `ADMIN_USERNAME` - 管理員帳號
- `ADMIN_EMAIL` - 管理員信箱
- `ADMIN_PASSWORD` - 管理員密碼

### EmailJS 變數

- `DEFAULT_ADMIN_EMAIL` - 預設管理員信箱
- `EMAILJS_SERVICE_ID` - EmailJS 服務 ID
- `EMAILJS_TEMPLATE_ID` - EmailJS 模板 ID
- `EMAILJS_PUBLIC_KEY` - EmailJS 公開金鑰

## ⚠️ 安全注意事項

1. **不要將 .env.local 上傳到版本控制系統**
2. **使用強密碼**
3. **定期更換密碼**
4. **妥善保管 API Token**
5. **不要在程式碼中硬編碼敏感資訊**

## 🛠️ 故障排除

### 環境變數未設定

```bash
❌ 錯誤: 請設定 ADMIN_USERNAME 環境變數
```

**解決方案**：
```bash
source .env.local
```

### 權限問題

```bash
❌ 錯誤: Permission denied
```

**解決方案**：
```bash
chmod +x scripts/*.sh
```

### 資料庫連線失敗

1. 檢查 Cloudflare 環境變數
2. 確認資料庫名稱正確
3. 檢查網路連線

## 📚 相關文件

- [環境變數說明](../doc/EnvironmentVariables.md)
- [部署檢查清單](../doc/DeploymentChecklist.md)
- [安全驗證系統指南](../doc/SecureVerificationSystemGuide.md)