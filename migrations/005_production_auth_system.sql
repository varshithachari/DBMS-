-- ====================================================================
-- CHANAKYA CAMPUS CONNECT & UTSAVHUB - PRODUCTION AUTHENTICATION SCHEMA
-- Target: PostgreSQL / Supabase
-- Tables: users, sessions, password_reset_tokens
-- ====================================================================

-- 1. USERS TABLE (Identity & Credentials Single Source of Truth)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    student_or_employee_id VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(150),
    academic_year VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'student', -- 'student', 'faculty', 'staff', 'admin'
    account_status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'pending'
    email_verified BOOLEAN DEFAULT TRUE,
    school_id INTEGER REFERENCES schools(school_id) ON DELETE SET NULL,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    avatar VARCHAR(50) DEFAULT '🎓',
    points INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_id_num UNIQUE (student_or_employee_id)
);

CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_student_id ON users (student_or_employee_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users (account_status);

-- 2. SESSIONS TABLE (Stateful Server-Managed Sessions & Multi-Device Control)
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255),
    session_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    remember_me BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions (session_expiry);

-- 3. PASSWORD RESET TOKENS TABLE (Single-Use, Time-Limited, Cryptographic Hash)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_id VARCHAR(100) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    used_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reset_token_hash ON password_reset_tokens (token_hash);
CREATE INDEX IF NOT EXISTS idx_reset_token_user ON password_reset_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_reset_token_expiry ON password_reset_tokens (expiry);

-- 4. Initial Trigger for updated_at
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_users_timestamp ON users;
CREATE TRIGGER trg_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();
