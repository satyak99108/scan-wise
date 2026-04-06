const Tesseract = require('tesseract.js')
const path = require('path')
const fs = require('fs')
const os = require('os')

async function extractIngredientsFromImage(imageBuffer, fileName) {
  let tempFilePath = null
  try {
    console.log(`[DEBUG] Processing image: ${fileName}, Buffer size: ${imageBuffer.length} bytes`)

    // Save buffer to temporary file (Tesseract works better with file paths)
    tempFilePath = path.join(os.tmpdir(), `scan_${Date.now()}_${fileName}`)
    fs.writeFileSync(tempFilePath, imageBuffer)
    console.log(`[DEBUG] Saved temp image to: ${tempFilePath}`)

    console.log(`[DEBUG] Running Tesseract OCR...`)
    
    // Use Tesseract.js to extract text from image
    const { data: { text } } = await Tesseract.recognize(
      tempFilePath,
      'eng',
      { 
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`[DEBUG] OCR Progress: ${Math.round(m.progress * 100)}%`)
          }
        }
      }
    )

    console.log(`[DEBUG] OCR completed. Extracted text (first 300 chars): ${text.substring(0, 300)}...`)

    if (!text || text.trim().length === 0) {
      throw new Error('No text detected in image. Please ensure the image shows a clear product label or ingredient list.')
    }

    // Use Groq to parse the extracted text and get product name and ingredients
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set in environment variables')
    }

    const Groq = require('groq-sdk')
    const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })

    console.log(`[DEBUG] Sending OCR text to Groq for parsing...`)
    const parseResponse = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `From the following product image text, extract the product name and ingredients list. Return ONLY a JSON object with "productName" and "ingredients" fields.

Text from image:
${text}

Return ONLY valid JSON in this exact format:
{"productName": "product name here", "ingredients": "ingredient1, ingredient2, ingredient3"}`
      }]
    })

    const content = parseResponse.choices[0].message.content
    console.log(`[DEBUG] Groq parse response: ${content}`)
    
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error(`[ERROR] No JSON found in response: ${content}`)
      throw new Error('Could not parse product information from image')
    }
    
    const extracted = JSON.parse(jsonMatch[0])
    console.log(`[DEBUG] Successfully parsed: productName="${extracted.productName}", ingredients="${extracted.ingredients}"`)
    
    if (!extracted.productName && !extracted.ingredients) {
      throw new Error('Could not extract product name or ingredients from image text')
    }
    
    return {
      productName: extracted.productName || 'Unknown Product',
      ingredients: extracted.ingredients
    }
  } catch (err) {
    console.error('[ERROR] Image extraction failed:', err.message)
    console.error('[ERROR] Stack:', err.stack)
    throw new Error('Failed to extract ingredients from image: ' + err.message)
  } finally {
    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
        console.log(`[DEBUG] Cleaned up temp file`)
      } catch (e) {
        console.log(`[DEBUG] Could not clean up temp file: ${e.message}`)
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

  const completion = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are a product safety assistant. Analyze this ${category} product.
Product: ${productName}
Ingredients: ${ingredients}

Return ONLY a JSON object (no extra text) with this exact structure:
{
  "simplified": [
    { "original": "ingredient name", "simple": "what it is in plain English", "risk": "safe/caution/harmful" }
  ],
  "health_score": "good/okay/bad",
  "warning": "one sentence warning if any, or null",
  "benefit": "one sentence benefit, or null",
  "alternatives": ["better product 1", "better product 2", "better product 3"]
}`
    }]
  })

  const content = completion.choices[0].message.content
  console.log('Groq response:', content)
  
  // Try to extract JSON from the response (in case there's extra text)
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in Groq response: ' + content)
  }
  
  return JSON.parse(jsonMatch[0])
}

module.exports = { extractIngredientsFromImage, analyzeIngredients }

// Test it
if (require.main === module) {
  analyzeIngredients(
    "Lay's Classic Chips",
    "Potatoes, Vegetable Oil, Salt, Dextrose, Sodium Diacetate",
    "human food"
  ).then(result => console.log(JSON.stringify(result, null, 2)))
}