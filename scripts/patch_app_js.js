const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// Replace handleLogout and initAuthSession
const targetPattern = /\/\/ 17\. AUTHENTICATION & SESSION MANAGEMENT \(LOGIN \/ LOGOUT\)[\s\S]*?function initAuthSession\(\) \{[\s\S]*?\n\}/;

const replacement = `// 17. AUTHENTICATION & SESSION MANAGEMENT (LOGIN / LOGOUT)
// ============================================================================
async function handleLogout() {
  sfx.play('click');
  showToast("Logging out...", "Terminating authenticated session...", "info");
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
  } catch (err) {
    console.warn("Logout error:", err);
  }
  localStorage.removeItem('chanakya_user');
  localStorage.removeItem('chanakya_role');
  localStorage.removeItem('chanakya_session_token');
  setTimeout(() => {
    window.location.href = '/login?logged_out=1';
  }, 350);
}

function updateUserUI() {
  const user = appState.currentUser;
  if (!user) return;

  document.querySelectorAll('.role-indicator-name').forEach(el => el.textContent = user.name);
  document.querySelectorAll('.role-indicator-label').forEach(el => el.textContent = user.roleLabel || user.role);
  document.querySelectorAll('.role-indicator-avatar').forEach(el => el.textContent = user.avatar || '🎓');
  document.querySelectorAll('.role-indicator-dept').forEach(el => el.textContent = user.dept || user.department_name || '');

  // Update 3D Digital Student ID Card on Command Center Tab
  const cardName = document.querySelector('#student-id-card h3');
  if (cardName && user.name) cardName.textContent = user.name;

  const cardId = document.querySelector('#student-id-card span.font-mono');
  if (cardId && (user.roll_number || user.student_or_employee_id)) {
    cardId.textContent = \`ID: \${user.roll_number || user.student_or_employee_id}\`;
  }

  const cardDept = document.querySelectorAll('#student-id-card span.text-slate-300')[0];
  if (cardDept && (user.dept || user.department_name)) cardDept.textContent = user.dept || user.department_name;

  const cardInitials = document.querySelector('#student-id-card .rounded-2xl.bg-gradient-to-tr');
  if (cardInitials && user.name) {
    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    cardInitials.textContent = initials;
  }
}

async function initAuthSession() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.user) {
        const u = data.user;
        const role = (u.role || 'student').toLowerCase();
        const avatarMap = {
          admin: '👑',
          faculty: '👨‍🏫',
          staff: '🛠️',
          student: '🎓',
          fresher: '🧭',
          new_student: '🧭',
          visitor: '🚶'
        };
        const roleLabelMap = {
          admin: 'Administrator / Dean',
          faculty: 'Faculty Member',
          staff: 'Campus Staff & Operations',
          student: 'Student',
          fresher: 'Fresher / New Student',
          visitor: 'Campus Visitor'
        };

        appState.currentUser = {
          id: u.user_id,
          name: u.full_name,
          email: u.email,
          role: role,
          roleLabel: roleLabelMap[role] || role.toUpperCase(),
          dept: u.department || 'School of Engineering & Tech',
          school: u.department || 'Engineering',
          roll_number: u.student_or_employee_id || 'CU-2026-001',
          student_or_employee_id: u.student_or_employee_id,
          academic_year: u.academic_year || 'Year 1',
          avatar: avatarMap[role] || '🎓',
          points: 120
        };
        appState.currentRole = role;

        localStorage.setItem('chanakya_user', JSON.stringify(appState.currentUser));
        localStorage.setItem('chanakya_role', role);

        // Update top-right role display and lock it
        const roleSel = document.getElementById('role-selector');
        if (roleSel) {
          roleSel.innerHTML = \`<option value="\${role}" selected>\${appState.currentUser.avatar} \${appState.currentUser.name} (\${appState.currentUser.roleLabel})</option>\`;
          roleSel.disabled = true;
          roleSel.title = \`Authenticated as \${appState.currentUser.name} (\${appState.currentUser.roleLabel})\`;
        }

        // Hide admin simulation elements for non-admin users
        document.querySelectorAll('.admin-only-feature').forEach(el => {
          el.style.display = (role === 'admin') ? '' : 'none';
        });

        updateUserUI();
        adaptRoleViews();
        return;
      }
    } else if (res.status === 401) {
      localStorage.removeItem('chanakya_user');
      localStorage.removeItem('chanakya_role');
      const pathname = window.location.pathname;
      const isProtected = pathname.includes('dashboard') ||
                          pathname.includes('admin') ||
                          pathname === '/' ||
                          pathname.endsWith('index.html');
      if (isProtected) {
        window.location.href = '/login?reason=auth_required';
      }
    }
  } catch (e) {
    console.warn("Backend auth check error:", e);
  }
}`;

if (targetPattern.test(content)) {
  content = content.replace(targetPattern, replacement);
  fs.writeFileSync(appJsPath, content, 'utf8');
  console.log("Successfully patched public/js/app.js auth handlers!");
} else {
  console.error("Pattern match failed in public/js/app.js!");
  process.exit(1);
}
