import { NextRequest, NextResponse } from "next/server";

// 模擬資料庫 - 實際部署時會使用 Cloudflare D1 或 KV
let adminMessages: Array<{
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: "1",
    title: "歡迎使用 Z的國小英語支援(ZPES)",
    content: "我們致力於為資源不足的學校提供高品質的英語教學工具。",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/admin - 獲取管理員消息
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: adminMessages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "獲取消息失敗" },
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

    const newMessage = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    adminMessages.push(newMessage);

    return NextResponse.json(
      {
        success: true,
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "創建消息失敗" },
      { status: 500 }
    );
  }
}
