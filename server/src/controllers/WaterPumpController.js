import { BadRequestError } from '../errors/badRequest.error.js'
import { WaterPumpService } from '../services/WaterPumpService.js'
import { CommonUtils } from '../utils/common.js'

const parseTimerRange = (startTime, endTime) => {
  const [startHourText, startMinuteText] = startTime.split(':')
  const [endHourText, endMinuteText] = endTime.split(':')

  if ([startHourText, startMinuteText, endHourText, endMinuteText].some(CommonUtils.checkNullOrUndefined)) {
    throw new BadRequestError('Time is invalid')
  }

  const startHour = Number.parseInt(startHourText, 10)
  const startMinute = Number.parseInt(startMinuteText, 10)
  const endHour = Number.parseInt(endHourText, 10)
  const endMinute = Number.parseInt(endMinuteText, 10)

  if ([startHour, startMinute, endHour, endMinute].some(Number.isNaN)) {
    throw new BadRequestError('Time is invalid')
  }

  if (startHour >= 24 || startMinute >= 60 || endHour >= 24 || endMinute >= 60) {
    throw new BadRequestError('Time is invalid')
  }

  if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
    throw new BadRequestError('Start time must be smaller than end time')
  }

  return {
    startTime: `${startHourText}:${startMinuteText}`,
    endTime: `${endHourText}:${endMinuteText}`
  }
}

const automaticWatering = async (req, res) => {
  try {
    const result = await WaterPumpService.automaticWatering(req.user.id)
    res.status(200).json({
      data: result
    })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const updateTimer = async (req, res) => {
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
    ;({ startTime, endTime } = parseTimerRange(startTime, endTime))
    await WaterPumpService.updateTimer(id, startTime, endTime)
    res.status(200).json({ data: 'Timer is updated' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const createTimer = async (req, res) => {
  try {
    let { startTime, endTime } = req.body
    if (CommonUtils.checkNullOrUndefined(startTime)) {
      throw new BadRequestError('Start time is required')
    }
    if (CommonUtils.checkNullOrUndefined(endTime)) {
      throw new BadRequestError('End time is required')
    }
    ;({ startTime, endTime } = parseTimerRange(startTime, endTime))
    await WaterPumpService.createTimer(req.user.id, startTime, endTime)
    res.status(200).json({ data: 'Timer is created' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const deleteTimer = async (req, res) => {
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
const turnOnPump = async (req, res) => {
  try {
    await WaterPumpService.turnOnPump(req.user.key, req.user.mqtt, req.user.id)
    res.status(200).json({ data: 'Pump is turned on' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const turnOffPump = async (req, res) => {
  try {
    await WaterPumpService.turnOffPump(req.user.key, req.user.mqtt, req.user.id)
    res.status(200).json({ data: 'Pump is turned off' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}
const getLastWaterPumpValue = async (req, res) => {
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
