grafana_js = '''

// =========================================================================
// 8. REALISTIC GRAFANA OBSERVABILITY CONSOLE (Prometheus Live Telemetry)
// =========================================================================

let grafanaUsers = 100;
let grafanaSurgeActive = false;
let grafanaSurgeInterval = null;
let grafanaSurgePhase = 0;
const GRAFANA_HISTORY_LEN = 25;

let grafanaHistory = {
  mono_lat: [],
  eda_lat: [],
  mono_thru: [],
  eda_thru: [],
  mono_cpu: [],
  eda_cpu: [],
  mono_ram: [],
  eda_ram: [],
  eda_queue: [],
  mono_err: [],
  eda_err: []
};

function initGrafanaConsole() {
  // Pre-fill history buffer so graphs look realistic immediately on open
  prefillGrafanaHistory(grafanaUsers);
  renderAllGrafanaPanels();
  updateGrafanaUI();
}

function prefillGrafanaHistory(users) {
  grafanaHistory = {
    mono_lat: [], eda_lat: [],
    mono_thru: [], eda_thru: [],
    mono_cpu: [], eda_cpu: [],
    mono_ram: [], eda_ram: [],
    eda_queue: [], mono_err: [], eda_err: []
  };

  for (let i = 0; i < GRAFANA_HISTORY_LEN; i++) {
    // slight variation for past points
    const jitterFactor = (Math.sin(i * 0.5) * 0.15);
    const u = Math.max(10, Math.round(users * (1 + jitterFactor)));
    pushGrafanaMetrics(u, false);
  }
}

function calculateArchitectureMetrics(u) {
  const noise = (Math.random() - 0.5);

  // Latency (ms) - Monolith is fast under 100, then explodes due to thread contention
  let mLat, eLat;
  if (u <= 50) {
    mLat = 4.2 + (u * 0.12) + (noise * 0.8);
    eLat = 18.5 + (u * 0.08) + (noise * 1.2);
  } else if (u <= 120) {
    mLat = 10.2 + (u * 0.14) + (noise * 2.5); // crossover around 90-110
    eLat = 22.0 + (u * 0.05) + (noise * 1.5);
  } else if (u <= 400) {
    // Sharp contention curve for Monolith
    mLat = 25.0 + Math.pow(u / 28, 1.45) + (noise * 12.0);
    eLat = 26.5 + (u * 0.032) + (noise * 2.0); // queue buffer absorbs
  } else {
    // Stress 1000 - 2000 users
    mLat = 175.0 + Math.pow(u - 400, 0.95) * 0.55 + (noise * 35.0);
    eLat = 38.5 + (u * 0.003) + (noise * 2.8);
  }
  mLat = Math.max(2.5, roundNum(mLat, 1));
  eLat = Math.max(12.0, roundNum(eLat, 1));

  // Throughput (rps)
  let mThru, eThru;
  if (u <= 100) {
    mThru = u * 3.8 + (noise * 15);
    eThru = u * 3.9 + (noise * 12);
  } else if (u <= 400) {
    mThru = Math.max(80, 410 - (u * 0.78) + (noise * 20)); // Monolith collapses under thread contention
    eThru = u * 3.7 + (noise * 25); // EDA scales linearly
  } else {
    mThru = Math.max(45, 120 - ((u - 400) * 0.04) + (noise * 10));
    eThru = 1480 + ((u - 400) * 0.85) + (noise * 40);
  }
  mThru = Math.max(40, roundNum(mThru, 1));
  eThru = Math.max(50, roundNum(eThru, 1));

  // CPU Utilization (%)
  let mCpu = Math.min(96.5, Math.max(8, 8 + (u * 0.22) + (noise * 4)));
  let eCpu = Math.min(82.0, Math.max(6, 6 + (u * 0.14) + (noise * 3)));
  mCpu = roundNum(mCpu, 1);
  eCpu = roundNum(eCpu, 1);

  // RAM (MB)
  let mRam = Math.min(1024, 180 + Math.floor(u / 100) * 210); // scale requires duplicating full image
  let eRam = Math.min(480, 260 + (u * 0.12) + (noise * 6));
  mRam = roundNum(mRam, 0);
  eRam = roundNum(eRam, 0);

  // Queue Depth (msgs)
  let eQueue = 0;
  if (u > 80) {
    eQueue = Math.round(Math.pow((u - 80) / 18, 1.35) + (noise * 3));
  }
  eQueue = Math.max(0, eQueue);

  // Error Rate (%)
  let mErr = 0;
  if (u >= 250) {
    mErr = roundNum(Math.min(12.5, Math.pow((u - 250) / 75, 1.3) + Math.abs(noise * 0.4)), 2);
  }
  let eErr = 0.00; // Zero loss due to durable queue

  return { mLat, eLat, mThru, eThru, mCpu, eCpu, mRam, eRam, eQueue, mErr, eErr };
}

function pushGrafanaMetrics(u, doRender = true) {
  const m = calculateArchitectureMetrics(u);

  grafanaHistory.mono_lat.push(m.mLat);
  grafanaHistory.eda_lat.push(m.eLat);
  grafanaHistory.mono_thru.push(m.mThru);
  grafanaHistory.eda_thru.push(m.eThru);
  grafanaHistory.mono_cpu.push(m.mCpu);
  grafanaHistory.eda_cpu.push(m.eCpu);
  grafanaHistory.mono_ram.push(m.mRam);
  grafanaHistory.eda_ram.push(m.eRam);
  grafanaHistory.eda_queue.push(m.eQueue);
  grafanaHistory.mono_err.push(m.mErr);
  grafanaHistory.eda_err.push(m.eErr);

  // Maintain window
  if (grafanaHistory.mono_lat.length > GRAFANA_HISTORY_LEN) {
    Object.keys(grafanaHistory).forEach(k => grafanaHistory[k].shift());
  }

  if (doRender) {
    updateGrafanaUI(m);
    renderAllGrafanaPanels();
  }
}

function setGrafanaUsers(vu) {
  grafanaUsers = parseInt(vu, 10);
  const slider = document.getElementById('grafana-vu-slider');
  if (slider) slider.value = grafanaUsers;

  // Add 3 progressive variation ticks so the user sees the graph physically react
  pushGrafanaMetrics(grafanaUsers, true);
  updateGrafanaButtons();
}

function onGrafanaSliderChange(val) {
  grafanaUsers = parseInt(val, 10);
  pushGrafanaMetrics(grafanaUsers, true);
  updateGrafanaButtons();
}

function updateGrafanaButtons() {
  const btns = document.querySelectorAll('.grafana-vu-btn');
  btns.forEach(b => {
    const vu = parseInt(b.getAttribute('data-vu'), 10);
    if (vu === grafanaUsers) {
      b.className = 'grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-black transition bg-cyan-500 text-slate-950 border border-cyan-400 shadow-md shadow-cyan-500/20';
    } else {
      b.className = 'grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]';
    }
  });

  const display = document.getElementById('grafana-user-display');
  if (display) display.textContent = `${grafanaUsers} Virtual Users`;

  const tag = document.getElementById('grafana-status-tag');
  if (tag) {
    if (grafanaUsers <= 50) {
      tag.textContent = "(Monolith Dominates: Low Broker Overhead)";
      tag.className = "text-[11px] text-amber-400 font-mono";
    } else if (grafanaUsers <= 120) {
      tag.textContent = "(Equilibrium Crossover Zone ~90-110 Users)";
      tag.className = "text-[11px] text-cyan-300 font-mono";
    } else if (grafanaUsers <= 400) {
      tag.textContent = "(Event-Driven Dominates: Monolith Contention Begins)";
      tag.className = "text-[11px] text-cyan-400 font-mono";
    } else {
      tag.textContent = "(High Stress Surge: Monolith Thread Exhaustion)";
      tag.className = "text-[11px] text-rose-400 font-mono animate-pulse";
    }
  }
}

function updateGrafanaUI(latestMetrics) {
  if (!latestMetrics) {
    const len = grafanaHistory.mono_lat.length;
    if (len === 0) return;
    latestMetrics = {
      mLat: grafanaHistory.mono_lat[len - 1],
      eLat: grafanaHistory.eda_lat[len - 1],
      mThru: grafanaHistory.mono_thru[len - 1],
      eThru: grafanaHistory.eda_thru[len - 1],
      mCpu: grafanaHistory.mono_cpu[len - 1],
      eCpu: grafanaHistory.eda_cpu[len - 1],
      mRam: grafanaHistory.mono_ram[len - 1],
      eRam: grafanaHistory.eda_ram[len - 1],
      eQueue: grafanaHistory.eda_queue[len - 1],
      mErr: grafanaHistory.mono_err[len - 1],
      eErr: grafanaHistory.eda_err[len - 1]
    };
  }

  // Update legends
  const setEl = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  setEl('gleg-mono-lat', `${latestMetrics.mLat} ms`);
  setEl('gleg-eda-lat', `${latestMetrics.eLat} ms`);
  setEl('gleg-mono-thru', `${latestMetrics.mThru} rps`);
  setEl('gleg-eda-thru', `${latestMetrics.eThru} rps`);
  setEl('gleg-mono-cpu', `${latestMetrics.mCpu}%`);
  setEl('gleg-eda-cpu', `${latestMetrics.eCpu}%`);
  setEl('gleg-mono-ram', `${latestMetrics.mRam} MB`);
  setEl('gleg-eda-ram', `${latestMetrics.eRam} MB`);
  setEl('gleg-eda-queue', `${latestMetrics.eQueue} msgs`);
  setEl('gleg-mono-err', `${latestMetrics.mErr}%`);
  setEl('gleg-eda-err', `${latestMetrics.eErr}%`);
}

function toggleGrafanaTrafficSurge() {
  grafanaSurgeActive = !grafanaSurgeActive;
  const btn = document.getElementById('btn-grafana-surge');
  const icon = document.getElementById('grafana-surge-icon');
  const text = document.getElementById('grafana-surge-text');

  if (grafanaSurgeActive) {
    if (icon) icon.textContent = '⏸';
    if (text) text.textContent = 'Pause Real-Time Traffic Surge';
    if (btn) btn.className = 'py-2 px-3.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20 transition flex items-center gap-1.5 btn-tactile animate-pulse';

    grafanaSurgeInterval = setInterval(() => {
      grafanaSurgePhase += 0.25;
      // Sinusoidal wave that sweeps from 30 up to 1800 users
      const sinVal = (Math.sin(grafanaSurgePhase) + 1) / 2; // 0 to 1
      const waveUsers = Math.round(30 + Math.pow(sinVal, 1.8) * 1750);
      grafanaUsers = waveUsers;

      const slider = document.getElementById('grafana-vu-slider');
      if (slider) slider.value = grafanaUsers;

      pushGrafanaMetrics(grafanaUsers, true);
      updateGrafanaButtons();
    }, 1100);
  } else {
    clearInterval(grafanaSurgeInterval);
    if (icon) icon.textContent = '▶';
    if (text) text.textContent = 'Simulate Traffic Surge (Watch Live Variations)';
    if (btn) btn.className = 'py-2 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-orange-500/20 transition flex items-center gap-1.5 btn-tactile';
  }
}

function renderAllGrafanaPanels() {
  drawGrafanaTimeseries('grafana-canvas-latency', grafanaHistory.mono_lat, grafanaHistory.eda_lat, 'ms', 0, null);
  drawGrafanaTimeseries('grafana-canvas-throughput', grafanaHistory.mono_thru, grafanaHistory.eda_thru, 'rps', 0, null);
  drawGrafanaTimeseries('grafana-canvas-cpu', grafanaHistory.mono_cpu, grafanaHistory.eda_cpu, '%', 0, 100);
  drawGrafanaTimeseries('grafana-canvas-ram', grafanaHistory.mono_ram, grafanaHistory.eda_ram, 'MB', 0, 1100);
  drawGrafanaTimeseries('grafana-canvas-queue', null, grafanaHistory.eda_queue, 'msgs', 0, null);
  drawGrafanaTimeseries('grafana-canvas-errors', grafanaHistory.mono_err, grafanaHistory.eda_err, '%', 0, 15);
}

function drawGrafanaTimeseries(canvasId, monoData, edaData, unit, forceMin = 0, forceMax = null) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = rect.width || 320;
  const height = rect.height || 176;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = '#111217';
  ctx.fillRect(0, 0, width, height);

  // Find min & max
  const allValues = [];
  if (monoData) allValues.push(...monoData);
  if (edaData) allValues.push(...edaData);
  if (allValues.length === 0) return;

  let yMin = forceMin !== null ? forceMin : Math.min(...allValues);
  let yMax = forceMax !== null ? forceMax : Math.max(...allValues);
  if (yMax <= yMin) yMax = yMin + 10;
  yMax = yMax * 1.15; // top margin

  const padding = { top: 12, right: 12, bottom: 22, left: 38 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  // Grid Lines (Grafana style)
  ctx.strokeStyle = '#22252b';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 4]);

  const yDivs = 4;
  for (let i = 0; i <= yDivs; i++) {
    const val = yMin + ((yMax - yMin) * (i / yDivs));
    const y = padding.top + plotH - (i / yDivs) * plotH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(val)}`, padding.left - 4, y + 3);
  }

  // Draw Monolith Series (Amber)
  if (monoData && monoData.length > 0) {
    drawSingleSeries(ctx, monoData, yMin, yMax, padding, plotW, plotH, '#f59e0b', 'rgba(245, 158, 11, 0.12)');
  }

  // Draw EDA Series (Cyan)
  if (edaData && edaData.length > 0) {
    drawSingleSeries(ctx, edaData, yMin, yMax, padding, plotW, plotH, '#06b6d4', 'rgba(6, 182, 212, 0.14)');
  }

  // Time Axis Label
  ctx.setLineDash([]);
  ctx.fillStyle = '#475569';
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('-30s', padding.left, height - 6);
  ctx.textAlign = 'right';
  ctx.fillText('now', width - padding.right, height - 6);
}

function drawSingleSeries(ctx, data, yMin, yMax, pad, plotW, plotH, strokeColor, fillColor) {
  const count = data.length;
  if (count === 0) return;

  const points = [];
  for (let i = 0; i < count; i++) {
    const x = pad.left + (i / (count - 1 || 1)) * plotW;
    const ratio = (data[i] - yMin) / (yMax - yMin);
    const y = pad.top + plotH - (Math.max(0, Math.min(1, ratio)) * plotH);
    points.push({ x, y });
  }

  // Fill area under curve
  ctx.beginPath();
  ctx.moveTo(points[0].x, pad.top + plotH);
  for (let p of points) {
    ctx.lineTo(p.x, p.y);
  }
  ctx.lineTo(points[points.length - 1].x, pad.top + plotH);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  // Stroke line
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < points.length; i++) {
    if (i === 0) ctx.moveTo(points[i].x, points[i].y);
    else ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Highlight latest point with a pulsing dot
  const last = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = strokeColor;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();
}

window.addEventListener('resize', () => {
  renderAllGrafanaPanels();
});
'''

with open('public/js/architectureLab.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

if 'function initGrafanaConsole()' not in js_content:
    # Hook into initArchitectureLab
    js_content = js_content.replace('renderAllLabVisualizations();', 'renderAllLabVisualizations();\n  initGrafanaConsole();')
    js_content += grafana_js
    with open('public/js/architectureLab.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Successfully appended Grafana Engine to public/js/architectureLab.js")
else:
    print("Grafana Engine already present in public/js/architectureLab.js")
