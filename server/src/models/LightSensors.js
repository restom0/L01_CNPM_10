import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const LightSensor = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  data: { type: Number, required: true },
  Date: { type: Date, required: true }
})
const LightModel = mongoose.model('LightSensors', LightSensor)

export { LightModel }
