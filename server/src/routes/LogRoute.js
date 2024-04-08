import express from 'express'
import { LogController } from '../controllers/LogController.js'
const LogRouter = express.Router()

LogRouter.get('/', LogController.getDataOnDate)
export { LogRouter }
