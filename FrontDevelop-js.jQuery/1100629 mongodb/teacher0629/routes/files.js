import express from 'express'
import { getFile } from '../controller/files.js'

const router = express.Router()

router.get('/:file', getFile)

export default router
