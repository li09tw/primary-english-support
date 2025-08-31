/**
 * @fileoverview 站長消息 Mock 資料庫檢視頁面
 * @modified 2024-01-XX XX:XX - 正在修改中
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 建立站長消息的 mock 資料庫檢視功能
 */

"use client";

import { useState, useEffect } from "react";
import { AdminMessage } from "@/types";

export default function TestAdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // 格式化日期顯示（只顯示年月日）
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    // 載入本地儲存的站長消息
    const savedMessages = localStorage.getItem("adminMessages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        setMessages([]);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            站長消息 Mock 資料庫檢視
          </h1>
          <p className="text-black mb-4">
            此頁面用於檢視站長消息的 mock 資料庫內容。您可以在 garden
            管理者頁面中管理這些消息。
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              使用說明
            </h3>
            <ul className="text-blue-700 space-y-1">
              <li>
                • 前往{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">/garden</code>{" "}
                頁面管理站長消息
              </li>
              <li>• 可以新增、編輯、刪除和發布/下架消息</li>
              <li>• 所有變更會即時反映在此頁面</li>
              <li>• 日期格式：YYYY/MM/DD</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-500 text-lg mb-4">目前沒有站長消息</div>
              <p className="text-gray-400">
                前往{" "}
                <a href="/garden" className="text-blue-600 hover:underline">
                  garden 管理者頁面
                </a>{" "}
                新增第一則消息
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  message.is_published ? "border-green-500" : "border-red-500"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black pr-4">
                    {message.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        message.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {message.is_published ? "已發布" : "未發布"}
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none mb-4">
                  <div className="whitespace-pre-wrap text-black leading-relaxed">
                    {message.content}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>創建時間：{formatDate(message.createdAt)}</span>
                  <span className="text-xs">ID: {message.id}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/garden"
            className="inline-flex items-center px-6 py-3 bg-primary-blue-dark text-white font-medium rounded-md hover:bg-primary-blue-light focus:outline-none focus:ring-2 focus:ring-primary-blue-light focus:ring-offset-2 transition-colors duration-200"
          >
            前往管理者頁面
          </a>
        </div>
      </div>
    </div>
  );
}
