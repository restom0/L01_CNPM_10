import { BadRequestError } from '../errors/badRequest.error.js'
import { createApiKey } from '../middlewares/useApiKey.js'
import { UserService } from '../services/UserService.js'
import { CommonUtils } from '../utils/common.js'

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (CommonUtils.checkNullOrUndefined(username)) {
      throw new BadRequestError('Username is empty')
    }
    if (CommonUtils.checkNullOrUndefined(password)) {
      throw new Error('Password is empty')
    }
    const result = await UserService.login(username, password)
    console.log(result)
    if (CommonUtils.checkNullOrUndefined(result)) {
      throw new Error('Username or password is incorrect')
    }
    res.status(200).json({ api_token: createApiKey(result._id) })
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
    next()
  }
}
const register = async (req, res, next) => {}
export const UserController = { login, register }
