#!/bin/bash

# Deploy Word Theme Associations Script
# This script links all words to their corresponding themes in the D1 database

echo "🔗 Starting Word Theme Associations Deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI is not installed"
    echo "Please install it with: npm install -g wrangler"
    exit 1
fi

# Check if the SQL file exists
SQL_FILE="scripts/link-all-words-to-themes.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Error: SQL file not found at $SQL_FILE"
    exit 1
fi

echo "📁 Found SQL file: $SQL_FILE"

# Deploy the word theme associations to D1
echo "📤 Deploying word theme associations to D1 database..."
wrangler d1 execute PRIMARY_ENGLISH_DB --file="$SQL_FILE" --config=wrangler-api-gateway.toml --remote

if [ $? -eq 0 ]; then
    echo "✅ Word theme associations deployed successfully!"
    echo "🎯 Database now contains updated associations for:"
    echo "   - Sports (35 words)"
    echo "   - Stationery (40 words)"
    echo "   - Fruits (45 words)"
    echo "   - Drinks (50 words)"
    echo "   - Main Dishes (50 words)"
    echo "   - Furniture (60 words)"
    echo "   - Countries (80 words)"
    echo "   - Ailments (100 words)"
    echo "   - School Subjects (100 words)"
    echo "   - And all other existing themes"
else
    echo "❌ Error: Failed to deploy word theme associations"
    exit 1
fi

echo "🎉 Word Theme Associations deployment completed!"
echo "💡 All words are now properly linked to their corresponding themes."
