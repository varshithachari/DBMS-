const fs = require('fs');
const path = require('path');

['public/js/app.js', 'docs/js/app.js'].forEach(relPath => {
  const fullPath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  content = content.replace(
    /function closeCplStandingsModal\(\)\s*\{[\s\S]*?reserved for \$\{appState\.currentUser\.name\} \(17:00 - 18:00\)\.\`,\s*'success'\);\s*sfx\.play\('success'\);\s*\}/,
    `function closeCplStandingsModal() {\n  sfx.play('click');\n  const modal = document.getElementById('cpl-standings-modal');\n  if (modal) modal.classList.add('hidden');\n}\n\nfunction bookCourtModal(courtId, courtName) {\n  sfx.play('click');\n  showToast("Court Slot Booked", \`\${courtName} reserved for \${appState.currentUser.name} (17:00 - 18:00).\`, 'success');\n  sfx.play('success');\n}`
  );

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Fixed:', relPath);
});
