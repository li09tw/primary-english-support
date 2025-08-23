-- 第六批遊戲數據：遊戲 51-60
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch6-games-51-60.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('51', 'Weather Report (天氣預報)', '學習天氣相關詞彙和句型，練習口語表達。', '["口語訓練", "單字學習"]', false, true, true, true, false, false, '["天氣圖片", "白板"]', '["老師展示不同天氣的圖片或圖示", "學生輪流扮演天氣預報員，用英語描述當地的天氣狀況和預測", "鼓勵使用 ''It''s sunny today.'', ''It will be rainy tomorrow.'' 等句型"]', '2023-10-05T10:00:00.000Z', '2023-10-05T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('52', 'Picture Prompts Story (看圖說故事)', '激發想像力，練習口語敘事和連接詞使用。', '["口語訓練", "寫作練習"]', false, false, true, true, true, true, '["一系列相關圖片"]', '["老師準備一系列有連貫性的圖片", "學生根據圖片順序，用英語講述一個完整的故事", "可個人或小組合作"]', '2023-10-03T11:00:00.000Z', '2023-10-03T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('53', 'Sing English Songs (唱英文歌)', '透過歌曲學習單字、句型和發音，提升學習興趣。', '["聽力練習", "發音練習", "單字學習"]', true, true, true, true, true, true, '["英文歌曲音檔", "歌詞"]', '["老師播放英文歌曲，學生跟唱", "可利用歌詞講解單字和句型", "或進行卡拉OK挑戰，看誰唱得好"]', '2023-10-01T14:00:00.000Z', '2023-10-01T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('54', 'What''s Missing? (少了什麼？)', '訓練觀察力、記憶力以及物品單字記憶。', '["單字學習"]', true, true, true, false, false, false, '["多種小物品", "布或紙覆蓋"]', '["老師將數個小物品放在桌上，讓學生記住", "用布或紙蓋住物品，然後偷偷拿走其中一個", "移開覆蓋物後，學生用英語說出少了哪個物品"]', '2023-09-29T10:00:00.000Z', '2023-09-29T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('55', 'Conjunction Chain (連接詞接龍)', '練習使用連接詞來連接句子，提升語句連貫性。', '["句型練習", "寫作練習"]', false, false, false, false, true, true, '["連接詞列表"]', '["老師先說一個簡單的句子", "下一位學生使用一個連接詞（如 ''and'', ''but'', ''because''）來連接並擴展句子", "依序接龍，共同創造一個長故事或解釋"]', '2023-09-27T11:00:00.000Z', '2023-09-27T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('56', 'If I Were... (如果我是...)', '練習假設語氣，激發想像力，提升口語表達。', '["口語訓練", "句型練習"]', false, false, false, true, true, true, '["無"]', '["老師給出一個假設性情境（例如：''If I were an animal...''）", "學生輪流用英語完成句子，並說明原因（例如：''If I were an animal, I would be a bird because I like to fly.''）"]', '2023-09-25T14:00:00.000Z', '2023-09-25T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('57', 'Sentence Dictation (句子聽寫)', '訓練聽力理解和拼寫能力。', '["聽力練習", "拼寫練習", "寫作練習"]', false, false, true, true, true, true, '["預先準備好的句子", "紙", "筆"]', '["老師念出一個句子，語速適中，可重複", "學生將聽到的句子寫在紙上", "完成後進行批改，檢查聽寫和拼寫的正確性"]', '2023-09-23T10:00:00.000Z', '2023-09-23T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('58', 'Flashcard Dictation (閃卡聽寫)', '結合視覺和聽覺，加強單字記憶和拼寫。', '["單字學習", "拼寫練習", "聽力練習"]', true, true, true, false, false, false, '["閃卡", "紙", "筆"]', '["老師展示一張閃卡，然後說出上面的單字", "學生將聽到的單字寫下來", "之後翻開閃卡，核對拼寫是否正確"]', '2023-09-21T11:00:00.000Z', '2023-09-21T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('59', 'Tell Me About It (說說看)', '訓練學生口語表達能力，描述日常生活中的事物。', '["口語訓練"]', false, true, true, true, false, false, '["無"]', '["老師指定一個主題（例如：''Tell me about your favorite toy.'' 或 ''Tell me about your family.''）", "學生輪流用英語描述該主題", "鼓勵其他學生提問"]', '2023-09-19T14:00:00.000Z', '2023-09-19T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('60', 'Fill in the Blanks (句子填空)', '練習詞彙和語法運用，鞏固句型結構。', '["句型練習", "單字學習", "寫作練習"]', false, false, true, true, true, true, '["填空練習紙", "筆"]', '["老師提供一些含有空格的句子，並給出選項或讓學生自由填寫", "學生需選擇正確的單字或片語填入空格，使句子完整和符合語法", "可分組競賽，比速度和準確性"]', '2023-09-17T10:00:00.000Z', '2023-09-17T10:00:00.000Z');
