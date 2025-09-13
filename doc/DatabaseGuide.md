# 資料庫指南

## 概述

本文件整合了 Primary English Support 專案的所有資料庫相關文檔，包括資料庫設計、遷移、維護和故障排除等內容。

## 🏗️ 資料庫架構

### 整體設計

Primary English Support 使用 Cloudflare D1 (SQLite) 作為主要資料庫，採用關聯式資料庫設計，支援複雜的查詢和資料關聯。

### 資料庫特性

- **類型**: SQLite (透過 Cloudflare D1)
- **部署**: Cloudflare 邊緣網路
- **備份**: 自動備份和版本控制
- **擴展**: 支援水平擴展
- **性能**: 低延遲查詢

## 📊 資料表結構

### 核心業務表

#### 1. 遊戲方法表 (game_methods)

```sql
CREATE TABLE game_methods (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  materials TEXT,
  instructions TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**欄位說明**:
- `id`: 唯一識別碼 (UUID)
- `title`: 遊戲方法標題
- `description`: 遊戲方法描述
- `category`: 遊戲分類 (單字學習、句型練習、口語訓練)
- `difficulty`: 難度等級 (簡單、中等、困難)
- `materials`: 所需材料
- `instructions`: 操作說明
- `is_published`: 發布狀態
- `created_at`: 創建時間
- `updated_at`: 更新時間

#### 2. 學習輔助表 (teaching_aids)

```sql
CREATE TABLE teaching_aids (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  materials TEXT,
  instructions TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

**欄位說明**:
- `id`: 唯一識別碼 (UUID)
- `title`: 輔具標題
- `description`: 輔具描述
- `subject`: 科目 (英語、數學、自然等)
- `grade_level`: 年級 (1-6年級)
- `materials`: 所需材料
- `instructions`: 使用說明
- `is_published`: 發布狀態
- `created_at`: 創建時間
- `updated_at`: 更新時間

#### 3. 管理員消息表 (admin_messages)

```sql
CREATE TABLE admin_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TEXT NOT NULL
);
```

**欄位說明**:
- `id`: 唯一識別碼 (UUID)
- `title`: 消息標題
- `content`: 消息內容 (支援換行)
- `is_published`: 發布狀態
- `created_at`: 創建時間

### 學習內容系統表

#### 1. 年級表 (grades)

```sql
CREATE TABLE grades (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

**預設資料**:
```sql
INSERT INTO grades (id, name) VALUES
(1, 'Grade 1'),
(2, 'Grade 2'),
(3, 'Grade 3'),
(4, 'Grade 4'),
(5, 'Grade 5'),
(6, 'Grade 6');
```

#### 2. 單字主題表 (word_themes)

```sql
CREATE TABLE word_themes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
```

**預設主題**:
```sql
INSERT INTO word_themes (id, name) VALUES
(1, 'Emotions'),
(2, 'Colors'),
(3, 'Sports'),
(4, 'Stationery'),
(5, 'Fruits'),
(6, 'Fast Food'),
(7, 'Bakery & Snacks'),
(8, 'Days of the Week'),
(9, 'Months'),
(10, 'School Subjects'),
(11, 'Ailments'),
(12, 'Countries'),
(13, 'Furniture'),
(14, 'Toys'),
(15, 'Drinks'),
(16, 'Main Dishes'),
(17, 'Bubble Tea Toppings');
```

#### 3. 單字表 (words)

```sql
CREATE TABLE words (
  id INTEGER PRIMARY KEY,
  english_singular TEXT NOT NULL,
  english_plural TEXT,
  chinese_meaning TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT
);
```

**欄位說明**:
- `id`: 唯一識別碼
- `english_singular`: 英文單數形式
- `english_plural`: 英文複數形式 (可選)
- `chinese_meaning`: 中文翻譯
- `part_of_speech`: 詞性 (noun, verb, adjective, adverb, preposition)
- `image_url`: 圖片 URL (可選)
- `audio_url`: 音頻 URL (可選)

#### 4. 句型模式表 (sentence_patterns)

```sql
CREATE TABLE sentence_patterns (
  id INTEGER PRIMARY KEY,
  grade_id INTEGER NOT NULL,
  pattern_text TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (grade_id) REFERENCES grades(id)
);
```

**欄位說明**:
- `id`: 唯一識別碼
- `grade_id`: 年級 ID (外鍵)
- `pattern_text`: 句型模式文字 (包含空白)
- `pattern_type`: 句型類型 (Question, Statement, Response)
- `notes`: 備註

#### 5. 句型模式空格表 (pattern_slots)

```sql
CREATE TABLE pattern_slots (
  id INTEGER PRIMARY KEY,
  pattern_id INTEGER NOT NULL,
  slot_index INTEGER NOT NULL,
  required_part_of_speech TEXT NOT NULL,
  FOREIGN KEY (pattern_id) REFERENCES sentence_patterns(id)
);
```

**欄位說明**:
- `id`: 唯一識別碼
- `pattern_id`: 句型模式 ID (外鍵)
- `slot_index`: 空格位置索引
- `required_part_of_speech`: 所需詞性

### 關聯表

#### 單字主題關聯表 (word_theme_associations)

```sql
CREATE TABLE word_theme_associations (
  word_id INTEGER NOT NULL,
  theme_id INTEGER NOT NULL,
  PRIMARY KEY (word_id, theme_id),
  FOREIGN KEY (word_id) REFERENCES words(id),
  FOREIGN KEY (theme_id) REFERENCES word_themes(id)
);
```

**用途**: 建立單字與主題的多對多關聯

### 安全驗證系統表

#### 1. 管理員帳號表 (admin_accounts)

```sql
CREATE TABLE admin_accounts (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_locked BOOLEAN DEFAULT FALSE,
  lock_expires_at TEXT,
  failed_attempts INTEGER DEFAULT 0,
  last_failed_attempt TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

#### 2. 驗證碼表 (verification_codes)

```sql
CREATE TABLE verification_codes (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id)
);
```

#### 3. 會話管理表 (admin_sessions)

```sql
CREATE TABLE admin_sessions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES admin_accounts(id)
);
```

#### 4. 登入嘗試記錄表 (login_attempts)

```sql
CREATE TABLE login_attempts (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  username TEXT,
  attempt_type TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  created_at TEXT NOT NULL
);
```

## 🔧 資料庫操作

### 基本查詢

#### 1. 獲取所有遊戲方法
```sql
SELECT * FROM game_methods 
WHERE is_published = TRUE 
ORDER BY created_at DESC;
```

#### 2. 依分類獲取遊戲方法
```sql
SELECT * FROM game_methods 
WHERE category = ? AND is_published = TRUE 
ORDER BY difficulty, title;
```

#### 3. 獲取單字主題
```sql
SELECT * FROM word_themes 
ORDER BY id;
```

#### 4. 依主題獲取單字
```sql
SELECT w.* FROM words w
JOIN word_theme_associations wta ON w.id = wta.word_id
WHERE wta.theme_id = ?
ORDER BY w.english_singular;
```

#### 5. 獲取句型模式
```sql
SELECT sp.*, ps.slot_index, ps.required_part_of_speech
FROM sentence_patterns sp
LEFT JOIN pattern_slots ps ON sp.id = ps.pattern_id
WHERE sp.grade_id = ?
ORDER BY sp.id, ps.slot_index;
```

### 進階查詢

#### 1. 搜尋遊戲方法
```sql
SELECT * FROM game_methods 
WHERE (title LIKE ? OR description LIKE ?) 
AND is_published = TRUE 
ORDER BY 
  CASE 
    WHEN title LIKE ? THEN 1
    WHEN description LIKE ? THEN 2
    ELSE 3
  END,
  created_at DESC;
```

#### 2. 獲取隨機單字
```sql
SELECT w.* FROM words w
JOIN word_theme_associations wta ON w.id = wta.word_id
WHERE wta.theme_id = ?
ORDER BY RANDOM()
LIMIT ?;
```

#### 3. 統計資料
```sql
-- 遊戲方法統計
SELECT 
  category,
  difficulty,
  COUNT(*) as count
FROM game_methods 
WHERE is_published = TRUE 
GROUP BY category, difficulty;

-- 單字主題統計
SELECT 
  wt.name as theme_name,
  COUNT(wta.word_id) as word_count
FROM word_themes wt
LEFT JOIN word_theme_associations wta ON wt.id = wta.theme_id
GROUP BY wt.id, wt.name
ORDER BY word_count DESC;
```

## 🚀 資料庫遷移

### 遷移腳本

#### 1. 建立基本表結構
```bash
# 執行基本表結構遷移
./scripts/deploy-d1-schema.sh
```

#### 2. 新增功能遷移
```bash
# 新增驗證系統
./scripts/deploy-verification-system.sh

# 新增安全驗證系統
./scripts/deploy-secure-verification-system.sh

# 新增時間表達
./scripts/deploy-time-expressions.sh

# 新增單字主題
./scripts/deploy-word-themes.sh
```

#### 3. 管理員消息遷移
```bash
# 部署管理員消息系統
./scripts/deploy-admin-messages.sh
```

### 遷移最佳實踐

1. **備份資料**: 遷移前先備份現有資料
2. **測試環境**: 先在測試環境驗證遷移
3. **逐步遷移**: 分步驟執行複雜遷移
4. **回滾計劃**: 準備回滾方案
5. **監控結果**: 遷移後監控系統狀態

## 🔍 資料庫維護

### 定期清理

#### 1. 清理過期會話
```sql
DELETE FROM admin_sessions 
WHERE expires_at < datetime('now');
```

#### 2. 清理過期驗證碼
```sql
DELETE FROM verification_codes 
WHERE expires_at < datetime('now');
```

#### 3. 清理舊的登入記錄
```sql
DELETE FROM login_attempts 
WHERE created_at < datetime('now', '-30 days');
```

### 性能優化

#### 1. 建立索引
```sql
-- 遊戲方法索引
CREATE INDEX idx_game_methods_category ON game_methods(category);
CREATE INDEX idx_game_methods_difficulty ON game_methods(difficulty);
CREATE INDEX idx_game_methods_published ON game_methods(is_published);

-- 單字主題關聯索引
CREATE INDEX idx_word_theme_associations_theme ON word_theme_associations(theme_id);
CREATE INDEX idx_word_theme_associations_word ON word_theme_associations(word_id);

-- 句型模式索引
CREATE INDEX idx_sentence_patterns_grade ON sentence_patterns(grade_id);
CREATE INDEX idx_pattern_slots_pattern ON pattern_slots(pattern_id);
```

#### 2. 查詢優化
- 使用適當的 WHERE 條件
- 避免 SELECT *
- 使用 LIMIT 限制結果
- 利用索引加速查詢

### 監控和警報

#### 1. 性能監控
- 監控查詢執行時間
- 追蹤慢查詢
- 監控資料庫大小

#### 2. 錯誤監控
- 監控 SQL 錯誤
- 追蹤連接失敗
- 監控鎖定問題

## 🚨 故障排除

### 常見問題

#### 1. 連接問題
**症狀**: 無法連接到資料庫
**解決方法**:
- 檢查 Cloudflare 帳戶狀態
- 確認 D1 資料庫綁定
- 檢查 wrangler.toml 配置

#### 2. 查詢超時
**症狀**: 查詢執行時間過長
**解決方法**:
- 檢查查詢語法
- 優化查詢條件
- 建立適當索引

#### 3. 資料不一致
**症狀**: 資料不完整或錯誤
**解決方法**:
- 檢查外鍵約束
- 驗證資料完整性
- 執行資料修復

#### 4. 權限問題
**症狀**: 無法執行某些操作
**解決方法**:
- 檢查資料庫權限
- 確認 API 密鑰
- 檢查 Worker 配置

### 除錯工具

#### 1. 查詢分析
```sql
-- 分析查詢執行計劃
EXPLAIN QUERY PLAN SELECT * FROM game_methods WHERE category = '單字學習';

-- 檢查索引使用情況
EXPLAIN QUERY PLAN SELECT * FROM words w 
JOIN word_theme_associations wta ON w.id = wta.word_id 
WHERE wta.theme_id = 1;
```

#### 2. 資料庫狀態檢查
```sql
-- 檢查資料庫大小
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();

-- 檢查表統計
SELECT name, sql FROM sqlite_master WHERE type = 'table';

-- 檢查索引
SELECT name, sql FROM sqlite_master WHERE type = 'index';
```

## 📊 資料庫統計

### 當前資料量

- **遊戲方法**: 100+ 筆
- **學習輔助**: 50+ 筆
- **單字**: 500+ 筆
- **句型模式**: 50+ 筆
- **主題**: 17 個

### 性能指標

- **平均查詢時間**: < 100ms
- **並發連接**: 支援 100+ 連接
- **資料庫大小**: < 10MB
- **備份頻率**: 每日自動備份

## 🔮 未來規劃

### 短期目標
- 優化查詢性能
- 增加更多索引
- 實作查詢快取

### 長期目標
- 考慮分庫分表
- 實作讀寫分離
- 增加資料分析功能

## 📚 相關文檔

- [技術指南](TechnicalGuide.md)
- [學習內容系統](LearningContentSystem.md)
- [安全驗證系統指南](SecureVerificationSystemGuide.md)
- [單字主題擴充總結](WordExpansionSummary.md)
- [資料庫一致性報告](DATABASE_CONSISTENCY_REPORT.md)

---

**⚠️ 重要提醒**: 本資料庫指南涵蓋了專案的核心資料庫設計，如需更詳細的特定資料庫文檔，請參考相關的專門文檔。
