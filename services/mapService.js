const campusConfig = require('../config/campusConfig');
const store = require('../data/store');

class MapService {
  constructor() {
    this.nodes = {};
    this.edges = [];
    this.initCampusGraph();
  }

  initCampusGraph() {
    // Add all landmark nodes
    campusConfig.landmarks.forEach(lm => {
      this.nodes[lm.id] = {
        id: lm.id,
        name: lm.name,
        shortName: lm.shortName,
        category: lm.category,
        lat: lm.lat,
        lng: lm.lng,
        accessible: lm.accessible
      };
    });

    // Add intermediate walkway junction nodes matching physical pathways and roads
    const junctions = [
      { id: "junc_main_gate", name: "South Gate Security Crossway", shortName: "Gate Cross", category: "Junction", lat: 13.2203, lng: 77.7542, accessible: true },
      { id: "junc_south_entry", name: "Boulevard Roundabout Ingress", shortName: "South Ingress", category: "Junction", lat: 13.2215, lng: 77.7548, accessible: true },
      { id: "junc_circle_south", name: "Central Circle South Concourse", shortName: "South Concourse", category: "Junction", lat: 13.2220, lng: 77.7551, accessible: true },
      { id: "junc_circle_center", name: "Central Academic Quad Fountain Center", shortName: "Quad Center", category: "Junction", lat: 13.222871, lng: 77.755633, accessible: true },
      { id: "junc_circle_east", name: "Academic Ring East Junction", shortName: "East Ring", category: "Junction", lat: 13.2232, lng: 77.7568, accessible: true },
      { id: "junc_circle_north", name: "Academic Ring North Concourse", shortName: "North Concourse", category: "Junction", lat: 13.2237, lng: 77.7565, accessible: true },
      { id: "junc_sports_boulevard", name: "Sports Boulevard North Turn", shortName: "Sports Turn", category: "Junction", lat: 13.2270, lng: 77.7584, accessible: true }
    ];

    junctions.forEach(j => {
      this.nodes[j.id] = j;
    });

    // Campus pathways graph (bidirectional edges with distance in meters & modal support)
    this.edges = [
      // Main Entrance & Security Gate
      { from: "main_gate_1", to: "junc_main_gate", dist: 30, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "junc_main_gate", to: "entry_gate", dist: 40, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "junc_main_gate", to: "medical_center", dist: 80, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      
      // Entrance Boulevard heading to Central Quad
      { from: "entry_gate", to: "junc_south_entry", dist: 110, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "medical_center", to: "junc_south_entry", dist: 60, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "exit_gate", to: "junc_south_entry", dist: 75, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "exit_gate", to: "main_gate_1", dist: 120, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },

      // Ingress to Circular Academic Ring
      { from: "junc_south_entry", to: "junc_circle_south", dist: 70, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "junc_circle_south", to: "admin_block", dist: 45, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "admin_block", to: "central_library", dist: 35, modes: ["pedestrian", "wheelchair", "bicycle"] },
      
      // Central Circle Quad & Hub
      { from: "junc_circle_south", to: "junc_circle_center", dist: 95, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "admin_block", to: "junc_circle_center", dist: 80, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "central_circle", to: "junc_circle_center", dist: 10, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "junc_circle_center", to: "convention_hall", dist: 85, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "junc_circle_center", to: "tech_park", dist: 70, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "junc_circle_center", to: "food_pavilion", dist: 75, modes: ["pedestrian", "wheelchair", "bicycle"] },

      // North Academic Ring & Tech Park
      { from: "tech_park", to: "junc_circle_north", dist: 55, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "tech_park", to: "grand_auditorium", dist: 50, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "grand_auditorium", to: "junc_circle_north", dist: 40, modes: ["pedestrian", "wheelchair", "bicycle"] },

      // East Concourse: Faculty, Hostels & Energy Substation
      { from: "food_pavilion", to: "junc_circle_east", dist: 70, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "junc_circle_north", to: "junc_circle_east", dist: 80, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "junc_circle_east", to: "faculty_block", dist: 65, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "junc_circle_east", to: "electricity_station", dist: 50, modes: ["pedestrian", "bicycle", "shuttle"] },
      { from: "junc_circle_east", to: "campus_temple", dist: 65, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "faculty_block", to: "hostel_zone", dist: 180, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "hostel_zone", to: "east_gate_2", dist: 110, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },

      // Sports Boulevard Corridor
      { from: "junc_circle_north", to: "sportspath", dist: 350, modes: ["pedestrian", "bicycle", "shuttle"] },
      { from: "sportspath", to: "junc_sports_boulevard", dist: 60, modes: ["pedestrian", "bicycle", "shuttle"] },
      { from: "junc_sports_boulevard", to: "sports_complex", dist: 140, modes: ["pedestrian", "wheelchair", "bicycle", "shuttle"] },
      { from: "junc_sports_boulevard", to: "football_turf", dist: 130, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "junc_sports_boulevard", to: "basketball_arena", dist: 160, modes: ["pedestrian", "wheelchair", "bicycle"] },
      { from: "junc_sports_boulevard", to: "cricket_ground", dist: 220, modes: ["pedestrian", "bicycle", "shuttle"] }
    ];

    this.customNodes = [];
  }

  addCustomNode(nodeData) {
    const node = {
      id: nodeData.id || "custom-node-" + (this.customNodes.length + 1),
      name: nodeData.name || "Custom Waypoint " + (this.customNodes.length + 1),
      shortName: nodeData.shortName || nodeData.name || "Waypoint",
      category: nodeData.category || "Custom Pin",
      lat: parseFloat(nodeData.lat) || 13.222871,
      lng: parseFloat(nodeData.lng) || 77.755633,
      description: nodeData.description || "User-added custom coordinate",
      addedAt: new Date().toISOString()
    };
    this.nodes[node.id] = node;
    this.customNodes.push(node);
    return node;
  }

  getCustomNodes() {
    return this.customNodes;
  }

  getCampusMapData() {
    return {
      center: campusConfig.mapCenter,
      zoom: 17,
      landmarks: store.landmarks,
      nodes: Object.values(this.nodes),
      routes: this.edges,
      blockedPaths: store.blockedPaths,
      emergencyAssemblyPoints: [
        { name: "Central Academic Quad Safe Zone A", lat: 13.222871, lng: 77.755633, capacity: 4000 },
        { name: "Olympic Sports Arena Assembly Ground B", lat: 13.228500, lng: 77.758200, capacity: 5000 },
        { name: "South Main Gate Evacuation Clearance C", lat: 13.220162, lng: 77.754079, capacity: 2000 }
      ]
    };
  }

  findRoute(fromId, toId, mode = "pedestrian") {
    if (!this.nodes[fromId] || !this.nodes[toId]) {
      throw new Error("Invalid start or destination location ID");
    }

    const adj = {};
    Object.keys(this.nodes).forEach(id => { adj[id] = []; });

    this.edges.forEach(edge => {
      const isBlocked = store.blockedPaths.some(b => 
        (b.from === edge.from && b.to === edge.to) || (b.from === edge.to && b.to === edge.from)
      );
      if (isBlocked) return;

      if (edge.modes.includes(mode)) {
        adj[edge.from].push({ node: edge.to, dist: edge.dist });
        adj[edge.to].push({ node: edge.from, dist: edge.dist });
      }
    });

    const distances = {};
    const previous = {};
    const unvisited = new Set(Object.keys(this.nodes));

    Object.keys(this.nodes).forEach(id => {
      distances[id] = Infinity;
      previous[id] = null;
    });

    distances[fromId] = 0;

    while (unvisited.size > 0) {
      let curr = null;
      let minDst = Infinity;
      for (const id of unvisited) {
        if (distances[id] < minDst) {
          minDst = distances[id];
          curr = id;
        }
      }

      if (curr === null || distances[curr] === Infinity) break;
      if (curr === toId) break;

      unvisited.delete(curr);

      if (adj[curr]) {
        for (const neighbor of adj[curr]) {
          if (!unvisited.has(neighbor.node)) continue;
          const alt = distances[curr] + neighbor.dist;
          if (alt < distances[neighbor.node]) {
            distances[neighbor.node] = alt;
            previous[neighbor.node] = curr;
          }
        }
      }
    }

    const path = [];
    let u = toId;
    while (u) {
      path.unshift(this.nodes[u]);
      u = previous[u];
    }

    if (path.length === 0 || path[0].id !== fromId) {
      return {
        found: false,
        message: "No accessible route found between points for mode: " + mode,
        mode
      };
    }

    const totalDistMeters = distances[toId];
    const speeds = {
      pedestrian: 1.3, // ~4.7 km/h
      wheelchair: 1.0,
      bicycle: 4.2,    // ~15 km/h
      shuttle: 6.0     // ~22 km/h
    };
    const speed = speeds[mode] || 1.3;
    const estTimeMins = Math.max(1, Math.round(totalDistMeters / speed / 60));

    const waypoints = path.map(p => ({ lat: p.lat, lng: p.lng, name: p.shortName || p.name }));
    const pathCoords = path.map(p => [p.lat, p.lng]);

    return {
      found: true,
      from: this.nodes[fromId],
      to: this.nodes[toId],
      mode,
      totalDistanceMeters: totalDistMeters,
      estimatedTimeMins: estTimeMins,
      estimatedMinutes: estTimeMins,
      path,
      waypoints,
      pathCoords,
      directions: this.generateTurnByTurn(path)
    };
  }

  generateTurnByTurn(path) {
    const steps = [];
    for (let i = 0; i < path.length - 1; i++) {
      const cur = path[i];
      const next = path[i+1];
      steps.push({
        step: i + 1,
        instruction: "Proceed from " + (cur.shortName || cur.name) + " towards " + (next.shortName || next.name),
        target: next.name
      });
    }
    steps.push({
      step: path.length,
      instruction: "You have arrived at " + (path[path.length - 1].name),
      target: path[path.length - 1].name
    });
    return steps;
  }

  getEmergencyEvacuation(fromLocationId) {
    const assemblyPoints = [
      { id: "central_circle", name: "Central Academic Quad Safe Zone A" },
      { id: "sports_complex", name: "Olympic Stadium Assembly Ground B" },
      { id: "main_gate_1", name: "South Main Gate Evacuation Clearance C" }
    ];

    let bestRoute = null;
    let shortest = Infinity;

    for (const ap of assemblyPoints) {
      try {
        const route = this.findRoute(fromLocationId, ap.id, "pedestrian");
        if (route.found && route.totalDistanceMeters < shortest) {
          shortest = route.totalDistanceMeters;
          bestRoute = route;
        }
      } catch (err) {
        // continue
      }
    }

    return {
      emergency: true,
      protocol: "CODE GREEN - Emergency Evacuation Route",
      nearestAssembly: bestRoute ? bestRoute.to : null,
      nearestExit: bestRoute ? bestRoute.to : { name: "South Gate 1" },
      evacuationDistanceMeters: bestRoute ? bestRoute.totalDistanceMeters : 120,
      route: bestRoute
    };
  }
}

module.exports = new MapService();
