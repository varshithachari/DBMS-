const fs = require('fs');
const path = require('path');

const targets = [
  path.resolve(__dirname, '..', 'docs', 'js', 'architectureLab.js'),
  path.resolve(__dirname, '..', 'public', 'js', 'architectureLab.js')
];

targets.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the broken loadSystemEnvironment
  const brokenLoadSys = /async function loadSystemEnvironment\(\)\s*\{[\s\S]*?console\.warn\("Using default environment specs:", err\);\s*\}\s*\}/;
  const cleanLoadSys = `async function loadSystemEnvironment() {
  let loaded = false;
  try {
    const res = await fetch('/api/experiments/system-env');
    if (res.ok) {
      const data = await res.json();
      systemEnvData = data.system || {};
      loaded = true;
    }
  } catch (err) {}

  if (!loaded) {
    systemEnvData = { ...FALLBACK_SYSTEM_ENV };
  }
  renderSystemEnvironmentUI(systemEnvData);
}`;

  content = content.replace(brokenLoadSys, cleanLoadSys);

  // Also clean up any double catch or syntax issues
  content = content.replace(/\}\s*catch\s*\(err\)\s*\{\s*console\.warn\("Using default environment specs:", err\);\s*\}\s*\}/, '}');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[Cleaned] ${filePath}`);
});
