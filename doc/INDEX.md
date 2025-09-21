# 文檔索引

## 📚 文檔概覽

本索引提供了 Primary English Support 專案所有文檔的完整導覽，幫助開發者和使用者快速找到所需的資訊。

## 🎯 主要文檔

### 1. [README.md](README.md) - 專案總覽
- 專案概述和主要功能
- 快速開始指南
- 技術架構簡介
- 文檔導覽

### 2. 專案結構 - 架構概述

#### 🏗️ 架構概述

Primary English Support 採用 Vercel + Cloudflare 的混合架構，結合兩者的優勢：

- **前端**: Next.js 14 + TypeScript + Tailwind CSS，部署在 Vercel
- **API 閘道**: Cloudflare Worker 處理 D1 和 R2 操作
- **資料庫**: Cloudflare D1 (SQLite)
- **檔案存儲**: Cloudflare R2
- **郵件服務**: EmailJS

#### 📁 專案結構

```
primary-english-support/
├── 📁 src/                          # 主要源碼
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 api/                  # API 路由
│   │   │   ├── 📁 games/            # 遊戲 API
│   │   │   ├── 📁 admin/            # 管理 API
│   │   │   └── 📁 contact/          # 聯絡表單 API
│   │   ├── 📁 games/                # 遊戲頁面
│   │   ├── 📁 aids/                 # 學習輔助頁面
│   │   ├── 📁 garden/               # 管理介面
│   │   └── 📁 contact/              # 聯絡頁面
│   ├── 📁 components/               # 共用組件
│   ├── 📁 lib/                      # 工具函數和配置
│   │   └── cloudflare-client.ts     # Cloudflare 服務客戶端
│   └── 📁 types/                    # TypeScript 類型定義
├── 📁 functions/                     # Cloudflare Worker 函數
│   └── api-gateway.js               # API 閘道 Worker
├── 📁 scripts/                       # 腳本和工具
│   ├── deploy.sh                    # 部署腳本
│   └── dev.sh                       # 本地開發腳本
├── 📁 doc/                          # 文檔
├── wrangler-api-gateway.toml        # 生產環境 Worker 配置
├── wrangler-dev.toml                # 本地開發 Worker 配置
└── package.json                     # 專案配置和腳本
```

#### 🔧 核心組件

**1. Cloudflare Worker API 閘道**
- **位置**: `functions/api-gateway.js`
- **功能**: 處理來自 Vercel 的 D1 和 R2 請求
- **配置**: `wrangler-api-gateway.toml` (生產) / `wrangler-dev.toml` (開發)

**2. Cloudflare 服務客戶端**
- **位置**: `src/lib/cloudflare-client.ts`
- **功能**: 從 Vercel 呼叫 Cloudflare 服務的客戶端
- **特點**: 類型安全、錯誤處理、認證管理

**3. Next.js API 路由**
- **位置**: `src/app/api/`
- **功能**: 處理前端請求，透過客戶端呼叫 Cloudflare 服務
- **特點**: 強制動態路由、錯誤處理、資料轉換

#### 🚀 部署架構

```
用戶請求 → Vercel (Next.js) → Cloudflare Worker → Cloudflare D1/R2
```

**部署流程**
1. **部署 Cloudflare Worker**: `npm run deploy:worker`
2. **設定 Vercel 環境變數**: CLOUDFLARE_WORKER_URL, CLOUDFLARE_API_SECRET
3. **部署到 Vercel**: `npm run deploy:vercel`

#### 🧪 本地開發

**啟動完整開發環境**
```bash
npm run dev:full
```

**分別啟動服務**
```bash
# 終端 1: 啟動 Worker
npm run dev:worker

# 終端 2: 啟動 Next.js
npm run dev
```

**環境變數配置**
創建 `.env.local` 文件：
```bash
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development
```

#### 📊 資料流

**讀取操作**
1. 前端發送請求到 Next.js API
2. Next.js API 呼叫 Cloudflare 客戶端
3. 客戶端發送請求到 Worker API 閘道
4. Worker 執行 D1 查詢或 R2 操作
5. 結果返回給前端

**寫入操作**
1. 前端發送寫入請求到 Next.js API
2. Next.js API 透過客戶端呼叫 Worker
3. Worker 執行 D1 插入/更新或 R2 上傳
4. 結果返回給前端

#### 🔒 安全機制

**API 認證**
- 所有 Worker 請求都需要 `X-API-Key` 標頭
- API 密鑰在兩邊設定一致
- 密鑰不在客戶端暴露

**CORS 設定**
- Worker 支援跨域請求
- 預檢請求 (OPTIONS) 正常處理
- 允許所有來源（可根據需求調整）

#### 📈 性能考量

**延遲**
- 多了一層 API 調用，但通常可接受
- Worker 到 D1/R2 的延遲很低
- 可以透過快取策略優化

