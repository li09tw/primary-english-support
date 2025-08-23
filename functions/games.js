// 專門處理 /api/games 路由的 Pages Function
// 直接使用 D1 資料庫，不依賴 Next.js API Routes

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 只處理 GET 請求
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Method not allowed' 
    }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log("=== Pages Function /api/games called ===");
    console.log("Environment:", env);
    console.log("D1 Database available:", !!env.PRIMARY_ENGLISH_DB);

    // 檢查 D1 資料庫是否可用
    if (!env.PRIMARY_ENGLISH_DB) {
      console.error("D1 database not available in environment");
      return new Response(JSON.stringify({
        success: false,
        error: "D1 database not available"
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 獲取查詢參數
    const searchParams = url.searchParams;
    const category = searchParams.get("category");
    const grade = searchParams.get("grade");

    console.log("Search params:", { category, grade });

    // 從 D1 資料庫讀取遊戲方法數據
    const db = env.PRIMARY_ENGLISH_DB;
    
    // 先檢查資料庫結構
    const tableInfo = await db.prepare("PRAGMA table_info(game_methods)").all();
    console.log("Table structure:", tableInfo);

    // 查詢所有遊戲數據
    const result = await db
      .prepare("SELECT * FROM game_methods ORDER BY created_at DESC")
      .all();

    console.log(`Successfully read ${result.results.length} games from D1 database`);

    if (!result.results || result.results.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        data: [],
        message: "No games data available"
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 轉換數據格式
    const convertedGames = result.results.map((game) => ({
      id: game.id,
      title: game.title,
      description: game.description,
      categories: JSON.parse(game.categories),
      grades: convertGradesToArray(game),
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

    // 應用篩選
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

    // 排序並返回結果
    const finalGames = filteredGames.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(`Returning ${finalGames.length} filtered games`);

    return new Response(JSON.stringify({
      success: true,
      data: finalGames
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error in Pages Function /api/games:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: "獲取遊戲庫失敗",
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 將 D1 的數字年級格式轉換為陣列格式
function convertGradesToArray(game) {
  const grades = [];
  if (game.grade1 === 1) grades.push("grade1");
  if (game.grade2 === 1) grades.push("grade2");
  if (game.grade3 === 1) grades.push("grade3");
  if (game.grade4 === 1) grades.push("grade4");
  if (game.grade5 === 1) grades.push("grade5");
  if (game.grade6 === 1) grades.push("grade6");
  return grades;
}
