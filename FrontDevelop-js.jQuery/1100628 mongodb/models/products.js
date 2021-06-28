import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  }
})

// 關聯的地方名稱需相同
// ↑ p_id: ref: 'products'
const products = mongoose.model('products', productSchema)

export default products
