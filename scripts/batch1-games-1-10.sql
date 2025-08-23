-- 第一批遊戲數據：遊戲 1-10
-- 使用命令執行：wrangler d1 execute primary-english-db --file=./scripts/batch1-games-1-10.sql

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('1', '單字配對遊戲', '透過配對卡片的方式，讓學生學習英語單字，提升記憶力和理解能力。', '["單字學習"]', true, false, false, false, false, false, '["單字卡片", "計時器"]', '["準備多組單字卡片，每組包含英文單字和對應的中文意思", "將卡片打亂，背面朝上排列", "學生輪流翻開兩張卡片，如果配對成功則保留，失敗則翻回", "遊戲結束時，配對成功最多的學生獲勝"]', '2024-01-15T09:00:00.000Z', '2024-01-15T09:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('2', '句型接龍', '學生輪流說出符合特定句型的句子，訓練口語表達和語法運用能力。', '["句型練習"]', false, true, false, false, false, false, '["句型提示卡", "計分板"]', '["教師提供一個句型模板，例如：I like to...", "學生輪流完成句子，如：I like to read books", "每個學生說完後，下一個學生必須說出不同的內容", "無法完成或重複內容的學生扣分"]', '2024-01-12T14:30:00.000Z', '2024-01-12T14:30:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('3', '角色扮演對話', '學生扮演不同角色進行英語對話，練習日常用語和情境表達。', '["口語訓練"]', false, false, true, false, false, false, '["角色卡片", "情境設定"]', '["教師設定對話情境，如：在餐廳點餐", "分配角色給學生，如：服務生、顧客", "學生根據角色進行英語對話", "鼓勵學生使用學過的單字和句型"]', '2024-01-10T11:15:00.000Z', '2024-01-10T11:15:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('4', '動物單字學習卡', '包含常見動物的英文單字和圖片，幫助學生學習動物相關的英語詞彙。', '["單字學習", "教學輔具"]', true, true, true, false, false, false, '["動物圖片卡", "單字卡", "音檔"]', '["展示動物圖片，讓學生說出中文名稱", "教導對應的英文單字發音", "進行單字配對練習", "播放音檔讓學生跟讀"]', '2024-01-08T10:00:00.000Z', '2024-01-08T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('5', '顏色句型練習板', '透過顏色主題練習基本句型，如 "What color is it?" 和 "It is..."。', '["句型練習", "教學輔具"]', false, true, true, false, false, false, '["顏色卡片", "句型提示板", "互動白板"]', '["展示不同顏色的物品", "教師示範句型：What color is it?", "學生回答：It is red/blue/green...", "進行角色互換練習"]', '2024-01-05T16:00:00.000Z', '2024-01-05T16:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('6', '日常對話情境卡', '模擬真實生活情境的對話練習，提升學生的口語表達能力。', '["口語訓練", "教學輔具"]', false, false, true, true, true, true, '["情境設定卡", "角色扮演道具", "對話腳本"]', '["設定對話情境，如：在商店購物", "分配角色：店員、顧客", "學生根據腳本進行對話練習", "鼓勵學生自由發揮和表達"]', '2024-01-03T12:00:00.000Z', '2024-01-03T12:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('7', 'Simon Says (老師說)', '訓練聽力理解，熟悉動作指令及身體部位詞彙。', '["口語訓練", "聽力練習"]', false, false, true, true, true, true, '["無"]', '["老師下指令，如果指令前有說 ''Simon says''，學生就要照做", "如果沒有說，學生就不動", "做錯或動作者出局", "3年級可從簡單的動作詞彙開始，5-6年級可增加複雜度"]', '2024-01-01T09:00:00.000Z', '2024-01-01T09:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('8', 'Word Bingo (單字賓果)', '鞏固單字記憶與辨識能力。', '["單字學習"]', false, false, true, true, true, true, '["紙", "筆"]', '["事先準備好要學習的單字列表", "讓學生在紙上畫出九宮格或十六宮格，並將單字填入格中", "老師念單字，學生聽到後在賓果格中找到對應單字並畫記", "最快連成一線（橫、豎、斜）者喊 ''Bingo!'' 獲勝"]', '2023-12-30T10:00:00.000Z', '2023-12-30T10:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('9', 'Pictionary / Charades (你畫我猜 / 肢體表達)', '透過視覺或肢體表達來理解和運用單字、片語或簡單句子。', '["口語訓練", "單字學習"]', false, false, true, true, true, true, '["白板或大張紙", "白板筆或馬克筆", "小紙條"]', '["將預計讓學生猜的單字或句子寫在小紙條上", "分組進行，每組派一人抽取紙條", "用畫圖（Pictionary）或肢體動作（Charades）的方式讓組員猜出內容", "最快猜對的組別得分"]', '2023-12-28T11:00:00.000Z', '2023-12-28T11:00:00.000Z');

INSERT INTO game_methods (id, title, description, categories, grade1, grade2, grade3, grade4, grade5, grade6, materials, instructions, created_at, updated_at) 
VALUES ('10', 'Sentence Scramble (句子重組)', '練習句型結構，理解詞序。', '["句型練習"]', false, false, true, true, true, true, '["紙", "剪刀"]', '["將完整句子寫在紙上，然後剪成一個個單字卡", "將打亂的單字卡分給各組或個人", "讓他們在限時內排成正確的句子", "3年級可使用主謂賓結構的簡單句，5-6年級可加入形容詞、副詞等"]', '2023-12-26T14:00:00.000Z', '2023-12-26T14:00:00.000Z');