**成本**
- Vercel: Serverless Function 執行時間和請求次數
- Cloudflare: Worker 執行次數、D1 操作、R2 存儲

#### 🛠️ 維護和監控

**日誌檢查**
- **Vercel**: `vercel logs`
- **Cloudflare**: Dashboard 中的即時日誌

**常見問題**
- 認證失敗: 檢查 API 密鑰設定
- CORS 錯誤: 檢查 Worker CORS 設定
- 資料庫錯誤: 檢查 D1 綁定和權限

**備份策略**
- D1 資料庫定期備份
- R2 物件版本控制
- 部署腳本和配置備份

#### 🔮 未來擴展

**可能的改進**
- 實作快取策略
- 添加監控和警報
- 多區域部署
- 負載均衡

**技術升級**
- 升級到最新的 Next.js 版本
- 優化 Worker 性能
- 改進錯誤處理和日誌記錄

### 3. [FeaturesGuide.md](FeaturesGuide.md) - 功能指南
- 完整的功能說明
- 使用指南和操作流程
- 開發指南和 API 設計
- 使用者介面設計原則

### 4. [DeploymentGuide.md](DeploymentGuide.md) - 部署指南
- 詳細的部署步驟
- 環境變數設定
- 故障排除和維護
- 性能優化和監控

## 🔧 技術文檔

### 5. [TechnicalGuide.md](TechnicalGuide.md) - 技術指南
- 系統架構和核心組件
- 資料庫設計和 API 設計
- 安全機制和性能優化
- 故障排除和除錯工具

### 6. [DatabaseGuide.md](DatabaseGuide.md) - 資料庫指南
- 資料庫架構和表結構
- 查詢語法和操作指南
- 遷移和維護流程
- 性能優化和監控

### 7. [SecurityGuide.md](SecurityGuide.md) - 安全指南
- 認證系統和安全機制
- 輸入驗證和安全標頭
- 安全監控和事件處理
- 安全配置和最佳實踐

## 🛠️ 開發文檔

### 8. [DevelopmentGuide.md](DevelopmentGuide.md) - 開發指南
- 開發環境設定和流程
- 程式碼規範和最佳實踐
- 測試指南和除錯工具
- 性能優化和部署流程

### 9. [GamePagesGuide.md](GamePagesGuide.md) - 遊戲頁面指南
- 已建立的遊戲頁面
- 技術實作和組件系統
- 設計特色和未來規劃
- 開發筆記和維護指南

### 10. [LearningContentSystem.md](LearningContentSystem.md) - 學習內容系統
- 學習內容系統概述
- 資料庫結構和 API 端點
- 組件整合和使用範例
- 故障排除和未來擴展

## 🔐 安全文檔

### 11. [SecureVerificationSystemGuide.md](SecureVerificationSystemGuide.md) - 安全驗證系統指南
- 企業級安全驗證系統
- 密碼安全和會話管理
- 速率限制和輸入驗證
- 安全監控和維護

### 12. [VerificationSystemSetup.md](VerificationSystemSetup.md) - 驗證系統設定
- 驗證系統設定步驟
- 環境變數配置
- 部署和測試流程
- 故障排除指南

## 📧 整合文檔

### 13. [EmailjsSetup.md](EmailjsSetup.md) - EmailJS 設定
- EmailJS 服務設定
- 郵件模板建立
- 環境變數配置
- 測試和故障排除

### 14. [SeoOptimization.md](SeoOptimization.md) - SEO 優化
- Next.js SEO 優化指南
- Metadata API 和 Open Graph
- 技術 SEO 和效能優化
- 監控和維護

## 📊 資料庫文檔

### 15. [AdminMessagesSystem.md](AdminMessagesSystem.md) - 站長消息系統
- 站長消息系統使用指南
- 資料庫結構和操作
- 管理介面和功能
- 部署和維護

### 16. [WordExpansionSummary.md](WordExpansionSummary.md) - 單字主題擴充總結
- 單字主題擴充詳情
- 技術細節和使用說明
- 資料庫結構和語言特性
- 未來規劃

## 🔄 遷移文檔

### 17. [AdminMessagesLocalDatabaseMigration.md](AdminMessagesLocalDatabaseMigration.md) - 管理員消息本地資料庫遷移
- 本地資料庫遷移指南
- 遷移步驟和注意事項
- 資料同步和驗證
- 故障排除

### 18. [JSONStorageImplementation.md](JSONStorageImplementation.md) - JSON 存儲實作
- JSON 存儲系統實作
- 資料結構和 API 設計
- 性能優化和維護
- 未來擴展

## 📈 分析文檔

### 19. [DATABASE_CONSISTENCY_ANALYSIS.md](DATABASE_CONSISTENCY_ANALYSIS.md) - 資料庫一致性分析
- 資料庫一致性分析報告
- 問題識別和解決方案
- 最佳實踐建議
- 監控和維護

