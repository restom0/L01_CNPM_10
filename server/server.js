import express, { json } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
// import { createServer } from 'node:http'
// import { Server } from 'socket.io'
import mongoose from 'mongoose'
import { SensorRouter } from './src/routes/SensorRoute.js'
import { LogRouter } from './src/routes/LogRoute.js'
import { WaterPumpRouter } from './src/routes/WaterPumpRoute.js'
import { UserRouter } from './src/routes/UserRoute.js'
import { logRequestTime } from './src/middlewares/logRequestTime.js'
import { logRequestMethod } from './src/middlewares/logRequestMethod.js'
import { DATABASE_CONFIG } from './src/configs/database.js'
import { requireApiKey } from './src/middlewares/useApiKey.js'
import cron from 'node-cron'
import { fileURLToPath } from 'node:url'
export const app = express()
app.disable('x-powered-by')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
// const server = createServer(app)
// const io = new Server(server)
const port = 3001
const allowedOrigins = new Set(
  (process.env.CLIENT_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true)
        return
      }
      callback(new Error('Origin not allowed by CORS'))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  })
)
// HTTP logger
app.use(morgan('dev'))
app.use(morgan('combined'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100000,
  standardHeaders: 'draft-7',
  legacyHeaders: false
})
app.use(limiter)

app.use(json())
app.use(express.static('public'))
app.use(logRequestTime)
app.use(logRequestMethod)

// Route init
app.use('/sensors', requireApiKey, SensorRouter)
app.use('/logs', requireApiKey, LogRouter)
app.use('/waterpumps', requireApiKey, WaterPumpRouter)
app.use('/', UserRouter)

const DB_CONNECTION_STR =
  process.env.DATABASE_URL ||
  'mongodb+srv://' + DATABASE_CONFIG.username + ':' + DATABASE_CONFIG.password + '@cluster0.mpdyonk.mongodb.net/CMS'

export async function start () {
  try {
    console.log('Start connecting...')
    await mongoose.connect(DB_CONNECTION_STR)
    console.log('Connect success')

    cron.schedule('0 0 * * *', () => {
      console.log('Running a scheduled task')
    })

    app.listen(port, () => {
      console.log(`Listening at port ${port}`)
    })
  } catch (error) {
    console.log('Error connect to database with error: ' + error.message)
  }
}

// Only boot the server when this file is run directly (`node server.js`),
// not when it is imported by tests via supertest.
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isDirectRun) {
  await start()
}
