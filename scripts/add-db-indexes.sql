-- Create helpful indexes for faster lookups and joins
CREATE INDEX IF NOT EXISTS idx_words_singular ON words(english_singular);
CREATE INDEX IF NOT EXISTS idx_words_pos ON words(part_of_speech);
CREATE INDEX IF NOT EXISTS idx_themes_name ON word_themes(name);
CREATE INDEX IF NOT EXISTS idx_wta_theme ON word_theme_associations(theme_id);
CREATE INDEX IF NOT EXISTS idx_wta_word ON word_theme_associations(word_id);
CREATE INDEX IF NOT EXISTS idx_patterns_grade ON sentence_patterns(grade_id);
CREATE INDEX IF NOT EXISTS idx_patterns_type ON sentence_patterns(pattern_type);

