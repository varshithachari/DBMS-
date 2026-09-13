const store = require('../data/store');
const campusConfig = require('../config/campusConfig');

class AIService {
  constructor() {
    this.knowledgeBase = this.buildKnowledgeBase();
    this.customKnowledge = [
      {
        id: "doc-1",
        title: "Campus Orientation Guide 2026",
        category: "Orientation",
        content: "Chanakya University welcomes the 2026 cohort. Central Library is open 7 AM - 11 PM. Wi-Fi network 'Chanakya-Student' uses student roll number login. Emergency medical center is at Sushruta Block next to Gate 1.",
        addedAt: new Date().toISOString()
      },
      {
        id: "doc-2",
        title: "Devanahalli Campus Bus Timings",
        category: "Transport",
        content: "Campus shuttle buses run every 15 minutes between Rayasandra Bus Stop, Channahalli, and Chanakya East Gate 2.",
        addedAt: new Date().toISOString()
      }
    ];
  }

  feedKnowledge(item) {
    const doc = {
      id: "doc-" + (this.customKnowledge.length + 1),
      title: item.title || "Custom Feed Item #" + (this.customKnowledge.length + 1),
      category: item.category || "General Knowledge",
      content: item.content || item.text || JSON.stringify(item),
      addedAt: new Date().toISOString()
    };
    this.customKnowledge.unshift(doc);
    return doc;
  }

  getCustomKnowledge() {
    return this.customKnowledge;
  }

  buildKnowledgeBase() {
    return {
      university: campusConfig.university,
      landmarks: campusConfig.landmarks,
      roles: campusConfig.roles
    };
  }

