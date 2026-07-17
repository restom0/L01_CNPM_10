import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { createApiKey } from '../middlewares/useApiKey.js'
import { UserService } from '../services/UserService.js'
import { CommonUtils } from '../utils/common.js'

/**
 * Handle POST /login, authenticate credentials, and issue API token cookie.
 *
 * @param {import('express').Request} req - Request with username and password.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (CommonUtils.checkNullOrUndefined(username)) {
      throw new BadRequestError('Username is empty')
    }
    if (CommonUtils.checkNullOrUndefined(password)) {
      throw new BadRequestError('Password is empty')
    }
    const result = await UserService.login(username, password)
    if (CommonUtils.checkNullOrUndefined(result)) {
      throw new NotFoundError('Username or password is incorrect')
    }
    const token = createApiKey(result._id)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000
    })
    res.status(200).json({ api_token: token })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle POST /logout and clear API token cookie.
 *
 * @param {import('express').Request} req - Express request.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const logout = async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ data: 'Logged out' })
}

/**
 * Handle POST /register and create a new user account.
 *
 * @param {import('express').Request} req - Request with account and Adafruit IO details.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
  try {
    const { username, password, mqttUsername, aioKey } = req.body
    if (CommonUtils.checkNullOrUndefined(username)) {
      throw new BadRequestError('Username is empty')
    } else if (CommonUtils.checkNullOrUndefined(password)) {
      throw new BadRequestError('Password is empty')
    } else if (CommonUtils.checkNullOrUndefined(mqttUsername)) {
      throw new BadRequestError('Mqtt is empty')
    } else if (CommonUtils.checkNullOrUndefined(aioKey)) {
      throw new BadRequestError('Key is empty')
    }
    await UserService.register(username, password, mqttUsername, aioKey)
    res.status(200).json({ data: 'Register successfully' })
  } catch (error) {
    console.log(error)
    res.status(error.statusCode).json({ error: error.message })
  }
}
export const UserController = { login, register, logout }
