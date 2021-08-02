import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
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
    // if (getlist.includes(event.message.text)) {
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
      const responseDealts = await axios.get(
        `https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=9`
      )
      const googleFin = await axios.get(`https://www.google.com/finance/quote/${encodeURI(event.message.text)}:TPE`)

      // console.log(responseChart.data.data.chart)
      // console.log(responseQuote.data.data.quote.change)

      for (const c in responseChart.data.data.chart) {
        console.log(c.substr(11, 5))
        var chartMin = c.substr(11, 5)
        var chartData = responseChart.data.data.chart[c]
        console.log(chartMin)
        console.log(chartData)
      }

      for (const d in responseDealts.data.data.dealts) {
        var dealtsData = responseDealts.data.data.dealts[d]
        console.log(dealtsData)
      }

      const reply = `股票中文簡稱：${responseMeta.data.data.meta.nameZhTw}
          \n股票代號：${responseMeta.data.data.info.symbolId}
          \n今日參考價：${responseMeta.data.data.meta.priceReference}
          \n漲停價：${responseMeta.data.data.meta.priceHighLimit}
          \n跌停價：${responseMeta.data.data.meta.priceLowLimit}
          \n當日股價之漲跌幅：${responseQuote.data.data.quote.change}


          \n此分鐘：${chartMin}
          \n此分鐘的開盤價：${chartData.open}
          \n此分鐘的最高價：${chartData.high}
          \n此分鐘的最低價：${chartData.low}
          \n此分鐘的收盤價：${chartData.close}
          \n此分鐘的交易張數：${chartData.unit}

          \n成交時間：${dealtsData.at.substr(11, 8)}
          \n成交價格：${dealtsData.price}
          \n成交張數：${dealtsData.unit}

          \n最新一筆成交時間：${new Date(responseQuote.data.data.quote.total.at).toLocaleString('zh-tw')}

          \n歷史資料查詢：${googleFin}
          `
      event.reply(reply)
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤QQ')
    }
    // } else {
    //   event.reply('沒有這個股票喔OwO')
    // }
  }
})
