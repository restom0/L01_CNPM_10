import express from 'express'
import { WaterPumpController } from '../controllers/WaterPumpController.js'
const WaterPumpRouter = express.Router()

WaterPumpRouter.get('/auto', WaterPumpController.automaticWatering)
WaterPumpRouter.post('/auto', WaterPumpController.createTimer)
WaterPumpRouter.put('/auto/:id', WaterPumpController.updateTimer)
WaterPumpRouter.delete('/auto/:id', WaterPumpController.deleteTimer)
WaterPumpRouter.post('/manual/on', WaterPumpController.turnOnPump)
WaterPumpRouter.post('/manual/off', WaterPumpController.turnOffPump)
WaterPumpRouter.get('/', WaterPumpController.getLastWaterPumpValue)
export { WaterPumpRouter }
