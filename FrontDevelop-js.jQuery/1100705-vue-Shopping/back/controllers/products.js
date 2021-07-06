import products from '../models/products.js'

// 新增商品
export const newProduct = async (req, res) => {
  // 驗證權限是否為管理員
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    // 驗證沒過就不跑接下來的程式，也可以後面都用 else 包起來
    return
  }
  // 檢查進來的資料格式
  // 前端送出的資料類型 FormData 後端接收 multipart/form-data
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    // req.filepath
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      sell: req.body.sell,
      image: req.filepath
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
  console.log('newProduct')
}

// 檢視商品
export const getProduct = async (req, res) => {
  try {
    const result = await products.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
  console.log('getProduct')
}

// 編輯商品
export const editProduct = async (req, res) => {
  // 驗證權限是否為管理員
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '沒有權限' })
    // 驗證沒過就不跑接下來的程式，也可以後面都用 else 包起來
    return
  }
  // 檢查進來的資料格式
  // 前端送出的資料類型 FormData 後端接收 multipart/form-data
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    res.status(400).send({ success: false, message: '資料格式不正確' })
    return
  }
  try {
    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      sell: req.body.sell
    }
    // 判斷有更新圖片才回傳，不要把原本的圖覆蓋掉..?
    if (req.filepath) data.image = req.filepath
    const result = await products.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    )
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).send({ success: false, message: message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
  console.log('editProduct')
}
