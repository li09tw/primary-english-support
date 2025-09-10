#!/usr/bin/env node

/**
 * 安全密碼生成工具
 * 使用環境變數或互動式輸入，不包含硬編碼密碼
 */

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const readline = require("readline");

// 配置
const SALT_ROUNDS = 12;

function generateSalt() {
  return crypto.randomBytes(32).toString("hex");
}

function hashPassword(password, salt) {
  return bcrypt.hashSync(password + salt, SALT_ROUNDS);
}

function generateSecureCredentials(username, password) {
  const salt = generateSalt();
  const hash = hashPassword(password, salt);

  return {
    username: username,
    password: password,
    salt: salt,
    hash: hash,
    saltRounds: SALT_ROUNDS,
  };
}

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("🔐 安全密碼生成工具");
  console.log("=====================================");

  // 從環境變數或互動式輸入獲取帳號
  let username = process.env.ADMIN_USERNAME;
  if (!username) {
    username = await askQuestion("請輸入管理員帳號: ");
  }

  // 從環境變數或互動式輸入獲取密碼
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    password = await askQuestion("請輸入管理員密碼: ");
  }

  // 從環境變數或互動式輸入獲取信箱
  let email = process.env.ADMIN_EMAIL;
  if (!email) {
    email = await askQuestion("請輸入管理員信箱: ");
  }

  console.log(`\n📝 帳號資訊:`);
  console.log(`🔑 帳號: ${username}`);
  console.log(`📧 信箱: ${email}`);
  console.log(`🔧 鹽值輪數: ${SALT_ROUNDS}`);

  const credentials = generateSecureCredentials(username, password);

  console.log("\n✅ 生成的憑證:");
  console.log("=====================================");
  console.log(`🧂 鹽值: ${credentials.salt}`);
  console.log(`🔒 雜湊: ${credentials.hash}`);

  console.log("\n📋 完整的 SQL 插入語句:");
  console.log("=====================================");
  console.log(
    `INSERT OR REPLACE INTO admin_accounts (id, username, email, password_hash, salt, created_at, updated_at)`
  );
  console.log(`VALUES (`);
  console.log(`  'admin_001',`);
  console.log(`  '${credentials.username}',`);
  console.log(`  '${email}',`);
  console.log(`  '${credentials.hash}',`);
  console.log(`  '${credentials.salt}',`);
  console.log(`  datetime('now'),`);
  console.log(`  datetime('now')`);
  console.log(`);`);

  console.log("\n📋 僅更新密碼的 SQL 語句:");
  console.log("=====================================");
  console.log(`UPDATE admin_accounts SET`);
  console.log(`  password_hash = '${credentials.hash}',`);
  console.log(`  salt = '${credentials.salt}',`);
  console.log(`  updated_at = datetime('now')`);
  console.log(`WHERE username = '${credentials.username}';`);

  console.log("\n⚠️  注意事項:");
  console.log("=====================================");
  console.log("• 請妥善保管生成的憑證資訊");
  console.log("• 建議使用強密碼");
  console.log("• 定期更換密碼");

  console.log("\n🚀 部署步驟:");
  console.log("=====================================");
  console.log("1. 執行 SQL 腳本建立資料庫結構");
  console.log("2. 使用上面的 SQL 語句插入帳號");
  console.log("3. 使用設定的帳號密碼登入測試");
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateSecureCredentials,
  hashPassword,
  generateSalt,
};
