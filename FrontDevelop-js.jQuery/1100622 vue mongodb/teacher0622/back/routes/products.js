import express from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  delProduct
} from '../controllers/products.js'

const router = express.Router()

router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProduct)
router.patch('/:id', updateProduct)
router.delete('/:id', delProduct)

export default router
