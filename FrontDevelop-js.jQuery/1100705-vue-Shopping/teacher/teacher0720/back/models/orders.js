import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: [true, '缺少商品 ID']
    },
    amount: {
      type: Number,
      required: [true, '缺少商品數量']
    }
  }],
  date: {
    type: Date,
    required: [true, '缺少訂單日期']
  }
}, { versionKey: false })

export default mongoose.model('orders', productSchema)
