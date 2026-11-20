
// ============================================================================
// SCROLL TO DASHBOARD & TAB SWITCHER
// ============================================================================
function scrollToDashboard(tabId) {
  if (typeof sfx !== 'undefined' && sfx.play) {
    sfx.play('whoosh');
  }
  const el = document.getElementById('campus-dashboard');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  if (tabId && typeof switchTab === 'function') {
    setTimeout(() => {
      switchTab(tabId);
    }, 450);
  }
}

/**
 * CHANAKYA CAMPUS CONNECT - MASTER APPLICATION CORE
 * Architecture-Aligned Interactive & Animated Dashboard
 */

// ============================================================================
// 1. SOUND FX ENGINE (Web Audio API Synthesizer)
// ============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      const now = this.ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn("Audio synthesis unavailable:", e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sfx = new SoundFX();

// ============================================================================
// 2. BACKGROUND PARTICLE NETWORK
// ============================================================================
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.6 + 0.8;
      this.color = Math.random() > 0.6 ? '#F59E0B' : '#06B6D4';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================================================
// 3. APPLICATION STATE & RBAC DATA
// ============================================================================
const appState = {
  currentRole: 'student', // student | new_student | faculty | staff | visitor | admin
  currentUser: {
    name: "Rahul Sharma",
    email: "rahul.s@chanakyauniversity.edu.in",
    role: "student",
    roleLabel: "Student",
    dept: "Computer Science & AI (Year 3)",
    avatar: "🎓"
  },
  activeTab: 'overview',
  landmarks: [],
  events: [],
  facilities: [],
  foodOutlets: [],
  sportsCourts: [],
  issues: [],
  notifications: [],
  simulations: [],
  customMapNodes: [],
  customKnowledgeDocs: [],
  telemetry: {
    activePopulation: 4280,
    gateThroughput: 154,
    avgWaitTime: 11,
    activeSensors: 48
  },
  mapInstance: null,
  mapMarkers: {},
  routeLayer: null,
  soundMuted: false
};

const DEMO_USERS = {
  student: {
    name: "Rahul Sharma",
    email: "rahul.s@chanakyauniversity.edu.in",
    role: "student",
    roleLabel: "Student",
    dept: "Computer Science & AI (Year 3)",
    avatar: "🎓"
  },
  new_student: {
    name: "Ananya Iyer",
    email: "ananya.i@chanakyauniversity.edu.in",
    role: "new_student",
    roleLabel: "New Student / Fresher",
    dept: "B.Tech Batch 2026 (Orientation)",
    avatar: "🧭"
  },
  faculty: {
    name: "Dr. S. Radhakrishnan",
    email: "s.radhakrishnan@chanakyauniversity.edu.in",
    role: "faculty",
    roleLabel: "Faculty Member",
    dept: "School of AI, Robotics & Data Sciences",
    avatar: "👨‍🏫"
  },
  staff: {
    name: "Vikram Patil",
    email: "vikram.p@chanakyauniversity.edu.in",
    role: "staff",
    roleLabel: "Campus Staff & Operations",
    dept: "Estate Management & Asset Maintenance",
    avatar: "🛠️"
  },
  visitor: {
    name: "Priya Nair",
    email: "priya.nair@external.org",
    role: "visitor",
    roleLabel: "Visitor / Guest",
    dept: "National Tech Conclave Delegate",
    avatar: "🚶"
  },
  admin: {
    name: "Prof. M. K. Chanakya",
    email: "dean.academics@chanakyauniversity.edu.in",
    role: "admin",
    roleLabel: "Administrator / Dean",
    dept: "Office of the Dean & University Operations",
    avatar: "👑"
  }
};

// ============================================================================
// 4. REAL-TIME SOCKET.IO BRIDGE
// ============================================================================
let socket = null;

function initRealtimeSocket() {
  try {
    if (typeof io !== 'undefined') {
      socket = io();

      socket.on('connect', () => {
        console.log('[RealTime] Connected to Campus Connect Stream');
        updateLiveIndicator(true);
      });

      socket.on('disconnect', () => {
        console.log('[RealTime] Disconnected from stream');
        updateLiveIndicator(false);
      });

      socket.on('telemetry_pulse', (data) => {
        appState.telemetry.activePopulation = data.activePopulation;
        appState.telemetry.avgWaitTime = data.avgWaitTimeMins;
        appState.telemetry.gateThroughput = data.gateThroughput;
        updateTelemetryUI();
      });

      socket.on('notification_broadcast', (notif) => {
        appState.notifications.unshift(notif);
        renderNotifications();
        showToast(notif.title, notif.message, notif.type === 'emergency' ? 'alert' : 'info');
        sfx.play(notif.type === 'emergency' ? 'alert' : 'success');
      });

      socket.on('event_created', (evt) => {
        showToast("New Event Added", evt.title, 'info');
        loadEvents();
      });

      socket.on('issue_reported', (iss) => {
        showToast("Issue Reported", iss.title, 'alert');
        loadIssues();
      });
    }
  } catch (err) {
    console.warn("Socket.io initialization error:", err);
  }
}

function updateLiveIndicator(isOnline) {
  const badge = document.getElementById('socket-status-badge');
  const dot = document.getElementById('socket-status-dot');
  const text = document.getElementById('socket-status-text');
  if (!badge) return;

  if (isOnline) {
    dot.className = "w-2 h-2 rounded-full bg-emerald-400 animate-pulse";
    text.textContent = "LIVE STREAM ACTIVE";
    text.className = "text-[10px] font-bold text-emerald-400 font-mono tracking-wider";
  } else {
    dot.className = "w-2 h-2 rounded-full bg-rose-500";
    text.textContent = "STREAM OFFLINE";
    text.className = "text-[10px] font-bold text-rose-400 font-mono tracking-wider";
  }
}

function updateTelemetryUI() {
  const popEl = document.getElementById('telemetry-pop-count');
  const waitEl = document.getElementById('telemetry-wait-time');
  const tpEl = document.getElementById('telemetry-throughput');
  if (popEl) popEl.textContent = Number(appState.telemetry.activePopulation).toLocaleString();
  if (waitEl) waitEl.textContent = `${appState.telemetry.avgWaitTime}m`;
  if (tpEl) tpEl.textContent = `${appState.telemetry.gateThroughput}/m`;
}

// ============================================================================
// 5. TOAST NOTIFICATION DISPATCHER
// ============================================================================
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const borderCol = type === 'alert' ? 'border-rose-500/50 text-rose-300' :
                   type === 'success' ? 'border-emerald-500/50 text-emerald-300' :
                   'border-amber-500/50 text-amber-300';
  const bgCol = type === 'alert' ? 'bg-rose-950/90' :
                type === 'success' ? 'bg-emerald-950/90' :
                'bg-slate-900/90';
  const icon = type === 'alert' ? '⚠️' : type === 'success' ? '✅' : '🔔';

  toast.className = `toast-item flex items-start gap-3 p-4 rounded-2xl border ${borderCol} ${bgCol} backdrop-blur-xl shadow-2xl max-w-sm`;
  toast.innerHTML = `
    <span class="text-xl">${icon}</span>
    <div class="flex-1">
      <h4 class="text-xs font-black uppercase tracking-wider text-white">${escapeHtml(title)}</h4>
      <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">${escapeHtml(message)}</p>
    </div>
    <button class="text-slate-400 hover:text-white text-xs ml-2" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// ============================================================================
// 6. ROLE SWITCHING & AUTHENTICATION
// ============================================================================
function switchRole(roleKey) {
  if (roleKey === 'authenticated_user') {
    initAuthSession();
    return;
  }
  // Enforce RBAC: Non-admin cannot switch to admin
  if (roleKey === 'admin' && appState.currentUser && appState.currentUser.role !== 'admin') {
    showToast("Access Denied", "Administrator privilege requires verified credentials.", "error");
    if (typeof sfx !== 'undefined') sfx.play('error');
    return;
  }
  if (!DEMO_USERS[roleKey]) return;
  sfx.play('click');
  appState.currentRole = roleKey;
  appState.currentUser = { ...DEMO_USERS[roleKey] };

  // Update UI Elements for Role
  updateUserUI();

  // Update Active Role in Role Selector Buttons
  document.querySelectorAll('.role-select-btn').forEach(btn => {
    const r = btn.getAttribute('data-role');
    if (r === roleKey) {
      btn.className = "role-select-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5";
    } else {
      btn.className = "role-select-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5";
    }
  });

  // Adapt Dashboard Cards based on Role Access
  adaptRoleViews();

  showToast("Role Switched", `Active Persona: ${appState.currentUser.name} (${appState.currentUser.roleLabel})`, 'info');
}

function adaptRoleViews() {
  const role = appState.currentRole;
  const bannerEl = document.getElementById('role-welcome-banner');
  const studentSection = document.getElementById('role-section-student');
  const facultySection = document.getElementById('role-section-faculty');
  const adminSection = document.getElementById('role-section-admin');
  const newStudentSection = document.getElementById('role-section-newstudent');

  if (bannerEl) {
    if (role === 'student') {
      bannerEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl">🎓</div>
          <div>
            <span class="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">STUDENT DASHBOARD</span>
            <h2 class="text-xl font-extrabold text-white">Welcome back, ${appState.currentUser.name}!</h2>
            <p class="text-xs text-slate-300">You have 2 upcoming registrations. Canteen rush is low right now.</p>
          </div>
        </div>
      `;
    } else if (role === 'new_student') {
      bannerEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl">🧭</div>
          <div>
            <span class="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">NEW STUDENT / FRESHER INDUCTION</span>
            <h2 class="text-xl font-extrabold text-white">Welcome to Chanakya University, ${appState.currentUser.name}!</h2>
            <p class="text-xs text-slate-300">Explore the interactive campus guide, essential buildings, and hostel orientation points.</p>
          </div>
        </div>
      `;
    } else if (role === 'faculty') {
      bannerEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">👨‍🏫</div>
          <div>
            <span class="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">FACULTY & RESEARCH CONCLAVE</span>
            <h2 class="text-xl font-extrabold text-white">Good day, ${appState.currentUser.name}</h2>
            <p class="text-xs text-slate-300">Class schedule is synched. 1 seminar hall reservation pending your sign-off.</p>
          </div>
        </div>
      `;
    } else if (role === 'staff') {
      bannerEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">🛠️</div>
          <div>
            <span class="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">OPERATIONS & ASSET MAINTENANCE</span>
            <h2 class="text-xl font-extrabold text-white">Operations Desk: ${appState.currentUser.name}</h2>
            <p class="text-xs text-slate-300">5 active campus maintenance tickets in queue. ANPR Gate 1 operational.</p>
          </div>
        </div>
      `;
    } else if (role === 'visitor') {
      bannerEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-2xl">🚶</div>
          <div>
            <span class="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">GUEST & VISITOR PASS</span>
            <h2 class="text-xl font-extrabold text-white">Welcome, ${appState.currentUser.name}</h2>
            <p class="text-xs text-slate-300">Visitor Pass #CU-V-9942 verified. Shuttle buggy leaves Gate 1 every 10 min.</p>
          </div>
        </div>
      `;
    } else if (role === 'admin') {
      bannerEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-2xl">👑</div>
          <div>
            <span class="text-[10px] font-mono font-bold tracking-widest text-rose-400 uppercase">CAMPUS DIRECTORATE & DEAN'S OFFICE</span>
            <h2 class="text-xl font-extrabold text-white">Administrative Portal: ${appState.currentUser.name}</h2>
            <p class="text-xs text-slate-300">Full executive authority: Event approvals, What-If simulation engine, and emergency broadcasts.</p>
          </div>
        </div>
      `;
    }
  }

  // Toggle Visibility of special role action areas
  if (studentSection) studentSection.classList.toggle('hidden', role !== 'student' && role !== 'new_student');
  if (facultySection) facultySection.classList.toggle('hidden', role !== 'faculty' && role !== 'admin');
  if (adminSection) adminSection.classList.toggle('hidden', role !== 'admin');
  if (newStudentSection) newStudentSection.classList.toggle('hidden', role !== 'new_student');
}

// ============================================================================
// 7. TAB NAVIGATION
// ============================================================================
function switchTab(tabId) {
  sfx.play('whoosh');
  appState.activeTab = tabId;

  // Update Navigation buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    const t = btn.getAttribute('data-tab');
    if (t === tabId) {
      btn.className = "nav-tab-btn flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10 transition";
    } else {
      btn.className = "nav-tab-btn flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent transition";
    }
  });

  const targetTab = (tabId === 'grafana' || tabId === 'experiments') ? 'architecture' : tabId;

  // Switch Views
  document.querySelectorAll('.tab-view-container').forEach(view => {
    if (view.id === `tab-${targetTab}`) {
      view.classList.remove('hidden');
      view.classList.add('tab-content');
    } else {
      view.classList.add('hidden');
      view.classList.remove('tab-content');
    }
  });

  // Map Resize trigger if opening map tab
  if (tabId === 'map' && appState.mapInstance) {
    setTimeout(() => {
      appState.mapInstance.invalidateSize();
    }, 150);
  }

  // Draw Analytics Charts if opening analytics tab
  if (tabId === 'analytics') {
    setTimeout(() => {
      drawAnalyticsCharts();
    }, 150);
  }

  // Refresh Live Architecture Comparison Lab if opening architecture, experiments or grafana
  if (tabId === 'architecture' || tabId === 'experiments' || tabId === 'grafana') {
    setTimeout(() => {
      if (typeof initArchitectureLab === 'function') initArchitectureLab();
      if (typeof initGrafanaConsole === 'function') initGrafanaConsole();
      if (typeof renderAllGrafanaPanels === 'function') renderAllGrafanaPanels();
    }, 80);
    setTimeout(() => {
      if (typeof renderAllGrafanaPanels === 'function') renderAllGrafanaPanels();
    }, 280);
  }

  // Refresh Food & Sports when opening foodsports tab
  if (tabId === 'foodsports') {
    setTimeout(() => {
      if (typeof renderFoodOutlets === 'function') renderFoodOutlets();
      if (typeof renderSportsCourts === 'function') renderSportsCourts();
    }, 50);
  }

  // Refresh UtsavHub data when opening utsavhub tab
  if (tabId === 'utsavhub' && window.utsavHub) {
    setTimeout(() => {
      window.utsavHub.init();
    }, 50);
  }

  // Refresh Certificates data when opening certificates tab
  if (tabId === 'certificates' && window.utsavHub) {
    setTimeout(() => {
      window.utsavHub.loadCertificatesVault('all');
    }, 50);
  }
}

// ============================================================================
// 8. INTERACTIVE LEAFLET MAP & OSM COORDINATES
// ============================================================================
function initCampusMap() {
  const mapContainer = document.getElementById('campus-map');
  if (!mapContainer) return;

  // Chanakya Global Campus Coordinates
  const centerLat = 13.222871;
  const centerLng = 77.755633;

  appState.mapInstance = L.map('campus-map', {
    zoomControl: false,
    attributionControl: false,
    minZoom: 15,
    maxZoom: 19
  }).setView([centerLat, centerLng], 17);

  // 1. High-Resolution Real Satellite Aerial Imagery (Matches OSM screenshot, 100% Free, NO API Key)
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Esri World Imagery (No API Key)'
  });

  // 2. OpenStreetMap Standard (Clean, Authentic, 100% Free, NO API Key)
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    subdomains: ['a', 'b', 'c'],
    attribution: '&copy; OpenStreetMap contributors (No API Key)'
  });

  // 3. Dark Gray Canvas (Clean, Sleek, NO Watermark, NO API Key)
  const darkLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Esri Dark Canvas (No API Key)'
  });

  // Default to Satellite view matching the user's uploaded OpenStreetMap aerial view
  satelliteLayer.addTo(appState.mapInstance);

  // Add Layer Switcher Control in top right
  const baseLayers = {
    "🛰️ Real Satellite (Aerial)": satelliteLayer,
    "🗺️ OpenStreetMap Standard": osmLayer,
    "🌑 Dark Clean Canvas": darkLayer
  };
  appState.layerControl = L.control.layers(baseLayers, null, { position: 'topright' }).addTo(appState.mapInstance);

  // Add Zoom Control in bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(appState.mapInstance);

  // Load Real OSM Campus Buildings & Footprints
  loadCampusGeoJsonOverlay();

  // Plot Landmarks
  plotLandmarksOnMap();
}


function loadCampusGeoJsonOverlay() {
  if (!appState.mapInstance) return;
  fetch('/data/campus_layers.json')
    .then(r => r.json())
    .then(geoData => {
      if (!geoData || !geoData.features) return;
      
      const geoLayer = L.geoJSON(geoData, {
        style: function(feature) {
          const cat = feature.properties.category;
          if (cat === 'boundary') {
            return {
              color: '#06B6D4',
              weight: 2.5,
              opacity: 0.9,
              dashArray: '6, 6',
              fill: true,
              fillColor: '#06B6D4',
              fillOpacity: 0.04
            };
          } else if (cat === 'building') {
            return {
              color: '#F59E0B',
              weight: 2,
              opacity: 0.9,
              fill: true,
              fillColor: '#F59E0B',
              fillOpacity: 0.35
            };
          } else if (cat === 'sports') {
            return {
              color: '#10B981',
              weight: 2,
              opacity: 0.9,
              fill: true,
              fillColor: '#10B981',
              fillOpacity: 0.35
            };
          } else if (cat === 'road') {
            return {
              color: '#94A3B8',
              weight: 3.5,
              opacity: 0.8
            };
          }
          return { color: '#CBD5E1', weight: 1.5, opacity: 0.6 };
        },
        onEachFeature: function(feature, layer) {
          const name = feature.properties.name || 'Campus Feature';
          const cat = feature.properties.category || '';
          layer.bindTooltip(`<div class="font-bold text-xs text-amber-300">${escapeHtml(name)}</div><div class="text-[10px] text-slate-300 uppercase">${escapeHtml(cat)}</div>`, {
            sticky: true,
            className: 'glass-panel text-white px-2 py-1 rounded border border-slate-700 text-xs'
          });
        }
      }).addTo(appState.mapInstance);

      if (appState.layerControl) {
        appState.layerControl.addOverlay(geoLayer, "🏛️ Real Campus Buildings & Footprints (OSM)");
      }
    })
    .catch(e => console.warn("Could not load campus geojson layers:", e));
}

function plotLandmarksOnMap() {
  if (!appState.mapInstance || !appState.landmarks.length) return;

  // Clear existing markers
  Object.values(appState.mapMarkers).forEach(m => appState.mapInstance.removeLayer(m));
  appState.mapMarkers = {};

  // Category Color Scheme
  const catColors = {
    'Administrative': '#F59E0B',
    'Auditorium': '#8B5CF6',
    'Academic & Research': '#06B6D4',
    'Library': '#3B82F6',
    'Sports': '#10B981',
    'Dining': '#F97316',
    'Residential': '#EC4899',
    'Entrance': '#EF4444',
    'Infrastructure': '#EAB308',
    'Health & Emergency': '#DC2626'
  };

  const catIcons = {
    'Administrative': '🏛️',
    'Auditorium': '🎭',
    'Academic & Research': '🔬',
    'Library': '📚',
    'Sports': '⚽',
    'Dining': '🍽️',
    'Residential': '🛏️',
    'Entrance': '🚪',
    'Infrastructure': '⚡',
    'Health & Emergency': '🏥'
  };

  const markerList = [];

  appState.landmarks.forEach(lm => {
    const col = catColors[lm.category] || '#F59E0B';
    const iconSym = catIcons[lm.category] || '📍';

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background: ${col}; color: #000; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.6); transition: transform 0.2s ease;">
          ${iconSym}
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });

    const marker = L.marker([lm.lat, lm.lng], { icon: customIcon }).addTo(appState.mapInstance);

    // Hover tooltip showing short landmark name
    marker.bindTooltip(`<div class="font-bold text-xs">${escapeHtml(lm.shortName || lm.name)}</div>`, {
      permanent: false,
      direction: 'top',
      offset: [0, -14],
      className: 'glass-panel text-white px-2 py-1 rounded-lg border border-slate-700 text-xs'
    });

    const popupHtml = `
      <div class="p-2.5 space-y-2 min-w-[210px]">
        <div class="flex items-center gap-2">
          <span class="text-xl">${iconSym}</span>
          <div>
            <h4 class="text-xs font-black text-white leading-tight">${escapeHtml(lm.name)}</h4>
            <span class="text-[10px] text-amber-400 font-mono font-bold">${escapeHtml(lm.category)}</span>
          </div>
        </div>
        <p class="text-[11px] text-slate-300 leading-snug">${escapeHtml(lm.description.slice(0, 110))}...</p>
        <div class="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/60 pt-1.5 font-mono">
          <span>Cap: <b class="text-white">${lm.capacity}</b></span>
          <span>Crowd: <b class="text-amber-400">${lm.currentCrowd}</b></span>
        </div>
        <div class="flex items-center gap-1.5 pt-1">
          <button onclick="calculateRouteTo('${lm.id}')" class="flex-1 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition">
            Directions &rarr;
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    appState.mapMarkers[lm.id] = marker;
    markerList.push(marker);
  });

  // Automatically fit bounds so all landmarks are comfortably framed
  if (markerList.length && appState.mapInstance) {
    const group = new L.featureGroup(markerList);
    if (group.getBounds().isValid()) {
      appState.mapInstance.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 18 });
    }
  }
}

function calculateRouteTo(destId) {
  sfx.play('click');
  const startId = "main_gate_1";
  fetch('/api/map/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromId: startId, toId: destId, mode: 'pedestrian' })
  })
  .then(res => res.json())
  .then(route => {
    if (route && route.waypoints && appState.mapInstance) {
      drawRouteOnMap(route.waypoints, '#06B6D4');
      showToast("Route Calculated", `${route.from.shortName} ➔ ${route.to.shortName} (${route.totalDistanceMeters}m, ~${route.estimatedMinutes || route.estimatedTimeMins} min walking)`, 'info');
      sfx.play('success');
    }
  })
  .catch(err => console.error("Route error:", err));
}

function triggerEmergencyEvacuation() {
  sfx.play('alert');
  fetch('/api/map/evacuate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromId: 'grand_auditorium' })
  })
  .then(res => res.json())
  .then(data => {
    if (data && data.route && appState.mapInstance) {
      if (appState.routeLayer) {
        appState.mapInstance.removeLayer(appState.routeLayer);
      }
      appState.routeLayer = L.polyline(data.route.pathCoords, {
        color: '#EF4444',
        weight: 6,
        opacity: 0.95
      }).addTo(appState.mapInstance);

      appState.mapInstance.fitBounds(appState.routeLayer.getBounds(), { padding: [50, 50] });

      showToast("🚨 EMERGENCY EVACUATION ROUTE", `Clear fastest path to ${data.nearestExit.name} (${data.evacuationDistanceMeters}m). Follow illuminated green floor indicators.`, 'alert');
    }
  });
}

function togglePathObstacle() {
  sfx.play('click');
  const btn = document.getElementById('btn-toggle-obstacle');
  showToast("Pathway Obstacle Simulated", "Central Quad corridor blocked due to Tech Fest setup. Navigation automatically rerouting via South Boulevard.", 'info');
}

