import { NextRequest, NextResponse } from "next/server";
import { getD1Database } from "@/lib/cloudflare";
import mockGamesData from "@/mock_data/games.json";

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
async function getGamesFromD1(): Promise<D1GameMethod[]> {
  try {
    const db = getD1Database();

    console.log("D1 database connected, attempting to query...");

    // 先檢查資料庫結構
    const tableInfo = await db.prepare("PRAGMA table_info(game_methods)").all();
    console.log("Table structure:", tableInfo);

    // 嘗試查詢數據
    const result = await db
      .prepare("SELECT * FROM game_methods ORDER BY created_at DESC")
      .all();

    console.log("Query result:", result);
    return (result as any).results as D1GameMethod[];
  } catch (error) {
    console.error("Error reading from D1:", error);
    // 不拋出錯誤，讓上層處理
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
    const category = searchParams.get("category");
    const grade = searchParams.get("grade");

    console.log("Search params:", { category, grade });

    let gamesData: D1GameMethod[] = [];

    // 嘗試從 D1 資料庫讀取數據
    console.log("Attempting to read from D1 database...");
    try {
      gamesData = await getGamesFromD1();
      console.log(`Successfully read ${gamesData.length} games from D1 database`);
    } catch (d1Error) {
      console.log("D1 database access failed, falling back to mock data:", d1Error);
      
      // 回退到 mock 數據
      if (mockGamesData[0] && mockGamesData[0].results) {
        gamesData = mockGamesData[0].results as D1GameMethod[];
      } else {
        gamesData = mockGamesData as unknown as D1GameMethod[];
      }
      console.log(`Using ${gamesData.length} mock games as fallback`);
    }

    // 如果沒有數據，返回空結果
    if (gamesData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No games data available",
      });
    }

    // 轉換數據格式為組件期望的格式
    const convertedGames = gamesData.map((game) => ({
      id: game.id,
      title: game.title,
      description: game.description,
      categories: JSON.parse(game.categories),
      grades: convertGradesToArray(game), // 轉換數字為陣列
      materials: JSON.parse(game.materials),
      instructions: JSON.parse(game.instructions),
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

    let filteredGames = [...convertedGames];

    if (category) {
      filteredGames = filteredGames.filter((game) =>
        game.categories.includes(category)
      );
    }
    if (grade) {
      filteredGames = filteredGames.filter((game) =>
        game.grades.includes(grade)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredGames.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "獲取遊戲庫失敗" },
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

    // 將 grades 陣列轉換為布林值格式
    const gradeBooleans = {
      grade1: grades.includes("grade1"),
      grade2: grades.includes("grade2"),
      grade3: grades.includes("grade3"),
      grade4: grades.includes("grade4"),
      grade5: grades.includes("grade5"),
      grade6: grades.includes("grade6"),
    };

    const newGame = {
      id: Date.now().toString(),
      title,
      description,
      materials,
      instructions,
      grades,
      categories,
      ...gradeBooleans, // 添加布林值年級欄位
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 這裡會將數據插入 D1
    // 暫時返回成功，等 D1 設置完成後再實現
    console.log("New game to insert:", newGame);

    return NextResponse.json(
      {
        success: true,
        data: newGame,
        message: "遊戲創建成功（D1 插入功能待實現）",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "創建遊戲失敗" },
      { status: 500 }
    );
  }
}
