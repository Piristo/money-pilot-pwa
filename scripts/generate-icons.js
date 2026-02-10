const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const svgPath = path.join(__dirname, '../public/icon-source.svg');
  const publicDir = path.join(__dirname, '../public');
  
  console.log('🎨 Generating PWA icons from SVG...');
  
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generate 192x192 icon
    console.log('📱 Creating icon-192.png...');
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✅ icon-192.png created');
    
    // Generate 512x512 icon
    console.log('📱 Creating icon-512.png...');
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✅ icon-512.png created');
    
    // Remove placeholder .txt files if they exist
    const txtFiles = ['icon-192.png.txt', 'icon-512.png.txt'];
    txtFiles.forEach(file => {
      const filePath = path.join(publicDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Removed ${file}`);
      }
    });
    
    console.log('\n✨ All icons generated successfully!');
    console.log('📍 Location: public/icon-192.png, public/icon-512.png');
    console.log('\n🔍 Test your icons at: https://maskable.app/');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
