-- 遷移 admin_messages 表格 ID 從 TEXT 改為 INTEGER AUTOINCREMENT
-- 注意：此操作會重建表格，請確保已備份資料

-- 1. 創建臨時表格
CREATE TABLE admin_messages_temp (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. 複製資料到臨時表格（跳過 ID 欄位，讓它自動生成）
INSERT INTO admin_messages_temp (title, content, is_published, created_at, updated_at)
SELECT title, content, is_published, created_at, updated_at FROM admin_messages;

-- 3. 刪除舊表格
DROP TABLE admin_messages;

-- 4. 重新命名臨時表格
ALTER TABLE admin_messages_temp RENAME TO admin_messages;

-- 5. 驗證新表格結構
PRAGMA table_info(admin_messages);

-- 6. 顯示遷移後的資料
SELECT * FROM admin_messages ORDER BY id;
