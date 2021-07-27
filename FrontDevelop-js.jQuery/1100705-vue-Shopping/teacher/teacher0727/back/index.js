import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'

import userRouter from './routes/users.js'
import productRouter from './routes/products.js'
import fileRouter from './routes/files.js'

dotenv.config()

mongoose.connect(process.env.MONGODB)

const app = express()

app.use(cors({
  origin (origin, callback) {
    if (process.env.DEV === 'true') {
      callback(null, true)
    } else {
      if (origin === undefined || origin.includes('github')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed'), false)
      }
    }
  }
}))

// 處理 cors 錯誤
app.use((_, req, res, next) => {
  res.status(403).send({ success: false, message: '請求被拒絕' })
})

app.use(bodyParser.json())

// 處理 body-parser 錯誤
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '內容格式錯誤' })
})

app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/files', fileRouter)

// 最後擋住 404 不要讓 express 去處理
app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到內容' })
})

app.listen(process.env.PORT, () => {
  console.log('server start')
})
