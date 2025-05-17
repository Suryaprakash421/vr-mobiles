// Script to restore skipped pages after build
const fs = require('fs');

// Get the list of renamed files from skip-build.js
const renamedFiles = require('./skip-build');

console.log('Restoring temporarily renamed pages after build...');

// Restore original filenames
renamedFiles.forEach(({ original, skip }) => {
  if (fs.existsSync(skip)) {
    fs.renameSync(skip, original);
    console.log(`Restored ${skip} to ${original}`);
  } else {
    console.log(`Warning: ${skip} does not exist, cannot restore`);
  }
});

console.log('Restoration complete.');
