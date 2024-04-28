import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const TemperatureSensor = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  data: { type: Number, required: true },
  Date: { type: Date, required: true }
})
const TemperatureModel = mongoose.model('TemperatureSensors', TemperatureSensor)

export { TemperatureModel }
