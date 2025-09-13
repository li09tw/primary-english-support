/**
 * @fileoverview 會話檢查 API 路由
 * @modified 2024-01-XX XX:XX - 新增會話檢查功能
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 會話狀態驗證和檢查
 */

import { NextRequest, NextResponse } from "next/server";
import { SessionManager, getSecurityHeaders } from "@/lib/auth-utils";
import { getCloudflareConfig } from "@/lib/env-config";

// GET: 檢查會話狀態
export async function GET(request: NextRequest) {
  try {
    const sessionToken = await SessionManager.getSessionToken();

    if (!sessionToken) {
      return NextResponse.json({
        valid: false,
        message: "沒有會話令牌",
      });
    }

    const sessionValidation = await SessionManager.validateSession(
      sessionToken
    );

    if (!sessionValidation.valid) {
      // 會話無效，清除 Cookie
      await SessionManager.clearSessionCookie();

      return NextResponse.json({
        valid: false,
        message: sessionValidation.error || "會話無效",
      });
    }

    const response = NextResponse.json({
      valid: true,
      accountId: sessionValidation.accountId,
      message: "會話有效",
    });

    // 設定安全標頭
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("會話檢查失敗:", error);
    return NextResponse.json(
      { valid: false, message: "會話檢查失敗" },
      { status: 500 }
    );
  }
}

// DELETE: 登出（清除會話）
export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = await SessionManager.getSessionToken();

    if (sessionToken) {
      // 從資料庫中刪除會話
      const { workerUrl, apiSecret } = getCloudflareConfig();
      await fetch(`${workerUrl}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiSecret,
        },
        body: JSON.stringify({
          query: "DELETE FROM admin_sessions WHERE session_token = ?",
          params: [sessionToken],
        }),
      });
    }

    // 清除 Cookie
    await SessionManager.clearSessionCookie();

    const response = NextResponse.json({
      success: true,
      message: "登出成功",
    });

    // 設定安全標頭
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("登出失敗:", error);
    return NextResponse.json(
      { success: false, message: "登出失敗" },
      { status: 500 }
    );
  }
}
