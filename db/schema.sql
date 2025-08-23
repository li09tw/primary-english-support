-- 管理員消息表
CREATE TABLE admin_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 遊戲方法與教學輔具表
CREATE TABLE game_methods (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  categories TEXT NOT NULL, -- JSON 格式，包含分類如：單字學習、句型練習、口語訓練、教學輔具
  grade1 BOOLEAN NOT NULL DEFAULT FALSE, -- 1年級
  grade2 BOOLEAN NOT NULL DEFAULT FALSE, -- 2年級
  grade3 BOOLEAN NOT NULL DEFAULT FALSE, -- 3年級
  grade4 BOOLEAN NOT NULL DEFAULT FALSE, -- 4年級
  grade5 BOOLEAN NOT NULL DEFAULT FALSE, -- 5年級
  grade6 BOOLEAN NOT NULL DEFAULT FALSE, -- 6年級
  materials TEXT NOT NULL, -- JSON 格式
  instructions TEXT NOT NULL, -- JSON 格式
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 聯絡記錄表
CREATE TABLE contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
