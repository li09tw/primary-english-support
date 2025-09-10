-- 驗證系統資料庫表結構
-- 用於 Garden 頁面的帳號驗證

-- 1. 帳號表
CREATE TABLE IF NOT EXISTS admin_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. 驗證碼表
CREATE TABLE IF NOT EXISTS verification_codes (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id) ON DELETE CASCADE
);

-- 3. 插入預設管理員帳號（請根據實際需求修改）
INSERT OR IGNORE INTO admin_accounts (id, username, email, created_at, updated_at) 
VALUES (
  'admin_001',
  'admin',
  'your-email@example.com',  -- 請修改為實際的預設信箱
  datetime('now'),
  datetime('now')
);

-- 4. 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_verification_codes_account_id ON verification_codes(account_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_username ON admin_accounts(username);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_email ON admin_accounts(email);
