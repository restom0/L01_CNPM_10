import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { Types } from 'mongoose'
import { EnvironmentalDrynessModel } from '../models/EnvironmentalDryness.js'
import { SensorModel } from '../models/Sensors.js'
import { SensorService } from './SensorService.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { clearTestDb, closeTestDb, connectTestDb } from '../../test/db.js'
import {
  createSensor,
  createSensorReadings,
  createUser,
  mockAdafruitGet
} from '../../test/factories.js'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

beforeAll(connectTestDb)
afterEach(async () => {
  vi.useRealTimers()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  await clearTestDb()
})
afterAll(closeTestDb)

async function createReadyUser (sensorOverrides = {}) {
  const user = await createUser()
  await createSensor(user._id, sensorOverrides)
  await createSensorReadings(user._id)
  return user
}

describe('SensorService history getters (IT)', () => {
  it('loads all persisted series for one user', async () => {
    const user = await createReadyUser()

    await expect(SensorService.getAllHumidityValue(user._id)).resolves.toHaveLength(1)
    await expect(SensorService.getAllLightValue(user._id)).resolves.toHaveLength(1)
    await expect(SensorService.getAllMoistureValue(user._id)).resolves.toHaveLength(1)
    await expect(SensorService.getAllTemperatureValue(user._id)).resolves.toHaveLength(1)
    await expect(SensorService.getAllEnvironmentValue(user._id)).resolves.toHaveLength(1)
  })
})

describe('SensorService latest feed getters (IT)', () => {
  it.each([
    ['getLastHumidityValue', '60', 'Humidity sensor not found'],
    ['getLastLightValue', '5000', 'Light sensor not found'],
    ['getLastTemperatureValue', '28', 'Temperature sensor not found'],
    ['getLastMoistureValue', '45', 'Moisture sensor not found']
  ])('%s reads latest external feed and rejects missing sensor', async (method, value, message) => {
    const user = await createReadyUser()
    mockAdafruitGet(axios)

    await expect(SensorService[method]('mqtt-user', user._id)).resolves.toEqual({
      value,
      created_at: '2026-01-02T03:04:05Z'
    })
    await SensorModel.deleteMany({})
    await expect(SensorService[method]('mqtt-user', user._id)).rejects.toThrow(message)
  })
})

describe('SensorService thresholds (IT)', () => {
  it('gets threshold bounds for each sensor', async () => {
    const user = await createReadyUser()

    await expect(SensorService.getLightThreshold(user._id)).resolves.toEqual({ upper: 8000, lower: 1000 })
    await expect(SensorService.getTemperatureThreshold(user._id)).resolves.toEqual({ upper: 35, lower: 15 })
    await expect(SensorService.getHumidityThreshold(user._id)).resolves.toEqual({ upper: 80, lower: 30 })
    await expect(SensorService.getMoistureThreshold(user._id)).resolves.toEqual({ upper: 70, lower: 25 })
  })

  it.each([
    ['getLightThreshold', 'Light sensor not found'],
    ['getTemperatureThreshold', 'Temperature sensor not found'],
    ['getHumidityThreshold', 'Humidity sensor not found'],
    ['getMoistureThreshold', 'Moisture sensor not found']
  ])('%s rejects missing sensor', async (method, message) => {
    await expect(SensorService[method](new Types.ObjectId())).rejects.toThrow(message)
  })

  it.each([
    ['updateLightThreshold', { upperLightThreshold: 9000, lowerLightThreshold: 2000 }],
    ['updateTemperatureThreshold', { upperTemperatureThreshold: 30, lowerTemperatureThreshold: 10 }],
    ['updateHumidityThreshold', { upperHumidityThreshold: 75, lowerHumidityThreshold: 35 }],
    ['updateMoistureThreshold', { upperMoistureThreshold: 65, lowerMoistureThreshold: 20 }]
  ])('%s updates thresholds and recalculates environment bounds', async (method, expected) => {
    const user = await createReadyUser()

    await SensorService[method](user._id, Object.values(expected)[0], Object.values(expected)[1])

    const sensor = await SensorModel.findOne({ userID: user._id }).lean()
    expect(sensor).toMatchObject(expected)
    expect(sensor.upperEnvironmentDrynessThreshold).toBeTypeOf('number')
    expect(sensor.lowerEnvironmentDrynessThreshold).toBeTypeOf('number')
  })

  it.each([
    ['updateLightThreshold', 'Light sensor not found'],
    ['updateTemperatureThreshold', 'Temperature sensor not found'],
    ['updateHumidityThreshold', 'Humidity sensor not found'],
    ['updateMoistureThreshold', 'Moisture sensor not found']
  ])('%s rejects missing sensor before recalculation', async (method, message) => {
    await expect(SensorService[method](new Types.ObjectId(), 10, 1)).rejects.toThrow(message)
  })

  it('rejects when sensor disappears during environment recalculation', async () => {
    const user = await createReadyUser()
    const originalFindOneAndUpdate = SensorModel.findOneAndUpdate.bind(SensorModel)
    let calls = 0
    vi.spyOn(SensorModel, 'findOneAndUpdate').mockImplementation((...args) => {
      calls += 1
      if (calls === 2) return Promise.resolve(null)
      return originalFindOneAndUpdate(...args)
    })

    await expect(SensorService.updateLightThreshold(user._id, 9000, 2000)).rejects.toThrow('Sensor not found')
  })
})

