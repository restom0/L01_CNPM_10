import { HumidityModel } from '../models/HumiditySensors.js'
import { LightModel } from '../models/LightSensors.js'
import { TemperatureModel } from '../models/TemperatureSensors.js'
import { MoistureModel } from '../models/MoistureSensors.js'
import axios from 'axios'
import { CommonUtils } from '../utils/common.js'
import { SensorModel } from '../models/Sensors.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { EnvironmentalDrynessModel } from '../models/EnvironmentalDryness.js'
import { WaterPumpService } from './WaterPumpService.js'
import mongoose from 'mongoose'

/**
 * Get all saved humidity records for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<Array<object>>} Humidity sensor records.
 */
const getAllHumidityValue = async (id) => {
  return await HumidityModel.find({ userID: id })
}

/**
 * Get all saved light records for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<Array<object>>} Light sensor records.
 */
const getAllLightValue = async (id) => {
  return await LightModel.find({ userID: id })
}

/**
 * Get all saved temperature records for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<Array<object>>} Temperature sensor records.
 */
const getAllTemperatureValue = async (id) => {
  return await TemperatureModel.find({ userID: id })
}

/**
 * Get all saved soil moisture records for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<Array<object>>} Moisture sensor records.
 */
const getAllMoistureValue = async (id) => {
  return await MoistureModel.find({ userID: id })
}

/**
 * Get all saved environmental dryness records for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<Array<object>>} Environmental dryness records.
 */
const getAllEnvironmentValue = async (id) => {
  return await EnvironmentalDrynessModel.find({ userID: id })
}

/**
 * Read latest humidity value from Adafruit IO.
 *
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{value: string, created_at: string}>} Latest humidity feed value.
 */
const getLastHumidityValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Humidity sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.humidityFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

/**
 * Read latest light value from Adafruit IO.
 *
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{value: string, created_at: string}>} Latest light feed value.
 */
const getLastLightValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.lightFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

/**
 * Read latest temperature value from Adafruit IO.
 *
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{value: string, created_at: string}>} Latest temperature feed value.
 */
const getLastTemperatureValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Temperature sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.temperatureFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

/**
 * Read latest soil moisture value from Adafruit IO.
 *
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{value: string, created_at: string}>} Latest moisture feed value.
 */
const getLastMoistureValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Moisture sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.moistureFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

/**
 * Calculate environmental dryness, save it, and auto-control pump if thresholds require.
 *
 * @param {string} key - Adafruit IO key.
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<object>} Saved environmental dryness document.
 */
const getLastEnvironmentValue = async (key, mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Environment sensor not found')
  }
  const humidity = await getLastHumidityValue(mqtt, id)
  const light = await getLastLightValue(mqtt, id)
  const temp = await getLastTemperatureValue(mqtt, id)
  const moist = await getLastMoistureValue(mqtt, id)
  const lightContribution = Number.parseFloat(light.value) / 40.0
  const environmentDryness =
    lightContribution +
    Number.parseFloat(temp.value) -
    Number.parseFloat(humidity.value) -
    Number.parseFloat(moist.value)
  const result = await EnvironmentalDrynessModel.find({ userID: id }).sort({ Date: -1 })
  const estimatedEnvironmentDryness = result[0].data * 0.125 + environmentDryness * 0.875
  const ted = await SensorModel.findOne({ userID: id })
  if (estimatedEnvironmentDryness > ted.upperEnvironmentDrynessThreshold) {
    const waterpumpStatus = await WaterPumpService.getLastWaterPumpValue(mqtt, id)

    if (waterpumpStatus.value === 'OFF') {
      await WaterPumpService.turnOnPump(key, mqtt, id)
      setTimeout(async () => {
        await WaterPumpService.turnOffPump(key, mqtt, id)
      }, 900000)
    }
  }
  if (estimatedEnvironmentDryness < ted.lowerEnvironmentDrynessThreshold) {
    const waterpumpStatus = await WaterPumpService.getLastWaterPumpValue(mqtt, id)
    if (waterpumpStatus.value === 'ON') {
      await WaterPumpService.turnOffPump(key, mqtt, id)
    }
  }
  const ed = new EnvironmentalDrynessModel({
    _id: new mongoose.Types.ObjectId(),
    userID: id,
    data: estimatedEnvironmentDryness,
    Date: humidity.created_at
  })
  await ed.save()
  return ed
}

/**
 * Get light threshold bounds for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{upper: number, lower: number}>} Light threshold bounds.
 */
const getLightThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
  return { upper: sensor.upperLightThreshold, lower: sensor.lowerLightThreshold }
}

/**
 * Update light threshold bounds and derived environmental dryness bounds.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @param {number} upper - Upper light threshold.
 * @param {number} lower - Lower light threshold.
 * @returns {Promise<void>}
 */
const updateLightThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperLightThreshold: upper, lowerLightThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
  await updateEnvironmentDrynessThreshold(id)
}

/**
 * Get temperature threshold bounds for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{upper: number, lower: number}>} Temperature threshold bounds.
 */
const getTemperatureThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Temperature sensor not found')
  }
  return { upper: sensor.upperTemperatureThreshold, lower: sensor.lowerTemperatureThreshold }
}

/**
 * Update temperature threshold bounds and derived environmental dryness bounds.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @param {number} upper - Upper temperature threshold.
 * @param {number} lower - Lower temperature threshold.
 * @returns {Promise<void>}
 */
const updateTemperatureThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperTemperatureThreshold: upper, lowerTemperatureThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Temperature sensor not found')
  }
  await updateEnvironmentDrynessThreshold(id)
}

/**
 * Get humidity threshold bounds for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{upper: number, lower: number}>} Humidity threshold bounds.
 */
const getHumidityThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Humidity sensor not found')
  }
  return { upper: sensor.upperHumidityThreshold, lower: sensor.lowerHumidityThreshold }
}

/**
 * Update humidity threshold bounds and derived environmental dryness bounds.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @param {number} upper - Upper humidity threshold.
 * @param {number} lower - Lower humidity threshold.
 * @returns {Promise<void>}
 */
const updateHumidityThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperHumidityThreshold: upper, lowerHumidityThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Humidity sensor not found')
  }
  await updateEnvironmentDrynessThreshold(id)
}

/**
 * Get soil moisture threshold bounds for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{upper: number, lower: number}>} Moisture threshold bounds.
 */
const getMoistureThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Moisture sensor not found')
  }
  return { upper: sensor.upperMoistureThreshold, lower: sensor.lowerMoistureThreshold }
}

/**
 * Update soil moisture threshold bounds and derived environmental dryness bounds.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @param {number} upper - Upper moisture threshold.
 * @param {number} lower - Lower moisture threshold.
 * @returns {Promise<void>}
 */
const updateMoistureThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperMoistureThreshold: upper, lowerMoistureThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Moisture sensor not found')
  }
  await updateEnvironmentDrynessThreshold(id)
}

/**
 * Recalculate environmental dryness thresholds from sensor thresholds.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<void>}
 */
const updateEnvironmentDrynessThreshold = async (id) => {
  const temp = await getTemperatureThreshold(id)
  const light = await getLightThreshold(id)
  const humid = await getHumidityThreshold(id)
  const moist = await getMoistureThreshold(id)
  const upper = temp.upper + light.upper / 40 - humid.lower - moist.lower
  const lower = temp.lower + light.lower / 40 - humid.upper - moist.upper
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperEnvironmentDrynessThreshold: upper, lowerEnvironmentDrynessThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Sensor not found')
  }
}

export const SensorService = {
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
