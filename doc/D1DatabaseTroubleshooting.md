# D1 資料庫故障排除指南

## 問題描述

在開發過程中遇到 D1 資料庫搜不到資料的問題，具體表現為：
- 遠端 D1 資料庫返回空結果
- 本地開發環境無法直接訪問 D1
- 資料庫結構不一致
- 認證問題

## 問題分析

### 1. 環境差異
- **本地開發環境**：無法直接訪問 Cloudflare D1 資料庫
- **遠端生產環境**：D1 資料庫可用但數據為空
- **資料庫結構**：本地與遠端結構不一致

### 2. 具體問題
- 遠端 D1 資料庫：0 筆數據
- 本地開發資料庫：100 筆數據
- 遠端資料庫缺少必要欄位（如 `categories`, `grade1-6`, `instructions`）

## 解決方案

### 階段一：本地開發環境配置

#### 1. 修改 API 代碼
在 `src/app/api/games/route.ts` 中添加模擬數據，確保開發環境可以正常測試：

```typescript
// 開發環境下返回模擬數據，以便開發和測試
console.log(
  "D1 database not available in development environment, returning mock data"
);
return [
  {
    id: "1",
    title: "單字記憶遊戲 [本機開發數據]",
    description: "透過配對遊戲幫助學生記憶英文單字 - 本機開發環境數據，僅供測試使用",
    categories: '["單字學習", "記憶訓練"]',
    grade1: true,
    grade2: true,
    // ... 其他欄位
  },
  // ... 其他模擬遊戲
];
```

#### 2. 模擬數據特點
- 數量：3 個遊戲（避免過多測試數據）
- 標註：每個遊戲標題和描述都標註 `[本機開發數據]`
- 覆蓋：涵蓋不同年級和分類
- 格式：與真實數據結構完全一致

### 階段二：遠端資料庫修復

#### 1. 重新認證
```bash
# 登出當前帳號
npx wrangler logout

# 重新登入
npx wrangler login
```

#### 2. 檢查資料庫狀態
```bash
# 檢查遠端資料庫數據量
npx wrangler d1 execute primary-english-db --remote --command "SELECT COUNT(*) FROM game_methods"

# 檢查資料庫結構
npx wrangler d1 execute primary-english-db --remote --command "PRAGMA table_info(game_methods)"
```

#### 3. 重建資料庫結構
```bash
# 刪除現有表格
npx wrangler d1 execute primary-english-db --remote --command "DROP TABLE IF EXISTS game_methods"

# 創建正確的表格結構
npx wrangler d1 execute primary-english-db --remote --command "CREATE TABLE game_methods (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, categories TEXT NOT NULL, grade1 BOOLEAN NOT NULL DEFAULT FALSE, grade2 BOOLEAN NOT NULL DEFAULT FALSE, grade3 BOOLEAN NOT NULL DEFAULT FALSE, grade4 BOOLEAN NOT NULL DEFAULT FALSE, grade5 BOOLEAN NOT NULL DEFAULT FALSE, grade6 BOOLEAN NOT NULL DEFAULT FALSE, materials TEXT NOT NULL, instructions TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)"
```

#### 4. 同步數據
```bash
# 執行 SQL 腳本插入數據
npx wrangler d1 execute primary-english-db --remote --file=scripts/batch1-games-1-10.sql
npx wrangler d1 execute primary-english-db --remote --file=scripts/batch2-games-11-20.sql
# ... 繼續執行其他批次

# 批量執行多個腳本
npx wrangler d1 execute primary-english-db --remote --file=scripts/batch6-games-51-60.sql && npx wrangler d1 execute primary-english-db --remote --file=scripts/batch7-games-61-70.sql
```

### 階段三：驗證修復結果

#### 1. 檢查數據量
```bash
npx wrangler d1 execute primary-english-db --remote --command "SELECT COUNT(*) FROM game_methods"
```

#### 2. 檢查數據內容
```bash
npx wrangler d1 execute primary-english-db --remote --command "SELECT id, title, categories FROM game_methods LIMIT 5"
```

## 常見問題及解決方法

### 1. 認證錯誤 (Authentication error [code: 10000])
**症狀**：無法執行遠端資料庫操作
**解決方法**：
```bash
npx wrangler logout
npx wrangler login
```

### 2. 資料庫結構不匹配
**症狀**：執行 SQL 腳本時出現欄位不存在錯誤
**解決方法**：
1. 檢查遠端資料庫結構
2. 刪除現有表格
3. 重新創建正確的表格結構

### 3. 本地開發環境無法訪問 D1
**症狀**：開發環境返回空數據
**解決方法**：
1. 在 API 代碼中添加模擬數據
2. 使用環境檢測區分開發和生產環境
3. 在部署後自動使用真實 D1 數據

## 最佳實踐

### 1. 開發環境配置
- 始終提供模擬數據作為後備
- 明確標註模擬數據的來源
- 保持模擬數據與真實數據結構一致

### 2. 資料庫同步
- 定期檢查本地和遠端資料庫的一致性
- 使用版本控制的 SQL 腳本
- 在部署前驗證資料庫結構

### 3. 錯誤處理
- 在 API 中添加詳細的錯誤日誌
- 區分開發和生產環境的錯誤處理
- 提供用戶友好的錯誤訊息

## 監控和維護

### 1. 定期檢查
```bash
# 檢查遠端資料庫狀態
npx wrangler d1 execute primary-english-db --remote --command "SELECT COUNT(*) FROM game_methods"

# 檢查資料庫大小
npx wrangler d1 execute primary-english-db --remote --command "PRAGMA page_count"
```

### 2. 備份策略
- 定期導出資料庫結構和數據
- 保存 SQL 腳本作為備份
- 在重大更改前創建快照

## 總結

通過這次故障排除，我們成功解決了：
1. **本地開發環境**：配置了模擬數據，確保開發流程不中斷
2. **遠端資料庫**：修復了結構問題，同步了 100 筆遊戲數據
3. **認證問題**：重新建立了穩定的連接

這個解決方案為未來遇到類似問題提供了完整的參考流程，確保專案的穩定性和可維護性。

## 相關文件
- `src/app/api/games/route.ts` - API 路由配置
- `db/schema.sql` - 資料庫結構定義
- `scripts/` - 數據插入腳本
- `wrangler.toml` - Cloudflare 配置
