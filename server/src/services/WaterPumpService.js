import axios from 'axios'
import { SensorModel } from '../models/Sensors.js'
import { CommonUtils } from '../utils/common.js'
import { NotFoundError } from '../errors/notFound.error.js'
import { WaterPumpTimerModel } from '../models/WaterPumpTimers.js'
import { Types } from 'mongoose'

const automaticWatering = async (id) => {
  const sensor = await SensorModel.findOne({ userID: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Water Pump not found')
  }
  const timer = await WaterPumpTimerModel.find({ userID: id })
  let result = []
  timer.forEach((e) => {
    result.push({ id: e._id, startTime: e.startTime, endTime: e.endTime })
  })
  return result
}
const updateTimer = async (id, starttime, endtime) => {
  const sensor = await WaterPumpTimerModel.findOne({ _id: Types.ObjectId.createFromHexString(id) })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new NotFoundError('Timer not found')
  }
  sensor.startTime = starttime
  sensor.endTime = endtime
  await sensor.save()
}
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
const deleteTimer = async (id) => {
  const timer = await WaterPumpTimerModel.findOne({ _id: Types.ObjectId.createFromHexString(id) })
  if (CommonUtils.checkNullOrUndefined(timer)) {
    throw new NotFoundError('Timer not found')
  }
  await WaterPumpTimerModel.deleteOne({ _id: Types.ObjectId.createFromHexString(id) })
}
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
