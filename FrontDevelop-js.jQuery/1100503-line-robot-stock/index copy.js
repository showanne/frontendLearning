import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import iconv from 'iconv-lite'

// 讓套件讀取 .env 檔案
dotenv.config()
// 讀取後可以用 process.env.變數 使用
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

const arrSymbolId = []
const getlist = async () => {
  try {
    const { data } = await axios.get('https://members.sitca.org.tw/OPF/K0000/files/F/01/stock.txt', {
      responseType: 'arraybuffer',
      transformResponse: [
        data => {
          // 將檔案編碼改big5
          return iconv.decode(Buffer.from(data), 'big5')
        }
      ]
    })
    // 文字轉成陣列 .split(分割文字)
    const arr = data.split('\r\n')
    for (const i in arr) {
      arr[i] = arr[i].split(',')
      arrSymbolId.push(arr[i][0])
    }
    // console.log(arrSymbolId)
  } catch (error) {
    console.log(error)
  }
}
getlist()

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

// async <-> await
bot.on('message', async event => {
  console.log(event)

  if (event.message.type === 'text') {
    try {
      const responseChart = await axios.get(
        `https://api.fugle.tw/realtime/v0.2/intraday/chart?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
      )
      const responseMeta = await axios.get(
        `https://api.fugle.tw/realtime/v0.2/intraday/meta?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
      )
      const responseQuote = await axios.get(
        `https://api.fugle.tw/realtime/v0.2/intraday/quote?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
      )
      // const responseDealts = await axios.get(
      //   `https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=9`
      // )
      // const googleFin = await axios.get(`https://www.google.com/finance/quote/${encodeURI(event.message.text)}:TPE`)

      for (const c in responseChart.data.data.chart) {
        // console.log(c.substr(11, 5))
        // var chartMin = c.substr(11, 5)
        var chartData = responseChart.data.data.chart[c]
        // console.log(chartMin)
        // console.log(chartData)
      }

      // for (const d in responseDealts.data.data.dealts) {
      // var dealtsData = responseDealts.data.data.dealts[d]
      // console.log(dealtsData)
      // }

      const flex = {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'Detail',
              weight: 'bold',
              color: '#1DB446',
              size: 'sm'
            },
            {
              type: 'text',
              text: `${responseMeta.data.data.info.symbolId}`,
              weight: 'bold',
              size: 'xxl',
              margin: 'md'
            },
            {
              type: 'text',
              text: `${responseMeta.data.data.meta.nameZhTw}`,
              size: 'xs',
              color: '#aaaaaa',
              wrap: true
            },
            {
              type: 'separator',
              margin: 'xxl'
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'xxl',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '今日參考價',
                      size: 'sm',
                      color: '#555555',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: `${responseMeta.data.data.meta.priceReference}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '漲停價',
                      size: 'sm',
                      color: '#555555',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: `${responseMeta.data.data.meta.priceHighLimit}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '跌停價',
                      size: 'sm',
                      color: '#555555',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: `${responseMeta.data.data.meta.priceLowLimit}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '今日漲跌幅',
                      size: 'sm',
                      color: '#555555',
                      flex: 0
                    },
                    {
                      type: 'text',
                      text: `${responseQuote.data.data.quote.change}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'separator',
                  margin: 'xxl'
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'xxl',
                  contents: [
                    {
                      type: 'text',
                      text: '此分鐘',
                      size: 'sm',
                      color: '#555555'
                    },
                    {
                      type: 'text',
                      text: 'chartMin',
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '此分鐘的開盤價',
                      size: 'sm',
                      color: '#555555'
                    },
                    {
                      type: 'text',
                      text: `${chartData.open}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '此分鐘的最高價',
                      size: 'sm',
                      color: '#555555'
                    },
                    {
                      type: 'text',
                      text: `${chartData.high}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '此分鐘的最低價',
                      size: 'sm',
                      color: '#555555'
                    },
                    {
                      type: 'text',
                      text: `${chartData.low}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '此分鐘的收盤價',
                      size: 'sm',
                      color: '#555555'
                    },
                    {
                      type: 'text',
                      text: `${chartData.close}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'text',
                      text: '此分鐘的交易張數',
                      size: 'sm',
                      color: '#555555'
                    },
                    {
                      type: 'text',
                      text: `${chartData.unit}`,
                      size: 'sm',
                      color: '#111111',
                      align: 'end'
                    }
                  ]
                }
              ]
            },
            {
              type: 'separator',
              margin: 'xxl'
            },
            {
              type: 'box',
              layout: 'horizontal',
              margin: 'md',
              contents: [
                {
                  type: 'text',
                  text: '歷史資料查詢',
                  size: 'xs',
                  color: '#aaaaaa',
                  flex: 0,
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://www.google.com/finance/quote/${encodeURI(event.message.text)}:TPE?window=MAX`
                  }
                },
                {
                  type: 'text',
                  text: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()} ${new Date().getHours()}:${
                    new Date().getMinutes() + 1
                  }`,
                  color: '#aaaaaa',
                  size: 'xs',
                  align: 'end'
                }
              ]
            }
          ]
        },
        styles: {
          footer: {
            separator: true
          }
        }
      }

      const message = {
        type: 'flex',
        altText: `${event.message.text} Stock Market Live`,
        contents: {
          type: 'carousel',
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
