// MongoDB 操作套件
import mongoose from 'mongoose'
// 網頁伺服器
import express from 'express'
// 讓 express 可以讀取 讀取傳入網頁伺服器Body 的資料
import bodyParser from 'body-parser'
// express 允許跨域請求
import cors from 'cors'
// 讀取環境設定檔
import dotenv from 'dotenv'

// users 資料的路由
import userRouter from './routes/users.js'
import productRouter from './routes/products.js'
import fileRouter from './routes/files.js'

dotenv.config()

// 連接資料庫   解決 mongoose 警示訊息
mongoose.connect(process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const app = express()

// 設定跨域套件
app.use(cors({
  // origin 為請求來源網域, callback 為是否允許的回應
  origin (origin, callback) {
    // 如果是開發環境
    if (process.env.DEV) {
      // 允許任何來源網域的請求
      callback(null, true)
    } else {
      // 如果不是開發環境
      // 如果請求不是找不到且來自'github'
      if (origin !== undefined && origin.includes('github')) {
        // 允許請求
        callback(null, true)
      } else {
        // 其他來源的請求，全部拒絕請求
        callback(new Error('Not allowed'), false)
      }
    }
  }
}))

// 處理 cors 錯誤
app.use((_, req, res, next) => {
  res.status(403).send({ success: false, message: '請求被拒絕' })
})

// 設定 body-parser 解析進來的資料
app.use(bodyParser.json())

// 處理 body-parser 錯誤
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '內容格式錯誤' })
})

// 根據進來的請求 使用不同的路由
app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/files', fileRouter)

// 最後擋住 404 不要讓 express 去處理
app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到內容' })
})

// 在 port 啟用
app.listen(process.env.PORT, () => {
  console.log('server start ' + process.env.PORT)
})
