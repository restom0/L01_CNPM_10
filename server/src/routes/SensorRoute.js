import express from 'express'
import { SensorController } from '../controllers/SensorController.js'
const SensorRouter = express.Router()

SensorRouter.get('/humid', SensorController.getHumidityThreshold, SensorController.getLastHumidityValue)
SensorRouter.get('/light', SensorController.getLightThreshold, SensorController.getLastLightValue)
SensorRouter.get('/temp', SensorController.getTemperatureThreshold, SensorController.getLastTemperatureValue)
SensorRouter.get('/moisture', SensorController.getLastMoistureValue, SensorController.getLastMoistureValue)

SensorRouter.get('/chart/humid', SensorController.getAllHumidityValue)
SensorRouter.get('/chart/light', SensorController.getAllLightValue)
SensorRouter.get('/chart/temp', SensorController.getAllTemperatureValue)
SensorRouter.get('/chart/moisture', SensorController.getAllMoistureValue)
export { SensorRouter }
SensorRouter.put('/threshold/humid', SensorController.updateHumidityThreshold)
SensorRouter.put('/threshold/light', SensorController.updateLightThreshold)
SensorRouter.put('/threshold/temp', SensorController.updateTemperatureThreshold)
SensorRouter.put('/threshold/moisture', SensorController.updateMoistureThreshold)
