"use client";

import { AdminMessage } from "@/types";
import { formatDate } from "@/lib/utils";

interface AdminMessageCardProps {
  message: AdminMessage;
}

export default function AdminMessageCard({ message }: AdminMessageCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-400 hover:shadow-lg transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-black">{message.title}</h3>
      </div>

      <div className="prose prose-sm text-black mb-4">
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-black">
        <span>發布時間：{formatDate(message.createdAt)}</span>
        {message.updatedAt !== message.createdAt && (
          <span>更新時間：{formatDate(message.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}
