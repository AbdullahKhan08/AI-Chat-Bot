import mongoose from 'mongoose'
import User from '../models/User'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import zod from 'zod'
import { createToken } from '../utils/token-manager'
import { COOKIE_NAME } from '../utils/constants'

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({})
    return res.status(200).json({ messgae: 'OK', users })
  } catch (error: any) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'Internal server Error', error: error.message })
  }
}

const signupBody = zod.object({
  name: zod.string(),
  email: zod.string().email().trim(),
  password: zod.string().trim().min(8).max(32),
})

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const success = signupBody.safeParse(req.body)

    if (!success) {
      return res.status(400).json({ message: 'Invalid / incorrect inputs' })
    }

    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = bcrypt.hash(req.body.password, 10)

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })

    await user.save()
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      signed: true,
      domain: 'localhost',
      path: '/',
    })
    const token = createToken(user._id.toString(), req.body.email, '7d')
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    res.cookie(COOKIE_NAME, token, {
      path: '/',
      domain: 'localhost',
      expires,
      httpOnly: true,
      signed: true,
    })

    return res.status(201).json({ messgae: 'OK', id: user._id.toString() })
  } catch (error: any) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'Internal server Error', error: error.message })
  }
}

const loginBody = zod.object({
  email: zod.string().email().trim(),
  password: zod.string().trim().min(8).max(32),
})

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const success = loginBody.safeParse(req.body)

    if (!success) {
      return res.status(400).json({ message: 'Invalid / incorrect inputs' })
    }

    const existingUser = await User.findOne({ email: req.body.email })

    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exists' })
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      req.body.password
    )

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: 'incorrect password' })
    }

    const userId = existingUser._id.toString()
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      signed: true,
      domain: 'localhost',
      path: '/',
    })
    const token = createToken(userId, req.body.email, '7d')
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    res.cookie(COOKIE_NAME, token, {
      path: '/',
      domain: 'localhost',
      expires,
      httpOnly: true,
      signed: true,
    })

    return res
      .status(200)
      .json({ messgae: 'OK', id: existingUser._id.toString() })
  } catch (error: any) {
    console.log(error)
    return res
      .status(500)
      .json({ message: 'Internal server Error', error: error.message })
  }
}
