require('dotenv').config()
const { App } = require('@slack/bolt')
const { makeQuestion } = require('./lib/chatgpt')

const {
  SLACKBOT_TOKEN,
  SLACKBOT_APP_TOKEN,
  SLACKBOT_USER_ID,
} = process.env  

const app = new App({
  token: SLACKBOT_TOKEN, 
  appToken: SLACKBOT_APP_TOKEN,
  socketMode: true,
})

async function main () {
  await app.start();
  console.log('⚡️ Bolt app started')

  app.message(async ({ message, say }) => {
    if (
      message.type === 'message' &&
      message.text &&
      message.text.includes(`<@${SLACKBOT_USER_ID}>`) &&
      message.subtype !== 'channel_join'
    ) {
      try {
        console.log(JSON.stringify(message))
  
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
  
        await say({
          text: content,
          thread_ts: message.ts,
        })
      } catch (error) {
        console.log(error)
      }
    }
  })
}

main()
