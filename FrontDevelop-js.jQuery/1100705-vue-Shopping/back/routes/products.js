import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  newProduct,
  getProduct,
  editProduct
} from '../controllers/products.js'

const router = express.Router()

// 新增商品，要驗證有沒有權限
router.post('/', auth, upload, newProduct)
// 檢視商品
router.get('/', getProduct)
// 編輯商品
router.patch('/:id', auth, upload, editProduct)

export default router
