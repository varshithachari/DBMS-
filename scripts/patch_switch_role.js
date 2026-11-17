const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

const targetPattern = /function switchRole\(roleKey\) \{[\s\S]*?showToast\("Role Switched"[\s\S]*?\n\}/;

const replacement = `function switchRole(roleKey) {
  if (roleKey === 'authenticated_user') {
    initAuthSession();
    return;
  }
  // Enforce RBAC: Non-admin cannot switch to admin
  if (roleKey === 'admin' && appState.currentUser && appState.currentUser.role !== 'admin') {
    showToast("Access Denied", "Administrator privilege requires verified credentials.", "error");
    if (typeof sfx !== 'undefined') sfx.play('error');
    return;
  }
  if (!DEMO_USERS[roleKey]) return;
  sfx.play('click');
  appState.currentRole = roleKey;
  appState.currentUser = { ...DEMO_USERS[roleKey] };

  // Update UI Elements for Role
  updateUserUI();

  // Update Active Role in Role Selector Buttons
  document.querySelectorAll('.role-select-btn').forEach(btn => {
    const r = btn.getAttribute('data-role');
    if (r === roleKey) {
      btn.className = "role-select-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5";
    } else {
      btn.className = "role-select-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5";
    }
  });

  // Adapt Dashboard Cards based on Role Access
  adaptRoleViews();

  showToast("Role Switched", \`Active Persona: \${appState.currentUser.name} (\${appState.currentUser.roleLabel})\`, 'info');
}`;

if (targetPattern.test(content)) {
  content = content.replace(targetPattern, replacement);
  fs.writeFileSync(appJsPath, content, 'utf8');
  console.log("Successfully patched switchRole RBAC guard in app.js!");
} else {
  console.error("Pattern match failed for switchRole in app.js!");
  process.exit(1);
}
