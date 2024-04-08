import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const HumiditySensor = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'Users', required: true },
  data: { type: Number, required: true },
  date: { type: Date, required: true }
})
const HumidityModel = mongoose.model('HumiditySensors', HumiditySensor)

export { HumidityModel }
