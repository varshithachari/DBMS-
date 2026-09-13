/**
 * CHANAKYA ACADEMIC HUB - MASTER FRONTEND LOGIC
 * Notion + Duolingo + Linear Design & Tactile Micro-Interactions
 */

// ============================================================================
// 1. TACTILE AUDIO SYNTHESIZER (Woodblock / Soft Chime)
// ============================================================================
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  }

  playCelebrationChime() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const now = this.ctx.currentTime;
      // Musical triad: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        const noteTime = now + (idx * 0.06);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        
        gain.gain.setValueAtTime(0.08, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
        
        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });
    } catch (e) {
      console.warn("Audio unavailable:", e);
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }
}

const audio = new AudioSynthesizer();

// ============================================================================
// 2. CELEBRATORY CONFETTI-LITE (TAILORED FOR TASK COMPLETION)
// ============================================================================
function triggerConfettiLite(originX, originY) {
  if (typeof confetti === 'function') {
    // Normalizing origin coordinates
    const x = originX ? (originX / window.innerWidth) : 0.7;
    const y = originY ? (originY / window.innerHeight) : 0.5;

    // Small pastel celebratory burst
    confetti({
      particleCount: 36,
      spread: 60,
      origin: { x, y },
      colors: ['#4F46E5', '#7FB069', '#FF6B6B', '#F59E0B', '#60A5FA'],
      startVelocity: 22,
      ticks: 120,
      gravity: 0.9,
      scalar: 0.75,
      disableForReducedMotion: true
    });
  }
}

// ============================================================================
// 3. TOAST SYSTEM
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
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
}

// ============================================================================
// 4. TASK CHECKBOX TOGGLE & CELEBRATION
// ============================================================================
const tasksState = {
  1: { completed: false, title: 'Paxos Distributed Consensus Simulator', course: 'CS301' },
  2: { completed: false, title: 'Figma Design System Specification', course: 'UX204' },
  3: { completed: false, title: 'Wireshark Network Packet Analysis', course: 'CS305' },
  4: { completed: false, title: 'Graph Theory Problem Set 4', course: 'MA202' },
  5: { completed: true, title: 'Deep Learning Paper Synthesis', course: 'DS201' }
};

let nextTaskId = 6;

function toggleTaskCompletion(taskId, event) {
  const checkbox = document.getElementById(`task-check-${taskId}`);
  const card = document.getElementById(`task-card-${taskId}`);
  if (!checkbox || !card) return;

  const isCurrentlyChecked = checkbox.classList.contains('checked');
  
  if (!isCurrentlyChecked) {
    // Check it!
    checkbox.classList.add('checked');
    card.classList.add('task-completed');
    if (tasksState[taskId]) tasksState[taskId].completed = true;

    // Trigger celebration
    audio.playCelebrationChime();
    const rect = checkbox.getBoundingClientRect();
    triggerConfettiLite(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    showToast('Assignment completed! Great job! 🎉', '✓');
    updateStreakCounter(1);
  } else {
    // Uncheck it
    checkbox.classList.remove('checked');
    card.classList.remove('task-completed');
    if (tasksState[taskId]) tasksState[taskId].completed = false;
    audio.playClick();
  }
}

function filterTasks(category) {
  audio.playClick();
  ['all', 'urgent', 'completed'].forEach(cat => {
    const btn = document.getElementById(`task-filter-${cat}`);
    if (btn) {
      if (cat === category) {
        btn.className = "px-2.5 py-1 rounded-lg bg-[#4F46E5] text-white font-bold transition btn-spring";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg hover:text-[#1A1915] transition btn-spring";
      }
    }
  });

  const cards = document.querySelectorAll('.task-item');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    const isCompleted = card.classList.contains('task-completed');
    
    if (category === 'all') {
      card.style.display = 'flex';
    } else if (category === 'urgent') {
      card.style.display = (cardCat === 'urgent' && !isCompleted) ? 'flex' : 'none';
    } else if (category === 'completed') {
      card.style.display = isCompleted ? 'flex' : 'none';
    }
  });
}

function openAddAssignmentModal() {
  audio.playClick();
  const modal = document.getElementById('add-task-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const input = document.getElementById('new-task-title');
    if (input) input.focus();
  }
}

