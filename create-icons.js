const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log(`Created directory: ${iconsDir}`);
}

// Function to create an icon
function createIcon(size, filename) {
  // Create a canvas with the specified size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill the background
  ctx.fillStyle = '#3b82f6'; // Blue background
  ctx.fillRect(0, 0, size, size);

  // Add text
  const fontSize = size / 4;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VR', size / 2, size / 2 - fontSize / 2);
  ctx.fillText('Mobiles', size / 2, size / 2 + fontSize / 2);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(iconsDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created icon: ${filePath}`);
}

// Create icons of different sizes
try {
  createIcon(192, 'icon-192x192.png');
  createIcon(512, 'icon-512x512.png');
  console.log('Icons created successfully!');
} catch (error) {
  console.error('Error creating icons:', error);
}
