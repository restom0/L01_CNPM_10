import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const WaterPump = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'Users', required: true },
  data: { type: String, required: true },
  date: { type: Date, required: true },
  mode: { type: Date, required: true },
  starttime: Date,
  endtime: Date
})
const WaterPumpModel = mongoose.model('WaterPumps', WaterPump)

export { WaterPumpModel }
