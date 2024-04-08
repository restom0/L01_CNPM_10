import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId
const Sensor = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'Users', required: true },
  upperLightThreshold: Number,
  lowerLightThreshold: Number,
  upperHumidityThreshold: Number,
  lowerHumidityThreshold: Number,
  upperMoistureThreshold: Number,
  lowerMoistureThreshold: Number,
  upperTemperatureThreshold: Number,
  lowerTemperatureThreshold: Number,
  lightFeedName: { type: String, required: true },
  humidityFeedName: { type: String, required: true },
  moistureFeedName: { type: String, required: true },
  temperatureFeedName: { type: String, required: true },
  waterPumpFeedName: { type: String, required: true }
})
const SensorModel = mongoose.model('Sensors', Sensor)

export { SensorModel }
