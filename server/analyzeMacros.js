const Tesseract = require('tesseract.js')
const path = require('path')
const fs = require('fs')
const os = require('os')
const Groq = require('groq-sdk')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

// Create common groq client
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY' })

/**
 * Extracts and analyzes nutrition macros from an image buffer via OCR + AI parsing
 */
async function analyzeMacros(imageBuffer, mimeType) {
  let tempFilePath = null
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in your .env file.')
    }

    console.log(`[MACROS OCR] Processing image. Buffer size: ${imageBuffer.length} bytes`)

    // Save buffer to temporary file for Tesseract
    tempFilePath = path.join(os.tmpdir(), `sw_macro_${Date.now()}.png`)
    fs.writeFileSync(tempFilePath, imageBuffer)
    console.log(`[MACROS OCR] Saved temp image to: ${tempFilePath}`)

    console.log(`[MACROS OCR] Running Tesseract OCR...`)
    const { data: { text, confidence } } = await Tesseract.recognize(
      tempFilePath,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            process.stdout.write(`\r[MACROS OCR] Progress: ${Math.round(m.progress * 100)}%`)
          }
        }
      }
    )
    console.log(`\n[MACROS OCR] Completed. Confidence: ${Math.round(confidence)}%`)

    const extractedText = text.trim()
    if (extractedText.length < 5) {
      throw new Error("The image doesn't seem to contain enough text. Please provide a clear nutrition label.")
    }

    console.log(`[MACROS GROQ] Parsing and estimating macros...`)
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 800,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "You are a Nutrition Label Parser. Extract Calories, Protein, Carbohydrates, and Fat from OCR text. If exact numbers are missing but ingredients are clear, provide a reasonable estimate for an average serving. Return ONLY valid JSON."
        },
        {
          role: "user",
          content: `Extracted OCR Text:\n"""\n${extractedText}\n"""\n\nExtract and return this JSON format:\n{
  "food_detected": "Product name",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "breakdown": ["Detail 1", "Detail 2"],
  "confidence": "high|medium|low"
}`
        }
      ],
      response_format: { type: "json_object" }
    })

    const parsedData = JSON.parse(completion.choices[0].message.content)
    return parsedData

  } catch (error) {
    console.error("[MACROS AI ERR]", error.message)
    throw new Error(error.message || "Neural processing failed to extract metrics from image.")
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
        console.log(`[MACROS OCR] Cleaned up temp file`)
      } catch (e) {
        console.log(`[MACROS OCR] Cleanup warning: ${e.message}`)
      }
    }
  }
}

module.exports = { analyzeMacros }
