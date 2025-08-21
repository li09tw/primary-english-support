'use client';

import { AdminMessage } from '@/types';
import { formatDate } from '@/lib/utils';

interface AdminMessageCardProps {
  message: AdminMessage;
}

export default function AdminMessageCard({ message }: AdminMessageCardProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityText = {
    low: '一般',
    medium: '重要',
    high: '緊急',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-400 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{message.title}</h3>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full border ${priorityColors[message.priority]}`}
        >
          {priorityText[message.priority]}
        </span>
      </div>
      
      <div className="prose prose-sm text-gray-600 mb-4">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>發布時間：{formatDate(message.createdAt)}</span>
        {message.updatedAt !== message.createdAt && (
          <span>更新時間：{formatDate(message.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}
