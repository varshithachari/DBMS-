// Student Portal Controller (Website 1)
class StudentPortalApp {
  constructor() {
    this.events = [];
    this.map = null;
    this.markers = {};
    this.passes = [
      { id: "EVT-101", title: "Chanakya TechSangam Hackathon 2026", venue: "Kalam Tech Park Bay 1", ticketCode: "TKT-TS2026-AV" },
      { id: "EVT-102", title: "Classical & Folk Fusion Night", venue: "Chanakya Grand Auditorium", ticketCode: "TKT-CUL991-AV" }
    ];
  }

  async init() {
    console.log('[Student Portal] Initialized');
    this.initMap();
    await this.fetchEvents();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  async fetchEvents() {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        this.events = data.events || [];
        this.renderEvents();
      }
    } catch (e) {
      console.warn('Using default events data', e);
      this.events = [
        {
          id: "EVT-101",
          title: "Chanakya TechSangam Hackathon 2026",
          category: "Technical Fest",
          venueName: "Kalam Tech Park Bay 1",
          startDateTime: "2026-09-12T09:00:00Z",
          seatsRemaining: 48,
          capacity: 450,
          status: "approved"
        },
        {
          id: "EVT-102",
          title: "Classical & Contemporary Fusion Fest",
          category: "Cultural",
          venueName: "Chanakya Grand Auditorium",
          startDateTime: "2026-09-15T18:00:00Z",
          seatsRemaining: 120,
          capacity: 1200,
          status: "approved"
        }
      ];
      this.renderEvents();
    }
  }

  renderEvents() {
    const container = document.getElementById('studentEventsContainer');
    if (!container) return;

    if (!this.events || this.events.length === 0) {
      container.innerHTML = '<div class="col-span-2 text-xs text-slate-400">No events scheduled.</div>';
      return;
    }

    container.innerHTML = this.events.slice(0, 4).map(evt => {
      const isRegistered = this.passes.some(p => p.id === evt.id);
      return `
        <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 font-mono">${evt.category || 'Fest'}</span>
              <span class="text-[10px] text-emerald-400 font-mono">${evt.seatsRemaining || 50} seats left</span>
            </div>
            <h4 class="text-xs sm:text-sm font-bold text-white">${evt.title || evt.shortTitle}</h4>
            <p class="text-[11px] text-slate-400">📍 ${evt.venueName || 'Campus Venue'}</p>
          </div>
          
          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span class="text-[10px] text-slate-400">${new Date(evt.startDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            ${isRegistered ? `
              <button onclick="studentApp.viewPass('${evt.id}', '${evt.title}', '${evt.venueName}')" class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                <span>✓</span> View Pass
              </button>
            ` : `
              <button onclick="studentApp.claimPass('${evt.id}', '${evt.title}', '${evt.venueName}')" class="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow">
                Claim Pass
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  claimPass(id, title, venue) {
    const ticketCode = 'TKT-' + Math.floor(10000 + Math.random() * 90000) + '-AV';
    this.passes.push({ id, title, venue, ticketCode });
    const countEl = document.getElementById('myPassesCount');
    if (countEl) countEl.textContent = this.passes.length + ' Active';
    this.renderEvents();
    this.viewPass(id, title, venue, ticketCode);
  }

  viewPass(id, title, venue, ticketCode) {
    const pass = this.passes.find(p => p.id === id) || { ticketCode: ticketCode || 'TKT-89214-AV' };
    const titleEl = document.getElementById('passEventTitle');
    const venueEl = document.getElementById('passEventVenue');
    const codeEl = document.getElementById('passTicketCode');
    if (titleEl) titleEl.textContent = title;
    if (venueEl) venueEl.textContent = '📍 ' + venue;
    if (codeEl) codeEl.textContent = pass.ticketCode;

    const modal = document.getElementById('eventPassModal');
    if (modal) modal.classList.remove('hidden');
  }

  initMap() {
    const mapEl = document.getElementById('studentMap');
    if (!mapEl || typeof L === 'undefined') return;

    // Centered near Chanakya University coordinates
    const lat = 13.222871;
    const lng = 77.755633;

    this.map = L.map('studentMap').setView([lat, lng], 17);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Esri World Imagery (No API Key)'
    }).addTo(this.map);

    const landmarks = [
      { id: 'admin_block', name: 'Academic Block 1 (Admin & Law)', lat: 13.222255, lng: 77.755297, desc: 'South-West V-Wing with Solar Arrays & Reception' },
      { id: 'tech_park', name: 'Academic Block 2 (Science & AI)', lat: 13.223382, lng: 77.755990, desc: 'North V-Wing Computing Clusters & Smart Labs' },
      { id: 'auditorium', name: 'Chanakya Grand Auditorium', lat: 13.223800, lng: 77.756200, desc: '1,200 Capacity Multi-purpose Convocation Hall' },
      { id: 'library', name: 'Central Chanakya Digital Library', lat: 13.222282, lng: 77.755341, desc: 'Digital Colonnade & Study Pods' },
      { id: 'dining', name: 'Annapurna Food Pavilion', lat: 13.222600, lng: 77.756300, desc: 'Main Student Dining & Terrace Cafeteria' },
      { id: 'sports', name: 'Chanakya Olympic Sports Complex', lat: 13.228500, lng: 77.758200, desc: 'Cricket Ground, Football Turf & Basketball' },
      { id: 'hostels', name: 'Nalanda & Takshashila Hostels', lat: 13.224548, lng: 77.758870, desc: 'Modern Student Residential Quarters' }
    ];

    landmarks.forEach(lm => {
      const marker = L.circleMarker([lm.lat, lm.lng], {
        radius: 8,
        fillColor: '#F59E0B',
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(this.map);

      marker.bindPopup(`
        <div class="text-xs p-1">
          <strong class="text-amber-400 block mb-1">${lm.name}</strong>
          <span class="text-slate-300">${lm.desc}</span>
        </div>
      `);
      this.markers[lm.id] = { marker, lat: lm.lat, lng: lm.lng };
    });
  }

  focusMap(id) {
    if (this.markers[id] && this.map) {
      const { lat, lng, marker } = this.markers[id];
      this.map.flyTo([lat, lng], 17, { duration: 1 });
      marker.openPopup();
    }
  }

  openDigitalIdModal() {
    const modal = document.getElementById('digitalIdModal');
    if (modal) modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  showCourseModal(code) {
    const modal = document.getElementById('courseModal');
    const content = document.getElementById('courseModalContent');
    if (!modal || !content) return;

    let title = "Neural Networks & Deep Learning (CS-601)";
    let desc = "Topics: Convolutional Architectures, Transformers, Optimization & Backprop, PyTorch Lab Assignments.";
    if (code === 'CS-603') {
      title = "Distributed Cloud Systems (CS-603)";
      desc = "Topics: Consensus Protocols (Raft/Paxos), Microservices Architecture, Kubernetes orchestration, CAP Theorem.";
    } else if (code === 'HS-605') {
      title = "Indic Philosophy & AI Ethics (HS-605)";
      desc = "Topics: Nyaya Epistemology, Ethical Frameworks for Autonomous Systems, AI Governance in India.";
    }

    content.innerHTML = `
      <div class="space-y-3 text-xs">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">${code}</span>
          <h3 class="text-sm font-bold text-white">${title}</h3>
        </div>
        <p class="text-slate-300 leading-relaxed">${desc}</p>
        <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div class="text-[11px] font-bold text-slate-300">Course Materials & Downloads</div>
          <div class="flex items-center justify-between text-slate-400">
            <span>📄 Lecture 14 - Attention Mechanisms.pdf</span>
            <span class="text-amber-400 font-mono">2.4 MB</span>
          </div>
          <div class="flex items-center justify-between text-slate-400">
            <span>💻 Lab Assignment 4 - Vision Transformers.ipynb</span>
            <span class="text-emerald-400 font-mono">Ready</span>
          </div>
        </div>
        <div class="pt-2 flex justify-end">
          <button onclick="studentApp.closeModal('courseModal')" class="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold">Close</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  bookSports(facility) {
    alert(`✅ Confirmed reservation for Aryan Verma:\n${facility}\nTime: Today @ 5:00 PM - 6:00 PM\nCourt Access code: SC-7749`);
  }

  askAiGuide() {
    const input = document.getElementById('aiQuickInput');
    const resp = document.getElementById('aiQuickResponse');
    if (!input || !resp) return;

    const query = input.value.trim().toLowerCase();
    if (!query) return;

    resp.classList.remove('hidden');
    resp.innerHTML = '<span class="text-amber-400">Thinking...</span>';

    setTimeout(() => {
      let answer = "Chanakya Campus AI: You can find all course documents in Kalam Tech Park Room 204, or explore the central library digital portal.";
      if (query.includes('library') || query.includes('timing') || query.includes('hour')) {
        answer = "Central Chanakya Digital Library is open Monday–Sunday from 07:00 AM to 11:00 PM. High-speed study pods are on Level 2.";
      } else if (query.includes('kalam') || query.includes('tech park') || query.includes('204')) {
        answer = "Dr. APJ Abdul Kalam Tech Park is located on the North-East wing of campus. Room 204 is on the 2nd Floor (Computing & AI Lab Block).";
      } else if (query.includes('exam') || query.includes('end-sem') || query.includes('date')) {
        answer = "End-Semester Examinations for Semester 6 begin on November 18, 2026. Hall tickets will be issued digitally on this portal.";
      } else if (query.includes('food') || query.includes('canteen') || query.includes('dining')) {
        answer = "Annapurna Dining Pavilion is serving breakfast (07:30 - 10:00), lunch (12:00 - 15:00), and dinner (19:30 - 22:00).";
      }

      resp.innerHTML = `<strong>AI Guide:</strong> ${answer}`;
    }, 400);
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }
}

const studentApp = new StudentPortalApp();
window.addEventListener('DOMContentLoaded', () => studentApp.init());
