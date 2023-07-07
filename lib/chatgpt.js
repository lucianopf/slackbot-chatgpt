const axios = require('axios')

const {
  CHATGPT_TOKEN,
} = process.env  

const defaultOptions = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 1024,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0
}

const chatGPTClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 60000,
  headers: {
    'Authorization': `Bearer ${CHATGPT_TOKEN}`,
    'Content-Type': 'application/json',
  },
})

async function makeQuestion (question, user) {
  try {
    const response = await chatGPTClient.post(
      '/chat/completions',
      {
        ...defaultOptions,
        "messages": [
          // { role: 'user', content: 'Voce finge ser um humano e não um asssitente virtual e fala Português como língua primária.'},
          { role: 'user', content: question },
        ],
        user,
      }
    )

    return response.data
  } catch (error) {
    console.error('There was an error with your request...')
    console.error(error.message)

    throw error
  }
}

module.exports = {
  makeQuestion,
}