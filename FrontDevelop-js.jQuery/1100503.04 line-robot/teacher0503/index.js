import linebot from 'linebot'
import dotenv from 'dotenv'
import fs from 'fs'

// 讓套件讀取 .env 檔案
// 讀取後可以用 process.env.變數 使用
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

const flex = {
  type: 'bubble',
  hero: {
    type: 'image',
    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
    size: 'full',
    aspectRatio: '20:13',
    aspectMode: 'cover',
    action: {
      type: 'uri',
      uri: 'http://linecorp.com/'
    }
  },
  body: {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'Brown Cafe',
        weight: 'bold',
        size: 'xl'
      },
      {
        type: 'box',
        layout: 'baseline',
        margin: 'md',
        contents: [
          {
            type: 'icon',
            size: 'sm',
            url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
          },
          {
            type: 'icon',
            size: 'sm',
            url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
          },
          {
            type: 'text',
            text: '4.0',
            size: 'sm',
            color: '#999999',
            margin: 'md',
            flex: 0
          }
        ]
      },
      {
        type: 'box',
        layout: 'vertical',
        margin: 'lg',
        spacing: 'sm',
        contents: [
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: 'Place',
                color: '#aaaaaa',
                size: 'sm',
                flex: 1
              },
              {
                type: 'text',
                text: 'Miraina Tower, 4-1-6 Shinjuku, Tokyo',
                wrap: true,
                color: '#666666',
                size: 'sm',
                flex: 5
              }
            ]
          },
          {
            type: 'box',
            layout: 'baseline',
            spacing: 'sm',
            contents: [
              {
                type: 'text',
                text: 'Time',
                color: '#aaaaaa',
                size: 'sm',
                flex: 1
              },
              {
                type: 'text',
                text: '10:00 - 23:00',
                wrap: true,
                color: '#666666',
                size: 'sm',
                flex: 5
              }
            ]
          }
        ]
      }
    ]
  },
  footer: {
    type: 'box',
    layout: 'vertical',
    spacing: 'sm',
    contents: [
      {
        type: 'button',
        style: 'link',
        height: 'sm',
        action: {
          type: 'uri',
          label: 'CALL',
          uri: 'https://linecorp.com'
        }
      },
      {
        type: 'button',
        style: 'link',
        height: 'sm',
        action: {
          type: 'uri',
          label: 'WEBSITE',
          uri: 'https://linecorp.com'
        }
      },
      {
        type: 'spacer',
        size: 'sm'
      }
    ],
    flex: 0
  }
}

bot.on('message', async event => {
  if (event.message.type === 'text') {
    const message = {
      type: 'flex',
      altText: '這是 flex',
      contents: {
        type: 'carousel',
        contents: [flex]
      }
    }

    fs.writeFileSync('aaa.json', JSON.stringify(message, null, 2))
    event.reply(message)
  }
})
