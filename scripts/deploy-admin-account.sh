#!/bin/bash

# 安全的管理員帳號部署腳本
# 使用環境變數，不包含硬編碼密碼

echo "🚀 開始部署管理員帳號到 D1 遠端資料庫..."

# 檢查環境變數
if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo "❌ 錯誤: 請設定 CLOUDFLARE_ACCOUNT_ID 環境變數"
    exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 錯誤: 請設定 CLOUDFLARE_API_TOKEN 環境變數"
    exit 1
fi

if [ -z "$DATABASE_NAME" ]; then
    echo "❌ 錯誤: 請設定 DATABASE_NAME 環境變數"
    exit 1
fi

# 檢查管理員帳號環境變數
if [ -z "$ADMIN_USERNAME" ]; then
    echo "❌ 錯誤: 請設定 ADMIN_USERNAME 環境變數"
    echo "例如: export ADMIN_USERNAME='your-username'"
    exit 1
fi

if [ -z "$ADMIN_EMAIL" ]; then
    echo "❌ 錯誤: 請設定 ADMIN_EMAIL 環境變數"
    echo "例如: export ADMIN_EMAIL='your-email@example.com'"
    exit 1
fi

if [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ 錯誤: 請設定 ADMIN_PASSWORD 環境變數"
    echo "例如: export ADMIN_PASSWORD='your-secure-password'"
    exit 1
fi

echo "📊 資料庫名稱: $DATABASE_NAME"
echo "🔑 帳號 ID: $CLOUDFLARE_ACCOUNT_ID"
echo "👤 目標帳號: $ADMIN_USERNAME"
echo "📧 目標信箱: $ADMIN_EMAIL"

# 檢查 Node.js 和 npm
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤: 未找到 Node.js，請先安裝"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ 錯誤: 未找到 npm，請先安裝"
    exit 1
fi

# 檢查 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 錯誤: 未找到 wrangler，請先安裝"
    exit 1
fi

# 安裝依賴
echo "📦 安裝依賴套件..."
npm install

# 生成管理員帳號的密碼雜湊
echo "🔐 生成管理員帳號的密碼雜湊..."
node scripts/generate-password.js > temp_admin_credentials.txt

# 提取生成的 SQL
echo "📝 提取 SQL 語句..."
grep -A 10 "INSERT OR REPLACE INTO admin_accounts" temp_admin_credentials.txt > admin_insert.sql

# 檢查是否成功生成
if [ ! -s admin_insert.sql ]; then
    echo "❌ 錯誤: 無法生成 SQL 語句"
    exit 1
fi

echo "✅ 成功生成 SQL 語句"

# 執行 SQL 腳本建立資料庫結構
echo "📝 執行 SQL 腳本建立資料庫結構..."
wrangler d1 execute $DATABASE_NAME --file=./scripts/add-secure-verification-system.sql

if [ $? -eq 0 ]; then
    echo "✅ 資料庫表結構建立成功！"
else
    echo "❌ 資料庫表結構建立失敗"
    exit 1
fi

# 插入管理員帳號
echo "👤 插入管理員帳號..."
wrangler d1 execute $DATABASE_NAME --file=./admin_insert.sql

if [ $? -eq 0 ]; then
    echo "✅ 管理員帳號建立成功！"
else
    echo "❌ 管理員帳號建立失敗"
    exit 1
fi

# 驗證帳號是否成功建立
echo "🔍 驗證帳號是否成功建立..."
wrangler d1 execute $DATABASE_NAME --command="SELECT username, email, is_active FROM admin_accounts WHERE username = '$ADMIN_USERNAME';"

if [ $? -eq 0 ]; then
    echo "✅ 帳號驗證成功！"
else
    echo "❌ 帳號驗證失敗"
    exit 1
fi

# 清理臨時檔案
rm -f temp_admin_credentials.txt admin_insert.sql

# 建置專案
echo "🔨 建置專案..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 專案建置成功！"
else
    echo "❌ 專案建置失敗"
    exit 1
fi

echo ""
echo "🎉 管理員帳號部署完成！"
echo ""
echo "📋 部署摘要:"
echo "====================================="
echo "✅ 資料庫表結構已建立"
echo "✅ 管理員帳號已建立"
echo "✅ 專案已建置完成"
echo ""
echo "🔐 登入資訊:"
echo "====================================="
echo "• 帳號: $ADMIN_USERNAME"
echo "• 登入頁面: /garden/login"
echo "• 驗證碼有效期: 30 分鐘"
echo ""
echo "📋 登入流程:"
echo "====================================="
echo "1. 訪問 /garden/login"
echo "2. 輸入帳號: $ADMIN_USERNAME"
echo "3. 點擊發送驗證碼"
echo "4. 驗證碼會發送到 $ADMIN_EMAIL"
echo "5. 輸入驗證碼完成登入"
echo ""
echo "📋 下一步:"
echo "====================================="
echo "1. 設定 DEFAULT_ADMIN_EMAIL 環境變數"
echo "2. 設定 EmailJS 配置"
echo "3. 部署到 Vercel: npm run deploy:vercel"
echo "4. 使用 $ADMIN_USERNAME 帳號登入測試"
echo ""
echo "⚠️  重要提醒:"
echo "====================================="
echo "• 請設定 DEFAULT_ADMIN_EMAIL 環境變數"
echo "• 設定 EmailJS 的實際配置值"
echo "• 妥善保管帳號憑證"
echo "• 定期檢查安全日誌"
echo ""
echo "🚀 快速測試:"
echo "====================================="
echo "1. 訪問 /garden/login"
echo "2. 輸入帳號: $ADMIN_USERNAME"
echo "3. 點擊發送驗證碼"
echo "4. 檢查驗證碼發送功能"
