const store = require('../data/store');

class IssueService {
  getIssues(status) {
    return store.getAllIssues(status);
  }

  report(data) {
    // Intelligent AI classification logic based on title and description
    const text = (data.title + ' ' + (data.description || '')).toLowerCase();
    
    let category = "General Maintenance";
    let severity = "Medium";
    let confidence = 0.92;
    let suggestion = "Dispatch field technician for on-site inspection.";

    if (text.includes("audio") || text.includes("mic") || text.includes("sound") || text.includes("projector") || text.includes("screen") || text.includes("display")) {
      category = "AV & Sound Systems";
      severity = text.includes("auditorium") || text.includes("event") ? "High" : "Medium";
      confidence = 0.97;
      suggestion = "Check wireless RF mic frequency interference and HDMI switcher input.";
    } else if (text.includes("electric") || text.includes("spark") || text.includes("charging") || text.includes("power") || text.includes("wire")) {
      category = "Electrical & Safety";
      severity = "High";
      confidence = 0.96;
      suggestion = "Isolate circuit breaker and verify grounding with multimeter.";
    } else if (text.includes("water") || text.includes("leak") || text.includes("faucet") || text.includes("pipe") || text.includes("restroom") || text.includes("drain")) {
      category = "Plumbing & Sanitation";
      severity = text.includes("burst") ? "High" : "Low";
      confidence = 0.98;
      suggestion = "Inspect pressure valve and replace washer seal.";
    } else if (text.includes("wifi") || text.includes("internet") || text.includes("network") || text.includes("server") || text.includes("login")) {
      category = "IT & Campus Network";
      severity = "Medium";
      confidence = 0.95;
      suggestion = "Check access point telemetry and restart gateway switch.";
    } else if (text.includes("crowd") || text.includes("stampede") || text.includes("block") || text.includes("hazard")) {
      category = "Safety & Crowd Control";
      severity = "High";
      confidence = 0.94;
      suggestion = "Alert campus security desk and deploy volunteers to manage pedestrian queue.";
    }

    return store.reportIssue({
      ...data,
      category: data.category || category,
      aiCategoryConfidence: confidence,
      aiSeverity: data.aiSeverity || severity,
      aiActionSuggestion: suggestion
    });
  }

  updateStatus(id, status, assignedTo, notes) {
    return store.updateIssueStatus(id, status, assignedTo, notes);
  }
}

module.exports = new IssueService();