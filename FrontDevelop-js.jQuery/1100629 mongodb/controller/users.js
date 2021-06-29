import users from '../models/users.js'
import jwt from 'jsonwebtoken'

// 註冊
export const createUser = async (req, res) => {
  // POST http://localhost:3090/users
  // body : 輸入  { "account":"...", "password":"..." }
  try {
    const result = await users.create(req.body)
    res.status(200).send({ success: true, message: '', result})
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
  console.log('createUser');
}

// 登入
export const login = async (req, res) => {
  // POST http://localhost:3090/users/login
  // body : 輸入  { "account":"...", "password":"..." }
  // 會給一筆 jwt Token → 用於之後查詢使用者及登出用
  // 每次登入都會產生新 token ，所以查詢時要注意更新 token
  // 同時登入會產生多組 token ，類似不同裝置(電腦 手機)登入的概念
  // 登出 其中一筆 token (裝置)，全部這個帳號的 token 不會一起登出
  try {
    // 找一筆符合傳入的帳號密碼的那個資料庫
    const result = await users.findOne(req.body)
    if (result === null) {
      res.status(404).send({ success: false, message: '帳號或密碼錯誤'})
    } else {
      // 簽發一個 jwt，七天後過期
      const token = jwt.sign(
        // jwt 內容資料
        { _id: result._id.toString() },
        // 加密用的key
        process.env.SECRET,
        // jwt 設定
        { expiresIn: '7 days' }
      )
      // 將 jwt 存入使用者帳號資料庫內
      result.jwt.push(token)
      result.save()
      res.status(200).send({ success: true, message: '', token})
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
  console.log('login');
}

// 驗證使用者傳入的 jwt Token 是否有相對應的帳號
export const getUser = async (req, res) => {
  // GET http://localhost:3090/users/使用者 id
  // Authorization → Type : Bearer Token → Token : 輸入 使用者 id 對應的 jwt Token
  try {
    // .toString() 轉換格式
    if (req.params.id === req.user._id.toString()) {
      res.status(200).send({ success: true, message: '', result: req.user})
    } else {
      res.status(403).send({ success: false, message: '沒有權限'})
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}

// 登出
export const logout = async (req, res) => {
  // DELETE http://localhost:3090/users/logout
  // Authorization → Type : Bearer Token → Token : 輸入 剛剛使用者登入時 給的 jwt Token
  // 每次登入都會產生新 token ，所以查詢時要注意更新 token
  // 同時登入會產生多組 token ，類似不同裝置(電腦 手機)登入的概念
  // 登出 其中一筆 token (裝置)，全部這個帳號的 token 不會一起登出
  try {
    req.user.jwt = req.user.jwt.filter(token => {
      return token !== req.token
    })
    req.user.save()
    res.status(200).send({ success: true, message: ''})
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}

// 上傳檔案
export const changeAvatar = async (req, res) => {
  // PATCH http://localhost:3090/users/logout
  // Authorization → Type : Bearer Token → Token : 輸入 剛剛使用者登入時 給的 jwt Token
  // body → √ form-data → KEY：image √ file → VALUE：上傳圖片
  try {
    const result = await users.findByIdAndUpdate(req.params.id, {avatar: req.filepath})
    res.status(200).send({ success: true, message: '上傳成功'})
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}