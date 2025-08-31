"use client";

import { useState } from "react";
import { gameAPI } from "@/lib/game-api";

export default function TestLocalAPIPage() {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testEnvironment = () => {
    setTestResult("🔍 環境檢查:\n");
    setTestResult((prev) => prev + `   typeof window: ${typeof window}\n`);
    setTestResult((prev) => prev + `   NODE_ENV: ${process.env.NODE_ENV}\n`);
    setTestResult(
      (prev) =>
        prev +
        `   NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: ${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}\n`
    );
    setTestResult(
      (prev) =>
        prev +
        `   NEXT_PUBLIC_CLOUDFLARE_API_SECRET: ${
          process.env.NEXT_PUBLIC_CLOUDFLARE_API_SECRET ? "已設定" : "未設定"
        }\n`
    );
    setTestResult(
      (prev) =>
        prev +
        `   當前環境: ${typeof window !== "undefined" ? "瀏覽器" : "伺服器"}\n`
    );
  };

  const testGameAPI = async () => {
    setLoading(true);
    setTestResult("開始測試...\n");

    try {
      // 測試 1: 直接調用 API
      setTestResult(
        (prev) => prev + "🔍 測試 1: 調用 gameAPI.getAllGames()...\n"
      );

      const games = await gameAPI.getAllGames();

      setTestResult(
        (prev) => prev + `✅ 成功獲取 ${games.length} 個遊戲方法\n`
      );

      if (games.length > 0) {
        const firstGame = games[0];
        setTestResult((prev) => prev + `📊 第一個遊戲方法詳情:\n`);
        setTestResult((prev) => prev + `   ID: ${firstGame.id}\n`);
        setTestResult((prev) => prev + `   標題: ${firstGame.title}\n`);
        setTestResult(
          (prev) => prev + `   分類: ${JSON.stringify(firstGame.categories)}\n`
        );
        setTestResult(
          (prev) => prev + `   年級: ${JSON.stringify(firstGame.grades)}\n`
        );
        setTestResult(
          (prev) =>
            prev + `   描述: ${firstGame.description.substring(0, 100)}...\n`
        );
      }

      // 測試 2: 檢查數據轉換
      setTestResult((prev) => prev + "\n🔍 測試 2: 檢查數據轉換...\n");

      if (games.length > 0) {
        const sampleGame = games[0];
        setTestResult((prev) => prev + `📋 數據轉換檢查:\n`);
        setTestResult(
          (prev) =>
            prev + `   categories 類型: ${typeof sampleGame.categories}\n`
        );
        setTestResult(
          (prev) =>
            prev +
            `   categories 內容: ${JSON.stringify(sampleGame.categories)}\n`
        );
        setTestResult(
          (prev) => prev + `   grades 類型: ${typeof sampleGame.grades}\n`
        );
        setTestResult(
          (prev) =>
            prev + `   grades 內容: ${JSON.stringify(sampleGame.grades)}\n`
        );
      }

      // 測試 3: 檢查篩選邏輯
      setTestResult((prev) => prev + "\n🔍 測試 3: 檢查篩選邏輯...\n");

      const vocabularyGames = games.filter((game) =>
        game.categories.some((cat) => cat === "單字學習")
      );

      const grade1Games = games.filter((game) =>
        game.grades.includes("grade1")
      );

      setTestResult((prev) => prev + `📊 篩選結果:\n`);
      setTestResult(
        (prev) => prev + `   單字學習遊戲: ${vocabularyGames.length} 個\n`
      );
      setTestResult(
        (prev) => prev + `   一年級遊戲: ${grade1Games.length} 個\n`
      );
    } catch (error) {
      setTestResult((prev) => prev + `❌ 測試失敗: ${error}\n`);
      console.error("測試失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setLoading(true);
    setTestResult("開始直接 API 測試...\n");

    try {
      const response = await fetch("http://localhost:8787/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "local-dev-secret",
        },
        body: JSON.stringify({
          query: "SELECT * FROM game_methods LIMIT 3",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTestResult((prev) => prev + `✅ 直接 API 調用成功\n`);
      setTestResult(
        (prev) => prev + `📊 回應數據: ${JSON.stringify(data, null, 2)}\n`
      );
    } catch (error) {
      setTestResult((prev) => prev + `❌ 直接 API 測試失敗: ${error}\n`);
      console.error("直接 API 測試失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  const testClientSelection = () => {
    setTestResult("🔍 客戶端選擇邏輯測試:\n");

    // 模擬客戶端選擇邏輯
    const isBrowser = typeof window !== "undefined";
    const nodeEnv = process.env.NODE_ENV;

    setTestResult((prev) => prev + `   瀏覽器環境: ${isBrowser}\n`);
    setTestResult((prev) => prev + `   NODE_ENV: ${nodeEnv}\n`);

    let clientType = "未知";
    if (isBrowser) {
      clientType = "瀏覽器端客戶端";
    } else if (nodeEnv === "development") {
      clientType = "本地開發環境客戶端";
    } else {
      clientType = "生產環境客戶端";
    }

    setTestResult((prev) => prev + `   選擇的客戶端: ${clientType}\n`);

    // 檢查環境變數
    const workerUrl = isBrowser
      ? process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL
      : nodeEnv === "development"
      ? "http://localhost:8787"
      : process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;

    const apiSecret = isBrowser
      ? process.env.NEXT_PUBLIC_CLOUDFLARE_API_SECRET
      : nodeEnv === "development"
      ? "local-dev-secret"
      : process.env.NEXT_PUBLIC_CLOUDFLARE_API_SECRET;

    setTestResult((prev) => prev + `   Worker URL: ${workerUrl || "未設定"}\n`);
    setTestResult(
      (prev) => prev + `   API Secret: ${apiSecret ? "已設定" : "未設定"}\n`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">本地 API 測試頁面</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={testEnvironment}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          檢查環境
        </button>

        <button
          onClick={testClientSelection}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded ml-4"
        >
          測試客戶端選擇
        </button>

        <button
          onClick={testGameAPI}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-4"
        >
          {loading ? "測試中..." : "測試 Game API"}
        </button>

        <button
          onClick={testDirectAPI}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ml-4"
        >
          {loading ? "測試中..." : "直接測試 API"}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">測試結果:</h2>
        <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border">
          {testResult || "點擊按鈕開始測試..."}
        </pre>
      </div>
    </div>
  );
}
