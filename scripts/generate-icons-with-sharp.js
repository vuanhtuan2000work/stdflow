#!/usr/bin/env node
/**
 * Generate PNG icons for PWA using sharp
 * Run: npm install --save-dev sharp (one time)
 * Then: node scripts/generate-icons-with-sharp.js
 */

const fs = require('fs')
const path = require('path')

async function generateIcons() {
  try {
    const sharp = require('sharp')
    const ICON_DIR = 'public/icons'
    const PRIMARY_COLOR = '#4F46E5' // Indigo from theme
    const TEXT_COLOR = '#FFFFFF' // White
    
    console.log('🎨 Generating PWA icons with sharp...')
    
    // Ensure directory exists
    if (!fs.existsSync(ICON_DIR)) {
      fs.mkdirSync(ICON_DIR, { recursive: true })
    }
    
    // Create SVG with StudyFlow branding
    const createSVG = (size) => `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${PRIMARY_COLOR}"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="${size * 0.3}" 
          font-weight="bold"
          fill="${TEXT_COLOR}"
          text-anchor="middle"
          dominant-baseline="middle"
        >SF</text>
      </svg>
    `
    
    // Generate 192x192 icon
    const svg192 = Buffer.from(createSVG(192))
    await sharp(svg192)
      .resize(192, 192)
      .png()
      .toFile(path.join(ICON_DIR, 'icon-192x192.png'))
    console.log('✅ Created icon-192x192.png')
    
    // Generate 512x512 icon
    const svg512 = Buffer.from(createSVG(512))
    await sharp(svg512)
      .resize(512, 512)
      .png()
      .toFile(path.join(ICON_DIR, 'icon-512x512.png'))
    console.log('✅ Created icon-512x512.png')
    
    console.log('✅ All icons generated successfully!')
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ sharp not found!')
      console.log('📦 Install it: npm install --save-dev sharp')
      process.exit(1)
    } else {
      throw error
    }
  }
}

if (require.main === module) {
  generateIcons().catch(console.error)
}

module.exports = { generateIcons }