describe('SensorService.getLastEnvironmentValue (IT)', () => {
  it('saves estimated dryness and turns pump on then schedules off when too dry', async () => {
    vi.useFakeTimers()
    const user = await createReadyUser({ upperEnvironmentDrynessThreshold: 40, lowerEnvironmentDrynessThreshold: -999 })
    mockAdafruitGet(axios, 'OFF')
    axios.post.mockResolvedValue({ data: {} })

    const resultPromise = SensorService.getLastEnvironmentValue('aio-key', 'mqtt-user', user._id)
    const result = await resultPromise
    await vi.advanceTimersByTimeAsync(900000)

    expect(result.data).toBeCloseTo(43.25)
    expect(await EnvironmentalDrynessModel.countDocuments({ userID: user._id })).toBe(2)
    expect(axios.post).toHaveBeenCalledWith(
      'https://io.adafruit.com/api/v2/mqtt-user/feeds/pump-feed/data',
      { value: 'ON' },
      { headers: { 'X-AIO-Key': 'aio-key' } }
    )
    expect(axios.post).toHaveBeenCalledWith(
      'https://io.adafruit.com/api/v2/mqtt-user/feeds/pump-feed/data',
      { value: 'OFF' },
      { headers: { 'X-AIO-Key': 'aio-key' } }
    )
  })

  it('turns pump off when estimated dryness is below lower threshold', async () => {
    const user = await createReadyUser({ upperEnvironmentDrynessThreshold: 999, lowerEnvironmentDrynessThreshold: 50 })
    mockAdafruitGet(axios, 'ON')
    axios.post.mockResolvedValue({ data: {} })

    await SensorService.getLastEnvironmentValue('aio-key', 'mqtt-user', user._id)

    expect(axios.post).toHaveBeenCalledWith(
      'https://io.adafruit.com/api/v2/mqtt-user/feeds/pump-feed/data',
      { value: 'OFF' },
      { headers: { 'X-AIO-Key': 'aio-key' } }
    )
  })

  it('leaves pump on when too dry but pump is already running', async () => {
    const user = await createReadyUser({ upperEnvironmentDrynessThreshold: 40, lowerEnvironmentDrynessThreshold: -999 })
    mockAdafruitGet(axios, 'ON')
    axios.post.mockResolvedValue({ data: {} })

    await SensorService.getLastEnvironmentValue('aio-key', 'mqtt-user', user._id)

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('leaves pump off when wet enough and pump is already stopped', async () => {
    const user = await createReadyUser({ upperEnvironmentDrynessThreshold: 999, lowerEnvironmentDrynessThreshold: 50 })
    mockAdafruitGet(axios, 'OFF')
    axios.post.mockResolvedValue({ data: {} })

    await SensorService.getLastEnvironmentValue('aio-key', 'mqtt-user', user._id)

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('rejects missing environment sensor', async () => {
    await expect(
      SensorService.getLastEnvironmentValue('aio-key', 'mqtt-user', new Types.ObjectId())
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
