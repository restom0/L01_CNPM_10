import axios from 'axios'
import { SensorModel } from '../models/Sensors.js'
import { CommonUtils } from '../utils/common.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { WaterPumpTimerModel } from '../models/WaterPumpTimers.js'
import { Types } from 'mongoose'

/**
 * List saved automatic watering timer ranges for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<Array<{id: import('mongoose').Types.ObjectId, startTime: string, endTime: string}>>}
 * Watering timers.
 */
const automaticWatering = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Water Pump not found')
  }
  const timer = await WaterPumpTimerModel.find({ userID: id })
  const result = []
  timer.forEach((e) => {
    result.push({ id: e._id, startTime: e.startTime, endTime: e.endTime })
  })
  return result
}

/**
 * Update an existing watering timer range.
 *
 * @param {string} id - Timer id.
 * @param {string} starttime - Start time in HH:mm format.
 * @param {string} endtime - End time in HH:mm format.
 * @returns {Promise<void>}
 */
const updateTimer = async (id, starttime, endtime) => {
  const sensor = await WaterPumpTimerModel.findOne({ _id: Types.ObjectId.createFromHexString(id) })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Timer not found')
  }
  sensor.startTime = starttime
  sensor.endTime = endtime
  await sensor.save()
}

/**
 * Create a watering timer for one user.
 *
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @param {string} starttime - Start time in HH:mm format.
 * @param {string} endtime - End time in HH:mm format.
 * @returns {Promise<void>}
 */
const createTimer = async (id, starttime, endtime) => {
  const user = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(user)) {
    throw new NotFoundError('User not found')
  }
  const timer = new WaterPumpTimerModel({
    _id: new Types.ObjectId(),
    userID: id,
    startTime: starttime,
    endTime: endtime
  })
  await timer.save()
}

/**
 * Delete one watering timer.
 *
 * @param {string} id - Timer id.
 * @returns {Promise<void>}
 */
const deleteTimer = async (id) => {
  const timer = await WaterPumpTimerModel.findOne({ _id: Types.ObjectId.createFromHexString(id) })
  if (CommonUtils.checkNullOrUndefined(timer)) {
    throw new NotFoundError('Timer not found')
  }
  await WaterPumpTimerModel.deleteOne({ _id: Types.ObjectId.createFromHexString(id) })
}

/**
 * Publish an ON command to the user's Adafruit IO water pump feed.
 *
 * @param {string} key - Adafruit IO key.
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<void>}
 */
const turnOnPump = async (key, mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })

  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Water Pump not found')
  }
  await axios.post(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.waterPumpFeedName + '/data',
    {
      value: 'ON'
    },
    {
      headers: {
        'X-AIO-Key': key
      }
    }
  )
}

/**
 * Publish an OFF command to the user's Adafruit IO water pump feed.
 *
 * @param {string} key - Adafruit IO key.
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<void>}
 */
const turnOffPump = async (key, mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Water Pump sensor not found')
  }
  await axios.post(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.waterPumpFeedName + '/data',
    {
      value: 'OFF'
    },
    {
      headers: {
        'X-AIO-Key': key
      }
    }
  )
}

/**
 * Read the latest water pump state from Adafruit IO.
 *
 * @param {string} mqtt - Adafruit IO username.
 * @param {import('mongoose').Types.ObjectId} id - Authenticated user id.
 * @returns {Promise<{value: string, created_at: string}>} Latest pump feed value.
 */
const getLastWaterPumpValue = async (mqtt, id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Light sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.waterPumpFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}
export const WaterPumpService = {
  automaticWatering,
  turnOnPump,
  turnOffPump,
  getLastWaterPumpValue,
  updateTimer,
  createTimer,
  deleteTimer
}
