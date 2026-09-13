// Faculty & Academic Portal Controller (Website 2)
class FacultyPortalApp {
  constructor() {
    this.gradeChart = null;
    this.pendingApprovals = [
      { id: "EVT-103", title: "Chanakya Quantum Computing Workshop 2026", club: "Chanakya Innovation Guild", venue: "Kalam Tech Bay 1" },
      { id: "EVT-104", title: "Annual AI & Indic Heritage Symposium", club: "School of Computing & Humanities", venue: "Chanakya Grand Auditorium" }
    ];
  }

  init() {
    console.log('[Faculty Portal] Initialized');
    this.initChart();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  initChart() {
    const ctx = document.getElementById('facultyGradeChart');
    if (!ctx || typeof Chart === 'undefined') return;

    this.gradeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Grade O (90-100%)', 'Grade A+ (80-89%)', 'Grade A (70-79%)', 'Grade B+ (60-69%)', 'Grade B (50-59%)'],
        datasets: [{
          label: 'Number of Students',
          data: [18, 26, 16, 6, 2],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(244, 63, 94, 0.8)'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        }
      }
    });
  }

  markAttendance(courseCode) {
    alert(`📋 Attendance record submitted for ${courseCode} (Batch A):\n65 Present / 68 Enrolled (95.5% Attendance recorded).`);
  }

  broadcastNote(courseCode) {
    const note = prompt(`Enter announcement note to broadcast to all students in ${courseCode}:`, "Lab Assignment 4 is due this Friday at 11:59 PM.");
    if (note) {
      alert(`📢 Note broadcasted successfully to all 68 students in ${courseCode}:\n"${note}"`);
    }
  }

  processApproval(id, action) {
    const itemIndex = this.pendingApprovals.findIndex(p => p.id === id);
    if (action === 'approve') {
      alert(`✅ Proposal sanctioned successfully!\nDean/Faculty signature appended. Event is now scheduled on campus calendar.`);
    } else {
      alert(`⚠️ Proposal sent back to organizers with revision notes.`);
    }

    if (itemIndex > -1) {
      this.pendingApprovals.splice(itemIndex, 1);
    }
    const countEl = document.getElementById('pendingApprovalsCount');
    if (countEl) countEl.textContent = this.pendingApprovals.length + ' Proposals';
  }

  openProposeEventModal() {
    const modal = document.getElementById('proposeEventModal');
    if (modal) modal.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  openReservationModal() {
    this.bookFacility('Dean Conference Suite 3');
  }

  bookFacility(facility) {
    alert(`🏛️ Reserved ${facility} for Prof. Rajesh Sharma:\nDate: Tomorrow @ 2:00 PM - 4:00 PM\nConfirmation token: FAC-RES-509`);
  }

  submitNewEvent(e) {
    e.preventDefault();
    const title = document.getElementById('facEvtTitle').value;
    alert(`🎉 Academic Event Published:\n"${title}"\nNotifications broadcasted to department students.`);
    this.closeModal('proposeEventModal');
  }

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
  }
}

const facultyApp = new FacultyPortalApp();
window.addEventListener('DOMContentLoaded', () => facultyApp.init());
