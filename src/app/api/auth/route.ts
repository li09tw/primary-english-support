/**
 * @fileoverview 驗證 API 路由 - 處理帳號驗證和驗證碼發送
 * @modified 2024-01-XX XX:XX - 修正為使用預設信箱，無需輸入信箱
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 帳號驗證和驗證碼發送功能，使用預設信箱
 */

import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";
import { SessionManager, VerificationCodeManager } from "@/lib/auth-utils";

// 驗證碼有效期：30分鐘
const VERIFICATION_CODE_EXPIRY_MINUTES = 30;

// 預設信箱（從環境變數或設定檔讀取）
// 注意：EmailJS 會根據模板設定發送到預設信箱，這裡的地址僅用於顯示
const DEFAULT_EMAIL =
  process.env.DEFAULT_ADMIN_EMAIL || "admin@primary-english.com";

// 生成6位數驗證碼
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 檢查帳號是否存在
async function checkAccount(
  username: string
): Promise<{ exists: boolean; accountId?: string }> {
  try {
    const response = await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
      },
      body: JSON.stringify({
        query:
          "SELECT id FROM admin_accounts WHERE username = ? AND is_active = TRUE",
        params: [username],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.results && data.results.length > 0) {
        return { exists: true, accountId: data.results[0].id };
      }
    }
    return { exists: false };
  } catch (error) {
    console.error("檢查帳號失敗:", error);
    return { exists: false };
  }
}

// 儲存驗證碼到資料庫
async function saveVerificationCode(
  accountId: string,
  code: string
): Promise<boolean> {
  try {
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + VERIFICATION_CODE_EXPIRY_MINUTES
    );

    // 先使舊驗證碼失效
    await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
      },
      body: JSON.stringify({
        query: `UPDATE verification_codes SET is_used = TRUE WHERE account_id = ? AND is_used = FALSE`,
        params: [accountId],
      }),
    });

    const codeHash = VerificationCodeManager.hashCode(code);

    const response = await fetch(
      `${process.env.CLOUDFLARE_WORKER_URL}/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
        },
        body: JSON.stringify({
          query: `
          INSERT INTO verification_codes (id, account_id, code_hash, expires_at, created_at) 
          VALUES (?, ?, ?, ?, ?)
        `,
          params: [
            generateId(),
            accountId,
            codeHash,
            expiresAt.toISOString(),
            new Date().toISOString(),
          ],
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("儲存驗證碼失敗:", error);
    return false;
  }
}

// 驗證驗證碼
async function verifyCode(
  username: string,
  code: string
): Promise<{ valid: boolean; message: string; accountId?: string }> {
  try {
    // 先檢查帳號
    const accountCheck = await checkAccount(username);
    if (!accountCheck.exists) {
      return { valid: false, message: "帳號不存在或已被停用" };
    }

    // 檢查驗證碼
    const response = await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
      },
      body: JSON.stringify({
        query: `
          SELECT vc.id, vc.code_hash, vc.is_used, vc.expires_at, ac.id as account_id
          FROM verification_codes vc
          JOIN admin_accounts ac ON vc.account_id = ac.id
          WHERE ac.username = ? AND vc.is_used = FALSE
          ORDER BY vc.created_at DESC
          LIMIT 1
        `,
        params: [username],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.results && data.results.length > 0) {
        const verificationCode = data.results[0];
        const expiresAt = new Date(verificationCode.expires_at);
        const now = new Date();

        if (now > expiresAt) {
          return { valid: false, message: "驗證碼已過期" };
        }

        // 比對雜湊
        const isMatch = VerificationCodeManager.verifyCode(
          code,
          verificationCode.code_hash
        );
        if (!isMatch) {
          return { valid: false, message: "驗證碼無效" };
        }

        // 標記驗證碼為已使用
        await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
          },
          body: JSON.stringify({
            query: "UPDATE verification_codes SET is_used = TRUE WHERE id = ?",
            params: [verificationCode.id],
          }),
        });

        return {
          valid: true,
          message: "驗證成功",
          accountId: verificationCode.account_id,
        };
      }
    }

    return { valid: false, message: "驗證碼無效" };
  } catch (error) {
    console.error("驗證碼驗證失敗:", error);
    return { valid: false, message: "驗證過程發生錯誤" };
  }
}

// POST: 發送驗證碼（使用預設信箱）
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    // 輸入驗證
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "請輸入有效的帳號" },
        { status: 400 }
      );
    }

    // 防止 XSS 攻擊：清理輸入
    const cleanUsername = username.trim().replace(/[<>\"'&]/g, "");

    // 檢查帳號是否存在
    const accountCheck = await checkAccount(cleanUsername);
    if (!accountCheck.exists) {
      return NextResponse.json(
        { success: false, message: "帳號不存在或已被停用" },
        { status: 404 }
      );
    }

    // 生成驗證碼
    const verificationCode = generateVerificationCode();

    // 儲存驗證碼到資料庫
    const saveSuccess = await saveVerificationCode(
      accountCheck.accountId!,
      verificationCode
    );
    if (!saveSuccess) {
      return NextResponse.json(
        { success: false, message: "無法儲存驗證碼" },
        { status: 500 }
      );
    }

    // 回傳驗證碼給前端，由前端發送郵件
    return NextResponse.json({
      success: true,
      message: "驗證碼已生成",
      verificationCode: verificationCode, // 將驗證碼傳給前端
      email: DEFAULT_EMAIL,
      expiresIn: VERIFICATION_CODE_EXPIRY_MINUTES,
    });
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
    const { username, code } = await request.json();

    // 輸入驗證
    if (
      !username ||
      !code ||
      typeof username !== "string" ||
      typeof code !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "請輸入帳號和驗證碼" },
        { status: 400 }
      );
    }

    // 防止 XSS 攻擊：清理輸入
    const cleanUsername = username.trim().replace(/[<>\"'&]/g, "");
    const cleanCode = code.trim().replace(/[<>\"'&]/g, "");

    // 驗證驗證碼
    const verificationResult = await verifyCode(cleanUsername, cleanCode);

    if (verificationResult.valid && verificationResult.accountId) {
      // 建立會話
      const sessionToken = SessionManager.generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const userAgent = request.headers.get("user-agent") || "";

      const sessionSave = await fetch(
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
              verificationResult.accountId,
              sessionToken,
              expiresAt.toISOString(),
              "unknown",
              userAgent,
            ],
          }),
        }
      );

      if (!sessionSave.ok) {
        return NextResponse.json(
          { success: false, message: "會話建立失敗" },
          { status: 500 }
        );
      }

      // 設定 Cookie 並回應
      const response = NextResponse.json({
        success: true,
        message: verificationResult.message,
        redirectTo: "/garden",
      });
      response.cookies.set("garden_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: expiresAt,
        path: "/",
      });
      return response;
    } else {
      return NextResponse.json(
        { success: false, message: verificationResult.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("驗證碼驗證失敗:", error);
    return NextResponse.json(
      { success: false, message: "驗證過程發生錯誤" },
      { status: 500 }
    );
  }
}
