import { BadRequestError } from '../errors/badRequest.error.js'
import { UserModel } from '../models/Users.js'
import { Types } from 'mongoose'
const login = async (inputUserName, inputPassword) => {
  return await UserModel.findOne({ username: inputUserName, password: inputPassword }).exec()
}
const register = async (username, password, mqttUsername, aioKey) => {
  if (await UserModel.findOne({ username })) {
    throw new BadRequestError('Account existed')
  }
  const user = new UserModel({
    _id: new Types.ObjectId(),
    username,
    password,
    mqttusername: mqttUsername,
    AIO_Key: aioKey
  })
  return await user.save()
}
const authorize = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id).exec()
}
export const UserService = { login, register, authorize }