// Custom Map Data Ingestion Drawer
function openCustomMapModal() {
  sfx.play('click');
  const modal = document.getElementById('custom-map-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeCustomMapModal() {
  const modal = document.getElementById('custom-map-modal');
  if (modal) modal.classList.add('hidden');
}

function submitCustomMapNode() {
  const name = document.getElementById('custom-map-node-name').value.trim();
  const category = document.getElementById('custom-map-node-cat').value;
  const lat = parseFloat(document.getElementById('custom-map-node-lat').value);
  const lng = parseFloat(document.getElementById('custom-map-node-lng').value);
  const desc = document.getElementById('custom-map-node-desc').value.trim();

  if (!name || isNaN(lat) || isNaN(lng)) {
    showToast("Validation Error", "Please provide a valid Pin Name, Latitude, and Longitude.", 'alert');
    return;
  }

  fetch('/api/map/custom-nodes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, lat, lng, description: desc })
  })
  .then(res => res.json())
  .then(node => {
    showToast("Custom Pin Added", `${node.name} successfully plotted on Campus Map!`, 'success');
    sfx.play('success');
    closeCustomMapModal();

    // Plot immediately
    if (appState.mapInstance) {
      const marker = L.marker([node.lat, node.lng]).addTo(appState.mapInstance);
      marker.bindPopup(`<b>${escapeHtml(node.name)}</b><br><span class="text-xs text-amber-400">${escapeHtml(node.category)}</span><br>${escapeHtml(node.description)}`).openPopup();
      appState.mapInstance.setView([node.lat, node.lng], 17);
    }
  });
}

// ============================================================================
// 9. EVENTS SERVICE
// ============================================================================
function loadEvents() {
  fetch('/api/events')
    .then(res => res.json())
    .then(data => {
      appState.events = data.events || [];
      renderEvents();
    })
    .catch(err => console.error("Error loading events:", err));
}

