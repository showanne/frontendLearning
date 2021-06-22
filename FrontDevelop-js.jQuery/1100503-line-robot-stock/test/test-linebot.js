import linebot from 'linebot'
import dotenv from 'dotenv'
import fs from 'fs'

// 讓套件讀取 .env 檔案
dotenv.config()
// 讀取後可以用 process.env.變數 使用
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

// async <-> await
bot.on('message', async event => {
  console.log(event)

  if (event.type === 'message') {
    // console.log(arrSymbolId.includes(event.message.text))
    try {
      if (event.message.type === 'text') {
        const message = {
          // type: 'flex',
          // altText: `${event.message.text} Stock Menu`,
          // contents: {
          //   type: 'carousel',
          //   contents: flex
          // }

          // quickReply
          type: 'text',
          text: '你居住在台灣的哪個縣市?',
          quickReply: {
            items: [
              {
                type: 'action',
                imageUrl: 'https://xxx/image1.png',
                action: {
                  type: 'message',
                  label: 'A.台北',
                  text: '台北'
                }
              },
              {
                type: 'action',
                imageUrl: 'https://xxx/image2.png',
                action: {
                  type: 'message',
                  label: 'B.台中',
                  text: '台中'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'location',
                  label: '選擇地點'
                }
              }
            ]
          }

          // imagemap
          // type: 'imagemap',
          // baseUrl: 'https://i.imgur.com/Wvy5Sro.jpeg',
          // altText: 'this is an imagemap',
          // baseSize: { height: 1040, width: 1040 },
          // actions: [
          //   {
          //     type: 'uri',
          //     linkUri: 'https://example.com/',
          //     area: { x: 0, y: 0, width: 520, height: 1040 }
          //   },
          //   {
          //     type: 'message',
          //     text: 'hello',
          //     area: { x: 520, y: 0, width: 520, height: 1040 }
          //   }
          // ]
        }

        fs.writeFileSync('test-linebot.json', JSON.stringify(message, null, 2))
        event.reply(message)
      }
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤 QQ')
    }
  }
})
