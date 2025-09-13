#!/usr/bin/env node

/**
 * 檢查本地虛擬資料庫中是否有遊戲方法數據
 * 如果沒有，則從 D1 資料庫複製過去
 */

// 載入環境變數
require("dotenv").config({ path: ".env.local" });

// 由於 TypeScript 模組在 Node.js 中需要特殊處理，我們直接實作客戶端邏輯

// 檢查環境變數
function checkEnvironmentVariables() {
  console.log("🔍 檢查環境變數...");

  const requiredVars = ["CLOUDFLARE_WORKER_URL", "CLOUDFLARE_API_SECRET"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ 缺少必要的環境變數:", missingVars);
    console.error("請確保 .env.local 檔案包含以下變數:");
    missingVars.forEach((varName) => {
      console.error(`  ${varName}=your_value`);
    });
    process.exit(1);
  }

  console.log("✅ 環境變數檢查通過");
}

// 創建本地 Cloudflare 客戶端
function createLocalClient() {
  const workerUrl =
    process.env.CLOUDFLARE_WORKER_URL || "http://localhost:8787";
  const apiSecret = process.env.CLOUDFLARE_API_SECRET || "local-dev-secret";

  return {
    async query(query, params = []) {
      const response = await fetch(`${workerUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiSecret,
        },
        body: JSON.stringify({ query, params }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Cloudflare API error: ${response.status} ${errorText}`
        );
      }

      return response.json();
    },

    async execute(query, params = []) {
      const response = await fetch(`${workerUrl}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiSecret,
        },
        body: JSON.stringify({ query, params }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Cloudflare API error: ${response.status} ${errorText}`
        );
      }

      return response.json();
    },
  };
}

// 創建 D1 客戶端
function createD1Client() {
  const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
  const apiSecret = process.env.CLOUDFLARE_API_SECRET;

  if (!workerUrl || !apiSecret) {
    throw new Error("Missing D1 environment variables");
  }

  return {
    async query(query, params = []) {
      const response = await fetch(`${workerUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiSecret,
        },
        body: JSON.stringify({ query, params }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`D1 API error: ${response.status} ${errorText}`);
      }

      return response.json();
    },
  };
}

// 檢查本地虛擬資料庫中的遊戲方法
async function checkLocalGameMethods() {
  console.log("🔍 檢查本地虛擬資料庫中的遊戲方法...");

  try {
    const localClient = createLocalClient();

    // 檢查 game_methods 表是否存在
    const tableCheck = await localClient.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='game_methods'
    `);

    if (!tableCheck.success || tableCheck.results.length === 0) {
      console.log("❌ 本地虛擬資料庫中沒有 game_methods 表");
      return { exists: false, count: 0 };
    }

    // 檢查遊戲方法數量
    const countResult = await localClient.query(
      "SELECT COUNT(*) as count FROM game_methods"
    );

    if (!countResult.success) {
      console.error("❌ 無法查詢本地資料庫:", countResult.error);
      return { exists: true, count: 0 };
    }

    const count = countResult.results[0]?.count || 0;
    console.log(`📊 本地虛擬資料庫中有 ${count} 個遊戲方法`);

    return { exists: true, count };
  } catch (error) {
    console.error("❌ 檢查本地資料庫時發生錯誤:", error.message);
    return { exists: false, count: 0 };
  }
}

// 從 D1 資料庫獲取遊戲方法
async function getGameMethodsFromD1() {
  console.log("🔍 從 D1 資料庫獲取遊戲方法...");

  try {
    const d1Client = createD1Client();

    const result = await d1Client.query(
      "SELECT * FROM game_methods ORDER BY created_at DESC"
    );

    if (!result.success) {
      console.error("❌ 無法從 D1 資料庫獲取遊戲方法:", result.error);
      return [];
    }

    console.log(`📊 從 D1 資料庫獲取到 ${result.results.length} 個遊戲方法`);
    return result.results;
  } catch (error) {
    console.error("❌ 從 D1 資料庫獲取遊戲方法時發生錯誤:", error.message);
    return [];
  }
}

// 將遊戲方法同步到本地虛擬資料庫
async function syncGameMethodsToLocal(gameMethods) {
  console.log("🔄 開始同步遊戲方法到本地虛擬資料庫...");

  try {
    const localClient = createLocalClient();

    // 先清空本地資料庫中的遊戲方法
    console.log("🗑️ 清空本地資料庫中的現有遊戲方法...");
    await localClient.execute("DELETE FROM game_methods");

    // 插入新的遊戲方法
    console.log(`📝 插入 ${gameMethods.length} 個遊戲方法到本地資料庫...`);

    for (const game of gameMethods) {
      const insertQuery = `
        INSERT INTO game_methods (
          id, title, description, categories, 
          grade1, grade2, grade3, grade4, grade5, grade6,
          materials, instructions, is_published, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        game.id,
        game.title,
        game.description,
        game.categories,
        game.grade1 || 0,
        game.grade2 || 0,
        game.grade3 || 0,
        game.grade4 || 0,
        game.grade5 || 0,
        game.grade6 || 0,
        game.materials,
        game.instructions,
        game.is_published || 1,
        game.created_at,
        game.updated_at,
      ];

      await localClient.execute(insertQuery, params);
    }

    console.log("✅ 遊戲方法同步完成");

    // 驗證同步結果
    const verifyResult = await localClient.query(
      "SELECT COUNT(*) as count FROM game_methods"
    );
    const finalCount = verifyResult.results[0]?.count || 0;
    console.log(`✅ 驗證完成: 本地資料庫中現在有 ${finalCount} 個遊戲方法`);

    return true;
  } catch (error) {
    console.error("❌ 同步遊戲方法時發生錯誤:", error.message);
    return false;
  }
}

// 主函數
async function main() {
  console.log("🚀 開始檢查和同步遊戲方法...\n");

  try {
    // 1. 檢查環境變數
    checkEnvironmentVariables();
    console.log("");

    // 2. 檢查本地虛擬資料庫
    const localCheck = await checkLocalGameMethods();
    console.log("");

    // 3. 如果本地沒有數據，從 D1 同步
    if (localCheck.count === 0) {
      console.log("⚠️ 本地虛擬資料庫中沒有遊戲方法，開始從 D1 同步...\n");

      const gameMethods = await getGameMethodsFromD1();

      if (gameMethods.length > 0) {
        const syncSuccess = await syncGameMethodsToLocal(gameMethods);

        if (syncSuccess) {
          console.log("\n🎉 遊戲方法同步完成！");
        } else {
          console.log("\n❌ 遊戲方法同步失敗！");
          process.exit(1);
        }
      } else {
        console.log("⚠️ D1 資料庫中也沒有遊戲方法數據");
      }
    } else {
      console.log("✅ 本地虛擬資料庫中已有遊戲方法數據，無需同步");
    }
  } catch (error) {
    console.error("❌ 執行過程中發生錯誤:", error.message);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = {
  checkLocalGameMethods,
  getGameMethodsFromD1,
  syncGameMethodsToLocal,
};