function renderEvents(filterCat = 'all') {
  const container = document.getElementById('events-grid');
  if (!container) return;

  let list = appState.events;
  if (filterCat !== 'all') {
    list = list.filter(e => e.category.toLowerCase().includes(filterCat.toLowerCase()));
  }

  if (list.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400">No events found in this category.</div>`;
    return;
  }

  container.innerHTML = list.map(evt => {
    const capacity = evt.maxCapacity || evt.capacity || 2500;
    const isFull = evt.registeredCount >= capacity;
    const isApproved = evt.status === 'approved';
    const canApprove = appState.currentRole === 'admin' || appState.currentRole === 'faculty';

    return `
      <div class="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-700/60 hover:border-amber-500/40 transition duration-300">
        <div class="h-44 relative overflow-hidden bg-slate-950">
          <img src="${evt.bannerImage || '/assets/images/chanakya_campus.png'}" alt="${escapeHtml(evt.title)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div class="absolute top-3 left-3 flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
              ${escapeHtml(evt.category)}
            </span>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
              ${escapeHtml(evt.status)}
            </span>
          </div>
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span class="flex items-center gap-1">📅 ${escapeHtml(evt.scheduleDate || 'Sept 15, 2026')}</span>
            <span class="flex items-center gap-1 font-mono text-amber-300">📍 ${escapeHtml(evt.venueName)}</span>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 class="text-base font-extrabold text-white group-hover:text-amber-400 transition leading-snug">
              ${escapeHtml(evt.title)}
            </h3>
            <p class="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
              ${escapeHtml(evt.description)}
            </p>
          </div>

          <div class="space-y-3 pt-2 border-t border-slate-800">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400">Registered: <b class="text-white">${evt.registeredCount.toLocaleString()} / ${capacity.toLocaleString()}</b></span>
              <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">${evt.ticketType || 'Free Registration'}</span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style="width: ${Math.min(100, (evt.registeredCount / capacity) * 100)}%"></div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-1">
              <button onclick="openRegisterModal('${evt.id}', '${escapeHtml(evt.title)}')" class="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5">
                <span>🎫</span> Get Digital Pass
              </button>

              ${canApprove && !isApproved ? `
                <button onclick="approveEvent('${evt.id}')" class="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition">
                  ✓ Approve
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let activeRegisterEventId = 'EVT-2026-001';

function openRegisterModal(evtId, evtTitle) {
  sfx.play('click');
  activeRegisterEventId = evtId || 'EVT-2026-001';

  const modal = document.getElementById('register-modal') || document.getElementById('event-reg-modal');
  if (!modal) return;

  const titleEl = document.getElementById('reg-modal-event-title') || document.getElementById('reg-event-title');
  if (titleEl) titleEl.textContent = evtTitle;

  const user = appState.currentUser || { name: 'Student Attendee', email: 'student@chanakya.edu', dept: 'Engineering' };
  const nameEl = document.getElementById('reg-name') || document.getElementById('reg-user-name');
  const emailEl = document.getElementById('reg-email') || document.getElementById('reg-user-email');
  const deptEl = document.getElementById('reg-dept');

  if (nameEl) nameEl.value = user.name || '';
  if (emailEl) emailEl.value = user.email || '';
  if (deptEl) deptEl.value = user.dept || user.department_name || 'School of Engineering & Tech';

  modal.classList.remove('hidden');
}

function closeRegisterModal() {
  const modal = document.getElementById('register-modal') || document.getElementById('event-reg-modal');
  if (modal) modal.classList.add('hidden');
}

async function handleRegistrationSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  sfx.play('click');

  const evtId = activeRegisterEventId || 'EVT-2026-001';
  const nameEl = document.getElementById('reg-name') || document.getElementById('reg-user-name');
  const emailEl = document.getElementById('reg-email') || document.getElementById('reg-user-email');
  const deptEl = document.getElementById('reg-dept');
  const ticketEl = document.getElementById('reg-ticket');

  const name = nameEl ? nameEl.value.trim() : (appState.currentUser?.name || 'Student');
  const email = emailEl ? emailEl.value.trim() : (appState.currentUser?.email || 'student@chanakya.edu');
  const dept = deptEl ? deptEl.value.trim() : (appState.currentUser?.dept || 'Engineering');
  const ticketType = ticketEl ? ticketEl.value : 'VIP All-Access Pass';

  const submitBtn = e && e.target ? e.target.querySelector('button[type="submit"]') : null;
  if (submitBtn) submitBtn.innerHTML = `<span class="animate-spin">⏳</span> Securing Pass in Database...`;

  try {
    const res = await fetch(`/api/events/${evtId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: name,
        userEmail: email,
        userDept: dept,
        userRole: appState.currentRole || 'student',
        ticketType: ticketType
      })
    });
    const reg = await res.json();
    closeRegisterModal();
    sfx.play('success');
    showToast("Registration Confirmed", `Digital Pass allocated for ${reg.eventTitle || 'Campus Event'}!`, "success");
    openDigitalPassModal(reg);
    loadEvents(); // Update numbers on UI
  } catch (err) {
    showToast("Registration Failed", err.message, 'alert');
  } finally {
    if (submitBtn) submitBtn.innerHTML = `Generate Digital Pass & QR Code`;
  }
}

window.submitEventRegistration = handleRegistrationSubmit;
window.handleRegistrationSubmit = handleRegistrationSubmit;

function openDigitalPassModal(reg) {
  const modal = document.getElementById('digital-pass-modal');
  if (!modal) return;

  const titleEl = document.getElementById('pass-event-title');
  if (titleEl) titleEl.textContent = reg.eventTitle || 'Chanakya Campus Event';

  const ticketTypeEl = document.getElementById('pass-ticket-type');
  if (ticketTypeEl) ticketTypeEl.textContent = reg.ticketType || 'All-Access Delegate Pass';

  const attendeeEl = document.getElementById('pass-attendee') || document.getElementById('pass-user-name');
  if (attendeeEl) attendeeEl.textContent = reg.userName || appState.currentUser?.name || 'Student Attendee';

  const seatEl = document.getElementById('pass-seat');
  if (seatEl) seatEl.textContent = reg.seatNumber || 'AUD-A12';

  const regIdEl = document.getElementById('pass-reg-id') || document.getElementById('pass-ticket-id');
  if (regIdEl) regIdEl.textContent = reg.id || reg.qrCode || 'REG-2026-001';

  modal.classList.remove('hidden');
}

function closeDigitalPassModal() {
  const modal = document.getElementById('digital-pass-modal');
  if (modal) modal.classList.add('hidden');
}

function simulateCheckIn() {
  sfx.play('success');
  const regId = document.getElementById('pass-reg-id')?.textContent || 'REG-1001';
  showToast("Gate Check-In Verified", `Turnstile access granted for pass ${regId}. Status: ATTENDED.`, "success");
  closeDigitalPassModal();
}

function approveEvent(evtId) {
  sfx.play('click');
  fetch(`/api/events/${evtId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stage: 'final_approval',
      action: 'approve',
      actor: appState.currentUser.name,
      notes: "Officially endorsed by University Dean Office"
    })
  })
  .then(res => res.json())
  .then(() => {
    showToast("Event Approved", "Event status updated to APPROVED and published to student feeds.", 'success');
    sfx.play('success');
    loadEvents();
  });
}

// ============================================================================
// 10. FACILITIES SERVICE
// ============================================================================
function loadFacilities() {
  fetch('/api/facilities')
    .then(res => res.json())
    .then(facs => {
      appState.facilities = facs;
      renderFacilities();
    })
    .catch(err => console.error("Error loading facilities:", err));
}

function renderFacilities() {
  const container = document.getElementById('facilities-grid');
  if (!container) return;

  container.innerHTML = appState.facilities.map(fac => {
    const occPercent = Math.round((fac.currentOccupancy / fac.capacity) * 100);
    const badgeColor = occPercent > 80 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' :
                       occPercent > 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                       'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-amber-400">${escapeHtml(fac.type)}</span>
            <h3 class="text-base font-bold text-white">${escapeHtml(fac.name)}</h3>
            <p class="text-xs text-slate-400 mt-0.5">📍 ${escapeHtml(fac.location)}</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${badgeColor}">
            ${fac.currentOccupancy}/${fac.capacity} Occupied
          </span>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-300">
            <span>Capacity Utilization</span>
            <span class="font-mono font-bold">${occPercent}%</span>
          </div>
          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" style="width: ${occPercent}%"></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-400">Amenities: <b class="text-slate-200">${(fac.amenities || []).slice(0, 2).join(', ')}</b></span>
          <button onclick="bookFacilityModal('${fac.id}', '${escapeHtml(fac.name)}')" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition">
            Book Slot
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function bookFacilityModal(facId, facName) {
  sfx.play('click');
  const purpose = prompt(`Reserve slot for ${facName}.\nPlease enter booking purpose:`, "Academic Study Session / Meeting");
  if (!purpose) return;

  fetch(`/api/facilities/${facId}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookedBy: appState.currentUser.name,
      purpose,
      role: appState.currentRole
    })
  })
  .then(res => res.json())
  .then(() => {
    showToast("Facility Reserved", `Confirmed reservation for ${facName}. A digital confirmation has been emailed to ${appState.currentUser.email}.`, 'success');
    sfx.play('success');
    loadFacilities();
  });
}

// ============================================================================

// ============================================================================
// 11. FOOD & SPORTS SERVICE (CAMPUS FOOD COURT, IYENGAR'S & NANDINI CAFE)
// ============================================================================
const EMBEDDED_CANTEEN_DATA = {
  "activeMonth": "November 2026",
  "cycleVersion": "Cycle 11/2026 (Monthly Rotating Schedule)",
  "lastUpdated": "2026-11-18T10:00:00Z",
  "availableMonths": [
    {
      "id": "2026-11",
      "label": "November 2026 (Active Current)",
      "active": true
    },
    {
      "id": "2026-12",
      "label": "December 2026 (Upcoming Cycle)",
      "active": false
    },
    {
      "id": "2026-10",
      "label": "October 2026 (Archived Cycle)",
      "active": false
    }
  ],
  "foodCourt": {
    "id": "food_court_central",
    "name": "Chanakya Central Food Court & Mess Pavilion",
    "building": "Annapurna Dining Complex - Ground Floor",
    "timings": "07:30 AM - 10:30 PM Daily",
    "status": "Open",
    "currentCrowdWaitMins": 8,
    "rushHour": "12:45 PM - 02:00 PM & 08:00 PM - 09:15 PM",
    "hygieneRating": "5.0 ★ (FSSAI Tier-1 Institutional)",
    "mealTimings": {
      "breakfast": "07:30 AM - 10:00 AM",
      "lunch": "12:15 PM - 02:45 PM",
      "snacks": "05:00 PM - 06:30 PM",
      "dinner": "07:30 PM - 10:00 PM"
    },
    "caterers": [
      {
        "id": "caterer_blue_dove",
        "name": "Blue Dove Dining & Caterers",
        "code": "BD-MESS",
        "description": "Specialized in South & North Indian multi-grain delicacies with traditional Ragi Mudde and regional sambars.",
        "type": "Food Court - Wing A",
        "rating": "4.8 ★",
        "weeklySchedule": {
          "monday": {
            "day": "Monday",
            "date": "2026-11-16",
            "breakfast": [
              "Idly",
              "Coriander Rice",
              "Sambar",
              "Coconut Chutney",
              "Cornflakes",
              "Cut Fresh Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Fruit Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Masala Buttermilk",
              "Butter Roti & Ragi Ball",
              "Soppu Kaalu Palya",
              "White Kara Mani Masala",
              "Jeera Rice",
              "Steam Rice",
              "Boiled Rice",
              "Traditional Bassaru",
              "Fresh Curd",
              "Mango Pickle",
              "Fried Green Chilli",
              "Papad / Fryums",
              "Broken Wheat Payasa (Limited)"
            ],
            "snacks": [
              "Masala Puri (Limited)",
              "Hot Masala Tea",
              "Filter Coffee"
            ],
            "dinner": [
              "Hot and Sour Soup",
              "Phulka Roti",
              "Aloo Palak",
              "Steam Rice",
              "Dal Fry",
              "Pickle",
              "Fresh Curd",
              "Mint Rasam",
              "Chettinad Egg Masala (Limited)"
            ]
          },
          "tuesday": {
            "day": "Tuesday",
            "date": "2026-11-17",
            "breakfast": [
              "Aloo Paratha",
              "Ven Pongal",
              "Fresh Curd",
              "Coconut Chutney",
              "Rolled Oats",
              "Fresh Banana",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Masala Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Ragi Ambli",
              "Butter Roti & Ragi Ball",
              "Beetroot Poriyal",
              "Aloo Palak Masala",
              "Fragrant Ghee Rice",
              "Steam Rice",
              "Boiled Rice",
              "Molakekalu Sambar",
              "Fresh Curd",
              "Pickle",
              "Fried Green Chilli",
              "Garden Salad",
              "Banana Sheera (Limited)"
            ],
            "snacks": [
              "Veg Maggi (Limited)",
              "Tea",
              "Filter Coffee"
            ],
            "dinner": [
              "Creamy Tomato Soup",
              "Roti",
              "Paneer Aloo Masala",
              "Steam Rice",
              "Dal Makhni",
              "Pickle",
              "Curd",
              "Black Pepper Rasam",
              "Curry Leaf Chicken (3 pcs Limited)"
            ]
          },
          "wednesday": {
            "day": "Wednesday",
            "date": "2026-11-18",
            "breakfast": [
              "Kali Dosa",
              "Lemon Rice",
              "Udupi Sambar",
              "Chutney",
              "Cornflakes",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Pangam Herbal Cooler",
              "Akki Roti",
              "Snake Gourd Palya",
              "Yennegayi Brinjal Masala",
              "Corn Pulao",
              "Steam Rice",
              "Boiled Rice",
              "Kadle Kaalu Huli",
              "Curd",
              "Pickle",
              "Fried Green Chilli",
              "Papad / Fryums",
              "Semiya Kheer (Limited)"
            ],
            "snacks": [
              "Veg Pasta in White Garlic Sauce (Limited)",
              "Masala Tea",
              "Coffee"
            ],
            "dinner": [
              "Sweet Corn Soup",
              "Roti",
              "Methi Chole Masala",
              "Steam Rice",
              "Plain Dal",
              "Pickle",
              "Curd",
              "Dal Rasam",
              "Muttai Kuzhambu (Egg Curry Limited)"
            ]
          },
          "thursday": {
            "day": "Thursday",
            "date": "2026-11-19",
            "breakfast": [
              "Poori with Aloo Sagu",
              "Masala Poha",
              "Chutney",
              "Choco Flakes",
              "Cut Seasonal Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Jaljeera Refresh",
              "Butter Roti",
              "Cabbage Poriyal",
              "Veg Kadai Masala",
              "White Vegetable Pulao",
              "Steam Rice",
              "Boiled Rice",
              "Masoppu Sambar",
              "Curd",
              "Chow Chow Palya",
              "Fried Green Chilli",
              "Green Salad",
              "Rava Ladoo (1 pc)"
            ],
            "snacks": [
              "Bhel Puri (Limited)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Cream of Mushroom Soup",
              "Tawa Kulcha",
              "Paneer Do Pyaza",
              "Steam Rice",
              "Palak Dal",
              "Pickle",
              "Curd",
              "Spicy Chilli Rasam",
              "Andhra Style Chicken Curry (Limited)"
            ]
          },
          "friday": {
            "day": "Friday",
            "date": "2026-11-20",
            "breakfast": [
              "Veg Stuffed Paratha",
              "Curry Leaf Spiced Rice",
              "Curd",
              "Chutney",
              "Cornflakes",
              "Banana",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Masala Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Ragi Ambli",
              "Butter Roti & Ragi Ball",
              "Mixed Vegetable Palya",
              "Aloo Black Channa Curry",
              "Curry Leaf Rice",
              "Steam Rice",
              "Boiled Rice",
              "Drumstick Sambar",
              "Curd",
              "Pickle",
              "Fried Green Chilli",
              "Papad / Fryums",
              "Green Moongdal Payasam"
            ],
            "snacks": [
              "Onion Bonda (2 pcs) with Mint Chutney",
              "Masala Tea",
              "Coffee"
            ],
            "dinner": [
              "Hot and Sour Soup",
              "Hyderabadi Veg Dum Biryani",
              "Mirchi Ka Salan",
              "Pickle",
              "Onion Raitha",
              "Jeera Rasam",
              "Ambur Egg Biryani (Limited)"
            ]
          },
          "saturday": {
            "day": "Saturday",
            "date": "2026-11-21",
            "breakfast": [
              "Batura with Chole Masala",
              "Broken Wheat Upma",
              "Chutney",
              "Oats",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Mint Lemon Juice",
              "Butter Roti",
              "Aloo Capsicum Palya",
              "Punjabi Rajma Masala",
              "Green Peas Pulao",
              "Steam Rice",
              "Boiled Rice",
              "Aloo Brinjal Sambar",
              "Curd",
              "Pickle",
              "Fried Green Chilli",
              "Fresh Salad",
              "Besan Ladoo (1 pc)"
            ],
            "snacks": [
              "Grilled Veg Sandwich (1 pc) with Tomato Dip",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Drumstick Clear Soup",
              "Phulka Roti",
              "Veg Mushroom Masala",
              "Steam Rice",
              "Masala Dal",
              "Pickle",
              "Curd",
              "Mysore Rasam",
              "Chicken Masala Curry (Limited)"
            ]
          },
          "sunday": {
            "day": "Sunday",
            "date": "2026-11-22",
            "breakfast": [
              "Crispy Masala Dosa (03 pcs)",
              "Tomato Bath",
              "Sambar",
              "Chutney",
              "Cornflakes",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Jaljeera Digestive",
              "Butter Roti",
              "Pumpkin Palya",
              "Mixed Vegetable Curry",
              "Lemon Rice",
              "Steam Rice",
              "Boiled Rice",
              "Radish Sambar",
              "Curd",
              "Pickle",
              "Fried Green Chilli",
              "Papad / Fryums",
              "Chilled Fruit Custard (Limited)"
            ],
            "snacks": [
              "Crispy Punjabi Samosa (1 pc) with Mint Chutney",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Vegetable Clear Soup",
              "Paneer Dum Biryani",
              "Steam Rice",
              "Salan",
              "Pickle",
              "Onion Cucumber Raitha",
              "Coriander Rasam",
              "Special Royal Chicken Biryani (Limited)"
            ]
          }
        }
      },
      {
        "id": "caterer_sagar",
        "name": "Sagar Caterers & Dining",
        "code": "SAGAR-MESS",
        "description": "Known for Karnataka traditional breakfast varieties, nutritious chapathis, and specialty weekend biryanis.",
        "type": "Food Court - Wing B",
        "rating": "4.7 ★",
        "weeklySchedule": {
          "monday": {
            "day": "Monday",
            "date": "2026-11-16",
            "breakfast": [
              "Puffy Bhatura with Chole Masala",
              "Tomato Chitranna",
              "Chutney",
              "Cornflakes",
              "Cut Fruits (Limited)",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Methi Chapathi",
              "Steam Rice",
              "Crispy Papad",
              "Aloo Bhendi Dry",
              "Jeera Rice",
              "Plain Dal",
              "Rajma Masala",
              "Gulab Jamun (1 pc)",
              "Ragi Malt",
              "Pickle",
              "Fresh Curd"
            ],
            "snacks": [
              "Masala Puri (Limited)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Wheat Chapathi",
              "Mysore Rasam",
              "Yellow Dal Tadka",
              "Egg Masala (02 pcs)",
              "Veg Hyderabadi Handi Masala",
              "Steam Rice",
              "Pickle",
              "Curd"
            ]
          },
          "tuesday": {
            "day": "Tuesday",
            "date": "2026-11-17",
            "breakfast": [
              "Steamed Rava Idli with Aloo Saagu",
              "Ven Pongal",
              "Chutney",
              "Rolled Oats",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Wheat Chapathi",
              "Steam Rice",
              "Cucumber Salad",
              "Soppu Kaalu Palya",
              "Lemon Rice",
              "Bassaru",
              "Aloo Palak Gravy",
              "Godhi Kadi Payasa (Limited)",
              "Spiced Buttermilk",
              "Pickle",
              "Curd"
            ],
            "snacks": [
              "Hot Samosa (1 pc)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Carrot Chapathi",
              "Black Pepper Rasam",
              "Tomato Dal",
              "Kundapura Chicken Curry (3 pcs)",
              "Paneer Butter Masala",
              "Steam Rice",
              "Pickle",
              "Curd"
            ]
          },
          "wednesday": {
            "day": "Wednesday",
            "date": "2026-11-18",
            "breakfast": [
              "50-50 Stuffed Paratha",
              "Fresh Curd",
              "Vangi Bath (Brinjal Rice)",
              "Chutney",
              "Cornflakes",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Jeera Chapathi",
              "Steam Rice",
              "Papad",
              "Carrot Beans Palya",
              "Soya Pulao",
              "Herekayi Sambar",
              "Karamani Masala",
              "Banana Sajjige (Limited)",
              "Fresh Lemon Juice",
              "Pickle",
              "Curd"
            ],
            "snacks": [
              "Crispy Bread Pakoda (1 pc)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Wheat Chapathi",
              "Huli Rasam",
              "Mixed Dal Fry",
              "Egg Paddu Masala (02 pcs)",
              "Bhuna Mushroom Masala",
              "Steam Rice",
              "Pickle",
              "Curd"
            ]
          },
          "thursday": {
            "day": "Thursday",
            "date": "2026-11-19",
            "breakfast": [
              "Kali Dosa with Mix Veg Kurma",
              "Karnataka Puliyogare",
              "Chutney",
              "Oats",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Wheat Chapathi",
              "Steam Rice",
              "Garden Salad",
              "Aloo Methi Dry",
              "Veg Biryani",
              "Mangalore Cucumber Sambar",
              "Soya Capsicum Masala",
              "Shahi Tukda (1 pc)",
              "Masala Buttermilk",
              "Pickle",
              "Curd"
            ],
            "snacks": [
              "Pani Puri (5 pcs)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Jeera Chapathi",
              "Udupi Rasam",
              "Dal Palak",
              "Patiala Chicken Masala (3 pcs)",
              "Mutter Paneer",
              "Steam Rice",
              "Pickle",
              "Curd"
            ]
          },
          "friday": {
            "day": "Friday",
            "date": "2026-11-20",
            "breakfast": [
              "Thatte Idli with Aloo Saagu",
              "Masala Poha",
              "Red Chutney",
              "Cornflakes",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Beetroot Chapathi",
              "Steam Rice",
              "Papad",
              "Yam Palya",
              "Coriander Rice",
              "Pumpkin Sambar",
              "Veg Do Pyaza Curry",
              "Fruit Custard (Limited)",
              "Cool Shikanji",
              "Pickle",
              "Curd"
            ],
            "snacks": [
              "Misal Pav (1 pc)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Mirchi Salan",
              "Methi Dal",
              "Egg Biryani (02 pcs)",
              "Veg Hyderabadi Biryani",
              "Steam Rice",
              "Pickle",
              "Cucumber Raitha"
            ]
          },
          "saturday": {
            "day": "Saturday",
            "date": "2026-11-21",
            "breakfast": [
              "Aloo Paneer Paratha with Curd",
              "Veg Vegetable Pulao",
              "Chutney",
              "Oats",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Wheat Chapathi",
              "Steam Rice",
              "Salad",
              "Beetroot Palya",
              "Curd Rice",
              "Mixed Vegetable Sambar",
              "Bhendi Masala",
              "Sabudana Payasa (Limited)",
              "Fresh Buttermilk",
              "Pickle"
            ],
            "snacks": [
              "Crispy Dal Vada (2 pcs)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Methi Chapathi",
              "Jeera Rasam",
              "Plain Dal",
              "Punjabi Chole Masala",
              "Steam Rice",
              "Pickle",
              "Curd"
            ]
          },
          "sunday": {
            "day": "Sunday",
            "date": "2026-11-22",
            "breakfast": [
              "Masala Dosa (03 pcs)",
              "Sambar",
              "Bansi Rava Veg Upma",
              "Chutney",
              "Cornflakes",
              "Cut Fruits",
              "Boiled Egg (01 Limited)",
              "Bread",
              "Butter",
              "Jam",
              "Tea",
              "Coffee",
              "Hot Milk"
            ],
            "lunch": [
              "Carrot Chapathi",
              "Steam Rice",
              "Papad",
              "Raw Banana Palya",
              "Tomato Bath",
              "Soppu Sambar",
              "Avarebele Masala",
              "Rava Laddu (1 pc)",
              "Jaljeera",
              "Pickle",
              "Curd"
            ],
            "snacks": [
              "White Sauce Pasta (Limited)",
              "Tea",
              "Coffee"
            ],
            "dinner": [
              "Salan",
              "Andhra Rasam",
              "Chicken Pulao (3 pcs)",
              "Paneer Biryani",
              "Steam Rice",
              "Pickle",
              "Raitha"
            ]
          }
        }
      }
    ]
  },
  "iyengars": {
    "id": "canteen_iyengars",
    "name": "The Iyengar's Canteen & Cafe",
    "building": "Academic Block 2 Courtyard",
    "type": "Traditional Fast Casual, Bakery & Juices",
    "timings": "08:00 AM - 09:30 PM Daily",
    "status": "Open",
    "currentCrowdWaitMins": 6,
    "hygieneRating": "4.9 ★",
    "verifiedBoardImage": "/images/iyengars_menu_board.jpg",
    "parcelPolicy": "Parcel charges extra ₹5/- per item",
    "categories": [
      {
        "name": "Fresh Fruit Juice",
        "icon": "🥤",
        "items": [
          {
            "name": "Water Melon Juice",
            "price": 60,
            "tag": "Fresh Press",
            "prepTime": "3 mins"
          },
          {
            "name": "Musk Melon Juice",
            "price": 60,
            "tag": "Fresh Press",
            "prepTime": "3 mins"
          },
          {
            "name": "Pine Apple Juice",
            "price": 60,
            "tag": "Fresh Press",
            "prepTime": "4 mins"
          },
          {
            "name": "Musambi Juice",
            "price": 60,
            "tag": "Citrus Rich",
            "prepTime": "4 mins"
          },
          {
            "name": "Mix Fruit Juice",
            "price": 80,
            "tag": "Chef Special",
            "prepTime": "5 mins"
          },
          {
            "name": "Lemon Juice",
            "price": 40,
            "tag": "Hydration",
            "prepTime": "2 mins"
          },
          {
            "name": "Pulpy Grapes Juice",
            "price": 70,
            "tag": "Seasonal",
            "prepTime": "4 mins"
          },
          {
            "name": "Cold Coffee",
            "price": 100,
            "tag": "Thick Blend",
            "prepTime": "3 mins"
          }
        ]
      },
      {
        "name": "Sandwich and Burger",
        "icon": "🥪",
        "items": [
          {
            "name": "Corn Cheese Sandwich",
            "price": 80,
            "tag": "Toasted",
            "prepTime": "6 mins"
          },
          {
            "name": "Tandoori Paneer Sandwich",
            "price": 80,
            "tag": "Spicy",
            "prepTime": "7 mins"
          },
          {
            "name": "Tandoori Cheese Paneer Sandwich",
            "price": 90,
            "tag": "Bestseller",
            "prepTime": "7 mins"
          },
          {
            "name": "Veg Cheese Sandwich",
            "price": 80,
            "tag": "Classic",
            "prepTime": "5 mins"
          },
          {
            "name": "Veg Sandwich",
            "price": 70,
            "tag": "Light",
            "prepTime": "5 mins"
          },
          {
            "name": "Veg Burger",
            "price": 80,
            "tag": "Crispy Patty",
            "prepTime": "8 mins"
          },
          {
            "name": "Veg Cheese Burger",
            "price": 90,
            "tag": "Double Melt",
            "prepTime": "8 mins"
          },
          {
            "name": "Paneer Burger",
            "price": 90,
            "tag": "Grilled Paneer",
            "prepTime": "8 mins"
          },
          {
            "name": "Paneer Cheese Burger",
            "price": 100,
            "tag": "Supreme",
            "prepTime": "9 mins"
          }
        ]
      },
      {
        "name": "Milk Shake and Lassi",
        "icon": "🥛",
        "items": [
          {
            "name": "Apple Milk Shake",
            "price": 70,
            "tag": "Rich Fruit",
            "prepTime": "4 mins"
          },
          {
            "name": "Banana Milk Shake",
            "price": 70,
            "tag": "Energy Boost",
            "prepTime": "3 mins"
          },
          {
            "name": "Oreo Milk Shake",
            "price": 80,
            "tag": "Popular",
            "prepTime": "4 mins"
          },
          {
            "name": "Banana Chocolate Milk Shake",
            "price": 80,
            "tag": "Indulgent",
            "prepTime": "4 mins"
          },
          {
            "name": "Papaya Milk Shake",
            "price": 70,
            "tag": "Nutritious",
            "prepTime": "4 mins"
          },
          {
            "name": "Butter Fruit Milk Shake (Avocado)",
            "price": 90,
            "tag": "Premium Creamy",
            "prepTime": "5 mins"
          },
          {
            "name": "Strawberry Milk Shake",
            "price": 80,
            "tag": "Berry Blend",
            "prepTime": "4 mins"
          },
          {
            "name": "Chocolate Milk Shake",
            "price": 90,
            "tag": "Thick Cocoa",
            "prepTime": "4 mins"
          },
          {
            "name": "Mango Milk Shake",
            "price": 80,
            "tag": "Alphonso Blend",
            "prepTime": "4 mins"
          },
          {
            "name": "Rose Milk",
            "price": 60,
            "tag": "Traditional Cold",
            "prepTime": "2 mins"
          },
          {
            "name": "Cold Badam Milk",
            "price": 60,
            "tag": "Kesar Badam",
            "prepTime": "2 mins"
          },
          {
            "name": "Rose Lassi",
            "price": 60,
            "tag": "Sweet Curd",
            "prepTime": "3 mins"
          },
          {
            "name": "Banana Lassi",
            "price": 60,
            "tag": "Thick Lassi",
            "prepTime": "3 mins"
          },
          {
            "name": "Mango Crush Lassi",
            "price": 60,
            "tag": "Fruity Curd",
            "prepTime": "3 mins"
          },
          {
            "name": "Mix Fruit Lassi",
            "price": 70,
            "tag": "Topped Fruit",
            "prepTime": "4 mins"
          },
          {
            "name": "Fruit Custard",
            "price": 70,
            "tag": "Chilled Dessert",
            "prepTime": "2 mins"
          },
          {
            "name": "Fresh Fruit Bowl",
            "price": 60,
            "tag": "Cut Fruit Mix",
            "prepTime": "3 mins"
          }
        ]
      },
      {
        "name": "Fries & Quick Bites",
        "icon": "🍟",
        "items": [
          {
            "name": "French Fries",
            "price": 70,
            "tag": "Crispy Salted",
            "prepTime": "5 mins"
          },
          {
            "name": "Peri Peri Fries",
            "price": 80,
            "tag": "Hot & Tangy",
            "prepTime": "5 mins"
          },
          {
            "name": "Potato Wedges",
            "price": 80,
            "tag": "Herbed",
            "prepTime": "6 mins"
          },
          {
            "name": "Potato Cheese Wedges",
            "price": 90,
            "tag": "Cheesy Melt",
            "prepTime": "6 mins"
          },
          {
            "name": "Crinkle Pepper Fries",
            "price": 80,
            "tag": "Crinkle Cut",
            "prepTime": "5 mins"
          },
          {
            "name": "Crinkle Cheese Fries",
            "price": 90,
            "tag": "Crinkle Melt",
            "prepTime": "5 mins"
          },
          {
            "name": "Cheese Fries",
            "price": 80,
            "tag": "Loaded Dip",
            "prepTime": "5 mins"
          },
          {
            "name": "Peri Peri Cheese Fries",
            "price": 90,
            "tag": "Signature Fries",
            "prepTime": "6 mins"
          },
          {
            "name": "Veg Nuggets",
            "price": 70,
            "tag": "6 pcs Crisp",
            "prepTime": "5 mins"
          },
          {
            "name": "Potato Cheese Shots",
            "price": 70,
            "tag": "Bite Sized",
            "prepTime": "5 mins"
          }
        ]
      },
      {
        "name": "Campus Chats",
        "icon": "🥟",
        "items": [
          {
            "name": "Masala Puri",
            "price": 60,
            "tag": "Bengaluru Special",
            "prepTime": "4 mins"
          },
          {
            "name": "Pani Puri",
            "price": 60,
            "tag": "Crispy Golgappa",
            "prepTime": "3 mins"
          },
          {
            "name": "Dahi Puri",
            "price": 60,
            "tag": "Sweet Curd & Sev",
            "prepTime": "4 mins"
          },
          {
            "name": "Bhel Puri",
            "price": 60,
            "tag": "Crunchy Spiced",
            "prepTime": "3 mins"
          },
          {
            "name": "Samosa Chat",
            "price": 70,
            "tag": "Crushed Samosa Gravy",
            "prepTime": "4 mins"
          },
          {
            "name": "Vada Pav",
            "price": 70,
            "tag": "2 pcs Chutney Pav",
            "prepTime": "3 mins"
          }
        ]
      },
      {
        "name": "Mojito and Soda",
        "icon": "🍹",
        "items": [
          {
            "name": "Lime & Mint Mojito",
            "price": 80,
            "tag": "Virgin Classic",
            "prepTime": "3 mins"
          },
          {
            "name": "Pineapple Mojito",
            "price": 80,
            "tag": "Tropical Fizz",
            "prepTime": "3 mins"
          },
          {
            "name": "Strawberry Mojito",
            "price": 80,
            "tag": "Berry Splash",
            "prepTime": "3 mins"
          },
          {
            "name": "Blueberry Mojito",
            "price": 80,
            "tag": "Electric Blue",
            "prepTime": "3 mins"
          },
          {
            "name": "Mango Mojito",
            "price": 80,
            "tag": "Summer Sparkle",
            "prepTime": "3 mins"
          },
          {
            "name": "Guava Chilli Mojito",
            "price": 80,
            "tag": "Spicy Tang",
            "prepTime": "3 mins"
          },
          {
            "name": "Litchi Mojito",
            "price": 80,
            "tag": "Sweet Fizz",
            "prepTime": "3 mins"
          },
          {
            "name": "Lime Masala Soda",
            "price": 80,
            "tag": "Zesty Soda",
            "prepTime": "2 mins"
          }
        ]
      }
    ]
  },
  "nandiniCafe": {
    "id": "canteen_nandini_cafe",
    "name": "Nandini Milk Parlour & Campus Cafe",
    "building": "Student Amphitheatre Walkway",
    "type": "KMF Karnataka Dairy Outlet & Beverages",
    "timings": "08:30 AM - 09:00 PM Daily",
    "status": "Active (Awaiting Menu Feed)",
    "currentCrowdWaitMins": 4,
    "hygieneRating": "5.0 ★ (KMF Certified)",
    "notice": "Official detailed price board sync scheduled for tomorrow. Core dairy essentials available at counter.",
    "staplesPreview": [
      {
        "name": "Nandini Degree Filter Coffee",
        "estimatedPrice": "₹15",
        "tag": "Hot Beverage"
      },
      {
        "name": "Hot Badam Milk (Glass)",
        "estimatedPrice": "₹25",
        "tag": "Hot Beverage"
      },
      {
        "name": "Cold Flavoured Milk (Pista / Choco / Badam)",
        "estimatedPrice": "₹30",
        "tag": "Chilled Bottle"
      },
      {
        "name": "Special Mysore Pak & Milk Peda (Box)",
        "estimatedPrice": "₹45",
        "tag": "Traditional Sweet"
      },
      {
        "name": "Nandini Premium Ice Cream Scoops & Kulfi",
        "estimatedPrice": "₹35",
        "tag": "Dessert"
      },
      {
        "name": "Fresh Curd Cup & Sweet Lassi",
        "estimatedPrice": "₹20",
        "tag": "Probiotic Dairy"
      }
    ]
  }
};

let activeMessCaterer = 'caterer_blue_dove';
let activeMessDay = 'wednesday'; // Default to Wednesday / today
let activeIyengarCategory = 'all';
let iyengarSearchQuery = '';

function loadFoodAndSports() {
  fetch('/api/food-sports/all')
    .then(res => res.json())
    .then(data => {
      appState.foodOutlets = data.foodOutlets || [];
      appState.sportsCourts = data.sportsCourts || [];
      appState.canteenData = data.canteenData || EMBEDDED_CANTEEN_DATA;
      if (data.cplData) appState.cplData = data.cplData;
      renderFoodOutlets();
      renderSportsCourts();
    })
    .catch(err => {
      console.warn("Using embedded canteen and sports fallback:", err);
      appState.canteenData = EMBEDDED_CANTEEN_DATA;
      appState.cplData = EMBEDDED_CPL_DATA;
      renderFoodOutlets();
      renderSportsCourts();
    });
}

function renderFoodOutlets() {
  const container = document.getElementById('food-outlets-list');
  if (!container) return;

  const data = appState.canteenData || EMBEDDED_CANTEEN_DATA;
  const fc = data.foodCourt;
  const iy = data.iyengars;
  const nd = data.nandiniCafe;

  // Determine current day of week
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayIndex = new Date().getDay();
  const currentDayKey = dayNames[todayIndex] || 'wednesday';

  // Card 1: Central Food Court (Blue Dove & Sagar)
  const fcHtml = `
    <div class="glass-card rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-slate-950 space-y-4 shadow-xl hover:border-amber-400/50 transition">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">🍲</span>
            <h3 class="text-base font-extrabold text-white">${escapeHtml(fc.name)}</h3>
          </div>
          <p class="text-xs text-amber-400 mt-1 font-mono">
            🔄 ${escapeHtml(fc.building)} • ${escapeHtml(data.cycleVersion)}
          </p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
          OPEN
        </span>
      </div>

      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Dual Caterers:</span>
          <span class="text-amber-300 font-semibold text-[11px]">Blue Dove (Wing A) & Sagar (Wing B)</span>
        </div>
        <div class="text-xs text-slate-300">
          <span class="text-cyan-400 font-semibold">Today's Schedule (${currentDayKey.toUpperCase()}):</span> 
          Breakfast (Idly/Paratha/Dosa), Lunch (Special Thali & Ragi Mudde), Snacks & Royal Dinner.
        </div>
        <div class="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span>⏱️ Avg Wait: <b>${fc.currentCrowdWaitMins} mins</b></span>
          <span>⭐ Rating: <b>${fc.hygieneRating}</b></span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <button onclick="openMonthlyMessMenuModal('caterer_blue_dove')" class="py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5">
          <span>📅</span> Monthly Menu
        </button>
        <button onclick="orderFoodModal('Central Food Court (Mess)')" class="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center justify-center gap-1.5">
          <span>🎫</span> Pre-Order
        </button>
      </div>
    </div>
  `;

  // Card 2: The Iyengar's Canteen
  const iyHtml = `
    <div class="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-slate-950 space-y-4 shadow-xl hover:border-emerald-400/50 transition">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">🥪</span>
            <h3 class="text-base font-extrabold text-white">${escapeHtml(iy.name)}</h3>
          </div>
          <p class="text-xs text-emerald-400 mt-1 font-mono">
            🏛️ ${escapeHtml(iy.building)} • Verified On-Campus Board
          </p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          OPEN
        </span>
      </div>

      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Whiteboard Specialties:</span>
          <span class="text-amber-400 text-[10px] font-mono">${escapeHtml(iy.parcelPolicy)}</span>
        </div>
        <div class="flex flex-wrap gap-1.5 text-[11px]">
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Juices (₹40-80)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Sandwiches (₹70-100)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Chats (₹60-70)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Fries (₹70-90)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Mojitos (₹80)</span>
        </div>
        <div class="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span>⏱️ Avg Wait: <b>${iy.currentCrowdWaitMins} mins</b></span>
          <span>⭐ Rating: <b>${iy.hygieneRating}</b></span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <button onclick="openIyengarsMenuModal()" class="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5">
          <span>📖</span> Full Menu
        </button>
        <button onclick="openWhiteboardPhotoModal()" class="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center justify-center gap-1.5">
          <span>📸</span> Board Photo
        </button>
      </div>
    </div>
  `;

  // Card 3: Nandini Cafe
  const ndHtml = `
    <div class="glass-card rounded-2xl p-5 border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-slate-900/40 to-slate-950 space-y-4 shadow-xl hover:border-blue-400/50 transition">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">🥛</span>
            <h3 class="text-base font-extrabold text-white">${escapeHtml(nd.name)}</h3>
          </div>
          <p class="text-xs text-blue-400 mt-1 font-mono">
            🎪 ${escapeHtml(nd.building)} • Pure KMF Karnataka Dairy
          </p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
          ACTIVE
        </span>
      </div>

      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
        <div class="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
          <span>📢</span>
          <span>Official detailed menu sync scheduled for tomorrow.</span>
        </div>
        <div class="text-xs text-slate-300">
          <span class="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Campus Staples Available:</span>
          <div class="flex flex-wrap gap-1.5 mt-1 text-[11px]">
            <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Filter Coffee ₹15</span>
            <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Badam Milk ₹25</span>
            <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Mysore Pak ₹45</span>
            <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Ice Cream ₹35</span>
          </div>
        </div>
        <div class="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span>⏱️ Avg Wait: <b>${nd.currentCrowdWaitMins} mins</b></span>
          <span>⭐ Rating: <b>${nd.hygieneRating}</b></span>
        </div>
      </div>

      <div class="pt-1">
        <button onclick="orderFoodModal('Nandini Milk Parlour')" class="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5">
          <span>☕</span> Pre-Order KMF Staples Token
        </button>
      </div>
    </div>
  `;

  container.innerHTML = fcHtml + iyHtml + ndHtml;
}

// ----------------------------------------------------------------------------
// MODAL 1: MONTHLY MESS MENU (BLUE DOVE & SAGAR CATERERS)
// ----------------------------------------------------------------------------
function openMonthlyMessMenuModal(catererId) {
  sfx.play('click');
  activeMessCaterer = catererId || 'caterer_blue_dove';
  
  // Set day to current day of week
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  activeMessDay = dayNames[new Date().getDay()] || 'wednesday';

  let modal = document.getElementById('monthly-mess-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'monthly-mess-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto';
    document.body.appendChild(modal);
  }

  modal.innerHTML = getMessModalHtml();
  modal.classList.remove('hidden');
}

function closeMonthlyMessModal() {
  sfx.play('click');
  const modal = document.getElementById('monthly-mess-modal');
  if (modal) modal.classList.add('hidden');
}

function switchMessCaterer(catererId) {
  sfx.play('click');
  activeMessCaterer = catererId;
  const modal = document.getElementById('monthly-mess-modal');
  if (modal) modal.innerHTML = getMessModalHtml();
}

function switchMessDay(dayKey) {
  sfx.play('click');
  activeMessDay = dayKey;
  const modal = document.getElementById('monthly-mess-modal');
  if (modal) modal.innerHTML = getMessModalHtml();
}

function getMessModalHtml() {
  const data = appState.canteenData || EMBEDDED_CANTEEN_DATA;
  const fc = data.foodCourt;
  const caterer = fc.caterers.find(c => c.id === activeMessCaterer) || fc.caterers[0];
  const dayData = caterer.weeklySchedule[activeMessDay] || caterer.weeklySchedule.wednesday;

  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed (Today)' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  return `
    <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🍲</span>
            <div>
              <h2 class="text-lg font-black text-white">Chanakya Food Court — Monthly Dining Schedule</h2>
              <p class="text-xs text-amber-400 font-mono">${escapeHtml(data.cycleVersion)} • FSSAI Grade A+</p>
            </div>
          </div>
        </div>
        <button onclick="closeMonthlyMessModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition">
          ✕
        </button>
      </div>

      <!-- Caterer Switcher Tabs -->
      <div class="px-5 pt-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          ${fc.caterers.map(c => `
            <button onclick="switchMessCaterer('${c.id}')" class="py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${c.id === activeMessCaterer ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}">
              <span>${c.id === 'caterer_blue_dove' ? '🕊️' : '🍛'}</span>
              <span>${escapeHtml(c.name)}</span>
            </button>
          `).join('')}
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>📅 Month:</span>
          <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">${escapeHtml(data.activeMonth)}</span>
        </div>
      </div>

      <!-- Day Selector Pills -->
      <div class="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        ${days.map(d => `
          <button onclick="switchMessDay('${d.key}')" class="py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition ${d.key === activeMessDay ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}">
            ${d.label}
          </button>
        `).join('')}
      </div>

      <!-- Meal Schedule Grid -->
      <div class="p-5 overflow-y-auto space-y-4">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span class="font-bold text-white text-sm">Meals for ${escapeHtml(dayData.day)} (${dayData.date})</span>
          <span class="text-cyan-400 font-mono">Caterer: ${escapeHtml(caterer.name)}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Breakfast -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🍳</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-amber-400 tracking-wider">Breakfast</h4>
                  <span class="text-[10px] text-slate-400 font-mono">${fc.mealTimings.breakfast}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${dayData.breakfast.map(item => `
                <span class="px-2 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 ${item.includes('Limited') || item.includes('Egg') ? 'border-amber-500/40 text-amber-300 font-semibold' : ''}">
                  ${escapeHtml(item)}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Lunch -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-emerald-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🍛</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-emerald-400 tracking-wider">Grand Lunch</h4>
                  <span class="text-[10px] text-slate-400 font-mono">${fc.mealTimings.lunch}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${dayData.lunch.map(item => `
                <span class="px-2 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 ${item.includes('Payasa') || item.includes('Jamun') || item.includes('Sheera') || item.includes('Ladoo') || item.includes('Kheer') ? 'border-pink-500/40 text-pink-300 font-bold' : ''}">
                  ${escapeHtml(item)}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Snacks -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-cyan-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">☕</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-cyan-400 tracking-wider">Evening Snacks & High Tea</h4>
                  <span class="text-[10px] text-slate-400 font-mono">${fc.mealTimings.snacks}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${dayData.snacks.map(item => `
                <span class="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 text-cyan-200 font-semibold">
                  ${escapeHtml(item)}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Dinner -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-purple-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🍲</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-purple-400 tracking-wider">Dinner</h4>
                  <span class="text-[10px] text-slate-400 font-mono">${fc.mealTimings.dinner}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              ${dayData.dinner.map(item => `
                <span class="px-2 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 ${item.includes('Chicken') || item.includes('Egg') || item.includes('Biryani') ? 'border-amber-500/50 text-amber-300 font-bold' : ''}">
                  ${escapeHtml(item)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 Note: Food Court menu automatically updates on the 1st of every calendar month.</span>
          <button onclick="orderFoodModal('${escapeHtml(caterer.name)}')" class="py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition">
            Generate Meal Token
          </button>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// MODAL 2: THE IYENGAR'S CANTEEN (WHITEBOARD MENU & REAL-TIME SEARCH)
// ----------------------------------------------------------------------------
function openIyengarsMenuModal() {
  sfx.play('click');
  activeIyengarCategory = 'all';
  iyengarSearchQuery = '';

  let modal = document.getElementById('iyengars-menu-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'iyengars-menu-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto';
    document.body.appendChild(modal);
  }

  modal.innerHTML = getIyengarsModalHtml();
  modal.classList.remove('hidden');
}

function closeIyengarsModal() {
  sfx.play('click');
  const modal = document.getElementById('iyengars-menu-modal');
  if (modal) modal.classList.add('hidden');
}

function filterIyengarCat(cat) {
  sfx.play('click');
  activeIyengarCategory = cat;
  const modal = document.getElementById('iyengars-menu-modal');
  if (modal) modal.innerHTML = getIyengarsModalHtml();
}

function handleIyengarSearch(q) {
  iyengarSearchQuery = (q || '').toLowerCase().trim();
  const listEl = document.getElementById('iyengars-items-grid');
  if (listEl) {
    listEl.innerHTML = renderIyengarItemsGrid();
  }
}

function renderIyengarItemsGrid() {
  const data = appState.canteenData || EMBEDDED_CANTEEN_DATA;
  const iy = data.iyengars;
  let items = [];

  iy.categories.forEach(cat => {
    if (activeIyengarCategory === 'all' || activeIyengarCategory === cat.name) {
      cat.items.forEach(it => {
        items.push({ ...it, categoryName: cat.name, icon: cat.icon });
      });
    }
  });

  if (iyengarSearchQuery) {
    items = items.filter(it => it.name.toLowerCase().includes(iyengarSearchQuery) || it.categoryName.toLowerCase().includes(iyengarSearchQuery));
  }

  if (items.length === 0) {
    return `<div class="col-span-full py-12 text-center text-slate-500 text-sm">No items matching "${escapeHtml(iyengarSearchQuery)}"</div>`;
  }

  return items.map(it => `
    <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between group">
      <div class="space-y-1">
        <div class="flex items-center gap-1.5">
          <span class="text-sm">${it.icon}</span>
          <h4 class="text-xs font-bold text-white group-hover:text-emerald-300 transition">${escapeHtml(it.name)}</h4>
        </div>
        <div class="flex items-center gap-2 text-[10px] text-slate-400">
          <span class="text-emerald-400 font-semibold">${escapeHtml(it.tag)}</span>
          <span>•</span>
          <span>⏱️ ${it.prepTime}</span>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="text-sm font-black text-amber-400">₹${it.price}</span>
        <button onclick="orderFoodModal('The Iyengar\'s (${escapeHtml(it.name)})')" class="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 transition">
          + Add
        </button>
      </div>
    </div>
  `).join('');
}

function getIyengarsModalHtml() {
  const data = appState.canteenData || EMBEDDED_CANTEEN_DATA;
  const iy = data.iyengars;

  return `
    <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🥪</span>
            <div>
              <h2 class="text-lg font-black text-white">The Iyengar's Canteen & Juice Bar</h2>
              <p class="text-xs text-emerald-400 font-mono">${escapeHtml(iy.building)} • Verified Whiteboard Menu</p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="openWhiteboardPhotoModal()" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-1.5">
            <span>📸</span> View Board Photo
          </button>
          <button onclick="closeIyengarsModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition">
            ✕
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
        <div class="relative">
          <input type="text" oninput="handleIyengarSearch(this.value)" placeholder="🔍 Search juices, burgers, sandwiches, chats, fries..." class="w-full py-2 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button onclick="filterIyengarCat('all')" class="py-1 px-3 rounded-lg font-bold whitespace-nowrap transition ${activeIyengarCategory === 'all' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}">
            All (50+)
          </button>
          ${iy.categories.map(c => `
            <button onclick="filterIyengarCat('${c.name}')" class="py-1 px-3 rounded-lg font-bold whitespace-nowrap transition ${activeIyengarCategory === c.name ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}">
              ${c.icon} ${c.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Items Grid -->
      <div class="p-5 overflow-y-auto">
        <div id="iyengars-items-grid" class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${renderIyengarItemsGrid()}
        </div>
      </div>

      <!-- Footer Policy -->
      <div class="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span class="text-amber-400 font-mono">📦 ${escapeHtml(iy.parcelPolicy)}</span>
        <span class="text-slate-500 text-[11px]">Timings: ${escapeHtml(iy.timings)}</span>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// MODAL 3: WHITEBOARD PHOTO VIEWER
// ----------------------------------------------------------------------------
function openWhiteboardPhotoModal() {
  sfx.play('click');
  let modal = document.getElementById('whiteboard-photo-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'whiteboard-photo-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-lg';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div>
          <h3 class="text-sm font-black text-white flex items-center gap-2">
            <span>📸</span> Campus Menu Board — The Iyengar's Canteen
          </h3>
          <p class="text-[11px] text-slate-400">Authentic whiteboard photograph captured from Academic Block 2</p>
        </div>
        <button onclick="closeWhiteboardPhotoModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
          ✕
        </button>
      </div>
      <div class="p-2 overflow-auto flex items-center justify-center bg-slate-950">
        <img src="/images/iyengars_menu_board.jpg" alt="The Iyengar's Canteen Menu Board" class="rounded-xl max-h-[75vh] w-auto object-contain shadow-2xl" onerror="this.src='/reports/images/iyengars_menu_board.jpg'" />
      </div>
      <div class="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-amber-400 font-mono">
        PARCEL CHARGES EXTRA 5/-RS FOR EACH
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeWhiteboardPhotoModal() {
  sfx.play('click');
  const modal = document.getElementById('whiteboard-photo-modal');
  if (modal) modal.classList.add('hidden');
}

function orderFoodModal(outletName) {
  sfx.play('click');
  const token = Math.floor(100 + Math.random() * 900);
  showToast("Pre-Order Token Generated", `Token #${token} generated for ${outletName}. Ready at pickup counter in 8-10 mins.`, 'success');
  sfx.play('success');
}



// ============================================================================
// CHANAKYA PREMIER LEAGUE (SEASON-2) 2026 (CPL) & SPORTS HUB
// ============================================================================
const EMBEDDED_CPL_DATA = {
  "tournament": {
    "id": "cpl-season-2-2026",
    "name": "Chanakya Premier League (Season-2) 2026",
    "edition": "Season 2",
    "seasonYear": 2026,
    "stage": "League Matches",
    "organizer": "Chanakya University Sports & Athletics Council",
    "ground": "Chanakya University Global Campus Cricket Ground, Devanahalli, Bangalore",
    "scoringPartner": "CricHeroes",
    "status": "In Progress",
    "notice": "More league match scorecards sync scheduled in 3-4 days as matches conclude."
  },
  "teams": [
    {
      "id": "magadha_lions",
      "name": "MAGADHA LIONS",
      "shortCode": "ML",
      "captain": "Vidya Sagar",
      "color": "#F59E0B",
      "matchesPlayed": 1,
      "won": 1,
      "lost": 0,
      "tied": 0,
      "points": 2,
      "netRunRate": "+0.150",
      "squad": [
        {
          "name": "Vidya Sagar",
          "role": "Captain / All-Rounder",
          "isCaptain": true
        },
        {
          "name": "Ajay Chandra",
          "role": "Batsman / Bowler"
        },
        {
          "name": "Akash K",
          "role": "Bowler / Batsman"
        },
        {
          "name": "Chethan Yadav",
          "role": "All-Rounder"
        },
        {
          "name": "Gagan Deep",
          "role": "Wicket-Keeper / Batsman",
          "isWK": true
        },
        {
          "name": "Neeraj",
          "role": "Bowler"
        },
        {
          "name": "Reyansh P",
          "role": "Top-order Batsman"
        },
        {
          "name": "Thayaanithi V V",
          "role": "All-Rounder"
        },
        {
          "name": "Venki",
          "role": "Middle-order Batsman"
        },
        {
          "name": "Raghu Pujari",
          "role": "Bowler"
        },
        {
          "name": "Yuvi Yuvi",
          "role": "All-Rounder"
        },
        {
          "name": "Chakri",
          "role": "Substitute / Batter"
        }
      ]
    },
    {
      "id": "chalukya_challengers",
      "name": "Chalukya Challengers",
      "shortCode": "CC",
      "captain": "Shastri",
      "color": "#0284C7",
      "matchesPlayed": 1,
      "won": 0,
      "lost": 1,
      "tied": 0,
      "points": 0,
      "netRunRate": "-0.150",
      "squad": [
        {
          "name": "Shastri",
          "role": "Captain / All-Rounder",
          "isCaptain": true
        },
        {
          "name": "Dheemanth",
          "role": "Opening Batsman"
        },
        {
          "name": "Ganesh",
          "role": "Wicket-Keeper / Batsman",
          "isWK": true
        },
        {
          "name": "Mahadevaprasad",
          "role": "Middle-order Batsman"
        },
        {
          "name": "Manoj Kumar Reddy A",
          "role": "All-Rounder"
        },
        {
          "name": "Mayur Krishna",
          "role": "Pace Bowler / Batsman"
        },
        {
          "name": "Maharshi Mn",
          "role": "Bowler"
        },
        {
          "name": "Pradyumna Patil",
          "role": "Top-order Batsman"
        },
        {
          "name": "Sharath",
          "role": "Bowler"
        },
        {
          "name": "Vishnu Suhas Reddy",
          "role": "Opening Bowler"
        },
        {
          "name": "Chethan Mb",
          "role": "Middle-order Batsman"
        },
        {
          "name": "Sathiyapriya",
          "role": "Substitute / Fielder"
        }
      ]
    },
    {
      "id": "maurya_strikers",
      "name": "Maurya Strikers",
      "shortCode": "MS",
      "captain": "Upcoming",
      "color": "#10B981",
      "matchesPlayed": 0,
      "won": 0,
      "lost": 0,
      "tied": 0,
      "points": 0,
      "netRunRate": "0.000",
      "status": "Upcoming Match Slot"
    },
    {
      "id": "rashtrakuta_warriors",
      "name": "Rashtrakuta Warriors",
      "shortCode": "RW",
      "captain": "Upcoming",
      "color": "#8B5CF6",
      "matchesPlayed": 0,
      "won": 0,
      "lost": 0,
      "tied": 0,
      "points": 0,
      "netRunRate": "0.000",
      "status": "Upcoming Match Slot"
    }
  ],
  "matches": [
    {
      "id": "cpl-2026-m01",
      "matchNumber": "Match 1",
      "stage": "League Stage",
      "date": "2026-02-14",
      "time": "09:00 AM UTC",
      "ground": "Chanakya University Global Campus Cricket Ground, Devanahalli, Bangalore",
      "teamA": "MAGADHA LIONS",
      "teamB": "Chalukya Challengers",
      "toss": "Chalukya Challengers opt to field",
      "result": "MAGADHA LIONS won by 3 runs",
      "resultType": "close_finish",
      "margin": "3 runs",
      "playerOfTheMatch": {
        "name": "Vidya Sagar",
        "team": "MAGADHA LIONS",
        "performance": "4.0-0-18-4 & Captaincy Defence"
      },
      "officials": {
        "umpires": [
          "Krishiv",
          "Rakshak"
        ],
        "scorer": "Hemanth N V",
        "captains": {
          "magadha": "Vidya Sagar",
          "chalukya": "Shastri"
        }
      },
      "summary": {
        "magadhaLions": {
          "score": 127,
          "wickets": 10,
          "overs": 17.4,
          "crr": 7.19
        },
        "chalukyaChallengers": {
          "score": 124,
          "wickets": 10,
          "overs": 19.5,
          "crr": 6.25
        }
      },
      "bestPerformances": {
        "batsmen": [
          {
            "name": "Pradyumna Patil",
            "team": "Chalukya Challengers",
            "runs": 27,
            "balls": 22,
            "fours": 3,
            "sixes": 0,
            "sr": 122.73
          },
          {
            "name": "Reyansh P",
            "team": "MAGADHA LIONS",
            "runs": 20,
            "balls": 14,
            "fours": 4,
            "sixes": 0,
            "sr": 142.86
          },
          {
            "name": "Dheemanth",
            "team": "Chalukya Challengers",
            "runs": 20,
            "balls": 28,
            "fours": 3,
            "sixes": 0,
            "sr": 71.43
          }
        ],
        "bowlers": [
          {
            "name": "Vidya Sagar",
            "team": "MAGADHA LIONS",
            "overs": 4,
            "maidens": 0,
            "runs": 18,
            "wickets": 4,
            "economy": 4.5
          },
          {
            "name": "Mayur Krishna",
            "team": "Chalukya Challengers",
            "overs": 2.4,
            "maidens": 0,
            "runs": 22,
            "wickets": 4,
            "economy": 8.25
          },
          {
            "name": "Manoj Kumar Reddy A",
            "team": "Chalukya Challengers",
            "overs": 3,
            "maidens": 0,
            "runs": 21,
            "wickets": 2,
            "economy": 7
          }
        ]
      },
      "innings1": {
        "team": "MAGADHA LIONS",
        "score": "127/10",
        "overs": "17.4",
        "crr": 7.19,
        "batting": [
          {
            "name": "Gagan Deep",
            "role": "wk",
            "hand": "RHB",
            "dismissal": "c Vishnu Suhas Reddy b Manoj Kumar Reddy A",
            "runs": 17,
            "balls": 16,
            "minutes": 35,
            "fours": 1,
            "sixes": 1,
            "sr": 106.25
          },
          {
            "name": "Ajay Chandra",
            "role": "bat",
            "hand": "RHB",
            "dismissal": "c †Ganesh b Pradyumna Patil",
            "runs": 5,
            "balls": 11,
            "minutes": 16,
            "fours": 0,
            "sixes": 0,
            "sr": 45.45
          },
          {
            "name": "Reyansh P",
            "role": "bat",
            "hand": "RHB",
            "dismissal": "c Pradyumna Patil b Mayur Krishna",
            "runs": 20,
            "balls": 14,
            "minutes": 13,
            "fours": 4,
            "sixes": 0,
            "sr": 142.86
          },
          {
            "name": "Vidya Sagar",
            "role": "c",
            "hand": "RHB",
            "dismissal": "run out Shastri",
            "runs": 12,
            "balls": 17,
            "minutes": 44,
            "fours": 0,
            "sixes": 0,
            "sr": 70.59
          },
          {
            "name": "Thayaanithi V V",
            "role": "all",
            "hand": "RHB",
            "dismissal": "c Maharshi MN b Shastri",
            "runs": 13,
            "balls": 15,
            "minutes": 25,
            "fours": 0,
            "sixes": 1,
            "sr": 86.67
          },
          {
            "name": "Chethan Yadav",
            "role": "all",
            "hand": "RHB",
            "dismissal": "b Manoj Kumar Reddy A",
            "runs": 13,
            "balls": 17,
            "minutes": 34,
            "fours": 2,
            "sixes": 0,
            "sr": 76.47
          },
          {
            "name": "Venki",
            "role": "bat",
            "hand": "RHB",
            "dismissal": "run out Manoj Kumar Reddy A / †Ganesh",
            "runs": 0,
            "balls": 0,
            "minutes": 4,
            "fours": 0,
            "sixes": 0,
            "sr": 0
          },
          {
            "name": "Neeraj",
            "role": "bowl",
            "hand": "RHB",
            "dismissal": "c †Ganesh b Mayur Krishna",
            "runs": 8,
            "balls": 9,
            "minutes": 22,
            "fours": 1,
            "sixes": 0,
            "sr": 88.89
          },
          {
            "name": "Yuvi Yuvi",
            "role": "all",
            "hand": "RHB",
            "dismissal": "b Mayur Krishna",
            "runs": 5,
            "balls": 6,
            "minutes": 9,
            "fours": 0,
            "sixes": 0,
            "sr": 83.33
          },
          {
            "name": "Raghu Pujari",
            "role": "bowl",
            "hand": "RHB",
            "dismissal": "lbw b Mayur Krishna",
            "runs": 0,
            "balls": 1,
            "minutes": 1,
            "fours": 0,
            "sixes": 0,
            "sr": 0
          },
          {
            "name": "Akash K",
            "role": "bowl",
            "hand": "RHB",
            "dismissal": "not out",
            "runs": 1,
            "balls": 1,
            "minutes": 1,
            "fours": 0,
            "sixes": 0,
            "sr": 100
          }
        ],
        "didNotBat": [
          "Chakri"
        ],
        "extras": {
          "total": 33,
          "breakdown": "wd 30, b 2, nb 1"
        },
        "bowling": [
          {
            "name": "Vishnu Suhas Reddy",
            "overs": 1,
            "maidens": 0,
            "runs": 7,
            "wickets": 0,
            "dots": 3,
            "fours": 0,
            "sixes": 0,
            "wides": 3,
            "noBalls": 0,
            "economy": 7
          },
          {
            "name": "Pradyumna Patil",
            "overs": 4,
            "maidens": 0,
            "runs": 17,
            "wickets": 1,
            "dots": 15,
            "fours": 0,
            "sixes": 0,
            "wides": 6,
            "noBalls": 0,
            "economy": 4.25
          },
          {
            "name": "Mahadevaprasad",
            "overs": 1,
            "maidens": 0,
            "runs": 9,
            "wickets": 0,
            "dots": 3,
            "fours": 1,
            "sixes": 0,
            "wides": 3,
            "noBalls": 0,
            "economy": 9
          },
          {
            "name": "Shastri (c)",
            "overs": 4,
            "maidens": 0,
            "runs": 25,
            "wickets": 1,
            "dots": 12,
            "fours": 2,
            "sixes": 0,
            "wides": 6,
            "noBalls": 0,
            "economy": 6.25
          },
          {
            "name": "Mayur Krishna",
            "overs": 2.4,
            "maidens": 0,
            "runs": 22,
            "wickets": 4,
            "dots": 7,
            "fours": 2,
            "sixes": 1,
            "wides": 1,
            "noBalls": 0,
            "economy": 8.25
          },
          {
            "name": "Manoj Kumar Reddy A",
            "overs": 3,
            "maidens": 0,
            "runs": 21,
            "wickets": 2,
            "dots": 10,
            "fours": 0,
            "sixes": 1,
            "wides": 5,
            "noBalls": 0,
            "economy": 7
          },
          {
            "name": "Dheemanth",
            "overs": 1,
            "maidens": 0,
            "runs": 7,
            "wickets": 0,
            "dots": 3,
            "fours": 0,
            "sixes": 0,
            "wides": 2,
            "noBalls": 1,
            "economy": 7
          },
          {
            "name": "Sharath",
            "overs": 0,
            "maidens": 0,
            "runs": 3,
            "wickets": 0,
            "dots": 0,
            "fours": 0,
            "sixes": 0,
            "wides": 3,
            "noBalls": 0,
            "economy": 0
          },
          {
            "name": "Maharshi MN",
            "overs": 1,
            "maidens": 0,
            "runs": 14,
            "wickets": 0,
            "dots": 1,
            "fours": 3,
            "sixes": 0,
            "wides": 0,
            "noBalls": 0,
            "economy": 14
          }
        ],
        "fallOfWickets": [
          {
            "score": "23-1",
            "batsman": "Ajay Chandra",
            "overs": "3.2"
          },
          {
            "score": "48-2",
            "batsman": "Reyansh P",
            "overs": "6.0"
          },
          {
            "score": "57-3",
            "batsman": "Gagan Deep",
            "overs": "6.5"
          },
          {
            "score": "86-4",
            "batsman": "Thayaanithi V V",
            "overs": "11.2"
          },
          {
            "score": "96-5",
            "batsman": "Vidya Sagar",
            "overs": "13.2"
          },
          {
            "score": "98-6",
            "batsman": "Venki",
            "overs": "13.5"
          },
          {
            "score": "119-7",
            "batsman": "Chethan Yadav",
            "overs": "16.1"
          },
          {
            "score": "126-8",
            "batsman": "Neeraj",
            "overs": "17.1"
          },
          {
            "score": "126-9",
            "batsman": "Raghu Pujari",
            "overs": "17.2"
          },
          {
            "score": "127-10",
            "batsman": "Yuvi Yuvi",
            "overs": "17.4"
          }
        ]
      },
      "innings2": {
        "team": "Chalukya Challengers",
        "score": "124/10",
        "overs": "19.5",
        "crr": 6.25,
        "target": 128,
        "batting": [
          {
            "name": "Dheemanth",
            "role": "bat",
            "hand": "RHB",
            "dismissal": "lbw b Neeraj",
            "runs": 20,
            "balls": 28,
            "minutes": 33,
            "fours": 3,
            "sixes": 0,
            "sr": 71.43
          },
          {
            "name": "Mayur Krishna",
            "role": "bowl",
            "hand": "RHB",
            "dismissal": "b Yuvi Yuvi",
            "runs": 4,
            "balls": 3,
            "minutes": 13,
            "fours": 0,
            "sixes": 0,
            "sr": 133.33
          },
          {
            "name": "Manoj Kumar Reddy A",
            "role": "all",
            "hand": "RHB",
            "dismissal": "lbw b Vidya Sagar",
            "runs": 11,
            "balls": 23,
            "minutes": 33,
            "fours": 1,
            "sixes": 0,
            "sr": 47.83
          },
          {
            "name": "Pradyumna Patil",
            "role": "bat",
            "hand": "RHB",
            "dismissal": "c Chethan Yadav b Vidya Sagar",
            "runs": 27,
            "balls": 22,
            "minutes": 32,
            "fours": 3,
            "sixes": 0,
            "sr": 122.73
          },
          {
            "name": "Ganesh",
            "role": "wk",
            "hand": "RHB",
            "dismissal": "c Akash K b Ajay Chandra",
            "runs": 9,
            "balls": 11,
            "minutes": 27,
            "fours": 1,
            "sixes": 0,
            "sr": 81.82
          },
          {
            "name": "Shastri",
            "role": "c",
            "hand": "RHB",
            "dismissal": "run out Vidya Sagar",
            "runs": 10,
            "balls": 13,
            "minutes": 25,
            "fours": 1,
            "sixes": 0,
            "sr": 76.92
          },
          {
            "name": "Chethan MB",
            "role": "bat",
            "hand": "RHB",
            "dismissal": "b Akash K",
            "runs": 0,
            "balls": 4,
            "minutes": 6,
            "fours": 0,
            "sixes": 0,
            "sr": 0
          },
          {
            "name": "Sharath",
            "role": "bowl",
            "hand": "RHB",
            "dismissal": "c Akash K b Vidya Sagar",
            "runs": 2,
            "balls": 5,
            "minutes": 11,
            "fours": 0,
            "sixes": 0,
            "sr": 40
          },
          {
            "name": "Mahadevaprasad",
            "role": "bat",
            "hand": "RHB",
            "dismissal": "run out Thayaanithi V V / †Gagan Deep",
            "runs": 3,
            "balls": 5,
            "minutes": 13,
            "fours": 0,
            "sixes": 0,
            "sr": 60
          },
          {
            "name": "Maharshi MN",
            "role": "bowl",
            "hand": "RHB",
            "dismissal": "lbw b Vidya Sagar",
            "runs": 0,
            "balls": 1,
            "minutes": 1,
            "fours": 0,
            "sixes": 0,
            "sr": 0
          },
          {
            "name": "Vishnu Suhas Reddy",
            "role": "bowl",
            "hand": "RHB",
            "dismissal": "not out",
            "runs": 1,
            "balls": 6,
            "minutes": 11,
            "fours": 0,
            "sixes": 0,
            "sr": 16.67
          }
        ],
        "didNotBat": [
          "Sathiyapriya"
        ],
        "extras": {
          "total": 37,
          "breakdown": "wd 19, nb 2, b 14, lb 2"
        },
        "bowling": [
          {
            "name": "Chethan Yadav",
            "overs": 3.5,
            "maidens": 0,
            "runs": 22,
            "wickets": 0,
            "dots": 13,
            "fours": 2,
            "sixes": 0,
            "wides": 4,
            "noBalls": 0,
            "economy": 5.74
          },
          {
            "name": "Akash K",
            "overs": 3,
            "maidens": 0,
            "runs": 17,
            "wickets": 1,
            "dots": 14,
            "fours": 2,
            "sixes": 0,
            "wides": 5,
            "noBalls": 1,
            "economy": 5.67
          },
          {
            "name": "Yuvi Yuvi",
            "overs": 1,
            "maidens": 0,
            "runs": 14,
            "wickets": 1,
            "dots": 2,
            "fours": 1,
            "sixes": 0,
            "wides": 2,
            "noBalls": 1,
            "economy": 14
          },
          {
            "name": "Vidya Sagar (c)",
            "overs": 4,
            "maidens": 0,
            "runs": 18,
            "wickets": 4,
            "dots": 16,
            "fours": 2,
            "sixes": 0,
            "wides": 3,
            "noBalls": 0,
            "economy": 4.5
          },
          {
            "name": "Ajay Chandra",
            "overs": 4,
            "maidens": 1,
            "runs": 10,
            "wickets": 1,
            "dots": 17,
            "fours": 0,
            "sixes": 0,
            "wides": 2,
            "noBalls": 0,
            "economy": 2.5
          },
          {
            "name": "Neeraj",
            "overs": 2,
            "maidens": 0,
            "runs": 14,
            "wickets": 1,
            "dots": 3,
            "fours": 1,
            "sixes": 0,
            "wides": 1,
            "noBalls": 0,
            "economy": 7
          },
          {
            "name": "Venki",
            "overs": 2,
            "maidens": 0,
            "runs": 13,
            "wickets": 0,
            "dots": 5,
            "fours": 1,
            "sixes": 0,
            "wides": 1,
            "noBalls": 0,
            "economy": 6.5
          }
        ],
        "fallOfWickets": [
          {
            "score": "18-1",
            "batsman": "Mayur Krishna",
            "overs": "2.5"
          },
          {
            "score": "46-2",
            "batsman": "Dheemanth",
            "overs": "6.3"
          },
          {
            "score": "63-3",
            "batsman": "Manoj Kumar Reddy A",
            "overs": "10.0"
          },
          {
            "score": "94-4",
            "batsman": "Pradyumna Patil",
            "overs": "13.0"
          },
          {
            "score": "100-5",
            "batsman": "Ganesh",
            "overs": "14.4"
          },
          {
            "score": "108-6",
            "batsman": "Chethan MB",
            "overs": "15.5"
          },
          {
            "score": "117-7",
            "batsman": "Shastri",
            "overs": "17.3"
          },
          {
            "score": "118-8",
            "batsman": "Sharath",
            "overs": "17.5"
          },
          {
            "score": "118-9",
            "batsman": "Maharshi MN",
            "overs": "18.0"
          },
          {
            "score": "124-10",
            "batsman": "Mahadevaprasad",
            "overs": "19.5"
          }
        ]
      }
    },
    {
      "id": "cpl-2026-m02",
      "matchNumber": "Match 2",
      "stage": "League Stage",
      "date": "Upcoming (Schedule in 3-4 days)",
      "time": "TBD",
      "ground": "Chanakya Global Campus Cricket Ground",
      "teamA": "Maurya Strikers",
      "teamB": "Rashtrakuta Warriors",
      "status": "Upcoming Match Slot",
      "notice": "Official scorecard & lineup data sync pending (arriving in 3-4 days)."
    }
  ]
};
let activeCplInnings = 'inn1';

function renderSportsCourts() {
  const container = document.getElementById('sports-courts-list');
  if (!container) return;

  const cpl = appState.cplData || EMBEDDED_CPL_DATA;
  const m1 = cpl.matches[0];
  const m2 = cpl.matches[1];

  // 1. Chanakya Premier League (CPL) Featured Showcase
  const cplHtml = `
    <div class="col-span-full space-y-4 mb-3">
      <!-- CPL Header Banner -->
      <div class="glass-card rounded-3xl p-5 border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900/60 to-blue-500/15 shadow-2xl relative overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-lg shadow-amber-500/10">
              🏏
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-white font-outfit">${escapeHtml(cpl.tournament.name)}</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse uppercase">
                  LEAGUE MATCHES
                </span>
              </div>
              <p class="text-xs text-slate-300 font-mono mt-0.5">
                📍 ${escapeHtml(cpl.tournament.ground)}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1.5 font-mono">
              <span>⚡</span> Powered by CricHeroes
            </span>
            <button onclick="openCplStandingsModal()" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition">
              🏆 Standings
            </button>
            <button onclick="openCplSquadsModal()" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition">
              👥 Squads (12s)
            </button>
          </div>
        </div>

        <!-- Featured Match Card (Match 1) -->
        <div class="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <!-- Scores Summary -->
          <div class="lg:col-span-7 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Match 1 • ${m1.date} (${m1.time})</span>
              <span class="text-amber-400 font-bold">${m1.toss}</span>
            </div>

            <!-- Team Scores Box -->
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
              <!-- Magadha Lions -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
                  <span class="text-sm font-black text-white tracking-wide">${m1.teamA}</span>
                  <span class="text-[10px] text-amber-400 font-bold">(1st Inn)</span>
                </div>
                <div class="text-right">
                  <span class="text-base font-black text-amber-400">${m1.summary.magadhaLions.score}/10</span>
                  <span class="text-xs text-slate-400 font-mono">(${m1.summary.magadhaLions.overs} Ov)</span>
                </div>
              </div>

              <!-- Chalukya Challengers -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-850">
                <div class="flex items-center gap-2.5">
                  <span class="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500"></span>
                  <span class="text-sm font-black text-white tracking-wide">${m1.teamB}</span>
                  <span class="text-[10px] text-cyan-400 font-bold">(Target 128)</span>
                </div>
                <div class="text-right">
                  <span class="text-base font-black text-cyan-400">${m1.summary.chalukyaChallengers.score}/10</span>
                  <span class="text-xs text-slate-400 font-mono">(${m1.summary.chalukyaChallengers.overs} Ov)</span>
                </div>
              </div>

              <!-- Match Result Banner -->
              <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span class="text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <span>🎉</span> ${m1.result} (Thrilling Finish!)
                </span>
                <span class="text-amber-400 text-[11px] font-mono">POTM: ${m1.playerOfTheMatch.name} (4 wkts)</span>
              </div>
            </div>

            <!-- Top Performers Pills -->
            <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                🏏 Pradyumna: <b>27 (22)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                🏏 Reyansh: <b>20 (14)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                🏏 Dheemanth: <b>20 (28)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                ⚡ Vidya Sagar: <b>4/18 (4.0)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                ⚡ Mayur Krishna: <b>4/22 (2.4)</b>
              </span>
            </div>
          </div>

          <!-- Quick Action & Upcoming Match Card -->
          <div class="lg:col-span-5 space-y-3">
            <button onclick="openCplScorecardModal('cpl-2026-m01')" class="w-full py-3 px-4 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2">
              <span>📊</span> Open Full CricHeroes Scorecard
            </button>

            <!-- Upcoming Matches Sync Card -->
            <div class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-cyan-400 font-bold uppercase tracking-wider">Next Match 2 (Upcoming):</span>
                <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">CPL League</span>
              </div>
              <div class="flex items-center justify-between font-bold text-white">
                <span>Maurya Strikers</span>
                <span class="text-slate-500 font-mono text-xs">vs</span>
                <span>Rashtrakuta Warriors</span>
              </div>
              <p class="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex items-center gap-1.5">
                <span>📅</span>
                <span>${cpl.tournament.notice}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-3">
        <h4 class="text-sm font-black text-white flex items-center gap-2 font-outfit">
          <span>🏟️</span> Campus Sports Arenas & Court Bookings
        </h4>
        <span class="text-xs text-slate-400 font-mono">Live Slot Reservation</span>
      </div>
    </div>
  `;

  // 2. Sports Court Grid
  const courtsHtml = (appState.sportsCourts || []).map(court => {
    const isAvail = court.available;
    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between hover:border-cyan-500/40 transition">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">${escapeHtml(court.sport)}</span>
            ${court.cplFeatured ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">CPL VENUE</span>' : ''}
          </div>
          <h3 class="text-base font-bold text-white mt-0.5">${escapeHtml(court.name)}</h3>
          <p class="text-xs text-slate-400">📍 ${escapeHtml(court.location)}</p>
          <div class="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>Slots: <b>${court.slots.length} daily</b></span>
            <span>•</span>
            <span class="text-emerald-400 font-semibold">${court.slots.filter(s => s.status.includes('Available') || s.status.includes('Open')).length} Open</span>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2.5">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${isAvail ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}">
            ${isAvail ? 'AVAILABLE' : 'IN USE'}
          </span>
          <button onclick="bookCourtModal('${court.id}', '${escapeHtml(court.name)}')" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition">
            Book Slot
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = cplHtml + courtsHtml;
}

// ----------------------------------------------------------------------------
// CPL MODAL 1: FULL CRICHEROES DIGITAL SCORECARD
// ----------------------------------------------------------------------------
function openCplScorecardModal(matchId) {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  activeCplInnings = 'inn1';

  let modal = document.getElementById('cpl-scorecard-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cpl-scorecard-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto';
    modal.onclick = function(e) { if (e.target === modal) closeCplScorecardModal(); };
    document.body.appendChild(modal);
  }

  modal.innerHTML = getCplScorecardModalHtml(matchId);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCplScorecardModal() {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  const modal = document.getElementById('cpl-scorecard-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function switchCplInningsTab(tabKey, matchId) {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  activeCplInnings = tabKey;
  const modal = document.getElementById('cpl-scorecard-modal');
  if (modal) modal.innerHTML = getCplScorecardModalHtml(matchId || 'cpl-2026-m01');
}

function getCplScorecardModalHtml(matchId) {
  const cpl = appState.cplData || EMBEDDED_CPL_DATA;
  const match = cpl.matches.find(m => m.id === matchId) || cpl.matches[0];
  const inn1 = match.innings1;
  const inn2 = match.innings2;

  return `
    <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- CricHeroes Header -->
      <div class="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏏</span>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base md:text-lg font-black text-white font-outfit">${escapeHtml(cpl.tournament.name)}</h2>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">CricHeroes</span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-0.5">
                ${match.matchNumber} • ${match.date} • ${match.ground}
              </p>
            </div>
          </div>
        </div>
        <button onclick="closeCplScorecardModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition">
          ✕
        </button>
      </div>

      <!-- Match Result & Toss Bar -->
      <div class="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
            🏆 ${match.result}
          </span>
          <span class="text-slate-400">Toss: <b class="text-white">${match.toss}</b></span>
        </div>
        <div class="text-amber-400 font-mono text-[11px]">
          Umpires: ${match.officials.umpires.join(', ')} • Scorer: ${match.officials.scorer}
        </div>
      </div>

      <!-- Innings Switcher Tabs -->
      <div class="px-5 pt-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
        <button onclick="switchCplInningsTab('inn1', '${match.id}')" class="py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeCplInnings === 'inn1' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}">
          <span>🦁</span> 1st Inn: MAGADHA LIONS (${inn1.score})
        </button>
        <button onclick="switchCplInningsTab('inn2', '${match.id}')" class="py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeCplInnings === 'inn2' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}">
          <span>⚔️</span> 2nd Inn: Chalukya Challengers (${inn2.score})
        </button>
      </div>

      <!-- Scorecard Body -->
      <div class="p-5 overflow-y-auto space-y-5 text-xs">
        ${activeCplInnings === 'inn1' ? renderInningsScorecard(inn1, "MAGADHA LIONS", inn1.bowling, "Chalukya Challengers") : renderInningsScorecard(inn2, "Chalukya Challengers", inn2.bowling, "MAGADHA LIONS")}
      </div>
    </div>
  `;
}

function renderInningsScorecard(inn, battingTeam, bowlers, bowlingTeam) {
  return `
    <!-- Batting Table -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-300">Batting — ${battingTeam} (${inn.score}, ${inn.overs} Ov)</h4>
        <span class="text-amber-400 font-mono text-[11px]">CRR: ${inn.crr}</span>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
            <tr>
              <th class="py-2.5 px-3">Batsman</th>
              <th class="py-2.5 px-3">Dismissal</th>
              <th class="py-2.5 px-2 text-right">R</th>
              <th class="py-2.5 px-2 text-right">B</th>
              <th class="py-2.5 px-2 text-right">4s</th>
              <th class="py-2.5 px-2 text-right">6s</th>
              <th class="py-2.5 px-3 text-right">SR</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            ${inn.batting.map(b => `
              <tr class="hover:bg-slate-900/50 transition">
                <td class="py-2 px-3 font-bold text-white whitespace-nowrap">
                  ${escapeHtml(b.name)} <span class="text-[10px] text-slate-500 font-normal">(${b.hand})</span>
                </td>
                <td class="py-2 px-3 text-slate-400 text-[11px]">
                  ${escapeHtml(b.dismissal)}
                </td>
                <td class="py-2 px-2 text-right font-black ${b.runs >= 20 ? 'text-amber-400' : 'text-slate-200'}">${b.runs}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.balls}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.fours}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.sixes}</td>
                <td class="py-2 px-3 text-right text-cyan-400 font-mono">${(Number(b.sr) || 0).toFixed(1)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Extras & Total -->
      <div class="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div>Extras: <b class="text-white">${inn.extras.total}</b> <span class="text-slate-500 font-mono text-[10px]">(${inn.extras.breakdown})</span></div>
        <div>Total: <b class="text-amber-400 text-sm">${inn.score}</b> <span class="text-slate-400">(${inn.overs} Overs, CRR: ${inn.crr})</span></div>
      </div>
    </div>

    <!-- Fall of Wickets -->
    <div class="space-y-1.5 pt-1">
      <span class="text-[10px] uppercase font-bold text-slate-400 font-mono">Fall of Wickets:</span>
      <div class="flex flex-wrap gap-1.5">
        ${inn.fallOfWickets.map(f => `
          <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <b class="text-amber-400">${f.score}</b> (${f.batsman}, ${f.overs} ov)
          </span>
        `).join('')}
      </div>
    </div>

    <!-- Bowling Table -->
    <div class="space-y-2 pt-2">
      <h4 class="text-xs font-black uppercase tracking-wider text-slate-300">Bowling — ${bowlingTeam}</h4>
      <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
            <tr>
              <th class="py-2.5 px-3">Bowler</th>
              <th class="py-2.5 px-2 text-right">O</th>
              <th class="py-2.5 px-2 text-right">M</th>
              <th class="py-2.5 px-2 text-right">R</th>
              <th class="py-2.5 px-2 text-right">W</th>
              <th class="py-2.5 px-2 text-right">0s</th>
              <th class="py-2.5 px-2 text-right">4s</th>
              <th class="py-2.5 px-2 text-right">6s</th>
              <th class="py-2.5 px-2 text-right">WD</th>
              <th class="py-2.5 px-3 text-right">Econ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            ${bowlers.map(b => `
              <tr class="hover:bg-slate-900/50 transition">
                <td class="py-2 px-3 font-bold text-white whitespace-nowrap">${escapeHtml(b.name)}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.overs}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.maidens}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.runs}</td>
                <td class="py-2 px-2 text-right font-black ${b.wickets >= 2 ? 'text-amber-400' : 'text-slate-200'}">${b.wickets}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.dots}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.fours}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.sixes}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">${b.wides}</td>
                <td class="py-2 px-3 text-right text-cyan-400 font-mono">${(Number(b.economy) || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ----------------------------------------------------------------------------
// CPL MODAL 2: PLAYING SQUADS (12-MAN ROSTERS)
// ----------------------------------------------------------------------------
function openCplSquadsModal() {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  let modal = document.getElementById('cpl-squads-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cpl-squads-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto';
    modal.onclick = function(e) { if (e.target === modal) closeCplSquadsModal(); };
    document.body.appendChild(modal);
  }

  const cpl = appState.cplData || EMBEDDED_CPL_DATA;
  const magadha = cpl.teams.find(t => t.id === 'magadha_lions');
  const chalukya = cpl.teams.find(t => t.id === 'chalukya_challengers');

  modal.innerHTML = `
    <div class="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div>
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>👥</span> CPL Season-2 Playing Squads (12s)
          </h3>
          <p class="text-xs text-slate-400 font-mono">Official team lineups from CricHeroes match sheet</p>
        </div>
        <button onclick="closeCplSquadsModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
          ✕
        </button>
      </div>

      <div class="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <!-- Magadha Lions -->
        <div class="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-sm font-black text-amber-400">🦁 ${magadha.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">Captain: ${magadha.captain}</span>
          </div>
          <ol class="space-y-1.5 list-decimal list-inside text-slate-300">
            ${magadha.squad.map(p => `
              <li class="py-1 px-2 rounded bg-slate-900/60 flex items-center justify-between">
                <span class="font-bold text-white">${escapeHtml(p.name)}</span>
                <span class="text-[10px] text-amber-400 font-mono">${escapeHtml(p.role)}</span>
              </li>
            `).join('')}
          </ol>
        </div>

        <!-- Chalukya Challengers -->
        <div class="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-sm font-black text-cyan-400">⚔️ ${chalukya.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">Captain: ${chalukya.captain}</span>
          </div>
          <ol class="space-y-1.5 list-decimal list-inside text-slate-300">
            ${chalukya.squad.map(p => `
              <li class="py-1 px-2 rounded bg-slate-900/60 flex items-center justify-between">
                <span class="font-bold text-white">${escapeHtml(p.name)}</span>
                <span class="text-[10px] text-cyan-400 font-mono">${escapeHtml(p.role)}</span>
              </li>
            `).join('')}
          </ol>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeCplSquadsModal() {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  const modal = document.getElementById('cpl-squads-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// ----------------------------------------------------------------------------
// CPL MODAL 3: TOURNAMENT POINTS TABLE & STANDINGS
// ----------------------------------------------------------------------------
function openCplStandingsModal() {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  let modal = document.getElementById('cpl-standings-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cpl-standings-modal';
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto';
    modal.onclick = function(e) { if (e.target === modal) closeCplStandingsModal(); };
    document.body.appendChild(modal);
  }

  const cpl = appState.cplData || EMBEDDED_CPL_DATA;

  modal.innerHTML = `
    <div class="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div>
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>🏆</span> CPL Season-2 Standings & Points Table
          </h3>
          <p class="text-xs text-slate-400 font-mono">Chanakya Premier League 2026</p>
        </div>
        <button onclick="closeCplStandingsModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
          ✕
        </button>
      </div>

      <div class="p-5 overflow-y-auto space-y-4 text-xs">
        <div class="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/80">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th class="py-2.5 px-3">Team</th>
                <th class="py-2.5 px-2 text-center">P</th>
                <th class="py-2.5 px-2 text-center">W</th>
                <th class="py-2.5 px-2 text-center">L</th>
                <th class="py-2.5 px-2 text-center">Pts</th>
                <th class="py-2.5 px-3 text-right">NRR</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850">
              ${cpl.teams.map((t, idx) => `
                <tr class="hover:bg-slate-900/40 transition">
                  <td class="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span class="w-5 text-slate-500 font-mono text-[11px]">#${idx + 1}</span>
                    <span style="color: ${t.color}">${escapeHtml(t.name)}</span>
                    ${t.status ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Upcoming</span>' : ''}
                  </td>
                  <td class="py-2.5 px-2 text-center text-slate-300 font-mono">${t.matchesPlayed}</td>
                  <td class="py-2.5 px-2 text-center text-emerald-400 font-bold font-mono">${t.won}</td>
                  <td class="py-2.5 px-2 text-center text-rose-400 font-mono">${t.lost}</td>
                  <td class="py-2.5 px-2 text-center font-black text-amber-400 text-sm font-mono">${t.points}</td>
                  <td class="py-2.5 px-3 text-right text-cyan-400 font-mono">${t.netRunRate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-[11px] space-y-1">
          <p class="font-bold text-slate-200">ℹ️ Tournament Progression:</p>
          <p>• Top 2 teams qualify for the Grand CPL Finale at Chanakya Global Campus Cricket Ground.</p>
          <p>• Additional league matches data sync arriving in 3-4 days as upcoming matches conclude.</p>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeCplStandingsModal() {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  const modal = document.getElementById('cpl-standings-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Expose CPL functions globally on window
if (typeof window !== 'undefined') {
  window.openCplScorecardModal = openCplScorecardModal;
  window.closeCplScorecardModal = closeCplScorecardModal;
  window.switchCplInningsTab = switchCplInningsTab;
  window.openCplSquadsModal = openCplSquadsModal;
  window.closeCplSquadsModal = closeCplSquadsModal;
  window.openCplStandingsModal = openCplStandingsModal;
  window.closeCplStandingsModal = closeCplStandingsModal;
}

function bookCourtModal(courtId, courtName) {
  sfx.play('click');
  showToast("Court Slot Booked", `${courtName} reserved for ${appState.currentUser.name} (17:00 - 18:00).`, 'success');
  sfx.play('success');
}

// ============================================================================
// 12. ISSUE MANAGEMENT SERVICE & INCIDENT REPORTER
// ============================================================================
function loadIssues() {
  fetch('/api/issues')
    .then(res => res.json())
    .then(data => {
      appState.issues = data || [];
      renderIssues();
    })
    .catch(err => console.error("Error loading issues:", err));
}

function renderIssues() {
  const container = document.getElementById('issues-list');
  if (!container) return;

  container.innerHTML = appState.issues.map(iss => {
    const statusCol = iss.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      iss.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/30';

    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-3">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                ${iss.id}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                AI Tag: ${escapeHtml(iss.category)}
              </span>
            </div>
            <h3 class="text-base font-bold text-white mt-1.5">${escapeHtml(iss.title)}</h3>
            <p class="text-xs text-slate-300 leading-relaxed mt-1">${escapeHtml(iss.description)}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusCol}">
            ${escapeHtml(iss.status)}
          </span>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2.5">
          <span>📍 Location: <b class="text-slate-200">${escapeHtml(iss.location)}</b></span>
          <span>Reported By: <b class="text-slate-200">${escapeHtml(iss.reportedBy || 'Student')}</b></span>
        </div>
      </div>
    `;
  }).join('');
}

function submitIssueForm() {
  sfx.play('click');
  const title = document.getElementById('issue-title').value.trim();
  const category = document.getElementById('issue-cat').value;
  const location = document.getElementById('issue-location').value;
  const desc = document.getElementById('issue-desc').value.trim();

  if (!title || !desc) {
    showToast("Validation Error", "Please provide a Title and Detailed Description.", 'alert');
    return;
  }

  fetch('/api/issues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      category,
      location,
      description: desc,
      reportedBy: appState.currentUser.name
    })
  })
  .then(res => res.json())
  .then(created => {
    showToast("Ticket Created", `Issue ${created.id} registered! AI auto-routed to Campus Facilities Dispatch.`, 'success');
    sfx.play('success');
    document.getElementById('issue-title').value = '';
    document.getElementById('issue-desc').value = '';
    loadIssues();
  });
}

// ============================================================================
// 13. NOTIFICATIONS SERVICE
// ============================================================================
function loadNotifications() {
  fetch('/api/notifications')
    .then(res => res.json())
    .then(notifs => {
      appState.notifications = notifs;
      renderNotifications();
    })
    .catch(err => console.error("Error loading notifications:", err));
}

function renderNotifications() {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  container.innerHTML = appState.notifications.map(notif => {
    const isEmerg = notif.type === 'emergency';
    const borderCol = isEmerg ? 'border-rose-500/50 bg-rose-950/20' : 'border-slate-700/60';
    const icon = isEmerg ? '🚨' : notif.type === 'event' ? '📅' : '🔔';

    return `
      <div class="glass-card rounded-2xl p-5 border ${borderCol} flex items-start gap-4">
        <div class="text-2xl">${icon}</div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white">${escapeHtml(notif.title)}</h4>
            <span class="text-[10px] font-mono text-slate-400">${escapeHtml(notif.time || 'Just now')}</span>
          </div>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">${escapeHtml(notif.message)}</p>
        </div>
      </div>
    `;
  }).join('');
}

function broadcastAlertModal() {
  sfx.play('click');
  const msg = prompt("Broadcast University Campus Alert:\nEnter message for all students & faculty:", "Attention: Heavy rainfall alert. All outdoor ground activities suspended.");
  if (!msg) return;

  fetch('/api/notifications/broadcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "CAMPUS-WIDE ALERT",
      message: msg,
      type: "emergency",
      targetRoles: ["student", "faculty", "staff", "visitor"]
    })
  })
  .then(res => res.json())
  .then(() => {
    showToast("Alert Broadcasted", "Push notification dispatched via WebSockets to all connected clients.", 'success');
    sfx.play('alert');
  });
}

// ============================================================================
// 14. WHAT-IF SIMULATION SERVICE
// ============================================================================
function runSimulation(scenarioId) {
  sfx.play('click');
  showToast("Running Simulation...", "Executing crowd graph calculation & path divergence algorithms.", 'info');

  fetch('/api/simulation/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenarioId })
  })
  .then(res => res.json())
  .then(result => {
    renderSimulationResult(result);
    sfx.play('success');
  })
  .catch(err => console.error("Sim error:", err));
}

function renderSimulationResult(result) {
  const container = document.getElementById('simulation-results-container');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card rounded-2xl p-6 border border-amber-500/40 space-y-4 tab-content">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono text-amber-400 uppercase tracking-widest">WHAT-IF ENGINE OUTPUT</span>
          <h3 class="text-lg font-extrabold text-white">${escapeHtml(result.scenarioTitle)}</h3>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Simulation Complete
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span class="text-[10px] text-slate-400 uppercase">Avg Commute Delay</span>
          <p class="text-xl font-black text-rose-400 mt-1">${result.metrics.additionalDelayMinutes || '+14 mins'}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span class="text-[10px] text-slate-400 uppercase">Peak Gate Load</span>
          <p class="text-xl font-black text-amber-400 mt-1">${result.metrics.peakGateLoad || '210/min'}</p>
        </div>
        <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span class="text-[10px] text-slate-400 uppercase">Crowd Safety Index</span>
          <p class="text-xl font-black text-emerald-400 mt-1">${result.metrics.safetyIndex || '88%'}</p>
        </div>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        💡 <b>AI Recommendation:</b> ${escapeHtml(result.recommendation || "Activate secondary exit corridor along East Gate 2 to alleviate congestion during peak hours.")}
      </p>
    </div>
  `;
}

// ============================================================================
// 15. ANALYTICS & TELEMETRY CHARTS (HTML5 Canvas)
// ============================================================================
function drawAnalyticsCharts() {
  const c1 = document.getElementById('analytics-canvas') || document.getElementById('chart-crowd-density');
  if (c1) {
    const ctx = c1.getContext('2d');
    const w = c1.width = c1.offsetWidth || 500;
    const h = c1.height = c1.offsetHeight || 180;
    ctx.clearRect(0, 0, w, h);

    const points = [20, 35, 65, 85, 95, 80, 60, 45, 30, 20];
    const step = w / (points.length - 1);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
    grad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    ctx.beginPath();
    ctx.moveTo(0, h);
    points.forEach((p, idx) => {
      const y = h - (p / 100) * (h - 30) - 15;
      if (idx === 0) ctx.lineTo(0, y);
      else ctx.lineTo(idx * step, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke line
    ctx.beginPath();
    points.forEach((p, idx) => {
      const y = h - (p / 100) * (h - 30) - 15;
      if (idx === 0) ctx.moveTo(0, y);
      else ctx.lineTo(idx * step, y);
    });
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Data points & dots
    points.forEach((p, idx) => {
      const x = idx * step;
      const y = h - (p / 100) * (h - 30) - 15;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }
}

// ============================================================================
// 16. AI CAMPUS GUIDE & KNOWLEDGE FEEDING ENGINE (100% OPERATIONAL)
// ============================================================================
function toggleAIChat() {
  sfx.play('click');
  const chatWindow = document.getElementById('ai-chat-window') || document.getElementById('ai-chat-drawer');
  if (chatWindow) {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      const input = document.getElementById('ai-input') || document.getElementById('ai-chat-input');
      if (input) setTimeout(() => input.focus(), 150);
    }
  }
}

function handleAISubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const inputEl = document.getElementById('ai-input') || document.getElementById('ai-chat-input');
  if (inputEl) {
    const val = inputEl.value.trim();
    if (val) {
      sendAIMessage(val);
      inputEl.value = '';
    }
  }
}

function sendAIPredefined(queryText) {
  sendAIMessage(queryText);
}

function sendAIMessage(presetQuery) {
  const inputEl = document.getElementById('ai-input') || document.getElementById('ai-chat-input');
  const query = presetQuery || (inputEl ? inputEl.value.trim() : '');
  if (!query) return;

  sfx.play('click');
  if (inputEl) inputEl.value = '';

  const messagesBox = document.getElementById('ai-messages-container') || document.getElementById('ai-chat-messages');
  if (!messagesBox) return;

  // Make sure chat window is visible if asking via external button
  const chatWindow = document.getElementById('ai-chat-window') || document.getElementById('ai-chat-drawer');
  if (chatWindow && chatWindow.classList.contains('hidden')) {
    chatWindow.classList.remove('hidden');
  }

  // 1. Append User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = "flex justify-end animate-fadeIn";
  userBubble.innerHTML = `
    <div class="chat-bubble-user max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-md bg-amber-500 text-slate-950 font-medium">
      ${escapeHtml(query)}
    </div>
  `;
  messagesBox.appendChild(userBubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // 2. Append AI Loading Bubble
  const aiBubble = document.createElement('div');
  aiBubble.className = "flex justify-start animate-fadeIn";
  aiBubble.innerHTML = `
    <div class="chat-bubble-ai max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md bg-slate-900 border border-slate-700/80 text-slate-200">
      <div class="flex items-center gap-2 text-cyan-400 font-mono">
        <span class="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>Consulting Campus Knowledge...</span>
      </div>
    </div>
  `;
  messagesBox.appendChild(aiBubble);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // 3. Request AI Response
  fetch('/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      role: appState.currentRole
    })
  })
  .then(res => res.json())
  .then(resp => {
    sfx.play('whoosh');
    const bubbleInner = aiBubble.querySelector('.chat-bubble-ai');
    
    // Format answer markdown
    let formattedText = formatAIMarkdown(resp.answer || resp.text || "Here is the information from Chanakya University.");
    
    // Add clickable suggested actions if returned
    let actionsHtml = '';
    if (resp.suggestedActions && resp.suggestedActions.length) {
      actionsHtml = `
        <div class="mt-3 pt-2.5 border-t border-slate-800">
          <span class="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">Suggested Next Steps:</span>
          <div class="flex flex-wrap gap-1.5">
            ${resp.suggestedActions.map(action => `
              <button onclick="sendAIPredefined('${action.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:border-cyan-400 text-[10px] text-cyan-300 border border-slate-700 transition">
                ${escapeHtml(action)} &rarr;
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    bubbleInner.innerHTML = `
      <div class="space-y-2">
        ${formattedText}
        ${actionsHtml}
      </div>
    `;
    messagesBox.scrollTop = messagesBox.scrollHeight;
  })
  .catch(err => {
    console.error("AI chat error:", err);
    const bubbleInner = aiBubble.querySelector('.chat-bubble-ai');
    bubbleInner.innerHTML = `
      <div class="text-rose-400">
        ⚠️ Unable to reach the AI engine right now. Please verify server connectivity or try another query.
      </div>
    `;
  });
}

function formatAIMarkdown(text) {
  if (!text) return '';
  let formatted = escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>')
    .replace(/\n\n/g, '<div class="h-2"></div>')
    .replace(/\n/g, '<br>')
    .replace(/• (.*?)(<br>|$)/g, '<li class="ml-3 list-disc text-slate-300">$1</li>');
  return formatted;
}

// ============================================================================
// 17. AUTHENTICATION & SESSION MANAGEMENT (LOGIN / LOGOUT)
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
    cardId.textContent = `ID: ${user.roll_number || user.student_or_employee_id}`;
  }

  const cardDept = document.querySelectorAll('#student-id-card span.text-slate-300')[0];
  if (cardDept && (user.dept || user.department_name)) cardDept.textContent = user.dept || user.department_name;

  const cardInitials = document.querySelector('#student-id-card .rounded-2xl.bg-gradient-to-tr');
  if (cardInitials && user.name) {
    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    cardInitials.textContent = initials;
  }

  // Refresh High-Privilege Grafana & Architecture Badges
  const isPrivileged = (user.role === 'admin' || user.role === 'faculty' || appState.hasArchitectPrivilege === true);
  
  const navBadge = document.getElementById('grafana-nav-badge');
  if (navBadge) {
    if (isPrivileged) {
      navBadge.textContent = '👑 PRIVILEGED';
      navBadge.className = 'px-1.5 py-0.2 rounded text-[8px] font-mono bg-amber-500/25 text-amber-300 border border-amber-500/50 font-black animate-pulse';
    } else {
      navBadge.textContent = 'ECS351';
      navBadge.className = 'px-1.5 py-0.2 rounded text-[8px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30';
    }
  }

  const archPrivUser = document.getElementById('arch-privilege-user');
  if (archPrivUser) archPrivUser.textContent = `${user.name} (${user.roleLabel || user.role})`;

  const archPrivBadge = document.getElementById('arch-privilege-badge');
  if (archPrivBadge) {
    if (isPrivileged) {
      archPrivBadge.textContent = 'VIP CLEARANCE TIER-1';
      archPrivBadge.className = 'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse';
    } else {
      archPrivBadge.textContent = 'OBSERVER MODE';
      archPrivBadge.className = 'px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700';
    }
  }

  const floatingBadge = document.getElementById('floating-grafana-badge');
  if (floatingBadge) {
    floatingBadge.textContent = isPrivileged ? 'VIP ACCESS' : 'OBSERVER';
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
          roleSel.innerHTML = `<option value="${role}" selected>${appState.currentUser.avatar} ${appState.currentUser.name} (${appState.currentUser.roleLabel})</option>`;
          roleSel.disabled = true;
          roleSel.title = `Authenticated as ${appState.currentUser.name} (${appState.currentUser.roleLabel})`;
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
}

// AI Knowledge Feed Drawer
function openFeedDataModal() {
  sfx.play('click');
  const modal = document.getElementById('ai-feed-data-modal');
  if (modal) modal.classList.remove('hidden');
  loadCustomKnowledgeList();
}

function closeFeedDataModal() {
  const modal = document.getElementById('ai-feed-data-modal');
  if (modal) modal.classList.add('hidden');
}

function loadCustomKnowledgeList() {
  fetch('/api/ai/knowledge')
    .then(res => res.json())
    .then(list => {
      appState.customKnowledgeDocs = list || [];
      const container = document.getElementById('fed-documents-list');
      if (!container) return;

      container.innerHTML = appState.customKnowledgeDocs.map(doc => `
        <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-amber-400">${escapeHtml(doc.title)}</span>
            <span class="text-[10px] font-mono text-slate-500">${escapeHtml(doc.category)}</span>
          </div>
          <p class="text-slate-300 text-[11px] line-clamp-2">${escapeHtml(doc.content)}</p>
        </div>
      `).join('');
    });
}

function submitCustomKnowledgeFeed() {
  const title = document.getElementById('feed-doc-title').value.trim();
  const category = document.getElementById('feed-doc-category').value;
  const content = document.getElementById('feed-doc-content').value.trim();

  if (!content) {
    showToast("Empty Knowledge", "Please paste or type text in the knowledge box.", 'alert');
    return;
  }

  fetch('/api/ai/feed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, content })
  })
  .then(res => res.json())
  .then(res => {
    showToast("Knowledge Fed to AI", "The AI Campus Guide has immediately integrated your knowledge!", 'success');
    sfx.play('success');
    document.getElementById('feed-doc-title').value = '';
    document.getElementById('feed-doc-content').value = '';
    loadCustomKnowledgeList();
  });
}

// ============================================================================
// 17. GLOBAL CLOCK & INITIALIZATION
// ============================================================================
function updateLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

// ============================================================================
// ZERO API KEY & EXPANDED INTERACTIVE FEATURES
// ============================================================================
function openZeroApiKeyModal() {
  const modal = document.getElementById('zero-api-key-modal');
  if (modal) {
    modal.classList.remove('hidden');
    sfx.play('click');
  }
}

function closeZeroApiKeyModal() {
  const modal = document.getElementById('zero-api-key-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function toggleStudentCardFlip() {
  const card = document.getElementById('student-id-card');
  if (card) {
    card.classList.toggle('card-flipped');
    sfx.play('whoosh');
  }
}

function focusLandmark(landmarkId) {
  switchTab('map');
  const lm = appState.landmarks.find(l => l.id === landmarkId);
  if (!lm) return;
  if (appState.mapInstance) {
    appState.mapInstance.setView([lm.lat, lm.lng], 18, { animate: true });
    const marker = appState.mapMarkers[landmarkId];
    if (marker) {
      setTimeout(() => marker.openPopup(), 200);
    }
  }
  showToast("Landmark Located", `Centered on ${lm.shortName || lm.name}`, "success");
}

function drawRouteOnMap(waypoints, color = '#06B6D4') {
  if (!appState.mapInstance || !waypoints || !waypoints.length) return;
  if (appState.routeLayer) {
    appState.mapInstance.removeLayer(appState.routeLayer);
  }
  const latLngs = waypoints.map(w => [w.lat, w.lng]);
  appState.routeLayer = L.polyline(latLngs, {
    color: color,
    weight: 5,
    opacity: 0.9,
    dashArray: '8, 8'
  }).addTo(appState.mapInstance);

  if (appState.routeLayer.getBounds().isValid()) {
    appState.mapInstance.fitBounds(appState.routeLayer.getBounds(), { padding: [50, 50] });
  }
}

function planRouteBetween(fromId, toId, mode = 'pedestrian', strategy = 'shortest') {
  if (!fromId || !toId) {
    showToast("Invalid Route", "Please select both starting point and destination.", "alert");
    return;
  }
  fetch('/api/map/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromId, toId, mode, strategy })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.found || !data.waypoints) {
      showToast("Route Blocked", "No open route found for selected mode and strategy.", "alert");
      return;
    }
    const routeColor = strategy === 'emergency' ? '#EF4444' : (strategy === 'accessible' ? '#10B981' : '#06B6D4');
    drawRouteOnMap(data.waypoints, routeColor);
    sfx.play('success');
    const stratLabel = strategy.toUpperCase().replace('_', ' ');
    showToast(`Route Calculated (${stratLabel})`, `${data.totalDistanceMeters}m • ~${data.estimatedTimeMins} mins via ${data.path.map(p => p.shortName || p.name).join(' ➔ ')}`, 'success');
  });
}

function insertSampleKnowledge(type) {
  const titleEl = document.getElementById('feed-doc-title');
  const catEl = document.getElementById('feed-doc-category');
  const contentEl = document.getElementById('feed-doc-content');
  if (!titleEl || !contentEl) return;

  if (type === 'hostel') {
    titleEl.value = "Nalanda & Takshashila Hostels 2026 Regulations";
    catEl.value = "Hostel";
    contentEl.value = "Night entry curfew is 10:00 PM for all undergraduate scholars. Late pass requests must be submitted through the Campus Connect portal 3 hours in advance. High-speed Wi-Fi 6 is unlimited in all blocks.";
  } else if (type === 'library') {
    titleEl.value = "Central Digital Library Scopus & Pod Access";
    catEl.value = "Library";
    contentEl.value = "Research scholars can book Level 3 Silent Pods for 4-hour slots. IEEE and Scopus databases are accessible on student credentials. The 24/7 reading room remains open during midterm examination weeks.";
  } else if (type === 'conclave') {
    titleEl.value = "TechSangam Hackathon Bay 3 Rules";
    catEl.value = "Events";
    contentEl.value = "ByteCraft Hackathon participants must register their hardware kits at Kalam Tech Park Bay 3 security desk. Power strips and Gigabit LAN ports are provided at all 48 hack stations.";
  }
  showToast("Template Inserted", "Sample knowledge loaded. Click 'Save & Ingest' to test AI Guide immediately!", "info");
}

// ANPR Camera Simulation Ticker
const ANPR_VEHICLES = [
  { plate: "KA-04-MB-2026", type: "EV Campus Buggy #02", speed: "18 km/h", status: "Access Approved" },
  { plate: "KA-50-CU-1042", type: "Student Two-Wheeler", speed: "24 km/h", status: "RFID Validated" },
  { plate: "KA-01-CU-0001", type: "VC Office Green Sedan", speed: "20 km/h", status: "VIP Lane Ingress" },
  { plate: "KA-02-F-8819", type: "Devanahalli Logistics Truck", speed: "15 km/h", status: "Delivery Manifest Logged" }
];
let anprIndex = 0;
function tickANPRCamera() {
  const plateEl = document.getElementById('anpr-plate-display');
  const typeEl = document.getElementById('anpr-type-display');
  const statusEl = document.getElementById('anpr-status-display');
  if (!plateEl) return;
  anprIndex = (anprIndex + 1) % ANPR_VEHICLES.length;
  const v = ANPR_VEHICLES[anprIndex];
  plateEl.textContent = v.plate;
  if (typeEl) typeEl.textContent = `${v.type} • ${v.speed}`;
  if (statusEl) statusEl.textContent = `● ${v.status}`;
}
setInterval(tickANPRCamera, 6000);

document.addEventListener('DOMContentLoaded', () => {
  initRealtimeSocket();
  initAuthSession();
  initCampusMap();

  // Load backend stores
  fetch('/api/config')
    .then(res => res.json())
    .then(cfg => {
      appState.landmarks = cfg.landmarks || [];
      plotLandmarksOnMap();
    });

  loadEvents();
  loadFacilities();
  loadFoodAndSports();
  loadIssues();
  loadNotifications();

  // Setup Clock
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Check URL query for initial role
  const urlParams = new URLSearchParams(window.location.search);
  const initialRole = urlParams.get('role');
  if (initialRole && DEMO_USERS[initialRole]) {
    switchRole(initialRole);
  } else {
    adaptRoleViews();
  }

  const initialTab = urlParams.get('tab');
  if (initialTab) {
    setTimeout(() => switchTab(initialTab), 100);
  }

  // Keyboard shortcut: Escape closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSpotlightModal();
      closeRegisterModal();
      closeDigitalPassModal();
      closeCustomMapModal();
      closeFeedDataModal();
      closeMonthlyMessModal();
      closeIyengarsModal();
      closeWhiteboardPhotoModal();
      closeCplScorecardModal();
      closeCplSquadsModal();
      closeCplStandingsModal();
    }
  });

  console.log("🎓 Chanakya Campus Connect Interactive Dashboard Ready!");
});

// ============================================================================
// SPOTLIGHT OMNIBAR SEARCH (Ctrl+K)
// ============================================================================
function openSpotlightModal() {
  sfx.play('click');
  const modal = document.getElementById('spotlight-modal');
  const input = document.getElementById('spotlight-input');
  if (modal) {
    modal.classList.remove('hidden');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
      handleSpotlightSearch('');
    }
  }
}

function closeSpotlightModal() {
  const modal = document.getElementById('spotlight-modal');
  if (modal) modal.classList.add('hidden');
}

function handleSpotlightSearch(query) {
  const container = document.getElementById('spotlight-results');
  if (!container) return;
  const q = (query || '').toLowerCase().trim();

  let results = [];

  // Search Landmarks
  if (appState.landmarks && appState.landmarks.length > 0) {
    appState.landmarks.forEach(lm => {
      if (!q || lm.name.toLowerCase().includes(q) || (lm.shortName && lm.shortName.toLowerCase().includes(q)) || (lm.category && lm.category.toLowerCase().includes(q))) {
        results.push({
          type: 'Landmark',
          icon: '📍',
          title: lm.name,
          subtitle: lm.category + ' • ' + (lm.openHours || 'Open'),
          action: () => {
            closeSpotlightModal();
            switchTab('map');
            setTimeout(() => focusLandmark(lm.id), 250);
          }
        });
      }
    });
  }

  // Search Events
  if (appState.events && appState.events.length > 0) {
    appState.events.forEach(ev => {
      if (!q || ev.title.toLowerCase().includes(q) || ev.category.toLowerCase().includes(q)) {
        results.push({
          type: 'Event',
          icon: '📅',
          title: ev.title,
          subtitle: ev.category + ' • ' + (ev.venueName || 'Auditorium'),
          action: () => {
            closeSpotlightModal();
            switchTab('events');
          }
        });
      }
    });
  }

  // Search Facilities
  if (appState.facilities && appState.facilities.length > 0) {
    appState.facilities.forEach(fac => {
      if (!q || fac.name.toLowerCase().includes(q) || fac.type.toLowerCase().includes(q)) {
        results.push({
          type: 'Facility',
          icon: '🏛️',
          title: fac.name,
          subtitle: fac.type + ' • Capacity: ' + fac.capacity,
          action: () => {
            closeSpotlightModal();
            switchTab('facilities');
          }
        });
      }
    });
  }

  if (results.length === 0) {
    container.innerHTML = '<div class="p-4 text-center text-slate-400">No campus resources found matching "' + escapeHtml(q) + '".</div>';
    return;
  }

  window._spotlightActions = results.map(r => r.action);

  container.innerHTML = results.slice(0, 8).map((r, idx) => `
    <div onclick="window._spotlightActions[${idx}]()" class="p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition border border-transparent hover:border-amber-500/30 group">
      <div class="flex items-center gap-3">
        <span class="text-base">${r.icon}</span>
        <div>
          <h4 class="text-xs font-bold text-white group-hover:text-amber-400 transition">${escapeHtml(r.title)}</h4>
          <span class="text-[10px] text-slate-400">${escapeHtml(r.subtitle)}</span>
        </div>
      </div>
      <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">${r.type}</span>
    </div>
  `).join('');
}

// Global Spotlight Key Listener
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSpotlightModal();
  }
});


// ============================================================================
// 3D PARALLAX & TILT INTERACTION ENGINE
// ============================================================================
function init3DTiltEffects() {
  const cards = document.querySelectorAll('.bento-card, .glass-card');
  cards.forEach(card => {
    card.classList.add('tilt-3d');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate subtle 3D rotation angles (-7deg to +7deg)
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  });
}

// Enhance Particle Network to 3D Field
function init3DParticleNetwork() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles3D = [];
  const count = 55;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle3D {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = (Math.random() - 0.5) * width * 1.2;
      this.y = (Math.random() - 0.5) * height * 1.2;
      this.z = Math.random() * 800 + 100;
      this.vz = 0.8 + Math.random() * 0.8;
      this.baseColor = Math.random() > 0.5 ? [245, 158, 11] : [6, 182, 212];
    }
    update() {
      this.z -= this.vz;
      if (this.z <= 10) {
        this.reset();
        this.z = 800;
      }
    }
    draw() {
      const fov = 350;
      const scale = fov / (fov + this.z);
      const projX = (this.x * scale) + (width / 2);
      const projY = (this.y * scale) + (height / 2);
      const radius = Math.max(0.6, (1 - this.z / 800) * 2.8);
      const alpha = Math.max(0.08, (1 - this.z / 800) * 0.7);

      if (projX < 0 || projX > width || projY < 0 || projY > height) return;

      ctx.beginPath();
      ctx.arc(projX, projY, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor[0]}, ${this.baseColor[1]}, ${this.baseColor[2]}, ${alpha})`;
      ctx.shadowBlur = 10 * scale;
      ctx.shadowColor = `rgba(${this.baseColor[0]}, ${this.baseColor[1]}, ${this.baseColor[2]}, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) {
    particles3D.push(new Particle3D());
  }

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles3D) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}


// ============================================================================
// THREE.JS INTERACTIVE 3D CAMPUS DIGITAL TWIN ENGINE
// ============================================================================
let threeScene, threeCamera, threeRenderer, threeAnimationId, threeControls;
let buildingGroup;
let isDragging3D = false;
let previousMousePosition = { x: 0, y: 0 };

function initThreeJSCampusLegacy() {
  const container = document.getElementById('threejs-canvas-wrapper');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 288;

  // Scene setup
  threeScene = new THREE.Scene();
  threeScene.fog = new THREE.FogExp2(0x070B14, 0.003);

  // Camera setup
  threeCamera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
  threeCamera.position.set(0, 180, 320);
  threeCamera.lookAt(0, 20, 0);

  // WebGL Renderer
  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.shadowMap.enabled = true;
  container.innerHTML = '';
  container.appendChild(threeRenderer.domElement);

  // Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  threeScene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xF59E0B, 1.2);
  dirLight.position.set(120, 200, 80);
  threeScene.add(dirLight);

  const cyanLight = new THREE.DirectionalLight(0x06B6D4, 0.9);
  cyanLight.position.set(-120, 150, -80);
  threeScene.add(cyanLight);

  // Ground Grid & Concentric Rings (Chanakya Academic Circle Quad)
  const gridHelper = new THREE.GridHelper(500, 40, 0x1E293B, 0x0F172A);
  gridHelper.position.y = 0;
  threeScene.add(gridHelper);

  // Concentric Walkway Rings
  for (let r of [50, 90, 140]) {
    const ringGeo = new THREE.RingGeometry(r - 1.5, r + 1.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B, opacity: 0.35, transparent: true, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.5;
    threeScene.add(ringMesh);
  }

  // Buildings Group
  buildingGroup = new THREE.Group();
  threeScene.add(buildingGroup);

  // Central Fountain/Plaza Monument
  const monumentGeo = new THREE.CylinderGeometry(12, 16, 25, 32);
  const monumentMat = new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x78350F,
    emissiveIntensity: 0.4
  });
  const monument = new THREE.Mesh(monumentGeo, monumentMat);
  monument.position.set(0, 12.5, 0);
  buildingGroup.add(monument);

  // Academic Buildings Representation
  const campusBlocks = [
    { name: "Academic Block 1 (Law & Admin)", x: -75, z: 40, w: 55, h: 38, d: 35, color: 0xF59E0B },
    { name: "Academic Block 2 (AI & Computing)", x: 75, z: 40, w: 60, h: 48, d: 40, color: 0x06B6D4 },
    { name: "Grand Auditorium", x: 0, z: -85, w: 70, h: 32, d: 50, color: 0x8B5CF6 },
    { name: "Nalanda Hostels Zone", x: -110, z: -60, w: 45, h: 55, d: 35, color: 0x10B981 },
    { name: "Annapurna Food Pavilion", x: 110, z: -60, w: 50, h: 26, d: 45, color: 0xFBBF24 },
    { name: "Olympic Stadium Arena", x: 140, z: 60, w: 65, h: 18, d: 50, color: 0x3B82F6 }
  ];

  campusBlocks.forEach(b => {
    const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const mat = new THREE.MeshStandardMaterial({
      color: b.color,
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.88
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(b.x, b.h / 2, b.z);
    
    // Add wireframe edge glow
    const edgeGeo = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.4, transparent: true });
    const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
    mesh.add(wireframe);

    buildingGroup.add(mesh);
  });

  // Floating Pulse Marker on TechSangam Venue
  const markerGeo = new THREE.ConeGeometry(5, 14, 16);
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
  const pulseMarker = new THREE.Mesh(markerGeo, markerMat);
  pulseMarker.position.set(0, 50, -85);
  pulseMarker.rotation.x = Math.PI;
  buildingGroup.add(pulseMarker);

  // Mouse Interaction (Orbit / Rotate)
  const dom = threeRenderer.domElement;
  dom.addEventListener('mousedown', (e) => {
    isDragging3D = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging3D = false;
  });

  dom.addEventListener('mousemove', (e) => {
    if (!isDragging3D || !buildingGroup) return;
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    buildingGroup.rotation.y += deltaX * 0.007;
    threeCamera.position.y = Math.max(60, Math.min(300, threeCamera.position.y - deltaY * 0.5));
    threeCamera.lookAt(0, 20, 0);

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  // Wheel Zoom
  dom.addEventListener('wheel', (e) => {
    e.preventDefault();
    threeCamera.position.z = Math.max(140, Math.min(500, threeCamera.position.z + e.deltaY * 0.2));
  }, { passive: false });

  // Window Resize
  window.addEventListener('resize', () => {
    if (!container || !threeRenderer || !threeCamera) return;
    const w = container.clientWidth;
    const h = container.clientHeight || 288;
    threeCamera.aspect = w / h;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(w, h);
  });

  // Animation Loop
  function animate3D() {
    threeAnimationId = requestAnimationFrame(animate3D);

    // Subtle idle slow rotation when not dragging
    if (!isDragging3D && buildingGroup) {
      buildingGroup.rotation.y += 0.002;
    }

    // Pulse the venue marker
    if (pulseMarker) {
      pulseMarker.position.y = 48 + Math.sin(Date.now() * 0.004) * 4;
    }

    threeRenderer.render(threeScene, threeCamera);
  }

  animate3D();
}

function initThreeJSCampus() {
  const container = document.getElementById('threejs-canvas-wrapper');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 390;
  threeScene = new THREE.Scene();
  threeScene.background = new THREE.Color(0x122831);
  threeScene.fog = new THREE.Fog(0x122831, 420, 900);

  threeCamera = new THREE.PerspectiveCamera(38, width / height, 1, 1600);
  threeCamera.position.set(0, 330, 180);
  threeCamera.lookAt(0, -4, 0);

  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeRenderer.shadowMap.enabled = true;
  threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(threeRenderer.domElement);

  threeScene.add(new THREE.HemisphereLight(0xffffff, 0x8fc8c7, 1.8));
  const sun = new THREE.DirectionalLight(0xffd28a, 2.2);
  sun.position.set(-180, 300, 180);
  sun.castShadow = true;
  threeScene.add(sun);
  const fill = new THREE.DirectionalLight(0x6ddce5, 1.2);
  fill.position.set(220, 120, -180);
  threeScene.add(fill);

  const campus = new THREE.Group();
  buildingGroup = campus;
  // Match the broad portrait-style footprint of the aerial reference inside
  // the dashboard's landscape viewport.
  campus.scale.set(1.52, 1, 1.08);
  threeScene.add(campus);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(128, 116, 8, 64),
    new THREE.MeshStandardMaterial({ color: 0x213b43, roughness: 0.58, metalness: 0.18 })
  );
  platform.position.y = -18;
  platform.castShadow = true;
  platform.receiveShadow = true;
  campus.add(platform);

  const platformEdge = new THREE.Mesh(
    new THREE.TorusGeometry(118, 2.4, 12, 96),
    new THREE.MeshBasicMaterial({ color: 0x16b8b3 })
  );
  platformEdge.rotation.x = Math.PI / 2;
  platformEdge.position.y = -11;
  campus.add(platformEdge);

  [45, 78, 112].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, index === 2 ? 1.5 : 1, 8, 100),
      new THREE.MeshBasicMaterial({ color: index === 1 ? 0xff876f : 0x63cfcb, transparent: true, opacity: 0.78 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -10 + index * 2;
    campus.add(ring);
  });

  const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xc77d68, roughness: 0.46, metalness: 0.08 });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: 0x8d4e47, roughness: 0.34, metalness: 0.18 });
  const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x38aeb2, roughness: 0.16, metalness: 0.45, emissive: 0x0a6770, emissiveIntensity: 0.22 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xe9ddc8, roughness: 0.3, metalness: 0.22 });
  const coralMaterial = new THREE.MeshStandardMaterial({ color: 0xe88b6f, roughness: 0.4, metalness: 0.12 });
  const gardenMaterial = new THREE.MeshStandardMaterial({ color: 0x4c9d78, roughness: 0.92 });

  const addBox = (group, size, position, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const mainHall = new THREE.Group();
  campus.add(mainHall);
  addBox(mainHall, [74, 52, 34], [0, 18, 12], buildingMaterial);
  addBox(mainHall, [50, 18, 3], [0, 48, -6], roofMaterial);
  addBox(mainHall, [58, 42, 4], [0, 20, -7], glassMaterial);

  [-28, -14, 14, 28].forEach(x => {
    addBox(mainHall, [4, 47, 5], [x, 18, -10], trimMaterial);
  });

  const leftWing = new THREE.Group();
  const rightWing = new THREE.Group();
  campus.add(leftWing, rightWing);
  addBox(leftWing, [66, 39, 30], [-70, 13, 25], buildingMaterial);
  addBox(rightWing, [66, 39, 30], [70, 13, 25], buildingMaterial);
  addBox(leftWing, [70, 4, 34], [-70, 36, 25], roofMaterial);
  addBox(rightWing, [70, 4, 34], [70, 36, 25], roofMaterial);
  addBox(leftWing, [52, 28, 3], [-70, 13, 9], glassMaterial);
  addBox(rightWing, [52, 28, 3], [70, 13, 9], glassMaterial);

  [-70, 70].forEach(x => {
    [-82, -65, -48, -31].forEach(z => addBox(campus, [9, 5, 5], [x, 39, z], glassMaterial));
  });

  const tower = new THREE.Group();
  campus.add(tower);
  addBox(tower, [30, 70, 24], [0, 27, -40], buildingMaterial);
  addBox(tower, [20, 60, 3], [0, 26, -28], glassMaterial);
  const towerRoof = new THREE.Mesh(new THREE.ConeGeometry(24, 20, 4), roofMaterial);
  towerRoof.position.set(0, 72, -40);
  towerRoof.rotation.y = Math.PI / 4;
  towerRoof.castShadow = true;
  tower.add(towerRoof);

  // Keep the original blocks as data-compatible fallbacks, but let the cleaner
  // curved campus model carry the visible composition.
  leftWing.visible = false;
  rightWing.visible = false;
  tower.visible = false;

  const sign = addBox(campus, [46, 8, 2], [0, 45, -27], trimMaterial);
  sign.rotation.x = -0.04;

  // Front portico and flag reference the real Chanakya facade used across the app.
  const porticoColumns = new THREE.Group();
  campus.add(porticoColumns);
  [-22, -11, 0, 11, 22].forEach(x => {
    const column = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 28, 16), buildingMaterial);
    column.position.set(x, 12, 31);
    column.castShadow = true;
    porticoColumns.add(column);
  });
  addBox(porticoColumns, [58, 4, 10], [0, 27, 31], trimMaterial);
  addBox(porticoColumns, [66, 3, 15], [0, -1, 31], trimMaterial);

  const flagPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1.1, 82, 12),
    new THREE.MeshStandardMaterial({ color: 0xb7a889, metalness: 0.65, roughness: 0.28 })
  );
  flagPole.position.set(0, 34, 36);
  campus.add(flagPole);
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 11),
    new THREE.MeshBasicMaterial({ color: 0xffb84d, side: THREE.DoubleSide })
  );
  flag.position.set(9, 67, 36);
  flag.rotation.y = Math.PI / 2;
  campus.add(flag);

  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(34, 34, 1.8, 64),
    new THREE.MeshStandardMaterial({ color: 0xd9b8a9, roughness: 0.82 })
  );
  plaza.position.set(0, -10, 0);
  campus.add(plaza);
  const fountain = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 11, 9, 32),
    new THREE.MeshStandardMaterial({ color: 0xa6cdd0, roughness: 0.18, metalness: 0.35 })
  );
  fountain.position.set(0, -4, 0);
  campus.add(fountain);

  const gardenRing = new THREE.Mesh(
    new THREE.TorusGeometry(47, 7, 8, 96),
    gardenMaterial
  );
  gardenRing.rotation.x = Math.PI / 2;
  gardenRing.position.y = -8.5;
  campus.add(gardenRing);

  const aerialWingMaterial = new THREE.MeshStandardMaterial({ color: 0xe6b27f, roughness: 0.62, metalness: 0.06 });
  const aerialRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xe7ece5, roughness: 0.48, metalness: 0.08 });
  [[-65, -5, -0.16], [65, -5, 0.16], [0, -74, 0]].forEach(([x, z, rotation]) => {
    const wing = new THREE.Group();
    wing.position.set(x, -3, z);
    wing.rotation.y = rotation;
    const body = new THREE.Mesh(new THREE.BoxGeometry(72, 18, 24), aerialWingMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    wing.add(body);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(78, 3, 28), aerialRoofMaterial);
    roof.position.y = 10;
    roof.castShadow = true;
    wing.add(roof);
    for (let index = -2; index <= 2; index += 1) {
      const windowStrip = new THREE.Mesh(new THREE.BoxGeometry(9, 5, 1.2), glassMaterial);
      windowStrip.position.set(index * 13, 1, 12.4);
      wing.add(windowStrip);
    }
    campus.add(wing);
  });

  // Curved academic wings recreate the three-sided ring from the aerial reference.
  const curvedWingShape = new THREE.Shape();
  curvedWingShape.moveTo(-48, -12);
  curvedWingShape.quadraticCurveTo(0, 18, 48, -12);
  curvedWingShape.lineTo(43, -18);
  curvedWingShape.quadraticCurveTo(0, 8, -43, -18);
  curvedWingShape.closePath();
  const curvedWingGeometry = new THREE.ExtrudeGeometry(curvedWingShape, {
    depth: 18,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 2,
    bevelThickness: 2
  });
  curvedWingGeometry.rotateX(-Math.PI / 2);
  [[0, 19, -58, 0], [-75, 14, 8, -0.95], [75, 14, 8, 0.95]].forEach(([x, y, z, rotation]) => {
    const wing = new THREE.Mesh(curvedWingGeometry, buildingMaterial);
    wing.position.set(x, y, z);
    wing.rotation.y = rotation;
    wing.castShadow = true;
    wing.receiveShadow = true;
    campus.add(wing);
  });

  const entrySteps = new THREE.Group();
  campus.add(entrySteps);
  [0, 1, 2, 3].forEach(step => {
    addBox(entrySteps, [74 - step * 10, 3, 12], [0, -8 + step * 3, 54 - step * 8], step % 2 ? trimMaterial : roofMaterial);
  });

  const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x43bf83, roughness: 0.8 });
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x9a684b, roughness: 1 });
  [[-112, 12], [112, 12], [-120, -36], [120, -36], [-42, -70], [42, -70]].forEach(([x, z]) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2, 3, 18, 10), trunkMaterial);
    trunk.position.y = 2;
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(14, 1), treeMaterial);
    crown.position.y = 17;
    crown.castShadow = true;
    tree.add(trunk, crown);
    tree.position.set(x, -8, z);
    campus.add(tree);
  });

  const pulseMarker = new THREE.Mesh(
    new THREE.SphereGeometry(5, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xff645d })
  );
  pulseMarker.position.set(0, 91, -40);
  campus.add(pulseMarker);

  // Replace the earlier prototypes with one clean radial campus composition.
  campus.children.forEach(child => { child.visible = false; });
  const radialCampus = new THREE.Group();
  campus.add(radialCampus);

  const radialBase = new THREE.Mesh(
    new THREE.CylinderGeometry(126, 118, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0x29494b })
  );
  radialBase.position.y = -13;
  radialBase.receiveShadow = true;
  radialCampus.add(radialBase);

  const lawn = new THREE.Mesh(
    new THREE.CylinderGeometry(91, 91, 1.5, 64),
    new THREE.MeshBasicMaterial({ color: 0x4f986c })
  );
  lawn.position.y = -8.5;
  radialCampus.add(lawn);

  [36, 58, 82].forEach((radius, index) => {
    const pathRing = new THREE.Mesh(
      new THREE.TorusGeometry(radius, index === 1 ? 7 : 3.2, 8, 96),
      new THREE.MeshBasicMaterial({ color: index === 1 ? 0xd8b6a5 : 0xf0e6d0 })
    );
    pathRing.rotation.x = Math.PI / 2;
    pathRing.position.y = -7.3;
    radialCampus.add(pathRing);
  });

  const radialBody = new THREE.MeshBasicMaterial({ color: 0xd98d72 });
  const radialRoof = new THREE.MeshBasicMaterial({ color: 0xf1dfc1 });
  const radialAccent = new THREE.MeshBasicMaterial({ color: 0xb85f53 });
  const radialGlass = new THREE.MeshBasicMaterial({ color: 0x36b9bd });

  [0, 2.25, 4.5].forEach((rotation, wingIndex) => {
    const wing = new THREE.Group();
    const arc = new THREE.Mesh(new THREE.TorusGeometry(78, 15, 10, 48, 1.28), radialBody);
    arc.rotation.x = Math.PI / 2;
    arc.rotation.y = rotation;
    arc.position.y = 9;
    arc.castShadow = true;
    wing.add(arc);

    const roofArc = new THREE.Mesh(new THREE.TorusGeometry(78, 17, 8, 48, 1.28), radialRoof);
    roofArc.rotation.x = Math.PI / 2;
    roofArc.rotation.y = rotation;
    roofArc.position.y = 27;
    roofArc.castShadow = true;
    wing.add(roofArc);

    for (let windowIndex = 0; windowIndex < 6; windowIndex += 1) {
      const angle = rotation - 0.58 + windowIndex * 0.23;
      const windowPanel = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 2), radialGlass);
      windowPanel.position.set(Math.cos(angle) * 78, 11, Math.sin(angle) * 78);
      windowPanel.rotation.y = -angle;
      wing.add(windowPanel);
    }

    const accent = new THREE.Mesh(new THREE.TorusGeometry(78, 2.2, 6, 48, 1.28), radialAccent);
    accent.rotation.x = Math.PI / 2;
    accent.rotation.y = rotation;
    accent.position.y = 23;
    wing.add(accent);
    radialCampus.add(wing);
  });

  const radialFountain = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 16, 12, 32),
    new THREE.MeshBasicMaterial({ color: 0xbfd8d2 })
  );
  radialFountain.position.y = 0;
  radialCampus.add(radialFountain);

  const radialEntry = new THREE.Group();
  for (let step = 0; step < 4; step += 1) {
    addBox(radialEntry, [62 - step * 8, 3, 10], [0, -7 + step * 3, 96 - step * 8], step % 2 ? radialAccent : radialRoof);
  }
  radialCampus.add(radialEntry);

  const cleanMarker = new THREE.Mesh(new THREE.SphereGeometry(5, 24, 24), new THREE.MeshBasicMaterial({ color: 0xff806b }));
  cleanMarker.position.set(0, 54, 0);
  radialCampus.add(cleanMarker);
  radialCampus.scale.setScalar(0.74);

  radialCampus.visible = false;

  // Final reference-faithful model: four separated curved academic blocks around
  // the circular lawn, with the larger terraced block facing the viewer.
  const referenceCampus = new THREE.Group();
  campus.add(referenceCampus);
  const referenceGround = new THREE.Mesh(
    new THREE.CylinderGeometry(148, 138, 7, 64),
    new THREE.MeshBasicMaterial({ color: 0x203c42 })
  );
  referenceGround.position.y = -16;
  referenceCampus.add(referenceGround);

  const referenceLawn = new THREE.Mesh(
    new THREE.CylinderGeometry(108, 108, 1.5, 64),
    new THREE.MeshBasicMaterial({ color: 0x438a60 })
  );
  referenceLawn.position.y = -12;
  referenceCampus.add(referenceLawn);

  [42, 68, 94].forEach((radius, index) => {
    const path = new THREE.Mesh(
      new THREE.TorusGeometry(radius, index === 1 ? 7 : 3.5, 8, 96),
      new THREE.MeshBasicMaterial({ color: index === 1 ? 0xd6afa0 : 0xe5e1c9 })
    );
    path.rotation.x = Math.PI / 2;
    path.position.y = -10.5;
    referenceCampus.add(path);
  });

  const refBodyMaterial = new THREE.MeshBasicMaterial({ color: 0xe7dac2 });
  const refRoofMaterial = new THREE.MeshBasicMaterial({ color: 0xf7f1e5 });
  const refTerracottaMaterial = new THREE.MeshBasicMaterial({ color: 0xc86e59 });
  const refGlassMaterial = new THREE.MeshBasicMaterial({ color: 0x35aeb0 });

  function createReferenceWing(angle, width, height, roofDepth) {
    const outerRadius = 91;
    const innerRadius = outerRadius - width;
    const arc = 1.18;
    const shape = new THREE.Shape();
    const segments = 18;
    for (let index = 0; index <= segments; index += 1) {
      const theta = -arc / 2 + (arc * index) / segments;
      const x = Math.cos(theta) * outerRadius;
      const y = Math.sin(theta) * outerRadius;
      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    for (let index = segments; index >= 0; index -= 1) {
      const theta = -arc / 2 + (arc * index) / segments;
      shape.lineTo(Math.cos(theta) * innerRadius, Math.sin(theta) * innerRadius);
    }
    shape.closePath();

    const buildingGeometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
    buildingGeometry.rotateX(-Math.PI / 2);
    const building = new THREE.Mesh(buildingGeometry, refBodyMaterial);
    building.position.y = -9;
    building.rotation.y = angle;
    building.castShadow = true;
    referenceCampus.add(building);

    const roofGeometry = new THREE.ExtrudeGeometry(shape, { depth: roofDepth, bevelEnabled: false });
    roofGeometry.rotateX(-Math.PI / 2);
    const roof = new THREE.Mesh(roofGeometry, refRoofMaterial);
    roof.position.y = height - 7;
    roof.rotation.y = angle;
    roof.castShadow = true;
    referenceCampus.add(roof);

    for (let index = 0; index < 7; index += 1) {
      const theta = -arc / 2 + 0.12 + index * 0.16;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(8, height * 0.44, 2), index % 3 === 0 ? refTerracottaMaterial : refGlassMaterial);
      const panelRadius = innerRadius - 1.5;
      panel.position.set(Math.cos(theta + angle) * panelRadius, height * 0.37 - 9, Math.sin(theta + angle) * panelRadius);
      panel.rotation.y = -(theta + angle);
      referenceCampus.add(panel);
    }
  }

  createReferenceWing(Math.PI / 2, 28, 30, 6);
  createReferenceWing(Math.PI, 30, 26, 6);
  createReferenceWing(0, 30, 26, 6);
  createReferenceWing(-Math.PI / 2, 38, 34, 7);

  const referenceFountain = new THREE.Mesh(new THREE.CylinderGeometry(13, 17, 10, 32), refGlassMaterial);
  referenceFountain.position.y = -3;
  referenceCampus.add(referenceFountain);
  const referenceMonument = new THREE.Mesh(new THREE.CylinderGeometry(3, 5, 28, 20), refRoofMaterial);
  referenceMonument.position.y = 16;
  referenceCampus.add(referenceMonument);

  for (let step = 0; step < 5; step += 1) {
    const entry = new THREE.Mesh(new THREE.BoxGeometry(70 - step * 8, 3, 10), step % 2 ? refTerracottaMaterial : refRoofMaterial);
    entry.position.set(0, -10 + step * 3, -112 + step * 8);
    referenceCampus.add(entry);
  }
  referenceCampus.scale.setScalar(0.82);

  const dom = threeRenderer.domElement;
  dom.addEventListener('mousedown', (event) => {
    isDragging3D = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });
  window.addEventListener('mouseup', () => { isDragging3D = false; });
  dom.addEventListener('mousemove', (event) => {
    if (!isDragging3D || !buildingGroup) return;
    buildingGroup.rotation.y += (event.clientX - previousMousePosition.x) * 0.006;
    threeCamera.position.y = Math.max(70, Math.min(280, threeCamera.position.y - (event.clientY - previousMousePosition.y) * 0.45));
    threeCamera.lookAt(0, -4, 0);
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });
  dom.addEventListener('wheel', (event) => {
    event.preventDefault();
    threeCamera.position.z = Math.max(180, Math.min(500, threeCamera.position.z + event.deltaY * 0.25));
  }, { passive: false });

  window.addEventListener('resize', () => {
    if (!container || !threeRenderer || !threeCamera) return;
    const nextWidth = container.clientWidth;
    const nextHeight = container.clientHeight || 390;
    threeCamera.aspect = nextWidth / nextHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(nextWidth, nextHeight);
  });

  const animate3D = () => {
    threeAnimationId = requestAnimationFrame(animate3D);
    if (!isDragging3D && buildingGroup) buildingGroup.rotation.y += 0.0015;
    if (buildingGroup) buildingGroup.position.y = Math.sin(Date.now() * 0.0015) * 4;
    pulseMarker.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.2);
    threeRenderer.render(threeScene, threeCamera);
  };
  animate3D();
}