  async answerCampusQuery(userQuery, userRole = "student", conversationHistory = []) {
    if (!userQuery || userQuery.trim() === "") {
      return {
        answer: "Hello! I am your Chanakya University AI Campus Guide. How can I assist you with events, campus navigation, facilities, or dining today?",
        suggestedActions: ["What events are happening this week?", "How do I register for TechSangam 2026?", "Show me route to Central Library", "What is today's menu at Annapurna Food Court?"]
      };
    }

    const q = userQuery.toLowerCase();
    const events = store.getAllEvents();
    const facilities = store.getAllFacilities();
    const foodOutlets = store.getAllFoodOutlets();
    const sportsCourts = store.getAllSportsCourts();

    let answer = "";
    let actions = [];
    let relatedEvent = null;
    let relatedLocation = null;

    // Check user-fed custom knowledge base first with stop words filtered
    const stopWords = new Set(["about", "what", "where", "tell", "when", "show", "have", "with", "from", "that", "this", "there", "their", "will", "would", "could", "should", "2026", "please", "chanakya", "campus", "university"]);
    const words = q.split(/[^a-z0-9]+/).filter(w => w.length > 3 && !stopWords.has(w));
    const matchedCustom = words.length > 0 ? this.customKnowledge.find(doc => {
      const docText = (doc.title + " " + doc.content).toLowerCase();
      return words.some(w => docText.includes(w));
    }) : null;

    if (matchedCustom) {
      return {
        answer: `🧠 **From Fed Campus Knowledge Base [${matchedCustom.title}]:**\n\n${matchedCustom.content}`,
        suggestedActions: ["Ask another question", "Feed more knowledge", "Show on campus map"],
        source: "custom_knowledge",
        documentId: matchedCustom.id
      };
    }

    // 1. TechSangam or AI Fest query
    if (q.includes("techsangam") || q.includes("hackathon") || q.includes("robotics") || q.includes("bytecraft") || q.includes("drone")) {
      const tsEvent = events.find(e => e.id === "EVT-2026-001");
      relatedEvent = tsEvent;
      answer = "✨ **Chanakya TechSangam 2026** is our flagship 3-day National AI & Robotics Fest scheduled for **Sept 15-17, 2026** at the Chanakya Grand Auditorium & Kalam Tech Park.\n\n" +
        "• **ByteCraft 48-Hour AI Hackathon**: Kicking off Day 1 at 11:30 AM in Kalam Tech Park Bay 1 (₹5,00,000 Prize Pool).\n" +
        "• **Robowars & Drone Racing**: Taking place at the Sports Arena and Central Track.\n" +
        "• **Keynote Speakers**: Dr. Ananya Murthy (DeepMind AI Labs) & Vikramaditya Rao (Garuda Aerospace).\n\n" +
        "You can register directly through the Event Hub to generate your digital QR pass!";
      actions = ["Register for TechSangam", "View Hackathon Schedule", "Directions to Grand Auditorium"];
    }
    // 2. Cultural Fest / Ananda Dhwani
    else if (q.includes("ananda dhwani") || q.includes("cultural") || q.includes("music") || q.includes("dance") || q.includes("concert") || q.includes("pro night")) {
      const culEvent = events.find(e => e.id === "EVT-2026-002");
      relatedEvent = culEvent;
      answer = "🎭 **Ananda Dhwani 2026** is Chanakya University's Annual Cultural Fiesta taking place from **Oct 2-4, 2026**.\n\n" +
        "• **Day 1**: Classical Dance & Carnatic Symphony (Grand Auditorium)\n" +
        "• **Day 2**: Inter-University Battle of the Bands (Open Air Amphitheatre)\n" +
        "• **Day 3**: Celebrity Pro-Night & DJ Concert featuring Rahul Deshmukh!\n\n" +
        "Food trucks will be active at the Annapurna Pavilion throughout all 3 nights.";
      actions = ["View Cultural Schedule", "Book Free Pass", "Directions to Amphitheatre"];
    }
    // 3. Sports Cup / CPL
    else if (q.includes("sports") || q.includes("cpl") || q.includes("cricket") || q.includes("badminton") || q.includes("basketball") || q.includes("futsal")) {
      answer = "🏆 **Chanakya Premier League (CPL) 2026** runs from **Sept 22-26, 2026** at the Chanakya Olympic Sports Arena.\n\n" +
        "• **Facilities**: Floodlit cricket stadium, BWF wooden badminton courts (Courts 1-4), and outdoor basketball arena.\n" +
        "• **Student Booking**: Badminton courts can be booked for 1-hour leisure slots between 04:00 PM - 08:00 PM via the Food & Sports tab.\n" +
        "• **Upcoming Finals**: Floodlit T20 Cricket Final under 800 Lux stadium lights on Sept 26 evening.";
      actions = ["Book Badminton Court", "View Sports Schedule", "Navigate to Sports Complex"];
    }
    // 4. Food / Canteen / Menu
    else if (q.includes("food") || q.includes("canteen") || q.includes("lunch") || q.includes("breakfast") || q.includes("menu") || q.includes("coffee") || q.includes("annapurna")) {
      answer = "🍽️ **Dining at Chanakya University**:\n\n" +
        "1. **Annapurna Central Dining Pavilion** (07:30 AM - 10:30 PM):\n" +
        "   - Mysore Masala Dosa (Ghee Podi): ₹65\n" +
        "   - Chanakya Deluxe Thali (Paneer Butter, Dal Tadka, Phulkas, Rice, Dessert): ₹120\n" +
        "   - Chikmagalur Degree Filter Coffee: ₹20\n" +
        "   - *Current Crowd Wait Time*: ~12 mins (Moderate)\n\n" +
        "2. **Kalam Tech Byte Cafe** (08:30 AM - 11:30 PM):\n" +
        "   - Grilled Paninis, Espresso, Cold Brew & Fresh Juices. Wait time: ~5 mins.";
      actions = ["View Full Menu", "Simulate Mobile Pre-Order", "Directions to Food Pavilion"];
    }
    // 5. Library / Study / Research
    else if (q.includes("library") || q.includes("books") || q.includes("study") || q.includes("research") || q.includes("journal")) {
      relatedLocation = "central_library";
      answer = "📚 **Central Chanakya Digital Library & Knowledge Hub**:\n\n" +
        "• **Operating Hours**: 07:00 AM - 11:00 PM (24/7 during Mid-term and End-term examinations).\n" +
        "• **Capacity & Resources**: 400,000+ volumes, 50,000+ IEEE & Scopus digital journals, and 60 silent research carrels.\n" +
        "• **Facilities**: Sir MV Conference Video Suite on Floor 2 and High-Speed Wi-Fi 6 pods.";
      actions = ["Directions to Library", "Check Available Study Slots", "Search Catalog"];
    }
    // 6. Navigation / Map / Directions
    else if (q.includes("where is") || q.includes("how to reach") || q.includes("direction") || q.includes("route") || q.includes("navigate") || q.includes("map")) {
      answer = "🗺️ **Chanakya Campus Navigation Assistant**:\n\n" +
        "Our 116-acre green campus features multi-modal paths for pedestrians, bicycles, electric shuttles, and accessible wheelchair ramps.\n\n" +
        "• **Main Entry Points**: Gate 1 (Primary South Arch) & East Gate 2 (Bus Fleet & Sports Arena).\n" +
        "• **Campus Shuttle Buggies**: Run every 6 minutes looping Gate 1 ⇄ Admin Block ⇄ Kalam Tech Park ⇄ Sports Arena.\n\n" +
        "Open the **Interactive Campus Map** tab to calculate real-time shortest routes with turn-by-turn steps.";
      actions = ["Open Interactive Map", "Calculate Shortest Route", "Campus Shuttle Timings"];
    }
    // 7. Emergency / Medical / Security
    else if (q.includes("emergency") || q.includes("doctor") || q.includes("ambulance") || q.includes("hospital") || q.includes("security") || q.includes("helpline") || q.includes("blood")) {
      answer = "🚨 **Chanakya University Emergency & Healthcare Hotlines**:\n\n" +
        "• **Sushruta 24/7 Medical Center**: +91 80 2999 4555 (Resident Doctor & ICU Ambulance Bay)\n" +
        "• **Campus Security Control Room**: +91 80 2999 4599 (Main Gate 1 Checkpoint)\n" +
        "• **Student Counseling & Grievance Cell**: +91 80 2999 4500\n\n" +
        "🩸 *Note*: The Annual NSS Voluntary Blood Donation Camp is scheduled for **Sept 8, 2026** at the Medical Center Lobby!";
      actions = ["Call Medical Center", "Evacuation Route Map", "NSS Blood Donation Info"];
    }
    // 8. Event Approval / Dean / Administration
    else if (q.includes("approval") || q.includes("approve") || q.includes("submit event") || q.includes("proposal") || q.includes("dean")) {
      answer = "📋 **Event Lifecycle & Multi-Stage Approval Workflow**:\n\n" +
        "1. **Stage 1 (Submission)**: Club Secretary or Faculty submits proposal with expected footfall, schedule, and venue requirement.\n" +
        "2. **Stage 2 (Faculty Advisor Review)**: Faculty Coordinator reviews budget, safety compliance, and academic calendar fit.\n" +
        "3. **Stage 3 (Dean / Admin Sanction)**: Dean grants final sanction, booking the auditorium and enabling broadcast.\n\n" +
        "Switch to the **Administrator** or **Faculty** role in the top-right header to review pending approval queues!";
      actions = ["Propose New Event", "View Pending Approvals", "Event Policy Guidelines"];
    }
    // 9. What-If Simulation
    else if (q.includes("simulation") || q.includes("what if") || q.includes("crowd surge") || q.includes("gate closure")) {
      answer = "🧪 **Campus Intelligence What-If Simulation Engine**:\n\n" +
        "Simulate operational campus scenarios in real-time:\n" +
        "• **Scenario 1**: 5,000 attendee surge during TechSangam (analyzes parking stress, queue delays, and overflow recommendations).\n" +
        "• **Scenario 2**: Gate 1 closure rerouting to Gate 2 (dynamically recalculates campus graph pathways).\n" +
        "• **Scenario 3**: Monsoon rain shifting open amphitheatre to Arya Convention Hall.\n\n" +
        "Navigate to the **Simulation Sandbox** tab to test scenarios!";
      actions = ["Open Simulation Sandbox", "Run 5K Surge Test", "Simulate Live Telemetry"];
    }
    // Generic fallback
    else {
      answer = "I found multiple matching resources across Chanakya University for *\"" + userQuery + "\"*:\n\n" +
        "• **Active Events**: Chanakya TechSangam 2026, Ananda Dhwani Cultural Fest, CPL Sports Tournament.\n" +
        "• **Key Facilities**: Grand Auditorium (1,200 seats), Kalam Tech Park AI Labs, Central Digital Library, Annapurna Food Court.\n" +
        "• **Assistance**: Ask me about event schedules, tickets, campus directions, mess menus, sports court slots, or administrative approvals.";
      actions = ["View All Events", "Campus Map Navigator", "Book Sports Court", "Ask FAQ"];
    }

    return {
      query: userQuery,
      role: userRole,
      answer,
      suggestedActions: actions,
      relatedEvent,
      relatedLocation,
      timestamp: new Date().toISOString()
    };
  }

  getRecommendationsForUser(role = "student", interests = []) {
    const allEvents = store.getAllEvents().filter(e => e.status === "approved");
    
    if (role === "student" || role === "new_student") {
      return allEvents.slice(0, 3).map(e => ({
        ...e,
        recommendationScore: 98,
        matchReason: "High relevance for STEM & Student Cultural Community"
      }));
    } else if (role === "faculty") {
      return allEvents.filter(e => e.category.includes("Tech") || e.category.includes("Conclave") || e.category.includes("Research")).map(e => ({
        ...e,
        recommendationScore: 95,
        matchReason: "Academic research & faculty leadership alignment"
      }));
    } else {
      return allEvents.slice(0, 3).map(e => ({
        ...e,
        recommendationScore: 90,
        matchReason: "Popular campus highlight"
      }));
    }
  }
}

module.exports = new AIService();