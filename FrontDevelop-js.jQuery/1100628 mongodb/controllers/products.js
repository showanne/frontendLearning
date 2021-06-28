import products from '../models/products.js'

// 新增使用者
export const createProduct = async (req, res) => {
  // post http://localhost:3020/products
  try {
    const result = await products.create(req.body)
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
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}
