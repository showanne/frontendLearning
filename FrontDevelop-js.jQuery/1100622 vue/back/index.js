import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import usersRoute from './routes/users.js'
import productsRoute from './routes/products.js'

dotenv.config()

// (node:13284) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
// node 一長串訊息顯示提醒有某些套件即將過期，所以加下面這句解決
//  { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
// 若有設.findById (../controllers/users.js) 會跳出 Deprecationwarning: Mongoose:  findoneAndupdate()and findoneAndDelete()without the useFindAndModify 意思是警告此方法即將失效建議加上 mongoose.set('useFindAndModify', false) 以順利執行
mongoose.set('useFindAndModify', false)

const app = express()

app.use(cors({
  origin (origin, cb) {
    cb(null, true)
  }
}))

app.use(bodyParser.json())

// 處理 Express 套件的錯誤，一定要放在要處理的套件(express、bodyParser...)後面
// function 一定要放四個東西
// error = 發生的錯誤
// next = 繼續下一個步驟，使用方式為 next()
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '格式錯誤' })
})

// 自己預設請求的回應
app.use('/users', usersRoute)
app.use('/products', productsRoute)

// 放在倒數第二個，如果進來的路徑和請求是以上之外的其他回應，自訂錯誤訊息
// '*' 表示全部
app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '路徑錯誤' })
})

// 最後放一個保險起見，處理預期外的狀況
app.use((error, req, res, next) => {
  console.log(error)
  res.status(400).send({ success: false, message: error })
})

app.listen(process.env.PORT, () => {
  console.log('Server Started:3000')
})
