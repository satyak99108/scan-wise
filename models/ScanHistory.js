const mongoose = require('mongoose')

const scanHistorySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  ingredients: { type: String, required: true },
  category: { type: String, required: true },
  result: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('ScanHistory', scanHistorySchema)