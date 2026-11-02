#!/usr/bin/env python3
"""
Common Synthetic Dataset Generator for Chanakya Campus Navigator (ECS351)
Deterministic generation using fixed seed (seed=42) for scientific reproducibility.
Exports:
  1. datasets/chanakya_common_dataset.json
  2. datasets/csv/*.csv
  3. datasets/seed_data.sql
  4. datasets/DATA_DICTIONARY.md
"""

import os
import sys
import json
import csv
import random
import hashlib
from datetime import datetime, timedelta

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Fix random seed for exact reproducibility across architectures
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_DIR = os.path.join(BASE_DIR, "csv")
os.makedirs(CSV_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# 1. SCHOOLS & DEPARTMENTS
# ---------------------------------------------------------------------------
SCHOOLS = [
    {"school_id": 1, "code": "SAHSS", "name": "School of Arts Humanities and Social Sciences"},
    {"school_id": 2, "code": "SMS", "name": "School of Management Sciences"},
    {"school_id": 3, "code": "SMNS", "name": "School of Mathematics and Natural Sciences"},
    {"school_id": 4, "code": "SLGPP", "name": "School of Law Governance and Public Policy"},
    {"school_id": 5, "code": "SBS", "name": "School of Biosciences"},
    {"school_id": 6, "code": "SOE", "name": "School of Engineering"}
]

DEPARTMENTS = [
    {"department_id": 1, "school_id": 6, "name": "Computer Science & Engineering (CSE)"},
    {"department_id": 2, "school_id": 6, "name": "Artificial Intelligence & Data Science (AI & DS)"},
    {"department_id": 3, "school_id": 6, "name": "Robotics & Embedded Automation"},
    {"department_id": 4, "school_id": 6, "name": "Mechanical & Mechatronics"},
    {"department_id": 5, "school_id": 1, "name": "Economics & Public Policy"},
    {"department_id": 6, "school_id": 1, "name": "Political Science & International Relations"},
    {"department_id": 7, "school_id": 1, "name": "Psychology & Cognitive Sciences"},
    {"department_id": 8, "school_id": 2, "name": "Business Administration (BBA/MBA)"},
    {"department_id": 9, "school_id": 2, "name": "Commerce & Financial Analytics"},
    {"department_id": 10, "school_id": 3, "name": "Data Science & Applied Statistics"},
    {"department_id": 11, "school_id": 3, "name": "Physics & Quantum Materials"},
    {"department_id": 12, "school_id": 4, "name": "Constitutional & Corporate Law (BA LLB)"},
    {"department_id": 13, "school_id": 5, "name": "Biotechnology & Bioinformatics"}
]

# ---------------------------------------------------------------------------
# 2. CAMPUS LOCATIONS & LANDMARKS (Real Chanakya University Global Campus)
# ---------------------------------------------------------------------------
LOCATIONS = [
    {
        "location_id": "central_circle",
        "name": "Chanakya Academic Circle Quad & Concentric Lawns",
        "short_name": "Academic Circle Quad",
        "category": "Administrative",
        "lat": 13.222871, "lng": 77.755633,
        "capacity": 3500, "floors": 1, "accessible": True,
        "description": "Grand circular quadrangle anchoring all university blocks and central lawn."
    },
    {
        "location_id": "admin_block",
        "name": "Academic Block 1 - Administrative Hub & School of Law",
        "short_name": "Academic Block 1",
        "category": "Administrative",
        "lat": 13.222255, "lng": 77.755297,
        "capacity": 1200, "floors": 4, "accessible": True,
        "description": "Administrative headquarters, Vice Chancellor Office, Registrar, School of Law."
    },
    {
        "location_id": "tech_park",
        "name": "Academic Block 2 - Science, Technology & AI Computing",
        "short_name": "Academic Block 2",
        "category": "Academic & Research",
        "lat": 13.223382, "lng": 77.755990,
        "capacity": 1800, "floors": 5, "accessible": True,
        "description": "Engineering classrooms, AI supercomputing cluster, and hardware robotics bay."
    },
    {
        "location_id": "faculty_block",
        "name": "Faculty Block & Visiting Scholars Residence",
        "short_name": "Faculty Block",
        "category": "Residential",
        "lat": 13.223668, "lng": 77.757229,
        "capacity": 350, "floors": 4, "accessible": True,
        "description": "Faculty research suites, academic council lounge, and guest apartments."
    },
    {
        "location_id": "hostel_zone",
        "name": "Nalanda & Takshashila Residential Hostels",
        "short_name": "Student Hostels",
        "category": "Residential",
        "lat": 13.224548, "lng": 77.758870,
        "capacity": 2500, "floors": 7, "accessible": True,
        "description": "Four residential towers with study commons and dining hall."
    },
    {
        "location_id": "campus_temple",
        "name": "Meditation Sanctuary & Peace Garden",
        "short_name": "Meditation Sanctuary",
        "category": "Cultural",
        "lat": 13.223299, "lng": 77.757493,
        "capacity": 200, "floors": 1, "accessible": True,
        "description": "Spiritual retreat and silent meditation sanctuary."
    },
    {
        "location_id": "electricity_station",
        "name": "Power Substation & 1.2MW Solar Inverters",
        "short_name": "Power Substation",
        "category": "Infrastructure",
        "lat": 13.223170, "lng": 77.757270,
        "capacity": 25, "floors": 1, "accessible": False,
        "description": "Campus electrical utility grid and solar inverter array."
    },
    {
        "location_id": "entry_gate",
        "name": "South Main Entrance Boulevard",
        "short_name": "Entry Boulevard",
        "category": "Entrance",
        "lat": 13.220539, "lng": 77.754383,
        "capacity": 800, "floors": 1, "accessible": True,
        "description": "Primary boulevard ingress with ANPR license verification."
    },
    {
        "location_id": "exit_gate",
        "name": "South Main Exit Avenue",
        "short_name": "Exit Avenue",
        "category": "Entrance",
        "lat": 13.220914, "lng": 77.755205,
        "capacity": 800, "floors": 1, "accessible": True,
        "description": "Vehicle egress lane onto campus peripheral highway."
    },
    {
        "location_id": "main_gate_1",
        "name": "Main Security Gatehouse (Gate 1)",
        "short_name": "Main Gate 1",
        "category": "Entrance",
        "lat": 13.220162, "lng": 77.754079,
        "capacity": 500, "floors": 1, "accessible": True,
        "description": "Main gate visitor verification and 24/7 security dispatch."
    },
    {
        "location_id": "sportspath",
        "name": "Sports Boulevard Promenade",
        "short_name": "Sports Boulevard",
        "category": "Sports",
        "lat": 13.227349, "lng": 77.758679,
        "capacity": 2500, "floors": 1, "accessible": True,
        "description": "Tree-lined boulevard connecting academic quad to sports arena."
    },
    {
        "location_id": "sports_complex",
        "name": "Olympic Sports Arena & Gymnasium",
        "short_name": "Sports Complex",
        "category": "Sports",
        "lat": 13.228500, "lng": 77.758200,
        "capacity": 3000, "floors": 2, "accessible": True,
        "description": "Multi-sport arena, badminton courts, Olympic pool, and gym."
    },
    {
        "location_id": "cricket_ground",
        "name": "Chanakya Cricket Oval & Turf Pavilion",
        "short_name": "Cricket Oval",
        "category": "Sports",
        "lat": 13.228968, "lng": 77.757163,
        "capacity": 2000, "floors": 1, "accessible": True,
        "description": "Regulation turf cricket pitch with floodlights."
    },
    {
        "location_id": "football_turf",
        "name": "Synthetic Football & Soccer Turf",
        "short_name": "Football Turf",
        "category": "Sports",
        "lat": 13.228467, "lng": 77.758377,
        "capacity": 1500, "floors": 1, "accessible": True,
        "description": "Floodlit soccer turf for intramural and university leagues."
    },
    {
        "location_id": "basketball_arena",
        "name": "Twin Acrylic Basketball Arena",
        "short_name": "Basketball Courts",
        "category": "Sports",
        "lat": 13.228845, "lng": 77.758119,
        "capacity": 800, "floors": 1, "accessible": True,
        "description": "Twin synthetic courts with electronic scoreboards."
    },
    {
        "location_id": "central_library",
        "name": "Central Digital Library & Knowledge Colonnade",
        "short_name": "Central Library",
        "category": "Library",
        "lat": 13.222282, "lng": 77.755341,
        "capacity": 900, "floors": 4, "accessible": True,
        "description": "400,000+ volumes, silent study pods, IEEE/Scopus research terminal."
    },
    {
        "location_id": "grand_auditorium",
        "name": "Grand Auditorium & Performing Arts Hall",
        "short_name": "Grand Auditorium",
        "category": "Auditorium",
        "lat": 13.223800, "lng": 77.756200,
        "capacity": 1200, "floors": 3, "accessible": True,
        "description": "Acoustic auditorium for conclaves, convocations, and cultural fests."
    },
    {
        "location_id": "food_pavilion",
        "name": "Annapurna Food Pavilion & Terrace Canteen",
        "short_name": "Annapurna Food Court",
        "category": "Dining",
        "lat": 13.222600, "lng": 77.756300,
        "capacity": 1000, "floors": 2, "accessible": True,
        "description": "Multi-cuisine dining, student canteen, and rooftop terrace."
    },
    {
        "location_id": "convention_hall",
        "name": "Arya Chanakya Convention & Seminar Center",
        "short_name": "Arya Convention Hall",
        "category": "Auditorium",
        "lat": 13.222950, "lng": 77.754900,
        "capacity": 450, "floors": 2, "accessible": True,
        "description": "Executive symposium hall with telepresence booths."
    },
    {
        "location_id": "medical_center",
        "name": "Sushruta Health & Emergency Medical Center",
        "short_name": "Medical Center",
        "category": "Health & Emergency",
        "lat": 13.221000, "lng": 77.754600,
        "capacity": 100, "floors": 2, "accessible": True,
        "description": "24/7 OPD, pharmacy, triage bay, and emergency trauma ICU."
    },
    {
        "location_id": "east_gate_2",
        "name": "East Campus Gate & Bus Terminal (Gate 2)",
        "short_name": "East Gate 2",
        "category": "Entrance",
        "lat": 13.224800, "lng": 77.759800,
        "capacity": 400, "floors": 1, "accessible": True,
        "description": "Bus transit hub and logistics entry."
    }
]

# Walkway Junction Nodes
JUNCTIONS = [
    {"location_id": "junc_main_gate", "name": "South Gate Security Crossway", "short_name": "Gate Cross", "category": "Junction", "lat": 13.2203, "lng": 77.7542, "capacity": 500, "floors": 1, "accessible": True, "description": "Pedestrian crossway at South Gate."},
    {"location_id": "junc_south_entry", "name": "Boulevard Roundabout Ingress", "short_name": "South Ingress", "category": "Junction", "lat": 13.2215, "lng": 77.7548, "capacity": 500, "floors": 1, "accessible": True, "description": "Roundabout connecting entry boulevard."},
    {"location_id": "junc_circle_south", "name": "Central Circle South Concourse", "short_name": "South Concourse", "category": "Junction", "lat": 13.2220, "lng": 77.7551, "capacity": 500, "floors": 1, "accessible": True, "description": "South concourse entrance to academic circle."},
    {"location_id": "junc_circle_center", "name": "Central Academic Quad Fountain Center", "short_name": "Quad Center", "category": "Junction", "lat": 13.222871, "lng": 77.755633, "capacity": 1000, "floors": 1, "accessible": True, "description": "Central nexus of academic circle quad."},
    {"location_id": "junc_circle_east", "name": "Academic Ring East Junction", "short_name": "East Ring", "category": "Junction", "lat": 13.2232, "lng": 77.7568, "capacity": 500, "floors": 1, "accessible": True, "description": "East ring walkway junction."},
    {"location_id": "junc_circle_north", "name": "Academic Ring North Concourse", "short_name": "North Concourse", "category": "Junction", "lat": 13.2237, "lng": 77.7565, "capacity": 500, "floors": 1, "accessible": True, "description": "North concourse walkway junction."},
    {"location_id": "junc_sports_boulevard", "name": "Sports Boulevard North Turn", "short_name": "Sports Turn", "category": "Junction", "lat": 13.2270, "lng": 77.7584, "capacity": 500, "floors": 1, "accessible": True, "description": "North junction leading to athletic fields."}
]

ALL_LOCATIONS = LOCATIONS + JUNCTIONS

# ---------------------------------------------------------------------------
# 3. CAMPUS PATHWAYS & GRAPH EDGES
# ---------------------------------------------------------------------------
RAW_EDGES = [
    ("main_gate_1", "junc_main_gate", 30, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_main_gate", "entry_gate", 40, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_main_gate", "medical_center", 80, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("entry_gate", "junc_south_entry", 110, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("medical_center", "junc_south_entry", 60, ["pedestrian", "wheelchair", "bicycle"], True),
    ("exit_gate", "junc_south_entry", 75, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("exit_gate", "main_gate_1", 120, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_south_entry", "junc_circle_south", 70, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_circle_south", "admin_block", 45, ["pedestrian", "wheelchair", "bicycle"], True),
    ("admin_block", "central_library", 35, ["pedestrian", "wheelchair", "bicycle"], True),
    ("junc_circle_south", "junc_circle_center", 95, ["pedestrian", "wheelchair", "bicycle"], True),
    ("admin_block", "junc_circle_center", 80, ["pedestrian", "wheelchair", "bicycle"], True),
    ("central_circle", "junc_circle_center", 10, ["pedestrian", "wheelchair", "bicycle"], True),
    ("junc_circle_center", "convention_hall", 85, ["pedestrian", "wheelchair", "bicycle"], True),
    ("junc_circle_center", "tech_park", 70, ["pedestrian", "wheelchair", "bicycle"], True),
    ("junc_circle_center", "food_pavilion", 75, ["pedestrian", "wheelchair", "bicycle"], True),
    ("tech_park", "junc_circle_north", 55, ["pedestrian", "wheelchair", "bicycle"], True),
    ("tech_park", "grand_auditorium", 50, ["pedestrian", "wheelchair", "bicycle"], True),
    ("grand_auditorium", "junc_circle_north", 40, ["pedestrian", "wheelchair", "bicycle"], True),
    ("food_pavilion", "junc_circle_east", 70, ["pedestrian", "wheelchair", "bicycle"], True),
    ("junc_circle_north", "junc_circle_east", 80, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_circle_east", "faculty_block", 65, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_circle_east", "electricity_station", 50, ["pedestrian", "bicycle", "shuttle"], False),
    ("junc_circle_east", "campus_temple", 65, ["pedestrian", "wheelchair", "bicycle"], True),
    ("faculty_block", "hostel_zone", 180, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("hostel_zone", "east_gate_2", 110, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_circle_north", "sportspath", 350, ["pedestrian", "bicycle", "shuttle"], True),
    ("sportspath", "junc_sports_boulevard", 60, ["pedestrian", "bicycle", "shuttle"], True),
    ("junc_sports_boulevard", "sports_complex", 140, ["pedestrian", "wheelchair", "bicycle", "shuttle"], True),
    ("junc_sports_boulevard", "football_turf", 130, ["pedestrian", "wheelchair", "bicycle"], True),
    ("junc_sports_boulevard", "basketball_arena", 160, ["pedestrian", "wheelchair", "bicycle"], True),
    ("junc_sports_boulevard", "cricket_ground", 220, ["pedestrian", "bicycle", "shuttle"], True)
]

PATHWAYS = []
for idx, (src, dst, dist, modes, acc) in enumerate(RAW_EDGES, 1):
    PATHWAYS.append({
        "pathway_id": idx,
        "from_location_id": src,
        "to_location_id": dst,
        "distance_meters": dist,
        "allowed_modes": json.dumps(modes),
        "is_accessible": acc,
        "surface_type": "Paved Concrete" if acc else "Gravel / Service Road",
        "is_currently_blocked": False
    })

# ---------------------------------------------------------------------------
# 4. MAIN EVENTS (FLAGSHIP CONCLAVES)
# ---------------------------------------------------------------------------
MAIN_EVENTS = [
    {
        "main_event_id": 1,
        "name": "Samyuti",
        "description": "Flagship Annual Technical & Cultural Conclave",
        "school_id": 6,
        "start_date": "2026-03-28",
        "end_date": "2026-03-30",
        "campus": "Global Campus, Bengaluru",
        "organizer": "School of Engineering & Tech Council"
    },
    {
        "main_event_id": 2,
        "name": "OJAS",
        "description": "Intra-University Management & Arts Conclave",
        "school_id": 1,
        "start_date": "2026-04-20",
        "end_date": "2026-04-22",
        "campus": "Global Campus, Bengaluru",
        "organizer": "School of Arts & Management"
    },
    {
        "main_event_id": 3,
        "name": "Sports Olympiad",
        "description": "Inter-School Athletic Championship & Sports Meet",
        "school_id": 6,
        "start_date": "2026-02-15",
        "end_date": "2026-02-20",
        "campus": "Olympic Sports Arena",
        "organizer": "Department of Physical Education"
    },
    {
        "main_event_id": 4,
        "name": "Tech Horizons Workshops",
        "description": "AI, Cloud, Robotics & Blockchain Bootcamps",
        "school_id": 6,
        "start_date": "2026-05-01",
        "end_date": "2026-05-05",
        "campus": "Tech Park Innovation Hub",
        "organizer": "Chanakya Computing Council"
    },
    {
        "main_event_id": 5,
        "name": "Srujana Tech Fest",
        "description": "Celebrating Creation, Fueling Innovation & Hardware Prototypes",
        "school_id": 6,
        "start_date": "2026-09-13",
        "end_date": "2026-09-15",
        "campus": "Global Campus Labs",
        "organizer": "Engineering Research Cell"
    },
    {
        "main_event_id": 6,
        "name": "Innovation & Startup Summit",
        "description": "Venture Pitching, Seed Grants & Incubator Demos",
        "school_id": 2,
        "start_date": "2026-08-10",
        "end_date": "2026-08-12",
        "campus": "Arya Convention Center",
        "organizer": "Chanakya Centre for Entrepreneurship"
    },
    {
        "main_event_id": 7,
        "name": "Cultural Carnival",
        "description": "Dance, Music, Battle of the Bands, Literary & Fashion Night",
        "school_id": 1,
        "start_date": "2026-11-05",
        "end_date": "2026-11-07",
        "campus": "Grand Auditorium & Quad",
        "organizer": "Cultural Affairs Committee"
    }
]

# ---------------------------------------------------------------------------
# 5. SUB-EVENTS (62 Sub-Events across 7 Conclaves tied to physical locations)
# ---------------------------------------------------------------------------
SUB_EVENT_TEMPLATES = [
    # Samyuti (ID 1)
    (1, "IKS Hackathon 36H", "Technical", "Group", "tech_park", "Day 1", "09:00 AM", True, 2, 4, True, 200),
    (1, "Hardware Robotics Derby", "Technical", "Group", "tech_park", "Day 1", "02:00 PM", True, 2, 4, True, 120),
    (1, "E-Sports Valorant Championship", "Technical", "Group", "tech_park", "Day 2", "10:00 AM", True, 5, 5, True, 160),
    (1, "Indic Game Jam", "Technical", "Group", "tech_park", "Day 2", "11:00 AM", True, 2, 4, True, 100),
    (1, "Vastra Verse Fashion Show", "Cultural", "Solo", "grand_auditorium", "Day 2", "06:00 PM", False, 1, 1, True, 300),
    (1, "Drishti Manthan Street Play", "Cultural", "Group", "central_circle", "Day 1", "04:00 PM", True, 4, 8, True, 250),
    (1, "Smrithi Mandaara Classical Music", "Cultural", "Solo", "grand_auditorium", "Day 3", "03:00 PM", False, 1, 1, True, 200),
    (1, "IKS Quiz Championship", "Technical", "Group", "convention_hall", "Day 2", "02:00 PM", True, 2, 2, True, 150),
    (1, "Campus Treasure Hunt", "Adventure", "Group", "central_circle", "Day 3", "09:30 AM", True, 3, 4, True, 400),
    
    # OJAS (ID 2)
    (2, "Chanakya Stock Simulation", "Management", "Solo", "admin_block", "Day 1", "10:00 AM", False, 1, 1, True, 200),
    (2, "Case Craft Business Challenge", "Management", "Group", "admin_block", "Day 1", "02:00 PM", True, 2, 3, True, 120),
    (2, "Parliamentary Debate", "Literary", "Group", "convention_hall", "Day 2", "11:00 AM", True, 3, 3, True, 150),
    (2, "Brand Blitz Ad-Making", "Management", "Group", "admin_block", "Day 2", "03:00 PM", True, 2, 4, True, 100),
    (2, "Kavya Sandhya Poetry Slam", "Literary", "Solo", "central_circle", "Day 2", "05:30 PM", False, 1, 1, True, 150),
    (2, "Policy Hackathon", "Governance", "Group", "admin_block", "Day 3", "09:00 AM", True, 2, 4, True, 120),
    (2, "Crisis Management Press Conf", "Management", "Solo", "convention_hall", "Day 3", "01:30 PM", False, 1, 1, True, 100),
    (2, "Photography & Reel Making", "Media", "Solo", "central_circle", "Day 1", "10:00 AM", False, 1, 1, True, 200),
    
    # Sports Olympiad (ID 3)
    (3, "Inter-School Football Trophy", "Sports", "Group", "football_turf", "Day 1-3", "08:00 AM", True, 11, 15, True, 300),
    (3, "Chanakya Cricket Premier League", "Sports", "Group", "cricket_ground", "Day 1-4", "08:30 AM", True, 11, 15, True, 350),
    (3, "Basketball 3x3 Showdown", "Sports", "Group", "basketball_arena", "Day 2", "04:00 PM", True, 3, 4, True, 160),
    (3, "Badminton Singles Men/Women", "Sports", "Solo", "sports_complex", "Day 1", "09:00 AM", False, 1, 1, True, 128),
    (3, "100m & 4x100m Sprint Gala", "Sports", "Solo", "sportspath", "Day 2", "07:30 AM", False, 1, 1, True, 200),
    (3, "Table Tennis Masters", "Sports", "Solo", "sports_complex", "Day 3", "10:00 AM", False, 1, 1, True, 64),
    (3, "Olympic Swimming Freestyle 50m", "Sports", "Solo", "sports_complex", "Day 3", "02:00 PM", False, 1, 1, True, 80),
    (3, "Tug of War Mega Clash", "Sports", "Group", "cricket_ground", "Day 4", "04:30 PM", True, 8, 8, True, 250),
    
    # Workshops (ID 4)
    (4, "Hands-on Generative AI with PyTorch", "Workshop", "Solo", "tech_park", "Day 1", "10:00 AM", False, 1, 1, False, 150),
    (4, "Autonomous Drone Assembly & Flight", "Workshop", "Group", "tech_park", "Day 2", "09:30 AM", True, 2, 3, False, 90),
    (4, "Cybersecurity & Ethical Hacking Lab", "Workshop", "Solo", "tech_park", "Day 3", "10:00 AM", False, 1, 1, False, 120),
    (4, "Fintech & Algorithmic Trading", "Workshop", "Solo", "admin_block", "Day 4", "11:00 AM", False, 1, 1, False, 100),
    (4, "Design Systems & UI/UX Sprint", "Workshop", "Solo", "central_library", "Day 5", "02:00 PM", False, 1, 1, False, 120),
    
    # Srujana Tech Fest (ID 5)
    (5, "Logic Loop Microcontroller Sprint", "Technical", "Solo", "tech_park", "Day 1", "02:00 PM", False, 1, 1, True, 120),
    (5, "CAD Clash 3D Modeling", "Technical", "Solo", "tech_park", "Day 2", "10:00 AM", False, 1, 1, True, 100),
    (5, "Ideathon Sustainable Bengaluru", "Innovation", "Group", "convention_hall", "Day 2", "03:00 PM", True, 2, 4, True, 180),
    (5, "Pixel Poetry Web Dev Contest", "Technical", "Solo", "tech_park", "Day 1", "11:00 AM", False, 1, 1, True, 120),
    (5, "Syntax Saga DSA Speedrun", "Technical", "Solo", "tech_park", "Day 1", "09:00 AM", False, 1, 1, True, 250),
    (5, "Prompt to Product AI Sprint", "Innovation", "Group", "grand_auditorium", "Day 3", "02:00 PM", True, 2, 4, True, 200),
    (5, "IoT Smart Campus Expo", "Technical", "Group", "central_circle", "Day 2", "10:00 AM", True, 2, 4, True, 150),
    (5, "RoboWars Combat Battle", "Technical", "Group", "central_circle", "Day 3", "04:00 PM", True, 3, 5, True, 200),
    
    # Innovation Summit (ID 6)
    (6, "Pitch Deck VC Shark Tank", "Startup", "Group", "convention_hall", "Day 1", "10:00 AM", True, 2, 4, True, 100),
    (6, "DeepTech Product Prototype Showcase", "Startup", "Group", "central_circle", "Day 1", "02:00 PM", True, 2, 4, True, 120),
    (6, "Angel Investor Networking Breakfast", "Networking", "Solo", "food_pavilion", "Day 2", "08:30 AM", False, 1, 1, False, 150),
    (6, "Legal IP & Patent Filing Clinic", "Governance", "Solo", "admin_block", "Day 2", "11:30 AM", False, 1, 1, False, 80),
    (6, "Agritech & Bio-Innovation Forum", "Research", "Group", "convention_hall", "Day 2", "03:00 PM", True, 2, 3, True, 100),
    (6, "NextGen Robotics Live Demo", "Demo", "Solo", "tech_park", "Day 3", "11:00 AM", False, 1, 1, False, 300),
    (6, "Social Impact Venture Award", "Startup", "Group", "grand_auditorium", "Day 3", "03:30 PM", True, 2, 4, True, 150),
    
    # Cultural Carnival (ID 7)
    (7, "Battle of the Bands", "Music", "Group", "grand_auditorium", "Day 1", "06:00 PM", True, 3, 7, True, 400),
    (7, "Natya Sangeet Classical Dance", "Cultural", "Solo", "grand_auditorium", "Day 1", "02:00 PM", False, 1, 1, True, 200),
    (7, "Monologue & Theatrical Solo", "Cultural", "Solo", "convention_hall", "Day 2", "10:00 AM", False, 1, 1, True, 100),
    (7, "Street Dance Crew Face-off", "Cultural", "Group", "central_circle", "Day 2", "04:30 PM", True, 4, 10, True, 350),
    (7, "Beatboxing & Rap Cypher", "Music", "Solo", "central_circle", "Day 2", "07:00 PM", False, 1, 1, True, 250),
    (7, "Cosplay & Pop Culture Walk", "Cultural", "Solo", "grand_auditorium", "Day 3", "04:00 PM", False, 1, 1, True, 300),
    (7, "Stand-up Comedy Open Mic", "Comedy", "Solo", "convention_hall", "Day 3", "06:30 PM", False, 1, 1, True, 250),
    (7, "Gala Grand Finale Celebrity DJ Night", "Entertainment", "Solo", "cricket_ground", "Day 3", "08:00 PM", False, 1, 1, False, 2500)
]

SUB_EVENTS = []
for sub_id, (m_id, name, cat, stype, ven, day, time_str, is_team, tmin, tmax, is_comp, cap) in enumerate(SUB_EVENT_TEMPLATES, 1):
    SUB_EVENTS.append({
        "sub_event_id": sub_id,
        "main_event_id": m_id,
        "name": name,
        "category": cat,
        "type": stype,
        "venue_location_id": ven,
        "day": day,
        "time": time_str,
        "is_team_event": is_team,
        "team_min": tmin,
        "team_max": tmax,
        "is_competition": is_comp,
        "max_capacity": cap
    })

# ---------------------------------------------------------------------------
# 6. STUDENTS & PARTICIPANTS (200 Authentic Seed Participants + Faculty/Admin)
# ---------------------------------------------------------------------------
FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Shaurya", "Atharv", "Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Chiara", "Riya", "Ira",
    "Myra", "Ahana", "Prisha", "Kavya", "Tanvi", "Avani", "Rohan", "Varshitha", "Vikram", "Sneha",
    "Kiran", "Naveen", "Pooja", "Gaurav", "Divya", "Siddharth", "Meera", "Karthik", "Deepa", "Manish"
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Iyer", "Rao", "Nair", "Reddy", "Choudhury", "Gupta", "Menon",
    "Joshi", "Bhat", "Kulkarni", "Hegde", "Deshmukh", "Singhania", "Mukherjee", "Banerjee", "Chatterjee",
    "Pillai", "Shetty", "Gowda", "Naidu", "Chari", "Prasad", "Swaminathan"
]

PARTICIPANTS = []
# Fixed baseline participants
BASELINE_STUDENTS = [
    ("Rahul Sharma", "24UG00001", "rahul.sharma@chanakya.edu", 6, 1, "UG", 2, "M", "student"),
    ("Ananya Das", "24UG00221", "ananya.das@chanakya.edu", 1, 6, "UG", 1, "F", "new_student"),
    ("Dr. C. N. Ramanathan", "FAC001", "dean.academics@chanakya.edu", 6, 1, "FACULTY", 0, "M", "faculty"),
    ("Vikram Singhania", "STF002", "campus.ops@chanakya.edu", 6, 4, "STAFF", 0, "M", "staff"),
    ("Priya Nair", "VIS003", "visitor.priya@gmail.com", 5, 13, "VISITOR", 0, "F", "visitor"),
    ("Dean Academic Council", "ADM004", "admin@chanakya.edu", 6, 1, "ADMIN", 0, "M", "admin"),
    ("Varshitha Chari", "24UG00549", "varshitha0512@gmail.com", 6, 1, "UG", 2, "F", "student"),
    ("Rohan Reddy", "24UG00276", "rohan.reddy@chanakya.edu", 6, 2, "UG", 2, "M", "student"),
    ("Karthik Hegde", "22UG00078", "karthik.reddy@chanakya.edu", 6, 3, "UG", 4, "M", "student"),
    ("Sneha Iyer", "24PG00012", "sneha.iyer@chanakya.edu", 3, 10, "PG", 1, "F", "student")
]

for p_id, (name, roll, email, s_id, d_id, prog, yr, gender, role) in enumerate(BASELINE_STUDENTS, 1):
    PARTICIPANTS.append({
        "participant_id": p_id,
        "name": name,
        "roll_number": roll,
        "email": email,
        "password_hash": hashlib.sha256(f"Chanakya@{roll}".encode()).hexdigest(),
        "school_id": s_id,
        "department_id": d_id,
        "program_type": prog,
        "year": yr,
        "gender": gender,
        "participant_type": "visitor" if role == "visitor" else "internal",
        "role": role,
        "reward_points": random.randint(150, 600)
    })

# Generate additional 190 students for realistic load tests
for i in range(11, 201):
    fn = random.choice(FIRST_NAMES)
    ln = random.choice(LAST_NAMES)
    name = f"{fn} {ln}"
    yr = random.choice([1, 2, 3, 4])
    prog = random.choice(["UG", "UG", "UG", "PG"])
    roll_num = f"{26 - yr}{prog}{i:05d}"
    s_obj = random.choice(SCHOOLS)
    depts_in_school = [d for d in DEPARTMENTS if d["school_id"] == s_obj["school_id"]]
    d_obj = random.choice(depts_in_school) if depts_in_school else DEPARTMENTS[0]
    email = f"{fn.lower()}.{ln.lower()}{i}@chanakya.edu"
    gender = random.choice(["M", "F"])
    
    PARTICIPANTS.append({
        "participant_id": i,
        "name": name,
        "roll_number": roll_num,
        "email": email,
        "password_hash": hashlib.sha256(f"Chanakya@{roll_num}".encode()).hexdigest(),
        "school_id": s_obj["school_id"],
        "department_id": d_obj["department_id"],
        "program_type": prog,
        "year": yr,
        "gender": gender,
        "participant_type": "internal",
        "role": "student",
        "reward_points": random.randint(50, 450)
    })

# ---------------------------------------------------------------------------
# 7. REGISTRATIONS & DIGITAL EVENT PASSES
# ---------------------------------------------------------------------------
REGISTRATIONS = []
CERTIFICATES = []
reg_counter = 1
cert_counter = 1

TICKET_TYPES = ["VIP All-Access Pass", "Standard Delegate Pass", "Student Conclave Pass", "Workshop Seat Pass"]

for p in PARTICIPANTS[:80]:
    # Register each student for 1 to 4 events
    num_events = random.randint(1, 4)
    chosen_events = random.sample(SUB_EVENTS, num_events)
    for ev in chosen_events:
        sub_id = ev["sub_event_id"]
        reg_code = f"CU-S{sub_id:02d}-P{p['participant_id']:04d}-{random.randint(1000, 9999):04X}"
        checked_in = random.random() < 0.65
        ticket = random.choice(TICKET_TYPES)
        row_char = chr(65 + random.randint(0, 8))
        seat_num = f"{row_char}-{random.randint(1, 35)}"
        reg_date = (datetime(2026, 3, 1) + timedelta(days=random.randint(0, 20))).strftime("%Y-%m-%d")

        REGISTRATIONS.append({
            "registration_id": reg_counter,
            "sub_event_id": sub_id,
            "main_event_id": ev["main_event_id"],
            "participant_id": p["participant_id"],
            "registration_code": reg_code,
            "pass_code": reg_code,
            "ticket_type": ticket,
            "seat_number": seat_num,
            "checked_in": checked_in,
            "registration_date": reg_date,
            "qr_code_hash": hashlib.md5(reg_code.encode()).hexdigest()
        })

        # Generate Digital Certificate for all registrations
        is_winner = random.random() < 0.08
        rank = random.choice([1, 2, 3]) if is_winner else None
        cert_code = f"WIN-{rank}-{reg_code}" if is_winner else f"CERT-{reg_code}"
        prize_title = f"{'1st Place Gold Medalist' if rank == 1 else ('2nd Place Silver Medalist' if rank == 2 else '3rd Place Bronze Medalist')}" if is_winner else "Certificate of Participation"

        CERTIFICATES.append({
            "certificate_id": cert_counter,
            "certificate_code": cert_code,
            "registration_id": reg_counter,
            "participant_id": p["participant_id"],
            "sub_event_id": sub_id,
            "type": f"winner_rank_{rank}" if is_winner else "participation",
            "is_winner": is_winner,
            "rank": rank,
            "prize_title": prize_title,
            "issued_date": "2026-03-31",
            "verification_url": f"/api/certificates/verify/{cert_code}"
        })

        reg_counter += 1
        cert_counter += 1

# ---------------------------------------------------------------------------
# 8. CAMPUS ISSUES & PATHWAY BLOCKAGES
# ---------------------------------------------------------------------------
ISSUE_CATEGORIES = [
    ("Blocked Pathway", "Infrastructure", "High", True),
    ("Broken Streetlight", "Electrical", "Medium", False),
    ("Water Pipe Leakage", "Plumbing", "High", False),
    ("Elevator Maintenance", "Lift/Mechanical", "Medium", False),
    ("Air Conditioning Failure", "HVAC", "Low", False),
    ("Pathway Pothole / Construction", "Infrastructure", "Medium", True)
]

CAMPUS_ISSUES = []
issue_counter = 1
for i in range(1, 25):
    title, cat, sev, blocks_path = random.choice(ISSUE_CATEGORIES)
    loc = random.choice(LOCATIONS[:15])
    status = random.choice(["Reported", "Under Review", "Work in Progress", "Resolved"])
    reporter = random.choice(PARTICIPANTS[:20])
    created_at = (datetime(2026, 3, 10) + timedelta(days=random.randint(0, 15), hours=random.randint(0, 12))).strftime("%Y-%m-%d %H:%M:%S")

    affected_path_id = random.choice(PATHWAYS)["pathway_id"] if blocks_path else None

    CAMPUS_ISSUES.append({
        "issue_id": issue_counter,
        "title": f"{title} near {loc['short_name']}",
        "category": cat,
        "severity": sev,
        "status": status,
        "location_id": loc["location_id"],
        "blocks_pathway": blocks_path,
        "affected_pathway_id": affected_path_id,
        "reported_by_id": reporter["participant_id"],
        "reported_at": created_at,
        "ai_classified_priority": sev,
        "ai_confidence_score": round(random.uniform(0.85, 0.99), 2),
        "resolution_notes": "Assigned to Campus Works & Maintenance" if status != "Resolved" else "Fixed and verified by Field Engineer."
    })
    issue_counter += 1

# Mark first 2 affected pathways as blocked for Dijkstra route recalculation tests
for iss in CAMPUS_ISSUES:
    if iss["blocks_pathway"] and iss["affected_pathway_id"]:
        for pw in PATHWAYS:
            if pw["pathway_id"] == iss["affected_pathway_id"]:
                pw["is_currently_blocked"] = True
                break

# ---------------------------------------------------------------------------
# 9. HISTORICAL NAVIGATION LOGS (For Workload Replay & Analytics)
# ---------------------------------------------------------------------------
NAVIGATION_LOGS = []
STRATEGIES = ["shortest", "fastest", "accessible", "least_crowded", "emergency"]
MODES = ["pedestrian", "wheelchair", "bicycle", "shuttle"]

for nav_id in range(1, 151):
    src = random.choice(LOCATIONS)
    dst = random.choice([l for l in LOCATIONS if l["location_id"] != src["location_id"]])
    strat = random.choice(STRATEGIES)
    mode = "wheelchair" if strat == "accessible" else random.choice(MODES)
    user = random.choice(PARTICIPANTS[:40])
    dist = random.randint(80, 850)
    mins = max(1, round(dist / 1.3 / 60))
    ts = (datetime(2026, 3, 15) + timedelta(days=random.randint(0, 10), hours=random.randint(8, 20))).strftime("%Y-%m-%d %H:%M:%S")

    NAVIGATION_LOGS.append({
        "navigation_id": nav_id,
        "user_id": user["participant_id"],
        "source_location_id": src["location_id"],
        "destination_location_id": dst["location_id"],
        "strategy": strat,
        "transport_mode": mode,
        "calculated_distance_meters": dist,
        "estimated_walking_minutes": mins,
        "route_recalculated_due_to_block": random.choice([True, False, False]),
        "timestamp": ts
    })

# ---------------------------------------------------------------------------
# 10. HISTORICAL CROWD DENSITY & TELEMETRY
# ---------------------------------------------------------------------------
CROWD_DATA = []
crowd_counter = 1
for loc in LOCATIONS:
    for hour in range(8, 22):
        base_density = 75 if 12 <= hour <= 14 or 17 <= hour <= 19 else 35
        noise = random.randint(-15, 15)
        density = max(5, min(98, base_density + noise))
        crowd_level = "High" if density > 70 else ("Moderate" if density >= 35 else "Low")
        
        CROWD_DATA.append({
            "crowd_id": crowd_counter,
            "location_id": loc["location_id"],
            "hour_of_day": hour,
            "density_percentage": density,
            "crowd_level": crowd_level,
            "estimated_people_count": int(loc["capacity"] * (density / 100.0)),
            "recorded_date": "2026-03-20"
        })
        crowd_counter += 1

# ---------------------------------------------------------------------------
# 11. EXPORT TO JSON, CSV, SQL, AND DATA DICTIONARY
# ---------------------------------------------------------------------------
DATASET = {
    "metadata": {
        "dataset_name": "Chanakya Campus Navigator Common Benchmark Dataset",
        "version": "1.0.0",
        "generated_at": datetime.now().isoformat(),
        "random_seed": RANDOM_SEED,
        "institution": "Chanakya University Global Campus, Bengaluru",
        "course": "ECS351 - Software Architecture and Design Patterns",
        "record_counts": {
            "schools": len(SCHOOLS),
            "departments": len(DEPARTMENTS),
            "locations": len(ALL_LOCATIONS),
            "pathways": len(PATHWAYS),
            "main_events": len(MAIN_EVENTS),
            "sub_events": len(SUB_EVENTS),
            "participants": len(PARTICIPANTS),
            "registrations": len(REGISTRATIONS),
            "certificates": len(CERTIFICATES),
            "campus_issues": len(CAMPUS_ISSUES),
            "navigation_logs": len(NAVIGATION_LOGS),
            "crowd_records": len(CROWD_DATA)
        }
    },
    "schools": SCHOOLS,
    "departments": DEPARTMENTS,
    "locations": ALL_LOCATIONS,
    "pathways": PATHWAYS,
    "main_events": MAIN_EVENTS,
    "sub_events": SUB_EVENTS,
    "participants": PARTICIPANTS,
    "registrations": REGISTRATIONS,
    "certificates": CERTIFICATES,
    "campus_issues": CAMPUS_ISSUES,
    "navigation_logs": NAVIGATION_LOGS,
    "crowd_density": CROWD_DATA
}

# 1. Write JSON
json_path = os.path.join(BASE_DIR, "chanakya_common_dataset.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(DATASET, f, indent=2)
print(f"✅ Generated JSON dataset: {json_path}")

# 2. Write CSVs
def export_csv(filename, data_list):
    if not data_list: return
    p = os.path.join(CSV_DIR, filename)
    keys = data_list[0].keys()
    with open(p, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data_list)
    print(f"  • CSV: {filename} ({len(data_list)} rows)")

print("Exporting CSVs:")
export_csv("schools.csv", SCHOOLS)
export_csv("departments.csv", DEPARTMENTS)
export_csv("locations.csv", ALL_LOCATIONS)
export_csv("pathways.csv", PATHWAYS)
export_csv("main_events.csv", MAIN_EVENTS)
export_csv("sub_events.csv", SUB_EVENTS)
export_csv("participants.csv", PARTICIPANTS)
export_csv("registrations.csv", REGISTRATIONS)
export_csv("certificates.csv", CERTIFICATES)
export_csv("campus_issues.csv", CAMPUS_ISSUES)
export_csv("navigation_logs.csv", NAVIGATION_LOGS)
export_csv("crowd_density.csv", CROWD_DATA)

def esc(val):
    return str(val).replace("'", "''")

# 3. Write SQL Seed Script
sql_path = os.path.join(BASE_DIR, "seed_data.sql")
with open(sql_path, "w", encoding="utf-8") as f:
    f.write("-- ====================================================================\n")
    f.write("-- CHANAKYA CAMPUS NAVIGATOR - COMMON REPRODUCIBLE SEED SCRIPT (ECS351)\n")
    f.write(f"-- Generated with fixed random seed: {RANDOM_SEED}\n")
    f.write("-- ====================================================================\n\n")

    # Schools
    f.write("-- 1. SCHOOLS\n")
    for s in SCHOOLS:
        f.write(f"INSERT INTO schools (school_id, school_name, code) VALUES ({s['school_id']}, '{esc(s['name'])}', '{esc(s['code'])}') ON CONFLICT (school_id) DO NOTHING;\n")
    f.write("\n")

    # Departments
    f.write("-- 2. DEPARTMENTS\n")
    for d in DEPARTMENTS:
        f.write(f"INSERT INTO departments (department_id, school_id, name) VALUES ({d['department_id']}, {d['school_id']}, '{esc(d['name'])}') ON CONFLICT (department_id) DO NOTHING;\n")
    f.write("\n")

    # Locations
    f.write("-- 3. CAMPUS LOCATIONS\n")
    for l in ALL_LOCATIONS:
        f.write(f"INSERT INTO locations (location_id, name, short_name, category, lat, lng, capacity, floors, accessible, description) VALUES ('{esc(l['location_id'])}', '{esc(l['name'])}', '{esc(l['short_name'])}', '{esc(l['category'])}', {l['lat']}, {l['lng']}, {l['capacity']}, {l['floors']}, {l['accessible']}, '{esc(l['description'])}') ON CONFLICT (location_id) DO NOTHING;\n")
    f.write("\n")

    # Pathways
    f.write("-- 4. PATHWAYS\n")
    for p in PATHWAYS:
        f.write(f"INSERT INTO pathways (pathway_id, from_location_id, to_location_id, distance_meters, allowed_modes, is_accessible, surface_type, is_currently_blocked) VALUES ({p['pathway_id']}, '{esc(p['from_location_id'])}', '{esc(p['to_location_id'])}', {p['distance_meters']}, '{esc(p['allowed_modes'])}', {p['is_accessible']}, '{esc(p['surface_type'])}', {p['is_currently_blocked']}) ON CONFLICT (pathway_id) DO NOTHING;\n")
    f.write("\n")

    # Main Events
    f.write("-- 5. MAIN EVENTS\n")
    for me in MAIN_EVENTS:
        f.write(f"INSERT INTO main_events (main_event_id, name, description, school_id, start_date, end_date, campus, organizer) VALUES ({me['main_event_id']}, '{esc(me['name'])}', '{esc(me['description'])}', {me['school_id']}, '{me['start_date']}', '{me['end_date']}', '{esc(me['campus'])}', '{esc(me['organizer'])}') ON CONFLICT (main_event_id) DO NOTHING;\n")
    f.write("\n")

    # Sub Events
    f.write("-- 6. SUB EVENTS\n")
    for se in SUB_EVENTS:
        f.write(f"INSERT INTO sub_events (sub_event_id, main_event_id, name, category, type, venue_location_id, day, time, is_team_event, team_min, team_max, is_competition, max_capacity) VALUES ({se['sub_event_id']}, {se['main_event_id']}, '{esc(se['name'])}', '{esc(se['category'])}', '{esc(se['type'])}', '{esc(se['venue_location_id'])}', '{esc(se['day'])}', '{esc(se['time'])}', {se['is_team_event']}, {se['team_min']}, {se['team_max']}, {se['is_competition']}, {se['max_capacity']}) ON CONFLICT (sub_event_id) DO NOTHING;\n")
    f.write("\n")

print(f"✅ Generated SQL seed script: {sql_path}")

# 4. Write Data Dictionary
dict_path = os.path.join(BASE_DIR, "DATA_DICTIONARY.md")
with open(dict_path, "w", encoding="utf-8") as f:
    f.write("# Common Experimental Dataset Data Dictionary (ECS351)\n\n")
    f.write(f"**Seed**: `{RANDOM_SEED}` (Deterministic Python random engine)\n")
    f.write(f"**Campus**: Chanakya University Global Campus, Bengaluru\n\n")
    f.write("### Tables & Entity Schema\n\n")
    f.write("| Entity | Count | Key Fields | Description |\n")
    f.write("| :--- | :--- | :--- | :--- |\n")
    f.write(f"| **schools** | {len(SCHOOLS)} | `school_id, name, code` | 6 Chanakya University constituent academic schools |\n")
    f.write(f"| **departments** | {len(DEPARTMENTS)} | `department_id, school_id, name` | Academic faculties |\n")
    f.write(f"| **locations** | {len(ALL_LOCATIONS)} | `location_id, name, lat, lng, capacity` | Physical buildings, labs, sports fields, entrances, and walkway junctions |\n")
    f.write(f"| **pathways** | {len(PATHWAYS)} | `pathway_id, from_id, to_id, distance, modes` | Campus graph edges with distance in meters and accessibility flags |\n")
    f.write(f"| **main_events** | {len(MAIN_EVENTS)} | `main_event_id, name, dates, school` | 7 flagship conclaves (Samyuti, OJAS, Sports, Workshops, Srujana, Innovation, Carnival) |\n")
    f.write(f"| **sub_events** | {len(SUB_EVENTS)} | `sub_event_id, name, venue, max_capacity` | 62 technical, cultural, athletic competitions and workshops |\n")
    f.write(f"| **participants** | {len(PARTICIPANTS)} | `participant_id, name, roll_number, role` | 200 student, faculty, staff, and visitor accounts |\n")
    f.write(f"| **registrations** | {len(REGISTRATIONS)} | `registration_id, sub_event_id, code, qr` | Verified student-event registrations with digital passes |\n")
    f.write(f"| **certificates** | {len(CERTIFICATES)} | `certificate_id, code, rank, url` | Official digital certificates of participation and excellence |\n")
    f.write(f"| **campus_issues** | {len(CAMPUS_ISSUES)} | `issue_id, title, category, severity, status` | Infrastructure reports with AI classification and path blockage flags |\n")
    f.write(f"| **navigation_logs** | {len(NAVIGATION_LOGS)} | `navigation_id, src, dst, strategy, dist` | Historical pathfinding queries across 5 navigation strategies |\n")
    f.write(f"| **crowd_density** | {len(CROWD_DATA)} | `crowd_id, location_id, hour, density` | Hourly zone telemetry for crowd prediction and heatmaps |\n")

print(f"✅ Generated Data Dictionary: {dict_path}")
print("🎉 Phase 3 Dataset Generation Complete!")
