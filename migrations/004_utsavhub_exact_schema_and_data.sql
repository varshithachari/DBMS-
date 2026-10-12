-- ============================================================================
-- UTSAVHUB EXACT SCHEMA & DATA MIGRATION SCRIPT
-- Integrated into Chanakya Campus Connect (SADP Project)
-- Source: varshithachari / UtsavHub Schema & Datasets
-- ============================================================================

-- 1. DROP EXISTING CONFLICTING TABLES SAFELY (CASCADE)
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS sub_events CASCADE;
DROP TABLE IF EXISTS main_events CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

-- 2. SCHOOLS TABLE
CREATE TABLE schools (
    school_id INT PRIMARY KEY,
    school_name VARCHAR(150) NOT NULL
);

INSERT INTO schools (school_id, school_name) VALUES
(1, 'School of Arts Humanities and Social Sciences'),
(2, 'School of Management Sciences'),
(3, 'School of Mathematics and Natural Sciences'),
(4, 'School of Law Governance and Public Policy'),
(5, 'School of Biosciences'),
(6, 'School of Engineering');

-- 3. PARTICIPANTS TABLE
CREATE TABLE participants (
    participant_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    email TEXT,
    school_id INT REFERENCES schools(school_id),
    department VARCHAR(100),
    program_type VARCHAR(10),
    year INT,
    gender VARCHAR(1),
    participant_type VARCHAR(20) DEFAULT 'internal',
    role VARCHAR(20) DEFAULT 'student'
);

INSERT INTO participants 
(name, roll_number, email, school_id, department, program_type, year, gender, participant_type, role)
VALUES
('Aarav Sharma', '24UG00001', 'aarav.sharma@chanakya.edu', 6, 'BTech CSE', 'UG', 2, 'M', 'internal', 'student'),
('Riya Verma', '23UG00045', 'riya.verma@chanakya.edu', 1, 'BA Economics', 'UG', 3, 'F', 'internal', 'student'),
('Karthik Reddy', '22UG00078', 'karthik.reddy@chanakya.edu', 6, 'BTech AI', 'UG', 4, 'M', 'internal', 'student'),
('Sneha Iyer', '24PG00012', 'sneha.iyer@chanakya.edu', 3, 'MSc Data Science', 'PG', 1, 'F', 'internal', 'student'),
('Rahul Mehta', '23UG00110', 'rahul.mehta@chanakya.edu', 2, 'BBA', 'UG', 3, 'M', 'internal', 'student'),
('Ananya Das', '24UG00221', 'ananya.das@chanakya.edu', 1, 'BA Political Science', 'UG', 2, 'F', 'internal', 'student'),
('Aditya Singh', '22UG00310', 'aditya.singh@chanakya.edu', 6, 'BTech Mechanical', 'UG', 4, 'M', 'internal', 'student'),
('Priya Nair', '23PG00009', 'priya.nair@chanakya.edu', 5, 'Bioengineering', 'PG', 1, 'F', 'internal', 'student'),
('Vikram Patel', '24UG00401', 'vikram.patel@chanakya.edu', 4, 'BA LLB', 'UG', 2, 'M', 'internal', 'student'),
('Megha Jain', '23UG00234', 'megha.jain@chanakya.edu', 3, 'BSc Physics', 'UG', 3, 'F', 'internal', 'student');

-- 4. MAIN EVENTS (FESTS)
CREATE TABLE main_events (
    main_event_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    school_id INT REFERENCES schools(school_id),
    start_date DATE,
    end_date DATE,
    campus VARCHAR(100) DEFAULT 'Global Campus',
    organizer VARCHAR(100) DEFAULT 'University Student Council'
);

