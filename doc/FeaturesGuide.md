# 功能指南

## 🎯 功能概述

Primary English Support 提供以下主要功能：

1. **遊戲方法管理** - 管理英語學習遊戲
2. **學習輔助系統** - 電子教具和互動遊戲
3. **學習內容系統** - 單字、句型、主題管理
4. **管理花園** - 統一管理介面
5. **聯絡系統** - 聯絡表單和郵件服務
6. **認證系統** - 用戶登入和權限管理

## 🎮 遊戲方法管理

### 功能說明
管理英語學習遊戲方法，包含分類、難度設定和詳細說明。

### 主要特性
- **分類管理**: 單字學習、句型練習、口語訓練
- **難度設定**: 簡單、中等、困難
- **詳細說明**: 遊戲規則、材料準備、操作步驟
- **搜尋功能**: 依關鍵字、分類、難度搜尋

### 使用指南
1. 前往 `/games` 頁面瀏覽所有遊戲方法
2. 使用篩選器依分類或難度篩選
3. 點擊遊戲卡片查看詳細資訊
4. 在管理花園中新增、編輯或刪除遊戲方法

### 開發指南
- **API 端點**: `/api/games`
- **資料表**: `game_methods`
- **組件**: `GameMethodCard`, `GameSetupSelector`

## 🎯 學習輔助系統

### 功能說明
提供多種電子教具和互動遊戲，幫助學生學習英語單字和句型。

### 已建立的遊戲頁面

#### 1. 圖像記憶配對 (`/aids/memory-match`) ✅
- **功能**: 記憶配對遊戲，配對英文單字與中文意思
- **需求**: 至少6個單字
- **適合練習**: 單字記憶和視覺聯想
- **遊戲方式**: 
  - 翻開卡片尋找配對的英文單字和中文意思
  - 記住卡片位置，配對成功可繼續翻牌
  - 適合小組活動，訓練記憶力和觀察力
- **特色**:
  - 使用共用TextbookSelector組件
  - 教材和單元選擇
  - 單字預覽
  - 配對統計（移動次數、配對成功數）
  - 遊戲完成提示

#### 2. 詞彙分類 (`/aids/vocabulary-sort`) ✅
- **功能**: 將單字按類別分類整理
- **需求**: 至少12個單字
- **適合練習**: 邏輯思維和分類能力
- **遊戲方式**: 
  - 拖拽單字到正確的分類區域
  - 6個預定義分類：動物、食物、顏色、數字、家庭、學校
  - 培養邏輯思維和分類整理能力
- **特色**:
  - 使用共用TextbookSelector組件
  - 6個預定義分類：動物、食物、顏色、數字、家庭、學校
  - 智能單字分配和分類
  - 拖拽式分類操作
  - 分類統計和完成提示

#### 3. 句型拉霸機 (`/aids/sentence-slot`) ✅
- **功能**: 透過拉霸機形式練習句型結構
- **需求**: 至少10個單字
- **適合練習**: 句型創意和語法練習
- **遊戲方式**: 
  - 拉霸機隨機選擇單字填入句型模板
  - 6種句型模板，支援2-3個空格
  - 創造有趣的句子，練習語法結構
- **特色**:
  - 使用共用TextbookSelector組件
  - 6種句型模板，支援2-3個空格
  - 拉霸機隨機選擇單字
  - 即時句子生成和顯示
  - 句型進度和得分追蹤

### 技術實作

#### 共用組件系統
- **TextbookSelector**: 統一的教材和單元選擇介面
- **標題更新**: 「選擇教材與單元」→「句型與單字主題」
- **使用 checkbox**: 支援多選教材和單元
- **智能關聯**: 只有選中的教材的單元才可選
- **狀態提示**: 顯示選擇狀態和數量

#### 共同功能
- 教材和單元選擇（使用共用組件）
- 單字載入和預覽
- 遊戲狀態管理
- 返回電子教具主頁面
- 響應式設計

#### 使用的技術
- Next.js 13+ App Router
- React Hooks (useState, useEffect)
- TypeScript
- Tailwind CSS

### 檔案結構
```
src/
├── components/
│   └── TextbookSelector.tsx    # 共用教材選擇組件
└── app/aids/
    ├── page.tsx                # 電子教具主頁面
    ├── memory-match/           # 圖像記憶配對遊戲
    ├── vocabulary-sort/        # 詞彙分類遊戲
    └── sentence-slot/          # 句型拉霸機遊戲
```

## 📚 學習內容系統

