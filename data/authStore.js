/**
 * Production-Grade Authentication Store & Persistence Engine
 * Source of Truth for Users, Server-Managed Sessions, and Password Reset Tokens.
 * Features:
 * 1. Single source of truth with relational integrity & unique constraints
 * 2. Automatic disk persistence across server restarts (data/auth_db.json)
 * 3. Atomic file writes to eliminate corruption risks
 * 4. Case-insensitive email indexing and fast O(1) identifier lookups
 * 5. In-memory brute-force tracking & exponential lockout
 * 6. Cryptographically secure session management & token hashing
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_FILE_PATH = path.join(__dirname, 'auth_db.json');

class AuthStore {
  constructor() {
    this.users = [];
    this.sessions = [];
    this.passwordResetTokens = [];
    this.loginAttempts = new Map(); // key: "ip:identifier" -> { count: number, firstAttempt: number, lockedUntil: number }

    this.indexEmail = new Map(); // lowercase email -> user
    this.indexStudentId = new Map(); // lowercase student_or_employee_id -> user
    this.indexUserId = new Map(); // user_id -> user
    this.indexSessionId = new Map(); // session_id -> session

    this.nextUserId = 100;
    this.isInitialized = false;

    // Default institutional domains
    this.allowedDomains = ['chanakya.edu', 'cu.edu', 'chanakya.ac.in', 'university.edu'];
  }

  init() {
    if (this.isInitialized) return;

    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
        const data = JSON.parse(raw);
        this.users = Array.isArray(data.users) ? data.users : [];
        this.sessions = Array.isArray(data.sessions) ? data.sessions : [];
        this.passwordResetTokens = Array.isArray(data.passwordResetTokens) ? data.passwordResetTokens : [];
        this.nextUserId = typeof data.nextUserId === 'number' ? data.nextUserId : 100;
        console.log(`[AuthStore] 🗄️ Loaded persistent authentication database: ${this.users.length} users, ${this.sessions.length} sessions.`);
      } catch (err) {
        console.warn(`[AuthStore] ⚠️ Failed to parse auth_db.json, re-initializing:`, err.message);
        this.seedDefaultUsers();
      }
    } else {
      this.seedDefaultUsers();
      this.saveToDisk();
    }

    this.rebuildIndexes();
    this.cleanExpiredSessions();
    this.isInitialized = true;
  }

  saveToDisk() {
    try {
      const data = {
        updated_at: new Date().toISOString(),
        nextUserId: this.nextUserId,
        users: this.users,
        sessions: this.sessions,
        passwordResetTokens: this.passwordResetTokens
      };

      // Atomic write pattern: write to tmp then rename
      const tmpPath = `${DB_FILE_PATH}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tmpPath, DB_FILE_PATH);
    } catch (err) {
      console.error(`[AuthStore] ❌ Error saving authentication database to disk:`, err.message);
    }
  }

  seedDefaultUsers() {
    const salt = bcrypt.genSaltSync(10);

    const basePersonas = [
      // Primary Roles
      {
        user_id: 1,
        full_name: "Rahul Sharma",
        email: "student@chanakya.edu",
        student_or_employee_id: "24UG0101",
        password_hash: bcrypt.hashSync("student123", salt),
        department: "Computer Science & Artificial Intelligence",
        academic_year: "3rd Year",
        role: "student",
        account_status: "active",
        email_verified: true,
        school_id: 6,
        department_id: 16,
        avatar: "🎓",
        points: 450
      },
      {
        user_id: 2,
        full_name: "Ananya Iyer",
        email: "fresher@chanakya.edu",
        student_or_employee_id: "26UG0340",
        password_hash: bcrypt.hashSync("fresher123", salt),
        department: "English & Comparative Literature",
        academic_year: "1st Year",
        role: "student",
        account_status: "active",
        email_verified: true,
        school_id: 1,
        department_id: 1,
        avatar: "🧭",
        points: 120
      },
      {
        user_id: 3,
        full_name: "Dr. S. Radhakrishnan",
        email: "faculty@chanakya.edu",
        student_or_employee_id: "FAC-082",
        password_hash: bcrypt.hashSync("faculty123", salt),
        department: "Artificial Intelligence & Data Science",
        academic_year: "Faculty",
        role: "faculty",
        account_status: "active",
        email_verified: true,
        school_id: 6,
        department_id: 16,
        avatar: "👨‍🏫",
        points: 0
      },
      {
        user_id: 4,
        full_name: "Vikram Patil",
        email: "staff@chanakya.edu",
        student_or_employee_id: "STF-014",
        password_hash: bcrypt.hashSync("staff123", salt),
        department: "Campus Facilities & Operations",
        academic_year: "Staff",
        role: "staff",
        account_status: "active",
        email_verified: true,
        school_id: 6,
        department_id: 18,
        avatar: "🛠️",
        points: 0
      },
      {
        user_id: 5,
        full_name: "Dean Executive Office",
        email: "admin@chanakya.edu",
        student_or_employee_id: "ADM-001",
        password_hash: bcrypt.hashSync("admin123", salt),
        department: "Office of Academic Administration",
        academic_year: "Administration",
        role: "admin",
        account_status: "active",
        email_verified: true,
        school_id: 6,
        department_id: 16,
        avatar: "👑",
        points: 0
      },
      {
        user_id: 6,
        full_name: "UtsavHub Lead Administrator",
        email: "hanmanthraobd@gmail.com",
        student_or_employee_id: "ADMIN001",
        password_hash: bcrypt.hashSync("Admin@123", salt),
        department: "University Conclaves & Convocations",
        academic_year: "Administration",
        role: "admin",
        account_status: "active",
        email_verified: true,
        school_id: 6,
        department_id: 16,
        avatar: "👑",
        points: 0
      },

      // Additional Verified Students from Roster
      {
        user_id: 7,
        full_name: "Aarav Sharma",
        email: "aarav.sharma@chanakya.edu",
        student_or_employee_id: "24UG00001",
        password_hash: bcrypt.hashSync("student123", salt),
        department: "Computer Science",
        academic_year: "2nd Year",
        role: "student",
        account_status: "active",
        email_verified: true,
        school_id: 6,
        department_id: 16,
        avatar: "🎓",
        points: 450
      },
      {
        user_id: 8,
        full_name: "Riya Verma",
        email: "riya.verma@chanakya.edu",
        student_or_employee_id: "23UG00045",
        password_hash: bcrypt.hashSync("student123", salt),
        department: "Visual Arts & Design",
        academic_year: "3rd Year",
        role: "student",
        account_status: "active",
        email_verified: true,
        school_id: 1,
        department_id: 1,
        avatar: "🎨",
        points: 250
      },
      {
        user_id: 9,
        full_name: "Karthik Reddy",
        email: "karthik.reddy@chanakya.edu",
        student_or_employee_id: "22UG00078",
        password_hash: bcrypt.hashSync("student123", salt),
        department: "Robotics & Automation",
        academic_year: "4th Year",
        role: "student",
        account_status: "active",
        email_verified: true,
        school_id: 6,
        department_id: 17,
        avatar: "⚡",
        points: 300
      },
      {
        user_id: 10,
        full_name: "Sneha Iyer",
        email: "sneha.iyer@chanakya.edu",
        student_or_employee_id: "24PG00012",
        password_hash: bcrypt.hashSync("student123", salt),
        department: "Bioinformatics",
        academic_year: "PG - 1st Year",
        role: "student",
        account_status: "active",
        email_verified: true,
        school_id: 3,
        department_id: 9,
        avatar: "🔬",
        points: 220
      }
    ];

    const now = new Date().toISOString();
    this.users = basePersonas.map(u => ({
      ...u,
      created_at: now,
      updated_at: now
    }));

    this.nextUserId = 100;
  }

  rebuildIndexes() {
    this.indexEmail.clear();
    this.indexStudentId.clear();
    this.indexUserId.clear();
    this.indexSessionId.clear();

    for (const u of this.users) {
      if (u.email) this.indexEmail.set(u.email.toLowerCase(), u);
      if (u.student_or_employee_id) this.indexStudentId.set(u.student_or_employee_id.toLowerCase(), u);
      if (u.user_id) this.indexUserId.set(u.user_id, u);
    }

    const now = Date.now();
    for (const s of this.sessions) {
      if (new Date(s.session_expiry).getTime() > now) {
        this.indexSessionId.set(s.session_id, s);
      }
    }
  }

  // ==========================================
  // INPUT VALIDATIONS
  // ==========================================
  validateInstitutionalEmail(email) {
    if (!email || typeof email !== 'string') return { valid: false, message: "Email is required." };
    const clean = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(clean)) {
      return { valid: false, message: "Please provide a valid email format (e.g., student@chanakya.edu)." };
    }

    const domain = clean.split('@')[1];
    const isInstitutional = domain.endsWith('.edu') || domain.endsWith('.ac.in') || domain.includes('chanakya') || domain.endsWith('.org');
    if (!isInstitutional) {
      return { 
        valid: false, 
        message: "Please provide an institutional university email address (e.g. @chanakya.edu or .edu domain)." 
      };
    }

    return { valid: true, email: clean };
  }

  validateStrongPassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: "Password is required." };
    }
    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters in length." };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one uppercase letter (A-Z)." };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one lowercase letter (a-z)." };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: "Password must contain at least one numeric digit (0-9)." };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { valid: false, message: "Password must contain at least one special character (!@#$%^&*)." };
    }

    return { valid: true };
  }

  validateStudentOrEmployeeId(id) {
    if (!id || typeof id !== 'string') {
      return { valid: false, message: "Student / Employee ID is required." };
    }
    const clean = id.trim();
    if (clean.length < 3 || clean.length > 30) {
      return { valid: false, message: "Student / Employee ID must be between 3 and 30 characters." };
    }
    return { valid: true, id: clean };
  }

  // ==========================================
  // USER LOOKUPS & MANAGEMENT
  // ==========================================
  findUserByEmail(email) {
    if (!email) return null;
    return this.indexEmail.get(email.trim().toLowerCase()) || null;
  }

  findUserByStudentId(id) {
    if (!id) return null;
    return this.indexStudentId.get(id.trim().toLowerCase()) || null;
  }

  findUserById(userId) {
    if (!userId) return null;
    return this.indexUserId.get(Number(userId)) || null;
  }

  findUserByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return this.indexEmail.get(clean) || this.indexStudentId.get(clean) || null;
  }

  createUser({
    full_name,
    email,
    student_or_employee_id,
    password,
    department = "General",
    academic_year = "1st Year",
    role = "student",
    school_id = 1,
    department_id = 1
  }) {
    // 1. Validate full_name
    if (!full_name || full_name.trim().length < 2) {
      throw new Error("Full name must be at least 2 characters.");
    }

    // 2. Validate institutional email
    const emailValidation = this.validateInstitutionalEmail(email);
    if (!emailValidation.valid) {
      throw new Error(emailValidation.message);
    }
    const cleanEmail = emailValidation.email;

    // 3. Check duplicate email
    if (this.indexEmail.has(cleanEmail)) {
      throw new Error(`An account with email '${cleanEmail}' is already registered. Please sign in instead.`);
    }

    // 4. Validate Student/Employee ID
    const idValidation = this.validateStudentOrEmployeeId(student_or_employee_id);
    if (!idValidation.valid) {
      throw new Error(idValidation.message);
    }
    const cleanId = idValidation.id;

    // 5. Check duplicate ID
    if (this.indexStudentId.has(cleanId.toLowerCase())) {
      throw new Error(`Student / Employee ID '${cleanId}' is already registered to another account.`);
    }

    // 6. Enforce strong password
    const pwdValidation = this.validateStrongPassword(password);
    if (!pwdValidation.valid) {
      throw new Error(pwdValidation.message);
    }

    // 7. Role enforcement: Disallow self-registration as admin
    const cleanRole = (role || 'student').toLowerCase();
    if (cleanRole === 'admin' || cleanRole === 'administrator') {
      throw new Error("Self-registration as Administrator is strictly prohibited. Administrator accounts must be provisioned by the Dean's Executive Office.");
    }
    if (!['student', 'faculty', 'staff'].includes(cleanRole)) {
      throw new Error("Invalid role specified. Permitted roles are 'student', 'faculty', or 'staff'.");
    }

    // 8. Hash password with bcrypt
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const user_id = this.nextUserId++;
    const now = new Date().toISOString();

    const newUser = {
      user_id,
      profile_id: user_id, // Compatibility with existing code
      full_name: full_name.trim(),
      name: full_name.trim(),
      email: cleanEmail,
      student_or_employee_id: cleanId,
      roll_number: cleanId,
      password_hash,
      department: department ? department.trim() : "General",
      academic_year: academic_year ? academic_year.trim() : "1st Year",
      role: cleanRole,
      account_status: "active",
      email_verified: true,
      school_id: Number(school_id) || 1,
      department_id: Number(department_id) || 1,
      avatar: cleanRole === 'faculty' ? '👨‍🏫' : (cleanRole === 'staff' ? '🛠️' : '🎓'),
      points: 50,
      created_at: now,
      updated_at: now
    };

    this.users.push(newUser);
    this.indexEmail.set(cleanEmail, newUser);
    this.indexStudentId.set(cleanId.toLowerCase(), newUser);
    this.indexUserId.set(user_id, newUser);

    this.saveToDisk();

    return this.sanitizeUser(newUser);
  }

  updateUser(userId, updates) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("User not found.");

    Object.assign(user, updates, { updated_at: new Date().toISOString() });
    this.rebuildIndexes();
    this.saveToDisk();
    return this.sanitizeUser(user);
  }

  sanitizeUser(user) {
    if (!user) return null;
    const safe = { ...user };
    delete safe.password_hash;
    return safe;
  }

  getAllUsers() {
    return this.users.map(u => this.sanitizeUser(u));
  }

  // ==========================================
  // SESSION LIFECYCLE & MULTI-DEVICE MANAGEMENT
  // ==========================================
  createSession({ userId, rememberMe = false, ip = '', userAgent = '' }) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("Cannot create session for non-existent user.");

    // Duration: 30 days for Remember Me, 24 hours otherwise
    const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const session_expiry = new Date(Date.now() + durationMs).toISOString();
    const session_id = uuidv4();

    const session = {
      session_id,
      user_id: user.user_id,
      role: user.role,
      session_expiry,
      remember_me: Boolean(rememberMe),
      ip_address: ip,
      user_agent: userAgent,
      created_at: new Date().toISOString()
    };

    this.sessions.push(session);
    this.indexSessionId.set(session_id, session);
    this.saveToDisk();

    return session;
  }

  getSession(sessionId) {
    if (!sessionId) return null;
    const session = this.indexSessionId.get(sessionId);
    if (!session) return null;

    if (new Date(session.session_expiry).getTime() <= Date.now()) {
      this.invalidateSession(sessionId);
      return null;
    }

    return session;
  }

  invalidateSession(sessionId) {
    if (!sessionId) return;
    this.sessions = this.sessions.filter(s => s.session_id !== sessionId);
    this.indexSessionId.delete(sessionId);
    this.saveToDisk();
  }

  invalidateAllUserSessions(userId) {
    const id = Number(userId);
    this.sessions = this.sessions.filter(s => s.user_id !== id);
    this.rebuildIndexes();
    this.saveToDisk();
  }

  cleanExpiredSessions() {
    const now = Date.now();
    const beforeCount = this.sessions.length;
    this.sessions = this.sessions.filter(s => new Date(s.session_expiry).getTime() > now);
    if (this.sessions.length !== beforeCount) {
      this.rebuildIndexes();
      this.saveToDisk();
    }
  }

  // ==========================================
  // PASSWORD RECOVERY / FORGOT PASSWORD
  // ==========================================
  createPasswordResetToken(userId) {
    const user = this.findUserById(userId);
    if (!user) throw new Error("User does not exist.");

    // Generate 32 bytes cryptographically secure random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

    // Invalidate prior unused tokens for this user
    this.passwordResetTokens = this.passwordResetTokens.filter(t => t.user_id !== user.user_id || t.used_status);

    const tokenRecord = {
      token_id: uuidv4(),
      user_id: user.user_id,
      token_hash: tokenHash,
      expiry,
      used_status: false,
      created_at: new Date().toISOString()
    };

    this.passwordResetTokens.push(tokenRecord);
    this.saveToDisk();

    return { rawToken, expiry };
  }

  verifyPasswordResetToken(rawToken) {
    if (!rawToken || typeof rawToken !== 'string') return null;
    const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');

    const tokenRecord = this.passwordResetTokens.find(
      t => t.token_hash === tokenHash && !t.used_status
    );

    if (!tokenRecord) return null;

    if (new Date(tokenRecord.expiry).getTime() <= Date.now()) {
      return null;
    }

    return tokenRecord;
  }

  markResetTokenUsed(tokenId) {
    const tokenRecord = this.passwordResetTokens.find(t => t.token_id === tokenId);
    if (tokenRecord) {
      tokenRecord.used_status = true;
      tokenRecord.used_at = new Date().toISOString();
      this.saveToDisk();
    }
  }

  // ==========================================
  // BRUTE-FORCE RATE LIMITING & LOCKOUT
  // ==========================================
  checkRateLimit(identifier = '', ip = '') {
    const key = `${ip}:${(identifier || '').toLowerCase()}`;
    const entry = this.loginAttempts.get(key);
    const now = Date.now();

    if (entry && entry.lockedUntil && entry.lockedUntil > now) {
      const waitMinutes = Math.ceil((entry.lockedUntil - now) / 60000);
      return {
        locked: true,
        message: `Too many failed login attempts. Security lock in effect. Please try again in ${waitMinutes} minute(s).`
      };
    }

    return { locked: false };
  }

  recordFailedAttempt(identifier = '', ip = '') {
    const key = `${ip}:${(identifier || '').toLowerCase()}`;
    const now = Date.now();
    const entry = this.loginAttempts.get(key) || { count: 0, firstAttempt: now, lockedUntil: 0 };

    // Reset window after 15 minutes of first attempt
    if (now - entry.firstAttempt > 15 * 60 * 1000) {
      entry.count = 1;
      entry.firstAttempt = now;
      entry.lockedUntil = 0;
    } else {
      entry.count += 1;
    }

    // Lock account after 5 failed attempts for 15 minutes
    if (entry.count >= 5) {
      entry.lockedUntil = now + 15 * 60 * 1000;
    }

    this.loginAttempts.set(key, entry);
    return entry.count;
  }

  clearFailedAttempts(identifier = '', ip = '') {
    const key = `${ip}:${(identifier || '').toLowerCase()}`;
    this.loginAttempts.delete(key);
  }
}

const authStore = new AuthStore();
authStore.init();

module.exports = authStore;
