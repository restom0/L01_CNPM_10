import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest'
import axios from 'axios'
import request from 'supertest'
import { app } from '../server.js'
import { connectTestDb, clearTestDb, closeTestDb } from './db.js'
import { createApiKey } from '../src/middlewares/useApiKey.js'
import { SensorModel } from '../src/models/Sensors.js'
import { UserModel } from '../src/models/Users.js'
import { WaterPumpTimerModel } from '../src/models/WaterPumpTimers.js'
import { createLog, createSensor, createSensorReadings, createTimer, mockAdafruitGet } from './factories.js'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

beforeAll(connectTestDb)
beforeEach(() => {
  vi.clearAllMocks()
})
afterEach(clearTestDb)
afterAll(closeTestDb)

const passwordField = 'password'
const createTestSecret = (label) => `test-${label}-${label.length}`

const newUser = {
  username: 'bob',
  [passwordField]: createTestSecret('bob'),
  mqttUsername: 'bob-mqtt',
  aioKey: 'AIO_KEY_BOB'
}

async function registerAndLogin () {
  await request(app).post('/register').send(newUser)
  const login = await request(app)
    .post('/login')
    .send({ username: newUser.username, password: newUser.password })
  return login.body.api_token
}

async function seedProtectedData () {
  const user = await UserModel.findOne({ username: newUser.username })
  await createSensor(user._id)
  await createSensorReadings(user._id)
  await createLog(user._id, 'test log')
  await createTimer(user._id)
  return user
}

