import { describe, it, expect } from 'vitest'
import { CommonUtils } from './common.js'

describe('CommonUtils.checkNullOrUndefined (UT)', () => {
  it('is true when any argument is null', () => {
    expect(CommonUtils.checkNullOrUndefined(null)).toBe(true)
    expect(CommonUtils.checkNullOrUndefined('a', null, 'b')).toBe(true)
  })

  it('is true when any argument is undefined', () => {
    expect(CommonUtils.checkNullOrUndefined(undefined)).toBe(true)
    expect(CommonUtils.checkNullOrUndefined('a', undefined)).toBe(true)
  })

  it('is false for falsy-but-defined values (0 and empty string)', () => {
    // Guards against a naive `!arg` check that would wrongly reject 0 / "".
    expect(CommonUtils.checkNullOrUndefined(0)).toBe(false)
    expect(CommonUtils.checkNullOrUndefined('')).toBe(false)
    expect(CommonUtils.checkNullOrUndefined(false)).toBe(false)
  })

  it('is false when all arguments are defined', () => {
    expect(CommonUtils.checkNullOrUndefined('a', 1, {})).toBe(false)
  })
})

describe('CommonUtils.compareThreshold(value, upper, lower) (UT)', () => {
  it('is false when value is inside [lower, upper]', () => {
    expect(CommonUtils.compareThreshold(5, 10, 0)).toBe(false)
  })

  it('is false on the inclusive boundaries', () => {
    expect(CommonUtils.compareThreshold(10, 10, 0)).toBe(false)
    expect(CommonUtils.compareThreshold(0, 10, 0)).toBe(false)
  })

  it('is true when value is above upper', () => {
    expect(CommonUtils.compareThreshold(11, 10, 0)).toBe(true)
  })

  it('is true when value is below lower', () => {
    expect(CommonUtils.compareThreshold(-1, 10, 0)).toBe(true)
  })
})
