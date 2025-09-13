import { NextRequest, NextResponse } from "next/server";
import { createLocalCloudflareClient } from "@/lib/cloudflare-client-local";

// 強制動態路由，避免靜態生成問題
export const dynamic = "force-dynamic";

// 本地虛擬資料庫中的管理員消息類型
interface LocalAdminMessage {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

// GET /api/admin-messages/[id] - 獲取單個站長消息
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const client = createLocalCloudflareClient();

    const query = "SELECT * FROM admin_messages WHERE id = ?";
    const result = await client.query(query, [id]);
    const messages = (result?.results as LocalAdminMessage[]) || [];

    if (messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "站長消息不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: messages[0],
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "獲取站長消息失敗",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin-messages/[id] - 更新站長消息
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { title, content, is_published, is_pinned } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "標題和內容為必填欄位" },
        { status: 400 }
      );
    }

    const client = createLocalCloudflareClient();
    const now = new Date().toISOString();

    const updateQuery = `
      UPDATE admin_messages 
      SET title = ?, content = ?, is_published = ?, is_pinned = ?, updated_at = ?
      WHERE id = ?
    `;

    const result = await client.execute(updateQuery, [
      title,
      content,
      is_published ? 1 : 0,
      is_pinned ? 1 : 0,
      now,
      id,
    ]);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "站長消息更新成功",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "更新站長消息失敗" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating admin message:", error);
    return NextResponse.json(
      { success: false, error: "更新站長消息失敗" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin-messages/[id] - 刪除站長消息
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const client = createLocalCloudflareClient();

    const deleteQuery = "DELETE FROM admin_messages WHERE id = ?";
    const result = await client.execute(deleteQuery, [id]);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "站長消息刪除成功",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "刪除站長消息失敗" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting admin message:", error);
    return NextResponse.json(
      { success: false, error: "刪除站長消息失敗" },
      { status: 500 }
    );
  }
}
