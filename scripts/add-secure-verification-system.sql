-- 安全驗證系統資料庫結構
-- 包含密碼雜湊、會話管理、速率限制和帳戶鎖定

-- 1. 管理員帳號表（含密碼雜湊和加鹽）
CREATE TABLE IF NOT EXISTS admin_accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,  -- bcrypt 雜湊後的密碼
  salt TEXT NOT NULL,           -- 隨機鹽值
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  lock_expires_at TEXT,         -- 帳戶鎖定到期時間
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  last_failed_attempt TEXT,     -- 最後失敗嘗試時間
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. 驗證碼表（15分鐘時效，一次性使用）
CREATE TABLE IF NOT EXISTS verification_codes (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,      -- 雜湊後的驗證碼
  expires_at TEXT NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id) ON DELETE CASCADE
);

-- 3. 會話管理表
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

-- 4. 登入嘗試記錄表（用於速率限制和帳戶鎖定）
CREATE TABLE IF NOT EXISTS login_attempts (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  username TEXT,
  attempt_type TEXT NOT NULL,   -- 'login', 'verification', 'code_request'
  success BOOLEAN NOT NULL,
  created_at TEXT NOT NULL
);

-- 5. 插入預設管理員帳號（密碼：admin123）
-- 注意：實際部署時應使用 bcrypt 生成的真實雜湊值
INSERT OR IGNORE INTO admin_accounts (
  id, username, email, password_hash, salt, created_at, updated_at
) VALUES (
  'admin_001',
  'admin',
  'your-email@example.com',  -- 請修改為實際信箱
  '$2b$10$example.hash.here',  -- 請使用 bcrypt 生成的真實雜湊
  'random_salt_here',           -- 請使用隨機生成的鹽值
  datetime('now'),
  datetime('now')
);

-- 6. 建立索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_admin_accounts_username ON admin_accounts(username);
CREATE INDEX IF NOT EXISTS idx_admin_accounts_email ON admin_accounts(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_account_id ON verification_codes(account_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts(ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_username_time ON login_attempts(username, created_at);

-- 7. 清理過期資料的觸發器（可選）
CREATE TRIGGER IF NOT EXISTS cleanup_expired_sessions
  AFTER INSERT ON admin_sessions
  BEGIN
    DELETE FROM admin_sessions WHERE expires_at < datetime('now');
  END;

CREATE TRIGGER IF NOT EXISTS cleanup_expired_codes
  AFTER INSERT ON verification_codes
  BEGIN
    DELETE FROM verification_codes WHERE expires_at < datetime('now');
  END;
