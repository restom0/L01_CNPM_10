import { BadRequestError } from '../errors/badRequest.error.js'
import { UserModel } from '../models/Users.js'
import { Types } from 'mongoose'
const login = async (inputUserName, inputPassword) => {
  return await UserModel.findOne({ username: inputUserName, password: inputPassword }).exec()
}
const register = (username, password, mqttUsername, aioKey) => {
  if (UserModel.findOne({ username })) {
    throw new BadRequestError('Account existed')
  }
  UserModel.create()
}
const authorize = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id).exec()
}
export const UserService = { login, register, authorize }
