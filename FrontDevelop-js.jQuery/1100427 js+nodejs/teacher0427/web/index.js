import http from 'http'

const server = http.createServer((req, res) => {
  res.writeHead(200)
  res.write('Hello')
  res.end()
})

server.listen(3000, () => {
  console.log('伺服器啟動')
  console.log(`http://localhost:3000`)
})