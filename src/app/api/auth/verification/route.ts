/**
 * @fileoverview 安全驗證碼 API 路由
 * @modified 2024-01-XX XX:XX - 新增安全驗證碼系統
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 驗證碼發送、驗證和會話管理
 */

import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/emailjs";
import {
  SessionManager,
  RateLimiter,
  VerificationCodeManager,
  getClientIP,
  getSecurityHeaders,
  AUTH_CONFIG,
} from "@/lib/auth-utils";
import { generateId } from "@/lib/utils";
import { getCloudflareConfig } from "@/lib/env-config";

// POST: 發送驗證碼
export async function POST(request: NextRequest) {
  try {
    // 檢查會話是否有效
    const sessionToken = await SessionManager.getSessionToken();
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "會話無效，請重新登入" },
        { status: 401 }
      );
    }

    const sessionValidation = await SessionManager.validateSession(
      sessionToken
    );
    if (!sessionValidation.valid) {
      await SessionManager.clearSessionCookie();
      return NextResponse.json(
        { success: false, message: sessionValidation.error || "會話已過期" },
        { status: 401 }
      );
    }

    const accountId = sessionValidation.accountId!;
    const clientIP = await getClientIP();

    // 檢查驗證碼請求限制
    const rateLimitCheck = await RateLimiter.checkCodeRequestLimit(
      accountId,
      clientIP
    );
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: rateLimitCheck.error },
        { status: 429 }
      );
    }

    // 獲取帳戶資訊
    const { workerUrl, apiSecret } = getCloudflareConfig();
    const accountResponse = await fetch(`${workerUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiSecret,
      },
      body: JSON.stringify({
        query: "SELECT username, email FROM admin_accounts WHERE id = ?",
        params: [accountId],
      }),
    });

    if (!accountResponse.ok) {
      return NextResponse.json(
        { success: false, message: "無法獲取帳戶資訊" },
        { status: 500 }
      );
    }

    const accountData = await accountResponse.json();
    if (
      !accountData.success ||
      !accountData.results ||
      accountData.results.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "帳戶不存在" },
        { status: 404 }
      );
    }

    const account = accountData.results[0];

    // 使舊的驗證碼失效
    await VerificationCodeManager.invalidateOldCodes(accountId);

    // 生成新的驗證碼
    const verificationCode = VerificationCodeManager.generateCode();
    const codeHash = VerificationCodeManager.hashCode(verificationCode);

    // 設定15分鐘過期時間
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + AUTH_CONFIG.VERIFICATION_CODE_EXPIRY_MINUTES
    );

    // 儲存驗證碼到資料庫
    const saveResponse = await fetch(`${workerUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiSecret,
      },
      body: JSON.stringify({
        query: `
          INSERT INTO verification_codes (id, account_id, code_hash, expires_at, created_at)
          VALUES (?, ?, ?, ?, datetime('now'))
        `,
        params: [generateId(), accountId, codeHash, expiresAt.toISOString()],
      }),
    });

    if (!saveResponse.ok) {
      return NextResponse.json(
        { success: false, message: "無法儲存驗證碼" },
        { status: 500 }
      );
    }

    // 記錄驗證碼請求
    await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
      },
      body: JSON.stringify({
        query: `
          INSERT INTO login_attempts (id, ip_address, username, attempt_type, success, created_at)
          VALUES (?, ?, ?, 'code_request', TRUE, datetime('now'))
        `,
        params: [generateId(), clientIP, account.username],
      }),
    });

    // 發送驗證碼到信箱
    const emailResult = await sendNotificationEmail(
      account.email,
      "Garden 管理介面驗證碼",
      `您的驗證碼是：${verificationCode}\n\n此驗證碼將在 ${AUTH_CONFIG.VERIFICATION_CODE_EXPIRY_MINUTES} 分鐘後過期。\n\n請勿將此驗證碼分享給他人。`
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: "無法發送驗證碼到信箱" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `驗證碼已發送到 ${account.email}`,
    });

    // 設定安全標頭
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("發送驗證碼失敗:", error);
    return NextResponse.json(
      { success: false, message: "發送驗證碼時發生錯誤" },
      { status: 500 }
    );
  }
}

// PUT: 驗證驗證碼
export async function PUT(request: NextRequest) {
  try {
    const { code } = await request.json();

    // 輸入驗證
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "請輸入驗證碼" },
        { status: 400 }
      );
    }

    // 檢查會話是否有效
    const sessionToken = await SessionManager.getSessionToken();
    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "會話無效，請重新登入" },
        { status: 401 }
      );
    }

    const sessionValidation = await SessionManager.validateSession(
      sessionToken
    );
    if (!sessionValidation.valid) {
      await SessionManager.clearSessionCookie();
      return NextResponse.json(
        { success: false, message: sessionValidation.error || "會話已過期" },
        { status: 401 }
      );
    }

    const accountId = sessionValidation.accountId!;

    // 清理輸入
    const cleanCode = code.trim().replace(/[<>\"'&]/g, "");

    // 查詢驗證碼
    const { workerUrl, apiSecret } = getCloudflareConfig();
    const codeResponse = await fetch(`${workerUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiSecret,
      },
      body: JSON.stringify({
        query: `
          SELECT id, code_hash, expires_at, is_used
          FROM verification_codes
          WHERE account_id = ? AND is_used = FALSE
          ORDER BY created_at DESC
          LIMIT 1
        `,
        params: [accountId],
      }),
    });

    if (!codeResponse.ok) {
      return NextResponse.json(
        { success: false, message: "驗證碼查詢失敗" },
        { status: 500 }
      );
    }

    const codeData = await codeResponse.json();
    if (
      !codeData.success ||
      !codeData.results ||
      codeData.results.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "驗證碼無效或已過期" },
        { status: 400 }
      );
    }

    const verificationCode = codeData.results[0];

    // 檢查是否已使用
    if (verificationCode.is_used) {
      return NextResponse.json(
        { success: false, message: "驗證碼已被使用" },
        { status: 400 }
      );
    }

    // 檢查是否過期
    const expiresAt = new Date(verificationCode.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "驗證碼已過期" },
        { status: 400 }
      );
    }

    // 驗證驗證碼
    const isCodeValid = VerificationCodeManager.verifyCode(
      cleanCode,
      verificationCode.code_hash
    );
    if (!isCodeValid) {
      return NextResponse.json(
        { success: false, message: "驗證碼錯誤" },
        { status: 400 }
      );
    }

    // 標記驗證碼為已使用
    await fetch(`${workerUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiSecret,
      },
      body: JSON.stringify({
        query: "UPDATE verification_codes SET is_used = TRUE WHERE id = ?",
        params: [verificationCode.id],
      }),
    });

    // 更新會話狀態為已驗證
    await fetch(`${workerUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiSecret,
      },
      body: JSON.stringify({
        query: `
          UPDATE admin_sessions 
          SET expires_at = datetime(expires_at, '+' || ? || ' hours')
          WHERE session_token = ?
        `,
        params: [AUTH_CONFIG.SESSION_EXPIRY_HOURS, sessionToken],
      }),
    });

    const response = NextResponse.json({
      success: true,
      message: "驗證成功",
    });

    // 設定安全標頭
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("驗證碼驗證失敗:", error);
    return NextResponse.json(
      { success: false, message: "驗證過程發生錯誤" },
      { status: 500 }
    );
  }
}
