#!/bin/bash

# 環境變數設定腳本
# 用於設定管理員帳號部署所需的環境變數

echo "🔧 管理員帳號部署環境變數設定"
echo "====================================="

# 檢查 .env.local 是否存在
if [ ! -f ".env.local" ]; then
    echo "📝 創建 .env.local 檔案..."
    touch .env.local
fi

echo ""
echo "請設定以下環境變數："
echo ""

# Cloudflare 設定
echo "🌐 Cloudflare 設定:"
read -p "CLOUDFLARE_ACCOUNT_ID: " CLOUDFLARE_ACCOUNT_ID
read -p "CLOUDFLARE_API_TOKEN: " CLOUDFLARE_API_TOKEN
read -p "DATABASE_NAME: " DATABASE_NAME

# 管理員帳號設定
echo ""
echo "👤 管理員帳號設定:"
read -p "ADMIN_USERNAME: " ADMIN_USERNAME
read -p "ADMIN_EMAIL: " ADMIN_EMAIL
read -s -p "ADMIN_PASSWORD: " ADMIN_PASSWORD
echo ""

# EmailJS 設定
echo ""
echo "📧 EmailJS 設定:"
read -p "DEFAULT_ADMIN_EMAIL: " DEFAULT_ADMIN_EMAIL
read -p "EMAILJS_SERVICE_ID: " EMAILJS_SERVICE_ID
read -p "EMAILJS_TEMPLATE_ID: " EMAILJS_TEMPLATE_ID
read -p "EMAILJS_PUBLIC_KEY: " EMAILJS_PUBLIC_KEY

# 寫入 .env.local
echo ""
echo "📝 寫入 .env.local 檔案..."

cat > .env.local << EOF
# Cloudflare 設定
CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_API_TOKEN
DATABASE_NAME=$DATABASE_NAME

# 管理員帳號設定
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD

# EmailJS 設定
DEFAULT_ADMIN_EMAIL=$DEFAULT_ADMIN_EMAIL
EMAILJS_SERVICE_ID=$EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ID=$EMAILJS_TEMPLATE_ID
EMAILJS_PUBLIC_KEY=$EMAILJS_PUBLIC_KEY
EOF

echo "✅ 環境變數已寫入 .env.local"
echo ""
echo "🚀 現在可以執行部署腳本："
echo "   source .env.local"
echo "   chmod +x scripts/deploy-admin-account.sh"
echo "   ./scripts/deploy-admin-account.sh"
echo ""
echo "⚠️  注意：請妥善保管 .env.local 檔案，不要上傳到版本控制系統"
