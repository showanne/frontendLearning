import express from 'express'
import { createUser, getUsers, getUser, updateUser, delUser } from '../controllers/users.js'

const router = express.Router()

// /users 已經加在 index.js -- app.use('/users', usersRoute)
// 所以實際路徑是 /users/ ...
// 增
router.post('/', createUser)
// 查
router.get('/', getUsers)
// 查單個指定 ID
router.get('/:id', getUser)
// 改
router.patch('/:id', updateUser)
// 刪
router.delete('/:id', delUser)

export default router
