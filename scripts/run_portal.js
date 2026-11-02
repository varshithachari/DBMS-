const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const desktopDir = path.resolve(process.env.USERPROFILE || 'C:\\Users\\varsh', 'OneDrive', 'Desktop');

// 1. Start Server
console.log('🚀 [Supervisor] Initializing Chanakya Campus Connect Server...');
require('../server.js');

// 1.1 Start Python Microservices & Monolith Backends
function startBackend(name, modulePath, port) {
  console.log(`⚡ [Supervisor] Launching ${name} on port ${port}...`);
  const proc = spawn('python', ['-m', 'uvicorn', modulePath, '--host', '127.0.0.1', '--port', String(port)], {
    cwd: rootDir,
    stdio: 'ignore'
  });
  proc.on('close', (code) => {
    console.warn(`[Supervisor] ${name} exited (code ${code}). Restarting in 3s...`);
    setTimeout(() => startBackend(name, modulePath, port), 3000);
  });
}
startBackend('Architecture A (Modular Monolith)', 'backend.modular_monolith.app:app', 8001);
startBackend('Architecture B (Event-Driven Architecture)', 'backend.event_driven.app:app', 8002);

let tunnelUrl = null;
let cfProcess = null;
let keepAliveTimer = null;

function saveUrls(url) {
  tunnelUrl = url;
  console.log('\n=============================================================');
  console.log('🎉 CHANAKYA CAMPUS CONNECT IS LIVE ONLINE!');
  console.log(`🌐 Public Tunnel URL: ${url}`);
  console.log(`📜 Certificates Vault: ${url}/dashboard?tab=certificates`);
  console.log(`🎓 Visual Certificate: ${url}/certificate.html?code=CERT-CU-S01-P0001-CC36`);
  console.log(`💻 Local Machine URL:  http://localhost:3000`);
  console.log('=============================================================\n');

  try {
    fs.writeFileSync(path.join(rootDir, 'ACTIVE_URL.txt'), url, 'utf8');
  } catch (e) {}

  try {
    // Save to user desktop if accessible
    const desktopLinkPath = path.join(desktopDir, 'CHANAKYA_LIVE_LINK.txt');
    const content = `==========================================================
CHANAKYA CAMPUS CONNECT - LIVE ACCESS LINKS
==========================================================

1. MAIN APPLICATION LINK:
   ${url}

2. DIGITAL CERTIFICATES & HONORS VAULT:
   ${url}/dashboard?tab=certificates

3. ARCHITECTURE RESEARCH LAB (ECS351):
   ${url}/dashboard?tab=architecture

4. OFFICIAL VISUAL CERTIFICATE PREVIEW:
   ${url}/certificate.html?code=CERT-CU-S01-P0001-CC36

5. LOCAL ACCESS (ON THIS PC - FASTEST & NEVER DIES):
   http://localhost:3000

==========================================================
STATUS: Supervised with HTTP/2 Active Keep-Alive & Auto-Reconnect
Last Updated: ${new Date().toLocaleString()}
==========================================================
`;
    fs.writeFileSync(desktopLinkPath, content, 'utf8');

    // Create Windows .URL shortcut on Desktop
    const shortcutPath = path.join(desktopDir, 'Chanakya Campus Connect.url');
    fs.writeFileSync(shortcutPath, `[InternetShortcut]\nURL=${url}\n`, 'utf8');

    console.log(`📁 Saved desktop shortcut and link file to: ${desktopLinkPath}`);
  } catch (e) {
    // Desktop write might be sandboxed, perfectly fine
  }
}

function startKeepAlive() {
  if (keepAliveTimer) clearInterval(keepAliveTimer);
  keepAliveTimer = setInterval(() => {
    // Local ping
    http.get('http://localhost:3000/api/database/status', (res) => {
      res.resume();
    }).on('error', () => {});

    // Remote ping if URL ready
    if (tunnelUrl && tunnelUrl.startsWith('https://')) {
      https.get(`${tunnelUrl}/api/database/status`, (res) => {
        res.resume();
      }).on('error', (err) => {
        console.warn('[Keep-Alive Warning] Ping to tunnel failed:', err.message);
      });
    }
  }, 15000); // Every 15 seconds keeps TCP & NAT connection alive forever
}

function startCloudflareTunnel() {
  const cfBinary = path.join(rootDir, 'cloudflared.exe');
  if (!fs.existsSync(cfBinary)) {
    console.error('cloudflared.exe not found at:', cfBinary);
    return;
  }

  console.log('⚡ [Supervisor] Launching Cloudflare Tunnel with HTTP/2 and auto-reconnect...');
  
  // Use http2 protocol to prevent aggressive UDP NAT timeout on home/host Wi-Fi
  cfProcess = spawn(cfBinary, [
    'tunnel',
    '--url', 'http://localhost:3000',
    '--protocol', 'http2',
    '--no-autoupdate'
  ], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const onData = (chunk) => {
    const text = chunk.toString();
    const match = text.match(/https:\/\/(?!api\.)[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && (!tunnelUrl || tunnelUrl !== match[0])) {
      saveUrls(match[0]);
    }
  };

  cfProcess.stdout.on('data', onData);
  cfProcess.stderr.on('data', onData);

  cfProcess.on('close', (code) => {
    console.warn(`[Supervisor] Cloudflare tunnel process exited with code ${code}. Auto-restarting in 3 seconds...`);
    setTimeout(startCloudflareTunnel, 3000);
  });

  startKeepAlive();
}

// Start tunnel after small delay to let server listen
setTimeout(startCloudflareTunnel, 1000);
