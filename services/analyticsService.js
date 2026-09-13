const store = require('../data/store');

class AnalyticsService {
  getDashboardMetrics() {
    const allEvents = store.getAllEvents();
    const approvedEvents = allEvents.filter(e => e.status === 'approved');
    const pendingEvents = allEvents.filter(e => e.status.startsWith('pending') || e.status === 'changes_requested');
    const openIssues = store.issues.filter(i => i.status !== 'Resolved');

    return {
      stats: {
        totalEvents: allEvents.length,
        approvedEvents: approvedEvents.length,
        pendingApprovals: pendingEvents.length,
        totalRegistrations: store.registrations.length + 7360,
        activeCampusPopulation: store.campusStats.activeCampusPopulation,
        openIssuesCount: openIssues.length,
        facilityOccupancyPct: 72,
        activeSensors: 48,
        aiGuideQueries: 1420 + Math.floor(Math.random() * 20)
      },
      venueUtilization: [
        { venue: "Grand Auditorium", utilizationPct: 88, eventsHosted: 14, currentStatus: "Occupied" },
        { venue: "Kalam Tech Park Labs", utilizationPct: 79, eventsHosted: 22, currentStatus: "Active" },
        { venue: "Sports Complex", utilizationPct: 65, eventsHosted: 9, currentStatus: "Open" },
        { venue: "Arya Convention Hall", utilizationPct: 52, eventsHosted: 8, currentStatus: "Available" },
        { venue: "Central Library", utilizationPct: 40, eventsHosted: 11, currentStatus: "Open" },
        { venue: "Annapurna Food Court", utilizationPct: 92, eventsHosted: 0, currentStatus: "Peak Rush" }
      ],
      hourlyFootfallTrend: [
        { hour: "08:00 AM", footfall: 1100 },
        { hour: "10:00 AM", footfall: 3400 },
        { hour: "12:00 PM", footfall: 4280 },
        { hour: "02:00 PM", footfall: 3800 },
        { hour: "04:00 PM", footfall: 3100 },
        { hour: "06:00 PM", footfall: 2600 },
        { hour: "08:00 PM", footfall: 1400 }
      ],
      categoryDistribution: [
        { category: "Technical & AI", count: 4 },
        { category: "Cultural & Arts", count: 2 },
        { category: "Sports & Athletics", count: 1 },
        { category: "Leadership & Conclaves", count: 2 },
        { category: "Social & NSS", count: 1 }
      ]
    };
  }
}

module.exports = new AnalyticsService();