"use client";

import { useState, useEffect } from "react";

// 外部連結類型定義
interface ExternalLink {
  id: string;
  title: string;
  url: string;
  platform: "wordwall" | "kahoot";
  description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  grade_level: string;
}

// 年級選項（國小三年級到國中九年級）
const gradeOptions = [
  { value: "grade3", label: "國小三年級", color: "bg-blue-100 text-blue-800" },
  { value: "grade4", label: "國小四年級", color: "bg-blue-100 text-blue-800" },
  { value: "grade5", label: "國小五年級", color: "bg-blue-100 text-blue-800" },
  { value: "grade6", label: "國小六年級", color: "bg-blue-100 text-blue-800" },
  {
    value: "grade7",
    label: "國中一年級",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "grade8",
    label: "國中二年級",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "grade9",
    label: "國中三年級",
    color: "bg-green-100 text-green-800",
  },
];

// 平台選項
const platformOptions = [
  {
    value: "kahoot",
    label: "Kahoot",
    icon: "🎯",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "wordwall",
    label: "Wordwall",
    icon: "🧩",
    color: "bg-blue-100 text-blue-800",
  },
];

// 範例資料陣列
const sampleLinks: ExternalLink[] = [
  // 國小三年級
  {
    id: "1",
    title: "國小三年級 - 基礎單字練習",
    url: "https://kahoot.it/challenge/123456",
    platform: "kahoot",
    description: "適合國小三年級學生的基礎英語單字練習",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade3",
  },
  {
    id: "2",
    title: "國小三年級 - 字母遊戲",
    url: "https://wordwall.net/play/abc123",
    platform: "wordwall",
    description: "國小三年級英文字母學習遊戲",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade3",
  },
  // 國小四年級
  {
    id: "3",
    title: "國小四年級 - 句型練習",
    url: "https://wordwall.net/play/456789",
    platform: "wordwall",
    description: "國小四年級句型練習遊戲",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade4",
  },
  {
    id: "4",
    title: "國小四年級 - 動詞時態",
    url: "https://kahoot.it/challenge/456789",
    platform: "kahoot",
    description: "國小四年級動詞時態練習",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade4",
  },
  // 國小五年級
  {
    id: "5",
    title: "國小五年級 - 閱讀理解",
    url: "https://kahoot.it/challenge/789012",
    platform: "kahoot",
    description: "國小五年級英語閱讀理解測驗",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade5",
  },
  {
    id: "6",
    title: "國小五年級 - 單字拼寫",
    url: "https://wordwall.net/play/789012",
    platform: "wordwall",
    description: "國小五年級單字拼寫練習",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade5",
  },
  // 國小六年級
  {
    id: "7",
    title: "國小六年級 - 文法總複習",
    url: "https://kahoot.it/challenge/101112",
    platform: "kahoot",
    description: "國小六年級文法重點總複習",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade6",
  },
  {
    id: "8",
    title: "國小六年級 - 聽力練習",
    url: "https://wordwall.net/play/101112",
    platform: "wordwall",
    description: "國小六年級英語聽力練習",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade6",
  },
  // 國中一年級
  {
    id: "9",
    title: "國中一年級 - 文法測驗",
    url: "https://kahoot.it/challenge/131415",
    platform: "kahoot",
    description: "國中一年級文法重點測驗",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade7",
  },
  {
    id: "10",
    title: "國中一年級 - 單字挑戰",
    url: "https://wordwall.net/play/131415",
    platform: "wordwall",
    description: "國中一年級單字挑戰遊戲",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade7",
  },
  // 國中二年級
  {
    id: "11",
    title: "國中二年級 - 時態練習",
    url: "https://kahoot.it/challenge/161718",
    platform: "kahoot",
    description: "國中二年級動詞時態綜合練習",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade8",
  },
  {
    id: "12",
    title: "國中二年級 - 閱讀測驗",
    url: "https://wordwall.net/play/161718",
    platform: "wordwall",
    description: "國中二年級英語閱讀理解測驗",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade8",
  },
  // 國中三年級
  {
    id: "13",
    title: "國中三年級 - 會考模擬",
    url: "https://kahoot.it/challenge/192021",
    platform: "kahoot",
    description: "國中三年級會考模擬測驗",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade9",
  },
  {
    id: "14",
    title: "國中三年級 - 綜合複習",
    url: "https://wordwall.net/play/192021",
    platform: "wordwall",
    description: "國中三年級英語綜合複習",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    grade_level: "grade9",
  },
];

export default function ExternalLinksPage() {
  const [links, setLinks] = useState<ExternalLink[]>(sampleLinks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("grade3");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "kahoot",
    "wordwall",
  ]);

  // 平台切換處理
  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // 根據選中年級和平台過濾連結
  const filteredLinks = links.filter((link) => {
    const gradeMatch = link.grade_level === selectedGrade;
    const platformMatch = selectedPlatforms.includes(link.platform);
    return gradeMatch && platformMatch;
  });

  // 平台圖標和顏色
  const getPlatformInfo = (platform: string) => {
    const platformOption = platformOptions.find((p) => p.value === platform);
    return {
      icon: platformOption?.icon || "🔗",
      color: platformOption?.color || "bg-gray-100 text-gray-800",
      name: platformOption?.label || "其他",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-primary-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-pink mx-auto mb-4"></div>
            <p className="text-black">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 bg-primary-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">載入失敗</h3>
            <p className="text-black mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-secondary-pink text-black rounded-lg hover:bg-white hover:text-primary-blue transition-colors"
            >
              重新載入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-primary-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            Wordwall/Kahoot
          </h1>
          <p className="text-xl text-black">
            精選的 Wordwall 和 Kahoot 學習資源
          </p>
        </div>

        {/* 年級選擇 */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-black mb-4 text-center">
              選擇年級
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {gradeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="grade"
                    value={option.value}
                    checked={selectedGrade === option.value}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 text-center ${
                      selectedGrade === option.value
                        ? `${option.color} border-current shadow-md`
                        : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 平台選擇 */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-black mb-4 text-center">
              選擇平台
            </h2>
            <div className="flex justify-center space-x-6">
              {platformOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(option.value)}
                    onChange={() => handlePlatformToggle(option.value)}
                    className="sr-only"
                  />
                  <div
                    className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedPlatforms.includes(option.value)
                        ? `${option.color} border-current shadow-md`
                        : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    <span className="font-medium flex items-center">
                      <span className="mr-2">{option.icon}</span>
                      {option.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 連結列表 */}
        {filteredLinks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-black mb-2">
              暫無 {gradeOptions.find((g) => g.value === selectedGrade)?.label}{" "}
              的
              {selectedPlatforms
                .map((p) => platformOptions.find((po) => po.value === p)?.label)
                .join(" / ")}{" "}
              連結
            </h3>
            <p className="text-black">此年級和平台的學習連結尚未添加</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.map((link) => {
              const platformInfo = getPlatformInfo(link.platform);

              return (
                <div
                  key={link.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    {/* 平台標籤 */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${platformInfo.color}`}
                      >
                        <span className="mr-2">{platformInfo.icon}</span>
                        {platformInfo.name}
                      </span>
                    </div>

                    {/* 連結標題 */}
                    <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
                      {link.title}
                    </h3>

                    {/* 連結描述 */}
                    {link.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {link.description}
                      </p>
                    )}

                    {/* 連結按鈕 */}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-secondary-pink text-black font-medium rounded-md hover:bg-white hover:text-primary-blue transition-colors duration-200 border-2 border-transparent hover:border-primary-blue"
                    >
                      <span className="mr-2">前往連結</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