function initBlenderCampus() {
  const container = document.getElementById('threejs-canvas-wrapper');
  if (!container || typeof THREE === 'undefined' || !THREE.GLTFLoader || !THREE.OrbitControls) return;

  if (threeAnimationId) cancelAnimationFrame(threeAnimationId);
  container.innerHTML = '';
  const width = container.clientWidth || 900;
  const height = container.clientHeight || 560;
  threeScene = new THREE.Scene();
  threeScene.background = new THREE.Color(0x102329);
  threeCamera = new THREE.PerspectiveCamera(34, width / height, 0.1, 5000);
  threeCamera.position.set(260, 220, 280);

  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  threeRenderer.setSize(width, height);
  threeRenderer.outputEncoding = THREE.sRGBEncoding;
  threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  threeRenderer.toneMappingExposure = 0.92;
  threeRenderer.shadowMap.enabled = true;
  threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(threeRenderer.domElement);
  threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
  threeControls.enableDamping = true;
  threeControls.dampingFactor = 0.075;
  threeControls.enablePan = true;
  threeControls.screenSpacePanning = true;
  threeControls.minDistance = 90;
  threeControls.maxDistance = 900;
  threeControls.minPolarAngle = 0.12;
  threeControls.maxPolarAngle = Math.PI * 0.49;
  threeControls.autoRotate = false;
  threeControls.target.set(0, 0, 0);

  threeScene.add(new THREE.HemisphereLight(0xbfe8e5, 0x34524a, 1.55));
  const keyLight = new THREE.DirectionalLight(0xffe0b6, 2.2);
  keyLight.position.set(-260, 460, 220);
  keyLight.castShadow = true;
  threeScene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0x8ad9e8, 1.05);
  fillLight.position.set(280, 240, -280);
  threeScene.add(fillLight);

  buildingGroup = new THREE.Group();
  threeScene.add(buildingGroup);
  const loader = new THREE.GLTFLoader();
  loader.load('/assets/models/chanakya_university_3d_campus.glb', gltf => {
    const model = gltf.scene;
    // This Blender export is Z-up with the campus plan on its XY plane.
    model.rotation.x = -Math.PI / 2;
    model.traverse(node => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material.side = THREE.DoubleSide;
          if ('envMapIntensity' in node.material) node.material.envMapIntensity = 0.8;
        }
      }
    });
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const largestDimension = Math.max(size.x, size.y, size.z);
    const scale = 230 / largestDimension;
    model.scale.setScalar(scale);
    buildingGroup.add(model);
    const normalizedBounds = new THREE.Box3().setFromObject(buildingGroup);
    const normalizedSize = normalizedBounds.getSize(new THREE.Vector3());
    const distance = Math.max(normalizedSize.x, normalizedSize.z) * 1.18;
    threeCamera.position.set(distance * 0.9, distance * 0.72, distance * 0.9);
    threeControls.target.set(0, 0, 0);
    threeControls.update();
  }, undefined, error => {
    console.error('Unable to load Blender campus model:', error);
  });

  window.addEventListener('resize', () => {
    if (!threeRenderer || !threeCamera) return;
    const nextWidth = container.clientWidth || 900;
    const nextHeight = container.clientHeight || 560;
    threeCamera.aspect = nextWidth / nextHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(nextWidth, nextHeight);
  });

  const animate3D = () => {
    threeAnimationId = requestAnimationFrame(animate3D);
    if (threeControls) threeControls.update();
    threeRenderer.render(threeScene, threeCamera);
  };
  animate3D();
}

