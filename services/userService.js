const campusConfig = require('../config/campusConfig');

class UserService {
  getRoles() {
    return campusConfig.roles;
  }

  getRoleDetails(roleKey) {
    return campusConfig.roles[roleKey] || campusConfig.roles.student;
  }

  getMockProfiles() {
    return [
      { id: "USR-001", name: "Aryan Verma", email: "aryan.v@chanakyauniversity.edu.in", role: "student", dept: "B.Tech Computer Science & AI (Year 3)", avatar: "👨‍🎓" },
      { id: "USR-002", name: "Ananya Sharma", email: "ananya.s@chanakyauniversity.edu.in", role: "new_student", dept: "B.A. Public Policy & Economics (Fresher 2026)", avatar: "👩‍🎓" },
      { id: "USR-003", name: "Prof. Rajesh Sharma", email: "rajesh.sharma@chanakyauniversity.edu.in", role: "faculty", dept: "Department of AI & Data Science", avatar: "👨‍🏫" },
      { id: "USR-004", name: "Karthik R.", email: "karthik.ops@chanakyauniversity.edu.in", role: "staff", dept: "Campus Infrastructure & AV Operations", avatar: "👷" },
      { id: "USR-005", name: "Vikramaditya Rao", email: "v.rao@garudaaerospace.com", role: "visitor", dept: "Industry Speaker & Corporate Partner", avatar: "👔" },
      { id: "USR-006", name: "Dr. C. N. Ramanathan", email: "dean.computing@chanakyauniversity.edu.in", role: "admin", dept: "Dean of Computing & University Director", avatar: "🎓" }
    ];
  }
}

module.exports = new UserService();