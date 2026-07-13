import { BadRequestError } from '../errors/badRequest.error.js'
import { UserModel } from '../models/Users.js'
import { Types } from 'mongoose'

const login = async (inputUserName, inputPassword) => {
  // Reject non-string input so a crafted object like {$ne: null} can't reach the
  // query and inject Mongo operators (NoSQL injection). The typeof guard narrows
  // both values to strings before they are used in findOne.
  if (typeof inputUserName !== 'string' || typeof inputPassword !== 'string') {
    throw new BadRequestError('Username and password must be strings')
  }
  return await UserModel.findOne({ username: inputUserName, password: inputPassword }).exec()
}
const register = async (username, password, mqttUsername, aioKey) => {
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof mqttUsername !== 'string' ||
    typeof aioKey !== 'string'
  ) {
    throw new BadRequestError('All fields must be strings')
  }
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
