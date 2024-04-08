import express from 'express'
import { WaterPumpController } from '../controllers/WaterPumpController.js'
const WaterPumpRouter = express.Router()

WaterPumpRouter.post('/auto', WaterPumpController.automaticWatering)
WaterPumpRouter.post('/manual/on', WaterPumpController.turnOnPump)
WaterPumpRouter.post('/manual/off', WaterPumpController.turnOffPump)
WaterPumpRouter.get('/', WaterPumpController.getLastWaterPumpValue)
export { WaterPumpRouter }
