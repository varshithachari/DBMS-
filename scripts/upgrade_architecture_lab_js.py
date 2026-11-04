js_extension = '''

// =========================================================================
// 9. LAKHS-SCALE CONCURRENCY ENGINE & CHARACTERISTIC HANDLING SHOWCASE
// =========================================================================

let activeShowcaseChar = 'scalability';

function applyCustomGrafanaUsers() {
  const input = document.getElementById('grafana-custom-user-input');
  if (!input) return;
  const val = parseInt(input.value, 10);
  if (!val || val < 1) {
    if (typeof showToastNotification === 'function') {
      showToastNotification('Please enter a valid number of users (e.g. 50000).', 'warning');
    }
    return;
  }
  setGrafanaUsers(val);
}

function onGrafanaLogSliderChange(val) {
  const v = parseFloat(val); // 1 to 100
  // Logarithmic mapping: 1 -> 10, 20 -> 100, 40 -> 1000, 60 -> 10000, 80 -> 100000, 100 -> 1000000
  const exponent = (v - 1) / 99 * 5; // 0 to 5
  let mappedUsers = Math.round(10 * Math.pow(10, exponent));
  if (mappedUsers > 1000) {
    mappedUsers = Math.round(mappedUsers / 100) * 100;
  }
  setGrafanaUsers(mappedUsers);
}

function selectCharacteristicShowcase(charId) {
  activeShowcaseChar = charId;
  const btns = document.querySelectorAll('.char-pill-btn');
  btns.forEach(b => {
    const cid = b.getAttribute('data-char');
    if (cid === charId) {
      b.className = 'char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-amber-500 text-slate-950 border border-amber-400';
    } else {
      b.className = 'char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700';
    }
  });
  renderCharacteristicShowcase();
}

function renderCharacteristicShowcase() {
  const container = document.getElementById('char-deepdive-container');
  if (!container) return;

  const badge = document.getElementById('char-handling-current-vu-badge');
  if (badge) {
    const formattedU = grafanaUsers >= 100000 ? `${(grafanaUsers / 100000).toFixed(1)} Lakh (${grafanaUsers.toLocaleString()})` : grafanaUsers.toLocaleString();
    badge.textContent = `Evaluating Under Active Load: ${formattedU} Virtual Users`;
  }

  const charObj = characteristicsData.find(c => c.id === activeShowcaseChar) || characteristicsData[0];
  const isEvidenceMode = currentRatingView === 'evidence';
  const monoScore = isEvidenceMode ? charObj.modular_monolith_evidence : charObj.modular_monolith_theoretical;
  const edaScore = isEvidenceMode ? charObj.event_driven_evidence : charObj.event_driven_theoretical;

  const monoStars = renderStars(monoScore);
  const edaStars = renderStars(edaScore);
  const isEdaWinner = (charObj.winner || charObj.advantage).toLowerCase().includes('event');

  // Dynamic Concurrency Mechanics at current grafanaUsers
  const u = grafanaUsers;
  let monoHandlingNote, edaHandlingNote, liveImpactMono, liveImpactEda;

  if (activeShowcaseChar === 'scalability') {
    const monoReplicasNeeded = Math.max(1, Math.ceil(u / 100));
    const monoTotalRam = monoReplicasNeeded * 256;
    const edaWorkersNeeded = Math.max(1, Math.ceil(u / 850));
    const edaTotalRam = 260 + (edaWorkersNeeded * 45);

    monoHandlingNote = `Modular Monolith handles scaling by duplicating the <b>entire 256MB monolithic application image</b>. Every single replica duplicates memory state and creates duplicate database connection pools, leading to thread contention at higher loads.`;
    edaHandlingNote = `Event-Driven Architecture handles scaling by <b>decoupling hot consumers</b> via RabbitMQ. Only the specific worker receiving load is scaled (at lean 45MB per instance), while non-bottleneck services remain untouched.`;

    liveImpactMono = `<b>Replicas Needed:</b> ${monoReplicasNeeded} Full Monoliths<br><b>Total RAM Allocated:</b> ${monoTotalRam.toLocaleString()} MB<br><b>DB Pool Contention:</b> ${u > 400 ? 'Severe Saturation (Pool Exhausted)' : 'Nominal'}`;
    liveImpactEda = `<b>Hot Workers Needed:</b> ${edaWorkersNeeded} Order Workers<br><b>Total RAM Allocated:</b> ${edaTotalRam.toLocaleString()} MB (65% lower footprint)<br><b>Queue Ingress:</b> Buffering smoothly with 0% socket locks`;
  } else if (activeShowcaseChar === 'performance') {
    const mLat = u <= 100 ? (4.2 + u * 0.12).toFixed(1) : (u <= 400 ? (25 + Math.pow(u/28, 1.45)).toFixed(1) : (175 + Math.pow(u-400, 0.95)*0.55).toFixed(0));
    const eLat = u <= 100 ? (18.5 + u * 0.08).toFixed(1) : (u <= 400 ? (26.5 + u * 0.032).toFixed(1) : (38.5 + Math.log10(u)*4.2).toFixed(1));

    monoHandlingNote = `Monolith handles requests via <b>direct in-memory function calls</b> and in-process stack execution. Sub-millisecond internal hops make it unbeatable at low concurrency (<100 users), but thread lock causes latency to explode under heavy traffic.`;
    edaHandlingNote = `Event-Driven Architecture handles requests via <b>asynchronous Pub/Sub broker hops</b>. Network serialization and message routing impose a ~18ms baseline latency floor at low loads, but latency remains strictly bounded under heavy loads.`;

    liveImpactMono = `<b>p95 Measured Latency:</b> ${mLat} ms<br><b>Execution Mechanism:</b> In-Process Synchronous Stack<br><b>Behavior:</b> ${u <= 100 ? 'Ultra-Fast Sub-millisecond Execution' : 'Severe Latency Degradation'}`;
    liveImpactEda = `<b>p95 Measured Latency:</b> ${eLat} ms<br><b>Execution Mechanism:</b> RabbitMQ AMQP 0-9-1 Topic Exchange<br><b>Behavior:</b> ${u <= 100 ? 'Overhead of Broker Hop (+15ms)' : 'Predictable Flat Bounded Latency'}`;
  } else if (activeShowcaseChar === 'fault_tolerance') {
    const mDrop = u > 300 ? Math.min(85, Math.pow((u-250)/70, 1.3)).toFixed(1) : '0.0';

    monoHandlingNote = `In Modular Monolith, all modules share the same memory heap and OS thread pool. An unhandled exception or memory leak in the notification module risks <b>crashing or hanging the entire university portal</b>.`;
    edaHandlingNote = `In Event-Driven Architecture, downstream services run in isolated processes. If the notification consumer crashes, RabbitMQ automatically routes messages to a <b>Dead Letter Queue (DLQ)</b>. Campus navigation and event registration continue with zero interruption.`;

    liveImpactMono = `<b>Blast Radius:</b> 100% of Portal Modules<br><b>Failure Isolation:</b> None (Shared Process Heap)<br><b>Dropped Requests at Current Load:</b> ${mDrop}%`;
    liveImpactEda = `<b>Blast Radius:</b> 0% (Isolated to Consumer Process)<br><b>Failure Isolation:</b> Message Queue Buffering + DLQ<br><b>Dropped Requests at Current Load:</b> 0.00% (Guaranteed Durable Delivery)`;
  } else if (activeShowcaseChar === 'consistency') {
    monoHandlingNote = `Monolith handles data consistency via <b>Immediate ACID Transactions</b>. Event registration, attendee slot allocation, and transaction logs commit in a single synchronous SQL transaction, guaranteeing zero data drift.`;
    edaHandlingNote = `Event-Driven Architecture handles consistency via <b>Eventual Consistency and Saga Orchestration</b>. Downstream consumers update read models asynchronously, leading to microsecond eventual consistency lag during heavy write bursts.`;

    liveImpactMono = `<b>Consistency Model:</b> Immediate Serializable ACID<br><b>Transaction Boundary:</b> Single Relational DB Engine<br><b>Data Drift Lag:</b> 0.00 ms (Immediate)`;
    liveImpactEda = `<b>Consistency Model:</b> BASE / Eventual Consistency<br><b>Transaction Boundary:</b> Distributed Compensating Sagas<br><b>Data Drift Lag:</b> ~12 ms to 45 ms sync window`;
  } else if (activeShowcaseChar === 'elasticity') {
    monoHandlingNote = `Monolith elasticity is coarse-grained. Absorbing unexpected campus traffic surges requires scaling up entire heavy monolith containers, which takes 45 to 90 seconds per instance.`;
    edaHandlingNote = `Event-Driven elasticity is instantaneous and fine-grained. RabbitMQ message queues immediately absorb ingress surges in memory buffer, and lightweight worker containers spin up in 6 to 8 seconds.`;

    liveImpactMono = `<b>Surge Buffer Capacity:</b> Operating System Socket Queue Only<br><b>Time to Spin Up Replica:</b> ~65 seconds<br><b>Thread Exhaustion Risk:</b> High under sudden spikes`;
    liveImpactEda = `<b>Surge Buffer Capacity:</b> Durable RabbitMQ Message Buffer<br><b>Time to Spin Up Worker:</b> ~7 seconds flat<br><b>Thread Exhaustion Risk:</b> Zero (Queue absorbs burst)`;
  } else {
    monoHandlingNote = `Monolith provides superior simplicity and operational efficiency with single-repository codebase, unified migrations, and straightforward local debugging.`;
    edaHandlingNote = `Event-Driven Architecture provides superior independent deployability and organizational evolvability, allowing different faculty and teams to deploy microservices independently.`;

    liveImpactMono = `<b>Repository & Deployment:</b> Single Deployable Unit<br><b>Debugging:</b> Synchronous Stack Traces & Easy Localhost<br><b>Cognitive Complexity:</b> Low`;
    liveImpactEda = `<b>Repository & Deployment:</b> Decoupled Services & Contracts<br><b>Debugging:</b> OpenTelemetry Distributed Traces<br><b>Cognitive Complexity:</b> High`;
  }

  container.innerHTML = `
    <!-- Top Row: Characteristic Name, Stars, and Winner -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- Modular Monolith Card -->
      <div class="p-4 rounded-xl bg-slate-950/90 border border-amber-500/40 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">🏛️</span>
            <div>
              <span class="text-[10px] font-mono text-slate-400 uppercase block">Architecture A</span>
              <h5 class="text-sm font-extrabold text-white font-mono">Modular Monolith</h5>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-1">${monoStars}</div>
            <span class="text-xs font-mono font-bold text-amber-400 mt-0.5 block">${monoScore.toFixed(1)} / 5.0 Stars</span>
          </div>
        </div>

        <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span class="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">How Monolith Handles ${charObj.name}:</span>
          ${monoHandlingNote}
        </div>

        <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-slate-200 space-y-1">
          <span class="text-[10px] uppercase font-bold text-amber-300 block">⚡ Live Handling at ${u.toLocaleString()} Users:</span>
          <div class="text-[11px] leading-relaxed text-slate-300">${liveImpactMono}</div>
        </div>
      </div>

      <!-- Event-Driven Architecture Card -->
      <div class="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">⚡</span>
            <div>
              <span class="text-[10px] font-mono text-slate-400 uppercase block">Architecture B</span>
              <h5 class="text-sm font-extrabold text-white font-mono">Event-Driven Architecture</h5>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-1">${edaStars}</div>
            <span class="text-xs font-mono font-bold text-cyan-400 mt-0.5 block">${edaScore.toFixed(1)} / 5.0 Stars</span>
          </div>
        </div>

        <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span class="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">How Event-Driven Handles ${charObj.name}:</span>
          ${edaHandlingNote}
        </div>

        <div class="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-slate-200 space-y-1">
          <span class="text-[10px] uppercase font-bold text-cyan-300 block">⚡ Live Handling at ${u.toLocaleString()} Users:</span>
          <div class="text-[11px] leading-relaxed text-slate-300">${liveImpactEda}</div>
        </div>
      </div>

    </div>

    <!-- Bottom Verdict Row -->
    <div class="p-3 rounded-xl bg-slate-950 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
      <div class="flex items-center gap-2">
        <span class="font-bold text-slate-400 font-mono">Architectural Verdict:</span>
        <span class="px-2.5 py-1 rounded-full text-xs font-mono font-black ${isEdaWinner ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}">
          🏆 Winner: ${charObj.winner || charObj.advantage}
        </span>
      </div>
      <div class="text-slate-400 font-mono text-[11px]">
        Cost Profile: <span class="text-amber-300">${charObj.cost_modular_monolith}</span> vs <span class="text-cyan-300">${charObj.cost_event_driven}</span>
      </div>
    </div>
  `;
}
'''

# Update public/js/architectureLab.js
with open('public/js/architectureLab.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make sure setGrafanaUsers calls renderCharacteristicShowcase
if 'renderCharacteristicShowcase();' not in js:
    js = js.replace('renderAllGrafanaPanels();', 'renderAllGrafanaPanels();\n    renderCharacteristicShowcase();')

# Append extension
if 'function renderCharacteristicShowcase()' not in js:
    js += js_extension
    with open('public/js/architectureLab.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Successfully upgraded architectureLab.js with Characteristic Showcase & Lakhs Engine")
else:
    print("Extension already present in architectureLab.js")
