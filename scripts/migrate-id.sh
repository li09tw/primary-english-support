#!/bin/bash

# 遷移 admin_messages 表格 ID 從 TEXT 改為 INTEGER AUTOINCREMENT
# 注意：此操作會重建表格，請確保已備份資料

echo "🔄 開始遷移 admin_messages 表格 ID 格式..."

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

echo "⚠️  警告：此操作會重建 admin_messages 表格"
echo "   現有資料會被保留，但 ID 會重新分配"
echo ""

read -p "確定要繼續嗎？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 操作已取消"
    exit 1
fi

# 執行遷移 SQL 腳本
echo "📝 執行 ID 遷移腳本..."
wrangler d1 execute primary-english-db --remote --file=./scripts/migrate-admin-messages-id.sql

if [ $? -eq 0 ]; then
    echo "✅ ID 遷移成功！"
    echo ""
    echo "📋 遷移內容："
    echo "  - admin_messages 表格 ID 已改為 INTEGER AUTOINCREMENT"
    echo "  - 現有資料已保留"
    echo "  - 新的 ID 會自動遞增"
    echo ""
    echo "🔗 相關頁面："
    echo "  - 管理者頁面：/garden"
    echo "  - 測試頁面：/test-admin-messages"
    echo ""
    echo "💡 提示：現在可以正常使用數字 ID 的管理員消息功能了"
else
    echo "❌ 遷移失敗，請檢查錯誤訊息"
    exit 1
fi
