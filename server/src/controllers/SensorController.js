import { BadRequestError } from '../errors/badRequest.error.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { SensorService } from '../services/SensorService.js'
import { CommonUtils } from '../utils/common.js'

const parseThresholdQuery = (query) => {
  let { upper, lower } = query
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
  return { upper, lower }
}

const loadThreshold = async (req, res, next, serviceMethod) => {
  try {
    const result = await SensorService[serviceMethod](req.user.id)
    res.threshold = { upper: result.upper, lower: result.lower }
    next()
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

const updateThreshold = async (req, res, serviceMethod) => {
  try {
    const { upper, lower } = parseThresholdQuery(req.query)
    await SensorService[serviceMethod](req.user.id, upper, lower)
    res.status(200).json({ message: 'Threshold updated' })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/chart/humid and return humidity history.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const getAllHumidityValue = async (req, res) => {
  try {
    const result = await SensorService.getAllHumidityValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/chart/light and return light history.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const getAllLightValue = async (req, res) => {
  try {
    const result = await SensorService.getAllLightValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/chart/temp and return temperature history.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const getAllTemperatureValue = async (req, res) => {
  try {
    const result = await SensorService.getAllTemperatureValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/chart/moisture and return moisture history.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const getAllMoistureValue = async (req, res) => {
  try {
    const result = await SensorService.getAllMoistureValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/chart/ed and return environmental dryness history.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const getAllEnvironmentValue = async (req, res) => {
  try {
    const result = await SensorService.getAllEnvironmentValue(req.user.id)
    res.status(200).json({ data: result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/humid and return latest humidity with threshold status.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response with threshold data.
 * @returns {Promise<void>}
 */
const getLastHumidityValue = async (req, res) => {
  try {
    const result = await SensorService.getLastHumidityValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      needNoti: CommonUtils.compareThreshold(result.value, res.threshold.upper, res.threshold.lower),
      upper: res.threshold.upper,
      lower: res.threshold.lower,
      data: result
    })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/light and return latest light with threshold status.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response with threshold data.
 * @returns {Promise<void>}
 */
const getLastLightValue = async (req, res) => {
  try {
    const result = await SensorService.getLastLightValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      needNoti: CommonUtils.compareThreshold(result.value, res.threshold.upper, res.threshold.lower),
      upper: res.threshold.upper,
      lower: res.threshold.lower,
      data: result
    })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/temp and return latest temperature with threshold status.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response with threshold data.
 * @returns {Promise<void>}
 */
const getLastTemperatureValue = async (req, res) => {
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
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/moisture and return latest moisture with threshold status.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response with threshold data.
 * @returns {Promise<void>}
 */
const getLastMoistureValue = async (req, res) => {
  try {
    const result = await SensorService.getLastMoistureValue(req.user.mqtt, req.user.id)
    res.status(200).json({
      needNoti: CommonUtils.compareThreshold(result.value, res.threshold.upper, res.threshold.lower),
      upper: res.threshold.upper,
      lower: res.threshold.lower,
      data: result
    })
  } catch (error) {
    res.status(error.statusCode).json({ error: error.message })
  }
}

/**
 * Handle GET /sensors/ed and save latest environmental dryness value.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const getLastEnvironmentValue = async (req, res) => {
  try {
    const result = await SensorService.getLastEnvironmentValue(req.user.key, req.user.mqtt, req.user.id)
    if (result) {
      res.status(200).json({ data: result })
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
}

/**
 * Load light thresholds before returning latest light value.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response used to store thresholds.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getLightThreshold = async (req, res, next) => {
  await loadThreshold(req, res, next, 'getLightThreshold')
}

/**
 * Handle PUT /sensors/threshold/light and update light thresholds.
 *
 * @param {import('express').Request} req - Request with upper and lower query values.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const updateLightThreshold = async (req, res) => {
  await updateThreshold(req, res, 'updateLightThreshold')
}

/**
 * Load temperature thresholds before returning latest temperature value.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response used to store thresholds.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getTemperatureThreshold = async (req, res, next) => {
  await loadThreshold(req, res, next, 'getTemperatureThreshold')
}

/**
 * Handle PUT /sensors/threshold/temp and update temperature thresholds.
 *
 * @param {import('express').Request} req - Request with upper and lower query values.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const updateTemperatureThreshold = async (req, res) => {
  await updateThreshold(req, res, 'updateTemperatureThreshold')
}

/**
 * Load humidity thresholds before returning latest humidity value.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response used to store thresholds.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getHumidityThreshold = async (req, res, next) => {
  await loadThreshold(req, res, next, 'getHumidityThreshold')
}

/**
 * Handle PUT /sensors/threshold/humid and update humidity thresholds.
 *
 * @param {import('express').Request} req - Request with upper and lower query values.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const updateHumidityThreshold = async (req, res) => {
  await updateThreshold(req, res, 'updateHumidityThreshold')
}

/**
 * Load moisture thresholds before returning latest moisture value.
 *
 * @param {import('express').Request} req - Request with authenticated user.
 * @param {import('express').Response} res - Response used to store thresholds.
 * @param {import('express').NextFunction} next - Next middleware.
 * @returns {Promise<void>}
 */
const getMoistureThreshold = async (req, res, next) => {
  await loadThreshold(req, res, next, 'getMoistureThreshold')
}

/**
 * Handle PUT /sensors/threshold/moisture and update moisture thresholds.
 *
 * @param {import('express').Request} req - Request with upper and lower query values.
 * @param {import('express').Response} res - Express response.
 * @returns {Promise<void>}
 */
const updateMoistureThreshold = async (req, res) => {
  await updateThreshold(req, res, 'updateMoistureThreshold')
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
  updateMoistureThreshold,
  getLastEnvironmentValue,
  getAllEnvironmentValue
}
