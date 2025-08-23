"use client";

import { useState } from "react";

export default function DebugPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEnvironment = async () => {
    setLoading(true);
    try {
      // 直接檢查環境變數（客戶端無法直接訪問，但可以通過 API 檢查）
      const response = await fetch("/api/debug");
      const data = await response.json();
      setEnvInfo(data);
    } catch (error) {
      console.error("Failed to check environment:", error);
      setEnvInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">環境診斷</h1>
          <p className="text-lg text-black mb-6">
            檢查 Vercel 環境變數和 Cloudflare 配置
          </p>

          <button
            onClick={checkEnvironment}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "檢查中..." : "檢查環境"}
          </button>
        </div>

        {envInfo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">環境狀態</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(envInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
