import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { UserService } from './UserService.js'
import { UserModel } from '../models/Users.js'
import { BadRequestError } from '../errors/badRequest.error.js'
import { connectTestDb, clearTestDb, closeTestDb } from '../../test/db.js'

beforeAll(connectTestDb)
afterEach(clearTestDb)
afterAll(closeTestDb)

const createTestSecret = (label) => `test-${label}-${label.length}`

const sample = {
  username: 'alice',
  password: createTestSecret('alice'),
  mqttUsername: 'alice-mqtt',
  aioKey: 'AIO_KEY_XYZ'
}

describe('UserService.register (IT)', () => {
  it.each([
    [123, sample.password, sample.mqttUsername, sample.aioKey, 'Username must be a string'],
    [sample.username, 123, sample.mqttUsername, sample.aioKey, 'Password must be a string'],
    [sample.username, sample.password, 123, sample.aioKey, 'Mqtt username must be a string'],
    [sample.username, sample.password, sample.mqttUsername, 123, 'Key must be a string']
  ])('rejects non-string register input', async (username, password, mqttUsername, aioKey, message) => {
    await expect(
      UserService.register(username, password, mqttUsername, aioKey)
    ).rejects.toThrow(message)
  })

  it('persists a new user and returns it', async () => {
    const saved = await UserService.register(
      sample.username,
      sample.password,
      sample.mqttUsername,
      sample.aioKey
    )
    expect(saved.username).toBe('alice')
    expect(saved.mqttusername).toBe('alice-mqtt')
    expect(saved.AIO_Key).toBe('AIO_KEY_XYZ')

    const count = await UserModel.countDocuments({ username: 'alice' })
    expect(count).toBe(1)
  })

  it('rejects a duplicate username with BadRequestError', async () => {
    await UserService.register(sample.username, sample.password, sample.mqttUsername, sample.aioKey)
    await expect(
      UserService.register(sample.username, createTestSecret('other'), 'm', 'k')
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})

describe('UserService.login (IT)', () => {
  it('rejects operator-shaped credentials before querying', async () => {
    const mongoOperator = '$ne'
    await expect(
      UserService.login({ [mongoOperator]: null }, sample.password)
    ).rejects.toBeInstanceOf(BadRequestError)
    await expect(
      UserService.login(sample.username, { [mongoOperator]: null })
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('returns the user for correct credentials', async () => {
    await UserService.register(sample.username, sample.password, sample.mqttUsername, sample.aioKey)
    const found = await UserService.login('alice', sample.password)
    expect(found).not.toBeNull()
    expect(found.username).toBe('alice')
  })

  it('returns null for a wrong password', async () => {
    await UserService.register(sample.username, sample.password, sample.mqttUsername, sample.aioKey)
    const found = await UserService.login('alice', createTestSecret('wrong'))
    expect(found).toBeNull()
  })
})

describe('UserService.authorize (IT)', () => {
  it('finds a user by id string', async () => {
    const saved = await UserService.register(
      sample.username,
      sample.password,
      sample.mqttUsername,
      sample.aioKey
    )
    const found = await UserService.authorize(saved._id.toHexString())
    expect(found).not.toBeNull()
    expect(found.username).toBe('alice')
  })
})
