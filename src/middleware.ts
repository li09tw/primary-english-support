/**
 * @fileoverview Next.js 中間件 - 安全標頭設定
 * @modified 2024-01-XX XX:XX - 簡化為純靜態網站中間件
 * @modified_by Assistant
 * @modification_type refactor
 * @status completed
 * @feature 移除認證系統，僅保留安全標頭
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 安全標頭配置
function getSecurityHeaders() {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

export async function middleware(request: NextRequest) {
  // 設定安全標頭
  const response = NextResponse.next();
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了：
     * - api (API 路由)
     * - _next/static (靜態文件)
     * - _next/image (圖片優化文件)
     * - favicon.ico (網站圖標)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
