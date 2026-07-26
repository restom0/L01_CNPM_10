import { afterEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { DUMMY_ADMIN } from '../data/dummyData.js'
import * as api from './apiService.js'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

afterEach(() => {
  vi.clearAllMocks()
})

const base = 'http://localhost:3001'
const token = 'session-token'
const auth = { headers: { Authorization: `Bearer ${token}` } }

describe('apiService user API (UT)', () => {
  it('calls login, register, and logout endpoints', () => {
    api.loginUser('u', 'p')
    api.registerUser('u', 'p', 'mqtt', 'key')
    api.logoutUser()

    expect(axios.post).toHaveBeenNthCalledWith(1, `${base}/login`, { username: 'u', password: 'p' })
    expect(axios.post).toHaveBeenNthCalledWith(2, `${base}/register`, {
      username: 'u',
      password: 'p',
      mqttUsername: 'mqtt',
      aioKey: 'key'
    })
    expect(axios.post).toHaveBeenNthCalledWith(3, `${base}/logout`)
  })
})

describe('apiService sensor API (UT)', () => {
  it.each([
    [api.getLatestTemperature, '/sensors/temp'],
    [api.getLatestLight, '/sensors/light'],
    [api.getLatestHumidity, '/sensors/humid'],
    [api.getLatestMoisture, '/sensors/moisture'],
    [api.calculateEnvironmentDryness, '/sensors/ed'],
    [api.getTemperatureChart, '/sensors/chart/temp'],
    [api.getLightChart, '/sensors/chart/light'],
    [api.getHumidityChart, '/sensors/chart/humid'],
    [api.getMoistureChart, '/sensors/chart/moisture'],
    [api.getEnvironmentDrynessChart, '/sensors/chart/ed'],
    [api.getWaterPumpState, '/waterpumps'],
    [api.listWaterPumpTimers, '/waterpumps/auto']
  ])('GET %s uses bearer auth', (fn, path) => {
    fn(token)

    expect(axios.get).toHaveBeenCalledWith(`${base}${path}`, auth)
  })

  it.each([
    [api.updateTemperatureThreshold, '/sensors/threshold/temp'],
    [api.updateLightThreshold, '/sensors/threshold/light'],
    [api.updateHumidityThreshold, '/sensors/threshold/humid'],
    [api.updateMoistureThreshold, '/sensors/threshold/moisture']
  ])('PUT %s sends threshold params', (fn, path) => {
    fn(token, 10, 1)

    expect(axios.put).toHaveBeenCalledWith(`${base}${path}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      params: { upper: 10, lower: 1 }
    })
  })

  it('omits empty threshold params to preserve backend validation', () => {
    api.updateLightThreshold(token, '', '')

    expect(axios.put).toHaveBeenCalledWith(`${base}/sensors/threshold/light`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      params: {}
    })
  })

  it('sends log date query params', () => {
    api.getLogsByDate(token, '2026-01-02')

    expect(axios.get).toHaveBeenCalledWith(`${base}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: '2026-01-02' }
    })
  })
})

describe('apiService water pump API (UT)', () => {
  it('sends manual pump commands', () => {
    api.turnWaterPumpOn(token)
    api.turnWaterPumpOff(token)

    expect(axios.post).toHaveBeenNthCalledWith(1, `${base}/waterpumps/manual/on`, {}, auth)
    expect(axios.post).toHaveBeenNthCalledWith(2, `${base}/waterpumps/manual/off`, {}, auth)
  })

  it('creates, updates, and deletes automatic timers', () => {
    api.createWaterPumpTimer(token, '06:00', '06:10')
    api.updateWaterPumpTimer(token, 'timer-id', '07:00', '07:10')
    api.deleteWaterPumpTimer(token, 'timer-id')

    expect(axios.post).toHaveBeenCalledWith(`${base}/waterpumps/auto`, { startTime: '06:00', endTime: '06:10' }, auth)
    expect(axios.put).toHaveBeenCalledWith(`${base}/waterpumps/auto/timer-id`, { startTime: '07:00', endTime: '07:10' }, auth)
    expect(axios.delete).toHaveBeenCalledWith(`${base}/waterpumps/auto/timer-id`, auth)
  })
})

describe('apiService demo mode (UT)', () => {
  const demoToken = DUMMY_ADMIN.token

  it('returns demo data without calling the backend', async () => {
    await expect(api.getLatestTemperature(demoToken)).resolves.toMatchObject({
      data: {
        data: { value: expect.any(Number), created_at: expect.any(String) },
        lower: expect.any(Number),
        upper: expect.any(Number),
        needNoti: expect.any(Boolean)
      }
    })
    await expect(api.getTemperatureChart(demoToken)).resolves.toMatchObject({
      data: { data: expect.any(Array) }
    })
    await expect(api.getLogsByDate(demoToken, '2026-01-02')).resolves.toMatchObject({
      data: expect.any(Array)
    })
    await expect(api.getWaterPumpState(demoToken)).resolves.toMatchObject({
      data: { data: { value: expect.any(String), created_at: expect.any(String) } }
    })
    await expect(api.listWaterPumpTimers(demoToken)).resolves.toMatchObject({
      data: { data: expect.any(Array) }
    })
    await expect(api.turnWaterPumpOn(demoToken)).resolves.toEqual({
      data: { data: 'Pump is turned on' }
    })
    await expect(api.createWaterPumpTimer(demoToken, '08:00', '08:10')).resolves.toEqual({
      data: { data: 'Timer is created' }
    })
    await expect(api.updateLightThreshold(demoToken, 9000, 1000)).resolves.toEqual({
      data: { message: 'Threshold updated' }
    })

    expect(axios.get).not.toHaveBeenCalled()
    expect(axios.post).not.toHaveBeenCalled()
    expect(axios.put).not.toHaveBeenCalled()
    expect(axios.delete).not.toHaveBeenCalled()
  })
})
