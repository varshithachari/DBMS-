
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
  if (cardId && user.roll_number) cardId.textContent = `ID: ${user.roll_number}`;

  const cardDept = document.querySelectorAll('#student-id-card span.text-slate-300')[0];
  if (cardDept && (user.dept || user.department_name)) cardDept.textContent = user.dept || user.department_name;

  const cardInitials = document.querySelector('#student-id-card .rounded-2xl.bg-gradient-to-tr');
  if (cardInitials && user.name) {
    const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    cardInitials.textContent = initials;
  }
}

function initAuthSession() {
  try {
    const raw = localStorage.getItem('chanakya_user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.name) {
        appState.currentUser = {
          id: user.profile_id || user.id || 1,
          name: user.name,
          email: user.email,
          role: user.role || 'student',
          roleLabel: (user.role || 'student').toUpperCase(),
          dept: user.department_name || user.dept || 'School of Engineering & Tech',
          school: user.school_name || 'Engineering',
          roll_number: user.roll_number || 'CU-2026-001',
          avatar: user.avatar || (user.role === 'admin' ? '👑' : (user.role === 'faculty' ? '👨‍🏫' : '🎓')),
          points: user.points || 100
        };
        appState.currentRole = user.role || 'student';

        // Update top-right role selector with the user's authentic name
        const roleSel = document.getElementById('role-selector');
        if (roleSel) {
          let opt = roleSel.querySelector('option[value="authenticated_user"]');
          if (!opt) {
            opt = document.createElement('option');
            opt.value = "authenticated_user";
            roleSel.insertBefore(opt, roleSel.firstChild);
          }
          opt.textContent = `${appState.currentUser.avatar} ${appState.currentUser.name} (${appState.currentUser.roleLabel})`;
          roleSel.value = "authenticated_user";
        }

        updateUserUI();
        adaptRoleViews();
        return;
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
