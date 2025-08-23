import type { Metadata } from "next";

// 基礎配置
const BASE_URL = "https://zsprimaryenglishsupport.com";
const SITE_NAME = "Z的國小英語支援(ZPES)";

// 通用 metadata 配置
export const baseMetadata: Metadata = {
  title: {
    default: "Z的國小英語支援(ZPES) - 英語教學輔具平台",
    template: "%s | Z的國小英語支援(ZPES)",
  },
  keywords: [
    "英語教學",
    "教學輔具",
    "英語遊戲",
    "小學英語",
    "數位教學",
    "英語學習",
  ],
  authors: [{ name: "Zora Li" }],
  creator: "Z的國小英語支援(ZPES)",
  publisher: "Z的國小英語支援(ZPES)",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(BASE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // 請替換為你的 Google Search Console 驗證碼
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Z的國小英語支援(ZPES)",
  },
};

// 各頁面的 metadata 配置
export const pageMetadata = {
  home: {
    title: "Z的國小英語支援 (ZPES) ",
    description:
      "為資源不足的學校提供數位化教學工具，讓每個孩子都能享受優質的英語學習體驗。",
    keywords: [
      "英語教學",
      "教學輔具",
      "英語遊戲",
      "小學英語",
      "數位教學",
      "英語學習",
    ],
    openGraph: {
      title: "Z的國小英語支援 (ZPES)",
      description:
        "為資源不足的學校提供數位化教學工具，讓每個孩子都能享受優質的英語學習體驗。",
      url: "/",
    },
    alternates: {
      canonical: "/",
    },
  },
  aids: {
    title: "教學輔具",
    description:
      "多樣化的英語教學輔具，配合課本內容，幫助教師更好地傳授知識，學生更容易理解英語概念。",
    keywords: [
      "英語教學輔具",
      "英語教具",
      "小學英語輔具",
      "英語教學工具",
      "英語學習資源",
    ],
    openGraph: {
      title: "教學輔具 - Z的國小英語支援",
      description:
        "多樣化的英語教學輔具，配合課本內容，幫助教師更好地傳授知識，學生更容易理解英語概念。",
      url: "/aids",
    },
    alternates: {
      canonical: "/aids",
    },
  },
  games: {
    title: "遊戲方法",
    description:
      "探索豐富的英語學習遊戲方法，涵蓋單字學習、句型練習和口語訓練，讓英語課堂更加生動有趣。",
    keywords: [
      "英語遊戲",
      "英語學習遊戲",
      "小學英語遊戲",
      "英語教學遊戲",
      "互動英語學習",
    ],
    openGraph: {
      title: "遊戲方法 - Z的國小英語支援(ZPES)",
      description:
        "探索豐富的英語學習遊戲方法，涵蓋單字學習、句型練習和口語訓練，讓英語課堂更加生動有趣。",
      url: "/games",
    },
    alternates: {
      canonical: "/games",
    },
  },
  contact: {
    title: "聯絡我們",
    description:
      "有任何建議或需要特定的英語教學輔具？歡迎透過聯絡表單與我們聯繫，我們會盡快回覆您的需求。",
    keywords: [
      "聯絡我們",
      "英語教學諮詢",
      "教學輔具需求",
      "英語教學建議",
      "客服支援",
    ],
    openGraph: {
      title: "聯絡我們 - Z的國小英語支援",
      description:
        "有任何建議或需要特定的英語教學輔具？歡迎透過聯絡表單與我們聯繫，我們會盡快回覆您的需求。",
      url: "/contact",
    },
    alternates: {
      canonical: "/contact",
    },
  },
  admin: {
    title: "管理介面",
    description:
      "管理英語教學輔具、遊戲方法和站長消息的管理介面，提供完整的內容管理功能。",
    keywords: [
      "管理介面",
      "內容管理",
      "教學輔具管理",
      "遊戲方法管理",
      "站長消息管理",
    ],
    openGraph: {
      title: "管理介面 - Z的國小英語支援",
      description:
        "管理英語教學輔具、遊戲方法和站長消息的管理介面，提供完整的內容管理功能。",
      url: "/admin",
    },
    alternates: {
      canonical: "/admin",
    },
  },
  apiTest: {
    title: "API 測試",
    description:
      "測試各種 API 端點的功能，包括管理員、遊戲方法、教學輔具和聯絡表單的 API 測試頁面。",
    keywords: ["API 測試", "接口測試", "功能測試", "開發工具", "調試工具"],
    openGraph: {
      title: "API 測試 - Z的國小英語支援",
      description:
        "測試各種 API 端點的功能，包括管理員、遊戲方法、教學輔具和聯絡表單的 API 測試頁面。",
      url: "/api-test",
    },
    alternates: {
      canonical: "/api-test",
    },
  },
  garden: {
    title: "花園管理員",
    description:
      "管理英語教學輔具、遊戲方法和站長消息的管理介面，提供完整的內容管理功能。",
    keywords: [
      "花園管理",
      "內容管理",
      "教學輔具管理",
      "遊戲方法管理",
      "站長消息管理",
    ],
    openGraph: {
      title: "花園管理 - Z的國小英語支援",
      description:
        "管理英語教學輔具、遊戲方法和站長消息的管理介面，提供完整的內容管理功能。",
      url: "/garden",
    },
    alternates: {
      canonical: "/garden",
    },
  },
  privacy: {
    title: "隱私權政策",
    description:
      "Z的國小英語支援(ZPES) 的隱私權政策，說明我們如何收集、使用和保護您的個人資訊，以及您擁有的權利和選擇。",
    keywords: [
      "隱私權政策",
      "個人資料保護",
      "Cookie 政策",
      "資料使用說明",
      "隱私保護",
    ],
    openGraph: {
      title: "隱私權政策 - Z的國小英語支援",
      description:
        "Z的國小英語支援(ZPES) 的隱私權政策，說明我們如何收集、使用和保護您的個人資訊，以及您擁有的權利和選擇。",
      url: "/privacy",
    },
    alternates: {
      canonical: "/privacy",
    },
  },
};

// 生成完整 metadata 的函數
export function generateMetadata(pageKey: keyof typeof pageMetadata): Metadata {
  const pageMeta = pageMetadata[pageKey];

  return {
    ...baseMetadata,
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords,
    openGraph: {
      ...baseMetadata.openGraph,
      ...pageMeta.openGraph,
      siteName: SITE_NAME,
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: "/og-image.jpg", // 請添加你的 OG 圖片
          width: 1200,
          height: 630,
          alt: `${pageMeta.title} - Z的國小英語支援(ZPES) 英語教學輔具平台`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageMeta.title,
      description: pageMeta.description,
      images: ["/og-image.jpg"], // 請添加你的 Twitter 圖片
    },
    alternates: pageMeta.alternates,
  };
}

// 通用 OpenGraph 配置
export const commonOpenGraph = {
  siteName: SITE_NAME,
  locale: "zh_TW",
  type: "website",
  images: [
    {
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Z的國小英語支援(ZPES) 英語教學輔具平台",
    },
  ],
};

// 通用 Twitter 配置
export const commonTwitter = {
  card: "summary_large_image",
  images: ["/og-image.jpg"],
};
