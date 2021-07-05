import mongoose from 'mongoose'
import md5 from 'md5' // 加密套件
import validator from 'validator' // 信箱驗證套件

const Schema = mongoose.Schema

const UserSchema = new Schema({
  // 帳號
  account: {
    type: String,
    minlength: [4, '帳號必須 4 個字以上'],
    maxlength: [20, '帳號不能超過 20 個字'],
    // 設定不可重複
    unique: true,
    // 必填與自訂錯誤訊息
    required: [true, '帳號不能為空']
  },
  // 密碼
  password: {
    type: String,
    minlength: [4, '密碼必須 4 個字以上'],
    maxlength: [20, '密碼不能超過 20 個字'],
    required: [true, '密碼不能為空']
  },
  // 信箱
  email: {
    type: String,
    required: [true, '信箱不能為空'],
    unique: true,
    // 自訂驗證
    validate: {
      validator: (email) => {
        return validator.isEmail(email)
      },
      message: '信箱格式不正確'
    }
  },
  // 使用者身分
  role: {
    // 0 = 一般會員
    // 1 = 管理員
    type: Number,
    // 預設值
    default: 0,
    required: [true, '沒有使用者分類']
  },
  // 每次登入的驗證 token
  tokens: {
    type: [String]
  },
  // 購物車
  cart: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: [true, '缺少商品 ID']
        },
        amount: {
          type: Number,
          required: [true, '缺少商品數量']
        }
      }
    ]
  },
  // 訂單
  orders: {
    type: [
      {
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
      }
    ]
  }
},
// 不要存 v_
{ versionKey: false })

// 在驗證後準備把資料存入資料庫前，使用 md5 加密使用者送出的密碼
UserSchema.pre('save', function (next) {
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

// 建立 mongoose 的資料 model (collection名稱, Schema)
export default mongoose.model('users', UserSchema)
