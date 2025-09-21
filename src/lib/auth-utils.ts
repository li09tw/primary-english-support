/**
 * @fileoverview 安全驗證工具函數
 * @modified 2024-01-XX XX:XX - 新增安全驗證系統
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 密碼雜湊、會話管理、速率限制和帳戶鎖定
 */

import { cookies, headers } from "next/headers";
import { generateId } from "./utils";
import crypto from "crypto";

// 安全設定常數
export const AUTH_CONFIG = {
  // 驗證碼設定
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_CODE_EXPIRY_MINUTES: 30,

  // 會話設定
  SESSION_EXPIRY_HOURS: 0.5, // 30分鐘 (0.5小時)

  // 速率限制設定
  RATE_LIMIT: {
    LOGIN_ATTEMPTS: 5, // 5次登入失敗後鎖定
    LOCK_DURATION_MINUTES: 30, // 鎖定30分鐘
    CODE_REQUEST_LIMIT: 3, // 15分鐘內最多3次驗證碼請求
    CODE_REQUEST_WINDOW: 15, // 15分鐘視窗
  },

  // 安全標頭
  SECURITY_HEADERS: {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  },
};

// 密碼管理類別已移除 - 使用驗證碼登入系統

// 會話管理
export class SessionManager {
  /**
   * 生成會話令牌
   */
  static generateSessionToken(): string {
    return generateId() + "_" + Date.now();
  }

  /**
   * 設定會話 Cookie
   */
  static async setSessionCookie(sessionToken: string, expiresAt: Date) {
    const cookieStore = await cookies();
    cookieStore.set("garden_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
      path: "/",
    });
  }

  /**
   * 獲取會話令牌
   */
  static async getSessionToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("garden_session")?.value || null;
  }

  /**
   * 清除會話 Cookie
   */
  static async clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("garden_session");
  }

  /**
   * 驗證會話是否有效
   */
  static async validateSession(sessionToken: string): Promise<{
    valid: boolean;
    accountId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.CLOUDFLARE_WORKER_URL}/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
          },
          body: JSON.stringify({
            query: `
            SELECT s.account_id, s.expires_at, a.username, a.is_active, a.is_locked
            FROM admin_sessions s
            JOIN admin_accounts a ON s.account_id = a.id
            WHERE s.session_token = ? AND s.expires_at > datetime('now')
          `,
            params: [sessionToken],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.results && data.results.length > 0) {
          const session = data.results[0];

          if (session.is_locked) {
            return { valid: false, error: "帳戶已被鎖定" };
          }

          if (!session.is_active) {
            return { valid: false, error: "帳戶已被停用" };
          }

          return { valid: true, accountId: session.account_id };
        }
      }

      return { valid: false, error: "會話無效或已過期" };
    } catch (error) {
      console.error("會話驗證失敗:", error);
      return { valid: false, error: "會話驗證失敗" };
    }
  }
}

