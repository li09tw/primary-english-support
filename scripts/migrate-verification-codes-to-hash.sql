-- Migrate verification_codes from plaintext `code` to hashed `code_hash`
-- Strategy: recreate table with code_hash, copy rows marking old codes as used
-- This avoids needing to compute bcrypt in SQL. New API will insert hashed codes.

BEGIN TRANSACTION;

-- Create new table with desired schema
CREATE TABLE IF NOT EXISTS verification_codes_new (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id) ON DELETE CASCADE
);

-- Copy existing rows, mark them as used and leave code_hash empty (not usable)
INSERT INTO verification_codes_new (id, account_id, code_hash, expires_at, is_used, created_at)
SELECT id, account_id, '' AS code_hash, expires_at, 1 AS is_used, created_at
FROM verification_codes;

-- Drop old table and rename new one
DROP TABLE verification_codes;
ALTER TABLE verification_codes_new RENAME TO verification_codes;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_verification_codes_account_id ON verification_codes(account_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_is_used ON verification_codes(is_used);

COMMIT;


