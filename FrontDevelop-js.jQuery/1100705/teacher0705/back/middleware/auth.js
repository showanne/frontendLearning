import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : ''
    if (token.length > 0) {
      const decoded = jwt.verify(token, process.env.SECRET)
      const _id = decoded._id
      req.user = await users.findOne({ _id, tokens: token })
      req.token = token
      if (req.user !== null) {
        next()
      } else {
        throw new Error()
      }
    } else {
      throw new Error()
    }
  } catch (error) {
    res.status(401).send({ success: false, message: '驗證錯誤' })
  }
}
