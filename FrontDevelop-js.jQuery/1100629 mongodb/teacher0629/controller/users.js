import users from '../models/users.js'
import jwt from 'jsonwebtoken'

export const createUser = async (req, res) => {
  try {
    const result = await users.create(req.body)
    res.status(200).send({ success: true, message: '', result})
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}

export const login = async (req, res) => {
  try {
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
      result.jwt.push(token)
      result.save()
      res.status(200).send({ success: true, message: '', token})
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}

export const getUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      res.status(200).send({ success: true, message: '', result: req.user})
    } else {
      res.status(403).send({ success: false, message: '沒有權限'})
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}

export const logout = async (req, res) => {
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

export const changeAvatar = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(req.params.id, {avatar: req.filepath})
    res.status(200).send({ success: true, message: ''})
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤'})
  }
}
