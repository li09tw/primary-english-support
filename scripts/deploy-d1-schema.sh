#!/bin/bash

# Deploy D1 Schema Script for Learning Content System
# This script deploys the updated schema.sql to Cloudflare D1

echo "🚀 Starting D1 Schema Deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler CLI is not installed"
    echo "Please install it with: npm install -g wrangler"
    exit 1
fi

# Check if the schema file exists
SCHEMA_FILE="db/schema.sql"
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Error: Schema file not found at $SCHEMA_FILE"
    exit 1
fi

echo "📁 Found schema file: $SCHEMA_FILE"

# Deploy the schema to D1
echo "📤 Deploying schema to D1 database..."
wrangler d1 execute PRIMARY_ENGLISH_DB --file="$SCHEMA_FILE" --config=wrangler-api-gateway.toml --remote

if [ $? -eq 0 ]; then
    echo "✅ Schema deployed successfully!"
    echo "🎯 Database now contains:"
echo "   - 3 grade levels (Grade 3, 5, 6)"
echo "   - 24 word themes"
echo "   - 500+ words with has_plural field"
echo "   - 66 sentence patterns organized by grade"
echo "   - Pattern slots for word placement"
echo "   - Word theme associations"
echo "   - Expanded vocabulary for Sports, Stationery, Fruits, Drinks, Main Dishes, Furniture, Countries, Ailments, and School Subjects"
else
    echo "❌ Error: Failed to deploy schema"
    exit 1
fi

echo "🎉 D1 Schema deployment completed!"
echo "💡 You can now test the learning content system with the updated data structure."
