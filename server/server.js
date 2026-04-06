const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Load env from project root
const envPath = path.join(__dirname, '..', '.env')
console.log(`[SERVER] Looking for .env at: ${envPath}`)
console.log(`[SERVER] .env exists: ${fs.existsSync(envPath)}`)

require('dotenv').config({ path: envPath })

console.log(`[SERVER] GROQ_API_KEY loaded: ${process.env.GROQ_API_KEY ? 'YES' : 'NO'}`)
console.log(`[SERVER] MONGO_URI loaded: ${process.env.MONGO_URI ? 'YES' : 'NO'}`)

const app = express()
app.use(cors())
app.use(express.json())

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG and PNG images are allowed'))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection failed:', err.message))
} else {
  console.log('No MONGO_URI provided, running without database')
}

app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    env: {
      groqKey: process.env.GROQ_API_KEY ? 'YES' : 'NO',
      mongoUri: process.env.MONGO_URI ? 'YES' : 'NO'
    }
  })
})

const analyzeRoute = require('../routes/analyzeRoute')
// Increase timeout for OCR processing (up to 2 minutes)
app.use('/api/analyze', (req, res, next) => {
  req.setTimeout(120000)
  next()
})
app.use('/api/analyze', upload.single('image'), analyzeRoute)

const server = app.listen(5000, () => console.log('Server on port 5000'))
// Set server timeout for long-running requests
server.setTimeout(120000)