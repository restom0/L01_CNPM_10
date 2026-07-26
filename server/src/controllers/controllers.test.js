import { afterEach, describe, expect, it, vi } from 'vitest'
import { Types } from 'mongoose'
import { LogController } from './LogController.js'
import { SensorController } from './SensorController.js'
import { UserController } from './UserController.js'
import { WaterPumpController } from './WaterPumpController.js'
import { LogService } from '../services/LogService.js'
import { SensorService } from '../services/SensorService.js'
import { UserService } from '../services/UserService.js'
import { WaterPumpService } from '../services/WaterPumpService.js'

afterEach(() => {
  vi.restoreAllMocks()
})

function resMock () {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
    send: vi.fn(() => res),
    cookie: vi.fn(() => res),
    clearCookie: vi.fn(() => res)
  }
  return res
}

const user = {
  id: new Types.ObjectId(),
  mqtt: 'mqtt-user',
  key: 'aio-key'
}

describe('UserController (UT)', () => {
  it('logs in, sets cookie, and returns token', async () => {
    vi.spyOn(UserService, 'login').mockResolvedValue({ _id: user.id })
    const res = resMock()

    await UserController.login({ body: { username: 'u', password: 'p' } }, res)

    expect(res.cookie).toHaveBeenCalledWith('token', expect.any(String), expect.objectContaining({ httpOnly: true }))
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ api_token: expect.any(String) })
  })

  it.each([
    [{ password: 'p' }, 'Username is empty', 400],
    [{ username: 'u' }, 'Password is empty', 400]
  ])('rejects invalid login request %o', async (body, error, statusCode) => {
    const res = resMock()

    await UserController.login({ body }, res)

    expect(res.status).toHaveBeenCalledWith(statusCode)
    expect(res.json).toHaveBeenCalledWith({ error })
  })

  it('rejects unknown credentials', async () => {
    vi.spyOn(UserService, 'login').mockResolvedValue(null)
    const res = resMock()

    await UserController.login({ body: { username: 'u', password: 'bad' } }, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Username or password is incorrect' })
  })

  it('clears token cookie on logout', async () => {
    const res = resMock()

    await UserController.logout({}, res)

    expect(res.clearCookie).toHaveBeenCalledWith('token')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ data: 'Logged out' })
  })

  it.each([
    [{ password: 'p', mqttUsername: 'm', aioKey: 'k' }, 'Username is empty'],
    [{ username: 'u', mqttUsername: 'm', aioKey: 'k' }, 'Password is empty'],
    [{ username: 'u', password: 'p', aioKey: 'k' }, 'Mqtt is empty'],
    [{ username: 'u', password: 'p', mqttUsername: 'm' }, 'Key is empty']
  ])('rejects invalid register request %o', async (body, error) => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const res = resMock()

    await UserController.register({ body }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error })
  })

  it('registers user through service', async () => {
    vi.spyOn(UserService, 'register').mockResolvedValue({})
    const res = resMock()

    await UserController.register({
      body: { username: 'u', password: 'p', mqttUsername: 'm', aioKey: 'k' }
    }, res)

    expect(UserService.register).toHaveBeenCalledWith('u', 'p', 'm', 'k')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ data: 'Register successfully' })
  })
})

describe('LogController (UT)', () => {
  it('returns logs for requested date', async () => {
    vi.spyOn(LogService, 'getDataOnDate').mockResolvedValue([{ activity: 'ok' }])
    const res = resMock()

    await LogController.getDataOnDate({ query: { date: '2026-01-02' }, user }, res)

    expect(LogService.getDataOnDate).toHaveBeenCalledWith('2026-01-02', user.id)
    expect(res.json).toHaveBeenCalledWith([{ activity: 'ok' }])
  })

  it('returns service errors', async () => {
    vi.spyOn(LogService, 'getDataOnDate').mockRejectedValue({ statusCode: 418, message: 'nope' })
    const res = resMock()

    await LogController.getDataOnDate({ query: { date: 'bad' }, user }, res)

    expect(res.status).toHaveBeenCalledWith(418)
    expect(res.json).toHaveBeenCalledWith({ error: 'nope' })
  })
})

