'use client';

import { useState, useEffect } from 'react';
import TeachingAidCard from '@/components/TeachingAidCard';
import { TeachingAid } from '@/types';
import { generateId } from '@/lib/utils';

// 範例教學輔具
const sampleAids: TeachingAid[] = [
  {
    id: generateId(),
    name: '動物單字學習卡',
    description: '包含常見動物的英文單字和圖片，幫助學生學習動物相關的英語詞彙。',
    subject: '英語',
    grade: '小學一年級',
    textbookReference: '康軒版英語課本 Unit 3',
    materials: ['動物圖片卡', '單字卡', '音檔'],
    instructions: [
      '展示動物圖片，讓學生說出中文名稱',
      '教導對應的英文單字發音',
      '進行單字配對練習',
      '播放音檔讓學生跟讀'
    ],
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
  },
  {
    id: generateId(),
    name: '顏色句型練習板',
    description: '透過顏色主題練習基本句型，如 "What color is it?" 和 "It is..."。',
    subject: '英語',
    grade: '小學二年級',
    textbookReference: '翰林版英語課本 Unit 2',
    materials: ['顏色卡片', '句型提示板', '互動白板'],
    instructions: [
      '展示不同顏色的物品',
      '教師示範句型：What color is it?',
      '學生回答：It is red/blue/green...',
      '進行角色互換練習'
    ],
    createdAt: new Date('2024-01-12T14:30:00'),
    updatedAt: new Date('2024-01-12T14:30:00'),
  },
  {
    id: generateId(),
    name: '日常對話情境卡',
    description: '模擬真實生活情境的對話練習，提升學生的口語表達能力。',
    subject: '英語',
    grade: '小學三年級',
    textbookReference: '南一版英語課本 Unit 5',
    materials: ['情境設定卡', '角色扮演道具', '對話腳本'],
    instructions: [
      '設定對話情境，如：在商店購物',
      '分配角色：店員、顧客',
      '學生根據腳本進行對話練習',
      '鼓勵學生自由發揮和表達'
    ],
    createdAt: new Date('2024-01-10T11:15:00'),
    updatedAt: new Date('2024-01-10T11:15:00'),
  },
];

export default function AidsPage() {
  const [aids, setAids] = useState<TeachingAid[]>([]);
  const [filteredAids, setFilteredAids] = useState<TeachingAid[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  useEffect(() => {
    // 從本地儲存讀取教學輔具，如果沒有則使用範例數據
    const savedAids = localStorage.getItem('teachingAids');
    if (savedAids) {
      setAids(JSON.parse(savedAids));
    } else {
      setAids(sampleAids);
      localStorage.setItem('teachingAids', JSON.stringify(sampleAids));
    }
  }, []);

  useEffect(() => {
    // 篩選教學輔具
    let filtered = aids;
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(aid => aid.subject === selectedSubject);
    }
    
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(aid => aid.grade === selectedGrade);
    }
    
    setFilteredAids(filtered);
  }, [aids, selectedSubject, selectedGrade]);

  const subjects = ['all', ...Array.from(new Set(aids.map(aid => aid.subject)))];
  const grades = ['all', ...Array.from(new Set(aids.map(aid => aid.grade)))];

  const subjectLabels = {
    'all': '全部',
    '英語': '英語',
  };

  const gradeLabels = {
    'all': '全部',
    '小學一年級': '小學一年級',
    '小學二年級': '小學二年級',
    '小學三年級': '小學三年級',
    '小學四年級': '小學四年級',
    '小學五年級': '小學五年級',
    '小學六年級': '小學六年級',
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">教學輔具</h1>
          <p className="text-xl text-gray-600">
            多樣化的教學輔具，配合課本內容，幫助教師更好地傳授知識
          </p>
        </div>

        {/* 篩選器 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 科目篩選 */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                科目
              </label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subjectLabels[subject as keyof typeof subjectLabels]}
                  </option>
                ))}
              </select>
            </div>

            {/* 年級篩選 */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                年級
              </label>
              <select
                id="grade"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {gradeLabels[grade as keyof typeof gradeLabels]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 教學輔具列表 */}
        {filteredAids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAids.map((aid) => (
              <TeachingAidCard key={aid.id} aid={aid} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">沒有找到符合條件的教學輔具</h3>
            <p className="text-gray-500">請嘗試調整篩選條件</p>
          </div>
        )}

        {/* 統計資訊 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">統計資訊</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{aids.length}</div>
              <div className="text-sm text-gray-600">總輔具數量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {aids.filter(a => a.grade.includes('一年級')).length}
              </div>
              <div className="text-sm text-gray-600">一年級輔具</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {aids.filter(a => a.grade.includes('二年級')).length}
              </div>
              <div className="text-sm text-gray-600">二年級輔具</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {aids.filter(a => a.grade.includes('三年級')).length}
              </div>
              <div className="text-sm text-gray-600">三年級輔具</div>
            </div>
          </div>
        </div>

        {/* 課本參考資訊 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">課本參考</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <h4 className="font-medium text-pink-800 mb-2">康軒版</h4>
              <p className="text-sm text-pink-600">適用於多個年級</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">翰林版</h4>
              <p className="text-sm text-purple-600">適用於多個年級</p>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-lg">
              <h4 className="font-medium text-rose-800 mb-2">南一版</h4>
              <p className="text-sm text-rose-600">適用於多個年級</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
