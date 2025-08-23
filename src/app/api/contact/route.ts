import { NextRequest, NextResponse } from "next/server";

// 模擬資料庫 - 實際部署時會使用 Cloudflare D1 或 KV
let contactMessages: Array<{
  id: string;
  name: string;
  email: string;
  type: string;
  title: string;
  content: string;
  status: "pending" | "replied" | "resolved";
  createdAt: string;
  updatedAt: string;
}> = [];

// GET /api/contact - 獲取聯絡記錄（管理員用）
export async function GET(request: NextRequest) {
  try {
    // 這裡應該加入身份驗證檢查
    // 實際部署時會檢查 JWT token 或 session

    return NextResponse.json({
      success: true,
      data: contactMessages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "獲取聯絡記錄失敗" },
      { status: 500 }
    );
  }
}

// POST /api/contact - 提交聯絡表單
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, type, title, content } = body;

    if (!name || !email || !type || !title || !content) {
      return NextResponse.json(
        { success: false, error: "所有欄位都為必填" },
        { status: 400 }
      );
    }

    // 簡單的 email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "請輸入有效的 Email 地址" },
        { status: 400 }
      );
    }

    const newMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      type: type.trim(),
      title: title.trim(),
      content: content.trim(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    contactMessages.push(newMessage);

    // 這裡可以整合 EmailJS 或其他郵件服務
    // 發送通知郵件給管理員
    try {
      // 實際部署時會調用 EmailJS 或其他郵件服務
      console.log("聯絡表單已提交:", newMessage);

      // 可以發送確認郵件給用戶
      // await sendConfirmationEmail(email, name);

      // 可以發送通知郵件給管理員
      // await sendNotificationEmail('admin@example.com', `新的聯絡表單: ${title}`, content);
    } catch (emailError) {
      console.error("郵件發送失敗:", emailError);
      // 郵件發送失敗不影響表單提交
    }

    return NextResponse.json(
      {
        success: true,
        data: newMessage,
        message: "聯絡表單已成功提交，我們會盡快回覆您！",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "提交聯絡表單失敗" },
      { status: 500 }
    );
  }
}

// PUT /api/contact/:id - 更新聯絡記錄狀態
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID 和狀態為必填欄位" },
        { status: 400 }
      );
    }

    const messageIndex = contactMessages.findIndex((msg) => msg.id === id);
    if (messageIndex === -1) {
      return NextResponse.json(
        { success: false, error: "找不到指定的聯絡記錄" },
        { status: 404 }
      );
    }

    contactMessages[messageIndex].status = status;
    contactMessages[messageIndex].updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: contactMessages[messageIndex],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "更新聯絡記錄失敗" },
      { status: 500 }
    );
  }
}
