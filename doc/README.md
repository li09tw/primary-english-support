# Z的國小英語支援 (ZPES) - Primary English Support

## 🎯 專案概述

Primary English Support 是一個專為國小英語學習設計的數位平台，提供豐富的互動遊戲和管理功能，幫助學生在輕鬆愉快的環境中學習英語。

## ✨ 主要功能

### 🎮 遊戲方法管理
- **多種遊戲類型**: 單字學習、句型練習、口語訓練
- **難度分級**: 簡單、中等、困難三個等級
- **詳細說明**: 遊戲規則、材料準備、操作步驟
- **搜尋功能**: 依關鍵字、分類、難度搜尋

- **電子教具**: 圖像記憶配對、詞彙分類、句型拉霸機
- **課本參考**: 相關課本和章節資訊
- **操作說明**: 材料準備和使用方法
- **分類管理**: 依科目和年級分類

### 🌱 管理花園
- **統一管理**: 所有管理功能的集中入口
- **安全認證**: 企業級安全驗證系統
- **權限管理**: 不同層級的存取權限
- **即時更新**: 即時反映資料變更

### 📧 聯絡系統
- **聯絡表單**: 用戶友善的聯絡介面
- **郵件服務**: 使用 EmailJS 發送郵件
- **表單驗證**: 前端和後端驗證
- **自動回覆**: 可設定自動回覆功能

## 🏗️ 技術架構

### 前端技術
- **Next.js 14**: React 框架，使用 App Router
- **TypeScript**: 類型安全的 JavaScript
- **Tailwind CSS**: 現代化 CSS 框架
- **響應式設計**: 支援各種裝置尺寸

### 後端技術
- **Vercel**: 前端部署平台
- **Cloudflare Worker**: API 閘道
- **Cloudflare D1**: SQLite 資料庫
- **Cloudflare R2**: 物件存儲

### 安全特性
- **密碼雜湊**: 使用 bcrypt 進行安全雜湊
- **會話管理**: 安全的 HTTP-only cookies
- **速率限制**: 防止暴力破解攻擊
- **XSS 防護**: 輸入清理和輸出編碼

## 🚀 快速開始

### 1. 環境要求
- Node.js 18+ 
- npm 或 yarn
- Cloudflare 帳戶
- Vercel 帳戶

### 2. 安裝依賴
```bash
npm install
```

### 3. 環境變數設定
創建 `.env.local` 文件：
```bash
# Cloudflare 配置
CLOUDFLARE_WORKER_URL=http://localhost:8787
CLOUDFLARE_API_SECRET=local-dev-secret
NODE_ENV=development

# EmailJS 配置
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. 啟動開發環境
```bash
# 啟動完整開發環境
npm run dev:full

# 或分別啟動
npm run dev:worker  # Cloudflare Worker
npm run dev         # Next.js 應用
```

## 📚 文檔指南

### 主要文檔
- [專案結構說明](ProjectStructure.md) - 詳細的專案架構和技術細節
- [功能指南](FeaturesGuide.md) - 完整的功能說明和使用指南
- [部署指南](DeploymentGuide.md) - 部署和維護指南
- [環境變數設定](EnvironmentVariables.md) - 環境變數配置說明

### 技術文檔
- [技術指南](TechnicalGuide.md) - 整合的技術文檔
- [資料庫指南](DatabaseGuide.md) - 資料庫相關文檔
- [安全指南](SecurityGuide.md) - 安全相關文檔

### 開發文檔
- [開發指南](DevelopmentGuide.md) - 開發相關文檔
- [遊戲頁面指南](GamePagesGuide.md) - 遊戲頁面開發指南
- [學習內容系統](LearningContentSystem.md) - 學習內容系統文檔

## 🎮 遊戲頁面

### 已建立的遊戲
1. **圖像記憶配對** (`/aids/memory-match`) - 記憶配對遊戲
2. **詞彙分類** (`/aids/vocabulary-sort`) - 單字分類整理
3. **句型拉霸機** (`/aids/sentence-slot`) - 句型結構練習

### 遊戲特色
- **共用組件**: 統一的教材選擇介面
- **響應式設計**: 支援各種裝置
- **即時反饋**: 遊戲進度和得分追蹤
- **多樣化內容**: 豐富的單字和句型主題

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

## 📊 專案統計

- **遊戲方法**: 100+ 種英語學習遊戲
- **電子教具**: 3 種互動式電子教具
- **單字主題**: 17 個主題，500+ 個單字
- **句型模式**: 6 種句型模板
- **年級支援**: 國小 1-6 年級

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 📞 聯絡資訊

- **專案維護者**: Z的國小英語支援團隊
- **聯絡方式**: 透過網站聯絡表單
- **問題回報**: 請使用 GitHub Issues

## 🙏 致謝

感謝所有貢獻者和使用者的支持，讓這個專案能夠持續發展和改進。

---

**⚠️ 重要提醒**: 本專案專為國小英語學習設計，請確保使用環境符合相關教育法規和隱私保護要求。
