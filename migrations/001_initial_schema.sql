-- ====================================================================
-- CHANAKYA CAMPUS CONNECT & UTSAVHUB UNIFIED SCHEMA MIGRATION 001
-- Target: PostgreSQL / Supabase
-- Hierarchy: School -> Department -> Main Event -> Sub-event -> Registration -> Participant/Team
-- ====================================================================

-- Enable UUID extension if in PostgreSQL / Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS schools (
    school_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    dean_name VARCHAR(150),
    banner_color VARCHAR(50) DEFAULT '#4F46E5',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    head_of_dept VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_dept_school_name UNIQUE (school_id, name)
);

-- 3. MAIN EVENTS (FESTS / FLAGSHIP CONCLAVES) TABLE
CREATE TABLE IF NOT EXISTS main_events (
    main_event_id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(school_id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    category VARCHAR(100) DEFAULT 'Technical Fest',
    description TEXT,
    venue_name VARCHAR(255) DEFAULT 'Chanakya Grand Auditorium',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'approved', -- 'pending_faculty', 'pending_dean', 'approved', 'completed', 'cancelled'
    banner_image VARCHAR(500) DEFAULT '/assets/images/chanakya_campus.png',
    featured BOOLEAN DEFAULT FALSE,
    max_capacity INTEGER DEFAULT 3500,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SUB-EVENTS TABLE
CREATE TABLE IF NOT EXISTS sub_events (
    sub_event_id SERIAL PRIMARY KEY,
    main_event_id INTEGER NOT NULL REFERENCES main_events(main_event_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Technical', 'Coding', 'Cultural', 'Robotics', 'Quiz', 'Gaming', 'Arts', 'Sports'
    type VARCHAR(50) DEFAULT 'Solo', -- 'Solo', 'Team'
    venue VARCHAR(255) NOT NULL,
    day VARCHAR(50) DEFAULT 'Day 1',
    time VARCHAR(100) DEFAULT '10:00 AM - 01:00 PM',
    max_capacity INTEGER DEFAULT 250,
    registration_fee NUMERIC(10, 2) DEFAULT 0.00,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    points_reward INTEGER DEFAULT 100,
    rules TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. USER PROFILES / PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id SERIAL PRIMARY KEY,
    auth_user_id UUID, -- References auth.users(id) in Supabase Auth
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- Secure bcrypt hash for direct auth / fallback
    name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(100),
    role VARCHAR(50) DEFAULT 'student', -- 'student', 'faculty', 'staff', 'admin', 'visitor'
    participant_type VARCHAR(50) DEFAULT 'internal', -- 'internal', 'external'
    school_id INTEGER REFERENCES schools(school_id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    avatar VARCHAR(100) DEFAULT '🎓',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
    registration_id SERIAL PRIMARY KEY,
    sub_event_id INTEGER NOT NULL REFERENCES sub_events(sub_event_id) ON DELETE CASCADE,
    main_event_id INTEGER NOT NULL REFERENCES main_events(main_event_id) ON DELETE CASCADE,
    participant_id INTEGER NOT NULL REFERENCES user_profiles(profile_id) ON DELETE CASCADE,
    registration_code VARCHAR(50) NOT NULL UNIQUE,
    ticket_type VARCHAR(100) DEFAULT 'Standard Delegate Pass',
    seat_number VARCHAR(50),
    team_name VARCHAR(150),
    team_size INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'attended', 'cancelled', 'waitlisted'
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_sub_event UNIQUE (sub_event_id, participant_id)
);

-- 7. TEAM MEMBERS TABLE (FOR GROUP EVENTS)
CREATE TABLE IF NOT EXISTS team_members (
    member_id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    roll_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ATTENDANCE RECORDS TABLE
CREATE TABLE IF NOT EXISTS attendance_records (
    attendance_id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    sub_event_id INTEGER NOT NULL REFERENCES sub_events(sub_event_id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scanned_by VARCHAR(255) DEFAULT 'Gate Scanner / Admin'
);

-- 9. COMPETITION RESULTS & WINNER RECORDS
CREATE TABLE IF NOT EXISTS competition_results (
    result_id SERIAL PRIMARY KEY,
    sub_event_id INTEGER NOT NULL REFERENCES sub_events(sub_event_id) ON DELETE CASCADE,
    participant_id INTEGER NOT NULL REFERENCES user_profiles(profile_id) ON DELETE CASCADE,
    registration_id INTEGER REFERENCES registrations(registration_id) ON DELETE SET NULL,
    rank INTEGER NOT NULL, -- 1 = 1st Place, 2 = 2nd Place, 3 = 3rd Place
    prize_title VARCHAR(150) NOT NULL, -- 'Winner / Gold', 'Runner Up', 'Second Runner Up'
    points_awarded INTEGER DEFAULT 100,
    published_by VARCHAR(150) DEFAULT 'Faculty Jury',
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sub_event_rank UNIQUE (sub_event_id, rank)
);

-- 10. SCHOOL & DEPARTMENT POINT TRANSACTIONS (FOR LIVE LEADERBOARDS)
CREATE TABLE IF NOT EXISTS point_transactions (
    transaction_id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(school_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    sub_event_id INTEGER REFERENCES sub_events(sub_event_id) ON DELETE SET NULL,
    points INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. DIGITAL CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    certificate_id SERIAL PRIMARY KEY,
    certificate_code VARCHAR(100) NOT NULL UNIQUE,
    registration_id INTEGER NOT NULL REFERENCES registrations(registration_id) ON DELETE CASCADE,
    participant_id INTEGER NOT NULL REFERENCES user_profiles(profile_id) ON DELETE CASCADE,
    sub_event_id INTEGER NOT NULL REFERENCES sub_events(sub_event_id) ON DELETE CASCADE,
    type VARCHAR(50) DEFAULT 'participation', -- 'participation', 'merit', 'winner'
    issued_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    fest_name VARCHAR(150),
    priority VARCHAR(50) DEFAULT 'normal', -- 'low', 'normal', 'urgent'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
