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

// GET /api/admin-messages - 獲取所有站長消息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    const client = createLocalCloudflareClient();

    let query =
      "SELECT * FROM admin_messages ORDER BY is_pinned DESC, created_at DESC";
    if (publishedOnly) {
      query =
        "SELECT * FROM admin_messages WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC";
    }

    const result = await client.query(query);
    const messages = (result?.results as LocalAdminMessage[]) || [];

    return NextResponse.json({
      success: true,
      data: messages,
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

// POST /api/admin-messages - 創建新的站長消息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, is_published = true, is_pinned = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "標題和內容為必填欄位" },
        { status: 400 }
      );
    }

    const client = createLocalCloudflareClient();
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO admin_messages (id, title, content, is_published, is_pinned, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await client.execute(insertQuery, [
      id,
      title,
      content,
      is_published ? 1 : 0,
      is_pinned ? 1 : 0,
      now,
      now,
    ]);

    const newMessage: LocalAdminMessage = {
      id,
      title,
      content,
      is_published,
      is_pinned,
      created_at: now,
      updated_at: now,
    };

    return NextResponse.json(
      {
        success: true,
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin message:", error);
    return NextResponse.json(
      { success: false, error: "創建站長消息失敗" },
      { status: 500 }
    );
  }
}
