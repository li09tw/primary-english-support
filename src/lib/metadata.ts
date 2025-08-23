import type { Metadata } from "next";

// 基礎配置
const BASE_URL = "https://zsprimaryenglishsupport.com";
const SITE_NAME = "Z的國小英語支援(ZPES)";

// 通用 metadata 配置
export const metadata: Metadata = {
  title: "Z的國小英語支援 - 遊戲庫",
  description: "提供豐富的英語學習遊戲和教學輔具，適合全教材，讓國小英語課堂更加生動有趣，提升教學效果。",
  keywords: [
    "國小英語",
    "英語教學",
    "英語遊戲",
    "教學輔具",
    "英語學習",
    "國小教育",
    "英語課堂",
    "教學資源",
    "遊戲庫",
    "全教材"
  ],
  authors: [{ name: "Z的國小英語支援" }],
  creator: "Z的國小英語支援",
  publisher: "Z的國小英語支援",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://primary-english-support.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Z的國小英語支援 - 遊戲庫",
    description: "提供豐富的英語學習遊戲和教學輔具，適合全教材，讓國小英語課堂更加生動有趣，提升教學效果。",
    url: "https://primary-english-support.vercel.app",
    siteName: "Z的國小英語支援",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Z的國小英語支援",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z的國小英語支援 - 遊戲庫",
    description: "提供豐富的英語學習遊戲和教學輔具，適合全教材，讓國小英語課堂更加生動有趣，提升教學效果。",
    images: ["/og-image.jpg"],
  },
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
    google: "your-google-verification-code",
  },
};

// 各頁面的 metadata 配置
export const pageMetadata = {
  home: {
    title: "Z的國小英語支援 (ZPES)",
    description:
      "支援沒有拿到紙本教具的國小老師，讓每個孩子都能享受優質的英語學習體驗。",
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
        "支援沒有拿到紙本教具的國小老師，讓每個孩子都能享受優質的英語學習體驗。",
      url: "/",
    },
    alternates: {
      canonical: "/",
    },
  },
  games: {
    title: "遊戲庫",
    description:
      "探索豐富的英語學習遊戲方法和教學輔具，適合全教材，涵蓋單字學習、句型練習、口語訓練和教學輔具，讓英語課堂更加生動有趣。",
    keywords: [
      "英語遊戲",
      "英語學習遊戲",
      "小學英語遊戲",
      "英語教學遊戲",
      "互動英語學習",
      "教學輔具",
      "英語教學輔具",
      "遊戲庫",
      "全教材"
    ],
    openGraph: {
      title: "遊戲庫 - Z的國小英語支援",
      description:
        "探索豐富的英語學習遊戲方法和教學輔具，適合全教材，涵蓋單字學習、句型練習、口語訓練和教學輔具，讓英語課堂更加生動有趣。",
      url: "/games",
    },
    alternates: {
      canonical: "/games",
    },
  },

  contact: {
    title: "聯絡我們",
    description:
      "與Z的國小英語支援團隊聯繫，分享您的想法、建議或需求，我們很樂意為您提供協助。",
    keywords: [
      "聯絡我們",
      "英語教學支援",
      "教學輔具需求",
      "英語遊戲建議",
      "教學資源諮詢",
    ],
    openGraph: {
      title: "聯絡我們 - Z的國小英語支援",
      description:
        "與Z的國小英語支援團隊聯繫，分享您的想法、建議或需求，我們很樂意為您提供協助。",
      url: "/contact",
    },
    alternates: {
      canonical: "/contact",
    },
  },
  garden: {
    title: "花園管理員",
    description:
      "管理遊戲方法與教學輔具、站長消息的管理介面，提供完整的內容管理功能。",
    keywords: [
      "花園管理",
      "內容管理",
      "遊戲方法管理",
      "教學輔具管理",
      "站長消息管理",
    ],
    openGraph: {
      title: "花園管理員 - Z的國小英語支援",
      description:
        "管理遊戲方法與教學輔具、站長消息的管理介面，提供完整的內容管理功能。",
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
};

// 生成完整 metadata 的函數
export function generateMetadata(pageKey: keyof typeof pageMetadata): Metadata {
  const pageMeta = pageMetadata[pageKey];

  return {
    ...metadata,
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords,
    openGraph: {
      ...metadata.openGraph,
      ...pageMeta.openGraph,
      siteName: SITE_NAME,
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: "/og-image.jpg", // 請添加你的 OG 圖片
          width: 1200,
          height: 630,
          alt: `${pageMeta.title} - Z的國小英語支援(ZPES) 英語數位化教具`,
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
      alt: "Z的國小英語支援(ZPES) 英語數位化教具",
    },
  ],
};

// 通用 Twitter 配置
export const commonTwitter = {
  card: "summary_large_image",
  images: ["/og-image.jpg"],
};
