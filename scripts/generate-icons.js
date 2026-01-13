const sharp = require('sharp');
const path = require('path');

const logoPath = path.join(__dirname, '../public/app-logo-zoom-in--t3chat--1.png');

// Generate 192x192 icon
sharp(logoPath)
  .resize(192, 192, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  })
  .toFile(path.join(__dirname, '../public/icon-192.png'))
  .then(() => {
    console.log('Generated icon-192.png');
    
    // Generate 512x512 icon
    return sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(path.join(__dirname, '../public/icon-512.png'));
  })
  .then(() => {
    console.log('Generated icon-512.png');
    console.log('All icons generated successfully!');
  })
  .catch((err) => {
    console.error('Error generating icons:', err);
    process.exit(1);
  });
