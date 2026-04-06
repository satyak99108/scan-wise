require('dotenv').config({ path: '.env' })
const Groq = require('groq-sdk')

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function analyzeIngredients(productName, ingredients, category) {
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

  return JSON.parse(completion.choices[0].message.content)
}

// Test it
analyzeIngredients(
  "Lay's Classic Chips",
  "Potatoes, Vegetable Oil, Salt, Dextrose, Sodium Diacetate",
  "human food"
).then(result => console.log(JSON.stringify(result, null, 2)))