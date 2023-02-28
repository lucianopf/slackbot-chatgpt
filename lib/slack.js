const axios = require('axios')

const {
  SLACKBOT_TOKEN,
} = process.env  

const slackClient = axios.create({
  baseURL: 'https://slack.com/api',
  timeout: 100000,
  headers: {
    'Authorization': `Bearer ${SLACKBOT_TOKEN}`, 
    'Content-Type': 'application/json', 
  },
})

async function sendMessage (message, target, ts) {
  try {
    const { data } = await slackClient.post(
      '/chat.postMessage',
      {
        channel: target,
        text: message,
        thread_ts: ts,
      }
    )

    return data
  } catch (error) {
    console.log('Error sending message to Slack')
    console.log(error.message)

    throw error
  }
}

module.exports = {
  sendMessage,
}
