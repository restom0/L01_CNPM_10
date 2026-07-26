import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { Types } from 'mongoose'
import { WaterPumpTimerModel } from '../models/WaterPumpTimers.js'
import { WaterPumpService } from './WaterPumpService.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { clearTestDb, closeTestDb, connectTestDb } from '../../test/db.js'
import { createSensor, createTimer, createUser, mockAdafruitGet } from '../../test/factories.js'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

beforeAll(connectTestDb)
afterEach(async () => {
  vi.clearAllMocks()
  await clearTestDb()
})
afterAll(closeTestDb)

async function createReadyUser () {
  const user = await createUser()
  await createSensor(user._id)
  return user
}

describe('WaterPumpService timers (IT)', () => {
  it('lists timers for a user', async () => {
    const user = await createReadyUser()
    const timer = await createTimer(user._id)

    const result = await WaterPumpService.automaticWatering(user._id)

    expect(result).toEqual([{ id: timer._id, startTime: '05:00', endTime: '05:10' }])
  })

  it('rejects listing timers when pump sensor is missing', async () => {
    await expect(WaterPumpService.automaticWatering(new Types.ObjectId())).rejects.toThrow('Water Pump not found')
  })

  it('creates, updates, and deletes a timer', async () => {
    const user = await createReadyUser()

    await WaterPumpService.createTimer(user._id, '06:00', '06:10')
    const [created] = await WaterPumpTimerModel.find({ userID: user._id })
    await WaterPumpService.updateTimer(created._id.toHexString(), '07:00', '07:15')
    await expect(WaterPumpTimerModel.findById(created._id).lean()).resolves.toMatchObject({
      startTime: '07:00',
      endTime: '07:15'
    })
    await WaterPumpService.deleteTimer(created._id.toHexString())

    expect(await WaterPumpTimerModel.countDocuments({ userID: user._id })).toBe(0)
  })

  it('rejects timer mutations when target documents are missing', async () => {
    const missingId = new Types.ObjectId().toHexString()

    await expect(WaterPumpService.createTimer(new Types.ObjectId(), '06:00', '06:10')).rejects.toThrow('User not found')
    await expect(WaterPumpService.updateTimer(missingId, '06:00', '06:10')).rejects.toThrow('Timer not found')
    await expect(WaterPumpService.deleteTimer(missingId)).rejects.toThrow('Timer not found')
  })
})

describe('WaterPumpService manual pump API (IT)', () => {
  it('turns pump on and off through Adafruit IO', async () => {
    const user = await createReadyUser()
    axios.post.mockResolvedValue({ data: {} })

    await WaterPumpService.turnOnPump('aio-key', 'mqtt-user', user._id)
    await WaterPumpService.turnOffPump('aio-key', 'mqtt-user', user._id)

    expect(axios.post).toHaveBeenNthCalledWith(
      1,
      'https://io.adafruit.com/api/v2/mqtt-user/feeds/pump-feed/data',
      { value: 'ON' },
      { headers: { 'X-AIO-Key': 'aio-key' } }
    )
    expect(axios.post).toHaveBeenNthCalledWith(
      2,
      'https://io.adafruit.com/api/v2/mqtt-user/feeds/pump-feed/data',
      { value: 'OFF' },
      { headers: { 'X-AIO-Key': 'aio-key' } }
    )
  })

  it('reads latest pump state', async () => {
    const user = await createReadyUser()
    mockAdafruitGet(axios, 'ON')

    await expect(WaterPumpService.getLastWaterPumpValue('mqtt-user', user._id)).resolves.toEqual({
      value: 'ON',
      created_at: '2026-01-02T03:04:05Z'
    })
  })

  it.each([
    ['turnOnPump', ['aio-key', 'mqtt-user', new Types.ObjectId()], 'Water Pump not found'],
    ['turnOffPump', ['aio-key', 'mqtt-user', new Types.ObjectId()], 'Water Pump sensor not found'],
    ['getLastWaterPumpValue', ['mqtt-user', new Types.ObjectId()], 'Light sensor not found']
  ])('%s rejects missing pump sensor', async (method, args, message) => {
    await expect(WaterPumpService[method](...args)).rejects.toBeInstanceOf(NotFoundError)
    await expect(WaterPumpService[method](...args)).rejects.toThrow(message)
  })
})
