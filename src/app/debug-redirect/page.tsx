"use client";

import { useState, useEffect } from "react";

export default function DebugRedirectPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        // 檢查環境變數
        const envResponse = await fetch("/api/debug-env");
        const envData = await envResponse.json();

        // 檢查會話狀態
        const sessionResponse = await fetch("/api/auth/session");
        const sessionData = await sessionResponse.json();

        // 檢查 Cloudflare 連接
        const cloudflareResponse = await fetch("/api/test-cloudflare-env");
        const cloudflareData = await cloudflareResponse.json();

        setDebugInfo({
          environment: envData,
          session: sessionData,
          cloudflare: cloudflareData,
          currentUrl: window.location.href,
          userAgent: navigator.userAgent,
          cookies: document.cookie,
        });
      } catch (error) {
        console.error("調試信息獲取失敗:", error);
        setDebugInfo({ error: error.message });
      }
    };

    checkEnvironment();
  }, []);

  return (
    <div className="min-h-screen bg-primary-blue p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">跳轉問題調試頁面</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">環境變數</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.environment, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">會話狀態</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.session, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black mb-4">
            Cloudflare 連接
          </h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.cloudflare, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-black mb-4">瀏覽器信息</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(
              {
                currentUrl: debugInfo.currentUrl,
                userAgent: debugInfo.userAgent,
                cookies: debugInfo.cookies,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
