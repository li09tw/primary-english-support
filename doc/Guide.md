# Primary English Support 項目導覽

## 項目概述
這是一個專為小學英語教學設計的支援平台，提供遊戲方法、教學輔具和相關資源管理功能。

## 技術架構
- **框架**: Next.js 13+ (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **部署**: Cloudflare Pages

## 目錄結構

### 主要頁面
- `/` - 首頁
- `/contact` - 聯絡我們
- `/games` - 遊戲方法
- `/aids` - 教學輔具
- `/garden` - 管理花園 ⭐

### 組件結構
- `src/components/` - 可重用組件
- `src/lib/` - 工具函數和配置
- `src/types/` - TypeScript 類型定義

### API 端點
- `/api/admin/` - 管理相關 API
- `/api/aids/` - 教學輔具 API
- `/api/contact/` - 聯絡表單 API
- `/api/games/` - 遊戲方法 API

## 重要功能

### 1. 遊戲方法管理
- 新增、編輯、刪除遊戲方法
- 分類管理（單字學習、句型練習、口語訓練）
- 難度設定（簡單、中等、困難）

### 2. 教學輔具管理
- 輔具名稱、描述、科目、年級設定
- 課本參考資訊
- 材料和操作說明

### 3. 站長消息系統
- 消息發布管理
- 優先級設定（一般、重要、緊急）
- 發布狀態控制

## 開發指南

### 顏色規範
- 主色調: `#2b6b7a` (用於副標或 H3)
- 遵循 Typography and Color Guidelines

### 組件開發原則
- 使用 TypeScript 進行類型安全開發
- 保持組件結構清晰和可重用性
- 遵循 Next.js 13+ App Router 最佳實踐

## 部署和維護

### 環境配置
- 參考 `doc/DEPLOYMENT.md` 了解部署流程
- 參考 `doc/CLOUDFLARE_INTEGRATION.md` 了解 Cloudflare 整合
- 參考 `doc/EMAILJS_SETUP.md` 了解郵件服務配置

### SEO 優化
- 參考 `doc/SEO_OPTIMIZATION.md` 了解 SEO 最佳實踐

---

## 🎯 快速導覽

### 管理花園路徑
**路徑**: `/garden`  
**功能**: 管理介面，包含遊戲方法、教學輔具和站長消息的管理功能  
**檔案位置**: `src/app/garden/`  
**注意**: 此路徑替代了原本的 `/admin` 路徑，提供相同的管理功能但使用更友善的名稱

### 直接連結
- [管理花園](/garden) - 遊戲方法、教學輔具、站長消息管理
- [聯絡我們](/contact) - 聯絡表單
- [遊戲方法](/games) - 瀏覽遊戲方法
- [教學輔具](/aids) - 瀏覽教學輔具

---

## 🚀 部署流程

### 部署腳本說明

專案提供了多個部署腳本，位於 `scripts/` 目錄中，支援不同的部署需求：

#### 1. **單獨部署主題關聯**: 使用 `deploy-word-themes.sh`
**用途**: 只更新單字與主題的關聯關係
**適用場景**: 
- 新增單字後需要建立主題關聯
- 修正主題分類錯誤
- 快速更新特定主題的單字

**使用方法**:
```bash
./scripts/deploy-word-themes.sh
```

#### 2. **完整重建資料庫**: 使用 `deploy-d1-schema.sh`
**用途**: 重建整個資料庫結構和所有資料
**適用場景**:
- 首次部署資料庫
- 資料庫結構重大變更
- 需要重新建立所有單字和句型資料

**使用方法**:
```bash
./scripts/deploy-d1-schema.sh
```

#### 3. **一鍵完整部署**: 使用 `deploy.sh`
**用途**: 執行完整的專案部署流程
**包含步驟**:
1. 檢查部署需求
2. 建置 Next.js 應用
3. 部署 Cloudflare Worker
4. 部署 D1 資料庫結構
5. 部署單字主題關聯
6. 觸發 Vercel 自動部署

**使用方法**:
```bash
./scripts/deploy.sh
```

### 部署建議

#### 首次部署
```bash
# 1. 部署資料庫結構
./scripts/deploy-d1-schema.sh

# 2. 部署單字主題關聯
./scripts/deploy-word-themes.sh

# 3. 執行完整部署
./scripts/deploy.sh
```

#### 日常更新
```bash
# 只更新主題關聯
./scripts/deploy-word-themes.sh
```

#### 重大更新
```bash
# 重建整個資料庫
./scripts/deploy-d1-schema.sh
./scripts/deploy-word-themes.sh
```

### 資料庫內容

系統包含 24 個豐富的單字主題，涵蓋日常生活、學校、運動、食物等各個領域：

| 主題 | 單字數量 | 內容描述 |
|------|----------|----------|
| Sports | 35個 | 運動和體育活動 |
| Stationery | 40個 | 學校和辦公用品 |
| Fruits | 45個 | 各種水果 |
| Drinks | 50個 | 飲品和飲料 |
| Main Dishes | 50個 | 主菜和料理 |
| Furniture | 60個 | 家具和家居用品 |
| Countries | 80個 | 世界各國 |
| Ailments | 100個 | 疾病和症狀 |
| School Subjects | 100個 | 學校科目和活動 |

**總計**: 500+ 個單字，為學生提供豐富的詞彙學習資源。
