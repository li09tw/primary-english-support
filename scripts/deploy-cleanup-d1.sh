#!/bin/bash

# ========================================
# D1 資料庫清理部署腳本
# ========================================
# 此腳本將執行 D1 資料庫清理，刪除學習內容相關表
# 只保留登入驗證功能必需的表

set -e  # 遇到錯誤立即退出

echo "🧹 開始清理 D1 資料庫..."

# 檢查 wrangler 是否已安裝
if ! command -v wrangler &> /dev/null; then
    echo "❌ 錯誤: wrangler 未安裝或不在 PATH 中"
    echo "請先安裝 Cloudflare Wrangler CLI"
    exit 1
fi

# 檢查是否在正確的目錄
if [ ! -f "wrangler.toml" ]; then
    echo "❌ 錯誤: 找不到 wrangler.toml 檔案"
    echo "請確保在專案根目錄執行此腳本"
    exit 1
fi

# 確認執行
echo "⚠️  警告: 此操作將刪除以下資料表："
echo "   - admin_messages"
echo "   - game_methods" 
echo "   - teaching_aids"
echo "   - textbooks"
echo "   - units"
echo "   - vocabulary"
echo "   - grades"
echo "   - sentence_patterns"
echo "   - question_answer_pairs"
echo "   - word_themes"
echo "   - words"
echo "   - pattern_slots"
echo "   - word_theme_associations"
echo ""
echo "✅ 將保留以下登入驗證相關表："
echo "   - admin_accounts"
echo "   - verification_codes"
echo "   - admin_sessions"
echo "   - login_attempts"
echo ""

read -p "確定要繼續嗎？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 操作已取消"
    exit 1
fi

# 執行清理腳本
echo "🚀 執行 D1 資料庫清理..."
wrangler d1 execute primary-english-db --file=scripts/cleanup-d1-tables.sql

if [ $? -eq 0 ]; then
    echo "✅ D1 資料庫清理完成！"
    echo ""
    echo "📊 清理結果："
    echo "   - 已刪除 13 個學習內容相關資料表"
    echo "   - 已刪除相關索引"
    echo "   - 保留 4 個登入驗證相關資料表"
    echo ""
    echo "💡 注意事項："
    echo "   - 遊戲功能將繼續使用 mock 資料正常運作"
    echo "   - 登入驗證功能不受影響"
    echo "   - 當有新的需求時，可以重新建立相應的資料表"
else
    echo "❌ D1 資料庫清理失敗"
    exit 1
fi
