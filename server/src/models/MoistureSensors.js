import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const MoistureSensor = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  data: { type: Number, required: true },
  Date: { type: Date, required: true }
})
const MoistureModel = mongoose.model('MoistureSensors', MoistureSensor)

export { MoistureModel }
