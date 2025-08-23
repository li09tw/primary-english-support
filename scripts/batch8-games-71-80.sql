-- 第八批遊戲數據：遊戲 71-80
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch8-games-71-80.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('71', 'Storytelling with Dice (骰子說故事)', '隨機性創作故事，練習口語敘事和連接詞。', '["口語訓練", "寫作練習"]', false, false, false, true, true, true, '["骰子（或自製寫有單字的方塊）", "圖片或單字清單"]', '["老師準備多個骰子，每個面寫上不同的單字（如：人物、地點、物品、動作）", "學生輪流擲骰子，根據擲出的單字即興編織故事", "鼓勵運用想像力串聯元素"]', '2023-08-26T14:00:00.000Z', '2023-08-26T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('72', 'Sentence Building Blocks (句子積木)', '用積木方式組裝句子，直觀學習句型結構。', '["句型練習"]', true, true, true, false, false, false, '["寫有單字的積木或樂高積木"]', '["準備寫有名詞、動詞、形容詞、介詞等單字的積木", "學生根據語法規則，將積木堆疊組合成正確的英文句子", "可增加顏色編碼來區分詞性"]', '2023-08-24T10:00:00.000Z', '2023-08-24T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('73', 'Interview Game (採訪遊戲)', '練習提問和回答問題，提升口語交際能力。', '["口語訓練", "句型練習"]', false, false, true, true, true, true, '["問題提示卡（可選）"]', '["學生兩兩分組，一人扮演記者，一人扮演受訪者", "記者向受訪者提問各種問題（例如：關於興趣、家庭、學校生活等）", "受訪者用英語回答，並鼓勵互相交換角色"]', '2023-08-22T11:00:00.000Z', '2023-08-22T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('74', 'Phonics Board Game (自然發音桌遊)', '透過遊戲方式鞏固自然發音規則。', '["發音練習", "單字學習", "教學輔具"]', true, true, true, false, false, false, '["自製桌遊地圖", "棋子", "骰子", "發音卡片"]', '["學生擲骰子移動棋子，到達不同格子會有不同任務", "任務可能是念出含有特定發音的單字，或辨識發音相同的圖片", "最先到達終點者獲勝"]', '2023-08-20T14:00:00.000Z', '2023-08-20T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('75', 'Past Tense Charades (過去式比手畫腳)', '練習動詞過去式，結合肢體表達和語法。', '["句型練習", "口語訓練"]', false, false, false, true, true, true, '["動詞過去式卡片"]', '["學生抽取一張動詞過去式卡片，表演該動詞的動作", "其他學生猜測是什麼動作，並用過去式回答（例如：''You ate an apple.''）", "猜對者得分"]', '2023-08-18T10:00:00.000Z', '2023-08-18T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('76', 'Word Search (單字尋找)', '練習單字辨識和拼寫，培養專注力。', '["單字學習", "拼寫練習"]', false, true, true, true, false, false, '["單字尋找遊戲紙", "筆"]', '["老師提供印有字母網格和單字列表的尋找遊戲紙", "學生在字母網格中找出列表中的單字並圈出來", "最快找到所有單字者獲勝"]', '2023-08-16T11:00:00.000Z', '2023-08-16T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('77', 'Make a Menu (製作菜單)', '學習食物詞彙，練習情境對話和價格表達。', '["單字學習", "口語訓練"]', false, false, true, true, true, false, '["紙", "筆", "彩色筆"]', '["學生分組設計一個餐廳菜單，包含食物名稱和價格（用英語）", "然後進行角色扮演，一人點餐，一人服務，練習點餐對話"]', '2023-08-14T14:00:00.000Z', '2023-08-14T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('78', 'Read Aloud Challenge (朗讀挑戰)', '提升發音、語調和閱讀流暢度。', '["閱讀練習", "發音練習", "口語訓練"]', false, false, true, true, true, true, '["短篇英文故事或文章"]', '["老師提供一段英文文本", "學生輪流或分組朗讀，老師和同學評分發音、語調和流暢度", "可錄音回放，幫助學生自我檢視"]', '2023-08-12T10:00:00.000Z', '2023-08-12T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('79', 'Sentence Transformation Relay (句子變換接力)', '快速轉換句型，訓練語法反應能力。', '["句型練習"]', false, false, false, false, true, true, '["白板", "白板筆"]', '["學生分組，每組排成一列", "老師寫一個句子在白板上，並指定變換規則（例如：將肯定句變疑問句）", "各組第一位學生衝到白板前寫下變換後的句子，然後跑回觸摸下一位組員，依序接力", "最快且正確完成的組獲勝"]', '2023-08-10T11:00:00.000Z', '2023-08-10T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('80', 'Word Wall Activities (單字牆活動)', '利用視覺輔助，加強單字學習和拼寫。', '["單字學習", "拼寫練習", "教學輔具"]', true, true, true, true, false, false, '["單字牆", "單字卡片", "指針或魔棒"]', '["老師或學生指著單字牆上的單字，讓大家一起念出來", "可玩 ''I Spy'' 遊戲：''I spy with my little eye a word that starts with B.''", "或請學生找出某個單字的反義詞/同義詞"]', '2023-08-08T14:00:00.000Z', '2023-08-08T14:00:00.000Z');
