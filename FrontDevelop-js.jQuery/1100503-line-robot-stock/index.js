import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
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
      const responseChart = await axios.get(
        `https://api.fugle.tw/realtime/v0.2/intraday/chart?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
      )
      const responseMeta = await axios.get(
        `https://api.fugle.tw/realtime/v0/intraday/meta?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
      )
      const responseQuote = await axios.get(
        `https://api.fugle.tw/realtime/v0/intraday/quote?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0`
      )
      const responseDealts = await axios.get(
        `https://api.fugle.tw/realtime/v0.2/intraday/dealts?symbolId=${encodeURI(event.message.text)}&apiToken=bcb3f1d25b0a8e5d3ad0e7acbdbe10b0&limit=5`
      )
      console.log(responseChart.data.data.chart)
      // console.log(responseQuote.data.data.quote.change)
      const reply = `股票中文簡稱：${responseMeta.data.data.meta.nameZhTw}
        \n股票代號：${responseMeta.data.data.info.symbolId}
        \n此分鐘的：${responseChart.data.data.chart}
        \n此分鐘的開盤價：${responseChart.data.data.chart.open}
        \n此分鐘的最高價：${responseChart.data.data.chart.high}
        \n此分鐘的最低價：${responseChart.data.data.chart.low}
        \n此分鐘的收盤價：${responseChart.data.data.chart.close}
        \n此分鐘的交易張數：${responseChart.data.data.chart.unit}

        \n最新一筆成交時間：${new Date(responseQuote.data.data.quote.total.at).toLocaleString('zh-tw')}
        \n今日參考價：${responseMeta.data.data.meta.priceReference}
        \n漲停價：${responseMeta.data.data.meta.priceHighLimit}
        \n跌停價：${responseMeta.data.data.meta.priceLowLimit}
        \n當日股價之漲跌：${parseInt(responseQuote.data.data.quote.change)}
        \n跌停價：${responseDealts.data.data.dealts}
        `

      event.reply(reply)
    } catch (error) {
      console.log(error)
      // event.reply(error)
      event.reply('發生錯誤QQ')
    }
  }
})
