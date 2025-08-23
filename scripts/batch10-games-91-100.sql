-- 第十批遊戲數據：遊戲 91-100
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch10-games-91-100.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('91', 'Error Correction (錯誤糾正)', '培養語法敏感度，提升句子正確性。', '["句型練習", "寫作練習"]', false, false, false, true, true, true, '["錯誤句子列表", "白板或紙"]', '["老師寫出或念出一個含有語法錯誤的句子", "學生找出並口頭或書面糾正錯誤", "可分組競賽，看誰糾正得又快又正確"]', '2023-07-17T11:00:00.000Z', '2023-07-17T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('92', 'Body Parts Race (身體部位競賽)', '學習身體部位單字，結合肢體活動。', '["單字學習"]', true, true, false, false, false, false, '["無"]', '["老師說出一個身體部位的英文名稱（例如：''head'', ''hand'', ''knee''）", "學生需快速觸摸自己的該身體部位", "反應慢或觸摸錯誤者出局"]', '2023-07-15T14:00:00.000Z', '2023-07-15T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('93', 'Who''s Got the Ball? (誰拿到球了？)', '練習提問和回答簡單的是非題，提高專注力。', '["口語訓練", "聽力練習"]', true, true, true, false, false, false, '["一顆小球"]', '["所有學生圍坐成一圈，一位學生閉上眼睛或背對", "老師將球傳給其中一位學生，然後讓學生藏在身後", "閉眼學生睜開眼後，輪流問 ''Do you have the ball?''，拿到球的學生回答 ''Yes, I do.'' 或 ''No, I don''t.''", "直到猜出球在誰那裡"]', '2023-07-13T10:00:00.000Z', '2023-07-13T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('94', 'Homonym Fun (同形異義字樂)', '辨識同形異義字在不同語境中的意義。', '["單字學習", "閱讀練習"]', false, false, false, false, true, true, '["同形異義字列表", "句子範例"]', '["老師提供一個同形異義字（例如：''bat''）", "學生需說出或寫出該單字在不同意義下的用法（棒球棒/蝙蝠）", "並用英語造句來區分"]', '2023-07-11T11:00:00.000Z', '2023-07-11T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('95', 'Make a Poster (製作海報)', '綜合運用單字、句型和創造力，視覺化學習成果。', '["單字學習", "寫作練習", "教學輔具"]', false, true, true, true, false, false, '["大海報紙", "彩色筆", "圖片剪貼"]', '["老師設定一個主題（例如：''My Favorite Animals'', ''Healthy Food''）", "學生分組設計並製作一張英文海報，包含相關單字、圖片和簡單句子", "最後各組展示並介紹他們的海報"]', '2023-07-09T14:00:00.000Z', '2023-07-09T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('96', 'The Price is Right (價格猜猜看)', '練習數字、物品單字和提問/回答價格。', '["單字學習", "口語訓練"]', false, false, true, true, true, false, '["各種物品圖片", "虛擬價格標籤"]', '["老師展示一個物品圖片", "學生輪流猜測物品的價格（用英語）", "老師提示 ''higher'' 或 ''lower''，直到有人猜對或最接近"]', '2023-07-07T10:00:00.000Z', '2023-07-07T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('97', 'Picture Matching (圖片配對)', '透過圖片配對單字或句子，加強理解。', '["單字學習", "句型練習"]', true, true, false, false, false, false, '["圖片卡片", "單字/句子卡片"]', '["將圖片卡片和單字/句子卡片打亂", "學生找出每張圖片對應的單字或句子進行配對", "最快完成所有配對者獲勝"]', '2023-07-05T11:00:00.000Z', '2023-07-05T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('98', 'Adverb Charades (副詞比手畫腳)', '練習副詞的運用，透過動作理解語氣和方式。', '["口語訓練", "句型練習"]', false, false, false, false, true, true, '["副詞卡片"]', '["一位學生抽取一張副詞卡片（例如：''quickly'', ''sadly'', ''loudly''）", "學生表演一個動作，並用該副詞來修飾動作（不能說出副詞）", "其他學生猜測該副詞，並用英語說出（例如：''You are walking quickly.''）"]', '2023-07-03T14:00:00.000Z', '2023-07-03T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('99', 'What''s the Question? (問題是什麼？)', '訓練從回答中構建問題的能力。', '["句型練習", "口語訓練"]', false, false, false, true, true, true, '["回答句卡片"]', '["老師展示一個英文回答句（例如：''My favorite color is blue.''）", "學生需在限時內說出或寫出對應的問題（例如：''What is your favorite color?''）", "最快且正確者得分"]', '2023-07-01T10:00:00.000Z', '2023-07-01T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('100', 'Pass the Story (傳遞故事)', '集體創作故事，練習口語表達和連貫性。', '["口語訓練", "寫作練習"]', false, false, true, true, true, true, '["無"]', '["老師說一個故事開頭", "每位學生輪流接續一句，共同完成一個故事", "鼓勵使用連接詞和豐富細節"]', '2023-06-29T11:00:00.000Z', '2023-06-29T11:00:00.000Z');
