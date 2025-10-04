# 文檔索引

## 📚 文檔導覽

本索引提供了 Primary English Support 專案所有文檔的完整導覽，幫助開發者和使用者快速找到所需的資訊。

## 🎯 核心文檔

### 1. [README.md](README.md) - 專案總覽
- 專案概述和主要功能介紹
- 快速開始指南
- 技術架構簡介
- 開發工具和部署流程

## 📖 功能文檔

### 2. [FeaturesGuide.md](FeaturesGuide.md) - 功能指南
- 完整的功能說明和使用指南
- 遊戲方法管理系統
- 學習輔助系統（電子教具）
- 管理花園功能
- 聯絡系統和認證系統

### 3. [AdminMessagesSystem.md](AdminMessagesSystem.md) - 站長消息系統
- 站長消息系統使用指南
- 資料庫結構和操作
- 管理介面和功能
- 部署和維護

## 🔧 技術文檔

### 4. [TechnicalGuide.md](TechnicalGuide.md) - 技術指南
- 系統架構和核心組件
- API 設計和資料庫結構
- 安全機制和性能優化
- 故障排除和除錯工具

### 5. [DeploymentGuide.md](DeploymentGuide.md) - 部署指南
- 詳細的部署步驟
- 環境變數設定
- 故障排除和維護
- 性能優化和監控

### 6. [EmailjsSetup.md](EmailjsSetup.md) - EmailJS 設定
- EmailJS 服務設定
- 郵件模板建立
- 環境變數配置
- 測試和故障排除

## 📊 資料文檔

### 7. [WordExpansionSummary.md](WordExpansionSummary.md) - 單字主題擴充總結
- 單字主題擴充詳情
- 技術細節和使用說明
- 資料庫結構和語言特性
- 未來規劃

### 8. [JSON_Storage_Optimization.md](JSON_Storage_Optimization.md) - JSON 存儲優化
- JSON 存儲系統優化策略
- 性能改進和最佳實踐
- 資料結構優化
- 測試和驗證

## 🎯 快速導覽

### 按角色分類

#### 新開發者
1. 先閱讀 [README.md](README.md) 了解專案概覽
2. 閱讀 [TechnicalGuide.md](TechnicalGuide.md) 了解技術架構
3. 閱讀 [FeaturesGuide.md](FeaturesGuide.md) 了解功能需求
4. 閱讀 [DeploymentGuide.md](DeploymentGuide.md) 了解部署流程

#### 系統管理員
1. 閱讀 [DeploymentGuide.md](DeploymentGuide.md) 了解部署流程
2. 閱讀 [AdminMessagesSystem.md](AdminMessagesSystem.md) 了解管理功能
3. 閱讀 [EmailjsSetup.md](EmailjsSetup.md) 了解郵件服務設定
4. 閱讀 [TechnicalGuide.md](TechnicalGuide.md) 了解技術細節

#### 功能開發者
1. 閱讀 [FeaturesGuide.md](FeaturesGuide.md) 了解功能需求
2. 閱讀 [TechnicalGuide.md](TechnicalGuide.md) 了解技術實作
3. 閱讀 [WordExpansionSummary.md](WordExpansionSummary.md) 了解資料結構
4. 閱讀 [JSON_Storage_Optimization.md](JSON_Storage_Optimization.md) 了解存儲優化

### 按任務分類

#### 部署和維護
- [DeploymentGuide.md](DeploymentGuide.md) - 部署指南
- [EmailjsSetup.md](EmailjsSetup.md) - 郵件服務設定
- [TechnicalGuide.md](TechnicalGuide.md) - 技術指南

#### 功能開發
- [FeaturesGuide.md](FeaturesGuide.md) - 功能指南
- [AdminMessagesSystem.md](AdminMessagesSystem.md) - 管理系統
- [WordExpansionSummary.md](WordExpansionSummary.md) - 資料擴充

#### 問題排除
- [TechnicalGuide.md](TechnicalGuide.md) - 技術指南
- [DeploymentGuide.md](DeploymentGuide.md) - 部署指南
- [EmailjsSetup.md](EmailjsSetup.md) - 郵件服務設定

## 📋 文檔維護

### 更新頻率
- **核心文檔**: 每月檢查和更新
- **技術文檔**: 每次重大更新後更新
- **功能文檔**: 功能變更時更新
- **資料文檔**: 資料結構變更時更新

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

## ⚡ 快速指令

