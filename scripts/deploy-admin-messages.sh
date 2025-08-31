#!/bin/bash

# 部署站長消息到 D1 資料庫
# 使用 Cloudflare Wrangler 部署

echo "🚀 開始部署站長消息到 D1 資料庫..."

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

# 執行 SQL 腳本
echo "📝 執行站長消息 SQL 腳本..."
wrangler d1 execute DB --file=./scripts/create-admin-messages-mock.sql

if [ $? -eq 0 ]; then
    echo "✅ 站長消息部署成功！"
    echo ""
    echo "📋 部署內容："
    echo "  - 建立 admin_messages 表"
    echo "  - 插入 4 筆範例資料"
    echo "  - 包含已發布和未發布的消息"
    echo ""
    echo "🔗 相關頁面："
    echo "  - Mock 檢視頁面：/test-admin-messages"
    echo "  - 管理者頁面：/garden"
    echo ""
    echo "💡 提示：您可以在管理者頁面中管理這些消息"
else
    echo "❌ 部署失敗，請檢查錯誤訊息"
    exit 1
fi
