import axios from 'axios'

// 要先取得 https://istockapp.cathaysec.com.tw/Marketing/Souvenir/Service.aspx/SouvenirSearch 的 d{} 後，將一長串資料解碼 decoded ，再用 filtter ? 去搜尋使用者輸入的股票代號，去給予 股東會資訊
// {'para':{"myStock":false,"souvenir":false,"meetingDate":"2021-06,2021-07"}}

const StockList = async () => {
  try {
    const res = await axios.post(
      'https://istockapp.cathaysec.com.tw/Marketing/Souvenir/Service.aspx/SouvenirSearch',
      {
        para: {
          myStock: false,
          souvenir: false,
          meetingDate: '2021-06,2021-07'
        }
      }
    )
    // console.log(res.data.d)
    const base64StockList = Buffer.from(`${res.data.d}`, 'base64')
    const decodedStockList = base64StockList.toString('utf-8')
    console.log(decodedStockList)
    // {
    //   "公司名稱": "愛之味",
    //   "股票代號": "1217",
    //   "最後買進日": "2021/04/21",
    //   "臨時常會": "常會",
    //   "開會日期": "2021/06/22",
    //   "紀念品": "愛之味忘不了核桃燕麥粥3瓶或其他等值商品",
    //   "para": "MTIxN3zluLjmnIN8MjAyMS8wNi8yMg=="
    // }
  } catch (error) {
    console.log(error)
  }
}

StockList()

const StockSouvenir = async () => {
  try {
    // axios.post('', {para: ''})
    const data = await axios.post(
      'https://istockapp.cathaysec.com.tw/Marketing/Souvenir/Service.aspx/SouvenirDetail',
      { para: 'MTEwMnzluLjmnIN8MjAyMS8wNi8yNQ==' }
    )
    console.log(data.data)
  } catch (error) {
    console.log(error)
  }
}

StockSouvenir()

// const StockList = axios.post(
//   'https://istockapp.cathaysec.com.tw/Marketing/Souvenir/Service.aspx/SouvenirDetail',
//   { para: 'MTIwMXzluLjmnIN8MjAyMS8wNi8yMw==' }
// )
// console.log(StockList())
//    StockList is not a function

// const base64 = Buffer.from('MjcyN3zluLjmnIN8MjAyMS8wNi8yOQ==', 'base64')
// const decoded = base64.toString('utf-8')
// console.log(decoded) // 2727|常會|2021/06/29

// https://webap.cathaysec.com.tw/TreasuryStock/kchart/lastclose/0056.png?t=1623984243943
// 0056 股票代號
// t= 時間 new Date().getTime()
// $("#stockImg").attr("src", "https://webap.cathaysec.com.tw/TreasuryStock/kchart/lastclose/" + result.股票代號 + ".png" + "?t=" + new Date().getTime());
