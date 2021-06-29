import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import userRoute from './routes/users.js'
import fileRoute from './routes/files.js'

dotenv.config()

// 解決 mongoose 警示訊息
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express()

app.use(bodyParser.json())

app.use('/users', userRoute)
app.use('/files', fileRoute)


app.listen(process.env.PORT, () => {
  console.log('start ' + process.env.PORT)
})
