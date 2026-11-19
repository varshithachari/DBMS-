const fs = require('fs');
const path = require('path');
const canteenData = require('../data/canteenData');

// Read public/js/app.js
const appJsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Construct the client-side dining engine code
const diningEngineCode = `
// ============================================================================
// 11. FOOD & SPORTS SERVICE (CAMPUS FOOD COURT, IYENGAR'S & NANDINI CAFE)
// ============================================================================
const EMBEDDED_CANTEEN_DATA = ${JSON.stringify(canteenData, null, 2)};

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
      renderFoodOutlets();
      renderSportsCourts();
    })
    .catch(err => {
      console.warn("Using embedded canteen data fallback:", err);
      appState.canteenData = EMBEDDED_CANTEEN_DATA;
      renderFoodOutlets();
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
  const fcHtml = \`
    <div class="glass-card rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-slate-950 space-y-4 shadow-xl hover:border-amber-400/50 transition">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">🍲</span>
            <h3 class="text-base font-extrabold text-white">\${escapeHtml(fc.name)}</h3>
          </div>
          <p class="text-xs text-amber-400 mt-1 font-mono">
            🔄 \${escapeHtml(fc.building)} • \${escapeHtml(data.cycleVersion)}
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
          <span class="text-cyan-400 font-semibold">Today's Schedule (\${currentDayKey.toUpperCase()}):</span> 
          Breakfast (Idly/Paratha/Dosa), Lunch (Special Thali & Ragi Mudde), Snacks & Royal Dinner.
        </div>
        <div class="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span>⏱️ Avg Wait: <b>\${fc.currentCrowdWaitMins} mins</b></span>
          <span>⭐ Rating: <b>\${fc.hygieneRating}</b></span>
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
  \`;

  // Card 2: The Iyengar's Canteen
  const iyHtml = \`
    <div class="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-slate-950 space-y-4 shadow-xl hover:border-emerald-400/50 transition">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">🥪</span>
            <h3 class="text-base font-extrabold text-white">\${escapeHtml(iy.name)}</h3>
          </div>
          <p class="text-xs text-emerald-400 mt-1 font-mono">
            🏛️ \${escapeHtml(iy.building)} • Verified On-Campus Board
          </p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          OPEN
        </span>
      </div>

      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Whiteboard Specialties:</span>
          <span class="text-amber-400 text-[10px] font-mono">\${escapeHtml(iy.parcelPolicy)}</span>
        </div>
        <div class="flex flex-wrap gap-1.5 text-[11px]">
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Juices (₹40-80)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Sandwiches (₹70-100)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Chats (₹60-70)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Fries (₹70-90)</span>
          <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Mojitos (₹80)</span>
        </div>
        <div class="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
          <span>⏱️ Avg Wait: <b>\${iy.currentCrowdWaitMins} mins</b></span>
          <span>⭐ Rating: <b>\${iy.hygieneRating}</b></span>
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
  \`;

  // Card 3: Nandini Cafe
  const ndHtml = \`
    <div class="glass-card rounded-2xl p-5 border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-slate-900/40 to-slate-950 space-y-4 shadow-xl hover:border-blue-400/50 transition">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">🥛</span>
            <h3 class="text-base font-extrabold text-white">\${escapeHtml(nd.name)}</h3>
          </div>
          <p class="text-xs text-blue-400 mt-1 font-mono">
            🎪 \${escapeHtml(nd.building)} • Pure KMF Karnataka Dairy
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
          <span>⏱️ Avg Wait: <b>\${nd.currentCrowdWaitMins} mins</b></span>
          <span>⭐ Rating: <b>\${nd.hygieneRating}</b></span>
        </div>
      </div>

      <div class="pt-1">
        <button onclick="orderFoodModal('Nandini Milk Parlour')" class="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5">
          <span>☕</span> Pre-Order KMF Staples Token
        </button>
      </div>
    </div>
  \`;

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

  return \`
    <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🍲</span>
            <div>
              <h2 class="text-lg font-black text-white">Chanakya Food Court — Monthly Dining Schedule</h2>
              <p class="text-xs text-amber-400 font-mono">\${escapeHtml(data.cycleVersion)} • FSSAI Grade A+</p>
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
          \${fc.caterers.map(c => \`
            <button onclick="switchMessCaterer('\${c.id}')" class="py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 \${c.id === activeMessCaterer ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'}">
              <span>\${c.id === 'caterer_blue_dove' ? '🕊️' : '🍛'}</span>
              <span>\${escapeHtml(c.name)}</span>
            </button>
          \`).join('')}
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>📅 Month:</span>
          <span class="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">\${escapeHtml(data.activeMonth)}</span>
        </div>
      </div>

      <!-- Day Selector Pills -->
      <div class="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        \${days.map(d => \`
          <button onclick="switchMessDay('\${d.key}')" class="py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition \${d.key === activeMessDay ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'}">
            \${d.label}
          </button>
        \`).join('')}
      </div>

      <!-- Meal Schedule Grid -->
      <div class="p-5 overflow-y-auto space-y-4">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span class="font-bold text-white text-sm">Meals for \${escapeHtml(dayData.day)} (\${dayData.date})</span>
          <span class="text-cyan-400 font-mono">Caterer: \${escapeHtml(caterer.name)}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Breakfast -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-amber-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🍳</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-amber-400 tracking-wider">Breakfast</h4>
                  <span class="text-[10px] text-slate-400 font-mono">\${fc.mealTimings.breakfast}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              \${dayData.breakfast.map(item => \`
                <span class="px-2 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 \${item.includes('Limited') || item.includes('Egg') ? 'border-amber-500/40 text-amber-300 font-semibold' : ''}">
                  \${escapeHtml(item)}
                </span>
              \`).join('')}
            </div>
          </div>

          <!-- Lunch -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-emerald-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🍛</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-emerald-400 tracking-wider">Grand Lunch</h4>
                  <span class="text-[10px] text-slate-400 font-mono">\${fc.mealTimings.lunch}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              \${dayData.lunch.map(item => \`
                <span class="px-2 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 \${item.includes('Payasa') || item.includes('Jamun') || item.includes('Sheera') || item.includes('Ladoo') || item.includes('Kheer') ? 'border-pink-500/40 text-pink-300 font-bold' : ''}">
                  \${escapeHtml(item)}
                </span>
              \`).join('')}
            </div>
          </div>

          <!-- Snacks -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-cyan-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">☕</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-cyan-400 tracking-wider">Evening Snacks & High Tea</h4>
                  <span class="text-[10px] text-slate-400 font-mono">\${fc.mealTimings.snacks}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              \${dayData.snacks.map(item => \`
                <span class="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 text-cyan-200 font-semibold">
                  \${escapeHtml(item)}
                </span>
              \`).join('')}
            </div>
          </div>

          <!-- Dinner -->
          <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 hover:border-purple-500/40 transition">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🍲</span>
                <div>
                  <h4 class="text-xs font-black uppercase text-purple-400 tracking-wider">Dinner</h4>
                  <span class="text-[10px] text-slate-400 font-mono">\${fc.mealTimings.dinner}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-1">
              \${dayData.dinner.map(item => \`
                <span class="px-2 py-1 rounded-lg text-xs bg-slate-900 text-slate-200 border border-slate-800 \${item.includes('Chicken') || item.includes('Egg') || item.includes('Biryani') ? 'border-amber-500/50 text-amber-300 font-bold' : ''}">
                  \${escapeHtml(item)}
                </span>
              \`).join('')}
            </div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 Note: Food Court menu automatically updates on the 1st of every calendar month.</span>
          <button onclick="orderFoodModal('\${escapeHtml(caterer.name)}')" class="py-1.5 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition">
            Generate Meal Token
          </button>
        </div>
      </div>
    </div>
  \`;
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
    return \`<div class="col-span-full py-12 text-center text-slate-500 text-sm">No items matching "\${escapeHtml(iyengarSearchQuery)}"</div>\`;
  }

  return items.map(it => \`
    <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between group">
      <div class="space-y-1">
        <div class="flex items-center gap-1.5">
          <span class="text-sm">\${it.icon}</span>
          <h4 class="text-xs font-bold text-white group-hover:text-emerald-300 transition">\${escapeHtml(it.name)}</h4>
        </div>
        <div class="flex items-center gap-2 text-[10px] text-slate-400">
          <span class="text-emerald-400 font-semibold">\${escapeHtml(it.tag)}</span>
          <span>•</span>
          <span>⏱️ \${it.prepTime}</span>
        </div>
      </div>
      <div class="flex items-center gap-2.5">
        <span class="text-sm font-black text-amber-400">₹\${it.price}</span>
        <button onclick="orderFoodModal('The Iyengar\\'s (\${escapeHtml(it.name)})')" class="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 transition">
          + Add
        </button>
      </div>
    </div>
  \`).join('');
}

function getIyengarsModalHtml() {
  const data = appState.canteenData || EMBEDDED_CANTEEN_DATA;
  const iy = data.iyengars;

  return \`
    <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🥪</span>
            <div>
              <h2 class="text-lg font-black text-white">The Iyengar's Canteen & Juice Bar</h2>
              <p class="text-xs text-emerald-400 font-mono">\${escapeHtml(iy.building)} • Verified Whiteboard Menu</p>
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
          <button onclick="filterIyengarCat('all')" class="py-1 px-3 rounded-lg font-bold whitespace-nowrap transition \${activeIyengarCategory === 'all' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}">
            All (50+)
          </button>
          \${iy.categories.map(c => \`
            <button onclick="filterIyengarCat('\${c.name}')" class="py-1 px-3 rounded-lg font-bold whitespace-nowrap transition \${activeIyengarCategory === c.name ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}">
              \${c.icon} \${c.name}
            </button>
          \`).join('')}
        </div>
      </div>

      <!-- Items Grid -->
      <div class="p-5 overflow-y-auto">
        <div id="iyengars-items-grid" class="grid grid-cols-1 md:grid-cols-2 gap-3">
          \${renderIyengarItemsGrid()}
        </div>
      </div>

      <!-- Footer Policy -->
      <div class="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span class="text-amber-400 font-mono">📦 \${escapeHtml(iy.parcelPolicy)}</span>
        <span class="text-slate-500 text-[11px]">Timings: \${escapeHtml(iy.timings)}</span>
      </div>
    </div>
  \`;
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

  modal.innerHTML = \`
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
  \`;
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
  showToast("Pre-Order Token Generated", \`Token #\${token} generated for \${outletName}. Ready at pickup counter in 8-10 mins.\`, 'success');
  sfx.play('success');
}
`;

