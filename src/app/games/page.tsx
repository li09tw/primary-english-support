"use client";

import { useState, useEffect } from "react";
import GameMethodCard from "@/components/GameMethodCard";
import { GameMethod } from "@/types";
import { generateId } from "@/lib/utils";

// 暫時保留範例遊戲方法（不再作為 fallback 使用）
const sampleGames: any[] = [
  {
    id: "1",
    title: "單字配對遊戲",
    description:
      "透過配對卡片的方式，讓學生學習英語單字，提升記憶力和理解能力。",
    categories: ["單字學習"],
    grades: ["grade1"],
    materials: ["單字卡片", "計時器"],
    instructions: [
      "準備多組單字卡片，每組包含英文單字和對應的中文意思",
      "將卡片打亂，背面朝上排列",
      "學生輪流翻開兩張卡片，如果配對成功則保留，失敗則翻回",
      "遊戲結束時，配對成功最多的學生獲勝",
    ],
    createdAt: new Date("2024-01-15T09:00:00"),
    updatedAt: new Date("2024-01-15T09:00:00"),
  },
  {
    id: "2",
    title: "句型接龍",
    description: "學生輪流說出符合特定句型的句子，訓練口語表達和語法運用能力。",
    categories: ["句型練習"],
    grades: ["grade2"],
    materials: ["句型提示卡", "計分板"],
    instructions: [
      "教師提供一個句型模板，例如：I like to...",
      "學生輪流完成句子，如：I like to read books",
      "每個學生說完後，下一個學生必須說出不同的內容",
      "無法完成或重複內容的學生扣分",
    ],
    createdAt: new Date("2024-01-12T14:30:00"),
    updatedAt: new Date("2024-01-12T14:30:00"),
  },
  {
    id: "3",
    title: "角色扮演對話",
    description: "學生扮演不同角色進行英語對話，練習日常用語和情境表達。",
    categories: ["口語訓練"],
    grades: ["grade3"],
    materials: ["角色卡片", "情境設定"],
    instructions: [
      "教師設定對話情境，如：在餐廳點餐",
      "分配角色給學生，如：服務生、顧客",
      "學生根據角色進行英語對話",
      "鼓勵學生使用學過的單字和句型",
    ],
    createdAt: new Date("2024-01-10T11:15:00"),
    updatedAt: new Date("2024-01-10T11:15:00"),
  },
  // 整合教學輔具內容
  {
    id: "4",
    title: "動物單字學習卡",
    description:
      "包含常見動物的英文單字和圖片，幫助學生學習動物相關的英語詞彙。",
    categories: ["單字學習", "教學輔具"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["動物圖片卡", "單字卡", "音檔"],
    instructions: [
      "展示動物圖片，讓學生說出中文名稱",
      "教導對應的英文單字發音",
      "進行單字配對練習",
      "播放音檔讓學生跟讀",
    ],
    createdAt: new Date("2024-01-08T10:00:00"),
    updatedAt: new Date("2024-01-08T10:00:00"),
  },
  {
    id: "5",
    title: "顏色句型練習板",
    description:
      '透過顏色主題練習基本句型，如 "What color is it?" 和 "It is..."。',
    categories: ["句型練習", "教學輔具"],
    grades: ["grade2", "grade3"],
    materials: ["顏色卡片", "句型提示板", "互動白板"],
    instructions: [
      "展示不同顏色的物品",
      "教師示範句型：What color is it?",
      "學生回答：It is red/blue/green...",
      "進行角色互換練習",
    ],
    createdAt: new Date("2024-01-05T16:00:00"),
    updatedAt: new Date("2024-01-05T16:00:00"),
  },
  {
    id: "6",
    title: "日常對話情境卡",
    description: "模擬真實生活情境的對話練習，提升學生的口語表達能力。",
    categories: ["口語訓練", "教學輔具"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["情境設定卡", "角色扮演道具", "對話腳本"],
    instructions: [
      "設定對話情境，如：在商店購物",
      "分配角色：店員、顧客",
      "學生根據腳本進行對話練習",
      "鼓勵學生自由發揮和表達",
    ],
    createdAt: new Date("2024-01-03T12:00:00"),
    updatedAt: new Date("2024-01-03T12:00:00"),
  },
  // 新增教育從業人員的遊戲提案
  {
    id: "7",
    title: "Simon Says (老師說)",
    description: "訓練聽力理解，熟悉動作指令及身體部位詞彙。",
    categories: ["口語訓練", "聽力練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師下指令，如果指令前有說 'Simon says'，學生就要照做",
      "如果沒有說，學生就不動",
      "做錯或動作者出局",
      "3年級可從簡單的動作詞彙開始，5-6年級可增加複雜度",
    ],
    createdAt: new Date("2024-01-01T09:00:00"),
    updatedAt: new Date("2024-01-01T09:00:00"),
  },
  {
    id: "8",
    title: "Word Bingo (單字賓果)",
    description: "鞏固單字記憶與辨識能力。",
    categories: ["單字學習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["紙", "筆"],
    instructions: [
      "事先準備好要學習的單字列表",
      "讓學生在紙上畫出九宮格或十六宮格，並將單字填入格中",
      "老師念單字，學生聽到後在賓果格中找到對應單字並畫記",
      "最快連成一線（橫、豎、斜）者喊 'Bingo!' 獲勝",
    ],
    createdAt: new Date("2023-12-30T10:00:00"),
    updatedAt: new Date("2023-12-30T10:00:00"),
  },
  {
    id: "9",
    title: "Pictionary / Charades (你畫我猜 / 肢體表達)",
    description: "透過視覺或肢體表達來理解和運用單字、片語或簡單句子。",
    categories: ["口語訓練", "單字學習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["白板或大張紙", "白板筆或馬克筆", "小紙條"],
    instructions: [
      "將預計讓學生猜的單字或句子寫在小紙條上",
      "分組進行，每組派一人抽取紙條",
      "用畫圖（Pictionary）或肢體動作（Charades）的方式讓組員猜出內容",
      "最快猜對的組別得分",
    ],
    createdAt: new Date("2023-12-28T11:00:00"),
    updatedAt: new Date("2023-12-28T11:00:00"),
  },
  {
    id: "10",
    title: "Sentence Scramble (句子重組)",
    description: "練習句型結構，理解詞序。",
    categories: ["句型練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["紙", "剪刀"],
    instructions: [
      "將完整句子寫在紙上，然後剪成一個個單字卡",
      "將打亂的單字卡分給各組或個人",
      "讓他們在限時內排成正確的句子",
      "3年級可使用主謂賓結構的簡單句，5-6年級可加入形容詞、副詞等",
    ],
    createdAt: new Date("2023-12-26T14:00:00"),
    updatedAt: new Date("2023-12-26T14:00:00"),
  },
  {
    id: "11",
    title: "Story Chain (故事接龍)",
    description: "培養口語表達能力、邏輯思考與創造力，鼓勵學生用英語連貫敘述。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師先說故事的開頭，例如 'Once upon a time, there was a little girl and a big bear.'",
      "然後由下一位學生接一句，依序輪流說下去",
      "共同編織一個完整的故事",
      "3年級可以一句話接一句話的簡單模式，5-6年級可要求更豐富的細節",
    ],
    createdAt: new Date("2023-12-24T10:00:00"),
    updatedAt: new Date("2023-12-24T10:00:00"),
  },
  {
    id: "12",
    title: "Flashcard Slap (閃卡拍拍樂)",
    description: "快速辨識單字，提升反應力。",
    categories: ["單字學習"],
    grades: ["grade1", "grade2", "grade3", "grade4", "grade5", "grade6"],
    materials: ["閃卡（可自行繪製或列印）"],
    instructions: [
      "將數張閃卡攤開放在桌上或地上",
      "老師念出其中一張閃卡上的單字",
      "學生聽到後快速用手拍打對應的閃卡",
      "最快拍到且正確者得分",
    ],
    createdAt: new Date("2023-12-22T11:00:00"),
    updatedAt: new Date("2023-12-22T11:00:00"),
  },
  {
    id: "13",
    title: "Q&A Ball Toss (問答傳球)",
    description: "練習問答句型，提升口語流暢度。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["一顆軟球"],
    instructions: [
      "一位學生問一個問題，然後將球傳給另一位學生",
      "接到球的學生必須回答問題，並再問一個新問題給下一個人",
      "3年級可練習 'What's your name?' 'How old are you?' 等",
      "5-6年級可設計更複雜的時態或情境問題",
    ],
    createdAt: new Date("2023-12-20T14:00:00"),
    updatedAt: new Date("2023-12-20T14:00:00"),
  },
  {
    id: "14",
    title: "Hangman (吊死鬼)",
    description: "練習字母拼寫，加強單字記憶。",
    categories: ["單字學習", "拼寫練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["白板或紙", "筆"],
    instructions: [
      "老師想一個單字，在白板上畫出與單字字母數相同數量的底線",
      "學生輪流猜字母，如果猜對，老師就把字母填到底線上方",
      "如果猜錯，就畫一筆吊死鬼的圖案",
      "在吊死鬼圖案完成前猜中單字則獲勝",
    ],
    createdAt: new Date("2023-12-18T10:00:00"),
    updatedAt: new Date("2023-12-18T10:00:00"),
  },
  {
    id: "15",
    title: "Memory Game (記憶配對)",
    description: "訓練記憶力，配對單字與圖片/中文意思。",
    categories: ["單字學習"],
    grades: ["grade1", "grade2", "grade3", "grade4", "grade5", "grade6"],
    materials: ["紙", "筆", "剪刀 (自製配對卡)"],
    instructions: [
      "製作兩套卡片，一套是單字，一套是搭配的圖片或中文意思",
      "將所有卡片反面朝上散放",
      "學生輪流翻開兩張卡片，如果兩張卡片內容配對成功則拿走",
      "如果沒有配對成功，就將卡片翻回原位，獲得最多配對的學生獲勝",
    ],
    createdAt: new Date("2023-12-16T11:00:00"),
    updatedAt: new Date("2023-12-16T11:00:00"),
  },
  {
    id: "16",
    title: "Role Play (情境扮演)",
    description: "在模擬真實情境中練習英語對話，提升口語流暢度與自信。",
    categories: ["口語訓練"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["簡單道具（如紙筆自製菜單、空盒子當商品等）"],
    instructions: [
      "設定情境、分配角色，並提供一些關鍵詞彙或句型提示",
      "學生分組扮演不同角色，根據情境進行英語對話",
      "3年級可從簡單的打招呼、介紹自己開始",
      "5-6年級可扮演在餐廳點餐、商店購物、問路等情境",
    ],
    createdAt: new Date("2023-12-14T14:00:00"),
    updatedAt: new Date("2023-12-14T14:00:00"),
  },
  // AI 遊戲提案
  {
    id: "17",
    title: "What Am I? Guessing Game (我是誰？猜猜看)",
    description: "練習描述性詞彙和疑問句型，訓練邏輯推理。",
    categories: ["口語訓練", "單字學習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "一位學生在心中想一個單字（名詞）",
      "其他學生輪流提問（例如 'Are you big?', 'Can you fly?'）",
      "想單字的學生只能回答 'Yes' 或 'No'",
      "直到有人猜對",
    ],
    createdAt: new Date("2023-12-12T10:00:00"),
    updatedAt: new Date("2023-12-12T10:00:00"),
  },
  {
    id: "18",
    title: "Vocabulary Categorization Race (單字分類競賽)",
    description: "訓練單字歸類能力，擴展詞彙廣度。",
    categories: ["單字學習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["紙", "筆", "或預先寫好單字的紙條"],
    instructions: [
      "在白板或大張紙上寫好幾個分類標題",
      "老師唸出或寫出單字，學生需快速判斷並將單字歸入正確的類別",
      "可分組競賽，看哪組分類最快且正確",
      "3年級可分為「食物」、「動物」等大類，5-6年級可增加更多元分類",
    ],
    createdAt: new Date("2023-12-10T11:00:00"),
    updatedAt: new Date("2023-12-10T11:00:00"),
  },
  {
    id: "19",
    title: "Phonics Sound Hunt (發音尋寶)",
    description: "強化自然發音意識，提升聽音辨字能力。",
    categories: ["單字學習", "發音練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師說出一個發音（例如：/ae/ 的音，如 apple 的 'a'）",
      "學生在教室或書本中找出含有此發音的單字並大聲唸出來",
      "3年級可專注於單字母或常見二合字母發音",
      "5-6年級可增加複合音或不規則發音",
    ],
    createdAt: new Date("2023-12-08T14:00:00"),
    updatedAt: new Date("2023-12-08T14:00:00"),
  },
  {
    id: 20,
    title: "Sentence Completion Race (句子填空競賽)",
    description: "練習句型應用，鼓勵學生發揮創造力。",
    categories: ["句型練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["白板或紙", "筆"],
    instructions: [
      "老師準備一些不完整的句子開頭",
      "老師寫下一個句子開頭（例如：'I like to eat...', 'If I were a bird...'）",
      "學生在限時內完成句子，越有創意或符合文法者得分",
      "3年級填入簡單單字，5-6年級可要求填入片語或完整子句",
    ],
    createdAt: new Date("2023-12-06T10:00:00"),
    updatedAt: new Date("2023-12-06T10:00:00"),
  },
  {
    id: 21,
    title: "Rhyming Word Challenge (押韻單字挑戰)",
    description: "提升對單字發音規律的認知，擴展押韻詞彙。",
    categories: ["單字學習", "發音練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師說一個單字（例如：'ball'）",
      "學生輪流說出與該單字押韻的其他單字（例如：'tall', 'small', 'wall'）",
      "直到有人說不出來為止",
      "3年級可從簡單的 CVC 單字開始，5-6年級可挑戰更多音節或不規則押韻",
    ],
    createdAt: new Date("2023-12-04T11:00:00"),
    updatedAt: new Date("2023-12-04T11:00:00"),
  },
  {
    id: 22,
    title: "Find Someone Who... Bingo (找找看誰是...)",
    description: "鼓勵學生用英語進行口語交流，練習提問。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["事先設計好的賓果表格（紙）"],
    instructions: [
      "設計賓果表格，每格寫上一個條件（例如：'Find someone who likes pizza.'）",
      "學生拿著表格在教室內自由走動，問同學問題",
      "找到符合條件的同學在該格簽名",
      "最快連成一線者獲勝",
    ],
    createdAt: new Date("2023-12-02T14:00:00"),
    updatedAt: new Date("2023-12-02T14:00:00"),
  },
  {
    id: 23,
    title: "Descriptive Storytelling (描述性說故事)",
    description: "訓練學生運用形容詞和副詞，提升故事細節描述能力。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["隨機圖片或簡單物品"],
    instructions: [
      "準備一些圖片或隨機物品（例如：一個蘋果、一支筆、一個玩具車）",
      "老師展示一張圖片或物品",
      "學生輪流用英文描述它的特徵（顏色、形狀、材質、感覺等）",
      "並可以將這些描述串聯成一個小故事",
    ],
    createdAt: new Date("2023-11-30T10:00:00"),
    updatedAt: new Date("2023-11-30T10:00:00"),
  },
  {
    id: 24,
    title: "Word Association (單字聯想)",
    description: "訓練詞彙連結能力，提升快速反應和思維敏捷度。",
    categories: ["單字學習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師說一個單字（例如：'school'）",
      "下一位學生必須說出與之相關的單字（例如：'teacher', 'book', 'classroom'）",
      "依序接龍，直到有人說不出相關單字為止",
      "3年級可做簡單的同類聯想，5-6年級可做多層次或跨類別聯想",
    ],
    createdAt: new Date("2023-11-28T11:00:00"),
    updatedAt: new Date("2023-11-28T11:00:00"),
  },
  {
    id: 25,
    title: "Simple Debate/Opinion Sharing (簡單辯論/意見分享)",
    description: "練習表達個人觀點，提升說服性語言和口語自信。",
    categories: ["口語訓練"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "準備一些簡單但具爭議性的議題（例如：'Cats are better than dogs.'）",
      "學生分組或個人，針對給定的議題表達自己的看法",
      "並試圖用英語支持自己的論點",
      "需要一定的口語表達能力",
    ],
    createdAt: new Date("2023-11-26T14:00:00"),
    updatedAt: new Date("2023-11-26T14:00:00"),
  },
  {
    id: 26,
    title: "Hot Seat (熱座問答)",
    description: "強化口語表達、聽力理解和快速反應能力。",
    categories: ["口語訓練", "聽力練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["一張椅子"],
    instructions: [
      "一位學生坐在教室前面，背對白板",
      "老師在白板上寫一個單字或貼一張圖片",
      "其他學生提供線索或提問（不能直接說出單字）",
      "坐在熱座上的學生根據線索猜出答案",
    ],
    createdAt: new Date("2023-11-24T10:00:00"),
    updatedAt: new Date("2023-11-24T10:00:00"),
  },
  // 以下是新增的遊戲提案，共計73個，使得總數達到100個。
  {
    id: 27,
    title: "Sentence Transformation (句子變換)",
    description: "練習不同句型和時態的轉換，理解語法結構。",
    categories: ["句型練習", "寫作練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["練習紙", "筆"],
    instructions: [
      "老師給出一個句子，並指定變換要求（例如：將肯定句變否定句，或現在式變過去式）",
      "學生根據要求改寫句子",
      "可分組競賽，看哪組變換得又快又正確",
    ],
    createdAt: new Date("2023-11-22T10:00:00"),
    updatedAt: new Date("2023-11-22T10:00:00"),
  },
  {
    id: 28,
    title: "Whisper Challenge (悄悄話挑戰)",
    description: "訓練聽力理解和口語傳達的準確性。",
    categories: ["聽力練習", "口語訓練"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "學生排成一列或一圈",
      "第一位學生悄悄地在下一位學生的耳邊說一個單字或句子",
      "依序傳下去，最後一位學生大聲說出他聽到的內容",
      "看內容是否與原始訊息一致",
    ],
    createdAt: new Date("2023-11-20T11:00:00"),
    updatedAt: new Date("2023-11-20T11:00:00"),
  },
  {
    id: 29,
    title: "Picture Description Race (看圖說話競賽)",
    description: "提升口語描述能力和詞彙運用能力。",
    categories: ["口語訓練", "單字學習"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["圖片卡片（情境圖或單一物品圖）"],
    instructions: [
      "老師展示一張圖片",
      "學生輪流用英語描述圖片內容",
      "可設定時間限制，看誰在時間內能說出最多相關詞彙或句子",
    ],
    createdAt: new Date("2023-11-18T14:00:00"),
    updatedAt: new Date("2023-11-18T14:00:00"),
  },
  {
    id: 30,
    title: "Tongue Twisters Challenge (繞口令挑戰)",
    description: "練習發音和語速，提升口語流暢度。",
    categories: ["發音練習", "口語訓練"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["繞口令文本"],
    instructions: [
      "老師提供繞口令文本",
      "學生輪流嘗試快速且清晰地念出繞口令",
      "可進行分組或個人計時，看誰念得最快且錯誤最少",
    ],
    createdAt: new Date("2023-11-16T10:00:00"),
    updatedAt: new Date("2023-11-16T10:00:00"),
  },
  {
    id: 31,
    title: "Listen and Draw (聽音繪圖)",
    description: "訓練聽力理解，將聽到的指令轉化為視覺圖像。",
    categories: ["聽力練習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["白紙", "彩色筆"],
    instructions: [
      "老師口頭描述一個簡單的場景或物品（例如：'Draw a big red apple on the table.'）",
      "學生根據老師的描述繪圖",
      "完成後可互相展示，比較繪圖是否符合描述",
    ],
    createdAt: new Date("2023-11-14T11:00:00"),
    updatedAt: new Date("2023-11-14T11:00:00"),
  },
  {
    id: 32,
    title: "Spelling Bee (拼字大賽)",
    description: "強化單字拼寫能力和聽力理解。",
    categories: ["拼寫練習", "單字學習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["單字列表"],
    instructions: [
      "老師念出一個單字",
      "學生輪流口頭拼寫該單字",
      "拼錯的學生出局，直到剩下最後一位獲勝者",
    ],
    createdAt: new Date("2023-11-12T14:00:00"),
    updatedAt: new Date("2023-11-12T14:00:00"),
  },
  {
    id: 33,
    title: "Guess the Word from Definition (看定義猜單字)",
    description: "透過定義理解單字，提升詞彙聯想能力。",
    categories: ["單字學習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["單字定義列表"],
    instructions: [
      "老師念出一個單字的英文定義",
      "學生根據定義猜出對應的單字",
      "最快猜對者得分，可分組進行",
    ],
    createdAt: new Date("2023-11-10T10:00:00"),
    updatedAt: new Date("2023-11-10T10:00:00"),
  },
  {
    id: 34,
    title: "Grammar Race (文法競賽)",
    description: "鞏固語法知識，提高句子正確性。",
    categories: ["句型練習", "寫作練習"],
    grades: ["grade5", "grade6"],
    materials: ["含有語法錯誤的句子", "白板或紙"],
    instructions: [
      "老師寫出或念出一個含有語法錯誤的句子",
      "學生找出並改正錯誤",
      "最快找出並改正正確的學生得分",
    ],
    createdAt: new Date("2023-11-08T11:00:00"),
    updatedAt: new Date("2023-11-08T11:00:00"),
  },
  {
    id: 35,
    title: "Musical Chairs with Questions (搶椅子問答)",
    description: "結合肢體活動和口語練習，增加課堂趣味性。",
    categories: ["口語訓練", "聽力練習"],
    grades: ["grade1", "grade2", "grade3", "grade4"],
    materials: ["椅子", "音樂播放器", "問題卡片"],
    instructions: [
      "擺放比學生人數少一張的椅子，播放音樂讓學生繞著椅子走",
      "音樂停止時，學生搶椅子坐下",
      "沒有搶到椅子的學生抽取問題卡片，並用英語回答問題",
      "答對可繼續參與下一輪，答錯則出局",
    ],
    createdAt: new Date("2023-11-06T14:00:00"),
    updatedAt: new Date("2023-11-06T14:00:00"),
  },
  {
    id: 36,
    title: "Homophone Challenge (同音異義字挑戰)",
    description: "區分發音相同但意義和拼寫不同的單字，提升詞彙辨識度。",
    categories: ["單字學習", "拼寫練習", "發音練習"],
    grades: ["grade5", "grade6"],
    materials: ["同音異義字列表"],
    instructions: [
      "老師說出一個同音異義字組中的一個單字（例如：'see'）",
      "學生必須說出另一個同音異義字（例如：'sea'），並解釋其意義",
      "可分組進行，答對者得分",
    ],
    createdAt: new Date("2023-11-04T10:00:00"),
    updatedAt: new Date("2023-11-04T10:00:00"),
  },
  {
    id: 37,
    title: "Adjective Story (形容詞故事)",
    description: "練習使用形容詞來豐富句子和故事，提升寫作和口語表達能力。",
    categories: ["句型練習", "口語訓練", "寫作練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師提供一個名詞或簡單的句子開頭",
      "學生輪流添加形容詞來描述或延伸句子，共同編織一個充滿細節的故事",
      "例如：'The cat...' -> 'The *fluffy* cat...' -> 'The *fluffy, lazy* cat...' -> 'The *fluffy, lazy, orange* cat *slept*...'",
    ],
    createdAt: new Date("2023-11-02T11:00:00"),
    updatedAt: new Date("2023-11-02T11:00:00"),
  },
  {
    id: 38,
    title: "Listen for Details (聽力細節捕捉)",
    description: "訓練學生捕捉聽力材料中的關鍵信息。",
    categories: ["聽力練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["短篇英文故事或對話音檔", "問題清單"],
    instructions: [
      "老師播放一段短音檔（故事或對話）",
      "學生聽完後回答老師提出的關於內容細節的問題",
      "可多次播放，鼓勵學生做筆記",
    ],
    createdAt: new Date("2023-10-31T14:00:00"),
    updatedAt: new Date("2023-10-31T14:00:00"),
  },
  {
    id: 39,
    title: "Categorization Race (分類競賽)",
    description: "快速分類物品或單字，培養邏輯思考和詞彙應用能力。",
    categories: ["單字學習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["多種物品或圖片卡片", "分類箱/板"],
    instructions: [
      "準備不同類別的物品或圖片卡片（如：食物、動物、交通工具）",
      "老師喊出一個類別，學生需快速將屬於該類別的物品放進對應的箱子或貼在板上",
      "最快且正確完成者獲勝",
    ],
    createdAt: new Date("2023-10-29T10:00:00"),
    updatedAt: new Date("2023-10-29T10:00:00"),
  },
  {
    id: 40,
    title: "Question Chain (問題接龍)",
    description: "練習提問和回答句型，提升口語互動能力。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["無"],
    instructions: [
      "第一位學生問一個問題",
      "第二位學生回答問題，然後再問一個新問題給下一位學生",
      "依序進行，鼓勵使用不同類型的疑問句",
    ],
    createdAt: new Date("2023-10-27T11:00:00"),
    updatedAt: new Date("2023-10-27T11:00:00"),
  },
  {
    id: 41,
    title: "Guess the Action (猜動作)",
    description: "透過肢體動作理解和表達動詞詞彙。",
    categories: ["單字學習", "口語訓練"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["動作動詞卡片"],
    instructions: [
      "一位學生抽取一張動作動詞卡片，但不能說出上面的字",
      "學生用肢體表演卡片上的動作",
      "其他學生猜測是什麼動作，並用英語說出動詞",
    ],
    createdAt: new Date("2023-10-25T14:00:00"),
    updatedAt: new Date("2023-10-25T14:00:00"),
  },
  {
    id: 42,
    title: "Create a Commercial (創作廣告)",
    description: "鼓勵學生運用所學詞彙和句型，創造性地表達。",
    categories: ["口語訓練", "寫作練習"],
    grades: ["grade5", "grade6"],
    materials: ["隨機物品", "筆", "紙"],
    instructions: [
      "學生分組，每組分配一個隨機物品（或自選）",
      "小組需要為這個物品設計一個英文廣告，包含名稱、特點、廣告詞等",
      "最後各組上台發表他們的廣告",
    ],
    createdAt: new Date("2023-10-23T10:00:00"),
    updatedAt: new Date("2023-10-23T10:00:00"),
  },
  {
    id: 43,
    title: "Silent Reading Race (默讀競賽)",
    description: "提升閱讀速度和理解能力。",
    categories: ["閱讀練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["短篇英文閱讀材料", "問題清單", "計時器"],
    instructions: [
      "老師提供一段閱讀材料和相關問題",
      "學生在限時內默讀並回答問題",
      "以閱讀速度和答案正確率綜合評分",
    ],
    createdAt: new Date("2023-10-21T11:00:00"),
    updatedAt: new Date("2023-10-21T11:00:00"),
  },
  {
    id: 44,
    title: "Verb Tense Challenge (動詞時態挑戰)",
    description: "練習動詞時態的正確使用，鞏固語法知識。",
    categories: ["句型練習", "寫作練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["動詞列表", "句子卡片"],
    instructions: [
      "老師提供一個動詞和指定的時態",
      "學生需用該動詞和時態造句",
      "或提供一個句子，學生需將動詞變換為正確的時態",
    ],
    createdAt: new Date("2023-10-19T14:00:00"),
    updatedAt: new Date("2023-10-19T14:00:00"),
  },
  {
    id: 45,
    title: "Picture Dictionary Creation (圖片字典製作)",
    description: "結合視覺和文字，加強單字記憶和理解。",
    categories: ["單字學習", "寫作練習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["圖畫紙", "彩色筆", "剪刀", "膠水"],
    instructions: [
      "學生選擇或畫出一個物品的圖片",
      "然後在圖片下方寫上對應的英文單字",
      "鼓勵製作成一本個人化的圖片字典，或組合成班級字典",
    ],
    createdAt: new Date("2023-10-17T10:00:00"),
    updatedAt: new Date("2023-10-17T10:00:00"),
  },
  {
    id: 46,
    title: "Would You Rather? (你寧願...？)",
    description: "練習表達個人選擇和解釋原因，提升口語流暢度。",
    categories: ["口語訓練"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["問題卡片"],
    instructions: [
      "老師提出 'Would you rather...or...?' 的問題（例如：'Would you rather fly or be invisible?'）",
      "學生選擇其中一個選項，並用英語解釋原因",
      "鼓勵學生互動討論",
    ],
    createdAt: new Date("2023-10-15T11:00:00"),
    updatedAt: new Date("2023-10-15T11:00:00"),
  },
  {
    id: 47,
    title: "Preposition Hunt (介詞尋寶)",
    description: "練習介詞的正確使用，理解其在句子中的作用。",
    categories: ["句型練習"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["物品", "介詞提示卡"],
    instructions: [
      "老師放置一些物品在教室的各個位置",
      "老師說出一個介詞，例如 'on'",
      "學生需要找到一個物品，並用英語說出包含該介詞的句子（例如：'The book is on the table.'）",
    ],
    createdAt: new Date("2023-10-13T14:00:00"),
    updatedAt: new Date("2023-10-13T14:00:00"),
  },
  {
    id: 48,
    title: "Opposites Match (反義詞配對)",
    description: "學習反義詞，擴展詞彙量和語義理解。",
    categories: ["單字學習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["反義詞卡片組"],
    instructions: [
      "準備兩組卡片，一組寫著單字，另一組寫著其反義詞",
      "將卡片打亂，學生輪流翻開兩張，找出反義詞配對",
      "配對成功者保留卡片，最多者獲勝",
    ],
    createdAt: new Date("2023-10-11T10:00:00"),
    updatedAt: new Date("2023-10-11T10:00:00"),
  },
  {
    id: 49,
    title: "Daily Routine Presentation (日常作息發表)",
    description: "練習描述個人日常作息，運用時間表達和動詞詞彙。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["白板或紙", "筆"],
    instructions: [
      "學生準備關於自己日常作息的簡單英文描述",
      "輪流上台或分組分享他們的日常作息",
      "鼓勵使用如 'first', 'then', 'after that' 等連接詞",
    ],
    createdAt: new Date("2023-10-09T11:00:00"),
    updatedAt: new Date("2023-10-09T11:00:00"),
  },
  {
    id: 50,
    title: "Crossword Puzzle Creation (填字遊戲創作)",
    description: "強化單字拼寫和定義理解能力。",
    categories: ["單字學習", "拼寫練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["格線紙", "筆"],
    instructions: [
      "學生選擇一定數量的單字，並為每個單字寫出一個簡短的英文定義",
      "然後將這些單字設計成一個填字遊戲",
      "可互相交換完成彼此的填字遊戲",
    ],
    createdAt: new Date("2023-10-07T14:00:00"),
    updatedAt: new Date("2023-10-07T14:00:00"),
  },
  {
    id: 51,
    title: "Weather Report (天氣預報)",
    description: "學習天氣相關詞彙和句型，練習口語表達。",
    categories: ["口語訓練", "單字學習"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["天氣圖片", "白板"],
    instructions: [
      "老師展示不同天氣的圖片或圖示",
      "學生輪流扮演天氣預報員，用英語描述當地的天氣狀況和預測",
      "鼓勵使用 'It's sunny today.', 'It will be rainy tomorrow.' 等句型",
    ],
    createdAt: new Date("2023-10-05T10:00:00"),
    updatedAt: new Date("2023-10-05T10:00:00"),
  },
  {
    id: 52,
    title: "Picture Prompts Story (看圖說故事)",
    description: "激發想像力，練習口語敘事和連接詞使用。",
    categories: ["口語訓練", "寫作練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["一系列相關圖片"],
    instructions: [
      "老師準備一系列有連貫性的圖片",
      "學生根據圖片順序，用英語講述一個完整的故事",
      "可個人或小組合作",
    ],
    createdAt: new Date("2023-10-03T11:00:00"),
    updatedAt: new Date("2023-10-03T11:00:00"),
  },
  {
    id: 53,
    title: "Sing English Songs (唱英文歌)",
    description: "透過歌曲學習單字、句型和發音，提升學習興趣。",
    categories: ["聽力練習", "發音練習", "單字學習"],
    grades: ["grade1", "grade2", "grade3", "grade4", "grade5", "grade6"],
    materials: ["英文歌曲音檔", "歌詞"],
    instructions: [
      "老師播放英文歌曲，學生跟唱",
      "可利用歌詞講解單字和句型",
      "或進行卡拉OK挑戰，看誰唱得好",
    ],
    createdAt: new Date("2023-10-01T14:00:00"),
    updatedAt: new Date("2023-10-01T14:00:00"),
  },
  {
    id: 54,
    title: "What's Missing? (少了什麼？)",
    description: "訓練觀察力、記憶力以及物品單字記憶。",
    categories: ["單字學習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["多種小物品", "布或紙覆蓋"],
    instructions: [
      "老師將數個小物品放在桌上，讓學生記住",
      "用布或紙蓋住物品，然後偷偷拿走其中一個",
      "移開覆蓋物後，學生用英語說出少了哪個物品",
    ],
    createdAt: new Date("2023-09-29T10:00:00"),
    updatedAt: new Date("2023-09-29T10:00:00"),
  },
  {
    id: 55,
    title: "Conjunction Chain (連接詞接龍)",
    description: "練習使用連接詞來連接句子，提升語句連貫性。",
    categories: ["句型練習", "寫作練習"],
    grades: ["grade5", "grade6"],
    materials: ["連接詞列表"],
    instructions: [
      "老師先說一個簡單的句子",
      "下一位學生使用一個連接詞（如 'and', 'but', 'because'）來連接並擴展句子",
      "依序接龍，共同創造一個長故事或解釋",
    ],
    createdAt: new Date("2023-09-27T11:00:00"),
    updatedAt: new Date("2023-09-27T11:00:00"),
  },
  {
    id: 56,
    title: "If I Were... (如果我是...)",
    description: "練習假設語氣，激發想像力，提升口語表達。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師給出一個假設性情境（例如：'If I were an animal...'）",
      "學生輪流用英語完成句子，並說明原因（例如：'If I were an animal, I would be a bird because I like to fly.'）",
    ],
    createdAt: new Date("2023-09-25T14:00:00"),
    updatedAt: new Date("2023-09-25T14:00:00"),
  },
  {
    id: 57,
    title: "Sentence Dictation (句子聽寫)",
    description: "訓練聽力理解和拼寫能力。",
    categories: ["聽力練習", "拼寫練習", "寫作練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["預先準備好的句子", "紙", "筆"],
    instructions: [
      "老師念出一個句子，語速適中，可重複",
      "學生將聽到的句子寫在紙上",
      "完成後進行批改，檢查聽寫和拼寫的正確性",
    ],
    createdAt: new Date("2023-09-23T10:00:00"),
    updatedAt: new Date("2023-09-23T10:00:00"),
  },
  {
    id: 58,
    title: "Flashcard Dictation (閃卡聽寫)",
    description: "結合視覺和聽覺，加強單字記憶和拼寫。",
    categories: ["單字學習", "拼寫練習", "聽力練習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["閃卡", "紙", "筆"],
    instructions: [
      "老師展示一張閃卡，然後說出上面的單字",
      "學生將聽到的單字寫下來",
      "之後翻開閃卡，核對拼寫是否正確",
    ],
    createdAt: new Date("2023-09-21T11:00:00"),
    updatedAt: new Date("2023-09-21T11:00:00"),
  },
  {
    id: 59,
    title: "Tell Me About It (說說看)",
    description: "訓練學生口語表達能力，描述日常生活中的事物。",
    categories: ["口語訓練"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["無"],
    instructions: [
      "老師指定一個主題（例如：'Tell me about your favorite toy.' 或 'Tell me about your family.'）",
      "學生輪流用英語描述該主題",
      "鼓勵其他學生提問",
    ],
    createdAt: new Date("2023-09-19T14:00:00"),
    updatedAt: new Date("2023-09-19T14:00:00"),
  },
  {
    id: 60,
    title: "Fill in the Blanks (句子填空)",
    description: "練習詞彙和語法運用，鞏固句型結構。",
    categories: ["句型練習", "單字學習", "寫作練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["填空練習紙", "筆"],
    instructions: [
      "老師提供一些含有空格的句子，並給出選項或讓學生自由填寫",
      "學生需選擇正確的單字或片語填入空格，使句子完整和符合語法",
      "可分組競賽，比速度和準確性",
    ],
    createdAt: new Date("2023-09-17T10:00:00"),
    updatedAt: new Date("2023-09-17T10:00:00"),
  },
  {
    id: 61,
    title: "Alphabet Race (字母競賽)",
    description: "快速辨識和說出英文字母，適合初學者。",
    categories: ["單字學習", "發音練習"],
    grades: ["grade1"],
    materials: ["字母卡片"],
    instructions: [
      "老師將字母卡片散開在地上",
      "老師念出一個字母，學生需快速拍打或撿起對應的字母卡片",
      "最快且正確者得分",
    ],
    createdAt: new Date("2023-09-15T11:00:00"),
    updatedAt: new Date("2023-09-15T11:00:00"),
  },
  {
    id: 62,
    title: "Yes/No Question Game (是非題遊戲)",
    description: "練習回答簡單的是非題，培養聽力理解。",
    categories: ["聽力練習", "口語訓練"],
    grades: ["grade1", "grade2"],
    materials: ["無"],
    instructions: [
      "老師問學生簡單的是非題（例如：'Is this a pen?' 指著筆）",
      "學生用 'Yes, it is.' 或 'No, it isn't.' 回答",
      "可增加挑戰，讓學生提問",
    ],
    createdAt: new Date("2023-09-13T14:00:00"),
    updatedAt: new Date("2023-09-13T14:00:00"),
  },
  {
    id: 63,
    title: "Picture Card Story (圖卡故事)",
    description: "利用圖卡刺激想像力，練習口語敘事。",
    categories: ["口語訓練"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["一組不相關的圖片卡片"],
    instructions: [
      "老師發給每位學生一張圖片卡片",
      "學生輪流用英語描述自己的圖片，然後嘗試將所有圖片串聯成一個故事",
      "鼓勵創意和邏輯連接",
    ],
    createdAt: new Date("2023-09-11T10:00:00"),
    updatedAt: new Date("2023-09-11T10:00:00"),
  },
  {
    id: 64,
    title: "Noun/Verb/Adjective Sort (名詞/動詞/形容詞分類)",
    description: "區分不同詞性，鞏固語法概念。",
    categories: ["單字學習", "句型練習"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["單字卡片", "分類標籤（Noun, Verb, Adjective）"],
    instructions: [
      "老師準備一些不同詞性的單字卡片",
      "學生將這些單字卡片分類到對應的詞性標籤下",
      "可分組進行，看哪組分類最快且正確",
    ],
    createdAt: new Date("2023-09-09T11:00:00"),
    updatedAt: new Date("2023-09-09T11:00:00"),
  },
  {
    id: 65,
    title: "Guess the Feeling (猜猜情緒)",
    description: "學習情緒相關詞彙，練習口語表達和非語言溝通。",
    categories: ["口語訓練", "單字學習"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["情緒圖片或表情卡片"],
    instructions: [
      "一位學生抽取一張情緒卡片，並用表情或肢體表演該情緒",
      "其他學生用英語猜測是什麼情緒（例如：'Are you happy?' 'You are sad.'）",
      "猜對者得分",
    ],
    createdAt: new Date("2023-09-07T14:00:00"),
    updatedAt: new Date("2023-09-07T14:00:00"),
  },
  {
    id: 66,
    title: "What's My Job? (我的工作是什麼？)",
    description: "學習職業相關詞彙，練習提問和描述。",
    categories: ["單字學習", "口語訓練"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["職業卡片"],
    instructions: [
      "一位學生抽取一張職業卡片，但不給其他學生看",
      "其他學生輪流提問關於這個職業的問題（例如：'Do you work in a hospital?', 'Do you wear a uniform?'）",
      "抽取卡片的學生只能回答 'Yes' 或 'No'",
      "直到有人猜對職業",
    ],
    createdAt: new Date("2023-09-05T10:00:00"),
    updatedAt: new Date("2023-09-05T10:00:00"),
  },
  {
    id: 67,
    title: "Command Game (指令遊戲)",
    description: "訓練聽力理解，熟悉動詞和簡單指令。",
    categories: ["聽力練習", "口語訓練"],
    grades: ["grade1", "grade2"],
    materials: ["無"],
    instructions: [
      "老師下達簡單的英文指令（例如：'Stand up!', 'Touch your nose!', 'Open your book!'）",
      "學生根據指令做出動作",
      "做錯或反應慢的學生出局",
    ],
    createdAt: new Date("2023-09-03T11:00:00"),
    updatedAt: new Date("2023-09-03T11:00:00"),
  },
  {
    id: 68,
    title: "Scavenger Hunt (尋寶遊戲)",
    description: "結合探索和語言學習，強化單字和聽力。",
    categories: ["單字學習", "聽力練習"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["物品清單", "小物品或圖片"],
    instructions: [
      "老師提供一個英文物品清單（或口頭指令）",
      "學生在教室內或指定區域尋找這些物品",
      "最快找到所有物品者獲勝",
    ],
    createdAt: new Date("2023-09-01T14:00:00"),
    updatedAt: new Date("2023-09-01T14:00:00"),
  },
  {
    id: 69,
    title: "Create a Rap/Chant (創作饒舌/歌謠)",
    description: "透過音樂和節奏學習單字、發音，激發創造力。",
    categories: ["發音練習", "單字學習", "口語訓練"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師給出一個主題或一組單字",
      "學生分組合作，為這些單字或主題創作一段英文饒舌或歌謠",
      "最後各組表演他們的廣告",
    ],
    createdAt: new Date("2023-08-30T10:00:00"),
    updatedAt: new Date("2023-08-30T10:00:00"),
  },
  {
    id: 70,
    title: "Who Am I? (我是誰？)",
    description: "練習人物描述性詞彙和提問，提升口語互動。",
    categories: ["口語訓練", "單字學習"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["人物卡片（歷史人物、卡通角色、名人等）"],
    instructions: [
      "一位學生額頭貼上一張人物卡片，自己看不到",
      "其他學生提問（例如：'Am I a man?', 'Am I famous?', 'Do I wear glasses?'）",
      "額頭貼卡片的學生根據回答猜測自己是誰",
    ],
    createdAt: new Date("2023-08-28T11:00:00"),
    updatedAt: new Date("2023-08-28T11:00:00"),
  },
  {
    id: 71,
    title: "Storytelling with Dice (骰子說故事)",
    description: "隨機性創作故事，練習口語敘事和連接詞。",
    categories: ["口語訓練", "寫作練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["骰子（或自製寫有單字的方塊）", "圖片或單字清單"],
    instructions: [
      "老師準備多個骰子，每個面寫上不同的單字（如：人物、地點、物品、動作）",
      "學生輪流擲骰子，根據擲出的單字即興編織故事",
      "鼓勵運用想像力串聯元素",
    ],
    createdAt: new Date("2023-08-26T14:00:00"),
    updatedAt: new Date("2023-08-26T14:00:00"),
  },
  {
    id: 72,
    title: "Sentence Building Blocks (句子積木)",
    description: "用積木方式組裝句子，直觀學習句型結構。",
    categories: ["句型練習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["寫有單字的積木或樂高積木"],
    instructions: [
      "準備寫有名詞、動詞、形容詞、介詞等單字的積木",
      "學生根據語法規則，將積木堆疊組合成正確的英文句子",
      "可增加顏色編碼來區分詞性",
    ],
    createdAt: new Date("2023-08-24T10:00:00"),
    updatedAt: new Date("2023-08-24T10:00:00"),
  },
  {
    id: 73,
    title: "Interview Game (採訪遊戲)",
    description: "練習提問和回答問題，提升口語交際能力。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["問題提示卡（可選）"],
    instructions: [
      "學生兩兩分組，一人扮演記者，一人扮演受訪者",
      "記者向受訪者提問各種問題（例如：關於興趣、家庭、學校生活等）",
      "受訪者用英語回答，並鼓勵互相交換角色",
    ],
    createdAt: new Date("2023-08-22T11:00:00"),
    updatedAt: new Date("2023-08-22T11:00:00"),
  },
  {
    id: 74,
    title: "Phonics Board Game (自然發音桌遊)",
    description: "透過遊戲方式鞏固自然發音規則。",
    categories: ["發音練習", "單字學習", "教學輔具"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["自製桌遊地圖", "棋子", "骰子", "發音卡片"],
    instructions: [
      "學生擲骰子移動棋子，到達不同格子會有不同任務",
      "任務可能是念出含有特定發音的單字，或辨識發音相同的圖片",
      "最先到達終點者獲勝",
    ],
    createdAt: new Date("2023-08-20T14:00:00"),
    updatedAt: new Date("2023-08-20T14:00:00"),
  },
  {
    id: 75,
    title: "Past Tense Charades (過去式比手畫腳)",
    description: "練習動詞過去式，結合肢體表達和語法。",
    categories: ["句型練習", "口語訓練"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["動詞過去式卡片"],
    instructions: [
      "學生抽取一張動詞過去式卡片，表演該動詞的動作",
      "其他學生猜測是什麼動作，並用過去式回答（例如：'You ate an apple.'）",
      "猜對者得分",
    ],
    createdAt: new Date("2023-08-18T10:00:00"),
    updatedAt: new Date("2023-08-18T10:00:00"),
  },
  {
    id: 76,
    title: "Word Search (單字尋找)",
    description: "練習單字辨識和拼寫，培養專注力。",
    categories: ["單字學習", "拼寫練習"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["單字尋找遊戲紙", "筆"],
    instructions: [
      "老師提供印有字母網格和單字列表的尋找遊戲紙",
      "學生在字母網格中找出列表中的單字並圈出來",
      "最快找到所有單字者獲勝",
    ],
    createdAt: new Date("2023-08-16T11:00:00"),
    updatedAt: new Date("2023-08-16T11:00:00"),
  },
  {
    id: 77,
    title: "Make a Menu (製作菜單)",
    description: "學習食物詞彙，練習情境對話和價格表達。",
    categories: ["單字學習", "口語訓練"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["紙", "筆", "彩色筆"],
    instructions: [
      "學生分組設計一個餐廳菜單，包含食物名稱和價格（用英語）",
      "然後進行角色扮演，一人點餐，一人服務，練習點餐對話",
    ],
    createdAt: new Date("2023-08-14T14:00:00"),
    updatedAt: new Date("2023-08-14T14:00:00"),
  },
  {
    id: 78,
    title: "Read Aloud Challenge (朗讀挑戰)",
    description: "提升發音、語調和閱讀流暢度。",
    categories: ["閱讀練習", "發音練習", "口語訓練"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["短篇英文故事或文章"],
    instructions: [
      "老師提供一段英文文本",
      "學生輪流或分組朗讀，老師和同學評分發音、語調和流暢度",
      "可錄音回放，幫助學生自我檢視",
    ],
    createdAt: new Date("2023-08-12T10:00:00"),
    updatedAt: new Date("2023-08-12T10:00:00"),
  },
  {
    id: 79,
    title: "Sentence Transformation Relay (句子變換接力)",
    description: "快速轉換句型，訓練語法反應能力。",
    categories: ["句型練習"],
    grades: ["grade5", "grade6"],
    materials: ["白板", "白板筆"],
    instructions: [
      "學生分組，每組排成一列",
      "老師寫一個句子在白板上，並指定變換規則（例如：將肯定句變疑問句）",
      "各組第一位學生衝到白板前寫下變換後的句子，然後跑回觸摸下一位組員，依序接力",
      "最快且正確完成的組獲勝",
    ],
    createdAt: new Date("2023-08-10T11:00:00"),
    updatedAt: new Date("2023-08-10T11:00:00"),
  },
  {
    id: 80,
    title: "Word Wall Activities (單字牆活動)",
    description: "利用視覺輔助，加強單字學習和拼寫。",
    categories: ["單字學習", "拼寫練習", "教學輔具"],
    grades: ["grade1", "grade2", "grade3", "grade4"],
    materials: ["單字牆", "單字卡片", "指針或魔棒"],
    instructions: [
      "老師或學生指著單字牆上的單字，讓大家一起念出來",
      "可玩 'I Spy' 遊戲：'I spy with my little eye a word that starts with B.'",
      "或請學生找出某個單字的反義詞/同義詞",
    ],
    createdAt: new Date("2023-08-08T14:00:00"),
    updatedAt: new Date("2023-08-08T14:00:00"),
  },
  {
    id: 81,
    title: "What's the Difference? (有什麼不同？)",
    description: "練習描述性詞彙和比較句型。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["兩張相似但有細微差異的圖片"],
    instructions: [
      "老師展示兩張有細微差異的圖片",
      "學生輪流說出兩張圖片的不同之處，用英語表達（例如：'In picture A, there is a cat. In picture B, there are two cats.'）",
    ],
    createdAt: new Date("2023-08-06T10:00:00"),
    updatedAt: new Date("2023-08-06T10:00:00"),
  },
  {
    id: 82,
    title: "Story Map (故事地圖)",
    description: "分析故事元素，提升閱讀理解和寫作組織能力。",
    categories: ["閱讀練習", "寫作練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["短篇英文故事", "故事地圖範本（紙）"],
    instructions: [
      "學生閱讀一篇英文故事",
      "然後填寫故事地圖，包含人物、地點、問題、事件、解決方法等元素",
      "可作為寫作前規劃的練習",
    ],
    createdAt: new Date("2023-08-04T11:00:00"),
    updatedAt: new Date("2023-08-04T11:00:00"),
  },
  {
    id: 83,
    title: "Phonics Dominoes (自然發音骨牌)",
    description: "透過遊戲配對發音，強化發音規則。",
    categories: ["發音練習", "單字學習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["自製發音骨牌卡片"],
    instructions: [
      "製作骨牌卡片，一邊是圖片，一邊是發音或單字",
      "學生將圖片與對應的發音或單字配對，像玩骨牌一樣連接起來",
      "所有卡片連接起來即獲勝",
    ],
    createdAt: new Date("2023-08-02T14:00:00"),
    updatedAt: new Date("2023-08-02T14:00:00"),
  },
  {
    id: 84,
    title: "Future Tense Plans (未來計畫)",
    description: "練習未來式句型，描述未來的計畫或目標。",
    categories: ["句型練習", "口語訓練"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師給出一個情境（例如：'Next weekend...', 'After I graduate...'）",
      "學生輪流用未來式（will/be going to）描述他們的計畫或目標",
      "鼓勵具體描述細節",
    ],
    createdAt: new Date("2023-07-31T10:00:00"),
    updatedAt: new Date("2023-07-31T10:00:00"),
  },
  {
    id: 85,
    title: "Word Jumble (單字重組)",
    description: "訓練單字拼寫和辨識能力。",
    categories: ["單字學習", "拼寫練習"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["打亂字母順序的單字卡片或列表", "筆", "紙"],
    instructions: [
      "老師提供一些被打亂字母順序的單字",
      "學生需在限時內將字母重新排列，組合成正確的單字",
      "最快且正確者得分",
    ],
    createdAt: new Date("2023-07-29T11:00:00"),
    updatedAt: new Date("2023-07-29T11:00:00"),
  },
  {
    id: 86,
    title: "Show and Tell (展示與分享)",
    description: "練習描述個人物品，提升口語表達和自信心。",
    categories: ["口語訓練"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["學生自備物品"],
    instructions: [
      "學生從家中帶一件自己喜歡的物品到學校",
      "輪流用英語描述這件物品，包括它的名字、顏色、用途、為什麼喜歡它等",
      "鼓勵同學提問",
    ],
    createdAt: new Date("2023-07-27T14:00:00"),
    updatedAt: new Date("2023-07-27T14:00:00"),
  },
  {
    id: 87,
    title: "Listening Comprehension Quiz (聽力理解測驗)",
    description: "評估學生聽力理解能力，找出聽力弱點。",
    categories: ["聽力練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["英文音頻（故事、新聞片段、對話）", "測驗卷"],
    instructions: [
      "老師播放一段英文音頻",
      "學生聽完後回答測驗卷上的問題",
      "題目可設計為選擇題、是非題或簡答題",
    ],
    createdAt: new Date("2023-07-25T10:00:00"),
    updatedAt: new Date("2023-07-25T10:00:00"),
  },
  {
    id: 88,
    title: "Verb Conjugation Race (動詞變位競賽)",
    description: "練習動詞的各種形式（原型、過去式、過去分詞）。",
    categories: ["句型練習", "寫作練習"],
    grades: ["grade5", "grade6"],
    materials: ["動詞列表", "白板或紙"],
    instructions: [
      "老師說出一個動詞原型",
      "學生需快速寫出其過去式和過去分詞",
      "可分組競賽，比速度和正確性",
    ],
    createdAt: new Date("2023-07-23T11:00:00"),
    updatedAt: new Date("2023-07-23T11:00:00"),
  },
  {
    id: 89,
    title: "Picture Memory Challenge (圖片記憶挑戰)",
    description: "訓練視覺記憶和單字回想能力。",
    categories: ["單字學習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["多張圖片卡片"],
    instructions: [
      "老師展示多張圖片卡片數秒鐘，然後將其蓋住或收起來",
      "學生盡力回想並用英語說出他們記得的圖片上的單字",
      "回想最多單字者獲勝",
    ],
    createdAt: new Date("2023-07-21T14:00:00"),
    updatedAt: new Date("2023-07-21T14:00:00"),
  },
  {
    id: 90,
    title: "Conversation Starters (對話開場白)",
    description: "提供對話情境，鼓勵學生主動開口交流。",
    categories: ["口語訓練"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["對話開場白卡片"],
    instructions: [
      "老師提供一些對話開場白或情境（例如：'Hi, how are you today?', 'What did you do last weekend?'）",
      "學生分組或兩兩練習對話，拓展交流內容",
      "鼓勵自由發揮和提出後續問題",
    ],
    createdAt: new Date("2023-07-19T10:00:00"),
    updatedAt: new Date("2023-07-19T10:00:00"),
  },
  {
    id: 91,
    title: "Error Correction (錯誤糾正)",
    description: "培養語法敏感度，提升句子正確性。",
    categories: ["句型練習", "寫作練習"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["錯誤句子列表", "白板或紙"],
    instructions: [
      "老師寫出或念出一個含有語法錯誤的句子",
      "學生找出並口頭或書面糾正錯誤",
      "可分組競賽，看誰糾正得又快又正確",
    ],
    createdAt: new Date("2023-07-17T11:00:00"),
    updatedAt: new Date("2023-07-17T11:00:00"),
  },
  {
    id: 92,
    title: "Body Parts Race (身體部位競賽)",
    description: "學習身體部位單字，結合肢體活動。",
    categories: ["單字學習"],
    grades: ["grade1", "grade2"],
    materials: ["無"],
    instructions: [
      "老師說出一個身體部位的英文名稱（例如：'head', 'hand', 'knee'）",
      "學生需快速觸摸自己的該身體部位",
      "反應慢或觸摸錯誤者出局",
    ],
    createdAt: new Date("2023-07-15T14:00:00"),
    updatedAt: new Date("2023-07-15T14:00:00"),
  },
  {
    id: 93,
    title: "Who's Got the Ball? (誰拿到球了？)",
    description: "練習提問和回答簡單的是非題，提高專注力。",
    categories: ["口語訓練", "聽力練習"],
    grades: ["grade1", "grade2", "grade3"],
    materials: ["一顆小球"],
    instructions: [
      "所有學生圍坐成一圈，一位學生閉上眼睛或背對",
      "老師將球傳給其中一位學生，然後讓學生藏在身後",
      "閉眼學生睜開眼後，輪流問 'Do you have the ball?'，拿到球的學生回答 'Yes, I do.' 或 'No, I don't.'",
      "直到猜出球在誰那裡",
    ],
    createdAt: new Date("2023-07-13T10:00:00"),
    updatedAt: new Date("2023-07-13T10:00:00"),
  },
  {
    id: 94,
    title: "Homonym Fun (同形異義字樂)",
    description: "辨識同形異義字在不同語境中的意義。",
    categories: ["單字學習", "閱讀練習"],
    grades: ["grade5", "grade6"],
    materials: ["同形異義字列表", "句子範例"],
    instructions: [
      "老師提供一個同形異義字（例如：'bat'）",
      "學生需說出或寫出該單字在不同意義下的用法（棒球棒/蝙蝠）",
      "並用英語造句來區分",
    ],
    createdAt: new Date("2023-07-11T11:00:00"),
    updatedAt: new Date("2023-07-11T11:00:00"),
  },
  {
    id: 95,
    title: "Make a Poster (製作海報)",
    description: "綜合運用單字、句型和創造力，視覺化學習成果。",
    categories: ["單字學習", "寫作練習", "教學輔具"],
    grades: ["grade2", "grade3", "grade4"],
    materials: ["大海報紙", "彩色筆", "圖片剪貼"],
    instructions: [
      "老師設定一個主題（例如：'My Favorite Animals', 'Healthy Food'）",
      "學生分組設計並製作一張英文海報，包含相關單字、圖片和簡單句子",
      "最後各組展示並介紹他們的海報",
    ],
    createdAt: new Date("2023-07-09T14:00:00"),
    updatedAt: new Date("2023-07-09T14:00:00"),
  },
  {
    id: 96,
    title: "The Price is Right (價格猜猜看)",
    description: "練習數字、物品單字和提問/回答價格。",
    categories: ["單字學習", "口語訓練"],
    grades: ["grade3", "grade4", "grade5"],
    materials: ["各種物品圖片", "虛擬價格標籤"],
    instructions: [
      "老師展示一個物品圖片",
      "學生輪流猜測物品的價格（用英語）",
      "老師提示 'higher' 或 'lower'，直到有人猜對或最接近",
    ],
    createdAt: new Date("2023-07-07T10:00:00"),
    updatedAt: new Date("2023-07-07T10:00:00"),
  },
  {
    id: 97,
    title: "Picture Matching (圖片配對)",
    description: "透過圖片配對單字或句子，加強理解。",
    categories: ["單字學習", "句型練習"],
    grades: ["grade1", "grade2"],
    materials: ["圖片卡片", "單字/句子卡片"],
    instructions: [
      "將圖片卡片和單字/句子卡片打亂",
      "學生找出每張圖片對應的單字或句子進行配對",
      "最快完成所有配對者獲勝",
    ],
    createdAt: new Date("2023-07-05T11:00:00"),
    updatedAt: new Date("2023-07-05T11:00:00"),
  },
  {
    id: 98,
    title: "Adverb Charades (副詞比手畫腳)",
    description: "練習副詞的運用，透過動作理解語氣和方式。",
    categories: ["口語訓練", "句型練習"],
    grades: ["grade5", "grade6"],
    materials: ["副詞卡片"],
    instructions: [
      "一位學生抽取一張副詞卡片（例如：'quickly', 'sadly', 'loudly'）",
      "學生表演一個動作，並用該副詞來修飾動作（不能說出副詞）",
      "其他學生猜測該副詞，並用英語說出（例如：'You are walking quickly.'）",
    ],
    createdAt: new Date("2023-07-03T14:00:00"),
    updatedAt: new Date("2023-07-03T14:00:00"),
  },
  {
    id: 99,
    title: "What's the Question? (問題是什麼？)",
    description: "訓練從回答中構建問題的能力。",
    categories: ["句型練習", "口語訓練"],
    grades: ["grade4", "grade5", "grade6"],
    materials: ["回答句卡片"],
    instructions: [
      "老師展示一個英文回答句（例如：'My favorite color is blue.'）",
      "學生需在限時內說出或寫出對應的問題（例如：'What is your favorite color?'）",
      "最快且正確者得分",
    ],
    createdAt: new Date("2023-07-01T10:00:00"),
    updatedAt: new Date("2023-07-01T10:00:00"),
  },
  {
    id: 100,
    title: "Pass the Story (傳遞故事)",
    description: "集體創作故事，練習口語表達和連貫性。",
    categories: ["口語訓練", "寫作練習"],
    grades: ["grade3", "grade4", "grade5", "grade6"],
    materials: ["無"],
    instructions: [
      "老師說一個故事開頭",
      "每位學生輪流接續一句，共同完成一個故事",
      "鼓勵使用連接詞和豐富細節",
    ],
    createdAt: new Date("2023-06-29T11:00:00"),
    updatedAt: new Date("2023-06-29T11:00:00"),
  },
];

export default function GamesPage() {
  const [games, setGames] = useState<GameMethod[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameMethod[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "all",
  ]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["all"]);

  useEffect(() => {
    // 從 API 讀取遊戲方法數據
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games");
        const result = await response.json();

        if (result.success && result.data) {
          setGames(result.data);
        } else {
          console.warn("API 返回空數據或錯誤:", result.message);
          // 如果 API 無數據，顯示空狀態
          setGames([]);
        }
      } catch (error) {
        console.error("Failed to fetch games from API:", error);
        // 網絡錯誤時顯示空狀態
        setGames([]);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    // 篩選遊戲方法
    let filtered = games;

    if (!selectedCategories.includes("all")) {
      filtered = filtered.filter((game) =>
        game.categories.some((category) =>
          selectedCategories.includes(category)
        )
      );
    }

    if (!selectedGrades.includes("all")) {
      filtered = filtered.filter((game) => {
        // 檢查選中的年級是否適用於該遊戲
        return selectedGrades.some((grade) => {
          if (grade === "grade1") return game.grades.includes("grade1");
          if (grade === "grade2") return game.grades.includes("grade2");
          if (grade === "grade3") return game.grades.includes("grade3");
          if (grade === "grade4") return game.grades.includes("grade4");
          if (grade === "grade5") return game.grades.includes("grade5");
          if (grade === "grade6") return game.grades.includes("grade6");
          return false;
        });
      });
    }

    setFilteredGames(filtered);
  }, [games, selectedCategories, selectedGrades]);

  const categories = [
    "all",
    ...Array.from(new Set(games.flatMap((game) => game.categories))),
  ];
  const grades = [
    "all",
    "grade1",
    "grade2",
    "grade3",
    "grade4",
    "grade5",
    "grade6",
  ];

  const categoryLabels = {
    all: "全部",
    單字學習: "單字學習",
    句型練習: "句型練習",
    口語訓練: "口語訓練",
    教學輔具: "教學輔具",
    聽力練習: "聽力練習",
    發音練習: "發音練習",
    拼寫練習: "拼寫練習",
  };

  const gradeLabels = {
    all: "全部",
    grade1: "1年級",
    grade2: "2年級",
    grade3: "3年級",
    grade4: "4年級",
    grade5: "5年級",
    grade6: "6年級",
  };

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSelectedCategories(["all"]);
    } else {
      setSelectedCategories((prev) => {
        if (prev.includes("all")) {
          return [category];
        } else if (prev.includes(category)) {
          const newCategories = prev.filter((c) => c !== category);
          return newCategories.length === 0 ? ["all"] : newCategories;
        } else {
          return [...prev, category];
        }
      });
    }
  };

  const handleGradeChange = (grade: string) => {
    if (grade === "all") {
      setSelectedGrades(["all"]);
    } else {
      setSelectedGrades((prev) => {
        if (prev.includes("all")) {
          return [grade];
        } else if (prev.includes(grade)) {
          const newGrades = prev.filter((g) => g !== grade);
          return newGrades.length === 0 ? ["all"] : newGrades;
        } else {
          return [...prev, grade];
        }
      });
    }
  };

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">遊戲庫</h1>
          <p className="text-xl text-black">
            探索各種英語學習遊戲方法，讓學習變得更有趣且有效！
          </p>
        </div>

        {/* 篩選器 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 分類篩選 */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                分類
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded"
                    />
                    <span className="text-sm text-black">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 年級篩選 */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                年級
              </label>
              <div className="space-y-2">
                {grades.map((grade) => (
                  <label key={grade} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGrades.includes(grade)}
                      onChange={() => handleGradeChange(grade)}
                      className="mr-2 h-4 w-4 text-secondary-pink focus:ring-secondary-pink border-gray-300 rounded"
                    />
                    <span className="text-sm text-black">
                      {gradeLabels[grade as keyof typeof gradeLabels]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 遊戲方法列表 */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGames.map((game) => (
              <GameMethodCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">
              沒有找到符合條件的遊戲方法
            </h3>
            <p className="text-black">請嘗試調整篩選條件</p>
          </div>
        )}

        {/* 統計資訊 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-black mb-4">統計資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-pink">
                {games.length}
              </div>
              <div className="text-sm text-black">總數量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {games.filter((g) => g.categories.includes("單字學習")).length}
              </div>
              <div className="text-sm text-black">單字學習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {games.filter((g) => g.categories.includes("句型練習")).length}
              </div>
              <div className="text-sm text-black">句型練習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {games.filter((g) => g.categories.includes("口語訓練")).length}
              </div>
              <div className="text-sm text-black">口語訓練</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {games.filter((g) => g.categories.includes("教學輔具")).length}
              </div>
              <div className="text-sm text-black">教學輔具</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {games.filter((g) => g.categories.includes("聽力練習")).length}
              </div>
              <div className="text-sm text-black">聽力練習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {games.filter((g) => g.categories.includes("發音練習")).length}
              </div>
              <div className="text-sm text-black">發音練習</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {games.filter((g) => g.categories.includes("拼寫練習")).length}
              </div>
              <div className="text-sm text-black">拼寫練習</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
