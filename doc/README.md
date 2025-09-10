# Primary English Support 專案文檔

## 📚 文檔導覽

本專案是一個專為小學英語教學設計的支援平台，提供遊戲方法、教學輔具和相關資源管理功能。

### 🏗️ 技術架構
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **部署**: Vercel (前端) + Cloudflare Worker (API 閘道)
- **資料庫**: Cloudflare D1 (SQLite)
- **檔案存儲**: Cloudflare R2
- **郵件服務**: EmailJS

## 📖 文檔分類

### 🏗️ 架構與部署
- **[專案結構說明](ProjectStructure.md)** - 完整的專案架構說明
- **[部署指南](DeploymentGuide.md)** - 從本地開發到生產環境的完整部署流程
- **[環境變數設定](EnvironmentVariables.md)** - 本地開發和生產環境的環境變數配置

### 🎯 功能與使用
- **[功能指南](FeaturesGuide.md)** - 各項功能的詳細使用說明和開發指南
- **[遊戲頁面導覽](GamePagesGuide.md)** - 電子教具遊戲頁面的詳細說明
- **[站長消息系統](AdminMessagesSystem.md)** - 站長消息系統的使用指南

### 🔧 技術與設定
- **[EmailJS 設定](EmailjsSetup.md)** - 郵件服務的設定指南
- **[SEO 優化](SeoOptimization.md)** - 搜尋引擎優化指南
- **[安全驗證系統](SecureVerificationSystemGuide.md)** - 安全驗證系統的詳細說明
- **[驗證系統設定](VerificationSystemSetup.md)** - 驗證系統的設定指南

### 📊 資料與內容
- **[學習內容系統](LearningContentSystem.md)** - 學習內容系統的技術文檔
- **[單字主題擴充總結](WordExpansionSummary.md)** - 單字主題擴充的詳細記錄
- **[時間表達實現](TimeExpressionsImplementation.md)** - 時間表達主題的實現說明

### 🛠️ 維護與故障排除
- **[D1 資料庫故障排除](D1DatabaseTroubleshooting.md)** - D1 資料庫問題的解決方案
- **[句型拉霸機保護說明](SentenceSlotProtection.md)** - 句型拉霸機功能的保護狀態

## 🚀 快速開始

### 本地開發
```bash
# 1. 安裝依賴
npm install

# 2. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 設定必要的環境變數

# 3. 啟動開發環境
npm run dev:full
```

### 部署到生產環境
```bash
# 1. 部署 Cloudflare Worker
npm run deploy:worker

# 2. 設定 Vercel 環境變數
# 在 Vercel Dashboard 中設定 CLOUDFLARE_WORKER_URL 和 CLOUDFLARE_API_SECRET

# 3. 部署到 Vercel
npm run deploy:vercel
```

## 📁 專案結構

```
primary-english-support/
├── src/                    # 主要源碼
│   ├── app/               # Next.js App Router
│   ├── components/        # 共用組件
│   ├── lib/              # 工具函數和配置
│   └── types/            # TypeScript 類型定義
├── functions/            # Cloudflare Worker 函數
├── scripts/              # 部署和工具腳本
├── doc/                  # 專案文檔
└── public/               # 靜態資源
```

## 🎯 主要功能

### 1. 遊戲方法管理
- 新增、編輯、刪除遊戲方法
- 分類管理（單字學習、句型練習、口語訓練）
- 難度設定（簡單、中等、困難）

### 2. 教學輔具管理
- 輔具名稱、描述、科目、年級設定
- 課本參考資訊
- 材料和操作說明

### 3. 管理花園
- 統一的管理介面
- 站長消息系統
- 用戶認證和權限管理

## 🔧 開發指南

### 顏色規範
- 主色調: `#2b6b7a` (用於副標或 H3)
- 遵循 Typography and Color Guidelines

### 組件開發原則
- 使用 TypeScript 進行類型安全開發
- 保持組件結構清晰和可重用性
- 遵循 Next.js 14 App Router 最佳實踐

## 📞 聯絡資訊

如有問題或建議，請透過以下方式聯絡：
- 網站聯絡表單: `/contact`
- 管理介面: `/garden`

## 📄 授權

本專案採用 MIT 授權條款。

---

**最後更新**: 2024年12月
**版本**: 1.0.0
