const fs = require('fs');
const path = require('path');

const storePath = path.join(__dirname, '..', 'data', 'store.js');
let code = fs.readFileSync(storePath, 'utf8');

code = code.replace(
  /getAllFoodOutlets\(\)\s*\{[\s\S]*?return this\.foodOutlets;\s*\}/,
  `getAllFoodOutlets() {\n    const foodSportsService = require('../services/foodSportsService');\n    return foodSportsService.getFoodOutlets();\n  }`
);

code = code.replace(
  /getAllSportsCourts\(\)\s*\{[\s\S]*?return this\.sportsCourts;\s*\}/,
  `getAllSportsCourts() {\n    const foodSportsService = require('../services/foodSportsService');\n    return foodSportsService.getSportsCourts();\n  }`
);

fs.writeFileSync(storePath, code, 'utf8');
console.log('✅ Successfully updated data/store.js getAllFoodOutlets and getAllSportsCourts');
