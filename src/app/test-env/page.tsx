"use client";

import { useState, useEffect } from "react";

export default function TestEnvPage() {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        // 測試 API 路由來檢查環境變數
        const response = await fetch("/api/test-env");
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

    checkEnvironment();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">環境變數測試</h1>
          <p className="text-lg text-black mb-6">
            檢查 Vercel 環境變數是否正確載入
          </p>
        </div>

        {loading && (
          <div className="text-center">
            <div className="text-lg text-black">檢查中...</div>
          </div>
        )}

        {envInfo && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              環境變數狀態
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(envInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
