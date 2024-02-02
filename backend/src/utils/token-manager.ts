import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const createToken = async (
  id: string,
  email: string,
  expiresIn: string
) => {
  const payload = { id, email }

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn,
  })

  return token
}
