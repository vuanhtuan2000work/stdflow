#!/bin/bash

# StudyFlow Deployment Verification Script
# This script checks if the project is ready for deployment

echo "🔍 StudyFlow Deployment Verification"
echo "======================================"
echo ""

ERRORS=0
WARNINGS=0

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 20 ]; then
    echo "✅ Node.js version: $(node --version) (>= 20.9.0 required)"
else
    echo "❌ Node.js version: $(node --version) (>= 20.9.0 required)"
    echo "   Run: nvm install 20 && nvm use 20"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check if .env.local exists
echo "🔐 Checking environment variables..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local exists"
    
    # Check required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ Required environment variables found"
    else
        echo "⚠️  Some required environment variables missing"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "⚠️  .env.local not found (create from .env.example)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check if .env.example has placeholder values
echo "📝 Checking .env.example..."
if [ -f ".env.example" ]; then
    if grep -q "your-project-ref.supabase.co" .env.example || grep -q "your_anon_key_here" .env.example || grep -q "your_supabase" .env.example; then
        echo "✅ .env.example has placeholder values (safe)"
    elif grep -q "https://.*\.supabase\.co" .env.example && ! grep -q "your-" .env.example; then
        echo "⚠️  .env.example might contain real keys (security risk)"
        echo "   Please ensure .env.example only has placeholder values"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ .env.example looks safe"
    fi
else
    echo "⚠️  .env.example not found"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check PWA icons
echo "🎨 Checking PWA icons..."
if [ -f "public/icons/icon-192x192.png" ] && [ -f "public/icons/icon-512x512.png" ]; then
    SIZE_192=$(stat -f%z "public/icons/icon-192x192.png" 2>/dev/null || stat -c%s "public/icons/icon-192x192.png" 2>/dev/null)
    SIZE_512=$(stat -f%z "public/icons/icon-512x512.png" 2>/dev/null || stat -c%s "public/icons/icon-512x512.png" 2>/dev/null)
    
    if [ "$SIZE_192" -lt 1000 ] || [ "$SIZE_512" -lt 1000 ]; then
        echo "⚠️  PWA icons appear to be placeholders (very small file size)"
        echo "   Replace with real StudyFlow branding icons"
        WARNINGS=$((WARNINGS + 1))
    else
        echo "✅ PWA icons found"
    fi
else
    echo "❌ PWA icons missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check SQL migration file
echo "🗄️  Checking database migration..."
if [ -f "supabase/migrations/001_initial_schema.sql" ]; then
    echo "✅ SQL migration file exists"
else
    echo "❌ SQL migration file missing"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check if build works
echo "🔨 Testing build..."
if [ "$NODE_VERSION" -ge 20 ]; then
    if npm run build > /dev/null 2>&1; then
        echo "✅ Build successful"
    else
        echo "❌ Build failed (run 'npm run build' for details)"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "⚠️  Skipping build test (Node.js version too low)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check tests
echo "🧪 Checking tests..."
if npm test -- --passWithNoTests > /dev/null 2>&1; then
    echo "✅ Tests passing"
else
    echo "⚠️  Some tests failing (run 'npm test' for details)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Summary
echo "======================================"
echo "📊 Summary"
echo "======================================"
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! Ready for deployment."
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  Ready with warnings. Review warnings above."
    exit 0
else
    echo "❌ Not ready for deployment. Fix errors above."
    exit 1
fi

