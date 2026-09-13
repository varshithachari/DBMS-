/**
 * CAMPUS CONNECT - MASTER APPLICATION CORE
 * Linear + Notion + Arc Browser Design & Delightful Motion
 */

// ============================================================================
// 1. SOUND FX SYNTHESIZER (Tactile Clicks & Chimes)
// ============================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }
  playClick() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }
  playWhoosh() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }
  playSuccess() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        const t = now + (i * 0.05);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFX();

// ============================================================================
// 2. TOAST NOTIFICATIONS (Linear Style)
// ============================================================================
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px) scale(0.96)';
    toast.style.transition = 'all 180ms ease';
    setTimeout(() => toast.remove(), 180);
  }, 3200);
}

// ============================================================================
// 3. INTERACTIVE CAMPUS MAP (LEAFLET + SELF-DRAWING SVG ROUTE LINE)
// ============================================================================
let campusMap = null;
let currentRouteLayer = null;
let mapMarkers = [];

const CAMPUS_COORDS = [13.222871, 77.755633];

const DESTINATIONS = {
  auditorium: {
    name: "Grand Auditorium & Convocation Plaza",
    coords: [13.223800, 77.756300],
    meta: "Distance: 240m • Approx 3 mins walk • Circular Promenade Path",
    path: [
      [13.222871, 77.755633],
      [13.223100, 77.755800],
      [13.223450, 77.756050],
      [13.223800, 77.756300]
    ]
  },
  robotics: {
    name: "AI & Robotics Research Lab 3",
    coords: [13.222100, 77.756200],
    meta: "Distance: 190m • Approx 2.5 mins walk • Tech Wing East",
    path: [
      [13.222871, 77.755633],
      [13.222600, 77.755850],
      [13.222350, 77.756050],
      [13.222100, 77.756200]
    ]
  },
  canteen: {
    name: "Central Dining Canteen & Plaza",
    coords: [13.222300, 77.754800],
    meta: "Distance: 160m • Approx 2 mins walk • South West Promenade",
    path: [
      [13.222871, 77.755633],
      [13.222550, 77.755200],
      [13.222300, 77.754800]
    ]
  },
  library: {
    name: "Central Knowledge Library & Digital Hub",
    coords: [13.223400, 77.755200],
    meta: "Distance: 180m • Approx 2 mins walk • North Quad",
    path: [
      [13.222871, 77.755633],
      [13.223150, 77.755400],
      [13.223400, 77.755200]
    ]
  }
};

