import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'

import userRouter from './routes/users.js'

dotenv.config()

// 解決 mongoose 警示訊息
mongoose.connect(process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

const app = express()

app.use(cors({
  origin (origin, callback) {
    // 如果是開發環境
    if (process.env.DEV) {
      // 允許全部請求
      callback(null, true)
    } else {
      // 如果不是開發環境
      // 如果請求不是找不到且來自'github'
      if (origin !== undefined && origin.includes('github')) {
        // 允許請求
        callback(null, true)
      } else {
        // 其他來源的請求，全部不允許
        callback(new Error('Not allowed'), false)
      }
    }
  }
}))

// 處理 cors 錯誤
app.use((_, req, res, next) => {
  res.status(403).send({ success: false, message: '請求被拒絕' })
})

// body-parser 解析進來的資料
app.use(bodyParser.json())

// 處理 body-parser 錯誤
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '內容格式錯誤' })
})

// 根據進來的路由
app.use('/users', userRouter)

// 最後擋住 404 不要讓 express 去處理
app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到內容' })
})

app.listen(process.env.PORT, () => {
  console.log('server start' + process.env.PORT)
})
