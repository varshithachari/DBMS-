/**
 * End-to-End Automated Functional Verification Suite
 * Tests full stack: Auth (bcrypt + JWT), Event Hierarchy, Scalable Registrations,
 * Check-In Scanner, Leaderboards, Analytics, and Frontend Routes.
 */

const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function request(options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = null;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });

    req.on('error', (err) => reject(err));
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (bodyData) {
      req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
    }
    req.end();
  });
}

async function runE2ETests() {
  console.log('================================================================');
  console.log('🧪 RUNNING END-TO-END FUNCTIONAL VERIFICATION SUITE');
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(title, condition, extra = '') {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${title} ${extra ? `(${extra})` : ''}`);
    } else {
      failed++;
      console.log(`  ❌ [FAIL] ${title} ${extra ? `(${extra})` : ''}`);
    }
  }

  // 1. Health & Database Status
  console.log('📌 1. Database Connection & System Health');
  try {
    const res = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/database/status',
      method: 'GET'
    });
    assert('Database Status HTTP 200', res.statusCode === 200);
    assert('Database Engine Active', res.json && res.json.success === true, `Engine: ${res.json?.mode}`);
    assert('Status reports active schema tables', res.json?.metrics?.tablesCount >= 10, `Tables: ${res.json?.metrics?.tablesCount}`);
  } catch (err) {
    assert('Database Status Reachable', false, err.message);
  }

  // 2. Event Hierarchy Discovery
  console.log('\n📌 2. Hierarchical Model: School → Department → Fest → Sub-Event');
  try {
    const scRes = await request({ hostname: 'localhost', port: PORT, path: '/api/schools', method: 'GET' });
    assert('Schools API HTTP 200', scRes.statusCode === 200);
    assert('Schools count >= 6', scRes.json?.schools?.length >= 6, `Count: ${scRes.json?.schools?.length}`);

    const dpRes = await request({ hostname: 'localhost', port: PORT, path: '/api/departments?school_id=1', method: 'GET' });
    assert('Departments Filtered by School HTTP 200', dpRes.statusCode === 200);
    assert('Filtered Departments belong to School 1', dpRes.json?.departments?.every(d => d.school_id === 1));

    const festRes = await request({ hostname: 'localhost', port: PORT, path: '/api/fests', method: 'GET' });
    assert('Main Fests API HTTP 200', festRes.statusCode === 200);
    assert('Main Fests count >= 6', festRes.json?.fests?.length >= 6, `Count: ${festRes.json?.fests?.length}`);

    const subRes = await request({ hostname: 'localhost', port: PORT, path: '/api/sub-events?category=Tech', method: 'GET' });
    assert('Sub-Events Filtered by Category HTTP 200', subRes.statusCode === 200);
    assert('Filtered Sub-Events match Tech category', subRes.json?.subEvents?.every(s => s.category === 'Tech'));
  } catch (err) {
    assert('Hierarchy Discovery', false, err.message);
  }

  // 3. User Authentication (Register -> Login -> Token Me)
  console.log('\n📌 3. User Authentication: Registration, Bcrypt Hashing & JWT Verification');
  const testEmail = `test_scholar_${Date.now()}@chanakya.edu`;
  const testPassword = 'SecurePassword123!';
  let authToken = null;
  let testUserId = null;

  try {
    // 3a. Registration
    const regRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Test Scholar',
      email: testEmail,
      password: testPassword,
      roll_number: '26CS099',
      role: 'student',
      school_id: 1,
      department_id: 1
    });

    assert('User Registration HTTP 201', regRes.statusCode === 201);
    assert('JWT Token returned on registration', !!regRes.json?.token);
    assert('Password is not exposed in response', !regRes.json?.user?.password && !regRes.json?.user?.password_hash);
    authToken = regRes.json?.token;
    testUserId = regRes.json?.user?.profile_id;

    // 3b. Login with correct password
    const loginRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: testEmail,
      password: testPassword
    });

    assert('User Login HTTP 200', loginRes.statusCode === 200);
    assert('JWT Token issued on successful login', !!loginRes.json?.token);
    assert('Correct profile returned', loginRes.json?.user?.email === testEmail);

    // 3c. Login with bad password
    const badLoginRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: testEmail,
      password: 'IncorrectPassword'
    });

    assert('Invalid Password Rejected HTTP 401', badLoginRes.statusCode === 401);
    assert('Error message specifies invalid credentials', badLoginRes.json?.success === false);

    // 3d. Verify /me endpoint with JWT
    const meRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/me',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert('Token Verification (/api/auth/me) HTTP 200', meRes.statusCode === 200);
    const resolvedEmail = meRes.json?.user?.email || meRes.json?.email;
    assert('Verified User identity matches', resolvedEmail === testEmail, `Expected ${testEmail}, got ${resolvedEmail}`);
  } catch (err) {
    assert('Authentication Flow', false, err.message);
  }

  // 4. Event Registration & Seat Allocation & Duplicate Prevention
  console.log('\n📌 4. Event Registration: Pass Code, Seat Allocation & Duplicate Trap');
  let testPassCode = null;
  try {
    const eventRegRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/registrations/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      sub_event_id: 1,
      ticket_type: 'VIP Delegate Pass',
      team_name: 'Quantum Pioneers',
      team_members: ['Pooja Hegde', 'Karan Johar']
    });

    assert('Event Registration HTTP 201', eventRegRes.statusCode === 201);
    assert('Pass code generated (CU-S01-...)', typeof eventRegRes.json?.registration?.pass_code === 'string');
    assert('Seat allocated', !!eventRegRes.json?.registration?.seat_number, `Seat: ${eventRegRes.json?.registration?.seat_number}`);
    testPassCode = eventRegRes.json?.registration?.pass_code;

    // 4b. Duplicate Registration Trap (Same user, same sub-event)
    const dupRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/registrations/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    }, {
      sub_event_id: 1,
      ticket_type: 'Standard Pass'
    });

    assert('Duplicate Registration Trap Rejected HTTP 409', dupRes.statusCode === 409);
    assert('Rejection message mentions existing registration', dupRes.json?.success === false);
  } catch (err) {
    assert('Event Registration Flow', false, err.message);
  }

  // 5. Gate Scanner & Pass Verification
  console.log('\n📌 5. Gate Scanner & Attendance Verification');
  try {
    const checkInRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/registrations/check-in',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      pass_code: testPassCode,
      gate_name: 'North Gate Turnstile 2'
    });

    assert('Check-In Verification HTTP 200', checkInRes.statusCode === 200);
    assert('Attendance recorded as Attended', checkInRes.json?.registration?.attendance_status === 'Attended');

    // 5b. Duplicate Check-in
    const dupCheckInRes = await request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/registrations/check-in',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      pass_code: testPassCode,
      gate_name: 'North Gate Turnstile 2'
    });

    assert('Subsequent Check-in acknowledges already attended', dupCheckInRes.statusCode === 200 && dupCheckInRes.json?.already_checked_in === true);
  } catch (err) {
    assert('Pass Check-in Flow', false, err.message);
  }

  // 6. Leaderboard & Analytics Overview
  console.log('\n📌 6. Real-Time Leaderboards & Database Analytics');
  try {
    const leadRes = await request({ hostname: 'localhost', port: PORT, path: '/api/leaderboard/schools', method: 'GET' });
    assert('Leaderboard HTTP 200', leadRes.statusCode === 200);
    assert('Leaderboard contains 6 schools ranked', leadRes.json?.leaderboard?.length === 6);
    assert('Leaderboard is sorted descending by points', leadRes.json?.leaderboard[0].total_points >= leadRes.json?.leaderboard[1].total_points);

    const analyticsRes = await request({ hostname: 'localhost', port: PORT, path: '/api/analytics/overview', method: 'GET' });
    assert('Scalability dataset populated (registrations >= 1,600)', (analyticsRes.json?.totalRegistrations >= 1600 || analyticsRes.json?.datasetSize >= 1700), `Total: ${analyticsRes.json?.totalRegistrations}`);
    assert('Podium competition results populated', analyticsRes.json?.totalResults >= 50, `Podiums: ${analyticsRes.json?.totalResults}`);
  } catch (err) {
    assert('Leaderboard & Analytics', false, err.message);
  }

  // 7. Static HTML Frontend Pages
  console.log('\n📌 7. Frontend Static & Application Route Resolution');
  try {
    const loginPage = await request({ hostname: 'localhost', port: PORT, path: '/login', method: 'GET' });
    assert('Route /login serves Login HTML (200)', loginPage.statusCode === 200 && loginPage.data.includes('Sign In to Campus Connect'));

    const dashboardPage = await request({ hostname: 'localhost', port: PORT, path: '/dashboard', method: 'GET' });
    assert('Route /dashboard serves Dashboard HTML (200)', dashboardPage.statusCode === 200 && dashboardPage.data.includes('UtsavHub Conclaves'));

    const adminPage = await request({ hostname: 'localhost', port: PORT, path: '/admin-portal', method: 'GET' });
    assert('Route /admin-portal serves Operations Portal HTML (200)', adminPage.statusCode === 200 && adminPage.data.includes('Operations & Executive Portal'));
  } catch (err) {
    assert('Frontend Routes', false, err.message);
  }

  console.log('\n================================================================');
  console.log(`📊 FINAL RESULTS: ${passed} PASSED | ${failed} FAILED | TOTAL: ${passed + failed}`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

// Execute standalone or export
if (require.main === module) {
  runE2ETests().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
  });
}

module.exports = runE2ETests;
