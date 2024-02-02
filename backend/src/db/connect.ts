import mongoose from 'mongoose'

export const connectDb = async (url: string) => {
  try {
    return mongoose.connect(url)
  } catch (error) {
    console.log(error)

    throw new Error('Error connecting to database')
  }
}

export const disconnectDb = async () => {
  try {
    return mongoose.disconnect()
  } catch (error) {
    console.log(error)
    throw new Error('Error disconnecting from database')
  }
}
