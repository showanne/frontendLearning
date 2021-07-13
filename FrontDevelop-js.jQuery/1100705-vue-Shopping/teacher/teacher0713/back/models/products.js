import mongoose from 'mongoose'

const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, '品名不能為空'],
    minlength: [1, '品名不能為空']
  },
  price: {
    type: Number,
    min: [0, '價格格式不正確'],
    required: [true, '價格不能為空']
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  sell: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

export default mongoose.model('products', productSchema)
