/**
 * @fileoverview Session utilities for middleware (no bcrypt or Node-only APIs)
 */

// Note: cookies() is not available in Edge runtime
// This file is for middleware use only

// Security headers used by middleware responses
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export function getSecurityHeaders(): Record<string, string> {
  return { ...SECURITY_HEADERS };
}

export class SessionManagerLite {
  // Note: Cookie management is handled in API routes, not middleware
  // These methods are kept for compatibility but not used in middleware

  static async validateSession(sessionToken: string): Promise<{
    valid: boolean;
    accountId?: string;
    error?: string;
  }> {
    try {
      // 使用後端環境變數
      const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
      const apiSecret = process.env.CLOUDFLARE_API_SECRET;

      if (!workerUrl || !apiSecret) {
        console.error("Missing Cloudflare environment variables in middleware");
        return { valid: false, error: "環境變數配置錯誤" };
      }

      const response = await fetch(`${workerUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiSecret,
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
      });

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
