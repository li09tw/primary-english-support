/**
 * @fileoverview 驗證守衛組件 - 保護 Garden 頁面，要求帳號驗證
 * @modified 2024-01-XX XX:XX - 新增驗證系統
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 帳號驗證和驗證碼驗證功能
 */

"use client";

import { useState, useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

interface VerificationState {
  step: "username" | "code" | "verified";
  username: string;
  code: string;
  loading: boolean;
  error: string;
  success: string;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      step: "username",
      username: "",
      code: "",
      loading: false,
      error: "",
      success: "",
    }
  );

  // 檢查會話狀態
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
            setVerificationState((prev) => ({ ...prev, step: "verified" }));
          }
        }
      } catch (error) {
        // 會話無效，繼續顯示驗證頁面
        console.log("會話檢查失敗，需要重新驗證");
      }
    };

    checkSession();
  }, []);

  // 發送驗證碼
  const sendVerificationCode = async () => {
    if (!verificationState.username.trim()) {
      setVerificationState((prev) => ({ ...prev, error: "請輸入帳號" }));
      return;
    }

    setVerificationState((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const response = await fetch("/api/auth/verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: verificationState.username.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationState((prev) => ({
          ...prev,
          step: "code",
          loading: false,
          success: data.message,
          error: "",
        }));
      } else {
        setVerificationState((prev) => ({
          ...prev,
          loading: false,
          error: data.message,
        }));
      }
    } catch (error) {
      setVerificationState((prev) => ({
        ...prev,
        loading: false,
        error: "發送驗證碼失敗，請重試",
      }));
    }
  };

  // 驗證驗證碼
  const verifyCode = async () => {
    if (!verificationState.code.trim()) {
      setVerificationState((prev) => ({ ...prev, error: "請輸入驗證碼" }));
      return;
    }

    setVerificationState((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const response = await fetch("/api/auth/verification", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code: verificationState.code.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 驗證成功，會話已由服務端設定
        setVerificationState((prev) => ({
          ...prev,
          step: "verified",
          loading: false,
          success: data.message,
          error: "",
        }));
      } else {
        setVerificationState((prev) => ({
          ...prev,
          loading: false,
          error: data.message,
        }));
      }
    } catch (error) {
      setVerificationState((prev) => ({
        ...prev,
        loading: false,
        error: "驗證失敗，請重試",
      }));
    }
  };

  // 返回帳號輸入步驟
  const goBackToUsername = () => {
    setVerificationState((prev) => ({
      ...prev,
      step: "username",
      code: "",
      error: "",
      success: "",
    }));
  };

  // 如果已經驗證，顯示內容
  if (verificationState.step === "verified") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-primary-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">
            Garden 管理介面
          </h1>
          <p className="text-gray-600">請驗證您的身分以繼續</p>
        </div>

        {/* 帳號輸入步驟 */}
        {verificationState.step === "username" && (
          <div className="space-y-6">
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
                value={verificationState.username}
                onChange={(e) =>
                  setVerificationState((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
                placeholder="請輸入您的帳號"
                disabled={verificationState.loading}
              />
            </div>

            {verificationState.error && (
              <div className="text-red-600 text-sm text-center">
                {verificationState.error}
              </div>
            )}

            <button
              onClick={sendVerificationCode}
              disabled={verificationState.loading}
              className="w-full bg-secondary-pink hover:bg-white hover:text-primary-blue-dark text-black font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:ring-offset-2 transition-colors duration-200 border-2 border-transparent hover:border-primary-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verificationState.loading ? "發送中..." : "發送驗證碼"}
            </button>
          </div>
        )}

        {/* 驗證碼輸入步驟 */}
        {verificationState.step === "code" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                驗證碼已發送到您的信箱
              </p>
              <p className="text-xs text-gray-500">
                帳號：{verificationState.username}
              </p>
            </div>

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
                value={verificationState.code}
                onChange={(e) =>
                  setVerificationState((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
                disabled={verificationState.loading}
              />
            </div>

            {verificationState.error && (
              <div className="text-red-600 text-sm text-center">
                {verificationState.error}
              </div>
            )}

            {verificationState.success && (
              <div className="text-green-600 text-sm text-center">
                {verificationState.success}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={verifyCode}
                disabled={verificationState.loading}
                className="w-full bg-secondary-pink hover:bg-white hover:text-primary-blue-dark text-black font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:ring-offset-2 transition-colors duration-200 border-2 border-transparent hover:border-primary-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verificationState.loading ? "驗證中..." : "驗證"}
              </button>

              <button
                onClick={goBackToUsername}
                disabled={verificationState.loading}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                返回修改帳號
              </button>
            </div>
          </div>
        )}

        {/* 安全提示 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">安全提示</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 請勿將驗證碼分享給他人</li>
            <li>• 每次登入都需要新的驗證碼</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
