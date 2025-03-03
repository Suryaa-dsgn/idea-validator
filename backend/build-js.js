const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist', { recursive: true });
}

// Run babel to transpile TypeScript to JavaScript
console.log('Transpiling TypeScript to JavaScript...');
exec('npx babel src --extensions ".ts" --out-dir dist --copy-files', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error during transpilation: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Transpilation stderr: ${stderr}`);
  }
  console.log(`Transpilation stdout: ${stdout}`);
  console.log('Transpilation completed successfully!');
}); 