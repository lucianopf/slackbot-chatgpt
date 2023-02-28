require('dotenv').config()
const SmartSlack = require('smartslack')

const { makeQuestion } = require('./lib/chatgpt')
const { sendMessage } = require('./lib/slack')

const SLACKBOT_USER_ID = 'UMAKC8KTR'

const {
  SLACKBOT_TOKEN,
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
    console.log(message);

    const response = await makeQuestion(message.text.replace(`<@${SLACKBOT_USER_ID}>`, ''))

    const { text } = response.choices.pop()  

    const slackresponse = await sendMessage(text, message.channel, message.ts)

    console.log(slackresponse)
  }
})

smartSlackClient.start()