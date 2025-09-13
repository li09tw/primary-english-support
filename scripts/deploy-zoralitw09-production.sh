#!/bin/bash

# 部署 zoralitw09 帳號到生產環境
# 使用 Cloudflare D1 資料庫

echo "🚀 部署 zoralitw09 帳號到生產環境"
echo "====================================="

# 檢查環境變數
if [ -z "$CLOUDFLARE_ACCOUNT_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 錯誤: 請設定 Cloudflare 環境變數"
    echo "請執行: source .env.local"
    exit 1
fi

# 設定資料庫 ID
DATABASE_ID="203cdead-8e8a-4c1d-a77b-9c5445e4f5f8"

echo "📝 建立 zoralitw09 帳號 SQL 腳本..."

# 建立 SQL 腳本
cat > temp_zoralitw09_setup.sql << 'EOF'
-- 確保資料庫表結構存在
CREATE TABLE IF NOT EXISTS admin_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT,
  password_hash TEXT,
  salt TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  lock_expires_at TEXT,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  last_failed_attempt TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_codes (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  username TEXT,
  attempt_type TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  created_at TEXT NOT NULL
);

-- 插入或更新 zoralitw09 帳號
INSERT OR REPLACE INTO admin_accounts (
  id, username, email, is_active, is_locked, created_at, updated_at
) VALUES (
  'zoralitw09_001',
  'zoralitw09',
  'zoralitw09@example.com',
  TRUE,
  FALSE,
  datetime('now'),
  datetime('now')
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_admin_accounts_username ON admin_accounts(username);
CREATE INDEX IF NOT EXISTS idx_verification_codes_account_id ON verification_codes(account_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
EOF

echo "✅ SQL 腳本已建立"

# 執行 SQL 腳本
echo "📝 執行 SQL 腳本..."
wrangler d1 execute $DATABASE_ID --file=./temp_zoralitw09_setup.sql

if [ $? -eq 0 ]; then
    echo "✅ zoralitw09 帳號建立成功！"
else
    echo "❌ zoralitw09 帳號建立失敗"
    exit 1
fi

# 驗證帳號是否成功建立
echo "🔍 驗證帳號是否成功建立..."
wrangler d1 execute $DATABASE_ID --command="SELECT username, email, is_active, created_at FROM admin_accounts WHERE username = 'zoralitw09';"

if [ $? -eq 0 ]; then
    echo "✅ 帳號驗證成功！"
else
    echo "❌ 帳號驗證失敗"
    exit 1
fi

# 清理臨時檔案
rm -f temp_zoralitw09_setup.sql

echo ""
echo "🎉 zoralitw09 帳號部署完成！"
echo ""
echo "📋 部署摘要:"
echo "====================================="
echo "✅ 資料庫表結構已建立/更新"
echo "✅ zoralitw09 帳號已建立"
echo "✅ 帳號狀態: 啟用"
echo ""
echo "🔐 登入資訊:"
echo "====================================="
echo "• 帳號: zoralitw09"
echo "• 登入頁面: /garden/login"
echo "• 驗證碼有效期: 30 分鐘"
echo ""
echo "📋 登入流程:"
echo "====================================="
echo "1. 訪問 /garden/login"
echo "2. 輸入帳號: zoralitw09"
echo "3. 點擊發送驗證碼"
echo "4. 輸入收到的驗證碼"
echo "5. 成功登入"
