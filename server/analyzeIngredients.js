const Tesseract = require('tesseract.js')
const path = require('path')
const fs = require('fs')
const os = require('os')

async function extractIngredientsFromImage(imageBuffer, fileName) {
  let tempFilePath = null
  try {
    console.log(`[OCR] Processing image: ${fileName}, Buffer size: ${imageBuffer.length} bytes`)

    // Save buffer to temporary file (Tesseract works better with file paths)
    tempFilePath = path.join(os.tmpdir(), `scan_${Date.now()}_${fileName}`)
    fs.writeFileSync(tempFilePath, imageBuffer)
    console.log(`[OCR] Saved temp image to: ${tempFilePath}`)

    console.log(`[OCR] Running Tesseract OCR...`)

    // Improved Tesseract config
    const { data: { text, confidence } } = await Tesseract.recognize(
      tempFilePath,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            process.stdout.write(`\r[OCR] Progress: ${Math.round(m.progress * 100)}%`)
          }
        },
        tessedit_pageseg_mode: '3',    // Auto page segmentation
        tessedit_ocr_engine_mode: '1', // LSTM only (more accurate)
        preserve_interword_spaces: '1',
      }
    )
    console.log(`\n[OCR] Completed. Confidence: ${Math.round(confidence)}%`)
    console.log(`[OCR] Extracted text (first 500 chars):\n${text.substring(0, 500)}`)

    if (!text || text.trim().length < 10) {
      throw new Error(
        'Very little text was detected in the image. Please upload a clearer photo of the product label with the ingredient list visible.'
      )
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set. Please add it to your .env file.')
    }

    const Groq = require('groq-sdk')
    const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })

    console.log(`[GROQ] Sending OCR text to Groq for intelligent parsing...`)
    const parseResponse = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 600,
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You are an expert at reading OCR-extracted text from product labels.
OCR text is often imperfect with typos, missing spaces, or garbled characters.
Your job is to intelligently identify product names and ingredient lists even from messy OCR output.
Always return ONLY a valid JSON object, never any explanation or extra text.`
        },
        {
          role: 'user',
          content: `The following text was extracted from a product label image via OCR.
The text may contain OCR errors, typos, or garbled characters - do your best to interpret it.

OCR TEXT:
"""
${text}
"""

Extract:
1. The product name (look for brand name, product type at the top)
2. The full ingredients list (look for words like "Ingredients:", "INGREDIENTS", "Contains:", "Ingr." etc.)

Return ONLY this exact JSON (no extra text, no markdown):
{"productName": "product name here", "ingredients": "ingredient1, ingredient2, ingredient3..."}`
        }
      ]
    })

    const rawContent = parseResponse.choices[0].message.content.trim()
    console.log(`[GROQ] Parse response: ${rawContent}`)

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse product information from the image text. Please try a clearer image showing the ingredient label.')
    }

    let extracted
    try {
      extracted = JSON.parse(jsonMatch[0])
    } catch (parseErr) {
      throw new Error('Could not read the ingredient data. Please try a clearer photo focused on the ingredient list.')
    }

    console.log(`[GROQ] Extracted: productName="${extracted.productName}", ingredients="${(extracted.ingredients || '').substring(0, 80)}..."`)

    if (!extracted.ingredients || extracted.ingredients.trim().length < 5) {
      throw new Error(
        'No ingredient list could be found. Please upload a photo that clearly shows the ingredient list or nutrition label.'
      )
    }

    return {
      productName: extracted.productName || 'Unknown Product',
      ingredients: extracted.ingredients
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
        console.log(`[OCR] Could not clean up temp file: ${e.message}`)
      }
    }
  }
}

async function analyzeIngredients(productName, ingredients, category) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }

  const Groq = require('groq-sdk')
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const ingredientCount = ingredients.split(',').length
  console.log(`[GROQ] Analyzing ${ingredientCount} ingredients for "${productName}" (${category})`)

  const completion = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 1500,
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content: `You are a professional product safety and ingredient analysis expert.
You analyze ingredients in consumer products (food, cosmetics, cleaning products) and explain them clearly to everyday people.
Always return ONLY valid JSON, never any explanation or markdown formatting.`
      },
      {
        role: 'user',
        content: `Analyze the ingredients in this ${category} product:

Product: ${productName}
Ingredients: ${ingredients}

Return ONLY this JSON structure (no extra text, no markdown):
{
  "simplified": [
    { "original": "EXACT ingredient name", "simple": "plain English explanation of what it is and its purpose", "risk": "safe" }
  ],
  "health_score": "good",
  "warning": "one sentence warning about concerning ingredients, or null if none",
  "benefit": "one sentence about the most notable benefit, or null",
  "alternatives": ["healthier alternative product 1", "alternative 2", "alternative 3"]
}

Rules:
- "risk" must be exactly one of: "safe", "caution", "harmful"
- "health_score" must be exactly one of: "good", "okay", "bad"
- Include ALL ingredients from the list in "simplified"
- "warning" and "benefit" must be a string or null (never an empty string)
- "alternatives" must have 2-4 items`
      }
    ]
  })

  const rawContent = completion.choices[0].message.content.trim()
  console.log('[GROQ] Analysis response (first 400 chars):', rawContent.substring(0, 400))

  const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Invalid response from AI analysis service. Please try again.')
  }

  let result
  try {
    result = JSON.parse(jsonMatch[0])
  } catch (e) {
    throw new Error('Could not parse AI response. Please try again.')
  }

  // Sanitize to ensure correct types
  if (!Array.isArray(result.simplified)) result.simplified = []
  if (!['good', 'okay', 'bad'].includes(result.health_score)) result.health_score = 'okay'
  if (result.warning === '') result.warning = null
  if (result.benefit === '') result.benefit = null
  if (!Array.isArray(result.alternatives)) result.alternatives = []

  return result
}

module.exports = { extractIngredientsFromImage, analyzeIngredients }

// Quick test runner: node server/analyzeIngredients.js
if (require.main === module) {
  analyzeIngredients(
    "Lay's Classic Chips",
    "Potatoes, Vegetable Oil (Sunflower, Corn, and/or Canola Oil), Salt",
    "food"
  ).then(result => console.log(JSON.stringify(result, null, 2)))
   .catch(err => console.error('Test failed:', err.message))
}