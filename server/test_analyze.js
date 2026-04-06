require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { analyzeIngredients } = require('./analyzeIngredients.js');

analyzeIngredients("Test Product", "Water, Sugar, Salt", "food")
  .then(res => console.log(JSON.stringify(res, null, 2)))
  .catch(err => console.error(err));
