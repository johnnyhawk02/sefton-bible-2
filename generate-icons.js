import sharp from 'sharp';

// Create a simple SVG icon for the Reception Bible
const iconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1f2937"/>
  <rect x="64" y="64" width="384" height="384" rx="24" fill="#ffffff"/>
  <rect x="96" y="128" width="320" height="16" rx="8" fill="#1f2937"/>
  <rect x="96" y="176" width="280" height="16" rx="8" fill="#6b7280"/>
  <rect x="96" y="224" width="240" height="16" rx="8" fill="#6b7280"/>
  <rect x="96" y="272" width="300" height="16" rx="8" fill="#6b7280"/>
  <rect x="96" y="320" width="200" height="16" rx="8" fill="#6b7280"/>
  <circle cx="384" cy="160" r="24" fill="#10b981"/>
</svg>
`;

async function generateIcons() {
  const svgBuffer = Buffer.from(iconSvg);
  
  // Generate 192x192 icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/icon-192.png');
    
  // Generate 512x512 icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/icon-512.png');
    
  console.log('PWA icons generated successfully!');
}

generateIcons().catch(console.error);
