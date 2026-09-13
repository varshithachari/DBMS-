const store = require('../data/store');

class SimulationService {
  getScenarios() {
    return store.getAllSimulations();
  }

  runScenario(scenarioId) {
    const sim = store.runSimulation(scenarioId);
    
    // If scenario 2 (gate 1 closure), block the edge in store
    if (scenarioId === "SIM-002") {
      store.blockedPaths = [
        { from: "main_gate_1", to: "medical_center" },
        { from: "main_gate_1", to: "junc_south_avenue" }
      ];
    } else {
      store.blockedPaths = [];
    }

    return sim;
  }

  resetSimulation() {
    store.blockedPaths = [];
    store.campusStats.activeCampusPopulation = 4280;
    return { success: true, message: "Simulation state and pathways reset to baseline." };
  }

  feedLiveTelemetry(telemetryData) {
    return store.feedTelemetry(telemetryData);
  }
}

module.exports = new SimulationService();