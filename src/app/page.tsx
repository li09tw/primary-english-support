"use client";

import Link from "next/link";
import AdminMessageCard from "@/components/AdminMessageCard";
import { AdminMessage } from "@/types";

// 最新消息資料 - 直接在此新增消息
const messages: AdminMessage[] = [
  {
    id: "1",
    title: "歡迎使用白板英語遊戲室",
    content:
      "我們提供的英語學習遊戲方法以及數位遊戲教具，讓您的課堂更加生動有趣。所有遊戲都經過精心設計，適合國小英語教學使用。完全免費！不需要登入即可使用！2025年的下半年，將會運用 kahoot和 Wordwall 整理和提供更多不同的練習，並在網站裡更新。電子教具的下次大改版將會是2026年暑假，請大家敬請期待！",
    is_pinned: true,
    published_at: new Date("2025-07-10"),
  },
  {
    id: "2",
    title: "巨型拉霸機上線！",
    content:
      "選定主題之後，代名詞和主題用詞在部分句型中會更換，讓同學有更多練習的機會。",
    is_pinned: false,
    published_at: new Date("2025-07-31"),
  },
  {
    id: "3",
    title: "詞彙分類上線！有電子白版和平板模式！",
    content:
      "電子白版模式最多可以支援3位同學一起玩，每個單字都會出現藍色和綠色，只要點選即可完成分類。平板電腦模式則適用於同學個人使用，「拖曳」單字到顏色框框內即可分類成功！請注意，遊戲結束後，不會自動提醒同學是否分類正確，因為本遊戲是支援老師上課使用唷！",
    is_pinned: true,
    published_at: new Date("2025-08-05"),
  },
  {
    id: "4",
    title: "中英文記憶配對",
    content: "國小常見單字都可以玩啦！如果老師覺得單字量不夠，歡迎來信建議。 ",
    is_pinned: false,
    published_at: new Date("2025-10-04"),
  },
];

export default function Home() {
  // 結構化資料
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "白板英語遊戲室",
    description:
      "豐富的英語學習遊戲，讓國小英語課堂更加生動有趣，提升教學效果。",
    url: "https://zsprimaryenglishsupport.com",
    logo: "https://zsprimaryenglishsupport.com/logo.png",
    sameAs: ["https://zsprimaryenglishsupport.com"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "TW",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://zsprimaryenglishsupport.com/contact",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "英語學習遊戲",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "英語學習遊戲",
            description: "豐富的英語學習遊戲，讓課堂更加生動有趣",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "英語學習遊戲",
            description: "多樣化的學習遊戲，配合課本內容",
          },
        },
      ],
    },
  };

  return (
    <div className="min-h-screen">
      {/* 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="bg-primary-blue text-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img
              src="/hero-english-digital-tools.gif"
              alt="英語數位教具展示動畫"
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxHeight: "400px" }}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            白板英語遊戲室
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-blue-dark">
            豐富的英語學習遊戲，讓課堂更生動有趣
          </p>
        </div>
      </section>

      {/* 重要聲明 Section */}
      <section className="py-8 bg-yellow-50 border-b-2 border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                重要聲明：本網站僅供非營利、教育目的使用。
                <br />
                遊戲內容設計靈活，可配合各版本課本使用。
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 站長消息 Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">最新消息</h2>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages
                .sort((a, b) => {
                  // 先按 is_pinned 排序，置頂消息優先
                  if (a.is_pinned && !b.is_pinned) return -1;
                  if (!a.is_pinned && b.is_pinned) return 1;
                  // 如果置頂狀態相同，按發布日期排序（新的在前）
                  return b.published_at.getTime() - a.published_at.getTime();
                })
                .slice(0, 6)
                .map((message) => (
                  <AdminMessageCard key={message.id} message={message} />
                ))}
            </div>
          ) : (
            <div className="text-center text-black py-8">
              目前沒有發布的消息
            </div>
          )}
        </div>
      </section>

      {/* 主要功能 Section */}
      <section className="py-16 bg-primary-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">主要功能</h2>
            <p className="text-lg text-black">我們提供多樣化的教學工具和資源</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 遊戲方法 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-secondary-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">遊戲庫</h3>
              <p className="text-black mb-4">
                豐富的英語學習遊戲，適合全教材，讓課堂更加生動有趣，提升學生的學習興趣和參與度。
              </p>
            </div>

            {/* 課本單字 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                課本單字
              </h3>
              <p className="text-black mb-4">
                配合課本內容的單字學習資源，幫助學生掌握核心詞彙，建立紮實的英語基礎。
              </p>
            </div>

            {/* 補充單字 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                補充單字
              </h3>
              <p className="text-black mb-4">
                擴展學生的詞彙量，提供課本以外的實用單字，豐富學生的英語表達能力。
              </p>
            </div>

            {/* 課本句型 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                課本句型
              </h3>
              <p className="text-black mb-4">
                系統化的句型練習，幫助學生理解語法結構，提升英語寫作和口語表達能力。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
