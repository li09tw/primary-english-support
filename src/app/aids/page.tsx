"use client";

import { useState } from "react";
import Link from "next/link";

// 教具資料結構
interface TeachingAid {
  id: string;
  title: string;
  description: string;
  href: string;
  iconBgColor: string;
  iconColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  iconPath: string;
}

// 教具資料
const teachingAids: TeachingAid[] = [
  {
    id: "memory-match",
    title: "中英文記憶配對",
    description:
      "翻開卡片尋找配對的英文單字和中文意思，記住卡片位置，配對成功可繼續翻牌，適合小組活動，訓練記憶力和觀察力",
    href: "/aids/memory-match",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
    buttonColor: "bg-green-500",
    buttonHoverColor: "hover:bg-green-600",
    iconPath:
      "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    id: "vocabulary-sort",
    title: "詞彙分類",
    description:
      "拖拽單字到正確的分類區域，6個預定義分類：動物、食物、顏色、數字、家庭、學校，培養邏輯思維和分類整理能力",
    href: "/aids/vocabulary-sort",
    iconBgColor: "bg-pink-100",
    iconColor: "text-pink-600",
    buttonColor: "bg-pink-500",
    buttonHoverColor: "hover:bg-pink-600",
    iconPath:
      "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    id: "find-different",
    title: "「找出不同」單字",
    description:
      "在多個單字中找出1個不同類別的單字，訓練觀察力和邏輯推理能力，可個人練習或小組競賽",
    href: "/aids/find-different",
    iconBgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    buttonColor: "bg-indigo-500",
    buttonHoverColor: "hover:bg-indigo-600",
    iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    id: "sentence-slot",
    title: "句型拉霸機",
    description:
      "拉霸機隨機選擇單字填入句型模板，6種句型模板，支援2-3個空格，創造有趣的句子，練習語法結構",
    href: "/aids/sentence-slot",
    iconBgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    buttonColor: "bg-orange-500",
    buttonHoverColor: "hover:bg-orange-600",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "yes-no-judgment",
    title: "「是/否」判斷",
    description:
      "遊戲提示判斷依據的「分類主題」，玩家需在時間限制內迅速判斷語言元素「是」或「否」符合給定主題，訓練快速反應、精準判斷及語言知識點即時提取能力",
    href: "/aids/yes-no-judgment",
    iconBgColor: "bg-teal-100",
    iconColor: "text-teal-600",
    buttonColor: "bg-teal-500",
    buttonHoverColor: "hover:bg-teal-600",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: "vocabulary-storm",
    title: "字彙風暴",
    description:
      "在限定時間內根據分類快速聯想相關單字，訓練單字聯想能力和快速反應，適合小組競賽，激發創意思維",
    href: "/aids/vocabulary-storm",
    iconBgColor: "bg-rose-100",
    iconColor: "text-rose-600",
    buttonColor: "bg-rose-500",
    buttonHoverColor: "hover:bg-rose-600",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

// 生成教具卡片的函數
const TeachingAidCard = ({ aid }: { aid: TeachingAid }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full">
    <div className="text-center flex-1 flex flex-col">
      <div
        className={`w-16 h-16 ${aid.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <svg
          className={`w-8 h-8 ${aid.iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={aid.iconPath}
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-black mb-2">{aid.title}</h3>
      <p className="text-black text-sm mb-4 flex-1">{aid.description}</p>
      <Link
        href={aid.href}
        className={`block w-full px-4 py-2 ${aid.buttonColor} text-white rounded-lg ${aid.buttonHoverColor} transition-colors text-center mt-auto`}
      >
        進入遊戲
      </Link>
    </div>
  </div>
);

export default function AidsPage() {
  return (
    <div className="min-h-screen bg-primary-blue">
      <div className="pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 頁面標題 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">電子教具</h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              透過互動式遊戲和活動，讓英語學習變得更加有趣和有效
            </p>
          </div>

          {/* 電子教具型態 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachingAids.map((aid) => (
              <TeachingAidCard key={aid.id} aid={aid} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
