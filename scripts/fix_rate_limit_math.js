const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'services', 'authService.js');
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /const attempts = authStore\.recordFailedAttempt\(loginId, ip\);[\s\S]*?err\.status = 401;\s*throw err;/;

const replacement = `const attempts = authStore.recordFailedAttempt(loginId, ip);
      const remaining = Math.max(0, 5 - attempts);
      const message = remaining > 0
        ? \`Invalid password. \${remaining} attempt(s) remaining before security lockout.\`
        : "Too many failed attempts. Account temporarily locked for 15 minutes.";
      const err = new Error(message);
      err.status = (remaining === 0 || attempts >= 5) ? 429 : 401;
      throw err;`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully updated rate limit math & status in authService.js!');
} else {
  console.error('Regex match failed in authService.js');
  process.exit(1);
}
