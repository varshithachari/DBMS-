"""
Inject Architecture Research Lab and Experiment Control Center sections into public/dashboard.html
"""

import os

html_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'dashboard.html')

tab_sections = '''
      <!-- ================================================================== -->
      <!-- TAB 13: ARCHITECTURE RESEARCH LAB & CHARACTERISTICS MATRIX (ECS351) -->
      <!-- ================================================================== -->
      <section id="tab-architecture" class="tab-view-container hidden space-y-6">
        
        <!-- Header Banner with Academic Details & Download CTA -->
        <div class="bento-card p-6 border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-cyan-950/30 space-y-4 tilt-3d glow-amber">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-mono">
                  ACADEMIC RESEARCH PLATFORM
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-amber-300 border border-amber-500/30">
                  ECS351: Software Architecture & Design Patterns
                </span>
                <span class="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Reproducible Seed=42
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-white font-outfit">
                Architecture Characteristics & Comparative Matrix
              </h3>
              <p class="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Experimental evaluation comparing <b>Modular Monolithic Architecture (Architecture A)</b> and 
                <b>Event-Driven Architecture (Architecture B)</b> using identical campus datasets, equivalent business logic, 
                and controlled virtual client workloads across 10 architectural dimensions.
              </p>
            </div>

            <!-- Download Official Reports -->
            <div class="flex flex-wrap items-center gap-2 flex-shrink-0">
              <a href="/api/reports/download/pdf" target="_blank" class="py-2 px-3.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 btn-tactile">
                <span>📄</span> Download Research PDF
              </a>
              <a href="/api/reports/download/csv" target="_blank" class="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1 btn-tactile">
                <span>📊</span> Export CSV
              </a>
              <a href="/api/reports/download/json" target="_blank" class="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 btn-tactile">
                <span>🗃️</span> JSON
              </a>
            </div>
          </div>
        </div>

        <!-- 10-Characteristic Interactive Star Rating Matrix -->
        <div class="bento-card p-5 border-amber-500/30 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">⭐</span>
              <div>
                <h4 class="text-sm font-black text-white font-outfit">10-Dimension Architectural Rating Matrix</h4>
                <p class="text-[11px] text-slate-400">Interactive rating grid. Click stars to adjust evidence scores; click any row to reveal theoretical & empirical rationales.</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-xs font-mono">
              <span class="flex items-center gap-1.5 text-amber-400"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Modular Monolith</span>
              <span class="flex items-center gap-1.5 text-cyan-400"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> Event-Driven</span>
            </div>
          </div>

          <!-- Table Container -->
          <div class="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/[0.08] bg-slate-900/90 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th class="py-3 px-4 font-bold">Architectural Characteristic</th>
                  <th class="py-3 px-4 font-bold text-center">Modular Monolith</th>
                  <th class="py-3 px-4 font-bold text-center">Event-Driven Architecture</th>
                  <th class="py-3 px-4 font-bold text-center">Cost Profile</th>
                  <th class="py-3 px-4 font-bold text-right">Advantage</th>
                </tr>
              </thead>
              <tbody id="characteristics-matrix-body" class="divide-y divide-white/[0.06] text-xs">
                <!-- Dynamically populated via architectureLab.js -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Visual Analytics: Radar Chart & Scalability Response Curve -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Radar Chart Comparison -->
          <div class="bento-card p-5 border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">🕸️</span>
                <h4 class="text-xs font-black text-white font-outfit">10-Axis Architectural Trade-off Radar</h4>
              </div>
              <span class="text-[10px] font-mono text-slate-400">Higher = Superior Trait</span>
            </div>
            <div class="relative flex items-center justify-center p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <canvas id="architecture-radar-canvas" class="max-w-full"></canvas>
            </div>
            <div class="flex items-center justify-around text-xs font-mono pt-1 text-slate-400">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded bg-amber-500/80"></span>
                <span>Modular Monolith (Low Cost / High Simplicity)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded bg-cyan-400/80"></span>
                <span>Event-Driven (High Scale / Elasticity)</span>
              </div>
            </div>
          </div>

          <!-- Scalability Latency vs Concurrency Curve -->
          <div class="bento-card p-5 border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">📈</span>
                <h4 class="text-xs font-black text-white font-outfit">Concurrency Latency Curve & Crossover Point</h4>
              </div>
              <span class="text-[10px] font-mono text-emerald-400 font-bold">Crossover @ ~500 Users</span>
            </div>
            
            <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3 font-mono text-xs">
              <!-- Visual Bar Comparisons at 4 Concurrency Tiers -->
              <div class="space-y-1">
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>100 Virtual Users (Low Concurrency)</span>
                  <span class="text-amber-400 font-bold">Monolith 6.4ms vs EDA 17.3ms (Mono 2.7x Faster)</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-3 flex overflow-hidden">
                  <div class="bg-amber-500 h-full" style="width: 27%" title="Monolith 6.4ms"></div>
                  <div class="bg-cyan-500 h-full" style="width: 73%" title="EDA 17.3ms"></div>
                </div>
              </div>

              <div class="space-y-1">
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>500 Virtual Users (Crossover Point)</span>
                  <span class="text-slate-300 font-bold">Monolith 20.4ms vs EDA 20.4ms (Tied)</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-3 flex overflow-hidden">
                  <div class="bg-amber-500 h-full" style="width: 50%"></div>
                  <div class="bg-cyan-500 h-full" style="width: 50%"></div>
                </div>
              </div>

              <div class="space-y-1">
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>1,000 Virtual Users (High Load)</span>
                  <span class="text-cyan-400 font-bold">Monolith 44.8ms vs EDA 23.7ms (EDA 1.9x Faster)</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-3 flex overflow-hidden">
                  <div class="bg-amber-500 h-full" style="width: 65%"></div>
                  <div class="bg-cyan-500 h-full" style="width: 35%"></div>
                </div>
              </div>

              <div class="space-y-1">
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>2,000 Virtual Users (Peak Stress Spike)</span>
                  <span class="text-cyan-400 font-bold">Monolith 107.3ms vs EDA 28.5ms (EDA 3.8x Faster)</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-3 flex overflow-hidden">
                  <div class="bg-amber-500 h-full" style="width: 79%"></div>
                  <div class="bg-cyan-500 h-full" style="width: 21%"></div>
                </div>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <b class="text-amber-400">Architectural Insight:</b> Under light load, the Monolith's direct memory calls bypass network serialization. At scale, however, thread pool exhaustion degrades Monolith performance, while EDA's asynchronous queue buffers allow non-blocking ingestion!
            </div>
          </div>

        </div>

        <!-- Research Hypotheses Verification Dashboard -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">📋</span>
            <h4 class="text-sm font-black text-white font-outfit">Research Hypotheses Empirical Verification</h4>
          </div>
          <div id="hypotheses-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Dynamically populated via architectureLab.js -->
          </div>
        </div>

        <!-- Interactive Architecture Topologies (Dual Topology Visualizer) -->
        <div class="bento-card p-5 border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🗺️</span>
              <div>
                <h4 class="text-sm font-black text-white font-outfit">Dual Architecture Topological Blueprints</h4>
                <p class="text-[11px] text-slate-400">Interactive structural maps contrasting in-process module borders vs broker-mediated microservices.</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Architecture A: Modular Monolith Topology Card -->
            <div class="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🏛️</span> ARCHITECTURE A: MODULAR MONOLITH
                </span>
                <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300">Port 8001</span>
              </div>
              <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-2">
                <div class="flex items-center justify-between p-1.5 rounded bg-amber-500/10 border border-amber-500/20">
                  <span class="font-bold text-amber-400">Single Deployable Process</span>
                  <span>FastAPI + Uvicorn</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Auth & Users</div>
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Map & Nav (Dijkstra)</div>
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Events & UtsavHub</div>
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Registration</div>
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Certificates Vault</div>
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Facilities & Issues</div>
                </div>
                <div class="p-1.5 rounded bg-slate-800 text-center text-slate-400">
                  Direct In-Memory Method Calls (Zero Network Hop)
                </div>
                <div class="p-1.5 rounded bg-slate-800 border border-slate-700 text-center font-bold text-amber-300">
                  Shared Database (SQLite / PostgreSQL)
                </div>
              </div>
              <p class="text-[11px] text-slate-400 leading-snug">
                Ideal for rapid development, simplified deployments, and small teams. Suffers from single point of failure and thread lock contention at extreme concurrencies.
              </p>
            </div>

            <!-- Architecture B: Event-Driven Topology Card -->
            <div class="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <span>⚡</span> ARCHITECTURE B: EVENT-DRIVEN
                </span>
                <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300">Port 8002 + Broker</span>
              </div>
              <div class="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-2">
                <div class="flex items-center justify-between p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  <span class="font-bold text-cyan-400">API Gateway & Publishers</span>
                  <span>Non-Blocking 202 Ack</span>
                </div>
                <div class="p-1.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-center font-bold text-cyan-300 flex items-center justify-around">
                  <span>Message Queue</span>
                  <span>RabbitMQ Event Bus</span>
                  <span>DLQ Retry</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Worker: Notifs</div>
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Worker: Passes</div>
                  <div class="p-1 rounded bg-slate-800 border border-slate-700">Worker: Analytics</div>
                </div>
                <div class="p-1.5 rounded bg-slate-800 border border-slate-700 text-center font-bold text-cyan-300">
                  Decoupled Eventual Consistency
                </div>
              </div>
              <p class="text-[11px] text-slate-400 leading-snug">
                Elastic surge buffering, independent deployability, and robust fault isolation. Incurs network serialization overhead and higher infrastructure operational cost.
              </p>
            </div>

          </div>
        </div>

      </section>

      <!-- ================================================================== -->
      <!-- TAB 14: EXPERIMENT CONTROL CENTER (ECS351) -->
      <!-- ================================================================== -->
      <section id="tab-experiments" class="tab-view-container hidden space-y-6">
        
        <!-- Experiment Control Banner -->
        <div class="bento-card p-6 border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/40 space-y-4 tilt-3d glow-cyan">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-400 text-slate-950 font-mono">
                LIVE EXPERIMENT LAB
              </span>
              <h3 class="text-xl sm:text-2xl font-black text-white font-outfit">
                Experiment Control Center & Benchmark Suite ⚡
              </h3>
              <p class="text-xs text-slate-300 max-w-2xl">
                Trigger controlled synthetic workloads against running backend instances. All runs measure response latency (p50/p95/p99), throughput, CPU/RAM utilization, and write to database records.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="switchTab('architecture')" class="py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition">
                ← View Rating Matrix
              </button>
            </div>
          </div>
        </div>

        <!-- Workload Dispatcher Card -->
        <div class="bento-card p-6 border-white/[0.08] space-y-5">
          <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Configure Benchmark Parameters</h4>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <!-- Workload Type -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-slate-300">Workload Pattern</label>
              <select id="exp-workload-select" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400">
                <option value="mixed_campus">Mixed Campus (60% Map, 30% Events, 10% Maintenance)</option>
                <option value="events_workload">Events Conclave Registration Surge</option>
                <option value="navigation_workload">Campus Spatial Graph Routing</option>
              </select>
            </div>

            <!-- Virtual Users / Concurrency -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-slate-300">Concurrent Virtual Users</label>
              <select id="exp-users-select" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400">
                <option value="100">100 Virtual Users (Low Concurrency)</option>
                <option value="500">500 Virtual Users (Medium Concurrency)</option>
                <option value="1000">1,000 Virtual Users (High Load)</option>
                <option value="2000" selected>2,000 Virtual Users (Peak Surge)</option>
              </select>
            </div>

            <!-- Target Architecture -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-slate-300">Target Architecture</label>
              <select id="exp-arch-select" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-400">
                <option value="modular_monolith">Architecture A: Modular Monolith (:8001)</option>
                <option value="event_driven" selected>Architecture B: Event-Driven (:8002)</option>
              </select>
            </div>

          </div>

          <!-- Run Button & Progress -->
          <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button id="btn-run-experiment" onclick="executeControlledExperiment()" class="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 btn-tactile">
              <span>🚀</span> Run Controlled Benchmark
            </button>
            <span class="text-[11px] font-mono text-slate-400">Results are persisted directly to database for research verification.</span>
          </div>

          <!-- Progress Bar (Animated) -->
          <div id="exp-progress-container" class="hidden space-y-2 pt-2 border-t border-slate-800">
            <div class="flex items-center justify-between text-xs font-mono">
              <span id="exp-progress-status" class="text-cyan-400">Executing workload...</span>
              <span class="text-slate-400">Simulating concurrent connections</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div id="exp-progress-bar" class="bg-gradient-to-r from-amber-400 to-cyan-400 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
          </div>

        </div>

        <!-- Live Results Card (Displayed upon execution) -->
        <div id="exp-live-results-card" class="hidden bento-card p-6 border-emerald-500/40 bg-slate-900/90 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">✅</span>
              <div>
                <h4 class="text-sm font-black text-white font-outfit">Benchmark Execution Results</h4>
                <span id="res-exp-id" class="text-[10px] font-mono text-slate-400">EXP-ID</span>
              </div>
            </div>
            <span id="res-arch-badge" class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Modular Monolith</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-[10px] font-mono text-slate-400 block">Avg Latency</span>
              <span id="res-avg-latency" class="text-base font-extrabold text-white font-mono mt-1 block">--</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-[10px] font-mono text-slate-400 block">P95 Latency</span>
              <span id="res-p95-latency" class="text-base font-extrabold text-amber-400 font-mono mt-1 block">--</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-[10px] font-mono text-slate-400 block">Throughput</span>
              <span id="res-throughput" class="text-base font-extrabold text-cyan-400 font-mono mt-1 block">--</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-[10px] font-mono text-slate-400 block">CPU Usage</span>
              <span id="res-cpu" class="text-base font-extrabold text-slate-200 font-mono mt-1 block">--</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-[10px] font-mono text-slate-400 block">RAM (MB)</span>
              <span id="res-ram" class="text-base font-extrabold text-slate-200 font-mono mt-1 block">--</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span class="text-[10px] font-mono text-slate-400 block">Queue Depth</span>
              <span id="res-queue" class="text-base font-extrabold text-emerald-400 font-mono mt-1 block">--</span>
            </div>
          </div>
        </div>

        <!-- Historical Benchmark Dataset Table -->
        <div class="bento-card p-5 border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">📊</span>
              <div>
                <h4 class="text-sm font-black text-white font-outfit">Empirical Benchmark Database Ledger</h4>
                <p class="text-[11px] text-slate-400">Real runs stored in database from controlled test runs across 100, 500, 1000, 2000 concurrency tiers.</p>
              </div>
            </div>
            <button onclick="loadHistoricalExperiments()" class="py-1 px-2.5 rounded-lg text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
              ↻ Refresh Ledger
            </button>
          </div>

          <div class="overflow-x-auto rounded-xl border border-white/[0.08]">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/[0.08] bg-slate-900/90 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th class="py-2.5 px-3">Run ID</th>
                  <th class="py-2.5 px-3">Architecture</th>
                  <th class="py-2.5 px-3">Workload</th>
                  <th class="py-2.5 px-3 text-center">Users</th>
                  <th class="py-2.5 px-3 text-right">Avg Latency</th>
                  <th class="py-2.5 px-3 text-right">P95 Latency</th>
                  <th class="py-2.5 px-3 text-right">Throughput</th>
                  <th class="py-2.5 px-3 text-right">CPU</th>
                  <th class="py-2.5 px-3 text-right">Queue</th>
                </tr>
              </thead>
              <tbody id="experiment-runs-tbody" class="divide-y divide-white/[0.04]">
                <!-- Dynamically populated via architectureLab.js -->
              </tbody>
            </table>
          </div>
        </div>

      </section>
'''

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '</main>'
if target in content and 'id="tab-architecture"' not in content:
    new_content = content.replace(target, tab_sections + '\n    ' + target, 1)
    with open(html_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print("Successfully injected architecture and experiment tabs into dashboard.html!")
else:
    print("Target not found or already injected.")
