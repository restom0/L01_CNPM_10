import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../server.js'
import { connectTestDb, clearTestDb, closeTestDb } from './db.js'

beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

const newUser = {
  username: 'bob',
  password: 'secret1',
  mqttUsername: 'bob-mqtt',
  aioKey: 'AIO_KEY_BOB'
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
      .send({ password: 'x', mqttUsername: 'm', aioKey: 'k' })
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
      .send({ username: newUser.username, password: 'wrong' })
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
})
