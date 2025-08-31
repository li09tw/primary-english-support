# Time Expressions 主題實現

## 概述

為了改善 "What time do you _____?" 句型的字彙選擇，我們新增了專門的 "Time Expressions" 主題，避免與 "Numbers" 主題混淆。

## 實現內容

### 1. 新增資料庫主題

- **主題 ID**: 24
- **主題名稱**: Time Expressions
- **描述**: Words for time expressions and clock times

### 2. 新增字彙類型

#### O'clock 時間 (12個)
- one o'clock, two o'clock, three o'clock, ..., twelve o'clock

#### Half Past 時間 (12個)
- half past one, half past two, ..., half past twelve

#### Quarter Past 時間 (12個)
- quarter past one, quarter past two, ..., quarter past twelve

#### Quarter To 時間 (12個)
- quarter to one, quarter to two, ..., quarter to twelve

#### 一般時間表達 (8個)
- morning, afternoon, evening, night, midnight, noon, dawn, dusk

**總計**: 56個時間表達單字

### 3. 句型對應更新

"What time do you _____?" 句型現在對應到：
- **主要主題**: Daily Actions (日常動作)
- **次要主題**: Time Expressions (時間表達)

### 4. 檔案修改

#### 資料庫結構
- `db/learning_content_schema.sql` - 新增主題定義
- `scripts/add-time-expressions.sql` - 新增字彙和關聯

#### 前端邏輯
- `src/lib/pattern-theme-mapping.ts` - 更新句型對應
- `src/components/GameSetupSelector.tsx` - 新增主題支援
- `src/lib/game-logic.ts` - 更新時間選擇邏輯

#### 部署腳本
- `scripts/deploy-time-expressions.sh` - 自動化部署

## 部署步驟

1. 執行部署腳本：
   ```bash
   ./scripts/deploy-time-expressions.sh
   ```

2. 或手動執行 SQL：
   ```bash
   wrangler d1 execute primary-english-support --file=./scripts/add-time-expressions.sql
   ```

## 使用方式

1. 在遊戲設定選擇器中，選擇 "Time Expressions" 主題
2. 選擇 "What time do you _____?" 句型
3. 系統會自動推薦 Daily Actions 和 Time Expressions 主題
4. 遊戲中會從選中的主題中選擇合適的日常動作和時間表達

## 優勢

1. **字彙分離**: Numbers 主題保持純數字用途，Time Expressions 專門處理時間表達
2. **豐富的時間表達**: 提供多種時間格式，更符合實際使用
3. **自動推薦**: 句型選擇後自動推薦相關主題
4. **靈活選擇**: 用戶可以選擇是否包含時間表達主題

## 注意事項

- 時間表達單字的 ID 範圍：321-380
- 所有時間表達單字都標記為 `has_plural: false`（不可數名詞）
- 部署後需要重新啟動應用程式以載入新主題