// 速率限制和帳戶鎖定
export class RateLimiter {
  /**
   * 檢查登入嘗試次數
   */
  static async checkLoginAttempts(
    username: string,
    ipAddress: string
  ): Promise<{
    allowed: boolean;
    remainingAttempts: number;
    lockExpiresAt?: string;
    error?: string;
  }> {
    try {
      // 檢查帳戶是否被鎖定
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
            SELECT is_locked, lock_expires_at, failed_attempts
            FROM admin_accounts
            WHERE username = ?
          `,
            params: [username],
          }),
        }
      );

      if (accountResponse.ok) {
        const accountData = await accountResponse.json();
        if (
          accountData.success &&
          accountData.results &&
          accountData.results.length > 0
        ) {
          const account = accountData.results[0];

          // 檢查是否被鎖定
          if (account.is_locked && account.lock_expires_at) {
            const lockExpiresAt = new Date(account.lock_expires_at);
            if (lockExpiresAt > new Date()) {
              return {
                allowed: false,
                remainingAttempts: 0,
                lockExpiresAt: account.lock_expires_at,
                error: "帳戶已被鎖定，請稍後再試",
              };
            }
          }

          // 檢查失敗次數
          if (
            account.failed_attempts >= AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS
          ) {
            return {
              allowed: false,
              remainingAttempts: 0,
              error: "登入失敗次數過多，帳戶已被鎖定",
            };
          }

          return {
            allowed: true,
            remainingAttempts:
              AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS - account.failed_attempts,
          };
        }
      }

      return {
        allowed: true,
        remainingAttempts: AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS,
      };
    } catch (error) {
      console.error("檢查登入嘗試失敗:", error);
      return {
        allowed: true,
        remainingAttempts: AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS,
      };
    }
  }

  /**
   * 記錄登入嘗試
   */
  static async recordLoginAttempt(
    username: string,
    ipAddress: string,
    success: boolean
  ): Promise<void> {
    try {
      // 記錄到 login_attempts 表
      await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
        },
        body: JSON.stringify({
          query: `
            INSERT INTO login_attempts (id, ip_address, username, attempt_type, success, created_at)
            VALUES (?, ?, ?, 'login', ?, datetime('now'))
          `,
          params: [generateId(), ipAddress, username, success],
        }),
      });

      // 更新帳戶的失敗次數
      if (!success) {
        await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
          },
          body: JSON.stringify({
            query: `
              UPDATE admin_accounts 
              SET failed_attempts = failed_attempts + 1,
                  last_failed_attempt = datetime('now'),
                  is_locked = CASE 
                    WHEN failed_attempts + 1 >= ? THEN TRUE 
                    ELSE is_locked 
                  END,
                  lock_expires_at = CASE 
                    WHEN failed_attempts + 1 >= ? THEN datetime('now', '+' || ? || ' minutes')
                    ELSE lock_expires_at 
                  END
              WHERE username = ?
            `,
            params: [
              AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS,
              AUTH_CONFIG.RATE_LIMIT.LOGIN_ATTEMPTS,
              AUTH_CONFIG.RATE_LIMIT.LOCK_DURATION_MINUTES,
              username,
            ],
          }),
        });
      } else {
        // 登入成功，重置失敗次數
        await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/execute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
          },
          body: JSON.stringify({
            query: `
              UPDATE admin_accounts 
              SET failed_attempts = 0,
                  is_locked = FALSE,
                  lock_expires_at = NULL
              WHERE username = ?
            `,
            params: [username],
          }),
        });
      }
    } catch (error) {
      console.error("記錄登入嘗試失敗:", error);
    }
  }

  /**
   * 檢查驗證碼請求限制
   */
  static async checkCodeRequestLimit(
    username: string,
    ipAddress: string
  ): Promise<{
    allowed: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.CLOUDFLARE_WORKER_URL}/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
          },
          body: JSON.stringify({
            query: `
            SELECT COUNT(*) as count
            FROM login_attempts
            WHERE ip_address = ? 
              AND attempt_type = 'code_request'
              AND created_at > datetime('now', '-' || ? || ' minutes')
          `,
            params: [ipAddress, AUTH_CONFIG.RATE_LIMIT.CODE_REQUEST_WINDOW],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.results && data.results.length > 0) {
          const count = data.results[0].count;
          if (count >= AUTH_CONFIG.RATE_LIMIT.CODE_REQUEST_LIMIT) {
            return {
              allowed: false,
              error: "驗證碼請求過於頻繁，請稍後再試",
            };
          }
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error("檢查驗證碼請求限制失敗:", error);
      return { allowed: true };
    }
  }
}

// 驗證碼管理
export class VerificationCodeManager {
  /**
   * 生成驗證碼
   */
  static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 雜湊驗證碼
   */
  static hashCode(code: string): string {
    return crypto.createHash("sha256").update(code).digest("hex");
  }

  /**
   * 驗證驗證碼
   */
  static verifyCode(code: string, hash: string): boolean {
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    return codeHash === hash;
  }

  /**
   * 使舊的驗證碼失效
   */
  static async invalidateOldCodes(accountId: string): Promise<void> {
    try {
      await fetch(`${process.env.CLOUDFLARE_WORKER_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.CLOUDFLARE_API_SECRET || "",
        },
        body: JSON.stringify({
          query: `
            UPDATE verification_codes 
            SET is_used = TRUE 
            WHERE account_id = ? AND is_used = FALSE
          `,
          params: [accountId],
        }),
      });
    } catch (error) {
      console.error("使舊驗證碼失效失敗:", error);
    }
  }
}

// 安全標頭設定
export function getSecurityHeaders(): Record<string, string> {
  return {
    ...AUTH_CONFIG.SECURITY_HEADERS,
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
}

// 獲取客戶端 IP 地址
export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}
