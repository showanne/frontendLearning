import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import fs from 'fs'
import iconv from 'iconv-lite'
import schedule from 'node-schedule'

// 讓套件讀取 .env 檔案
dotenv.config()
// 讀取後可以用 process.env.變數 使用
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 目前所有股票清單抓取
const arrSymbolId = []
const getlist = async () => {
  try {
    const { data } = await axios.get(
      'https://members.sitca.org.tw/OPF/K0000/files/F/01/stock.txt',
      {
        responseType: 'arraybuffer',
        transformResponse: [
          data => {
            // 將檔案編碼改big5
            return iconv.decode(Buffer.from(data), 'big5')
          }
        ]
      }
    )
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

// 每天於服務器0點時更新資料
schedule.scheduleJob('* * 0 * *', getlist)
// 機器人啟動時也要有資料
getlist()

// 現在時間
// const nowTime = new Date().toLocaleString('zh-TW', {
//   hour12: false,
//   timeZone: 'Asia/Taipei'
// })
// "2021/6/4 19:01:18"

// '人氣股票' 用於範例
const stockPop = [
  '00888',
  '0050',
  '0056',
  '00692',
  '2330',
  '2890',
  '2886',
  '1101',
  '2884',
  '2881',
  '1434',
  '2385',
  '1102',
  '2542',
  '2892',
  '3702',
  '2887',
  '5880',
  '2852',
  '2851',
  '6024',
  '6023'
]
// 0 ~ stockPop.length 的隨機
const stockRandom = () => {
  return Math.floor(Math.random() * stockPop.length)
}

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
        // toLowerCase 英文大寫轉小寫，中文字不影響
        event.message.text = event.message.text.toLowerCase()

        if (event.message.text.includes('market')) {
          const marketI = event.message.text.indexOf('market') - 1
          // console.log(marketI)

          // 現在時間
          const nowTime = new Date().toLocaleString('zh-TW', {
            hour12: false,
            timeZone: 'Asia/Taipei'
          })
          // "2021/6/4 19:01:18"

          const responseMeta = await axios.get(
            `https://api.fugle.tw/realtime/v0.2/intraday/meta?symbolId=${encodeURI(
              event.message.text.substr(0, marketI)
            )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
          )
          const responseQuote = await axios.get(
            `https://api.fugle.tw/realtime/v0.2/intraday/quote?symbolId=${encodeURI(
              event.message.text.substr(0, marketI)
            )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
          )
          // const responseDealts = await axios.get(
          //   `https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.message.text.substr(0, (event.message.text.indexOf("news")-1)))}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=9`
          // )

          const responseCnyesCharting = await axios.get(
            `https://ws.api.cnyes.com/ws/api/v1/charting/history?resolution=1&symbol=TWS:${encodeURI(
              event.message.text.substr(0, marketI)
            )}:STOCK&quote=1`
          )

          const responseCnyesQuoteK = await axios.get(
            `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/TWS:${encodeURI(
              event.message.text.substr(0, marketI)
            )}:STOCK?column=K`
          )

          const responseCnyesQuoteI = await axios.get(
            `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/TWS:${encodeURI(
              event.message.text.substr(0, marketI)
            )}:STOCK?column=I`
          )

          // console.log(responseCnyesQuoteK.data.data[0])
          // console.log(responseCnyesQuoteK.data.data[0]['200056'])
          // console.log(responseCnyesCharting.data.data.quote)
          // console.log(responseCnyesCharting.data.data.quote['800001'])
          // console.log(responseCnyesCharting.data.data.o[responseCnyesCharting.data.data.o.length - 1])

          const flex = [
            // 個股日成交資訊
            {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  // 個股資訊背景
                  {
                    type: 'image',
                    url: 'https://imgur.com/7BTFHmI.png',
                    aspectMode: 'cover',
                    aspectRatio: '115:150',
                    flex: 1,
                    gravity: 'top',
                    size: 'full',
                    align: 'center'
                  },
                  {
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
                              // 股票代號
                              {
                                type: 'text',
                                text: `${responseMeta.data.data.info.symbolId}`,
                                weight: 'bold',
                                size: 'xxl',
                                margin: 'none',
                                color: '#2A1E5C'
                              },
                              // 股票中文名稱
                              {
                                type: 'text',
                                text: `${responseMeta.data.data.meta.nameZhTw}`,
                                size: 'sm',
                                color: '#2A1E5Caa',
                                wrap: true,
                                margin: 'sm',
                                offsetStart: 'xs'
                              }
                            ],
                            width: '40%'
                          },
                          {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                              // 漲跌 change '11'
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    text: '漲跌',
                                    size: 'xxs',
                                    color: '#555555',
                                    flex: 0
                                  },
                                  {
                                    type: 'text',
                                    text: `${responseCnyesCharting.data.data.quote['11']}`,
                                    size: 'lg',
                                    color: '#111111',
                                    align: 'start',
                                    offsetStart: '19px'
                                  }
                                ]
                              },
                              // 漲跌幅 changePercent '56'
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    text: '漲跌幅',
                                    size: 'xxs',
                                    color: '#555555',
                                    flex: 0
                                  },
                                  {
                                    type: 'text',
                                    text: `${responseCnyesCharting.data.data.quote['56']}%`,
                                    size: 'lg',
                                    color: '#111111',
                                    align: 'start'
                                  }
                                ]
                              }
                            ],
                            margin: 'lg',
                            cornerRadius: 'lg',
                            paddingAll: 'md',
                            backgroundColor: '#e6ff9288',
                            spacing: 'md',
                            paddingTop: 'xl'
                          }
                        ]
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        spacing: 'sm',
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
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      // 股價
                                      {
                                        type: 'text',
                                        text: '股價',
                                        size: 'sm',
                                        color: '#555555',
                                        flex: 0
                                      },
                                      {
                                        type: 'text',
                                        text: `${responseCnyesCharting.data.data.quote['6']}`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'start',
                                        offsetStart: '19px'
                                      }
                                    ]
                                  },
                                  // 開盤價 priceOpen o
                                  {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      {
                                        type: 'text',
                                        text: '開盤價',
                                        size: 'sm',
                                        color: '#555555',
                                        flex: 0
                                      },
                                      {
                                        type: 'text',
                                        text: `${
                                          responseCnyesCharting.data.data.o[
                                            responseCnyesCharting.data.data.o
                                              .length - 1
                                          ]
                                        }`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'start',
                                        offsetStart: '19px'
                                      }
                                    ],
                                    margin: 'md'
                                  },
                                  // 最高價 priceHigh h
                                  {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      {
                                        type: 'text',
                                        text: '最高價',
                                        size: 'sm',
                                        color: '#555555',
                                        flex: 0,
                                        margin: 'sm'
                                      },
                                      {
                                        type: 'text',
                                        text: `${
                                          responseCnyesCharting.data.data.h[
                                            responseCnyesCharting.data.data.h
                                              .length - 1
                                          ]
                                        }`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'start',
                                        offsetStart: '19px'
                                      }
                                    ]
                                  },
                                  // 最低價 priceLow l
                                  {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      {
                                        type: 'text',
                                        text: '最低價',
                                        size: 'sm',
                                        color: '#555555',
                                        flex: 0,
                                        margin: 'xs'
                                      },
                                      {
                                        type: 'text',
                                        text: `${
                                          responseCnyesCharting.data.data.l[
                                            responseCnyesCharting.data.data.l
                                              .length - 1
                                          ]
                                        }`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'start',
                                        offsetStart: '19px'
                                      }
                                    ]
                                  },
                                  // 收盤價 c
                                  {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      {
                                        type: 'text',
                                        text: '收盤價',
                                        size: 'sm',
                                        color: '#555555',
                                        flex: 0,
                                        margin: 'xs'
                                      },
                                      {
                                        type: 'text',
                                        text: `${
                                          responseCnyesCharting.data.data.c[
                                            responseCnyesCharting.data.data.c
                                              .length - 1
                                          ]
                                        }`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'start',
                                        offsetStart: '19px'
                                      }
                                    ]
                                  },
                                  // 昨收
                                  {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      {
                                        type: 'text',
                                        text: '昨收',
                                        size: 'sm',
                                        color: '#555555',
                                        flex: 0
                                      },
                                      {
                                        type: 'text',
                                        text: `${responseCnyesCharting.data.data.quote['21']}`,
                                        size: 'sm',
                                        color: '#111111',
                                        align: 'start',
                                        offsetStart: '19px'
                                      }
                                    ],
                                    margin: 'md'
                                  }
                                ],
                                backgroundColor: '#ffae8e66',
                                cornerRadius: 'lg',
                                paddingAll: 'md',
                                width: '40%',
                                paddingStart: 'xxl'
                              },
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      // 成交張數 unit '800001'
                                      {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                          {
                                            type: 'text',
                                            text: '總成交張數',
                                            size: 'sm',
                                            color: '#555555',
                                            flex: 0
                                          },
                                          {
                                            type: 'text',
                                            text: `${responseCnyesCharting.data.data.quote['800001']}`,
                                            size: 'sm',
                                            color: '#111111',
                                            align: 'start',
                                            offsetStart: '19px'
                                          }
                                        ]
                                      },
                                      // 1日高低 '13'~'12'
                                      {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                          {
                                            type: 'text',
                                            text: '1日高低',
                                            size: 'sm',
                                            color: '#555555',
                                            flex: 0
                                          },
                                          {
                                            type: 'text',
                                            text: `${responseCnyesQuoteI.data.data[0]['13']} ~ ${responseCnyesQuoteI.data.data[0]['12']}`,
                                            size: 'sm',
                                            color: '#111111',
                                            align: 'start',
                                            offsetStart: '19px'
                                          }
                                        ]
                                      },
                                      // 52週高低 '3266'~'3265'
                                      {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                          {
                                            type: 'text',
                                            text: '52週高低',
                                            size: 'sm',
                                            color: '#555555',
                                            flex: 0
                                          },
                                          {
                                            type: 'text',
                                            text: `${responseCnyesQuoteI.data.data[0]['3266']} ~ ${responseCnyesQuoteI.data.data[0]['3265']}`,
                                            size: 'sm',
                                            color: '#111111',
                                            align: 'start',
                                            offsetStart: '19px'
                                          }
                                        ]
                                      }
                                    ],
                                    backgroundColor: '#c4e3ff88',
                                    paddingAll: 'md',
                                    cornerRadius: 'lg'
                                  },
                                  // 本益比 '700001'
                                  {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                      {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                          {
                                            type: 'text',
                                            text: '本益比',
                                            size: 'sm',
                                            color: '#555555',
                                            flex: 0
                                          },
                                          {
                                            type: 'text',
                                            text: `${responseCnyesQuoteI.data.data[0]['700001']}`,
                                            size: 'sm',
                                            color: '#111111',
                                            align: 'start',
                                            offsetStart: '19px'
                                          }
                                        ]
                                      },
                                      // 本淨比 '700006'
                                      {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                          {
                                            type: 'text',
                                            text: '本淨比',
                                            size: 'sm',
                                            color: '#555555',
                                            flex: 0
                                          },
                                          {
                                            type: 'text',
                                            text: `${responseCnyesQuoteI.data.data[0]['700006']}`,
                                            size: 'sm',
                                            color: '#111111',
                                            align: 'start',
                                            offsetStart: '19px'
                                          }
                                        ]
                                      },
                                      // 市值 (億) '700005'
                                      {
                                        type: 'box',
                                        layout: 'vertical',
                                        contents: [
                                          {
                                            type: 'text',
                                            text: '市值(億)',
                                            size: 'sm',
                                            color: '#555555',
                                            flex: 0
                                          },
                                          {
                                            type: 'text',
                                            text: `${
                                              responseCnyesQuoteI.data.data[0][
                                                '700005'
                                              ] / 100000000
                                            } `,
                                            size: 'sm',
                                            color: '#111111',
                                            align: 'start',
                                            offsetStart: '19px'
                                          }
                                        ]
                                      }
                                    ],
                                    backgroundColor: '#c4e3ff88',
                                    margin: 'lg',
                                    cornerRadius: 'lg',
                                    paddingAll: 'md'
                                  }
                                ],
                                margin: 'lg'
                              }
                            ],
                            margin: 'md'
                          }
                        ],
                        margin: 'md'
                      }
                    ],
                    position: 'absolute',
                    offsetTop: '0px',
                    offsetBottom: '0px',
                    offsetStart: '0px',
                    offsetEnd: '0px',
                    paddingAll: 'xxl'
                  }
                ],
                paddingAll: '0px'
              },
              styles: {
                footer: {
                  separator: true
                }
              }
            },
            // 個股 最佳五檔及內外盤比
            {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  // 股票代號
                  {
                    type: 'text',
                    text: `${responseMeta.data.data.info.symbolId}`,
                    weight: 'bold',
                    size: 'xxl',
                    margin: 'none',
                    color: '#2A1E5C'
                  },
                  // 股票中文名稱
                  {
                    type: 'text',
                    text: `${responseMeta.data.data.meta.nameZhTw}`,
                    size: 'sm',
                    color: '#2A1E5Caa',
                    wrap: true,
                    margin: 'sm',
                    offsetStart: 'xs'
                  },
                  {
                    type: 'separator',
                    margin: 'md'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    margin: 'md',
                    spacing: 'sm',
                    contents: [
                      // 買 bestBids 賣 bestAsks
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '買',
                            align: 'center',
                            color: '#FF5D73'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: '賣',
                            align: 'center',
                            color: '#06A77D'
                          }
                        ],
                        justifyContent: 'space-between',
                        margin: 'md'
                      },
                      // 0
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[0].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[0].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[0].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[0].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ],
                        margin: 'md'
                      },
                      // 1
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[1].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[1].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[1].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[1].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ],
                        margin: 'md'
                      },
                      // 2
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[2].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[2].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[2].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[2].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ],
                        margin: 'md'
                      },
                      // 3
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[3].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[3].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[3].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[3].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ],
                        margin: 'md'
                      },
                      // 4
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[4].unit}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestBids[4].price}`,
                            size: 'sm',
                            color: '#FF5D73',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[4].price}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'text',
                            text: `${responseQuote.data.data.quote.order.bestAsks[4].unit}`,
                            size: 'sm',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ],
                        margin: 'md'
                      },
                      // 內外盤比
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: '內外盤比',
                            align: 'center',
                            color: '#2A1E5Cdd'
                          }
                        ],
                        justifyContent: 'space-between',
                        margin: 'xl'
                      },
                      // 內外盤比 百分比 長條圖
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              {
                                type: 'filler'
                              }
                            ],
                            width: `${responseCnyesQuoteK.data.data[0]['200056']}%`,
                            backgroundColor: '#FF5D73',
                            height: '8px'
                          }
                        ],
                        backgroundColor: '#06A77D',
                        height: '8px',
                        margin: 'sm'
                      },
                      // 內外盤比 百分比 及 張數
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          // 內盤
                          {
                            type: 'text',
                            text: `${responseCnyesQuoteK.data.data[0]['200056']}% (${responseCnyesQuoteK.data.data[0]['200054']})`,
                            size: 'sm',
                            gravity: 'top',
                            color: '#FF5D73',
                            align: 'start',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          },
                          {
                            type: 'filler'
                          },
                          // 外盤
                          {
                            type: 'text',
                            text: `${responseCnyesQuoteK.data.data[0]['200057']}% (${responseCnyesQuoteK.data.data[0]['200055']})`,
                            size: 'sm',
                            gravity: 'top',
                            color: '#06A77D',
                            align: 'end',
                            wrap: false,
                            adjustMode: 'shrink-to-fit'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'separator',
                    margin: 'md'
                  },
                  // 即時走勢
                  {
                    type: 'box',
                    layout: 'horizontal',
                    margin: 'md',
                    contents: [
                      {
                        type: 'text',
                        text: '即時走勢',
                        size: 'xs',
                        color: '#aaaaaa',
                        flex: 0,
                        offsetStart: 'sm',
                        action: {
                          type: 'uri',
                          label: 'action',
                          uri: `https://www.google.com/finance/quote/${encodeURI(
                            event.message.text.substr(0, marketI)
                          )}:TPE`
                        }
                      },
                      // 當下時間
                      {
                        type: 'text',
                        text: `${nowTime}`,
                        color: '#aaaaaa',
                        size: 'xs',
                        align: 'end',
                        offsetEnd: 'sm'
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
          ]

          const message = {
            type: 'flex',
            altText: `${event.message.text.substr(0, marketI)} 即時股市行情`,
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync(
            './fs/stock-market.json',
            JSON.stringify(message, null, 2)
          )
          event.reply(message)
        } else if (event.message.text.includes('news')) {
          const newsI = event.message.text.indexOf('news') - 1
          // console.log(newsI)

          const responseSearch = await axios.get(
            `https://api.cnyes.com/media/api/v1/search?q=${encodeURI(
              event.message.text.substr(0, newsI)
            )}`
          )

          const newsArr = responseSearch.data.items.data

          const SrcUrl = i => {
            // console.log(newsArr)
            let urlIF = ''
            // for (let i = 0; i < newsArr.length; i++) {
            // url: `${newsArr[i].coverSrc.xl.src}`
            if (newsArr[i].coverSrc === null) {
              // console.log('url:' + `https://picsum.photos/960/540/?random=${i}`)
              urlIF = `https://picsum.photos/960/540/?random=${stockRandom()}`
            } else if (newsArr[i].coverSrc.xl === undefined) {
              // console.log('url:' + `https://picsum.photos/960/540/?random=${i}`)
              urlIF = `https://picsum.photos/960/540/?random=${stockRandom()}`
            } else {
              // console.log('url:' + newsArr[i].coverSrc.xl.src)
              urlIF = newsArr[i].coverSrc.xl.src
            }
            // }
            return urlIF
          }
          // SrcUrl(i)
          // 回復新聞
          const flex = [
            {
              type: 'bubble',
              size: 'kilo',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: SrcUrl(0),
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '1:1',
                    gravity: 'top',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(
                        newsArr[0].newsId
                      )}`
                    }
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: `${new Date(newsArr[0].publishAt * 1000)
                              .toLocaleString('zh-tw')
                              .substr(5, 5)}`,
                            color: '#064d8888',
                            size: 'sm',
                            flex: 0
                          },
                          {
                            type: 'text',
                            color: '#8c8c8c',
                            size: 'xl',
                            flex: 0,
                            text: '|'
                          },
                          {
                            type: 'text',
                            text: `${newsArr[0].title}`,
                            size: 'md',
                            color: '#064d88',
                            weight: 'bold',
                            maxLines: 1,
                            wrap: true,
                            action: {
                              type: 'uri',
                              label: 'action',
                              uri: `https://news.cnyes.com/news/id/${encodeURI(
                                newsArr[0].newsId
                              )}`
                            }
                          }
                        ],
                        spacing: 'sm'
                      }
                    ],
                    position: 'absolute',
                    offsetStart: '0px',
                    offsetEnd: '0px',
                    backgroundColor: '#eaf3faee',
                    paddingAll: '3px',
                    offsetTop: '0px',
                    paddingStart: '17px',
                    paddingEnd: '17px'
                  }
                ],
                paddingAll: '0px'
              }
            },
            {
              type: 'bubble',
              size: 'kilo',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: SrcUrl(1),
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '1:1',
                    gravity: 'top',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(
                        newsArr[1].newsId
                      )}`
                    }
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: `${new Date(newsArr[1].publishAt * 1000)
                              .toLocaleString('zh-tw')
                              .substr(5, 5)}`,
                            color: '#064d8888',
                            size: 'sm',
                            flex: 0
                          },
                          {
                            type: 'text',
                            color: '#064d888c',
                            size: 'xl',
                            flex: 0,
                            text: '|'
                          },
                          {
                            type: 'text',
                            text: `${newsArr[1].title}`,
                            size: 'md',
                            color: '#064d88',
                            weight: 'bold',
                            maxLines: 1,
                            wrap: true,
                            action: {
                              type: 'uri',
                              label: 'action',
                              uri: `https://news.cnyes.com/news/id/${encodeURI(
                                newsArr[1].newsId
                              )}`
                            }
                          }
                        ],
                        spacing: 'sm'
                      }
                    ],
                    position: 'absolute',
                    offsetStart: '0px',
                    offsetEnd: '0px',
                    backgroundColor: '#eaf3faee',
                    paddingAll: '3px',
                    offsetTop: '0px',
                    paddingStart: '17px',
                    paddingEnd: '17px'
                  }
                ],
                paddingAll: '0px'
              }
            },
            {
              type: 'bubble',
              size: 'kilo',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: SrcUrl(2),
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '1:1',
                    gravity: 'top',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(
                        newsArr[2].newsId
                      )}`
                    }
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: `${new Date(newsArr[2].publishAt * 1000)
                              .toLocaleString('zh-tw')
                              .substr(5, 5)}`,
                            color: '#064d8888',
                            size: 'sm',
                            flex: 0
                          },
                          {
                            type: 'text',
                            color: '#064d888c',
                            size: 'xl',
                            flex: 0,
                            text: '|'
                          },
                          {
                            type: 'text',
                            text: `${newsArr[2].title}`,
                            size: 'md',
                            color: '#064d88',
                            weight: 'bold',
                            maxLines: 1,
                            wrap: true,
                            action: {
                              type: 'uri',
                              label: 'action',
                              uri: `https://news.cnyes.com/news/id/${encodeURI(
                                newsArr[2].newsId
                              )}`
                            }
                          }
                        ],
                        spacing: 'sm'
                      }
                    ],
                    position: 'absolute',
                    offsetStart: '0px',
                    offsetEnd: '0px',
                    backgroundColor: '#eaf3faee',
                    paddingAll: '3px',
                    offsetTop: '0px',
                    paddingStart: '17px',
                    paddingEnd: '17px'
                  }
                ],
                paddingAll: '0px'
              }
            },
            {
              type: 'bubble',
              size: 'kilo',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: SrcUrl(3),
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '1:1',
                    gravity: 'top',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(
                        newsArr[3].newsId
                      )}`
                    }
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: `${new Date(newsArr[3].publishAt * 1000)
                              .toLocaleString('zh-tw')
                              .substr(5, 5)}`,
                            color: '#064d8888',
                            size: 'sm',
                            flex: 0
                          },
                          {
                            type: 'text',
                            color: '#064d888c',
                            size: 'xl',
                            flex: 0,
                            text: '|'
                          },
                          {
                            type: 'text',
                            text: `${newsArr[3].title}`,
                            size: 'md',
                            color: '#064d88',
                            weight: 'bold',
                            maxLines: 1,
                            wrap: true,
                            action: {
                              type: 'uri',
                              label: 'action',
                              uri: `https://news.cnyes.com/news/id/${encodeURI(
                                newsArr[3].newsId
                              )}`
                            }
                          }
                        ],
                        spacing: 'sm'
                      }
                    ],
                    position: 'absolute',
                    offsetStart: '0px',
                    offsetEnd: '0px',
                    backgroundColor: '#eaf3faee',
                    paddingAll: '3px',
                    offsetTop: '0px',
                    paddingStart: '17px',
                    paddingEnd: '17px'
                  }
                ],
                paddingAll: '0px'
              }
            },
            {
              type: 'bubble',
              size: 'kilo',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: SrcUrl(4),
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '1:1',
                    gravity: 'top',
                    action: {
                      type: 'uri',
                      label: 'action',
                      uri: `https://news.cnyes.com/news/id/${encodeURI(
                        newsArr[4].newsId
                      )}`
                    }
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'baseline',
                        contents: [
                          {
                            type: 'text',
                            text: `${new Date(newsArr[4].publishAt * 1000)
                              .toLocaleString('zh-tw')
                              .substr(5, 5)}`,
                            color: '#064d8888',
                            size: 'sm',
                            flex: 0
                          },
                          {
                            type: 'text',
                            color: '#064d888c',
                            size: 'xl',
                            flex: 0,
                            text: '|'
                          },
                          {
                            type: 'text',
                            text: `${newsArr[4].title}`,
                            size: 'md',
                            color: '#064d88',
                            weight: 'bold',
                            maxLines: 1,
                            wrap: true,
                            action: {
                              type: 'uri',
                              label: 'action',
                              uri: `https://news.cnyes.com/news/id/${encodeURI(
                                newsArr[4].newsId
                              )}`
                            }
                          }
                        ],
                        spacing: 'sm'
                      }
                    ],
                    position: 'absolute',
                    offsetStart: '0px',
                    offsetEnd: '0px',
                    backgroundColor: '#eaf3faee',
                    paddingAll: '3px',
                    offsetTop: '0px',
                    paddingStart: '17px',
                    paddingEnd: '17px'
                  }
                ],
                paddingAll: '0px'
              }
            }
          ]

          const message = {
            type: 'flex',
            altText: `${event.message.text.substr(0, newsI)} 個股新聞`,
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync(
            './fs/stock-news.json',
            JSON.stringify(message, null, 2)
          )
          event.reply(message)
        } else if (event.message.text.includes('history')) {
          const historyI = event.message.text.indexOf('history') - 1
          console.log(historyI)

          const message = {
            type: 'text',
            text: `${event.message.text.substr(0, historyI)} 走勢`,
            quickReply: {
              items: [
                {
                  type: 'action',
                  imageUrl: 'https://img.icons8.com/nolan/2x/combo-chart.png',
                  action: {
                    type: 'uri',
                    label: '歷史走勢',
                    uri: `https://www.google.com/finance/quote/${encodeURI(
                      event.message.text.substr(0, historyI)
                    )}:TPE?window=MAX`
                  }
                },
                {
                  type: 'action',
                  imageUrl: 'https://img.icons8.com/nolan/2x/combo-chart.png',
                  action: {
                    type: 'uri',
                    label: '即時走勢',
                    uri: `https://www.google.com/finance/quote/${encodeURI(
                      event.message.text.substr(0, historyI)
                    )}:TPE`
                  }
                }
                // ,
                // {
                //   type: 'action',
                //   action: {
                //     type: 'location',
                //     label: '選擇地點'
                //   }
                // }
              ]
            }
          }

          fs.writeFileSync(
            './fs/stock-history.json',
            JSON.stringify(message, null, 2)
          )
          event.reply(message)
        } else if (arrSymbolId.includes(event.message.text)) {
          // 回復選單
          const flex = [
            {
              type: 'bubble',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'image',
                    url: 'https://imgur.com/lvTvZ6Z.png',
                    size: 'full',
                    aspectMode: 'cover',
                    aspectRatio: '15:19',
                    gravity: 'top'
                  },
                  // stock market
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/stock-share.png'
                              },
                              {
                                type: 'text',
                                text: '即時股市行情', // stock market
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px',
                        action: {
                          type: 'postback',
                          label: 'stock market',
                          data: `${event.message.text} market`
                        }
                      },
                      // stock news
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/card-exchange.png'
                              },
                              {
                                type: 'text',
                                text: '個股新聞', // stock news
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px',
                        action: {
                          type: 'postback',
                          label: 'stock news',
                          data: `${event.message.text} news`
                        }
                      },
                      // stock history
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/pay-date.png'
                              },
                              {
                                type: 'text',
                                text: '歷史走勢', // stock history
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            action: {
                              type: 'uri',
                              label: 'stock history',
                              uri: `https://www.google.com/finance/quote/${encodeURI(
                                event.message.text
                              )}:TPE?window=MAX`
                            },
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px'
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'filler'
                          },
                          // 使用說明
                          {
                            type: 'box',
                            layout: 'baseline',
                            contents: [
                              {
                                type: 'icon',
                                url: 'https://img.icons8.com/nolan/344/stock-share.png'
                              },
                              {
                                type: 'text',
                                text: '使用說明', // Instructions
                                color: '#3c3899',
                                flex: 0,
                                offsetTop: '-2px'
                              }
                            ],
                            spacing: 'sm',
                            paddingStart: 'lg'
                          },
                          {
                            type: 'filler'
                          }
                        ],
                        borderWidth: '1.5px',
                        cornerRadius: '4px',
                        spacing: 'sm',
                        borderColor: '#5e50ff',
                        backgroundColor: '#DEDAFBaa',
                        margin: 'md',
                        height: '45px',
                        action: {
                          type: 'postback',
                          label: 'Instructions',
                          data: 'Instructions'
                        }
                      }
                    ],
                    position: 'absolute',
                    // backgroundColor: '#2A1E5C66',
                    paddingAll: '70px',
                    paddingTop: '115px',
                    paddingEnd: '75px',
                    background: {
                      type: 'linearGradient',
                      angle: '110deg',
                      endColor: '#3c389999',
                      centerColor: '#3c389955',
                      startColor: '#3c3899aa',
                      centerPosition: '65%'
                    },
                    offsetEnd: '0px',
                    offsetBottom: '0px',
                    offsetStart: '0px',
                    offsetTop: '0px'
                  },
                  // 標題字 - 股票代號
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: `${event.message.text}`,
                        color: '#dcedfb',
                        align: 'center',
                        gravity: 'center',
                        wrap: false,
                        adjustMode: 'shrink-to-fit',
                        size: 'lg'
                      }
                    ],
                    position: 'absolute',
                    cornerRadius: '15px',
                    backgroundColor: '#5e50ffbb',
                    offsetTop: '70px',
                    paddingAll: 'xs',
                    paddingStart: 'md',
                    paddingEnd: 'md',
                    offsetStart: '123px',
                    width: '119px'
                  }
                ],
                paddingAll: '0px'
              }
            }
          ]

          const message = {
            type: 'flex',
            altText: `${event.message.text} Stock Menu`,
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync(
            './fs/stock-menu.json',
            JSON.stringify(message, null, 2)
          )
          event.reply(message)
        } else if (
          event.message.text.includes('rate') ||
          event.message.text.includes('即時匯率')
        ) {
          // 美金兌各幣別匯率 https://tw.rter.info/capi.php
          // 如果要找出台幣兌換日幣的匯率，請於程式中轉換成美金後再轉換成日幣。for example: TWD -> USD -> JPY
          // 各幣別即時買賣匯率 https://tw.rter.info/json.php?t=index&_=1623644527743
          // https://tw.rter.info/exchange/TWD-BTC.html

          // const flex = {}
          const message = {
            type: 'text',
            text: `${event.message.text}：https://tw.rter.info/index.php`
          }

          // fs.writeFileSync(
          //   './fs/stock-history.json',
          //   JSON.stringify(message, null, 2)
          // )
          event.reply(message)
        } else {
          // 不屬於以上 4 類的任意文字
          // (event.message.text.includes('Instructions') ||event.message.text.includes('說明'))
          // console.log(arrSymbolId.length)  //120107
          console.log(stockRandom())
          // console.log(stockPop[stockRandom()])

          const flex = [
            {
              type: 'bubble',
              size: 'mega',
              header: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'horizontal',
                    contents: [
                      {
                        type: 'image',
                        url: 'https://www.frevvo.com/blog/wp-content/uploads/2020/01/Frevvo-Improve-Finance-hero.png',
                        size: 'full',
                        aspectMode: 'cover',
                        aspectRatio: '9:11',
                        gravity: 'center',
                        flex: 1
                      },
                      {
                        type: 'box',
                        layout: 'horizontal',
                        contents: [
                          {
                            type: 'text',
                            text: 'Stock.Find',
                            size: 'xs',
                            color: '#ffffff',
                            align: 'center',
                            gravity: 'center'
                          }
                        ],
                        backgroundColor: '#e55732',
                        paddingAll: '2px',
                        paddingStart: '4px',
                        paddingEnd: '4px',
                        flex: 0,
                        position: 'absolute',
                        offsetStart: '18px',
                        offsetTop: '18px',
                        cornerRadius: '100px',
                        width: '89px',
                        height: '25px'
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        contents: [
                          {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              {
                                type: 'text',
                                contents: [],
                                size: 'xl',
                                wrap: true,
                                text: '歡迎來到…',
                                color: '#064d88',
                                weight: 'bold'
                              },
                              {
                                type: 'text',
                                text: '在這個聊天室您可以直接輸入股票代號，協助您快速查詢股票資訊！',
                                color: '#064d88cc',
                                size: 'sm',
                                wrap: true
                              },
                              {
                                type: 'text',
                                text: '或輸入以下關鍵字，將立刻回覆您相關資訊',
                                color: '#064d88cc',
                                size: 'sm',
                                wrap: true,
                                margin: 'md'
                              }
                            ],
                            spacing: 'sm'
                          },
                          {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              // 股票代號+market
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    contents: [],
                                    size: 'md',
                                    wrap: true,
                                    margin: 'none',
                                    color: '#064d88de',
                                    text: '股票代號+market',
                                    align: 'start',
                                    action: {
                                      type: 'message',
                                      label: `${
                                        stockPop[stockRandom()]
                                      }+market (e.g.)`,
                                      text: `${
                                        stockPop[stockRandom()]
                                      }+market (e.g.)`
                                    }
                                  }
                                ],
                                paddingAll: '5px',
                                justifyContent: 'center',
                                paddingStart: '31px',
                                backgroundColor: '#ffffff1A'
                                // margin: 'md'
                              },
                              // 股票代號+news
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    contents: [],
                                    size: 'md',
                                    wrap: true,
                                    margin: 'none',
                                    color: '#064d88de',
                                    text: '股票代號+news',
                                    align: 'start',
                                    action: {
                                      type: 'message',
                                      label: `${
                                        stockPop[stockRandom()]
                                      }+news (e.g.)`,
                                      text: `${
                                        stockPop[stockRandom()]
                                      }+news (e.g.)`
                                    }
                                  }
                                ],
                                paddingAll: '5px',
                                justifyContent: 'center',
                                paddingStart: '31px',
                                backgroundColor: '#ffffff1A',
                                margin: 'md'
                              },
                              // 股票代號+history
                              {
                                type: 'box',
                                layout: 'vertical',
                                contents: [
                                  {
                                    type: 'text',
                                    contents: [],
                                    size: 'md',
                                    wrap: true,
                                    margin: 'none',
                                    color: '#064d88de',
                                    text: '股票代號+history',
                                    align: 'start',
                                    action: {
                                      type: 'message',
                                      label: `${
                                        stockPop[stockRandom()]
                                      }+history (e.g.)`,
                                      text: `${
                                        stockPop[stockRandom()]
                                      }+history (e.g.)`
                                    }
                                  }
                                ],
                                paddingAll: '5px',
                                justifyContent: 'center',
                                paddingStart: '31px',
                                backgroundColor: '#ffffff1A',
                                margin: 'md'
                              }
                            ],
                            paddingAll: '9px',
                            cornerRadius: '2px',
                            margin: 'sm'
                          }
                        ],
                        spacing: 'sm',
                        position: 'absolute',
                        offsetTop: '50px',
                        offsetStart: '50px',
                        backgroundColor: '#f1cf4cdd',
                        paddingAll: '30px',
                        offsetBottom: 'none',
                        cornerRadius: 'md',
                        offsetEnd: 'none'
                      }
                    ]
                  }
                ],
                paddingAll: '0px'
              }
            }
          ]

          const message = {
            type: 'flex',
            altText: '歡迎來到…',
            contents: {
              type: 'carousel',
              contents: flex
            }
          }

          fs.writeFileSync(
            './fs/stock-Instructions.json',
            JSON.stringify(message, null, 2)
          )
          event.reply(message)
        }
        // else {
        //   event.reply('查無此股票')
        // }
      }
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤 QQ')
    }
  }
})

