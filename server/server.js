import express, { json } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
// import { createServer } from 'node:http'
// import { Server } from 'socket.io'
import axios from 'axios'
import mongoose from 'mongoose'
import { SensorRouter } from './src/routes/SensorRoute.js'
import { LogRouter } from './src/routes/LogRoute.js'
import { WaterPumpRouter } from './src/routes/WaterPumpRoute.js'
import { UserRouter } from './src/routes/UserRoute.js'
import { logRequestTime } from './src/middlewares/logRequestTime.js'
import { logRequestMethod } from './src/middlewares/logRequestMethod.js'
import { DATABASE_CONFIG } from './src/configs/database.js'
import { requireApiKey } from './src/middlewares/useApiKey.js'
import cron from 'node-cron';
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// const server = createServer(app)
// const io = new Server(server)
const port = 3001
app.use(
  cors({
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

app.use(json())
app.use(express.static('public'))
app.use(logRequestTime)
app.use(logRequestMethod)

// Route init
app.use('/sensors', requireApiKey, SensorRouter)
app.use('/logs', requireApiKey, LogRouter)
app.use('/waterpumps', requireApiKey, WaterPumpRouter)
app.use('/', UserRouter)
cron.schedule('0 0 * * *', () => {
  console.log('Running a task every minute');
});
const DB_CONNECTION_STR =
  'mongodb+srv://' + DATABASE_CONFIG.username + ':' + DATABASE_CONFIG.password + '@cluster0.mpdyonk.mongodb.net/CMS'
async function start() {
  try {
    console.log('Start connecting...')
    await mongoose.connect(DB_CONNECTION_STR)
    console.log('Connect success')

    app.listen(port, () => {
      console.log(`Listening at port ${port}`)
    })
  } catch (error) {
    console.log('Error connect to database with error: ' + error.message)
  }
}

start()
