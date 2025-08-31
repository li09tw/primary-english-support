#!/bin/bash

# 修復資料庫 schema 結構
# 添加缺少的 is_published 欄位和 teaching_aids 表格

echo "🔧 開始修復資料庫 schema 結構..."

# 檢查是否安裝了 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "❌ 錯誤：未安裝 wrangler"
    echo "請先安裝：npm install -g wrangler"
    exit 1
fi

# 檢查 wrangler.toml 是否存在
if [ ! -f "wrangler-dev.toml" ]; then
    echo "❌ 錯誤：找不到 wrangler-dev.toml 檔案"
    exit 1
fi

# 執行修復 SQL 腳本
echo "📝 執行 schema 修復腳本..."
wrangler d1 execute primary-english-db --remote --file=./scripts/fix-admin-messages-schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema 修復成功！"
    echo ""
    echo "📋 修復內容："
    echo "  - 為 admin_messages 表格添加 is_published 欄位"
    echo "  - 為 game_methods 表格添加 is_published 欄位"
    echo "  - 創建 teaching_aids 表格"
    echo ""
    echo "🔗 相關頁面："
    echo "  - 管理者頁面：/garden"
    echo "  - 測試頁面：/test-admin-messages"
    echo ""
    echo "💡 提示：現在可以正常使用管理員消息功能了"
else
    echo "❌ 修復失敗，請檢查錯誤訊息"
    exit 1
fi
