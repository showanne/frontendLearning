import users from '../models/users.js' // 引用使用者資料庫
import products from '../models/products.js' // 引用商品資料庫
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
  console.log('register')
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
  console.log('login')
}

// 登出
export const logout = async (req, res) => {
  try {
    // req.user.tokens (登出時回傳的 tokens) 是不是不等於傳進來的
    // 如果不等於會被留下；等於的會被踢掉(登出後刪除 tokens)
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    // 儲存
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log('logout')
}

// 加入購物車
export const addCart = async (req, res) => {
  try {
    // 驗證商品是否存在
    const result = await products.findById(req.body.product)
    // 如果找不到或已下架
    if (!result || !result.sell) {
      res.status(404).send({ success: false, message: '資料不存在' })
      return
    }
    // 找出使用者的購物車內有沒有這個商品
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    // .findIndex() 找出在陣列中的第幾個
    // moogoose 的 ID 格式是 objectid ，必須 .toString() 才能與我們傳入的 id 去做判斷
    // 找到就數量 += 傳入的新增數量，沒找到就 push
    // idx > -1 是 有找到商品(索引值 idx 為0、1、2...)
    // else idx <= -1 是 沒有找到商品
    if (idx > -1) {
      // 如果購物車內已有這項商品就把數量相加
      req.user.cart[idx].amount += req.body.amount
    } else {
      // 如果購物車內沒有這項商品就把商品新增進購物車
      req.user.cart.push({ product: req.body.product, amount: req.body.amount })
    }
    // 不驗證就存入
    await req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
    // 回傳購物車目前商品數量，可用於在購物車 icon 顯示數字
    // res.status(200).send({ success: true, message: '', result: req.user.cart.length })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log('addCart')
}

// 購物車顯示
export const getCart = async (req, res) => {
  try {
    // 用使用者 id 查詢使用者，只取 cart 欄位並將 ref 的商品資料一起帶出來
    // .populate 可以將 ref 欄位的資料帶出來 -> ref: 'product'
    const { cart } = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log('getCart')
}

// 購物車內編輯商品
export const editCart = async (req, res) => {
  try {
    // 如果傳入的數量小於等於 0，刪除
    // 如果大於 0，修改數量
    if (req.body.amount <= 0) {
      await users.findOneAndUpdate(
        { 'cart.product': req.body.product },
        {
          // 刪除陣列，裡面放條件
          $pull: {
            // 要刪除的陣列的欄位名稱
            cart: {
              // 符合傳進來的 product
              product: req.body.product
            }
          }
        }
      )
    } else {
      await users.findOneAndUpdate(
        // 找到 cart.product 裡符合傳入的商品 ID
        {
          'cart.product': req.body.product
        },
        // 將該筆改為傳入的數量， $ 代表符合查詢條件的索引
        {
          $set: {
            'cart.$.amount': req.body.amount
          }
        }
      )
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log('editCart')
}

// 結帳
export const checkout = async (req, res) => {
  try {
    if (req.user.cart.length > 0) {
      req.user.orders.push({ products: req.user.cart, date: new Date() })
      req.user.cart = []
      req.user.save({ validateBeforeSave: false })
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log(checkout)
}

// 查詢自己的訂單
export const getorders = async (req, res) => {
  try {
    // .populate 關聯的資料
    const result = await users.findById(req.user._id, 'orders').populate('orders.products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log(getorders)
}

// 查詢所有訂單
export const getallorders = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const result = await users.find().populate('orders.products.product').lean()
    const orders = []
    // 將資料整理成前端好使用的格式
    for (const user of result) {
      for (const order of user.orders) {
        orders.push({ ...order, user: { _id: user._id, account: user.account } })
      }
    }
    res.status(200).send({ success: true, message: '', result: orders })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log(getallorders)
}

// 拿舊的 jwt 去換新 jwt
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => req.token === token)
    const token = jwt.sign({ _id: req.user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    // 標記陣列文字已修改過，不然不會更新
    req.user.markModified('tokens')
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log(extend)
}

// 抓取使用者資料
export const getuserinfo = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        role: req.user.role,
        email: req.user.email
      }
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log(getuserinfo)
}
