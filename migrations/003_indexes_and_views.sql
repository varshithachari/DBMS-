-- ====================================================================
-- CHANAKYA CAMPUS CONNECT & UTSAVHUB INDEXES & VIEWS MIGRATION 003
-- Target: PostgreSQL / Supabase
-- Purpose: Query optimization, fast indexing, analytical views
-- ====================================================================

-- 1. PERFORMANCE INDEXES

-- Registrations lookup & filtering
CREATE INDEX IF NOT EXISTS idx_registrations_sub_event ON registrations(sub_event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_main_event ON registrations(main_event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_participant ON registrations(participant_id);
CREATE INDEX IF NOT EXISTS idx_registrations_code ON registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_date ON registrations(registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_composite_filter ON registrations(sub_event_id, status, checked_in);

-- Sub-events filtering
CREATE INDEX IF NOT EXISTS idx_sub_events_main_event ON sub_events(main_event_id);
CREATE INDEX IF NOT EXISTS idx_sub_events_category ON sub_events(category);
CREATE INDEX IF NOT EXISTS idx_sub_events_day ON sub_events(day);

-- Main events
CREATE INDEX IF NOT EXISTS idx_main_events_school ON main_events(school_id);
CREATE INDEX IF NOT EXISTS idx_main_events_dept ON main_events(department_id);
CREATE INDEX IF NOT EXISTS idx_main_events_status ON main_events(status);

-- Departments
CREATE INDEX IF NOT EXISTS idx_departments_school ON departments(school_id);

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_school ON user_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_dept ON user_profiles(department_id);

-- Results & Points
CREATE INDEX IF NOT EXISTS idx_competition_sub_event ON competition_results(sub_event_id);
CREATE INDEX IF NOT EXISTS idx_points_school ON point_transactions(school_id);

-- 2. ANALYTICAL AGGREGATION VIEWS

-- View: School Registration & Participation Breakdown
CREATE OR REPLACE VIEW view_school_stats AS
SELECT 
    s.school_id,
    s.name AS school_name,
    s.code AS school_code,
    COUNT(DISTINCT d.department_id) AS total_departments,
    COUNT(DISTINCT me.main_event_id) AS total_events,
    COUNT(DISTINCT se.sub_event_id) AS total_sub_events,
    COUNT(DISTINCT r.registration_id) AS total_registrations,
    COUNT(DISTINCT r.participant_id) AS unique_participants,
    COALESCE(SUM(pt.points), 0) AS total_points
FROM schools s
LEFT JOIN departments d ON s.school_id = d.school_id
LEFT JOIN main_events me ON s.school_id = me.school_id
LEFT JOIN sub_events se ON me.main_event_id = se.main_event_id
LEFT JOIN user_profiles p ON s.school_id = p.school_id
LEFT JOIN registrations r ON p.profile_id = r.participant_id
LEFT JOIN point_transactions pt ON s.school_id = pt.school_id
GROUP BY s.school_id, s.name, s.code;

-- View: Event & Sub-Event Popularity with Occupancy Rates
CREATE OR REPLACE VIEW view_event_popularity AS
SELECT 
    se.sub_event_id,
    se.name AS sub_event_name,
    se.category,
    se.type AS event_type,
    se.venue,
    me.name AS fest_name,
    s.name AS host_school,
    se.max_capacity,
    COUNT(r.registration_id) AS registration_count,
    ROUND((COUNT(r.registration_id)::DECIMAL / GREATEST(se.max_capacity, 1) * 100), 1) AS occupancy_percentage,
    COUNT(CASE WHEN r.checked_in = TRUE THEN 1 END) AS attended_count
FROM sub_events se
JOIN main_events me ON se.main_event_id = me.main_event_id
LEFT JOIN schools s ON me.school_id = s.school_id
LEFT JOIN registrations r ON se.sub_event_id = r.sub_event_id AND r.status != 'cancelled'
GROUP BY se.sub_event_id, se.name, se.category, se.type, se.venue, me.name, s.name, se.max_capacity;

-- View: School Championship Leaderboard
CREATE OR REPLACE VIEW view_school_leaderboard AS
SELECT 
    s.school_id,
    s.name AS school_name,
    s.code AS school_code,
    COALESCE(SUM(pt.points), 0) AS championship_points,
    COUNT(DISTINCT cr.result_id) AS total_podiums,
    COUNT(CASE WHEN cr.rank = 1 THEN 1 END) AS gold_medals,
    COUNT(CASE WHEN cr.rank = 2 THEN 1 END) AS silver_medals,
    COUNT(CASE WHEN cr.rank = 3 THEN 1 END) AS bronze_medals,
    COUNT(DISTINCT r.registration_id) AS participation_count
FROM schools s
LEFT JOIN point_transactions pt ON s.school_id = pt.school_id
LEFT JOIN user_profiles p ON s.school_id = p.school_id
LEFT JOIN competition_results cr ON p.profile_id = cr.participant_id
LEFT JOIN registrations r ON p.profile_id = r.participant_id
GROUP BY s.school_id, s.name, s.code
ORDER BY championship_points DESC, gold_medals DESC;
