/**
 * @fileoverview Next.js 中間件 - 會話驗證和安全標頭
 * @modified 2024-01-XX XX:XX - 新增安全中間件
 * @modified_by Assistant
 * @modification_type feature
 * @status in_progress
 * @feature 會話驗證、安全標頭和路由保護
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SessionManagerLite, getSecurityHeaders } from "@/lib/session-utils";

// 需要驗證的路徑
const PROTECTED_PATHS = ["/garden"];

// 公開的登入路徑（不需要驗證）
const PUBLIC_LOGIN_PATHS = ["/garden/login"];

// 公開的 API 路徑
const PUBLIC_API_PATHS = [
  "/api/auth",
  "/api/auth/session",
  "/api/learning-content",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 設定安全標頭
  const response = NextResponse.next();
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // 檢查是否為公開的登入路徑
  const isPublicLoginPath = PUBLIC_LOGIN_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  // 如果是公開登入路徑，直接放行
  if (isPublicLoginPath) {
    return response;
  }

  // 檢查是否為受保護的路徑
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // 檢查會話 Cookie
    const sessionToken = request.cookies.get("garden_session")?.value;

    console.log("🔍 中間件檢查受保護路徑:", pathname);
    console.log("🔍 會話 Token:", sessionToken ? "存在" : "不存在");

    if (!sessionToken) {
      // 沒有會話，重定向到登入頁面
      console.log("❌ 沒有會話，重定向到登入頁面");
      return NextResponse.redirect(new URL("/garden/login", request.url));
    }

    try {
      // 驗證會話
      const sessionValidation = await SessionManagerLite.validateSession(
        sessionToken
      );

      if (!sessionValidation.valid) {
        // 會話無效，清除 Cookie 並重定向
        console.log("❌ 會話無效:", sessionValidation.error);
        const redirectResponse = NextResponse.redirect(
          new URL("/garden/login", request.url)
        );
        redirectResponse.cookies.delete("garden_session");
        return redirectResponse;
      }

      // 會話有效，繼續處理請求
      console.log("✅ 會話有效，允許訪問:", pathname);
      return response;
    } catch (error) {
      console.error("會話驗證失敗:", error);
      // 驗證失敗，重定向到登入頁面
      const redirectResponse = NextResponse.redirect(
        new URL("/garden/login", request.url)
      );
      redirectResponse.cookies.delete("garden_session");
      return redirectResponse;
    }
  }

  // 檢查是否為需要驗證的 API 路徑
  const isProtectedAPI =
    pathname.startsWith("/api/") &&
    !PUBLIC_API_PATHS.some((path) => pathname.startsWith(path));

  if (isProtectedAPI) {
    const sessionToken = request.cookies.get("garden_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: "未授權訪問" },
        { status: 401 }
      );
    }

    try {
      const sessionValidation = await SessionManagerLite.validateSession(
        sessionToken
      );

      if (!sessionValidation.valid) {
        return NextResponse.json(
          { success: false, message: "會話無效或已過期" },
          { status: 401 }
        );
      }

      return response;
    } catch (error) {
      console.error("API 會話驗證失敗:", error);
      return NextResponse.json(
        { success: false, message: "會話驗證失敗" },
        { status: 500 }
      );
    }
  }

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
