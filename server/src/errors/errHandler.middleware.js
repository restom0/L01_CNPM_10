import { ResponseDTO } from '../dto/response.dto.js'
import { CommonUtils } from '../utils/common.util.js'
import { BaseError } from './base.error.js'

export const errorHandler = (err, _, res, __) => {
  const status = !CommonUtils.checkNullOrUndefined(err) && err instanceof BaseError ? err.statusCode : 500
  const errMsg = status >= 500 ? 'Server causing some error' : err.message
  return res.status(status).json(new ResponseDTO(null, errMsg))
}
