import express from 'express'
import { getFile } from '../controllers/files.js'

const router = express.Router()

// 取得上傳的圖片
router.get('/:file', getFile)

export default router
