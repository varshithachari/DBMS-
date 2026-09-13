// Operations & Executive Portal Controller (Website 3)
class AdminPortalApp {
  constructor() {
    this.footfallChart = null;
    this.socket = null;
    this.activePop = 4820;
    this.gateRate = 148;
  }

  init() {
    console.log('[Admin Portal] Initialized');
    this.initSocket();
    this.initChart();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  initSocket() {
    if (typeof io !== 'undefined') {
      this.socket = io();
      this.socket.on('telemetry_pulse', (data) => {
        this.activePop = data.activePopulation;
        this.gateRate = data.gateThroughput;
        this.updateKpiDisplays();
      });

      this.socket.on('notification_broadcast', (notif) => {
        alert(`🚨 Campus Broadcast Received:\n[${notif.title}]\n${notif.message}`);
      });
    }
  }

  updateKpiDisplays() {
    const popEl = document.getElementById('adminActivePop');
    const gateEl = document.getElementById('adminGateRate');
    if (popEl) popEl.textContent = Number(this.activePop).toLocaleString();
    if (gateEl) gateEl.textContent = this.gateRate + ' / min';
  }

  initChart() {
    const ctx = document.getElementById('footfallChart');
    if (!ctx || typeof Chart === 'undefined') return;

    this.footfallChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
        datasets: [{
          label: 'Campus Footfall Density',
          data: [1200, 3400, 4820, 5120, 4300, 2800, 1100],
          borderColor: '#A855F7',
          backgroundColor: 'rgba(168, 85, 247, 0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#F59E0B',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  }

  runScenario(type) {
    const box = document.getElementById('simResultBox');
    const titleEl = document.getElementById('simTitle');
    const metricsEl = document.getElementById('simMetrics');
    const actionsEl = document.getElementById('simActions');
    if (!box) return;

    box.classList.remove('hidden');

    if (type === 'surge') {
      titleEl.textContent = "Fest Crowd Surge Simulation (+5,000 Attendees)";
      metricsEl.innerHTML = `
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-amber-400 font-bold font-mono">9,820</div><div class="text-[10px] text-slate-400">Peak Population</div></div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-rose-400 font-bold font-mono">88% Stress</div><div class="text-[10px] text-slate-400">Auditorium Foyer</div></div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-emerald-400 font-bold font-mono">+4 Bays</div><div class="text-[10px] text-slate-400">Parking Relocation</div></div>
      `;
      actionsEl.innerHTML = `
        <div class="text-[11px] font-bold text-amber-400">AI Mitigation Directives:</div>
        <div class="text-[11px] text-slate-300">1. Open Turnstiles 3 & 4 at Gate 1 Checkpoint</div>
        <div class="text-[11px] text-slate-300">2. Deploy 6 volunteer marshals to Annapurna Dining crossroad</div>
      `;
    } else if (type === 'gate') {
      titleEl.textContent = "Gate 1 Lockdown & VIP Traffic Reroute";
      metricsEl.innerHTML = `
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-rose-400 font-bold font-mono">CLOSED</div><div class="text-[10px] text-slate-400">Main Gate 1</div></div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-emerald-400 font-bold font-mono">240/min</div><div class="text-[10px] text-slate-400">East Gate 2 Load</div></div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-blue-400 font-bold font-mono">+4 mins</div><div class="text-[10px] text-slate-400">Transit Delta</div></div>
      `;
      actionsEl.innerHTML = `
        <div class="text-[11px] font-bold text-rose-400">AI Mitigation Directives:</div>
        <div class="text-[11px] text-slate-300">1. Live route guidance push notification sent to all student apps</div>
        <div class="text-[11px] text-slate-300">2. Campus battery shuttles dispatched to East Gate 2 perimeter</div>
      `;
    } else if (type === 'rain') {
      titleEl.textContent = "Monsoon Rain Outdoor Relocation";
      metricsEl.innerHTML = `
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-blue-400 font-bold font-mono">Arya Hall</div><div class="text-[10px] text-slate-400">New Venue</div></div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-emerald-400 font-bold font-mono">450 Seats</div><div class="text-[10px] text-slate-400">Indoor Capacity</div></div>
        <div class="p-2 rounded bg-slate-900 border border-slate-800"><div class="text-purple-400 font-bold font-mono">ACTIVE</div><div class="text-[10px] text-slate-400">Live Stream Spillover</div></div>
      `;
      actionsEl.innerHTML = `
        <div class="text-[11px] font-bold text-blue-400">AI Mitigation Directives:</div>
        <div class="text-[11px] text-slate-300">1. Stage sound equipment relocated into Arya Convention Hall</div>
        <div class="text-[11px] text-slate-300">2. High-definition LED overflow stream enabled in Kalam Tech Park Bay 1</div>
      `;
    }
  }

  resolveIssue(btn) {
    const card = btn.closest('.p-3');
    if (card) {
      card.classList.add('opacity-50');
      btn.textContent = "Resolved ✓";
      btn.disabled = true;
      btn.className = "w-full py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold";
      alert("✅ Issue marked as resolved in central maintenance registry.");
    }
  }

  injectCrowd(delta) {
    this.activePop += delta;
    this.updateKpiDisplays();
    alert(`📊 Injected crowd surge: +${delta} visitors\nNew Campus Population: ${this.activePop}`);
  }

  injectScans(count) {
    this.gateRate += count;
    this.updateKpiDisplays();
    alert(`🎟️ Injected +${count} instant QR check-in scans at Turnstiles.`);
  }

  triggerAlert() {
    alert("⚠️ High-Priority Broadcast Triggered:\n'Monsoon rain advisory: Indoor activities initiated. Outdoor sports suspended for 2 hours.'");
  }

  openReportModal() {
    const modal = document.getElementById('reportIssueModal');
    if (modal) modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  submitIssueForm(e) {
    e.preventDefault();
    const title = document.getElementById('issueTitle').value;
    const loc = document.getElementById('issueLocation').value;

    const container = document.getElementById('issuesListContainer');
    if (container) {
      const newCard = document.createElement('div');
      newCard.className = 'p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2';
      newCard.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold font-mono text-[10px]">NEW TICKET</span>
          <span class="text-slate-400 text-[10px]">Just now</span>
        </div>
        <div class="font-semibold text-slate-200">${title}</div>
        <p class="text-[11px] text-slate-400">📍 ${loc} • Auto-assigned to Operations Team</p>
        <button onclick="adminApp.resolveIssue(this)" class="w-full py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition">
          Mark Resolved ✓
        </button>
      `;
      container.prepend(newCard);
    }

    alert(`🛠️ Maintenance Ticket Created & Dispatched:\n"${title}" at ${loc}`);
    this.closeModal('reportIssueModal');
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
  }
}

const adminApp = new AdminPortalApp();
window.addEventListener('DOMContentLoaded', () => adminApp.init());
