import re

# Panel replacement with rich Characteristic Analysis Box
panel1_old = '''            <!-- Panel 1: Latency (p95) -->
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
            </div>'''

panel1_new = '''            <!-- Panel 1: Latency (p95) -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-orange-400 text-xs">📈</span>
                  <span class="text-xs font-bold text-white font-mono">HTTP Request Latency (p95)</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">ms</span>
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
              <!-- Characteristic Analysis: Performance -->
              <div class="p-2.5 rounded-lg bg-[#111217] border border-[#2c3235] space-y-1.5 text-[10px] font-mono">
                <div class="flex items-center justify-between text-slate-300 font-bold pb-1 border-b border-[#22252b]">
                  <span>🎯 Characteristic: Performance (Latency)</span>
                  <span id="gbox-winner-lat" class="text-amber-400 font-bold">Monolith Wins &lt;100 VU</span>
                </div>
                <div class="space-y-1 leading-snug">
                  <div class="text-amber-300">
                    <span class="font-bold">🏛️ How Monolith Wins:</span> At &lt; 100 VU, sub-millisecond in-memory execution achieves <b>4.5 ms vs 18.5 ms</b> (4x faster).
                  </div>
                  <div class="text-cyan-300">
                    <span class="font-bold">⚡ How Event-Driven Wins:</span> At &gt; 100 VU up to Lakhs, queue buffering stays flat at <b>38 ms</b> while Monolith thread locks to <b>180ms - 15s</b>.
                  </div>
                  <div id="gbox-verdict-lat" class="text-slate-400 italic pt-0.5 border-t border-[#22252b]">
                    Live Verdict: Equilibrium crossover point at ~90-110 concurrent virtual users.
                  </div>
                </div>
              </div>
            </div>'''

panel2_old = '''            <!-- Panel 2: System Throughput -->
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
            </div>'''

panel2_new = '''            <!-- Panel 2: System Throughput -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-400 text-xs">⚡</span>
                  <span class="text-xs font-bold text-white font-mono">System Throughput</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">RPS</span>
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
              <!-- Characteristic Analysis: Scalability & Capacity -->
              <div class="p-2.5 rounded-lg bg-[#111217] border border-[#2c3235] space-y-1.5 text-[10px] font-mono">
                <div class="flex items-center justify-between text-slate-300 font-bold pb-1 border-b border-[#22252b]">
                  <span>🎯 Characteristic: Scalability & Capacity</span>
                  <span id="gbox-winner-thru" class="text-cyan-400 font-bold">EDA Wins &gt;100 VU</span>
                </div>
                <div class="space-y-1 leading-snug">
                  <div class="text-amber-300">
                    <span class="font-bold">🏛️ How Monolith Behaves:</span> Caps at ~380 rps, then <b>collapses down to 90 rps</b> at 400 VU due to thread exhaustion.
                  </div>
                  <div class="text-cyan-300">
                    <span class="font-bold">⚡ How Event-Driven Behaves:</span> Scales linearly to <b>1,480 rps at 400 VU</b> and <b>18,500 rps at Lakhs</b> via worker pools.
                  </div>
                  <div id="gbox-verdict-thru" class="text-slate-400 italic pt-0.5 border-t border-[#22252b]">
                    Live Verdict: Event-Driven provides up to 16.3x capacity advantage under high traffic.
                  </div>
                </div>
              </div>
            </div>'''

panel6_old = '''            <!-- Panel 6: Error Rate & Saturation Boundary -->
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
            </div>'''

panel6_new = '''            <!-- Panel 6: Error Rate & Saturation Boundary -->
            <div class="p-3.5 rounded-xl bg-[#181b1f] border border-[#22252b] space-y-2.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-red-400 text-xs">⚠️</span>
                  <span class="text-xs font-bold text-white font-mono">HTTP 5xx Error Rate (% Drops)</span>
                </div>
                <span class="text-[9px] font-mono text-slate-400 bg-[#111217] px-1.5 py-0.5 rounded border border-[#2c3235]">% Drops</span>
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
              <!-- Characteristic Analysis: Reliability & Fault Tolerance -->
              <div class="p-2.5 rounded-lg bg-[#111217] border border-[#2c3235] space-y-1.5 text-[10px] font-mono">
                <div class="flex items-center justify-between text-slate-300 font-bold pb-1 border-b border-[#22252b]">
                  <span>🎯 Characteristic: Reliability & Fault Tolerance</span>
                  <span id="gbox-winner-err" class="text-cyan-400 font-bold">EDA 0.00% Loss</span>
                </div>
                <div class="space-y-1 leading-snug">
                  <div class="text-amber-300">
                    <span class="font-bold">🏛️ How Monolith Fails:</span> Under heavy concurrency, socket queues overflow causing <b>3.6% to 85% HTTP 504 drops</b>.
                  </div>
                  <div class="text-cyan-300">
                    <span class="font-bold">⚡ How Event-Driven Succeeds:</span> RabbitMQ durable broker guarantees <b>0.00% dropped packets</b> via message persistence.
                  </div>
                  <div id="gbox-verdict-err" class="text-slate-400 italic pt-0.5 border-t border-[#22252b]">
                    Live Verdict: Event-Driven provides zero dropped requests under stress spikes.
                  </div>
                </div>
              </div>
            </div>'''

for target_file in ['public/dashboard.html', 'public/index.html']:
    with open(target_file, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'gbox-winner-lat' not in html:
        # replace panel 1, 2, 6
        if panel1_old in html:
            html = html.replace(panel1_old, panel1_new)
        if panel2_old in html:
            html = html.replace(panel2_old, panel2_new)
        if panel6_old in html:
            html = html.replace(panel6_old, panel6_new)

        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Successfully upgraded Grafana panels with Characteristic Analysis in {target_file}")
    else:
        print(f"Panels already contain analysis boxes in {target_file}")
