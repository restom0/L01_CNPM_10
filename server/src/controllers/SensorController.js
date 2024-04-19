import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { SensorService } from '../services/SensorService.js'
import { CommonUtils } from '../utils/common.js'

const getAllHumidityValue = async (req, res, next) => {
  try {
    const result = await SensorService.getAllHumidityValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAllLightValue = async (req, res, next) => {
  try {
    const result = await SensorService.getAllLightValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAllTemperatureValue = async (req, res, next) => {
  try {
    const result = await SensorService.getAllTemperatureValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAllMoistureValue = async (req, res, next) => {
  try {
    const result = await SensorService.getAllMoistureValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getLastHumidityValue = async (req, res, next) => {
  try {
    const result = await SensorService.getLastHumidityValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      needNoti: CommonUtils.compareThreshold(result.value, res.threshold.upper, res.threshold.lower),
      upper: res.threshold.upper,
      lower: res.threshold.lower,
      data: result
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getLastLightValue = async (req, res, next) => {
  try {
    const result = await SensorService.getLastLightValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      needNoti: CommonUtils.compareThreshold(result.value, res.threshold.upper, res.threshold.lower),
      upper: res.threshold.upper,
      lower: res.threshold.lower,
      data: result
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getLastTemperatureValue = async (req, res, next) => {
  try {
    const result = await SensorService.getLastTemperatureValue(req.user.mqtt, req.user.id)
    if (CommonUtils.checkNullOrUndefined(result)) {
      throw new NotFoundError('Temperature value not found')
    }
    res.status(200).json({
      needNoti: CommonUtils.compareThreshold(result.value, res.threshold.upper, res.threshold.lower),
      upper: res.threshold.upper,
      lower: res.threshold.lower,
      data: result
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getLastMoistureValue = async (req, res, next) => {
  try {
    const result = await SensorService.getLastMoistureValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      needNoti: CommonUtils.compareThreshold(result.value, res.threshold.upper, res.threshold.lower),
      upper: res.threshold.upper,
      lower: res.threshold.lower,
      data: result
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getLightThreshold = async (req, res, next) => {
  try {
    const result = await SensorService.getLightThreshold(req.user.id)
    res.threshold = { upper: result.upper, lower: result.lower }
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateLightThreshold = async (req, res, next) => {
  try {
    let { upper, lower } = req.query
    if (CommonUtils.checkNullOrUndefined(upper)) {
      throw new BadRequestError('Upper threshold is empty')
    }
    if (CommonUtils.checkNullOrUndefined(lower)) {
      throw new BadRequestError('Lower threshold is empty')
    }
    upper = Number(upper)
    lower = Number(lower)
    if (upper < lower) {
      throw new BadRequestError('Invalid Threshold')
    }
    await SensorService.updateLightThreshold(req.user.id, upper, lower)
    res.status(200).json({ message: 'Threshold updated' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

const getTemperatureThreshold = async (req, res, next) => {
  try {
    const result = await SensorService.getTemperatureThreshold(req.user.id)
    res.threshold = { upper: result.upper, lower: result.lower }
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateTemperatureThreshold = async (req, res, next) => {
  try {
    let { upper, lower } = req.query
    if (CommonUtils.checkNullOrUndefined(upper)) {
      throw new BadRequestError('Upper threshold is empty')
    }
    if (CommonUtils.checkNullOrUndefined(lower)) {
      throw new BadRequestError('Lower threshold is empty')
    }
    upper = Number(upper)
    lower = Number(lower)
    if (upper < lower) {
      throw new BadRequestError('Invalid Threshold')
    }
    await SensorService.updateTemperatureThreshold(req.user.id, upper, lower)
    res.status(200).json({ message: 'Threshold updated' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

const getHumidityThreshold = async (req, res, next) => {
  try {
    const result = await SensorService.getHumidityThreshold(req.user.id)
    res.threshold = { upper: result.upper, lower: result.lower }
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateHumidityThreshold = async (req, res, next) => {
  try {
    let { upper, lower } = req.query
    if (CommonUtils.checkNullOrUndefined(upper)) {
      throw new BadRequestError('Upper threshold is empty')
    }
    if (CommonUtils.checkNullOrUndefined(lower)) {
      throw new BadRequestError('Lower threshold is empty')
    }
    upper = Number(upper)
    lower = Number(lower)
    if (upper < lower) {
      throw new BadRequestError('Invalid Threshold')
    }
    await SensorService.updateHumidityThreshold(req.user.id, upper, lower)
    res.status(200).json({ message: 'Threshold updated' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

const getMoistureThreshold = async (req, res, next) => {
  try {
    const result = await SensorService.getMoistureThreshold(req.user.id)
    res.threshold = { upper: result.upper, lower: result.lower }
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateMoistureThreshold = async (req, res, next) => {
  try {
    let { upper, lower } = req.query
    if (CommonUtils.checkNullOrUndefined(upper)) {
      throw new BadRequestError('Upper threshold is empty')
    }
    if (CommonUtils.checkNullOrUndefined(lower)) {
      throw new BadRequestError('Lower threshold is empty')
    }
    upper = Number(upper)
    lower = Number(lower)
    if (upper < lower) {
      throw new BadRequestError('Invalid Threshold')
    }
    await SensorService.updateMoistureThreshold(req.user.id, upper, lower)
    res.status(200).json({ message: 'Threshold updated' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

export const SensorController = {
  getAllHumidityValue,
  getAllLightValue,
  getAllMoistureValue,
  getAllTemperatureValue,
  getLastHumidityValue,
  getLastLightValue,
  getLastMoistureValue,
  getLastTemperatureValue,
  getTemperatureThreshold,
  updateTemperatureThreshold,
  getLightThreshold,
  updateLightThreshold,
  getHumidityThreshold,
  updateHumidityThreshold,
  getMoistureThreshold,
  updateMoistureThreshold
}