describe('POST /register (API)', () => {
  it('registers a new user (200)', async () => {
    const res = await request(app).post('/register').send(newUser)
    expect(res.status).toBe(200)
    expect(res.body.data).toBe('Register successfully')
  })

  it('rejects a missing username (400)', async () => {
    const res = await request(app)
      .post('/register')
      .send({ [passwordField]: createTestSecret('missing-user'), mqttUsername: 'm', aioKey: 'k' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Username is empty')
  })

  it('rejects a duplicate username (400)', async () => {
    await request(app).post('/register').send(newUser)
    const res = await request(app).post('/register').send(newUser)
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Account existed')
  })
})

describe('POST /login (API)', () => {
  it('returns an api_token for valid credentials (200)', async () => {
    await request(app).post('/register').send(newUser)
    const res = await request(app)
      .post('/login')
      .send({ username: newUser.username, password: newUser.password })
    expect(res.status).toBe(200)
    expect(typeof res.body.api_token).toBe('string')
    expect(res.body.api_token.length).toBeGreaterThan(0)
  })

  it('returns 404 for a wrong password', async () => {
    await request(app).post('/register').send(newUser)
    const res = await request(app)
      .post('/login')
      .send({ username: newUser.username, [passwordField]: createTestSecret('wrong') })
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Username or password is incorrect')
  })

  it('returns 400 when password is missing', async () => {
    const res = await request(app).post('/login').send({ username: 'bob' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Password is empty')
  })
})

describe('protected routes (API)', () => {
  it('rejects /sensors without an Authorization header (401)', async () => {
    const res = await request(app).get('/sensors/humid')
    expect(res.status).toBe(401)
    expect(res.body.message).toBe('You need to login')
  })

  it('rejects an invalid Authorization token (403)', async () => {
    const res = await request(app).get('/sensors/humid').set('Authorization', 'Bearer invalid')
    expect(res.status).toBe(403)
    expect(res.body.message).toBe('Invalid access')
  })

  it('rejects a valid token for a missing user (404)', async () => {
    const res = await request(app)
      .get('/sensors/humid')
      .set('Authorization', `Bearer ${createApiKey('507f1f77bcf86cd799439011')}`)
    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Invalid access')
  })
})

describe('sensor routes (API)', () => {
  it('returns latest sensor values and chart data for authenticated user', async () => {
    const token = await registerAndLogin()
    await seedProtectedData()
    mockAdafruitGet(axios)

    const latest = await request(app).get('/sensors/temp').set('Authorization', `Bearer ${token}`)
    const chart = await request(app).get('/sensors/chart/temp').set('Authorization', `Bearer ${token}`)

    expect(latest.status).toBe(200)
    expect(latest.body).toMatchObject({
      needNoti: false,
      upper: 35,
      lower: 15,
      data: { value: '28', created_at: '2026-01-02T03:04:05Z' }
    })
    expect(chart.status).toBe(200)
    expect(chart.body.data).toHaveLength(1)
  })

  it.each([
    ['/sensors/humid'],
    ['/sensors/light'],
    ['/sensors/moisture'],
    ['/sensors/ed'],
    ['/sensors/chart/humid'],
    ['/sensors/chart/light'],
    ['/sensors/chart/moisture'],
    ['/sensors/chart/ed']
  ])('serves %s for authenticated user', async (path) => {
    const token = await registerAndLogin()
    await seedProtectedData()
    mockAdafruitGet(axios)
    axios.post.mockResolvedValue({ data: {} })

    const res = await request(app).get(path).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
  })

  it.each([
    ['/sensors/threshold/temp'],
    ['/sensors/threshold/light'],
    ['/sensors/threshold/humid'],
    ['/sensors/threshold/moisture']
  ])('updates threshold through %s', async (path) => {
    const token = await registerAndLogin()
    const user = await seedProtectedData()

    const res = await request(app)
      .put(path)
      .query({ upper: 40, lower: 10 })
      .set('Authorization', `Bearer ${token}`)

    const sensor = await SensorModel.findOne({ userID: user._id }).lean()
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Threshold updated')
    expect(sensor.upperEnvironmentDrynessThreshold).toBeTypeOf('number')
  })

  it('rejects invalid threshold query (400)', async () => {
    const token = await registerAndLogin()
    await seedProtectedData()

    const res = await request(app)
      .put('/sensors/threshold/light')
      .query({ upper: 1, lower: 10 })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid Threshold')
  })
})

describe('water pump and log routes (API)', () => {
  it('runs timer CRUD through API', async () => {
    const token = await registerAndLogin()
    const user = await seedProtectedData()

    const list = await request(app).get('/waterpumps/auto').set('Authorization', `Bearer ${token}`)
    const create = await request(app)
      .post('/waterpumps/auto')
      .send({ startTime: '06:00', endTime: '06:10' })
      .set('Authorization', `Bearer ${token}`)
    const timer = await WaterPumpTimerModel.findOne({ userID: user._id, startTime: '06:00' })
    const update = await request(app)
      .put(`/waterpumps/auto/${timer._id.toHexString()}`)
      .send({ startTime: '07:00', endTime: '07:10' })
      .set('Authorization', `Bearer ${token}`)
    const remove = await request(app)
      .delete(`/waterpumps/auto/${timer._id.toHexString()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(list.status).toBe(200)
    expect(list.body.data).toHaveLength(1)
    expect(create.status).toBe(200)
    expect(update.status).toBe(200)
    expect(remove.status).toBe(200)
  })

  it('rejects invalid timer API request (400)', async () => {
    const token = await registerAndLogin()
    await seedProtectedData()

    const res = await request(app)
      .post('/waterpumps/auto')
      .send({ startTime: '07:00', endTime: '06:00' })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Start time must be smaller than end time')
  })

  it('reads and controls manual pump through API', async () => {
    const token = await registerAndLogin()
    await seedProtectedData()
    mockAdafruitGet(axios, 'ON')
    axios.post.mockResolvedValue({ data: {} })

    const state = await request(app).get('/waterpumps').set('Authorization', `Bearer ${token}`)
    const on = await request(app).post('/waterpumps/manual/on').set('Authorization', `Bearer ${token}`)
    const off = await request(app).post('/waterpumps/manual/off').set('Authorization', `Bearer ${token}`)

    expect(state.status).toBe(200)
    expect(state.body.data.value).toBe('ON')
    expect(on.status).toBe(200)
    expect(off.status).toBe(200)
    expect(axios.post).toHaveBeenCalledTimes(2)
  })

  it('returns logs for requested date', async () => {
    const token = await registerAndLogin()
    await seedProtectedData()

    const res = await request(app)
      .get('/logs')
      .query({ date: '2026-01-02' })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body[0].activity).toBe('test log')
  })

  it('logs out and clears cookie', async () => {
    const res = await request(app).post('/logout')

    expect(res.status).toBe(200)
    expect(res.body.data).toBe('Logged out')
    expect(res.headers['set-cookie'][0]).toContain('token=')
  })
})
