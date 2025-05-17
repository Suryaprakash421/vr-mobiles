// Skip static generation by modifying the Next.js build process
const fs = require("fs");
const path = require("path");

// Create a .env.local file that disables static generation
const envLocalPath = path.join(__dirname, ".env.local");
const envLocalContent = `
# Disable static generation
NEXT_DISABLE_STATIC_GENERATION=true
NEXT_STATIC_GENERATION_TIMEOUT=60
`;

console.log("Creating .env.local to disable static generation...");
fs.writeFileSync(envLocalPath, envLocalContent);

console.log(
  'Static generation disabled. You can now run "npm run build:static" to build your app.'
);
console.log(
  "After deployment, make sure to set these environment variables in your Vercel project:"
);
console.log("NEXT_DISABLE_STATIC_GENERATION=true");
console.log("NEXT_STATIC_GENERATION_TIMEOUT=60");
