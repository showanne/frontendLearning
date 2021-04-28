// from ' ' 有 ./ 是引用檔案 ，沒有是引用 node.js 的內建 http 套件
import http from 'http'

// 建立網頁伺服器
const server = http.createServer((req, res) => {
  // req 進來的請求
  // res 出去的請求

  // 回應狀態碼 200
  res.writeHead(200)
  // 寫入回應內容
  res.write('Hello')
  // 回應結束
  res.end()
})
// 在 3000 埠啟動伺服器
server.listen(3000, () => {
  console.log('伺服器啟動')
  console.log('http://localhost:3000')
})

// 在終端機執行程式後，會一直啟動，按 ctrl C 停止現在在執行的東西

// 在 package.json 改 "scripts": { "start": "node index.js"  }
// 可以用 npm run start 取代 node index.js 的指令
