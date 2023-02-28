const axios = require('axios')

const {
  CHATGPT_TOKEN,
} = process.env  

const defaultOptions = {
  model: 'text-davinci-003',
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

async function makeQuestion (question) {
  try {
    const response = await chatGPTClient.post(
      '/completions',
      {
        ...defaultOptions,
        "prompt": question,
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