import { NextRequest, NextResponse } from "next/server";
import { getD1Database } from "@/lib/cloudflare";

// D1 資料庫中的遊戲方法類型
interface D1GameMethod {
  id: string;
  title: string;
  description: string;
  categories: string;
  grade1: boolean;
  grade2: boolean;
  grade3: boolean;
  grade4: boolean;
  grade5: boolean;
  grade6: boolean;
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
    if (
      error instanceof Error &&
      error.message === "D1_DATABASE_NOT_AVAILABLE_LOCAL"
    ) {
      console.log(
        "Local development environment detected, attempting to connect to D1 directly..."
      );

      // 在本地環境中，嘗試直接連接到 D1 資料庫
      try {
        // 使用 wrangler 的本地 D1 連接
        const { execSync } = require("child_process");

        // 執行 wrangler 命令來查詢 D1 資料庫
        const output = execSync(
          'wrangler d1 execute primary-english-db --command="SELECT * FROM game_methods ORDER BY created_at DESC"',
          { encoding: "utf8" }
        );

        // 解析輸出結果
        const lines = output.trim().split("\n");
        const games: D1GameMethod[] = [];

        // 跳過標題行，解析數據行
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          if (line.trim()) {
            // 這裡需要根據實際輸出格式來解析
            // 暫時返回空陣列，讓它使用 mock 數據
            console.log("Parsing line:", line);
          }
        }

        if (games.length > 0) {
          console.log(`Found ${games.length} games from D1`);
          return games;
        }
      } catch (d1Error) {
        console.log("Failed to connect to D1 directly:", d1Error);
      }

      console.log("Falling back to mock data...");
      return getMockGameData();
    }
    console.error("Error reading from D1:", error);
    return [];
  }
}

// 本地開發環境的測試數據
function getMockGameData(): D1GameMethod[] {
  return [
    {
      id: "1",
      title: "單字配對遊戲",
      description:
        "透過配對卡片的方式，讓學生學習英語單字，提升記憶力和理解能力。",
      categories: '["單字學習"]',
      grade1: true,
      grade2: false,
      grade3: false,
      grade4: false,
      grade5: false,
      grade6: false,
      materials: '["單字卡片", "計時器"]',
      instructions:
        '["準備多組單字卡片，每組包含英文單字和對應的中文意思", "將卡片打亂，背面朝上排列", "學生輪流翻開兩張卡片，如果配對成功則保留，失敗則翻回", "遊戲結束時，配對成功最多的學生獲勝"]',
      created_at: "2024-01-15T09:00:00.000Z",
      updated_at: "2024-01-15T09:00:00.000Z",
    },
    {
      id: "2",
      title: "句型接龍",
      description:
        "學生輪流說出符合特定句型的句子，訓練口語表達和語法運用能力。",
      categories: '["句型練習"]',
      grade1: false,
      grade2: true,
      grade3: false,
      grade4: false,
      grade5: false,
      grade6: false,
      materials: '["句型提示卡", "計分板"]',
      instructions:
        '["教師提供一個句型模板，例如：I like to...", "學生輪流完成句子，如：I like to read books", "每個學生說完後，下一個學生必須說出不同的內容", "無法完成或重複內容的學生扣分"]',
      created_at: "2024-01-12T14:30:00.000Z",
      updated_at: "2024-01-12T14:30:00.000Z",
    },
    {
      id: "3",
      title: "角色扮演對話",
      description: "學生扮演不同角色進行英語對話，練習日常用語和情境表達。",
      categories: '["口語訓練"]',
      grade1: false,
      grade2: false,
      grade3: true,
      grade4: false,
      grade5: false,
      grade6: false,
      materials: '["角色卡片", "情境設定"]',
      instructions:
        '["教師設定對話情境，如：在餐廳點餐", "分配角色給學生，如：服務生、顧客", "學生根據角色進行英語對話", "鼓勵學生使用學過的單字和句型"]',
      created_at: "2024-01-10T11:15:00.000Z",
      updated_at: "2024-01-10T11:15:00.000Z",
    },
  ];
}

// 將 D1 的布林值年級格式轉換為陣列格式
function convertGradesToArray(game: D1GameMethod) {
  const grades: string[] = [];
  if (game.grade1) grades.push("grade1");
  if (game.grade2) grades.push("grade2");
  if (game.grade3) grades.push("grade3");
  if (game.grade4) grades.push("grade4");
  if (game.grade5) grades.push("grade5");
  if (game.grade6) grades.push("grade6");
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

    // 從 D1 讀取數據
    console.log("Calling getGamesFromD1...");
    const gamesFromD1 = await getGamesFromD1();

    // 如果 D1 沒有數據，返回空結果
    if (gamesFromD1.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "D1 資料庫尚未設置，請先插入遊戲數據",
      });
    }

    // 轉換 D1 數據格式為組件期望的格式
    const convertedGames = gamesFromD1.map((game) => ({
      id: game.id,
      title: game.title,
      description: game.description,
      categories: JSON.parse(game.categories),
      grades: convertGradesToArray(game), // 轉換布林值為陣列
      materials: JSON.parse(game.materials),
      instructions: JSON.parse(game.instructions),
      createdAt: new Date(game.created_at),
      updatedAt: new Date(game.updated_at),
      // 保留布林值欄位以保持向後兼容
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
