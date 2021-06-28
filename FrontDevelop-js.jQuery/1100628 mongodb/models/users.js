import mongoose from 'mongoose'

const Schema = mongoose.Schema

const OrderItemSchema = new Schema({
  p_id: {
    // 存放 products 的 _id
    type: mongoose.ObjectId,
    // 關聯的地方名稱需相同
    // ↑ const products = mongoose.model('products', productSchema)
    // 指的是 資料庫中名為 products 的 collection
    ref: 'products'
  },
  amount: {
    type: Number
  }
})

const OrderSchema = new Schema({
  date: {
    type: Date
  },
  items: {
    type: [OrderItemSchema]
  }
})

// 因為 資料順序問題，在到這邊時資料需已準備好，所以 userSchema 只能放最後
const userSchema = new Schema({
  account: {
    type: String
  },
  password: {
    type: String
  },
  orders: {
    type: [OrderSchema]
  }
})

const users = mongoose.model('users', userSchema)

export default users
