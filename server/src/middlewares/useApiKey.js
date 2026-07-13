import { Types } from 'mongoose'
import { UserService } from '../services/UserService.js'
import { CommonUtils } from '../utils/common.js'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { NotFoundError } from '../errors/notFound.error.js'
import { ForbiddenRequestError } from '../errors/forbiddenRequest.error.js'
import { UnAuthorizedError } from '../errors/unauthorizedRequest.error.js'

const JWT_SECRET = process.env.JWT_SECRET ?? randomBytes(32).toString('hex')

export const createApiKey = (data) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
      data
    },
    JWT_SECRET
  )
  return token
}
export const requireApiKey = async (req, res, next) => {
  try {
    // Prefer the httpOnly cookie; fall back to the Authorization header for
    // API clients / tests that still send a Bearer token.
    const apiKey =
      req.cookies?.token ??
      (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null)
    if (CommonUtils.checkNullOrUndefined(apiKey)) {
      throw new UnAuthorizedError('You need to login')
    }
    jwt.verify(apiKey, JWT_SECRET, async (err, decoded) => {
      if (err || !decoded) {
        const exception = new ForbiddenRequestError('Invalid access')
        res.status(exception.statusCode).send({ message: exception.message })
      } else {
        const result = await UserService.authorize(decoded.data)
        if (CommonUtils.checkNullOrUndefined(result)) {
          const exception = new NotFoundError('Invalid access')
          res.status(exception.statusCode).send({ message: exception.message })
          return
        }
        req.user = {
          id: Types.ObjectId.createFromHexString(decoded.data),
          mqtt: result.mqttusername,
          key: result.AIO_Key
        }
        next()
      }
    })
  } catch (error) {
    res.status(error.statusCode).send({ message: error.message })
  }
}
