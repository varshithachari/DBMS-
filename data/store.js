const EventEmitter = require('events');
const seedData = require('./seedData');
const campusConfig = require('../config/campusConfig');

class CampusDataStore extends EventEmitter {
  constructor() {
    super();
    this.events = JSON.parse(JSON.stringify(seedData.events));
    this.facilities = JSON.parse(JSON.stringify(seedData.facilities));
    this.foodOutlets = JSON.parse(JSON.stringify(seedData.foodOutlets));
    this.sportsCourts = JSON.parse(JSON.stringify(seedData.sportsCourts));
    this.issues = JSON.parse(JSON.stringify(seedData.issues));
    this.notifications = JSON.parse(JSON.stringify(seedData.notifications));
    this.simulations = JSON.parse(JSON.stringify(seedData.simulations));
    this.campusStats = JSON.parse(JSON.stringify(seedData.campusStats));
    this.landmarks = JSON.parse(JSON.stringify(campusConfig.landmarks));
    this.registrations = [];
    this.blockedPaths = []; // For dynamic routing obstacle simulation

    this.seedRegistrations();
  }

  seedRegistrations() {
    this.registrations = [
      {
        id: "REG-1001",
        eventId: "EVT-2026-001",
        eventTitle: "Chanakya TechSangam 2026",
        userName: "Aryan Verma",
        userEmail: "aryan.v@chanakyauniversity.edu.in",
        userRole: "student",
        userDept: "Computer Science & AI",
        ticketType: "VIP All-Access Pass",
        qrCode: "CU-TS26-REG1001-AI",
        seatNumber: "AUD-A14",
        registeredAt: "2026-08-20T10:00:00.000Z",
        checkedIn: false
      },
      {
        id: "REG-1002",
        eventId: "EVT-2026-001",
        eventTitle: "Chanakya TechSangam 2026",
        userName: "Pooja Hegde",
        userEmail: "pooja.h@chanakyauniversity.edu.in",
        userRole: "student",
        userDept: "Data Science",
        ticketType: "Standard Delegate",
        qrCode: "CU-TS26-REG1002-DS",
        seatNumber: "AUD-B22",
        registeredAt: "2026-08-21T11:30:00.000Z",
        checkedIn: false
      },
      {
        id: "REG-1003",
        eventId: "EVT-2026-002",
        eventTitle: "Ananda Dhwani 2026",
        userName: "Vikram Joshi",
        userEmail: "vikram.j@chanakyauniversity.edu.in",
        userRole: "student",
        userDept: "Management",
        ticketType: "General Entry",
        qrCode: "CU-AD26-REG1003-GEN",
        seatNumber: "AMP-G08",
        registeredAt: "2026-08-22T14:15:00.000Z",
        checkedIn: false
      }
    ];
  }

