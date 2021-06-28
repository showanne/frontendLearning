import mongoose from 'mongoose'
import md5 from 'md5'

const Schema = mongoose.Schema

const usersSchema = new Schema({
  account: {
    type: String,
    minlength: [4, '帳號最少四個字'],
    maxlength: [10, '帳號最多十個字']
  },
  password: {
    type: String,
    minlength: [4, '密碼最少四個字'],
    maxlength: [10, '密碼最多十個字']
  }
})

usersSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = md5(user.password)
  }
  next()
})

const users = mongoose.model('users', usersSchema)

export default users
