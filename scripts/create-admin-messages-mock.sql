-- 建立站長消息的 mock 資料庫
-- 用於測試和檢視站長消息功能

-- 創建 admin_messages 表（移除 updated_at 欄位）
CREATE TABLE IF NOT EXISTS admin_messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TEXT NOT NULL
);

-- 插入範例資料
INSERT INTO admin_messages (id, title, content, is_published, created_at) VALUES
('msg_001', '歡迎使用國小英語支援！', '我們很高興為您提供這個英語數位化教具。這裡有豐富的遊戲方法和教學輔具，希望能幫助您創造更好的英語學習環境。

如果您有任何建議或需要特定的輔具，歡迎透過聯絡表單與我們聯繫。', TRUE, '2024-01-15T10:00:00Z'),

('msg_002', '新增多個互動遊戲方法', '我們已經新增了 10 個新的互動遊戲方法，涵蓋單字學習、句型練習和口語訓練等不同面向。這些遊戲都經過精心設計，適合小學各年級的學生使用。

您可以在遊戲方法頁面中找到這些新內容。', TRUE, '2024-01-10T14:30:00Z'),

('msg_003', '系統維護通知', '為了提供更好的服務品質，我們將於本週末進行系統維護。維護期間可能會暫時無法使用部分功能，敬請見諒。

維護完成後，您將體驗到更流暢的使用體驗。', FALSE, '2024-01-08T09:00:00Z'),

('msg_004', '新功能上線：句型拉霸機', '我們推出了全新的句型拉霸機功能！這個互動式工具可以幫助學生練習各種英語句型，讓學習變得更有趣。

功能特色：
- 多種句型模式
- 即時語音播放
- 進度追蹤
- 適合各年級使用', TRUE, '2024-01-05T16:00:00Z');

-- 查詢所有站長消息
SELECT * FROM admin_messages ORDER BY created_at DESC;
