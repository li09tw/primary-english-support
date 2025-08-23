import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 檢查環境變數
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL
        ? "已設定"
        : "未設定",
      CLOUDFLARE_API_SECRET: process.env.CLOUDFLARE_API_SECRET
        ? "已設定"
        : "未設定",
      // 不顯示實際的 URL 和密鑰，只顯示是否設定
      WORKER_URL_LENGTH: process.env.CLOUDFLARE_WORKER_URL?.length || 0,
      API_SECRET_LENGTH: process.env.CLOUDFLARE_API_SECRET?.length || 0,
    };

    // 檢查 Cloudflare 客戶端是否可用
    let cloudflareStatus = "unknown";
    try {
      const { isCloudflareSupported } = await import("@/lib/cloudflare-client");
      cloudflareStatus = isCloudflareSupported()
        ? "available"
        : "not_available";
    } catch (error) {
      cloudflareStatus = "error";
    }

    // 檢查本地客戶端是否可用
    let localStatus = "unknown";
    try {
      const { isLocalDevelopment } = await import(
        "@/lib/cloudflare-client-local"
      );
      localStatus = isLocalDevelopment() ? "available" : "not_available";
    } catch (error) {
      localStatus = "error";
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      cloudflareStatus,
      localStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
