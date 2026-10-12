/**
 * UtsavHub & Chanakya Campus Connect Frontend Integration Engine
 * Connects School -> Department -> Main Event -> Sub-Event -> Registration -> Leaderboards
 */

class UtsavHubController {
  constructor() {
    this.schools = [];
    this.departments = [];
    this.fests = [];
    this.subEvents = [];
    this.registrations = [];
    this.leaderboard = [];
    this.overview = {};

    this.filters = {
      schoolId: 'all',
      departmentId: 'all',
      festId: 'all',
      category: 'all',
      type: 'all',
      search: ''
    };

    this.pagination = {
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 1
    };

    this.activeUser = null;
  }

  async init() {
    console.log('[UtsavHub Controller] Initializing database integration...');
    this.initUser();
    await this.fetchMeta();
    this.renderFilters();
    this.loadSubEvents();
    this.loadLeaderboard();
    this.loadRegistrations(1);
    this.loadAnalytics();
    this.loadUserRegistrations();
  }

  initUser() {
    try {
      const raw = localStorage.getItem('chanakya_user');
      if (raw) {
        this.activeUser = JSON.parse(raw);
        if (!this.activeUser.profile_id && this.activeUser.id) {
          this.activeUser.profile_id = this.activeUser.id;
        }
      } else if (window.appState && window.appState.currentUser) {
        this.activeUser = {
          profile_id: window.appState.currentUser.profile_id || window.appState.currentUser.id || 1,
          name: window.appState.currentUser.name,
          roll_number: window.appState.currentUser.rollNumber || window.appState.currentUser.roll_number || '24UG0101',
          role: window.appState.currentUser.role || 'student',
          points: window.appState.currentUser.points || 450
        };
      } else {
        this.activeUser = { profile_id: 1, name: "Rahul Sharma", roll_number: "24UG0101", role: "student", points: 450 };
      }
    } catch (e) {
      this.activeUser = { profile_id: 1, name: "Student", roll_number: "24UG0101", role: "student", points: 100 };
    }
  }

  async fetchMeta() {
    try {
      const [scRes, dpRes, fsRes, ovRes] = await Promise.all([
        fetch('/api/schools').then(r => r.json()),
        fetch('/api/departments').then(r => r.json()),
        fetch('/api/fests').then(r => r.json()),
        fetch('/api/analytics/overview').then(r => r.json())
      ]);
      this.schools = scRes.schools || [];
      this.departments = dpRes.departments || [];
      this.fests = fsRes.fests || [];
      this.overview = ovRes || {};
    } catch (err) {
      console.error("[UtsavHub] Meta fetch error:", err);
    }
  }

  // ==========================================
  // FILTERS & CONTROLS
  // ==========================================
  renderFilters() {
    const scSelect = document.getElementById('utsav-filter-school');
    if (scSelect) {
      scSelect.innerHTML = `<option value="all">All Schools (${this.schools.length})</option>` +
        this.schools.map(s => `<option value="${s.school_id}">${s.name}</option>`).join('');
    }

    const festSelect = document.getElementById('utsav-filter-fest');
    if (festSelect) {
      festSelect.innerHTML = `<option value="all">All Conclaves & Fests (${this.fests.length})</option>` +
        this.fests.map(f => `<option value="${f.main_event_id}">${f.name}</option>`).join('');
    }

    this.updateDepartmentDropdown();
  }

  onSchoolChange() {
    const scSelect = document.getElementById('utsav-filter-school');
    this.filters.schoolId = scSelect ? scSelect.value : 'all';
    this.updateDepartmentDropdown();
    this.loadSubEvents();
    this.loadRegistrations(1);
  }

  updateDepartmentDropdown() {
    const dpSelect = document.getElementById('utsav-filter-dept');
    if (!dpSelect) return;

    let filtered = this.departments;
    if (this.filters.schoolId !== 'all') {
      filtered = filtered.filter(d => d.school_id === Number(this.filters.schoolId));
    }

    dpSelect.innerHTML = `<option value="all">All Departments (${filtered.length})</option>` +
      filtered.map(d => `<option value="${d.department_id}">${d.name}</option>`).join('');
  }

  onDepartmentChange() {
    const dpSelect = document.getElementById('utsav-filter-dept');
    this.filters.departmentId = dpSelect ? dpSelect.value : 'all';
    this.loadSubEvents();
    this.loadRegistrations(1);
  }

