/**
 * Chanakya Premier League (Season-2) 2026 - Tournament & Match Data
 * Verified against CricHeroes official scoresheet.
 */

const CPL_DATA = {
  tournament: {
    id: "cpl-season-2-2026",
    name: "Chanakya Premier League (Season-2) 2026",
    edition: "Season 2",
    seasonYear: 2026,
    stage: "League Matches",
    organizer: "Chanakya University Sports & Athletics Council",
    ground: "Chanakya University Global Campus Cricket Ground, Devanahalli, Bangalore",
    scoringPartner: "CricHeroes",
    status: "In Progress",
    notice: "More league match scorecards sync scheduled in 3-4 days as matches conclude."
  },
  teams: [
    {
      id: "magadha_lions",
      name: "MAGADHA LIONS",
      shortCode: "ML",
      captain: "Vidya Sagar",
      color: "#F59E0B",
      matchesPlayed: 1,
      won: 1,
      lost: 0,
      tied: 0,
      points: 2,
      netRunRate: "+0.150",
      squad: [
        { name: "Vidya Sagar", role: "Captain / All-Rounder", isCaptain: true },
        { name: "Ajay Chandra", role: "Batsman / Bowler" },
        { name: "Akash K", role: "Bowler / Batsman" },
        { name: "Chethan Yadav", role: "All-Rounder" },
        { name: "Gagan Deep", role: "Wicket-Keeper / Batsman", isWK: true },
        { name: "Neeraj", role: "Bowler" },
        { name: "Reyansh P", role: "Top-order Batsman" },
        { name: "Thayaanithi V V", role: "All-Rounder" },
        { name: "Venki", role: "Middle-order Batsman" },
        { name: "Raghu Pujari", role: "Bowler" },
        { name: "Yuvi Yuvi", role: "All-Rounder" },
        { name: "Chakri", role: "Substitute / Batter" }
      ]
    },
    {
      id: "chalukya_challengers",
      name: "Chalukya Challengers",
      shortCode: "CC",
      captain: "Shastri",
      color: "#0284C7",
      matchesPlayed: 1,
      won: 0,
      lost: 1,
      tied: 0,
      points: 0,
      netRunRate: "-0.150",
      squad: [
        { name: "Shastri", role: "Captain / All-Rounder", isCaptain: true },
        { name: "Dheemanth", role: "Opening Batsman" },
        { name: "Ganesh", role: "Wicket-Keeper / Batsman", isWK: true },
        { name: "Mahadevaprasad", role: "Middle-order Batsman" },
        { name: "Manoj Kumar Reddy A", role: "All-Rounder" },
        { name: "Mayur Krishna", role: "Pace Bowler / Batsman" },
        { name: "Maharshi Mn", role: "Bowler" },
        { name: "Pradyumna Patil", role: "Top-order Batsman" },
        { name: "Sharath", role: "Bowler" },
        { name: "Vishnu Suhas Reddy", role: "Opening Bowler" },
        { name: "Chethan Mb", role: "Middle-order Batsman" },
        { name: "Sathiyapriya", role: "Substitute / Fielder" }
      ]
    },
    {
      id: "maurya_strikers",
      name: "Maurya Strikers",
      shortCode: "MS",
      captain: "Upcoming",
      color: "#10B981",
      matchesPlayed: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
      netRunRate: "0.000",
      status: "Upcoming Match Slot"
    },
    {
      id: "rashtrakuta_warriors",
      name: "Rashtrakuta Warriors",
      shortCode: "RW",
      captain: "Upcoming",
      color: "#8B5CF6",
      matchesPlayed: 0,
      won: 0,
      lost: 0,
      tied: 0,
      points: 0,
      netRunRate: "0.000",
      status: "Upcoming Match Slot"
    }
  ],
  matches: [
    {
      id: "cpl-2026-m01",
      matchNumber: "Match 1",
      stage: "League Stage",
      date: "2026-02-14",
      time: "09:00 AM UTC",
      ground: "Chanakya University Global Campus Cricket Ground, Devanahalli, Bangalore",
      teamA: "MAGADHA LIONS",
      teamB: "Chalukya Challengers",
      toss: "Chalukya Challengers opt to field",
      result: "MAGADHA LIONS won by 3 runs",
      resultType: "close_finish",
      margin: "3 runs",
      playerOfTheMatch: {
        name: "Vidya Sagar",
        team: "MAGADHA LIONS",
        performance: "4.0-0-18-4 & Captaincy Defence"
      },
      officials: {
        umpires: ["Krishiv", "Rakshak"],
        scorer: "Hemanth N V",
        captains: {
          magadha: "Vidya Sagar",
          chalukya: "Shastri"
        }
      },
      summary: {
        magadhaLions: {
          score: 127,
          wickets: 10,
          overs: 17.4,
          crr: 7.19
        },
        chalukyaChallengers: {
          score: 124,
          wickets: 10,
          overs: 19.5,
          crr: 6.25
        }
      },
      bestPerformances: {
        batsmen: [
          { name: "Pradyumna Patil", team: "Chalukya Challengers", runs: 27, balls: 22, fours: 3, sixes: 0, sr: 122.73 },
          { name: "Reyansh P", team: "MAGADHA LIONS", runs: 20, balls: 14, fours: 4, sixes: 0, sr: 142.86 },
          { name: "Dheemanth", team: "Chalukya Challengers", runs: 20, balls: 28, fours: 3, sixes: 0, sr: 71.43 }
        ],
        bowlers: [
          { name: "Vidya Sagar", team: "MAGADHA LIONS", overs: 4.0, maidens: 0, runs: 18, wickets: 4, economy: 4.50 },
          { name: "Mayur Krishna", team: "Chalukya Challengers", overs: 2.4, maidens: 0, runs: 22, wickets: 4, economy: 8.25 },
          { name: "Manoj Kumar Reddy A", team: "Chalukya Challengers", overs: 3.0, maidens: 0, runs: 21, wickets: 2, economy: 7.00 }
        ]
      },
      innings1: {
        team: "MAGADHA LIONS",
        score: "127/10",
        overs: "17.4",
        crr: 7.19,
        batting: [
          { name: "Gagan Deep", role: "wk", hand: "RHB", dismissal: "c Vishnu Suhas Reddy b Manoj Kumar Reddy A", runs: 17, balls: 16, minutes: 35, fours: 1, sixes: 1, sr: 106.25 },
          { name: "Ajay Chandra", role: "bat", hand: "RHB", dismissal: "c †Ganesh b Pradyumna Patil", runs: 5, balls: 11, minutes: 16, fours: 0, sixes: 0, sr: 45.45 },
          { name: "Reyansh P", role: "bat", hand: "RHB", dismissal: "c Pradyumna Patil b Mayur Krishna", runs: 20, balls: 14, minutes: 13, fours: 4, sixes: 0, sr: 142.86 },
          { name: "Vidya Sagar", role: "c", hand: "RHB", dismissal: "run out Shastri", runs: 12, balls: 17, minutes: 44, fours: 0, sixes: 0, sr: 70.59 },
          { name: "Thayaanithi V V", role: "all", hand: "RHB", dismissal: "c Maharshi MN b Shastri", runs: 13, balls: 15, minutes: 25, fours: 0, sixes: 1, sr: 86.67 },
          { name: "Chethan Yadav", role: "all", hand: "RHB", dismissal: "b Manoj Kumar Reddy A", runs: 13, balls: 17, minutes: 34, fours: 2, sixes: 0, sr: 76.47 },
          { name: "Venki", role: "bat", hand: "RHB", dismissal: "run out Manoj Kumar Reddy A / †Ganesh", runs: 0, balls: 0, minutes: 4, fours: 0, sixes: 0, sr: 0.00 },
          { name: "Neeraj", role: "bowl", hand: "RHB", dismissal: "c †Ganesh b Mayur Krishna", runs: 8, balls: 9, minutes: 22, fours: 1, sixes: 0, sr: 88.89 },
          { name: "Yuvi Yuvi", role: "all", hand: "RHB", dismissal: "b Mayur Krishna", runs: 5, balls: 6, minutes: 9, fours: 0, sixes: 0, sr: 83.33 },
          { name: "Raghu Pujari", role: "bowl", hand: "RHB", dismissal: "lbw b Mayur Krishna", runs: 0, balls: 1, minutes: 1, fours: 0, sixes: 0, sr: 0.00 },
          { name: "Akash K", role: "bowl", hand: "RHB", dismissal: "not out", runs: 1, balls: 1, minutes: 1, fours: 0, sixes: 0, sr: 100.00 }
        ],
        didNotBat: ["Chakri"],
        extras: {
          total: 33,
          breakdown: "wd 30, b 2, nb 1"
        },
        bowling: [
          { name: "Vishnu Suhas Reddy", overs: 1.0, maidens: 0, runs: 7, wickets: 0, dots: 3, fours: 0, sixes: 0, wides: 3, noBalls: 0, economy: 7.00 },
          { name: "Pradyumna Patil", overs: 4.0, maidens: 0, runs: 17, wickets: 1, dots: 15, fours: 0, sixes: 0, wides: 6, noBalls: 0, economy: 4.25 },
          { name: "Mahadevaprasad", overs: 1.0, maidens: 0, runs: 9, wickets: 0, dots: 3, fours: 1, sixes: 0, wides: 3, noBalls: 0, economy: 9.00 },
          { name: "Shastri (c)", overs: 4.0, maidens: 0, runs: 25, wickets: 1, dots: 12, fours: 2, sixes: 0, wides: 6, noBalls: 0, economy: 6.25 },
          { name: "Mayur Krishna", overs: 2.4, maidens: 0, runs: 22, wickets: 4, dots: 7, fours: 2, sixes: 1, wides: 1, noBalls: 0, economy: 8.25 },
          { name: "Manoj Kumar Reddy A", overs: 3.0, maidens: 0, runs: 21, wickets: 2, dots: 10, fours: 0, sixes: 1, wides: 5, noBalls: 0, economy: 7.00 },
          { name: "Dheemanth", overs: 1.0, maidens: 0, runs: 7, wickets: 0, dots: 3, fours: 0, sixes: 0, wides: 2, noBalls: 1, economy: 7.00 },
          { name: "Sharath", overs: 0.0, maidens: 0, runs: 3, wickets: 0, dots: 0, fours: 0, sixes: 0, wides: 3, noBalls: 0, economy: 0.00 },
          { name: "Maharshi MN", overs: 1.0, maidens: 0, runs: 14, wickets: 0, dots: 1, fours: 3, sixes: 0, wides: 0, noBalls: 0, economy: 14.00 }
        ],
        fallOfWickets: [
          { score: "23-1", batsman: "Ajay Chandra", overs: "3.2" },
          { score: "48-2", batsman: "Reyansh P", overs: "6.0" },
          { score: "57-3", batsman: "Gagan Deep", overs: "6.5" },
          { score: "86-4", batsman: "Thayaanithi V V", overs: "11.2" },
          { score: "96-5", batsman: "Vidya Sagar", overs: "13.2" },
          { score: "98-6", batsman: "Venki", overs: "13.5" },
          { score: "119-7", batsman: "Chethan Yadav", overs: "16.1" },
          { score: "126-8", batsman: "Neeraj", overs: "17.1" },
          { score: "126-9", batsman: "Raghu Pujari", overs: "17.2" },
          { score: "127-10", batsman: "Yuvi Yuvi", overs: "17.4" }
        ]
      },
      innings2: {
        team: "Chalukya Challengers",
        score: "124/10",
        overs: "19.5",
        crr: 6.25,
        target: 128,
        batting: [
          { name: "Dheemanth", role: "bat", hand: "RHB", dismissal: "lbw b Neeraj", runs: 20, balls: 28, minutes: 33, fours: 3, sixes: 0, sr: 71.43 },
          { name: "Mayur Krishna", role: "bowl", hand: "RHB", dismissal: "b Yuvi Yuvi", runs: 4, balls: 3, minutes: 13, fours: 0, sixes: 0, sr: 133.33 },
          { name: "Manoj Kumar Reddy A", role: "all", hand: "RHB", dismissal: "lbw b Vidya Sagar", runs: 11, balls: 23, minutes: 33, fours: 1, sixes: 0, sr: 47.83 },
          { name: "Pradyumna Patil", role: "bat", hand: "RHB", dismissal: "c Chethan Yadav b Vidya Sagar", runs: 27, balls: 22, minutes: 32, fours: 3, sixes: 0, sr: 122.73 },
          { name: "Ganesh", role: "wk", hand: "RHB", dismissal: "c Akash K b Ajay Chandra", runs: 9, balls: 11, minutes: 27, fours: 1, sixes: 0, sr: 81.82 },
          { name: "Shastri", role: "c", hand: "RHB", dismissal: "run out Vidya Sagar", runs: 10, balls: 13, minutes: 25, fours: 1, sixes: 0, sr: 76.92 },
          { name: "Chethan MB", role: "bat", hand: "RHB", dismissal: "b Akash K", runs: 0, balls: 4, minutes: 6, fours: 0, sixes: 0, sr: 0.00 },
          { name: "Sharath", role: "bowl", hand: "RHB", dismissal: "c Akash K b Vidya Sagar", runs: 2, balls: 5, minutes: 11, fours: 0, sixes: 0, sr: 40.00 },
          { name: "Mahadevaprasad", role: "bat", hand: "RHB", dismissal: "run out Thayaanithi V V / †Gagan Deep", runs: 3, balls: 5, minutes: 13, fours: 0, sixes: 0, sr: 60.00 },
          { name: "Maharshi MN", role: "bowl", hand: "RHB", dismissal: "lbw b Vidya Sagar", runs: 0, balls: 1, minutes: 1, fours: 0, sixes: 0, sr: 0.00 },
          { name: "Vishnu Suhas Reddy", role: "bowl", hand: "RHB", dismissal: "not out", runs: 1, balls: 6, minutes: 11, fours: 0, sixes: 0, sr: 16.67 }
        ],
        didNotBat: ["Sathiyapriya"],
        extras: {
          total: 37,
          breakdown: "wd 19, nb 2, b 14, lb 2"
        },
        bowling: [
          { name: "Chethan Yadav", overs: 3.5, maidens: 0, runs: 22, wickets: 0, dots: 13, fours: 2, sixes: 0, wides: 4, noBalls: 0, economy: 5.74 },
          { name: "Akash K", overs: 3.0, maidens: 0, runs: 17, wickets: 1, dots: 14, fours: 2, sixes: 0, wides: 5, noBalls: 1, economy: 5.67 },
          { name: "Yuvi Yuvi", overs: 1.0, maidens: 0, runs: 14, wickets: 1, dots: 2, fours: 1, sixes: 0, wides: 2, noBalls: 1, economy: 14.00 },
          { name: "Vidya Sagar (c)", overs: 4.0, maidens: 0, runs: 18, wickets: 4, dots: 16, fours: 2, sixes: 0, wides: 3, noBalls: 0, economy: 4.50 },
          { name: "Ajay Chandra", overs: 4.0, maidens: 1, runs: 10, wickets: 1, dots: 17, fours: 0, sixes: 0, wides: 2, noBalls: 0, economy: 2.50 },
          { name: "Neeraj", overs: 2.0, maidens: 0, runs: 14, wickets: 1, dots: 3, fours: 1, sixes: 0, wides: 1, noBalls: 0, economy: 7.00 },
          { name: "Venki", overs: 2.0, maidens: 0, runs: 13, wickets: 0, dots: 5, fours: 1, sixes: 0, wides: 1, noBalls: 0, economy: 6.50 }
        ],
        fallOfWickets: [
          { score: "18-1", batsman: "Mayur Krishna", overs: "2.5" },
          { score: "46-2", batsman: "Dheemanth", overs: "6.3" },
          { score: "63-3", batsman: "Manoj Kumar Reddy A", overs: "10.0" },
          { score: "94-4", batsman: "Pradyumna Patil", overs: "13.0" },
          { score: "100-5", batsman: "Ganesh", overs: "14.4" },
          { score: "108-6", batsman: "Chethan MB", overs: "15.5" },
          { score: "117-7", batsman: "Shastri", overs: "17.3" },
          { score: "118-8", batsman: "Sharath", overs: "17.5" },
          { score: "118-9", batsman: "Maharshi MN", overs: "18.0" },
          { score: "124-10", batsman: "Mahadevaprasad", overs: "19.5" }
        ]
      }
    },
    {
      id: "cpl-2026-m02",
      matchNumber: "Match 2",
      stage: "League Stage",
      date: "Upcoming (Schedule in 3-4 days)",
      time: "TBD",
      ground: "Chanakya Global Campus Cricket Ground",
      teamA: "Maurya Strikers",
      teamB: "Rashtrakuta Warriors",
      status: "Upcoming Match Slot",
      notice: "Official scorecard & lineup data sync pending (arriving in 3-4 days)."
    }
  ]
};

module.exports = CPL_DATA;
