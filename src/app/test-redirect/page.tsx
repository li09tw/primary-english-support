"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TestRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    console.log("🧪 測試頁面載入");
    console.log("🔍 當前環境:", process.env.NODE_ENV);
    console.log("🔍 當前 URL:", window.location.href);

    // 測試跳轉到 /garden
    setTimeout(() => {
      console.log("🚀 測試跳轉到 /garden");
      router.push("/garden");
    }, 2000);
  }, [router]);

  return (
    <div className="min-h-screen bg-primary-blue flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">測試跳轉頁面</h1>
        <p className="text-black">2秒後將跳轉到 /garden</p>
        <p className="text-sm text-gray-600 mt-2">請檢查瀏覽器控制台</p>
      </div>
    </div>
  );
}
