#!/usr/bin/env python3
"""
Generate simple PNG icons for PWA
Creates valid PNG files with StudyFlow branding
"""
from PIL import Image, ImageDraw, ImageFont
import os

ICON_DIR = "public/icons"
PRIMARY_COLOR = "#4F46E5"  # Indigo from theme
TEXT_COLOR = "#FFFFFF"  # White

def create_icon(size, filename):
    """Create a square icon with StudyFlow branding"""
    # Create image with primary color background
    img = Image.new('RGB', (size, size), PRIMARY_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fallback to default
    try:
        # Try to use system font
        font_size = int(size * 0.3)
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * 0.3))
        except:
            font = ImageFont.load_default()
    
    # Draw "SF" text in center
    text = "SF"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    position = ((size - text_width) // 2, (size - text_height) // 2)
    draw.text(position, text, fill=TEXT_COLOR, font=font)
    
    # Save icon
    os.makedirs(ICON_DIR, exist_ok=True)
    img.save(filename, 'PNG')
    print(f"✅ Created {filename} ({size}x{size})")

if __name__ == "__main__":
    print("🎨 Generating PWA icons with Python...")
    create_icon(192, f"{ICON_DIR}/icon-192x192.png")
    create_icon(512, f"{ICON_DIR}/icon-512x512.png")
    print("✅ All icons generated!")

