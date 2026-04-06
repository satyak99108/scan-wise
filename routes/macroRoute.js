const express = require('express');
const router = express.Router();
const { analyzeMacros } = require('../server/analyzeMacros');

router.post('/', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ error: 'System offline: Neural Engine API Key missing.' });
    }

    const { buffer, mimetype } = req.file;
    const macroData = await analyzeMacros(buffer, mimetype);

    res.json(macroData);
  } catch (error) {
    console.error('[ROUTE ERROR]', error.message);
    res.status(500).json({ error: error.message || 'Fatal error during image analysis.' });
  }
});

module.exports = router;