/*
 * Reference-faithful procedural fallback retained for development/export
 * comparison, but the live dashboard uses the Blender GLB above.
 */
function initProceduralThreeJSCampus() {
  const container = document.getElementById('threejs-canvas-wrapper');
  if (!container || typeof THREE === 'undefined') return;

  if (threeAnimationId) cancelAnimationFrame(threeAnimationId);
  container.innerHTML = '';

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 390;
  threeScene = new THREE.Scene();
  threeScene.background = new THREE.Color(0x08151b);
  threeScene.fog = new THREE.Fog(0x08151b, 430, 1050);

  threeCamera = new THREE.PerspectiveCamera(42, width / height, 1, 2200);
  // The reference is an aerial masterplan, so keep the default view almost
  // orthographic in composition while retaining perspective depth.
  threeCamera.position.set(0, 610, 28);
  threeCamera.lookAt(0, -4, -18);

  threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  threeRenderer.setSize(width, height);
  threeRenderer.shadowMap.enabled = true;
  threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(threeRenderer.domElement);

  threeScene.add(new THREE.HemisphereLight(0x8ab7ba, 0x071014, 1.35));
  const keyLight = new THREE.DirectionalLight(0xffd5ad, 2.4);
  keyLight.position.set(-220, 360, 240);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  threeScene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x42d1d3, 1.4);
  rimLight.position.set(260, 180, -220);
  threeScene.add(rimLight);

  const mat = (color, roughness = 0.7, metalness = 0.05) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const terrainMat = mat(0x17363b, 0.95);
  const lawnMat = mat(0x27634f, 0.9);
  const lawnLightMat = mat(0x3c8761, 0.86);
  const waterMat = mat(0x167f94, 0.18, 0.2);
  const roadMat = mat(0x1a252a, 0.95);
  const creamMat = mat(0xd9d3c0, 0.45);
  const whiteRoofMat = mat(0xe7e1d2, 0.32);
  const terracottaMat = mat(0x9e5549, 0.55);
  const terracottaLightMat = mat(0xc4745c, 0.48);
  const glassMat = mat(0x2c9eaa, 0.18, 0.38);
  const goldMat = mat(0xd6a65b, 0.32, 0.35);
  const treeMat = mat(0x3d9a62, 0.9);
  const trunkMat = mat(0x6b4b35, 1);

  const campus = new THREE.Group();
  buildingGroup = campus;
  campus.scale.set(1.52, 1, 1.08);
  threeScene.add(campus);

  const box = (group, size, position, material, bevel = 0) => {
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const disc = (radius, depth, y, material, segments = 64) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, segments), material);
    mesh.position.y = y;
    mesh.receiveShadow = true;
    campus.add(mesh);
    return mesh;
  };

  const ground = box(campus, [390, 8, 560], [0, -18, -20], terrainMat);
  ground.receiveShadow = true;
  box(campus, [338, 1, 510], [0, -13.5, -20], lawnMat);

  // Lake and sports complex at the rear-left of the reference.
  const lake = new THREE.Mesh(new THREE.CylinderGeometry(76, 76, 2, 48), waterMat);
  lake.scale.z = 1.3;
  lake.rotation.y = -0.18;
  lake.position.set(-134, -10, -183);
  lake.receiveShadow = true;
  campus.add(lake);
  box(campus, [58, 1.4, 88], [-36, -10, -186], lawnLightMat);
  box(campus, [48, 1.8, 66], [-36, -8.8, -186], roadMat);
  box(campus, [42, 1.9, 58], [-36, -7.8, -186], lawnMat);
  [-1, 1].forEach(side => {
    const field = box(campus, [34, 1.6, 42], [-36 + side * 46, -9, -185], lawnLightMat);
    field.rotation.y = side * 0.1;
  });
  box(campus, [4, 2, 85], [-36, -7.4, -186], terracottaLightMat);
  box(campus, [58, 3, 4], [-36, -7.2, -186], terracottaLightMat);

  const road = box(campus, [42, 1.6, 370], [0, -9.4, 65], roadMat);
  road.receiveShadow = true;
  [0, 1].forEach(side => {
    const lane = box(campus, [3, 1.8, 350], [side ? 12 : -12, -8.3, 65], goldMat);
    lane.material = mat(0x6f7b6c, 0.8);
  });
  [0, 1].forEach(side => {
    const parking = box(campus, [62, 1.7, 30], [side ? 96 : -96, -9, 45], roadMat);
    parking.rotation.y = side ? -0.08 : 0.08;
  });

  const addOffice = (x, z, width, depth, floors = 3, color = creamMat) => {
    const office = new THREE.Group();
    office.position.set(x, -8, z);
    box(office, [width, floors * 10, depth], [0, floors * 5, 0], color);
    box(office, [width + 4, 3, depth + 4], [0, floors * 10 + 2, 0], whiteRoofMat);
    for (let floor = 0; floor < floors; floor += 1) {
      for (let panel = -1; panel <= 1; panel += 1) {
        box(office, [Math.max(6, width / 4), 4.2, 1.2], [panel * width / 3.2, 5 + floor * 10, depth / 2 + 0.8], glassMat);
      }
    }
    campus.add(office);
  };

  // Rear academic and residential blocks.
  [[78, -205, 44, 34, 5], [130, -167, 44, 34, 6], [82, -133, 50, 34, 5], [130, -100, 42, 34, 5]]
    .forEach(item => addOffice(item[0], item[1], item[2], item[3], item[4], creamMat));
  [[-98, -204, 42, 28, 3], [-36, -207, 40, 28, 3], [32, -206, 42, 28, 3]]
    .forEach(item => addOffice(item[0], item[1], item[2], item[3], item[4], terracottaMat));

  const createCurvedBlock = (x, z, scaleX, scaleZ, rotation = 0, floors = 3) => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, -1);
    shape.quadraticCurveTo(0, 1.1, 1, -1);
    shape.lineTo(0.78, -1.25);
    shape.quadraticCurveTo(0, 0.62, -0.78, -1.25);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08 });
    geometry.rotateX(-Math.PI / 2);
    const block = new THREE.Group();
    block.position.set(x, -8, z);
    block.rotation.y = rotation;
    const body = new THREE.Mesh(geometry, creamMat);
    body.scale.set(scaleX, floors * 10, scaleZ);
    body.castShadow = true;
    body.receiveShadow = true;
    block.add(body);
    const roof = new THREE.Mesh(geometry, whiteRoofMat);
    roof.scale.set(scaleX * 1.04, 2.2, scaleZ * 1.04);
    roof.position.y = floors * 10 + 2;
    block.add(roof);
    for (let panel = -2; panel <= 2; panel += 1) {
      const window = box(block, [9, floors * 7, 1.4], [panel * 16, floors * 4.5, scaleZ * 0.58], glassMat);
      window.rotation.y = rotation * 0.2;
    }
    campus.add(block);
    return block;
  };

  // The defining central horseshoe/crescent campus in the reference.
  createCurvedBlock(-6, -38, 54, 32, 0, 3);
  createCurvedBlock(-75, -6, 37, 26, -0.78, 3);
  createCurvedBlock(75, -6, 37, 26, 0.78, 3);

  // Repeated middle-campus blocks form the strong north/south spine visible in
  // the reference image between the court and the rear academic zone.
  [
    [-54, -104, 42, 22], [0, -108, 45, 22], [54, -104, 42, 22],
    [-48, -143, 32, 18], [0, -148, 34, 18], [48, -143, 32, 18]
  ].forEach(([x, z, width, depth], index) => {
    const spine = new THREE.Group();
    spine.position.set(x, -8, z);
    box(spine, [width, index < 3 ? 22 : 17, depth], [0, index < 3 ? 11 : 8.5, 0], index % 2 ? creamMat : whiteRoofMat);
    box(spine, [width + 5, 3, depth + 4], [0, index < 3 ? 23 : 18.5, 0], whiteRoofMat);
    box(spine, [width * 0.72, 6, 1.5], [0, index < 3 ? 10 : 7.5, depth / 2 + 0.8], glassMat);
    campus.add(spine);
  });

  // Central ring court and fountain.
  disc(69, 1.8, -8.5, lawnLightMat);
  [30, 48, 64].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, index === 1 ? 4.2 : 2.1, 8, 96),
      index === 1 ? creamMat : terracottaLightMat
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -7;
    campus.add(ring);
  });
  const fountain = new THREE.Mesh(new THREE.CylinderGeometry(10, 13, 7, 32), waterMat);
  fountain.position.set(0, -2, -20);
  campus.add(fountain);
  const monument = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.6, 26, 16), whiteRoofMat);
  monument.position.set(0, 14, -20);
  campus.add(monument);

  // Front signature building, entry terraces and university sign.
  const front = new THREE.Group();
  front.position.set(0, -8, 52);
  box(front, [112, 20, 26], [0, 12, 0], terracottaMat);
  box(front, [88, 24, 12], [0, 16, -9], glassMat);
  box(front, [120, 4, 32], [0, 26, 0], whiteRoofMat);
  box(front, [48, 9, 3], [0, 16, 13.5], goldMat);
  campus.add(front);
  for (let step = 0; step < 5; step += 1) {
    box(campus, [72 - step * 11, 2.6, 11], [0, -8 + step * 2.8, 69 - step * 8], step % 2 ? terracottaLightMat : whiteRoofMat);
  }

  // Lower-left circular arena and lower glass innovation hall.
  const arena = new THREE.Mesh(new THREE.CylinderGeometry(44, 44, 17, 48), whiteRoofMat);
  arena.scale.z = 0.82;
  arena.position.set(-112, 0, 124);
  arena.castShadow = true;
  campus.add(arena);
  const arenaBand = new THREE.Mesh(new THREE.CylinderGeometry(42, 42, 8, 48), terracottaMat);
  arenaBand.scale.z = 0.82;
  arenaBand.position.set(-112, -8, 124);
  campus.add(arenaBand);
  box(campus, [92, 20, 48], [95, 4, 145], glassMat);
  box(campus, [100, 4, 56], [95, 17, 145], whiteRoofMat);
  box(campus, [58, 12, 2], [95, 5, 121], glassMat);

  [[-150, 105], [-72, 111], [142, 104], [-155, 25], [157, 18], [-130, -55], [126, -42]]
    .forEach(([x, z]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.4, 12, 10), trunkMat);
      trunk.position.y = -2;
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(8, 1), treeMat);
      crown.position.y = 6;
      tree.add(trunk, crown);
      tree.position.set(x, -8, z);
      campus.add(tree);
    });

  const pulseMarker = new THREE.Mesh(new THREE.SphereGeometry(4, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff806b }));
  pulseMarker.position.set(0, 42, -20);
  campus.add(pulseMarker);

  const dom = threeRenderer.domElement;
  dom.addEventListener('mousedown', event => {
    isDragging3D = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });
  window.addEventListener('mouseup', () => { isDragging3D = false; });
  dom.addEventListener('mousemove', event => {
    if (!isDragging3D || !buildingGroup) return;
    buildingGroup.rotation.y += (event.clientX - previousMousePosition.x) * 0.005;
    threeCamera.position.y = Math.max(300, Math.min(780, threeCamera.position.y - (event.clientY - previousMousePosition.y) * 0.35));
    threeCamera.lookAt(0, -4, -18);
    previousMousePosition = { x: event.clientX, y: event.clientY };
  });
  dom.addEventListener('wheel', event => {
    event.preventDefault();
    threeCamera.position.y = Math.max(300, Math.min(780, threeCamera.position.y + event.deltaY * 0.45));
    threeCamera.lookAt(0, -4, -18);
  }, { passive: false });

  const onResize = () => {
    if (!container || !threeRenderer || !threeCamera) return;
    const nextWidth = container.clientWidth || 900;
    const nextHeight = container.clientHeight || 390;
    threeCamera.aspect = nextWidth / nextHeight;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(nextWidth, nextHeight);
  };
  window.addEventListener('resize', onResize);

  const animate3D = () => {
    threeAnimationId = requestAnimationFrame(animate3D);
    if (!isDragging3D && buildingGroup) buildingGroup.rotation.y += 0.00045;
    if (buildingGroup) buildingGroup.position.y = Math.sin(Date.now() * 0.0012) * 1.2;
    pulseMarker.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.18);
    threeRenderer.render(threeScene, threeCamera);
  };
  animate3D();
}

