
#!/bin/bash

# 同步 admin_messages 從遠端 D1 資料庫到本地虛擬資料庫
# 用於開發環境，確保本地有最新的站長消息數據

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

# 從遠端獲取數據
echo "📥 從遠端 D1 資料庫獲取數據..."
REMOTE_DATA=$(npx wrangler d1 execute primary-english-db --remote --command "SELECT id, title, content, is_published, created_at, updated_at, is_pinned FROM admin_messages;" 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ 無法從遠端資料庫獲取數據"
    exit 1
fi

# 檢查是否有數據
RECORD_COUNT=$(echo "$REMOTE_DATA" | grep -c '"id"' || echo "0")
if [ "$RECORD_COUNT" -eq 0 ]; then
    echo "ℹ️  遠端資料庫中沒有 admin_messages 數據"
    exit 0
fi

echo "📊 找到 $RECORD_COUNT 筆記錄"

# 將數據插入本地資料庫
echo "💾 將數據插入本地資料庫..."

# 使用 Python 腳本來處理 JSON 數據插入
cat > /tmp/sync_admin_messages.py << 'EOF'
import sys
import json
import re

# 讀取 wrangler 輸出
data = sys.stdin.read()

try:
    # 找到 JSON 部分（跳過 wrangler 的輸出）
    json_start = data.find('[')
    if json_start == -1:
        print("沒有找到 JSON 數據")
        sys.exit(1)
    
    json_data = data[json_start:]
    parsed_data = json.loads(json_data)
    
    if not parsed_data or 'results' not in parsed_data[0] or not parsed_data[0]['results']:
        print("沒有數據需要同步")
        sys.exit(0)
    
    for record in parsed_data[0]['results']:
        id_val = str(record['id'])
        title = record['title'].replace("'", "''").replace('\n', '\\n')  # 轉義單引號和換行符號
        content = record['content'].replace("'", "''").replace('\n', '\\n')  # 轉義單引號和換行符號
        is_published = record['is_published']
        created_at = record['created_at']
        updated_at = record['updated_at']
        is_pinned = record['is_pinned']
        
        # 生成 INSERT 語句
        sql = f"INSERT INTO admin_messages (id, title, content, is_published, created_at, updated_at, is_pinned) VALUES ('{id_val}', '{title}', '{content}', {is_published}, '{created_at}', '{updated_at}', {is_pinned});"
        print(sql)
        
except json.JSONDecodeError as e:
    print(f"JSON 解析錯誤: {e}")
    sys.exit(1)
except Exception as e:
    print(f"處理數據時發生錯誤: {e}")
    sys.exit(1)
EOF

# 執行 Python 腳本生成 SQL
echo "$REMOTE_DATA" | python3 /tmp/sync_admin_messages.py > /tmp/admin_messages_insert.sql

# 執行 SQL 插入
if [ -s /tmp/admin_messages_insert.sql ]; then
    # 讀取 SQL 檔案並執行
    while IFS= read -r sql_line; do
        if [ -n "$sql_line" ] && [[ "$sql_line" == INSERT* ]]; then
            echo "執行 SQL: $sql_line"
            npx wrangler d1 execute primary-english-db --command "$sql_line"
        fi
    done < /tmp/admin_messages_insert.sql
else
    echo "⚠️  沒有生成 SQL 檔案"
fi

# 清理臨時檔案
rm -f /tmp/sync_admin_messages.py /tmp/admin_messages_insert.sql

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
