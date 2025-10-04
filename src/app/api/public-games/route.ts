import { NextRequest, NextResponse } from "next/server";

// 強制動態路由，避免靜態生成問題
export const dynamic = "force-dynamic";

// 外部連結類型定義
interface ExternalLink {
  id: string;
  title: string;
  url: string;
  platform: "wordwall" | "kahoot" | "other";
  description?: string;
  grade_level?: "elementary_3_6" | "junior_high_1";
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// 模擬的外部連結數據
const mockExternalLinks: ExternalLink[] = [
  {
    id: "1",
    title: "國小英語單字練習 - Wordwall",
    url: "https://wordwall.net/resource/example1",
    platform: "wordwall",
    description: "適合國小3-6年級的英語單字練習遊戲",
    grade_level: "elementary_3_6",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "英語句型練習 - Kahoot",
    url: "https://kahoot.com/challenge/example1",
    platform: "kahoot",
    description: "互動式英語句型練習測驗",
    grade_level: "elementary_3_6",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    title: "國一英語文法練習 - Wordwall",
    url: "https://wordwall.net/resource/example2",
    platform: "wordwall",
    description: "適合國一的英語文法練習活動",
    grade_level: "junior_high_1",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    title: "英語聽力測驗 - Kahoot",
    url: "https://kahoot.com/challenge/example2",
    platform: "kahoot",
    description: "英語聽力理解測驗",
    grade_level: "junior_high_1",
    is_published: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];

// 生成唯一 ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 獲取所有外部連結
export async function GET() {
  try {
    console.log("開始獲取外部連結...");

    // 返回已發布的連結
    const publishedLinks = mockExternalLinks.filter(
      (link) => link.is_published
    );

    console.log("查詢結果:", publishedLinks);

    return NextResponse.json({
      success: true,
      data: publishedLinks,
    });
  } catch (error) {
    console.error("獲取 Wordwall/Kahoot 連結錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        error: `伺服器錯誤: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}

// 創建新的外部連結
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, platform, description, grade_level } = body;

    // 驗證必填欄位
    if (!title || !url || !platform) {
      return NextResponse.json(
        { success: false, error: "標題、連結和平台為必填欄位" },
        { status: 400 }
      );
    }

    // 驗證平台類型
    if (!["wordwall", "kahoot", "other"].includes(platform)) {
      return NextResponse.json(
        { success: false, error: "平台類型必須為 wordwall、kahoot 或 other" },
        { status: 400 }
      );
    }

    const id = generateId();
    const now = new Date().toISOString();

    const newLink: ExternalLink = {
      id,
      title,
      url,
      platform,
      description: description || "",
      grade_level: grade_level || null,
      is_published: true,
      created_at: now,
      updated_at: now,
    };

    // 在實際應用中，這裡應該將數據保存到資料庫
    // 目前只是模擬成功回應
    return NextResponse.json({
      success: true,
      data: newLink,
    });
  } catch (error) {
    console.error("創建 Wordwall/Kahoot 連結錯誤:", error);
    return NextResponse.json(
      { success: false, error: "伺服器錯誤" },
      { status: 500 }
    );
  }
}

// 更新外部連結
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, url, platform, description, grade_level, is_published } =
      body;

    // 驗證必填欄位
    if (!id || !title || !url || !platform) {
      return NextResponse.json(
        { success: false, error: "ID、標題、連結和平台為必填欄位" },
        { status: 400 }
      );
    }

    // 驗證平台類型
    if (!["wordwall", "kahoot", "other"].includes(platform)) {
      return NextResponse.json(
        { success: false, error: "平台類型必須為 wordwall、kahoot 或 other" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // 在實際應用中，這裡應該更新資料庫中的數據
    // 目前只是模擬成功回應
    return NextResponse.json({
      success: true,
      data: {
        id,
        title,
        url,
        platform,
        description,
        grade_level,
        is_published,
        updated_at: now,
      },
    });
  } catch (error) {
    console.error("更新 Wordwall/Kahoot 連結錯誤:", error);
    return NextResponse.json(
      { success: false, error: "伺服器錯誤" },
      { status: 500 }
    );
  }
}

// 刪除外部連結
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "缺少連結 ID" },
        { status: 400 }
      );
    }

    // 在實際應用中，這裡應該從資料庫中刪除數據
    // 目前只是模擬成功回應
    return NextResponse.json({
      success: true,
      message: "Wordwall/Kahoot 連結已刪除",
    });
  } catch (error) {
    console.error("刪除 Wordwall/Kahoot 連結錯誤:", error);
    return NextResponse.json(
      { success: false, error: "伺服器錯誤" },
      { status: 500 }
    );
  }
}
