require('dotenv').config({ path: '.env' })
const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

async function test() {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: 'Say hello and confirm you are working.'
    }]
  })
  console.log(message.content[0].text)
}

test()