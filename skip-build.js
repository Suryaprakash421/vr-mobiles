// Script to skip building problematic pages
const fs = require('fs');
const path = require('path');

// Pages to skip during build
const pagesToSkip = [
  'src/app/test-job-card/page.js',
];

console.log('Temporarily renaming problematic pages for build...');

// Rename files by adding .skip extension
const renamedFiles = [];
pagesToSkip.forEach(pagePath => {
  if (fs.existsSync(pagePath)) {
    const skipPath = `${pagePath}.skip`;
    fs.renameSync(pagePath, skipPath);
    renamedFiles.push({ original: pagePath, skip: skipPath });
    console.log(`Renamed ${pagePath} to ${skipPath}`);
  } else {
    console.log(`Warning: ${pagePath} does not exist, skipping`);
  }
});

// Export the list of renamed files so they can be restored after build
module.exports = renamedFiles;
