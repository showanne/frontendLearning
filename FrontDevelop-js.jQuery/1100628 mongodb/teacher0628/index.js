import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import userRoute from './routes/users.js'
import productRoute from './routes/products.js'

dotenv.config()

mongoose.connect(process.env.MONGODB)

const app = express()

app.use(bodyParser.json())

app.use('/users', userRoute)
app.use('/products', productRoute)

app.listen(process.env.PORT, () => {
  console.log('Server start')
})