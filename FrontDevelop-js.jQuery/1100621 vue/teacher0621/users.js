import mongoose from 'mongoose'
import validator from 'validator'
import md5 from 'md5'

const Schema = mongoose.Schema

// 設定使用者 collection 欄位結構
const userSchema = new Schema({
  account: {
    type: String,
    // mongoose 內建的驗證
    // 最小長度 4 與自訂的錯誤訊息
    minlength: [4, '帳號必須最少 4 個字'],
    // 最大長度 4 與自訂的錯誤訊息
    maxlength: [10, '帳號必須最多 10 個字'],
    // 必填與自訂的錯誤訊息
    required: [true, '缺少帳號欄位'],
    // 設定不可重複，這裡的驗證無法使用自訂錯誤訊息，除非安裝套件
    unique: true
  },
  password: {
    type: String,
    // 必填與自訂的錯誤訊息
    required: [true, '缺少密碼欄位'],
    // 最小長度 4 與自訂的錯誤訊息
    minlength: [4, '密碼必須最少 4 個字'],
    // 最大長度 4 與自訂的錯誤訊息
    maxlength: [10, '密碼必須最多 10 個字']
  },
  email: {
    type: String,
    required: [true, '缺少信箱欄位'],
    unique: true,
    // 自訂驗證
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '信箱格式錯誤'
    }
  },
  age: {
    type: Number,
    // 最小值
    min: [18, '必須大於 18 歲'],
    max: [110, '請輸入有效年齡'],
    required: [true, '缺少年齡欄位']
  }
}, {
  // 停用 mongoose 內建的資料筆數
  versionKey: false
})

// 在驗證後準備把資料存入資料庫前
// 不能使用箭頭函式
userSchema.pre('save', function (next) {
  // this 代表的是即將存入的資料
  const user = this
  // 如果這筆資料的密碼有修改過
  if (user.isModified('password')) {
    // 將密碼使用 md5 加密法加密
    user.password = md5(user.password)
  }
  // 繼續動作
  next()
})

// 建立 mongoose 的資料 model
// mongoose.model(collection名稱, Schema)
// collection名稱 一定要用英文複數
const users = mongoose.model('users', userSchema)

export default users
