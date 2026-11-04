import re

showcase_html = '''        <!-- ================================================================== -->
        <!-- ARCHITECTURAL CHARACTERISTIC HANDLING SHOWCASE (Interactive Deep-Dive) -->
        <!-- ================================================================== -->
        <div class="bento-card p-5 border-amber-500/40 bg-gradient-to-br from-slate-900 via-[#131722] to-slate-950 space-y-4 shadow-xl">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  ARCHITECTURAL CHARACTERISTICS MECHANICS
                </span>
                <span id="char-handling-current-vu-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  Evaluating at 100 Virtual Users
                </span>
              </div>
              <h4 class="text-base sm:text-lg font-black text-white font-outfit flex items-center gap-2">
                <span>⭐</span> How Modular Monolith vs Event-Driven Handles Each Characteristic
              </h4>
              <p class="text-xs text-slate-300">
                Direct evidence analysis of runtime handling mechanics. Select any architectural characteristic to see how both architectures behave under controlled workloads and how they handle high concurrency up to Lakhs of users.
              </p>
            </div>

            <!-- Quick Characteristic Pills -->
            <div class="flex flex-wrap items-center gap-1.5 flex-shrink-0">
              <button onclick="selectCharacteristicShowcase('scalability')" class="char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-amber-500 text-slate-950 border border-amber-400" data-char="scalability">🚀 Scalability</button>
              <button onclick="selectCharacteristicShowcase('performance')" class="char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700" data-char="performance">⚡ Performance</button>
              <button onclick="selectCharacteristicShowcase('fault_tolerance')" class="char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700" data-char="fault_tolerance">🛡️ Fault Tolerance</button>
              <button onclick="selectCharacteristicShowcase('elasticity')" class="char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700" data-char="elasticity">🔄 Elasticity</button>
              <button onclick="selectCharacteristicShowcase('consistency')" class="char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700" data-char="consistency">🔒 Consistency</button>
              <button onclick="selectCharacteristicShowcase('maintainability')" class="char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700" data-char="maintainability">🛠️ Maintainability</button>
              <button onclick="selectCharacteristicShowcase('overall_cost')" class="char-pill-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700" data-char="overall_cost">💰 Overall Cost</button>
            </div>
          </div>

          <!-- Dynamic Deep-Dive Container -->
          <div id="char-deepdive-container" class="space-y-4">
            <!-- Dynamically populated via architectureLab.js -->
          </div>
        </div>
'''

target_marker = '<!-- 14-CHARACTERISTIC EVIDENCE-BASED STAR RATING MATRIX -->'

for target_file in ['public/dashboard.html', 'public/index.html']:
    with open(target_file, 'r', encoding='utf-8') as f:
        html = f.read()

    if target_marker in html and 'id="char-deepdive-container"' not in html:
        new_html = html.replace(target_marker, showcase_html + '\n\n        ' + target_marker)
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Successfully injected Characteristic Showcase into {target_file}")
    else:
        print(f"Skipping {target_file} (already injected or marker missing)")
