# Next.js SEO 優化指南

## 概述
本文件說明如何在 Next.js 13+ App Router 架構下進行 SEO 優化，提升網站在搜尋引擎的排名和可見性。

## 已實現的 SEO 優化功能

### 1. Metadata API 優化
- **動態標題模板**: 使用 `template: "%s | Z的國小英語支援(ZPES)"` 自動生成頁面標題
- **關鍵字優化**: 為每個頁面設定相關的關鍵字
- **描述優化**: 每個頁面都有獨特且吸引人的描述
- **作者和發布者資訊**: 明確標示內容來源

### 2. Open Graph 和 Twitter Card
- **社交媒體分享優化**: 確保在 Facebook、Twitter 等平台分享時有正確的預覽
- **圖片優化**: 設定適當的 OG 圖片尺寸和描述
- **多語言支援**: 設定 `locale: 'zh_TW'` 支援繁體中文

### 3. 技術 SEO
- **robots.txt**: 指導搜尋引擎爬蟲的訪問規則
- **sitemap.xml**: 自動生成網站地圖，幫助搜尋引擎索引
- **canonical URLs**: 避免重複內容問題
- **結構化資料**: 使用 JSON-LD 標記教育組織和服務資訊

### 4. 效能優化
- **圖片優化**: 支援 WebP 和 AVIF 格式
- **壓縮啟用**: 啟用 gzip 壓縮和 SWC 壓縮
- **安全標頭**: 設定適當的安全標頭防止 XSS 和點擊劫持

### 5. PWA 支援
- **manifest.json**: 支援漸進式網頁應用
- **圖示優化**: 多尺寸圖示支援各種設備
- **主題色彩**: 統一的品牌色彩設定

## 使用方法

### 基本頁面 SEO
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "頁面標題",
  description: "頁面描述",
  keywords: ["關鍵字1", "關鍵字2"],
  openGraph: {
    title: "Open Graph 標題",
    description: "Open Graph 描述",
    url: '/page-url',
  },
  alternates: {
    canonical: '/page-url',
  },
};
```

### 使用 SEOHead 組件
```typescript
import SEOHead from "@/components/SEOHead";

export default function Page() {
  return (
    <>
      <SEOHead
        title="頁面標題"
        description="頁面描述"
        keywords={["關鍵字1", "關鍵字2"]}
        type="article"
        publishedTime="2024-01-01T00:00:00Z"
      />
      {/* 頁面內容 */}
    </>
  );
}
```

## 需要手動配置的項目

### 1. 網域設定
- 將 `https://zsprimaryenglishsupport.com` 替換為實際網域
- 在 `metadataBase` 中設定正確的網域

### 2. Google Search Console
- 獲取 Google 驗證碼並替換 `your-google-verification-code`
- 提交 sitemap.xml 到 Google Search Console

### 3. 圖片資源
- 添加 `/og-image.jpg` (1200x630 像素)
- 添加各種尺寸的圖示檔案
- 添加 `/logo.png` 作為網站標誌

### 4. 分析工具
- 考慮添加 Google Analytics 4
- 考慮添加 Google Tag Manager
- 考慮添加 Facebook Pixel 等追蹤工具

## 進階 SEO 策略

### 1. 內容優化
- **關鍵字密度**: 確保重要關鍵字在內容中適當出現
- **標題層級**: 使用 H1、H2、H3 等標題標籤建立內容結構
- **內部連結**: 在相關內容間建立內部連結
- **圖片 alt 文字**: 為所有圖片添加描述性的 alt 文字

### 2. 技術優化
- **載入速度**: 使用 Next.js 的圖片優化和程式碼分割
- **行動裝置優化**: 確保網站在各種設備上都有良好體驗
- **無障礙性**: 遵循 WCAG 2.1 標準提升可訪問性

### 3. 本地化 SEO
- **語言標籤**: 正確設定 `lang="zh-TW"`
- **地區關鍵字**: 使用台灣地區相關的關鍵字
- **本地業務資訊**: 在結構化資料中包含台灣地址資訊

## 監控和維護

### 1. 定期檢查
- 使用 Google Search Console 監控索引狀態
- 檢查 Core Web Vitals 分數
- 監控關鍵字排名變化

### 2. 內容更新
- 定期更新 sitemap 的 `lastModified` 日期
- 根據搜尋趨勢調整關鍵字策略
- 持續優化頁面內容和結構

### 3. 技術維護
- 定期更新 Next.js 版本
- 檢查和修復任何 SEO 相關的錯誤
- 優化載入速度和使用者體驗

## 常見問題

### Q: 為什麼我的頁面沒有被 Google 索引？
A: 檢查以下項目：
- robots.txt 是否正確設定
- sitemap.xml 是否已提交到 Google Search Console
- 頁面是否有適當的 meta 標籤
- 網站是否可以被搜尋引擎爬蟲訪問

### Q: 如何提升頁面載入速度？
A: 使用 Next.js 的內建優化功能：
- 啟用圖片優化
- 使用程式碼分割
- 啟用壓縮
- 使用 CDN 加速

### Q: 如何優化行動裝置 SEO？
A: 確保：
- 響應式設計
- 快速載入速度
- 觸控友好的介面
- 適當的字體大小和間距

## 總結

透過以上 SEO 優化措施，你的 Next.js 專案已經具備了良好的搜尋引擎優化基礎。記住 SEO 是一個持續的過程，需要定期監控和優化。建議使用 Google Search Console 等工具來追蹤效果，並根據數據調整策略。
