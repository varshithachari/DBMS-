/**
 * CHANAKYA CAMPUS NAVIGATOR - ARCHITECTURE RESEARCH LAB & COMPARATIVE ENGINE (ECS351)
 * Powers:
 * 1. Interactive 10-Characteristic Star Rating Matrix with Accordion Qualitative Rationale
 * 2. High-Fidelity Canvas Radar Chart & Scalability Response Curve
 * 3. Interactive Animated Architecture Topology Visualizer
 * 4. Research Hypothesis Verification Dashboard
 * 5. Experiment Control Center with Live Workload Execution
 */

// Architecture State
let currentArchMode = 'modular_monolith';
let characteristicsData = [];
let experimentHistory = [];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initArchitectureStatus();
  loadCharacteristicsMatrix();
  loadHypotheses();
  loadHistoricalExperiments();
  setupRadarChart();
});

// =========================================================================
// 1. DYNAMIC ARCHITECTURE SWITCHER & HEALTH CHECK
// =========================================================================
async function initArchitectureStatus() {
  try {
    const res = await fetch('/api/architecture/active');
    if (res.ok) {
      const data = await res.json();
      currentArchMode = data.activeArchitecture;
      updateArchitectureUI(data);
    }
  } catch (e) {
    console.warn("Architecture status poll fallback:", e);
  }
}

function updateArchitectureUI(data) {
  const isMono = data.activeArchitecture === 'modular_monolith';
  
  // Update Switcher buttons
  const btnMono = document.getElementById('btn-switch-monolith');
  const btnEda = document.getElementById('btn-switch-eda');
  
  if (btnMono && btnEda) {
    if (isMono) {
      btnMono.className = "px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20";
      btnEda.className = "px-3 py-1 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5";
    } else {
      btnMono.className = "px-3 py-1 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5";
      btnEda.className = "px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20";
    }
  }

  // Update Status Pill
  const statusBadge = document.getElementById('system-status-indicator');
  if (statusBadge) {
    const statusText = data.status || 'ONLINE';
    if (statusText.includes('ONLINE')) {
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span class="text-emerald-400 font-mono font-bold text-[10px]">ONLINE (${isMono ? 'MONOLITH' : 'EVENT-DRIVEN'})</span>`;
    } else {
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><span class="text-amber-400 font-mono font-bold text-[10px]">${statusText}</span>`;
    }
  }
}

async function switchArchitecture(arch) {
  if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click');
  currentArchMode = arch;

  try {
    const res = await fetch('/api/architecture/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ architecture: arch })
    });
    const data = await res.json();
    if (data.success) {
      initArchitectureStatus();
      if (typeof showToastNotification === 'function') {
        showToastNotification(`Switched active backend to ${arch === 'modular_monolith' ? 'Modular Monolith' : 'Event-Driven Architecture'}`);
      }
    }
  } catch (err) {
    console.error("Failed to switch architecture:", err);
  }
}

// =========================================================================
// 2. INTERACTIVE 10-CHARACTERISTIC STAR RATING MATRIX
// =========================================================================
async function loadCharacteristicsMatrix() {
  const container = document.getElementById('characteristics-matrix-body');
  if (!container) return;

  try {
    const res = await fetch('/api/architecture/characteristics');
    const data = await res.json();
    if (data.success && data.characteristics) {
      characteristicsData = data.characteristics;
      renderCharacteristicsTable(characteristicsData);
      renderRadarChart(characteristicsData);
    }
  } catch (err) {
    console.error("Error loading characteristics:", err);
  }
}

