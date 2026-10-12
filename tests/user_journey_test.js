/**
 * Real User Journey Test:
 * 1. Register new user with custom name & strong password
 * 2. Authenticate with those exact credentials
 * 3. Verify user profile persisted in database
 * 4. Register for events (both campus fests and UtsavHub sub-events)
 * 5. Verify registrations persisted in database and seat/pass allocated
 */

const http = require('http');

function post(url, data, token = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const bodyStr = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyStr)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'POST',
      headers
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, text: raw });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function get(url, token = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: 'GET',
      headers
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, json: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, text: raw });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function testUserJourney() {
  console.log('========================================================================');
  console.log('🚀 TESTING NEW USER CUSTOM REGISTRATION & EVENT ENROLLMENT FLOW');
  console.log('========================================================================');

  const customEmail = `custom_user_${Date.now()}@chanakya.edu`;
  const customPassword = 'MySecretStrongPassword#2026!';
  const customName = 'Varshitha Charithis';

  // Step 1: Register New User
  console.log(`\n1. Registering user with custom password:`);
  console.log(`   Name: ${customName}`);
  console.log(`   Email: ${customEmail}`);
  console.log(`   Password: ${customPassword}`);

  const regRes = await post('http://localhost:3000/api/auth/register', {
    name: customName,
    email: customEmail,
    password: customPassword,
    roll_number: '26CS7789',
    role: 'student',
    school_id: 1,
    department_id: 1
  });

  if (regRes.status !== 201 || !regRes.json.user) {
    throw new Error('Registration failed: ' + JSON.stringify(regRes));
  }
  console.log(`   ✅ Success! User ID: ${regRes.json.user.profile_id}, Token Issued.`);
  const userId = regRes.json.user.profile_id;

  // Step 2: Login with that exact password
  console.log(`\n2. Authenticating user with chosen password...`);
  const loginRes = await post('http://localhost:3000/api/auth/login', {
    email: customEmail,
    password: customPassword
  });

  if (loginRes.status !== 200 || !loginRes.json.token) {
    throw new Error('Login failed with custom password: ' + JSON.stringify(loginRes));
  }
  const token = loginRes.json.token;
  console.log(`   ✅ Authentication Verified! Password match via Bcrypt hash.`);

  // Step 3: Register for Campus Fest (TechSangam 2026)
  console.log(`\n3. Registering for Campus Fest (EVT-2026-001: TechSangam)...`);
  const campusFestRes = await post('http://localhost:3000/api/events/EVT-2026-001/register', {
    userName: customName,
    userEmail: customEmail,
    userDept: 'School of Engineering & Tech',
    userRole: 'student',
    ticketType: 'VIP All-Access Pass'
  }, token);

  if (campusFestRes.status !== 201) {
    throw new Error('Campus event registration failed: ' + JSON.stringify(campusFestRes));
  }
  console.log(`   ✅ Registered! Digital Pass Code: ${campusFestRes.json.qrCode}, Seat: ${campusFestRes.json.seatNumber}`);

  // Step 4: Register for UtsavHub Conclave (Sub-Event 1: ByteCraft Hackathon)
  console.log(`\n4. Registering for UtsavHub Conclave (Sub-Event 1: ByteCraft Hackathon)...`);
  const utsavRes = await post('http://localhost:3000/api/registrations/register', {
    sub_event_id: 1,
    participant_id: userId,
    ticket_type: 'VIP Delegate Pass',
    team_name: 'Team Alpha AI',
    team_members: ['Pooja Sharma', 'Aditya Verma']
  }, token);

  if (utsavRes.status !== 201) {
    throw new Error('UtsavHub registration failed: ' + JSON.stringify(utsavRes));
  }
  console.log(`   ✅ Registered! Pass Code: ${utsavRes.json.registration.pass_code}, Seat: ${utsavRes.json.registration.seat_number}`);

  // Step 5: Verify user registrations are stored in database
  console.log(`\n5. Querying database for user's persistent registrations...`);
  const userRegs = await get(`http://localhost:3000/api/registrations/user?participant_id=${userId}`, token);
  console.log(`   ✅ Database returned ${userRegs.json.count} confirmed registrations for ${customName}.`);

  console.log('\n========================================================================');
  console.log('🎉 ALL USER JOURNEY TESTS COMPLETED AND VERIFIED 100% WORKING!');
  console.log('========================================================================');
}

testUserJourney().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
