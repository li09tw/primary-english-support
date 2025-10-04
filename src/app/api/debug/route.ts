import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 檢查環境變數
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      // 移除 Cloudflare 相關環境變數檢查
    };

    return NextResponse.json({
      success: true,
      environment: envVars,
      message: "D1 和 Cloudflare 功能已移除，現在是純靜態網站",
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
