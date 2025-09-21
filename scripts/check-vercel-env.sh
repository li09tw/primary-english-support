#!/bin/bash

# 檢查 Vercel 環境變數設定
echo "🔍 檢查 Vercel 環境變數設定"
echo "====================================="

# 檢查是否已登入 Vercel
if ! vercel whoami > /dev/null 2>&1; then
    echo "❌ 請先登入 Vercel: vercel login"
    exit 1
fi

echo "✅ 已登入 Vercel"

# 檢查專案環境變數
echo ""
echo "📋 檢查專案環境變數..."
vercel env ls

echo ""
echo "🔧 建議設定的環境變數:"
echo "====================================="
echo "CLOUDFLARE_WORKER_URL=https://primary-english-api-gateway.h881520.workers.dev"
echo "CLOUDFLARE_API_SECRET=your-production-api-secret"
echo "NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_ewhka0o"
echo "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_acoag36"
echo "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=4DUbyZo4KhuPWKC9h"
echo ""

echo "🚀 設定環境變數的指令:"
echo "====================================="
echo "vercel env add CLOUDFLARE_WORKER_URL"
echo "vercel env add CLOUDFLARE_API_SECRET"
echo ""

echo "📝 注意事項:"
echo "====================================="
echo "1. CLOUDFLARE_API_SECRET 必須與 Cloudflare Worker 中設定的相同"
echo "2. 這些是後端環境變數，不需要 NEXT_PUBLIC_ 前綴"
echo "3. 設定完成後需要重新部署: vercel --prod"
echo "4. 可以透過 /api/debug-env 端點檢查環境變數是否正確載入"
