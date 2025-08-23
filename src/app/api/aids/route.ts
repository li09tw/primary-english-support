import { NextRequest, NextResponse } from "next/server";

// 模擬資料庫 - 實際部署時會使用 Cloudflare D1 或 KV
let teachingAids: Array<{
  id: string;
  name: string;
  description: string;
  type: "flashcard" | "worksheet" | "game" | "audio" | "video" | "interactive";
  subject:
    | "vocabulary"
    | "grammar"
    | "phonics"
    | "conversation"
    | "comprehension";
  grade: "grade1" | "grade2" | "grade3" | "grade4" | "grade5" | "grade6";
  tags: string[];
  fileUrl?: string;
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}> = [
  {
    id: "1",
    name: "動物單字閃卡",
    description: "包含常見動物的英語單字和圖片，適合幼兒園學生學習。",
    type: "flashcard",
    subject: "vocabulary",
    grade: "grade1",
    tags: ["動物", "單字", "圖片", "幼兒園"],
    fileUrl: "/aids/animal-flashcards.pdf",
    previewUrl: "/aids/animal-flashcards-preview.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "基礎文法練習題",
    description: "包含 be 動詞、一般現在式等基礎文法的練習題目。",
    type: "worksheet",
    subject: "grammar",
    grade: "grade2",
    tags: ["文法", "練習題", "be動詞", "一般現在式"],
    fileUrl: "/aids/grammar-worksheet.pdf",
    previewUrl: "/aids/grammar-worksheet-preview.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/aids - 獲取教學輔具列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const subject = searchParams.get("subject");
    const grade = searchParams.get("grade");

    const tag = searchParams.get("tag");

    let filteredAids = [...teachingAids];

    if (type) {
      filteredAids = filteredAids.filter((aid) => aid.type === type);
    }
    if (subject) {
      filteredAids = filteredAids.filter((aid) => aid.subject === subject);
    }
    if (grade) {
      filteredAids = filteredAids.filter((aid) => aid.grade === grade);
    }

    if (tag) {
      filteredAids = filteredAids.filter((aid) => aid.tags.includes(tag));
    }

    return NextResponse.json({
      success: true,
      data: filteredAids.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "獲取教學輔具失敗" },
      { status: 500 }
    );
  }
}

// POST /api/aids - 創建新的教學輔具
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      type,
      subject,
      grade,
      tags,
      fileUrl,
      previewUrl,
    } = body;

    if (!name || !description || !type || !subject || !grade || !tags) {
      return NextResponse.json(
        { success: false, error: "必填欄位不能為空" },
        { status: 400 }
      );
    }

    const newAid = {
      id: Date.now().toString(),
      name,
      description,
      type,
      subject,
      grade,
      tags,
      fileUrl,
      previewUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    teachingAids.push(newAid);

    return NextResponse.json(
      {
        success: true,
        data: newAid,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "創建教學輔具失敗" },
      { status: 500 }
    );
  }
}
