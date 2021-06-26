import users from '../models/users.js'

// 增
export const createUser = async (req, res) => {
  try {
    let result = await users.create(req.body)
    console.log(typeof result)
    // .toObject() 將回傳的 Mongoose Document(Mongoose 特有格式，非JSON物件) 格式轉為 JS 格式才能進行相關操作
    result = result.toObject()
    // 回傳時 刪除密碼欄位 顯示
    delete result.password

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
    // } else if (error.name === 'MongoError' && error.code === 11000) {
    //   // 重複錯誤
    //   res.status(400).send({ success: false, message: '帳號或信箱已使用' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 查
export const getUsers = async (req, res) => {
  try {
    // .find(查詢條件, 回傳欄位)
    // 回傳欄位以空白分隔，- 代表不要指定欄位，沒有 - 代表指定欄位
    const result = await users.find({}, '-password')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 查單個使用者id
export const getUser = async (req, res) => {
  try {
    // 抓單個使用者id
    const result = await users.findById(req.params.id, '-password')
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '查無使用者' })
    }
  } catch (error) {
    // CastError 格式不符
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 改
export const updateUser = async (req, res) => {
  try {
    // .lean() 也是將 Mongoose Document 資料型態轉為 JS 可以處理的東西
    const result = await users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
    if (result) {
      delete result.password
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '查無使用者' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 刪
export const delUser = async (req, res) => {
  try {
    const result = await users.findByIdAndDelete(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '' })
    } else {
      res.status(404).send({ success: false, message: '查無使用者' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無使用者' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