bot.on('postback', async event => {
  console.log(event)

  if (event.type === 'postback') {
    // console.log(event.postback.data)
    // console.log(arrSymbolId.includes(event.postback.data))
    try {
      // toLowerCase 英文大寫轉小寫，中文字不影響
      event.postback.data = event.postback.data.toLowerCase()

      if (event.postback.data.includes('market')) {
        const marketI = event.postback.data.indexOf('market') - 1
        // console.log(marketI)

        // 現在時間
        const nowTime = new Date().toLocaleString('zh-TW', {
          hour12: false,
          timeZone: 'Asia/Taipei'
        })
        // "2021/6/4 19:01:18"

        const responseMeta = await axios.get(
          `https://api.fugle.tw/realtime/v0.2/intraday/meta?symbolId=${encodeURI(
            event.postback.data.substr(0, marketI)
          )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
        )
        const responseQuote = await axios.get(
          `https://api.fugle.tw/realtime/v0.2/intraday/quote?symbolId=${encodeURI(
            event.postback.data.substr(0, marketI)
          )}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
        )
        // const responseDealts = await axios.get(
        //   `https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.postback.data.substr(0, (event.postback.data.indexOf("news")-1)))}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=9`
        // )

        const responseCnyesCharting = await axios.get(
          `https://ws.api.cnyes.com/ws/api/v1/charting/history?resolution=1&symbol=TWS:${encodeURI(
            event.postback.data.substr(0, marketI)
          )}:STOCK&quote=1`
        )

        const responseCnyesQuoteK = await axios.get(
          `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/TWS:${encodeURI(
            event.postback.data.substr(0, marketI)
          )}:STOCK?column=K`
        )

        const responseCnyesQuoteI = await axios.get(
          `https://ws.api.cnyes.com/ws/api/v1/quote/quotes/TWS:${encodeURI(
            event.postback.data.substr(0, marketI)
          )}:STOCK?column=I`
        )

        // console.log(responseCnyesQuoteK.data.data[0])
        // console.log(responseCnyesQuoteK.data.data[0]['200056'])
        // console.log(responseCnyesCharting.data.data.quote)
        // console.log(responseCnyesCharting.data.data.quote['800001'])
        // console.log(responseCnyesCharting.data.data.o[responseCnyesCharting.data.data.o.length - 1])

        const flex = [
          // 個股日成交資訊
          {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                // 個股資訊背景
                {
                  type: 'image',
                  url: 'https://imgur.com/7BTFHmI.png',
                  aspectMode: 'cover',
                  aspectRatio: '115:150',
                  flex: 1,
                  gravity: 'top',
                  size: 'full',
                  align: 'center'
                },
                {
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
                            // 股票代號
                            {
                              type: 'text',
                              text: `${responseMeta.data.data.info.symbolId}`,
                              weight: 'bold',
                              size: 'xxl',
                              margin: 'none',
                              color: '#2A1E5C'
                            },
                            // 股票中文名稱
                            {
                              type: 'text',
                              text: `${responseMeta.data.data.meta.nameZhTw}`,
                              size: 'sm',
                              color: '#2A1E5Caa',
                              wrap: true,
                              margin: 'sm',
                              offsetStart: 'xs'
                            }
                          ],
                          width: '40%'
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          contents: [
                            // 漲跌 change '11'
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  text: '漲跌',
                                  size: 'xxs',
                                  color: '#555555',
                                  flex: 0
                                },
                                {
                                  type: 'text',
                                  text: `${responseCnyesCharting.data.data.quote['11']}`,
                                  size: 'lg',
                                  color: '#111111',
                                  align: 'start',
                                  offsetStart: '19px'
                                }
                              ]
                            },
                            // 漲跌幅 changePercent '56'
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  text: '漲跌幅',
                                  size: 'xxs',
                                  color: '#555555',
                                  flex: 0
                                },
                                {
                                  type: 'text',
                                  text: `${responseCnyesCharting.data.data.quote['56']}%`,
                                  size: 'lg',
                                  color: '#111111',
                                  align: 'start'
                                }
                              ]
                            }
                          ],
                          margin: 'lg',
                          cornerRadius: 'lg',
                          paddingAll: 'md',
                          backgroundColor: '#e6ff9288',
                          spacing: 'md',
                          paddingTop: 'xl'
                        }
                      ]
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      spacing: 'sm',
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
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    // 股價
                                    {
                                      type: 'text',
                                      text: '股價',
                                      size: 'sm',
                                      color: '#555555',
                                      flex: 0
                                    },
                                    {
                                      type: 'text',
                                      text: `${responseCnyesCharting.data.data.quote['6']}`,
                                      size: 'sm',
                                      color: '#111111',
                                      align: 'start',
                                      offsetStart: '19px'
                                    }
                                  ]
                                },
                                // 開盤價 priceOpen o
                                {
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    {
                                      type: 'text',
                                      text: '開盤價',
                                      size: 'sm',
                                      color: '#555555',
                                      flex: 0
                                    },
                                    {
                                      type: 'text',
                                      text: `${
                                        responseCnyesCharting.data.data.o[
                                          responseCnyesCharting.data.data.o
                                            .length - 1
                                        ]
                                      }`,
                                      size: 'sm',
                                      color: '#111111',
                                      align: 'start',
                                      offsetStart: '19px'
                                    }
                                  ],
                                  margin: 'md'
                                },
                                // 最高價 priceHigh h
                                {
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    {
                                      type: 'text',
                                      text: '最高價',
                                      size: 'sm',
                                      color: '#555555',
                                      flex: 0,
                                      margin: 'sm'
                                    },
                                    {
                                      type: 'text',
                                      text: `${
                                        responseCnyesCharting.data.data.h[
                                          responseCnyesCharting.data.data.h
                                            .length - 1
                                        ]
                                      }`,
                                      size: 'sm',
                                      color: '#111111',
                                      align: 'start',
                                      offsetStart: '19px'
                                    }
                                  ]
                                },
                                // 最低價 priceLow l
                                {
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    {
                                      type: 'text',
                                      text: '最低價',
                                      size: 'sm',
                                      color: '#555555',
                                      flex: 0,
                                      margin: 'xs'
                                    },
                                    {
                                      type: 'text',
                                      text: `${
                                        responseCnyesCharting.data.data.l[
                                          responseCnyesCharting.data.data.l
                                            .length - 1
                                        ]
                                      }`,
                                      size: 'sm',
                                      color: '#111111',
                                      align: 'start',
                                      offsetStart: '19px'
                                    }
                                  ]
                                },
                                // 收盤價 c
                                {
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    {
                                      type: 'text',
                                      text: '收盤價',
                                      size: 'sm',
                                      color: '#555555',
                                      flex: 0,
                                      margin: 'xs'
                                    },
                                    {
                                      type: 'text',
                                      text: `${
                                        responseCnyesCharting.data.data.c[
                                          responseCnyesCharting.data.data.c
                                            .length - 1
                                        ]
                                      }`,
                                      size: 'sm',
                                      color: '#111111',
                                      align: 'start',
                                      offsetStart: '19px'
                                    }
                                  ]
                                },
                                // 昨收
                                {
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    {
                                      type: 'text',
                                      text: '昨收',
                                      size: 'sm',
                                      color: '#555555',
                                      flex: 0
                                    },
                                    {
                                      type: 'text',
                                      text: `${responseCnyesCharting.data.data.quote['21']}`,
                                      size: 'sm',
                                      color: '#111111',
                                      align: 'start',
                                      offsetStart: '19px'
                                    }
                                  ],
                                  margin: 'md'
                                }
                              ],
                              backgroundColor: '#ffae8e66',
                              cornerRadius: 'lg',
                              paddingAll: 'md',
                              width: '40%',
                              paddingStart: 'xxl'
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    // 成交張數 unit '800001'
                                    {
                                      type: 'box',
                                      layout: 'vertical',
                                      contents: [
                                        {
                                          type: 'text',
                                          text: '總成交張數',
                                          size: 'sm',
                                          color: '#555555',
                                          flex: 0
                                        },
                                        {
                                          type: 'text',
                                          text: `${responseCnyesCharting.data.data.quote['800001']}`,
                                          size: 'sm',
                                          color: '#111111',
                                          align: 'start',
                                          offsetStart: '19px'
                                        }
                                      ]
                                    },
                                    // 1日高低 '13'~'12'
                                    {
                                      type: 'box',
                                      layout: 'vertical',
                                      contents: [
                                        {
                                          type: 'text',
                                          text: '1日高低',
                                          size: 'sm',
                                          color: '#555555',
                                          flex: 0
                                        },
                                        {
                                          type: 'text',
                                          text: `${responseCnyesQuoteI.data.data[0]['13']} ~ ${responseCnyesQuoteI.data.data[0]['12']}`,
                                          size: 'sm',
                                          color: '#111111',
                                          align: 'start',
                                          offsetStart: '19px'
                                        }
                                      ]
                                    },
                                    // 52週高低 '3266'~'3265'
                                    {
                                      type: 'box',
                                      layout: 'vertical',
                                      contents: [
                                        {
                                          type: 'text',
                                          text: '52週高低',
                                          size: 'sm',
                                          color: '#555555',
                                          flex: 0
                                        },
                                        {
                                          type: 'text',
                                          text: `${responseCnyesQuoteI.data.data[0]['3266']} ~ ${responseCnyesQuoteI.data.data[0]['3265']}`,
                                          size: 'sm',
                                          color: '#111111',
                                          align: 'start',
                                          offsetStart: '19px'
                                        }
                                      ]
                                    }
                                  ],
                                  backgroundColor: '#c4e3ff88',
                                  paddingAll: 'md',
                                  cornerRadius: 'lg'
                                },
                                // 本益比 '700001'
                                {
                                  type: 'box',
                                  layout: 'vertical',
                                  contents: [
                                    {
                                      type: 'box',
                                      layout: 'vertical',
                                      contents: [
                                        {
                                          type: 'text',
                                          text: '本益比',
                                          size: 'sm',
                                          color: '#555555',
                                          flex: 0
                                        },
                                        {
                                          type: 'text',
                                          text: `${responseCnyesQuoteI.data.data[0]['700001']}`,
                                          size: 'sm',
                                          color: '#111111',
                                          align: 'start',
                                          offsetStart: '19px'
                                        }
                                      ]
                                    },
                                    // 本淨比 '700006'
                                    {
                                      type: 'box',
                                      layout: 'vertical',
                                      contents: [
                                        {
                                          type: 'text',
                                          text: '本淨比',
                                          size: 'sm',
                                          color: '#555555',
                                          flex: 0
                                        },
                                        {
                                          type: 'text',
                                          text: `${responseCnyesQuoteI.data.data[0]['700006']}`,
                                          size: 'sm',
                                          color: '#111111',
                                          align: 'start',
                                          offsetStart: '19px'
                                        }
                                      ]
                                    },
                                    // 市值 (億) '700005'
                                    {
                                      type: 'box',
                                      layout: 'vertical',
                                      contents: [
                                        {
                                          type: 'text',
                                          text: '市值(億)',
                                          size: 'sm',
                                          color: '#555555',
                                          flex: 0
                                        },
                                        {
                                          type: 'text',
                                          text: `${
                                            responseCnyesQuoteI.data.data[0][
                                              '700005'
                                            ] / 100000000
                                          } `,
                                          size: 'sm',
                                          color: '#111111',
                                          align: 'start',
                                          offsetStart: '19px'
                                        }
                                      ]
                                    }
                                  ],
                                  backgroundColor: '#c4e3ff88',
                                  margin: 'lg',
                                  cornerRadius: 'lg',
                                  paddingAll: 'md'
                                }
                              ],
                              margin: 'lg'
                            }
                          ],
                          margin: 'md'
                        }
                      ],
                      margin: 'md'
                    }
                  ],
                  position: 'absolute',
                  offsetTop: '0px',
                  offsetBottom: '0px',
                  offsetStart: '0px',
                  offsetEnd: '0px',
                  paddingAll: 'xxl'
                }
              ],
              paddingAll: '0px'
            },
            styles: {
              footer: {
                separator: true
              }
            }
          },
          // 個股 最佳五檔及內外盤比
          {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                // 股票代號
                {
                  type: 'text',
                  text: `${responseMeta.data.data.info.symbolId}`,
                  weight: 'bold',
                  size: 'xxl',
                  margin: 'none',
                  color: '#2A1E5C'
                },
                // 股票中文名稱
                {
                  type: 'text',
                  text: `${responseMeta.data.data.meta.nameZhTw}`,
                  size: 'sm',
                  color: '#2A1E5Caa',
                  wrap: true,
                  margin: 'sm',
                  offsetStart: 'xs'
                },
                {
                  type: 'separator',
                  margin: 'md'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'md',
                  spacing: 'sm',
                  contents: [
                    // 買 bestBids 賣 bestAsks
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '買',
                          align: 'center',
                          color: '#FF5D73'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: '賣',
                          align: 'center',
                          color: '#06A77D'
                        }
                      ],
                      justifyContent: 'space-between',
                      margin: 'md'
                    },
                    // 0
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[0].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[0].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[0].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[0].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ],
                      margin: 'md'
                    },
                    // 1
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[1].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[1].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[1].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[1].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ],
                      margin: 'md'
                    },
                    // 2
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[2].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[2].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[2].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[2].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ],
                      margin: 'md'
                    },
                    // 3
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[3].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[3].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[3].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[3].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ],
                      margin: 'md'
                    },
                    // 4
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[4].unit}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestBids[4].price}`,
                          size: 'sm',
                          color: '#FF5D73',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[4].price}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'text',
                          text: `${responseQuote.data.data.quote.order.bestAsks[4].unit}`,
                          size: 'sm',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ],
                      margin: 'md'
                    },
                    // 內外盤比
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: '內外盤比',
                          align: 'center',
                          color: '#2A1E5Cdd'
                        }
                      ],
                      justifyContent: 'space-between',
                      margin: 'xl'
                    },
                    // 內外盤比 百分比 長條圖
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'filler'
                            }
                          ],
                          width: `${responseCnyesQuoteK.data.data[0]['200056']}%`,
                          backgroundColor: '#FF5D73',
                          height: '8px'
                        }
                      ],
                      backgroundColor: '#06A77D',
                      height: '8px',
                      margin: 'sm'
                    },
                    // 內外盤比 百分比 及 張數
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        // 內盤
                        {
                          type: 'text',
                          text: `${responseCnyesQuoteK.data.data[0]['200056']}% (${responseCnyesQuoteK.data.data[0]['200054']})`,
                          size: 'sm',
                          gravity: 'top',
                          color: '#FF5D73',
                          align: 'start',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        },
                        {
                          type: 'filler'
                        },
                        // 外盤
                        {
                          type: 'text',
                          text: `${responseCnyesQuoteK.data.data[0]['200057']}% (${responseCnyesQuoteK.data.data[0]['200055']})`,
                          size: 'sm',
                          gravity: 'top',
                          color: '#06A77D',
                          align: 'end',
                          wrap: false,
                          adjustMode: 'shrink-to-fit'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'separator',
                  margin: 'md'
                },
                // 即時走勢
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'md',
                  contents: [
                    {
                      type: 'text',
                      text: '即時走勢',
                      size: 'xs',
                      color: '#aaaaaa',
                      flex: 0,
                      offsetStart: 'sm',
                      action: {
                        type: 'uri',
                        label: 'action',
                        uri: `https://www.google.com/finance/quote/${encodeURI(
                          event.postback.data.substr(0, marketI)
                        )}:TPE`
                      }
                    },
                    // 當下時間
                    {
                      type: 'text',
                      text: `${nowTime}`,
                      color: '#aaaaaa',
                      size: 'xs',
                      align: 'end',
                      offsetEnd: 'sm'
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
        ]

        const message = {
          type: 'flex',
          altText: `${event.postback.data.substr(0, marketI)} 即時股市行情`,
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync(
          './fs/stock-market.json',
          JSON.stringify(message, null, 2)
        )
        event.reply(message)
      } else if (event.postback.data.includes('news')) {
        const newsI = event.postback.data.indexOf('news') - 1
        // console.log(newsI)

        const responseSearch = await axios.get(
          `https://api.cnyes.com/media/api/v1/search?q=${encodeURI(
            event.postback.data.substr(0, newsI)
          )}`
        )

        const newsArr = responseSearch.data.items.data

        const SrcUrl = i => {
          // console.log(newsArr)
          let urlIF = ''
          // for (let i = 0; i < newsArr.length; i++) {
          // url: `${newsArr[i].coverSrc.xl.src}`
          if (newsArr[i].coverSrc === null) {
            // console.log('url:' + `https://picsum.photos/960/540/?random=${i}`)
            urlIF = `https://picsum.photos/960/540/?random=${stockRandom()}`
          } else if (newsArr[i].coverSrc.xl === undefined) {
            // console.log('url:' + `https://picsum.photos/960/540/?random=${i}`)
            urlIF = `https://picsum.photos/960/540/?random=${stockRandom()}`
          } else {
            // console.log('url:' + newsArr[i].coverSrc.xl.src)
            urlIF = newsArr[i].coverSrc.xl.src
          }
          // }
          return urlIF
        }
        // SrcUrl(i)
        // 回復新聞
        const flex = [
          {
            type: 'bubble',
            size: 'kilo',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: SrcUrl(0),
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  gravity: 'top',
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(
                      newsArr[0].newsId
                    )}`
                  }
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: `${new Date(newsArr[0].publishAt * 1000)
                            .toLocaleString('zh-tw')
                            .substr(5, 5)}`,
                          color: '#064d8888',
                          size: 'sm',
                          flex: 0
                        },
                        {
                          type: 'text',
                          color: '#8c8c8c',
                          size: 'xl',
                          flex: 0,
                          text: '|'
                        },
                        {
                          type: 'text',
                          text: `${newsArr[0].title}`,
                          size: 'md',
                          color: '#064d88',
                          weight: 'bold',
                          maxLines: 1,
                          wrap: true,
                          action: {
                            type: 'uri',
                            label: 'action',
                            uri: `https://news.cnyes.com/news/id/${encodeURI(
                              newsArr[0].newsId
                            )}`
                          }
                        }
                      ],
                      spacing: 'sm'
                    }
                  ],
                  position: 'absolute',
                  offsetStart: '0px',
                  offsetEnd: '0px',
                  backgroundColor: '#eaf3faee',
                  paddingAll: '3px',
                  offsetTop: '0px',
                  paddingStart: '17px',
                  paddingEnd: '17px'
                }
              ],
              paddingAll: '0px'
            }
          },
          {
            type: 'bubble',
            size: 'kilo',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: SrcUrl(1),
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  gravity: 'top',
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(
                      newsArr[1].newsId
                    )}`
                  }
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: `${new Date(newsArr[1].publishAt * 1000)
                            .toLocaleString('zh-tw')
                            .substr(5, 5)}`,
                          color: '#064d8888',
                          size: 'sm',
                          flex: 0
                        },
                        {
                          type: 'text',
                          color: '#064d888c',
                          size: 'xl',
                          flex: 0,
                          text: '|'
                        },
                        {
                          type: 'text',
                          text: `${newsArr[1].title}`,
                          size: 'md',
                          color: '#064d88',
                          weight: 'bold',
                          maxLines: 1,
                          wrap: true,
                          action: {
                            type: 'uri',
                            label: 'action',
                            uri: `https://news.cnyes.com/news/id/${encodeURI(
                              newsArr[1].newsId
                            )}`
                          }
                        }
                      ],
                      spacing: 'sm'
                    }
                  ],
                  position: 'absolute',
                  offsetStart: '0px',
                  offsetEnd: '0px',
                  backgroundColor: '#eaf3faee',
                  paddingAll: '3px',
                  offsetTop: '0px',
                  paddingStart: '17px',
                  paddingEnd: '17px'
                }
              ],
              paddingAll: '0px'
            }
          },
          {
            type: 'bubble',
            size: 'kilo',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: SrcUrl(2),
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  gravity: 'top',
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(
                      newsArr[2].newsId
                    )}`
                  }
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: `${new Date(newsArr[2].publishAt * 1000)
                            .toLocaleString('zh-tw')
                            .substr(5, 5)}`,
                          color: '#064d8888',
                          size: 'sm',
                          flex: 0
                        },
                        {
                          type: 'text',
                          color: '#064d888c',
                          size: 'xl',
                          flex: 0,
                          text: '|'
                        },
                        {
                          type: 'text',
                          text: `${newsArr[2].title}`,
                          size: 'md',
                          color: '#064d88',
                          weight: 'bold',
                          maxLines: 1,
                          wrap: true,
                          action: {
                            type: 'uri',
                            label: 'action',
                            uri: `https://news.cnyes.com/news/id/${encodeURI(
                              newsArr[2].newsId
                            )}`
                          }
                        }
                      ],
                      spacing: 'sm'
                    }
                  ],
                  position: 'absolute',
                  offsetStart: '0px',
                  offsetEnd: '0px',
                  backgroundColor: '#eaf3faee',
                  paddingAll: '3px',
                  offsetTop: '0px',
                  paddingStart: '17px',
                  paddingEnd: '17px'
                }
              ],
              paddingAll: '0px'
            }
          },
          {
            type: 'bubble',
            size: 'kilo',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: SrcUrl(3),
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  gravity: 'top',
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(
                      newsArr[3].newsId
                    )}`
                  }
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: `${new Date(newsArr[3].publishAt * 1000)
                            .toLocaleString('zh-tw')
                            .substr(5, 5)}`,
                          color: '#064d8888',
                          size: 'sm',
                          flex: 0
                        },
                        {
                          type: 'text',
                          color: '#064d888c',
                          size: 'xl',
                          flex: 0,
                          text: '|'
                        },
                        {
                          type: 'text',
                          text: `${newsArr[3].title}`,
                          size: 'md',
                          color: '#064d88',
                          weight: 'bold',
                          maxLines: 1,
                          wrap: true,
                          action: {
                            type: 'uri',
                            label: 'action',
                            uri: `https://news.cnyes.com/news/id/${encodeURI(
                              newsArr[3].newsId
                            )}`
                          }
                        }
                      ],
                      spacing: 'sm'
                    }
                  ],
                  position: 'absolute',
                  offsetStart: '0px',
                  offsetEnd: '0px',
                  backgroundColor: '#eaf3faee',
                  paddingAll: '3px',
                  offsetTop: '0px',
                  paddingStart: '17px',
                  paddingEnd: '17px'
                }
              ],
              paddingAll: '0px'
            }
          },
          {
            type: 'bubble',
            size: 'kilo',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: SrcUrl(4),
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '1:1',
                  gravity: 'top',
                  action: {
                    type: 'uri',
                    label: 'action',
                    uri: `https://news.cnyes.com/news/id/${encodeURI(
                      newsArr[4].newsId
                    )}`
                  }
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'text',
                          text: `${new Date(newsArr[4].publishAt * 1000)
                            .toLocaleString('zh-tw')
                            .substr(5, 5)}`,
                          color: '#064d8888',
                          size: 'sm',
                          flex: 0
                        },
                        {
                          type: 'text',
                          color: '#064d888c',
                          size: 'xl',
                          flex: 0,
                          text: '|'
                        },
                        {
                          type: 'text',
                          text: `${newsArr[4].title}`,
                          size: 'md',
                          color: '#064d88',
                          weight: 'bold',
                          maxLines: 1,
                          wrap: true,
                          action: {
                            type: 'uri',
                            label: 'action',
                            uri: `https://news.cnyes.com/news/id/${encodeURI(
                              newsArr[4].newsId
                            )}`
                          }
                        }
                      ],
                      spacing: 'sm'
                    }
                  ],
                  position: 'absolute',
                  offsetStart: '0px',
                  offsetEnd: '0px',
                  backgroundColor: '#eaf3faee',
                  paddingAll: '3px',
                  offsetTop: '0px',
                  paddingStart: '17px',
                  paddingEnd: '17px'
                }
              ],
              paddingAll: '0px'
            }
          }
        ]

        const message = {
          type: 'flex',
          altText: `${event.postback.data.substr(0, newsI)} 個股新聞`,
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync(
          './fs/stock-news.json',
          JSON.stringify(message, null, 2)
        )
        event.reply(message)
      } else if (event.postback.data.includes('history')) {
        const historyI = event.postback.data.indexOf('history') - 1
        console.log(historyI)

        const message = {
          type: 'text',
          text: `${event.postback.data.substr(0, historyI)} 走勢`,
          quickReply: {
            items: [
              {
                type: 'action',
                imageUrl: 'https://img.icons8.com/nolan/2x/combo-chart.png',
                action: {
                  type: 'uri',
                  label: '歷史走勢',
                  uri: `https://www.google.com/finance/quote/${encodeURI(
                    event.postback.data.substr(0, historyI)
                  )}:TPE?window=MAX`
                }
              },
              {
                type: 'action',
                imageUrl: 'https://img.icons8.com/nolan/2x/combo-chart.png',
                action: {
                  type: 'uri',
                  label: '即時走勢',
                  uri: `https://www.google.com/finance/quote/${encodeURI(
                    event.postback.data.substr(0, historyI)
                  )}:TPE`
                }
              }
              // ,
              // {
              //   type: 'action',
              //   action: {
              //     type: 'location',
              //     label: '選擇地點'
              //   }
              // }
            ]
          }
        }

        fs.writeFileSync(
          './fs/stock-history.json',
          JSON.stringify(message, null, 2)
        )
        event.reply(message)
      } else if (arrSymbolId.includes(event.postback.data)) {
        // 回復選單
        const flex = [
          {
            type: 'bubble',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: 'https://imgur.com/lvTvZ6Z.png',
                  size: 'full',
                  aspectMode: 'cover',
                  aspectRatio: '15:19',
                  gravity: 'top'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    // stock market
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/stock-share.png'
                            },
                            {
                              type: 'text',
                              text: '即時股市行情', // stock market
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px',
                      action: {
                        type: 'postback',
                        label: 'stock market',
                        data: `${event.postback.data} market`
                      }
                    },
                    // stock news
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/card-exchange.png'
                            },
                            {
                              type: 'text',
                              text: '個股新聞', // stock news
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px',
                      action: {
                        type: 'postback',
                        label: 'stock news',
                        data: `${event.postback.data} news`
                      }
                    },
                    // stock history
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/pay-date.png'
                            },
                            {
                              type: 'text',
                              text: '歷史走勢', // stock history
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          action: {
                            type: 'uri',
                            label: 'stock history',
                            uri: `https://www.google.com/finance/quote/${encodeURI(
                              event.postback.data
                            )}:TPE?window=MAX`
                          },
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'filler'
                        },
                        // 使用說明
                        {
                          type: 'box',
                          layout: 'baseline',
                          contents: [
                            {
                              type: 'icon',
                              url: 'https://img.icons8.com/nolan/344/stock-share.png'
                            },
                            {
                              type: 'text',
                              text: '使用說明', // Instructions
                              color: '#3c3899',
                              flex: 0,
                              offsetTop: '-2px'
                            }
                          ],
                          spacing: 'sm',
                          paddingStart: 'lg'
                        },
                        {
                          type: 'filler'
                        }
                      ],
                      borderWidth: '1.5px',
                      cornerRadius: '4px',
                      spacing: 'sm',
                      borderColor: '#5e50ff',
                      backgroundColor: '#DEDAFBaa',
                      margin: 'md',
                      height: '45px',
                      action: {
                        type: 'postback',
                        label: 'Instructions',
                        data: 'Instructions'
                      }
                    }
                  ],
                  position: 'absolute',
                  // backgroundColor: '#2A1E5C66',
                  paddingAll: '70px',
                  paddingTop: '115px',
                  paddingEnd: '75px',
                  background: {
                    type: 'linearGradient',
                    angle: '110deg',
                    endColor: '#3c389999',
                    centerColor: '#3c389955',
                    startColor: '#3c3899aa',
                    centerPosition: '65%'
                  },
                  offsetEnd: '0px',
                  offsetBottom: '0px',
                  offsetStart: '0px',
                  offsetTop: '0px'
                },
                // 標題字 - 股票代號
                {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `${event.postback.data}`,
                      color: '#dcedfb',
                      align: 'center',
                      gravity: 'center',
                      wrap: false,
                      adjustMode: 'shrink-to-fit',
                      size: 'lg'
                    }
                  ],
                  position: 'absolute',
                  cornerRadius: '15px',
                  backgroundColor: '#5e50ffbb',
                  offsetTop: '70px',
                  paddingAll: 'xs',
                  paddingStart: 'md',
                  paddingEnd: 'md',
                  offsetStart: '123px',
                  width: '119px'
                }
              ],
              paddingAll: '0px'
            }
          }
        ]

        const message = {
          type: 'flex',
          altText: `${event.postback.data} Stock Menu`,
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync(
          './fs/stock-menu.json',
          JSON.stringify(message, null, 2)
        )
        event.reply(message)
      } else {
        // 不屬於以上 4 類的任意文字
        // (event.message.text.includes('Instructions') ||event.message.text.includes('說明'))
        // console.log(arrSymbolId.length)  //120107
        // console.log(stockRandom())
        // console.log(stockPop[stockRandom()])

        const flex = [
          {
            type: 'bubble',
            size: 'mega',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'box',
                  layout: 'horizontal',
                  contents: [
                    {
                      type: 'image',
                      url: 'https://www.frevvo.com/blog/wp-content/uploads/2020/01/Frevvo-Improve-Finance-hero.png',
                      size: 'full',
                      aspectMode: 'cover',
                      aspectRatio: '9:11',
                      gravity: 'center',
                      flex: 1
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        {
                          type: 'text',
                          text: 'Stock.Find',
                          size: 'xs',
                          color: '#ffffff',
                          align: 'center',
                          gravity: 'center'
                        }
                      ],
                      backgroundColor: '#e55732',
                      paddingAll: '2px',
                      paddingStart: '4px',
                      paddingEnd: '4px',
                      flex: 0,
                      position: 'absolute',
                      offsetStart: '18px',
                      offsetTop: '18px',
                      cornerRadius: '100px',
                      width: '89px',
                      height: '25px'
                    },
                    {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            {
                              type: 'text',
                              contents: [],
                              size: 'xl',
                              wrap: true,
                              text: '歡迎來到…',
                              color: '#064d88',
                              weight: 'bold'
                            },
                            {
                              type: 'text',
                              text: '在這個聊天室您可以直接輸入股票代號，協助您快速查詢股票資訊！',
                              color: '#064d88cc',
                              size: 'sm',
                              wrap: true
                            },
                            {
                              type: 'text',
                              text: '或輸入以下關鍵字，將立刻回覆您相關資訊',
                              color: '#064d88cc',
                              size: 'sm',
                              wrap: true,
                              margin: 'md'
                            }
                          ],
                          spacing: 'sm'
                        },
                        {
                          type: 'box',
                          layout: 'vertical',
                          contents: [
                            // 股票代號+market
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  contents: [],
                                  size: 'md',
                                  wrap: true,
                                  margin: 'none',
                                  color: '#064d88de',
                                  text: '股票代號+market',
                                  align: 'start',
                                  action: {
                                    type: 'message',
                                    label: `${
                                      stockPop[stockRandom()]
                                    }+market (e.g.)`,
                                    text: `${
                                      stockPop[stockRandom()]
                                    }+market (e.g.)`
                                  }
                                }
                              ],
                              paddingAll: '5px',
                              justifyContent: 'center',
                              paddingStart: '31px',
                              backgroundColor: '#ffffff1A'
                              // margin: 'md'
                            },
                            // 股票代號+news
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  contents: [],
                                  size: 'md',
                                  wrap: true,
                                  margin: 'none',
                                  color: '#064d88de',
                                  text: '股票代號+news',
                                  align: 'start',
                                  action: {
                                    type: 'message',
                                    label: `${
                                      stockPop[stockRandom()]
                                    }+news (e.g.)`,
                                    text: `${
                                      stockPop[stockRandom()]
                                    }+news (e.g.)`
                                  }
                                }
                              ],
                              paddingAll: '5px',
                              justifyContent: 'center',
                              paddingStart: '31px',
                              backgroundColor: '#ffffff1A',
                              margin: 'md'
                            },
                            // 股票代號+history
                            {
                              type: 'box',
                              layout: 'vertical',
                              contents: [
                                {
                                  type: 'text',
                                  contents: [],
                                  size: 'md',
                                  wrap: true,
                                  margin: 'none',
                                  color: '#064d88de',
                                  text: '股票代號+history',
                                  align: 'start',
                                  action: {
                                    type: 'message',
                                    label: `${
                                      stockPop[stockRandom()]
                                    }+history (e.g.)`,
                                    text: `${
                                      stockPop[stockRandom()]
                                    }+history (e.g.)`
                                  }
                                }
                              ],
                              paddingAll: '5px',
                              justifyContent: 'center',
                              paddingStart: '31px',
                              backgroundColor: '#ffffff1A',
                              margin: 'md'
                            }
                          ],
                          paddingAll: '9px',
                          cornerRadius: '2px',
                          margin: 'sm'
                        }
                      ],
                      spacing: 'sm',
                      position: 'absolute',
                      offsetTop: '50px',
                      offsetStart: '50px',
                      backgroundColor: '#f1cf4cdd',
                      paddingAll: '30px',
                      offsetBottom: 'none',
                      cornerRadius: 'md',
                      offsetEnd: 'none'
                    }
                  ]
                }
              ],
              paddingAll: '0px'
            }
          }
        ]

        const message = {
          type: 'flex',
          altText: '歡迎來到…',
          contents: {
            type: 'carousel',
            contents: flex
          }
        }

        fs.writeFileSync(
          './fs/stock-Instructions.json',
          JSON.stringify(message, null, 2)
        )
        event.reply(message)
      }
      // else {
      //   event.reply('查無此股票')
      // }
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤 QQ')
    }
  }
})
