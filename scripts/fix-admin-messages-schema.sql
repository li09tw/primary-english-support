-- 修復 admin_messages 和 game_methods 表格結構
-- 添加缺少的 is_published 欄位

-- 為 admin_messages 表格添加 is_published 欄位
ALTER TABLE admin_messages ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT TRUE;

-- 為 game_methods 表格添加 is_published 欄位
ALTER TABLE game_methods ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT TRUE;

-- 創建 teaching_aids 表格（如果不存在）
CREATE TABLE IF NOT EXISTS teaching_aids (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 驗證表格結構
PRAGMA table_info(admin_messages);
PRAGMA table_info(game_methods);
PRAGMA table_info(teaching_aids);
