-- ====================================================================
-- CHANAKYA CAMPUS CONNECT & UTSAVHUB RLS POLICIES MIGRATION 002
-- Target: Supabase PostgreSQL
-- Purpose: Enforce fine-grained Row-Level Security
-- ====================================================================

-- 1. Enable RLS on all exposed tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE main_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 2. SCHOOLS & DEPARTMENTS: Publicly readable by all users (authenticated & anonymous)
CREATE POLICY "Schools are viewable by everyone" 
    ON schools FOR SELECT 
    USING (true);

CREATE POLICY "Departments are viewable by everyone" 
    ON departments FOR SELECT 
    USING (true);

-- 3. MAIN EVENTS & SUB-EVENTS: Viewable by everyone; Admin & Faculty can insert/update
CREATE POLICY "Events are viewable by everyone" 
    ON main_events FOR SELECT 
    USING (true);

CREATE POLICY "Sub-events are viewable by everyone" 
    ON sub_events FOR SELECT 
    USING (true);

CREATE POLICY "Faculty and Admins can create/manage events"
    ON main_events FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles 
            WHERE role IN ('admin', 'faculty')
        )
    );

CREATE POLICY "Faculty and Admins can create/manage sub_events"
    ON sub_events FOR ALL
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles 
            WHERE role IN ('admin', 'faculty')
        )
    );

-- 4. USER PROFILES:
-- Users can view basic profile info; can only edit their own profile
CREATE POLICY "Public profile view" 
    ON user_profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON user_profiles FOR UPDATE 
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile" 
    ON user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = auth_user_id OR auth_user_id IS NULL);

-- 5. REGISTRATIONS:
-- Users can see their own registrations; Admins and faculty can view all registrations
CREATE POLICY "Users can view their own registrations" 
    ON registrations FOR SELECT 
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles WHERE profile_id = registrations.participant_id
        )
        OR
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles WHERE role IN ('admin', 'faculty', 'staff')
        )
    );

CREATE POLICY "Authenticated users can create registrations" 
    ON registrations FOR INSERT 
    WITH CHECK (
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles WHERE profile_id = registrations.participant_id
        )
        OR
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles WHERE role = 'admin'
        )
    );

-- 6. CERTIFICATES:
-- Users can view their own certificates; Admins can view and create
CREATE POLICY "Users can view their own certificates" 
    ON certificates FOR SELECT 
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles WHERE profile_id = certificates.participant_id
        )
        OR
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles WHERE role IN ('admin', 'faculty')
        )
    );

-- 7. ANNOUNCEMENTS:
-- Everyone can read active announcements; Admins can manage
CREATE POLICY "Announcements are viewable by everyone" 
    ON announcements FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Admins can manage announcements" 
    ON announcements FOR ALL 
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM user_profiles WHERE role IN ('admin', 'faculty')
        )
    );

-- 8. COMPETITION RESULTS & LEADERBOARDS: Public read
CREATE POLICY "Results are viewable by everyone" 
    ON competition_results FOR SELECT 
    USING (true);

CREATE POLICY "Point transactions viewable by everyone" 
    ON point_transactions FOR SELECT 
    USING (true);
