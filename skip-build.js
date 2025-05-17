// Script to skip building problematic pages and prepare for build
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Pages to skip during build
const pagesToSkip = ["src/app/test-job-card/page.js"];

console.log("Temporarily renaming problematic pages for build...");

// Rename files by adding .skip extension
const renamedFiles = [];
pagesToSkip.forEach((pagePath) => {
  if (fs.existsSync(pagePath)) {
    const skipPath = `${pagePath}.skip`;
    fs.renameSync(pagePath, skipPath);
    renamedFiles.push({ original: pagePath, skip: skipPath });
    console.log(`Renamed ${pagePath} to ${skipPath}`);
  } else {
    console.log(`Warning: ${pagePath} does not exist, skipping`);
  }
});

// Generate Prisma client before build to ensure it's available
console.log("Generating Prisma client...");
try {
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("Prisma client generated successfully.");
} catch (error) {
  console.error("Error generating Prisma client:", error.message);
}

// Export the list of renamed files so they can be restored after build
module.exports = renamedFiles;
