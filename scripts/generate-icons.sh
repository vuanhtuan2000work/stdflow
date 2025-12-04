#!/bin/bash
# Generate simple PNG icons for PWA
# This creates valid PNG files using ImageMagick or sips (macOS)

ICON_DIR="public/icons"
PRIMARY_COLOR="#4F46E5" # Indigo from theme

echo "🎨 Generating PWA icons..."

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
  echo "Using ImageMagick..."
  convert -size 192x192 xc:"$PRIMARY_COLOR" -gravity center -pointsize 72 -fill white -annotate +0+0 "SF" "$ICON_DIR/icon-192x192.png"
  convert -size 512x512 xc:"$PRIMARY_COLOR" -gravity center -pointsize 200 -fill white -annotate +0+0 "SF" "$ICON_DIR/icon-512x512.png"
  echo "✅ Icons generated with ImageMagick"
elif command -v sips &> /dev/null; then
  echo "Using sips (macOS)..."
  # Create temporary colored images
  # Note: sips doesn't support creating from scratch, so we'll use Python instead
  echo "⚠️ sips doesn't support creating images from scratch"
  echo "📝 Please install ImageMagick: brew install imagemagick"
  echo "   Or use Python script instead"
else
  echo "⚠️ Neither ImageMagick nor sips found"
  echo "📝 Installing ImageMagick..."
  if command -v brew &> /dev/null; then
    brew install imagemagick
    convert -size 192x192 xc:"$PRIMARY_COLOR" -gravity center -pointsize 72 -fill white -annotate +0+0 "SF" "$ICON_DIR/icon-192x192.png"
    convert -size 512x512 xc:"$PRIMARY_COLOR" -gravity center -pointsize 200 -fill white -annotate +0+0 "SF" "$ICON_DIR/icon-512x512.png"
    echo "✅ Icons generated"
  else
    echo "❌ Please install ImageMagick manually or use Python script"
  fi
fi


