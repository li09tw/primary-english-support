"use client";

import { useState } from "react";
import { apiGet, apiPost, apiPut, API_ENDPOINTS } from "@/lib/api";

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test: string, result: any) => {
    setTestResults((prev) => [
      ...prev,
      { test, result, timestamp: new Date().toISOString() },
    ]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testAdminApi = async () => {
    setIsLoading(true);
    try {
      // 測試獲取管理員消息
      const getResult = await apiGet(API_ENDPOINTS.ADMIN);
      addResult("GET /api/admin", getResult);

      // 測試創建管理員消息
      const postResult = await apiPost(API_ENDPOINTS.ADMIN, {
        title: "測試消息",
        content: "這是一條測試消息",
      });
      addResult("POST /api/admin", postResult);
    } catch (error) {
      addResult("Admin API 測試失敗", { error: (error as any).message });
    } finally {
      setIsLoading(false);
    }
  };

  const testGamesApi = async () => {
    setIsLoading(true);
    try {
      // 測試獲取遊戲方法
      const getResult = await apiGet(API_ENDPOINTS.GAMES);
      addResult("GET /api/games", getResult);

      // 測試創建遊戲方法
      const postResult = await apiPost(API_ENDPOINTS.GAMES, {
        title: "測試遊戲",
        description: "這是一個測試遊戲",
        materials: ["測試材料"],
        steps: ["步驟1", "步驟2"],
        grade: "grade1",
        ageGroup: "7-9",
        category: "vocabulary",
      });
      addResult("POST /api/games", postResult);
    } catch (error) {
      addResult("Games API 測試失敗", { error: (error as any).message });
    } finally {
      setIsLoading(false);
    }
  };

  const testAidsApi = async () => {
    setIsLoading(true);
    try {
      // 測試獲取教學輔具
      const getResult = await apiGet(API_ENDPOINTS.AIDS);
      addResult("GET /api/aids", getResult);

      // 測試創建教學輔具
      const postResult = await apiPost(API_ENDPOINTS.AIDS, {
        name: "測試輔具",
        description: "這是一個測試輔具",
        type: "flashcard",
        subject: "vocabulary",
        grade: "grade1",

        tags: ["測試", "輔具"],
      });
      addResult("POST /api/aids", postResult);
    } catch (error) {
      addResult("Aids API 測試失敗", { error: (error as any).message });
    } finally {
      setIsLoading(false);
    }
  };

  const testContactApi = async () => {
    setIsLoading(true);
    try {
      // 測試獲取聯絡記錄
      const getResult = await apiGet(API_ENDPOINTS.CONTACT);
      addResult("GET /api/contact", getResult);

      // 測試聯絡表單 API
      try {
        const contactResult = await apiPost(API_ENDPOINTS.CONTACT, {
          name: "測試用戶",
          email: "test@example.com",
          type: "general",
          title: "測試標題",
          content: "這是一條測試消息",
        });

        if (contactResult.success) {
          addResult("Contact API 測試成功", contactResult.data);
        } else {
          addResult("Contact API 測試失敗", { error: contactResult.error });
        }
      } catch (error) {
        addResult("Contact API 測試失敗", { error: (error as any).message });
      }
    } catch (error) {
      addResult("Contact API 測試失敗", { error: (error as any).message });
    } finally {
      setIsLoading(false);
    }
  };

  const testAllApis = async () => {
    await testAdminApi();
    await testGamesApi();
    await testAidsApi();
    await testContactApi();
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API 測試頁面</h1>
          <p className="mt-2 text-gray-600">測試所有後端 API 端點的功能</p>
        </div>

        {/* 測試按鈕 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={testAllApis}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            測試所有 API
          </button>
          <button
            onClick={testAdminApi}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            測試管理員 API
          </button>
          <button
            onClick={testGamesApi}
            disabled={isLoading}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 disabled:opacity-50"
          >
            測試遊戲 API
          </button>
          <button
            onClick={testAidsApi}
            disabled={isLoading}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            測試輔具 API
          </button>
          <button
            onClick={testContactApi}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            測試聯絡 API
          </button>
          <button
            onClick={clearResults}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            清除結果
          </button>
        </div>

        {/* 測試結果 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">測試結果</h2>
          {testResults.length === 0 ? (
            <p className="text-gray-500">
              還沒有測試結果，請點擊上面的按鈕開始測試。
            </p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{result.test}</h3>
                    <span className="text-sm text-gray-500">
                      {result.timestamp}
                    </span>
                  </div>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API 端點資訊 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            可用的 API 端點
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">管理員 API</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>GET /api/admin - 獲取管理員消息</li>
                <li>POST /api/admin - 創建管理員消息</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">遊戲 API</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>GET /api/games - 獲取遊戲方法</li>
                <li>POST /api/games - 創建遊戲方法</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">輔具 API</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>GET /api/aids - 獲取教學輔具</li>
                <li>POST /api/aids - 創建教學輔具</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">聯絡 API</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>GET /api/contact - 獲取聯絡記錄</li>
                <li>POST /api/contact - 提交聯絡表單</li>
                <li>PUT /api/contact - 更新聯絡記錄狀態</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
