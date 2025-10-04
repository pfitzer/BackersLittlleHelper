const sharp = require('sharp');
const fs = require('fs');
const toIco = require('to-ico');

// Create a simple colored square as icon
const size = 256;
const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0ea5e9"/>
  <text x="50%" y="50%" font-family="Arial" font-size="120" fill="white" text-anchor="middle" dominant-baseline="middle">BH</text>
</svg>
`;

async function createIcons() {
  const buffer = Buffer.from(svg);

  // Create PNG icons
  await sharp(buffer).resize(32, 32).toFile('src-tauri/icons/32x32.png');
  await sharp(buffer).resize(128, 128).toFile('src-tauri/icons/128x128.png');
  await sharp(buffer).resize(256, 256).toFile('src-tauri/icons/128x128@2x.png');

  // Create ICO file (Windows) - proper format
  const png256 = await sharp(buffer).resize(256, 256).png().toBuffer();
  const ico = await toIco([png256]);
  fs.writeFileSync('src-tauri/icons/icon.ico', ico);

  // Create ICNS placeholder (macOS) - just use PNG
  await sharp(buffer).resize(512, 512).toFile('src-tauri/icons/icon.icns');

  console.log('Icons created successfully!');
}

createIcons().catch(console.error);