"use client";

import { useState } from "react";

export default function TestD1Page() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testD1Connection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test-d1");
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            D1 資料庫連接測試
          </h1>
          <p className="text-lg text-gray-600">
            測試 Cloudflare D1 資料庫連接狀態
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={testD1Connection}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "測試中..." : "測試 D1 連接"}
          </button>
        </div>

        {testResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              測試結果
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">說明</h2>
          <div className="space-y-2 text-gray-600">
            <p>• 這個頁面用於測試 Cloudflare D1 資料庫的連接狀態</p>
            <p>• 如果連接成功，會顯示資料庫結構和遊戲數量</p>
            <p>• 如果連接失敗，會顯示錯誤信息和可用的綁定</p>
            <p>• 請確保已經在 Cloudflare 中正確配置了 D1 資料庫</p>
          </div>
        </div>
      </div>
    </div>
  );
}
