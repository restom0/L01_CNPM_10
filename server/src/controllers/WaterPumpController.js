import { BadRequestError } from '../errors/badRequest.error.js'
import { WaterPumpService } from '../services/WaterPumpService.js'
import { CommonUtils } from '../utils/common.js'

const automaticWatering = async (req, res, next) => {
  try {
    const result = await WaterPumpService.automaticWatering(req.user.id)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const updateTimer = async (req, res, next) => {
  try {
    const { id } = req.params
    let { startTime, endTime } = req.body
    if (CommonUtils.checkNullOrUndefined(id)) {
      throw new BadRequestError('WaterPump is required')
    }
    if (CommonUtils.checkNullOrUndefined(startTime)) {
      throw new BadRequestError('Start time is required')
    }
    if (CommonUtils.checkNullOrUndefined(endTime)) {
      throw new BadRequestError('End time is required')
    }
    startTime = startTime.split(':')
    endTime = endTime.split(':')
    if (
      parseInt(startTime[0]) >= 24 ||
      parseInt(startTime[1]) >= 60 ||
      parseInt(endTime[0]) >= 24 ||
      parseInt(endTime[1]) >= 60
    ) {
      throw new BadRequestError('Time is invalid')
    }
    if (startTime.length !== 2 || endTime.length !== 2) {
      throw new BadRequestError('Time is invalid')
    }
    if (
      parseInt(startTime[0]) > parseInt(endTime[0]) ||
      (parseInt(startTime[0]) === parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1]))
    ) {
      throw new BadRequestError('Start time must be smaller than end time')
    }
    startTime = startTime[0] + ':' + startTime[1]
    endTime = endTime[0] + ':' + endTime[1]
    await WaterPumpService.updateTimer(id, startTime, endTime)
    res.status(200).json({ data: 'Timer is updated' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const createTimer = async (req, res, next) => {
  try {
    let { startTime, endTime } = req.body
    if (CommonUtils.checkNullOrUndefined(startTime)) {
      throw new BadRequestError('Start time is required')
    }
    if (CommonUtils.checkNullOrUndefined(endTime)) {
      throw new BadRequestError('End time is required')
    }
    startTime = startTime.split(':')
    endTime = endTime.split(':')
    if (
      parseInt(startTime[0]) >= 24 ||
      parseInt(startTime[1]) >= 60 ||
      parseInt(endTime[0]) >= 24 ||
      parseInt(endTime[1]) >= 60
    ) {
      throw new BadRequestError('Time is invalid')
    }
    if (startTime.length !== 2 || endTime.length !== 2) {
      throw new BadRequestError('Time is invalid')
    }
    if (
      parseInt(startTime[0]) > parseInt(endTime[0]) ||
      (parseInt(startTime[0]) === parseInt(endTime[0]) && parseInt(startTime[1]) >= parseInt(endTime[1]))
    ) {
      throw new BadRequestError('Start time must be smaller than end time')
    }
    startTime = startTime[0] + ':' + startTime[1]
    endTime = endTime[0] + ':' + endTime[1]
    await WaterPumpService.createTimer(req.user.id, startTime, endTime)
    res.status(200).json({ data: 'Timer is created' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const deleteTimer = async (req, res, next) => {
  try {
    const { id } = req.params
    if (CommonUtils.checkNullOrUndefined(id)) {
      throw new BadRequestError('WaterPump is required')
    }
    await WaterPumpService.deleteTimer(id)
    res.status(200).json({ data: 'Timer is deleted' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const turnOnPump = async (req, res, next) => {
  try {
    await WaterPumpService.turnOnPump(req.user.key, req.user.mqtt, req.user.id)
    res.status(200).json({ data: 'Pump is turned on' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const turnOffPump = async (req, res, next) => {
  try {
    await WaterPumpService.turnOffPump(req.user.key, req.user.mqtt, req.user.id)
    res.status(200).json({ data: 'Pump is turned off' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const getLastWaterPumpValue = async (req, res, next) => {
  try {
    const result = await WaterPumpService.getLastWaterPumpValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
export const WaterPumpController = {
  automaticWatering,
  turnOnPump,
  turnOffPump,
  getLastWaterPumpValue,
  updateTimer,
  createTimer,
  deleteTimer
}
