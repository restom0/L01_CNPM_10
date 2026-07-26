import { describe, expect, it } from 'vitest'
import { BadRequestError } from './badRequest.error.js'
import { BaseError } from './base.error.js'
import { ForbiddenRequestError } from './forbiddenRequest.error.js'
import { NotFoundError } from './notFound.error.js'
import { UnAuthorizedError } from './unauthorizedRequest.error.js'

describe('HTTP errors (UT)', () => {
  it.each([
    [BadRequestError, 400],
    [ForbiddenRequestError, 403],
    [NotFoundError, 404],
    [UnAuthorizedError, 401]
  ])('sets statusCode for %s', (ErrorClass, statusCode) => {
    const error = new ErrorClass('boom')

    expect(error).toBeInstanceOf(BaseError)
    expect(error.message).toBe('boom')
    expect(error.statusCode).toBe(statusCode)
  })
})
