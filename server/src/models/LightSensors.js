import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const LightSensor = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'Users', required: true },
  data: { type: Number, required: true },
  date: { type: Date, required: true }
})
const LightModel = mongoose.model('LightSensors', LightSensor)

export { LightModel }