function closeAddAssignmentModal() {
  audio.playClick();
  const modal = document.getElementById('add-task-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function submitNewAssignment() {
  const titleInput = document.getElementById('new-task-title');
  const courseSelect = document.getElementById('new-task-course');
  const dueInput = document.getElementById('new-task-due');
  
  if (!titleInput || !titleInput.value.trim()) {
    showToast('Please enter an assignment title', '⚠️');
    return;
  }

  const id = nextTaskId++;
  const title = titleInput.value.trim();
  const course = courseSelect ? courseSelect.value : 'CS301';
  const due = dueInput ? dueInput.value : 'Tomorrow';

  const list = document.getElementById('assignments-list');
  if (list) {
    const card = document.createElement('div');
    card.id = `task-card-${id}`;
    card.className = 'task-item p-3.5 rounded-xl border border-[#E5E5E0] hover:border-[#4F46E5] bg-white transition flex items-start gap-3 edu-card stagger-in';
    card.setAttribute('data-category', 'upcoming');
    card.innerHTML = `
      <div onclick="toggleTaskCompletion(${id}, event)" class="task-checkbox mt-0.5" id="task-check-${id}">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <span class="task-title text-xs font-bold text-[#1A1915]">${title}</span>
          <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EEF2FF] text-[#4F46E5] flex-shrink-0">
            ${due}
          </span>
        </div>
        <div class="flex items-center gap-2 mt-1 text-[11px] text-[#78766E]">
          <span>${course}</span>
          <span>•</span>
          <span>Student Task</span>
        </div>
      </div>
    `;
    list.prepend(card);
  }

  titleInput.value = '';
  closeAddAssignmentModal();
  showToast('Assignment added to schedule!', '📝');
  audio.playClick();
}

// ============================================================================
// 5. COURSE PROGRESS BAR INCREMENT ENGINE
// ============================================================================
const courseProgress = {
  cs301: { pct: 82, completed: 18, total: 22 },
  cs305: { pct: 68, completed: 15, total: 22 },
  ux204: { pct: 91, completed: 20, total: 22 },
  ma202: { pct: 75, completed: 15, total: 20 }
};

function incrementCourseModule(courseCode) {
  const c = courseProgress[courseCode];
  if (!c) return;

  if (c.completed < c.total) {
    c.completed += 1;
    c.pct = Math.min(100, Math.round((c.completed / c.total) * 100));

    const pctEl = document.getElementById(`course-pct-${courseCode}`);
    const barEl = document.getElementById(`course-bar-${courseCode}`);

    if (pctEl) pctEl.textContent = `${c.pct}%`;
    if (barEl) barEl.style.width = `${c.pct}%`;

    audio.playCelebrationChime();
    showToast(`Progress updated: ${c.completed}/${c.total} modules complete!`, '📈');

    if (c.pct === 100) {
      triggerConfettiLite();
      showToast(`🎉 Course 100% Completed! Congratulations!`, '🏆');
    }
  } else {
    showToast('All modules for this course already completed!', '✓');
  }
}

// ============================================================================
// 6. DUOLINGO STREAK COUNTER
// ============================================================================
let streakDays = 14;

function updateStreakCounter(increment = 0) {
  streakDays += increment;
  const navStreak = document.getElementById('nav-streak-counter');
  if (navStreak) {
    navStreak.textContent = `${streakDays} Days`;
  }
}

function openStreakModal() {
  audio.playClick();
  showToast(`🔥 You are on a ${streakDays}-day streak! Keep studying daily to maintain it!`, '🔥');
}

// ============================================================================
// 7. SCHEDULE DAY SWITCHER
// ============================================================================
const scheduleData = {
  Mon: [
    { code: 'CS301', title: 'Advanced Algorithms & Graph Analysis', time: '09:00 AM – 10:30 AM', room: 'Hall 3B', prof: 'Dr. S. Radhakrishnan', inSession: true },
    { code: 'CS305', title: 'Computer Networks: Protocols & Routing', time: '11:00 AM – 12:30 PM', room: 'Networking Lab 2', prof: 'Prof. Ananya Iyer', inSession: false },
    { code: 'UX204', title: 'Human-Computer Interaction: Design Systems', time: '02:00 PM – 03:30 PM', room: 'Design Studio 1', prof: 'Prof. Vikram Patil', inSession: false }
  ],
  Tue: [
    { code: 'MA202', title: 'Discrete Mathematics: Graph Theory', time: '09:30 AM – 11:00 AM', room: 'Hall 2A', prof: 'Dr. K. Raman', inSession: false },
    { code: 'CS301', title: 'Algorithm Lab Session 3', time: '01:30 PM – 03:30 PM', room: 'Computing Lab 4', prof: 'Teaching Assistants', inSession: false }
  ],
  Wed: [
    { code: 'CS305', title: 'Network Security & Packet Firewalls', time: '10:00 AM – 11:30 AM', room: 'Networking Lab 2', prof: 'Prof. Ananya Iyer', inSession: false },
    { code: 'UX204', title: 'Figma Usability Heuristics Workshop', time: '02:00 PM – 04:00 PM', room: 'Design Studio 1', prof: 'Prof. Vikram Patil', inSession: false }
  ],
  Thu: [
    { code: 'CS301', title: 'Dynamic Programming & NP-Completeness', time: '09:00 AM – 10:30 AM', room: 'Hall 3B', prof: 'Dr. S. Radhakrishnan', inSession: false },
    { code: 'MA202', title: 'Combinatorics & Recurrence Relations', time: '11:00 AM – 12:30 PM', room: 'Hall 2A', prof: 'Dr. K. Raman', inSession: false }
  ],
  Fri: [
    { code: 'DS201', title: 'Research Colloquium: Generative Systems', time: '10:00 AM – 11:30 AM', room: 'Grand Auditorium', prof: 'Guest Speaker', inSession: false },
    { code: 'CS305', title: 'Socket Programming Lab Practical', time: '02:00 PM – 04:30 PM', room: 'Networking Lab 2', prof: 'Prof. Ananya Iyer', inSession: false }
  ]
};

function switchScheduleDay(day) {
  audio.playClick();
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach(d => {
    const btn = document.getElementById(`day-btn-${d}`);
    if (btn) {
      if (d === day) {
        btn.className = "px-2.5 py-1 rounded-lg bg-white text-[#1A1915] shadow-2xs font-bold transition btn-spring";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg hover:text-[#1A1915] transition btn-spring";
      }
    }
  });

  const container = document.getElementById('schedule-timeline-container');
  if (!container || !scheduleData[day]) return;

  container.innerHTML = scheduleData[day].map(item => `
    <div class="p-4 rounded-xl border ${item.inSession ? 'border-[#C7D2FE] bg-[#EEF2FF]/60' : 'border-[#E5E5E0] bg-white'} transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 edu-card stagger-in">
      <div class="flex items-start gap-3.5">
        <div class="w-11 h-11 rounded-xl ${item.inSession ? 'bg-[#4F46E5] text-white' : 'bg-[#F4F4F1] text-[#4A4843] border border-[#E5E5E0]'} flex flex-col items-center justify-center flex-shrink-0 font-bold text-xs">
          <span>${item.time.split(' ')[0]}</span>
          <span class="text-[9px] font-normal opacity-80">${item.time.split(' ')[1]}</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${item.inSession ? 'bg-[#4F46E5] text-white' : 'bg-[#F4F4F1] text-[#4A4843] border border-[#E5E5E0]'}">${item.code}</span>
            ${item.inSession ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7FB069]/20 text-[#2D5A1E] flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#7FB069] animate-pulse"></span> In Progress</span>' : ''}
          </div>
          <h4 class="text-sm font-bold text-[#1A1915] mt-1">${item.title}</h4>
          <p class="text-xs text-[#78766E] mt-0.5">${item.room} • ${item.prof} • ${item.time}</p>
        </div>
      </div>
      <div>
        <button onclick="openMapModal('${item.room}')" class="px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E0] hover:border-[#4F46E5] text-xs font-semibold text-[#4F46E5] transition btn-spring">
          Locate ${item.room}
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================================================
// 8. LINEAR-STYLE COMMAND PALETTE (CMD+K)
// ============================================================================
function openCommandPalette() {
  audio.playClick();
  const modal = document.getElementById('command-palette-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const input = document.getElementById('command-search-input');
    if (input) input.focus();
  }
}

function closeCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function executeCommand(cmd) {
  closeCommandPalette();
  if (cmd === 'map') openMapModal();
  else if (cmd === 'ai') toggleAIChat();
  else if (cmd === 'task') openAddAssignmentModal();
  else if (cmd === 'gpa') openGPASimulatorModal();
  else if (cmd === 'schedule') {
    window.scrollTo({ top: 150, behavior: 'smooth' });
  }
}

function filterCommandPalette(query) {
  const q = query.toLowerCase().trim();
  const items = document.querySelectorAll('#command-results-list > div');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(q) ? 'flex' : 'none';
  });
}

// Keyboard shortcuts (Cmd+K / Ctrl+K & Escape)
window.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const modal = document.getElementById('command-palette-modal');
    if (modal && !modal.classList.contains('hidden')) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  } else if (e.key === 'Escape') {
    closeCommandPalette();
    closeAddAssignmentModal();
    closeGPASimulatorModal();
    closeMapModal();
  }
});

// ============================================================================
// 9. GPA SIMULATOR
// ============================================================================
function openGPASimulatorModal() {
  audio.playClick();
  const modal = document.getElementById('gpa-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeGPASimulatorModal() {
  const modal = document.getElementById('gpa-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function updateGPASimulation(val) {
  const display = document.getElementById('target-gpa-display');
  const projected = document.getElementById('projected-cumulative');
  const target = parseFloat(val);
  if (display) display.textContent = target.toFixed(2);
  
  // Existing 84 credits at 3.88 + 16 new credits at target
  const newCumulative = ((84 * 3.88) + (16 * target)) / 100;
  if (projected) projected.textContent = newCumulative.toFixed(2);
}

// ============================================================================
// 10. CAMPUS MAP MODAL (LEAFLET EMBEDDED)
// ============================================================================
let campusMapInstance = null;

function openMapModal(destination) {
  audio.playClick();
  const modal = document.getElementById('map-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  setTimeout(() => {
    if (!campusMapInstance) {
      // Chanakya University Coordinates
      const center = [13.222871, 77.755633];
      campusMapInstance = L.map('campus-modal-map', {
        center: center,
        zoom: 17,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(campusMapInstance);

      // Key Landmarks
      const landmarks = [
        { name: "Academic Block & Hall 3B", coords: [13.222871, 77.755633], desc: "CS301 Lecture Hall" },
        { name: "Networking Lab 2", coords: [13.223400, 77.755900], desc: "CS305 Lab Center" },
        { name: "Design Studio 1", coords: [13.222300, 77.755300], desc: "UX204 Interaction Studio" },
        { name: "Central Library & Study Pods", coords: [13.223800, 77.755100], desc: "Quiet Study Hub" }
      ];

      landmarks.forEach(l => {
        L.marker(l.coords).addTo(campusMapInstance)
          .bindPopup(`<b>${l.name}</b><br><span style="font-size:11px;color:#666;">${l.desc}</span>`);
      });
    } else {
      campusMapInstance.invalidateSize();
    }

    if (destination) {
      showToast(`Routing to ${destination} on map...`, '📍');
    }
  }, 200);
}

function closeMapModal() {
  const modal = document.getElementById('map-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ============================================================================
// 11. AI STUDY GUIDE CHAT (NOTION AI STYLE)
// ============================================================================
function toggleAIChat() {
  audio.playClick();
  const win = document.getElementById('ai-chat-window');
  if (!win) return;
  if (win.classList.contains('hidden')) {
    win.classList.remove('hidden');
    const input = document.getElementById('ai-chat-input');
    if (input) input.focus();
  } else {
    win.classList.add('hidden');
  }
}

function openAIChatWithPrompt(promptText) {
  toggleAIChat();
  const input = document.getElementById('ai-chat-input');
  if (input) {
    input.value = promptText;
    const form = input.closest('form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }
}

function handleAIChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('ai-chat-input');
  const messages = document.getElementById('ai-chat-messages');
  if (!input || !messages || !input.value.trim()) return;

  const userText = input.value.trim();
  input.value = '';

  // Append user bubble
  const userMsg = document.createElement('div');
  userMsg.className = 'p-3 rounded-xl bg-[#EEF2FF] text-[#1A1915] text-right font-medium';
  userMsg.textContent = userText;
  messages.appendChild(userMsg);
  messages.scrollTop = messages.scrollHeight;

  // Simulate or query backend AI service
  setTimeout(() => {
    fetch('/api/ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userText })
    })
    .then(res => res.json())
    .then(data => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E5E0] text-[#4A4843]';
      aiMsg.innerHTML = data.reply || "I've logged your query and checked your course syllabus!";
      messages.appendChild(aiMsg);
      messages.scrollTop = messages.scrollHeight;
      audio.playCelebrationChime();
    })
    .catch(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'p-3 rounded-xl bg-[#FAFAF8] border border-[#E5E5E0] text-[#4A4843]';
      aiMsg.textContent = "For CS301, remember Dijkstra's algorithm runs in O((V + E) log V) with a binary min-heap! Your next assignment is due tonight at 11:59 PM.";
      messages.appendChild(aiMsg);
      messages.scrollTop = messages.scrollHeight;
    });
  }, 400);
}

// ============================================================================
// 12. POMODORO FOCUS TIMER
// ============================================================================
let timerInterval = null;
let timerSeconds = 25 * 60;

function triggerPomodoroTimer() {
  audio.playClick();
  const btnText = document.getElementById('timer-btn-text');
  if (!timerInterval) {
    showToast('Focus session started: 25 minutes! Stay focused! ⏱️', '🎯');
    timerInterval = setInterval(() => {
      timerSeconds--;
      const m = Math.floor(timerSeconds / 60);
      const s = timerSeconds % 60;
      if (btnText) btnText.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        triggerConfettiLite();
        showToast('Pomodoro session completed! Take a 5-min break! ☕', '🎉');
        if (btnText) btnText.textContent = 'Start Focus Timer';
        timerSeconds = 25 * 60;
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    if (btnText) btnText.textContent = 'Start Focus Timer';
    timerSeconds = 25 * 60;
    showToast('Timer reset.', '⏸️');
  }
}

// Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("🎓 Chanakya Academic Hub - Notion + Duolingo + Linear UI Initialized");
});
