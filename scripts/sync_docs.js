const fs = require('fs');
const path = require('path');

const filesToSync = [
  ['public/login.html', 'docs/login.html'],
  ['public/reset-password.html', 'docs/reset-password.html'],
  ['public/dashboard.html', 'docs/dashboard.html'],
  ['public/index.html', 'docs/index.html'],
  ['public/js/app.js', 'docs/js/app.js']
];

for (const [src, dest] of filesToSync) {
  const srcPath = path.join(__dirname, '..', src);
  const destPath = path.join(__dirname, '..', dest);
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log(`Synced ${src} -> ${dest}`);
  }
}
