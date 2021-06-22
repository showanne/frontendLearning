import linebot from 'linebot'
import dotenv from 'dotenv'
// import axios from 'axios'
import fs from 'fs'
// import iconv from 'iconv-lite'

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

  if (event.message.type === 'text') {
    try {
      const flex = {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'image',
                      url: 'http://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip8.jpg',
                      size: 'full',
                      aspectMode: 'cover',
                      aspectRatio: '15:98',
                      gravity: 'center'
                    }
                  ],
                  flex: 1
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'image',
                      url: 'http://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip13.jpg',
                      aspectMode: 'cover',
                      size: 'full'
                    }
                  ],
                  cornerRadius: '100px',
                  width: '72px',
                  height: '72px'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      contents: [
                        {
                          type: 'span',
                          text: `${event.message.text}`,
                          weight: 'bold',
                          color: '#000000'
                        },
                        {
                          type: 'span',
                          text: '     |     '
                        },
                        {
                          type: 'span',
                          text: '新聞標題  新聞標題  新聞標題  新聞標題  新聞標題'
                        }
                      ],
                      size: 'sm',
                      wrap: true
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: '新聞小標',
                          size: 'sm',
                          color: '#bcbcbc'
                        },
                        {
                          type: 'text',
                          text: '新聞時間',
                          size: 'sm',
                          color: '#bcbcbc'
                        }
                      ],
                      spacing: 'sm',
                      margin: 'md'
                    }
                  ]
                }
              ],
              spacing: 'xl',
              paddingAll: '20px'
            }
          ],
          paddingAll: '0px'
        }
      }

      const message = {
        type: 'flex',
        altText: `${event.message.text} Stock Market Live`,
        contents: {
          type: 'bubble',
          contents: [flex]
        }
      }

      fs.writeFileSync('stock-text.json', JSON.stringify(message, null, 2))
      event.reply(message)
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤QQ')
    }
  }
})
