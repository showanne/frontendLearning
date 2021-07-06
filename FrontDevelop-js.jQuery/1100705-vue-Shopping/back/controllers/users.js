import users from '../models/users.js' // 引用使用者資料庫
import md5 from 'md5' // 加密套件
import jwt from 'jsonwebtoken' // 製作 token

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
    // // 資料格式錯誤
    // console.log(error)
    if (error.name === 'ValidationError') {
      // 錯誤的訊息的 key 值為欄位名稱，不固定
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

// 登入 - 寫法 1
// export const login = async (req, res) => {
//   // 先檢查進來的資料格式
//   if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
//     res.status(400).send({ success: false, message: '資料格式不正確' })
//     // 如果對就繼續，不對就不跑下面
//     return
//   }
//   try {
//     // 先去資料庫中找出符合傳入資料的使用者
//     // 查詢的資料庫欄位 帳號；密碼
//     // password: md5(req.body.password) 傳進來的密碼是不是資料庫儲存的加密(md5)後的密碼
//     const user = await users.findOne({
//       account: req.body.account,
//       password: md5(req.body.password)
//     }, '-password')
//     // 如果有登入成功
//     if (user) {
//       // 簽發一個 jwt token
//       const token = jwt.sign(
//         { _id: user._id.toString() },
//         process.env.SECRET,
//         { expiresIn: '7 days' }
//       )

//       // 將 token 存入使用者帳號資料庫的 tokens 欄位內
//       user.tokens.push(token)
//       // 儲存
//       user.save()
//       // 若登入成功，將以下資料傳給前端
//       res.status(200).send({
//         success: true,
//         message: '登入成功',
//         token,
//         email: user.email,
//         account: user.account,
//         role: user.role
//       })
//     } else {
//       res.status(400).send({ success: false, message: '帳號或密碼錯誤' })
//     }
//   } catch (error) {
//     res.status(500).send({ success: false, message: '伺服器錯誤' })
//   }
// }

// 登入 - 寫法 2
export const login = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const user = await users.findOne({ account: req.body.account }, '')
    if (user) {
      // password: md5(req.body.password) 傳進來的密碼是不是資料庫儲存的加密(md5)後的密碼
      if (user.password === md5(req.body.password)) {
        const token = jwt.sign(
          { _id: user._id.toString() },
          process.env.SECRET,
          { expiresIn: '7 days' })
        user.tokens.push(token)
        // 儲存之前不驗證就存入
        user.save({ validateBeforeSave: false })
        res.status(200).send({
          success: true,
          message: '登入成功',
          token,
          email: user.email,
          account: user.account,
          role: user.role
        })
      } else {
        res.status(400).send({ success: false, message: '密碼錯誤' })
      }
    } else {
      res.status(400).send({ success: false, message: '帳號錯誤' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    // 不等於會被留下；等於會被踢掉
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    // 儲存
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
