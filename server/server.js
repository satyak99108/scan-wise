const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config({ path: '../.env' })

const app = express()
app.use(cors())
app.use(express.json())

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection failed:', err.message))
} else {
  console.log('No MONGO_URI provided, running without database')
}

app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

const analyzeRoute = require('../routes/analyzeRoute')
app.use('/api/analyze', analyzeRoute)

app.listen(5000, () => console.log('Server on port 5000'))