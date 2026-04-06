const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  console.log('\n' + '='.repeat(60))
  console.log(`[${new Date().toISOString()}] NEW REQUEST RECEIVED`)
  
  if (!req.file || !req.body.category) {
    console.log('[ERROR] Missing file or category')
    return res.status(400).json({ error: 'Missing image file or category' })
  }

  try {
    console.log(`[ROUTE] Image: ${req.file.originalname}, Size: ${req.file.size} bytes, MIME: ${req.file.mimetype}`)
    console.log(`[ROUTE] Category: ${req.body.category}`)
    
    const { extractIngredientsFromImage, analyzeIngredients } = require('../server/analyzeIngredients')
    
    // Extract ingredients and product name from image
    console.log(`[ROUTE] Starting ingredient extraction...`)
    const { productName, ingredients } = await extractIngredientsFromImage(req.file.buffer, req.file.originalname)
    
    console.log(`[ROUTE] Extraction complete: ${productName}`)
    
    if (!ingredients) {
      console.log(`[ROUTE] No ingredients found in image`)
      return res.status(400).json({ error: 'Could not extract ingredients from image. Please make sure the image shows a clear ingredient list or product label.' })
    }

    const category = req.body.category
    console.log(`[ROUTE] Starting analysis of ingredients...`)
    const result = await analyzeIngredients(productName, ingredients, category)
    console.log(`[ROUTE] Analysis complete`)

    // Save to database if available
    if (process.env.MONGO_URI) {
      try {
        const ScanHistory = require('../models/ScanHistory')
        await ScanHistory.create({
          productName,
          ingredients,
          category,
          result,
          imageFileName: req.file.originalname,
          createdAt: new Date()
        })
        console.log(`[ROUTE] Saved to database`)
      } catch (dbErr) {
        console.log(`[ROUTE] Database save failed (non-critical): ${dbErr.message}`)
      }
    }

    console.log(`[ROUTE] Sending response with result...`)
    res.json(result)
    console.log(`[ROUTE] Response sent successfully ✓`)
  } catch (err) {
    console.error(`[ROUTE] Error occurred:`, err.message)
    console.error(`[ROUTE] Stack:`, err.stack)
    console.log(`[ROUTE] Sending error response...`)
    res.status(500).json({ error: 'Analysis failed: ' + (err.message || 'Unknown error') })
  }
})

module.exports = router