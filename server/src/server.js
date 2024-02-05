const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const database = require('./config/database/index')
const route = require('../routes')
const logRequestTime = require('./middleware/logRequestTime')
const logRequestMethod = require('./middleware/logRequestMethod')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const server = createServer(app)
const io = new Server(server)

const port = 3000
app.use(
  cors({
    methods: ['get', 'post', 'put', 'DELETE', 'PATCH'],
    credentials: true
  })
)
// HTTP logger
app.use(morgan('dev'))
app.use(morgan('combined'))
app.use(
  express.urlencoded({
    extended: true
  })
)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100000,
  standardHeaders: 'draft-7',
  legacyHeaders: false
})

app.use(limiter)
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(logRequestTime)
app.use(logRequestMethod)

// Route init
route(app)
// Start the server
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
server.listen(port, async () => {
  console.log(`App listening on port ${port}`)
  await database.connect()
})
// export the app for vercel serverless functions
module.exports = app
