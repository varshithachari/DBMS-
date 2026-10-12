/**
 * Scalability Dataset Generator CLI
 * Generates at least 100 registrations for every applicable sub-event in the hierarchy.
 * Supports:
 *   node scripts/generate_scalability_dataset.js --count=100
 *   node scripts/generate_scalability_dataset.js --reset
 */

const relationalStore = require('../data/relationalStore');

const args = process.argv.slice(2);
const isReset = args.includes('--reset');
let countPerSubEvent = 100;

for (const arg of args) {
  if (arg.startsWith('--count=')) {
    const val = parseInt(arg.split('=')[1], 10);
    if (!isNaN(val) && val > 0) countPerSubEvent = val;
  }
}

console.log('================================================================');
console.log('🏛️  CHANAKYA CAMPUS CONNECT & UTSAVHUB SCALABILITY GENERATOR');
console.log('================================================================');

if (isReset) {
  const result = relationalStore.resetScalabilityDataset();
  console.log(`\n🧹 RESET COMPLETED:`);
  console.log(result.message);
  console.log(`Remaining registrations: ${result.totalRegistrations}`);
  console.log(`Remaining participants:   ${result.totalParticipants}`);
  process.exit(0);
}

// 1. Inspect hierarchy
const schools = relationalStore.getSchools();
const depts = relationalStore.getDepartments();
const fests = relationalStore.getMainEvents();
const subEvents = relationalStore.getSubEvents();

console.log(`\n📊 HIERARCHY STRUCTURE:`);
console.log(`• Schools:      ${schools.length}`);
console.log(`• Departments:  ${depts.length}`);
console.log(`• Main Fests:   ${fests.length}`);
console.log(`• Sub-Events:   ${subEvents.length}`);
console.log(`• Target registrations per sub-event: ${countPerSubEvent}`);
console.log(`• Target total registration records:  ${subEvents.length * countPerSubEvent}`);

console.log(`\n🚀 Executing synthetic generation...`);
const t0 = Date.now();
const result = relationalStore.generateScalabilityDataset(countPerSubEvent);
const elapsedMs = Date.now() - t0;

console.log(`\n✅ GENERATION COMPLETE in ${elapsedMs}ms!`);
console.log(`================================================================`);
console.log(`Total Sub-Events Seeded:       ${result.subEventsCount}`);
console.log(`Total Database Registrations:  ${result.totalRegistrations}`);
console.log(`Total Unique Participants:     ${result.totalParticipants}`);
console.log(`Verified Competition Podiums:  ${result.totalCompetitionResults}`);
console.log(`Point Transactions Awarded:    ${result.totalPointTransactions}`);
console.log(`================================================================`);

const overview = relationalStore.getAnalyticsOverview();
console.log(`\n📈 Verified Live Database Analytics:`);
console.log(JSON.stringify(overview, null, 2));

console.log(`\n🏆 Verified School Championship Standings:`);
console.table(relationalStore.getSchoolLeaderboard().map(s => ({
  School: s.school_name,
  Points: s.points,
  Gold: s.gold,
  Silver: s.silver,
  Bronze: s.bronze
})));
