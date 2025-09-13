import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    // 檢查所有可能的環境變數名稱
    CLOUDFLARE_WORKER_URL: process.env.CLOUDFLARE_WORKER_URL
      ? "SET"
      : "NOT SET",
    CLOUDFLARE_API_SECRET: process.env.CLOUDFLARE_API_SECRET
      ? "SET"
      : "NOT SET",
    NEXT_PUBLIC_CLOUDFLARE_WORKER_URL: process.env
      .NEXT_PUBLIC_CLOUDFLARE_WORKER_URL
      ? "SET"
      : "NOT SET",
    NEXT_PUBLIC_CLOUDFLARE_API_SECRET: process.env
      .NEXT_PUBLIC_CLOUDFLARE_API_SECRET
      ? "SET"
      : "NOT SET",

    // 顯示前幾個字符以確認值
    CLOUDFLARE_WORKER_URL_preview:
      process.env.CLOUDFLARE_WORKER_URL?.substring(0, 30) + "...",
    CLOUDFLARE_API_SECRET_preview:
      process.env.CLOUDFLARE_API_SECRET?.substring(0, 10) + "...",
    NEXT_PUBLIC_CLOUDFLARE_WORKER_URL_preview:
      process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL?.substring(0, 30) + "...",
    NEXT_PUBLIC_CLOUDFLARE_API_SECRET_preview:
      process.env.NEXT_PUBLIC_CLOUDFLARE_API_SECRET?.substring(0, 10) + "...",

    // 檢查所有包含 CLOUDFLARE 的環境變數
    allCloudflareEnvKeys: Object.keys(process.env).filter((key) =>
      key.includes("CLOUDFLARE")
    ),

    // 檢查所有環境變數
    allEnvKeys: Object.keys(process.env).sort(),
  });
}
