const fs = require('fs');
const path = require('path');
const cplData = require('../data/cplData');

const appJsPath = path.join(__dirname, '..', 'public', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

const cplEngineCode = `
// ============================================================================
// CHANAKYA PREMIER LEAGUE (SEASON-2) 2026 (CPL) & SPORTS HUB
// ============================================================================
const EMBEDDED_CPL_DATA = ${JSON.stringify(cplData, null, 2)};
let activeCplInnings = 'inn1';

function renderSportsCourts() {
  const container = document.getElementById('sports-courts-list');
  if (!container) return;

  const cpl = appState.cplData || EMBEDDED_CPL_DATA;
  const m1 = cpl.matches[0];
  const m2 = cpl.matches[1];

  // 1. Chanakya Premier League (CPL) Featured Showcase
  const cplHtml = \`
    <div class="col-span-full space-y-4 mb-3">
      <!-- CPL Header Banner -->
      <div class="glass-card rounded-3xl p-5 border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900/60 to-blue-500/15 shadow-2xl relative overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-lg shadow-amber-500/10">
              🏏
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-white font-outfit">\${escapeHtml(cpl.tournament.name)}</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse uppercase">
                  LEAGUE MATCHES
                </span>
              </div>
              <p class="text-xs text-slate-300 font-mono mt-0.5">
                📍 \${escapeHtml(cpl.tournament.ground)}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1.5 font-mono">
              <span>⚡</span> Powered by CricHeroes
            </span>
            <button onclick="openCplStandingsModal()" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition">
              🏆 Standings
            </button>
            <button onclick="openCplSquadsModal()" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 transition">
              👥 Squads (12s)
            </button>
          </div>
        </div>

        <!-- Featured Match Card (Match 1) -->
        <div class="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <!-- Scores Summary -->
          <div class="lg:col-span-7 space-y-3">
            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Match 1 • \${m1.date} (\${m1.time})</span>
              <span class="text-amber-400 font-bold">\${m1.toss}</span>
            </div>

            <!-- Team Scores Box -->
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
              <!-- Magadha Lions -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span class="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
                  <span class="text-sm font-black text-white tracking-wide">\${m1.teamA}</span>
                  <span class="text-[10px] text-amber-400 font-bold">(1st Inn)</span>
                </div>
                <div class="text-right">
                  <span class="text-base font-black text-amber-400">\${m1.summary.magadhaLions.score}/10</span>
                  <span class="text-xs text-slate-400 font-mono">(\${m1.summary.magadhaLions.overs} Ov)</span>
                </div>
              </div>

              <!-- Chalukya Challengers -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-850">
                <div class="flex items-center gap-2.5">
                  <span class="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500"></span>
                  <span class="text-sm font-black text-white tracking-wide">\${m1.teamB}</span>
                  <span class="text-[10px] text-cyan-400 font-bold">(Target 128)</span>
                </div>
                <div class="text-right">
                  <span class="text-base font-black text-cyan-400">\${m1.summary.chalukyaChallengers.score}/10</span>
                  <span class="text-xs text-slate-400 font-mono">(\${m1.summary.chalukyaChallengers.overs} Ov)</span>
                </div>
              </div>

              <!-- Match Result Banner -->
              <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span class="text-emerald-400 font-extrabold flex items-center gap-1.5">
                  <span>🎉</span> \${m1.result} (Thrilling Finish!)
                </span>
                <span class="text-amber-400 text-[11px] font-mono">POTM: \${m1.playerOfTheMatch.name} (4 wkts)</span>
              </div>
            </div>

            <!-- Top Performers Pills -->
            <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                🏏 Pradyumna: <b>27 (22)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                🏏 Reyansh: <b>20 (14)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                🏏 Dheemanth: <b>20 (28)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                ⚡ Vidya Sagar: <b>4/18 (4.0)</b>
              </span>
              <span class="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                ⚡ Mayur Krishna: <b>4/22 (2.4)</b>
              </span>
            </div>
          </div>

          <!-- Quick Action & Upcoming Match Card -->
          <div class="lg:col-span-5 space-y-3">
            <button onclick="openCplScorecardModal('cpl-2026-m01')" class="w-full py-3 px-4 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2">
              <span>📊</span> Open Full CricHeroes Scorecard
            </button>

            <!-- Upcoming Matches Sync Card -->
            <div class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-cyan-400 font-bold uppercase tracking-wider">Next Match 2 (Upcoming):</span>
                <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px]">CPL League</span>
              </div>
              <div class="flex items-center justify-between font-bold text-white">
                <span>Maurya Strikers</span>
                <span class="text-slate-500 font-mono text-xs">vs</span>
                <span>Rashtrakuta Warriors</span>
              </div>
              <p class="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5 flex items-center gap-1.5">
                <span>📅</span>
                <span>\${cpl.tournament.notice}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-3">
        <h4 class="text-sm font-black text-white flex items-center gap-2 font-outfit">
          <span>🏟️</span> Campus Sports Arenas & Court Bookings
        </h4>
        <span class="text-xs text-slate-400 font-mono">Live Slot Reservation</span>
      </div>
    </div>
  \`;

  // 2. Sports Court Grid
  const courtsHtml = (appState.sportsCourts || []).map(court => {
    const isAvail = court.available;
    return \`
      <div class="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between hover:border-cyan-500/40 transition">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">\${escapeHtml(court.sport)}</span>
            \${court.cplFeatured ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">CPL VENUE</span>' : ''}
          </div>
          <h3 class="text-base font-bold text-white mt-0.5">\${escapeHtml(court.name)}</h3>
          <p class="text-xs text-slate-400">📍 \${escapeHtml(court.location)}</p>
          <div class="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
            <span>Slots: <b>\${court.slots.length} daily</b></span>
            <span>•</span>
            <span class="text-emerald-400 font-semibold">\${court.slots.filter(s => s.status.includes('Available') || s.status.includes('Open')).length} Open</span>
          </div>
        </div>

        <div class="flex flex-col items-end gap-2.5">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold \${isAvail ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}">
            \${isAvail ? 'AVAILABLE' : 'IN USE'}
          </span>
          <button onclick="bookCourtModal('\${court.id}', '\${escapeHtml(court.name)}')" class="py-1.5 px-3 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition">
            Book Slot
          </button>
        </div>
      </div>
    \`;
  }).join('');

  container.innerHTML = cplHtml + courtsHtml;
}

// ----------------------------------------------------------------------------
// CPL MODAL 1: FULL CRICHEROES DIGITAL SCORECARD
// ----------------------------------------------------------------------------
function openCplScorecardModal(matchId) {
  sfx.play('click');
  activeCplInnings = 'inn1';

  let modal = document.getElementById('cpl-scorecard-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cpl-scorecard-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto';
    document.body.appendChild(modal);
  }

  modal.innerHTML = getCplScorecardModalHtml(matchId);
  modal.classList.remove('hidden');
}

function closeCplScorecardModal() {
  sfx.play('click');
  const modal = document.getElementById('cpl-scorecard-modal');
  if (modal) modal.classList.add('hidden');
}

function switchCplInningsTab(tabKey, matchId) {
  sfx.play('click');
  activeCplInnings = tabKey;
  const modal = document.getElementById('cpl-scorecard-modal');
  if (modal) modal.innerHTML = getCplScorecardModalHtml(matchId || 'cpl-2026-m01');
}

function getCplScorecardModalHtml(matchId) {
  const cpl = appState.cplData || EMBEDDED_CPL_DATA;
  const match = cpl.matches.find(m => m.id === matchId) || cpl.matches[0];
  const inn1 = match.innings1;
  const inn2 = match.innings2;

  return \`
    <div class="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- CricHeroes Header -->
      <div class="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏏</span>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base md:text-lg font-black text-white font-outfit">\${escapeHtml(cpl.tournament.name)}</h2>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">CricHeroes</span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-0.5">
                \${match.matchNumber} • \${match.date} • \${match.ground}
              </p>
            </div>
          </div>
        </div>
        <button onclick="closeCplScorecardModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition">
          ✕
        </button>
      </div>

      <!-- Match Result & Toss Bar -->
      <div class="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
            🏆 \${match.result}
          </span>
          <span class="text-slate-400">Toss: <b class="text-white">\${match.toss}</b></span>
        </div>
        <div class="text-amber-400 font-mono text-[11px]">
          Umpires: \${match.officials.umpires.join(', ')} • Scorer: \${match.officials.scorer}
        </div>
      </div>

      <!-- Innings Switcher Tabs -->
      <div class="px-5 pt-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
        <button onclick="switchCplInningsTab('inn1', '\${match.id}')" class="py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 \${activeCplInnings === 'inn1' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}">
          <span>🦁</span> 1st Inn: MAGADHA LIONS (\${inn1.score})
        </button>
        <button onclick="switchCplInningsTab('inn2', '\${match.id}')" class="py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 \${activeCplInnings === 'inn2' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}">
          <span>⚔️</span> 2nd Inn: Chalukya Challengers (\${inn2.score})
        </button>
      </div>

      <!-- Scorecard Body -->
      <div class="p-5 overflow-y-auto space-y-5 text-xs">
        \${activeCplInnings === 'inn1' ? renderInningsScorecard(inn1, "MAGADHA LIONS", inn1.bowling, "Chalukya Challengers") : renderInningsScorecard(inn2, "Chalukya Challengers", inn2.bowling, "MAGADHA LIONS")}
      </div>
    </div>
  \`;
}

function renderInningsScorecard(inn, battingTeam, bowlers, bowlingTeam) {
  return \`
    <!-- Batting Table -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-300">Batting — \${battingTeam} (\${inn.score}, \${inn.overs} Ov)</h4>
        <span class="text-amber-400 font-mono text-[11px]">CRR: \${inn.crr}</span>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
            <tr>
              <th class="py-2.5 px-3">Batsman</th>
              <th class="py-2.5 px-3">Dismissal</th>
              <th class="py-2.5 px-2 text-right">R</th>
              <th class="py-2.5 px-2 text-right">B</th>
              <th class="py-2.5 px-2 text-right">4s</th>
              <th class="py-2.5 px-2 text-right">6s</th>
              <th class="py-2.5 px-3 text-right">SR</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            \${inn.batting.map(b => \`
              <tr class="hover:bg-slate-900/50 transition">
                <td class="py-2 px-3 font-bold text-white whitespace-nowrap">
                  \${escapeHtml(b.name)} <span class="text-[10px] text-slate-500 font-normal">(\${b.hand})</span>
                </td>
                <td class="py-2 px-3 text-slate-400 text-[11px]">
                  \${escapeHtml(b.dismissal)}
                </td>
                <td class="py-2 px-2 text-right font-black \${b.runs >= 20 ? 'text-amber-400' : 'text-slate-200'}">\${b.runs}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.balls}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.fours}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.sixes}</td>
                <td class="py-2 px-3 text-right text-cyan-400 font-mono">\${b.sr.toFixed(1)}</td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>

      <!-- Extras & Total -->
      <div class="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div>Extras: <b class="text-white">\${inn.extras.total}</b> <span class="text-slate-500 font-mono text-[10px]">(\${inn.extras.breakdown})</span></div>
        <div>Total: <b class="text-amber-400 text-sm">\${inn.score}</b> <span class="text-slate-400">(\${inn.overs} Overs, CRR: \${inn.crr})</span></div>
      </div>
    </div>

    <!-- Fall of Wickets -->
    <div class="space-y-1.5 pt-1">
      <span class="text-[10px] uppercase font-bold text-slate-400 font-mono">Fall of Wickets:</span>
      <div class="flex flex-wrap gap-1.5">
        \${inn.fallOfWickets.map(f => \`
          <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            <b class="text-amber-400">\${f.score}</b> (\${f.batsman}, \${f.overs} ov)
          </span>
        \`).join('')}
      </div>
    </div>

    <!-- Bowling Table -->
    <div class="space-y-2 pt-2">
      <h4 class="text-xs font-black uppercase tracking-wider text-slate-300">Bowling — \${bowlingTeam}</h4>
      <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-900/90 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
            <tr>
              <th class="py-2.5 px-3">Bowler</th>
              <th class="py-2.5 px-2 text-right">O</th>
              <th class="py-2.5 px-2 text-right">M</th>
              <th class="py-2.5 px-2 text-right">R</th>
              <th class="py-2.5 px-2 text-right">W</th>
              <th class="py-2.5 px-2 text-right">0s</th>
              <th class="py-2.5 px-2 text-right">4s</th>
              <th class="py-2.5 px-2 text-right">6s</th>
              <th class="py-2.5 px-2 text-right">WD</th>
              <th class="py-2.5 px-3 text-right">Econ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-850">
            \${bowlers.map(b => \`
              <tr class="hover:bg-slate-900/50 transition">
                <td class="py-2 px-3 font-bold text-white whitespace-nowrap">\${escapeHtml(b.name)}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.overs}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.maidens}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.runs}</td>
                <td class="py-2 px-2 text-right font-black \${b.wickets >= 2 ? 'text-amber-400' : 'text-slate-200'}">\${b.wickets}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.dots}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.fours}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.sixes}</td>
                <td class="py-2 px-2 text-right text-slate-400 font-mono">\${b.wides}</td>
                <td class="py-2 px-3 text-right text-cyan-400 font-mono">\${b.economy.toFixed(2)}</td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  \`;
}

// ----------------------------------------------------------------------------
// CPL MODAL 2: PLAYING SQUADS (12-MAN ROSTERS)
// ----------------------------------------------------------------------------
function openCplSquadsModal() {
  sfx.play('click');
  let modal = document.getElementById('cpl-squads-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cpl-squads-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto';
    document.body.appendChild(modal);
  }

  const cpl = appState.cplData || EMBEDDED_CPL_DATA;
  const magadha = cpl.teams.find(t => t.id === 'magadha_lions');
  const chalukya = cpl.teams.find(t => t.id === 'chalukya_challengers');

  modal.innerHTML = \`
    <div class="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div>
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>👥</span> CPL Season-2 Playing Squads (12s)
          </h3>
          <p class="text-xs text-slate-400 font-mono">Official team lineups from CricHeroes match sheet</p>
        </div>
        <button onclick="closeCplSquadsModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
          ✕
        </button>
      </div>

      <div class="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <!-- Magadha Lions -->
        <div class="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-sm font-black text-amber-400">🦁 \${magadha.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">Captain: \${magadha.captain}</span>
          </div>
          <ol class="space-y-1.5 list-decimal list-inside text-slate-300">
            \${magadha.squad.map(p => \`
              <li class="py-1 px-2 rounded bg-slate-900/60 flex items-center justify-between">
                <span class="font-bold text-white">\${escapeHtml(p.name)}</span>
                <span class="text-[10px] text-amber-400 font-mono">\${escapeHtml(p.role)}</span>
              </li>
            \`).join('')}
          </ol>
        </div>

        <!-- Chalukya Challengers -->
        <div class="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <span class="text-sm font-black text-cyan-400">⚔️ \${chalukya.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">Captain: \${chalukya.captain}</span>
          </div>
          <ol class="space-y-1.5 list-decimal list-inside text-slate-300">
            \${chalukya.squad.map(p => \`
              <li class="py-1 px-2 rounded bg-slate-900/60 flex items-center justify-between">
                <span class="font-bold text-white">\${escapeHtml(p.name)}</span>
                <span class="text-[10px] text-cyan-400 font-mono">\${escapeHtml(p.role)}</span>
              </li>
            \`).join('')}
          </ol>
        </div>
      </div>
    </div>
  \`;
  modal.classList.remove('hidden');
}

function closeCplSquadsModal() {
  sfx.play('click');
  const modal = document.getElementById('cpl-squads-modal');
  if (modal) modal.classList.add('hidden');
}

// ----------------------------------------------------------------------------
// CPL MODAL 3: TOURNAMENT POINTS TABLE & STANDINGS
// ----------------------------------------------------------------------------
function openCplStandingsModal() {
  sfx.play('click');
  let modal = document.getElementById('cpl-standings-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cpl-standings-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto';
    document.body.appendChild(modal);
  }

  const cpl = appState.cplData || EMBEDDED_CPL_DATA;

  modal.innerHTML = \`
    <div class="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <div class="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div>
          <h3 class="text-base font-black text-white flex items-center gap-2">
            <span>🏆</span> CPL Season-2 Standings & Points Table
          </h3>
          <p class="text-xs text-slate-400 font-mono">Chanakya Premier League 2026</p>
        </div>
        <button onclick="closeCplStandingsModal()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
          ✕
        </button>
      </div>

      <div class="p-5 overflow-y-auto space-y-4 text-xs">
        <div class="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/80">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900 text-slate-400 text-[10px] uppercase font-mono border-b border-slate-800">
              <tr>
                <th class="py-2.5 px-3">Team</th>
                <th class="py-2.5 px-2 text-center">P</th>
                <th class="py-2.5 px-2 text-center">W</th>
                <th class="py-2.5 px-2 text-center">L</th>
                <th class="py-2.5 px-2 text-center">Pts</th>
                <th class="py-2.5 px-3 text-right">NRR</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-850">
              \${cpl.teams.map((t, idx) => \`
                <tr class="hover:bg-slate-900/40 transition">
                  <td class="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span class="w-5 text-slate-500 font-mono text-[11px]">#\${idx + 1}</span>
                    <span style="color: \${t.color}">\${escapeHtml(t.name)}</span>
                    \${t.status ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Upcoming</span>' : ''}
                  </td>
                  <td class="py-2.5 px-2 text-center text-slate-300 font-mono">\${t.matchesPlayed}</td>
                  <td class="py-2.5 px-2 text-center text-emerald-400 font-bold font-mono">\${t.won}</td>
                  <td class="py-2.5 px-2 text-center text-rose-400 font-mono">\${t.lost}</td>
                  <td class="py-2.5 px-2 text-center font-black text-amber-400 text-sm font-mono">\${t.points}</td>
                  <td class="py-2.5 px-3 text-right text-cyan-400 font-mono">\${t.netRunRate}</td>
                </tr>
              \`).join('')}
            </tbody>
          </table>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-[11px] space-y-1">
          <p class="font-bold text-slate-200">ℹ️ Tournament Progression:</p>
          <p>• Top 2 teams qualify for the Grand CPL Finale at Chanakya Global Campus Cricket Ground.</p>
          <p>• Additional league matches data sync arriving in 3-4 days as upcoming matches conclude.</p>
        </div>
      </div>
    </div>
  \`;
  modal.classList.remove('hidden');
}

function closeCplStandingsModal() {
  sfx.play('click');
  const modal = document.getElementById('cpl-standings-modal');
  if (modal) modal.classList.add('hidden');
}
`;

// Replace renderSportsCourts in appJs
const targetRegex = /function renderSportsCourts\(\)[\s\S]*?function bookCourtModal[^{]*\{[\s\S]*?\}/;
if (appJs.match(targetRegex)) {
  appJs = appJs.replace(targetRegex, cplEngineCode);
  
  // Also add escape key handler for CPL modals if not present
  if (!appJs.includes('closeCplScorecardModal();')) {
    appJs = appJs.replace(
      'closeWhiteboardPhotoModal();',
      'closeWhiteboardPhotoModal();\n      closeCplScorecardModal();\n      closeCplSquadsModal();\n      closeCplStandingsModal();'
    );
  }

  fs.writeFileSync(appJsPath, appJs, 'utf8');
  console.log('✅ Successfully patched public/js/app.js with full CPL Engine');

  const docsJsPath = path.join(__dirname, '..', 'docs', 'js', 'app.js');
  fs.writeFileSync(docsJsPath, appJs, 'utf8');
  console.log('✅ Synced to docs/js/app.js');
} else {
  console.error('❌ Could not find target in public/js/app.js');
}