INSERT INTO main_events (main_event_id, name, description, school_id, start_date, end_date, campus, organizer)
VALUES
(1, 'Samyuti', 'Annual Technical & Cultural Fest', 6, '2026-03-28', '2026-03-30', 'Global Campus', 'School of Engineering'),
(2, 'OJAS', 'Intra-University Flagship Conclave', 1, '2026-04-20', '2026-04-22', 'Global Campus', 'School of Arts & Management'),
(3, 'Sports', 'Annual Sports Olympiad & Athletic Meet', 6, '2026-02-15', '2026-02-20', 'Sports Arena', 'Department of Physical Education'),
(4, 'Workshops', 'Skill Development & Professional Bootcamps', 6, '2026-05-01', '2026-05-05', 'Innovation Lab', 'Chanakya Tech Council'),
(5, 'Srujana Tech Fest', 'Celebrating Creation, Fueling Innovation', 6, '2025-09-13', '2025-09-15', 'Global Campus Lab', 'School of Engineering'),
(6, 'Innovation Summit', 'Future-focused fest on AI, Robotics, and Startups', 6, '2026-08-10', '2026-08-12', 'Tech Park Auditorium', 'Incubation Centre'),
(7, 'Cultural Carnival', 'Music, Dance, Theatre, Fashion Show Extravaganza', 1, '2026-11-05', '2026-11-07', 'Central Amphitheatre', 'Cultural Affairs Committee');

-- Reset identity for main_events if needed
SELECT setval(pg_get_serial_sequence('main_events', 'main_event_id'), 7);

-- 5. SUB EVENTS
CREATE TABLE sub_events (
    sub_event_id SERIAL PRIMARY KEY,
    main_event_id INT REFERENCES main_events(main_event_id),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50),
    type VARCHAR(20) DEFAULT 'Solo', -- 'Solo' or 'Group'
    venue VARCHAR(100),
    day VARCHAR(50),
    time VARCHAR(50),
    is_team_event BOOLEAN DEFAULT FALSE,
    team_min INT DEFAULT 1,
    team_max INT DEFAULT 1,
    is_competition BOOLEAN DEFAULT TRUE
);

-- 5a. Samyuti Events
INSERT INTO sub_events (name, category, main_event_id, type, venue, day, time, is_team_event, team_min, team_max, is_competition) VALUES
('IKS Hackathon', 'Technical', 1, 'Group', 'Innovation Lab', 'Day 1-2', '48 Hours', TRUE, 2, 4, TRUE),
('Hardware Hackathon', 'Technical', 1, 'Group', 'Engineering Workshop', 'Day 1-2', '48 Hours', TRUE, 2, 4, TRUE),
('E-Sports Valorant', 'Technical', 1, 'Group', 'Gaming Arena', 'Day 2', '6:00-9:00pm', TRUE, 5, 5, TRUE),
('Indic Game Jam', 'Technical', 1, 'Group', 'Computer Lab', 'Day 2', '10:00-4:00pm', TRUE, 2, 4, TRUE),
('Vastra Verse', 'Cultural', 1, 'Solo', 'Auditorium', 'Day 1', '11:00-1:00pm', FALSE, 1, 1, TRUE),
('Drishti Manthan', 'Cultural', 1, 'Group', 'Seminar Hall', 'Day 1', 'Full Day', TRUE, 1, 5, TRUE),
('Smrithi Mandaara', 'Cultural', 1, 'Solo', 'Auditorium', 'Day 1', '1 Hour', FALSE, 1, 1, TRUE),
('IKS Quiz', 'Technical', 1, 'Group', 'Room 202', 'Day 3', '2:00-3:00pm', TRUE, 1, 2, TRUE),
('Treasure Hunt', 'Technical', 1, 'Group', 'Campus Grounds', 'Day 3', '3:00-5:00pm', TRUE, 2, 4, TRUE);

