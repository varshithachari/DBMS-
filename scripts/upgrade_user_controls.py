import re

# Update Grafana controls in dashboard.html and index.html
replacement_controls = '''          <!-- Interactive Concurrency & Workload Controller (What if users increase?) -->
          <div class="p-4 rounded-xl bg-[#181b1f] border border-[#2c3235] space-y-3.5">
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
                Supports unlimited load up to Lakhs of concurrent users
              </span>
            </div>

            <!-- Virtual User Stepper Buttons (Standard to Lakhs) -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-1.5">
                <span class="text-[10px] font-mono text-slate-400 mr-1 uppercase">Standard:</span>
                <button onclick="setGrafanaUsers(10)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="10">10</button>
                <button onclick="setGrafanaUsers(50)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="50">50</button>
                <button onclick="setGrafanaUsers(100)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-cyan-500 text-slate-950 font-black border border-cyan-400 shadow-md shadow-cyan-500/20" data-vu="100">100 (Cross)</button>
                <button onclick="setGrafanaUsers(200)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="200">200</button>
                <button onclick="setGrafanaUsers(400)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="400">400 (ECS351)</button>
                <button onclick="setGrafanaUsers(1000)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="1000">1,000</button>
                <button onclick="setGrafanaUsers(5000)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-slate-300 border border-[#2c3235]" data-vu="5000">5,000</button>
              </div>

              <!-- Lakhs Scale Presets -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#22252b]">
                <span class="text-[10px] font-mono text-amber-400 mr-1 uppercase font-bold">Lakhs Scale:</span>
                <button onclick="setGrafanaUsers(10000)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-amber-300 border border-amber-500/30" data-vu="10000">10,000 (10k)</button>
                <button onclick="setGrafanaUsers(50000)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-amber-300 border border-amber-500/30" data-vu="50000">50,000 (50k)</button>
                <button onclick="setGrafanaUsers(100000)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-amber-300 border border-amber-500/30" data-vu="100000">1,00,000 (1 Lakh)</button>
                <button onclick="setGrafanaUsers(500000)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-amber-300 border border-amber-500/30" data-vu="500000">5,00,000 (5 Lakhs)</button>
                <button onclick="setGrafanaUsers(1000000)" class="grafana-vu-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-[#111217] hover:bg-[#22252b] text-rose-300 border border-rose-500/30" data-vu="1000000">10,00,000 (10 Lakhs)</button>
              </div>
            </div>

            <!-- Custom User Input (Enter ANY number of users without limit) -->
            <div class="flex flex-wrap items-center gap-3 pt-2 border-t border-[#22252b]">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-white font-mono flex items-center gap-1">
                  <span>✍️</span> Enter Exact Virtual Users:
                </span>
                <input id="grafana-custom-user-input" type="number" min="1" max="10000000" placeholder="e.g. 75000 or 250000" class="w-44 bg-[#111217] border border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400">
                <button onclick="applyCustomGrafanaUsers()" class="px-3.5 py-1.5 rounded-lg text-xs font-mono font-black bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition btn-tactile">
                  Apply Load & Observe Variations
                </button>
              </div>
              <span class="text-[10px] text-slate-400 font-mono italic">
                Observe how Monolith thread locks while Event-Driven queues absorb the surge
              </span>
            </div>

            <!-- Continuous Range Slider (Logarithmic scaling 10 to 1,000,000) -->
            <div class="flex items-center gap-3 pt-1">
              <span class="text-[10px] font-mono text-slate-500">10 VU</span>
              <input id="grafana-vu-slider" type="range" min="1" max="100" step="1" value="20" oninput="onGrafanaLogSliderChange(this.value)" class="flex-1 accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer">
              <span class="text-[10px] font-mono text-slate-500">10 Lakhs VU</span>
            </div>
          </div>'''

# Target start and end markers
start_marker = '<!-- Interactive Concurrency & Workload Controller (What if users increase?) -->'
end_marker = '<!-- 6-Panel Realistic Grafana Grid -->'

for target_file in ['public/dashboard.html', 'public/index.html']:
    with open(target_file, 'r', encoding='utf-8') as f:
        html = f.read()

    s_idx = html.find(start_marker)
    e_idx = html.find(end_marker)
    if s_idx != -1 and e_idx != -1:
        new_html = html[:s_idx] + replacement_controls + '\n\n          ' + html[e_idx:]
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Successfully upgraded user input controls in {target_file}")
    else:
        print(f"Could not find markers in {target_file}")