  // Events Service methods
  getAllEvents(filters = {}) {
    let result = [...this.events];
    if (filters.category && filters.category !== 'all') {
      result = result.filter(e => e.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter(e => e.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q))) ||
        e.venueName.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getEventById(id) {
    return this.events.find(e => e.id === id);
  }

  createEvent(eventData) {
    const nextNum = this.events.length + 1;
    const newEvent = {
      id: 'EVT-2026-' + String(nextNum).padStart(3, '0'),
      title: eventData.title || 'Untitled Event',
      shortTitle: eventData.shortTitle || eventData.title,
      category: eventData.category || 'General',
      department: eventData.department || 'Student Welfare',
      organizer: eventData.organizer || 'Chanakya Campus Club',
      leadContact: eventData.leadContact || 'Event Lead',
      venueId: eventData.venueId || 'grand_auditorium',
      venueName: eventData.venueName || 'Grand Auditorium',
      startDate: eventData.startDate || new Date().toISOString(),
      endDate: eventData.endDate || new Date(Date.now() + 86400000).toISOString(),
      displayDate: eventData.displayDate || 'Upcoming',
      status: eventData.status || 'pending_faculty',
      bannerImage: eventData.bannerImage || '/assets/images/chanakya_campus.png',
      featured: Boolean(eventData.featured),
      expectedFootfall: Number(eventData.expectedFootfall) || 500,
      registeredCount: 0,
      maxCapacity: Number(eventData.maxCapacity) || 500,
      registrationFee: Number(eventData.registrationFee) || 0,
      description: eventData.description || 'Chanakya University Campus Event',
      highlights: eventData.highlights || ['Campus Conclave', 'Interactive Sessions', 'Certification'],
      schedule: eventData.schedule || [
        { time: '10:00 AM', session: 'Opening Remarks & Inauguration', speaker: 'Event Chair', location: eventData.venueName || 'Main Hall' },
        { time: '02:00 PM', session: 'Main Showcase & Presentations', speaker: 'Keynote Panel', location: eventData.venueName || 'Main Hall' }
      ],
      speakers: eventData.speakers || [
        { name: 'Dr. Faculty Lead', title: 'Session Chairperson', org: 'Chanakya University', avatar: '👨‍🏫' }
      ],
      tags: eventData.tags || ['Campus Event', 'Chanakya 2026'],
      approvalTrail: [
        {
          stage: 'Club / Student Submission',
          actor: eventData.organizer || 'Event Lead',
          status: 'Submitted',
          timestamp: new Date().toISOString(),
          notes: eventData.submissionNotes || 'Initial event proposal submitted for approval.'
        }
      ]
    };

    this.events.unshift(newEvent);
    this.campusStats.totalEvents = this.events.length;

    this.emit('event_created', newEvent);
    this.addNotification({
      type: 'event_submitted',
      title: 'New Event Proposal: ' + newEvent.title,
      message: 'Organized by ' + newEvent.organizer + ' - Pending review.',
      priority: 'medium',
      targetRoles: ['faculty', 'admin'],
      actionLink: '#events'
    });

    return newEvent;
  }

  updateEventApproval(id, stage, action, actor, notes) {
    const event = this.getEventById(id);
    if (!event) return null;

    let newStatus = event.status;
    let trailAction = action.toUpperCase();

    if (action === 'approve') {
      if (stage === 'faculty_review' || stage === 'faculty') {
        newStatus = 'pending_dean';
        trailAction = 'Recommended by Faculty';
      } else if (stage === 'dean_approval' || stage === 'admin_sanction' || stage === 'admin') {
        newStatus = 'approved';
        trailAction = 'Sanctioned & Approved';
      } else {
        newStatus = 'approved';
      }
    } else if (action === 'reject') {
      newStatus = 'rejected';
      trailAction = 'Proposal Rejected';
    } else if (action === 'request_changes') {
      newStatus = 'changes_requested';
      trailAction = 'Clarifications Requested';
    }

    event.status = newStatus;
    event.approvalTrail.push({
      stage: stage.replace(/_/g, ' ').toUpperCase(),
      actor: actor || 'Approving Authority',
      status: trailAction,
      timestamp: new Date().toISOString(),
      notes: notes || 'Action taken by ' + actor
    });

    this.emit('event_approval_updated', { event, action, actor, notes });

    this.addNotification({
      type: 'event_' + action,
      title: 'Event Update: ' + event.shortTitle,
      message: trailAction + ' by ' + actor + '. Status: ' + newStatus,
      priority: action === 'approve' ? 'high' : 'medium',
      targetRoles: ['all'],
      actionLink: '#events'
    });

    return event;
  }

  registerForEvent(eventId, userData) {
    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.registeredCount >= event.maxCapacity) throw new Error('Event is at full capacity');

    const regId = 'REG-' + (1000 + this.registrations.length + 1);
    const regRecord = {
      id: regId,
      eventId: event.id,
      eventTitle: event.title,
      userName: userData.userName || 'Student Attendee',
      userEmail: userData.userEmail || 'student@chanakyauniversity.edu.in',
      userRole: userData.userRole || 'student',
      userDept: userData.userDept || 'School of Engineering',
      ticketType: userData.ticketType || 'Standard Entry Pass',
      seatNumber: 'ROW-' + String.fromCharCode(65 + Math.floor(Math.random() * 8)) + (Math.floor(Math.random() * 40) + 1),
      qrCode: 'CU-' + event.id.replace('EVT-2026-', 'E') + '-' + regId,
      registeredAt: new Date().toISOString(),
      checkedIn: false
    };

    event.registeredCount += 1;
    this.campusStats.totalRegistrations += 1;
    this.registrations.push(regRecord);

    this.emit('registration_created', { event, regRecord });

    return regRecord;
  }

  getRegistrationsByEvent(eventId) {
    return this.registrations.filter(r => r.eventId === eventId);
  }

  getUserRegistrations(email) {
    if (!email) return this.registrations;
    return this.registrations.filter(r => r.userEmail.toLowerCase() === email.toLowerCase());
  }

  // Facilities
  getAllFacilities() {
    return this.facilities;
  }

  bookFacilitySlot(facId, bookingData) {
    const fac = this.facilities.find(f => f.id === facId);
    if (!fac) throw new Error('Facility not found');

    const newBooking = {
      date: bookingData.date || 'Today',
      slot: bookingData.slot || 'Custom Slot',
      event: bookingData.eventName || 'Campus Session',
      status: 'Reserved',
      bookedBy: bookingData.bookedBy || 'Faculty Member',
      createdAt: new Date().toISOString()
    };

    fac.upcomingSlots.unshift(newBooking);
    this.emit('facility_booked', { fac, newBooking });

    this.addNotification({
      type: 'facility_reserved',
      title: 'Facility Slot Reserved: ' + fac.name,
      message: 'Booked by ' + newBooking.bookedBy + ' (' + newBooking.slot + ')',
      priority: 'low',
      targetRoles: ['staff', 'faculty', 'admin'],
      actionLink: '#facilities'
    });

    return fac;
  }

  // Food & Sports
  getAllFoodOutlets() {
    return this.foodOutlets;
  }

  getAllSportsCourts() {
    return this.sportsCourts;
  }

  bookSportsSlot(courtId, slotTime, userName) {
    const court = this.sportsCourts.find(c => c.id === courtId);
    if (!court) throw new Error('Sports court not found');
    const slot = court.slots.find(s => s.time === slotTime);
    if (!slot) throw new Error('Slot time not found');
    if (slot.status !== 'Available') throw new Error('Slot already booked or reserved');

    slot.status = 'Booked (' + userName + ')';
    this.emit('sports_slot_booked', { court, slotTime, userName });

    return court;
  }