function initCampusMap() {
  const container = document.getElementById('interactive-campus-map');
  if (!container) return;

  campusMap = L.map('interactive-campus-map', {
    center: CAMPUS_COORDS,
    zoom: 17,
    zoomControl: true
  });

  // Clean Light Vector Tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors • Chanakya University'
  }).addTo(campusMap);

  // Smooth pin drops on load
  const landmarks = [
    { title: "Academic Circle Quad", coords: [13.222871, 77.755633], icon: "🎓" },
    { title: "Grand Auditorium", coords: [13.223800, 77.756300], icon: "🏛️" },
    { title: "Robotics Research Center", coords: [13.222100, 77.756200], icon: "💻" },
    { title: "Central Canteen", coords: [13.222300, 77.754800], icon: "☕" },
    { title: "Central Library", coords: [13.223400, 77.755200], icon: "📚" }
  ];

  landmarks.forEach((l, index) => {
    setTimeout(() => {
      const customIcon = L.divIcon({
        className: 'pin-drop',
        html: `<div style="background:#4338CA;color:white;width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 10px rgba(67,56,202,0.3);border:2px solid white;">${l.icon}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      const marker = L.marker(l.coords, { icon: customIcon }).addTo(campusMap);
      marker.bindPopup(`<b>${l.title}</b>`);
      mapMarkers.push(marker);
    }, index * 80);
  });
}

function navigateRouteTo(destKey) {
  sfx.playWhoosh();
  const dest = DESTINATIONS[destKey];
  if (!dest || !campusMap) return;

  clearMapRoute();

  // Draw self-drawing route line
  currentRouteLayer = L.polyline(dest.path, {
    color: '#4338CA',
    weight: 5,
    opacity: 0.9,
    lineJoin: 'round',
    className: 'route-draw-animated'
  }).addTo(campusMap);

  // Zoom map to fit route
  campusMap.fitBounds(currentRouteLayer.getBounds(), { padding: [40, 40] });

  // Update HUD
  const hud = document.getElementById('map-route-hud');
  const nameEl = document.getElementById('route-dest-name');
  const metaEl = document.getElementById('route-dest-meta');
  if (hud && nameEl && metaEl) {
    nameEl.textContent = `Routing to ${dest.name}`;
    metaEl.textContent = dest.meta;
    hud.classList.remove('hidden');
  }

  showToast(`Route calculated to ${dest.name}`, '🧭');
}

function clearMapRoute() {
  if (currentRouteLayer && campusMap) {
    campusMap.removeLayer(currentRouteLayer);
    currentRouteLayer = null;
  }
  const hud = document.getElementById('map-route-hud');
  if (hud) hud.classList.add('hidden');
}

// ============================================================================
// 4. NLP EXPANDING SEARCH & ANIMATED CYCLING PLACEHOLDER
// ============================================================================
const SEARCH_SUGGESTIONS = [
  "Where is Hall 3B in Academic Block?",
  "Which cafeteria is least crowded right now?",
  "Is the Robotics Lab open for students?",
  "Upcoming events this afternoon",
  "How to report a Wi-Fi issue in Hostel 2?",
  "Find Dr. Radhakrishnan's office hours"
];

let searchSuggestionIdx = 0;
let placeholderInterval = null;

function initSearchPlaceholderCycle() {
  const input = document.getElementById('nlp-search-input');
  if (!input) return;

  placeholderInterval = setInterval(() => {
    if (document.activeElement !== input) {
      searchSuggestionIdx = (searchSuggestionIdx + 1) % SEARCH_SUGGESTIONS.length;
      input.placeholder = SEARCH_SUGGESTIONS[searchSuggestionIdx];
    }
  }, 3200);
}

function handleSearchFocus() {
  sfx.playClick();
  const dropdown = document.getElementById('search-dropdown-results');
  const input = document.getElementById('nlp-search-input');
  if (dropdown && (!input || !input.value)) {
    handleSearchQuery('');
    dropdown.classList.remove('hidden');
  }
}

function handleSearchQuery(q) {
  const query = (q || '').toLowerCase().trim();
  const dropdown = document.getElementById('search-dropdown-results');
  const list = document.getElementById('search-results-list');
  if (!dropdown || !list) return;

  const results = [
    { title: "Academic Block 1 • Hall 3B", type: "Lecture Hall", action: "navigateRouteTo('auditorium')" },
    { title: "Central Library • Reading Hall 2", type: "Study Facility", action: "navigateRouteTo('library')" },
    { title: "AI & Robotics Lab 3", type: "Research Center", action: "navigateRouteTo('robotics')" },
    { title: "Central Canteen • Lunch Specials", type: "Dining", action: "navigateRouteTo('canteen')" },
    { title: "Chanakya AI Symposium 2026", type: "Campus Event", action: "openDigitalPassModal('AI Symposium 2026', 'AUD-101')" }
  ].filter(r => !query || r.title.toLowerCase().includes(query) || r.type.toLowerCase().includes(query));

  list.innerHTML = results.map(r => `
    <div onclick="${r.action}; closeSearchDropdown();" class="p-2 rounded-lg hover:bg-[#EEF2FF] hover:text-[#4338CA] cursor-pointer flex items-center justify-between text-xs text-[#09090B] font-semibold transition btn-spring">
      <div class="flex items-center gap-2">
        <span>📍</span>
        <span>${r.title}</span>
      </div>
      <span class="text-[10px] text-[#71717A] bg-[#F4F4F5] px-1.5 py-0.5 rounded">${r.type}</span>
    </div>
  `).join('');

  dropdown.classList.remove('hidden');
}

function closeSearchDropdown() {
  const dropdown = document.getElementById('search-dropdown-results');
  if (dropdown) dropdown.classList.add('hidden');
}

// Global click outside to close search dropdown
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('search-dropdown-results');
  const input = document.getElementById('nlp-search-input');
  if (dropdown && !dropdown.contains(e.target) && e.target !== input) {
    closeSearchDropdown();
  }
});

// ============================================================================
// 5. NOTIFICATIONS (SLIDE-IN BOUNCE & BADGE PULSE)
// ============================================================================
let notificationCount = 3;

function pushNotification(title, body, category = 'Alert') {
  notificationCount++;
  const badge = document.getElementById('notif-badge-count');
  if (badge) {
    badge.textContent = notificationCount;
    badge.classList.remove('badge-pulse');
    void badge.offsetWidth; // trigger reflow
    badge.classList.add('badge-pulse');
  }

  const stream = document.getElementById('notifications-stream');
  if (stream) {
    const card = document.createElement('div');
    card.className = 'p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] space-y-1 hover:border-[#D4D4D8] transition notif-slide-in';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-[#FF6B6B]/15 text-[#E11D48]">${category}</span>
        <span class="text-[10px] text-[#A1A1AA]">Just now</span>
      </div>
      <h4 class="text-xs font-bold text-[#09090B]">${title}</h4>
      <p class="text-[11px] text-[#71717A]">${body}</p>
    `;
    stream.prepend(card);
  }

  sfx.playSuccess();
  showToast(`New notification: ${title}`, '🔔');
}

function simulateBroadcastAlert() {
  sfx.playClick();
  pushNotification(
    "Campus Wi-Fi Maintenance Completed",
    "High-speed fiber connectivity restored in Central Library & Study Pods.",
    "Campus Operations"
  );
}

// ============================================================================
// 6. ISSUE REPORTING WITH ANIMATED STEPPER
// ============================================================================
let currentStepperStage = 2; // 1: Reported, 2: Assigned, 3: Resolved

function advanceIssueStepper() {
  sfx.playClick();
  currentStepperStage = (currentStepperStage % 3) + 1;
  const fill = document.getElementById('issue-stepper-fill');
  const node1 = document.getElementById('step-node-1');
  const node2 = document.getElementById('step-node-2');
  const node3 = document.getElementById('step-node-3');

  if (currentStepperStage === 1) {
    if (fill) fill.style.width = '0%';
    if (node1) node1.className = "w-6 h-6 rounded-full bg-[#4338CA] text-white flex items-center justify-center text-[10px] font-bold animate-pulse";
    if (node2) node2.className = "w-6 h-6 rounded-full bg-white border-2 border-[#E4E4E7] text-[#71717A] flex items-center justify-center text-[10px] font-bold";
    if (node3) node3.className = "w-6 h-6 rounded-full bg-white border-2 border-[#E4E4E7] text-[#71717A] flex items-center justify-center text-[10px] font-bold";
    showToast("Status: Issue #1042 marked as Reported.", "🛡️");
  } else if (currentStepperStage === 2) {
    if (fill) fill.style.width = '50%';
    if (node1) node1.className = "w-6 h-6 rounded-full bg-[#4338CA] text-white flex items-center justify-center text-[10px] font-bold";
    if (node2) node2.className = "w-6 h-6 rounded-full bg-[#4338CA] text-white flex items-center justify-center text-[10px] font-bold animate-pulse";
    if (node3) node3.className = "w-6 h-6 rounded-full bg-white border-2 border-[#E4E4E7] text-[#71717A] flex items-center justify-center text-[10px] font-bold";
    showToast("Status: Issue #1042 Assigned to Engineering Team.", "🛠️");
  } else if (currentStepperStage === 3) {
    if (fill) fill.style.width = '100%';
    if (node1) node1.className = "w-6 h-6 rounded-full bg-[#14B8A6] text-white flex items-center justify-center text-[10px] font-bold";
    if (node2) node2.className = "w-6 h-6 rounded-full bg-[#14B8A6] text-white flex items-center justify-center text-[10px] font-bold";
    if (node3) node3.className = "w-6 h-6 rounded-full bg-[#14B8A6] text-white flex items-center justify-center text-[10px] font-bold";
    sfx.playSuccess();
    showToast("Status: Issue #1042 Resolved & Verified! 🎉", "✓");
  }
}

function openReportIssueModal() {
  sfx.playClick();
  const modal = document.getElementById('report-issue-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeReportIssueModal() {
  const modal = document.getElementById('report-issue-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function submitNewIssue() {
  const cat = document.getElementById('issue-category-select').value;
  const loc = document.getElementById('issue-location-input').value || 'Main Campus';
  const desc = document.getElementById('issue-desc-input').value || 'Maintenance request';

  closeReportIssueModal();
  sfx.playSuccess();
  showToast(`Issue filed for ${loc}: ${cat}`, '🛡️');

  // Push notification for visibility
  pushNotification(
    `New Issue Logged: ${cat}`,
    `Reported at ${loc}. Assigned to Campus Dispatch.`,
    "Operations"
  );
}

// ============================================================================
// 7. AI CAMPUS ASSISTANT (INLINE & DRAWER)
// ============================================================================
function toggleAIAssistant() {
  sfx.playClick();
  const el = document.getElementById('bento-ai');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    const input = document.getElementById('ai-inline-input');
    if (input) input.focus();
  }
}

function sendAIPrompt(promptText) {
  const input = document.getElementById('ai-inline-input');
  if (input) {
    input.value = promptText;
    const form = input.closest('form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
}

function handleInlineAISubmit(e) {
  e.preventDefault();
  const input = document.getElementById('ai-inline-input');
  const messages = document.getElementById('ai-inline-messages');
  const typing = document.getElementById('ai-typing-indicator');
  if (!input || !messages || !input.value.trim()) return;

  const query = input.value.trim();
  input.value = '';

  // Append user bubble
  const userEl = document.createElement('div');
  userEl.className = 'p-2 rounded-lg bg-[#EEF2FF] text-[#4338CA] text-right font-medium text-xs';
  userEl.textContent = query;
  messages.appendChild(userEl);
  messages.scrollTop = messages.scrollHeight;

  // Show typing dots
  if (typing) typing.classList.remove('hidden');

  setTimeout(() => {
    fetch('/api/ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    .then(res => res.json())
    .then(data => {
      if (typing) typing.classList.add('hidden');
      const aiEl = document.createElement('div');
      aiEl.className = 'p-2.5 rounded-lg bg-white border border-[#E4E4E7] text-[#3F3F46] text-xs leading-relaxed';
      aiEl.innerHTML = data.reply || "I've checked the campus knowledge base. Hall 3B is located on Floor 2 of Academic Block 1!";
      messages.appendChild(aiEl);
      messages.scrollTop = messages.scrollHeight;
      sfx.playSuccess();
    })
    .catch(() => {
      if (typing) typing.classList.add('hidden');
      const aiEl = document.createElement('div');
      aiEl.className = 'p-2.5 rounded-lg bg-white border border-[#E4E4E7] text-[#3F3F46] text-xs leading-relaxed';
      aiEl.textContent = "For Hall 3B, take the south-west walkway from the Academic Circle Quad. It is right inside Academic Block 1 portico.";
      messages.appendChild(aiEl);
      messages.scrollTop = messages.scrollHeight;
    });
  }, 450);
}

// ============================================================================
// 8. DIGITAL EVENT QR PASS MODAL
// ============================================================================
function openDigitalPassModal(eventName, passId) {
  sfx.playClick();
  const modal = document.getElementById('qr-pass-modal');
  const evTitle = document.getElementById('modal-pass-event');
  const passCode = document.getElementById('modal-pass-code');
  if (evTitle) evTitle.textContent = eventName;
  if (passCode) passCode.textContent = `PASS-${passId}-${Math.floor(Math.random()*900 + 100)}`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeDigitalPassModal() {
  const modal = document.getElementById('qr-pass-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ============================================================================
// 9. FACILITIES & LAB BOOKING
// ============================================================================
function bookFacilitySlot(facilityName) {
  sfx.playSuccess();
  showToast(`${facilityName} reserved for 1 hour!`, '🏛️');
}

// ============================================================================
// 10. ROLE SWITCHER & SCROLL HELPER
// ============================================================================
function switchPlatformRole(role) {
  sfx.playClick();
  showToast(`Platform view switched to: ${role.toUpperCase()}`, '👤');
}

function scrollToCard(cardId) {
  sfx.playClick();
  const el = document.getElementById(cardId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ============================================================================
// 11. WEBSOCKET REAL-TIME STREAM
// ============================================================================
function initSocketStream() {
  try {
    const socket = io();
    socket.on('connect', () => {
      console.log('[Socket.io] Connected to Campus Connect stream');
    });

    socket.on('telemetry_pulse', (data) => {
      const popEl = document.getElementById('live-population-count');
      const pill = document.getElementById('live-crowd-pill');
      if (popEl && data.activePopulation) {
        popEl.textContent = data.activePopulation.toLocaleString();
      }
      if (pill) {
        pill.classList.remove('badge-pulse');
        void pill.offsetWidth;
        pill.classList.add('badge-pulse');
      }
    });

    socket.on('notification_broadcast', (notif) => {
      pushNotification(notif.title || 'Broadcast Alert', notif.body || notif.message, notif.category || 'Broadcast');
    });

    socket.on('issue_updated', (issue) => {
      showToast(`Issue status updated: ${issue.title || 'Task'}`, '🛡️');
      advanceIssueStepper();
    });
  } catch (err) {
    console.warn('Socket unavailable, running in local fallback mode:', err);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initCampusMap();
  initSearchPlaceholderCycle();
  initSocketStream();
  console.log("⚡ Campus Connect Linear+Notion+Arc Multi-Service Platform Ready");
});
