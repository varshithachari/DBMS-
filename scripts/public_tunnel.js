/**
 * Resilient Public Tunnel for Chanakya Campus Connect
 * Shares the running application securely with external friends/evaluators.
 */

const localtunnel = require('localtunnel');
const https = require('https');

const PORT = process.env.PORT || 3000;

function getPublicIp() {
  return new Promise((resolve) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', () => resolve('106.202.104.111'));
  });
}

async function startTunnel() {
  const publicIp = await getPublicIp();
  console.log('========================================================================');
  console.log('🌐 STARTING CHANAKYA CAMPUS CONNECT PUBLIC SHAREABLE TUNNEL');
  console.log(`🏠 Local Port: http://localhost:${PORT}`);
  console.log(`🔑 Tunnel Password (Public IP for friend to enter): ${publicIp}`);
  console.log('========================================================================');

  try {
    const tunnel = await localtunnel({ port: PORT });

    console.log('\n========================================================================');
    console.log('🎉 SHAREABLE PUBLIC LINK FOR YOUR FRIEND:');
    console.log(`👉 ${tunnel.url}`);
    console.log(`👉 Direct Login:     ${tunnel.url}/login`);
    console.log(`👉 Direct Dashboard: ${tunnel.url}/dashboard`);
    console.log('------------------------------------------------------------------------');
    console.log(`NOTE FOR YOUR FRIEND: When opening the link for the first time,`);
    console.log(`localtunnel may ask for a "Tunnel Password / Endpoint IP".`);
    console.log(`Enter this IP: ${publicIp} and click "Submit".`);
    console.log('========================================================================\n');

    tunnel.on('close', () => {
      console.log('⚠️ Tunnel closed. Reconnecting in 3 seconds...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
    });

  } catch (err) {
    console.error('Failed to open tunnel:', err.message);
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();
