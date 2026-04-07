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
 * Extracts product name and ingredients from an image buffer via OCR + AI parsing
 */
async function extractIngredientsFromImage(imageBuffer, fileName) {
  let tempFilePath = null
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in your .env file.')
    }

    console.log(`[OCR] Processing image: ${fileName}, Buffer size: ${imageBuffer.length} bytes`)

    // Save buffer to temporary file for Tesseract
    const safeFileName = fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
    tempFilePath = path.join(os.tmpdir(), `sw_${Date.now()}_${safeFileName}`)
    fs.writeFileSync(tempFilePath, imageBuffer)
    console.log(`[OCR] Saved temp image to: ${tempFilePath}`)

    console.log(`[OCR] Running Tesseract OCR...`)

    // Static recognize method for simplicity
    const { data: { text, confidence } } = await Tesseract.recognize(
      tempFilePath,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            process.stdout.write(`\r[OCR] Progress: ${Math.round(m.progress * 100)}%`)
          }
        }
      }
    )
    console.log(`\n[OCR] Completed. Confidence: ${Math.round(confidence)}%`)

    if (!text || text.trim().length < 10) {
      throw new Error(
        'Very little text was detected in the product image. Please upload a clearer photo of the ingredient label.'
      )
    }

    console.log(`[GROQ] Intelligent parsing of OCR text...`)
    const parseResponse = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1000,
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You are an expert at reading messy OCR-extracted text from product labels.
Find the product name and human-readable ingredients list.
Always return valid JSON.`
        },
        {
          role: 'user',
          content: `Extracted OCR Text:\n"""\n${text}\n"""\n\nExtract:
1. Product name
2. Ingredients list (string of common names)

Return JSON format: {"productName": "...", "ingredients": "..."}`
        }
      ],
      response_format: { type: "json_object" }
    })

    const extracted = JSON.parse(parseResponse.choices[0].message.content)
    let ingredientsString = extracted.ingredients || ''
    
    if (Array.isArray(ingredientsString)) {
      ingredientsString = ingredientsString.join(', ')
    } else if (typeof ingredientsString !== 'string') {
      ingredientsString = String(ingredientsString)
    }

    console.log(`[GROQ] Extracted: productName="${extracted.productName}", ingredients="${ingredientsString.substring(0, 100)}..."`)

    if (!ingredientsString || ingredientsString.trim().length < 5) {
      throw new Error(
        'No ingredient list could be found. Please upload a clearer photo of the ingredient section.'
      )
    }

    return {
      productName: extracted.productName || 'Unknown Product',
      ingredients: ingredientsString
    }
  } catch (err) {
    console.error('[ERROR] Image extraction failed:', err.message)
    throw err
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
        console.log(`[OCR] Cleaned up temp file`)
      } catch (e) {
        console.log(`[OCR] Cleanup warning: ${e.message}`)
      }
    }
  }
}

/**
 * Deep analysis of ingredients using AI
 */
async function analyzeIngredients(productName, ingredients, category) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }

  if (typeof ingredients !== 'string') {
    ingredients = Array.isArray(ingredients) ? ingredients.join(', ') : String(ingredients)
  }
  
  const ingredientCount = ingredients.split(',').length
  console.log(`[GROQ] Analyzing ${ingredientCount} ingredients for "${productName}" (${category})`)

  try {
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 3000, // Increased for long lists
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: `You are a professional product safety expert.
Analyze ingredients in ${category} products and explain them simply.
Return ONLY valid JSON.`
        },
        {
          role: 'user',
          content: `Analyze these ingredients for "${productName}":
${ingredients}

Return format:
{
  "simplified": [
    { "original": "Name", "simple": "Description", "risk": "safe|caution|harmful" }
  ],
  "health_score": "good|okay|bad",
  "warning": "One sentence summary of concerns or null",
  "benefit": "One sentence summary of benefits or null",
  "alternatives": ["Alternative 1", "Alternative 2", "Alternative 3"]
}`
        }
      ],
      response_format: { type: "json_object" }
    })

    const result = JSON.parse(completion.choices[0].message.content)

    // Sanitize
    if (!Array.isArray(result.simplified)) result.simplified = []
    if (!['good', 'okay', 'bad'].includes(result.health_score)) result.health_score = 'okay'
    result.warning = result.warning || null
    result.benefit = result.benefit || null
    if (!Array.isArray(result.alternatives)) result.alternatives = []

    return result
  } catch (err) {
    console.error('[ERROR] AI Analysis failed:', err.message)
    throw new Error('Could not analyze the ingredients. Please check your connection and try again.')
  }
}

module.exports = { extractIngredientsFromImage, analyzeIngredients }

// Test runner
if (require.main === module) {
  analyzeIngredients(
    "Lay's Classic Chips",
    "Potatoes, Vegetable Oil (Sunflower, Corn, and/or Canola Oil), Salt",
    "food"
  ).then(result => console.log(JSON.stringify(result, null, 2)))
   .catch(err => console.error('Test failed:', err.message))
}