require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const dbAdapter = require('./config/database');
const relationalStore = require('./data/relationalStore');
const store = require('./data/store');
const authStore = require('./data/authStore');
const authService = require('./services/authService');
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
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize persistent database stores
authStore.init();
relationalStore.init();

// API Routes
app.use('/api', apiRoutes);

// Protected Page Authentication Helpers
async function requirePageAuth(req, res, next) {
  const sessionInfo = await authService.validateSession(req);
  if (!sessionInfo.authenticated) {
    const originalUrl = encodeURIComponent(req.originalUrl || '/dashboard');
    return res.redirect(`/login?redirect=${originalUrl}&reason=auth_required`);
  }
  req.user = sessionInfo.user;
  req.session = sessionInfo.session;
  next();
}

function requirePageRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = (req.user && req.user.role || '').toLowerCase();
    if (!allowedRoles.includes(role)) {
      return res.status(403).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>403 Forbidden • Access Denied</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4 font-sans">
          <div class="max-w-md w-full bg-slate-900 border border-rose-500/30 p-8 rounded-3xl text-center shadow-2xl space-y-4">
            <div class="w-16 h-16 bg-rose-500/20 text-rose-400 text-3xl flex items-center justify-center rounded-2xl mx-auto border border-rose-500/40">🚫</div>
            <h1 class="text-xl font-black text-rose-400">403 Forbidden: Access Denied</h1>
            <p class="text-xs text-slate-400">This management module requires <b>[${allowedRoles.join(', ')}]</b> permissions. Your current account role is <b>'${role}'</b>.</p>
            <div class="pt-4 flex gap-3 justify-center">
              <a href="/dashboard" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition">Return to Dashboard</a>
              <a href="/logout" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">Sign Out</a>
            </div>
          </div>
        </body>
        </html>
      `);
    }
    next();
  };
}

// Protected Administrative Pages
app.get(['/admin-portal', '/admin.html', '/operations-portal'], requirePageAuth, requirePageRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Protected Campus Dashboard Pages
app.get(['/dashboard', '/dashboard.html', '/campus'], requirePageAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get(['/certificates', '/vault'], requirePageAuth, (req, res) => {
  res.redirect('/dashboard?tab=certificates');
});

app.get(['/utsavhub', '/events-hub'], requirePageAuth, (req, res) => {
  res.redirect('/dashboard?tab=utsavhub');
});

// Authentication Pages
app.get(['/login', '/login.html', '/signin', '/auth'], async (req, res) => {
  const sessionInfo = await authService.validateSession(req);
  if (sessionInfo.authenticated) {
    return res.redirect(sessionInfo.user.role === 'admin' ? '/admin-portal' : '/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get(['/reset-password', '/reset-password.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

app.get('/logout', (req, res) => {
  const token = authService.extractToken(req);
  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.session_id) {
        authService.logout(decoded.session_id);
      }
    } catch (e) {}
  }
  res.clearCookie('chanakya_session', { path: '/' });
  res.redirect('/login?logged_out=1');
});

// Role-specific shortcuts
app.get('/student', (req, res) => {
  res.redirect('/dashboard');
});

app.get('/faculty', (req, res) => {
  res.redirect('/dashboard');
});

app.get(['/admin', '/operations'], (req, res) => {
  res.redirect('/admin-portal');
});

// Public Showcase Pages
app.get('/certificate.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'certificate.html'));
});

app.get('/chanakya', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chanakya.html'));
});

app.get(['/grafana', '/grafana.html', '/observability'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'grafana.html'));
});

app.get('/nexeus', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'nexeus.html'));
});

// Serve static frontend assets (excluding index/dashboard auto-serving)
app.use(express.static(path.join(__dirname, 'public'), {
  index: false
}));

// Main University Entry Point / Landing Gateway
app.get('/', async (req, res) => {
  const sessionInfo = await authService.validateSession(req);
  if (sessionInfo.authenticated) {
    return res.redirect(sessionInfo.user && sessionInfo.user.role === 'admin' ? '/admin-portal' : '/dashboard');
  }
  res.redirect('/login');
});

// Catch-all route to guard protected views
app.get('*', async (req, res) => {
  const sessionInfo = await authService.validateSession(req);
  if (sessionInfo.authenticated) {
    return res.redirect(sessionInfo.user && sessionInfo.user.role === 'admin' ? '/admin-portal' : '/dashboard');
  }
  res.redirect('/login');
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
  console.log('🗄️  Database Engine: ' + dbStatus.mode.toUpperCase());
  console.log('📊 Loaded Records:  ' + overview.totalRegistrations + ' Registrations, ' + overview.totalEvents + ' Fests, ' + overview.totalSubEvents + ' Sub-Events');
  if (dbStatus.blocker) {
    console.log('⚠️  Cloud Notice:   ' + dbStatus.blocker);
  }
  console.log('====================================================');

  try {
    const grafanaServer = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(path.join(__dirname, 'public', 'grafana.html')).pipe(res);
    });
    grafanaServer.listen(3001, () => {
      console.log('📈 [Grafana v10.4.1 Console] Standalone Live at http://localhost:3001');
    }).on('error', (err) => {
      console.log('ℹ️  Port 3001 note: ' + err.message + ' (Accessible via /grafana)');
    });
  } catch (e) {}

  try {
    const port80Server = http.createServer(app);
    port80Server.listen(80, () => {
      console.log('🌐 [HTTP Port 80] Direct http://localhost access enabled (no port number needed)!');
    }).on('error', (err) => {
      console.log('ℹ️  Port 80 note: ' + err.message);
    });
  } catch (e) {}
});
