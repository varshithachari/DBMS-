const express = require('express');
const router = express.Router();

const campusConfig = require('../config/campusConfig');
const store = require('../data/store');
const dbAdapter = require('../config/database');
const relationalStore = require('../data/relationalStore');
const authService = require('../services/authService');

const eventsService = require('../services/eventsService');
const mapService = require('../services/mapService');
const searchService = require('../services/searchService');
const facilitiesService = require('../services/facilitiesService');
const foodSportsService = require('../services/foodSportsService');
const issueService = require('../services/issueService');
const notificationService = require('../services/notificationService');
const userService = require('../services/userService');
const analyticsService = require('../services/analyticsService');
const simulationService = require('../services/simulationService');
const aiService = require('../services/aiService');


// ==========================================
// 0. DATABASE & SUPABASE CONNECTION STATUS
// ==========================================
router.get('/database/status', (req, res) => {
  try {
    const status = dbAdapter.getStatus();
    const overview = relationalStore.getAnalyticsOverview();
    res.json({
      success: true,
      ...status,
      metrics: {
        tablesCount: 12,
        ...overview
      },
      database_counts: overview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 1. REAL AUTHENTICATION & SESSIONS
// ==========================================
router.post('/auth/register', async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      token: result.token,
      user: result.user
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Direct role bypass for demo buttons if password omitted
    if (role && !password) {
      const demoEmails = {
        student: 'student@chanakya.edu',
        new_student: 'fresher@chanakya.edu',
        faculty: 'faculty@chanakya.edu',
        staff: 'staff@chanakya.edu',
        admin: 'admin@chanakya.edu',
        visitor: 'fresher@chanakya.edu'
      };
      const demoEmail = demoEmails[role] || 'student@chanakya.edu';
      const demoPass = role === 'admin' ? 'admin123' : (role === 'faculty' ? 'faculty123' : (role === 'staff' ? 'staff123' : (role === 'new_student' ? 'fresher123' : 'student123')));
      const result = await authService.login(demoEmail, demoPass);
      return res.json({ success: true, token: result.token, user: result.user });
    }

    const result = await authService.login(email, password);
    res.json({
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

router.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

router.get('/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    const user = relationalStore.verifyToken(token);
    if (user) {
      const school = relationalStore.schools.find(s => s.school_id === user.school_id);
      const dept = relationalStore.departments.find(d => d.department_id === user.department_id);
      const profile = {
        ...user,
        school_name: school ? school.name : "Chanakya Campus",
        department_name: dept ? dept.name : "General"
      };
      return res.json({
        success: true,
        user: profile,
        ...profile
      });
    }
  }

  // Fallback to demo user if role query provided
  const role = req.query.role || 'student';
  const fallback = relationalStore.userProfiles.find(u => u.role === role) || relationalStore.userProfiles[0];
  const safe = { ...fallback };
  delete safe.password_hash;
  res.json({
    success: true,
    user: safe,
    ...safe
  });
});

router.get('/auth/credentials', (req, res) => {
  res.json({
    message: "Pre-configured credentials in PostgreSQL / Relational Database (hashed with bcrypt):",
    accounts: [
      { role: 'student', email: 'student@chanakya.edu', defaultPassword: 'student123', name: 'Rahul Sharma', dept: 'CS & AI' },
      { role: 'new_student', email: 'fresher@chanakya.edu', defaultPassword: 'fresher123', name: 'Ananya Iyer', dept: 'Engineering' },
      { role: 'faculty', email: 'faculty@chanakya.edu', defaultPassword: 'faculty123', name: 'Dr. S. Radhakrishnan', dept: 'AI & Robotics' },
      { role: 'staff', email: 'staff@chanakya.edu', defaultPassword: 'staff123', name: 'Vikram Patil', dept: 'Facilities' },
      { role: 'admin', email: 'admin@chanakya.edu', defaultPassword: 'admin123', name: 'Dean Executive Office', dept: 'Administration' },
      { role: 'admin (utsavhub)', email: 'hanmanthraobd@gmail.com', defaultPassword: 'Admin@123', name: 'UtsavHub Lead Admin', dept: 'Administration' }
    ]
  });
});


// ==========================================
// 2. UTSAVHUB & CAMPUS HIERARCHY APIS
// ==========================================
// Schools
router.get('/schools', (req, res) => {
  try {
    const schools = relationalStore.getSchools();
    res.json({ count: schools.length, schools });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Departments
router.get('/departments', (req, res) => {
  try {
    const depts = relationalStore.getDepartments(req.query.school_id);
    res.json({ count: depts.length, departments: depts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fests / Main Events
router.get('/fests', (req, res) => {
  try {
    const fests = relationalStore.getMainEvents({
      school_id: req.query.school_id,
      category: req.query.category
    });
    res.json({ count: fests.length, fests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sub-Events
router.get('/sub-events', (req, res) => {
  try {
    const festId = req.query.fest_id;
    const filters = {
      category: req.query.category,
      type: req.query.type,
      search: req.query.search
    };
    const subEvents = relationalStore.getSubEvents(festId, filters);
    res.json({ count: subEvents.length, sub_events: subEvents, subEvents: subEvents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sub-events/:id', (req, res) => {
  try {
    const item = relationalStore.getSubEventById(req.params.id);
    if (!item) return res.status(404).json({ error: "Sub-event not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 3. REGISTRATIONS & DIGITAL PASSES
// ==========================================
// Create Registration (Solo or Team)
router.post('/registrations/register', (req, res) => {
  try {
    const { sub_event_id, participant_id, ticket_type, team_name, team_members } = req.body;

    if (!sub_event_id) {
      return res.status(400).json({ error: "sub_event_id is required." });
    }

    let pId = participant_id ? Number(participant_id) : null;
    if (!pId && req.headers['authorization']) {
      const token = req.headers['authorization'].split(' ')[1];
      const user = relationalStore.verifyToken(token);
      if (user) pId = user.profile_id;
    }
    if (!pId) {
      pId = 1; // Default to first student for quick testing
    }

    // Ensure participant profile exists in relationalStore
    const userExists = relationalStore.userProfiles.some(p => p.profile_id === pId);
    if (!userExists) {
      pId = 1; // Fallback to primary student profile
    }

    const reg = relationalStore.createRegistrationRecord(Number(sub_event_id), pId, {
      ticket_type: ticket_type || "Standard Delegate Pass",
      team_name,
      team_size: (team_members && Array.isArray(team_members)) ? team_members.length + 1 : 1,
      team_members: team_members || []
    });

    // Notify connected WebSockets
    store.emit('registration_created', {
      event: { title: reg.sub_event_name || `Sub-Event ${sub_event_id}` },
      regRecord: reg
    });

    res.status(201).json({
      success: true,
      message: `Registration confirmed! Your pass code is ${reg.registration_code}`,
      registration: reg
    });
  } catch (err) {
    const isConflict = err.message && (err.message.includes('already registered') || err.message.includes('duplicate'));
    res.status(isConflict ? 409 : 400).json({ success: false, error: err.message });
  }
});

// Paginated & Filterable Registrations Roster
router.get('/registrations', (req, res) => {
  try {
    const result = relationalStore.getRegistrationsPaginated({
      page: req.query.page,
      limit: req.query.limit,
      school_id: req.query.school_id,
      department_id: req.query.department_id,
      fest_id: req.query.fest_id,
      sub_event_id: req.query.sub_event_id,
      status: req.query.status,
      search: req.query.search,
      sort_by: req.query.sort_by || 'registered_at',
      sort_order: req.query.sort_order || 'desc'
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Current User's Registrations
router.get('/registrations/user', (req, res) => {
  try {
    let pId = req.query.participant_id;
    if (!pId && req.headers['authorization']) {
      const token = req.headers['authorization'].split(' ')[1];
      const user = relationalStore.verifyToken(token);
      if (user) pId = user.profile_id;
    }
    if (!pId) pId = 1;

    const regs = relationalStore.getUserRegistrations(pId);
    res.json({ count: regs.length, registrations: regs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Registration by Code
router.get('/registrations/code/:code', (req, res) => {
  try {
    const clean = req.params.code.trim().toUpperCase();
    const reg = relationalStore.registrations.find(r => r.registration_code === clean || r.registration_code.endsWith(clean));
    if (!reg) return res.status(404).json({ success: false, error: "Registration pass not found" });
    const s = relationalStore.subEvents.find(ev => ev.sub_event_id === reg.sub_event_id);
    const m = s ? relationalStore.mainEvents.find(ev => ev.main_event_id === s.main_event_id) : null;
    const cert = relationalStore.certificates.find(c => c.registration_id === reg.registration_id);
    res.json({
      success: true,
      registration: {
        ...reg,
        sub_event_name: s ? s.name : 'Event',
        fest_name: m ? m.name : 'Fest',
        certificate_code: cert ? cert.certificate_code : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Attendance Check-in via Code / QR
router.post('/registrations/check-in', (req, res) => {
  try {
    const code = req.body.code || req.body.pass_code || req.body.registration_code;
    const scanned_by = req.body.scanned_by || req.body.gate_name || "Gate Scanner";
    if (!code) return res.status(400).json({ error: "Registration pass code is required." });
    const result = relationalStore.checkInByCode(code, scanned_by);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// ==========================================
// 4. LEADERBOARDS & COMPETITION RESULTS
// ==========================================
router.get('/leaderboard/schools', (req, res) => {
  try {
    const leaderboard = relationalStore.getSchoolLeaderboard();
    res.json({ count: leaderboard.length, leaderboard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/results', (req, res) => {
  try {
    let list = relationalStore.competitionResults;
    if (req.query.sub_event_id) {
      list = list.filter(r => r.sub_event_id === Number(req.query.sub_event_id));
    }
    res.json({ count: list.length, results: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/results', (req, res) => {
  try {
    const { sub_event_id, participant_id, rank, prize_title, points } = req.body;
    const result = relationalStore.publishCompetitionResult(
      Number(sub_event_id),
      Number(participant_id),
      Number(rank),
      prize_title,
      Number(points) || 100
    );
    res.status(201).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 4. CERTIFICATES SUBSYSTEM
// ==========================================
router.get('/certificates', (req, res) => {
  try {
    const list = relationalStore.getCertificates().slice(0, 50);
    res.json({ success: true, count: list.length, certificates: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/certificates/user/:participantId', (req, res) => {
  try {
    const certs = relationalStore.getUserCertificates(req.params.participantId);
    res.json({ success: true, count: certs.length, certificates: certs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/certificates/verify/:code', (req, res) => {
  try {
    const cert = relationalStore.getCertificateByCode(req.params.code);
    if (!cert) {
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return res.redirect(`/certificate.html?code=${encodeURIComponent(req.params.code)}&error=not_found`);
      }
      return res.status(404).json({ verified: false, error: "Invalid certificate code" });
    }

    // If browser navigates here, display the beautiful visual certificate page!
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect(`/certificate.html?code=${encodeURIComponent(cert.certificate_code)}`);
    }

    res.json({ verified: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/certificates/:code', (req, res) => {
  try {
    const cert = relationalStore.getCertificateByCode(req.params.code);
    if (!cert) return res.status(404).json({ error: "Certificate not found" });
    res.json({
      success: true,
      certificate: cert,
      participant: { name: cert.participant_name, roll_number: cert.roll_number, school: cert.school_name },
      event: { name: cert.sub_event_name, category: cert.category, fest: cert.fest_name }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 5. REAL-TIME ANALYTICS & DASHBOARDS
// ==========================================
router.get('/analytics/overview', (req, res) => {
  try {
    const overview = relationalStore.getAnalyticsOverview();
    res.json(overview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/schools', (req, res) => {
  try {
    const schools = relationalStore.getSchoolAnalytics();
    res.json({ count: schools.length, schools });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/departments', (req, res) => {
  try {
    const departments = relationalStore.getDepartmentAnalytics();
    res.json({ count: departments.length, departments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/trends', (req, res) => {
  try {
    const trends = relationalStore.getRegistrationTrends();
    res.json({ count: trends.length, trends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/popularity', (req, res) => {
  try {
    const subEvents = relationalStore.getSubEvents();
    res.json({ count: subEvents.length, events: subEvents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 6. SCALABILITY DATASET CONTROLS & BENCHMARKS
// ==========================================
router.post('/scalability/generate', (req, res) => {
  try {
    const count = parseInt(req.body.count || req.query.count || 100, 10);
    const result = relationalStore.generateScalabilityDataset(count);
    res.json({ success: true, message: `Generated ${count} registrations per sub-event.`, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/scalability/reset', (req, res) => {
  try {
    const result = relationalStore.resetScalabilityDataset();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 7. ANNOUNCEMENTS
// ==========================================
router.get('/announcements', (req, res) => {
  try {
    const list = relationalStore.getAnnouncements();
    res.json({ count: list.length, announcements: list });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/announcements', (req, res) => {
  try {
    const ann = relationalStore.addAnnouncement(req.body);
    res.status(201).json({ success: true, announcement: ann });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ==========================================
// 8. PRESERVED CAMPUS CONNECT SERVICES
// ==========================================
// System Config
router.get('/config', (req, res) => {
  res.json({
    university: campusConfig.university,
    mapCenter: campusConfig.mapCenter,
    landmarks: store.landmarks,
    roles: campusConfig.roles
  });
});

// Original Events API (preserved for backward compatibility)
router.get('/events', (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status,
      search: req.query.search
    };
    const events = eventsService.getEvents(filters);
    res.json({ count: events.length, events });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/events/:id', (req, res) => {
  try {
    const event = eventsService.getEvent(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/events', (req, res) => {
  try {
    const newEvent = eventsService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/events/:id/approve', (req, res) => {
  try {
    const { stage, action, actor, notes } = req.body;
    const updated = eventsService.approveEvent(req.params.id, stage, action, actor, notes);
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/events/:id/register', (req, res) => {
  try {
    const regRecord = eventsService.registerUser(req.params.id, req.body);
    res.status(201).json(regRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/events/:id/registrations', (req, res) => {
  try {
    const regs = eventsService.getEventRegistrations(req.params.id);
    res.json({ count: regs.length, registrations: regs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Map & Navigation Service
router.get('/map', (req, res) => {
  try {
    const mapData = mapService.getCampusMapData();
    res.json(mapData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/map/route', (req, res) => {
  try {
    const { fromId, toId, from, to, mode } = req.query;
    const route = mapService.findRoute(fromId || from, toId || to, mode || 'pedestrian');
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/map/route', (req, res) => {
  try {
    const { fromId, toId, mode } = req.body;
    const route = mapService.findRoute(fromId, toId, mode || 'pedestrian');
    res.json(route);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/map/evacuate', (req, res) => {
  try {
    const { fromId } = req.body;
    const evac = mapService.getEmergencyEvacuation(fromId || 'grand_auditorium');
    res.json(evac);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search Service
router.get('/search', (req, res) => {
  try {
    const results = searchService.search(req.query.q, req.query.category);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Facilities Service
router.get('/facilities', (req, res) => {
  try {
    const facilities = facilitiesService.getAll();
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/facilities/:id/book', (req, res) => {
  try {
    const booked = facilitiesService.book(req.params.id, req.body);
    res.json(booked);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Food & Sports Service
router.get('/food-sports/food', (req, res) => {
  try {
    res.json(foodSportsService.getFoodOutlets());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/food-sports/order', (req, res) => {
  try {
    const { outletId, items, studentName } = req.body;
    const order = foodSportsService.simulateOrder(outletId, items, studentName);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/food-sports/sports', (req, res) => {
  try {
    res.json(foodSportsService.getSportsCourts());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/food-sports/sports/:id/book', (req, res) => {
  try {
    const { slotTime, userName } = req.body;
    const court = foodSportsService.bookCourt(req.params.id, slotTime, userName || 'Student');
    res.json(court);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Issue Management Service
router.get('/issues', (req, res) => {
  try {
    res.json(issueService.getIssues(req.query.status || 'all'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/issues', (req, res) => {
  try {
    const newIssue = issueService.report(req.body);
    res.status(201).json(newIssue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/issues/:id', (req, res) => {
  try {
    const { status, assignedTo, notes } = req.body;
    const updated = issueService.updateStatus(req.params.id, status, assignedTo, notes);
    if (!updated) return res.status(404).json({ error: "Issue not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Notification Service
router.get('/notifications', (req, res) => {
  try {
    res.json(notificationService.getNotifications(req.query.role || 'all'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notifications/broadcast', (req, res) => {
  try {
    const notif = notificationService.broadcast(req.body);
    res.status(201).json(notif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User & Role Service
router.get('/users/roles', (req, res) => {
  res.json(userService.getRoles());
});

router.get('/users/profiles', (req, res) => {
  res.json(userService.getMockProfiles());
});

// Analytics Service (Legacy)
router.get('/analytics', (req, res) => {
  try {
    res.json(analyticsService.getDashboardMetrics());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simulation Service
router.get('/simulation/scenarios', (req, res) => {
  try {
    res.json(simulationService.getScenarios());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/simulation/run', (req, res) => {
  try {
    const { scenarioId } = req.body;
    const result = simulationService.runScenario(scenarioId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/simulation/reset', (req, res) => {
  try {
    res.json(simulationService.resetSimulation());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/simulation/telemetry', (req, res) => {
  try {
    const feed = simulationService.feedLiveTelemetry(req.body);
    res.json(feed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Campus AI Guide
router.post(['/ai/query', '/ai/chat'], async (req, res) => {
  try {
    const { query, role, history } = req.body;
    const answer = await aiService.answerCampusQuery(query, role, history);
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Custom Map Nodes
router.get('/map/custom-nodes', (req, res) => {
  try {
    res.json(mapService.getCustomNodes());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/map/custom-nodes', (req, res) => {
  try {
    const node = mapService.addCustomNode(req.body);
    res.status(201).json(node);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// AI Guide Knowledge
router.get('/ai/knowledge', (req, res) => {
  try {
    res.json(aiService.getCustomKnowledge());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ai/feed', (req, res) => {
  try {
    const doc = aiService.feedKnowledge(req.body);
    res.status(201).json({
      success: true,
      message: "Knowledge fed to AI Guide successfully",
      document: doc
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;