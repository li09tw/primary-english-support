import { NextRequest, NextResponse } from "next/server";
import {
  createCloudflareClient,
  isCloudflareSupported,
} from "@/lib/cloudflare-client";

// 強制動態路由，避免靜態生成問題
export const dynamic = "force-dynamic";

// D1 資料庫中的遊戲方法類型
interface D1GameMethod {
  id: string;
  title: string;
  description: string;
  categories: string;
  grade1: number; // 注意：D1 返回的是 0/1，不是 boolean
  grade2: number;
  grade3: number;
  grade4: number;
  grade5: number;
  grade6: number;
  materials: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

// 從 D1 讀取遊戲方法數據
async function getGamesFromD1(
  page: number = 1,
  limit: number = 20,
  categories?: string[],
  grades?: string[]
): Promise<{ data: D1GameMethod[]; total: number }> {
  try {
    if (!isCloudflareSupported()) {
      throw new Error("Cloudflare services not configured");
    }

    const client = createCloudflareClient();
    console.log("Cloudflare client created, attempting to query...");
    console.log("Query parameters:", { page, limit, categories, grades });

    // 構建 WHERE 子句
    let whereConditions: string[] = [];
    let params: any[] = [];

    // 分類篩選
    if (categories && categories.length > 0) {
      // 為每個分類創建一個 LIKE 條件
      const categoryConditions = categories.map(
        () => `categories LIKE '%' || ? || '%'`
      );
      whereConditions.push(`(${categoryConditions.join(" OR ")})`);
      categories.forEach((cat) => {
        params.push(cat);
      });
    }

    // 年級篩選
    if (grades && grades.length > 0) {
      const gradeConditions = grades.map((grade) => {
        // 確保正確的欄位名稱映射
        const gradeNumber = grade.replace("grade", "");
        return `grade${gradeNumber} = 1`;
      });
      whereConditions.push(`(${gradeConditions.join(" OR ")})`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // 計算總數
    const countQuery = `SELECT COUNT(*) as total FROM game_methods ${whereClause}`;
    console.log("Count query:", countQuery, "params:", params);

    const countResult = await client.query(countQuery, params);
    const total = countResult?.results?.[0]?.total || 0;

    console.log(`Total records found: ${total}`);

    // 分頁查詢
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM game_methods 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const allParams = [...params, limit, offset];
    console.log("Data query:", query, "params:", allParams);

    const result = await client.query(query, allParams);

    const resultCount = result?.results?.length || 0;
    console.log(
      `D1 query result: ${resultCount} games (page ${page}, offset ${offset})`
    );
    return {
      data: (result?.results as D1GameMethod[]) || [],
      total,
    };
  } catch (error) {
    console.error("Error reading from D1:", error);

    // 檢查是否是本地開發環境的 D1 不可用錯誤
    if (
      error instanceof Error &&
      error.message === "Cloudflare services not configured"
    ) {
      console.log(
        "Local development detected, Cloudflare services not configured - this is expected"
      );
      throw error; // 重新拋出錯誤，讓上層處理回退邏輯
    }

    throw new Error(
      `D1 database error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// 將 D1 的數字年級格式轉換為陣列格式
function convertGradesToArray(game: D1GameMethod) {
  const grades: string[] = [];
  if (game.grade1 === 1) grades.push("grade1");
  if (game.grade2 === 1) grades.push("grade2");
  if (game.grade3 === 1) grades.push("grade3");
  if (game.grade4 === 1) grades.push("grade4");
  if (game.grade5 === 1) grades.push("grade5");
  if (game.grade6 === 1) grades.push("grade6");
  return grades;
}

// GET /api/games - 獲取遊戲庫列表
export async function GET(request: NextRequest) {
  console.log("=== API /api/games called ===");
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const grade = searchParams.get("grade");

    console.log("Search params:", { page, limit, category, grade });

    // 處理篩選參數
    const categories = category ? [category] : undefined;
    const grades = grade ? [grade] : undefined;

    let gamesData: D1GameMethod[] = [];
    let totalCount = 0;

    // 嘗試從 D1 資料庫讀取數據
    console.log("Attempting to read from D1 database...");
    try {
      const d1Result = await getGamesFromD1(page, limit, categories, grades);
      gamesData = d1Result.data;
      totalCount = d1Result.total;
      console.log(
        `Successfully read ${gamesData.length} games from D1 database (page ${page}, total: ${totalCount})`
      );
    } catch (d1Error) {
      console.log("D1 database access failed:", d1Error);

      // 在生產環境中，如果 Cloudflare 服務不可用，返回錯誤
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            success: false,
            error: "Cloudflare services unavailable",
            message: "Unable to retrieve games data. Please try again later.",
          },
          { status: 500 }
        );
      }

      // 開發環境返回空結果
      gamesData = [];
      totalCount = 0;
    }

    // 如果沒有數據，返回空結果
    if (gamesData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        page,
        limit,
        hasMore: false,
        message: "No games data available",
      });
    }

    // 轉換數據格式為組件期望的格式
    const convertedGames = gamesData.map((game) => ({
      id: game.id,
      title: game.title,
      description: game.description,
      categories: JSON.parse(game.categories || "[]"),
      grades: convertGradesToArray(game), // 轉換數字為陣列
      materials: JSON.parse(game.materials || "[]"),
      instructions: JSON.parse(game.instructions || "[]"),
      createdAt: new Date(game.created_at),
      updatedAt: new Date(game.updated_at),
      // 保留數字欄位以保持向後兼容
      grade1: game.grade1,
      grade2: game.grade2,
      grade3: game.grade3,
      grade4: game.grade4,
      grade5: game.grade5,
      grade6: game.grade6,
    }));

    const hasMore = page * limit < totalCount;

    return NextResponse.json({
      success: true,
      data: convertedGames,
      total: totalCount,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "獲取遊戲庫失敗",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/games - 創建新的遊戲
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, materials, instructions, grades, categories } =
      body;

    if (
      !title ||
      !description ||
      !materials ||
      !instructions ||
      !grades ||
      !categories
    ) {
      return NextResponse.json(
        { success: false, error: "所有欄位都為必填" },
        { status: 400 }
      );
    }

    // 將 grades 陣列轉換為數字格式 (0/1)
    const gradeNumbers = {
      grade1: grades.includes("grade1") ? 1 : 0,
      grade2: grades.includes("grade2") ? 1 : 0,
      grade3: grades.includes("grade3") ? 1 : 0,
      grade4: grades.includes("grade4") ? 1 : 0,
      grade5: grades.includes("grade5") ? 1 : 0,
      grade6: grades.includes("grade6") ? 1 : 0,
    };

    // 插入新遊戲到 D1 資料庫
    const insertQuery = `
      INSERT INTO game_methods (
        title, description, materials, instructions, 
        grade1, grade2, grade3, grade4, grade5, grade6,
        categories, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();
    const insertParams = [
      title,
      description,
      JSON.stringify(materials),
      JSON.stringify(instructions),
      gradeNumbers.grade1,
      gradeNumbers.grade2,
      gradeNumbers.grade3,
      gradeNumbers.grade4,
      gradeNumbers.grade5,
      gradeNumbers.grade6,
      JSON.stringify(categories),
      now,
      now,
    ];

    const client = createCloudflareClient();
    const result = await client.execute(insertQuery, insertParams);

    const newGame = {
      id:
        (result as any).meta?.last_row_id?.toString() || Date.now().toString(),
      title,
      description,
      materials,
      instructions,
      grades,
      categories,
      ...gradeNumbers,
      createdAt: now,
      updatedAt: now,
    };

    return NextResponse.json(
      {
        success: true,
        data: newGame,
        message: "遊戲創建成功",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      {
        success: false,
        error: "創建遊戲失敗",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
