-- 第四批遊戲數據：遊戲 31-40
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch4-games-31-40.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('31', 'Listen and Draw (聽音繪圖)', '訓練聽力理解，將聽到的指令轉化為視覺圖像。', '["聽力練習"]', true, true, true, false, false, false, '["白紙", "彩色筆"]', '["老師口頭描述一個簡單的場景或物品（例如：''Draw a big red apple on the table.''）", "學生根據老師的描述繪圖", "完成後可互相展示，比較繪圖是否符合描述"]', '2023-11-14T11:00:00.000Z', '2023-11-14T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('32', 'Spelling Bee (拼字大賽)', '強化單字拼寫能力和聽力理解。', '["拼寫練習", "單字學習"]', false, false, true, true, true, true, '["單字列表"]', '["老師念出一個單字", "學生輪流口頭拼寫該單字", "拼錯的學生出局，直到剩下最後一位獲勝者"]', '2023-11-12T14:00:00.000Z', '2023-11-12T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('33', 'Guess the Word from Definition (看定義猜單字)', '透過定義理解單字，提升詞彙聯想能力。', '["單字學習"]', false, false, false, true, true, true, '["單字定義列表"]', '["老師念出一個單字的英文定義", "學生根據定義猜出對應的單字", "最快猜對者得分，可分組進行"]', '2023-11-10T10:00:00.000Z', '2023-11-10T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('34', 'Grammar Race (文法競賽)', '鞏固語法知識，提高句子正確性。', '["句型練習", "寫作練習"]', false, false, false, false, true, true, '["含有語法錯誤的句子", "白板或紙"]', '["老師寫出或念出一個含有語法錯誤的句子", "學生找出並改正錯誤", "最快找出並改正正確的學生得分"]', '2023-11-08T11:00:00.000Z', '2023-11-08T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('35', 'Musical Chairs with Questions (搶椅子問答)', '結合肢體活動和口語練習，增加課堂趣味性。', '["口語訓練", "聽力練習"]', true, true, true, true, false, false, '["椅子", "音樂播放器", "問題卡片"]', '["擺放比學生人數少一張的椅子，播放音樂讓學生繞著椅子走", "音樂停止時，學生搶椅子坐下", "沒有搶到椅子的學生抽取問題卡片，並用英語回答問題", "答對可繼續參與下一輪，答錯則出局"]', '2023-11-06T14:00:00.000Z', '2023-11-06T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('36', 'Homophone Challenge (同音異義字挑戰)', '區分發音相同但意義和拼寫不同的單字，提升詞彙辨識度。', '["單字學習", "拼寫練習", "發音練習"]', false, false, false, false, true, true, '["同音異義字列表"]', '["老師說出一個同音異義字組中的一個單字（例如：''see''）", "學生必須說出另一個同音異義字（例如：''sea''），並解釋其意義", "可分組進行，答對者得分"]', '2023-11-04T10:00:00.000Z', '2023-11-04T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('37', 'Adjective Story (形容詞故事)', '練習使用形容詞來豐富句子和故事，提升寫作和口語表達能力。', '["句型練習", "口語訓練", "寫作練習"]', false, false, false, true, true, true, '["無"]', '["老師提供一個名詞或簡單的句子開頭", "學生輪流添加形容詞來描述或延伸句子，共同編織一個充滿細節的故事", "例如：''The cat...'' -> ''The *fluffy* cat...'' -> ''The *fluffy, lazy* cat...'' -> ''The *fluffy, lazy, orange* cat *slept*...''"]', '2023-11-02T11:00:00.000Z', '2023-11-02T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('38', 'Listen for Details (聽力細節捕捉)', '訓練學生捕捉聽力材料中的關鍵信息。', '["聽力練習"]', false, false, false, true, true, true, '["短篇英文故事或對話音檔", "問題清單"]', '["老師播放一段短音檔（故事或對話）", "學生聽完後回答老師提出的關於內容細節的問題", "可多次播放，鼓勵學生做筆記"]', '2023-10-31T14:00:00.000Z', '2023-10-31T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('39', 'Categorization Race (分類競賽)', '快速分類物品或單字，培養邏輯思考和詞彙應用能力。', '["單字學習"]', true, true, true, false, false, false, '["多種物品或圖片卡片", "分類箱/板"]', '["準備不同類別的物品或圖片卡片（如：食物、動物、交通工具）", "老師喊出一個類別，學生需快速將屬於該類別的物品放進對應的箱子或貼在板上", "最快且正確完成者獲勝"]', '2023-10-29T10:00:00.000Z', '2023-10-29T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('40', 'Question Chain (問題接龍)', '練習提問和回答句型，提升口語互動能力。', '["口語訓練", "句型練習"]', false, false, true, true, true, false, '["無"]', '["第一位學生問一個問題", "第二位學生回答問題，然後再問一個新問題給下一位學生", "依序進行，鼓勵使用不同類型的疑問句"]', '2023-10-27T11:00:00.000Z', '2023-10-27T11:00:00.000Z');
