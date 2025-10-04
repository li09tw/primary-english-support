import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    message: "D1 和 Cloudflare 功能已移除，現在是純靜態網站",
    // 檢查所有環境變數
    allEnvKeys: Object.keys(process.env).sort(),
  });
}