### 功能說明
提供完整的學習內容管理系統，包括單字、句型、主題和年級管理。

### 資料庫架構

#### 核心資料表

##### 1. 年級表 (grades)
- **用途**: 儲存年級層級 (Grade 1-6)
- **欄位**:
  - `id`: 主鍵
  - `name`: 年級名稱 (如 "Grade 1")

##### 2. 單字主題表 (word_themes)
- **用途**: 將單字分類到主題群組
- **欄位**:
  - `id`: 主鍵
  - `name`: 主題名稱 (如 "Emotions", "Colors", "Sports")

##### 3. 單字表 (words)
- **用途**: 主要單字字典，包含元資料
- **欄位**:
  - `id`: 主鍵
  - `english_singular`: 英文單數形式
  - `english_plural`: 英文複數形式 (可選)
  - `chinese_meaning`: 中文翻譯
  - `part_of_speech`: 詞性 (noun, verb, adjective, adverb, preposition)
  - `image_url`: 可選圖片 URL
  - `audio_url`: 可選音頻 URL

##### 4. 句型模式表 (sentence_patterns)
- **用途**: 儲存不同年級的句型模式
- **欄位**:
  - `id`: 主鍵
  - `grade_id`: 年級表的外鍵
  - `pattern_text`: 包含空白的句型模式 (如 "I have a ____.")
  - `pattern_type`: 模式類型 (Question, Statement, Response)
  - `notes`: 關於模式的額外註記

##### 5. 句型空格表 (pattern_slots)
- **用途**: 定義每個空白需要什麼類型的單字
- **欄位**:
  - `id`: 主鍵
  - `pattern_id`: 句型模式表的外鍵
  - `slot_index`: 空白在模式中的位置
  - `required_part_of_speech`: 空白所需的詞性

##### 6. 單字主題關聯表 (word_theme_associations)
- **用途**: 單字和主題之間的多對多關聯
- **欄位**:
  - `word_id`: 單字表的外鍵
  - `theme_id`: 單字主題表的外鍵

### 可用的單字主題

系統包含 17 個預定義主題：

1. **Emotions** - 8 個單字 (happy, sad, angry, tired, excited, bored, surprised, scared)
2. **Colors** - 11 個單字 (red, blue, yellow, green, black, white, pink, purple, orange, brown, gray)
3. **Sports** - 8 個單字 (basketball, soccer, baseball, tennis, badminton, swimming, running, jogging)
4. **Stationery** - 7 個單字 (pen, pencil, eraser, ruler, book, notebook, marker)
5. **Fruits** - 7 個單字 (apple, banana, orange, grape, guava, lemon, strawberry)
6. **Fast Food** - 6 個單字 (hamburger, fries, pizza, hot dog, chicken nugget, soda)
7. **Bakery & Snacks** - 6 個單字 (bread, cake, cookie, donut, pie, candy)
8. **Days of the Week** - 7 個單字 (Sunday through Saturday)
9. **Months** - 12 個單字 (January through December)
10. **School Subjects** - 7 個單字 (English, Chinese, math, science, art, music, P.E.)
11. **Ailments** - 8 個單字 (headache, fever, cold, cough, stomachache, sore throat, runny nose, toothache)
12. **Countries** - 10 個單字 (Taiwan, America, Japan, Korea, Canada, the U.K., China, Singapore, Thailand, France)
13. **Furniture** - 10 個單字 (table, chair, desk, bed, sofa, lamp, bookshelf, wardrobe, mirror, rug)
14. **Toys** - 10 個單字 (ball, car, doll, kite, robot, block, puzzle, yo-yo, scooter, teddy bear)
15. **Drinks** - 10 個單字 (water, milk, juice, tea, coffee, coke, soy milk, papaya milk, winter melon tea, bubble tea)
16. **Main Dishes** - 10 個單字 (rice, noodles, dumplings, bento, hot pot, beef noodle soup, fried rice, pasta, steak, sandwich)
17. **Bubble Tea Toppings** - 7 個單字 (pearls, boba, pudding, grass jelly, aloe vera, red bean, taro balls)

### API 端點

#### 基礎 URL
```
/api/learning-content
```

#### 可用操作

##### 1. 獲取所有主題
```
GET /api/learning-content?action=themes
```

##### 2. 依主題獲取單字
```
GET /api/learning-content?action=words_by_theme&theme_id={theme_id}
```

**可選參數**:
- `part_of_speech`: 依詞性篩選
- `limit`: 限制結果數量
- `offset`: 分頁偏移

