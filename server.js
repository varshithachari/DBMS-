require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const dbAdapter = require('./config/database');
const relationalStore = require('./data/relationalStore');
const store = require('./data/store');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);


// Authentication Routes
app.get(['/login', '/signin', '/auth'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/logout', (req, res) => {
  res.redirect('/login?logged_out=1');
});

// Specific Dashboard & Landing Routes
app.get(['/dashboard', '/campus'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/nexeus', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'nexeus.html'));
});

app.get('/chanakya', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chanakya.html'));
});

app.get('/student', (req, res) => {
  res.redirect('/dashboard?role=student');
});

app.get('/faculty', (req, res) => {
  res.redirect('/dashboard?role=faculty');
});

app.get(['/admin', '/operations'], (req, res) => {
  res.redirect('/dashboard?role=admin');
});

app.get(['/admin-portal', '/operations-portal'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Catch-all route to serve Main Landing / Index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Real-Time Event & WebSockets Bridge
io.on('connection', (socket) => {
  console.log('[Socket] Client connected:', socket.id);

  // Send initial handshake state
  socket.emit('init_sync', {
    message: "Connected to Chanakya Campus Connect Real-Time Stream",
    timestamp: new Date().toISOString()
  });

  socket.on('disconnect', () => {
    console.log('[Socket] Client disconnected:', socket.id);
  });
});

// Bridge internal EventEmitter to all connected Socket.io clients
store.on('event_created', (evt) => {
  io.emit('event_created', evt);
});

store.on('event_approval_updated', (payload) => {
  io.emit('event_approval_updated', payload);
});

store.on('registration_created', (payload) => {
  io.emit('registration_created', payload);
});

store.on('notification_broadcast', (notif) => {
  io.emit('notification_broadcast', notif);
});

store.on('issue_reported', (issue) => {
  io.emit('issue_reported', issue);
});

store.on('issue_updated', (issue) => {
  io.emit('issue_updated', issue);
});

store.on('facility_booked', (payload) => {
  io.emit('facility_booked', payload);
});

store.on('sports_slot_booked', (payload) => {
  io.emit('sports_slot_booked', payload);
});

store.on('simulation_executed', (simResult) => {
  io.emit('simulation_executed', simResult);
});

store.on('telemetry_tick', (telemetry) => {
  io.emit('telemetry_tick', telemetry);
});

// Periodic synthetic crowd telemetry pulse (every 8 seconds)
setInterval(() => {
  const delta = Math.floor(Math.random() * 7) - 3;
  const currentPop = Math.max(3800, Math.min(5200, store.campusStats.activeCampusPopulation + delta));
  store.campusStats.activeCampusPopulation = currentPop;

  io.emit('telemetry_pulse', {
    timestamp: new Date().toISOString(),
    activePopulation: currentPop,
    avgWaitTimeMins: 10 + Math.floor(Math.random() * 4),
    activeSensors: 48,
    gateThroughput: 140 + Math.floor(Math.random() * 30)
  });
}, 8000);

server.listen(PORT, () => {
  const dbStatus = dbAdapter.getStatus();
  const overview = relationalStore.getAnalyticsOverview();
  console.log('====================================================');
  console.log('🎓 CHANAKYA CAMPUS CONNECT PLATFORM IS RUNNING');
  console.log('🌐 Local URL: http://localhost:' + PORT);
  console.log('📡 Real-time WebSockets & Telemetry: ACTIVE');
  console.log(`🗄️  Database Engine: ${dbStatus.mode.toUpperCase()}`);
  console.log(`📊 Loaded Records:  ${overview.totalRegistrations} Registrations, ${overview.totalEvents} Fests, ${overview.totalSubEvents} Sub-Events`);
  if (dbStatus.blocker) {
    console.log(`⚠️  Cloud Blocker:   ${dbStatus.blocker}`);
  }
  console.log('====================================================');
});