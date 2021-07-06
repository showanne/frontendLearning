import express from 'express'
import auth from '../middleware/auth.js'
// 從 controller 引用 function
import {
  register,
  login,
  logout
} from '../controllers/users.js'

// 建立 router
const router = express.Router()

// 此處'/' 路徑為 /users
// 註冊
router.post('/', register)
// 登入
router.post('/login', login)
// 登出，登出前驗證
router.delete('/logout', auth, logout)

// 匯出路由設定
export default router
