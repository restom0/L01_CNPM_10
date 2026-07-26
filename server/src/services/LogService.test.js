import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { Types } from 'mongoose'
import { LogModel } from '../models/Logs.js'
import { LogService } from './LogService.js'
import { clearTestDb, closeTestDb, connectTestDb } from '../../test/db.js'

beforeAll(connectTestDb)
afterEach(async () => {
  vi.restoreAllMocks()
  await clearTestDb()
})
afterAll(closeTestDb)

describe('LogService.getDataOnDate (IT)', () => {
  it('returns only logs on requested UTC day for user', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const userID = new Types.ObjectId()
    const otherUserID = new Types.ObjectId()
    await LogModel.create([
      { _id: new Types.ObjectId(), userID, activity: 'inside', Date: new Date('2026-01-02T12:00:00Z') },
      { _id: new Types.ObjectId(), userID, activity: 'outside', Date: new Date('2026-01-03T00:00:00Z') },
      { _id: new Types.ObjectId(), userID: otherUserID, activity: 'other', Date: new Date('2026-01-02T12:00:00Z') }
    ])

    const result = await LogService.getDataOnDate('2026-01-02', userID)

    expect(result).toHaveLength(1)
    expect(result[0].activity).toBe('inside')
    expect(log).toHaveBeenCalled()
  })
})
