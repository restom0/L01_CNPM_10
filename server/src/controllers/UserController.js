import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
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
      throw new BadRequestError('Password is empty')
    }
    const result = await UserService.login(username, password)
    if (CommonUtils.checkNullOrUndefined(result)) {
      throw new NotFoundError('Username or password is incorrect')
    }
    res.status(200).json({ api_token: createApiKey(result._id) })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const register = async (req, res, next) => {
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
export const UserController = { login, register }
