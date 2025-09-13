/**
 * @fileoverview Garden 簡化登入頁面 - 只需要帳號，驗證碼發送到預設信箱
 * @modified 2024-01-XX XX:XX - 簡化登入流程，移除密碼輸入
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 簡化登入：帳號 → 發送驗證碼 → 輸入驗證碼
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  sendVerificationCodeEmail,
  isEmailJSConfigured,
} from "@/lib/emailjs-client";

interface LoginState {
  step: "username" | "verification";
  username: string;
  code: string;
  loading: boolean;
  error: string;
  success: string;
}

export default function GardenLoginPage() {
  const router = useRouter();
  const [loginState, setLoginState] = useState<LoginState>({
    step: "username",
    username: "",
    code: "",
    loading: false,
    error: "",
    success: "",
  });

  // 檢查是否已經登入
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            router.push("/garden");
          }
        }
      } catch (error) {
        // 忽略錯誤，繼續顯示登入頁面
      }
    };

    checkSession();
  }, [router]);

  // 發送驗證碼
  const sendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginState.username.trim()) {
      setLoginState((prev) => ({ ...prev, error: "請輸入帳號" }));
      return;
    }

    setLoginState((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      // 1. 從後端獲取驗證碼
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginState.username.trim(),
        }),
      });

      const data = await response.json();

      if (data.success && data.verificationCode) {
        // 2. 檢查 EmailJS 配置
        if (!isEmailJSConfigured()) {
          setLoginState((prev) => ({
            ...prev,
            loading: false,
            error: "EmailJS 配置不完整，請檢查環境變數設定",
          }));
          return;
        }

        // 3. 使用前端 EmailJS 發送郵件
        const emailResult = await sendVerificationCodeEmail(
          data.email,
          data.verificationCode,
          data.expiresIn
        );

        if (emailResult.success) {
          setLoginState((prev) => ({
            ...prev,
            step: "verification",
            loading: false,
            success: "驗證碼已發送，請至信箱檢查",
            error: "",
          }));
        } else {
          setLoginState((prev) => ({
            ...prev,
            step: "verification",
            loading: false,
            success: `驗證碼已生成：${data.verificationCode}\n\n郵件發送失敗：${emailResult.error}`,
            error: "",
          }));
        }
      } else {
        setLoginState((prev) => ({
          ...prev,
          loading: false,
          error: data.message,
        }));
      }
    } catch (error) {
      setLoginState((prev) => ({
        ...prev,
        loading: false,
        error: "發送驗證碼失敗，請重試",
      }));
    }
  };

  // 驗證驗證碼
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginState.code.trim()) {
      setLoginState((prev) => ({ ...prev, error: "請輸入驗證碼" }));
      return;
    }

    setLoginState((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const response = await fetch("/api/auth", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginState.username.trim(),
          code: loginState.code.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLoginState((prev) => ({
          ...prev,
          loading: false,
          success: data.message,
          error: "",
        }));

        // 驗證成功，重定向到 Garden 頁面
        setTimeout(() => {
          router.push("/garden");
        }, 1000);
      } else {
        setLoginState((prev) => ({
          ...prev,
          loading: false,
          error: data.message,
        }));
      }
    } catch (error) {
      setLoginState((prev) => ({
        ...prev,
        loading: false,
        error: "驗證失敗，請重試",
      }));
    }
  };

  // 返回帳號輸入步驟
  const goBackToUsername = () => {
    setLoginState((prev) => ({
      ...prev,
      step: "username",
      code: "",
      error: "",
      success: "",
    }));
  };

  return (
    <div className="min-h-screen bg-primary-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
            Garden 管理介面
          </h1>
          <p className="text-gray-600">請登入以繼續</p>
        </div>

        {/* 帳號輸入步驟 */}
        {loginState.step === "username" && (
          <form onSubmit={sendVerificationCode} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-black mb-2"
              >
                帳號
              </label>
              <input
                id="username"
                type="text"
                value={loginState.username}
                onChange={(e) =>
                  setLoginState((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
                placeholder="請輸入您的帳號"
                disabled={loginState.loading}
                required
              />
            </div>

            {loginState.error && (
              <div className="text-red-600 text-sm text-center">
                {loginState.error}
              </div>
            )}

            <button
              type="submit"
              disabled={loginState.loading}
              className="w-full bg-secondary-pink hover:bg-white hover:text-primary-blue-dark text-black font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:ring-offset-2 transition-colors duration-200 border-2 border-transparent hover:border-primary-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginState.loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  發送中，請稍候...
                </div>
              ) : (
                "發送驗證碼"
              )}
            </button>
          </form>
        )}

        {/* 驗證碼輸入步驟 */}
        {loginState.step === "verification" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                驗證碼已發送到預設信箱
              </p>
              <p className="text-xs text-gray-500">
                帳號：{loginState.username}
              </p>
              <button
                type="button"
                onClick={sendVerificationCode}
                disabled={loginState.loading}
                className="text-xs text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                重新發送驗證碼
              </button>
            </div>

            <form onSubmit={verifyCode} className="space-y-6">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-black mb-2"
                >
                  驗證碼
                </label>
                <input
                  id="code"
                  type="text"
                  value={loginState.code}
                  onChange={(e) =>
                    setLoginState((prev) => ({ ...prev, code: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  disabled={loginState.loading}
                  required
                />
              </div>

              {loginState.error && (
                <div className="text-red-600 text-sm text-center">
                  {loginState.error}
                </div>
              )}

              {loginState.success && (
                <div className="text-green-600 text-sm text-center">
                  {loginState.success}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loginState.loading}
                  className="w-full bg-secondary-pink hover:bg-white hover:text-primary-blue-dark text-black font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:ring-offset-2 transition-colors duration-200 border-2 border-transparent hover:border-primary-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginState.loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      驗證中...
                    </div>
                  ) : (
                    "驗證"
                  )}
                </button>

                <button
                  type="button"
                  onClick={goBackToUsername}
                  disabled={loginState.loading}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  返回修改帳號
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 安全提示 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">安全提示</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 驗證碼將在 30 分鐘後過期</li>
            <li>• 請勿將驗證碼分享給他人</li>
            <li>• 驗證碼會發送到預設信箱</li>
            <li>• 每次登入都需要新的驗證碼</li>
            <li>• 郵件由前端直接發送，速度較快</li>
            <li>• 如果未收到郵件，請檢查垃圾郵件夾</li>
            <li>• 可以點擊「重新發送驗證碼」重試</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
