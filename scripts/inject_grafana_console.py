import re

html_to_inject = '''
        <!-- ================================================================== -->
        <!-- REALISTIC GRAFANA OBSERVABILITY CONSOLE (Prometheus Live Telemetry) -->
        <!-- ================================================================== -->
        <div class="bento-card p-5 border-cyan-500/50 bg-[#111217] text-slate-200 space-y-5 shadow-2xl">
          
          <!-- Grafana Console Header -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#22252b]">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40 flex items-center gap-1.5 font-mono">
                  <span class="w-2 h-2 rounded-full bg-[#f97316] animate-pulse"></span> GRAFANA v10.4.1 LIVE OBSERVABILITY
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#181b1f] text-cyan-400 border border-[#2c3235]">
                  Prometheus Scrape: 1s Interval
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#181b1f] text-emerald-400 border border-[#2c3235]">
                  Telemetry: Active
                </span>
              </div>
              <h4 class="text-lg sm:text-xl font-black text-white font-outfit flex items-center gap-2">
                <span>📈</span> Real-Time Architecture Telemetry Console
              </h4>
              <p class="text-xs text-slate-400 max-w-3xl leading-relaxed">
                Direct Grafana-style metric visualizer. Adjust concurrent virtual users ($N$) or run a simulated traffic surge to watch <b>live variations</b> in execution latency, throughput bottlenecks, CPU saturation, and queue buffering in real time.
              </p>
            </div>

            <!-- Standalone Grafana Link & Preset Controls -->
            <div class="flex flex-wrap items-center gap-2 flex-shrink-0">
              <button id="btn-grafana-surge" onclick="toggleGrafanaTrafficSurge()" class="py-2 px-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-orange-500/20 transition flex items-center gap-1.5 btn-tactile">
                <span id="grafana-surge-icon">▶</span>
                <span id="grafana-surge-text">Simulate Traffic Surge (Watch Live Variations)</span>
              </button>
              <a href="http://localhost:3001" target="_blank" class="py-2 px-3 rounded-xl text-xs font-bold bg-[#181b1f] hover:bg-[#22252b] text-cyan-300 border border-cyan-500/40 transition flex items-center gap-1.5 btn-tactile" title="Open Standalone Grafana on Port 3001">
                <span>↗</span> Port 3001
              </a>
            </div>
          </div>

          <!-- Interactive Concurrency & Workload Controller (What if users increase?) -->
          <div class="p-4 rounded-xl bg-[#181b1f] border border-[#2c3235] space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  Active Load Generator:
                </span>
                <span id="grafana-user-display" class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  100 Virtual Users
                </span>
                <span id="grafana-status-tag" class="text-[11px] text-slate-400 font-mono">
                  (Equilibrium Crossover Zone)
                </span>
              </div>
              <span class="text-[11px] text-slate-400 font-mono">
                Click a preset or drag slider to observe graph fluctuations
              </span>
            </div>

            <!-- Virtual User Stepper Buttons -->
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-[11px] font-mono text-slate-400 mr-1">Quick Presets:</span>
              <button onclick="setGrafanaUsers(10)" class="grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="10">10 Users</button>
              <button onclick="setGrafanaUsers(50)" class="grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="50">50 Users</button>
              <button onclick="setGrafanaUsers(100)" class="grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-cyan-500 text-slate-950 font-black border border-cyan-400 shadow-md shadow-cyan-500/20" data-vu="100">100 Users (Cross)</button>
              <button onclick="setGrafanaUsers(200)" class="grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="200">200 Users</button>
              <button onclick="setGrafanaUsers(400)" class="grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="400">400 Users (ECS351)</button>
              <button onclick="setGrafanaUsers(1000)" class="grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="1000">1,000 Users</button>
              <button onclick="setGrafanaUsers(2000)" class="grafana-vu-btn px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="2000">2,000 Users (Stress)</button>
            </div>

            <!-- Continuous Range Slider -->
            <div class="flex items-center gap-3 pt-1">
              <span class="text-[10px] font-mono text-slate-500">10 VU</span>
              <input id="grafana-vu-slider" type="range" min="10" max="2000" step="10" value="100" oninput="onGrafanaSliderChange(this.value)" class="flex-1 accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer">
              <span class="text-[10px] font-mono text-slate-500">2000 VU</span>
            </div>
          </div>

          <!-- 6-Panel Realistic Grafana Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <!-- Panel 1: Latency (p95) -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-orange-400 text-xs">📈</span>
                  <span class="text-xs font-bold text-white font-mono">HTTP Request Latency (p95)</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">ms (milliseconds)</span>
              </div>
              <div class="text-[9px] font-mono text-slate-500 truncate" title="histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[1m])) by (le, arch))">
                Q: histogram_quantile(0.95, sum(rate(http_duration_bucket[1m])) by (arch))
              </div>
              <div class="w-full h-44 bg-[#111217] rounded-lg border border-[#22252b] relative overflow-hidden">
                <canvas id="grafana-canvas-latency" class="w-full h-full block"></canvas>
              </div>
              <!-- Panel Legend -->
              <div class="text-[10px] font-mono grid grid-cols-2 gap-1 pt-1 border-t border-[#22252b]">
                <div class="flex items-center justify-between text-amber-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-amber-400 inline-block"></span> Monolith:</span>
                  <span id="gleg-mono-lat" class="font-bold">24.8 ms</span>
                </div>
                <div class="flex items-center justify-between text-cyan-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-cyan-400 inline-block"></span> Event-Driven:</span>
                  <span id="gleg-eda-lat" class="font-bold">27.0 ms</span>
                </div>
              </div>
            </div>

            <!-- Panel 2: System Throughput -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400 text-xs">⚡</span>
                  <span class="text-xs font-bold text-white font-mono">System Throughput</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">req / sec (RPS)</span>
              </div>
              <div class="text-[9px] font-mono text-slate-500 truncate" title="sum(rate(http_requests_total[30s])) by (arch)">
                Q: sum(rate(http_requests_total[30s])) by (arch)
              </div>
              <div class="w-full h-44 bg-[#111217] rounded-lg border border-[#22252b] relative overflow-hidden">
                <canvas id="grafana-canvas-throughput" class="w-full h-full block"></canvas>
              </div>
              <!-- Panel Legend -->
              <div class="text-[10px] font-mono grid grid-cols-2 gap-1 pt-1 border-t border-[#22252b]">
                <div class="flex items-center justify-between text-amber-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-amber-400 inline-block"></span> Monolith:</span>
                  <span id="gleg-mono-thru" class="font-bold">350.0 rps</span>
                </div>
                <div class="flex items-center justify-between text-cyan-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-cyan-400 inline-block"></span> Event-Driven:</span>
                  <span id="gleg-eda-thru" class="font-bold">394.0 rps</span>
                </div>
              </div>
            </div>

            <!-- Panel 3: CPU Core Utilization -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-rose-400 text-xs">💻</span>
                  <span class="text-xs font-bold text-white font-mono">Container CPU Utilization</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">% Core Usage</span>
              </div>
              <div class="text-[9px] font-mono text-slate-500 truncate" title="rate(container_cpu_usage_seconds_total[1m])">
                Q: sum(rate(container_cpu_usage_seconds_total[1m])) by (name)
              </div>
              <div class="w-full h-44 bg-[#111217] rounded-lg border border-[#22252b] relative overflow-hidden">
                <canvas id="grafana-canvas-cpu" class="w-full h-full block"></canvas>
              </div>
              <!-- Panel Legend -->
              <div class="text-[10px] font-mono grid grid-cols-2 gap-1 pt-1 border-t border-[#22252b]">
                <div class="flex items-center justify-between text-amber-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-amber-400 inline-block"></span> Monolith:</span>
                  <span id="gleg-mono-cpu" class="font-bold">48.2%</span>
                </div>
                <div class="flex items-center justify-between text-cyan-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-cyan-400 inline-block"></span> EDA Workers:</span>
                  <span id="gleg-eda-cpu" class="font-bold">29.1%</span>
                </div>
              </div>
            </div>

            <!-- Panel 4: Memory Working Set (RAM MB) -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-purple-400 text-xs">🧠</span>
                  <span class="text-xs font-bold text-white font-mono">RAM Working Set (cAdvisor)</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">MB (Megabytes)</span>
              </div>
              <div class="text-[9px] font-mono text-slate-500 truncate" title="container_memory_working_set_bytes">
                Q: sum(container_memory_working_set_bytes) by (container)
              </div>
              <div class="w-full h-44 bg-[#111217] rounded-lg border border-[#22252b] relative overflow-hidden">
                <canvas id="grafana-canvas-ram" class="w-full h-full block"></canvas>
              </div>
              <!-- Panel Legend -->
              <div class="text-[10px] font-mono grid grid-cols-2 gap-1 pt-1 border-t border-[#22252b]">
                <div class="flex items-center justify-between text-amber-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-amber-400 inline-block"></span> Monolith:</span>
                  <span id="gleg-mono-ram" class="font-bold">184 MB</span>
                </div>
                <div class="flex items-center justify-between text-cyan-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-cyan-400 inline-block"></span> EDA Total:</span>
                  <span id="gleg-eda-ram" class="font-bold">365 MB</span>
                </div>
              </div>
            </div>

            <!-- Panel 5: Queue Buffer & Ingestion Lag -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-amber-400 text-xs">📬</span>
                  <span class="text-xs font-bold text-white font-mono">RabbitMQ Queue Ingestion Buffer</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">Messages Depth</span>
              </div>
              <div class="text-[9px] font-mono text-slate-500 truncate" title="rabbitmq_queue_messages_ready">
                Q: rabbitmq_queue_messages_ready{queue=~"campus_.*"}
              </div>
              <div class="w-full h-44 bg-[#111217] rounded-lg border border-[#22252b] relative overflow-hidden">
                <canvas id="grafana-canvas-queue" class="w-full h-full block"></canvas>
              </div>
              <!-- Panel Legend -->
              <div class="text-[10px] font-mono grid grid-cols-2 gap-1 pt-1 border-t border-[#22252b]">
                <div class="flex items-center justify-between text-amber-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-amber-400 inline-block"></span> Monolith:</span>
                  <span class="font-bold text-slate-500">N/A (No Queue)</span>
                </div>
                <div class="flex items-center justify-between text-cyan-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-cyan-400 inline-block"></span> EDA Queue:</span>
                  <span id="gleg-eda-queue" class="font-bold">4 msgs</span>
                </div>
              </div>
            </div>

            <!-- Panel 6: Error Rate & Saturation Boundary -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-red-400 text-xs">⚠️</span>
                  <span class="text-xs font-bold text-white font-mono">HTTP 5xx Error Rate (% Drops)</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">% Failed</span>
              </div>
              <div class="text-[9px] font-mono text-slate-500 truncate" title="sum(rate(http_requests_total{status=~'5..'}[1m]))">
                Q: sum(rate(http_requests_total{status=~"5.."}[1m])) / total * 100
              </div>
              <div class="w-full h-44 bg-[#111217] rounded-lg border border-[#22252b] relative overflow-hidden">
                <canvas id="grafana-canvas-errors" class="w-full h-full block"></canvas>
              </div>
              <!-- Panel Legend -->
              <div class="text-[10px] font-mono grid grid-cols-2 gap-1 pt-1 border-t border-[#22252b]">
                <div class="flex items-center justify-between text-amber-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-amber-400 inline-block"></span> Monolith:</span>
                  <span id="gleg-mono-err" class="font-bold">0.00%</span>
                </div>
                <div class="flex items-center justify-between text-cyan-400">
                  <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-cyan-400 inline-block"></span> Event-Driven:</span>
                  <span id="gleg-eda-err" class="font-bold">0.00%</span>
                </div>
              </div>
            </div>

          </div>
        </div>
'''

for target_file in ['public/dashboard.html', 'public/index.html']:
    with open(target_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for Experiment Configuration
    marker = '<!-- EXPERIMENT CONTROL PANEL (Interactive Benchmark Runner) -->'
    if marker in content and 'id="grafana-canvas-latency"' not in content:
        new_content = content.replace(marker, html_to_inject + '\n        ' + marker)
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully injected Grafana Console into {target_file}")
    else:
        print(f"Skipping {target_file} (already present or marker not found)")
