import { NextRequest, NextResponse } from "next/server";
import {
  readAdminMessages,
  addAdminMessage,
  updateAdminMessage,
  deleteAdminMessage,
  togglePublishStatus,
  togglePinStatus,
} from "@/lib/json-storage";
import { AdminMessage } from "@/types";

// 強制動態路由，避免靜態生成問題
export const dynamic = "force-dynamic";

// 從 JSON 檔案讀取管理員消息
async function getAdminMessagesFromJSON(): Promise<AdminMessage[]> {
  try {
    return readAdminMessages();
  } catch (error) {
    console.error("Error reading from JSON file:", error);
    throw error;
  }
}

// 創建新的管理員消息到 JSON 檔案
async function createAdminMessageInJSON(
  title: string,
  content: string,
  is_published: boolean = true,
  is_pinned: boolean = false
): Promise<AdminMessage> {
  try {
    return addAdminMessage({
      title,
      content,
      is_published,
      is_pinned,
    });
  } catch (error) {
    console.error("Error creating admin message in JSON file:", error);
    throw error;
  }
}

// GET /api/admin - 獲取管理員消息
export async function GET() {
  try {
    let adminMessages: AdminMessage[] = [];

    // 從 JSON 檔案讀取數據
    try {
      adminMessages = await getAdminMessagesFromJSON();
    } catch (jsonError) {
      console.log("JSON file access failed:", jsonError);
      // 如果 JSON 檔案不可用，返回空結果
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
    const { title, content, is_published = true, is_pinned = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "標題和內容為必填欄位" },
        { status: 400 }
      );
    }

    let newMessage: AdminMessage;

    // 創建到 JSON 檔案
    try {
      newMessage = await createAdminMessageInJSON(
        title,
        content,
        is_published,
        is_pinned
      );
    } catch (jsonError) {
      console.log("JSON file access failed:", jsonError);

      // 如果 JSON 檔案不可用，返回模擬結果
      newMessage = {
        id: Date.now().toString(),
        title,
        content,
        is_published,
        is_pinned,
        published_at: new Date(),
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

// PUT /api/admin - 更新管理員消息
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, is_published, is_pinned } = body;

    if (!id || !title || !content) {
      return NextResponse.json(
        { success: false, error: "ID、標題和內容為必填欄位" },
        { status: 400 }
      );
    }

    try {
      const updatedMessage = updateAdminMessage(id, {
        title,
        content,
        is_published,
        is_pinned,
      });

      if (updatedMessage) {
        return NextResponse.json({
          success: true,
          message: "管理員消息更新成功",
          data: updatedMessage,
        });
      } else {
        return NextResponse.json(
          { success: false, error: "找不到指定的管理員消息" },
          { status: 404 }
        );
      }
    } catch (jsonError) {
      console.log("JSON file access failed:", jsonError);
      return NextResponse.json(
        { success: false, error: "JSON 檔案不可用" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating admin message:", error);
    return NextResponse.json(
      { success: false, error: "更新管理員消息失敗" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin - 刪除管理員消息
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID 為必填欄位" },
        { status: 400 }
      );
    }

    try {
      const success = deleteAdminMessage(id);

      if (success) {
        return NextResponse.json({
          success: true,
          message: "管理員消息刪除成功",
        });
      } else {
        return NextResponse.json(
          { success: false, error: "找不到指定的管理員消息" },
          { status: 404 }
        );
      }
    } catch (jsonError) {
      console.log("JSON file access failed:", jsonError);
      return NextResponse.json(
        { success: false, error: "JSON 檔案不可用" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting admin message:", error);
    return NextResponse.json(
      { success: false, error: "刪除管理員消息失敗" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin - 切換管理員消息狀態
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type } = body; // type: 'publish' 或 'pin'

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: "ID 和類型為必填欄位" },
        { status: 400 }
      );
    }

    if (!["publish", "pin"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "類型必須是 'publish' 或 'pin'" },
        { status: 400 }
      );
    }

    try {
      let updatedMessage: AdminMessage | null;

      if (type === "publish") {
        updatedMessage = togglePublishStatus(id);
      } else {
        updatedMessage = togglePinStatus(id);
      }

      if (updatedMessage) {
        return NextResponse.json({
          success: true,
          message: `管理員消息${
            type === "publish" ? "發布" : "釘選"
          }狀態切換成功`,
          data: updatedMessage,
        });
      } else {
        return NextResponse.json(
          { success: false, error: "找不到指定的管理員消息" },
          { status: 404 }
        );
      }
    } catch (jsonError) {
      console.log("JSON file access failed:", jsonError);
      return NextResponse.json(
        { success: false, error: "JSON 檔案不可用" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error toggling admin message status:", error);
    return NextResponse.json(
      { success: false, error: "切換管理員消息狀態失敗" },
      { status: 500 }
    );
  }
}
