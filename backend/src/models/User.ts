import mongoose from 'mongoose'
import { chatSchema } from './Chat'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  chats: [chatSchema],
})

const User = mongoose.model('User', userSchema)

export default User
