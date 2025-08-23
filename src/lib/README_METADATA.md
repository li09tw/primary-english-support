# Metadata 配置說明

這個文件說明了如何為不同的頁面配置 metadata。

## 使用方法

### 1. 基本用法

```typescript
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("games");
```

### 2. 支援的頁面

- `"games"` - 遊戲庫頁面
- `"contact"` - 聯絡表單頁面
- `"privacy"` - 隱私政策頁面
- `"terms"` - 使用條款頁面

### 3. 頁面配置

每個頁面都有預設的 metadata 配置：

```typescript
games: {
  title: "遊戲庫",
  description: "豐富的英語學習遊戲和教學輔具，適合全教材，讓課堂更加生動有趣",
  keywords: ["英語遊戲", "教學輔具", "國小英語", "英語學習", "遊戲庫", "全教材"],
  openGraph: {
    title: "遊戲庫",
    description: "豐富的英語學習遊戲和教學輔具，適合全教材，讓課堂更加生動有趣",
  },
},
contact: {
  title: "聯絡我們",
  description: "有任何問題或建議，歡迎與我們聯絡",
  keywords: ["聯絡", "客服", "支援", "問題回報"],
  openGraph: {
    title: "聯絡我們",
    description: "有任何問題或建議，歡迎與我們聯絡",
  },
},
privacy: {
  title: "隱私政策",
  description: "了解我們如何保護您的個人資料",
  keywords: ["隱私", "個人資料", "資料保護", "隱私權"],
  openGraph: {
    title: "隱私政策",
    description: "了解我們如何保護您的個人資料",
  },
},
terms: {
  title: "使用條款",
  description: "使用本網站時請遵守相關條款",
  keywords: ["使用條款", "服務條款", "法律條款", "條款"],
  openGraph: {
    title: "使用條款",
    description: "使用本網站時請遵守相關條款",
  },
},
```

### 4. 自定義配置

如果需要自定義特定頁面的 metadata，可以傳入額外的配置：

```typescript
export const metadata: Metadata = generateMetadata("games", {
  title: "自定義標題",
  description: "自定義描述",
  keywords: ["自定義", "關鍵字"],
});
```

### 5. 注意事項

- 所有頁面都會繼承基本配置
- 自定義配置會覆蓋預設配置
- 確保每個頁面都有適當的 metadata
- 定期更新 metadata 以保持 SEO 效果

