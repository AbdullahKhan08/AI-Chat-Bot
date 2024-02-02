import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { connectDb } from './db/connect'
import morgan from 'morgan'
import appRouter from './routes/index'
import userRouter from './routes/user'
import chatRouter from './routes/chats'
import cookieParser from 'cookie-parser'

app.use(cors())
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

//remove in production
app.use(morgan('dev'))
app.use('/api/v1', appRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/chats', chatRouter)

const PORT = process.env.PORT || 4000

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI as string)
    app.listen(PORT, () => {
      console.log('Server started on Port ' + PORT)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
