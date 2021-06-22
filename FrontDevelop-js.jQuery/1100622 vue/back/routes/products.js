import express from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  delProduct
} from '../controllers/products.js'

const router = express.Router()

// 增
router.post('/', createProduct)
// 查
router.get('/', getProducts)
// 查單個使用者id
router.get('/:id', getProduct)
// 改
router.patch('/:id', updateProduct)
// 刪
router.delete('/:id', delProduct)

export default router
