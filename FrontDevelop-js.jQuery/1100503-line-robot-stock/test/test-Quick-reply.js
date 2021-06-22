import linebot from 'linebot'
import dotenv from 'dotenv'
// import axios from 'axios'
// import fs from 'fs'
// import iconv from 'iconv-lite'

// 讓套件讀取 .env 檔案
dotenv.config()
// 讀取後可以用 process.env.變數 使用
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
// CommonJS
const Client = require('@line/bot-sdk').Client

// ES6 modules or TypeScript
// import {Client} from '@line/bot-sdk'

const client = new Client({
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

// async <-> await
bot.on('message', async event => {
  // const event = req.body.events[0]
  console.log(event)

  if (event.type === 'message') {
    const message = event.message

    if (message.type === 'text' && message.text === 'bye') {
      if (event.source.type === 'room') {
        client.leaveRoom(event.source.roomId)
      } else if (event.source.type === 'group') {
        client.leaveGroup(event.source.groupId)
      } else {
        client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'I cannot leave a 1-on-1 chat!'
        })
      }
    }

    event.reply(message)
  }
  client.replyMessage(replyToken, message).catch(err => {
    if (err instanceof HTTPError) {
      console.error(err.statusCode)
    }
  })

  const stream = client.getMessageContent(messageId)
  stream.on('error', err => {
    console.log(err.message)
  })
})
