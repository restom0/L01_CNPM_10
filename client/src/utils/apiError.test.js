import { describe, expect, it } from 'vitest'
import { getApiErrorMessage, getTranslatedApiErrorMessage, isUnauthorized } from './apiError.js'

describe('apiError helpers (UT)', () => {
  it.each([
    [{ response: { status: 401 } }, true],
    [{ response: { status: 403 } }, true],
    [{ response: { status: 500 } }, false],
    [{}, false]
  ])('detects unauthorized errors', (error, expected) => {
    expect(isUnauthorized(error)).toBe(expected)
  })

  it.each([
    [{ response: { data: { message: 'message text' } }, message: 'fallback' }, 'message text'],
    [{ response: { data: { error: 'error text' } }, message: 'fallback' }, 'error text'],
    [{ message: 'plain error' }, 'plain error']
  ])('extracts best API error message', (error, expected) => {
    expect(getApiErrorMessage(error)).toBe(expected)
  })

  it('prefixes translated error label', () => {
    const t = (key) => (key === 'common.error' ? 'Error' : key)

    expect(getTranslatedApiErrorMessage(t, { message: 'boom' })).toBe('Error: boom')
  })
})
