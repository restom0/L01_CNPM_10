import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const WaterPump = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  data: { type: String, required: true },
  Date: { type: Date, required: true }
})
const WaterPumpModel = mongoose.model('WaterPumps', WaterPump)

export { WaterPumpModel }
