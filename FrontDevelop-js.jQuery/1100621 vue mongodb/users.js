import mongoose from 'mongoose'  // MongoDB 操作套件
import validator from 'validator' // 驗證套件
import md5 from 'md5' // 加密套件

const Schema = mongoose.Schema

// 設定使用者 collection 資料表 欄位結構
const userSchema = new Schema({
  // 帳號
  account: {
    // 資料型態
    type: String,
    // mongoose 內建的驗證
    // 最小長度 4 與自訂的錯誤訊息
    minlength: [4, '帳號必須最少 4 個字'],
    // 最大長度 10 與自訂的錯誤訊息
    maxlength: [10, '帳號必須最少 10 個字'],
    // 必填與自訂的錯誤訊息
    required: [true, '缺少帳號欄位'],
    // 設定不可重複，這裡的驗證無法使用自訂錯誤訊息，除非安裝套件
    unique: true
  },
  // 密碼
  password: {
    type: String,
    // 最小長度 5 與自訂的錯誤訊息
    minlength: [5, '密碼必須最少 5 個字'],
    // 最大長度 10 與自訂的錯誤訊息
    maxlength: [10, '密碼必須最少 10 個字'],
    // 必填與自訂的錯誤訊息
    required: [true, '缺少密碼欄位']
  },
  email: {
    type: String,
    required: [true, '缺少信箱欄位'],
    unique: true,
    // 自訂驗證，安裝套件 npm i validator
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
    min: [18, '年齡必須大於 18 歲'],
    // 最大值
    max: [110, '請輸入有效年齡'],
    // 必填
    required: [true, '缺少年齡欄位']
  }
})

// 在驗證後準備把資料存入資料庫前
userSchema.pre('save', function (next) {
  // 此處不能使用箭頭函式
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
// collection 名稱 一定要用英文複數
const users = mongoose.model('users', userSchema)

export default users