function reset3DCamera() {
  if (threeCamera && buildingGroup) {
    const bounds = new THREE.Box3().setFromObject(buildingGroup);
    const size = bounds.getSize(new THREE.Vector3());
    const distance = Math.max(size.x, size.z) * 1.18;
    threeCamera.position.set(distance * 0.9, distance * 0.72, distance * 0.9);
    if (threeControls) {
      threeControls.target.set(0, 0, 0);
      threeControls.update();
    } else {
      threeCamera.lookAt(0, 0, 0);
    }
    buildingGroup.rotation.set(0, 0, 0);
    sfx.play('click');
  }
}

function toggle3DVisualizer() {
  sfx.play('whoosh');
  const container = document.getElementById('threejs-container');
  if (container) {
    container.classList.toggle('hidden');
    if (!container.classList.contains('hidden') && !threeRenderer) {
      setTimeout(initBlenderCampus, 100);
    }
  }
}


// ============================================================================
// HIGH-PRIVILEGE ARCHITECTURE & GRAFANA CLEARANCE SYSTEM
// ============================================================================
function openGrafanaPrivilegeModal() {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  const modal = document.getElementById('grafana-privilege-modal');
  if (!modal) return;

  const user = appState.currentUser || { name: 'Rahul Sharma', role: 'student', roleLabel: 'Student' };
  const isPrivileged = (user.role === 'admin' || user.role === 'faculty' || appState.hasArchitectPrivilege === true);

  const rolePill = document.getElementById('privilege-modal-role-pill');
  if (rolePill) rolePill.textContent = user.roleLabel || user.role;

  const userName = document.getElementById('privilege-modal-user-name');
  if (userName) userName.textContent = user.name;

  const status = document.getElementById('privilege-modal-clearance-status');
  if (status) {
    if (isPrivileged) {
      status.textContent = '● Tier-1 High-Privilege Authorized';
      status.className = 'text-emerald-400 text-xs font-mono font-bold';
    } else {
      status.textContent = '○ Observer Clearance (Student)';
      status.className = 'text-amber-400 text-xs font-mono font-bold';
    }
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeGrafanaPrivilegeModal() {
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click'); } catch(e) {}
  const modal = document.getElementById('grafana-privilege-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function grantInstantArchitectPrivilege() {
  appState.hasArchitectPrivilege = true;
  try { localStorage.setItem('chanakya_has_architect_privilege', 'true'); } catch(e) {}
  updateUserUI();
  try { if (typeof sfx !== 'undefined' && sfx.play) sfx.play('success'); } catch(e) {}
  if (typeof showToast === 'function') {
    showToast("Clearance Granted", "👑 System Architect Clearance Tier-1 Activated for current session!", "success");
  }
  closeGrafanaPrivilegeModal();
}

if (typeof window !== 'undefined') {
  window.openGrafanaPrivilegeModal = openGrafanaPrivilegeModal;
  window.closeGrafanaPrivilegeModal = closeGrafanaPrivilegeModal;
  window.grantInstantArchitectPrivilege = grantInstantArchitectPrivilege;
}
