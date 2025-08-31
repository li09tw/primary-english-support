-- Add Time Expressions to words and associate to theme 24 (Time Expressions)
-- Safe to run multiple times (uses INSERT OR IGNORE)

-- Ensure Time Expressions theme exists (id 24)
INSERT OR IGNORE INTO word_themes (id, name, description)
VALUES (24, 'Time Expressions', 'Words for time expressions and clock times');

-- Insert time expression words
INSERT OR IGNORE INTO words (english_singular, english_plural, chinese_meaning, part_of_speech, has_plural, image_url, audio_url) VALUES
-- O'clock times
('one o''clock', NULL, '一點鐘', 'noun', 0, NULL, NULL),
('two o''clock', NULL, '兩點鐘', 'noun', 0, NULL, NULL),
('three o''clock', NULL, '三點鐘', 'noun', 0, NULL, NULL),
('four o''clock', NULL, '四點鐘', 'noun', 0, NULL, NULL),
('five o''clock', NULL, '五點鐘', 'noun', 0, NULL, NULL),
('six o''clock', NULL, '六點鐘', 'noun', 0, NULL, NULL),
('seven o''clock', NULL, '七點鐘', 'noun', 0, NULL, NULL),
('eight o''clock', NULL, '八點鐘', 'noun', 0, NULL, NULL),
('nine o''clock', NULL, '九點鐘', 'noun', 0, NULL, NULL),
('ten o''clock', NULL, '十點鐘', 'noun', 0, NULL, NULL),
('eleven o''clock', NULL, '十一點鐘', 'noun', 0, NULL, NULL),
('twelve o''clock', NULL, '十二點鐘', 'noun', 0, NULL, NULL),

-- Half past times
('half past one', NULL, '一點半', 'noun', 0, NULL, NULL),
('half past two', NULL, '兩點半', 'noun', 0, NULL, NULL),
('half past three', NULL, '三點半', 'noun', 0, NULL, NULL),
('half past four', NULL, '四點半', 'noun', 0, NULL, NULL),
('half past five', NULL, '五點半', 'noun', 0, NULL, NULL),
('half past six', NULL, '六點半', 'noun', 0, NULL, NULL),
('half past seven', NULL, '七點半', 'noun', 0, NULL, NULL),
('half past eight', NULL, '八點半', 'noun', 0, NULL, NULL),
('half past nine', NULL, '九點半', 'noun', 0, NULL, NULL),
('half past ten', NULL, '十點半', 'noun', 0, NULL, NULL),
('half past eleven', NULL, '十一點半', 'noun', 0, NULL, NULL),
('half past twelve', NULL, '十二點半', 'noun', 0, NULL, NULL),

-- Quarter past times
('quarter past one', NULL, '一點十五分', 'noun', 0, NULL, NULL),
('quarter past two', NULL, '兩點十五分', 'noun', 0, NULL, NULL),
('quarter past three', NULL, '三點十五分', 'noun', 0, NULL, NULL),
('quarter past four', NULL, '四點十五分', 'noun', 0, NULL, NULL),
('quarter past five', NULL, '五點十五分', 'noun', 0, NULL, NULL),
('quarter past six', NULL, '六點十五分', 'noun', 0, NULL, NULL),
('quarter past seven', NULL, '七點十五分', 'noun', 0, NULL, NULL),
('quarter past eight', NULL, '八點十五分', 'noun', 0, NULL, NULL),
('quarter past nine', NULL, '九點十五分', 'noun', 0, NULL, NULL),
('quarter past ten', NULL, '十點十五分', 'noun', 0, NULL, NULL),
('quarter past eleven', NULL, '十一點十五分', 'noun', 0, NULL, NULL),
('quarter past twelve', NULL, '十二點十五分', 'noun', 0, NULL, NULL),

-- Quarter to times
('quarter to one', NULL, '十二點四十五分', 'noun', 0, NULL, NULL),
('quarter to two', NULL, '一點四十五分', 'noun', 0, NULL, NULL),
('quarter to three', NULL, '兩點四十五分', 'noun', 0, NULL, NULL),
('quarter to four', NULL, '三點四十五分', 'noun', 0, NULL, NULL),
('quarter to five', NULL, '四點四十五分', 'noun', 0, NULL, NULL),
('quarter to six', NULL, '五點四十五分', 'noun', 0, NULL, NULL),
('quarter to seven', NULL, '六點四十五分', 'noun', 0, NULL, NULL),
('quarter to eight', NULL, '七點四十五分', 'noun', 0, NULL, NULL),
('quarter to nine', NULL, '八點四十五分', 'noun', 0, NULL, NULL),
('quarter to ten', NULL, '九點四十五分', 'noun', 0, NULL, NULL),
('quarter to eleven', NULL, '十點四十五分', 'noun', 0, NULL, NULL),
('quarter to twelve', NULL, '十一點四十五分', 'noun', 0, NULL, NULL),

-- Common time expressions
('morning', NULL, '早上', 'noun', 0, NULL, NULL),
('afternoon', NULL, '下午', 'noun', 0, NULL, NULL),
('evening', NULL, '傍晚', 'noun', 0, NULL, NULL),
('night', NULL, '晚上', 'noun', 0, NULL, NULL),
('midnight', NULL, '午夜', 'noun', 0, NULL, NULL),
('noon', NULL, '中午', 'noun', 0, NULL, NULL),
('dawn', NULL, '黎明', 'noun', 0, NULL, NULL),
('dusk', NULL, '黃昏', 'noun', 0, NULL, NULL);

-- Associate all time expression words to theme 24
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 24 FROM words WHERE english_singular IN (
  'one o''clock','two o''clock','three o''clock','four o''clock','five o''clock','six o''clock',
  'seven o''clock','eight o''clock','nine o''clock','ten o''clock','eleven o''clock','twelve o''clock',
  'half past one','half past two','half past three','half past four','half past five','half past six',
  'half past seven','half past eight','half past nine','half past ten','half past eleven','half past twelve',
  'quarter past one','quarter past two','quarter past three','quarter past four','quarter past five','quarter past six',
  'quarter past seven','quarter past eight','quarter past nine','quarter past ten','quarter past eleven','quarter past twelve',
  'quarter to one','quarter to two','quarter to three','quarter to four','quarter to five','quarter to six',
  'quarter to seven','quarter to eight','quarter to nine','quarter to ten','quarter to eleven','quarter to twelve',
  'morning','afternoon','evening','night','midnight','noon','dawn','dusk'
);
