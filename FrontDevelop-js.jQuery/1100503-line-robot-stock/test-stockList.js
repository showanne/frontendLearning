import axios from 'axios'
import iconv from 'iconv-lite'
// https://www.npmjs.com/package/iconv-lite
// https://dotblogs.com.tw/wasichris/2021/02/19/102257

const arrSymbolId = []
const test = async () => {
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

    // for (const s in arr) {
    //   arrSymbolId.push(arr[s][0])
    // }
    // console.log(arr)
    // console.log(arr[30][0])
    // console.log(arrSymbolId)
    // const reply = arrSymbolId
    // reply()
  } catch (error) {
    console.log(error)
  }
  // return arrSymbolId
}
test()
setTimeout(() => {
  console.log(arrSymbolId)
}, 1000)
