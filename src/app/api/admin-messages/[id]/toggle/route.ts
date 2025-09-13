import { NextRequest, NextResponse } from "next/server";
import { createLocalCloudflareClient } from "@/lib/cloudflare-client-local";

// 強制動態路由，避免靜態生成問題
export const dynamic = "force-dynamic";

// POST /api/admin-messages/[id]/toggle - 切換站長消息狀態
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { type } = body; // 'publish' 或 'pin'

    if (!type || !["publish", "pin"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "類型必須是 'publish' 或 'pin'" },
        { status: 400 }
      );
    }

    const client = createLocalCloudflareClient();
    const now = new Date().toISOString();

    let updateQuery: string;
    if (type === "publish") {
      updateQuery = `
        UPDATE admin_messages 
        SET is_published = NOT is_published, updated_at = ?
        WHERE id = ?
      `;
    } else {
      updateQuery = `
        UPDATE admin_messages 
        SET is_pinned = NOT is_pinned, updated_at = ?
        WHERE id = ?
      `;
    }

    const result = await client.execute(updateQuery, [now, id]);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `站長消息${type === "publish" ? "發布" : "釘選"}狀態切換成功`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `切換站長消息${type === "publish" ? "發布" : "釘選"}狀態失敗`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error toggling admin message status:", error);
    return NextResponse.json(
      { success: false, error: "切換站長消息狀態失敗" },
      { status: 500 }
    );
  }
}
