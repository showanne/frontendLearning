import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import usersRoute from './routes/users.js'
import productsRoute from './routes/products.js'

dotenv.config()

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)

const app = express()

app.use(cors({
  origin (origin, cb) {
    cb(null, true)
  }
}))
app.use(bodyParser.json())

// 處理 Express 套件的錯誤，一定要放在要處理的套件後面
// function 一定要放四個東西
// error = 發生的錯誤
// next = 繼續下一個步驟，使用方式為 next()
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '格式錯誤' })
})

app.use('/users', usersRoute)
app.use('/products', productsRoute)

// 放在倒數第二個，如果進來的路徑和請求都不是上面設定的，自訂錯誤訊息
app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '路徑錯誤' })
})

// 最後放一個保險起見，處理預期外的狀況
app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send({ success: false, message: '錯誤' })
})

app.listen(process.env.PORT, () => {
  console.log('Server Started')
})
