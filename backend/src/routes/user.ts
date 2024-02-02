import express from 'express'
import {
  getAllUsers,
  userLogin,
  userSignup,
} from '../controllers/user-controller'
import {
  loginValidators,
  signupValidators,
  validate,
} from '../utils/validators'

const router = express.Router()

router.get('/', getAllUsers)

router.post('signup', validate(signupValidators), userSignup)
router.post('signup', validate(loginValidators), userLogin)

export default router
