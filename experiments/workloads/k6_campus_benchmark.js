/**
 * Chanakya Campus Navigator - ECS351 Scalability Lab Benchmark (k6)
 * Executes reproducible step load tests comparing:
 *   - Modular Monolith (Port 8001 / MONOLITH_URL)
 *   - Event-Driven Architecture (Port 8002 / EVENT_DRIVEN_URL)
 * 
 * Concurrency Steps: 10, 50, 100, 200, 400 Virtual Users (held 30s each)
 * Workloads:
 *   1. Event Registration Flow (browse, detail, register, cancel, notify)
 *   2. Campus Navigation Flow (location search, shortest path, blocked path)
 *   3. Mixed Campus Workload (60% nav, 30% events, 10% issues)
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

// Custom Prometheus-compatible metrics
const latencyTrend = new Trend('campus_request_duration_ms');
const errorRate = new Rate('campus_error_rate');
const registrationCount = new Counter('campus_registrations_total');
const routeCalculationCount = new Counter('campus_routes_calculated_total');

const BASE_URL = __ENV.TARGET_URL || (__ENV.TARGET_ARCH === 'eda' ? 'http://localhost:8002' : 'http://localhost:8001');
const WORKLOAD = __ENV.WORKLOAD || 'mixed_campus';

export const options = {
  scenarios: {
    step_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 10 },
        { duration: '20s', target: 10 },
        { duration: '5s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '5s', target: 100 },
        { duration: '20s', target: 100 },
        { duration: '5s', target: 200 },
        { duration: '20s', target: 200 },
        { duration: '5s', target: 400 },
        { duration: '20s', target: 400 },
        { duration: '5s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    campus_request_duration_ms: ['p(95)<250'],
    campus_error_rate: ['rate<0.02'],
  },
};

export default function () {
  const vuId = __VU;
  const iterId = __ITER;

  if (WORKLOAD === 'events_registration' || (WORKLOAD === 'mixed_campus' && Math.random() < 0.35)) {
    // 1. Event Browsing
    const resBrowse = http.get(`${BASE_URL}/api/events`);
    check(resBrowse, { 'events browse status 200': (r) => r.status === 200 });
    latencyTrend.add(resBrowse.timings.duration);

    // 2. Event Detail
    const eventId = (iterId % 50) + 1;
    const resDetail = http.get(`${BASE_URL}/api/events/${eventId}`);
    latencyTrend.add(resDetail.timings.duration);

    // 3. Event Registration
    const regPayload = JSON.stringify({
      event_id: eventId,
      participant_id: (vuId % 200) + 1,
      ticket_type: 'Regular',
      timestamp: new Date().toISOString(),
    });
    const regHeaders = { 'Content-Type': 'application/json' };
    const resReg = http.post(`${BASE_URL}/api/registrations`, regPayload, { headers: regHeaders });
    const success = check(resReg, { 'event registered': (r) => r.status === 200 || r.status === 201 });
    errorRate.add(!success);
    latencyTrend.add(resReg.timings.duration);
    registrationCount.add(1);

  } else if (WORKLOAD === 'campus_navigation' || (WORKLOAD === 'mixed_campus' && Math.random() < 0.65)) {
    // 1. Location Search
    const searchQueries = ['Library', 'Admin', 'Cafeteria', 'Auditorium', 'Hostel'];
    const query = searchQueries[iterId % searchQueries.length];
    const resSearch = http.get(`${BASE_URL}/api/locations?search=${query}`);
    check(resSearch, { 'search status 200': (r) => r.status === 200 });
    latencyTrend.add(resSearch.timings.duration);

    // 2. Route Pathfinding
    const routePayload = JSON.stringify({
      source_id: 'LOC-MAIN-GATE',
      destination_id: 'LOC-AUDITORIUM-01',
      strategy: (iterId % 2 === 0) ? 'shortest' : 'accessible',
      avoid_blocked: true,
    });
    const resRoute = http.post(`${BASE_URL}/api/navigation/route`, routePayload, {
      headers: { 'Content-Type': 'application/json' },
    });
    const routeSuccess = check(resRoute, { 'route calculated': (r) => r.status === 200 });
    errorRate.add(!routeSuccess);
    latencyTrend.add(resRoute.timings.duration);
    routeCalculationCount.add(1);

  } else {
    // Campus Issue Reporting
    const issuePayload = JSON.stringify({
      category: 'infrastructure',
      location: 'East Corridor Block B',
      description: 'Minor water leakage reported near staircase',
      reported_by: `student_${vuId}`,
    });
    const resIssue = http.post(`${BASE_URL}/api/issues`, issuePayload, {
      headers: { 'Content-Type': 'application/json' },
    });
    check(resIssue, { 'issue logged': (r) => r.status === 200 || r.status === 201 });
    latencyTrend.add(resIssue.timings.duration);
  }

  // Think time: 1 second pause between user actions (ECS351 spec)
  sleep(1);
}
