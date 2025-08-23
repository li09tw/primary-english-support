import { NextRequest, NextResponse } from "next/server";
import {
  createCloudflareClient,
  isCloudflareSupported,
} from "@/lib/cloudflare-client";
import {
  createLocalCloudflareClient,
  isLocalDevelopment,
} from "@/lib/cloudflare-client-local";

// 強制動態路由，避免靜態生成問題
export const dynamic = "force-dynamic";

// D1 資料庫中的管理員消息類型
interface D1AdminMessage {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 從 D1 讀取管理員消息
async function getAdminMessagesFromD1(): Promise<D1AdminMessage[]> {
  try {
    let client;
    
    if (isLocalDevelopment()) {
      // 本地開發環境使用本地客戶端
      client = createLocalCloudflareClient();
    } else if (isCloudflareSupported()) {
      // 生產環境使用 Cloudflare 客戶端
      client = createCloudflareClient();
    } else {
      throw new Error("Cloudflare services not configured");
    }
    const query = "SELECT * FROM admin_messages ORDER BY created_at DESC";
    const result = await client.query(query);

    return (result?.results as D1AdminMessage[]) || [];
  } catch (error) {
    console.error("Error reading from D1:", error);
    throw error;
  }
}

// 創建新的管理員消息到 D1
async function createAdminMessageInD1(
  title: string,
  content: string
): Promise<D1AdminMessage> {
  try {
    let client;
    
    if (isLocalDevelopment()) {
      // 本地開發環境使用本地客戶端
      client = createLocalCloudflareClient();
    } else if (isCloudflareSupported()) {
      // 生產環境使用 Cloudflare 客戶端
      client = createCloudflareClient();
    } else {
      throw new Error("Cloudflare services not configured");
    }
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO admin_messages (id, title, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    await client.execute(insertQuery, [id, title, content, now, now]);

    return {
      id,
      title,
      content,
      created_at: now,
      updated_at: now,
    };
  } catch (error) {
    console.error("Error creating admin message in D1:", error);
    throw error;
  }
}

// GET /api/admin - 獲取管理員消息
export async function GET() {
  try {
    let adminMessages: D1AdminMessage[] = [];

    // 嘗試從 D1 資料庫讀取數據
    try {
      adminMessages = await getAdminMessagesFromD1();
    } catch (d1Error) {
      console.log("D1 database access failed:", d1Error);

      // 在生產環境中，如果 Cloudflare 服務不可用，返回錯誤
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            success: false,
            error: "Cloudflare services unavailable",
            message:
              "Unable to retrieve admin messages. Please try again later.",
          },
          { status: 500 }
        );
      }

      // 開發環境返回空結果
      adminMessages = [];
    }

    return NextResponse.json({
      success: true,
      data: adminMessages,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "獲取管理員消息失敗",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin - 創建新的管理員消息
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "標題和內容為必填欄位" },
        { status: 400 }
      );
    }

    let newMessage: D1AdminMessage;

    // 嘗試創建到 D1 資料庫
    try {
      newMessage = await createAdminMessageInD1(title, content);
    } catch (d1Error) {
      console.log("D1 database access failed:", d1Error);

      // 在生產環境中，如果 Cloudflare 服務不可用，返回錯誤
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            success: false,
            error: "Cloudflare services unavailable",
            message: "Unable to create admin message. Please try again later.",
          },
          { status: 500 }
        );
      }

      // 開發環境返回模擬結果
      newMessage = {
        id: Date.now().toString(),
        title,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

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
      { success: false, error: "創建管理員消息失敗" },
      { status: 500 }
    );
  }
}
