-- 第三批遊戲數據：遊戲 21-30
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch3-games-21-30.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('21', 'Rhyming Word Challenge (押韻單字挑戰)', '提升對單字發音規律的認知，擴展押韻詞彙。', '["單字學習", "發音練習"]', false, false, true, true, true, true, '["無"]', '["老師說一個單字（例如：''ball''）", "學生輪流說出與該單字押韻的其他單字（例如：''tall'', ''small'', ''wall''）", "直到有人說不出來為止", "3年級可從簡單的 CVC 單字開始，5-6年級可挑戰更多音節或不規則押韻"]', '2023-12-04T11:00:00.000Z', '2023-12-04T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('22', 'Find Someone Who... Bingo (找找看誰是...)', '鼓勵學生用英語進行口語交流，練習提問。', '["口語訓練", "句型練習"]', false, false, true, true, true, true, '["事先設計好的賓果表格（紙）"]', '["設計賓果表格，每格寫上一個條件（例如：''Find someone who likes pizza.''）", "學生拿著表格在教室內自由走動，問同學問題", "找到符合條件的同學在該格簽名", "最快連成一線者獲勝"]', '2023-12-02T14:00:00.000Z', '2023-12-02T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('23', 'Descriptive Storytelling (描述性說故事)', '訓練學生運用形容詞和副詞，提升故事細節描述能力。', '["口語訓練", "句型練習"]', false, false, true, true, true, true, '["隨機圖片或簡單物品"]', '["準備一些圖片或隨機物品（例如：一個蘋果、一支筆、一個玩具車）", "老師展示一張圖片或物品", "學生輪流用英文描述它的特徵（顏色、形狀、材質、感覺等）", "並可以將這些描述串聯成一個小故事"]', '2023-11-30T10:00:00.000Z', '2023-11-30T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('24', 'Word Association (單字聯想)', '訓練詞彙連結能力，提升快速反應和思維敏捷度。', '["單字學習"]', false, false, true, true, true, true, '["無"]', '["老師說一個單字（例如：''school''）", "下一位學生必須說出與之相關的單字（例如：''teacher'', ''book'', ''classroom''）", "依序接龍，直到有人說不出相關單字為止", "3年級可做簡單的同類聯想，5-6年級可做多層次或跨類別聯想"]', '2023-11-28T11:00:00.000Z', '2023-11-28T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('25', 'Simple Debate/Opinion Sharing (簡單辯論/意見分享)', '練習表達個人觀點，提升說服性語言和口語自信。', '["口語訓練"]', false, false, true, true, true, true, '["無"]', '["準備一些簡單但具爭議性的議題（例如：''Cats are better than dogs.''）", "學生分組或個人，針對給定的議題表達自己的看法", "並試圖用英語支持自己的論點", "需要一定的口語表達能力"]', '2023-11-26T14:00:00.000Z', '2023-11-26T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('26', 'Hot Seat (熱座問答)', '強化口語表達、聽力理解和快速反應能力。', '["口語訓練", "聽力練習"]', false, false, true, true, true, true, '["一張椅子"]', '["一位學生坐在教室前面，背對白板", "老師在白板上寫一個單字或貼一張圖片", "其他學生提供線索或提問（不能直接說出單字）", "坐在熱座上的學生根據線索猜出答案"]', '2023-11-24T10:00:00.000Z', '2023-11-24T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('27', 'Sentence Transformation (句子變換)', '練習不同句型和時態的轉換，理解語法結構。', '["句型練習", "寫作練習"]', false, false, false, true, true, true, '["練習紙", "筆"]', '["老師給出一個句子，並指定變換要求（例如：將肯定句變否定句，或現在式變過去式）", "學生根據要求改寫句子", "可分組競賽，看哪組變換得又快又正確"]', '2023-11-22T10:00:00.000Z', '2023-11-22T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('28', 'Whisper Challenge (悄悄話挑戰)', '訓練聽力理解和口語傳達的準確性。', '["聽力練習", "口語訓練"]', false, false, true, true, true, true, '["無"]', '["學生排成一列或一圈", "第一位學生悄悄地在下一位學生的耳邊說一個單字或句子", "依序傳下去，最後一位學生大聲說出他聽到的內容", "看內容是否與原始訊息一致"]', '2023-11-20T11:00:00.000Z', '2023-11-20T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('29', 'Picture Description Race (看圖說話競賽)', '提升口語描述能力和詞彙運用能力。', '["口語訓練", "單字學習"]', false, true, true, true, false, false, '["圖片卡片（情境圖或單一物品圖）"]', '["老師展示一張圖片", "學生輪流用英語描述圖片內容", "可設定時間限制，看誰在時間內能說出最多相關詞彙或句子"]', '2023-11-18T14:00:00.000Z', '2023-11-18T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('30', 'Tongue Twisters Challenge (繞口令挑戰)', '練習發音和語速，提升口語流暢度。', '["發音練習", "口語訓練"]', false, false, false, true, true, true, '["繞口令文本"]', '["老師提供繞口令文本", "學生輪流嘗試快速且清晰地念出繞口令", "可進行分組或個人計時，看誰念得最快且錯誤最少"]', '2023-11-16T10:00:00.000Z', '2023-11-16T10:00:00.000Z');
