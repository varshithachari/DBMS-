
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
  if (!DEMO_USERS[roleKey]) return;
  sfx.play('click');
  appState.currentRole = roleKey;
  appState.currentUser = { ...DEMO_USERS[roleKey] };

  // Update UI Elements for Role
  document.querySelectorAll('.role-indicator-name').forEach(el => el.textContent = appState.currentUser.name);
  document.querySelectorAll('.role-indicator-label').forEach(el => el.textContent = appState.currentUser.roleLabel);
  document.querySelectorAll('.role-indicator-avatar').forEach(el => el.textContent = appState.currentUser.avatar);
  document.querySelectorAll('.role-indicator-dept').forEach(el => el.textContent = appState.currentUser.dept);

  // Update Active Role in Role Selector
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

  // Switch Views
  document.querySelectorAll('.tab-view-container').forEach(view => {
    if (view.id === `tab-${tabId}`) {
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
    const isFull = evt.registeredCount >= evt.capacity;
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
              <span class="text-slate-400">Registered: <b class="text-white">${evt.registeredCount} / ${evt.capacity}</b></span>
              <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">${evt.ticketType || 'Free Registration'}</span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style="width: ${Math.min(100, (evt.registeredCount / evt.capacity) * 100)}%"></div>
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

function openRegisterModal(evtId, evtTitle) {
  sfx.play('click');
  const modal = document.getElementById('event-reg-modal');
  document.getElementById('reg-event-id').value = evtId;
  document.getElementById('reg-event-title').textContent = evtTitle;
  document.getElementById('reg-user-name').value = appState.currentUser.name;
  document.getElementById('reg-user-email').value = appState.currentUser.email;
  modal.classList.remove('hidden');
}

function closeRegisterModal() {
  document.getElementById('event-reg-modal').classList.add('hidden');
}

function submitEventRegistration() {
  const evtId = document.getElementById('reg-event-id').value;
  const name = document.getElementById('reg-user-name').value;
  const email = document.getElementById('reg-user-email').value;

  fetch(`/api/events/${evtId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userName: name,
      userEmail: email,
      userRole: appState.currentRole
    })
  })
  .then(res => res.json())
  .then(reg => {
    closeRegisterModal();
    sfx.play('success');
    openDigitalPassModal(reg);
    loadEvents();
  })
  .catch(err => {
    showToast("Registration Failed", err.message, 'alert');
  });
}

function openDigitalPassModal(reg) {
  const modal = document.getElementById('digital-pass-modal');
  document.getElementById('pass-event-title').textContent = reg.eventTitle;
  document.getElementById('pass-user-name').textContent = reg.userName;
  document.getElementById('pass-ticket-id').textContent = reg.id;
  document.getElementById('pass-seat').textContent = reg.seatNumber || 'GEN-A12';
  document.getElementById('pass-qr-text').textContent = reg.qrCode || `CU-${reg.id}`;
  modal.classList.remove('hidden');
}

function closeDigitalPassModal() {
  document.getElementById('digital-pass-modal').classList.add('hidden');
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
// 11. FOOD & SPORTS SERVICE
// ============================================================================
function loadFoodAndSports() {
  fetch('/api/food-sports/all')
    .then(res => res.json())
    .then(data => {
      appState.foodOutlets = data.foodOutlets || [];
      appState.sportsCourts = data.sportsCourts || [];
      renderFoodOutlets();
      renderSportsCourts();
    })
    .catch(err => console.error("Error loading food & sports:", err));
}

function renderFoodOutlets() {
  const container = document.getElementById('food-outlets-list');
  if (!container) return;

  container.innerHTML = appState.foodOutlets.map(outlet => {
    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-3">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-base font-extrabold text-white">${escapeHtml(outlet.name)}</h3>
            <p class="text-xs text-amber-400">⏱️ Avg Wait: ${outlet.avgWaitTimeMinutes} mins • Queue: ${outlet.queueLength} orders</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            OPEN
          </span>
        </div>

        <div class="space-y-1.5">
          <span class="text-xs text-slate-400 font-bold">Featured Menu:</span>
          <div class="flex flex-wrap gap-1.5">
            ${(outlet.menu || []).map(m => `
              <span class="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700">
                ${escapeHtml(m.item)} - <b class="text-amber-400">₹${m.price}</b>
              </span>
            `).join('')}
          </div>
        </div>

        <div class="pt-2">
          <button onclick="orderFoodModal('${escapeHtml(outlet.name)}')" class="w-full py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition">
            Generate Pre-Order Token
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function orderFoodModal(outletName) {
  sfx.play('click');
  const token = Math.floor(100 + Math.random() * 900);
  showToast("Order Token Generated", `Token #${token} at ${outletName} for ${appState.currentUser.name}. Ready for pick-up in 10 mins.`, 'success');
  sfx.play('success');
}

function renderSportsCourts() {
  const container = document.getElementById('sports-courts-list');
  if (!container) return;

  container.innerHTML = appState.sportsCourts.map(court => {
    const isAvail = court.available;
    return `
      <div class="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">${escapeHtml(court.sport)}</span>
          <h3 class="text-base font-bold text-white">${escapeHtml(court.name)}</h3>
          <p class="text-xs text-slate-400">📍 ${escapeHtml(court.location)}</p>
        </div>

        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${isAvail ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}">
            ${isAvail ? 'AVAILABLE' : 'IN USE'}
          </span>
          <button onclick="bookCourtModal('${court.id}', '${escapeHtml(court.name)}')" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition">
            Book 1-Hr Slot
          </button>
        </div>
      </div>
    `;
  }).join('');
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
  const c1 = document.getElementById('chart-crowd-density');
  if (c1) {
    const ctx = c1.getContext('2d');
    const w = c1.width = c1.offsetWidth || 500;
    const h = c1.height = 180;
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
function handleLogout() {
  sfx.play('click');
  localStorage.removeItem('chanakya_user');
  localStorage.removeItem('chanakya_role');
  showToast("Logging out...", "Returning to Login Portal", "info");
  setTimeout(() => {
    window.location.href = '/login?logged_out=1';
  }, 400);
}

function initAuthSession() {
  try {
    const raw = localStorage.getItem('chanakya_user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.role) {
        appState.currentUser = user;
        switchRole(user.role);
      }
    }
  } catch (e) {
    console.warn("Could not parse saved auth session:", e);
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

function planRouteBetween(fromId, toId, mode = 'pedestrian') {
  if (!fromId || !toId) {
    showToast("Invalid Route", "Please select both starting point and destination.", "alert");
    return;
  }
  fetch('/api/map/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromId, toId, mode })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.found || !data.waypoints) {
      showToast("Route Blocked", "No open route found for selected mode.", "alert");
      return;
    }
    drawRouteOnMap(data.waypoints, '#06B6D4');
    sfx.play('success');
    showToast("Route Calculated", `${data.totalDistanceMeters}m • ~${data.estimatedTimeMins} mins walking via ${data.path.map(p => p.shortName).join(' ➔ ')}`, 'success');
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
  initParticleCanvas();
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

  // Keyboard shortcut: Escape closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRegisterModal();
      closeDigitalPassModal();
      closeCustomMapModal();
      closeFeedDataModal();
    }
  });

  console.log("🎓 Chanakya Campus Connect Interactive Dashboard Ready!");
});