  // Issue Management
  getAllIssues(filter = 'all') {
    if (filter === 'all') return this.issues;
    return this.issues.filter(i => i.status.toLowerCase() === filter.toLowerCase());
  }

  reportIssue(issueData) {
    const issueId = 'ISS-2026-' + (100 + this.issues.length + 1);
    const newIssue = {
      id: issueId,
      title: issueData.title,
      category: issueData.category || 'General Campus Maintenance',
      aiCategoryConfidence: issueData.aiCategoryConfidence || 0.94,
      aiSeverity: issueData.aiSeverity || 'Medium',
      location: issueData.location || 'Chanakya Campus Central',
      buildingId: issueData.buildingId || 'admin_block',
      reportedBy: issueData.reportedBy || 'Campus User',
      reportedAt: new Date().toISOString(),
      status: 'Reported',
      assignedTo: issueData.assignedTo || 'Campus Operations Dispatch',
      description: issueData.description || '',
      aiActionSuggestion: issueData.aiActionSuggestion || 'Inspect asset and test electrical/mechanical connections.',
      history: [
        { status: 'Reported', timestamp: new Date().toISOString(), notes: 'Logged by ' + (issueData.reportedBy || 'Campus User') }
      ]
    };

    this.issues.unshift(newIssue);
    this.campusStats.openIssues = this.issues.filter(i => i.status !== 'Resolved').length;

    this.emit('issue_reported', newIssue);
    this.addNotification({
      type: 'issue_alert',
      title: 'Issue Alert: ' + newIssue.title,
      message: 'Location: ' + newIssue.location + ' [' + newIssue.aiSeverity + ' Severity]',
      priority: newIssue.aiSeverity === 'High' ? 'high' : 'medium',
      targetRoles: ['staff', 'admin'],
      actionLink: '#issues'
    });

    return newIssue;
  }

  updateIssueStatus(id, status, assignedTo, notes) {
    const issue = this.issues.find(i => i.id === id);
    if (!issue) return null;
    if (status) issue.status = status;
    if (assignedTo) issue.assignedTo = assignedTo;
    issue.history.push({
      status: status || issue.status,
      timestamp: new Date().toISOString(),
      notes: notes || ('Status updated to ' + status)
    });

    this.campusStats.openIssues = this.issues.filter(i => i.status !== 'Resolved').length;
    this.emit('issue_updated', issue);
    return issue;
  }

  // Notifications
  getAllNotifications(role = 'all') {
    if (role === 'all') return this.notifications;
    return this.notifications.filter(n => n.targetRoles.includes('all') || n.targetRoles.includes(role));
  }

  addNotification(notifData) {
    const notif = {
      id: 'NOTIF-' + String(this.notifications.length + 1).padStart(3, '0'),
      time: 'Just now',
      timestamp: new Date().toISOString(),
      priority: notifData.priority || 'medium',
      targetRoles: notifData.targetRoles || ['all'],
      actionLink: notifData.actionLink || '#',
      ...notifData
    };
    this.notifications.unshift(notif);
    this.emit('notification_broadcast', notif);
    return notif;
  }

  // Simulations
  getAllSimulations() {
    return this.simulations;
  }

  runSimulation(scenarioId) {
    const sim = this.simulations.find(s => s.id === scenarioId);
    if (!sim) throw new Error('Simulation scenario not found');

    const runResult = {
      simulationId: sim.id,
      title: sim.title,
      executedAt: new Date().toISOString(),
      parameters: sim.parameters,
      results: sim.results,
      status: 'Completed',
      telemetryAlerts: [
        'Gate throughput throttled to 180 p/m',
        'Auditorium foyer reached 92% density',
        'Food Court queue threshold exceeded (>30 mins)'
      ]
    };

    this.emit('simulation_executed', runResult);
    return runResult;
  }

  // Live Telemetry / Data Feeder
  feedTelemetry(telemetryData) {
    const payload = {
      timestamp: new Date().toISOString(),
      crowdDensityDelta: telemetryData.crowdDensityDelta || 0,
      activeCampusPopulation: (this.campusStats.activeCampusPopulation += (telemetryData.crowdDensityDelta || 0)),
      syntheticCheckins: telemetryData.syntheticCheckins || 0,
      emergencyAlert: telemetryData.emergencyAlert || null
    };

    if (telemetryData.syntheticCheckins) {
      this.campusStats.totalRegistrations += telemetryData.syntheticCheckins;
    }

    if (telemetryData.emergencyAlert) {
      this.addNotification({
        type: 'emergency',
        title: 'EMERGENCY BROADCAST: ' + telemetryData.emergencyAlert.title,
        message: telemetryData.emergencyAlert.message,
        priority: 'high',
        targetRoles: ['all'],
        actionLink: '#map'
      });
    }

    this.emit('telemetry_tick', payload);
    return payload;
  }
}

const store = new CampusDataStore();
module.exports = store;