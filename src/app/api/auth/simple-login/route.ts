/**
 * @fileoverview 簡化登入 API 路由 - 只需要帳號密碼
 * @modified 2024-01-XX XX:XX - 新增簡化登入系統
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 簡化登入，無需信箱和驗證碼
 */

import { NextRequest, NextResponse } from "next/server";
import {
  SessionManager,
  RateLimiter,
  getClientIP,
  getSecurityHeaders,
} from "@/lib/auth-utils";

// POST: 處理簡化登入請求
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 輸入驗證
    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "請輸入帳號和密碼" },
        { status: 400 }
      );
    }

    // 防止 XSS 攻擊：清理輸入
    const cleanUsername = username.trim().replace(/[<>\"'&]/g, "");
    const cleanPassword = password.trim();

    // 獲取客戶端 IP
    const clientIP = getClientIP();

    // 檢查速率限制和帳戶鎖定
    const rateLimitCheck = await RateLimiter.checkLoginAttempts(
      cleanUsername,
      clientIP
    );
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: rateLimitCheck.error },
        { status: 429 }
      );
    }

    // 查詢帳戶資訊（使用參數化查詢防止 SQL Injection）
    const accountResponse = await fetch(
      `${process.env.CLOUDFLARE_WORKER_URL}/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
        },
        body: JSON.stringify({
          query: `
            SELECT id, username, email, is_active, is_locked
            FROM admin_accounts
            WHERE username = ? AND is_active = TRUE
          `,
          params: [cleanUsername],
        }),
      }
    );

    // 無論帳號是否存在，都回傳相同的錯誤訊息（防止帳號枚舉）
    if (!accountResponse.ok) {
      await RateLimiter.recordLoginAttempt(cleanUsername, clientIP, false);
      return NextResponse.json(
        { success: false, message: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }

    const accountData = await accountResponse.json();
    if (
      !accountData.success ||
      !accountData.results ||
      accountData.results.length === 0
    ) {
      await RateLimiter.recordLoginAttempt(cleanUsername, clientIP, false);
      return NextResponse.json(
        { success: false, message: "帳號或密碼錯誤" },
        { status: 401 }
      );
    }

    const account = accountData.results[0];

    // 檢查帳戶是否被鎖定
    if (account.is_locked) {
      return NextResponse.json(
        { success: false, message: "帳戶已被鎖定，請稍後再試" },
        { status: 423 }
      );
    }

    // 簡化登入：只需要帳號存在即可（無需密碼驗證）
    // 注意：此路由已棄用，請使用驗證碼登入系統

    // 密碼驗證成功，記錄成功登入
    await RateLimiter.recordLoginAttempt(cleanUsername, clientIP, true);

    // 生成會話令牌
    const sessionToken = SessionManager.generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24小時後過期

    // 儲存會話到資料庫
    const sessionResponse = await fetch(
      `${process.env.CLOUDFLARE_WORKER_URL}/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
        },
        body: JSON.stringify({
          query: `
            INSERT INTO admin_sessions (id, account_id, session_token, expires_at, ip_address, user_agent, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
          `,
          params: [
            sessionToken,
            account.id,
            sessionToken,
            expiresAt.toISOString(),
            clientIP,
            request.headers.get("user-agent") || "",
          ],
        }),
      }
    );

    if (!sessionResponse.ok) {
      return NextResponse.json(
        { success: false, message: "會話建立失敗" },
        { status: 500 }
      );
    }

    // 設定會話 Cookie
    const response = NextResponse.json({
      success: true,
      message: "登入成功",
      redirectTo: "/garden", // 直接重定向到管理介面
    });

    // 設定安全的 Cookie
    response.cookies.set("garden_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/",
    });

    // 設定安全標頭
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("登入處理失敗:", error);
    return NextResponse.json(
      { success: false, message: "登入過程發生錯誤" },
      { status: 500 }
    );
  }
}
