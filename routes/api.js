const express = require('express');
const router = express.Router();

const campusConfig = require('../config/campusConfig');
const store = require('../data/store');
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


// 0. Authentication & Credentials Service
const DEMO_CREDENTIALS = {
  student: { email: 'student@chanakya.edu', pass: 'student123', name: 'Rahul Sharma', role: 'student', dept: 'CS & AI (Yr 3)', avatar: '🎓' },
  new_student: { email: 'fresher@chanakya.edu', pass: 'fresher123', name: 'Ananya Iyer', role: 'new_student', dept: "B.Tech Batch '26", avatar: '🧭' },
  faculty: { email: 'faculty@chanakya.edu', pass: 'faculty123', name: 'Dr. S. Radhakrishnan', role: 'faculty', dept: 'School of AI & Robotics', avatar: '👨‍🏫' },
  staff: { email: 'staff@chanakya.edu', pass: 'staff123', name: 'Vikram Patil', role: 'staff', dept: 'Facilities & Ops', avatar: '🛠️' },
  admin: { email: 'admin@chanakya.edu', pass: 'admin123', name: 'Dean Office', role: 'admin', dept: 'Executive Office', avatar: '👑' },
  visitor: { email: 'visitor@chanakya.edu', pass: 'guest123', name: 'Priya Nair', role: 'visitor', dept: 'Campus Guest', avatar: '🚶' }
};

router.post('/auth/login', (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (role && DEMO_CREDENTIALS[role]) {
      return res.json({ success: true, token: "token_" + role + "_" + Date.now(), user: DEMO_CREDENTIALS[role] });
    }
    const em = (email || '').toLowerCase().trim();
    const matched = Object.values(DEMO_CREDENTIALS).find(u => u.email.toLowerCase() === em && u.pass === password);
    if (matched) {
      return res.json({ success: true, token: "token_" + matched.role + "_" + Date.now(), user: matched });
    }
    if (email) {
      const custom = {
        email,
        name: email.split('@')[0].toUpperCase(),
        role: email.includes('admin') ? 'admin' : (email.includes('faculty') ? 'faculty' : 'student'),
        dept: 'Chanakya Campus',
        avatar: '👤'
      };
      return res.json({ success: true, token: "token_custom_" + Date.now(), user: custom });
    }
    res.status(401).json({ success: false, error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

router.get('/auth/credentials', (req, res) => {
  res.json({
    message: "Inbuilt credentials for development & testing. Replace with database/LDAP when ready.",
    accounts: Object.values(DEMO_CREDENTIALS).map(u => ({ role: u.role, email: u.email, name: u.name, defaultPassword: u.pass, dept: u.dept }))
  });
});

router.get('/auth/me', (req, res) => {
  const role = req.query.role || 'student';
  res.json(DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.student);
});

// 1. System Config & University Meta
router.get('/config', (req, res) => {
  res.json({
    university: campusConfig.university,
    mapCenter: campusConfig.mapCenter,
    landmarks: store.landmarks,
    roles: campusConfig.roles
  });
});

// 2. Events Service
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

// 3. Map & Navigation Service
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

// 4. Search Service
router.get('/search', (req, res) => {
  try {
    const results = searchService.search(req.query.q, req.query.category);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Facilities Service
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

// 6. Food & Sports Service
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

// 7. Issue Management Service
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

// 8. Notification Service
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

// 9. User & Role Service
router.get('/users/roles', (req, res) => {
  res.json(userService.getRoles());
});

router.get('/users/profiles', (req, res) => {
  res.json(userService.getMockProfiles());
});

// 10. Analytics & Reporting Service
router.get('/analytics', (req, res) => {
  try {
    res.json(analyticsService.getDashboardMetrics());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Simulation & What-If Service
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

// 12. Campus AI & Intelligence Guide
router.post(['/ai/query', '/ai/chat'], async (req, res) => {
  try {
    const { query, role, history } = req.body;
    const answer = await aiService.answerCampusQuery(query, role, history);
    res.json(answer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Custom Map Data Management
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

// Custom AI Guide Knowledge Management
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