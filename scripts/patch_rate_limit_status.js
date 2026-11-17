const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'services', 'authService.js');
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(
  'err.status = 401;\n      throw err;',
  'err.status = (attempts >= 5) ? 429 : 401;\n      throw err;'
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Updated authService rate limit status code!');
