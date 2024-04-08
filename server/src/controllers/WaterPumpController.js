import { WaterPumpService } from '../services/WaterPumpService.js'

const automaticWatering = async (req, res, next) => {}
const turnOnPump = async (req, res, next) => {
  try {
    await WaterPumpService.turnOnPump(req.user.key, req.user.mqtt, req.user.id)
    res.status(200).json({ data: 'Pump is turned on' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
const turnOffPump = async (req, res, next) => {
  try {
    await WaterPumpService.turnOffPump(req.user.key, req.user.mqtt, req.user.id)
    res.status(200).json({ data: 'Pump is turned off' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
const getLastWaterPumpValue = async (req, res, next) => {
  try {
    const result = await WaterPumpService.getLastWaterPumpValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    res.status(error.respose.status).json({ error: error.message })
  }
}
export const WaterPumpController = { automaticWatering, turnOnPump, turnOffPump, getLastWaterPumpValue }
