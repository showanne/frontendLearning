import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import userRoute from './routes/users.js'
import productRoute from './routes/products.js'

dotenv.config()

// 解決 mongoose 警示訊息
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)

const app = express()

app.use(bodyParser.json())

app.use('/users', userRoute)
app.use('/products', productRoute)

app.listen(process.env.PORT, () => {
  console.log('Server start ' + process.env.PORT)
})