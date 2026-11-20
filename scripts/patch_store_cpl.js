const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'data', 'store.js');
let code = fs.readFileSync(storePath, 'utf8');

if (!code.includes('getCplData()')) {
  code = code.replace(
    'getAllSportsCourts() {',
    `getCplData() {\n    const foodSportsService = require('../services/foodSportsService');\n    return foodSportsService.getCplData();\n  }\n\n  getAllSportsCourts() {`
  );
  fs.writeFileSync(storePath, code, 'utf8');
  console.log('✅ Added getCplData to data/store.js');
}