##### 3. 獲取句型模式
```
GET /api/learning-content?action=sentence_patterns&grade_id={grade_id}
```

**可選參數**:
- `limit`: 限制結果數量
- `offset`: 分頁偏移

##### 4. 獲取所有年級
```
GET /api/learning-content?action=grades
```

##### 5. 依詞性獲取單字
```
GET /api/learning-content?action=words_by_part_of_speech&part_of_speech={part_of_speech}
```

##### 6. 獲取隨機單字
```
GET /api/learning-content?action=random_words&count={count}&theme_id={theme_id}
```

### 組件整合

#### TextbookSelector 組件
更新的 `TextbookSelector` 組件現在與學習內容系統整合：

```tsx
<TextbookSelector
  onVocabularySelected={(words, theme) => {
    // 處理選中的詞彙
    console.log(`Selected ${words.length} words from ${theme.name} theme`);
  }}
  selectedGrade={1}
  onGradeChange={(gradeId) => {
    // 處理年級變更
    console.log(`Grade changed to ${gradeId}`);
  }}
/>
```

#### 主要特性
- **年級選擇**: 從 Grade 1-6 中選擇
- **主題選擇**: 帶有單字數量的視覺主題選擇
- **即時更新**: 主題變更時自動獲取單字
- **錯誤處理**: 優雅的錯誤處理和重試選項
- **載入狀態**: API 呼叫期間的視覺回饋

### TypeScript 類型

系統在 `src/types/learning-content.ts` 中包含完整的 TypeScript 類型：

- `Word`: 帶有元資料的個別單字
- `WordTheme`: 主題類別
- `Grade`: 年級層級
- `SentencePattern`: 帶有空格的句型模式
- `PatternSlot`: 句型空白定義
- 所有端點的 API 回應類型

### 使用範例

#### 1. 獲取特定主題的單字
```typescript
const response = await fetch('/api/learning-content?action=words_by_theme&theme_id=1');
const data = await response.json();
const emotionWords = data.data; // 情緒單字陣列
```

#### 2. 獲取 Grade 1 的句型模式
```typescript
const response = await fetch('/api/learning-content?action=sentence_patterns&grade_id=1');
const data = await response.json();
const patterns = data.data; // 帶有空格的句型模式陣列
```

#### 3. 依詞性篩選單字
```typescript
const response = await fetch('/api/learning-content?action=words_by_theme&theme_id=2&part_of_speech=adjective');
const data = await response.json();
const colorAdjectives = data.data; // 只有顏色形容詞
```

## 🌱 管理花園

### 功能說明
統一的管理介面，提供所有管理功能的集中入口。

### 主要特性
- **用戶認證**: 安全的登入系統
- **權限管理**: 不同層級的存取權限
- **統一介面**: 所有管理功能的集中管理
- **即時更新**: 即時反映資料變更

### 使用指南
1. 前往 `/garden` 頁面
2. 使用管理員帳號登入
3. 選擇要管理的功能模組
4. 進行相應的管理操作

### 開發指南
- **認證系統**: 使用安全驗證機制
- **API 端點**: `/api/admin/*`
- **組件**: `AuthGuard`, 管理相關組件

## 📧 聯絡系統

### 功能說明
提供聯絡表單和郵件發送服務，讓用戶可以與管理員聯絡。

### 主要特性
- **聯絡表單**: 用戶友善的聯絡介面
- **郵件服務**: 使用 EmailJS 發送郵件
- **表單驗證**: 前端和後端驗證
- **自動回覆**: 可設定自動回覆功能

### 使用指南
1. 前往 `/contact` 頁面
2. 填寫聯絡表單
3. 提交表單發送郵件
4. 管理員會收到通知郵件

### 開發指南
- **API 端點**: `/api/contact`
- **郵件服務**: EmailJS REST API
- **組件**: `ContactForm`

## 🔐 認證系統

### 功能說明
提供安全的用戶認證和權限管理系統。

### 主要特性
- **安全登入**: 使用安全的驗證機制
- **權限控制**: 不同層級的存取權限
- **會話管理**: 安全的會話處理
- **密碼保護**: 強化的密碼安全

### 使用指南
1. 前往 `/garden/login` 頁面
2. 輸入管理員帳號和密碼
3. 登入後可存取管理功能
4. 登出時會清除會話資訊

