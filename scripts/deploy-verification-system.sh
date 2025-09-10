#!/bin/bash

# 部署驗證系統到 Cloudflare D1
echo "🚀 開始部署驗證系統..."

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

echo "📊 資料庫名稱: $DATABASE_NAME"
echo "🔑 帳號 ID: $CLOUDFLARE_ACCOUNT_ID"

# 執行 SQL 腳本
echo "📝 執行驗證系統 SQL 腳本..."
wrangler d1 execute $DATABASE_NAME --file=./scripts/add-verification-system.sql

if [ $? -eq 0 ]; then
    echo "✅ 驗證系統部署成功！"
    echo ""
    echo "📋 下一步："
    echo "1. 修改 scripts/add-verification-system.sql 中的預設信箱"
    echo "2. 重新執行此腳本以更新信箱設定"
    echo "3. 在 Garden 頁面測試驗證功能"
else
    echo "❌ 驗證系統部署失敗"
    exit 1
fi
