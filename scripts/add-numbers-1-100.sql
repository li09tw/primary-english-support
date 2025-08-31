-- Add Numbers 1-100 to words and associate to theme 23 (Numbers)
-- Safe to run multiple times (uses INSERT OR IGNORE)

-- Ensure Numbers theme exists (id 23)
INSERT OR IGNORE INTO word_themes (id, name, description)
VALUES (23, 'Numbers', 'Words for numbers and counting');

-- Upsert number words 1..20
INSERT OR IGNORE INTO words (english_singular, english_plural, chinese_meaning, part_of_speech, has_plural, image_url, audio_url) VALUES
('one', NULL, '1', 'noun', 0, NULL, NULL),
('two', NULL, '2', 'noun', 0, NULL, NULL),
('three', NULL, '3', 'noun', 0, NULL, NULL),
('four', NULL, '4', 'noun', 0, NULL, NULL),
('five', NULL, '5', 'noun', 0, NULL, NULL),
('six', NULL, '6', 'noun', 0, NULL, NULL),
('seven', NULL, '7', 'noun', 0, NULL, NULL),
('eight', NULL, '8', 'noun', 0, NULL, NULL),
('nine', NULL, '9', 'noun', 0, NULL, NULL),
('ten', NULL, '10', 'noun', 0, NULL, NULL),
('eleven', NULL, '11', 'noun', 0, NULL, NULL),
('twelve', NULL, '12', 'noun', 0, NULL, NULL),
('thirteen', NULL, '13', 'noun', 0, NULL, NULL),
('fourteen', NULL, '14', 'noun', 0, NULL, NULL),
('fifteen', NULL, '15', 'noun', 0, NULL, NULL),
('sixteen', NULL, '16', 'noun', 0, NULL, NULL),
('seventeen', NULL, '17', 'noun', 0, NULL, NULL),
('eighteen', NULL, '18', 'noun', 0, NULL, NULL),
('nineteen', NULL, '19', 'noun', 0, NULL, NULL),
('twenty', NULL, '20', 'noun', 0, NULL, NULL);

-- Tens 30..90
INSERT OR IGNORE INTO words (english_singular, english_plural, chinese_meaning, part_of_speech, has_plural, image_url, audio_url) VALUES
('thirty', NULL, '30', 'noun', 0, NULL, NULL),
('forty', NULL, '40', 'noun', 0, NULL, NULL),
('fifty', NULL, '50', 'noun', 0, NULL, NULL),
('sixty', NULL, '60', 'noun', 0, NULL, NULL),
('seventy', NULL, '70', 'noun', 0, NULL, NULL),
('eighty', NULL, '80', 'noun', 0, NULL, NULL),
('ninety', NULL, '90', 'noun', 0, NULL, NULL);

