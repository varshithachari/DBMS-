const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, '..', 'server.js');
let content = fs.readFileSync(serverJsPath, 'utf8');

const targetPattern = /\/\/ Main Landing Page[\s\S]*?app\.get\('\*', \(req, res\) => \{[\s\S]*?\}\);/;

const replacement = `// Main University Entry Point / Landing Gateway
app.get('/', async (req, res) => {
  const sessionInfo = await authService.validateSession(req);
  if (sessionInfo.authenticated) {
    return res.redirect(sessionInfo.user && sessionInfo.user.role === 'admin' ? '/admin-portal' : '/dashboard');
  }
  res.redirect('/login');
});

// Catch-all route to guard protected views
app.get('*', async (req, res) => {
  const sessionInfo = await authService.validateSession(req);
  if (sessionInfo.authenticated) {
    return res.redirect(sessionInfo.user && sessionInfo.user.role === 'admin' ? '/admin-portal' : '/dashboard');
  }
  res.redirect('/login');
});`;

if (targetPattern.test(content)) {
  content = content.replace(targetPattern, replacement);
  fs.writeFileSync(serverJsPath, content, 'utf8');
  console.log("Successfully updated root landing logic in server.js!");
} else {
  console.error("Pattern match failed in server.js!");
  process.exit(1);
}
