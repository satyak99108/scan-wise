const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const { productName, ingredients, category } = req.body

  if (!productName || !ingredients || !category) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const { analyzeIngredients } = require('../server/analyzeIngredients')
    const result = await analyzeIngredients(productName, ingredients, category)

    // Save to database if available
    if (process.env.MONGO_URI) {
      const ScanHistory = require('../models/ScanHistory')
      await ScanHistory.create({
        productName,
        ingredients,
        category,
        result,
        createdAt: new Date()
      })
    }

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Analysis failed. Try again.' })
  }
})

module.exports = router