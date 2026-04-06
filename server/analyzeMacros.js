const Tesseract = require('tesseract.js')
const path = require('path')
const fs = require('fs')
const os = require('os')

async function analyzeMacros(imageBuffer, mimeType) {
  let tempFilePath = null
  try {
    // 1. Temporary File Save for reliable Tesseract OCR
    const fileName = `macro_target_${Date.now()}.png`
    tempFilePath = path.join(os.tmpdir(), fileName)
    fs.writeFileSync(tempFilePath, imageBuffer)
    console.log(`[MACROS OCR] Saved temp image to: ${tempFilePath}`)

    console.log(`[MACROS OCR] Running Tesseract...`)
    const { data: { text, confidence } } = await Tesseract.recognize(
      tempFilePath,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            process.stdout.write(`\r[MACROS OCR] Progress: ${Math.round(m.progress * 100)}%`)
          }
        },
        tessedit_pageseg_mode: '3',
        tessedit_ocr_engine_mode: '1',
      }
    )
    console.log(`\n[MACROS OCR] Completed. Confidence: ${Math.round(confidence)}%`)
    const extractedText = text.trim()
    
    if (extractedText.length < 5) {
      throw new Error("Target image must be a nutrition label or text-based menu. Neural vision is offline, cannot parse raw food photos.")
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set. Please add it to your .env file.')
    }

    const Groq = require('groq-sdk')
    const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })

    // 2. Neural Parsing using the exact same API (llama-3.1-8b-instant) as analyzeIngredients
    console.log(`[MACROS GROQ] Sending OCR text to Groq...`)
    const completion = await groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 600,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "You are an expert clinical nutritionist AI. Read the OCR text from a nutrition label or food menu and estimate the macronutrients per serving. You must respond strictly in JSON format. Do not include markdown wrappers or conversational text.\n\nJSON SCHEMA:\n{\n  \"food_detected\": \"Short description of the food item\",\n  \"calories\": 500,\n  \"protein\": 30,\n  \"carbs\": 40,\n  \"fats\": 20,\n  \"breakdown\": [\"Item 1\", \"Item 2\"],\n  \"confidence\": \"high|medium|low\"\n}"
        },
        {
          role: "user",
          content: `Estimate the calories and macros from this OCR text: ${extractedText}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const rawContent = completion.choices[0].message.content.trim()
    console.log(`[MACROS GROQ] Parse response:`, rawContent)

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response from AI analysis service.')
    }

    let parsedData
    try {
      parsedData = JSON.parse(jsonMatch[0])
    } catch (parseErr) {
      throw new Error('Could not read the macro data JSON.')
    }
    
    return parsedData;

  } catch (error) {
    console.error("[MACRO AI ERR]", error.name, error.message);
    throw new Error(error.message || "Neural processing failed to extract metrics from image.");
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath)
        console.log(`[MACROS OCR] Cleaned up temp file`)
      } catch (e) {
        console.log(`[MACROS OCR] Could not clean up temp file: ${e.message}`)
      }
    }
  }
}

module.exports = { analyzeMacros };