-- 5b. OJAS Events
INSERT INTO sub_events (name, category, main_event_id, type, venue, day, time, is_team_event, team_min, team_max, is_competition) VALUES
('Guess the Personality', 'Cultural', 2, 'Group', 'Room 101', 'Day 1', '3:00-4:30pm', TRUE, 2, 4, TRUE),
('Classical Vocal Solo', 'Music', 2, 'Solo', 'Acad 1 Room 101', 'Day 1', '9:30-10:30am', FALSE, 1, 1, TRUE),
('Contemporary Group Dance', 'Dance', 2, 'Group', 'Preksha Auditorium', 'Day 1', '03:30-05:00pm', TRUE, 4, 10, TRUE),
('Elocution', 'Literary', 2, 'Solo', 'Room 101', 'Day 1', '02:00-03:00pm', FALSE, 1, 1, TRUE),
('Reel Making', 'Media', 2, 'Group', 'Room 101', 'Day 1', '11:30-12:00pm', TRUE, 2, 3, TRUE),
('Poetry – Kannada', 'Literary', 2, 'Solo', 'Room 122', 'Day 1', '10:30-11:30am', FALSE, 1, 1, TRUE),
('Shark Tank', 'Management', 2, 'Group', 'TBD', 'Day 2', '10:00am onwards', TRUE, 2, 4, TRUE),
('Light Vocal Solo', 'Music', 2, 'Solo', 'Room 101', 'Day 1', '9:30 onwards', FALSE, 1, 1, TRUE),
('Western Group Song', 'Music', 2, 'Group', 'Room 101', 'Day 1', '11:30 onwards', TRUE, 3, 8, TRUE),
('Poster Making', 'Arts', 2, 'Solo', 'Room 222', 'Day 2', '10:30-12:30pm', FALSE, 1, 1, TRUE),
('Treasure Hunt', 'Quiz', 2, 'Group', 'Entire Campus', 'Day 2', '9:30-12:30pm', TRUE, 3, 5, TRUE),
('Speech – Kannada', 'Literary', 2, 'Solo', 'Room 101', 'Day 2', '09:30am', FALSE, 1, 1, TRUE),
('Mono Acting', 'Theatre', 2, 'Solo', 'Room 222', 'Day 2', '10:30-11:30am', FALSE, 1, 1, TRUE),
('Skit', 'Theatre', 2, 'Group', 'Auditorium', 'Day 1', '10:30-11:30am', TRUE, 3, 7, TRUE),
('Essay – Kannada', 'Literary', 2, 'Solo', 'Room 401', 'Day 1', '3:00-4:00pm', FALSE, 1, 1, TRUE),
('Poetry – English', 'Literary', 2, 'Solo', 'Room 401', 'Day 1', '12:00-1:00pm', FALSE, 1, 1, TRUE),
('Short Movie', 'Media', 2, 'Group', 'Auditorium', 'Day 1', '11:40am-12:40pm', TRUE, 2, 6, TRUE),
('Western Vocal Solo', 'Music', 2, 'Solo', 'Acad 1 Room 101', 'Day 1', '10:30am', FALSE, 1, 1, TRUE),
('Western Instrumental Solo', 'Music', 2, 'Solo', 'Auditorium', 'Day 2', '9:30am', FALSE, 1, 1, TRUE),
('Classical Instrumental Solo', 'Music', 2, 'Solo', 'Auditorium', 'Day 2', '10:30am', FALSE, 1, 1, TRUE),
('Painting', 'Arts', 2, 'Solo', 'Central Plaza', 'Day 1', '4:30pm', FALSE, 1, 1, TRUE),
('Quiz', 'Quiz', 2, 'Group', 'Room 2B19', 'Day 1', '2:00pm', TRUE, 2, 3, TRUE),
('Classical Solo Dance', 'Dance', 2, 'Solo', 'Auditorium', 'Day 2', '11:30am-12:30pm', FALSE, 1, 1, TRUE),
('Contemporary Solo Dance', 'Dance', 2, 'Solo', 'Auditorium', 'Day 1', '2:00-3:00pm', FALSE, 1, 1, TRUE),
('Debate – English', 'Debate', 2, 'Solo', '2A01', 'Day 1', '11:30am', FALSE, 1, 1, TRUE),
('Folk Song Solo', 'Music', 2, 'Solo', '2A02', 'Day 1', '12:30pm', FALSE, 1, 1, TRUE),
('Bhagavad-Gita Chanting', 'Spiritual', 2, 'Solo', 'Temple', 'Day 1', '4:00pm', FALSE, 1, 1, TRUE),
('Website & App Development', 'Technical', 2, 'Group', 'Acad 2 UB6', 'Day 1', '2:30-5:00pm', TRUE, 2, 4, TRUE),
('E-Sport', 'Technical', 2, 'Group', '2B29', 'Day 1', '11:00-1:30pm', TRUE, 4, 5, TRUE),
('Debate – Kannada', 'Debate', 2, 'Solo', '2B19', 'Day 1', '2:30-3:30pm', FALSE, 1, 1, TRUE),
('Essay Writing – English', 'Literary', 2, 'Solo', '2B19', 'Day 1', '11:00-12:00pm', FALSE, 1, 1, TRUE),
('Photography', 'Photography', 2, 'Solo', 'Front Yard', 'Day 1', '10:00am-5:00pm', FALSE, 1, 1, TRUE);

