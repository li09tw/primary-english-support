-- 第七批遊戲數據：遊戲 61-70
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch7-games-61-70.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('61', 'Alphabet Race (字母競賽)', '快速辨識和說出英文字母，適合初學者。', '["單字學習", "發音練習"]', true, false, false, false, false, false, '["字母卡片"]', '["老師將字母卡片散開在地上", "老師念出一個字母，學生需快速拍打或撿起對應的字母卡片", "最快且正確者得分"]', '2023-09-15T11:00:00.000Z', '2023-09-15T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('62', 'Yes/No Question Game (是非題遊戲)', '練習回答簡單的是非題，培養聽力理解。', '["聽力練習", "口語訓練"]', true, true, false, false, false, false, '["無"]', '["老師問學生簡單的是非題（例如：''Is this a pen?'' 指著筆）", "學生用 ''Yes, it is.'' 或 ''No, it isn''t.'' 回答", "可增加挑戰，讓學生提問"]', '2023-09-13T14:00:00.000Z', '2023-09-13T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('63', 'Picture Card Story (圖卡故事)', '利用圖卡刺激想像力，練習口語敘事。', '["口語訓練"]', true, true, true, false, false, false, '["一組不相關的圖片卡片"]', '["老師發給每位學生一張圖片卡片", "學生輪流用英語描述自己的圖片，然後嘗試將所有圖片串聯成一個故事", "鼓勵創意和邏輯連接"]', '2023-09-11T10:00:00.000Z', '2023-09-11T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('64', 'Noun/Verb/Adjective Sort (名詞/動詞/形容詞分類)', '區分不同詞性，鞏固語法概念。', '["單字學習", "句型練習"]', false, false, true, true, true, false, '["單字卡片", "分類標籤（Noun, Verb, Adjective）"]', '["老師準備一些不同詞性的單字卡片", "學生將這些單字卡片分類到對應的詞性標籤下", "可分組進行，看哪組分類最快且正確"]', '2023-09-09T11:00:00.000Z', '2023-09-09T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('65', 'Guess the Feeling (猜猜情緒)', '學習情緒相關詞彙，練習口語表達和非語言溝通。', '["口語訓練", "單字學習"]', false, true, true, true, false, false, '["情緒圖片或表情卡片"]', '["一位學生抽取一張情緒卡片，並用表情或肢體表演該情緒", "其他學生用英語猜測是什麼情緒（例如：''Are you happy?'' ''You are sad.''）", "猜對者得分"]', '2023-09-07T14:00:00.000Z', '2023-09-07T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('66', 'What''s My Job? (我的工作是什麼？)', '學習職業相關詞彙，練習提問和描述。', '["單字學習", "口語訓練"]', false, false, true, true, true, false, '["職業卡片"]', '["一位學生抽取一張職業卡片，但不給其他學生看", "其他學生輪流提問關於這個職業的問題（例如：''Do you work in a hospital?'', ''Do you wear a uniform?''）", "抽取卡片的學生只能回答 ''Yes'' 或 ''No''", "直到有人猜對職業"]', '2023-09-05T10:00:00.000Z', '2023-09-05T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('67', 'Command Game (指令遊戲)', '訓練聽力理解，熟悉動詞和簡單指令。', '["聽力練習", "口語訓練"]', true, true, false, false, false, false, '["無"]', '["老師下達簡單的英文指令（例如：''Stand up!'', ''Touch your nose!'', ''Open your book!''）", "學生根據指令做出動作", "做錯或反應慢的學生出局"]', '2023-09-03T11:00:00.000Z', '2023-09-03T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('68', 'Scavenger Hunt (尋寶遊戲)', '結合探索和語言學習，強化單字和聽力。', '["單字學習", "聽力練習"]', false, true, true, true, false, false, '["物品清單", "小物品或圖片"]', '["老師提供一個英文物品清單（或口頭指令）", "學生在教室內或指定區域尋找這些物品", "最快找到所有物品者獲勝"]', '2023-09-01T14:00:00.000Z', '2023-09-01T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('69', 'Create a Rap/Chant (創作饒舌/歌謠)', '透過音樂和節奏學習單字、發音，激發創造力。', '["發音練習", "單字學習", "口語訓練"]', false, false, true, true, true, true, '["無"]', '["老師給出一個主題或一組單字", "學生分組合作，為這些單字或主題創作一段英文饒舌或歌謠", "最後各組表演他們的廣告"]', '2023-08-30T10:00:00.000Z', '2023-08-30T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('70', 'Who Am I? (我是誰？)', '練習人物描述性詞彙和提問，提升口語互動。', '["口語訓練", "單字學習"]', false, false, true, true, true, false, '["人物卡片（歷史人物、卡通角色、名人等）"]', '["一位學生額頭貼上一張人物卡片，自己看不到", "其他學生提問（例如：''Am I a man?'', ''Am I famous?'', ''Do I wear glasses?''）", "額頭貼卡片的學生根據回答猜測自己是誰"]', '2023-08-28T11:00:00.000Z', '2023-08-28T11:00:00.000Z');
