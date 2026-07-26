import { Types } from 'mongoose'
import { EnvironmentalDrynessModel } from '../src/models/EnvironmentalDryness.js'
import { HumidityModel } from '../src/models/HumiditySensors.js'
import { LightModel } from '../src/models/LightSensors.js'
import { LogModel } from '../src/models/Logs.js'
import { MoistureModel } from '../src/models/MoistureSensors.js'
import { SensorModel } from '../src/models/Sensors.js'
import { TemperatureModel } from '../src/models/TemperatureSensors.js'
import { UserModel } from '../src/models/Users.js'
import { WaterPumpTimerModel } from '../src/models/WaterPumpTimers.js'

export const sensorSeed = {
  upperLightThreshold: 8000,
  lowerLightThreshold: 1000,
  upperHumidityThreshold: 80,
  lowerHumidityThreshold: 30,
  upperMoistureThreshold: 70,
  lowerMoistureThreshold: 25,
  upperTemperatureThreshold: 35,
  lowerTemperatureThreshold: 15,
  lowerEnvironmentDrynessThreshold: -60,
  upperEnvironmentDrynessThreshold: 50,
  lightFeedName: 'light-feed',
  humidityFeedName: 'humidity-feed',
  moistureFeedName: 'moisture-feed',
  temperatureFeedName: 'temperature-feed',
  waterPumpFeedName: 'pump-feed'
}

const createTestCredential = () => `test-${new Types.ObjectId().toHexString()}`

export async function createUser (overrides = {}) {
  return await UserModel.create({
    _id: overrides._id ?? new Types.ObjectId(),
    username: overrides.username ?? 'test-user',
    password: overrides.password ?? createTestCredential(),
    mqttusername: overrides.mqttusername ?? 'mqtt-user',
    AIO_Key: overrides.AIO_Key ?? 'aio-key'
  })
}

export async function createSensor (userID, overrides = {}) {
  return await SensorModel.create({
    _id: overrides._id ?? new Types.ObjectId(),
    userID,
    ...sensorSeed,
    ...overrides
  })
}

export async function createSensorReadings (userID) {
  const recordedAt = new Date('2026-01-02T03:04:05Z')
  await Promise.all([
    HumidityModel.create({ _id: new Types.ObjectId(), userID, data: 60, Date: recordedAt }),
    LightModel.create({ _id: new Types.ObjectId(), userID, data: 5000, Date: recordedAt }),
    MoistureModel.create({ _id: new Types.ObjectId(), userID, data: 45, Date: recordedAt }),
    TemperatureModel.create({ _id: new Types.ObjectId(), userID, data: 28, Date: recordedAt }),
    EnvironmentalDrynessModel.create({ _id: new Types.ObjectId(), userID, data: 10, Date: recordedAt })
  ])
}

export async function createLog (userID, activity = 'activity') {
  return await LogModel.create({
    _id: new Types.ObjectId(),
    userID,
    activity,
    Date: new Date('2026-01-02T03:04:05Z')
  })
}

export async function createTimer (userID, overrides = {}) {
  return await WaterPumpTimerModel.create({
    _id: overrides._id ?? new Types.ObjectId(),
    userID,
    startTime: overrides.startTime ?? '05:00',
    endTime: overrides.endTime ?? '05:10'
  })
}

export function mockAdafruitGet (axios, pumpValue = 'OFF') {
  axios.get.mockImplementation((url) => {
    const created_at = '2026-01-02T03:04:05Z'
    if (url.includes('/humidity-feed/')) return Promise.resolve({ data: [{ value: '60', created_at }] })
    if (url.includes('/light-feed/')) return Promise.resolve({ data: [{ value: '5000', created_at }] })
    if (url.includes('/temperature-feed/')) return Promise.resolve({ data: [{ value: '28', created_at }] })
    if (url.includes('/moisture-feed/')) return Promise.resolve({ data: [{ value: '45', created_at }] })
    if (url.includes('/pump-feed/')) return Promise.resolve({ data: [{ value: pumpValue, created_at }] })
    return Promise.reject(new Error(`Unexpected URL: ${url}`))
  })
}
