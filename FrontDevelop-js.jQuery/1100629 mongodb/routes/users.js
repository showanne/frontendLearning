import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  createUser,
  login,
  logout,
  getUser,
  changeAvatar
} from '../controller/users.js'

const router = express.Router()

// 註冊
router.post('/', createUser)
// 登入
router.post('/login', login)
// logout 順序需在 getUser 上
// 登出
router.delete('/logout', auth, logout)
// 驗證使用者傳入的 jwt Token 是否有相對應的帳號
router.get('/:id', auth, getUser)
// 上傳檔案
router.patch('/:id', auth, upload, changeAvatar)

export default router
