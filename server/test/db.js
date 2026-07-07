import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongod

// Spin up an in-memory MongoDB and point mongoose at it. Call in beforeAll.
export async function connectTestDb () {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
}

// Wipe every collection between tests so cases stay isolated. Call in afterEach.
export async function clearTestDb () {
  const { collections } = mongoose.connection
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({})
  }
}

// Tear everything down. Call in afterAll.
export async function closeTestDb () {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  if (mongod) await mongod.stop()
}
