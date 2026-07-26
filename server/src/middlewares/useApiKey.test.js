import { describe, it, expect, vi, afterEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { UserService } from '../services/UserService.js'

const SECRET = `test-jwt-${Date.now()}`
process.env.JWT_SECRET = SECRET
const { createApiKey, requireApiKey } = await import('./useApiKey.js')
const wrongSecret = `wrong-${Date.now()}`

afterEach(() => {
  vi.restoreAllMocks()
})

function resMock () {
  const res = {
    status: vi.fn(() => res),
    send: vi.fn(() => res)
  }
  return res
}

describe('createApiKey (UT)', () => {
  it('produces a token that verifies with the signing secret and carries the payload', () => {
    const token = createApiKey('507f1f77bcf86cd799439011')
    const decoded = jwt.verify(token, SECRET)
    expect(decoded.data).toBe('507f1f77bcf86cd799439011')
  })

  it('sets an expiry roughly 8 hours in the future', () => {
    const before = Math.floor(Date.now() / 1000)
    const token = createApiKey('abc')
    const decoded = jwt.verify(token, SECRET)
    const eightHours = 8 * 60 * 60
    expect(decoded.exp).toBeGreaterThanOrEqual(before + eightHours - 5)
    expect(decoded.exp).toBeLessThanOrEqual(before + eightHours + 5)
  })

  it('fails verification against a wrong secret', () => {
    const token = createApiKey('abc')
    expect(() => jwt.verify(token, wrongSecret)).toThrow()
  })
})

describe('requireApiKey (UT)', () => {
  it('rejects missing token', async () => {
    const res = resMock()

    await requireApiKey({ cookies: {}, headers: {} }, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith({ message: 'You need to login' })
  })

  it('rejects invalid token', async () => {
    const res = resMock()

    await requireApiKey({ cookies: {}, headers: { authorization: 'Bearer nope' } }, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid access' })
  })

  it('rejects token for missing user', async () => {
    vi.spyOn(UserService, 'authorize').mockResolvedValue(null)
    const res = resMock()
    const token = createApiKey('507f1f77bcf86cd799439011')

    await requireApiKey({ cookies: { token }, headers: {} }, res, vi.fn())

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid access' })
  })

  it('loads user from cookie token and calls next', async () => {
    const id = '507f1f77bcf86cd799439011'
    vi.spyOn(UserService, 'authorize').mockResolvedValue({
      mqttusername: 'mqtt-user',
      AIO_Key: 'aio-key'
    })
    const req = { cookies: { token: createApiKey(id) }, headers: {} }
    const next = vi.fn()

    await requireApiKey(req, resMock(), next)

    expect(req.user).toEqual({
      id: Types.ObjectId.createFromHexString(id),
      mqtt: 'mqtt-user',
      key: 'aio-key'
    })
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('loads user from bearer token when cookie is absent', async () => {
    const id = '507f1f77bcf86cd799439011'
    vi.spyOn(UserService, 'authorize').mockResolvedValue({
      mqttusername: 'mqtt-user',
      AIO_Key: 'aio-key'
    })
    const req = { cookies: {}, headers: { authorization: `Bearer ${createApiKey(id)}` } }
    const next = vi.fn()

    await requireApiKey(req, resMock(), next)

    expect(req.user.mqtt).toBe('mqtt-user')
    expect(next).toHaveBeenCalledTimes(1)
  })
})
