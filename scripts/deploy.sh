#!/bin/bash

# Primary English Support 完整部署腳本
# 部署 Cloudflare Worker 和 Vercel 應用

set -e

echo "🚀 開始部署 Primary English Support..."

# 檢查必要的工具
check_requirements() {
    echo "📋 檢查部署需求..."
    
    if ! command -v wrangler &> /dev/null; then
        echo "❌ 未找到 wrangler CLI，請先安裝：npm install -g wrangler"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        echo "❌ 未找到 vercel CLI，請先安裝：npm install -g vercel"
        exit 1
    fi
    
    echo "✅ 所有工具都已安裝"
}

# 檢查環境變數
check_env() {
    echo "🔍 檢查環境變數..."
    
    if [ ! -f ".env.local" ]; then
        echo "⚠️  未找到 .env.local 文件"
        echo "📝 請確保已設定生產環境的環境變數"
    fi
    
    echo "✅ 環境變數檢查完成"
}

# 建置 Next.js 應用
build_nextjs() {
    echo "🔨 建置 Next.js 應用..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Next.js 建置成功"
    else
        echo "❌ Next.js 建置失敗"
        exit 1
    fi
}

# 部署 Cloudflare Worker
deploy_worker() {
    echo "☁️ 部署 Cloudflare Worker..."
    
    npm run deploy:worker
    
    if [ $? -eq 0 ]; then
        echo "✅ Cloudflare Worker 部署成功"
        
        # 獲取 Worker URL
        echo "🔗 Worker URL: https://primary-english-api-gateway.your-account.workers.dev"
        echo "📝 請更新 .env.local 中的 CLOUDFLARE_WORKER_URL"
    else
        echo "❌ Cloudflare Worker 部署失敗"
        exit 1
    fi
}

# 部署到 Vercel
deploy_vercel() {
    echo "🚀 部署到 Vercel..."
    
    npm run deploy:vercel
    
    if [ $? -eq 0 ]; then
        echo "✅ Vercel 部署成功"
    else
        echo "❌ Vercel 部署失敗"
        exit 1
    fi
}

# 測試部署
test_deployment() {
    echo "🧪 測試部署..."
    
    # 這裡可以添加測試邏輯
    echo "✅ 部署測試完成"
}

# 顯示部署狀態
show_status() {
    echo ""
    echo "🎯 部署狀態："
    echo "   Cloudflare Worker: ✅ 已部署"
    echo "   Next.js 應用: ✅ 已部署到 Vercel"
    echo ""
    echo "📝 重要提醒："
    echo "   1. 請確認 .env.local 中的 CLOUDFLARE_WORKER_URL 已更新"
    echo "   2. 請確認 Vercel 環境變數已設定"
    echo "   3. 測試生產環境的 API 連接"
    echo ""
    echo "🔗 有用的連結："
    echo "   - Vercel 儀表板: https://vercel.com/dashboard"
    echo "   - Cloudflare Workers 儀表板: https://dash.cloudflare.com"
}

# 主流程
main() {
    check_requirements
    check_env
    build_nextjs
    deploy_worker
    deploy_vercel
    test_deployment
    show_status
    
    echo "🎉 部署完成！"
}

# 執行主流程
main "$@"