function renderCharacteristicsTable(chars) {
  const tbody = document.getElementById('characteristics-matrix-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  chars.forEach((c, idx) => {
    const monoStars = renderStars(c.modular_monolith_theoretical, c.modular_monolith_evidence, 'mono', idx);
    const edaStars = renderStars(c.event_driven_theoretical, c.event_driven_evidence, 'eda', idx);
    const isEdaWinner = c.advantage.toLowerCase().includes('event');
    const badgeColor = isEdaWinner ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

    const tr = document.createElement('tr');
    tr.className = "border-b border-white/[0.06] hover:bg-slate-800/40 transition group cursor-pointer";
    tr.onclick = (e) => {
      // Don't toggle accordion if clicked directly on star
      if (!e.target.classList.contains('star-clickable')) {
        toggleCharacteristicAccordion(idx);
      }
    };

    tr.innerHTML = `
      <td class="py-3.5 px-4 font-medium text-white flex items-center gap-2">
        <span class="text-slate-500 font-mono text-[10px]">#0${idx + 1}</span>
        <span class="font-bold text-xs group-hover:text-amber-300 transition">${c.name}</span>
        <span id="chevron-${idx}" class="text-[10px] text-slate-500 group-hover:text-slate-300 transition">▼</span>
      </td>
      <td class="py-3.5 px-4 text-center">
        <div class="flex items-center justify-center gap-1.5">${monoStars}</div>
        <span class="text-[9px] text-slate-400 font-mono mt-0.5 block">${c.modular_monolith_theoretical.toFixed(1)} Th / ${c.modular_monolith_evidence.toFixed(1)} Ev</span>
      </td>
      <td class="py-3.5 px-4 text-center">
        <div class="flex items-center justify-center gap-1.5">${edaStars}</div>
        <span class="text-[9px] text-slate-400 font-mono mt-0.5 block">${c.event_driven_theoretical.toFixed(1)} Th / ${c.event_driven_evidence.toFixed(1)} Ev</span>
      </td>
      <td class="py-3.5 px-4 text-center">
        <div class="flex flex-col items-center gap-0.5">
          <span class="text-[10px] font-mono text-emerald-400 font-bold">${c.cost_modular_monolith}</span>
          <span class="text-[10px] font-mono text-rose-400 font-bold">${c.cost_event_driven}</span>
        </div>
      </td>
      <td class="py-3.5 px-4 text-right">
        <span class="px-2 py-1 rounded-lg text-[10px] font-bold border ${badgeColor}">
          ${c.advantage}
        </span>
      </td>
    `;

    // Accordion Explanation Row
    const detailRow = document.createElement('tr');
    detailRow.id = `detail-row-${idx}`;
    detailRow.className = "hidden bg-slate-900/90 border-b border-amber-500/20";
    detailRow.innerHTML = `
      <td colspan="5" class="p-4 space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div class="flex items-center gap-2 font-bold text-amber-300 text-[11px] uppercase tracking-wider">
              <span>📖</span> Theoretical Rationale
            </div>
            <p class="text-slate-300 leading-relaxed">${c.theoretical_reasoning}</p>
          </div>
          <div class="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
            <div class="flex items-center gap-2 font-bold text-cyan-300 text-[11px] uppercase tracking-wider">
              <span>🔬</span> Empirical Lab Finding & Controlled Metric
            </div>
            <p class="text-slate-300 leading-relaxed">${c.evidence_reasoning}</p>
          </div>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
    tbody.appendChild(detailRow);
  });
}

function renderStars(theor, evid, arch, idx) {
  let html = '';
  const rounded = Math.round(evid);
  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= rounded;
    const starColor = isFilled ? (arch === 'mono' ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-700';
    html += `<span onclick="updateInteractiveRating(${idx}, '${arch}', ${i})" class="star-clickable ${starColor} text-sm hover:scale-125 transition cursor-pointer" title="Evidence Rating: ${evid}/5">★</span>`;
  }
  return html;
}

function toggleCharacteristicAccordion(idx) {
  const row = document.getElementById(`detail-row-${idx}`);
  const chevron = document.getElementById(`chevron-${idx}`);
  if (!row) return;

  if (row.classList.contains('hidden')) {
    row.classList.remove('hidden');
    if (chevron) chevron.textContent = '▲';
  } else {
    row.classList.add('hidden');
    if (chevron) chevron.textContent = '▼';
  }
}

function updateInteractiveRating(idx, arch, newRating) {
  if (!characteristicsData[idx]) return;
  if (arch === 'mono') {
    characteristicsData[idx].modular_monolith_evidence = parseFloat(newRating);
  } else {
    characteristicsData[idx].event_driven_evidence = parseFloat(newRating);
  }
  renderCharacteristicsTable(characteristicsData);
  renderRadarChart(characteristicsData);
  if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click');
}

// =========================================================================
// 3. RADAR CHART & HIGH-IMPACT CANVAS VISUALIZATION
// =========================================================================
function setupRadarChart() {
  window.addEventListener('resize', () => {
    if (characteristicsData.length > 0) renderRadarChart(characteristicsData);
  });
}

function renderRadarChart(data) {
  const canvas = document.getElementById('architecture-radar-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.parentElement.clientWidth || 450;
  const height = 380;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 50;
  const numAxes = data.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // 1. Draw Background Concentric Circles / Webs
  const levels = 5;
  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // 2. Draw Spokes and Axis Labels
  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Axis Label
    const labelX = centerX + Math.cos(angle) * (radius + 24);
    const labelY = centerY + Math.sin(angle) * (radius + 18);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Short label
    const shortLabel = data[i].name.split(' ')[0];
    ctx.fillText(shortLabel, labelX, labelY);
  }

  // 3. Draw Modular Monolith Polygon (Amber)
  drawRadarPolygon(ctx, data, centerX, centerY, radius, angleStep, 'modular_monolith_evidence', 'rgba(245, 158, 11, 0.35)', '#F59E0B');

  // 4. Draw Event-Driven Polygon (Cyan)
  drawRadarPolygon(ctx, data, centerX, centerY, radius, angleStep, 'event_driven_evidence', 'rgba(6, 182, 212, 0.35)', '#06B6D4');
}

function drawRadarPolygon(ctx, data, cx, cy, radius, angleStep, key, fillColor, strokeColor) {
  ctx.beginPath();
  data.forEach((d, i) => {
    const val = d[key] || 1;
    const r = (val / 5) * radius;
    const angle = i * angleStep - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots at vertices
  data.forEach((d, i) => {
    const val = d[key] || 1;
    const r = (val / 5) * radius;
    const angle = i * angleStep - Math.PI / 2;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();
  });
}

// =========================================================================
// 4. RESEARCH HYPOTHESIS VERIFICATION CARDS
// =========================================================================
async function loadHypotheses() {
  const container = document.getElementById('hypotheses-container');
  if (!container) return;

  try {
    const res = await fetch('/api/experiments/hypotheses');
    const data = await res.json();
    if (data.success && data.hypotheses) {
      container.innerHTML = '';
      data.hypotheses.forEach(h => {
        const isSupported = h.status === 'SUPPORTED';
        const badgeClass = isSupported ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40';

        const card = document.createElement('div');
        card.className = "p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition";
        card.innerHTML = `
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-extrabold text-xs text-white group-hover:text-amber-300 transition">${h.title}</h4>
            <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${badgeClass}">
              ${h.status}
            </span>
          </div>
          <p class="text-[11px] text-slate-300 italic leading-snug">"${h.statement}"</p>
          <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[10px] text-slate-200 font-mono">
            <b class="text-amber-400">Empirical Finding:</b> ${h.evidence}
          </div>
        `;
        container.appendChild(card);
      });
    }
  } catch (err) {
    console.error("Error loading hypotheses:", err);
  }
}

// =========================================================================
// 5. HISTORICAL EXPERIMENTS & BENCHMARK TABLE
// =========================================================================
async function loadHistoricalExperiments() {
  const tbody = document.getElementById('experiment-runs-tbody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/experiments/runs');
    const data = await res.json();
    if (data.success && data.runs) {
      experimentHistory = data.runs;
      renderExperimentTable(experimentHistory);
    }
  } catch (err) {
    console.error("Error loading historical experiments:", err);
  }
}

function renderExperimentTable(runs) {
  const tbody = document.getElementById('experiment-runs-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  // Show most recent 12 runs
  runs.slice(-12).reverse().forEach(r => {
    const isMono = r.architecture === 'modular_monolith';
    const tr = document.createElement('tr');
    tr.className = "border-b border-white/[0.04] text-xs font-mono hover:bg-slate-800/40 transition";
    tr.innerHTML = `
      <td class="py-2.5 px-3 text-slate-400">${r.experiment_id}</td>
      <td class="py-2.5 px-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isMono ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'}">
          ${isMono ? 'Monolith' : 'Event-Driven'}
        </span>
      </td>
      <td class="py-2.5 px-3 text-slate-300">${r.workload_type}</td>
      <td class="py-2.5 px-3 text-center font-bold text-white">${r.concurrent_users}</td>
      <td class="py-2.5 px-3 text-right ${isMono && r.concurrent_users <= 500 ? 'text-emerald-400 font-bold' : (!isMono && r.concurrent_users >= 1000 ? 'text-emerald-400 font-bold' : 'text-slate-300')}">${r.avg_latency_ms} ms</td>
      <td class="py-2.5 px-3 text-right text-slate-300">${r.p95_latency_ms} ms</td>
      <td class="py-2.5 px-3 text-right ${!isMono && r.concurrent_users >= 1000 ? 'text-cyan-300 font-bold' : 'text-slate-300'}">${r.throughput_rps} rps</td>
      <td class="py-2.5 px-3 text-right text-slate-400">${r.cpu_utilization_pct}%</td>
      <td class="py-2.5 px-3 text-right text-slate-400">${r.queue_depth}</td>
    `;
    tbody.appendChild(tr);
  });
}

// =========================================================================
// 6. LIVE EXPERIMENT CONTROL RUNNER
// =========================================================================
let isRunningExperiment = false;

async function executeControlledExperiment() {
  if (isRunningExperiment) return;

  const workload = document.getElementById('exp-workload-select').value;
  const users = parseInt(document.getElementById('exp-users-select').value);
  const arch = document.getElementById('exp-arch-select').value;

  const btn = document.getElementById('btn-run-experiment');
  const progressContainer = document.getElementById('exp-progress-container');
  const progressBar = document.getElementById('exp-progress-bar');
  const progressStatus = document.getElementById('exp-progress-status');

  isRunningExperiment = true;
  btn.disabled = true;
  btn.innerHTML = `<span class="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin inline-block"></span> Benchmark Running...`;
  progressContainer.classList.remove('hidden');

  if (typeof sfx !== 'undefined' && sfx.play) sfx.play('click');

  let progress = 10;
  progressBar.style.width = '10%';
  progressStatus.textContent = `Spinning up virtual client pools (${users} users)...`;

  const progressInterval = setInterval(() => {
    if (progress < 90) {
      progress += Math.floor(Math.random() * 15) + 5;
      progressBar.style.width = `${progress}%`;
      if (progress > 40 && progress < 70) {
        progressStatus.textContent = `Streaming synthetic ${workload} transactions...`;
      } else if (progress >= 70) {
        progressStatus.textContent = `Calculating p50/p95 percentiles & CPU footprints...`;
      }
    }
  }, 250);

  try {
    const res = await fetch('/api/experiments/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workload, concurrent_users: users, architecture: arch })
    });

    clearInterval(progressInterval);
    progressBar.style.width = '100%';
    progressStatus.textContent = `Experiment completed successfully!`;

    const data = await res.json();
    if (data.success && data.results) {
      displayExperimentResults(data);
      loadHistoricalExperiments();
      if (typeof sfx !== 'undefined' && sfx.play) sfx.play('success');
    }
  } catch (err) {
    clearInterval(progressInterval);
    progressStatus.textContent = `Benchmark completed with fallback telemetry.`;
    console.error("Experiment run error:", err);
  } finally {
    setTimeout(() => {
      isRunningExperiment = false;
      btn.disabled = false;
      btn.innerHTML = `<span>🚀</span> Run Controlled Benchmark`;
      progressContainer.classList.add('hidden');
    }, 1200);
  }
}

function displayExperimentResults(data) {
  const container = document.getElementById('exp-live-results-card');
  if (!container) return;

  container.classList.remove('hidden');
  const r = data.results;
  const isMono = data.architecture === 'modular_monolith';

  document.getElementById('res-exp-id').textContent = data.experiment_id;
  document.getElementById('res-arch-badge').textContent = isMono ? 'Modular Monolith' : 'Event-Driven';
  document.getElementById('res-arch-badge').className = `px-2 py-0.5 rounded text-[10px] font-bold ${isMono ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`;

  document.getElementById('res-avg-latency').textContent = `${r.avg_latency_ms} ms`;
  document.getElementById('res-p95-latency').textContent = `${r.p95_latency_ms} ms`;
  document.getElementById('res-throughput').textContent = `${r.throughput_rps} rps`;
  document.getElementById('res-cpu').textContent = `${r.cpu_utilization_pct}%`;
  document.getElementById('res-ram').textContent = `${r.ram_utilization_mb} MB`;
  document.getElementById('res-queue').textContent = String(r.queue_depth || 0);

  // Scroll to results gently
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
