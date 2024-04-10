import { HumidityModel } from '../models/HumiditySensors.js'
import { LightModel } from '../models/LightSensors.js'
import { TemperatureModel } from '../models/TemperatureSensors.js'
import axios from 'axios'
import { CommonUtils } from '../utils/common.js'
import { SensorModel } from '../models/Sensors.js'
const getAllHumidityValue = async (id) => {
  return await HumidityModel.find({ userId: id })
}

const getAllLightValue = async (id) => {
  return await LightModel.find({ userId: id })
}

const getAllTemperatureValue = async (id) => {
  return await TemperatureModel.find({ userId: id })
}

const getAllMoistureValue = async (id) => {
  return await TemperatureModel.find({ userId: id })
}

const getLastHumidityValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Humidity sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.humidityFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

const getLastLightValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Light sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.lightFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

const getLastTemperatureValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Temperature sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.temperatureFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

const getLastMoistureValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Moisture sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.moistureFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}

const getLightThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Light sensor not found')
  }
  return { upper: sensor.upperLightThreshold, lower: sensor.lowerLightThreshold }
}

const updateLightThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userId: id },
    { upperLightThreshold: upper, lowerLightThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Light sensor not found')
  }
}

const getTemperatureThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Temperature sensor not found')
  }
  return { upper: sensor.upperTemperatureThreshold, lower: sensor.lowerTemperatureThreshold }
}

const updateTemperatureThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userId: id },
    { upperTemperatureThreshold: upper, lowerTemperatureThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Light sensor not found')
  }
}

const getHumidityThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Humidity sensor not found')
  }
  return { upper: sensor.upperHumidityThreshold, lower: sensor.lowerHumidityThreshold }
}

const updateHumidityThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userId: id },
    { upperHumidityThreshold: upper, lowerHumidityThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Light sensor not found')
  }
}

const getMoistureThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Moisture sensor not found')
  }
  return { upper: sensor.upperMoistureThreshold, lower: sensor.lowerMoistureThreshold }
}

const updateMoistureThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userId: id },
    { upperMoistureThreshold: upper, lowerMoistureThreshold: lower }
  )
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Light sensor not found')
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
  updateMoistureThreshold
}