### 常用快速指令

#### 更新消息
- **指令**: 輸入「更新消息」
- **動作**: 直接打開 `src/app/page.tsx` 檔案
- **用途**: 快速編輯首頁最新消息陣列 (第 8-33 行)
- **說明**: 用於更新網站首頁顯示的站長消息

#### 更新連結
- **指令**: 輸入「更新連結」
- **動作**: 直接打開 `src/app/public-games/page.tsx` 檔案
- **用途**: 快速編輯 Kahoot/Wordwall 連結陣列 (第 58-220 行)
- **說明**: 用於更新公開遊戲頁面的外部連結

### 使用方式
1. 在聊天中直接輸入指令（如：「更新消息」或「更新連結」）
2. 系統會自動打開對應的檔案
3. 直接進行編輯和修改
4. 儲存後變更立即生效

## 🔄 快速更新指南

### 更新最新消息 Array

要更新網站首頁的最新消息，請修改以下檔案：

**主要更新路徑**：
- **`src/app/page.tsx`** (第 8-33 行) - 首頁最新消息陣列
  ```typescript
  const messages: AdminMessage[] = [
    {
      id: "1",
      title: "消息標題",
      content: "消息內容",
      is_pinned: false,
      published_at: new Date("2025-01-01"),
    },
    // ... 更多消息
  ];
  ```

**相關檔案**：
- **`src/types/index.ts`** - AdminMessage 類型定義
- **`src/components/AdminMessageCard.tsx`** - 消息卡片組件
- **`src/lib/json-storage.ts`** - JSON 存儲系統
- **`src/app/api/admin-messages/route.ts`** - API 路由

**更新步驟**：
1. 開啟 `src/app/page.tsx`
2. 找到 `messages` 陣列 (第 8-33 行)
3. 新增或修改消息物件
4. 確保 `id` 唯一，`published_at` 使用正確的日期格式
5. 儲存檔案，變更會立即生效

**注意事項**：
- 消息會按 `published_at` 日期排序顯示
- `is_pinned: true` 的消息會置頂顯示
- 日期格式：`new Date("YYYY-MM-DD")`
- 建議保持 3-6 條消息，避免首頁過於冗長

### 更新 Kahoot/Wordwall 連結 Array

要更新公開遊戲頁面的 Kahoot/Wordwall 連結，請修改以下檔案：

**主要更新路徑**：
- **`src/app/public-games/page.tsx`** (第 58-220 行) - 前端範例資料陣列
  ```typescript
  const sampleLinks: ExternalLink[] = [
    {
      id: "1",
      title: "連結標題",
      url: "https://kahoot.it/challenge/123456",
      platform: "kahoot", // 或 "wordwall"
      description: "連結描述",
      is_published: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      grade_level: "grade3", // grade3-grade9
    },
    // ... 更多連結
  ];
  ```

- **`src/app/api/public-games/route.ts`** (第 20-65 行) - API 模擬資料陣列
  ```typescript
  const mockExternalLinks: ExternalLink[] = [
    {
      id: "1",
      title: "連結標題",
      url: "https://wordwall.net/resource/example1",
      platform: "wordwall", // 或 "kahoot", "other"
      description: "連結描述",
      grade_level: "elementary_3_6", // 或 "junior_high_1"
      is_published: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    // ... 更多連結
  ];
  ```

**相關檔案**：
- **`src/app/public-games/page.tsx`** - 公開遊戲頁面組件
- **`src/app/api/public-games/route.ts`** - API 路由處理
- **`src/app/garden/page.tsx`** - 管理介面（可透過管理介面新增）

**更新步驟**：
1. 開啟 `src/app/public-games/page.tsx`
2. 找到 `sampleLinks` 陣列 (第 58-220 行)
3. 新增或修改連結物件
4. 確保 `id` 唯一，`platform` 為 "kahoot" 或 "wordwall"
5. 設定正確的 `grade_level` (grade3-grade9)
6. 儲存檔案，變更會立即生效

**注意事項**：
- 連結會按年級和平台分類顯示
- `is_published: true` 的連結才會顯示
- 支援的年級：grade3-grade9 (國小三年級到國中三年級)
- 支援的平台：kahoot、wordwall
- 建議保持每個年級 2-4 個連結，避免頁面過於冗長

---

**📝 注意**: 本索引會定期更新，請確保使用最新版本。如有文檔問題或建議，請透過 GitHub Issues 回報。