-- 5c. Workshops
INSERT INTO sub_events (name, category, main_event_id, type, venue, day, time, is_team_event, team_min, team_max, is_competition) VALUES
('AI & Machine Learning Workshop', 'Technical', 4, 'Solo', 'Computer Lab', 'Day 1', '10:00-4:00pm', FALSE, 1, 1, FALSE),
('Robotics Hands-On Workshop', 'Technical', 4, 'Group', 'Engineering Lab', 'Day 2', '10:00-4:00pm', TRUE, 2, 3, FALSE),
('Entrepreneurship Bootcamp', 'Management', 4, 'Group', 'Seminar Hall', 'Day 2', '2:00-6:00pm', TRUE, 2, 4, FALSE),
('Cybersecurity Basics', 'Technical', 4, 'Solo', 'Computer Lab', 'Day 3', '10:00-1:00pm', FALSE, 1, 1, FALSE),
('CAD Design Workshop', 'Technical', 4, 'Solo', 'Design Studio', 'Day 3', '2:00-5:00pm', FALSE, 1, 1, FALSE);

-- 5d. Srujana Tech Fest
INSERT INTO sub_events (name, category, main_event_id, type, venue, day, time, is_team_event, team_min, team_max, is_competition) VALUES
('Hackathon', 'Technical', 5, 'Group', 'Global Campus Lab', 'Day 1-2', '48 Hours', TRUE, 2, 4, TRUE),
('Logic Loop', 'Electronics', 5, 'Solo', 'Lab 101', 'Day 1', '2:00-4:00pm', FALSE, 1, 1, TRUE),
('CAD Clash', 'Design', 5, 'Solo', 'CAD Lab', 'Day 2', '10:00-12:00pm', FALSE, 1, 1, TRUE),
('Ideathon', 'Innovation', 5, 'Group', 'Seminar Hall', 'Day 2', '3:00-5:00pm', TRUE, 2, 4, TRUE),
('Pixel Poetry', 'UI/UX', 5, 'Solo', 'Design Studio', 'Day 1', '11:00-3:00pm', FALSE, 1, 1, TRUE),
('Syntax Saga', 'Coding', 5, 'Solo', 'CS Lab', 'Day 1', '9:00-11:00am', FALSE, 1, 1, TRUE),
('Prompt to Product', 'Innovation', 5, 'Group', 'Auditorium', 'Day 3', '2:00-6:00pm', TRUE, 2, 4, TRUE);

-- 5e. Innovation Summit
INSERT INTO sub_events (name, category, main_event_id, type, venue, day, time, is_team_event, team_min, team_max, is_competition) VALUES
('AI Startup Pitch', 'Management', 6, 'Group', 'Auditorium', 'Day 1', '2:00-4:00pm', TRUE, 2, 4, TRUE),
('Robotics Challenge', 'Technical', 6, 'Group', 'Engineering Lab', 'Day 2', '10:00-1:00pm', TRUE, 2, 4, TRUE),
('Future Tech Quiz', 'Quiz', 6, 'Solo', 'Room 202', 'Day 2', '3:00-4:00pm', FALSE, 1, 1, TRUE);

