/**
 * High-Performance Relational Storage Engine for Chanakya Campus Connect & UtsavHub
 * Enforces relational integrity, foreign keys, indexes, pagination, and aggregation.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'chanakya_campus_connect_jwt_secret_2026_xyz';

class RelationalCampusStore {
  constructor() {
    this.schools = [];
    this.departments = [];
    this.mainEvents = [];
    this.subEvents = [];
    this.userProfiles = [];
    this.registrations = [];
    this.teams = [];
    this.teamMembers = [];
    this.attendanceRecords = [];
    this.competitionResults = [];
    this.pointTransactions = [];
    this.certificates = [];
    this.announcements = [];

    // Indices for O(1) and O(log n) lookups
    this.indexUserProfileEmail = new Map();
    this.indexRegistrationsCode = new Map();
    this.indexUserSubEventReg = new Set(); // Prevent duplicate registrations: "subEventId:participantId"

    this.nextProfileId = 7; // Auto-incrementing primary key counter
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.seedBaseUtsavHubData();
    this.generateScalabilityDataset(100);
    this.isInitialized = true;
  }

  // ==========================================
  // BASE UTSAVHUB & CHANAKYA HIERARCHY SEEDING
  // ==========================================
  seedBaseUtsavHubData() {
    // 1. Schools (6 schools from UtsavHub & Chanakya University)
    this.schools = [
      {
        school_id: 1,
        name: "School of Arts Humanities and Social Sciences",
        school_name: "School of Arts Humanities and Social Sciences",
        code: "SAHSS",
        description: "Cultural Heritage, Public Discourse, Philosophy & Interdisciplinary Arts",
        dean_name: "Dr. Meenakshi Sundaram",
        banner_color: "#EC4899",
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        school_id: 2,
        name: "School of Management Sciences",
        school_name: "School of Management Sciences",
        code: "SMS",
        description: "Transformative Leadership, Venture Incubation & Global Enterprise Strategy",
        dean_name: "Dr. Arvind Subramanian",
        banner_color: "#F59E0B",
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        school_id: 3,
        name: "School of Mathematics and Natural Sciences",
        school_name: "School of Mathematics and Natural Sciences",
        code: "SMNS",
        description: "Pure & Applied Mathematics, Physical Sciences, Bioscience & Genomics",
        dean_name: "Dr. Rajeshwar Rao",
        banner_color: "#10B981",
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        school_id: 4,
        name: "School of Law Governance and Public Policy",
        school_name: "School of Law Governance and Public Policy",
        code: "SLGPP",
        description: "Constitutional Law, Jurisprudence, Civic Innovation & Public Policy",
        dean_name: "Justice (Retd.) K. V. Sharma",
        banner_color: "#8B5CF6",
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        school_id: 5,
        name: "School of Biosciences",
        school_name: "School of Biosciences",
        code: "SBIO",
        description: "Bioengineering, Molecular Genetics, Microbial Systems & Biotechnology",
        dean_name: "Dr. Suniti Solomon",
        banner_color: "#06B6D4",
        created_at: new Date('2026-01-01').toISOString()
      },
      {
        school_id: 6,
        name: "School of Engineering",
        school_name: "School of Engineering",
        code: "SOE",
        description: "Pioneering Computing, Artificial Intelligence, Robotics, and Advanced Systems Engineering",
        dean_name: "Prof. C. N. Ramanathan",
        banner_color: "#4F46E5",
        created_at: new Date('2026-01-01').toISOString()
      }
    ];

    // 2. Departments
    this.departments = [
      // School 1: Arts Humanities
      { department_id: 1, school_id: 1, name: "BA Economics", code: "ECON" },
      { department_id: 2, school_id: 1, name: "BA Political Science", code: "POL" },
      { department_id: 3, school_id: 1, name: "Literature & Theatre Arts", code: "LIT" },
      { department_id: 4, school_id: 1, name: "Media, Film & Journalism", code: "MEDIA" },
      // School 2: Management
      { department_id: 5, school_id: 2, name: "Bachelor of Business Admin (BBA)", code: "BBA" },
      { department_id: 6, school_id: 2, name: "Master of Business Admin (MBA)", code: "MBA" },
      { department_id: 7, school_id: 2, name: "Finance & Venture Incubation", code: "FIN" },
      // School 3: Mathematics & Natural Sciences
      { department_id: 8, school_id: 3, name: "BSc Physics & Applied Optics", code: "PHY" },
      { department_id: 9, school_id: 3, name: "MSc Data Science & Analytics", code: "DATA" },
      { department_id: 10, school_id: 3, name: "Pure & Applied Mathematics", code: "MATH" },
      // School 4: Law & Governance
      { department_id: 11, school_id: 4, name: "Integrated BA LLB", code: "BALLB" },
      { department_id: 12, school_id: 4, name: "Cyber Law & Corporate Governance", code: "LAW" },
      { department_id: 13, school_id: 4, name: "Public Policy & Administration", code: "PUB" },
      // School 5: Biosciences
      { department_id: 14, school_id: 5, name: "Bioengineering & Biomedical Tech", code: "BIOENG" },
      { department_id: 15, school_id: 5, name: "Molecular Biosciences & Biotech", code: "MOLBIO" },
      // School 6: Engineering
      { department_id: 16, school_id: 6, name: "BTech Computer Science & Eng (CSE)", code: "CSE" },
      { department_id: 17, school_id: 6, name: "BTech Artificial Intelligence (AI)", code: "BTECH_AI" },
      { department_id: 18, school_id: 6, name: "BTech Mechanical & Automation", code: "MECH" },
      { department_id: 19, school_id: 6, name: "Robotics & Embedded Systems", code: "ROBOT" }
    ];

    // 3. Main Events / Fests (Authentic UtsavHub Fests)
    this.mainEvents = [
      {
        main_event_id: 1,
        school_id: 6,
        department_id: 16,
        name: "Samyuti",
        short_name: "Samyuti",
        category: "Technical",
        description: "Annual Technical & Cultural Fest with hackathons, game jams, robotics, and literary arts.",
        venue_name: "Global Campus & Innovation Lab",
        start_date: "2026-03-28T09:00:00Z",
        end_date: "2026-03-30T18:00:00Z",
        status: "approved",
        banner_image: "/assets/images/chanakya_campus.png",
        featured: true,
        max_capacity: 4000
      },
      {
        main_event_id: 2,
        school_id: 1,
        department_id: 3,
        name: "OJAS",
        short_name: "OJAS",
        category: "Cultural",
        description: "Intra University Cultural, Music, Dance, Literary and Arts Conclave.",
        venue_name: "Preksha Auditorium & Quadrangle",
        start_date: "2026-04-20T09:00:00Z",
        end_date: "2026-04-22T21:00:00Z",
        status: "approved",
        banner_image: "/assets/images/chanakya_campus.png",
        featured: true,
        max_capacity: 5000
      },
      {
        main_event_id: 3,
        school_id: 6,
        department_id: 18,
        name: "Sports",
        short_name: "Sports",
        category: "Sports",
        description: "Annual Sports Olympiad & Athletic Meet across football, badminton, and basketball.",
        venue_name: "University Sports Arena",
        start_date: "2026-02-15T08:00:00Z",
        end_date: "2026-02-20T18:00:00Z",
        status: "approved",
        banner_image: "/assets/images/chanakya_campus.png",
        featured: false,
        max_capacity: 3500
      },
      {
        main_event_id: 4,
        school_id: 6,
        department_id: 17,
        name: "Workshops",
        short_name: "Workshops",
        category: "Technical",
        description: "Hands-on Skill Development Workshops in AI, Robotics, CAD Design, and Cybersecurity.",
        venue_name: "Innovation Labs & Seminar Halls",
        start_date: "2026-05-01T10:00:00Z",
        end_date: "2026-05-05T17:00:00Z",
        status: "approved",
        banner_image: "/assets/images/chanakya_campus.png",
        featured: false,
        max_capacity: 2000
      },
      {
        main_event_id: 5,
        school_id: 6,
        department_id: 16,
        name: "Srujana Tech Fest",
        short_name: "Srujana",
        category: "Technical",
        description: "Celebrating Creation, Fueling Innovation with coding marathons and electronics design.",
        venue_name: "Global Campus Lab",
        start_date: "2025-09-13T10:00:00Z",
        end_date: "2025-09-15T18:00:00Z",
        status: "approved",
        banner_image: "/assets/images/chanakya_campus.png",
        featured: true,
        max_capacity: 3000
      },
      {
        main_event_id: 6,
        school_id: 2,
        department_id: 7,
        name: "Innovation Summit",
        short_name: "Innovation Summit",
        category: "Management",
        description: "Future-focused fest on AI, Robotics, Venture Pitching, and Student Startups.",
        venue_name: "Tech Park Auditorium",
        start_date: "2026-08-10T09:30:00Z",
        end_date: "2026-08-12T18:00:00Z",
        status: "approved",
        banner_image: "/assets/images/chanakya_campus.png",
        featured: true,
        max_capacity: 2500
      },
      {
        main_event_id: 7,
        school_id: 1,
        department_id: 4,
        name: "Cultural Carnival",
        short_name: "Cultural Carnival",
        category: "Cultural",
        description: "Music Night, Drama Competition, Fashion Show Extravaganza.",
        venue_name: "Central Plaza & Open Stage",
        start_date: "2026-11-05T16:00:00Z",
        end_date: "2026-11-07T22:00:00Z",
        status: "approved",
        banner_image: "/assets/images/chanakya_campus.png",
        featured: false,
        max_capacity: 4500
      }
    ];

    // 4. Sub-Events (Authentic UtsavHub Competitions)
    this.subEvents = [
      // Fest 1: Samyuti
      { sub_event_id: 1, main_event_id: 1, name: "IKS Hackathon", category: "Tech", type: "Team", venue: "Innovation Lab", day: "Day 1-2", time: "48 Hours", max_capacity: 300, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 250, is_team_event: true, is_competition: true, rules: "Teams of 2-4 members. Functional prototype demonstration." },
      { sub_event_id: 2, main_event_id: 1, name: "Hardware Hackathon", category: "Tech", type: "Team", venue: "Engineering Workshop", day: "Day 1-2", time: "48 Hours", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 250, is_team_event: true, is_competition: true, rules: "Teams of 2-4 members. Embedded systems & IoT hardware design." },
      { sub_event_id: 3, main_event_id: 1, name: "E-Sports Valorant", category: "Tech", type: "Team", venue: "Gaming Arena", day: "Day 2", time: "6:00-9:00pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 300, is_team_event: true, is_competition: true, rules: "5v5 competitive bracket. Double-elimination knockout." },
      { sub_event_id: 4, main_event_id: 1, name: "Indic Game Jam", category: "Tech", type: "Team", venue: "Computer Lab", day: "Day 2", time: "10:00-4:00pm", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 200, is_team_event: true, is_competition: true, rules: "Build a playable game based on Indian heritage themes in Unity/Godot." },
      { sub_event_id: 5, main_event_id: 1, name: "Vastra Verse", category: "Cultural", type: "Solo", venue: "Auditorium", day: "Day 1", time: "11:00-1:00pm", max_capacity: 400, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 200, is_team_event: false, is_competition: true, rules: "Traditional and creative ethnic couture display." },
      { sub_event_id: 6, main_event_id: 1, name: "Drishti Manthan", category: "Cultural", type: "Team", venue: "Seminar Hall", day: "Day 1", time: "Full Day", max_capacity: 300, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 180, is_team_event: true, is_competition: true, rules: "Inter-disciplinary creative thinking and visual storytelling." },
      { sub_event_id: 7, main_event_id: 1, name: "Smrithi Mandaara", category: "Cultural", type: "Solo", venue: "Auditorium", day: "Day 1", time: "1 Hour", max_capacity: 500, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 200, is_team_event: false, is_competition: true, rules: "Classical literary recitation, poetry recital, and eloquence." },
      { sub_event_id: 8, main_event_id: 1, name: "IKS Quiz", category: "Tech", type: "Team", venue: "Room 202", day: "Day 3", time: "2:00-3:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 150, is_team_event: true, is_competition: true, rules: "Teams of 1-2. Indian Knowledge Systems quiz challenge." },
      { sub_event_id: 9, main_event_id: 1, name: "Treasure Hunt", category: "Tech", type: "Team", venue: "Campus Grounds", day: "Day 3", time: "3:00-5:00pm", max_capacity: 350, registration_fee: 0, registration_deadline: "2026-03-27T23:59:59Z", points_reward: 150, is_team_event: true, is_competition: true, rules: "Teams of 2-4 members. Solve GPS crypto clues across campus." },

      // Fest 2: OJAS
      { sub_event_id: 10, main_event_id: 2, name: "Guess the Personality", category: "Cultural", type: "Team", venue: "Room 101", day: "Day 1", time: "3:00-4:30pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 150, is_team_event: true, is_competition: true },
      { sub_event_id: 11, main_event_id: 2, name: "Classical Vocal Solo", category: "Music", type: "Solo", venue: "Acad 1 Room 101", day: "Day 1", time: "9:30-10:30am", max_capacity: 100, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 200, is_team_event: false, is_competition: true },
      { sub_event_id: 12, main_event_id: 2, name: "Contemporary Group Dance", category: "Dance", type: "Team", venue: "Preksha Auditorium", day: "Day 1", time: "03:30-05:00pm", max_capacity: 400, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 250, is_team_event: true, is_competition: true },
      { sub_event_id: 13, main_event_id: 2, name: "Elocution", category: "Literary", type: "Solo", venue: "Room 101", day: "Day 1", time: "02:00-03:00pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 150, is_team_event: false, is_competition: true },
      { sub_event_id: 14, main_event_id: 2, name: "Reel Making", category: "Media", type: "Team", venue: "Room 101", day: "Day 1", time: "11:30-12:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 180, is_team_event: true, is_competition: true },
      { sub_event_id: 15, main_event_id: 2, name: "Poetry – Kannada", category: "Literary", type: "Solo", venue: "Room 122", day: "Day 1", time: "10:30-11:30am", max_capacity: 120, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 150, is_team_event: false, is_competition: true },
      { sub_event_id: 16, main_event_id: 2, name: "Shark Tank Pitch", category: "Management", type: "Team", venue: "Aryabhata Hall", day: "Day 2", time: "10:00am onwards", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 250, is_team_event: true, is_competition: true },
      { sub_event_id: 17, main_event_id: 2, name: "Light Vocal Solo", category: "Music", type: "Solo", venue: "Room 101", day: "Day 1", time: "9:30 onwards", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 180, is_team_event: false, is_competition: true },
      { sub_event_id: 18, main_event_id: 2, name: "Western Group Song", category: "Music", type: "Team", venue: "Room 101", day: "Day 1", time: "11:30 onwards", max_capacity: 300, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 220, is_team_event: true, is_competition: true },
      { sub_event_id: 19, main_event_id: 2, name: "Poster Making", category: "Arts", type: "Solo", venue: "Room 222", day: "Day 2", time: "10:30-12:30pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 150, is_team_event: false, is_competition: true },
      { sub_event_id: 20, main_event_id: 2, name: "Treasure Hunt - OJAS", category: "Quiz", type: "Team", venue: "Entire Campus", day: "Day 2", time: "9:30-12:30pm", max_capacity: 350, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 160, is_team_event: true, is_competition: true },
      { sub_event_id: 21, main_event_id: 2, name: "Speech – Kannada", category: "Literary", type: "Solo", venue: "Room 101", day: "Day 2", time: "09:30am", max_capacity: 120, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 140, is_team_event: false, is_competition: true },
      { sub_event_id: 22, main_event_id: 2, name: "Mono Acting", category: "Theatre", type: "Solo", venue: "Room 222", day: "Day 2", time: "10:30-11:30am", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 180, is_team_event: false, is_competition: true },
      { sub_event_id: 23, main_event_id: 2, name: "Skit", category: "Theatre", type: "Team", venue: "Auditorium", day: "Day 1", time: "10:30-11:30am", max_capacity: 350, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 200, is_team_event: true, is_competition: true },
      { sub_event_id: 24, main_event_id: 2, name: "Essay – Kannada", category: "Literary", type: "Solo", venue: "Room 401", day: "Day 1", time: "3:00-4:00pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 140, is_team_event: false, is_competition: true },
      { sub_event_id: 25, main_event_id: 2, name: "Poetry – English", category: "Literary", type: "Solo", venue: "Room 401", day: "Day 1", time: "12:00-1:00pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 150, is_team_event: false, is_competition: true },
      { sub_event_id: 26, main_event_id: 2, name: "Short Movie", category: "Media", type: "Team", venue: "Auditorium", day: "Day 1", time: "11:40am-12:40pm", max_capacity: 300, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 220, is_team_event: true, is_competition: true },
      { sub_event_id: 27, main_event_id: 2, name: "Western Vocal Solo", category: "Music", type: "Solo", venue: "Acad 1 Room 101", day: "Day 1", time: "10:30am", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 180, is_team_event: false, is_competition: true },
      { sub_event_id: 28, main_event_id: 2, name: "Western Instrumental Solo", category: "Music", type: "Solo", venue: "Auditorium", day: "Day 2", time: "9:30am", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 180, is_team_event: false, is_competition: true },
      { sub_event_id: 29, main_event_id: 2, name: "Classical Instrumental Solo", category: "Music", type: "Solo", venue: "Auditorium", day: "Day 2", time: "10:30am", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 200, is_team_event: false, is_competition: true },
      { sub_event_id: 30, main_event_id: 2, name: "Painting", category: "Arts", type: "Solo", venue: "Central Plaza", day: "Day 1", time: "4:30pm", max_capacity: 180, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 160, is_team_event: false, is_competition: true },
      { sub_event_id: 31, main_event_id: 2, name: "General Quiz", category: "Quiz", type: "Team", venue: "Room 2B19", day: "Day 1", time: "2:00pm", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 160, is_team_event: true, is_competition: true },
      { sub_event_id: 32, main_event_id: 2, name: "Classical Solo Dance", category: "Dance", type: "Solo", venue: "Auditorium", day: "Day 2", time: "11:30am-12:30pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 220, is_team_event: false, is_competition: true },
      { sub_event_id: 33, main_event_id: 2, name: "Contemporary Solo Dance", category: "Dance", type: "Solo", venue: "Auditorium", day: "Day 1", time: "2:00-3:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 200, is_team_event: false, is_competition: true },
      { sub_event_id: 34, main_event_id: 2, name: "Debate – English", category: "Debate", type: "Solo", venue: "2A01", day: "Day 1", time: "11:30am", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 180, is_team_event: false, is_competition: true },
      { sub_event_id: 35, main_event_id: 2, name: "Folk Song Solo", category: "Music", type: "Solo", venue: "2A02", day: "Day 1", time: "12:30pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 170, is_team_event: false, is_competition: true },
      { sub_event_id: 36, main_event_id: 2, name: "Bhagavad-Gita Chanting", category: "Spiritual", type: "Solo", venue: "Temple", day: "Day 1", time: "4:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 160, is_team_event: false, is_competition: true },
      { sub_event_id: 37, main_event_id: 2, name: "Website & App Development", category: "Tech", type: "Team", venue: "Acad 2 UB6", day: "Day 1", time: "2:30-5:00pm", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 240, is_team_event: true, is_competition: true },
      { sub_event_id: 38, main_event_id: 2, name: "E-Sport Championship", category: "Tech", type: "Team", venue: "2B29", day: "Day 1", time: "11:00-1:30pm", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 250, is_team_event: true, is_competition: true },
      { sub_event_id: 39, main_event_id: 2, name: "Debate – Kannada", category: "Debate", type: "Solo", venue: "2B19", day: "Day 1", time: "2:30-3:30pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 160, is_team_event: false, is_competition: true },
      { sub_event_id: 40, main_event_id: 2, name: "Essay Writing – English", category: "Literary", type: "Solo", venue: "2B19", day: "Day 1", time: "11:00-12:00pm", max_capacity: 150, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 150, is_team_event: false, is_competition: true },
      { sub_event_id: 41, main_event_id: 2, name: "Photography Contest", category: "Photography", type: "Solo", venue: "Front Yard", day: "Day 1", time: "10:00am-5:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-19T23:59:59Z", points_reward: 170, is_team_event: false, is_competition: true },

      // Fest 4: Workshops
      { sub_event_id: 42, main_event_id: 4, name: "AI & Machine Learning Workshop", category: "Tech", type: "Solo", venue: "Computer Lab", day: "Day 1", time: "10:00-4:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-30T23:59:59Z", points_reward: 120, is_team_event: false, is_competition: false },
      { sub_event_id: 43, main_event_id: 4, name: "Robotics Hands-On Workshop", category: "Tech", type: "Team", venue: "Engineering Lab", day: "Day 2", time: "10:00-4:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-30T23:59:59Z", points_reward: 140, is_team_event: true, is_competition: false },
      { sub_event_id: 44, main_event_id: 4, name: "Entrepreneurship Bootcamp", category: "Management", type: "Team", venue: "Seminar Hall", day: "Day 2", time: "2:00-6:00pm", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-04-30T23:59:59Z", points_reward: 130, is_team_event: true, is_competition: false },
      { sub_event_id: 45, main_event_id: 4, name: "Cybersecurity Basics", category: "Tech", type: "Solo", venue: "Computer Lab", day: "Day 3", time: "10:00-1:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-30T23:59:59Z", points_reward: 110, is_team_event: false, is_competition: false },
      { sub_event_id: 46, main_event_id: 4, name: "CAD Design Workshop", category: "Tech", type: "Solo", venue: "Design Studio", day: "Day 3", time: "2:00-5:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-04-30T23:59:59Z", points_reward: 120, is_team_event: false, is_competition: false },

      // Fest 5: Srujana Tech Fest
      { sub_event_id: 47, main_event_id: 5, name: "Hackathon - Srujana", category: "Tech", type: "Team", venue: "Global Campus Lab", day: "Day 1-2", time: "48 Hours", max_capacity: 300, registration_fee: 0, registration_deadline: "2026-08-24T23:59:59Z", points_reward: 250, is_team_event: true, is_competition: true },
      { sub_event_id: 48, main_event_id: 5, name: "Logic Loop", category: "Tech", type: "Solo", venue: "Lab 101", day: "Day 1", time: "2:00-4:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-08-24T23:59:59Z", points_reward: 180, is_team_event: false, is_competition: true },
      { sub_event_id: 49, main_event_id: 5, name: "CAD Clash", category: "Tech", type: "Solo", venue: "CAD Lab", day: "Day 2", time: "10:00-12:00pm", max_capacity: 180, registration_fee: 0, registration_deadline: "2026-08-24T23:59:59Z", points_reward: 190, is_team_event: false, is_competition: true },
      { sub_event_id: 50, main_event_id: 5, name: "Ideathon", category: "Tech", type: "Team", venue: "Seminar Hall", day: "Day 2", time: "3:00-5:00pm", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-08-24T23:59:59Z", points_reward: 200, is_team_event: true, is_competition: true },
      { sub_event_id: 51, main_event_id: 5, name: "Pixel Poetry", category: "Tech", type: "Solo", venue: "Design Studio", day: "Day 1", time: "11:00-3:00pm", max_capacity: 180, registration_fee: 0, registration_deadline: "2026-08-24T23:59:59Z", points_reward: 170, is_team_event: false, is_competition: true },
      { sub_event_id: 52, main_event_id: 5, name: "Syntax Saga", category: "Tech", type: "Solo", venue: "CS Lab", day: "Day 1", time: "9:00-11:00am", max_capacity: 220, registration_fee: 0, registration_deadline: "2026-08-24T23:59:59Z", points_reward: 190, is_team_event: false, is_competition: true },
      { sub_event_id: 53, main_event_id: 5, name: "Prompt to Product", category: "Tech", type: "Team", venue: "Auditorium", day: "Day 3", time: "2:00-6:00pm", max_capacity: 300, registration_fee: 0, registration_deadline: "2026-08-24T23:59:59Z", points_reward: 220, is_team_event: true, is_competition: true },

      // Fest 6: Innovation Summit
      { sub_event_id: 54, main_event_id: 6, name: "AI Startup Pitch", category: "Management", type: "Team", venue: "Auditorium", day: "Day 1", time: "2:00-4:00pm", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-08-09T23:59:59Z", points_reward: 260, is_team_event: true, is_competition: true },
      { sub_event_id: 55, main_event_id: 6, name: "Robotics Challenge", category: "Tech", type: "Team", venue: "Engineering Lab", day: "Day 2", time: "10:00-1:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-08-09T23:59:59Z", points_reward: 250, is_team_event: true, is_competition: true },
      { sub_event_id: 56, main_event_id: 6, name: "Future Tech Quiz", category: "Quiz", type: "Solo", venue: "Room 202", day: "Day 2", time: "3:00-4:00pm", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-08-09T23:59:59Z", points_reward: 150, is_team_event: false, is_competition: true },

      // Fest 7: Cultural Carnival
      { sub_event_id: 57, main_event_id: 7, name: "Fashion Show", category: "Cultural", type: "Team", venue: "Central Plaza", day: "Day 2", time: "6:00-8:00pm", max_capacity: 450, registration_fee: 0, registration_deadline: "2026-11-04T23:59:59Z", points_reward: 280, is_team_event: true, is_competition: true },
      { sub_event_id: 58, main_event_id: 7, name: "Drama Competition", category: "Theatre", type: "Team", venue: "Auditorium", day: "Day 1", time: "3:00-5:00pm", max_capacity: 350, registration_fee: 0, registration_deadline: "2026-11-04T23:59:59Z", points_reward: 220, is_team_event: true, is_competition: true },
      { sub_event_id: 59, main_event_id: 7, name: "Music Night", category: "Music", type: "Team", venue: "Open Stage", day: "Day 2", time: "7:00-10:00pm", max_capacity: 500, registration_fee: 0, registration_deadline: "2026-11-04T23:59:59Z", points_reward: 200, is_team_event: true, is_competition: false },

      // Fest 3: Sports
      { sub_event_id: 60, main_event_id: 3, name: "Inter-Collegiate Football Cup", category: "Sports", type: "Team", venue: "Sports Ground Turf", day: "Day 1-3", time: "08:00 AM", max_capacity: 250, registration_fee: 0, registration_deadline: "2026-02-14T23:59:59Z", points_reward: 300, is_team_event: true, is_competition: true },
      { sub_event_id: 61, main_event_id: 3, name: "Badminton Open Championship", category: "Sports", type: "Solo", venue: "Indoor Sports Arena", day: "Day 2", time: "09:00 AM", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-02-14T23:59:59Z", points_reward: 180, is_team_event: false, is_competition: true },
      { sub_event_id: 62, main_event_id: 3, name: "Basketball League", category: "Sports", type: "Team", venue: "Court 1", day: "Day 1", time: "04:00 PM", max_capacity: 200, registration_fee: 0, registration_deadline: "2026-02-14T23:59:59Z", points_reward: 220, is_team_event: true, is_competition: true }
    ];

    // 5. Participants from Varshitha's UtsavHub data + Login Personas
    const salt = bcrypt.genSaltSync(10);
    const defaultStudentHash = bcrypt.hashSync("student123", salt);

    this.userProfiles = [
      // 10 Participants from Varshitha's Schema
      { profile_id: 1, auth_user_id: uuidv4(), email: "aarav.sharma@chanakya.edu", password_hash: defaultStudentHash, name: "Aarav Sharma", roll_number: "24UG00001", role: "student", participant_type: "internal", school_id: 6, department_id: 16, avatar: "🎓", points: 450, program_type: "UG", year: 2, gender: "M", created_at: new Date().toISOString() },
      { profile_id: 2, auth_user_id: uuidv4(), email: "riya.verma@chanakya.edu", password_hash: defaultStudentHash, name: "Riya Verma", roll_number: "23UG00045", role: "student", participant_type: "internal", school_id: 1, department_id: 1, avatar: "🎨", points: 250, program_type: "UG", year: 3, gender: "F", created_at: new Date().toISOString() },
      { profile_id: 3, auth_user_id: uuidv4(), email: "karthik.reddy@chanakya.edu", password_hash: defaultStudentHash, name: "Karthik Reddy", roll_number: "22UG00078", role: "student", participant_type: "internal", school_id: 6, department_id: 17, avatar: "⚡", points: 300, program_type: "UG", year: 4, gender: "M", created_at: new Date().toISOString() },
      { profile_id: 4, auth_user_id: uuidv4(), email: "sneha.iyer@chanakya.edu", password_hash: defaultStudentHash, name: "Sneha Iyer", roll_number: "24PG00012", role: "student", participant_type: "internal", school_id: 3, department_id: 9, avatar: "🔬", points: 220, program_type: "PG", year: 1, gender: "F", created_at: new Date().toISOString() },
      { profile_id: 5, auth_user_id: uuidv4(), email: "rahul.mehta@chanakya.edu", password_hash: defaultStudentHash, name: "Rahul Mehta", roll_number: "23UG00110", role: "student", participant_type: "internal", school_id: 2, department_id: 5, avatar: "💼", points: 150, program_type: "UG", year: 3, gender: "M", created_at: new Date().toISOString() },
      { profile_id: 6, auth_user_id: uuidv4(), email: "ananya.das@chanakya.edu", password_hash: defaultStudentHash, name: "Ananya Das", roll_number: "24UG00221", role: "student", participant_type: "internal", school_id: 1, department_id: 2, avatar: "📚", points: 180, program_type: "UG", year: 2, gender: "F", created_at: new Date().toISOString() },
      { profile_id: 7, auth_user_id: uuidv4(), email: "aditya.singh@chanakya.edu", password_hash: defaultStudentHash, name: "Aditya Singh", roll_number: "22UG00310", role: "student", participant_type: "internal", school_id: 6, department_id: 18, avatar: "🛠️", points: 280, program_type: "UG", year: 4, gender: "M", created_at: new Date().toISOString() },
      { profile_id: 8, auth_user_id: uuidv4(), email: "priya.nair@chanakya.edu", password_hash: defaultStudentHash, name: "Priya Nair", roll_number: "23PG00009", role: "student", participant_type: "internal", school_id: 5, department_id: 14, avatar: "🧬", points: 190, program_type: "PG", year: 1, gender: "F", created_at: new Date().toISOString() },
      { profile_id: 9, auth_user_id: uuidv4(), email: "vikram.patel@chanakya.edu", password_hash: defaultStudentHash, name: "Vikram Patel", roll_number: "24UG00401", role: "student", participant_type: "internal", school_id: 4, department_id: 11, avatar: "⚖️", points: 140, program_type: "UG", year: 2, gender: "M", created_at: new Date().toISOString() },
      { profile_id: 10, auth_user_id: uuidv4(), email: "megha.jain@chanakya.edu", password_hash: defaultStudentHash, name: "Megha Jain", roll_number: "23UG00234", role: "student", participant_type: "internal", school_id: 3, department_id: 8, avatar: "🔭", points: 160, program_type: "UG", year: 3, gender: "F", created_at: new Date().toISOString() },

      // Standard Login Personas for testing & presentation
      { profile_id: 11, auth_user_id: uuidv4(), email: "student@chanakya.edu", password_hash: bcrypt.hashSync("student123", salt), name: "Rahul Sharma", roll_number: "24UG0101", role: "student", participant_type: "internal", school_id: 6, department_id: 16, avatar: "🎓", points: 450, created_at: new Date().toISOString() },
      { profile_id: 12, auth_user_id: uuidv4(), email: "fresher@chanakya.edu", password_hash: bcrypt.hashSync("fresher123", salt), name: "Ananya Iyer", roll_number: "26UG0340", role: "student", participant_type: "internal", school_id: 1, department_id: 1, avatar: "🧭", points: 120, created_at: new Date().toISOString() },
      { profile_id: 13, auth_user_id: uuidv4(), email: "faculty@chanakya.edu", password_hash: bcrypt.hashSync("faculty123", salt), name: "Dr. S. Radhakrishnan", roll_number: "FAC-082", role: "faculty", participant_type: "internal", school_id: 6, department_id: 16, avatar: "👨‍🏫", points: 0, created_at: new Date().toISOString() },
      { profile_id: 14, auth_user_id: uuidv4(), email: "staff@chanakya.edu", password_hash: bcrypt.hashSync("staff123", salt), name: "Vikram Patil", roll_number: "STF-014", role: "staff", participant_type: "internal", school_id: 6, department_id: 18, avatar: "🛠️", points: 0, created_at: new Date().toISOString() },
      { profile_id: 15, auth_user_id: uuidv4(), email: "admin@chanakya.edu", password_hash: bcrypt.hashSync("admin123", salt), name: "Dean Executive Office", roll_number: "ADM-001", role: "admin", participant_type: "internal", school_id: 6, department_id: 16, avatar: "👑", points: 0, created_at: new Date().toISOString() },
      { profile_id: 16, auth_user_id: uuidv4(), email: "hanmanthraobd@gmail.com", password_hash: bcrypt.hashSync("Admin@123", salt), name: "UtsavHub Lead Administrator", roll_number: "ADMIN001", role: "admin", participant_type: "admin", school_id: 6, department_id: 16, avatar: "👑", points: 0, created_at: new Date().toISOString() }
    ];

    this.nextProfileId = 100;

    // Rebuild index
    this.indexUserProfileEmail.clear();
    for (const u of this.userProfiles) {
      this.indexUserProfileEmail.set(u.email.toLowerCase(), u);
    }

    // 6. Announcements
    this.announcements = [
      {
        id: 1,
        title: "Samyuti Conclave & Hackathons Open!",
        message: "Registrations for IKS Hackathon, Hardware Hackathon, and E-Sports are live.",
        fest_name: "Samyuti",
        priority: "urgent",
        is_active: true,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 2,
        title: "OJAS Cultural Events Roster Published",
        message: "Solo & group entries for Dance, Vocal, Drama, and Poetry are being reviewed.",
        fest_name: "OJAS",
        priority: "normal",
        is_active: true,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];

    // Seed baseline initial registrations
    this.seedInitialRegistrations();
  }

  seedInitialRegistrations() {
    this.registrations = [];
    this.indexRegistrationsCode.clear();
    this.indexUserSubEventReg.clear();
    this.competitionResults = [];
    this.pointTransactions = [];
    this.certificates = [];

    // Teams from Varshitha's UtsavHub data
    this.teams = [
      { team_id: 1, sub_event_id: 1, team_name: "Code Titans" },
      { team_id: 2, sub_event_id: 1, team_name: "AI Innovators" },
      { team_id: 3, sub_event_id: 2, team_name: "Hardware Heroes" },
      { team_id: 4, sub_event_id: 3, team_name: "Valorant Squad" },
      { team_id: 5, sub_event_id: 4, team_name: "Game Creators" },
      { team_id: 6, sub_event_id: 9, team_name: "Campus Hunters" }
    ];

    this.teamMembers = [
      { id: 1, team_id: 1, participant_id: 1 },
      { id: 2, team_id: 1, participant_id: 3 },
      { id: 3, team_id: 2, participant_id: 4 },
      { id: 4, team_id: 2, participant_id: 2 },
      { id: 5, team_id: 3, participant_id: 7 },
      { id: 6, team_id: 4, participant_id: 1 },
      { id: 7, team_id: 4, participant_id: 3 },
      { id: 8, team_id: 4, participant_id: 5 },
      { id: 9, team_id: 4, participant_id: 9 },
      { id: 10, team_id: 4, participant_id: 10 }
    ];

    // Authentic Registrations from Varshitha's Dataset
    this.createRegistrationRecord(1, 1, { ticket_type: "VIP All-Access Pass", team_name: "Code Titans", checked_in: true, registered_at: "2026-03-20T10:00:00.000Z" });
    this.createRegistrationRecord(1, 4, { ticket_type: "Standard Delegate Pass", team_name: "AI Innovators", checked_in: true, registered_at: "2026-03-20T11:00:00.000Z" });
    this.createRegistrationRecord(2, 7, { ticket_type: "Standard Delegate Pass", team_name: "Hardware Heroes", checked_in: true, registered_at: "2026-03-21T09:30:00.000Z" });
    this.createRegistrationRecord(3, 1, { ticket_type: "VIP All-Access Pass", team_name: "Valorant Squad", checked_in: true, registered_at: "2026-03-22T14:00:00.000Z" });
    this.createRegistrationRecord(5, 2, { ticket_type: "Standard Entry Pass", checked_in: true, registered_at: "2026-03-22T15:30:00.000Z" });
    this.createRegistrationRecord(6, 5, { ticket_type: "Standard Delegate Pass", team_name: "Game Creators", checked_in: false, registered_at: "2026-03-23T10:00:00.000Z" });
    this.createRegistrationRecord(7, 6, { ticket_type: "Standard Entry Pass", checked_in: true, registered_at: "2026-03-23T12:00:00.000Z" });
    this.createRegistrationRecord(8, 2, { ticket_type: "Student Conclave Pass", team_name: "AI Innovators", checked_in: true, registered_at: "2026-03-24T09:00:00.000Z" });
    this.createRegistrationRecord(9, 7, { ticket_type: "Standard Delegate Pass", team_name: "Campus Hunters", checked_in: true, registered_at: "2026-03-24T11:00:00.000Z" });

    // Authentic Competition Results from Varshitha's Dataset
    this.publishCompetitionResult(1, 1, 1, "Hackathon Champion (1st Place Gold Medalist)", 250);
    this.publishCompetitionResult(1, 4, 2, "Hackathon Runner-Up (2nd Place Silver Medalist)", 180);
    this.publishCompetitionResult(2, 7, 1, "Hardware Hackathon Winner (1st Place)", 250);
    this.publishCompetitionResult(3, 1, 1, "Valorant E-Sports Champion (1st Place)", 300);
    this.publishCompetitionResult(5, 2, 1, "Vastra Verse Cultural Winner (1st Place)", 200);
    this.publishCompetitionResult(7, 6, 1, "Smrithi Mandaara Literary Winner (1st Place)", 200);
    this.publishCompetitionResult(9, 7, 1, "Campus Treasure Hunt Winner (1st Place)", 150);
  }

  createRegistrationRecord(subEventId, participantId, options = {}) {
    const key = `${subEventId}:${participantId}`;
    if (this.indexUserSubEventReg.has(key)) {
      throw new Error(`Participant is already registered for this sub-event.`);
    }

    const subEvent = this.subEvents.find(s => s.sub_event_id === subEventId);
    if (!subEvent) throw new Error(`Sub-event ${subEventId} not found.`);

    const user = this.userProfiles.find(p => p.profile_id === participantId);
    if (!user) throw new Error(`User profile ${participantId} not found.`);

    // Check capacity
    const currentCount = this.registrations.filter(r => r.sub_event_id === subEventId && r.status !== 'cancelled').length;
    if (currentCount >= subEvent.max_capacity) {
      throw new Error(`Event is at full capacity (${subEvent.max_capacity} attendees).`);
    }

    const regId = this.registrations.length + 1;
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const regCode = `CU-S${String(subEventId).padStart(2, '0')}-P${String(participantId).padStart(4, '0')}-${randomHex}`;
    const rowChar = String.fromCharCode(65 + Math.floor(Math.random() * 8));
    const seatNum = `${rowChar}-${Math.floor(Math.random() * 35) + 1}`;

    const reg = {
      registration_id: regId,
      sub_event_id: subEventId,
      main_event_id: subEvent.main_event_id,
      participant_id: participantId,
      registration_code: regCode,
      pass_code: regCode,
      attendance_status: options.checked_in ? "Attended" : "Registered",
      ticket_type: options.ticket_type || "Standard Delegate Pass",
      seat_number: options.seat_number || seatNum,
      team_name: options.team_name || null,
      team_size: options.team_size || 1,
      status: options.status || "confirmed",
      checked_in: Boolean(options.checked_in),
      checked_in_at: options.checked_in ? new Date().toISOString() : null,
      registered_at: options.registered_at || new Date().toISOString(),
      qr_code: `CHANAKYA-SECURE-${regCode}`
    };

    this.registrations.push(reg);
    this.indexRegistrationsCode.set(regCode, reg);
    this.indexUserSubEventReg.add(key);

    // Save team members if provided
    if (options.team_members && Array.isArray(options.team_members)) {
      for (const m of options.team_members) {
        this.teamMembers.push({
          member_id: this.teamMembers.length + 1,
          registration_id: regId,
          name: m.name,
          email: m.email || '',
          roll_number: m.roll_number || ''
        });
      }
    }

    // Generate digital participation certificate
    this.certificates.push({
      certificate_id: this.certificates.length + 1,
      certificate_code: `CERT-${regCode}`,
      registration_id: regId,
      participant_id: participantId,
      sub_event_id: subEventId,
      type: "participation",
      issued_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    });

    return reg;
  }

  // ==========================================
  // SCALABILITY DATASET GENERATOR (100+ PER SUB-EVENT)
  // ==========================================
  generateScalabilityDataset(registrationsPerSubEvent = 100) {
    console.log(`[Scalability Engine] 🚀 Generating scalability dataset...`);
    console.log(`[Scalability Engine] Sub-events count: ${this.subEvents.length}`);
    const targetRegistrations = this.subEvents.length * registrationsPerSubEvent;
    console.log(`[Scalability Engine] Target registrations: ${targetRegistrations}`);

    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharv", "Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Chiara", "Riya", "Ira", "Myra", "Ahana", "Prisha", "Kavya", "Tanvi", "Avani", "Rohan", "Varshitha", "Vikram", "Sneha", "Kiran", "Naveen", "Pooja", "Gaurav", "Divya", "Siddharth", "Meera", "Karthik", "Deepa", "Manish"];
    const lastNames = ["Sharma", "Verma", "Patel", "Iyer", "Rao", "Nair", "Reddy", "Choudhury", "Gupta", "Menon", "Joshi", "Bhat", "Kulkarni", "Hegde", "Deshmukh", "Singhania", "Mukherjee", "Banerjee", "Chatterjee", "Pillai", "Shetty", "Gowda", "Naidu", "Chari", "Prasad", "Swaminathan"];

    const salt = bcrypt.genSaltSync(8);
    const demoPasswordHash = bcrypt.hashSync("Chanakya@2026", salt);

    // Create synthetic participants pool across all schools & departments
    const syntheticParticipants = [];
    const participantCount = Math.max(targetRegistrations, 1200);

    for (let i = 1; i <= participantCount; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[(i * 3) % lastNames.length];
      const school = this.schools[i % this.schools.length];
      const deptsForSchool = this.departments.filter(d => d.school_id === school.school_id);
      const dept = deptsForSchool[i % deptsForSchool.length];
      const email = `synthetic.student.${i}@chanakya.edu`;

      const participant = {
        profile_id: this.nextProfileId++,
        auth_user_id: uuidv4(),
        email: email,
        password_hash: demoPasswordHash,
        name: `${fn} ${ln}`,
        roll_number: `26UG${String(1000 + i).slice(-4)}`,
        role: "student",
        participant_type: "internal",
        school_id: school.school_id,
        department_id: dept ? dept.department_id : 1,
        avatar: ["🎓", "💡", "🚀", "⚡", "🔬", "🎨"][i % 6],
        points: (i * 17) % 500,
        is_synthetic: true,
        created_at: new Date(Date.now() - (i * 3600000 * 2)).toISOString()
      };

      syntheticParticipants.push(participant);
      this.userProfiles.push(participant);
      this.indexUserProfileEmail.set(email.toLowerCase(), participant);
    }

    // Now populate at least registrationsPerSubEvent per sub-event
    let totalGenerated = 0;
    const ticketTypes = ["VIP All-Access Pass", "Standard Delegate Pass", "Student Conclave Pass", "General Admission"];

    for (const subEvent of this.subEvents) {
      // Allow capacity expansion for the scalability dataset demo
      if (subEvent.max_capacity < registrationsPerSubEvent + 50) {
        subEvent.max_capacity = registrationsPerSubEvent + 100;
      }

      // Pick unique participants for this sub-event
      const offset = (subEvent.sub_event_id * 37) % syntheticParticipants.length;

      for (let r = 0; r < registrationsPerSubEvent; r++) {
        const participant = syntheticParticipants[(offset + r) % syntheticParticipants.length];
        const key = `${subEvent.sub_event_id}:${participant.profile_id}`;
        if (this.indexUserSubEventReg.has(key)) continue;

        const isCheckedIn = (r % 3 === 0);
        const status = r % 25 === 0 ? "waitlisted" : (r % 40 === 0 ? "cancelled" : "confirmed");
        const daysAgo = (r * 7) % 30;
        const regDate = new Date(Date.now() - (daysAgo * 86400000) - (r * 60000)).toISOString();

        try {
          this.createRegistrationRecord(subEvent.sub_event_id, participant.profile_id, {
            ticket_type: ticketTypes[r % ticketTypes.length],
            status: status,
            checked_in: isCheckedIn,
            registered_at: regDate
          });
          totalGenerated++;
        } catch (e) {
          // ignore duplicate
        }
      }

      // Generate verified results (1st, 2nd, 3rd) for this sub-event
      const p1 = syntheticParticipants[(offset + 1) % syntheticParticipants.length];
      const p2 = syntheticParticipants[(offset + 2) % syntheticParticipants.length];
      const p3 = syntheticParticipants[(offset + 3) % syntheticParticipants.length];

      this.publishCompetitionResult(subEvent.sub_event_id, p1.profile_id, 1, "Gold / 1st Place", subEvent.points_reward);
      this.publishCompetitionResult(subEvent.sub_event_id, p2.profile_id, 2, "Silver / 2nd Place", Math.floor(subEvent.points_reward * 0.6));
      this.publishCompetitionResult(subEvent.sub_event_id, p3.profile_id, 3, "Bronze / 3rd Place", Math.floor(subEvent.points_reward * 0.3));
    }

    console.log(`[Scalability Engine] ✅ Generated ${totalGenerated} registrations across ${this.subEvents.length} sub-events.`);
    console.log(`[Scalability Engine] Total database records: ${this.registrations.length} registrations, ${this.userProfiles.length} participants.`);

    return {
      subEventsCount: this.subEvents.length,
      targetPerSubEvent: registrationsPerSubEvent,
      totalRegistrations: this.registrations.length,
      totalParticipants: this.userProfiles.length,
      totalCompetitionResults: this.competitionResults.length,
      totalPointTransactions: this.pointTransactions.length
    };
  }

  resetScalabilityDataset() {
    // Retain only non-synthetic records
    this.userProfiles = this.userProfiles.filter(p => !p.is_synthetic);
    this.indexUserProfileEmail.clear();
    for (const u of this.userProfiles) {
      this.indexUserProfileEmail.set(u.email.toLowerCase(), u);
    }

    this.seedInitialRegistrations();
    return {
      message: "Scalability test dataset safely reset to baseline records.",
      totalRegistrations: this.registrations.length,
      totalParticipants: this.userProfiles.length
    };
  }

  // ==========================================
  // RESULTS, POINTS & LEADERBOARDS
  // ==========================================
  publishCompetitionResult(subEventId, participantId, rank, prizeTitle, pointsAwarded) {
    const existing = this.competitionResults.find(r => r.sub_event_id === subEventId && r.rank === rank);
    if (existing) return existing;

    const subEvent = this.subEvents.find(s => s.sub_event_id === subEventId);
    const participant = this.userProfiles.find(p => p.profile_id === participantId);
    if (!subEvent || !participant) return null;

    const reg = this.registrations.find(r => r.sub_event_id === subEventId && r.participant_id === participantId);

    const result = {
      result_id: this.competitionResults.length + 1,
      sub_event_id: subEventId,
      sub_event_name: subEvent.name,
      participant_id: participantId,
      participant_name: participant.name,
      school_id: participant.school_id,
      department_id: participant.department_id,
      registration_id: reg ? reg.registration_id : null,
      rank: rank,
      prize_title: prizeTitle,
      points_awarded: pointsAwarded,
      published_by: "Faculty Jury & Dean Office",
      published_at: new Date().toISOString()
    };

    this.competitionResults.push(result);

    // Update user profile points
    participant.points = (participant.points || 0) + pointsAwarded;

    // Log school point transaction
    if (participant.school_id) {
      this.pointTransactions.push({
        transaction_id: this.pointTransactions.length + 1,
        school_id: participant.school_id,
        department_id: participant.department_id,
        sub_event_id: subEventId,
        points: pointsAwarded,
        reason: `${prizeTitle} in ${subEvent.name}`,
        created_at: new Date().toISOString()
      });
    }

    // Generate winner certificate
    if (reg) {
      this.certificates.push({
        certificate_id: this.certificates.length + 1,
        certificate_code: `WIN-${rank}-${reg.registration_code}`,
        registration_id: reg.registration_id,
        participant_id: participantId,
        sub_event_id: subEventId,
        type: `winner_rank_${rank}`,
        issued_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      });
    }

    return result;
  }

  // ==========================================
  // AUTHENTICATION & SESSIONS
  // ==========================================
  registerUser({ email, password, name, roll_number, role = 'student', school_id, department_id, participant_type = 'internal' }) {
    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required.");
    }

    const cleanEmail = email.trim().toLowerCase();
    if (this.indexUserProfileEmail.has(cleanEmail)) {
      throw new Error("An account with this email address already exists.");
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);
    const profile_id = this.nextProfileId++;
    const auth_user_id = uuidv4();

    const newProfile = {
      profile_id,
      auth_user_id,
      email: cleanEmail,
      password_hash,
      name: name.trim(),
      roll_number: roll_number ? roll_number.trim() : `CU-26-${profile_id}`,
      role: role.toLowerCase(),
      participant_type,
      school_id: Number(school_id) || 1,
      department_id: Number(department_id) || 1,
      avatar: role === 'admin' ? '👑' : (role === 'faculty' ? '👨‍🏫' : '🎓'),
      points: 50, // Welcome signup bonus points
      created_at: new Date().toISOString()
    };

    this.userProfiles.push(newProfile);
    this.indexUserProfileEmail.set(cleanEmail, newProfile);

    // Generate JWT Token
    const token = jwt.sign(
      { profile_id: newProfile.profile_id, email: newProfile.email, role: newProfile.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = { ...newProfile };
    delete safeUser.password_hash;

    return { token, user: safeUser };
  }

  verifyLogin(email, password) {
    if (!email || !password) throw new Error("Email and password are required.");
    const cleanEmail = email.trim().toLowerCase();

    const user = this.indexUserProfileEmail.get(cleanEmail);
    if (!user) {
      throw new Error("Invalid email or password. Please verify your credentials.");
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid email or password. Please verify your credentials.");
    }

    const token = jwt.sign(
      { profile_id: user.profile_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = { ...user };
    delete safeUser.password_hash;

    // Attach school and department names
    const school = this.schools.find(s => s.school_id === user.school_id);
    const dept = this.departments.find(d => d.department_id === user.department_id);
    safeUser.school_name = school ? school.name : "Chanakya Campus";
    safeUser.department_name = dept ? dept.name : "General";

    return { token, user: safeUser };
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = this.userProfiles.find(u => u.profile_id === decoded.profile_id);
      if (!user) return null;
      const safe = { ...user };
      delete safe.password_hash;
      return safe;
    } catch (e) {
      return null;
    }
  }

  // ==========================================
  // QUERY & FILTERING METHODS
  // ==========================================
  getSchools() {
    return this.schools.map(s => {
      const depts = this.departments.filter(d => d.school_id === s.school_id);
      const fests = this.mainEvents.filter(m => m.school_id === s.school_id);
      const regs = this.registrations.filter(r => {
        const u = this.userProfiles.find(p => p.profile_id === r.participant_id);
        return u && u.school_id === s.school_id;
      });
      const points = this.pointTransactions
        .filter(pt => pt.school_id === s.school_id)
        .reduce((sum, pt) => sum + pt.points, 0);

      return {
        ...s,
        departments_count: depts.length,
        events_count: fests.length,
        registrations_count: regs.length,
        total_points: points
      };
    });
  }

  getDepartments(schoolId = null) {
    let list = this.departments;
    if (schoolId) {
      list = list.filter(d => d.school_id === Number(schoolId));
    }
    return list.map(d => {
      const school = this.schools.find(s => s.school_id === d.school_id);
      return {
        ...d,
        school_name: school ? school.name : "Unknown",
        school_code: school ? school.code : ""
      };
    });
  }

  getMainEvents(filters = {}) {
    let list = [...this.mainEvents];
    if (filters.school_id) {
      list = list.filter(m => m.school_id === Number(filters.school_id));
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(m => m.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    return list.map(m => {
      const subs = this.subEvents.filter(s => s.main_event_id === m.main_event_id);
      const school = this.schools.find(s => s.school_id === m.school_id);
      const dept = this.departments.find(d => d.department_id === m.department_id);
      return {
        ...m,
        sub_events_count: subs.length,
        school_name: school ? school.name : null,
        department_name: dept ? dept.name : null
      };
    });
  }

  getSubEvents(festId = null, filters = {}) {
    let list = [...this.subEvents];
    if (festId) {
      list = list.filter(s => s.main_event_id === Number(festId));
    }
    if (filters.category && filters.category !== 'all') {
      list = list.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.type && filters.type !== 'all') {
      list = list.filter(s => s.type.toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.venue.toLowerCase().includes(q));
    }

    return list.map(s => {
      const fest = this.mainEvents.find(m => m.main_event_id === s.main_event_id);
      const regCount = this.registrations.filter(r => r.sub_event_id === s.sub_event_id && r.status !== 'cancelled').length;
      return {
        ...s,
        fest_name: fest ? fest.name : "Fest",
        registered_count: regCount,
        occupancy_rate: Math.min(100, Math.round((regCount / s.max_capacity) * 100))
      };
    });
  }

  getSubEventById(id) {
    const s = this.subEvents.find(ev => ev.sub_event_id === Number(id));
    if (!s) return null;
    const fest = this.mainEvents.find(m => m.main_event_id === s.main_event_id);
    const regCount = this.registrations.filter(r => r.sub_event_id === s.sub_event_id && r.status !== 'cancelled').length;
    return {
      ...s,
      fest_name: fest ? fest.name : "Fest",
      registered_count: regCount,
      occupancy_rate: Math.min(100, Math.round((regCount / s.max_capacity) * 100))
    };
  }

  // ==========================================
  // PAGINATED REGISTRATIONS (HIGH PERFORMANCE)
  // ==========================================
  getRegistrationsPaginated({
    page = 1,
    limit = 25,
    school_id = null,
    department_id = null,
    fest_id = null,
    sub_event_id = null,
    status = null,
    search = '',
    sort_by = 'registered_at',
    sort_order = 'desc'
  }) {
    let filtered = [...this.registrations];

    if (sub_event_id) {
      filtered = filtered.filter(r => r.sub_event_id === Number(sub_event_id));
    }
    if (fest_id) {
      filtered = filtered.filter(r => r.main_event_id === Number(fest_id));
    }
    if (status && status !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    // Enrich with participant & event info for filtering
    const enriched = filtered.map(r => {
      const p = this.userProfiles.find(u => u.profile_id === r.participant_id) || {};
      const s = this.subEvents.find(ev => ev.sub_event_id === r.sub_event_id) || {};
      const m = this.mainEvents.find(ev => ev.main_event_id === r.main_event_id) || {};
      const sc = this.schools.find(sch => sch.school_id === p.school_id) || {};
      const dp = this.departments.find(dep => dep.department_id === p.department_id) || {};

      return {
        ...r,
        participant_name: p.name || 'Anonymous',
        participant_email: p.email || '',
        participant_roll: p.roll_number || '',
        participant_role: p.role || 'student',
        school_id: p.school_id,
        school_name: sc.name || 'General',
        department_id: p.department_id,
        department_name: dp.name || 'General',
        sub_event_name: s.name || 'Event',
        sub_event_category: s.category || 'General',
        sub_event_venue: s.venue || '',
        sub_event_time: s.time || '',
        fest_name: m.name || 'Fest'
      };
    });

    let finalFilter = enriched;
    if (school_id && school_id !== 'all') {
      finalFilter = finalFilter.filter(r => r.school_id === Number(school_id));
    }
    if (department_id && department_id !== 'all') {
      finalFilter = finalFilter.filter(r => r.department_id === Number(department_id));
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      finalFilter = finalFilter.filter(r =>
        r.participant_name.toLowerCase().includes(q) ||
        r.participant_email.toLowerCase().includes(q) ||
        r.registration_code.toLowerCase().includes(q) ||
        r.sub_event_name.toLowerCase().includes(q) ||
        r.fest_name.toLowerCase().includes(q)
      );
    }

    // Sorting
    finalFilter.sort((a, b) => {
      let va = a[sort_by];
      let vb = b[sort_by];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (sort_order === 'asc') return va > vb ? 1 : -1;
      return va < vb ? 1 : -1;
    });

    const total = finalFilter.length;
    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const startIndex = (pageNum - 1) * pageSize;
    const paginatedItems = finalFilter.slice(startIndex, startIndex + pageSize);

    return {
      total,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      data: paginatedItems
    };
  }

  // User Registrations
  getUserRegistrations(participantId) {
    const list = this.registrations.filter(r => r.participant_id === Number(participantId));
    return list.map(r => {
      const s = this.subEvents.find(ev => ev.sub_event_id === r.sub_event_id);
      const m = this.mainEvents.find(ev => ev.main_event_id === r.main_event_id);
      const cert = this.certificates.find(c => c.registration_id === r.registration_id);
      return {
        ...r,
        sub_event_name: s ? s.name : 'Event',
        category: s ? s.category : 'General',
        venue: s ? s.venue : 'Campus',
        day: s ? s.day : 'Day 1',
        time: s ? s.time : '10:00 AM',
        fest_name: m ? m.name : 'Fest',
        certificate_code: cert ? cert.certificate_code : null
      };
    });
  }

  // Certificate Subsystem
  getUserProfileById(id) {
    return this.userProfiles.find(p => p.profile_id === Number(id)) || null;
  }

  getMainEventById(id) {
    return this.mainEvents.find(m => m.main_event_id === Number(id)) || null;
  }

  enrichCertificate(cert) {
    if (!cert) return null;
    const participant = this.userProfiles.find(p => p.profile_id === Number(cert.participant_id)) || null;
    const subEvent = this.subEvents.find(ev => ev.sub_event_id === Number(cert.sub_event_id)) || null;
    const mainEvent = subEvent ? this.mainEvents.find(m => m.main_event_id === subEvent.main_event_id) : null;
    const registration = this.registrations.find(r => r.registration_id === cert.registration_id) || null;
    const school = participant ? this.schools.find(s => s.school_id === participant.school_id) : null;
    const dept = participant ? this.departments.find(d => d.department_id === participant.department_id) : null;
    const compResult = this.competitionResults.find(cr => cr.sub_event_id === cert.sub_event_id && cr.participant_id === cert.participant_id);

    const isWinner = cert.type && cert.type.startsWith('winner');
    const rank = compResult ? compResult.rank : (cert.type && cert.type.includes('rank_1') ? 1 : (cert.type && cert.type.includes('rank_2') ? 2 : (cert.type && cert.type.includes('rank_3') ? 3 : null)));
    const prizeTitle = compResult ? compResult.prize_title : (isWinner ? 'Excellence Award' : 'Certificate of Participation');

    return {
      certificate_id: cert.certificate_id,
      certificate_code: cert.certificate_code,
      registration_id: cert.registration_id,
      registration_code: registration ? registration.registration_code : '',
      participant_id: cert.participant_id,
      participant_name: participant ? participant.name : 'Chanakya Scholar',
      roll_number: participant ? participant.roll_number : '26UG-GEN',
      school_name: school ? school.name : 'Chanakya University',
      department_name: dept ? dept.name : 'University Faculty',
      sub_event_id: cert.sub_event_id,
      sub_event_name: subEvent ? subEvent.name : 'Campus Conclave',
      category: subEvent ? subEvent.category : 'General',
      fest_name: mainEvent ? mainEvent.name : 'UtsavHub',
      type: cert.type,
      is_winner: isWinner,
      rank: rank,
      prize_title: prizeTitle,
      points: compResult ? compResult.points_awarded : 50,
      issued_date: cert.issued_date || new Date().toISOString().split('T')[0],
      signatory: 'Dr. C. N. Ramanathan, Dean of Student Affairs & Academic Councils',
      institution: 'Chanakya University Global Campus, Bengaluru',
      verification_url: `/api/certificates/verify/${cert.certificate_code}`
    };
  }

  getCertificates() {
    return this.certificates.map(c => this.enrichCertificate(c));
  }

  getCertificateByCode(code) {
    if (!code) return null;
    const clean = code.trim().toUpperCase();
    const cert = this.certificates.find(c => c.certificate_code && c.certificate_code.toUpperCase() === clean);
    return cert ? this.enrichCertificate(cert) : null;
  }

  getUserCertificates(participantId) {
    const pId = Number(participantId);
    return this.certificates
      .filter(c => c.participant_id === pId)
      .map(c => this.enrichCertificate(c));
  }

  // Attendance Check-in
  checkInByCode(code, scannedBy = 'Gate Scanner') {
    const cleanCode = code.trim().toUpperCase();
    const reg = this.registrations.find(r => r.registration_code === cleanCode || r.registration_code.endsWith(cleanCode));
    if (!reg) throw new Error(`Registration pass '${code}' not found.`);

    if (reg.checked_in) {
      return {
        success: true,
        alreadyCheckedIn: true,
        already_checked_in: true,
        message: `Attendee ${reg.registration_code} was already checked in at ${reg.checked_in_at}.`,
        registration: reg
      };
    }

    reg.checked_in = true;
    reg.checked_in_at = new Date().toISOString();
    reg.status = 'attended';
    reg.attendance_status = 'Attended';

    const attRecord = {
      attendance_id: this.attendanceRecords.length + 1,
      registration_id: reg.registration_id,
      sub_event_id: reg.sub_event_id,
      scanned_at: reg.checked_in_at,
      scanned_by: scannedBy
    };
    this.attendanceRecords.push(attRecord);

    return {
      success: true,
      alreadyCheckedIn: false,
      already_checked_in: false,
      message: `Check-in confirmed for pass ${reg.registration_code}.`,
      registration: reg
    };
  }

  // ==========================================
  // REAL-TIME ANALYTICS & DASHBOARD AGGREGATIONS
  // ==========================================
  getAnalyticsOverview() {
    const totalSchools = this.schools.length;
    const totalDepartments = this.departments.length;
    const totalEvents = this.mainEvents.length;
    const totalSubEvents = this.subEvents.length;
    const totalRegistrations = this.registrations.filter(r => r.status !== 'cancelled').length;
    const attendedCount = this.registrations.filter(r => r.checked_in).length;

    const uniqueParticipants = new Set(
      this.registrations.filter(r => r.status !== 'cancelled').map(r => r.participant_id)
    ).size;

    const totalPointsAwarded = this.pointTransactions.reduce((acc, p) => acc + p.points, 0);

    return {
      totalSchools,
      totalDepartments,
      totalEvents,
      totalSubEvents,
      totalRegistrations,
      totalParticipants: uniqueParticipants,
      attendedCount,
      attendanceRate: totalRegistrations > 0 ? Math.round((attendedCount / totalRegistrations) * 100) : 0,
      totalPointsAwarded,
      totalResults: this.competitionResults.length,
      datasetSize: this.registrations.length
    };
  }

  getSchoolAnalytics() {
    return this.schools.map(s => {
      const schoolParticipants = this.userProfiles.filter(p => p.school_id === s.school_id);
      const pIds = new Set(schoolParticipants.map(p => p.profile_id));
      const regs = this.registrations.filter(r => pIds.has(r.participant_id) && r.status !== 'cancelled');
      const attended = regs.filter(r => r.checked_in).length;
      const points = this.pointTransactions
        .filter(pt => pt.school_id === s.school_id)
        .reduce((sum, pt) => sum + pt.points, 0);
      const podiums = this.competitionResults.filter(cr => cr.school_id === s.school_id).length;

      return {
        school_id: s.school_id,
        school_name: s.name,
        school_code: s.code,
        color: s.banner_color,
        registrations_count: regs.length,
        attended_count: attended,
        unique_students: pIds.size,
        points,
        podiums
      };
    }).sort((a, b) => b.registrations_count - a.registrations_count);
  }

  getDepartmentAnalytics() {
    return this.departments.map(d => {
      const deptParticipants = this.userProfiles.filter(p => p.department_id === d.department_id);
      const pIds = new Set(deptParticipants.map(p => p.profile_id));
      const regs = this.registrations.filter(r => pIds.has(r.participant_id) && r.status !== 'cancelled');
      const school = this.schools.find(s => s.school_id === d.school_id);

      return {
        department_id: d.department_id,
        department_name: d.name,
        department_code: d.code,
        school_name: school ? school.name : "School",
        school_code: school ? school.code : "",
        registrations_count: regs.length,
        students_count: pIds.size
      };
    }).sort((a, b) => b.registrations_count - a.registrations_count);
  }

  getRegistrationTrends() {
    // Group registrations by day over the last 14 days
    const dayMap = new Map();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateKey = d.toISOString().split('T')[0];
      dayMap.set(dateKey, 0);
    }

    for (const r of this.registrations) {
      if (!r.registered_at) continue;
      const dKey = r.registered_at.split('T')[0];
      if (dayMap.has(dKey)) {
        dayMap.set(dKey, dayMap.get(dKey) + 1);
      }
    }

    return Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
  }

  getSchoolLeaderboard() {
    const list = this.schools.map(s => {
      const points = this.pointTransactions
        .filter(pt => pt.school_id === s.school_id)
        .reduce((sum, pt) => sum + pt.points, 0);
      const results = this.competitionResults.filter(cr => cr.school_id === s.school_id);
      const gold = results.filter(r => r.rank === 1).length;
      const silver = results.filter(r => r.rank === 2).length;
      const bronze = results.filter(r => r.rank === 3).length;

      return {
        school_id: s.school_id,
        school_name: s.name,
        school_code: s.code,
        points,
        total_points: points,
        gold,
        silver,
        bronze,
        total_medals: gold + silver + bronze
      };
    });

    return list.sort((a, b) => b.points - a.points || b.gold - a.gold);
  }

  getAnnouncements() {
    return this.announcements.filter(a => a.is_active);
  }

  addAnnouncement({ title, message, fest_name, priority = 'normal' }) {
    const ann = {
      id: this.announcements.length + 1,
      title: title.trim(),
      message: message.trim(),
      fest_name: fest_name || null,
      priority,
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.announcements.unshift(ann);
    return ann;
  }
}

// Singleton instance
const relationalStore = new RelationalCampusStore();
relationalStore.init();

module.exports = relationalStore;
