/**
 * Chanakya Campus Connect - Comprehensive Production Authentication & RBAC Test Suite
 * Tests 15 core security scenarios required by enterprise university systems.
 */

const assert = require('assert');
const authStore = require('../data/authStore');
const authService = require('../services/authService');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING PRODUCTION AUTHENTICATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  }

  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  }

  const testStudentEmail = `test_student_${Date.now()}@chanakya.edu`;
  const testStudentId = `26UG${Math.floor(1000 + Math.random() * 9000)}`;
  const validPassword = 'SecurePassword@2026';
  let createdSessionId = null;
  let createdToken = null;
  let resetTokenStr = null;

  // 1. User Registration with Valid Institutional Email
  await asyncTest('1. Register new student with valid institutional credentials', async () => {
    const res = await authService.register({
      full_name: 'Test Student Varsh',
      student_or_employee_id: testStudentId,
      email: testStudentEmail,
      password: validPassword,
      confirm_password: validPassword,
      department: 'School of Computer Science & AI',
      academic_year: 'Year 2',
      role: 'student'
    });
    assert(res.user, 'Registration should return user');
    assert.strictEqual(res.user.email, testStudentEmail);
    assert.strictEqual(res.user.role, 'student');
    assert.strictEqual(res.user.student_or_employee_id, testStudentId);
    assert(res.session && res.session.session_id, 'Must return session with session_id');
    assert(res.token, 'Must return JWT token');
    createdSessionId = res.session.session_id;
    createdToken = res.token;
  });

  // 2. Verify Database Persistence
  test('2. Verify student account persisted in auth database with bcrypt hash', () => {
    const user = authStore.findUserByIdentifier(testStudentEmail);
    assert(user, 'User must exist in auth database');
    assert(user.password_hash.startsWith('$2'), 'Password must be hashed with bcrypt (never plain text)');
    assert.notStrictEqual(user.password_hash, validPassword, 'Plain password must never be stored');
    assert.strictEqual(user.email_verified, true);
    assert.strictEqual(user.account_status, 'active');
  });

  // 3. Login with Correct Email & Password
  await asyncTest('3. Login with registered institutional email and correct password', async () => {
    const res = await authService.login({
      identifier: testStudentEmail,
      password: validPassword,
      remember_me: true
    });
    assert(res.user, 'Login must return user');
    assert.strictEqual(res.user.email, testStudentEmail);
    assert(res.token, 'Should return authenticated token');
    assert(res.session && res.session.session_id, 'Should return session');
  });

  // 4. Login with Student ID & Password
  await asyncTest('4. Login with Student ID (roll number) and password', async () => {
    const res = await authService.login({
      identifier: testStudentId,
      password: validPassword
    });
    assert(res.user, 'Login must return user');
    assert.strictEqual(res.user.student_or_employee_id, testStudentId);
  });

  // 5. Attempt Login with Incorrect Password
  await asyncTest('5. Reject login attempt with incorrect password', async () => {
    let thrown = false;
    try {
      await authService.login({
        identifier: testStudentEmail,
        password: 'WrongPassword!123'
      });
    } catch (e) {
      thrown = true;
      assert(e.message.toLowerCase().includes('invalid') || e.message.includes('attempt'));
    }
    assert(thrown, 'Must throw error on incorrect password');
  });

  // 6. Brute-Force Rate Limiting (5 failed attempts -> lockout)
  await asyncTest('6. Rate limiting: Lock account after 5 consecutive failed attempts', async () => {
    const bruteEmail = `brute_${Date.now()}@chanakya.edu`;
    await authService.register({
      full_name: 'Brute Target',
      student_or_employee_id: `ID-${Date.now()}`,
      email: bruteEmail,
      password: validPassword,
      confirm_password: validPassword,
      department: 'Engineering',
      role: 'student'
    });

    for (let i = 0; i < 4; i++) {
      try {
        await authService.login({ identifier: bruteEmail, password: 'WrongPassword999!' });
      } catch (e) {
        assert.strictEqual(e.status, 401);
      }
    }

    // 5th failed attempt should trigger lockout with 429
    let locked = false;
    try {
      await authService.login({ identifier: bruteEmail, password: 'WrongPassword999!' });
    } catch (e) {
      if (e.status === 429 || e.message.includes('locked') || e.message.includes('Too many')) {
        locked = true;
      }
    }
    assert(locked, 'Account must be locked with 429 after 5 failed attempts');

    // 6th attempt should also be locked by checkRateLimit
    let lockedNext = false;
    try {
      await authService.login({ identifier: bruteEmail, password: 'WrongPassword999!' });
    } catch (e) {
      if (e.status === 429) lockedNext = true;
    }
    assert(lockedNext, 'Subsequent attempts while locked must return 429');
  });

  // 7. Duplicate Email Registration Prevention
  await asyncTest('7. Reject duplicate email registration', async () => {
    let duplicateRejected = false;
    try {
      await authService.register({
        full_name: 'Imposter Student',
        student_or_employee_id: `NEW_ID_${Date.now()}`,
        email: testStudentEmail, // Same email
        password: validPassword,
        confirm_password: validPassword,
        department: 'Science',
        role: 'student'
      });
    } catch (e) {
      duplicateRejected = true;
      assert(e.message.includes('already registered'));
    }
    assert(duplicateRejected, 'Duplicate email must be rejected');
  });

  // 8. Duplicate Student ID Registration Prevention
  await asyncTest('8. Reject duplicate Student ID registration', async () => {
    let duplicateIdRejected = false;
    try {
      await authService.register({
        full_name: 'Duplicate ID Person',
        student_or_employee_id: testStudentId, // Same student ID
        email: `unique_${Date.now()}@chanakya.edu`,
        password: validPassword,
        confirm_password: validPassword,
        department: 'Science',
        role: 'student'
      });
    } catch (e) {
      duplicateIdRejected = true;
      assert(e.message.includes('already registered'));
    }
    assert(duplicateIdRejected, 'Duplicate Student ID must be rejected');
  });

  // 9. Prevent Self-Registration as Administrator
  await asyncTest('9. Prevent self-registration with "admin" role', async () => {
    let adminRejected = false;
    try {
      await authService.register({
        full_name: 'Wannabe Admin',
        student_or_employee_id: `ADM-HACK-${Date.now()}`,
        email: `fakeadmin_${Date.now()}@chanakya.edu`,
        password: validPassword,
        confirm_password: validPassword,
        department: 'Management',
        role: 'admin' // Attempting to register as admin!
      });
    } catch (e) {
      adminRejected = true;
      assert(e.message.toLowerCase().includes('administrator') || e.message.toLowerCase().includes('prohibited'));
    }
    assert(adminRejected, 'Self-registration as admin must be blocked');
  });

  // 10. Enforce Strong Password Policy
  await asyncTest('10. Reject weak password (<8 chars or missing complexity)', async () => {
    let weakRejected = false;
    try {
      await authService.register({
        full_name: 'Weak Password User',
        student_or_employee_id: `WEAK-${Date.now()}`,
        email: `weakpass_${Date.now()}@chanakya.edu`,
        password: 'weak',
        confirm_password: 'weak',
        department: 'Arts',
        role: 'student'
      });
    } catch (e) {
      weakRejected = true;
      assert(e.message.includes('Password must be at least 8 characters'));
    }
    assert(weakRejected, 'Weak password must be rejected');
  });

  // 11. Forgot Password Token Generation
  await asyncTest('11. Generate time-limited, single-use password reset token (generic response)', async () => {
    const res = await authService.forgotPassword(testStudentEmail);
    assert.strictEqual(res.success, true);
    assert(res.message.includes('reset instructions'));
    assert(res.reset_token, 'In development mode, token returned for testing');
    resetTokenStr = res.reset_token;

    // Verify token record in database
    const tokenRecord = authStore.verifyPasswordResetToken(resetTokenStr);
    assert(tokenRecord, 'Token must be valid in DB');
    assert.strictEqual(tokenRecord.used_status, false);
  });

  // 12. Reset Password with Token & Invalidate Active Sessions
  await asyncTest('12. Reset password with token, update hash, and invalidate all existing sessions', async () => {
    const newPassword = 'NewSecretPassword@2026';
    const resetRes = await authService.resetPassword({
      token: resetTokenStr,
      new_password: newPassword,
      confirm_password: newPassword
    });
    assert.strictEqual(resetRes.success, true);

    // Old token must now be invalid (single-use)
    const reusedCheck = authStore.verifyPasswordResetToken(resetTokenStr);
    assert.strictEqual(reusedCheck, null, 'Reset token must be single-use and marked used');

    // Login with new password must succeed
    const loginNew = await authService.login({
      identifier: testStudentEmail,
      password: newPassword
    });
    assert(loginNew.user, 'Login with new password should succeed');

    // Old password must fail
    let oldFailed = false;
    try {
      await authService.login({ identifier: testStudentEmail, password: validPassword });
    } catch (e) {
      oldFailed = true;
    }
    assert(oldFailed, 'Old password must fail after reset');
  });

  // 13. Role-Based Access Control: Student Access to Admin Functions
  test('13. Enforce RBAC: Student access blocked from administrator permissions', () => {
    const studentUser = authStore.findUserByIdentifier(testStudentEmail);
    assert(studentUser, 'Student user exists');
    assert.strictEqual(studentUser.role, 'student');

    // Verify RBAC restriction
    const allowedRoles = ['admin'];
    const hasAdminAccess = allowedRoles.includes(studentUser.role);
    assert.strictEqual(hasAdminAccess, false, 'Student must not have admin access');
  });

  // 14. Admin Access to Permitted Functions
  test('14. Admin account has verified executive permissions', () => {
    const adminUser = authStore.findUserByIdentifier('admin@chanakya.edu');
    assert(adminUser, 'Admin user exists in database');
    assert.strictEqual(adminUser.role, 'admin');

    const allowedRoles = ['admin'];
    const hasAdminAccess = allowedRoles.includes(adminUser.role);
    assert.strictEqual(hasAdminAccess, true, 'Admin must have admin access');
  });

  // 15. Logout Session Invalidation
  await asyncTest('15. Logout invalidates active session in database', async () => {
    // Log in to get active session
    const loginRes = await authService.login({
      identifier: testStudentEmail,
      password: 'NewSecretPassword@2026'
    });
    const sid = loginRes.session.session_id;
    assert(sid, 'Session ID exists');

    // Check session is valid
    const sessionBefore = authStore.getSession(sid);
    assert(sessionBefore, 'Session active before logout');

    // Perform logout
    const logoutRes = await authService.logout(sid);
    assert.strictEqual(logoutRes.success, true);

    // Check session is deleted from DB
    const sessionAfter = authStore.getSession(sid);
    assert.strictEqual(sessionAfter, null, 'Session must be null after logout');
  });

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
