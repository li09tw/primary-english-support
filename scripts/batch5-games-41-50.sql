-- 第五批遊戲數據：遊戲 41-50
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch5-games-41-50.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('41', 'Guess the Action (猜動作)', '透過肢體動作理解和表達動詞詞彙。', '["單字學習", "口語訓練"]', true, true, true, false, false, false, '["動作動詞卡片"]', '["一位學生抽取一張動作動詞卡片，但不能說出上面的字", "學生用肢體表演卡片上的動作", "其他學生猜測是什麼動作，並用英語說出動詞"]', '2023-10-25T14:00:00.000Z', '2023-10-25T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('42', 'Create a Commercial (創作廣告)', '鼓勵學生運用所學詞彙和句型，創造性地表達。', '["口語訓練", "寫作練習"]', false, false, false, false, true, true, '["隨機物品", "筆", "紙"]', '["學生分組，每組分配一個隨機物品（或自選）", "小組需要為這個物品設計一個英文廣告，包含名稱、特點、廣告詞等", "最後各組上台發表他們的廣告"]', '2023-10-23T10:00:00.000Z', '2023-10-23T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('43', 'Silent Reading Race (默讀競賽)', '提升閱讀速度和理解能力。', '["閱讀練習"]', false, false, false, true, true, true, '["短篇英文閱讀材料", "問題清單", "計時器"]', '["老師提供一段閱讀材料和相關問題", "學生在限時內默讀並回答問題", "以閱讀速度和答案正確率綜合評分"]', '2023-10-21T11:00:00.000Z', '2023-10-21T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('44', 'Verb Tense Challenge (動詞時態挑戰)', '練習動詞時態的正確使用，鞏固語法知識。', '["句型練習", "寫作練習"]', false, false, false, true, true, true, '["動詞列表", "句子卡片"]', '["老師提供一個動詞和指定的時態", "學生需用該動詞和時態造句", "或提供一個句子，學生需將動詞變換為正確的時態"]', '2023-10-19T14:00:00.000Z', '2023-10-19T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('45', 'Picture Dictionary Creation (圖片字典製作)', '結合視覺和文字，加強單字記憶和理解。', '["單字學習", "寫作練習"]', true, true, true, false, false, false, '["圖畫紙", "彩色筆", "剪刀", "膠水"]', '["學生選擇或畫出一個物品的圖片", "然後在圖片下方寫上對應的英文單字", "鼓勵製作成一本個人化的圖片字典，或組合成班級字典"]', '2023-10-17T10:00:00.000Z', '2023-10-17T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('46', 'Would You Rather? (你寧願...？)', '練習表達個人選擇和解釋原因，提升口語流暢度。', '["口語訓練"]', false, false, false, true, true, true, '["問題卡片"]', '["老師提出 ''Would you rather...or...?'' 的問題（例如：''Would you rather fly or be invisible?''）", "學生選擇其中一個選項，並用英語解釋原因", "鼓勵學生互動討論"]', '2023-10-15T11:00:00.000Z', '2023-10-15T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('47', 'Preposition Hunt (介詞尋寶)', '練習介詞的正確使用，理解其在句子中的作用。', '["句型練習"]', false, false, true, true, true, false, '["物品", "介詞提示卡"]', '["老師放置一些物品在教室的各個位置", "老師說出一個介詞，例如 ''on''", "學生需要找到一個物品，並用英語說出包含該介詞的句子（例如：''The book is on the table.''）"]', '2023-10-13T14:00:00.000Z', '2023-10-13T14:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('48', 'Opposites Match (反義詞配對)', '學習反義詞，擴展詞彙量和語義理解。', '["單字學習"]', true, true, true, false, false, false, '["反義詞卡片組"]', '["準備兩組卡片，一組寫著單字，另一組寫著其反義詞", "將卡片打亂，學生輪流翻開兩張，找出反義詞配對", "配對成功者保留卡片，最多者獲勝"]', '2023-10-11T10:00:00.000Z', '2023-10-11T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('49', 'Daily Routine Presentation (日常作息發表)', '練習描述個人日常作息，運用時間表達和動詞詞彙。', '["口語訓練", "句型練習"]', false, false, true, true, true, false, '["白板或紙", "筆"]', '["學生準備關於自己日常作息的簡單英文描述", "輪流上台或分組分享他們的日常作息", "鼓勵使用如 ''first'', ''then'', ''after that'' 等連接詞"]', '2023-10-09T11:00:00.000Z', '2023-10-09T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('50', 'Crossword Puzzle Creation (填字遊戲創作)', '強化單字拼寫和定義理解能力。', '["單字學習", "拼寫練習"]', false, false, false, true, true, true, '["格線紙", "筆"]', '["學生選擇一定數量的單字，並為每個單字寫出一個簡短的英文定義", "然後將這些單字設計成一個填字遊戲", "可互相交換完成彼此的填字遊戲"]', '2023-10-07T14:00:00.000Z', '2023-10-07T14:00:00.000Z');