describe('SensorController (UT)', () => {
  const serviceError = { statusCode: 418, message: 'sensor exploded' }

  it.each([
    ['getAllHumidityValue', 'getAllHumidityValue'],
    ['getAllLightValue', 'getAllLightValue'],
    ['getAllMoistureValue', 'getAllMoistureValue'],
    ['getAllTemperatureValue', 'getAllTemperatureValue']
  ])('%s returns chart data and service errors', async (controllerMethod, serviceMethod) => {
    vi.spyOn(SensorService, serviceMethod).mockResolvedValueOnce([{ data: 1 }]).mockRejectedValueOnce(serviceError)
    const ok = resMock()
    const fail = resMock()

    await SensorController[controllerMethod]({ user }, ok)
    await SensorController[controllerMethod]({ user }, fail)

    expect(ok.status).toHaveBeenCalledWith(200)
    expect(ok.json).toHaveBeenCalledWith({ data: [{ data: 1 }] })
    expect(fail.status).toHaveBeenCalledWith(418)
    expect(fail.json).toHaveBeenCalledWith({ error: 'sensor exploded' })
  })

  it('getAllEnvironmentValue returns 500 on service error', async () => {
    vi.spyOn(SensorService, 'getAllEnvironmentValue').mockResolvedValueOnce([{ data: 1 }]).mockRejectedValueOnce(new Error('bad'))
    const ok = resMock()
    const fail = resMock()

    await SensorController.getAllEnvironmentValue({ user }, ok)
    await SensorController.getAllEnvironmentValue({ user }, fail)

    expect(ok.status).toHaveBeenCalledWith(200)
    expect(fail.status).toHaveBeenCalledWith(500)
    expect(fail.json).toHaveBeenCalledWith({ error: 'bad' })
  })

  it.each([
    ['getLastHumidityValue', 'getLastHumidityValue'],
    ['getLastLightValue', 'getLastLightValue'],
    ['getLastMoistureValue', 'getLastMoistureValue']
  ])('%s returns latest value with threshold notice and service error', async (controllerMethod, serviceMethod) => {
    vi.spyOn(SensorService, serviceMethod)
      .mockResolvedValueOnce({ value: 5, created_at: 'now' })
      .mockRejectedValueOnce(serviceError)
    const ok = resMock()
    ok.threshold = { upper: 10, lower: 1 }
    const fail = resMock()
    fail.threshold = { upper: 10, lower: 1 }

    await SensorController[controllerMethod]({ user }, ok)
    await SensorController[controllerMethod]({ user }, fail)

    expect(ok.status).toHaveBeenCalledWith(200)
    expect(ok.json).toHaveBeenCalledWith({
      needNoti: false,
      upper: 10,
      lower: 1,
      data: { value: 5, created_at: 'now' }
    })
    expect(fail.status).toHaveBeenCalledWith(418)
  })

  it('getLastTemperatureValue handles success, not found, and service error', async () => {
    vi.spyOn(SensorService, 'getLastTemperatureValue')
      .mockResolvedValueOnce({ value: 50, created_at: 'now' })
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(serviceError)
    const ok = resMock()
    ok.threshold = { upper: 10, lower: 1 }
    const missing = resMock()
    missing.threshold = { upper: 10, lower: 1 }
    const fail = resMock()
    fail.threshold = { upper: 10, lower: 1 }

    await SensorController.getLastTemperatureValue({ user }, ok)
    await SensorController.getLastTemperatureValue({ user }, missing)
    await SensorController.getLastTemperatureValue({ user }, fail)

    expect(ok.json).toHaveBeenCalledWith(expect.objectContaining({ needNoti: true }))
    expect(missing.status).toHaveBeenCalledWith(404)
    expect(missing.json).toHaveBeenCalledWith({ error: 'Temperature value not found' })
    expect(fail.status).toHaveBeenCalledWith(418)
  })

  it('getLastEnvironmentValue returns saved value, ignores falsy value, and returns errors', async () => {
    vi.spyOn(SensorService, 'getLastEnvironmentValue')
      .mockResolvedValueOnce({ data: 1 })
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error('ed fail'))
    const ok = resMock()
    const empty = resMock()
    const fail = resMock()

    await SensorController.getLastEnvironmentValue({ user }, ok)
    await SensorController.getLastEnvironmentValue({ user }, empty)
    await SensorController.getLastEnvironmentValue({ user }, fail)

    expect(ok.status).toHaveBeenCalledWith(200)
    expect(ok.json).toHaveBeenCalledWith({ data: { data: 1 } })
    expect(empty.status).not.toHaveBeenCalled()
    expect(fail.status).toHaveBeenCalledWith(500)
  })

  it.each([
    ['getLightThreshold', 'getLightThreshold'],
    ['getTemperatureThreshold', 'getTemperatureThreshold'],
    ['getHumidityThreshold', 'getHumidityThreshold'],
    ['getMoistureThreshold', 'getMoistureThreshold']
  ])('%s loads threshold and handles service error', async (controllerMethod, serviceMethod) => {
    vi.spyOn(SensorService, serviceMethod).mockResolvedValueOnce({ upper: 10, lower: 1 }).mockRejectedValueOnce(serviceError)
    const ok = resMock()
    const next = vi.fn()
    const fail = resMock()

    await SensorController[controllerMethod]({ user }, ok, next)
    await SensorController[controllerMethod]({ user }, fail, next)

    expect(ok.threshold).toEqual({ upper: 10, lower: 1 })
    expect(next).toHaveBeenCalledTimes(1)
    expect(fail.status).toHaveBeenCalledWith(418)
  })

  it.each([
    ['updateLightThreshold', 'updateLightThreshold'],
    ['updateTemperatureThreshold', 'updateTemperatureThreshold'],
    ['updateHumidityThreshold', 'updateHumidityThreshold'],
    ['updateMoistureThreshold', 'updateMoistureThreshold']
  ])('%s updates thresholds', async (controllerMethod, serviceMethod) => {
    vi.spyOn(SensorService, serviceMethod).mockResolvedValue()
    const res = resMock()

    await SensorController[controllerMethod]({ user, query: { upper: '10', lower: '1' } }, res)

    expect(SensorService[serviceMethod]).toHaveBeenCalledWith(user.id, 10, 1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Threshold updated' })
  })

  it.each([
    [{ lower: '1' }, 'Upper threshold is empty'],
    [{ upper: '10' }, 'Lower threshold is empty'],
    [{ upper: '1', lower: '10' }, 'Invalid Threshold']
  ])('rejects invalid threshold query %o', async (query, error) => {
    const res = resMock()

    await SensorController.updateLightThreshold({ user, query }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error })
  })
})

