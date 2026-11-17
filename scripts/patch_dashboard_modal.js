const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'public', 'dashboard.html'),
  path.join(__dirname, '..', 'public', 'index.html')
];

const targetPattern = /<!-- =+ -->\s*<!-- MODAL: PERSONA LOGIN & ROLE PICKER -->[\s\S]*?<!-- Toast Container -->/;

const replacement = `<!-- ======================================================================== -->
  <!-- MODAL: ACTIVE AUTHENTICATED SESSION OVERVIEW -->
  <!-- ======================================================================== -->
  <div id="login-modal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
    <div class="glass-card rounded-3xl max-w-md w-full p-6 border border-slate-700 space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <span class="text-xl">🔐</span>
          <div>
            <h3 class="text-sm font-black text-white font-outfit">Active Verified Session</h3>
            <span class="text-[10px] text-slate-400">Institutional Identity & RBAC Policy</span>
          </div>
        </div>
        <button onclick="closeLoginModal()" class="text-slate-400 hover:text-white text-sm">✕</button>
      </div>

      <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl role-indicator-avatar">🎓</div>
          <div>
            <h4 class="text-sm font-bold text-white role-indicator-name">Student Account</h4>
            <span class="text-xs text-amber-400 font-mono font-bold role-indicator-label">STUDENT</span>
          </div>
        </div>
        <div class="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
          <div class="flex justify-between"><span class="text-slate-500">Department:</span> <span class="role-indicator-dept text-white">School of Engineering</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Session Security:</span> <span class="text-emerald-400">HTTP-Only Server Managed</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Status:</span> <span class="text-emerald-400">● Authenticated</span></div>
        </div>
        <button onclick="handleLogout()" class="w-full mt-2 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center justify-center gap-2 btn-tactile">
          <span>🚪</span> Terminate Session & Sign Out
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Container -->`;

for (const filePath of files) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (targetPattern.test(content)) {
      content = content.replace(targetPattern, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Patched modal in ${path.basename(filePath)}`);
    } else {
      console.warn(`Pattern not matched in ${path.basename(filePath)}`);
    }
  }
}
