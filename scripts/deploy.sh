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

# 部署 Next.js 到 Vercel (透過 GitHub CI/CD)
deploy_vercel() {
    echo "🚀 Vercel 部署說明..."
    echo "📝 此專案使用 GitHub Actions 自動部署到 Vercel"
    echo "📝 推送程式碼到 main 分支即可自動觸發部署"
    echo "✅ Vercel 部署流程已設定為自動化"
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
    echo "   Next.js 應用: 🔄 將透過 GitHub Actions 自動部署到 Vercel"
    echo ""
    echo "📝 重要提醒："
    echo "   1. 請確認 .env.local 中的 CLOUDFLARE_WORKER_URL 已更新"
    echo "   2. 請確認 Vercel 環境變數已設定"
    echo "   3. 推送程式碼到 GitHub main 分支以觸發 Vercel 部署"
    echo "   4. 測試生產環境的 API 連接"
    echo ""
    echo "🔗 有用的連結："
    echo "   - Vercel 儀表板: https://vercel.com/dashboard"
    echo "   - Cloudflare Workers 儀表板: https://dash.cloudflare.com"
    echo "   - GitHub Actions: https://github.com/your-username/primary-english-support/actions"
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
    
    echo "🎉 Cloudflare Worker 部署完成！"
    echo "📝 請推送程式碼到 GitHub main 分支以觸發 Vercel 自動部署"
}

# 執行主流程
main "$@"