### 開發指南
- **認證 API**: `/api/auth/*`
- **會話管理**: `session-utils.ts`
- **認證工具**: `auth-utils.ts`
- **中間件**: `middleware.ts`

## 📊 資料管理

### 資料庫結構
- **game_methods**: 遊戲方法資料
- **teaching_aids**: 學習輔助資料
- **admin_messages**: 管理員消息
- **users**: 用戶資料
- **verification_codes**: 驗證碼

### API 設計
- **RESTful API**: 遵循 REST 設計原則
- **錯誤處理**: 統一的錯誤回應格式
- **資料驗證**: 嚴格的資料驗證
- **安全性**: API 密鑰驗證

## 🎨 使用者介面

### 設計原則
- **響應式設計**: 支援各種裝置尺寸
- **無障礙性**: 遵循 WCAG 2.1 標準
- **一致性**: 統一的設計語言
- **易用性**: 直觀的操作流程

### 顏色規範
- **主色調**: `#2b6b7a`
- **輔助色**: 根據設計系統定義
- **狀態色**: 成功、警告、錯誤等狀態顏色

### 組件系統
- **可重用組件**: 統一的組件庫
- **TypeScript**: 類型安全的組件開發
- **樣式系統**: Tailwind CSS 樣式管理

## 🔧 開發工具

### 本地開發
```bash
# 啟動完整開發環境
npm run dev:full

# 分別啟動服務
npm run dev:worker  # Cloudflare Worker
npm run dev         # Next.js 應用
```

### 測試工具
```bash
# 測試 Cloudflare 客戶端
npm run test:cloudflare

# 測試 API 端點
npm run test:api
```

### 部署工具
```bash
# 部署 Cloudflare Worker
npm run deploy:worker

# 部署到 Vercel
npm run deploy:vercel

# 完整部署
npm run deploy:full
```

## 🔒 句型拉霸機檔案保護

### 保護狀態
**狀態**: 🔒 已鎖定保護  
**保護日期**: 2024-12-19 15:30  
**保護原因**: 句型拉霸機功能已完成，防止後續程式碼更動影響其穩定性

### 已鎖定的檔案

#### 1. 主頁面
- **檔案**: `src/app/aids/sentence-slot/page.tsx`
- **功能**: 句型拉霸機主頁面，包含年級、句型、主題選擇器
- **狀態**: `@status locked`

#### 2. 遊戲頁面
- **檔案**: `src/app/aids/sentence-slot/game/page.tsx`
- **功能**: 句型拉霸機遊戲核心邏輯，包含填空題和是非題模式
- **狀態**: `@status locked`

#### 3. 核心邏輯
- **檔案**: `src/lib/game-logic.ts`
- **功能**: 句型拉霸機的核心邏輯和句型處理器
- **狀態**: `@status locked`

### 保護規則

#### 禁止修改
- ❌ 直接修改已鎖定的檔案
- ❌ 更改句型拉霸機的現有功能
- ❌ 修改 `patternHandlers` 的現有實作
- ❌ 更改 `SlotMachineGame` 介面結構

#### 允許操作
- ✅ 查看和測試現有功能
- ✅ 報告 bug 或問題
- ✅ 在站長明確許可下進行必要修改

### 如需類似功能

如果其他頁面需要使用「sentence-slot」相關功能，請：

1. **建立新組件**: 不要修改現有檔案，而是建立新的 component
2. **複製邏輯**: 可以參考現有實作，但必須建立新的檔案
3. **命名規範**: 使用不同的名稱，避免與現有功能混淆
4. **路徑分離**: 使用不同的路由路徑

### 範例

```typescript
// ❌ 錯誤：直接修改現有檔案
// src/app/aids/sentence-slot/game/page.tsx

// ✅ 正確：建立新組件
// src/components/NewSentenceGame.tsx
// src/app/new-game/page.tsx
```

### 聯絡方式

如需修改句型拉霸機功能，請：
1. 聯繫站長取得明確許可
2. 說明修改的必要性和影響範圍
3. 獲得許可後方可進行修改

**注意**: 此保護措施確保句型拉霸機的穩定性和一致性，維護用戶體驗。

## 📚 相關文檔

- [專案結構說明](ProjectStructure.md)
- [部署指南](DeploymentGuide.md)
- [環境變數設定](EnvironmentVariables.md)
- [EmailJS 設定](EmailjsSetup.md)
- [SEO 優化](SeoOptimization.md)
- [安全驗證系統指南](SecureVerificationSystemGuide.md)
- [驗證系統設定](VerificationSystemSetup.md)