### 20. [DATABASE_CONSISTENCY_REPORT.md](DATABASE_CONSISTENCY_REPORT.md) - 資料庫一致性報告
- 資料庫一致性檢查結果
- 問題統計和分析
- 修復建議和實施計劃
- 後續監控

### 21. [DETAILED_DATABASE_COMPARISON.md](DETAILED_DATABASE_COMPARISON.md) - 詳細資料庫比較
- 資料庫版本比較
- 結構差異分析
- 資料完整性檢查
- 遷移建議

## 🛠️ 工具文檔

### 22. [MockDataOptimization.md](MockDataOptimization.md) - Mock 資料優化
- Mock 資料優化策略
- 性能改進和最佳實踐
- 資料結構優化
- 測試和驗證

### 23. [NEW_WORD_ID_RULE_IMPLEMENTATION.md](NEW_WORD_ID_RULE_IMPLEMENTATION.md) - 新單字 ID 規則實作
- 新單字 ID 規則實作
- 規則定義和實作細節
- 測試和驗證流程
- 維護和更新

### 24. [TimeExpressionsImplementation.md](TimeExpressionsImplementation.md) - 時間表達實作
- 時間表達功能實作
- 資料結構和 API 設計
- 使用範例和最佳實踐
- 測試和維護

## 🔒 保護文檔

### 25. [SentenceSlotProtection.md](SentenceSlotProtection.md) - 句型拉霸機保護
- 句型拉霸機保護規則
- 保護範圍和限制
- 維護和更新流程
- 相關注意事項

## 📋 文檔使用指南

### 按角色分類

#### 新開發者
1. 先閱讀 [README.md](README.md) 了解專案概覽
2. 閱讀 [ProjectStructure.md](ProjectStructure.md) 了解架構
3. 閱讀 [DevelopmentGuide.md](DevelopmentGuide.md) 設定開發環境
4. 閱讀 [TechnicalGuide.md](TechnicalGuide.md) 了解技術細節

#### 系統管理員
1. 閱讀 [DeploymentGuide.md](DeploymentGuide.md) 了解部署流程
2. 閱讀 [SecurityGuide.md](SecurityGuide.md) 了解安全機制
3. 閱讀 [DatabaseGuide.md](DatabaseGuide.md) 了解資料庫管理
4. 閱讀 [EnvironmentVariables.md](EnvironmentVariables.md) 了解環境配置

#### 功能開發者
1. 閱讀 [FeaturesGuide.md](FeaturesGuide.md) 了解功能需求
2. 閱讀 [GamePagesGuide.md](GamePagesGuide.md) 了解遊戲頁面開發
3. 閱讀 [LearningContentSystem.md](LearningContentSystem.md) 了解學習內容系統
4. 閱讀 [DevelopmentGuide.md](DevelopmentGuide.md) 了解開發規範

#### 安全專家
1. 閱讀 [SecurityGuide.md](SecurityGuide.md) 了解整體安全架構
2. 閱讀 [SecureVerificationSystemGuide.md](SecureVerificationSystemGuide.md) 了解認證系統
3. 閱讀 [VerificationSystemSetup.md](VerificationSystemSetup.md) 了解驗證系統設定
4. 閱讀相關的安全文檔

### 按任務分類

#### 部署和維護
- [DeploymentGuide.md](DeploymentGuide.md)
- [EnvironmentVariables.md](EnvironmentVariables.md)
- [SecurityGuide.md](SecurityGuide.md)
- [DatabaseGuide.md](DatabaseGuide.md)

#### 功能開發
- [FeaturesGuide.md](FeaturesGuide.md)
- [GamePagesGuide.md](GamePagesGuide.md)
- [LearningContentSystem.md](LearningContentSystem.md)
- [DevelopmentGuide.md](DevelopmentGuide.md)

#### 問題排除
- [TechnicalGuide.md](TechnicalGuide.md)
- [DatabaseGuide.md](DatabaseGuide.md)
- [SecurityGuide.md](SecurityGuide.md)
- [DevelopmentGuide.md](DevelopmentGuide.md)

## 🔄 文檔維護

### 更新頻率
- **主要文檔**: 每月檢查和更新
- **技術文檔**: 每次重大更新後更新
- **功能文檔**: 功能變更時更新
- **安全文檔**: 安全更新時立即更新

### 文檔標準
- 使用 Markdown 格式
- 包含目錄和導覽
- 提供程式碼範例
- 包含故障排除指南
- 定期檢查連結有效性

### 貢獻指南
1. 遵循現有的文檔結構
2. 使用清晰的標題和段落
3. 提供實用的程式碼範例
4. 包含適當的警告和注意事項
5. 定期更新過時資訊

---

**📝 注意**: 本索引會定期更新，請確保使用最新版本。如有文檔問題或建議，請透過 GitHub Issues 回報。
