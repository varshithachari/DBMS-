const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let content = fs.readFileSync(serverFile, 'utf8');

// 1. Add route for /grafana
const routeAnchor = "app.get('/nexeus'";
const routeAddition = `app.get(['/grafana', '/grafana.html', '/observability'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'grafana.html'));
});\n\n`;

if (!content.includes('/grafana')) {
  content = content.replace(routeAnchor, routeAddition + routeAnchor);
}

// 2. Add port 3001 listener inside server.listen
const portAnchor = "try {\n    const port80Server";
const grafanaPortAddition = `try {
    const grafanaServer = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(path.join(__dirname, 'public', 'grafana.html')).pipe(res);
    });
    grafanaServer.listen(3001, () => {
      console.log('📈 [Grafana v10.4.1 Console] Standalone Live at http://localhost:3001');
    }).on('error', (err) => {
      console.log('ℹ️  Port 3001 note: ' + err.message + ' (Accessible via /grafana)');
    });
  } catch (e) {}\n\n  `;

if (!content.includes('grafanaServer.listen(3001')) {
  content = content.replace(portAnchor, grafanaPortAddition + portAnchor);
}

fs.writeFileSync(serverFile, content, 'utf8');
console.log('Successfully added Grafana route and Port 3001 listener to server.js!');