-- 5f. Cultural Carnival
INSERT INTO sub_events (name, category, main_event_id, type, venue, day, time, is_team_event, team_min, team_max, is_competition) VALUES
('Fashion Show', 'Cultural', 7, 'Group', 'Central Plaza', 'Day 2', '6:00-8:00pm', TRUE, 4, 12, TRUE),
('Drama Competition', 'Theatre', 7, 'Group', 'Auditorium', 'Day 1', '3:00-5:00pm', TRUE, 3, 8, TRUE),
('Music Night', 'Music', 7, 'Group', 'Open Stage', 'Day 2', '7:00-10:00pm', TRUE, 2, 6, FALSE);

-- 6. TEAMS TABLE
CREATE TABLE teams (
    team_id INT PRIMARY KEY,
    sub_event_id INT REFERENCES sub_events(sub_event_id),
    team_name VARCHAR(100) NOT NULL
);

INSERT INTO teams (team_id, sub_event_id, team_name) VALUES
(1, 1, 'Code Titans'),
(2, 1, 'AI Innovators'),
(3, 2, 'Hardware Heroes'),
(4, 3, 'Valorant Squad'),
(5, 4, 'Game Creators'),
(6, 9, 'Campus Hunters');

-- 7. TEAM MEMBERS TABLE
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(team_id),
    participant_id INT REFERENCES participants(participant_id)
);

INSERT INTO team_members (team_id, participant_id) VALUES
(1, 1), (1, 3),
(2, 4), (2, 2),
(3, 7),
(4, 1), (4, 3), (4, 5), (4, 9), (4, 10);

-- 8. REGISTRATIONS TABLE
CREATE TABLE registrations (
    registration_id SERIAL PRIMARY KEY,
    sub_event_id INT REFERENCES sub_events(sub_event_id),
    participant_id INT REFERENCES participants(participant_id),
    main_event_id INT REFERENCES main_events(main_event_id),
    team_id INT REFERENCES teams(team_id),
    registration_code VARCHAR(50) UNIQUE,
    registration_date DATE DEFAULT CURRENT_DATE
);

INSERT INTO registrations 
(registration_id, sub_event_id, participant_id, main_event_id, team_id, registration_code, registration_date)
VALUES
(1, 1, 1, 1, 1, 'CU-S01-P0001-CT01', '2026-03-20'),
(2, 1, 4, 1, 2, 'CU-S01-P0004-AI02', '2026-03-20'),
(3, 2, 7, 1, 3, 'CU-S02-P0007-HH03', '2026-03-21'),
(4, 3, 1, 1, 4, 'CU-S03-P0001-VS04', '2026-03-22'),
(5, 5, 2, 1, NULL, 'CU-S05-P0002-VV05', '2026-03-22'),
(6, 6, 5, 1, 5, 'CU-S06-P0005-DM06', '2026-03-23'),
(7, 7, 6, 1, NULL, 'CU-S07-P0006-SM07', '2026-03-23'),
(8, 8, 2, 1, 2, 'CU-S08-P0002-IQ08', '2026-03-24'),
(9, 9, 7, 1, 6, 'CU-S09-P0007-TH09', '2026-03-24');

SELECT setval(pg_get_serial_sequence('registrations', 'registration_id'), 9);

-- 9. RESULTS TABLE (PODIUMS & RANKS)
CREATE TABLE results (
    result_id INT PRIMARY KEY,
    sub_event_id INT REFERENCES sub_events(sub_event_id),
    team_id INT REFERENCES teams(team_id),
    participant_id INT REFERENCES participants(participant_id),
    rank INT NOT NULL
);

INSERT INTO results 
(result_id, sub_event_id, team_id, participant_id, rank)
VALUES
(1, 1, 1, 1, 1), -- Code Titans: 1st
(2, 1, 2, 4, 2), -- AI Innovators: 2nd
(3, 2, 3, 7, 1), -- Hardware Heroes: 1st
(4, 3, 4, 1, 1), -- Valorant Squad: 1st
(5, 5, NULL, 2, 1), -- Riya Verma (Vastra Verse): 1st
(6, 7, NULL, 6, 1), -- Ananya Das (Smrithi Mandaara): 1st
(7, 9, 6, 7, 1); -- Campus Hunters: 1st

