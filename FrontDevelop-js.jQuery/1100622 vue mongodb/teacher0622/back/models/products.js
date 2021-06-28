import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productsSchema = new Schema({
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  price: {
    type: Number,
    min: [0, '請輸入正確的價格'],
    required: [true, '缺少商品價格']
  },
  description: {
    type: String,
    required: [true, '缺少商品說明']
  }
})

const products = mongoose.model('products', productsSchema)

export default products
