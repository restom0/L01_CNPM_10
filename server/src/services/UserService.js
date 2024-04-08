import { UserModel } from '../models/Users.js'
import { Types } from 'mongoose'
const login = async (inputUserName, inputPassword) => {
  return await UserModel.findOne({ username: inputUserName, password: inputPassword }).exec()
}
const register = async (req, res, next) => {}
const authorize = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id).exec()
}
export const UserService = { login, register, authorize }
