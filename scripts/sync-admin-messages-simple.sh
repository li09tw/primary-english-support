#!/bin/bash

# 簡化版 admin_messages 同步腳本
# 直接使用 wrangler 的內建功能從遠端複製數據到本地

echo "🔄 開始同步 admin_messages 數據..."

# 檢查本地資料庫是否存在 admin_messages 表
echo "📋 檢查本地資料庫表結構..."
LOCAL_TABLES=$(npx wrangler d1 execute primary-english-db --command "SELECT name FROM sqlite_master WHERE type='table' AND name='admin_messages';" 2>/dev/null | grep -c "admin_messages" || echo "0")

if [ "$LOCAL_TABLES" -eq 0 ]; then
    echo "❌ 本地資料庫中沒有 admin_messages 表"
    echo "請先執行資料庫 schema 初始化"
    exit 1
fi

# 檢查本地表是否有 is_published 欄位
echo "🔍 檢查表結構完整性..."
LOCAL_COLUMNS=$(npx wrangler d1 execute primary-english-db --command "PRAGMA table_info(admin_messages);" 2>/dev/null | grep -c "is_published" || echo "0")

if [ "$LOCAL_COLUMNS" -eq 0 ]; then
    echo "🔧 添加缺少的 is_published 欄位..."
    npx wrangler d1 execute primary-english-db --command "ALTER TABLE admin_messages ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT TRUE;"
fi

# 清空本地 admin_messages 表
echo "🗑️  清空本地 admin_messages 表..."
npx wrangler d1 execute primary-english-db --command "DELETE FROM admin_messages;"

# 從遠端獲取數據並插入本地
echo "📥 從遠端 D1 資料庫獲取數據並插入本地..."

# 使用 wrangler 的內建功能直接複製數據
npx wrangler d1 execute primary-english-db --remote --command "SELECT id, title, content, is_published, created_at, updated_at, is_pinned FROM admin_messages;" | \
python3 -c "
import sys
import json
import re

# 讀取 wrangler 輸出
data = sys.stdin.read()

try:
    # 找到 JSON 部分（跳過 wrangler 的輸出）
    json_start = data.find('[')
    if json_start == -1:
        print('沒有找到 JSON 數據')
        sys.exit(1)
    
    json_data = data[json_start:]
    parsed_data = json.loads(json_data)
    
    if not parsed_data or 'results' not in parsed_data[0] or not parsed_data[0]['results']:
        print('沒有數據需要同步')
        sys.exit(0)
    
    for record in parsed_data[0]['results']:
        id_val = str(record['id'])
        title = record['title'].replace(\"'\", \"''\").replace('\n', '\\n')
        content = record['content'].replace(\"'\", \"''\").replace('\n', '\\n')
        is_published = record['is_published']
        created_at = record['created_at']
        updated_at = record['updated_at']
        is_pinned = record['is_pinned']
        
        # 生成並執行 INSERT 語句
        sql = f\"INSERT INTO admin_messages (id, title, content, is_published, created_at, updated_at, is_pinned) VALUES ('{id_val}', '{title}', '{content}', {is_published}, '{created_at}', '{updated_at}', {is_pinned});\"
        print(f'執行: {sql}')
        
        # 使用 subprocess 執行 wrangler 命令
        import subprocess
        result = subprocess.run(['npx', 'wrangler', 'd1', 'execute', 'primary-english-db', '--command', sql], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            print(f'錯誤: {result.stderr}')
        else:
            print('✅ 成功插入')
        
except json.JSONDecodeError as e:
    print(f'JSON 解析錯誤: {e}')
    sys.exit(1)
except Exception as e:
    print(f'處理數據時發生錯誤: {e}')
    sys.exit(1)
"

# 驗證同步結果
echo "✅ 驗證同步結果..."
LOCAL_COUNT=$(npx wrangler d1 execute primary-english-db --command "SELECT COUNT(*) FROM admin_messages;" 2>/dev/null | grep -o '[0-9]\+' | tail -1 || echo "0")
REMOTE_COUNT=$(npx wrangler d1 execute primary-english-db --remote --command "SELECT COUNT(*) FROM admin_messages;" 2>/dev/null | grep -o '[0-9]\+' | tail -1 || echo "0")

echo "📊 同步完成："
echo "   本地資料庫：$LOCAL_COUNT 筆記錄"
echo "   遠端資料庫：$REMOTE_COUNT 筆記錄"

if [ "$LOCAL_COUNT" -eq "$REMOTE_COUNT" ]; then
    echo "✅ 同步成功！"
else
    echo "⚠️  同步可能不完整，請檢查"
fi
