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
      const responseSearch = await axios.get(`https://api.cnyes.com/media/api/v1/search?q=${encodeURI(event.message.text)}`)

      const newsArr = responseSearch.data.items.data

      const flex = [
        {
          type: 'bubble',
          size: 'micro',
          hero: {
            type: 'image',
            url: `${newsArr[0].coverSrc.xl.src}`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '320:213',
            action: {
              type: 'uri',
              label: 'action',
              uri: 'http://linecorp.com/'
            }
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${newsArr[0].title}`,
                weight: 'bold',
                size: 'sm',
                wrap: true,
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[0].newsId)}`
                },
                maxLines: 3
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                  },
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                  },
                  {
                    type: 'text',
                    text: `${new Date(newsArr[0].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'md',
                    flex: 0
                  }
                ]
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: `${newsArr[0].keyword.join('、')}`,
                        wrap: false,
                        style: 'italic',
                        color: '#8c8c8c',
                        size: 'xs',
                        flex: 5
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          }
        },
        {
          type: 'bubble',
          size: 'micro',
          hero: {
            type: 'image',
            url: `${newsArr[1].coverSrc.xl.src}`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '320:213',
            action: {
              type: 'uri',
              label: 'action',
              uri: 'http://linecorp.com/'
            }
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${newsArr[1].title}`,
                weight: 'bold',
                size: 'sm',
                wrap: true,
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[1].newsId)}`
                },
                maxLines: 3
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                  },
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                  },
                  {
                    type: 'text',
                    text: `${new Date(newsArr[1].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'md',
                    flex: 0
                  }
                ]
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: `${newsArr[1].keyword.join('、')}`,
                        wrap: false,
                        style: 'italic',
                        color: '#8c8c8c',
                        size: 'xs',
                        flex: 5
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          }
        },
        {
          type: 'bubble',
          size: 'micro',
          hero: {
            type: 'image',
            url: `${newsArr[3].coverSrc.xl.src}`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '320:213',
            action: {
              type: 'uri',
              label: 'action',
              uri: 'http://linecorp.com/'
            }
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${newsArr[3].title}`,
                weight: 'bold',
                size: 'sm',
                wrap: true,
                action: {
                  type: 'uri',
                  label: 'action',
                  uri: `https://news.cnyes.com/news/id/${encodeURI(newsArr[3].newsId)}`
                },
                maxLines: 3
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png'
                  },
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png'
                  },
                  {
                    type: 'text',
                    text: `${new Date(newsArr[3].publishAt * 1000).toLocaleString('zh-tw').substr(0, 10)}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'md',
                    flex: 0
                  }
                ]
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: `${newsArr[3].keyword.join('、')}`,
                        wrap: false,
                        style: 'italic',
                        color: '#8c8c8c',
                        size: 'xs',
                        flex: 5
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          }
        }
      ]
      const message = {
        type: 'flex',
        altText: `${event.message.text} Stock News`,
        contents: {
          type: 'carousel',
          contents: flex
        }
      }

      fs.writeFileSync('stock-news.json', JSON.stringify(message, null, 2))
      event.reply(message)
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤QQ')
    }
  }
})
