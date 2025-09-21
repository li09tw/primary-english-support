/**
 * @fileoverview Garden 登入重定向頁面 - 重定向到 Garden 主頁面進行驗證
 * @modified 2024-01-XX XX:XX - 簡化為重定向頁面，驗證由 AuthGuard 處理
 * @modified_by Assistant
 * @modification_type refactor
 * @status completed
 * @feature 重定向到 Garden 主頁面，由 AuthGuard 處理驗證
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GardenLoginPage() {
  const router = useRouter();

  // 直接重定向到 Garden 主頁面，由 AuthGuard 處理驗證
  useEffect(() => {
    router.push("/garden");
  }, [router]);

  return (
    <div className="min-h-screen bg-primary-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Garden 管理介面
          </h1>
          <p className="text-gray-600 mb-6">正在重定向到驗證頁面...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