-- 10. CERTIFICATES TABLE (PARTICIPATION & WINNER CERTIFICATES)
CREATE TABLE certificates (
    certificate_id SERIAL PRIMARY KEY,
    certificate_code VARCHAR(100) UNIQUE NOT NULL,
    registration_id INT REFERENCES registrations(registration_id),
    participant_id INT REFERENCES participants(participant_id),
    sub_event_id INT REFERENCES sub_events(sub_event_id),
    type VARCHAR(50) NOT NULL, -- 'participation' OR 'winner'
    rank INT,                 -- NULL for participation; 1, 2, 3 for winners
    prize_title VARCHAR(150),
    issued_date DATE DEFAULT CURRENT_DATE,
    qr_verification_code VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10a. Seed Participation Certificates for Registrations 1-9
INSERT INTO certificates 
(certificate_code, registration_id, participant_id, sub_event_id, type, rank, prize_title, issued_date, qr_verification_code)
VALUES
('CERT-PART-CU-S01-P0001-CT01', 1, 1, 1, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-01'),
('CERT-PART-CU-S01-P0004-AI02', 2, 4, 1, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-02'),
('CERT-PART-CU-S02-P0007-HH03', 3, 7, 2, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-03'),
('CERT-PART-CU-S03-P0001-VS04', 4, 1, 3, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-04'),
('CERT-PART-CU-S05-P0002-VV05', 5, 2, 5, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-05'),
('CERT-PART-CU-S06-P0005-DM06', 6, 5, 6, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-06'),
('CERT-PART-CU-S07-P0006-SM07', 7, 6, 7, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-07'),
('CERT-PART-CU-S08-P0002-IQ08', 8, 2, 8, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-08'),
('CERT-PART-CU-S09-P0007-TH09', 9, 7, 9, 'participation', NULL, 'Certificate of Active Participation', '2026-03-30', 'CHANAKYA-VERIFY-PART-09');

-- 10b. Seed Winner Certificates for Results 1-7
INSERT INTO certificates 
(certificate_code, registration_id, participant_id, sub_event_id, type, rank, prize_title, issued_date, qr_verification_code)
VALUES
('CERT-WIN-1-CU-S01-P0001-CT01', 1, 1, 1, 'winner', 1, 'Hackathon Champion (1st Place Gold Medalist)', '2026-03-30', 'CHANAKYA-VERIFY-WIN-01'),
('CERT-WIN-2-CU-S01-P0004-AI02', 2, 4, 1, 'winner', 2, 'Hackathon Runner-Up (2nd Place Silver Medalist)', '2026-03-30', 'CHANAKYA-VERIFY-WIN-02'),
('CERT-WIN-1-CU-S02-P0007-HH03', 3, 7, 2, 'winner', 1, 'Hardware Hackathon Winner (1st Place)', '2026-03-30', 'CHANAKYA-VERIFY-WIN-03'),
('CERT-WIN-1-CU-S03-P0001-VS04', 4, 1, 3, 'winner', 1, 'Valorant E-Sports Champion (1st Place)', '2026-03-30', 'CHANAKYA-VERIFY-WIN-04'),
('CERT-WIN-1-CU-S05-P0002-VV05', 5, 2, 5, 'winner', 1, 'Vastra Verse Cultural Winner (1st Place)', '2026-03-30', 'CHANAKYA-VERIFY-WIN-05'),
('CERT-WIN-1-CU-S07-P0006-SM07', 7, 6, 7, 'winner', 1, 'Smrithi Mandaara Literary Winner (1st Place)', '2026-03-30', 'CHANAKYA-VERIFY-WIN-06'),
('CERT-WIN-1-CU-S09-P0007-TH09', 9, 7, 9, 'winner', 1, 'Campus Treasure Hunt Winner (1st Place)', '2026-03-30', 'CHANAKYA-VERIFY-WIN-07');
