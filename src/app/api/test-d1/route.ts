import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 檢查多種可能的環境變數綁定方式
    const cloudflareEnv = (globalThis as any).cloudflare?.env;
    const directEnv = (globalThis as any).env;
    const d1Database =
      cloudflareEnv?.PRIMARY_ENGLISH_DB || directEnv?.PRIMARY_ENGLISH_DB;

    if (!d1Database) {
      return NextResponse.json({
        success: false,
        message: "D1 資料庫未連接",
        availableBindings: {
          cloudflareEnv: !!cloudflareEnv,
          directEnv: !!directEnv,
          d1Database: !!d1Database,
        },
        globalThisKeys: Object.keys(globalThis).filter(
          (key) =>
            key.includes("ENGLISH") ||
            key.includes("DB") ||
            key.includes("CLOUDFLARE")
        ),
      });
    }

    // 嘗試查詢資料庫結構
    const tableInfo = await d1Database
      .prepare("PRAGMA table_info(game_methods)")
      .all();

    // 嘗試查詢數據
    const result = await d1Database
      .prepare("SELECT COUNT(*) as count FROM game_methods")
      .all();

    return NextResponse.json({
      success: true,
      message: "D1 資料庫連接成功",
      tableInfo: tableInfo.results,
      gameCount: result.results[0]?.count || 0,
      availableBindings: {
        cloudflareEnv: !!cloudflareEnv,
        directEnv: !!directEnv,
        d1Database: !!d1Database,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "D1 資料庫連接失敗",
        error: error.message,
        stack: error.stack,
        availableBindings: {
          cloudflareEnv: !!(globalThis as any).cloudflare?.env,
          directEnv: !!(globalThis as any).env,
          d1Database: !!(
            (globalThis as any).cloudflare?.env?.PRIMARY_ENGLISH_DB ||
            (globalThis as any).env?.PRIMARY_ENGLISH_DB
          ),
        },
      },
      { status: 500 }
    );
  }
}
