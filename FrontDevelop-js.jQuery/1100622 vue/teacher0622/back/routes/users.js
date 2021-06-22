import express from 'express'
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  delUser
} from '../controllers/users.js'

const router = express.Router()

router.post('/', createUser)
router.get('/', getUsers)
router.get('/:id', getUser)
router.patch('/:id', updateUser)
router.delete('/:id', delUser)

export default router
