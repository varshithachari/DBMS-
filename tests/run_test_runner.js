/**
 * Automated Test Runner: Starts server, runs E2E tests, cleanly exits
 */
const { spawn } = require('child_process');
const path = require('path');

const serverProcess = spawn('node', ['server.js'], {
  cwd: path.resolve(__dirname, '..'),
  stdio: ['ignore', 'pipe', 'pipe']
});

let serverReady = false;

serverProcess.stdout.on('data', (chunk) => {
  const str = chunk.toString();
  process.stdout.write(`[SERVER] ${str}`);
  if (str.includes('PLATFORM IS RUNNING') || str.includes('Local URL:')) {
    serverReady = true;
  }
});

serverProcess.stderr.on('data', (chunk) => {
  process.stderr.write(`[SERVER ERROR] ${chunk.toString()}`);
});

const http = require('http');

function checkHttpReady() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/database/status', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  console.log('[Runner] Waiting for server startup via HTTP poll...');
  const start = Date.now();
  while (!serverReady && (Date.now() - start < 15000)) {
    const ok = await checkHttpReady();
    if (ok) {
      serverReady = true;
      break;
    }
    await new Promise(r => setTimeout(r, 250));
  }

  if (!serverReady) {
    console.error('[Runner] Server failed to start within timeout.');
    serverProcess.kill();
    process.exit(1);
  }

  console.log('[Runner] Server started! Launching E2E verification suite...');
  const runE2E = require('./e2e_verification');
  
  try {
    await runE2E();
    console.log('[Runner] All verification tests passed successfully! Terminating server.');
    serverProcess.kill();
    process.exit(0);
  } catch (err) {
    console.error('[Runner] Tests failed:', err);
    serverProcess.kill();
    process.exit(1);
  }
}

main();
