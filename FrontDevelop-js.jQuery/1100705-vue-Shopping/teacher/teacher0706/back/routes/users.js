import express from 'express'
import auth from '../middleware/auth.js'
import {
  register,
  login,
  logout
} from '../controllers/users.js'

const router = express.Router()

router.post('/', register)
router.post('/login', login)
router.delete('/logout', auth, logout)

export default router
