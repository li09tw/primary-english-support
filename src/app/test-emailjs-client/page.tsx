"use client";

import { useState } from "react";
import {
  sendVerificationCodeEmail,
  isEmailJSConfigured,
} from "@/lib/emailjs-client";

export default function TestEmailJSClientPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testEmailJS = async () => {
    setLoading(true);
    setResult("測試中...");

    try {
      // 檢查配置
      const isConfigured = isEmailJSConfigured();
      setResult(`EmailJS 配置檢查: ${isConfigured ? "已配置" : "未配置"}\n`);

      if (!isConfigured) {
        setResult((prev) => prev + "請檢查環境變數設定");
        setLoading(false);
        return;
      }

      // 測試發送驗證碼郵件
      const emailResult = await sendVerificationCodeEmail(
        "test@example.com",
        "123456",
        30
      );

      setResult(
        (prev) => prev + `\n發送結果: ${emailResult.success ? "成功" : "失敗"}`
      );
      if (!emailResult.success) {
        setResult((prev) => prev + `\n錯誤: ${emailResult.error}`);
      }
    } catch (error) {
      setResult(
        (prev) =>
          prev +
          `\n異常: ${error instanceof Error ? error.message : "未知錯誤"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          EmailJS 客戶端測試
        </h1>

        <div className="space-y-4">
          <button
            onClick={testEmailJS}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "測試中..." : "測試 EmailJS"}
          </button>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">測試結果:</h3>
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>

          <div className="text-xs text-gray-500">
            <p>環境變數檢查:</p>
            <ul className="list-disc list-inside">
              <li>
                NEXT_PUBLIC_EMAILJS_SERVICE_ID:{" "}
                {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
                  ? "已設定"
                  : "未設定"}
              </li>
              <li>
                NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:{" "}
                {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
                  ? "已設定"
                  : "未設定"}
              </li>
              <li>
                NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:{" "}
                {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                  ? "已設定"
                  : "未設定"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