  onFestChange() {
    const festSelect = document.getElementById('utsav-filter-fest');
    this.filters.festId = festSelect ? festSelect.value : 'all';
    this.loadSubEvents();
    this.loadRegistrations(1);
  }

  onCategoryChange(cat) {
    this.filters.category = cat;
    document.querySelectorAll('.utsav-cat-btn').forEach(btn => {
      const active = btn.getAttribute('data-cat') === cat;
      btn.className = active 
        ? "utsav-cat-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-md transition"
        : "utsav-cat-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition";
    });
    this.loadSubEvents();
  }

  onSearchChange(query) {
    this.filters.search = query;
    clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => {
      this.loadSubEvents();
      this.loadRegistrations(1);
    }, 250);
  }

  // ==========================================
  // SUB-EVENTS EXPLORER
  // ==========================================
  async loadSubEvents() {
    const grid = document.getElementById('utsav-events-grid');
    if (!grid) return;

    grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 font-mono text-xs"><span class="animate-spin inline-block mr-2">⏳</span> Querying PostgreSQL database...</div>`;

    try {
      const params = new URLSearchParams();
      if (this.filters.festId !== 'all') params.append('fest_id', this.filters.festId);
      if (this.filters.category !== 'all') params.append('category', this.filters.category);
      if (this.filters.search) params.append('search', this.filters.search);

      const res = await fetch(`/api/sub-events?${params.toString()}`);
      const data = await res.json();
      this.subEvents = data.sub_events || [];

      if (this.subEvents.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 text-xs">No events found matching your filter criteria.</div>`;
        return;
      }

      grid.innerHTML = this.subEvents.map(s => {
        const occ = s.occupancy_rate || 0;
        const occColor = occ >= 90 ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : (occ >= 60 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20');
        const isTeam = s.type === 'Team';

        return `
          <div class="bento-card p-5 rounded-2xl flex flex-col justify-between border border-slate-700/60 hover:border-amber-500/40 transition duration-300 group">
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[10px]">
                <span class="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-900 text-amber-400 border border-amber-500/30">
                  ${s.category}
                </span>
                <span class="px-2 py-0.5 rounded-full font-mono font-bold ${isTeam ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}">
                  ${isTeam ? '👥 TEAM EVENT' : '👤 SOLO'}
                </span>
              </div>

              <div>
                <span class="text-[10px] text-slate-400 font-mono block">${s.fest_name}</span>
                <h4 class="text-sm font-extrabold text-white group-hover:text-amber-300 transition leading-snug mt-0.5">
                  ${s.name}
                </h4>
              </div>

              <div class="text-[11px] text-slate-300 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">📍 Venue:</span>
                  <span class="font-medium text-white">${s.venue}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">🕒 Timing:</span>
                  <span class="font-mono text-amber-300">${s.day} • ${s.time}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-slate-400">🏆 Points:</span>
                  <span class="font-bold text-emerald-400">+${s.points_reward} Pts</span>
                </div>
              </div>

              <!-- Occupancy Bar -->
              <div class="space-y-1 pt-2 border-t border-slate-800">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="text-slate-400">Registrations: <b class="text-white">${s.registered_count} / ${s.max_capacity}</b></span>
                  <span class="px-1.5 py-0.5 rounded border font-mono font-bold ${occColor}">${occ}% Full</span>
                </div>
                <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style="width: ${occ}%"></div>
                </div>
              </div>
            </div>

            <div class="pt-4 mt-2">
              <button onclick="utsavHub.openRegistrationModal(${s.sub_event_id})" class="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md shadow-amber-500/15 flex items-center justify-center gap-1.5 btn-tactile">
                <span>🎫</span>
                <span>Register & Generate Pass</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    } catch (err) {
      grid.innerHTML = `<div class="col-span-full py-6 text-center text-rose-400 text-xs">Failed to load events: ${err.message}</div>`;
    }
  }

  // ==========================================
  // REGISTRATION MODAL & QR DIGITAL PASS
  // ==========================================
  openRegistrationModal(subEventId) {
    this.initUser();
    const targetId = Number(subEventId);
    let s = this.subEvents.find(ev => Number(ev.sub_event_id) === targetId);

    const modal = document.getElementById('utsav-reg-modal');
    if (!modal) return;

    if (!s) {
      fetch(`/api/sub-events/${targetId}`)
        .then(r => r.json())
        .then(ev => {
          if (ev && !ev.error) {
            this.subEvents.push(ev);
            this.openRegistrationModal(targetId);
          }
        })
        .catch(err => console.error("Could not fetch sub-event:", err));
      return;
    }

    document.getElementById('utsav-modal-sub-id').value = s.sub_event_id;
    document.getElementById('utsav-modal-title').innerText = s.name;
    document.getElementById('utsav-modal-fest').innerText = `${s.fest_name} • ${s.venue}`;
    document.getElementById('utsav-modal-rules').innerText = s.rules || "Standard Chanakya University code of conduct applies.";

    const attendeeNameEl = document.getElementById('utsav-modal-attendee-name');
    const attendeeRollEl = document.getElementById('utsav-modal-attendee-roll');
    const attendeeAvatarEl = document.getElementById('utsav-modal-avatar');
    if (attendeeNameEl) attendeeNameEl.innerText = this.activeUser?.name || 'Registered Attendee';
    if (attendeeRollEl) attendeeRollEl.innerText = this.activeUser?.roll_number || this.activeUser?.email || 'Student';
    if (attendeeAvatarEl) attendeeAvatarEl.innerText = this.activeUser?.avatar || '🎓';

    const teamFields = document.getElementById('utsav-team-fields');
    if (teamFields) {
      teamFields.classList.toggle('hidden', s.type !== 'Team');
    }

    document.getElementById('utsav-reg-pass-result').classList.add('hidden');
    document.getElementById('utsav-reg-form').classList.remove('hidden');

    modal.classList.remove('hidden');
  }

  closeModal() {
    const modal = document.getElementById('utsav-reg-modal');
    if (modal) modal.classList.add('hidden');
  }

  async submitRegistration(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.initUser();

    const subEventId = Number(document.getElementById('utsav-modal-sub-id').value);
    const ticketType = document.getElementById('utsav-modal-ticket')?.value || 'Standard Delegate Pass';
    const teamName = document.getElementById('utsav-modal-team-name')?.value || null;
    const teamMembersRaw = document.getElementById('utsav-modal-members')?.value || '';

    const team_members = teamMembersRaw.split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(name => ({ name }));

    const participantId = Number(this.activeUser?.profile_id || this.activeUser?.id || 1);

    const btn = document.getElementById('btn-confirm-reg');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="animate-spin">⏳</span> Registering in Database...`;
    }

    try {
      const token = localStorage.getItem('chanakya_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/registrations/register', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sub_event_id: subEventId,
          participant_id: participantId,
          ticket_type: ticketType,
          team_name: teamName,
          team_members
        })
      });

      const data = await res.json();
      if (data.success && data.registration) {
        this.showRegistrationPass(data.registration);
        this.loadSubEvents();
        this.loadRegistrations(1);
        this.loadAnalytics();
        this.loadUserRegistrations();

        if (typeof showToast === 'function') {
          showToast(
            "Registration Confirmed",
            data.message || `Digital Pass: ${data.registration.registration_code}`,
            "success"
          );
        }
      } else if (res.status === 409 || (data && !data.success && data.error && data.error.includes('already registered'))) {
        // Participant is already registered! Retrieve their existing pass from the database
        try {
          const userRes = await fetch(`/api/registrations/user?participant_id=${participantId}`);
          const userData = await userRes.json();
          const existing = (userData.registrations || []).find(r => Number(r.sub_event_id) === Number(subEventId));
          if (existing) {
            this.showRegistrationPass(existing);
            if (typeof showToast === 'function') {
              showToast("Active Pass Retrieved", `You are already registered! Loaded pass: ${existing.registration_code}`, "info");
            }
            return;
          }
        } catch (fetchErr) {
          console.warn("Could not retrieve user pass:", fetchErr);
        }
        alert(data.error || "You are already registered for this event.");
      } else {
        alert("Registration notice: " + (data.error || "Please try again."));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Confirm Registration</span> <span>&rarr;</span>`;
      }
    }
  }

  showRegistrationPass(reg) {
    document.getElementById('utsav-reg-form').classList.add('hidden');
    const passBox = document.getElementById('utsav-reg-pass-result');
    passBox.classList.remove('hidden');

    const s = this.subEvents.find(ev => Number(ev.sub_event_id) === Number(reg.sub_event_id));
    const user = this.activeUser || { name: 'Student Attendee' };

    const codeEl = document.getElementById('pass-code-display');
    const seatEl = document.getElementById('pass-seat-display');
    const ticketEl = document.getElementById('pass-ticket-display');
    const dateEl = document.getElementById('pass-date-display');
    const holderEl = document.getElementById('pass-holder-display');
    const eventEl = document.getElementById('pass-event-display');

    if (codeEl) codeEl.innerText = reg.registration_code;
    if (seatEl) seatEl.innerText = reg.seat_number || 'AUD-A12';
    if (ticketEl) ticketEl.innerText = reg.ticket_type || 'Standard Delegate Pass';
    if (dateEl) dateEl.innerText = new Date(reg.registered_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (holderEl) holderEl.innerText = user.name || 'Student Attendee';
    if (eventEl) eventEl.innerText = s ? s.name : (reg.sub_event_name || 'Campus Conclave');
  }

  // ==========================================
  // PAGINATED REGISTRATIONS ROSTER (HIGH PERFORMANCE)
  // ==========================================
  async loadRegistrations(page = 1) {
    this.pagination.page = page;
    const tbody = document.getElementById('utsav-reg-table-body');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400 font-mono text-xs"><span class="animate-spin inline-block mr-2">⏳</span> Fetching paginated records from database...</td></tr>`;

    try {
      const params = new URLSearchParams({
        page: String(this.pagination.page),
        limit: String(this.pagination.limit),
        sort_by: 'registered_at',
        sort_order: 'desc'
      });
      if (this.filters.schoolId !== 'all') params.append('school_id', this.filters.schoolId);
      if (this.filters.departmentId !== 'all') params.append('department_id', this.filters.departmentId);
      if (this.filters.festId !== 'all') params.append('fest_id', this.filters.festId);
      if (this.filters.search) params.append('search', this.filters.search);

      const res = await fetch(`/api/registrations?${params.toString()}`);
      const data = await res.json();

      this.pagination.total = data.total || 0;
      this.pagination.totalPages = data.totalPages || 1;
      const rows = data.data || [];

      // Update counters
      const counterEl = document.getElementById('utsav-reg-count');
      if (counterEl) counterEl.innerText = `${data.total.toLocaleString()} Records`;

      const pageEl = document.getElementById('utsav-reg-page-info');
      if (pageEl) pageEl.innerText = `Page ${data.page} of ${data.totalPages}`;

      if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400 text-xs">No registrations found matching the filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = rows.map(r => {
        const isAttended = r.checked_in;
        const statusBadge = isAttended
          ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ATTENDED</span>`
          : (r.status === 'confirmed' 
              ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">CONFIRMED</span>`
              : `<span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">${r.status.toUpperCase()}</span>`);

        return `
          <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 transition">
            <td class="py-3 px-3.5 font-mono text-xs text-amber-400 font-bold tracking-wider">${r.registration_code}</td>
            <td class="py-3 px-3.5">
              <div class="text-xs font-bold text-white">${r.participant_name}</div>
              <div class="text-[10px] text-slate-400 font-mono">${r.participant_roll || r.participant_email}</div>
            </td>
            <td class="py-3 px-3.5 text-xs text-slate-300">
              <span class="block truncate max-w-[160px]">${r.school_name}</span>
              <span class="text-[10px] text-slate-500">${r.department_name}</span>
            </td>
            <td class="py-3 px-3.5 text-xs text-slate-300">
              <div class="font-medium text-white">${r.sub_event_name}</div>
              <div class="text-[10px] text-slate-500">${r.fest_name}</div>
            </td>
            <td class="py-3 px-3.5 text-xs text-slate-400">${r.ticket_type}</td>
            <td class="py-3 px-3.5 text-right">${statusBadge}</td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-rose-400 text-xs">Error loading registrations: ${err.message}</td></tr>`;
    }
  }

  prevPage() {
    if (this.pagination.page > 1) {
      this.loadRegistrations(this.pagination.page - 1);
    }
  }

  nextPage() {
    if (this.pagination.page < this.pagination.totalPages) {
      this.loadRegistrations(this.pagination.page + 1);
    }
  }

  // ==========================================
  // GATE SCANNER & CHECK-IN
  // ==========================================
  async executeCheckIn() {
    const input = document.getElementById('utsav-checkin-code');
    const code = input ? input.value.trim() : '';
    if (!code) {
      alert("Please enter a registration pass code.");
      return;
    }

    try {
      const res = await fetch('/api/registrations/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, scanned_by: 'Gate 1 Scanner' })
      });
      const data = await res.json();

      const resBox = document.getElementById('utsav-checkin-result');
      resBox.classList.remove('hidden');

      if (data.success) {
        resBox.className = "p-3 rounded-xl border text-xs " + (data.alreadyCheckedIn ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300");
        resBox.innerHTML = `<b>${data.alreadyCheckedIn ? "ℹ️ Notice:" : "✓ Verified:"}</b> ${data.message} (Seat: ${data.registration.seat_number})`;
        this.loadRegistrations(this.pagination.page);
        this.loadAnalytics();
      } else {
        resBox.className = "p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs";
        resBox.innerHTML = `<b>⚠ Error:</b> ${data.error}`;
      }
    } catch (err) {
      alert("Check-in error: " + err.message);
    }
  }

  // ==========================================
  // SCHOOL CHAMPIONSHIP LEADERBOARD
  // ==========================================
  async loadLeaderboard() {
    const table = document.getElementById('utsav-leaderboard-body');
    if (!table) return;

    try {
      const res = await fetch('/api/leaderboard/schools');
      const data = await res.json();
      this.leaderboard = data.leaderboard || [];

      table.innerHTML = this.leaderboard.map((s, idx) => {
        const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
        return `
          <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 transition">
            <td class="py-2.5 px-3 font-mono font-bold text-center text-sm">${medal}</td>
            <td class="py-2.5 px-3 text-xs font-bold text-white">${s.school_name}</td>
            <td class="py-2.5 px-3 text-right font-mono font-black text-amber-400 text-sm">${s.points.toLocaleString()}</td>
            <td class="py-2.5 px-3 text-right text-xs text-slate-300">
              <span class="text-amber-400">🥇${s.gold}</span>
              <span class="text-slate-300 ml-1">🥈${s.silver}</span>
              <span class="text-amber-600 ml-1">🥉${s.bronze}</span>
            </td>
          </tr>
        `;
      }).join('');
    } catch (e) {
      console.error("[UtsavHub] Leaderboard error:", e);
    }
  }

  // ==========================================
  // REAL-TIME ANALYTICS METRICS
  // ==========================================
  async loadAnalytics() {
    try {
      const res = await fetch('/api/analytics/overview');
      const data = await res.json();

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = typeof val === 'number' ? val.toLocaleString() : val;
      };

      setVal('stat-total-schools', data.totalSchools);
      setVal('stat-total-depts', data.totalDepartments);
      setVal('stat-total-fests', data.totalEvents);
      setVal('stat-total-subs', data.totalSubEvents);
      setVal('stat-total-regs', data.totalRegistrations);
      setVal('stat-unique-attendees', data.totalParticipants);
      setVal('stat-attendance-rate', `${data.attendanceRate}%`);
    } catch (e) {
      console.error("[UtsavHub] Analytics error:", e);
    }
  }

  // ==========================================
  // PERSONALIZED STUDENT DASHBOARD & PASSES
  // ==========================================
  async loadUserRegistrations() {
    const container = document.getElementById('utsav-my-passes');
    if (!container) return;

    try {
      const token = localStorage.getItem('chanakya_token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/registrations/user', { headers });
      const data = await res.json();
      const regs = data.registrations || [];

      if (regs.length === 0) {
        container.innerHTML = `<div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs text-center">You have not registered for any events yet. Explore events above to get your digital pass!</div>`;
        return;
      }

      container.innerHTML = regs.map(r => `
        <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">${r.registration_code}</span>
            <span class="text-[10px] font-bold ${r.checked_in ? 'text-emerald-400' : 'text-cyan-400'}">${r.checked_in ? '✓ Attended' : '● Confirmed'}</span>
          </div>
          <div>
            <h5 class="text-xs font-bold text-white">${r.sub_event_name}</h5>
            <span class="text-[10px] text-slate-400">${r.fest_name} • Seat: ${r.seat_number}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-mono">
            📅 ${r.day} • ${r.time}
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <button onclick="utsavHub.viewPass('${r.registration_code}')" class="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 btn-tactile">
              🎫 View Pass
            </button>
            <button onclick="utsavHub.openCertificate('${r.certificate_code || `CERT-${r.registration_code}`}')" class="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 btn-tactile">
              📜 Certificate
            </button>
          </div>
        </div>
      `).join('');
    } catch (e) {
      console.warn("Could not load my passes:", e);
    }
  }

  // ==========================================
  // DIGITAL CERTIFICATE VIEWER & VERIFICATION
  // ==========================================
  async openCertificate(certCode) {
    if (!certCode) return;
    try {
      const res = await fetch(`/api/certificates/${certCode}`);
      const data = await res.json();
      if (!data.success && !data.certificate) {
        alert("Certificate could not be loaded: " + (data.error || "Not found"));
        return;
      }
      const cert = data.certificate;

      const modal = document.getElementById('certificate-modal');
      if (!modal) return;

      const recipientEl = document.getElementById('cert-modal-recipient');
      const rollEl = document.getElementById('cert-modal-roll');
      const schoolEl = document.getElementById('cert-modal-school');
      const eventEl = document.getElementById('cert-modal-event');
      const festEl = document.getElementById('cert-modal-fest');
      const awardEl = document.getElementById('cert-modal-award');
      const codeEl = document.getElementById('cert-modal-code');
      const dateEl = document.getElementById('cert-modal-date');
      const badgeEl = document.getElementById('cert-modal-type-badge');

      if (recipientEl) recipientEl.innerText = cert.participant_name || 'Rahul Sharma';
      if (rollEl) rollEl.innerText = cert.roll_number || '24UG0101';
      if (schoolEl) schoolEl.innerText = cert.school_name || 'School of Engineering';
      if (eventEl) eventEl.innerText = cert.sub_event_name || 'Campus Conclave';
      if (festEl) festEl.innerText = cert.fest_name || 'UtsavHub Conclave';
      if (awardEl) awardEl.innerText = cert.prize_title || (cert.is_winner ? `Rank ${cert.rank} Award` : 'Active Participation Honor');
      if (codeEl) codeEl.innerText = cert.certificate_code;
      if (dateEl) dateEl.innerText = cert.issued_date || new Date().toISOString().split('T')[0];
      if (badgeEl) {
        badgeEl.innerText = cert.is_winner ? `CERTIFICATE OF EXCELLENCE - RANK ${cert.rank || 1}` : 'CERTIFICATE OF PARTICIPATION';
        badgeEl.className = cert.is_winner 
          ? "px-2.5 py-1 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase"
          : "px-2.5 py-1 rounded text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase";
      }

      modal.classList.remove('hidden');
    } catch (err) {
      console.error("Certificate load error:", err);
      alert("Error loading certificate: " + err.message);
    }
  }

  closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.add('hidden');
  }

  printCertificate() {
    window.print();
  }

  async viewPass(regCode) {
    try {
      const res = await fetch(`/api/registrations/code/${encodeURIComponent(regCode)}`);
      const data = await res.json();
      if (data.success && data.registration) {
        const modal = document.getElementById('utsav-reg-modal');
        if (modal) {
          modal.classList.remove('hidden');
          this.showRegistrationPass(data.registration);
        }
      } else {
        alert("Pass record not found for code: " + regCode);
      }
    } catch (e) {
      console.error("View pass error:", e);
    }
  }

  // ==========================================
  // SCALABILITY CLI & BENCHMARK TRIGGER
  // ==========================================
  async runDatasetGenerator() {
    const btn = document.getElementById('btn-run-scale');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="animate-spin">⏳</span> Generating 1,700+ Database Records...`;
    }

    try {
      const res = await fetch('/api/scalability/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 100 })
      });
      const data = await res.json();

      alert(`✅ Scalability Generation Complete!\n\n` +
        `• Sub-Events Seeded: ${data.subEventsCount}\n` +
        `• Total Database Registrations: ${data.totalRegistrations.toLocaleString()}\n` +
        `• Total Participants: ${data.totalParticipants.toLocaleString()}\n` +
        `• Competition Podiums: ${data.totalCompetitionResults}\n\n` +
        `All dashboard charts, rosters, and leaderboards updated!`
      );

      this.loadSubEvents();
      this.loadRegistrations(1);
      this.loadLeaderboard();
      this.loadAnalytics();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>⚡ Generate 1,700+ Records (100/sub-event)</span>`;
      }
    }
  }
}

// Global Singleton & Window Attachment
const utsavHub = new UtsavHubController();
window.utsavHub = utsavHub;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    utsavHub.init();
  });
} else {
  utsavHub.init();
}
