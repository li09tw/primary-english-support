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
