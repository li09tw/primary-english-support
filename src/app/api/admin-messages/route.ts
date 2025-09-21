import { NextRequest, NextResponse } from "next/server";
import { createLocalCloudflareClient } from "@/lib/cloudflare-client-local";
import { getCloudflareConfig } from "@/lib/env-config";
import fs from "fs";
import path from "path";

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

// 從 JSON 檔案讀取管理員消息（本地開發用）
async function getMessagesFromJSON(publishedOnly: boolean) {
  try {
    const filePath = path.join(process.cwd(), "data", "admin-messages.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const messages = JSON.parse(fileContents);

    if (publishedOnly) {
      return messages.filter((msg: any) => msg.is_published === true);
    }

    return messages;
  } catch (error) {
    console.error("讀取 JSON 檔案失敗:", error);
    return [];
  }
}

// GET /api/admin-messages - 獲取所有站長消息
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    // 檢查是否為本地開發環境
    const isLocalDev = process.env.NODE_ENV === "development";

    if (isLocalDev) {
      // 本地開發：從 JSON 檔案讀取
      console.log("🔧 本地開發模式：從 JSON 檔案讀取站長消息");
      const messages = await getMessagesFromJSON(publishedOnly);

      return NextResponse.json({
        success: true,
        data: messages,
      });
    } else {
      // Production：從 Cloudflare Worker 讀取
      console.log("☁️ Production 模式：從 Cloudflare Worker 讀取站長消息");
      const client = createLocalCloudflareClient();

      let query =
        "SELECT * FROM admin_messages ORDER BY is_pinned DESC, created_at DESC";
      if (publishedOnly) {
        query =
          "SELECT * FROM admin_messages WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC";
      }

      const result = await client.query(query);
      const localMessages = (result?.results as LocalAdminMessage[]) || [];

      // 轉換資料格式，將 created_at 轉換為 published_at
      const messages = localMessages.map((msg) => ({
        id: msg.id,
        title: msg.title,
        content: msg.content,
        is_published: msg.is_published,
        is_pinned: msg.is_pinned,
        published_at: new Date(msg.created_at),
      }));

      return NextResponse.json({
        success: true,
        data: messages,
      });
    }
  } catch (error) {
    console.error("API error:", error);

    // 如果 Cloudflare Worker 失敗，嘗試從 JSON 檔案讀取（fallback）
    if (process.env.NODE_ENV !== "development") {
      console.log("🔄 Cloudflare Worker 失敗，嘗試從 JSON 檔案讀取");
      try {
        const { searchParams } = new URL(request.url);
        const publishedOnly = searchParams.get("published") === "true";
        const messages = await getMessagesFromJSON(publishedOnly);

        return NextResponse.json({
          success: true,
          data: messages,
        });
      } catch (fallbackError) {
        console.error("Fallback 也失敗:", fallbackError);
      }
    }

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

    const newMessage = {
      id,
      title,
      content,
      is_published,
      is_pinned,
      published_at: new Date(now),
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
