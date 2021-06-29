import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  account: {
    type: String
  },
  password: {
    type: String
  },
  jwt: {
    type: [String]
  },
  avatar: {
    type: String
  }
})

export default mongoose.model('users', userSchema)