// Replace renderFoodOutlets and orderFoodModal in appJs
const targetRegex = /\/\/ 11\. FOOD & SPORTS SERVICE[\s\S]*?function renderSportsCourts\(\)/;
if (appJs.match(targetRegex)) {
  appJs = appJs.replace(targetRegex, diningEngineCode + '\n\nfunction renderSportsCourts()');
  fs.writeFileSync(appJsPath, appJs, 'utf8');
  console.log('✅ Patched public/js/app.js with complete Canteen & Dining Engine');

  // Also sync to docs/js/app.js
  const docsJsPath = path.join(__dirname, '..', 'docs', 'js', 'app.js');
  fs.writeFileSync(docsJsPath, appJs, 'utf8');
  console.log('✅ Synced to docs/js/app.js');
} else {
  console.error('❌ Could not locate target in public/js/app.js');
}

// Update student.js AI answer
const studentJsPath = path.join(__dirname, '..', 'public', 'js', 'student.js');
let studentJs = fs.readFileSync(studentJsPath, 'utf8');
const studentTarget = /answer = "Annapurna Dining Pavilion is serving breakfast[^"]*";/;
const studentReplacement = 'answer = "Campus dining includes: 1) Central Food Court (Blue Dove & Sagar) serving 4 daily meals under the November monthly schedule, 2) The Iyengar\'s Canteen in Academic Block 2 (fresh juices, sandwiches, chats), and 3) Nandini Milk Parlour at the Amphitheatre Walkway.";';

if (studentJs.match(studentTarget)) {
  studentJs = studentJs.replace(studentTarget, studentReplacement);
  fs.writeFileSync(studentJsPath, studentJs, 'utf8');
  console.log('✅ Patched public/js/student.js AI dining guide');

  const docsStudentPath = path.join(__dirname, '..', 'docs', 'js', 'student.js');
  fs.writeFileSync(docsStudentPath, studentJs, 'utf8');
  console.log('✅ Synced to docs/js/student.js');
}
