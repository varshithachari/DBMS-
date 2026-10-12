# 🎓 Chanakya Campus Connect & UtsavHub Full-Stack Platform

An enterprise-grade, full-stack digital campus and conclave management platform for **Chanakya University**, combining real-time IoT campus telemetry, interactive 3D map wayfinding, intelligent AI guidance, and **UtsavHub** hierarchical event management with Supabase and relational PostgreSQL persistence.

---

## 🏛️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                         CHANAKYA CAMPUS CONNECT CLIENTS                          │
│   • Top Omnibar & Spotlight (Ctrl+K)    • 3D Bento Hologram ID Cards             │
│   • Interactive Leaflet Campus Map      • Real-time WebSocket Telemetry Ticker   │
│   • UtsavHub Conclaves Desk             • QR Pass Scanner & Gate Check-in        │
│   • Operations & Executive Portal       • School Championship Standings          │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTP REST / WebSocket
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        NODE.JS & EXPRESS BACKEND ENGINE                          │
│   • Authentication Service (Bcrypt 10 rounds + JWT 7-day Session Management)     │
│   • Event Hierarchy Controller (School → Dept → Fest → Sub-Event → Roster)       │
│   • Attendance Verification & Digital Holographic Pass Generator                 │
│   • Real-Time Analytics & Aggregation Engine                                     │
│   • Scalability Engine (1,700+ Synthesized Realistic Records, 100/Sub-event)     │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
┌──────────────────────────────────┐            ┌──────────────────────────────────┐
│     TIER 1: SUPABASE CLOUD       │            │  TIER 2: RELATIONAL PERSISTENCE  │
│  • PostgreSQL DB Pool (pg)       │            │  • Zero-downtime Relational Store│
│  • Supabase GoTrue Auth API      │   <====>   │  • B-Tree / Map Composite Indexes│
│  • Row Level Security (RLS)      │  FALLBACK  │  • Foreign Key Constraints       │
│  • Realtime Subscriptions        │            │  • Duplicate Registration Traps  │
└──────────────────────────────────┘            └──────────────────────────────────┘
```

---

## 🗄️ Database Entity Hierarchy

The database models the authentic college event structure:
$$\text{School} \longrightarrow \text{Department} \longrightarrow \text{Main Event (Fest)} \longrightarrow \text{Sub-Event} \longrightarrow \text{Registrations} \longrightarrow \text{Participants / Teams}$$

### Entities & Relationships
1. **`schools`** (6 schools: Engineering & Tech, CS & AI, Management, Humanities, Basic Sciences, Law)
2. **`departments`** (14 departments linked to schools via `school_id`)
3. **`main_events`** (6 university fests: TechSangam, Dhwani, Srujana, Vidyut, Prajna, Urja)
4. **`sub_events`** (17 competitive tracks with capacity, deadlines, fee, categories, and point awards)
5. **`user_profiles`** (Authentic user profiles with bcrypt hashes, roles, and school/dept links)
6. **`registrations`** (Enforces unique constraint: `UNIQUE(sub_event_id, participant_id)`, allocated seats, QR code)
7. **`team_members`** (Supports group events with member rosters linked to `registration_id`)
8. **`attendance_records`** (Gate check-in timestamps, scanned by turnstiles and operators)
9. **`competition_results`** (Podium finishes: 1st Gold [100 pts], 2nd Silver [60 pts], 3rd Bronze [30 pts])
10. **`point_transactions`** (School and student point allocations for championship leaderboard)
11. **`certificates`** (Digital participation and winner certificates)
12. **`announcements`** (Live university-wide broadcasts)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v24.11.0)
- **npm** v9+

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/Rohan2276/SDAP.git
cd SDAP

# Install dependencies
npm.cmd install
```

### 3. Environment Configuration (`.env`)
Create a `.env` file in the project root:
```env
PORT=3000
JWT_SECRET=chanakya_campus_connect_jwt_secret_2026_production

# (Optional) Supabase Cloud Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# (Optional) Direct PostgreSQL Connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/chanakya_db
```

> [!NOTE]
> If cloud Supabase credentials are not provided or a tenant is paused, the application automatically runs on the built-in **High-Performance Relational Storage Engine** (`data/relationalStore.js`). The server reports the exact connection status and blocker transparently at `/api/database/status`.

### 4. Running the Application
```powershell
# Start the web platform
npm.cmd start
```
Access the application:
- **Main Portal**: `http://localhost:3000`
- **Login & Sign Up**: `http://localhost:3000/login`
- **Interactive Dashboard**: `http://localhost:3000/dashboard`
- **UtsavHub Conclaves**: `http://localhost:3000/dashboard?role=student` (Click *UtsavHub Conclaves & Regs*)
- **Operations Console**: `http://localhost:3000/admin-portal`

---

## 🧪 Testing & Verification

