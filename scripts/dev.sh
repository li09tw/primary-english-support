#!/bin/bash

# Primary English Support 本地開發啟動腳本
# 同時啟動 Cloudflare Worker 和 Next.js 開發伺服器

set -e

echo "🚀 啟動 Primary English Support 本地開發環境..."

# 檢查必要的工具
check_requirements() {
    echo "📋 檢查開發需求..."
    
    if ! command -v wrangler &> /dev/null; then
        echo "❌ 未找到 wrangler CLI，請先安裝：npm install -g wrangler"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ 未找到 npm，請先安裝 Node.js"
        exit 1
    fi
    
    echo "✅ 所有工具都已安裝"
}

# 檢查環境變數
check_env() {
    echo "🔍 檢查環境變數..."
    
    if [ ! -f ".env.local" ]; then
        echo "⚠️  未找到 .env.local 文件，創建範例配置..."
        cp env.example .env.local
        echo "📝 請編輯 .env.local 文件，設定必要的環境變數"
        echo "   特別是 CLOUDFLARE_WORKER_URL 和 CLOUDFLARE_API_SECRET"
        echo ""
        read -p "按 Enter 繼續，或按 Ctrl+C 取消..."
    fi
    
    echo "✅ 環境變數檢查完成"
}

# 啟動 Cloudflare Worker
start_worker() {
    echo "🔧 啟動 Cloudflare Worker 本地開發..."
    
    if [ ! -f "wrangler-dev.toml" ]; then
        echo "❌ 找不到 wrangler-dev.toml 配置文件"
        exit 1
    fi
    
    # 在背景啟動 Worker
    npm run dev:worker &
    WORKER_PID=$!
    
    echo "✅ Cloudflare Worker 已啟動 (PID: $WORKER_PID)"
    echo "   Worker URL: http://localhost:8787"
    
    # 等待 Worker 啟動
    sleep 3
}

# 啟動 Next.js 開發伺服器
start_nextjs() {
    echo "🌐 啟動 Next.js 開發伺服器..."
    
    # 在背景啟動 Next.js
    npm run dev &
    NEXTJS_PID=$!
    
    echo "✅ Next.js 開發伺服器已啟動 (PID: $NEXTJS_PID)"
    echo "   Next.js URL: http://localhost:3000"
}

# 顯示狀態信息
show_status() {
    echo ""
    echo "🎯 開發環境狀態："
    echo "   Cloudflare Worker: http://localhost:8787 (PID: $WORKER_PID)"
    echo "   Next.js 開發伺服器: http://localhost:3000 (PID: $NEXTJS_PID)"
    echo ""
    echo "📝 有用的命令："
    echo "   查看 Worker 日誌: tail -f ~/.wrangler/logs/*.log"
    echo "   停止所有服務: pkill -f 'wrangler dev' && pkill -f 'next dev'"
    echo ""
    echo "🔄 按 Ctrl+C 停止所有服務"
}

# 清理函數
cleanup() {
    echo ""
    echo "🛑 正在停止所有服務..."
    
    if [ ! -z "$WORKER_PID" ]; then
        kill $WORKER_PID 2>/dev/null || true
        echo "   Cloudflare Worker 已停止"
    fi
    
    if [ ! -z "$NEXTJS_PID" ]; then
        kill $NEXTJS_PID 2>/dev/null || true
        echo "   Next.js 開發伺服器已停止"
    fi
    
    echo "✅ 所有服務已停止"
    exit 0
}

# 設定信號處理
trap cleanup SIGINT SIGTERM

# 主流程
main() {
    check_requirements
    check_env
    start_worker
    start_nextjs
    show_status
    
    # 等待用戶中斷
    wait
}

# 執行主流程
main "$@"
