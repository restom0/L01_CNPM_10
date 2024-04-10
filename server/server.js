import express, { json } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser';
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

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// const server = createServer(app)
// const io = new Server(server)
const port = 3001
app.use(
  cors({
    methods: ['get', 'post', 'put', 'DELETE', 'PATCH'],
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
// Start the server
// io.on('connection', (socket) => {
//   console.log('a user connected')
//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })
// })
// server.listen(port, async () => {
//   console.log(`App listening on port ${port}`)
//   await database.connect()
// })

// Đăng ký (id,username,password,mqttusername)
// restom0
// Đăng nhập (username,password)-> jwt (id,mqttusername) ->  localStorage.setItem("apikey",ma)
// lấy dữ liệu cuối -> server (ma,tên), ->mqttusername ,idUser
// /cambienanhsang => tên="light" => table Database
// => user =restom0 tên cambienanhsang
// Đăng ký (username,password,mqttusername) ---> /register ---> db(id,username,password,mqttusername)
// Đăng nhập (username,password) ---> /login ---> key(id,mqttusername) localStorage.setItem('key',res.data.key)
// Trang chủ Authen(localStorage.getItem('key'))----> /data/light ---> id,mqttusername ---> tên cảm biến
app.get('/a', async (req, res) => {
  try {
    // Make a GET request to the external API
    const response = await axios.get('https://io.adafruit.com/api/v2/restom0/feeds/cambienanhsang/data?limit=1')

    // Extract the data from the response
    const responseData = response.data

    // Send the extracted data as the response
    res.json(responseData)
  } catch (error) {
    // If an error occurs during the request, send an error response
    res.status(500).json({ error: 'An error occurred while fetching data' })
  }
})
const DB_CONNECTION_STR =
  'mongodb+srv://' + DATABASE_CONFIG.username + ':' + DATABASE_CONFIG.password + '@cluster0.mpdyonk.mongodb.net/CMS'
async function start() {
  try {
    console.log('Start connecting...')
    // mongoose hổ trợ kết nối và giữ connection
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