### Run End-to-End Test Suite (37 Automated Checks)
```powershell
npm.cmd test
```
**Verification Coverage:**
- ✅ Database health, adapter status, and blocker reporting
- ✅ Hierarchical discovery (`School → Department → Fest → Sub-event`)
- ✅ User Registration, Bcrypt 10-round password hashing, and JWT issuance
- ✅ Login verification with valid & invalid credential rejection (HTTP 401)
- ✅ Protected `/api/auth/me` token resolution
- ✅ Event Registration, seat allocation (`Row-Seat`), pass codes (`CU-S01-P0001-...`)
- ✅ Duplicate Registration Trap (`UNIQUE(sub_event, user)` HTTP 409 Conflict rejection)
- ✅ Turnstile Pass Scanner & Attendance Check-in with duplicate scan prevention
- ✅ Real-time School Championship Leaderboard calculations
- ✅ Analytical aggregations across 1,700+ registrations
- ✅ Static routes: `/login`, `/dashboard`, `/admin-portal`

---

## 📊 Measured Scalability Benchmark Results

Run the benchmark suite against 1,704 database records across 17 sub-events:
```powershell
npm.cmd run benchmark
```

### Measured Performance Summary
| Suite | Requests | Concurrency | Avg (ms) | P50 (ms) | P95 (ms) | Errors |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Registration Pagination (limit=25)** | 100 | 1 | 3.49 ms | 2.54 ms | 12.98 ms | **0** |
| **2. Hierarchical Filter Queries** | 100 | 1 | 0.70 ms | 1.07 ms | 1.84 ms | **0** |
| **3. Dashboard Analytics Aggregations** | 100 | 1 | 1.79 ms | 1.62 ms | 2.71 ms | **0** |
| **4. School Championship Leaderboard** | 100 | 1 | 0.02 ms | 0.01 ms | 0.04 ms | **0** |
| **5. Concurrent Reads (Batch)** | 50 | 50 | 2.63 ms | 2.46 ms | 3.72 ms | **0** |
| **6. Registration Insert & Duplicate Trap** | 20 | 1 | 0.02 ms | 0.01 ms | 0.07 ms | **0** |
| **7. User Authentication (Bcrypt+JWT)** | 20 | 1 | 83.79 ms | 83.00 ms | 91.73 ms | **0** |

*Overall error rate: **0.00%** across all test suites.*

---

## ⚡ Scalability Dataset Generator

To regenerate or scale the dataset:
```powershell
# Generate 100 registrations per sub-event (1,700+ records)
npm.cmd run dataset:generate

# Generate custom count per sub-event
node scripts/generate_scalability_dataset.js --count=150
```

---

## 🛡️ Database Migrations & SQL Setup

The SQL scripts in `migrations/` can be executed directly in the **Supabase SQL Editor** or **PostgreSQL psql**:
1. `migrations/001_initial_schema.sql`: DDL for all 12 relational tables, foreign keys, and constraints.
2. `migrations/002_rls_policies.sql`: Row Level Security policies protecting user profiles and registrations.
3. `migrations/003_indexes_and_views.sql`: Composite B-Tree indexes and aggregation SQL views (`view_school_stats`, `view_school_leaderboard`, `view_event_popularity`).

---

## 🔐 Pre-Configured Test Accounts

| Role | Email | Password | School / Dept |
| :--- | :--- | :--- | :--- |
| **Student** | `student@chanakya.edu` | `student123` | School of CS & AI |
| **Fresher** | `fresher@chanakya.edu` | `fresher123` | School of Engineering |
| **Faculty** | `faculty@chanakya.edu` | `faculty123` | CS & AI (Dr. Radhakrishnan) |
| **Staff** | `staff@chanakya.edu` | `staff123` | Facilities & Operations |
| **Admin** | `admin@chanakya.edu` | `admin123` | Executive Administration |
| **UtsavHub Lead** | `hanmanthraobd@gmail.com` | `Admin@123` | University Fest Lead |

---

## 📚 REST API Reference

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/database/status` | `GET` | Public | Real-time DB engine status, metrics, and cloud blocker |
| `/api/auth/register` | `POST` | Public | Register user with Bcrypt hash & JWT session |
| `/api/auth/login` | `POST` | Public | Authenticate user credentials & issue JWT |
| `/api/auth/me` | `GET` | Bearer | Current user session & school profile |
| `/api/schools` | `GET` | Public | List all 6 participating schools |
| `/api/departments` | `GET` | Public | List departments (filterable by `school_id`) |
| `/api/fests` | `GET` | Public | List campus conclaves and fests |
| `/api/sub-events` | `GET` | Public | List competitive tracks (filter by fest, category, type) |
| `/api/registrations/register` | `POST` | Bearer | Register for event (prevents duplicates, assigns seat) |
| `/api/registrations` | `GET` | Public | Paginated registrations roster with search & filters |
| `/api/registrations/check-in` | `POST` | Public | Turnstile gate scanner (marks attendance) |
| `/api/leaderboard/schools` | `GET` | Public | School championship medal & points standings |
| `/api/analytics/overview` | `GET` | Public | Real-time dashboard KPI metrics |
| `/api/scalability/generate` | `POST` | Public | Seed 1,700+ registrations (100 per sub-event) |
