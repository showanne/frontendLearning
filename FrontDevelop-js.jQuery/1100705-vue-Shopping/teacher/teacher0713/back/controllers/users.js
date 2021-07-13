import users from '../models/users.js'
import products from '../models/products.js'
import md5 from 'md5'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error.code)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const user = await users.findOne({ account: req.body.account }, '')
    if (user) {
      if (user.password === md5(req.body.password)) {
        const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
        user.tokens.push(token)
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

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

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
    // 找到就數量 += 傳入的新增數量，沒找到就 push
    if (idx > -1) {
      req.user.cart[idx].amount += req.body.amount
    } else {
      req.user.cart.push({ product: req.body.product, amount: req.body.amount })
    }
    await req.user.save({ validateBeforeSave: false })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getCart = async (req, res) => {
  try {
    // 用使用者 id 查詢使用者，只取 cart 欄位並將 ref 的商品資料一起帶出來
    const { cart } = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editCart = async (req, res) => {
  try {
    // 如果傳入的數量小於等於 0，刪除
    // 如果大於 0，修改數量
    if (req.body.amount <= 0) {
      await users.findOneAndUpdate(
        { 'cart.product': req.body.product },
        {
          $pull: {
            cart: {
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
        // 將該筆改為傳入的數量，$ 代表符合查詢條件的索引
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
}

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
}

export const getorders = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'orders').populate('orders.products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getallorders = async (req, res) => {
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    return
  }
  try {
    const result = await users.find().populate('orders.products.product').lean()
    const orders = []
    // 整理成前端好使用的格式
    for (const user of result) {
      for (const order of user.orders) {
        orders.push({ ...order, user: { _id: user._id, account: user.account } })
      }
    }
    res.status(200).send({ success: true, message: '', result: orders })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

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
}

export const getuserinfo = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: { account: req.user.account, role: req.user.role, email: req.user.email }
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
