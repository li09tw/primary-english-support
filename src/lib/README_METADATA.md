# Metadata 配置說明

## 概述

這個項目使用統一的 metadata 配置文件 `src/lib/metadata.ts` 來管理所有頁面的 SEO 和社交媒體標籤。這樣做的好處是：

1. **集中管理**：所有頁面的 metadata 都在一個文件中
2. **易於維護**：修改時只需要更新一個地方
3. **一致性**：確保所有頁面使用相同的基礎配置
4. **類型安全**：使用 TypeScript 確保配置的正確性

## 文件結構

```
src/lib/metadata.ts          # 主要的 metadata 配置文件
src/lib/README_METADATA.md   # 本說明文件
```

## 使用方法

### 1. 在頁面中使用

對於普通的頁面組件，直接導入並使用：

```tsx
import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("aids");
```

### 2. 在 Layout 中使用

對於需要 metadata 的 client component，在父級 layout 中定義：

```tsx
// src/app/admin/layout.tsx
import type { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("admin");

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

## 可用的頁面配置

目前支援的頁面配置：

- `"home"` - 首頁
- `"aids"` - 教學輔具頁面
- `"games"` - 遊戲方法頁面
- `"contact"` - 聯絡我們頁面
- `"admin"` - 管理介面頁面
- `"apiTest"` - API 測試頁面

## 修改配置

### 修改頁面描述

要修改某個頁面的描述，編輯 `src/lib/metadata.ts` 文件中的 `pageMetadata` 對象：

```tsx
export const pageMetadata = {
  aids: {
    title: "教學輔具",
    description: "你的新描述文字", // 修改這裡
    // ... 其他配置
  },
  // ... 其他頁面
};
```

### 修改基礎配置

要修改所有頁面共用的配置（如網站名稱、關鍵字等），編輯 `baseMetadata` 對象：

```tsx
export const baseMetadata: Metadata = {
  title: {
    default: "你的新網站名稱", // 修改這裡
    template: "%s | 你的新網站名稱", // 修改這裡
  },
  // ... 其他配置
};
```

### 添加新頁面

要為新頁面添加 metadata 配置：

1. 在 `pageMetadata` 對象中添加新配置
2. 在頁面組件中使用 `generateMetadata("newPage")`

```tsx
// 在 metadata.ts 中添加
export const pageMetadata = {
  // ... 現有配置
  newPage: {
    title: "新頁面標題",
    description: "新頁面描述",
    keywords: ["關鍵字1", "關鍵字2"],
    openGraph: {
      title: "新頁面標題 - Z的國小英語支援(ZPES)",
      description: "新頁面描述",
      url: "/new-page",
    },
    alternates: {
      canonical: "/new-page",
    },
  },
};

// 在頁面組件中使用
export const metadata: Metadata = generateMetadata("newPage");
```

## 配置項目說明

每個頁面的 metadata 包含以下項目：

- **title**: 頁面標題
- **description**: 頁面描述（SEO 重要）
- **keywords**: 關鍵字陣列
- **openGraph**: Open Graph 標籤（Facebook、LinkedIn 等）
- **alternates**: 規範化 URL

## 注意事項

1. **Client Components**: 如果頁面是 client component（使用 "use client"），metadata 必須在 layout 或父級組件中定義
2. **圖片路徑**: 確保 `/og-image.jpg` 等圖片文件存在於 `public` 目錄中
3. **Google 驗證**: 記得替換 `verification.google` 中的驗證碼
4. **網域**: 確保 `BASE_URL` 設置為正確的網域

## 最佳實踐

1. **描述長度**: 保持描述在 150-160 字符以內
2. **關鍵字**: 使用相關且自然的關鍵字，避免關鍵字堆砌
3. **一致性**: 確保所有頁面的 metadata 風格一致
4. **測試**: 使用 Facebook 的 Sharing Debugger 和 Twitter 的 Card Validator 測試社交媒體標籤

