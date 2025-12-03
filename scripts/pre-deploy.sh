#!/bin/bash

# StudyFlow Pre-Deployment Script
# Guides you through the deployment preparation process

echo "🚀 StudyFlow Pre-Deployment Guide"
echo "=================================="
echo ""

# Check Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version: $(node --version) (need >= 20.9.0)"
    echo ""
    echo "📝 To fix:"
    echo "   nvm install 20"
    echo "   nvm use 20"
    echo ""
    read -p "Do you want to try switching to Node.js 20 now? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v nvm &> /dev/null; then
            nvm install 20
            nvm use 20
            echo "✅ Switched to Node.js $(node --version)"
        else
            echo "⚠️  nvm not found. Please install Node.js 20 manually."
            echo "   Visit: https://nodejs.org/"
        fi
    fi
    echo ""
fi

# Check .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found"
    echo ""
    read -p "Do you want to create .env.local from .env.example? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm run setup-env
        echo ""
        echo "📝 Please edit .env.local with your Supabase credentials"
        echo "   Get keys from: https://supabase.com/dashboard/project/_/settings/api"
    fi
    echo ""
fi

# Check database migration
echo "🗄️  Database Migration Status"
echo "Have you run the database migration in Supabase? (y/N)"
read -p "> " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📝 To run migration:"
    echo "   1. Go to https://supabase.com"
    echo "   2. Open your project → SQL Editor"
    echo "   3. Copy from: supabase/migrations/001_initial_schema.sql"
    echo "   4. Paste and run"
    echo "   5. Create storage buckets: avatars, attachments"
    echo ""
fi

# Check PWA icons
ICON_192_SIZE=$(stat -f%z "public/icons/icon-192x192.png" 2>/dev/null || stat -c%s "public/icons/icon-192x192.png" 2>/dev/null)
if [ "$ICON_192_SIZE" -lt 1000 ]; then
    echo "⚠️  PWA icons appear to be placeholders"
    echo ""
    echo "📝 To fix:"
    echo "   - Create icons 192x192 and 512x512 with StudyFlow branding"
    echo "   - Replace public/icons/icon-192x192.png and icon-512x512.png"
    echo "   - Icons should be maskable (safe area for Android)"
    echo ""
fi

# Run verification
echo "🔍 Running full verification..."
echo ""
npm run verify

echo ""
echo "=================================="
echo "📚 Next Steps:"
echo "   1. Fix any errors/warnings above"
echo "   2. Run: npm run build"
echo "   3. Follow: DEPLOYMENT_GUIDE.md"
echo "=================================="
