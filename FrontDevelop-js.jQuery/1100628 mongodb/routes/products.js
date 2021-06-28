import express from 'express'
import {
  createProduct
} from '../controllers/products.js'

const router = express.Router()

router.post('/', createProduct)

export default router
