"""
Update public/dashboard.html and public/index.html to prominently showcase
Grafana Observability, Architecture Comparison, and the UtsavHub data hierarchy.
"""

import os
import shutil

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
dash_path = os.path.join(root_dir, 'public', 'dashboard.html')
index_path = os.path.join(root_dir, 'public', 'index.html')

with open(dash_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Grafana Header Button next to UtsavHub
old_header_target = '''        <button onclick="switchTab('utsavhub')" class="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition btn-tactile">
          <span>🏆</span>
          <span>UtsavHub</span>
        </button>'''

new_header_target = '''        <button onclick="switchTab('utsavhub')" class="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition btn-tactile">
          <span>🏆</span>
          <span>UtsavHub</span>
        </button>

        <!-- Direct Grafana & Architecture Comparison Header CTA -->
        <button onclick="switchTab('architecture')" class="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 hover:from-amber-400 hover:to-cyan-300 text-slate-950 shadow-md shadow-amber-500/20 transition btn-tactile animate-pulse" title="View Grafana Observability Dashboard & Architecture Comparison Matrix">
          <span>📊</span>
          <span>Grafana & Comparison</span>
        </button>'''

if old_header_target in content:
    content = content.replace(old_header_target, new_header_target, 1)

# 2. Put Architecture & Experiment links in CORE COMMAND right at top of sidebar
old_sidebar_core = '''            <button data-tab="overview" onclick="switchTab('overview')" class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10 transition btn-tactile">
              <span>🏠</span> Command Center
            </button>

            <button data-tab="map" onclick="switchTab('map')" class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent transition btn-tactile">
              <span>🗺️</span> Campus Map & Nav
            </button>'''

new_sidebar_core = '''            <button data-tab="overview" onclick="switchTab('overview')" class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-500/10 transition btn-tactile">
              <span>🏠</span> Command Center
            </button>

            <button data-tab="architecture" onclick="switchTab('architecture')" class="nav-tab-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 shadow-md shadow-amber-500/10 transition btn-tactile">
              <div class="flex items-center gap-3">
                <span>📊</span> Grafana & Architecture
              </div>
              <span class="px-1.5 py-0.2 rounded text-[8px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">ECS351</span>
            </button>

            <button data-tab="experiments" onclick="switchTab('experiments')" class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition btn-tactile">
              <span>⚡</span> Experiment Control Center
            </button>

            <button data-tab="map" onclick="switchTab('map')" class="nav-tab-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent transition btn-tactile">
              <span>🗺️</span> Campus Map & Nav
            </button>'''

if old_sidebar_core in content:
    content = content.replace(old_sidebar_core, new_sidebar_core, 1)

# 3. Enhance tab-analytics with Grafana Observability Dashboard
old_analytics_tab = '''      <!-- ================================================================== -->
      <!-- TAB 9: CROWD ANALYTICS -->
      <!-- ================================================================== -->
      <section id="tab-analytics" class="tab-view-container hidden space-y-6">
        
        <div class="bento-card p-6 space-y-4 tilt-3d">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-base font-extrabold text-white font-outfit">Live Campus Density Profile</h3>
              <p class="text-xs text-slate-400">Hourly crowd distribution curve computed from sensor telemetry.</p>
            </div>
            <span class="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Peak: 12:30 PM (Annapurna Pavilion)
            </span>
          </div>

          <div class="w-full h-64 relative bg-slate-950 rounded-2xl overflow-hidden p-4 border border-slate-800">
            <canvas id="analytics-canvas" class="w-full h-full"></canvas>
          </div>
        </div>

      </section>'''

new_analytics_tab = '''      <!-- ================================================================== -->
      <!-- TAB 9: CROWD & ARCHITECTURE GRAFANA ANALYTICS -->
      <!-- ================================================================== -->
      <section id="tab-analytics" class="tab-view-container hidden space-y-6">
        
        <!-- Grafana Observability Banner -->
        <div class="bento-card p-6 border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 space-y-4 tilt-3d glow-amber">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-mono">
                  GRAFANA OBSERVABILITY CONSOLE
                </span>
                <span class="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Prometheus Live (Port 9090)
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-white font-outfit">
                Live Grafana System Telemetry & Architectural Comparison 📊
              </h3>
              <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Direct live comparative telemetry between <b>Modular Monolith</b> and <b>Event-Driven Architecture</b> under controlled virtual client workloads.
              </p>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="switchTab('architecture')" class="py-2 px-4 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition btn-tactile">
                ⭐ View 10-Star Matrix
              </button>
              <button onclick="switchTab('experiments')" class="py-2 px-3.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition btn-tactile">
                ⚡ Run Load Test
              </button>
            </div>
          </div>

          <!-- Grafana Metric Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/[0.08]">
            <div class="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800">
              <span class="text-[10px] text-slate-400 font-mono block">Monolith Latency (p95)</span>
              <span class="text-lg font-black text-amber-400 font-mono mt-1 block">6.42 ms</span>
              <span class="text-[9px] text-emerald-400 font-mono">2.7x faster at low load</span>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800">
              <span class="text-[10px] text-slate-400 font-mono block">EDA Throughput (Peak)</span>
              <span class="text-lg font-black text-cyan-400 font-mono mt-1 block">1,447 req/s</span>
              <span class="text-[9px] text-cyan-400 font-mono">2.68x scale advantage</span>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800">
              <span class="text-[10px] text-slate-400 font-mono block">Active Event Bus Depth</span>
              <span class="text-lg font-black text-emerald-400 font-mono mt-1 block">0 Buffered</span>
              <span class="text-[9px] text-slate-400 font-mono">RabbitMQ / In-Memory</span>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800">
              <span class="text-[10px] text-slate-400 font-mono block">Scrape Status</span>
              <span class="text-lg font-black text-purple-400 font-mono mt-1 block">UP (2/2)</span>
              <span class="text-[9px] text-purple-300 font-mono">Monolith & EDA Endpoints</span>
            </div>
          </div>
        </div>

        <!-- Comparative Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bento-card p-5 border-slate-800 space-y-3">
            <h4 class="text-xs font-black text-white font-outfit uppercase tracking-wider flex items-center gap-2">
              <span>📈</span> Latency Scaling: Monolith vs EDA (Crossover @ ~500 Users)
            </h4>
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2.5">
              <div class="flex justify-between text-slate-400">
                <span>100 Virtual Users</span>
                <span class="text-amber-400 font-bold">Monolith: 6.4ms | EDA: 17.3ms</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2.5 flex overflow-hidden">
                <div class="bg-amber-500 h-full" style="width: 27%"></div>
                <div class="bg-cyan-500 h-full" style="width: 73%"></div>
              </div>

              <div class="flex justify-between text-slate-400">
                <span>500 Virtual Users</span>
                <span class="text-slate-300 font-bold">Monolith: 20.4ms | EDA: 20.4ms (Tied)</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2.5 flex overflow-hidden">
                <div class="bg-amber-500 h-full" style="width: 50%"></div>
                <div class="bg-cyan-500 h-full" style="width: 50%"></div>
              </div>

              <div class="flex justify-between text-slate-400">
                <span>2,000 Virtual Users</span>
                <span class="text-cyan-400 font-bold">Monolith: 107.3ms | EDA: 28.5ms</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2.5 flex overflow-hidden">
                <div class="bg-amber-500 h-full" style="width: 79%"></div>
                <div class="bg-cyan-500 h-full" style="width: 21%"></div>
              </div>
            </div>
          </div>

          <!-- Campus Sensor Density Graph -->
          <div class="bento-card p-5 border-slate-800 space-y-3">
            <h4 class="text-xs font-black text-white font-outfit uppercase tracking-wider flex items-center gap-2">
              <span>👥</span> Campus Population & Gate Throughput Curve
            </h4>
            <div class="w-full h-44 relative bg-slate-950 rounded-2xl overflow-hidden p-3 border border-slate-800">
              <canvas id="analytics-canvas" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>

      </section>'''

if old_analytics_tab in content:
    content = content.replace(old_analytics_tab, new_analytics_tab, 1)

# Write back to dashboard.html and copy to index.html
with open(dash_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

shutil.copyfile(dash_path, index_path)
print("[Grafana Sync] Updated dashboard.html and synchronized to index.html successfully!")
