/**
 * Unified Authentication Service for Chanakya Campus Connect
 * Integrates Supabase Auth + Relational Database with Bcrypt & JWT.
 */

const dbAdapter = require('../config/database');
const relationalStore = require('../data/relationalStore');

class AuthService {
  async register(userData) {
    const { email, password, name, roll_number, role, school_id, department_id, participant_type } = userData;

    if (!email || !password || !name) {
      throw new Error("Full name, email address, and password are required.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // 1. Supabase Cloud Auth Integration if configured
    const supabase = dbAdapter.getSupabaseClient();
    let supabaseUser = null;

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            data: { name, role: role || 'student', school_id, department_id }
          }
        });
        if (error) throw error;
        supabaseUser = data.user;
      } catch (sbErr) {
        console.warn("[AuthService] Supabase Auth SignUp Notice:", sbErr.message);
        // Continue with database persistence
      }
    }

    // 2. Database Record Persistence with Bcrypt hashing
    const result = relationalStore.registerUser({
      email,
      password,
      name,
      roll_number,
      role: role || 'student',
      school_id,
      department_id,
      participant_type
    });

    if (supabaseUser) {
      result.user.auth_user_id = supabaseUser.id;
    }

    return result;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Supabase Cloud Auth verification if configured
    const supabase = dbAdapter.getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (error) {
          console.warn("[AuthService] Supabase Cloud SignIn notice:", error.message);
        }
      } catch (e) {
        // Continue to verify database hash
      }
    }

    // 2. Relational Database authentication
    const result = relationalStore.verifyLogin(cleanEmail, password);
    return result;
  }

  // Middleware to authenticate JWT token
  authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. Authentication token required." });
    }

    const user = relationalStore.verifyToken(token);
    if (!user) {
      return res.status(403).json({ error: "Invalid or expired authentication session." });
    }

    req.user = user;
    next();
  }

  // Role-based authorization middleware
  requireRole(allowedRoles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required." });
      }

      const userRole = (req.user.role || '').toLowerCase();
      const hasPermission = allowedRoles.some(r => r.toLowerCase() === userRole);

      if (!hasPermission) {
        return res.status(403).json({
          error: `Forbidden: This action requires one of the following roles: [${allowedRoles.join(', ')}]. Current role: '${userRole}'.`
        });
      }

      next();
    };
  }
}

module.exports = new AuthService();
