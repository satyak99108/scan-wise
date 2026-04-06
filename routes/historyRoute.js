const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ error: 'Database connection missing. Scan history is disabled.' })
    }
    
    // We try block and require inside so that it doesn't crash if imported without MONGO_URI
    const ScanHistory = require('../models/ScanHistory')
    const history = await ScanHistory.find().sort({ createdAt: -1 }).limit(50)
    res.json(history)
  } catch (err) {
    console.error(`[ROUTE] History Error:`, err.message)
    res.status(500).json({ error: 'Failed to retrieve history' })
  }
})

module.exports = router
