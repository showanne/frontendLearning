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

const products = mongoose.model('products', productSchema)

export default products
