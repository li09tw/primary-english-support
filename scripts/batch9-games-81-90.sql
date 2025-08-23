-- 第九批遊戲數據：遊戲 81-90
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch9-games-81-90.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('81', 'What''s the Difference? (有什麼不同？)', '練習描述性詞彙和比較句型。', '["口語訓練", "句型練習"]', false, false, true, true, true, false, '["兩張相似但有細微差異的圖片"]', '["老師展示兩張有細微差異的圖片", "學生輪流說出兩張圖片的不同之處，用英語表達（例如：''In picture A, there is a cat. In picture B, there are two cats.''）"]', '2023-08-06T10:00:00.000Z', '2023-08-06T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('82', 'Story Map (故事地圖)', '分析故事元素，提升閱讀理解和寫作組織能力。', '["閱讀練習", "寫作練習"]', false, false, false, true, true, true, '["短篇英文故事", "故事地圖範本（紙）"]', '["學生閱讀一篇英文故事", "然後填寫故事地圖，包含人物、地點、問題、事件、解決方法等元素", "可作為寫作前規劃的練習"]', '2023-08-04T11:00:00.000Z', '2023-08-04T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('83', 'Phonics Dominoes (自然發音骨牌)', '透過遊戲配對發音，強化發音規則。', '["發音練習", "單字學習"]', true, true, true, false, false, false, '["自製發音骨牌卡片"]', '["製作骨牌卡片，一邊是圖片，一邊是發音或單字", "學生將圖片與對應的發音或單字配對，像玩骨牌一樣連接起來", "所有卡片連接起來即獲勝"]', '2023-08-02T14:00:00.000Z', '2023-08-02T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('84', 'Future Tense Plans (未來計畫)', '練習未來式句型，描述未來的計畫或目標。', '["句型練習", "口語訓練"]', false, false, false, true, true, true, '["無"]', '["老師給出一個情境（例如：''Next weekend...'', ''After I graduate...''）", "學生輪流用未來式（will/be going to）描述他們的計畫或目標", "鼓勵具體描述細節"]', '2023-07-31T10:00:00.000Z', '2023-07-31T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('85', 'Word Jumble (單字重組)', '訓練單字拼寫和辨識能力。', '["單字學習", "拼寫練習"]', false, true, true, true, false, false, '["打亂字母順序的單字卡片或列表", "筆", "紙"]', '["老師提供一些被打亂字母順序的單字", "學生需在限時內將字母重新排列，組合成正確的單字", "最快且正確者得分"]', '2023-07-29T11:00:00.000Z', '2023-07-29T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('86', 'Show and Tell (展示與分享)', '練習描述個人物品，提升口語表達和自信心。', '["口語訓練"]', true, true, true, false, false, false, '["學生自備物品"]', '["學生從家中帶一件自己喜歡的物品到學校", "輪流用英語描述這件物品，包括它的名字、顏色、用途、為什麼喜歡它等", "鼓勵同學提問"]', '2023-07-27T14:00:00.000Z', '2023-07-27T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('87', 'Listening Comprehension Quiz (聽力理解測驗)', '評估學生聽力理解能力，找出聽力弱點。', '["聽力練習"]', false, false, false, true, true, true, '["英文音頻（故事、新聞片段、對話）", "測驗卷"]', '["老師播放一段英文音頻", "學生聽完後回答測驗卷上的問題", "題目可設計為選擇題、是非題或簡答題"]', '2023-07-25T10:00:00.000Z', '2023-07-25T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('88', 'Verb Conjugation Race (動詞變位競賽)', '練習動詞的各種形式（原型、過去式、過去分詞）。', '["句型練習", "寫作練習"]', false, false, false, false, true, true, '["動詞列表", "白板或紙"]', '["老師說出一個動詞原型", "學生需快速寫出其過去式和過去分詞", "可分組競賽，比速度和正確性"]', '2023-07-23T11:00:00.000Z', '2023-07-23T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('89', 'Picture Memory Challenge (圖片記憶挑戰)', '訓練視覺記憶和單字回想能力。', '["單字學習"]', true, true, true, false, false, false, '["多張圖片卡片"]', '["老師展示多張圖片卡片數秒鐘，然後將其蓋住或收起來", "學生盡力回想並用英語說出他們記得的圖片上的單字", "回想最多單字者獲勝"]', '2023-07-21T14:00:00.000Z', '2023-07-21T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('90', 'Conversation Starters (對話開場白)', '提供對話情境，鼓勵學生主動開口交流。', '["口語訓練"]', false, false, true, true, true, true, '["對話開場白卡片"]', '["老師提供一些對話開場白或情境（例如：''Hi, how are you today?'', ''What did you do last weekend?''）", "學生分組或兩兩練習對話，拓展交流內容", "鼓勵自由發揮和提出後續問題"]', '2023-07-19T10:00:00.000Z', '2023-07-19T10:00:00.000Z');
