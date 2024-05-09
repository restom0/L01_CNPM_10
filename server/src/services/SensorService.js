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
const getAllHumidityValue = async (id) => {
  return await HumidityModel.find({ userID: id })
}

const getAllLightValue = async (id) => {
  return await LightModel.find({ userID: id })
}

const getAllTemperatureValue = async (id) => {
  return await TemperatureModel.find({ userID: id })
}

const getAllMoistureValue = async (id) => {
  return await MoistureModel.find({ userID: id })
}
const getAllEnvironmentValue = async (id) => {
  return await EnvironmentalDrynessModel.find({ userID: id })
}

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

const getLastEnvironmentValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Environment sensor not found')
  }
  const humidity = await getLastHumidityValue(mqtt, id)
  const light = await getLastLightValue(mqtt, id)
  const temp = await getLastTemperatureValue(mqtt, id)
  const moist = await getLastMoistureValue(mqtt, id)
  const ED = humidity.value + light.value - temp.value - moist.value
  const result = await EnvironmentalDrynessModel.find({ userID: id }).sort({ Date: -1 })
  const estimatedED = result[0].data * 0.875 + ED * 0.125
  const ted = await SensorModel.findOne({ userID: id })
  if (estimatedED > ted.upperEnvironmentalDrynessThreshold) {
    const waterpumpStatus = await WaterPumpService.getLastWaterPumpValue(mqtt, id)
    if (waterpumpStatus.value === 'OFF') {
      await WaterPumpService.turnOnWaterPump(mqtt, id)
      setTimeout(async () => {
        await WaterPumpService.turnOffWaterPump(mqtt, id)
      }, 900000)
    }
  }
  if (estimatedED < ted.lowerEnvironmentalDrynessThreshold) {
    const waterpumpStatus = await WaterPumpService.getLastWaterPumpValue(mqtt, id)
    if (waterpumpStatus.value === 'ON') {
      await WaterPumpService.turnOffWaterPump(mqtt, id)
    }
  }
  const ed = new EnvironmentalDrynessModel({
    _id: new mongoose.Types.ObjectId(),
    userID: id,
    data: humidity.value + light.value - temp.value - moist.value,
    Date: humidity.created_at
  })
  await ed.save()
  return ed
}
const getLightThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
  return { upper: sensor.upperLightThreshold, lower: sensor.lowerLightThreshold }
}

const updateLightThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperLightThreshold: upper, lowerLightThreshold: lower }
  )
  await updateEnvironmentDrynessThreshold(id)
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
}

const getTemperatureThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Temperature sensor not found')
  }
  return { upper: sensor.upperTemperatureThreshold, lower: sensor.lowerTemperatureThreshold }
}

const updateTemperatureThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperTemperatureThreshold: upper, lowerTemperatureThreshold: lower }
  )
  await updateEnvironmentDrynessThreshold(id)
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
}

const getHumidityThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Humidity sensor not found')
  }
  return { upper: sensor.upperHumidityThreshold, lower: sensor.lowerHumidityThreshold }
}

const updateHumidityThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperHumidityThreshold: upper, lowerHumidityThreshold: lower }
  )
  await updateEnvironmentDrynessThreshold(id)
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
}

const getMoistureThreshold = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Moisture sensor not found')
  }
  return { upper: sensor.upperMoistureThreshold, lower: sensor.lowerMoistureThreshold }
}

const updateMoistureThreshold = async (id, upper, lower) => {
  const sensor = await SensorModel.findOneAndUpdate(
    { userID: id },
    { upperMoistureThreshold: upper, lowerMoistureThreshold: lower }
  )
  await updateEnvironmentDrynessThreshold(id)
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
}
const updateEnvironmentDrynessThreshold = async (id) => {
  const temp = await getTemperatureThreshold(id)
  const light = await getLightThreshold(id)
  const humid = await getHumidityThreshold(id)
  const moist = await getMoistureThreshold(id)
  const upper = temp.upper + light.upper - humid.lower - moist.lower
  const lower = temp.lower + light.lower - humid.upper - moist.upper
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
