require('dotenv').config()
const SmartSlack = require('smartslack')

const { makeQuestion } = require('./lib/chatgpt')
const { sendMessage } = require('./lib/slack')

const {
  SLACKBOT_TOKEN,
  SLACKBOT_USER_ID,
} = process.env  

const smartSlackClient = new SmartSlack({ token: SLACKBOT_TOKEN })
 
smartSlackClient.on('error', (error) => console.log(error))
  
smartSlackClient.on('connected', () => console.log('Bot connected and watching for messages.'))
  
smartSlackClient.on('message', async (message) => {
  if (
    message.type === 'message' &&
    message.text &&
    message.text.includes(`<@${SLACKBOT_USER_ID}>`) &&
    message.subtype !== 'channel_join') {
    console.log(message)

    let user = message.ts

    if (message.thread_ts) {
      user = message.thread_tsx
    }

    const response = await makeQuestion(
      message.text.replace(`<@${SLACKBOT_USER_ID}>`, ''),
      user
    )

    console.log(JSON.stringify(response))

    const { message: responseMessage } = response.choices.pop()  
    const { content } = responseMessage

    const slackresponse = await sendMessage(content, message.channel, message.ts)

    console.log(slackresponse)
  }
})

smartSlackClient.start()