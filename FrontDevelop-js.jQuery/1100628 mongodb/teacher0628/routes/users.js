import express from 'express'
import {
  createUser,
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  delOrder
} from '../controllers/users.js'

const router = express.Router()

router.post('/', createUser)
router.post('/:id/orders', createOrder)
router.get('/:id/orders', getOrders)
router.get('/orders/:id', getOrder)
router.patch('/orders/:id', updateOrder)
router.delete('/orders/:id', delOrder)

export default router
