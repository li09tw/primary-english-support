-- 第二批遊戲數據：遊戲 11-20
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch2-games-11-20.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('11', 'Story Chain (故事接龍)', '培養口語表達能力、邏輯思考與創造力，鼓勵學生用英語連貫敘述。', '["口語訓練", "句型練習"]', false, false, true, true, true, true, '["無"]', '["老師先說故事的開頭，例如 ''Once upon a time, there was a little girl and a big bear.''", "然後由下一位學生接一句，依序輪流說下去", "共同編織一個完整的故事", "3年級可以一句話接一句話的簡單模式，5-6年級可要求更豐富的細節"]', '2023-12-24T10:00:00.000Z', '2023-12-24T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('12', 'Flashcard Slap (閃卡拍拍樂)', '快速辨識單字，提升反應力。', '["單字學習"]', true, true, true, true, true, true, '["閃卡（可自行繪製或列印）"]', '["將數張閃卡攤開放在桌上或地上", "老師念出其中一張閃卡上的單字", "學生聽到後快速用手拍打對應的閃卡", "最快拍到且正確者得分"]', '2023-12-22T11:00:00.000Z', '2023-12-22T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('13', 'Q&A Ball Toss (問答傳球)', '練習問答句型，提升口語流暢度。', '["口語訓練", "句型練習"]', false, false, true, true, true, true, '["一顆軟球"]', '["一位學生問一個問題，然後將球傳給另一位學生", "接到球的學生必須回答問題，並再問一個新問題給下一個人", "3年級可練習 ''What''s your name?'' ''How old are you?'' 等", "5-6年級可設計更複雜的時態或情境問題"]', '2023-12-20T14:00:00.000Z', '2023-12-20T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('14', 'Hangman (吊死鬼)', '練習字母拼寫，加強單字記憶。', '["單字學習", "拼寫練習"]', false, false, true, true, true, true, '["白板或紙", "筆"]', '["老師想一個單字，在白板上畫出與單字字母數相同數量的底線", "學生輪流猜字母，如果猜對，老師就把字母填到底線上方", "如果猜錯，就畫一筆吊死鬼的圖案", "在吊死鬼圖案完成前猜中單字則獲勝"]', '2023-12-18T10:00:00.000Z', '2023-12-18T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('15', 'Memory Game (記憶配對)', '訓練記憶力，配對單字與圖片/中文意思。', '["單字學習"]', true, true, true, true, true, true, '["紙", "筆", "剪刀 (自製配對卡)"]', '["製作兩套卡片，一套是單字，一套是搭配的圖片或中文意思", "將所有卡片反面朝上散放", "學生輪流翻開兩張卡片，如果兩張卡片內容配對成功則拿走", "如果沒有配對成功，就將卡片翻回原位，獲得最多配對的學生獲勝"]', '2023-12-16T11:00:00.000Z', '2023-12-16T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('16', 'Role Play (情境扮演)', '在模擬真實情境中練習英語對話，提升口語流暢度與自信。', '["口語訓練"]', false, false, true, true, true, true, '["簡單道具（如紙筆自製菜單、空盒子當商品等）"]', '["設定情境、分配角色，並提供一些關鍵詞彙或句型提示", "學生分組扮演不同角色，根據情境進行英語對話", "3年級可從簡單的打招呼、介紹自己開始", "5-6年級可扮演在餐廳點餐、商店購物、問路等情境"]', '2023-12-14T14:00:00.000Z', '2023-12-14T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('17', 'What Am I? Guessing Game (我是誰？猜猜看)', '練習描述性詞彙和疑問句型，訓練邏輯推理。', '["口語訓練", "單字學習"]', false, false, true, true, true, true, '["無"]', '["一位學生在心中想一個單字（名詞）", "其他學生輪流提問（例如 ''Are you big?'', ''Can you fly?''）", "想單字的學生只能回答 ''Yes'' 或 ''No''", "直到有人猜對"]', '2023-12-12T10:00:00.000Z', '2023-12-12T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('18', 'Vocabulary Categorization Race (單字分類競賽)', '訓練單字歸類能力，擴展詞彙廣度。', '["單字學習"]', false, false, true, true, true, true, '["紙", "筆", "或預先寫好單字的紙條"]', '["在白板或大張紙上寫好幾個分類標題", "老師唸出或寫出單字，學生需快速判斷並將單字歸入正確的類別", "可分組競賽，看哪組分類最快且正確", "3年級可分為「食物」、「動物」等大類，5-6年級可增加更多元分類"]', '2023-12-10T11:00:00.000Z', '2023-12-10T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('19', 'Phonics Sound Hunt (發音尋寶)', '強化自然發音意識，提升聽音辨字能力。', '["單字學習", "發音練習"]', false, false, true, true, true, true, '["無"]', '["老師說出一個發音（例如：/ae/ 的音，如 apple 的 ''a''）", "學生在教室或書本中找出含有此發音的單字並大聲唸出來", "3年級可專注於單字母或常見二合字母發音", "5-6年級可增加複合音或不規則發音"]', '2023-12-08T14:00:00.000Z', '2023-12-08T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('20', 'Sentence Completion Race (句子填空競賽)', '練習句型應用，鼓勵學生發揮創造力。', '["句型練習"]', false, false, true, true, true, true, '["白板或紙", "筆"]', '["老師準備一些不完整的句子開頭", "老師寫下一個句子開頭（例如：''I like to eat...'', ''If I were a bird...''）", "學生在限時內完成句子，越有創意或符合文法者得分", "3年級填入簡單單字，5-6年級可要求填入片語或完整子句"]', '2023-12-06T10:00:00.000Z', '2023-12-06T10:00:00.000Z');
