import express from 'express'
import auth from '../middleware/auth.js'
import {
  register,
  login,
  logout,
  addCart,
  getCart,
  editCart,
  checkout,
  getorders,
  getallorders,
  extend,
  getuserinfo
} from '../controllers/users.js'

const router = express.Router()

router.post('/', register)
router.get('/', auth, getuserinfo)
router.post('/login', login)
router.delete('/logout', auth, logout)
router.post('/cart', auth, addCart)
router.get('/cart', auth, getCart)
router.patch('/cart', auth, editCart)
router.post('/checkout', auth, checkout)
router.get('/orders', auth, getorders)
router.get('/orders/all', auth, getallorders)
router.post('/extend', auth, extend)

export default router