-- Composite 21..29, 31..39, ..., 91..99 using space style to match app mock
INSERT OR IGNORE INTO words (english_singular, english_plural, chinese_meaning, part_of_speech, has_plural, image_url, audio_url) VALUES
('twenty one', NULL, '21', 'noun', 0, NULL, NULL),
('twenty two', NULL, '22', 'noun', 0, NULL, NULL),
('twenty three', NULL, '23', 'noun', 0, NULL, NULL),
('twenty four', NULL, '24', 'noun', 0, NULL, NULL),
('twenty five', NULL, '25', 'noun', 0, NULL, NULL),
('twenty six', NULL, '26', 'noun', 0, NULL, NULL),
('twenty seven', NULL, '27', 'noun', 0, NULL, NULL),
('twenty eight', NULL, '28', 'noun', 0, NULL, NULL),
('twenty nine', NULL, '29', 'noun', 0, NULL, NULL),
('thirty one', NULL, '31', 'noun', 0, NULL, NULL),
('thirty two', NULL, '32', 'noun', 0, NULL, NULL),
('thirty three', NULL, '33', 'noun', 0, NULL, NULL),
('thirty four', NULL, '34', 'noun', 0, NULL, NULL),
('thirty five', NULL, '35', 'noun', 0, NULL, NULL),
('thirty six', NULL, '36', 'noun', 0, NULL, NULL),
('thirty seven', NULL, '37', 'noun', 0, NULL, NULL),
('thirty eight', NULL, '38', 'noun', 0, NULL, NULL),
('thirty nine', NULL, '39', 'noun', 0, NULL, NULL),
('forty one', NULL, '41', 'noun', 0, NULL, NULL),
('forty two', NULL, '42', 'noun', 0, NULL, NULL),
('forty three', NULL, '43', 'noun', 0, NULL, NULL),
('forty four', NULL, '44', 'noun', 0, NULL, NULL),
('forty five', NULL, '45', 'noun', 0, NULL, NULL),
('forty six', NULL, '46', 'noun', 0, NULL, NULL),
('forty seven', NULL, '47', 'noun', 0, NULL, NULL),
('forty eight', NULL, '48', 'noun', 0, NULL, NULL),
('forty nine', NULL, '49', 'noun', 0, NULL, NULL),
('fifty one', NULL, '51', 'noun', 0, NULL, NULL),
('fifty two', NULL, '52', 'noun', 0, NULL, NULL),
('fifty three', NULL, '53', 'noun', 0, NULL, NULL),
('fifty four', NULL, '54', 'noun', 0, NULL, NULL),
('fifty five', NULL, '55', 'noun', 0, NULL, NULL),
('fifty six', NULL, '56', 'noun', 0, NULL, NULL),
('fifty seven', NULL, '57', 'noun', 0, NULL, NULL),
('fifty eight', NULL, '58', 'noun', 0, NULL, NULL),
('fifty nine', NULL, '59', 'noun', 0, NULL, NULL),
('sixty one', NULL, '61', 'noun', 0, NULL, NULL),
('sixty two', NULL, '62', 'noun', 0, NULL, NULL),
('sixty three', NULL, '63', 'noun', 0, NULL, NULL),
('sixty four', NULL, '64', 'noun', 0, NULL, NULL),
('sixty five', NULL, '65', 'noun', 0, NULL, NULL),
('sixty six', NULL, '66', 'noun', 0, NULL, NULL),
('sixty seven', NULL, '67', 'noun', 0, NULL, NULL),
('sixty eight', NULL, '68', 'noun', 0, NULL, NULL),
('sixty nine', NULL, '69', 'noun', 0, NULL, NULL),
('seventy one', NULL, '71', 'noun', 0, NULL, NULL),
('seventy two', NULL, '72', 'noun', 0, NULL, NULL),
('seventy three', NULL, '73', 'noun', 0, NULL, NULL),
('seventy four', NULL, '74', 'noun', 0, NULL, NULL),
('seventy five', NULL, '75', 'noun', 0, NULL, NULL),
('seventy six', NULL, '76', 'noun', 0, NULL, NULL),
('seventy seven', NULL, '77', 'noun', 0, NULL, NULL),
('seventy eight', NULL, '78', 'noun', 0, NULL, NULL),
('seventy nine', NULL, '79', 'noun', 0, NULL, NULL),
('eighty one', NULL, '81', 'noun', 0, NULL, NULL),
('eighty two', NULL, '82', 'noun', 0, NULL, NULL),
('eighty three', NULL, '83', 'noun', 0, NULL, NULL),
('eighty four', NULL, '84', 'noun', 0, NULL, NULL),
('eighty five', NULL, '85', 'noun', 0, NULL, NULL),
('eighty six', NULL, '86', 'noun', 0, NULL, NULL),
('eighty seven', NULL, '87', 'noun', 0, NULL, NULL),
('eighty eight', NULL, '88', 'noun', 0, NULL, NULL),
('eighty nine', NULL, '89', 'noun', 0, NULL, NULL),
('ninety one', NULL, '91', 'noun', 0, NULL, NULL),
('ninety two', NULL, '92', 'noun', 0, NULL, NULL),
('ninety three', NULL, '93', 'noun', 0, NULL, NULL),
('ninety four', NULL, '94', 'noun', 0, NULL, NULL),
('ninety five', NULL, '95', 'noun', 0, NULL, NULL),
('ninety six', NULL, '96', 'noun', 0, NULL, NULL),
('ninety seven', NULL, '97', 'noun', 0, NULL, NULL),
('ninety eight', NULL, '98', 'noun', 0, NULL, NULL),
('ninety nine', NULL, '99', 'noun', 0, NULL, NULL);

-- 100
INSERT OR IGNORE INTO words (english_singular, english_plural, chinese_meaning, part_of_speech, has_plural, image_url, audio_url)
VALUES ('one hundred', NULL, '100', 'noun', 0, NULL, NULL);

-- Associate all number words to theme 23
-- Singles and teens + tens
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 23 FROM words WHERE english_singular IN (
  'one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen',
  'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety','one hundred'
);

-- Composite 21..29, 31..39, ..., 91..99
INSERT OR IGNORE INTO word_theme_associations (word_id, theme_id)
SELECT id, 23 FROM words WHERE english_singular IN (
  'twenty one','twenty two','twenty three','twenty four','twenty five','twenty six','twenty seven','twenty eight','twenty nine',
  'thirty one','thirty two','thirty three','thirty four','thirty five','thirty six','thirty seven','thirty eight','thirty nine',
  'forty one','forty two','forty three','forty four','forty five','forty six','forty seven','forty eight','forty nine',
  'fifty one','fifty two','fifty three','fifty four','fifty five','fifty six','fifty seven','fifty eight','fifty nine',
  'sixty one','sixty two','sixty three','sixty four','sixty five','sixty six','sixty seven','sixty eight','sixty nine',
  'seventy one','seventy two','seventy three','seventy four','seventy five','seventy six','seventy seven','seventy eight','seventy nine',
  'eighty one','eighty two','eighty three','eighty four','eighty five','eighty six','eighty seven','eighty eight','eighty nine',
  'ninety one','ninety two','ninety three','ninety four','ninety five','ninety six','ninety seven','ninety eight','ninety nine'
);


