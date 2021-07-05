import express from 'express'
// import auth from '../middleware/auth.js'
import {
  register,
  login
} from '../controllers/users.js'

const router = express.Router()

// 註冊
router.post('/', register)
// 登入
router.post('/login', login)

export default router
