import { NextRequest, NextResponse } from "next/server";

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
    // 嘗試訪問 Cloudflare 環境（僅在部署後可用）
    const cloudflareEnv = (globalThis as any).cloudflare?.env;
    if (cloudflareEnv?.PRIMARY_ENGLISH_DB) {
      console.log("Cloudflare environment detected, attempting to query D1...");

      // 先檢查資料庫結構
      const tableInfo = await cloudflareEnv.PRIMARY_ENGLISH_DB.prepare(
        "PRAGMA table_info(game_methods)"
      ).all();
      console.log("Table structure:", tableInfo.results);

      // 嘗試查詢數據
      const result = await cloudflareEnv.PRIMARY_ENGLISH_DB.prepare(
        "SELECT * FROM game_methods ORDER BY created_at DESC"
      ).all();

      console.log("Query result:", result);
      return result.results as D1GameMethod[];
    }

    // 開發環境下，檢查是否啟用本地 D1
    if (process.env.ENABLE_LOCAL_D1 === "true") {
      console.log("Attempting to use local D1 database...");

      try {
        // 使用 wrangler 命令查詢本地 D1
        const { execSync } = require("child_process");
        const result = execSync(
          'wrangler d1 execute primary-english-db --command="SELECT * FROM game_methods ORDER BY created_at DESC"',
          {
            encoding: "utf8",
            cwd: process.cwd(),
          }
        );

        // 解析 wrangler 輸出
        const lines = result.trim().split("\n");
        const dataStartIndex = lines.findIndex((line: string) =>
          line.includes("│ id │")
        );
        if (dataStartIndex !== -1) {
          const dataLines = lines
            .slice(dataStartIndex + 2)
            .filter((line: string) => line.trim() && line.includes("│"));
          const games: D1GameMethod[] = [];

          for (const line of dataLines) {
            const columns = line
              .split("│")
              .map((col: string) => col.trim())
              .filter((col: string) => col);
            if (columns.length >= 13) {
              games.push({
                id: columns[0],
                title: columns[1],
                description: columns[2],
                categories: columns[3],
                grade1: columns[4] === "1",
                grade2: columns[5] === "1",
                grade3: columns[6] === "1",
                grade4: columns[7] === "1",
                grade5: columns[8] === "1",
                grade6: columns[9] === "1",
                materials: columns[10],
                instructions: columns[11],
                created_at: columns[12],
                updated_at: columns[13] || columns[12],
              });
            }
          }

          console.log(
            `Successfully loaded ${games.length} games from local D1`
          );
          return games;
        }
      } catch (localError: any) {
        console.log(
          "Local D1 query failed, falling back to mock data:",
          localError.message
        );
      }
    }

    // 如果本地 D1 也失敗，返回模擬數據
    console.log("D1 database not available, returning mock data");
    return [
      {
        id: "1",
        title: "單字記憶遊戲 [本機開發數據]",
        description:
          "透過配對遊戲幫助學生記憶英文單字 - 本機開發環境數據，僅供測試使用",
        categories: '["單字學習", "記憶訓練"]',
        grade1: true,
        grade2: true,
        grade3: false,
        grade4: false,
        grade5: false,
        grade6: false,
        materials: '["單字卡片", "計時器"]',
        instructions: '["準備單字卡片", "學生配對相同單字", "計時完成"]',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "句型練習活動 [本機開發數據]",
        description:
          "讓學生練習基本英文句型結構 - 本機開發環境數據，僅供測試使用",
        categories: '["句型練習", "口語訓練"]',
        grade1: false,
        grade2: false,
        grade3: true,
        grade4: true,
        grade5: false,
        grade6: false,
        materials: '["句型模板", "情境圖片"]',
        instructions: '["展示句型模板", "學生根據圖片造句", "小組分享"]',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "口語對話練習 [本機開發數據]",
        description:
          "透過角色扮演提升學生口語表達能力 - 本機開發環境數據，僅供測試使用",
        categories: '["口語訓練", "情境對話"]',
        grade1: false,
        grade2: false,
        grade3: false,
        grade4: false,
        grade5: true,
        grade6: true,
        materials: '["情境卡片", "角色標籤"]',
        instructions: '["分配角色", "設定情境", "進行對話練習", "輪換角色"]',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  } catch (error) {
    console.error("Error reading from D1:", error);
    return [];
  }
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
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const grade = searchParams.get("grade");

    // 從 D1 讀取數據
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
