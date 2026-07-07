import { describe, it, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { createApiKey } from './useApiKey.js'

const SECRET = process.env.JWT_SECRET || 'secret'

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
    expect(() => jwt.verify(token, 'wrong-secret')).toThrow()
  })
})
