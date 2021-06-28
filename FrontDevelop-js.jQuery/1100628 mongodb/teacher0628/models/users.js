import mongoose from 'mongoose'

const Schema = mongoose.Schema

const OrderItemSchema = new Schema({
  p_id: {
    // 存放 products 的 _id
    type: mongoose.ObjectId,
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
