"use client";

import { AdminMessage } from "@/types";
import { formatDate } from "@/lib/utils";

interface AdminMessageCardProps {
  message: AdminMessage;
}

export default function AdminMessageCard({ message }: AdminMessageCardProps) {
  // 根據發布狀態和釘選狀態決定邊框顏色
  const getBorderColor = () => {
    if (message.is_pinned) return "border-yellow-400"; // 釘選消息用黃色邊框
    if (message.is_published) return "border-green-400"; // 已發布消息用綠色邊框
    return "border-red-400"; // 未發布消息用紅色邊框
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getBorderColor()} hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold text-black">{message.title}</h3>
          {message.is_pinned && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              釘選
            </span>
          )}
          {!message.is_published && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              未發布
            </span>
          )}
        </div>
      </div>

      <div className="prose prose-sm text-black mb-4">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-black">
        <span>發布時間：{formatDate(message.createdAt)}</span>
        {message.updatedAt && message.updatedAt !== message.createdAt && (
          <span className="text-gray-500">
            更新時間：{formatDate(message.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
