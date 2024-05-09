import mongoose, { Schema } from 'mongoose'
const ObjectId = Schema.ObjectId

const EnvironmentalDryness = new Schema({
  _id: ObjectId,
  userID: { type: ObjectId, ref: 'Users', required: true },
  data: { type: Number, required: true },
  Date: { type: Date, required: true }
})
const EnvironmentalDrynessModel = mongoose.model('EnvironmentalDryness', EnvironmentalDryness)

export { EnvironmentalDrynessModel }
