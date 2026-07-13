import { BadRequestError } from '../errors/badRequest.error.js'
import { UserModel } from '../models/Users.js'
import { Types } from 'mongoose'

const toSafeString = (value) => (typeof value === 'string' ? value : String(value ?? ''))

const login = async (inputUserName, inputPassword) => {
  const username = toSafeString(inputUserName)
  const password = toSafeString(inputPassword)
  return await UserModel.findOne({ username: { $eq: username }, password: { $eq: password } }).exec()
}
const register = async (username, password, mqttUsername, aioKey) => {
  const safeUsername = toSafeString(username)
  const safePassword = toSafeString(password)
  const safeMqttUsername = toSafeString(mqttUsername)
  const safeAioKey = toSafeString(aioKey)

  if (await UserModel.findOne({ username: { $eq: safeUsername } })) {
    throw new BadRequestError('Account existed')
  }
  const user = new UserModel({
    _id: new Types.ObjectId(),
    username: safeUsername,
    password: safePassword,
    mqttusername: safeMqttUsername,
    AIO_Key: safeAioKey
  })
  return await user.save()
}
const authorize = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id).exec()
}
export const UserService = { login, register, authorize }
