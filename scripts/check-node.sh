#!/bin/bash

# Check Node.js version and provide upgrade instructions

echo "🔍 Checking Node.js version..."
echo ""

CURRENT_VERSION=$(node --version)
MAJOR_VERSION=$(echo $CURRENT_VERSION | cut -d'v' -f2 | cut -d'.' -f1)

echo "Current: $CURRENT_VERSION"
echo "Required: >= 20.9.0"
echo ""

if [ "$MAJOR_VERSION" -ge 20 ]; then
    echo "✅ Node.js version is compatible!"
    exit 0
else
    echo "❌ Node.js version is too old"
    echo ""
    echo "📝 Upgrade Options:"
    echo ""
    
    # Check for nvm
    if command -v nvm &> /dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
        echo "Option 1: Using nvm (Recommended)"
        echo "  nvm install 20"
        echo "  nvm use 20"
        echo ""
    fi
    
    # Check for Homebrew (macOS)
    if command -v brew &> /dev/null; then
        echo "Option 2: Using Homebrew (macOS)"
        echo "  brew install node@20"
        echo "  brew link node@20 --force"
        echo ""
    fi
    
    echo "Option 3: Direct Download"
    echo "  Visit: https://nodejs.org/"
    echo "  Download Node.js 20.x LTS"
    echo ""
    
    exit 1
fi


