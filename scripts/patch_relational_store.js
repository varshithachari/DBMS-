const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'relationalStore.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add authStore import if not present
if (!content.includes("const authStore = require('./authStore');")) {
  content = content.replace(
    "const { v4: uuidv4 } = require('uuid');",
    "const { v4: uuidv4 } = require('uuid');\nconst authStore = require('./authStore');"
  );
}

// 2. Add syncWithAuthStore to init()
if (!content.includes("this.syncWithAuthStore();")) {
  content = content.replace(
    "this.seedBaseUtsavHubData();",
    "this.seedBaseUtsavHubData();\n    this.syncWithAuthStore();"
  );
}

// 3. Add syncWithAuthStore method
if (!content.includes("syncWithAuthStore() {")) {
  const syncMethod = `
  syncWithAuthStore() {
    for (const u of authStore.users) {
      const existing = this.userProfiles.find(p => p.profile_id === u.user_id || p.email.toLowerCase() === u.email.toLowerCase());
      if (!existing) {
        this.userProfiles.push({
          profile_id: u.user_id,
          auth_user_id: u.user_id,
          email: u.email,
          password_hash: u.password_hash,
          name: u.full_name || u.name,
          roll_number: u.student_or_employee_id || u.roll_number,
          role: u.role,
          school_id: u.school_id || 1,
          department_id: u.department_id || 1,
          avatar: u.avatar || '🎓',
          points: u.points || 50,
          created_at: u.created_at
        });
      } else {
        existing.password_hash = u.password_hash;
        existing.name = u.full_name || u.name;
        existing.roll_number = u.student_or_employee_id || u.roll_number;
        existing.role = u.role;
      }
    }
    this.indexUserProfileEmail.clear();
    for (const p of this.userProfiles) {
      this.indexUserProfileEmail.set(p.email.toLowerCase(), p);
    }
  }
`;
  content = content.replace(
    "init() {",
    syncMethod + "\n  init() {"
  );
}

// 4. Update registerUser to use authStore
const oldRegister = /registerUser\(\{[\s\S]*?return \{ token, user: safeUser \};\s*\}/;
const newRegister = `registerUser({ email, password, name, full_name, roll_number, student_or_employee_id, role = 'student', department, academic_year, school_id, department_id, participant_type = 'internal' }) {
    const user = authStore.createUser({
      full_name: full_name || name,
      email,
      student_or_employee_id: student_or_employee_id || roll_number,
      password,
      department,
      academic_year,
      role,
      school_id,
      department_id
    });

    this.syncWithAuthStore();

    const token = jwt.sign(
      { profile_id: user.user_id, user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  }`;

content = content.replace(oldRegister, newRegister);

// 5. Update verifyLogin to use authStore lookup
const oldLogin = /verifyLogin\(email, password\)\s*\{[\s\S]*?return \{ token, user: safeUser \};\s*\}/;
const newLogin = `verifyLogin(email, password) {
    if (!email || !password) throw new Error("Email and password are required.");
    const cleanEmail = email.trim().toLowerCase();

    const user = authStore.findUserByIdentifier(cleanEmail);
    if (!user) {
      throw new Error("Invalid email or password. Please verify your credentials.");
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid email or password. Please verify your credentials.");
    }

    const token = jwt.sign(
      { profile_id: user.user_id, user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = authStore.sanitizeUser(user);
    const school = this.schools.find(s => s.school_id === user.school_id);
    const dept = this.departments.find(d => d.department_id === user.department_id);
    safeUser.school_name = school ? school.name : "Chanakya Campus";
    safeUser.department_name = dept ? dept.name : (user.department || "General");

    return { token, user: safeUser };
  }`;

content = content.replace(oldLogin, newLogin);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ relationalStore.js successfully synchronized with authStore!');
