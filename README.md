# Primary English Support

一個專為小學英語教學設計的數位化支援平台，結合了遊戲化學習方法和多媒體教學資源。

## 🏗️ 架構

本專案採用混合架構設計：

- **前端**: Next.js 14 + TypeScript + Tailwind CSS，部署在 Vercel
- **API 閘道**: Cloudflare Worker 作為 D1 和 R2 的 API 閘道
- **資料庫**: Cloudflare D1 (SQLite)
- **檔案存儲**: Cloudflare R2

```
Vercel (Next.js) → Cloudflare Worker API Gateway → Cloudflare D1/R2
```

## 🚀 快速開始

### 前置需求

- Node.js 18+
- npm 或 yarn
- Cloudflare 帳戶
- Vercel 帳戶

### 本地開發

1. **克隆專案**
   ```bash
   git clone https://github.com/your-username/primary-english-support.git
   cd primary-english-support
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定環境變數**
   ```bash
   # 創建 .env.local 文件
   cat > .env.local << EOF
   CLOUDFLARE_WORKER_URL=http://localhost:8787
   CLOUDFLARE_API_SECRET=local-dev-secret
   NODE_ENV=development
   EOF
   ```

4. **啟動 Cloudflare Worker 本地開發**
   ```bash
   npm run dev:worker
   ```

5. **啟動 Next.js 開發伺服器**
   ```bash
   npm run dev
   ```

6. **開啟瀏覽器**
   訪問 [http://localhost:3000](http://localhost:3000)

## 📚 功能特色

### 🎮 遊戲化學習
- **記憶配對遊戲**: 強化詞彙記憶
- **語法修正遊戲**: 提升語法準確性
- **詞彙分類遊戲**: 建立詞彙關聯
- **句子接龍遊戲**: 訓練語句建構能力

### 📖 教學輔具
- **互動式課件**: 多媒體教學資源
- **進度追蹤**: 學習成果監控
- **個人化學習**: 適應性學習路徑

### 🎯 年級適配
- 支援小學一年級到六年級
- 根據年級調整內容難度
- 符合各年級學習目標

## 🚀 部署

### 自動部署（推薦）

本專案採用 GitHub + Vercel 的自動部署方式：

1. **部署 Cloudflare Worker API 閘道**
   ```bash
   npm run deploy:worker
   ```

2. **設定 Vercel 專案**
   - 在 Vercel 上創建專案並連接到 GitHub 倉庫
   - 設定必要的環境變數

3. **推送代碼觸發部署**
   ```bash
   git add .
   git commit -m "feat: 更新功能"
   git push origin main
   ```

詳細部署說明請參考 [GitHub + Vercel 部署指南](doc/GitHubVercelDeployment.md)。

## 🔧 開發

### 專案結構

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API 路由
│   ├── games/          # 遊戲頁面
│   ├── aids/           # 教學輔具頁面
│   └── garden/         # 管理介面
├── components/          # 共用組件
├── lib/                 # 工具函數和配置
└── types/               # TypeScript 類型定義
```

### 技術棧

- **前端框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **資料庫**: Cloudflare D1
- **檔案存儲**: Cloudflare R2
- **部署**: Vercel + Cloudflare Workers

### 開發腳本

- `npm run dev`: 啟動 Next.js 開發伺服器
- `npm run dev:worker`: 啟動 Cloudflare Worker 本地開發
- `npm run build`: 建置專案
- `npm run deploy:worker`: 部署 Cloudflare Worker
- `npm run deploy:vercel`: 部署到 Vercel

## 📖 文檔

- [GitHub + Vercel 部署指南](doc/GitHubVercelDeployment.md)
- [專案結構說明](doc/ProjectStructure.md)
- [遊戲頁面指南](doc/GamePagesGuide.md)
- [架構說明](doc/MigrationSummary.md)
- [SEO 優化指南](doc/SeoOptimization.md)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 開發流程

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件。

## 📞 聯絡

如有問題或建議，請透過以下方式聯絡：

- 提交 [Issue](https://github.com/your-username/primary-english-support/issues)
- 發送郵件至: your-email@example.com

---

**Primary English Support** - 讓英語學習更有趣、更有效！
