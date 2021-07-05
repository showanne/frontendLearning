import users from '../models/users.js'
import md5 from 'md5'
import jwt from 'jsonwebtoken'

// 註冊
export const register = async (req, res) => {
  // 先檢查進來的資料格式
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    // console.log(error)
    if (error.name === 'ValidationError') {
      // 用 Object.keys 取第一個驗證錯誤
      const key = Object.keys(error.errors)[0]
      // 取驗證失敗的訊息
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 登入
export const login = async (req, res) => {
  // 先檢查進來的資料格式
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    // ? 找到符合傳入的帳號的使用者資料
    const user = await users.findOne({ account: req.body.account, password: md5(req.body.password) }, '-password')
    // 如果有找到
    if (user) {
      // 簽發一個 jwt token
      const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })

      // 將 token 存入使用者帳號資料庫的 tokens 欄位內
      user.tokens.push(token)
      // 儲存
      user.save()
      // 若登入成功，將以下資料傳給前端
      res.status(200).send({
        success: true,
        message: '登入成功',
        token,
        email: user.email,
        account: user.account,
        role: user.role
      })
    } else {
      res.status(400).send({ success: false, message: '帳號或密碼錯誤' })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
