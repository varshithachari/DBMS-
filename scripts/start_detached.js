const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverLogPath = path.join(rootDir, 'server_output.log');
const cfLogPath = path.join(rootDir, 'cloudflared_output.log');

// Kill any orphaned node or cloudflared instances first
try {
  const { execSync } = require('child_process');
  execSync('taskkill /F /IM cloudflared.exe', { stdio: 'ignore' });
} catch (e) {}

const serverLog = fs.openSync(serverLogPath, 'a');
const serverProc = spawn('node', ['server.js'], {
  cwd: rootDir,
  detached: true,
  stdio: ['ignore', serverLog, serverLog]
});
serverProc.unref();
console.log('✅ Background Server started. PID:', serverProc.pid);

const cfLog = fs.openSync(cfLogPath, 'w');
const cfProc = spawn(path.join(rootDir, 'cloudflared.exe'), ['tunnel', '--url', 'http://localhost:3000'], {
  cwd: rootDir,
  detached: true,
  stdio: ['ignore', cfLog, cfLog]
});
cfProc.unref();
console.log('✅ Background Cloudflare Tunnel started. PID:', cfProc.pid);
