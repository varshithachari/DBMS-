const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '..', 'routes', 'api.js');
let code = fs.readFileSync(apiPath, 'utf8');

const target = `router.get('/food-sports/all', (req, res) => {
  try {
    res.json({
      foodOutlets: foodSportsService.getFoodOutlets(),
      sportsCourts: foodSportsService.getSportsCourts(),
      canteenData: foodSportsService.getCanteenData()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});`;

const replacement = `router.get('/food-sports/all', (req, res) => {
  try {
    res.json({
      foodOutlets: foodSportsService.getFoodOutlets(),
      sportsCourts: foodSportsService.getSportsCourts(),
      canteenData: foodSportsService.getCanteenData(),
      cplData: foodSportsService.getCplData()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Chanakya Premier League (CPL Season-2) 2026 Endpoints
router.get('/sports/cpl', (req, res) => {
  try {
    res.json(foodSportsService.getCplData());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sports/cpl/matches', (req, res) => {
  try {
    res.json(foodSportsService.getCplMatches());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sports/cpl/matches/:id', (req, res) => {
  try {
    const match = foodSportsService.getCplMatchById(req.params.id);
    if (!match) return res.status(404).json({ error: 'CPL Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sports/cpl/matches', (req, res) => {
  try {
    const match = foodSportsService.addCplMatch(req.body);
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(apiPath, code, 'utf8');
  console.log('✅ Patched routes/api.js (LF)');
} else {
  // Try CRLF
  const targetCRLF = target.replace(/\n/g, '\r\n');
  if (code.includes(targetCRLF)) {
    code = code.replace(targetCRLF, replacement.replace(/\n/g, '\r\n'));
    fs.writeFileSync(apiPath, code, 'utf8');
    console.log('✅ Patched routes/api.js (CRLF)');
  } else {
    console.error('❌ Could not locate target in routes/api.js');
  }
}
