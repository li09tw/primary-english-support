-- 為現有的 admin_messages 表添加 is_pinned 欄位
-- 執行此腳本前請先備份資料庫

-- 添加 is_pinned 欄位，預設值為 FALSE
ALTER TABLE admin_messages ADD COLUMN is_pinned BOOLEAN NOT NULL DEFAULT FALSE;

-- 驗證欄位已添加
SELECT name, type, "notnull", dflt_value FROM pragma_table_info('admin_messages') WHERE name = 'is_pinned';

-- 顯示更新後的表結構
PRAGMA table_info(admin_messages);
