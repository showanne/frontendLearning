import util from 'util' // 套件 可以 log 出 [object]
import products from '../models/products.js'

// 增
export const createProduct = async (req, res) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.status(400).send({ success: false, message: '資料格式錯誤' })
    return
  }
  try {
    const result = await products.create(req.body)
    // res.status(200)
    // res.send({ success: false, message: '資料格式錯誤' })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 查
export const getProducts = async (req, res) => {
  try {
    const query = {}

    // const query = {
    //   不能這樣先預設空的 {}，因為 price 欄位類型是數字
    //   price: {}
    // }

    // gte 大於
    if (req.query.pricegte) {
      if (!query.price) {
        // 如果沒有判斷可能會出現 query.price undefined 錯誤
        query.price = {}
      }
      const gte = parseInt(req.query.pricegte)
      if (!isNaN(gte)) {
        query.price.$gte = gte
      }
    }

    // lte 小於
    if (req.query.pricelte) {
      if (!query.price) {
        query.price = {}
      }
      const lte = parseInt(req.query.pricelte)
      if (!isNaN(lte)) {
        query.price.$lte = lte
      }
    }

    // 關鍵字搜尋
    if (req.query.keywords) {
      if (!query.$or) {
        query.$or = []
      }
      // 設立空陣列來裝關鍵字
      const names = []
      const descriptions = []

      // 若有多個關鍵字，將以 , 分割
      const keywords = req.query.keywords.split(',')

      // 把每個關鍵字加上正則表達式
      for (const keyword of keywords) {
        const re = new RegExp(keyword, 'i')
        // g (全域) 代表全部搜尋 / i 大小寫都可以
        names.push(re)
        descriptions.push(re)
      }
      // $or 或 / $in 包含
      query.$or.push({ name: { $in: names } })
      query.$or.push({ description: { $in: descriptions } })
    }

    console.log(util.inspect(query, { depth: null }))

    const result = await products.find(query)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 查單個
export const getProduct = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '查無商品' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 改
export const updateProduct = async (req, res) => {
  try {
    const result = await products.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean()
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '查無商品' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無商品' })
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
export const delProduct = async (req, res) => {
  try {
    const result = await products.findByIdAndDelete(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '' })
    } else {
      res.status(404).send({ success: false, message: '查無商品' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '查無商品' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
