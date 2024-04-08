import axios from 'axios'
import { SensorModel } from '../models/Sensors.js'
import { CommonUtils } from '../utils/common.js'
import { NotFoundError } from '../errors/notFound.error.js'

const automaticWatering = async (id, starttime, endtime) => {}
const turnOnPump = async (key, mqtt, id) => {
  const sensor = await SensorModel.findOne({ userId: id })
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
  const sensor = await SensorModel.findOne({ userId: id })
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
  const sensor = await SensorModel.findOne({ userId: id })
  if (CommonUtils.checkNullOrUndefined(sensor)) {
    throw new Error('Light sensor not found')
  }
  const result = await axios.get(
    'https://io.adafruit.com/api/v2/' + mqtt + '/feeds/' + sensor.waterPumpFeedName + '/data?limit=1'
  )
  return { value: result.data[0].value, created_at: result.data[0].created_at }
}
export const WaterPumpService = { automaticWatering, turnOnPump, turnOffPump, getLastWaterPumpValue }
