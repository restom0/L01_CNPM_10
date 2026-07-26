import { afterEach, describe, expect, it, vi } from 'vitest'
import { logRequestMethod } from './logRequestMethod.js'
import { logRequestTime } from './logRequestTime.js'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('logging middleware (UT)', () => {
  it('logs teacher route method and calls next', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const next = vi.fn()

    logRequestMethod({ method: 'GET', path: '/teachers/1' }, {}, next)

    expect(log).toHaveBeenCalledWith('Teacher route request method: GET')
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('skips non-teacher method log and calls next', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const next = vi.fn()

    logRequestMethod({ method: 'POST', path: '/sensors' }, {}, next)

    expect(log).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('logs request time and calls next', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const next = vi.fn()

    logRequestTime({}, {}, next)

    expect(log.mock.calls[0][0]).toMatch(/^Request received at:/)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
