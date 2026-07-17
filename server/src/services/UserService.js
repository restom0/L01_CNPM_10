import { BadRequestError } from '../errors/badRequest.error.js'
import { UserModel } from '../models/Users.js'
import { Types } from 'mongoose'

/**
 * Find a user by username and password after rejecting non-string input.
 *
 * @param {string} inputUserName - Username from login request.
 * @param {string} inputPassword - Password from login request.
 * @returns {Promise<object|null>} Matching user document or null.
 */
const login = async (inputUserName, inputPassword) => {
  // Reject non-string input (one guard per value, so each is individually
  // narrowed to a string) before it reaches the query — a crafted object like
  // {$ne: null} can't then inject Mongo operators (NoSQL injection).
  if (typeof inputUserName !== 'string') {
    throw new BadRequestError('Username must be a string')
  }
  if (typeof inputPassword !== 'string') {
    throw new BadRequestError('Password must be a string')
  }
  return await UserModel
    .findOne()
    .where('username')
    .equals(inputUserName)
    .where('password')
    .equals(inputPassword)
    .exec()
}

/**
 * Create a user account when username is unused.
 *
 * @param {string} username - Account username.
 * @param {string} password - Account password.
 * @param {string} mqttUsername - Adafruit IO username.
 * @param {string} aioKey - Adafruit IO key.
 * @returns {Promise<object>} Saved user document.
 */
const register = async (username, password, mqttUsername, aioKey) => {
  if (typeof username !== 'string') {
    throw new BadRequestError('Username must be a string')
  }
  if (typeof password !== 'string') {
    throw new BadRequestError('Password must be a string')
  }
  if (typeof mqttUsername !== 'string') {
    throw new BadRequestError('Mqtt username must be a string')
  }
  if (typeof aioKey !== 'string') {
    throw new BadRequestError('Key must be a string')
  }
  const existingUser = await UserModel
    .findOne()
    .where('username')
    .equals(username)
    .exec()
  if (existingUser) {
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

/**
 * Load a user document from an API token subject id.
 *
 * @param {string} id - User id encoded in JWT token.
 * @returns {Promise<object|null>} User document or null.
 */
const authorize = async (id) => {
  id = Types.ObjectId.createFromHexString(id)
  return await UserModel.findById(id).exec()
}
export const UserService = { login, register, authorize }
