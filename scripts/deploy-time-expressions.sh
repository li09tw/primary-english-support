#!/bin/bash

# Deploy Time Expressions theme to database
# This script adds the new Time Expressions theme and associated words

echo "🚀 Deploying Time Expressions theme to database..."

# Check if wrangler is available
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler is not installed or not in PATH"
    echo "Please install wrangler first: npm install -g wrangler"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "wrangler-dev.toml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Execute the SQL script
echo "📝 Executing Time Expressions SQL script..."
wrangler d1 execute primary-english-support --file=./scripts/add-time-expressions.sql

if [ $? -eq 0 ]; then
    echo "✅ Time Expressions theme deployed successfully!"
    echo "🎯 New theme ID: 24"
    echo "📚 Added time expression words (o'clock, half past, quarter past/to)"
    echo "🔗 Associated with 'What time do you _____?' pattern"
else
    echo "❌ Error deploying Time Expressions theme"
    exit 1
fi

echo "🎉 Deployment complete!"
