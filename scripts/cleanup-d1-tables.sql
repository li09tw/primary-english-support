-- ========================================
-- D1 資料庫清理腳本 - 刪除學習內容相關表
-- ========================================
-- 此腳本將刪除所有學習內容相關的資料表，只保留登入驗證功能必需的表
-- 執行前請確保已備份重要資料
-- 執行日期: 2024-01-XX

-- ========================================
-- 刪除學習內容相關的資料表
-- ========================================

-- 1. 刪除單字主題關聯表
DROP TABLE IF EXISTS word_theme_associations;

-- 2. 刪除句型槽位表
DROP TABLE IF EXISTS pattern_slots;

-- 3. 刪除單字字典表
DROP TABLE IF EXISTS words;

-- 4. 刪除單字主題表
DROP TABLE IF EXISTS word_themes;

-- 5. 刪除問答配對表
DROP TABLE IF EXISTS question_answer_pairs;

-- 6. 刪除句型表
DROP TABLE IF EXISTS sentence_patterns;

-- 7. 刪除年級表
DROP TABLE IF EXISTS grades;

-- 8. 刪除單字表（舊版）
DROP TABLE IF EXISTS vocabulary;

-- 9. 刪除單元表
DROP TABLE IF EXISTS units;

-- 10. 刪除教材表
DROP TABLE IF EXISTS textbooks;

-- 11. 刪除學習輔助表
DROP TABLE IF EXISTS teaching_aids;

-- 12. 刪除遊戲方法表
DROP TABLE IF EXISTS game_methods;

-- 13. 刪除管理員消息表
DROP TABLE IF EXISTS admin_messages;

-- ========================================
-- 刪除相關的索引
-- ========================================

-- 刪除學習內容相關的索引
DROP INDEX IF EXISTS idx_sentence_patterns_grade_id;
DROP INDEX IF EXISTS idx_sentence_patterns_type;
DROP INDEX IF EXISTS idx_question_answer_pairs_question;
DROP INDEX IF EXISTS idx_question_answer_pairs_answer;
DROP INDEX IF EXISTS idx_words_part_of_speech;
DROP INDEX IF EXISTS idx_words_has_plural;
DROP INDEX IF EXISTS idx_word_theme_associations_word_id;
DROP INDEX IF EXISTS idx_word_theme_associations_theme_id;
DROP INDEX IF EXISTS idx_pattern_slots_pattern_id;

-- 刪除原始 schema 的索引
DROP INDEX IF EXISTS idx_admin_messages_created_at;
DROP INDEX IF EXISTS idx_game_methods_grade;
DROP INDEX IF EXISTS idx_textbooks_grade;
DROP INDEX IF EXISTS idx_units_textbook_id;
DROP INDEX IF EXISTS idx_vocabulary_unit_id;

-- ========================================
-- 保留的資料表（登入驗證功能）
-- ========================================
-- 以下資料表將被保留：
-- 1. admin_accounts - 管理員帳號表
-- 2. verification_codes - 驗證碼表
-- 3. admin_sessions - 會話管理表
-- 4. login_attempts - 登入嘗試記錄表

-- ========================================
-- 清理完成確認
-- ========================================
-- 執行此腳本後，D1 資料庫將只包含登入驗證相關的資料表
-- 遊戲功能將繼續使用 mock 資料正常運作
-- 當有新的需求時，可以重新建立相應的資料表
