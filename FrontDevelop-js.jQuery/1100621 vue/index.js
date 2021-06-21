import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser' // ???套件
import cors from 'cors' // 跨域套件
import users from './users.js'

// 資料庫連線
mongoose.connect('mongodb+srv://user:Anne123@cluster0.krn0h.mongodb.net/0621test')

const app = express()

// 設定前端來的跨域請求
app.use(cors({
  // orgin 為請求來源網域，callback 為是否允許
  origin (origin, callback) {
    console.log(origin)
    // callback(錯誤訊息, 是否允許)
    // 允許全部
    callback(null, true)
    // 拒絕寫法
    // callback(new Error('不給你用'), false)
  }
}))

// 使用 bodyParser 處理 post 的資料
app.use(bodyParser.json())

// 新增
// app.請求方式(路徑, 處理function)
// req 是進來的請求
// res 是出去的回應
app.post('/users', async (req, res) => {
  // 檢查進來的資料格式對不對
  // 有些傳進來的資料沒有(!) ['content-type'] 所以要加判斷
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }

  try {
    const result = await users.create(req.body)
    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      // 如果是驗證錯誤
      // 因為驗證錯誤是拿資料欄位當 key 值，所以用 Object.keys 取第一個
      const key = Object.keys(error.errors)[0]
      // 取驗證失敗的訊息
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      // 重複錯誤
      res.status(400).send({ success: false, message: '帳號或信箱已使用' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 查詢
app.get('/users', async (req, res) => {
  try {
    // ??
    const query = {}
    if (req.query.age) {
      query.age = parseInt(req.query.age)
      // 因為得到的資料是文字，要先轉成數字
    }

    // .find( { age:18 } )  .find({查詢欄位: 查詢條件})
    // get 網址要加 ?age=65 代表查詢條件
    const result = await users.find(query)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
})

// 修改 (更換部分資料)
app.patch('/users/:id', async (req, res) => {
  // 檢查進來的資料格式對不對
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '格式不符' })
    return
  }

  try {
    // findByIdAndUpdate(資料的 _id, {要改的欄位: 新的值}, { new: true })
    // { new: true } 會回傳更新後的資料
    const result = await users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '查無使用者' })
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      // 如果是驗證錯誤
      // 因為驗證錯誤是拿資料欄位當 key 值，所以用 Object.keys 取第一個
      const key = Object.keys(error.errors)[0]
      // 取驗證失敗的訊息
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else if (error.name === 'CastError') {
      // 使用錯誤的 _id 格式查詢時的錯誤
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 刪除
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await users.findByIdAndDelete(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '' })
    } else {
      res.status(404).send({ success: false, message: '查無使用者' })
    }
  } catch (error) {
    console.log(error)
    // 使用錯誤的 _id 格式查詢時的錯誤
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
})

// 建立 webserve 並在 3000port 執行
app.listen(3000, () => {
  console.log('http://localhost:3000')
})
