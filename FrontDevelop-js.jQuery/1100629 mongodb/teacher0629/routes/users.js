import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import {
  createUser,
  login,
  getUser,
  logout,
  changeAvatar
} from '../controller/users.js'

const router = express.Router()

router.post('/', createUser)
router.post('/login', login)
router.delete('/logout', auth, logout)
router.get('/:id', auth, getUser)
router.patch('/:id', auth, upload, changeAvatar)

export default router
