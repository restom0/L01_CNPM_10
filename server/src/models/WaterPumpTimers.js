import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const WaterPumpTimer = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
})
const WaterPumpTimerModel = mongoose.model('WaterPumpTimers', WaterPumpTimer)

export { WaterPumpTimerModel }
