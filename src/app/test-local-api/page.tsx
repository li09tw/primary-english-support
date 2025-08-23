"use client";

import { useState, useEffect } from "react";
import {
  localGameAPI,
  localMessageAPI,
  localStatsAPI,
} from "@/lib/local-api";
import { GameMethod, AdminMessage } from "@/types";

export default function TestLocalAPIPage() {
  const [games, setGames] = useState<GameMethod[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [gameStats, setGameStats] = useState<{
    total: number;
    published: number;
    draft: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testLocalAPI = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🧪 開始測試本地 Cloudflare API...");

      // 測試遊戲方法 API
      console.log("📚 測試遊戲方法 API...");
      const gamesData = await localGameAPI.getAllGames();
      setGames(gamesData);
      console.log(`✅ 獲取到 ${gamesData.length} 個遊戲方法`);



      // 測試站長消息 API
      console.log("📢 測試站長消息 API...");
      const messagesData = await localMessageAPI.getAllMessages();
      setMessages(messagesData);
      console.log(`✅ 獲取到 ${messagesData.length} 個站長消息`);

      // 測試統計 API
      console.log("📊 測試統計 API...");
      const statsData = await localStatsAPI.getGameStats();
      setGameStats(statsData);
      console.log(`✅ 獲取到遊戲統計: ${JSON.stringify(statsData)}`);

      console.log("🎉 所有 API 測試完成！");
    } catch (err) {
      console.error("❌ API 測試失敗:", err);
      setError(err instanceof Error ? err.message : "未知錯誤");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testLocalAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            本地 Cloudflare API 測試
          </h1>
          <p className="text-lg text-black mb-6">
            測試本地開發環境中的 Cloudflare Worker 與 D1 資料庫連接
          </p>

          <button
            onClick={testLocalAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "測試中..." : "重新測試"}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>錯誤:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 遊戲方法測試結果 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              遊戲方法 API 測試結果
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-black">總數量:</span>
                <span className="font-medium text-black">{games.length}</span>
              </div>

            </div>

            {games.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-black mb-2">
                  前 3 個遊戲方法:
                </h3>
                <div className="space-y-2">
                  {games.slice(0, 3).map((game) => (
                    <div
                      key={game.id}
                      className="text-sm text-black p-2 bg-gray-50 rounded"
                    >
                      <div className="font-medium">{game.title}</div>
                      <div className="text-gray-600">
                        {game.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>



          {/* 站長消息測試結果 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              站長消息 API 測試結果
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-black">總數量:</span>
                <span className="font-medium text-black">
                  {messages.length}
                </span>
              </div>

            </div>

            {messages.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-black mb-2">
                  前 3 個站長消息:
                </h3>
                <div className="space-y-2">
                  {messages.slice(0, 3).map((message) => (
                    <div
                      key={message.id}
                      className="text-sm text-black p-2 bg-gray-50 rounded"
                    >
                      <div className="font-medium">{message.title}</div>
                      <div className="text-gray-600">{message.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 統計資訊測試結果 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              統計資訊 API 測試結果
            </h2>
            {gameStats ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-black">總遊戲數量:</span>
                  <span className="font-medium text-black">
                    {gameStats.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">已發布:</span>
                  <span className="font-medium text-green-600">
                    {gameStats.published}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">草稿:</span>
                  <span className="font-medium text-yellow-600">
                    {gameStats.draft}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">尚未獲取統計資訊</div>
            )}
          </div>
        </div>

        {/* 連接狀態 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-black mb-4">連接狀態</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {games.length > 0 ? "✅" : "❌"}
              </div>
              <div className="text-sm text-black">遊戲方法 API</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {messages.length >= 0 ? "✅" : "❌"}
              </div>
              <div className="text-sm text-black">站長消息 API</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
