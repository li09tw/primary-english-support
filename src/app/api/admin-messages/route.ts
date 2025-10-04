import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// 讀取 admin-messages.json 檔案
function getAdminMessages() {
  try {
    const filePath = join(process.cwd(), "data", "admin-messages.json");
    const fileContent = readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("讀取 admin-messages.json 失敗:", error);
    return [];
  }
}

// 獲取所有管理員消息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    const messages = getAdminMessages();

    // 如果要求只顯示已發布的消息
    if (published === "true") {
      const publishedMessages = messages.filter((msg: any) => msg.is_published);
      return NextResponse.json({
        success: true,
        data: publishedMessages,
      });
    }

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("獲取管理員消息失敗:", error);
    return NextResponse.json(
      { success: false, error: "獲取管理員消息失敗" },
      { status: 500 }
    );
  }
}
