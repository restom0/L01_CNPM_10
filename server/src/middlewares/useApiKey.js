import { Types } from 'mongoose'
import { UserService } from '../services/UserService.js'
import { CommonUtils } from '../utils/common.js'
import jwt from 'jsonwebtoken'
import { NotFoundError } from '../errors/notFound.error.js'
import { ForbiddenRequestError } from '../errors/forbiddenRequest.error.js'
import { UnAuthorizedError } from '../errors/unauthorizedRequest.error.js'

export const createApiKey = (data) => {
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
      data
    },
    'secret'
  )
  return token
}
export const requireApiKey = async (req, res, next) => {
  try {
    if (CommonUtils.checkNullOrUndefined(req.headers.authorization)) {
      throw new UnAuthorizedError('You need to login')
    }
    const apiKey = req.headers.authorization.split(' ')[1]
    jwt.verify(apiKey, 'secret', async (err, decoded) => {
      if (err || !decoded) {
        const exception = new ForbiddenRequestError('Invalid access')
        res.status(exception.statusCode).send({ message: exception.message })
      } else {
        const result = await UserService.authorize(decoded.data)
        if (CommonUtils.checkNullOrUndefined(result)) {
          const exception = new NotFoundError('Invalid access')
          res.status(exception.statusCode).send({ message: exception.message })
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
