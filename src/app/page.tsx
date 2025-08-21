'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminMessageCard from '@/components/AdminMessageCard';
import { AdminMessage } from '@/types';
import { generateId } from '@/lib/utils';

// 範例站長消息
const sampleMessages: AdminMessage[] = [
  {
    id: generateId(),
    title: '歡迎使用 PrimaryEnglishSupport！',
    content: '我們很高興為您提供這個英語教學輔具平台。這裡有豐富的遊戲方法和教學輔具，希望能幫助您創造更好的英語學習環境。\n\n如果您有任何建議或需要特定的輔具，歡迎透過聯絡表單與我們聯繫。',
    priority: 'high',
    isPublished: true,
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
  },
  {
    id: generateId(),
    title: '新增多個互動遊戲方法',
    content: '我們已經新增了 10 個新的互動遊戲方法，涵蓋單字學習、句型練習和口語訓練等不同面向。這些遊戲都經過精心設計，適合小學各年級的學生使用。\n\n您可以在遊戲方法頁面中找到這些新內容。',
    priority: 'medium',
    isPublished: true,
    createdAt: new Date('2024-01-10T14:30:00'),
    updatedAt: new Date('2024-01-10T14:30:00'),
  },
];

export default function Home() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);

  useEffect(() => {
    // 從本地儲存讀取消息，如果沒有則使用範例數據
    const savedMessages = localStorage.getItem('adminMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages(sampleMessages);
      localStorage.setItem('adminMessages', JSON.stringify(sampleMessages));
    }
  }, []);

  const publishedMessages = messages.filter(msg => msg.isPublished);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            英語教學輔具平台
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pink-100">
            為資源不足的學校提供數位化教學工具
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors duration-200"
            >
              探索遊戲方法
            </Link>
            <Link
              href="/aids"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200"
            >
              查看教學輔具
            </Link>
          </div>
        </div>
      </section>

      {/* 站長消息 Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">站長消息</h2>
            <p className="text-lg text-gray-600">了解我們的最新更新和重要資訊</p>
          </div>
          
          {publishedMessages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {publishedMessages.map((message) => (
                <AdminMessageCard key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              目前沒有發布的消息
            </div>
          )}
        </div>
      </section>

      {/* 主要功能 Section */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">主要功能</h2>
            <p className="text-lg text-gray-600">我們提供多樣化的教學工具和資源</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 遊戲方法 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">遊戲方法</h3>
              <p className="text-gray-600 mb-4">
                豐富的英語學習遊戲，讓課堂更加生動有趣，提升學生的學習興趣和參與度。
              </p>
              <Link
                href="/games"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                探索遊戲
              </Link>
            </div>

            {/* 教學輔具 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">教學輔具</h3>
              <p className="text-gray-600 mb-4">
                多樣化的教學輔具，配合課本內容，幫助教師更好地傳授知識，學生更容易理解。
              </p>
              <Link
                href="/aids"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
              >
                查看輔具
              </Link>
            </div>

            {/* 管理介面 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">管理介面</h3>
              <p className="text-gray-600 mb-4">
                專為管理員設計的介面，可以新增、編輯和管理遊戲方法、教學輔具和站長消息。
              </p>
              <Link
                href="/admin"
                className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-200"
              >
                進入管理
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 關於我們 Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">關於我們</h2>
              <p className="text-lg text-gray-600 mb-6">
                PrimaryEnglishSupport 致力於為資源不足的學校提供高品質的英語教學工具。
                我們相信每個孩子都應該有機會享受優質的英語學習體驗。
              </p>
              <p className="text-lg text-gray-600 mb-6">
                透過數位化技術，我們將傳統的紙本和塑膠教具轉化為互動式的電子工具，
                讓教學更加生動有趣，學習效果更加顯著。
              </p>
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                聯絡我們
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-3xl">PES</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">PrimaryEnglishSupport</h3>
                <p className="text-gray-600">
                  讓英語學習變得簡單、有趣、有效
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