describe('WaterPumpController (UT)', () => {
  const serviceError = { statusCode: 418, message: 'pump exploded' }

  it('lists automatic timers and handles errors', async () => {
    vi.spyOn(WaterPumpService, 'automaticWatering').mockResolvedValueOnce([{ id: '1' }]).mockRejectedValueOnce(serviceError)
    const ok = resMock()
    const fail = resMock()

    await WaterPumpController.automaticWatering({ user }, ok)
    await WaterPumpController.automaticWatering({ user }, fail)

    expect(ok.status).toHaveBeenCalledWith(200)
    expect(ok.json).toHaveBeenCalledWith({ data: [{ id: '1' }] })
    expect(fail.status).toHaveBeenCalledWith(418)
  })

  it.each([
    ['createTimer', {}, { startTime: '06:00', endTime: '06:10' }, 'createTimer', [user.id, '06:00', '06:10'], 'Timer is created'],
    ['updateTimer', { id: '507f1f77bcf86cd799439011' }, { startTime: '06:00', endTime: '06:10' }, 'updateTimer', ['507f1f77bcf86cd799439011', '06:00', '06:10'], 'Timer is updated']
  ])('%s validates time and calls service', async (controllerMethod, params, body, serviceMethod, args, message) => {
    vi.spyOn(WaterPumpService, serviceMethod).mockResolvedValue()
    const res = resMock()

    await WaterPumpController[controllerMethod]({ user, params, body }, res)

    expect(WaterPumpService[serviceMethod]).toHaveBeenCalledWith(...args)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ data: message })
  })

  it.each([
    ['createTimer', {}, { endTime: '06:10' }, 'Start time is required'],
    ['createTimer', {}, { startTime: '06:00' }, 'End time is required'],
    ['createTimer', {}, { startTime: 'bad', endTime: '06:10' }, 'Time is invalid'],
    ['createTimer', {}, { startTime: 'aa:00', endTime: '06:10' }, 'Time is invalid'],
    ['createTimer', {}, { startTime: '25:00', endTime: '26:00' }, 'Time is invalid'],
    ['createTimer', {}, { startTime: '06:10', endTime: '06:10' }, 'Start time must be smaller than end time'],
    ['createTimer', {}, { startTime: '07:00', endTime: '06:00' }, 'Start time must be smaller than end time'],
    ['updateTimer', {}, { startTime: '06:00', endTime: '06:10' }, 'WaterPump is required'],
    ['updateTimer', { id: '1' }, { endTime: '06:10' }, 'Start time is required'],
    ['updateTimer', { id: '1' }, { startTime: '06:00' }, 'End time is required']
  ])('%s rejects invalid timer request', async (controllerMethod, params, body, error) => {
    const res = resMock()

    await WaterPumpController[controllerMethod]({ user, params, body }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error })
  })

  it('deleteTimer deletes timer and handles validation/error', async () => {
    vi.spyOn(WaterPumpService, 'deleteTimer').mockResolvedValueOnce().mockRejectedValueOnce(serviceError)
    const ok = resMock()
    const missingId = resMock()
    const fail = resMock()

    await WaterPumpController.deleteTimer({ params: { id: '1' } }, ok)
    await WaterPumpController.deleteTimer({ params: {} }, missingId)
    await WaterPumpController.deleteTimer({ params: { id: '2' } }, fail)

    expect(ok.status).toHaveBeenCalledWith(200)
    expect(ok.json).toHaveBeenCalledWith({ data: 'Timer is deleted' })
    expect(missingId.status).toHaveBeenCalledWith(400)
    expect(fail.status).toHaveBeenCalledWith(418)
  })

  it.each([
    ['turnOnPump', 'turnOnPump', 'Pump is turned on'],
    ['turnOffPump', 'turnOffPump', 'Pump is turned off']
  ])('%s calls service and handles error', async (controllerMethod, serviceMethod, message) => {
    vi.spyOn(WaterPumpService, serviceMethod).mockResolvedValueOnce().mockRejectedValueOnce(serviceError)
    const ok = resMock()
    const fail = resMock()

    await WaterPumpController[controllerMethod]({ user }, ok)
    await WaterPumpController[controllerMethod]({ user }, fail)

    expect(WaterPumpService[serviceMethod]).toHaveBeenCalledWith(user.key, user.mqtt, user.id)
    expect(ok.status).toHaveBeenCalledWith(200)
    expect(ok.json).toHaveBeenCalledWith({ data: message })
    expect(fail.status).toHaveBeenCalledWith(418)
  })

  it('getLastWaterPumpValue returns state and handles error', async () => {
    vi.spyOn(WaterPumpService, 'getLastWaterPumpValue').mockResolvedValueOnce({ value: 'ON' }).mockRejectedValueOnce(serviceError)
    const ok = resMock()
    const fail = resMock()

    await WaterPumpController.getLastWaterPumpValue({ user }, ok)
    await WaterPumpController.getLastWaterPumpValue({ user }, fail)

    expect(ok.status).toHaveBeenCalledWith(200)
    expect(ok.json).toHaveBeenCalledWith({ data: { value: 'ON' } })
    expect(fail.status).toHaveBeenCalledWith(418)
  })
})
