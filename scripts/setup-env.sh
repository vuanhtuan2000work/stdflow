#!/bin/bash

# StudyFlow Environment Setup Script
# Creates .env.local from .env.example

echo "🔧 StudyFlow Environment Setup"
echo "=============================="
echo ""

if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 0
    fi
fi

if [ ! -f ".env.example" ]; then
    echo "❌ .env.example not found"
    exit 1
fi

# Copy .env.example to .env.local
cp .env.example .env.local
echo "✅ Created .env.local from .env.example"
echo ""

echo "📝 Please edit .env.local with your Supabase credentials:"
echo ""
echo "1. NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL"
echo "2. NEXT_PUBLIC_SUPABASE_ANON_KEY - Your Supabase anon key"
echo "3. SUPABASE_SERVICE_ROLE_KEY - Your Supabase service role key"
echo "4. NEXT_PUBLIC_APP_URL - Your app URL (http://localhost:3000 for dev)"
echo "5. NEXT_PUBLIC_PWA_NAME - PWA name (default: StudyFlow)"
echo ""
echo "Get your keys from: https://supabase.com/dashboard/project/_/settings/api"
echo ""

