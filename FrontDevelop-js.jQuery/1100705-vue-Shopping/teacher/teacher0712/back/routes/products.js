import express from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

import {
  newProduct,
  getProduct,
  editProduct,
  getAllProduct,
  getProductById
} from '../controllers/products.js'

const router = express.Router()

router.post('/', auth, upload, newProduct)
router.get('/', getProduct)
router.get('/all', auth, getAllProduct)
router.get('/:id', getProductById)
router.patch('/:id', auth, upload, editProduct)

export default router
